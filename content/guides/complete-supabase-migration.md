---
title: The Complete Supabase to Neon Database & Auth Migration Guide
subtitle: A comprehensive guide to migrating your Postgres database, user accounts, and RLS policies from Supabase to Neon
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-09-03T00:00:00.000Z'
updatedOn: '2025-09-03T00:00:00.000Z'
---

This guide walks you through migrating your Postgres database, user accounts, and Row-Level Security (RLS) policies from Supabase to Neon. It addresses key differences between the platforms, including the reassignment of `user_id` values during the auth migration, and provides steps to remap IDs, restore data integrity, and update your application code.

### Prerequisites

Before you begin, ensure you have the following:

- An active Supabase project.
- A Neon project. For setup instructions, see [Create a project](/docs/manage/projects#create-a-project).
- The PostgreSQL `psql` and `pg_dump` command-line utilities installed locally.
- A Node.js environment (for running the user import script).

<Steps>

## Part 1: Data and Authentication migration

This part covers the migration of your user accounts and public schema data, followed by remapping user IDs to restore data integrity.

### Step 1: Migrate user accounts from Supabase to Neon Auth

If your project does not use Supabase Auth, you can skip this section.

Supabase Auth is the authentication system used by Supabase. It manages user accounts, passwords, and session tokens.

#### 1.1: Export users and password hashes from Supabase

Connect to your Supabase project using the SQL Editor in the dashboard and run the following SQL function. This function retrieves all user emails and their encrypted **bcrypt** password hashes.

```sql
CREATE OR REPLACE FUNCTION ufn_get_user_emails_and_passwords()
RETURNS table (email text, encrypted_password character varying(255)) AS
$$
BEGIN
RETURN QUERY
   SELECT DISTINCT ON (i.email)
       i.email,
       u.encrypted_password
   FROM auth.users u
   JOIN auth.identities i ON u.id = i.user_id;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT * FROM ufn_get_user_emails_and_passwords();
```

After running the query, export the results as a CSV file and save it locally as `user_data.csv`.

#### 1.2: Set up Neon Auth and Data API

In your Neon project dashboard:

1. Navigate to the **Data API** page from the sidebar.
2. Select **Neon Auth** as the authentication provider.
3. Follow the on-screen instructions to set up **Neon Auth** with the **Neon Data API**.
4. Navigate to the **Neon Auth** section from the sidebar.
5. In the **Configuration** tab, copy your **Project ID** and **Stack Secret Server Key** from the **Environment Variables** section.

#### 1.3: Import Users into Neon Auth

Now, we'll use a Node.js script to import the users from your `user_data.csv` file into Neon Auth.

First, create a new project directory and install the necessary packages:

```bash
npm init -y
npm install csv-parse
```

Copy the `user_data.csv` file to this directory.

Next, create a file named `migrate_users.ts` and add the following script.

> Replace the `YOUR_PROJECT_ID` and `YOUR_SERVER_KEY` placeholders in the `CONFIG` object with your actual Project ID and Server Key, which you copied from the Neon dashboard.

```typescript
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const CONFIG = {
  csvFilePath: './user_data.csv',
  apiUrl: 'https://api.stack-auth.com/api/v1/users',
  headers: {
    'Content-Type': 'application/json',
    'X-Stack-Project-Id': 'YOUR_PROJECT_ID', // Update with your actual keys
    'X-Stack-Secret-Server-Key': 'YOUR_SERVER_KEY', // Update with your actual keys
    'X-Stack-Access-Type': 'server',
  },
  // Delay between requests in ms (to avoid rate limiting)
  requestDelay: 500,
};

const sleep = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

async function migrateUsers() {
  try {
    console.log(`Reading CSV file from ${CONFIG.csvFilePath}...`);
    let fileContent = fs.readFileSync(CONFIG.csvFilePath, 'utf8');

    if (fileContent.charCodeAt(0) === 0xfeff) {
      console.log('Removing UTF-8 BOM from CSV file...');
      fileContent = fileContent.slice(1);
    }

    type UserRecord = { email: string; encrypted_password?: string };
    const records: UserRecord[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    console.log(`Found ${records.length} users to migrate.`);

    let successCount = 0;
    let failureCount = 0;

    for (const [index, user] of records.entries()) {
      try {
        // Extract email and password from CSV record
        const { email, encrypted_password } = user;

        if (!email) {
          console.error(`Row ${index + 1}: Missing email`);
          failureCount++;
          continue;
        }

        const payload: {
          primary_email: string;
          primary_email_verified: boolean;
          primary_email_auth_enabled: boolean;
          password_hash?: string;
        } = {
          primary_email: email,
          primary_email_verified: true,
          primary_email_auth_enabled: true,
        };

        // Include the password_hash in the payload if encrypted_password is provided and not the string "null"
        // (CSV exports represent null values as "null" for OAuth users)
        if (encrypted_password && encrypted_password !== 'null') {
          payload.password_hash = encrypted_password;
        } else {
          console.warn(`Row ${index + 1}: No password hash for ${email}`);
        }

        // Send the request to create the user
        console.log(`[${index + 1}/${records.length}] Creating user: ${email}...`);

        const response = await fetch(CONFIG.apiUrl, {
          method: 'POST',
          headers: CONFIG.headers,
          body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
          console.error(`Failed to create user ${email}: ${JSON.stringify(responseData)}`);
          failureCount++;
        } else {
          console.log(`Successfully created user: ${email}`);
          successCount++;
        }

        // Add delay between requests to avoid rate limiting
        await sleep(CONFIG.requestDelay);
      } catch (error) {
        console.error(
          `Error processing row ${index + 1}:`,
          error instanceof Error ? error.message : String(error)
        );
        failureCount++;
      }
    }

    console.log('\n===== Migration Summary =====');
    console.log(`Total users: ${records.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateUsers()
  .then(() => {
    console.log('====== Migration process completed. ======');
  })
  .catch((err) => {
    console.error('Fatal error:', err);
  });
```

Before running the script, **update the `CONFIG` section** with your Neon Auth Project ID, Server Key, and the correct path to your `user_data.csv` file.

Execute the script from your terminal:

```bash
npx ts-node migrate_users.ts
```

Upon completion, all your users will be migrated into Neon Auth.

<Admonition type="important" title="User IDs Have Changed">
It's important to note that this migration process has assigned **new, unique `user_id`** values to all your users within Neon Auth. In the next steps, we will fix the broken references in your database that result from this change.
</Admonition>

### Step 2: Export the Supabase Public Schema

Use `pg_dump` to export the schema and data from your `public` Supabase schema.

> If your database includes schemas other than `public`, adjust the `--schema` flag accordingly (e.g., `--schema=public --schema=other_schema`).

```shell shouldWrap
pg_dump -v -d "SUPABASE_CONNECTION_STRING" --schema=public --no-acl -f supabase_dump.sql
```

- `-d "..."`: Your full Supabase database connection string.
- `--schema=public`: Dumps only the `public` schema.
- `--no-acl`: Excludes access control lists (`GRANT`/`REVOKE`). We will re-apply these manually.
- `-f ...`: Specifies the output file name.

### Step 3: Pre-process the SQL Dump File

This is a crucial manual step. Open `supabase_dump.sql`, make the following changes, and save it as `supabase_dump.sql`.

#### 3.1. Update RLS policies

Supabase and Neon Auth use different functions to identify the current user. You must replace all instances of `auth.uid()` with `auth.user_id()`.

- **Search for:** `auth.uid()`
- **Replace with:** `auth.user_id()`

**Example:**

```sql
-- BEFORE (Supabase Policy)
CREATE POLICY "Users can access their own todos" ON public.todos FOR SELECT USING ((auth.uid() = user_id));

-- AFTER (Neon-compatible Policy)
CREATE POLICY "Users can access their own todos" ON public.todos FOR SELECT USING ((auth.user_id() = user_id));
```

#### 3.2. Temporarily remove foreign key constraints

Your tables may include foreign key constraints that reference the `auth.users` table. These constraints will fail during the import process because Neon does not have an `auth.users` table.

To handle this:

1. Search your `supabase_dump.sql` file for all `ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY` statements that reference `auth.users`. You can use your text editor's search function for `auth.users`.
2. **Cut** these statements from the file and paste them into a separate temporary text file named `foreign_keys.sql`. You will reapply them in Step 6.

### Step 4: Import the modified data into Neon

Use `psql` to import the edited schema and data into your Neon database.

```shell shouldWrap
psql -d "NEON_CONNECTION_STRING" -f supabase_dump.sql
```

Your tables, data, and RLS policies are now in Neon, but the `user_id` columns still contain old Supabase IDs.

### Step 5: Create a User ID mapping table

To fix the user references, we'll create a temporary table in Neon that maps old Supabase `user_id` values to emails. This command dumps the original `auth.users` data from Supabase, retargets the `INSERT` statements to a new `public.temp_users` table, and pipes it directly into Neon.

```shell shouldWrap
pg_dump -t auth.users --data-only --column-inserts "SUPABASE_CONNECTION_STRING" \
| sed 's/INSERT INTO auth.users/INSERT INTO public.temp_users/g' \
| psql "NEON_CONNECTION_STRING"
```

You now have a `public.temp_users` table in Neon containing the original Supabase `id` and `email` for each user.

### Step 6: Update foreign keys and re-establish relations

Now, we perform the remapping. For each table that contains a `user_id`, run a script to replace the old IDs with the new ones by joining through the user email address.

<Admonition type="tip" title="Which Constraints to Reapply">
Refer to your `foreign_keys.sql` file to identify which constraints need to be reapplied and to which tables.
</Admonition>

**Example script for a `todos` table:** (Repeat this process for every relevant table)

```sql
-- 1. Update the user_id column with the new ID from Neon Auth.
UPDATE
  public.todos AS t
SET
  user_id = ns.id::uuid -- Cast to UUID
FROM
  public.temp_users AS tu
JOIN
  neon_auth.users_sync AS ns
  ON tu.email = ns.email
WHERE
  t.user_id = tu.id;

-- 2. Adjust the column type to match Neon Auth's 'text' user ID type.
ALTER TABLE public.todos ALTER COLUMN user_id TYPE text;

-- 3. Re-add the foreign key constraint, pointing to the new Neon Auth user table.
ALTER TABLE public.todos
ADD CONSTRAINT todos_user_id_fkey -- Use your original constraint name
FOREIGN KEY (user_id) REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE;
```

Once all tables have been updated, your data integrity will be fully restored. You can now safely remove the temporary table by executing the following SQL command:

```sql
DROP TABLE public.temp_users;
```

## Part 2: Finalize: Row level security

> If your Supabase project does not utilize Row-Level Security (RLS), you can safely skip this section.

The next step is to configure table permissions in Neon so your RLS policies behave correctly. The primary difference is the name of the anonymous role.

<Admonition type="important" title="Role Name Change: `anon` to `anonymous`">
Supabase uses the role `anon` for unauthenticated users. Neon uses the standard Postgres role `anonymous`. The `authenticated` role name is the same on both platforms.
</Admonition>

Apply the following general permissions to enable access for both roles. Your RLS policies will then enforce the fine-grained control.

```sql
-- Grant permissions for existing tables
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO anonymous;

-- Ensure permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES TO anonymous;

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anonymous;
```

#### Migrating specific permissions

To achieve an exact 1:1 migration of permissions, extract the current permissions from Supabase using the following command:

```shell
pg_dump --schema-only -d "SUPABASE_CONNECTION_STRING" --schema=public | grep -E "^(GRANT|REVOKE)" > permissions.sql
```

This command generates a `permissions.sql` file containing only the `GRANT` and `REVOKE` statements from your Supabase public schema.

If the `permissions.sql` file looks like this example:

```sql
GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON TABLE public.todos TO anon;
GRANT ALL ON TABLE public.todos TO authenticated;
GRANT ALL ON TABLE public.todos TO service_role;
```

Edit it as follows:

- Replace `anon` with `anonymous` (e.g., `GRANT USAGE ON SCHEMA public TO anonymous;`).
- Remove roles specific to Supabase, such as `service_role` and `postgres` (if not needed in Neon).
- After editing, apply the modified permissions to your Neon database using `psql`:

After edits it should look like this:

```sql
GRANT USAGE ON SCHEMA public TO anonymous;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE public.todos TO anonymous;
GRANT ALL ON TABLE public.todos TO authenticated;
```

```shell
psql -d "NEON_CONNECTION_STRING" -f permissions.sql
```

## Part 3: Migrating your application code (Next.js example)

After migrating your database and user accounts, the final step is to update your application code to work with Neon Auth and the Neon Data API. This section guides you through refactoring a Next.js application from using Supabase's client libraries (`@supabase/ssr`, `@supabase/supabase-js`) to using Neon Auth's SDK (`@stackframe/stack`) and the standard `postgrest-js` library for data access.

The primary change in this migration is moving from Supabase's single, integrated client library to a composable stack:

1.  **Authentication:** You will replace Supabase Auth functions (`supabase.auth.getUser()`, custom middleware, and callback routes) with Neon Auth's SDK. Neon Auth handles session management and provides simple hooks (`useUser`) and server-side helpers (`stackServerApp.getUser()`) to access user data.
2.  **Data Access:** You will replace the data access portion of the Supabase client (`supabase.from(...)`) with a dedicated PostgREST client (`postgrest-js`). The Neon Data API is PostgREST-compliant, meaning **your query syntax (e.g., `.select()`, `.insert()`, `.eq()`) will remain almost identical.** The main difference is how you initialize the client and authenticate requests using a JWT from Neon Auth.

### Step 1: Update project dependencies

First, remove the Supabase packages and install the PostgREST client library.

```bash
# Remove Supabase libraries
npm uninstall @supabase/ssr @supabase/supabase-js

# Install PostgREST library
npm install @supabase/postgrest-js@1.19.4
```

### Step 2: Initialize Neon Auth in your project

Neon Auth (powered by [Stack Auth](https://stack-auth.com), an open-source auth solution) provides a setup command to configure your Next.js application automatically. This command will scaffold necessary files, such as auth handlers and provider components.

Run the following command in your project's root directory:

```bash
npx @stackframe/init-stack@latest --no-browser
```

This command will perform the following actions:

- **Create Auth Handlers:** Adds a catch-all route at `app/handler/[...stack]/page.tsx`. This single file handles all authentication UI flows (sign-up, sign-in, password reset, OAuth callbacks) provided by Neon Auth.
- **Update Layout:** Wraps your root layout (`app/layout.tsx`) in a `<StackProvider>` to make authentication state available throughout your app.
- **Create Server Configuration:** Adds a `stack.tsx` file for server-side initialization of the auth SDK.

### Step 3: Configure data access client for Neon Data API

Unlike the integrated Supabase client, you need to configure the PostgREST client to use the access token (JWT) generated by Neon Auth for authenticated requests.

1.  **Create an Access token provider:** This provider uses a React Context to make the current user's access token available to components that perform data fetching.

    _Create file `access-token-context.tsx`:_

    ```typescript
    import { createContext } from 'react';
    export const AccessTokenContext = createContext<string | null>(null);
    ```

    _Create file `access-token-provider.tsx`:_

    ```typescript
    "use client";

    import { AccessTokenContext } from "@/access-token-context";
    import { useUser } from "@stackframe/stack";
    import { useEffect, useState } from "react";

    export function AccessTokenProvider({ children }: { children: React.ReactNode }) {
        const user = useUser();
        const [accessToken, setAccessToken] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const fetchAccessToken = async () => {
                if (user) {
                    setAccessToken((await user.getAuthJson()).accessToken);
                }
                setIsLoading(false);
            };

            fetchAccessToken();
            // Refresh the token periodically before it expires
            const intervalId = setInterval(fetchAccessToken, 1000 * 60);

            return () => clearInterval(intervalId);
        }, [user]);

        if (isLoading) {
            return null;
        }

        return (
            <AccessTokenContext.Provider value={accessToken}>
                {children}
            </AccessTokenContext.Provider>
        );
    }
    ```

2.  **Update root layout:** Wrap your application with the `AccessTokenProvider` inside the existing `<StackProvider>`.

    _File: `app/layout.tsx`_

    ```tsx {4-5,14-15,17} shouldWrap
    import type { Metadata } from 'next';
    import { StackProvider, StackTheme } from '@stackframe/stack';
    import { stackServerApp } from '../stack'; // Created by init command
    import { AccessTokenProvider } from '@/access-token-provider';
    import { Suspense } from 'react';
    import './globals.css';

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body>
            <StackProvider app={stackServerApp}>
              <StackTheme>
                <Suspense fallback={<div>Loading...</div>}>
                  <AccessTokenProvider>{children}</AccessTokenProvider>
                </Suspense>
              </StackTheme>
            </StackProvider>
          </body>
        </html>
      );
    }
    ```

3.  **Create PostgREST client hook:** Create a custom hook `usePostgrest` that initializes the PostgREST client and automatically injects the access token into the request headers.

    _Create file `lib/postgrest.ts`:_

    ```typescript
    import { AccessTokenContext } from '@/access-token-context';
    import { PostgrestClient } from '@supabase/postgrest-js';
    import { useContext } from 'react';

    // Add your Neon Data API endpoint to your .env.local file
    // NEXT_PUBLIC_DATA_API_URL=https://<project-id>.dpl.myneon.app
    const dataApiUrl = process.env.NEXT_PUBLIC_DATA_API_URL!;

    const postgrestWithHeaders = (headers: Record<string, string>) => {
      return new PostgrestClient(dataApiUrl, {
        fetch: async (...args) => {
          const [url, options = {}] = args;
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              ...headers,
            },
          });
        },
      });
    };

    export function usePostgrest() {
      const accessToken = useContext(AccessTokenContext);
      return postgrestWithHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
    }
    ```

### Step 4: Refactor application code

Now, replace Supabase-specific logic with Neon Auth and PostgREST calls.

#### 4.1. Protecting routes (Server-Side)

Replace `supabase.auth.getUser()` with `stackServerApp.getUser()` to protect pages and server actions.

<CodeTabs labels={["Before (Supabase)", "After (Neon Auth)"]}>

```typescript shouldWrap
// File: app/protected/page.tsx (Supabase)

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PrivatePage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return <p>Hello {data.user.email}</p>
}
```

```typescript shouldWrap
// File: app/protected/page.tsx (Neon Auth)

