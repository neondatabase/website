---
title: 'Next.js authentication using Clerk, Drizzle ORM, and Neon'
description: >-
  Learn how to build a Next.js application that uses Clerk for authentication
  and Neon's Serverless Postgres with Drizzle ORM to store data.
excerpt: >-
  Building an effective authentication and authorization system into your
  application is as equally fraught with challenges as managing database
  infrastructure. As the old wisdom says, never “roll your own” regarding
  authentication and authorization. In addition to the effort requi...
date: '2024-04-01T18:11:47'
updatedOn: '2024-04-02T21:59:48'
category: community
categories:
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/cover.jpg
  alt: 'Next.js authentication using Clerk, Drizzle ORM, and Neon'
isFeatured: false
seo:
  title: 'Next.js authentication using Clerk, Drizzle ORM, and Neon - Neon'
  description: >-
    Learn how to build a Next.js application that uses Clerk for authentication
    and Neon's Serverless Postgres with Drizzle ORM to store data.
  keywords: []
  noindex: false
  ogTitle: 'Next.js authentication using Clerk, Drizzle ORM, and Neon - Neon'
  ogDescription: >-
    Learn how to build a Next.js application that uses Clerk for authentication
    and Neon's Serverless Postgres with Drizzle ORM to store data.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/social.jpeg
source:
  wpId: 5420
  wpSlug: nextjs-authentication-using-clerk-drizzle-orm-and-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/neon-auth-clerk-1-1-1024x538-f0dee186.jpg)

Building an effective authentication and authorization system into your application is as equally fraught with challenges as managing database infrastructure. As the old wisdom says, never “roll your own” regarding authentication and authorization.

In addition to the effort required to develop the login, logout, and social provider integration, you must consider compliance with standards such as SOC 2 and HIPAA, multi-factor authentication, and user management.

