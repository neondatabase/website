---
title: Authenticate Neon Postgres application users with Auth0
subtitle: Learn how to add authentication to a Neon Postgres database application using
  Auth0
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.946Z'
---

User authentication is an essential part of most web applications. Modern apps often require features like social login, multi-factor authentication, and secure user data management that complies with privacy regulations.

[Auth0](https://auth0.com/) is an authentication and authorization platform that provides these features out of the box. It offers SDKs for popular web frameworks, making it straightforward to integrate with your application backed by a Neon Postgres database.

In this guide, we'll walk through setting up a simple Next.js application using Neon Postgres as the database, and add user authentication using [Auth0](https://auth0.com/). We will cover how to:

- Set up a Next.js project with Auth0 for authentication
- Create a Neon Postgres database and connect it to your application
- Define a database schema using Drizzle ORM and generate migrations
- Store and retrieve user data associated with Auth0 user IDs

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- An [Auth0](https://auth0.com/) account for user authentication. Auth0 provides a free plan to get started.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Initialize your Next.js project

We will create a simple web app that lets you add a favorite quote to the home page, and edit it afterward. Run the following command in your terminal to create a new `Next.js` project:

```bash
npx create-next-app guide-neon-next-auth0 --typescript --eslint --tailwind --use-npm --no-src-dir --app --import-alias "@/*"
```

Now, navigate to the project directory and install the required dependencies:

```bash
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit dotenv
npm install @auth0/nextjs-auth0
```

We use the `@neondatabase/serverless` package as the Postgres client, and `drizzle-orm`, a lightweight typescript ORM, to interact with the database. `@auth0/nextjs-auth0` is the Auth0 SDK for Next.js applications. We also use `dotenv` to manage environment variables and the `drizzle-kit` CLI tool for generating database migrations.

Also, add a `.env.local` file to the root of your project, which we'll use to store Neon/Auth0 connection parameters:

```bash
touch .env.local
```

<Admonition type="note">
At the time of this post, the `@auth0/nextjs-auth0` package caused import errors related to one of its dependencies (`oauth4webapi`). To stop Next.js from raising the error, add the following to your `nextjs.config.mjs` file:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: 'loose' },
};

export default nextConfig;
```

</Admonition>

Now, we can start building the application.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select an existing project or click the **New Project** button to create a new one.
3. Choose the desired region and Postgres version for your project, then click **Create Project**.

### Retrieve your Neon database connection string

Navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Add this connection string to the `.env.local` file in your Next.js project.

```bash
# .env.local

DATABASE_URL=NEON_DB_CONNECTION_STRING
```

## Configuring Auth0 for authentication

### Create an Auth0 application

1. Log in to your Auth0 account and navigate to the [Dashboard](https://manage.auth0.com/dashboard/). From the left sidebar, select `Applications > Create Application` to create a new app.
2. In the dialog that appears, provide a name for your application, select `Regular Web Applications` as the application type, and click `Create`.

### Configure Auth0 application settings

1. In the `Settings` tab of your Auth0 application, scroll down to the `Application URIs` section.
2. Set the `Allowed Callback URLs` to `http://localhost:3000/api/auth/callback` for local development.
3. Set the `Allowed Logout URLs` to `http://localhost:3000`.
4. Click `Save Changes` at the bottom of the page.

### Retrieve your Auth0 domain and client ID

From the `Settings` tab of your Auth0 application, copy the `Domain` and `Client ID` values. Add these to the `.env.local` file in your Next.js project:

```bash
# .env.local

AUTH0_SECRET='random-32-byte-value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN'
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
```

Replace `YOUR_AUTH0_DOMAIN`, `YOUR_AUTH0_CLIENT_ID` and `YOUR_AUTH0_CLIENT_SECRET` with the actual values from your Auth0 application settings.

Run the following command in your terminal to generate a random 32-byte value for the `AUTH0_SECRET` variable:

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

## Implementing the application

### Define your database connection and schema

Create a `db` folder inside the `app/` directory. This is where we'll define the database schema and connection code.

Now, add the file `app/db/index.ts` with the following content:

```typescript
/// app/db/index.ts

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { UserMessages } from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be a Neon postgres connection string');
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, {
  schema: { UserMessages },
});
```

This exports a `db` instance that we can use to execute queries against the Neon database.

Next, create a `schema.ts` file inside the `app/db` directory to define the database schema:

```typescript
/// app/db/schema.ts

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const UserMessages = pgTable('user_messages', {
  user_id: text('user_id').primaryKey().notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  message: text('message').notNull(),
});
```

This schema defines a table `user_messages` to store a message for each user, with the `user_id` provided by Auth0 as the primary key.

### Generate and run migrations

We'll use the `drizzle-kit` CLI tool to generate migrations for the schema we defined. To configure how it connects to the database, add a `drizzle.config.ts` file at the project root.

```typescript
/// drizzle.config.ts

import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not found in environment');

export default {
  schema: './app/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  strict: true,
} satisfies Config;
```

Now, generate the migration files by running the following command:

```bash
npx drizzle-kit generate:pg
```

This will create a `drizzle` folder at the project root with the migration files. To apply the migration to the database, run:

```bash
npx drizzle-kit push:pg
```

The `user_messages` table will now be visible in the Neon console.

### Configure Auth0 authentication

We create a `dynamic route` to handle the Auth0 authentication flow. Create a new file `app/api/auth/[auth0]/route.ts` with the following content:

```typescript
/// app/api/auth/[auth0]/route.ts

import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  login: handleLogin(),
});
```

This sets up the necesssary Auth0 authentication routes for the application at the `/api/auth/auth0/*` endpoints - `login`, `logout`, `callback` (to redirect to after a successful login), and `me` (to fetch the user profile).

