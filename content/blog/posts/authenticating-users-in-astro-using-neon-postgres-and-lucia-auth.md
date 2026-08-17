---
title: Authenticating users in Astro using Neon Postgres and Lucia Auth
description: >-
  Step-by-step guide to building user authentication in Astro application with
  Lucia Auth and Postgres powered by Neon
excerpt: >-
  This guide covers the step-by-step process of building user authentication
  APIs and HTML pages in Astro application with Lucia Auth and Postgres, powered
  by Neon. User authentication provides a way to manage user identities and
  access control in your application. Upon completing...
date: '2024-04-12T19:47:52'
updatedOn: '2024-04-12T19:56:47'
category: community
categories:
  - community
authors:
  - rishi-raj-jain
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/authenticating-users-in-astro-using-neon-postgres-and-lucia-auth/cover.png
  alt: null
isFeatured: false
seo:
  title: Authenticating users in Astro using Neon Postgres and Lucia Auth - Neon
  description: >-
    Step-by-step guide to building user authentication in Astro application with
    Lucia Auth and Postgres powered by Neon
  keywords: []
  noindex: false
  ogTitle: Authenticating users in Astro using Neon Postgres and Lucia Auth - Neon
  ogDescription: >-
    This guide covers the step-by-step process of building user authentication
    APIs and HTML pages in Astro application with Lucia Auth and Postgres,
    powered by Neon. User authentication provides a way to manage user
    identities and access control in your application. Upon completing the
    guide, you would have an understanding of how to perform user authentication
    […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/authenticating-users-in-astro-using-neon-postgres-and-lucia-auth/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/authenticating-users-in-astro-using-neon-postgres-and-lucia-auth/image-16-1024x576-08142efa.png)

This guide covers the step-by-step process of building user authentication APIs and HTML pages in Astro application with Lucia Auth and Postgres, powered by Neon. User authentication provides a way to manage user identities and access control in your application. Upon completing the guide, you would have an understanding of how to perform user authentication using Lucia Auth and protect a page from unauthorized access.

## Prerequisites

