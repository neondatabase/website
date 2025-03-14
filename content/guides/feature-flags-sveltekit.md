---
title: Add feature flags in SvelteKit apps with Neon Postgres
subtitle: A step-by-step guide to integrating feature flags in SvelteKit apps with Postgres
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-05-24T13:24:36.612Z'
updatedOn: '2024-05-24T13:24:36.612Z'
---

This guide covers the step-by-step process of integrating feature flags in SvelteKit apps with Postgres (powered by Neon). Feature flags provide a way to control the behavior of your application without deploying new code, allowing you to test and roll out new features dynamically. Upon completing the guide, you will understand how to manage and roll out new features using dynamic feature flag integration.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en/blog/announcements/v18-release-announce) or later
- A [Neon](https://console.neon.tech/signup) account – The feature flags will be defined (or mutated) in a Postgres database

## Steps

- [Provisioning a Postgres database powered by Neon](#provisioning-a-postgres-database-powered-by-neon)
- [Creating a new SvelteKit application](#creating-a-new-sveltekit-application)
- [(Optional) Adding Tailwind CSS to the application](#optional-adding-tailwind-css-to-the-application)
- [Managing Feature Flags in Serverless Postgres](#managing-feature-flags-in-serverless-postgres)
- [Dynamic Feature Flag Integration for Testing Fast Payment Methods](#dynamic-feature-flag-integration-for-testing-fast-payment-methods)

## Provisioning a Postgres database powered by Neon

Using Serverless Postgres database powered by Neon helps you scale down to zero. With Neon, you only have to pay for what you use.

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and enter the name of your choice as the project name.

You will then be presented with a dialog that provides a connecting string of your database. Enable the **Connection pooling** toggle for a pooled connection string.

![](/guides/images/feature-flags-sveltekit/index.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is the host with neon.tech as the [TLD](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `port` is the Neon port number. The default port number is 5432.
- `dbname` is the name of the database. “neondb” is the default database created with each Neon project.
- `?sslmode=require` an optional query parameter that enforces the [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode while connecting to the Postgres instance for better security.

Save this connecting string somewhere safe to be used as the `DATABASE_URL` further in the guide. Proceed further in this guide to create a SvelteKit application.

## Creating a new SvelteKit application

To start building the application, create a new SvelteKit project. Open your terminal and run the following command:

```bash
npm create svelte@latest my-app
```

When prompted, choose:

- `Skeleton project` for **Which Svelte app template?**
- `Yes, using Typescript syntax` for **Add type checking with Typescript?**

Press **Enter** to proceed. Now, follow the instructions to install the dependencies and start the development server:

```bash
npm run dev
```

The app now should be running on [localhost:5173](http://localhost:5173).

> Note: According to an [advanced SvelteKit guide](https://kit.svelte.dev/docs/server-only-modules), using `.server` in the filename allows you to mark the code to be executed on server only.

Next, run the commands below to install the necessary libraries and packages for building the application:

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```bash
npm install @neondatabase/serverless
npm install -D dotenv tsx
```

```bash
npm install pg
npm install -D dotenv tsx @types/pg
```

</CodeTabs>

The commands install the required libraries and packages, with the `-D` flag specifying the libraries intended for development purposes only.

The libraries installed include:

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```markdown
- `@neondatabase/serverless`: Neon's serverless Postgres driver for JavaScript and TypeScript.
```

```markdown
- `pg`: A Postgres client for Node.js.
```

</CodeTabs>

The development-specific libraries include:

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```markdown
- `tsx`: A library for executing and rebuilding TypeScript efficiently.
- `dotenv`: A library for handling environment variables.
```

```markdown
- `@types/pg`: Type definitions for pg.
- `tsx`: A library for executing and rebuilding TypeScript efficiently.
- `dotenv`: A library for handling environment variables.
```

</CodeTabs>

## (Optional) Adding Tailwind CSS to the application

For styling the app, we will use Tailwind CSS. Install and set up Tailwind at the root of our project's directory by running:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Create an `app.css` file in the `src` directory, and add the snippet below:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Next, add the paths to all of your template files in your `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [], // [!code --]
  content: ['./src/**/*.{html,js,svelte,ts}'], // [!code ++]
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Finally, add an import to `app.css` in your `+page.svelte` file:

```svelte
<script lang="ts"> // [!code ++]
  import '../app.css' // [!code ++]
</script> // [!code ++]

<!-- +page.svelte's HTML -->
```

## Managing Feature Flags in Serverless Postgres

Feature flags offer a powerful way to control the behavior of your application without deploying new code. In a Serverless Postgres environment, you can easily create, read, and update feature flags using the following steps:

### Create a serverless Postgres client

To create a client that interacts with your serverless postgres, create a `postgres.server.ts` file inside the `src/lib` directory with the following content:

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```tsx
// File: src/lib/postgres.server.ts

// Load Environment Variables
import 'dotenv/config';

// Load the postgres module
import { neon } from '@neondatabase/serverless';

// Create a connection string to the Neon Postgres instance
const connectionString: string = process.env.DATABASE_URL as string;

// Create a in-memory query function
export default neon(connectionString);
```

```tsx
// File: src/lib/postgres.server.ts

// Load Environment Variables
import 'dotenv/config';

// Load the postgres module
import pg from 'pg';

// Create a connection string to the Neon Postgres instance
const connectionString: string = process.env.DATABASE_URL as string;

// Create a in-memory pool so that it's cached for multiple calls
export default new pg.Pool({ connectionString });
```

</CodeTabs>

The code above starts with importing the Postgres client. It further imports the config module by `dotenv` that makes sure that all environment variables are populated in application environment. It then creates a new instance of a Postgres connection pool.

To create, read or update the feature flags from your SvelteKit application, you can use re-usable helper functions. Let's create a new directory by executing the following command in your terminal window to start creating those functions:

```bash
mkdir src/lib/feature_flags
```

### Create & Populate Feature Flags Database

In the `feature_flags` directory, create a file named `setup.server.ts` with the following code which will allow you to create and populate a database table for feature flags.

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```tsx
// File: src/lib/feature_flags/setup.server.ts

import sql from '../postgres.server';

async function populateFeatureFlags() {
  await sql`CREATE TABLE IF NOT EXISTS feature_flags (flagName text PRIMARY KEY, enabled boolean)`;
  console.log('✅ Setup database for feature flag');
  await sql`INSERT INTO feature_flags (flagName, enabled) VALUES ('fast_payments', true)`;
  console.log('✅ Setup an enabled feature flag to accept fast payment methods.');
}

populateFeatureFlags();
```

```tsx
// File: src/lib/feature_flags/setup.server.ts

import pool from '../postgres.server';

async function populateFeatureFlags() {
  await pool.query(
    'CREATE TABLE IF NOT EXISTS feature_flags (flagName text PRIMARY KEY, enabled boolean)'
  );
  console.log('✅ Setup database for feature flag');
  await pool.query({
    text: 'INSERT INTO feature_flags (flagName, enabled) VALUES ($1, $2)',
    values: ['fast_payments', true],
  });
  console.log('✅ Setup an enabled feature flag to accept fast payment methods.');
}

populateFeatureFlags();
```

</CodeTabs>

The code snippet above first ensures the existence of a table named `feature_flags` in the Postgres database. Then, it inserts a feature flag named `fast_payments` with the value `true`, indicating that fast payment methods are enabled.

### Read and update the feature flags

In the `feature_flags` directory, create a file named `get.server.ts` with the following code which will allow you to read the feature flag value in the database.

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```tsx
// File: src/lib/feature_flags/get.server.ts

import sql from '../postgres.server';

export const isEnabled = async (flagName: string): Promise<boolean> => {
  const rows = await sql`SELECT enabled FROM feature_flags WHERE flagName = ${flagName}`;
  return rows[0].enabled;
};
```

```tsx
// File: src/lib/feature_flags/get.server.ts

import pool from '../postgres.server';

export const isEnabled = async (flagName: string): Promise<boolean> => {
  const { rows } = await pool.query({
    text: 'SELECT enabled FROM feature_flags WHERE flagName = $1',
    values: [flagName],
  });
  return rows[0].enabled;
};
```

</CodeTabs>

The `isEnabled` function queries the database to check whether a specific feature flag is enabled or not. In this example, you will use it to check if `fast_payments` feature flag is enabled or not.

In the `feature_flags` directory, create a file named `set.server.ts` with the following code which will allow you to update the feature flag value in the database.

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```tsx
// File: src/lib/feature_flags/set.server.ts

import sql from '../postgres.server';

export const setEnabled = async (flagName: string, flagValue: boolean) => {
  await sql`UPDATE feature_flags SET enabled = ${flagValue} WHERE flagName = ${flagName}`;
};
```

```tsx
// File: src/lib/feature_flags/set.server.ts

import pool from '../postgres.server';

export const setEnabled = async (flagName: string, flagValue: boolean) => {
  await pool.query({
    text: 'UPDATE feature_flags SET enabled = $2 WHERE flagName = $1',
    values: [flagName, flagValue],
  });
};
```

</CodeTabs>

The `setEnabled` function updates the value of a feature flag in the database. In this example, you will update the `fast_payments` feature dynamically per request to get a taste of how feature flags are used in production.

Great! You can use these helper functions in your application to manage and control feature flags dynamically.

## Dynamic feature flag integration for testing fast payment methods

In this section, you will get an example of how a feature flag helps test and roll out new features, dynamically. For example, you are a payment processing company. You have just added a payment method named `PayGM` that helps users pay faster. But you want to test it out on a random basis for each cart that you process. Let's walk through the hypothetical code to understand the usage of a feature flag in this case.

### Computing the user destination

In a SvelteKit route, the data from the server to the user interface is passed via `+page.server.ts` file to `+page.svelte`. For the sake of this example, you will load the feature flag dynamically and check if it's enabled to determine the user's destination experience. To do that, add the following snippet to `+page.server.ts` file:

```tsx
// File: src/routes/+page.server.ts

import { isEnabled } from '$lib/feature_flags/get.server';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const bucket = cookies.get('destination_bucket');
  if (!bucket) {
    const tmp = await isEnabled('fast_payments');
    // If the feature is enabled, try bucketing users randomly
    if (tmp) cookies.set('destination_bucket', Math.random() > 0.5 ? '1' : '0', { path: '/' });
    // If the feature is disabled, do not bucket and preserve the current experience
    else cookies.set('destination_bucket', '0', { path: '/' });
  }
  const fast_payments = Boolean(Number(cookies.get('destination_bucket')));
  return {
    fast_payments,
  };
}
```

The code above first looks for the bucket assigned to the user. If no such bucket is found, it looks for the value of the feature flag in the database, randomly assigns a boolean whenever the `/` route is visited, and sets the value in the cookie. Finally, it reads the cookie as the source to determine the user experience and check if the fast payment methods are enabled or not.

### Creating a conditional user experience

Now, let's look at how the feature flag value can be used in the user interface to conditionally render UI elements. This will allow you to accept payments via PayGM if the `fast_payments` feature flag is enabled. To do that, use the following code in `+page.svelte` file:

```svelte
<script lang="ts">
  // File: src/routes/+page.svelte

  import '../app.css'

  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="w-screen h-screen flex flex-col items-center justify-center">
  {#if data.fast_payments}
    <div class="mb-6 w-full flex flex-col max-w-[300px]">
      <span class="font-semibold">Fast Payment Methods</span>
      <button class="mt-3 flex flex-col items-center border rounded w-full px-3 py-1">Pay via PayGM</button>
    </div>
  {/if}
  <form action="/" method="post" class="w-full flex flex-col max-w-[300px]">
    <span class="font-semibold">Pay with card</span>
    <input class="mt-3 w-full border px-2 py-1 rounded" type="text" placeholder="Full name on card" />
    <input class="mt-3 w-full border px-2 py-1 rounded" type="text" placeholder="1234 1234 1234 1234" />
    <div class="flex flex-row gap-x-2">
      <input class="w-1/2 border px-2 py-1 rounded" type="text" placeholder="MM/YY" />
      <input class="w-1/2 border px-2 py-1 rounded" type="text" placeholder="CVV" />
    </div>
  </form>
</div>
```

In the code above, UI elements related to fast payment methods are conditionally rendered based on the value of the `fast_payments` feature flag. If `fast_payments` feature flag is enabled, the UI will display options for paying via PayGM; otherwise, it will display options for paying with a card.

## Summary

In this guide, you learned how to add feature flags in your SvelteKit apps using Serverless Postgres powered by Neon. By dynamically updating and utilizing feature flags, you can effectively test and roll out new features like fast payment methods, providing a controlled and iterative approach to your deployments.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-sveltekit-feature-flags" description="Feature flags with SvelteKit and Neon" icon="github">Feature flags with SvelteKit and Neon</a>
</DetailIconCards>

<NeedHelp />
