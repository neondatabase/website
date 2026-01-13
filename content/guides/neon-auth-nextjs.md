---
title: Getting started with Neon Auth and Next.js
subtitle: Learn how to setup Neon Auth in a Next.js application
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-12-26T00:00:00.000Z'
updatedOn: '2025-12-26T00:00:00.000Z'
---

This guide walks you through building a demo todo application with **Next.js**, [Neon Auth](/docs/auth/overview), and **Drizzle ORM**. By following along, you’ll learn how to integrate Neon Auth into your Next.js projects and manage database interactions with Drizzle ORM.

The guide primarily focuses on using **Server actions** to securely handle authentication and database operations. [Optional steps](#optional-accessing-user-data-elsewhere) are included at the end of the guide to demonstrate additional ways of retrieving user information in a Next.js app (e.g., server components, client components, API routes).

By the end, you’ll have a fully functional todo application where users can sign up, log in, and manage their todos. Authentication and session management are powered by Neon Auth, while Drizzle ORM handles database interactions.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version `18` or later installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **Neon account:** A free Neon account. If you don't have one, sign up at [Neon](https://console.neon.tech/signup).

<Steps>

## Create a Neon project with Neon Auth

You'll need to create a Neon project and enable Neon Auth.

1.  **Create a Neon project:** Navigate to [pg.new](https://pg.new) to create a new Neon project. Give your project a name, such as `next-neon-todo`.
2.  **Enable Neon Auth:**
    - In your project's dashboard, go to the **Neon Auth** tab.
    - Click on the **Enable Neon Auth** button to set up authentication for your project.

3.  **Copy your credentials:**
    - **Auth URL:** Found on the **Auth** page (e.g., `https://ep-xxx.neon.tech/neondb/auth`).
      ![Neon Auth URL](/docs/auth/neon-auth-base-url.png)
    - **Database Connection String:** Found on the **Dashboard** (select "Pooled connection").
      ![Connection modal](/docs/connect/connection_details.png)

## Set up the Next.js project

Create a new Next.js project and install dependencies.

1.  **Initialize the app:**

    ```bash
    npx create-next-app@latest next-neon-todo --yes
    cd next-neon-todo
    ```

2.  **Install dependencies:**

    ```bash
    npm install @neondatabase/neon-js @neondatabase/serverless drizzle-orm
    npm install -D drizzle-kit dotenv @types/node
    ```

## Configure environment variables

Create a `.env` file in the root of your project.

```env
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
NEON_AUTH_BASE_URL="https://ep-xxx.neon.tech/neondb/auth"
```

## Set up Drizzle ORM

Drizzle ORM helps manage your database schema and queries. Alternatively, you can use any Postgres client of your choice.

The core logic is to filter data based on the authenticated user provided by Neon Auth while performing database operations.

### Create Drizzle config

Create `drizzle.config.ts` in the root of your project:

```typescript
import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './app/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public', 'neon_auth'],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

This config tells Drizzle Kit where to find your database schema and where to output migration files. The `schemaFilter` is configured to look at both the `public` and `neon_auth` schemas. The `neon_auth` schema is where Neon Auth stores its user data.

### Pull Neon Auth schema

A key feature of Neon Auth is the automatic creation and maintenance of the Better Auth tables within the `neon_auth` schema. Since these tables reside in your Neon database, you can work with them directly using SQL queries or any Postgres‑compatible ORM, including defining foreign key relationships.

To integrate Neon Auth tables into your Drizzle ORM setup, you need to introspect the existing `neon_auth` schema and generate the corresponding Drizzle schema definitions.

This step is crucial because it makes Drizzle aware of the Neon Auth tables, allowing you to create relationships between your application data (like the `todos` table) and the user data managed by Neon Auth.

1.  **Introspect the database:**
    Run the Drizzle Kit `pull` command to generate a schema file based on your existing Neon database tables.

    ```bash
    npx drizzle-kit pull
    ```

    This command connects to your Neon database, inspects its structure, and creates `schema.ts` and `relations.ts` files inside a new `drizzle` folder. This file will contain the Drizzle schema definition for the Neon Auth tables.

2.  **Organize schema files:**
    Create a new directory `app/db`. Move the generated `schema.ts` and `relations.ts` files from the `drizzle` directory to `app/db/schema.ts` and `app/db/relations.ts` respectively.

    ```
     ├ 📂 drizzle
     │ ├ 📂 meta
     │ ├ 📜 migration.sql
     │ ├ 📜 relations.ts ────────┐
     │ └ 📜 schema.ts ───────────┤
     ├ 📂 app                    │
     │ ├ 📂 db                   │
     │ │ ├ 📜 relations.ts <─────┤
     │ │ └ 📜 schema.ts <────────┘
     │ └ 📜 App.tsx
     └ …
    ```

3.  **Add the Todos table to your schema**

    Open `app/db/schema.ts` to view the `neon_auth` tables that Drizzle generated from your existing Neon database schema. At the bottom of the file, append the `todos` table definition as shown below:

    ```typescript {9,39-49} shouldWrap
    import {
      pgTable,
      pgSchema,
      uuid,
      text,
      timestamp,
      unique,
      boolean,
      bigint,
    } from 'drizzle-orm/pg-core';
    import { sql } from 'drizzle-orm';

    export const neonAuth = pgSchema('neon_auth');

    // .. other Neon Auth table definitions ..

    export const userInNeonAuth = neonAuth.table(
      'user',
      {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        email: text().notNull(),
        emailVerified: boolean().notNull(),
        image: text(),
        createdAt: timestamp({ withTimezone: true, mode: 'string' })
          .default(sql`CURRENT_TIMESTAMP`)
          .notNull(),
        updatedAt: timestamp({ withTimezone: true, mode: 'string' })
          .default(sql`CURRENT_TIMESTAMP`)
          .notNull(),
        role: text(),
        banned: boolean(),
        banReason: text(),
        banExpires: timestamp({ withTimezone: true, mode: 'string' }),
      },
      (table) => [unique('user_email_key').on(table.email)]
    );

    export const todos = pgTable('todos', {
      id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
      text: text('text').notNull(),
      completed: boolean('completed').notNull().default(false),
      userId: uuid('user_id')
        .notNull()
        .references(() => userInNeonAuth.id),
      createdAt: timestamp('created_at').defaultNow(),
    });

    export type Todo = typeof todos.$inferSelect;
    ```

    The `todos` table contains the following columns: `id`, `text`, `completed`, and `user_id`. It is linked to the `user` table in the `neon_auth` schema via a foreign key relationship on the `user_id` column.

### Generate and apply migrations

Now, generate the SQL migration file to create the `todos` table.

```bash
npx drizzle-kit generate
```

This creates a new SQL file in the `drizzle` directory. Apply this migration to your Neon database by running:

<Admonition type="important" title="Issue with commented migrations">
This is a [known issue](https://github.com/drizzle-team/drizzle-orm/issues/4851) in Drizzle. If `drizzle-kit pull` generated an initial migration file (e.g., `0000_...sql`) wrapped in block comments (`/* ... */`), `drizzle-kit migrate` may fail with an `unterminated /* comment` error.

To resolve this, manually delete the contents of the `0000_...sql` file or replace the block comments with line comments (`--`).
</Admonition>

```bash
npx drizzle-kit migrate
```

Your `todos` table now exists in your Neon database. You can verify this in the **Tables** section of your Neon project dashboard.

### Initialize database client

Create `app/db/index.ts` to initialize the Drizzle ORM client.

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

Now you have Drizzle ORM set up with Neon Auth and a `todos` table ready for use in your Next.js application.

## Set up Neon Auth

Integrate Neon Auth into your Next.js application for authentication and session management.

### Create Auth client

Create a file `lib/auth/client.ts` at the root of your project to initialize the Neon Auth client.

```typescript
'use client';
import { createAuthClient } from '@neondatabase/neon-js/auth/next';

export const authClient = createAuthClient();
```

### Create API route

Create `app/api/auth/[...path]/route.ts`. This file will handle authentication API requests on the server side.

```typescript
import { authApiHandler } from '@neondatabase/neon-js/auth/next/server';

export const { GET, POST } = authApiHandler();
```

### Add Neon Auth UI provider

Update `app/layout.tsx` to wrap your application with the `NeonAuthUIProvider`, which supplies authentication context and UI components.

This setup also adds a global header containing a `UserButton` from [Neon Auth UI components](/docs/auth/reference/ui-components) for account management, ensuring the header is visible across all pages.

```tsx shouldWrap
import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider, UserButton } from '@neondatabase/neon-js/auth/react/ui';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NeonAuthUIProvider authClient={authClient} emailOTP social={{ providers: ['google'] }}>
          <header className="flex h-16 items-center justify-between border-b p-4">
            <h1 className="text-xl font-bold">Next.js Neon Todo</h1>
            <UserButton size={'icon'} />
          </header>
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
```

### Add Neon Auth styles

In `app/globals.css`, add the following import statement directly below the `@import 'tailwindcss';` line.

This ensures that the required Tailwind styles for Neon Auth UI components are included.

```css {2}
@import 'tailwindcss';
@import '@neondatabase/neon-js/ui/tailwind';

/* ... your existing styles ... */
```

### Create Auth pages

Create the specific pages for signing in and managing accounts using Neon's pre-built UI components.

1.  **Auth page:**

    Create `app/auth/[path]/page.tsx`. This page will render the Neon Auth sign-in/sign-up UI.

    ```tsx shouldWrap
    import { AuthView } from '@neondatabase/neon-js/auth/react/ui';

    export const dynamicParams = false;

    export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
      const { path } = await params;

      return (
        <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
          <AuthView path={path} />
        </main>
      );
    }
    ```

2.  **Account page:**

    Create `app/account/[path]/page.tsx`. This page renders the Neon Auth account management UI, including features such as profile settings, password updates, and more.

    ```tsx shouldWrap
    import { AccountView } from '@neondatabase/neon-js/auth/react/ui';
    import { accountViewPaths } from '@neondatabase/neon-js/auth/react/ui/server';

    export const dynamicParams = false;

    export function generateStaticParams() {
      return Object.values(accountViewPaths).map((path) => ({ path }));
    }

    export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
      const { path } = await params;

      return (
        <main className="container p-4 md:p-6">
          <AccountView path={path} />
        </main>
      );
    }
    ```

## Create server actions

You will use Server Actions to handle database operations securely on the server side. These actions will ensure that only authenticated users can access and modify their todos.

Create `app/actions.ts` with the following content:

```typescript shouldWrap
'use server';

