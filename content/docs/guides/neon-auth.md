---
title: Neon Auth
subtitle: Add authentication to your project. Access user data directly in your Postgres
  database.
enableTableOfContents: true
redirectFrom:
  - /docs/guides/neon-identity
tag: beta
updatedOn: '2025-05-16T19:06:06.843Z'
---

Neon Auth lets you add authentication to your app in seconds — user data is synced directly to your Neon Postgres database, so you can query and join it just like any other table.

<FeatureBetaProps feature_name="Neon Auth" />

<Steps>

## Add Neon Auth to a project

Go to [pg.new](https://pg.new) to create a new Neon project.

Once your project is ready, open your project's **Auth** page. Neon Auth is ready for you to get started.

Click **Setup instructions** to continue.

![Neon Auth Console - Ready for users](/docs/guides/enable-neon-auth.png)

## Get your Neon Auth keys

In the **Setup instructions** tab, click **Set up Auth**.

This gets you the Neon Auth environment variables and connection string you need to integrate Neon Auth and connect to your database in **Next.js**. If you're using another framework, just change the prefixes as needed (see below).

You can use these keys right away to get started, or [skip ahead](#create-users-in-the-console-optional) to try out **user creation** in the Neon Console.

<Tabs labels={["Next.js", "React", "JavaScript"]}>

<TabItem>

```bash
# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=YOUR_NEON_AUTH_PROJECT_ID
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=YOUR_NEON_AUTH_PUBLISHABLE_KEY
STACK_SECRET_SERVER_KEY=YOUR_NEON_AUTH_SECRET_KEY
# Your Neon connection string
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

<Admonition type="note" title="Are you a Vercel user?">
If you're using the [Neon native integration on Vercel](https://vercel.com/marketplace/neon), the integration automatically sets these environment variables for you in Vercel when you connect a Vercel project to a Neon database. [Learn more](/docs/guides/vercel-native-integration#environment-variables-set-by-the-integration).
</Admonition>


</TabItem>

<TabItem>

```bash
# Neon Auth environment variables for React (Vite)
VITE_STACK_PROJECT_ID=YOUR_NEON_AUTH_PROJECT_ID
VITE_STACK_PUBLISHABLE_CLIENT_KEY=YOUR_NEON_AUTH_PUBLISHABLE_KEY
STACK_SECRET_SERVER_KEY=YOUR_NEON_AUTH_SECRET_KEY
# Your Neon connection string
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

> If you're using Create React App, use the `REACT_APP_` prefix instead of `VITE_`.

</TabItem>

<TabItem>

```bash
# Neon Auth environment variables for JavaScript/Node
STACK_PROJECT_ID=YOUR_NEON_AUTH_PROJECT_ID
STACK_PUBLISHABLE_CLIENT_KEY=YOUR_NEON_AUTH_PUBLISHABLE_KEY
STACK_SECRET_SERVER_KEY=YOUR_NEON_AUTH_SECRET_KEY
# Your Neon connection string
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

</TabItem>

</Tabs>

## Set up your app

Neon Auth works with any framework or language that supports JWTs — Next.js, React, and JavaScript/Node, for example.

**Clone our template** for the fastest way to see Neon Auth in action (Next.js).

```bash shouldWrap
git clone https://github.com/neondatabase-labs/neon-auth-nextjs-template.git
```

Or **add Neon Auth** to an existing project.

<Tabs labels={["Next.js", "React", "JavaScript"]}>

<TabItem>

#### Run the setup wizard

```bash
npx @stackframe/init-stack@latest
```

This sets up auth routes, layout wrappers, and handlers automatically for Next.js (App Router).

#### Use your environment variables

Paste the Neon Auth environment variables from [Step 2](#get-your-neon-auth-keys) into your `.env.local` file.

Then `npm run dev` to start your dev server.

#### Test your integration

Go to [http://localhost:3000/handler/sign-up](http://localhost:3000/handler/sign-up) in your browser. Create a user or two, and you can them [show up immediately](#see-your-users-in-the-database) in your database.

</TabItem>

<TabItem>

#### Install the React SDK

Make sure you have a [React project](https://react.dev/learn/creating-a-react-app) set up. We show an example here of a Vite React project with React Router.

```bash
npm install @stackframe/react
```

#### Use your environment variables

Paste the Neon Auth environment variables from [Step 2](#get-your-neon-auth-keys) into your `.env` or `.env.local` file.

#### Configure Neon Auth client

A basic example of how to set up the Neon Auth client in `stack.ts` in your `src` directory:

```tsx shouldWrap
import { StackClientApp } from '@stackframe/react';
import { useNavigate } from 'react-router-dom';

export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: 'cookie',
  redirectMethod: { useNavigate },
});
```

#### Update your app to use the provider and handler:

In your `src/App.tsx`:

```tsx shouldWrap
import { StackHandler, StackProvider, StackTheme } from '@stackframe/react';
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { stackClientApp } from './stack';