Using [Clerk](https://clerk.com/) enables you to seamlessly add advanced authentication and user management features to your application and comply with data security regulations by storing personally identifiable information in their compliant infrastructure.

In this article, you’ll learn how to use Clerk to add authentication to a [Next.js](https://nextjs.org/) application and how to use Clerk’s Next.js helpers to obtain user details in your components. You’ll also learn to use [Drizzle ORM](https://orm.drizzle.team/) to store non-PII data in Neon’s serverless Postgres.

A complete example application with instructions for local development and deployment on Vercel can be found on GitHub at [evanshortiss/neon-clerk-drizzle-nextjs](https://github.com/evanshortiss/neon-clerk-drizzle-nextjs). A live preview of the sample application is hosted on Vercel; try it out at [neon-clerk-drizzle-nextjs.vercel.app](https://neon-clerk-drizzle-nextjs.vercel.app/) and vote for your favorite periodic element!

## Solution Architecture

Before diving into the implementation, let’s review the high-level architecture of this application.

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/clerk-solution-arch-1024x567-fb1b8ca6.jpg)

Vercel will provide serverless hosting for your Next.js application. The Next.js application will direct your users to Clerk for authentication. Clerk will redirect users to your application once they’ve completed an authentication flow using a supported provider such as Google or Discord [OAuth](https://oauth.net/2/).

Once a user is signed in, they can access protected pages and routes in your application, and you can [read their session data](https://clerk.com/docs/references/nextjs/read-session-data) as needed to obtain the user ID to query or associate data with the authenticated user in your Neon Postgres database.

## Sign Up to Neon and Configure Postgres

[Sign up for Neon](https://console.neon.tech/signup) and create a project. This project will contain the Postgres database and a `user_messages` table that you will use to follow along with the rest of this article.

1. Enter a project name.
2. Use the default database name of `neondb`.
3. Choose the region closest to the location where your application will be deployed.
4. Click the **Create project** button.

You’ll instantly be provided with a connection string you can use to connect to your serverless Postgres database.

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/neon-dashboard-1024x547-e30c7d7d.jpg)

## Sign Up to Clerk and Configure Application Sign In

Visit [dashboard.clerk.com](https://dashboard.clerk.com) and sign up, or sign in if you’re an existing user. Create a new application and enable some of the available sign-in options. You can see that I’ve enabled Discord and Google as sign-in options for my application.

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/clerk-sign-up-1024x569-654a6d7e.jpg)

Once the application has been created on Clerk, you’ll find your API keys on the **Home** screen of your application in the Clerk dashboard. Specifically, you’ll need the API keys listed in the Next.js section soon!

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/clerk-dashboard-1024x570-627c1cbd.jpg)

## Using Neon’s Serverless Driver with Next.js and Drizzle ORM

### Create a Next.js Project and Install Dependencies

Create a Next.js application in your development environment. This requires Node.js v18 or newer to be installed in your development environment. This article assumes you use the following options when creating your Next.js application using [create-next-app](https://nextjs.org/docs/pages/api-reference/create-next-app).

```bash
npx create-next-app@14.1 neon-clerk-next \
--typescript \
--eslint \
--tailwind \
--use-npm \
--app \
--src-dir \
--import-alias "@/*"
```

Once your Next.js application has been created, change to the project directory in your terminal, then add the [Neon serverless driver](https://github.com/neondatabase/serverless/) and Drizzle ORM to your project’s dependencies using npm or your preferred package manager.

```bash
npm install @neondatabase/serverless drizzle-orm
```

### Create a Schema and Database Connection

Create a file named _src/app/db/schema.ts_ and define a `user_messages` schema using the types provided by Drizzle ORM.

```typescript
// file: src/app/db/schema.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * This table stores quotes submitted by users.
 */
export const UserMessages = pgTable('user_messages', {
  // This will be the user ID provided by Clerk
  user_id: text('user_id').primaryKey().notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  message: text('message').notNull()
});
```

To use Neon’s serverless driver with Drizzle ORM, create a file named _src/app/db/index.ts_ and add the following code. Exporting the Drizzle instance from a file means it’s created on application startup and exported as a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) that other modules can import and reuse to execute [typesafe](https://en.wikipedia.org/wiki/Typesafe) SQL queries against your Postgres database hosted by Neon.

```typescript
// file: src/app/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { UserMessages } from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be a Neon postgres connection string')
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, {
  schema: { UserMessages }
});
```

Next, create a file named _.env.local_ in the root of the Next.js project directory and add your [database URL from the Neon Console](https://neon.tech/docs/connect/connect-from-any-app) as an environment variable named DATABASE_URL.

```bash
# Copy this from your project dashboard on https://console.neon.tech
DATABASE_URL=postgresql://user:pass@ep-adj-noun-12345.us-east-2.aws.neon.tech/mydatabase?sslmode=require
```

### Start your Application

Use the npm run dev command to start your Next.js application in development mode and confirm it’s available at [https://localhost:3000](https://localhost:3000). You won’t be prompted to authenticate since you haven’t added the Clerk middleware to your application yet – you’ll take care of that soon.

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/next-local-dev-1024x591-4245d990.jpg)

## Generate and Apply Database Migrations using Drizzle Kit

Before using Drizzle ORM to perform database operations in your application, you’ll need to generate and apply schema migrations to your database. [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) streamlines this process by detecting changes in your _schema.ts_ file and generating the necessary SQL migrations to apply to your database.

To get started, add Drizzle Kit and [dotenv](https://www.npmjs.com/package/dotenv) to your project’s development dependencies.

```bash
npm i drizzle-kit dotenv -D
```

Next, create a file named _drizzle.config.ts_ at the root of your repository and add the following configuration.

```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from "dotenv";

// Read the .env file if it exists, or a file specified by the
// dotenv_config_path parameter that's passed to Node.js
dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not found in environment');

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  strict: true,
} satisfies Config;
```

Now you can use the generate command from the Drizzle Kit CLI to generate migration files. Run the following command to generate migrations for your user schema.

```bash
npx drizzle-kit generate:pg -- dotenv_config_path='.env.local'
```

A new _src/app/db/migrations_ folder will be created, and an SQL migration file will be created that contains a `CREATE TABLE` statement for the `user_messages` table. You can read more about [migrations in the Drizzle documentation](https://orm.drizzle.team/kit-docs/overview).

Use the push command from the Drizzle Kit CLI to apply the migrations to your Postgres database on Neon. The following command runs the `push` command from Drizzle Kit and sets the [config path for dotenv](https://www.npmjs.com/package/dotenv) to load the `DATABASE_URL` from your _.env.local_ file.

```bash
npx drizzle-kit push:pg -- dotenv_config_path='.env.local'
```

Visit the **Tables** view in the Neon Console, and your new user_messages table will be listed once the push command has finished.

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/neon-tables-view-1024x559-728ccc9f.jpg)

## Add Authentication to your Next.js Application using Clerk

The Next.js documentation provides a comprehensive [overview of authentication, session management, and authorization](https://nextjs.org/docs/app/building-your-application/authentication) with sample code. This requires writing a non-trivial amount of code and middleware. Since you’re using Clerk, it will handle this complexity for you!

To start, install Clerk’s Next.js package and add it to your Next.js project’s dependencies.

```bash
npm install @clerk/nextjs
```

Update your _layout.tsx_ file to use the [`ClerkProvider`](https://clerk.com/docs/components/clerk-provider) and [`UserButton`](https://clerk.com/docs/components/user/user-button) from the `@clerk/nextjs package`. The `ClerkProvider` provides access to the current session and user context. The `UserButton` renders a component that shows the user’s profile picture, provides access to account management, and a sign-out button.

```jsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="p-4 bg-white">
            <UserButton showName={true}></UserButton>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

Next, create a file named _src/middleware.ts_, and add the `authMiddleware` provided by Clerk as shown in the following snippet.

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that should be accessible without signing in can
  // be defined as strings in this array, e.g, your home page
  publicRoutes: []
});

export const config = {
  // Protects all routes, including api/trpc:
  // https://clerk.com/docs/references/nextjs/auth-middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

Lastly, add the API keys provided in Next.js format on the Clerk dashboard to your _.env.local_ file.

```bash
# Copy these from https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_youruniquevalue
CLERK_SECRET_KEY=sk_test_youruniquevalue
```

Start your application using the npm run dev command, and visit [https://localhost:3000](https://localhost:3000) in your web browser. If you’re prompted to sign in to your application, everything is going as planned!

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/clerk-app-signin-1024x557-136fb295.jpg)

## Store Data in Postgres associated with a Clerk User ID

The final step in the process is to add some interactivity to your application. You will let users store their favorite quote in your Neon Postgres database. This will involve defining [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) and a [Server Component](https://nextjs.org/docs/app/building-your-application/rendering/server-components) that uses them.

Start by creating a file named _src/app/actions.ts_ and add the following code to define `createUserMessage` and `deleteUserMessage` actions. Both actions obtain the user ID from the current session using [Clerk’s currentUser helper](https://clerk.com/docs/references/nextjs/current-user).

```typescript
'use server';

import { currentUser } from "@clerk/nextjs";
import { UserMessages } from "./db/schema";
import { db } from "./db";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function createUserMessage(formData: FormData) {
  const user = await currentUser()
  if (!user) throw new Error('User not found');

  const message = formData.get('message') as string;

  await db.insert(UserMessages).values({
    user_id: user.id,
    message
  });

  redirect('/');
}

export async function deleteUserMessage() {
  const user = await currentUser()
  if (!user) throw new Error('User not found');

  await db.delete(UserMessages).where(eq(UserMessages.user_id, user.id));

  redirect('/');
}
```

Add the following code to _src/app/page.tsx_ to create a minimalist web page that uses your actions. This enables users to create or delete a quote associated with their user ID. If you recall the schema you defined earlier using Drizzle ORM, it uses the user ID as the primary key. This means each user can store a single quote.

```jsx
import { createUserMessage, deleteUserMessage } from "./actions";
import { db } from "./db";
import { currentUser } from "@clerk/nextjs/server";

async function getUserMessage() {
  const user = await currentUser();

  if (!user) throw new Error('User not found');

  return db.query.UserMessages.findFirst({
    where: (messages, { eq }) => eq(messages.user_id, user.id)
  });
}

export default async function Home() {
  const existingMessage = await getUserMessage();

  const ui = existingMessage ? (
    <div className="w-2/3 text-center">
      <h1 className="text-3xl">{existingMessage.message}</h1>
      <form action={deleteUserMessage} className="w-full rounded px-8 pt-6 pb-8 mb-4">
        <div className="w-full text-center">
          <input type="submit" value={"Delete Quote"} className="bg-[#00E699] transition-colors hover:bg-[#00e5BF] text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none cursor-pointer"/>
        </div>
      </form>
    </div>
  ) : (
    <form action={createUserMessage} className="shadow-md w-2/3 rounded px-8">
      <div className="mb-6">
        <input type="text" name="message" placeholder="Mistakes are the portals of discovery - James Joyce" className="text-center appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none" />
      </div>
      <div className="w-full text-center">
        <input type="submit" value={"Save Message"} className="bg-[#00E699] cursor-pointer transition-colors hover:bg-[#00e5BF] text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none"/>
      </div>
    </form>
  );

  return (
    <main className="flex -mt-16 min-h-screen flex-col align-center justify-center items-center px-24">
      <h2 className="text-2xl pb-6 text-gray-400">{existingMessage ? 'Your quote is wonderful...' : 'Save an inspiring quote for yourself...'}</h2>
      {ui}
    </main>
  );
}
```

Start your application using `npm run dev`, visit [https://localhost:3000](https://localhost:3000), and sign in using one of your chosen providers. You will be redirected to your application after signing in. The application displays a web page that contains an input field where you can submit a quote to associate with your user account and a lovely header with your username and profile picture powered by Clerk’s `UserButton` component.

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/next-app-with-auth-1024x607-33254ed0.jpg)

Type in your favorite quote, for example, “To infinity and beyond!” by Buzz Lightyear. Click the **Save Quote** button or press Enter to save your quote. When you visit [https://localhost:3000](https://localhost:3000) in the future, the quote associated with your user ID will be displayed.

![Image](https://cdn.neonapi.io/public/images/pages/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon/next-app-quote-1024x591-de1e144c.jpg)

## Conclusion

Congratulations, you’ve built a Next.js application that integrates with Clerk for user management and authentication and uses Neon’s serverless Postgres as its database.

Now that you’ve got an application up and running, you should visit [Clerk’s Next.js documentation to learn how to deploy your application to production](https://clerk.com/docs/quickstarts/nextjs#next-steps). You can use Neon’s Vercel Integration to manage development and preview database branches when you deploy your Next.js application on Vercel, which uses Neon’s serverless Postgres.

We would love to get your feedback. Follow us on [X](https://twitter.com/neondatabase), join us on [Discord](https://neon.tech/discord), and let us know how we can help you build the next generation of applications.