import { neonAuth } from '@neondatabase/neon-js/auth/next/server';
import { db } from '@/app/db';
import { todos } from '@/app/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function getAuthUser() {
  const { user } = await neonAuth();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function getTodos() {
  const user = await getAuthUser();
  return db.select().from(todos).where(eq(todos.userId, user.id)).orderBy(desc(todos.createdAt));
}

export async function addTodo(formData: FormData) {
  const user = await getAuthUser();
  const text = formData.get('text') as string;
  if (!text) return;

  await db.insert(todos).values({ text, userId: user.id });

  revalidatePath('/');
}

export async function toggleTodo(id: number, currentStatus: boolean) {
  const user = await getAuthUser();

  await db
    .update(todos)
    .set({ completed: !currentStatus })
    .where(and(eq(todos.id, id), eq(todos.userId, user.id)));

  revalidatePath('/');
}

export async function deleteTodo(id: number) {
  const user = await getAuthUser();

  await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, user.id)));

  revalidatePath('/');
}
```

The file defines five Server Actions that handle authentication and database operations:

1. `getAuthUser()`
   - Calls `neonAuth()` to get the current user.
   - Throws an error if no user is authenticated.
   - Used internally by all other actions to enforce authentication.

2. `getTodos()`
   - Retrieves todos belonging to the authenticated user.
   - Filters by `userId` and orders results by `createdAt` in descending order.
   - Ensures users only see their own todos.

3. `addTodo(formData)`
   - Extracts the `text` field from submitted form data.
   - Inserts a new todo linked to the authenticated user.
   - Calls `revalidatePath('/')` to refresh the UI after insertion.

4. `toggleTodo(id, currentStatus)`
   - Flips the `completed` status of a todo.
   - Ensures the update only applies to the authenticated user’s todo (via `userId` check).
   - Revalidates the path to update the UI.

5. `deleteTodo(id)`
   - Deletes a todo by its ID.
   - Restricts deletion to the authenticated user’s own todos.
   - Revalidates the path to reflect changes in the UI.

## Create middleware for protected routes

To protect certain routes and ensure only authenticated users can access them, create a middleware file. In this case, you'll protect the main page (`/`).

Create `proxy.ts` in the root of your project with the following content:

```typescript
import { neonAuthMiddleware } from '@neondatabase/neon-js/auth/next/server';