function HandlerRoutes() {
  const location = useLocation();
  return <StackHandler app={stackClientApp} location={location.pathname} fullPage />;
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Routes>
              <Route path="/handler/*" element={<HandlerRoutes />} />
              <Route path="/" element={<div>hello world</div>} />
            </Routes>
          </StackTheme>
        </StackProvider>
      </BrowserRouter>
    </Suspense>
  );
}
```

#### Start your dev server

```bash
npm run dev
```

#### Test your integration

Go to [http://localhost:5173/handler/sign-up](http://localhost:5173/handler/sign-up) in your browser. Create a user or two, and you can them [show up immediately](#see-your-users-in-the-database) in your database.

</TabItem>

<TabItem>

#### Install the JavaScript SDK

```bash
npm install @stackframe/js
```

#### Use your environment variables

Paste the Neon Auth environment variables from [Step 2](#get-your-neon-auth-keys) into your `.env` or `.env.local` file.

#### Configure Neon Auth client

```js
// stack/server.js
import { StackServerApp } from '@stackframe/js';

export const stackServerApp = new StackServerApp({
  projectId: process.env.STACK_PROJECT_ID,
  publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
  tokenStore: 'memory',
});
```

#### Test your integration

1. Create a test user in the Console (see [Step 4](#create-users-in-the-console-optional)) and copy its ID.

2. Create `src/test.ts`:

   ```ts
   import 'dotenv/config';
   import { stackServerApp } from './stack/server.js';

   async function main() {
     const user = await stackServerApp.getUser('YOUR_USER_ID_HERE');
     console.log(user);
   }

   main().catch(console.error);
   ```

3. Run your test script however you like:

   ```bash shouldWrap
   # if you have a dev/test script in package.json
   npm run dev

   # or directly:
   npx dotenv -e .env.local -- tsx src/test.ts
   ```

You should see your test user's record printed in the console.

</TabItem>

</Tabs>

## Create users in the Console (optional)

You can create test users directly from the Neon Console — no app integration required. This is useful for development or testing.

![Create user in Neon Console](/docs/guides/neon_auth_create_user.png)

Now you can [see your users in the database](#see-your-users-in-the-database).

## See your users in the database

As users sign up or log in — through your app or by creating test users in the Console — their profiles are synced to your Neon database in the `neon_auth.users_sync` table.

Query your users table in the SQL Editor to see your new user:

```sql
SELECT * FROM neon_auth.users_sync;
```

| id          | name      | email           | created_at          | updated_at          | deleted_at | raw_json                     |
| ----------- | --------- | --------------- | ------------------- | ------------------- | ---------- | ---------------------------- |
| 51e491df... | Sam Patel | sam@startup.dev | 2025-02-12 19:43... | 2025-02-12 19:46... | null       | `{"id": "51e491df...", ...}` |

</Steps>

## Next steps

Want to learn more or go deeper?

- [How Neon Auth works](/docs/guides/neon-auth-how-it-works) — See a before and after showing the benefits of having your user data right in your database
- [Neon Auth tutorial](/docs/guides/neon-auth-demo) — Walk through our demo app for more examples of how Neon Auth can simplify your code
- [Best Practices & FAQ](/docs/guides/neon-auth-best-practices) — Tips, patterns, and troubleshooting.
- [Neon Auth API Reference](/docs/guides/neon-auth-api) — Automate and manage Neon Auth via the API.
