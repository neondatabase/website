---
title: Getting started with Neon Auth and Next.js
subtitle: Build a Next.js todo app using Neon Auth and Drizzle ORM
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-08-11T00:00:00.000Z'
updatedOn: '2025-08-11T00:00:00.000Z'
---

[Neon Auth](/docs/neon-auth/overview) integrates user authentication directly with your Neon Postgres database, solving a common development challenge: keeping user data synchronized between systems. Instead of building and maintaining custom sync logic or webhook handlers, Neon Auth automatically populates and updates a `neon_auth.users_sync` table in your database in real-time. This allows you to treat user profiles as regular database rows, ready for immediate use in SQL joins and application logic.

This guide will walk you through building a simple todo application using Next.js, Neon Auth, and Drizzle ORM. You'll learn how to:

- Set up a Next.js project and enable Neon Auth.
- Integrate Neon Auth to add sign-up, sign-in, and sign-out functionality.
- Use Drizzle ORM to interact with the `neon_auth.users_sync` table.
- Create protected server actions using Neon Auth.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version `18` or later installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **Neon account:** A free Neon account. If you don't have one, sign up at [Neon](https://console.neon.tech/signup).

<Steps>

## Set up the Next.js project

To get started, create a new Next.js project. Open your terminal and run the following command:

```bash
npx create-next-app@latest neon-auth-todo --typescript --tailwind --use-npm --eslint --app --no-src-dir --import-alias "@/*" --no-turbopack
cd neon-auth-todo
```

This command sets up a new Next.js project with TypeScript, Tailwind CSS, and ESLint configured.

Open the project in your favorite code editor (e.g., VSCode, Cursor, Windsurf).

## Create a Neon project and enable Neon Auth

You'll need to create a Neon project and enable Neon Auth.