export default neonAuthMiddleware({
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: ['/'],
};
```

The middleware uses `neonAuthMiddleware` to check if a user is authenticated when accessing the root path (`/`). If not authenticated, the user is redirected to the sign-in page (`/auth/sign-in`).

## Create frontend components

Create the main page and components to display and manage todos.

1.  **Todo Item component:**

    Create `app/components/TodoItem.tsx` with the following content:

    ```tsx shouldWrap
    'use client';
    import { toggleTodo, deleteTodo } from '../actions';
    import { Todo } from '@/app/db/schema';

    export function TodoItem({ todo }: { todo: Todo }) {
      return (
        <li className="bg-gray-50 dark:bg-gray-800 mb-2 flex items-center justify-between rounded p-3">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => toggleTodo(todo.id, todo.completed)}
          >
            <input type="checkbox" checked={todo.completed} readOnly className="cursor-pointer" />
            <span className={todo.completed ? 'text-gray-500 line-through' : ''}>{todo.text}</span>
          </div>
          <button onClick={() => deleteTodo(todo.id)} className="text-red-400 hover:text-red-600">
            Delete
          </button>
        </li>
      );
    }
    ```

    The TodoItem component displays an individual todo item with a checkbox to toggle its completion status and a delete button. It uses the `toggleTodo` and `deleteTodo` server actions to perform these operations.

2.  **Main page:**

    Update `app/page.tsx` with the following content:

    ```tsx shouldWrap
    import { getTodos, addTodo } from '@/app/actions';
    import { TodoItem } from '@/app/components/TodoItem';

    export default async function Home() {
      const todos = await getTodos();

      return (
        <main className="dark:bg-gray-900 mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-bold">My Tasks</h2>

          <form action={addTodo} className="mb-6 flex gap-2">
            <input
              name="text"
              type="text"
              placeholder="Add a new task..."
              className="flex-1 rounded border p-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-white"
            >
              Add
            </button>
          </form>

          <ul>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
            {todos.length === 0 && <p className="text-gray-500 text-center">No tasks yet.</p>}
          </ul>
        </main>
      );
    }
    ```

    This page fetches the authenticated user's todos using the `getTodos` server action and displays them.
    Since it is protected by the middleware, only logged-in users can access it. It also includes a form to add new todos using the `addTodo` server action.

## Run the application

1.  Start the development server:

    ```bash
    npm run dev
    ```

2.  Open `http://localhost:3000`.
3.  You will be redirected to the Sign In page.
4.  Once logged in, you can manage your todos.

    ![Todo App Screenshot](/docs/guides/neon-auth-nextjs-todo-demo.png)