import { redirect } from 'next/navigation'
import { stackServerApp } from '@/stack/server';

export default async function PrivatePage() {
    const user = await stackServerApp.getUser();

    if (!user || !user.id) {
        redirect('/handler/login') // Redirect to Neon Auth's built-in login page
    }

    return <p>Hello {user.primaryEmail}</p>
}
```

</CodeTabs>

#### 4.2. Data fetching and mutations (client-side)

Replace the `supabase` client instance with the new `usePostgrest()` hook for data operations. Notice how the query syntax remains unchanged.

<CodeTabs labels={["Before (Supabase)", "After (Neon Auth + PostgREST)"]}>

```typescript shouldWrap
// File: components/TodoApp.tsx (Supabase)

import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// ... inside component
const supabase = createClient();
const userId = user.id;

async function loadTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('inserted_at', { ascending: false });
  // ... update state
}

async function addTodo(e: React.FormEvent) {
  // ... logic
  const { data, error } = await supabase
    .from('todos')
    .insert([{ title, user_id: userId }])
    .select()
    .single();
  // ... update state
}

async function signout() {
  await supabase.auth.signOut();
}
```

```typescript shouldWrap
// File: components/TodoApp.tsx (Neon Auth + PostgREST)

import { usePostgrest } from '@/lib/postgrest';
import type { CurrentUser } from '@stackframe/stack';

