---
title: Authenticate Neon Postgres application users with Okta
subtitle: Learn how to add authentication to a Neon Postgres database application with
  Okta
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.383Z'
---

User authentication is critical for web applications, especially for apps internal to an organization. [Okta Workforce Indentity Cloud](https://www.okta.com/workforce-identity/) is an identity and access management platform for organizations, that provides authentication, authorization, and user management capabilities.

In this guide, we'll walk through building a simple Next.js application using [Neon's](https://neon.tech) Postgres database, and add user authentication to it using [Okta](https://www.okta.com/). We will cover how to:

- Set up a Next.js project with Okta for authentication
- Create a Neon Postgres database and connect it to your application
- Define a database schema using Drizzle ORM and generate migrations
- Store and retrieve user data associated with Okta user IDs

<Admonition type="note">
Okta provides a different solution called [Customer Identity Cloud](https://www.okta.com/customer-identity/), powered by `Auth0`, to authenticate external customers for Saas applications. This guide focuses on the [Workforce Identity Cloud](https://www.okta.com/workforce-identity/) for internal applications. For an example guide using `Auth0`, refer to our [Auth0](/docs/guides/auth-auth0) guide.
</Admonition>

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- An [Okta](https://developer.okta.com/) administrator account for user authentication. Okta provides a free trial that you can use to set one up for your organization.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Initialize your Next.js project

We will create a simple web app that lets you add a favorite quote to the home page, and edit it afterwards. Run the following command in your terminal to create a new `Next.js` project:

```bash
npx create-next-app guide-neon-next-okta --typescript --eslint --tailwind --use-npm --no-src-dir --app --import-alias "@/*"
```

Now, navigate to the project directory and install the required dependencies:

```bash
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit dotenv
npm install next-auth@beta
```

We use the `@neondatabase/serverless` package as the Postgres client, and `drizzle-orm`, a lightweight typescript ORM, to interact with the database. We also use `dotenv` to manage environment variables and the `drizzle-kit` CLI tool for generating database migrations. For authentication, we'll use the `auth.js` library (aliased as v5 of the `next-auth` package), which provides a simple way to add authentication to Next.js applications. It comes with built-in support for Okta.

Also, add a `.env.local` file to the root of your project, which we'll use to store Neon/Okta connection parameters:

```bash
touch .env.local
```

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

## Configuring Okta for authentication

### Create an Okta application

1. Log in to your Okta developer account and navigate to the **Applications** section. Click the **Create App Integration** button.
2. Select **OIDC - OpenID Connect** as the sign-in method.
3. Select **Web Application** as the application type and click **Next**.
4. Provide a name for your application, e.g., "Neon Next Guide".
5. Set **Sign-in redirect URIs** to `http://localhost:3000/api/auth/callback/okta` and **Sign-out redirect URIs** to `http://localhost:3000`.
6. Click **Save** to create the application.

### Retrieve your Okta configuration

From the application's **General** tab, find the **Client ID** and **Client SECRET**. Also note down your Okta **Issuer URI**, which is the first part of your Okta account's URL, e.g., `https://dev-12345.okta.com`. If it isn't clear, visit the **Security > API** section from the sidebar in the console to find the **Issuer URI** and remove `/oauth2/default` from the end.

Add these as environment variables to the `.env.local` file in your Next.js project:

```bash
# .env.local

AUTH_OKTA_ISSUER=YOUR_OKTA_ISSUER
AUTH_OKTA_ID=YOUR_CLIENT_ID
AUTH_OKTA_SECRET=YOUR_CLIENT_SECRET
AUTH_SECRET=YOUR_SECRET
```

The last variable, `AUTH_SECRET`, is a random string used by `Auth.js` to encrypt tokens. Run the following command to generate one and add it to your `.env.local` file:

```bash
npx auth secret
```

<Admonition type="note">
If you set up an Okta organization account specifically for this guide, you might need to assign yourself to the created Okta application to test the authentication flow. Visit **Applications > Applications** from the sidebar and select the application you created. In the **Assignments** tab, click **Assign** and select your own user account. 
</Admonition>

## Implementing the application

### Define database connection and schema

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

### Configure Okta authentication

Create a new file `auth.ts` in the root directory of the project and add the following content:

```typescript
import NextAuth from 'next-auth';
import Okta from 'next-auth/providers/okta';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Okta],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
  },
});
```

This file initializes `Auth.js` with Okta as the authentication provider. It also defines a callback to set the `sub` claim from the Okta token as the session user ID.

### Implement authentication routes

Create a new dynamic route at `app/api/auth/[...nextauth]/route.ts` with the following content:

```tsx
/// app/api/auth/[...nextauth]/route.ts

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

This route file imports the authentication handlers from the `auth.ts` file that handle all auth-related requests &#8212; sign-in, sign-out, and redirect after authentication.

The `auth` object exported from `./auth.ts` is the universal method we can use to interact with the authentication state in the application. For example, we add a **User information** bar to the app layout that indicates the current user's name and provides a sign-out button.

Replace the contents of the `app/layout.tsx` file with the following:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

async function UserInfoBar() {
  const session = await auth();
  if (!session) {
    return null;
  }

  return (
    <div className="bg-gray-100 px-4 py-2">
      <span className="text-gray-800">
        Welcome, {session.user?.name}!{' '}
        <a href="/api/auth/signout" className="text-blue-600 hover:underline">
          Sign out
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
    <html lang="en">
      <body className={inter.className}>
        <UserInfoBar />
        {children}
      </body>
    </html>
  );
}
```

### Add interactivity to the application

Our application has a single page that lets the logged-in user store their favorite quote and display it. We implement `Next.js` server actions to handle the form submission and database interaction.

Create a new file at `app/actions.ts` with the following content:

```typescript
/// app/actions.ts

'use server';

import { auth } from '@/auth';
import { UserMessages } from './db/schema';
import { db } from './db';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export async function createUserMessage(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('User not authenticated');

  const message = formData.get('message') as string;
  await db.insert(UserMessages).values({
    user_id: session.user?.id as string,
    message,
  });

  redirect('/');
}

export async function deleteUserMessage() {
  const session = await auth();
  if (!session) throw new Error('User not authenticated');

  await db.delete(UserMessages).where(eq(UserMessages.user_id, session.user?.id as string));
  redirect('/');
}
```

The `createUserMessage` function inserts a new message into the `user_messages` table, while `deleteUserMessage` removes the message associated with the current user.

Next, we implement a minimal UI to interact with these functions. Replace the contents of the `app/page.tsx` file with the following:

```tsx
/// app/page.tsx

import { createUserMessage, deleteUserMessage } from './actions';
import { db } from './db';
import { auth } from '@/auth';

async function getUserMessage() {
  const session = await auth();
  if (!session) return null;

  return db.query.UserMessages.findFirst({
    where: (messages, { eq }) => eq(messages.user_id, session.user?.id as string),
  });
}

function LoginBox() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <a
        href="/api/auth/signin"
        className="text-gray-800 rounded-md bg-[#00E699] px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-[#00e5BF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E699]"
      >
        Log in
      </a>
    </main>
  );
}

export default async function Home() {
  const session = await auth();
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

This code implements a form with a single text field that lets the user input a quote, and submit it, whereby the quote is stored in the database and associated with the user's `Okta` user ID. If a quote is already stored, it displays the quote and provides a button to delete it.

The `user.id` property set on the session object provides the current user's ID, which we use to interact with the database on their behalf. If the user is not authenticated, the page displays a login button instead.

## Running the application

To start the application, run the following command:

```bash
npm run dev
```

This will start the Next.js development server. Open your browser and navigate to `http://localhost:3000` to see the application in action. When running for the first time, you'll see a `Log In` button which will redirect you to the `Auth.js` widget, prompting you to sign in with Okta.

Once authenticated, you'll be able to visit the home page, add a quote, and see it displayed.

## Conclusion

In this guide, we walked through setting up a simple Next.js application with user authentication using Okta and a Neon Postgres database. We defined a database schema using Drizzle ORM, generated migrations, and interacted with the database to store and retrieve user data.

Next, we can add more routes and features to the application. The `auth` method can be used in the Next.js API routes or middleware to protect endpoints that require authentication.

To view and manage the users who authenticated with your application, you can navigate to your Okta admin console and view the **Directory > People** section in the sidebar.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-next-okta" description="Authenticate Neon application users with Okta" icon="github">Authentication flow with Okta</a>
</DetailIconCards>

## Resources

For more information on the tools used in this guide, refer to the following documentation:

- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js Documentation](https://authjs.dev/getting-started/installation)

<NeedHelp/>