</Steps>

## Optional: Accessing user data elsewhere

While this guide focused on **Server Actions** to handle data, your application might need to access the user's session in other contexts, such as rendering a user profile on the server, reacting to session changes on the client, or securing a REST API endpoint.

Here is how you can retrieve user information across different parts of the Next.js stack:

<Tabs labels={["Server components", "Client components", "API Routes"]}>

<TabItem>

**Server components (RSC)**

In Server components, you can access session data using the `neonAuth` helper to retrieve the current `session` and `user` objects. This is ideal for initial page loads and conditional rendering based on auth state.

Create `app/server-profile/page.tsx`:

```tsx
import { neonAuth } from '@neondatabase/neon-js/auth/next/server';

export default async function ServerProfilePage() {
  const { session, user } = await neonAuth();

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Server-Side Profile</h1>

      <div className="bg-gray-100 dark:bg-gray-800 rounded p-4">
        <p>
          <strong>Status:</strong> {session ? '✅ Authenticated' : '❌ Guest'}
        </p>
        {user && (
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
        )}
        {user && (
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        )}
      </div>

      <pre className="overflow-auto rounded bg-black p-4 text-xs text-white">
        {JSON.stringify({ session, user }, null, 2)}
      </pre>
    </div>
  );
}
```

</TabItem>