// ... inside component
const postgrest = usePostgrest(); // Use the new hook
const userId = user.id;

async function loadTodos() {
  const { data, error } = await postgrest // Client instance changed
    .from('todos') // Query syntax is identical
    .select('*')
    .order('inserted_at', { ascending: false });
  // ... update state
}

async function addTodo(e: React.FormEvent) {
  // ... logic
  const { data, error } = await postgrest // Client instance changed
    .from('todos') // Query syntax is identical
    .insert([{ title, user_id: userId }])
    .select()
    .single();
  // ... update state
}

async function signout() {
  await user.signOut(); // Use Neon Auth user object method
}
```

</CodeTabs>

#### 4.3. Client-side authentication state

Replace Supabase session handling (`getSession`, `onAuthStateChange`) with the `useUser` hook from Neon Auth for a simpler, more modern React approach.

<CodeTabs labels={["Before (Supabase)", "After (Neon Auth)"]}>

```typescript shouldWrap
// File: app/page.tsx (Supabase)

"use client";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => subscription?.unsubscribe();
  }, []);

  if (!session) {
      return <a href="/login">Sign up or sign in</a>;
  }
  return <TodoApp user={session.user} />;
}
```

```typescript shouldWrap
// File: app/page.tsx (Neon Auth)

"use-client";
import { useUser } from '@stackframe/stack';
import Link from 'next/link';