Next, we will wrap the application with the `UserProvider` component from `@auth0/nextjs-auth0`, so all pages have access to the current user context. Replace the contents of the `app/layout.tsx` file with the following:

```tsx
/// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSession } from '@auth0/nextjs-auth0';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neon-Next-Auth0 guide',
  description: 'Generated by create next app',
};

async function UserInfoBar() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const { user } = session;
  return (
    <div className="bg-gray-100 px-4 py-2">
      <span className="text-gray-800">
        Welcome, {user.name}!{' '}
        <a href="/api/auth/logout" className="text-blue-600 hover:underline">
          Logout
        </a>
      </span>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>
          <UserInfoBar />
          {children}
        </body>
      </html>
    </UserProvider>
  );
}
```

### Add interactivity to the application

Our application has a single page that lets the logged-in user store their favorite quote and displays it. We implement `Next.js` server actions to handle the form submission and database interaction.

Create a new file at `app/actions.ts` with the following content:

```typescript
/// app/actions.ts

'use server';

import { getSession } from '@auth0/nextjs-auth0/edge';
import { UserMessages } from './db/schema';
import { db } from './db';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export async function createUserMessage(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('User not authenticated');

  const message = formData.get('message') as string;

  await db.insert(UserMessages).values({
    user_id: session.user.sub,
    message,
  });

  redirect('/');
}

export async function deleteUserMessage() {
  const session = await getSession();
  if (!session) throw new Error('User not authenticated');

  await db.delete(UserMessages).where(eq(UserMessages.user_id, session.user.sub));
  redirect('/');
}
```

The `createUserMessage` function inserts a new message into the `user_messages` table, while `deleteUserMessage` removes the message associated with the current user.

Next, we implement a minimal UI to interact with these functions. Replace the contents of the `app/page.tsx` file with the following:

```tsx
/// app/page.tsx

import { createUserMessage, deleteUserMessage } from './actions';
import { db } from './db';
import { getSession } from '@auth0/nextjs-auth0/edge';

async function getUserMessage() {
  const session = await getSession();
  if (!session) return null;

  return db.query.UserMessages.findFirst({
    where: (messages, { eq }) => eq(messages.user_id, session.user.sub),
  });
}

function LoginBox() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <a
        href="/api/auth/login"
        className="text-gray-800 rounded-md bg-[#00E699] px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-[#00e5BF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E699]"
      >
        Log in
      </a>
    </main>
  );
}

export default async function Home() {
  const session = await getSession();
  const existingMessage = await getUserMessage();

  if (!session) {
    return <LoginBox />;
  }

  const ui = existingMessage ? (
    <div className="w-2/3 text-center">
      <h1 className="text-3xl">{existingMessage.message}</h1>
      <form action={deleteUserMessage} className="mb-4 w-full rounded px-8 pb-8 pt-6">
        <div className="w-full text-center">
          <input
            type="submit"
            value={'Delete Quote'}
            className="text-gray-800 cursor-pointer rounded bg-[#00E699] px-4 py-2 font-semibold transition-colors hover:bg-[#00e5BF] focus:outline-none"
          />
        </div>
      </form>
    </div>
  ) : (
    <form action={createUserMessage} className="w-2/3 rounded px-8 shadow-md">
      <div className="mb-6">
        <input
          type="text"
          name="message"
          placeholder="Mistakes are the portals of discovery - James Joyce"
          className="text-gray-700 w-full appearance-none rounded border p-3 text-center leading-tight focus:outline-none"
        />
      </div>
      <div className="w-full text-center">
        <input
          type="submit"
          value={'Save Quote'}
          className="text-gray-800 cursor-pointer rounded bg-[#00E699] px-4 py-2 font-semibold transition-colors hover:bg-[#00e5BF] focus:outline-none"
        />
      </div>
    </form>
  );

  return (
    <main className="align-center -mt-16 flex min-h-screen flex-col items-center justify-center px-24">
      <h2 className="text-gray-400 pb-6 text-2xl">
        {existingMessage ? 'Your quote is wonderful...' : 'Save an inspiring quote for yourself...'}
      </h2>
      {ui}
    </main>
  );
}
```

This implements a form with a single text field that lets the user input a quote, and submit it, whereby it gets stored in the database, associated with their `Auth0` user ID. If a quote is already stored, it displays the quote and provides a button to delete it.

The `getSession` function from `@auth0/nextjs-auth0/edge` provides the current user's session information, which we use to interact with the database on their behalf. If the user is not authenticated, the page displays a login button instead.

## Running the application

To start the application, run the following command:

```bash
npm run dev
```

This will start the Next.js development server. Open your browser and navigate to `http://localhost:3000` to see the application in action. When running for the first time, you'll be prompted to log in with Auth0. By default, Auth0 provides email and Google account as login options.

Once authenticated, you'll be able to visit the home page, add a quote, and see it displayed.

## Conclusion

In this guide, we walked through setting up a simple Next.js application with user authentication using Auth0 and a Neon Postgres database. We defined a database schema using Drizzle ORM, generated migrations, and interacted with the database to store and retrieve user data.

Next, we can add more routes and features to the application. The `UserProvider` component from `@auth0/nextjs-auth0` provides the user context to each page, allowing you to conditionally render content based on the user's authentication state.

To view and manage the users who authenticated with your application, you can navigate to the [Auth0 Dashboard](https://manage.auth0.com/) and click on **User Management > Users** in the sidebar. Here, you can see the list of users who have logged in and perform any necessary actions for those users.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-next-auth0" description="Authenticate users of your Neon application with Auth0" icon="github">Authentication flow with Auth0</a>
</DetailIconCards>

## Resources

For more information on the tools used in this guide, refer to the following documentation:

- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)

<NeedHelp/>