<TabItem>

**Client components**

For interactive components that need to react to authentication state changes (like showing a loading spinner while checking a session), use the `authClient.useSession()` hook.

Create `app/client-profile/page.tsx`:

```tsx
'use client';

import { authClient } from '@/lib/auth/client';

export default function ClientProfilePage() {
  // The hook automatically updates if the session changes
  const { data, isPending, error } = authClient.useSession();

  if (isPending) return <div className="p-6">Loading session...</div>;

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Client-Side Profile</h1>

      <div className="bg-gray-100 dark:bg-gray-800 rounded p-4">
        <p>
          <strong>Status:</strong> {data?.session ? '✅ Authenticated' : '❌ Guest'}
        </p>
        {data?.user && (
          <p>
            <strong>User ID:</strong> {data.user.id}
          </p>
        )}
      </div>

      <pre className="overflow-auto rounded bg-black p-4 text-xs text-white">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
```

</TabItem>

<TabItem>

**API routes (route handlers)**

You can also secure API routes by validating the session using `neonAuth()` within your route handlers. This is useful for building RESTful endpoints that require authentication.

Create `app/api/profile/route.ts`:

```tsx
import { neonAuth } from '@neondatabase/neon-js/auth/next/server';
import { NextResponse } from 'next/server';

export async function GET() {
  // Validate session on the server
  const { session, user } = await neonAuth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Secure data retrieved',
    user: user,
  });
}
```

</TabItem>
</Tabs>

## Deploying the application

When you’re ready to deploy your Next.js application, you can use any platform that supports Next.js, such as Vercel, Netlify or VPS providers. Be sure to configure the required environment variables (`DATABASE_URL` and `NEON_AUTH_BASE_URL`) in your deployment settings.

After deployment, add your production URLs to the **Your trusted domains** section in the Neon Auth settings to ensure authentication functions correctly.

## Conclusion

In this guide, you built a secure Todo application using Next.js, Neon Auth, and Drizzle ORM. You learned how to configure Neon Auth for user authentication, define your database schema with Drizzle ORM, and use Server Actions to securely handle authentication and database operations.

With this foundation, you can create applications that require secure user authentication and data management using Neon Auth and Next.js.

Before deploying to production, be sure to review the [Neon Auth production checklist](/docs/auth/production-checklist).

## Source code

The complete source code for this example is available on GitHub.

<DetailIconCards>
<a href="https://github.com/dhanushreddy291/next-neon-todo" description="Complete source code for the Next.js Todo example built with Neon Auth and Drizzle ORM." icon="github">Next.js Neon Todo Example</a>
</DetailIconCards>

## Resources

- [Neon Auth Overview](/docs/neon-auth/overview)
- [Use Neon Auth with Next.js](/docs/auth/quick-start/nextjs)
- [Neon Auth UI components](/docs/auth/reference/ui-components)

<NeedHelp />