export default function Page() {
  const user = useUser(); // Replaces all session management logic

  if (!user) {
    return (
      <Link href="/handler/login">Sign up or sign in</Link>
    );
  }
  return <TodoApp user={user} />;
}
```

</CodeTabs>

    <Admonition type="info" title="Neon Auth Hooks">
      The Neon Auth SDK for Next.js offers a comprehensive set of hooks to manage authentication and user data throughout your application. It provides distinct tools tailored for different rendering environments, such as the `useUser` hook for Client Components and the `stackServerApp` object for server-side logic.

    To explore the full API, including hooks for more advanced features like handling teams and permissions, refer to the [Neon Auth: Next.js SDK Overview](/docs/neon-auth/sdk/nextjs/overview).
    </Admonition>

### Step 5: Clean up deprecated Supabase files

After refactoring, you can safely remove the Supabase-specific helper files and custom authentication routes, as Neon Auth's SDK handles these functionalities automatically.

Delete the following files and directories:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts` (and remove middleware configuration from `middleware.ts`)
- `app/login/` (directory)
- `app/auth/callback/` (directory)
- `app/auth/confirm/` (directory)

Your application code is now fully migrated to Neon Auth and the Neon Data API.

For a detailed example of the code migration process, refer to this example pull request: [Supabase to Neon Todo App Migration](https://github.com/neondatabase-labs/supabase-to-neon-todo-app/pull/3/files).

The repository includes two branches: [supabase](https://github.com/neondatabase-labs/supabase-to-neon-todo-app/tree/supabase) and [neon](https://github.com/neondatabase-labs/supabase-to-neon-todo-app/tree/neon) showcasing the before and after states of a sample todo application. This demonstrates the transition from Supabase Auth, Row-Level Security (RLS), and the Supabase Postgres Data API to Neon Auth, RLS, and the Neon PostgREST Data API.

## Part 4: Upgrading your development workflow with Database Branching

If you used Supabase's branching feature for preview environments, you'll feel right at home with Neon. In fact, you'll be working with the original, more powerful version of the concept: **Neon was the first postgres database provider to introduce instant, serverless copy-on-write database branching.**

While the goal is similar, creating isolated environments for development and testing the implementation and capabilities are fundamentally different. Migrating to Neon offers a significant upgrade to your CI/CD and development workflows.

### The Neon Advantage: True Copy-on-Write Branching

The most significant difference is how branches are created. Supabase branches are **data-less by default**, meaning they create a new, empty database environment that you must then populate using seed scripts.

Neon branches are **instant, copy-on-write clones of your entire database, including the data.**

<Admonition type="info" title="What This Means For Your Workflow">
With Neon, creating a new branch for a pull request takes milliseconds and gives you a fully-functional, isolated copy of your production database. This completely eliminates the need to write and maintain complex seed scripts for every preview environment. You can test new features and schema migrations against real-world data, safely and instantly.
</Admonition>

This approach provides several key benefits:

- **Test with production-like data:** Safely test schema changes and queries against a full replica of your production data.
- **Zero setup time:** Eliminate the time and effort spent hydrating databases for preview deployments.
- **Cost-efficient:** Because branches are copy-on-write, you only store the changes (the delta) from the parent branch, making it incredibly storage-efficient.

### Branching workflows and tooling

Neon provides a complete toolkit for managing branches, allowing you to integrate this powerful feature into any part of your workflow.

- **Neon Console:** Create, manage, and inspect branches visually through the dashboard. Perfect for quick manual operations or getting started. Learn more: [Manage branches](/docs/manage/branches)
- **Neon CLI:** Programmatically manage branches from your terminal. Ideal for local development, scripting, and automation. Learn more: [Branching with the Neon CLI](/docs/guides/branching-neon-cli)
- **Neon API:** The most powerful option for full programmatic control. Integrate branching directly into your custom tools, scripts, and platforms. Learn more: [Branching with the Neon API](/docs/guides/branching-neon-api)

### Automating with CI/CD (Vercel & GitHub Actions)

For most developers the primary use case for branching is creating preview environments for pull requests. Neon excels here with zero-config integrations and powerful, composable actions.

- **Vercel Integration:** The simplest way to get started. The [Neon Vercel Integration](/docs/guides/neon-managed-vercel-integration) automatically creates a new database branch for every preview deployment. It injects the correct connection string as an environment variable, giving you a fully isolated database environment for each PR with no configuration required.

- **GitHub Actions:** For more granular control over your CI/CD pipeline, Neon offers a suite of official GitHub Actions. These allow you to automate your entire branching lifecycle directly from your workflows. You can:
  - [**Create a branch**](https://github.com/marketplace/actions/neon-create-branch-github-action) when a pull request is opened.
  - [**Reset a branch**](https://github.com/marketplace/actions/neon-database-reset-branch-action) to the latest state of `main` to refresh it with new data.
  - [**Perform a schema diff**](https://github.com/marketplace/actions/neon-schema-diff-github-action) and post the results as a comment on the pull request.
  - [**Delete the branch**](https://github.com/marketplace/actions/neon-database-delete-branch) automatically when the pull request is merged or closed.
    > Checkout [The Neon GitHub integration](/docs/guides/neon-github-integration) for a detailed walkthrough.

## Conclusion

Congratulations! You've successfully migrated your Supabase database, users, and Row-Level Security (RLS) policies to Neon. Data integrity is intact, security policies are fully operational, and users can sign in using their original passwords with no resets required.

If your users were authenticated via OAuth providers like GitHub or Google in Supabase, you can seamlessly continue using these in Neon Auth without any issues. Note that Neon Auth currently supports OAuth for Microsoft, Google, and GitHub. For more details on setting up OAuth in production, refer to the [Neon Auth best practices documentation](https://neon.com/docs/neon-auth/best-practices#production-oauth-setup).

</Steps>

## Resources

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [Migrating data to Neon](/docs/import/migrate-from-postgres)
- [Migrate from Supabase](/docs/import/migrate-from-supabase)
- [Getting started with Neon Data API](/docs/data-api/get-started)
- [Neon Auth](/docs/neon-auth/overview)
- [Neon RLS](/docs/guides/neon-rls)
- [Getting started with Neon Auth and Next.js](/guides/neon-auth-nextjs)
- [A Simple 3-Step Process to Migrate from Supabase Auth to Neon Auth](/blog/supabase-auth-neon-auth)
- [Ship software faster using Neon branches as ephemeral environments](/branching)

<NeedHelp/>