1.  **Create a Neon project:** Navigate to [pg.new](https://pg.new) to create a new Neon project. Give your project a name, such as `neon-auth-todo`.

2.  **Enable Neon Auth:**
    - In your project's dashboard, go to the **Auth** page from the sidebar.
    - Click **Enable Neon Auth**. This will provision the necessary infrastructure for authentication and user management.

    ![Neon Console - Enable Neon Auth button](/docs/guides/enable-neon-auth.png)

3.  **Get environment variables:**
    - After enabling Neon Auth, navigate to the **Configuration** tab on the Auth page.
    - Select **Next.js** as your framework.
    - You will see the required environment variables. Copy the entire block, which includes your Neon Auth keys and the database connection string.

    ![Neon Console - Neon Auth configuration keys for Next.js](/docs/guides/neon-auth-example-config-keys.png)

## Integrate Neon Auth into your app

Now, you will integrate Neon Auth into your Next.js application.

1.  **Run the Neon Auth setup command:**
    In your project's root directory, run the following command to initialize the Neon Auth setup:

    ```bash
    npx @stackframe/init-stack@latest --no-browser
    ```

    > Enter "Y" when prompted to proceed with the installation.

    You should see output similar to this:

    ```
    npx @stackframe/init-stack@latest --no-browser
    Need to install the following packages:
    @stackframe/init-stack@2.8.28
    Ok to proceed? (y) y


          ██████
      ██████████████
    ████████████████████
    ████████████████████                WELCOME TO
    █████████████████        ╔═╗╔╦╗╔═╗╔═╗╦╔═  ┌─┐┬ ┬┌┬┐┬ ┬
    █████████████            ╚═╗ ║ ╠═╣║  ╠╩╗  ├─┤│ │ │ ├─┤
    █████████████   ████     ╚═╝ ╩ ╩ ╩╚═╝╩ ╩  ┴ ┴└─┘ ┴ ┴ ┴
       █████████████████
          ██████      ██
    ████            ████
      █████    █████
          ██████


    ? Found a Next.js project at /home/user/neon-auth-todo/neon-auth-todo — ready to install Stack Auth? Yes

    Installing dependencies...

    npm warn ERESOLVE overriding peer dependency

    added 272 packages, and audited 604 packages in 9s

    164 packages are looking for funding
      run `npm fund` for details

    2 low severity vulnerabilities

    To address all issues, run:
      npm audit fix

    Run `npm audit` for details.
    √ Command npm install @stackframe/stack succeeded

    Writing files...

    √ Done writing files

    Installation succeeded!

    Commands executed:
      npm install @stackframe/stack

    Files written:
      app/layout.tsx
      .env.local
      stack/client.tsx
      stack/server.tsx
      app/handler/[...stack]/page.tsx
      app/loading.tsx

    ===============================================

    Successfully installed Stack! 🚀🚀🚀
    ```

2.  **Configure environment variables:**
    Paste the environment variables you copied from the Neon Auth configuration into the `.env.local` file.

    ```env
    # Neon Auth environment variables for Next.js
    NEXT_PUBLIC_STACK_PROJECT_ID=YOUR_NEON_AUTH_PROJECT_ID
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=YOUR_NEON_AUTH_PUBLISHABLE_KEY
    STACK_SECRET_SERVER_KEY=YOUR_NEON_AUTH_SECRET_KEY

    # Your Neon connection string
    DATABASE_URL=YOUR_NEON_CONNECTION_STRING
    ```

## Set up Drizzle ORM

For database interactions, you will use Drizzle ORM.

1.  **Install Drizzle ORM:**

    ```bash
    npm install drizzle-orm @neondatabase/serverless
    npm install -D drizzle-kit dotenv
    ```

2.  **Create Drizzle config:**
    Create a file named `drizzle.config.ts` in your project root and add the following configuration:

    ```typescript
    import { defineConfig } from 'drizzle-kit';
    import { config } from 'dotenv';

    config({ path: './.env.local' });

    export default defineConfig({
      dialect: 'postgresql',
      schema: './app/db/schema.ts',
      out: './drizzle',
      dbCredentials: {
        url: process.env.DATABASE_URL!,
      },
    });
    ```

    This config tells Drizzle Kit where to find your database schema and where to output migration files.

## Define the application schema

Drizzle ORM provides a built-in helper function to work with Neon Auth's `users_sync` table. Instead of manually defining the schema or pulling it from the database, you can use the `usersSync` helper from `drizzle-orm/neon`.

The most important part of this schema is creating a direct link between a todo and the user who owns it. You will achieve this by establishing a foreign key relationship from your `todos` table to the `users_sync` table.

This schema defines the `todos` table with the following columns:

- **`id`**: A unique, auto-incrementing identifier for each todo.
- **`ownerId`**: A text column that stores the user's ID. This column is configured with a foreign key that `references` the `id` in the `neon_auth.users_sync` table, ensuring data integrity.
- **`task`**: The text content of the todo item.
- **`isComplete`**: A boolean flag to track the todo's status.
- **`insertedAt`**: A timestamp automatically set when a todo is created.

### Create the schema file

Create a `db` directory inside the `app` folder, then add a file named `schema.ts` within it:

```plaintext
app/
  db/
    schema.ts
```

Add the following code to `app/db/schema.ts`:

```typescript
import { pgTable, text, timestamp, bigint, boolean } from 'drizzle-orm/pg-core';
import { usersSync } from 'drizzle-orm/neon';

export const todos = pgTable('todos', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().generatedByDefaultAsIdentity(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => usersSync.id),
  task: text('task').notNull(),
  isComplete: boolean('is_complete').notNull().default(false),
  insertedAt: timestamp('inserted_at', { withTimezone: true }).defaultNow().notNull(),
});
```

The `usersSync` helper from `drizzle-orm/neon` automatically provides the correct schema definition for the `neon_auth.users_sync` table, eliminating the need for manual schema introspection.

### Generate and apply migrations

Now, generate the SQL migration file to create the `todos` table.

```bash
npx drizzle-kit generate
```

This creates a new SQL file in the `drizzle` directory. Apply this migration to your Neon database by running:

```bash
npx drizzle-kit migrate
```

Your `todos` table now exists in your Neon database. You can verify this in the **Tables** section of your Neon project console.

![Neon Auth todos table](/docs/guides/neon-auth-todos-table.png)

## Create the database client

Create a file at `app/db/index.ts` to instantiate the Drizzle client.

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

## Build the application UI

You will create a simple user interface for your todo app using React components.

1.  **Create the Header Component:**
    This component will display sign-in/sign-up links or user information and a sign-out button. Create `app/header.tsx`:

    ```tsx
    'use client';

    import Link from 'next/link';
    import { useStackApp, useUser } from '@stackframe/stack';

    export function Header() {
      const user = useUser();
      const app = useStackApp();

      return (
        <header className="dark:bg-gray-900 fixed left-0 top-0 z-50 w-full bg-white shadow-md">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
            <div className="text-gray-800 dark:text-gray-100 text-xl font-bold tracking-tight">
              My Todo App
            </div>
            <nav>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    Hello{' '}
                    <span className="dark:text-gray-100 font-medium">{user.primaryEmail}</span>
                  </span>
                  <Link
                    href={app.urls.signOut}
                    className="text-red-500 dark:text-red-400 text-sm hover:underline"
                  >
                    Sign Out
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href={app.urls.signIn}
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    Sign In
                  </Link>
                  <span className="text-gray-400 dark:text-gray-500">|</span>
                  <Link
                    href={app.urls.signUp}
                    className="text-green-600 dark:text-green-400 text-sm hover:underline"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>
      );
    }
    ```

    The `useUser()` hook provides the current user's state, while `useStackApp()` provides access to utility URLs like `signIn` and `signOut`.

    <Admonition type="info" title="Neon Auth Hooks">
      The Neon Auth SDK for Next.js offers a comprehensive set of hooks to manage authentication and user data throughout your application. It provides distinct tools tailored for different rendering environments, such as the `useUser` hook for Client Components and the `stackServerApp` object for server-side logic.

    To explore the full API, including hooks for more advanced features like handling teams and permissions, refer to the [Neon Auth: Next.js SDK Overview](/docs/neon-auth/sdk/nextjs/overview).
    </Admonition>

2.  **Create the Todo components:**

    For all CRUD operations, you'll use server actions to securely handle form submissions and update the database directly from your Next.js components. The implementation details of these server actions will be covered later in the guide.

    Create a new file `app/todos.tsx` to define the form for adding todos and the list to display them.

    ```tsx
    import { addTodo, toggleTodo, deleteTodo } from '@/app/actions/todoActions';
    import { stackServerApp } from '@/stack/server';
    import { revalidatePath } from 'next/cache';

    type Todo = {
      id: bigint;
      task: string;
      isComplete: boolean;
    };

    export async function TodoForm() {
      const user = await stackServerApp.getUser();

      if (!user) {
        return (
          <p className="text-gray-500 mt-4 text-center">Please log in to manage your todos.</p>
        );
      }

      return (
        <form
          action={async (formData) => {
            'use server';
            await addTodo(formData.get('task') as string);
            revalidatePath('/');
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            name="task"
            placeholder="New todo"
            className="flex-1 rounded-md border px-2 py-1"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 rounded-md px-3 py-1 text-white"
          >
            Add
          </button>
        </form>
      );
    }

    export function TodoList({ todos }: { todos: Todo[] }) {
      if (todos.length === 0) {
        return <p className="text-gray-500 mt-8 text-center">No todos yet. Add one above!</p>;
      }

      return (
        <ul className="mt-4 space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id.toString()}
              className="flex items-center justify-between border-b py-2"
            >
              <span className={todo.isComplete ? 'text-gray-400 line-through' : ''}>
                {todo.task}
              </span>
              <div className="flex gap-2">
                <form
                  action={async () => {
                    'use server';
                    await toggleTodo(todo.id, !todo.isComplete);
                    revalidatePath('/');
                  }}
                >
                  <button type="submit" className="text-green-500 hover:text-green-700 text-sm">
                    {todo.isComplete ? 'Undo' : 'Done'}
                  </button>
                </form>
                <form
                  action={async () => {
                    'use server';
                    await deleteTodo(todo.id);
                    revalidatePath('/');
                  }}
                >
                  <button type="submit" className="text-red-500 hover:text-red-700 text-sm">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      );
    }
    ```

    The above code defines two main components for managing todos: `TodoForm` and `TodoList`.
    - `TodoForm` is a form for adding new todos. It checks if the user is logged in and, if so, allows them to submit a new todo item. On submission, it calls the `addTodo` server action and refreshes the page to show the updated list.

    - `TodoList` displays the current user's todos. Each todo item has buttons to mark it as complete/incomplete or delete it. These actions are handled by the `toggleTodo` and `deleteTodo` server actions, respectively. The UI updates automatically after each action, and if there are no todos, a message prompts the user to add one.

3.  **Create the main page:**
    Replace the content of `app/page.tsx` with the following code. This will be the main page that displays the todo list and the form to add new todos.

    ```tsx
    import { getTodos } from '@/app/actions/todoActions';
    import { stackServerApp } from '@/stack/server';
    import { Header } from './header';
    import { TodoForm, TodoList } from './todos';

    export default async function HomePage() {
      const todos = await getTodos();

      return (
        <main className="mx-auto max-w-lg p-6 pt-24">
          <Header />
          <h1 className="mb-4 text-2xl font-bold">My Todos</h1>
          <TodoForm />
          <TodoList todos={todos} />
        </main>
      );
    }
    ```

## Implement server actions

To manage todos, you need to create server actions that will handle the database operations. These actions will be responsible for adding, retrieving, updating, and deleting todos.

Create a new file `app/actions/todoActions.ts`:

```typescript
'use server';

import { db } from '@/app/db';
import { todos } from '@/app/db/schema';
import { stackServerApp } from '@/stack/server';
import { eq, desc, and } from 'drizzle-orm';

export async function addTodo(task: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Not authenticated');

  await db.insert(todos).values({
    task,
    ownerId: user.id,
  });
}

export async function getTodos() {
  const user = await stackServerApp.getUser();
  if (!user) return [];

  return db.select().from(todos).where(eq(todos.ownerId, user.id)).orderBy(desc(todos.insertedAt));
}

export async function toggleTodo(id: bigint, isComplete: boolean) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Not authenticated');

  await db
    .update(todos)
    .set({ isComplete })
    .where(and(eq(todos.id, id), eq(todos.ownerId, user.id)));
}

export async function deleteTodo(id: bigint) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Not authenticated');

  await db.delete(todos).where(and(eq(todos.id, id), eq(todos.ownerId, user.id)));
}
```

In each action, `stackServerApp.getUser()` retrieves the currently logged-in user. If no user is found, the action either fails or returns an empty state. This ensures that all database operations are securely tied to the authenticated user's ID.

## Run and test the application

You are now ready to run your application.

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

2.  **Test the app:**
    - Open your browser to `http://localhost:3000`.
    - You will see the header with "Sign In" and "Sign Up" links.
    - Click **Sign Up** to create a new account. You'll be redirected to the signup page.
      ![Neon Auth todo app signup page](/docs/guides/neon-auth-todo-app-signup.png)

      > Sign up using one of the available OAuth providers (e.g., Google, GitHub) or with your email address.

    - After signing up, you'll be redirected back to the app, now logged in.
    - Add, complete, and delete a few todos to test the full functionality.

![Neon Auth Todo App Demo](/docs/guides/neon-auth-todo-app-demo.png)

</Steps>

## Using Neon Auth in production

Before deploying your application to a live environment, you must complete the following security configurations. These steps are crucial to ensure your application is secure and provides a trusted experience for your users.

### Configure production OAuth credentials

The default OAuth providers (e.g., Google, GitHub) use shared, demo credentials. These are strictly for development and testing purposes. **Do not use them in production.**

For a live application, you must create and configure your own OAuth credentials for each provider. This ensures your application is secure and displays your own branding on the provider's consent screen, creating a trusted experience for your users.

> **For detailed instructions, see: [Neon Auth: Production OAuth setup](/docs/neon-auth/best-practices#production-oauth-setup)**

### Restrict redirect domains

To prevent malicious actors from hijacking your authentication flows, you must explicitly whitelist the domains your application will use for authentication redirects (e.g., your main website, admin panels).

When a user signs in, Neon Auth will only redirect them to a domain on this approved list. Any attempts to redirect to an unlisted domain will be blocked, protecting your users from phishing attacks and other security threats.

> **For detailed steps, see: [Neon Auth best practices: Restricting redirect domains](/docs/neon-auth/best-practices#restricting-redirect-domains)**

### Set up a custom email server

By default, Neon Auth sends transactional emails (like email verification and password resets) from a shared server using the `noreply@stackframe.co` address. For a production application, this can appear unprofessional and may cause emails to be filtered as spam.

To ensure a trusted user experience and improve email deliverability, you should configure Neon Auth to send emails from your own domain using a custom SMTP server.

> **For instructions, see: [Neon Auth best practices: Email server setup](/docs/neon-auth/best-practices#email-server)**

### Claim your project for Advanced configuration

Neon Auth is powered by [Stack Auth](https://stack-auth.com/), providing a managed authentication experience directly within the Neon Console. While most features can be used out of the box, you may need more advanced control for certain production use cases.

For advanced configurations or to add OAuth providers beyond the defaults (Github and Google), you can claim your project. Claiming moves the project's management from Neon to your direct control within the Stack Auth dashboard.

You should consider claiming your project if you need to:

- **Add new OAuth providers** (e.g., Spotify, Discord, Apple etc) and manage their unique client IDs/secrets.
- **Enable production mode** to enforce stricter security settings required for a live application.
- **Manage multiple environments** (e.g., development, staging, production) directly within the Stack Auth interface.

> **For more information, see: [Claiming a Neon Auth project](/docs/neon-auth/claim-project)**

## Advanced features

You've now built a basic application with Neon Auth. This is just the beginning. Neon Auth also provides more advanced capabilities for complex applications:

- **[Teams and organizations](/docs/neon-auth/concepts/orgs-and-teams):** Group users into teams to manage access and permissions for B2B applications or collaborative projects.
- **[App/User RBAC permissions](/docs/neon-auth/concepts/permissions):** Implement fine-grained Role-Based Access Control (RBAC) with both team-specific and global (project-level) permissions.
- **[Custom user data](/docs/neon-auth/concepts/custom-user-data):** Store additional information on user objects using different metadata fields (`clientMetadata`, `serverMetadata`, `clientReadOnlyMetadata`) to control data visibility and mutability between the client and server.

## Summary

Congratulations! You've successfully built a full-stack, secure todo application with Next.js and Neon Auth. You learned how to seamlessly integrate authentication, leverage the automatic user data sync with `neon_auth.users_sync`, and protect server-side logic using a unified auth and database solution.

Neon Auth handles the complexity of user management and data synchronization, allowing you to focus on building your application's core features.

## Resources

- [Neon Auth Overview](/docs/neon-auth/overview)
- [How Neon Auth works](/docs/neon-auth/how-it-works)
- [Neon Auth Best Practices & FAQ](/docs/neon-auth/best-practices)
- [Neon Auth: Next.js SDK Overview](/docs/neon-auth/sdk/nextjs/overview)
- [Neon Auth Components](/docs/neon-auth/components/components)

<NeedHelp/>