To follow along this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- A [Vercel](https://vercel.com/dashboard) account

## Steps

- [Provisioning a Serverless Postgres powered by Neon](#provisioning-a-serverless-postgres-powered-by-neon)
- [Create a new Astro application](#create-a-new-astro-application)
- [Add Tailwind CSS to the application](#add-tailwind-css-to-the-application)
- [Enabling Server Side Rendering in Astro with Vercel](#enabling-server-side-rendering-in-astro-with-vercel)
- [Setting up a Postgres Database Connection and Schema](#setting-up-a-postgres-database-connection-and-schema)
- [Setup Lucia Auth with Neon Postgres](#setup-lucia-auth-with-neon-postgres)
- [Define the Astro application routes](#define-the-astro-application-routes)
- [Build the User Authentication Routes](#build-the-user-authentication-routes)
- [Deploy To Vercel](#deploy-to-vercel)

## Provisioning a Serverless Postgres powered by Neon

Using Serverless Postgres database powered by Neon helps you scale down to zero. With Neon, you only have to pay for what you use.

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and enter the name of your choice as the project name. You can pick a region near where you will deploy your Astro application. By default, version 16 of Postgres is used. Finally, click on **Create Project** to create the Postgres database named `neondb` (by default).

![Image](https://cdn.neonapi.io/public/images/pages/blog/authenticating-users-in-astro-using-neon-postgres-and-lucia-auth/image-12-1024x555-864791b2.png)

You will then be presented with a dialog that provides a connecting string of your database. Click on **Pooled connection** on the top right of the dialog and the connecting string automatically updates in the box below it.

![Image](https://cdn.neonapi.io/public/images/pages/blog/authenticating-users-in-astro-using-neon-postgres-and-lucia-auth/image-13-1024x556-631daa2d.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is the host with neon.tech as the [TLD](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `port` is the Neon port number. The default port number is 5432.
- `dbname` is the name of the database. “neondb” is the default database created with each Neon project.
- `?sslmode=require` an optional query parameter that enforces the [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode while connecting to the Postgres instance for better security.

Save this connecting string somewhere safe to be used as the `POSTGRES_URL` further in the guide. Proceed further in this guide to create a Astro application.

## Create a new Astro application

Let’s get started by creating a new Astro project. Open your terminal and run the following command:

```bash
npm create astro@latest authenticating-users-neon-lucia
```

`npm create astro` is the recommended way to scaffold an Astro project quickly.

When prompted, choose:

- `Empty` when prompted on how to start the new project.
- `Yes` when prompted if plan to write Typescript.
- `Strict` when prompted how strict Typescript should be.
- `Yes` when prompted to install dependencies.
- `Yes` when prompted to initialize a git repository.

Once that’s done, you can move into the project directory and start the app:

```bash
cd authenticating-users-neon-lucia
npm run dev
```

The app should be running on [localhost:4321](https://localhost:4321/).

Next, in your first terminal window, run the command below to install the necessary libraries and packages for building the application:

```bash
npm install pg
npm install -D dotenv tsx @types/pg
```

The above command installs the packages passed to the install command, with the -D flag specifying the libraries intended for development purposes only.

The libraries installed include:

- `pg`: A PostgreSQL client for Node.js.

The development-specific libraries include:

- `@types/pg`: Type definitions for pg.
- `tsx`: To execute and rebuild TypeScript efficiently.
- `dotenv`: A library for handling environment variables.

Then, make the following additions in your `astro.config.mjs` file to populate the environment variables and make them accessible via `process.env` object as well:

```javascript
// File: astro.config.mjs

+ import dotenv from 'dotenv';
import { defineConfig } from 'astro/config';

+ dotenv.config();

// https://astro.build/config
export default defineConfig({});
```

Then, make the following additions in your `tsconfig.json` file to make relative imports within the project easier:

```javascript
{
  "extends": "astro/tsconfigs/base",
+  "compilerOptions": {
+    "baseUrl": ".",
+    "paths": {
+      "@/*": ["src/*"]
+    }
+  }
}
```

## Add Tailwind CSS to the application

For styling the app, you will be using Tailwind CSS. Install and set up Tailwind at the root of our project’s directory by running:

```bash
npx astro add tailwind
```

When prompted, choose:

- `Yes` when prompted to install the Tailwind dependencies.
- `Yes` when prompted to generate a minimal `tailwind.config.mjs` file.
- `Yes` when prompted to make changes to Astro configuration file.

With choices as above, the command finishes integrating TailwindCSS into your Astro project. It installed the following dependency:

- `tailwindcss`: TailwindCSS as a package to scan your project files to generate corresponding styles.
- `@astrojs/tailwind`: The adapter that brings Tailwind’s utility CSS classes to every `.astro` file and framework component in your project.

## Enabling Server Side Rendering in Astro with Vercel

To authenticate users using server-side APIs, you’re going to enable server-side rendering in your Astro application. Execute the following command in your terminal:

```bash
npx astro add vercel
```

When prompted, choose:

- `Yes` when prompted to install the Vercel dependencies.
- `Yes` when promted to make changes to Astro configuration file.

With choices as above, the command finishes integrating Vercel adapter into your Astro project. It installed the following dependency:

- `@astrojs/vercel`: The adapter that allows you to deploy server-side rendered Astro application to Vercel.

## Setting up a Postgres Database Connection and Schema

In this section, you’ll learn how to configure a secure connection to the Postgres database, create a client to interact with it, and populate the tables in the database.

### Set up the database connection

Create an `.env` file in the root directory of your project with the following enviroment variable to initiate the setup of a database connection:

```bash
# Neon Postgres Pooled Connection URL
POSTGRES_URL="postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

The file, `.env` should be kept secret and not included in Git history. Ensure that `.env` is added to the `.gitignore` file in your project.

### Create the database client

First, create a `postgres` directory in the `src` directory by running the following command:

```bash
mkdir src/postgres
```

Then, to create a client that interacts with your serverless postgres, create a `setup.ts` file inside the `src/postgres` directory with the following code:

```bash
// File: src/postgres/setup.ts

// Load the environment variables
import 'dotenv/config'

// Load the postgres module
import pg from 'pg'

// Create a connection string to the postgres instance powered by Neon
const connectionString: string = `${process.env.POSTGRES_URL}`

// Create a in-memory pool so that it's cached for multiple calls
export default new pg.Pool({ connectionString })
```

The code imports the `dotenv` configuration, making sure that all the environment variables in the `.env` file are present in the runtime. Then, the code imports the `pg` library, retrieves the database URL from the environment variables, and uses it to create a new pool instance, which is subsequently exported.

### Create the database schema

In the `postgres` directory, create a file named `schema.ts` with the following code which will allow you to create and populate the user and sessions database tables for authentication.

```javascript
// File: src/postgres/schema.ts

import pool from './setup'

async function createSchema() {
  // Create the user table if it does not exist
  await pool.query('CREATE TABLE IF NOT EXISTS auth_user ( id TEXT PRIMARY KEY, username TEXT UNIQUE, hashed_password TEXT );')
  // Create the user_session table if it does not exist
  await pool.query('CREATE TABLE IF NOT EXISTS user_session ( id TEXT PRIMARY KEY, expires_at TIMESTAMPTZ NOT NULL, user_id TEXT NOT NULL REFERENCES auth_user(id) );')
  console.log('Finished setting up the database.')
  // Drain the pool of all active clients, disconnect them, and shut down any internal timers in the pool.
  await pool.end()
}

createSchema()
```

The code above defines how data will be stored, organized and managed in the database. Using the `pool` database instance, it executes an SQL query to create a `auth_user` table within the database if it does not already exist. This table comprises of three columns:

- An `id` column for storing random identifiers for each user in the table.
- A `username` column for storing unique identifiers for each user in the table.
- A `hashed_password` column for storing Argon2id hashed passwords for each user in the table.

A subsequent SQL query creates a `user_session` table within the database if it does not already exist. This table comprises three columns:

- An `id` column for storing random identifiers for each session in the table.
- An `expires_at` column for storing the timestamp with time zone for each session in the table.
- An `user_id` column for the associated `id` of each associated user for each session in the table.

After executing the two SQL queries, a message is printed to the console if there’s an error during the execution.

Finally, to execute the code in the schema file, make the following addition in the `scripts` of your `package.json` file:

```bash
{
  // ...
  "scripts": {
    // ...
+    "db:schema": "tsx src/postgres/schema.ts"
    // ...
  }
  // ...
}
```

### Test the database setup locally

To execute the code within `schema.ts` to set up the database, run the following command in your terminal window:

```bash
npm run db:schema
```

If the command is executed successfully, you will see no logs in your terminal window except `Finished setting up the database.`, marking the completion of the schema setup in your Postgres Database powered by Neon.

## Setup Lucia Auth with Neon Postgres

To start authenticating users and managing their sessions, install [Lucia](https://lucia-auth.com/) and [Oslo](https://oslo.js.org/), for various auth utilities by executing the following command in your terminal:

```bash
npm install lucia oslo @lucia-auth/adapter-postgresql @neondatabase/serverless
```

The above command installs the packages passed to the install command. The libraries installed include:

- `lucia`: An open source auth library that abstracts away the complexity of handling sessions.
- `oslo`: A collection of auth-related utilities.
- `@lucia-auth/adapter-postgresql`: PostgreSQL adapter for Lucia.
- `@neondatabase/serverless`: Neon’s PostgreSQL driver for JavaScript and TypeScript.

Then, create a `lucia` directory in the `src` directory by running the following command:

```bash
mkdir src/lucia
```

Then, create a file `index.ts` inside the `lucia` directory with the following code:

```javascript
// File: src/lucia/index.ts

import { Lucia } from 'lucia'
import { neon } from '@neondatabase/serverless'
import { NeonHTTPAdapter } from '@lucia-auth/adapter-postgresql'

const sql = neon(import.meta.env.POSTGRES_URL)

const adapter = new NeonHTTPAdapter(sql, {
  user: 'auth_user',
  session: 'user_session',
})

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
    }
  },
})

interface DatabaseUserAttributes {
  id: string
  username: string
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}
```

The code above does the following:

- Imports the Lucia class, Neon HTTP serverless driver and Lucia’s PostgreSQL adapter.
- Creates a one-shot SQL query function compatible with Neon.
- Creates a Lucia adapter with the tables `auth_user` and `user_session`.
- Creates a Lucia instance that uses cookies to maintain user sessions. The `auth_session` cookie set by Lucia, is set to be `secure` if your application is running in production mode (detected by [PROD](https://vitejs.dev/guide/env-and-mode#:~:text=config%20option.-,import.meta.env.PROD,-%3A%20%7Bboolean%7D%20whether%20the) Vite environment variable). Using `getUserAttributes` property, the Lucia instance is informed of the attributes that need to be fetched whenever a user information is requested.
- Defines types related to the user information and the Lucia instance.

To fetch and validate the current user session, and to verify if the users’ credentials are valid while they’re signing up, create a file `user.ts` with the following code:

```javascript
// File: src/lucia/user.ts

import { lucia } from '.'
import type { User } from 'lucia'
import type { AstroCookies } from 'astro'

export function getSessionID(cookies: AstroCookies): string | null {
  const auth_session = cookies.get('auth_session')
  if (!auth_session) return null
  return lucia.readSessionCookie(`auth_session=${auth_session.value}`)
}

export async function getUser(cookies: AstroCookies): Promise<User | null> {
  const { user } = await lucia.validateSession(getSessionID(cookies))
  return user
}

export function validateCredentials(username, password): string | null {
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (typeof username !== 'string' || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
    return 'Invalid username'
  }
  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    return 'Invalid password'
  }
  return null
}
```

The code above begins with the importing the lucia instance we created earlier and the types of user’s information and cookies (an Astro internal utility for cookies). Then, it exports the three function as follows:

- `getSessionID`: it accepts all the cookies received in a request, decode the `auth_session` cookie from it, and calls `readSessionCookie` function by lucia. It returns the `session_id` associated with the particular session.
- `getUser`: it calls the `validateSession` function by lucia that returns the user and session information associated with the given cookies. The user information returned by this function contains only the attributes defined in the `getUserAttributes` we created earlier.
- `validateCredentials`: it accepts in a username and password and returns a particular message if either of them didn’t meet the validity requirements.

## Define the Astro application routes

With Astro, creating a `.astro` or `.(js|ts)` file in the `src/pages` directory maps it to a route in your application. The name of the file created maps to the route’s URL pathname (with the exception of `index.(astro|ts|js)`, which is the index route).

The structure below is what our `pages` folder will look like at the end of this section:

```
├── signin.astro
├── signup.astro
├── protected.astro
├── api/
├──── sign/
└────── in.ts
└────── up.ts
└────── out.ts
```

- `protected.astro` will serve responses with dynamically created HTML to incoming requests at localhost:4321/protected.
- `signin.astro` will serve responses with statically generated HTML to incoming requests at localhost:4321/signin.
- `signup.astro` will serve responses with statically generated HTML to incoming requests at localhost:4321/signup.
- `api/sign/in.ts` will serve responses as an API Endpoint to incoming requests at localhost:4321/api/sign/in.
- `api/sign/up.ts` will serve responses as an API Endpoint to incoming requests at localhost:4321/api/sign/up.
- `api/sign/out.ts` will serve responses as an API Endpoint to incoming requests at localhost:4321/api/sign/out.

## Build the User Authentication Routes

For minimal user authentication, a user of your application should be able to sign up, sign in and sign out to your application at a given time. In this section, you’ll build the frontend pages for sign in and sign up and the API routes (in, up and out) that’ll process the user authentication logic for the same.

### Build the Sign Up HTML and API Route

Create a file `signup.astro` in the `src/pages` directory with the following Astro code to serve incoming requests to `/signup`:

```javascript
---
// File: src/pages/signup.astro

export const prerender = true
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
  </head>
  <body class="font-display overflow-x-hidden">
    <h1>Sign Up</h1>
    <form method="post" action="/api/sign/up">
      <label for="username">Username</label>
      <input id="username" name="username" />
      <label for="password">Password</label>
      <input id="password" name="password" />
      <button>Continue</button>
    </form>
  </body>
</html>
```

The above code does the following:

- Exports a `prerender` flag set to (boolean) `true` indicating the page to be statically generated at the build time.
- Serves an containing a form for users to enter their username and password in.
- Passes the form data to `/api/sign/up` API Endpoint when user submits their information.

Let’s create the endpoint for users to sign up with. Create a file `api/sign/up.ts` inside the `src/pages` directory with the following code:

```javascript
// File: src/pages/api/sign/up.ts

import pool from '@/postgres/setup'
import { generateId } from 'lucia'
import { lucia } from '@/lucia/index'
import type { APIContext } from 'astro'
import { Argon2id } from 'oslo/password'
import { validateCredentials } from '@/lucia/user'

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const message = validateCredentials(username, password)
  if (message) return new Response(message, { status: 400 })
  const user_id = generateId(15)
  const hashed_password = await new Argon2id().hash(password)
  await pool.query({
    text: 'INSERT INTO auth_user (id, username, hashed_password) VALUES ($1, $2, $3)',
    values: [user_id, username, hashed_password],
  })
  const session = await lucia.createSession(user_id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return context.redirect('/protected')
}
```

The above code does the following for incoming requests to `/api/sign/up`:

- Imports the Postgres pool, the initialized lucia instance, `generateId`, `Argon2id` and `validateCredentials` functions.
- Exports a `POST` function indiciating that the API route would only process the incoming POST requests.
- Parses the form data in the request.
- Extracts username and password from the form data. Validates them using the `validateCredentials` function created earlier.
- Creates a hashed password using Argon2id.
- Attempts to create the user in `auth_user` table using the pg client. As `username` is a unique field in the database, any conflicts will result in an error response from the endpoint.
- Creates a user session using `createSession` helper by Lucia.
- Sets the cookie pertaining to the user session and redirect to the `/protected` page.

### Build the Sign In HTML and API Route

Create a file `signin.astro` in the `src/pages` directory with the following Astro code to serve incoming requests to `/signin`:

```javascript
---
// File: src/pages/signin.astro

export const prerender = true
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
  </head>
  <body class="font-display overflow-x-hidden">
    <h1>Sign In</h1>
    <form method="post" action="/api/sign/in">
      <label for="username">Username</label>
      <input id="username" name="username" />
      <label for="password">Password</label>
      <input id="password" name="password" />
      <button>Continue</button>
    </form>
  </body>
</html>
```

The above code does the following:

- Exports a `prerender` flag set to (boolean) `true` indicating the page to be statically generated at the build time.
- Serves an containing a form for users to enter their username and password in.
- Passes the form data to `/api/sign/in` API Endpoint when user submits their information.

Let’s create the endpoint for users to sign in with. Create a file `api/sign/in.ts` inside the `src/pages` directory with the following code:

```javascript
// File: src/pages/api/sign/in.ts

import pool from '@/postgres/setup'
import { lucia } from '@/lucia/index'
import type { APIContext } from 'astro'
import { Argon2id } from 'oslo/password'
import { validateCredentials } from '@/lucia/user'

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const message = validateCredentials(username, password)
  if (message) return new Response(message, { status: 400 })
  const existingUser = await pool.query({
    text: 'SELECT id as user_id, username, hashed_password FROM auth_user WHERE username = $1',
    values: [username.toLowerCase()],
  })
  if (!existingUser || existingUser.rowCount < 1) return new Response('Incorrect email or password', { status: 400 })
  const validPassword = await new Argon2id().verify(existingUser.rows[0].hashed_password, password)
  if (!validPassword) return new Response('Incorrect email or password', { status: 400 })
  const session = await lucia.createSession(existingUser.rows[0].user_id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return context.redirect('/protected')
}
```

The above code does the following for incoming requests to `/api/sign/in`:

- Imports the Postgres pool, the initialized lucia instance, `Argon2id` and `validateCredentials` functions.
- Exports a `POST` function indiciating that the API route would only process the incoming POST requests.
- Parses the form data in the request.
- Extracts username and password from the form data. Validates them using the `validateCredentials` function created earlier.
- Checks for an existing user with the given username. If not found, sends a response with 400 Bad Request status.
- Otherwise, verifies the hashed password in the Neon Postgres with the password user entered. If they don’t match, sends a response with 400 Bad Request status.
- Otherwise, creates a user session using `createSession` helper by Lucia.
- Sets the cookie pertaining to the user session and redirect to the `/protected` page.

### Build the Sign Out API Route

Let’s create the endpoint for users to sign out with. Create a file `api/sign/out.ts` inside the `src/pages` directory with the following code:

```javascript
// File: src/pages/api/sign/out.ts

import { lucia } from '@/lucia/index'
import type { APIContext } from 'astro'
import { getSessionID } from '@/lucia/user'

export async function GET({ cookies, redirect }: APIContext): Promise<Response> {
  await lucia.invalidateSession(getSessionID(cookies))
  const sessionCookie = lucia.createBlankSessionCookie()
  cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return redirect('/protected')
}
```

The above code does the following for incoming requests to `/api/sign/out`:

- Imports the initialized lucia instance, and `getSessionID` function.
- Exports a `GET` function indiciating that the API route would only process the incoming GET requests.
- Invalidates the current user session using the `invalidateSession` helper by Lucia.
- Creates an empty user session cookie using `createBlankSessionCookie` helper by Lucia.
- Sets the blank user session cookie.
- Redirects to the `/protected` page.

### Build the Protected HTML Page

Create a file `protected.astro` in the `src/pages` directory with the following Astro code to serve incoming requests to `/protected`:

```javascript
---
// File: src/pages/protected.astro

import { getUser } from '@/lucia/user'

const user = await getUser(Astro.cookies)

if (!user) return new Response(null, { status: 403 })
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
  </head>
  <body class="font-display overflow-x-hidden">
    <span> Protected Content for {user.id} {user.username} </span>
  </body>
</html>
```

The code above does the following to the incoming requests at `/protected`:

- Imports the `getUser` function (created earlier)
- Using `Astro.cookies`, verifies if there is an authenticated user with the current request. If not found, returns a 403 Forbidden status.
- Otherwise, it serves the protected HTML.

Great! Now you’re able to authenticate users and protected specific rouets in your application using API Endpoints in Astro and Lucia Auth.

## Deploy to Vercel

The code is now ready to deploy to Vercel. Use the following steps to deploy:

- Start by creating a GitHub repository containing your app’s code.
- Then, navigate to the Vercel Dashboard and create a **New Project**.
- Link the new project to the GitHub repository you just created.
- In **Settings**, update the **Environment Variables** to match those in your local `.env` file.
- Deploy!

## Summary & Final Thoughts

In this guide, you learned how to authenticate users in your Astro application using Lucia Auth and Serverless Postgres Database powered by Neon. Further, you learned how to create protected routes that are forbidden for un-authenticated users.

For more, join us on our [Discord server](https://neon.tech/discord) to share your experiences, suggestions, and challenges.
