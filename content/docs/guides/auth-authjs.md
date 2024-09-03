---
title: Authenticate Neon Postgres application users with Auth.js
subtitle: Learn how to add passwordless authentication to your Neon Postgres database application using Auth.js and Resend
enableTableOfContents: true
updatedOn: '2024-08-10T18:42:30.123Z'
---

[Auth.js](https://authjs.dev/) (formerly NextAuth.js) is a popular authentication solution that supports a wide range of authentication methods, including social logins (e.g., Google, Facebook), traditional email/password, and passwordless options like magic links. For simple authentication flows, such as social logins, Auth.js can operate using only in-memory session storage (in a browser cookie). However, if you want to implement custom login flows, or persist the signed in users' information in your database, you need to specify a database backend.

For example, passwordless authentication methods like magic links require secure storage of temporary tokens. Magic link login has become increasingly popular since it eliminates the need for users to remember complex passwords, reducing the risk of credential-based attacks.

In this guide, we'll walk through setting up a simple Next.js application, using Neon Postgres as the database backend for both Auth.js authentication and application data. We'll use [Resend](https://resend.com/) for sending magic link emails. We will cover how to:

- Set up a Next.js project with Auth.js for magic link authentication
- Create a Neon Postgres database and configure it as the Auth.js database backend
- Configure Resend as an authentication provider
- Implement a basic authenticated feature (a simple todo list)

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.
- A [Resend](https://resend.com/) account for sending emails. Resend offers a free tier to get started.
- A domain

## Initialize your Next.js project

Run the following command in your terminal to create a new Next.js project:

```bash
npx create-next-app guide-neon-next-authjs --typescript --eslint --tailwind --use-npm --no-src-dir --app --import-alias "@/*"
```

Now, navigate to the project directory and install the required dependencies:

```bash
cd guide-neon-next-authjs
npm install next-auth@beta
npm install @auth/pg-adapter @neondatabase/serverless
```

For authentication, we'll use the `Auth.js` library (aliased as v5 of the `next-auth` package), which provides a simple way to add authentication to Next.js applications. It comes with built-in support for Resend as an authentication provider. We use the `@neondatabase/serverless` package as the Postgres client for the `Auth.js` database adapter.

Also, add a `.env` file to the root of your project, which we'll use to store the Neon connection string and the Resend API key:

```bash
touch .env
```

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon console and go to the [Projects](https://console.neon.tech/app/projects) section.
2. Click the **New Project** button to create a new project.
3. Choose your preferred region and Postgres version, then click **Create Project**.

### Retrieve your Neon database connection string

Navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Add this connection string to your `.env` file:

```bash
# .env
DATABASE_URL="YOUR_NEON_CONNECTION_STRING"
```

## Configuring Auth.js and Resend

### Set up Resend

1. Sign up for a [Resend](https://resend.com/) account if you don't already have one.
2. In the Resend dashboard, create an API key.
3. Add the API key to your `.env` file:

```bash
# .env
AUTH_RESEND_KEY="YOUR_RESEND_API_KEY"
```

4. [Optional] Resend requires verification of ownership for the domain you use to send emails from. If you own a domain, you can follow the instructions [here](https://resend.com/docs/dashboard/domains/introduction) to verify ownership.

    For this example, we'll use the test email address (`onboarding@resend.dev`) to send emails. However, this only works for the email address you use to sign up for a Resend account, so you won't be able to sign in from other email accounts.

### Configure Auth.js

Create a new file `auth.ts` in the root directory of the project and add the following content:

```typescript
/// auth.ts

import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import PostgresAdapter from '@auth/pg-adapter';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: PostgresAdapter(pool),
    providers: [Resend({ from: 'Test <onboarding@resend.dev>' })],
  };
});
```

This file sets up Auth.js with the Neon Postgres adapter and configures the Email provider for magic link authentication.

### Implement authentication routes

Create a new dynamic route at `app/api/auth/[...nextauth]/route.ts` with the following content:

```tsx
/// app/api/auth/[...nextauth]/route.ts

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

This route file imports the authentication handlers from the `auth.ts` file that handle all auth-related requests &#8212; sign-in, sign-out, and redirect after authentication.

The `auth` object exported from `./auth.ts` is the universal method we can use to interact with the authentication state in the application. For example, we add a message above the main app layout that indicates the current user's name and a sign-out button at the bottom.

## Implementing the application

### Create the database schema

Create a new file `app/db/schema.sql` with the following content:

```sql
-- Auth.js required tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL,
  "sessionToken" VARCHAR(255) NOT NULL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT,
  token TEXT,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Application-specific table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

This schema defines all the tables required for the `Auth.js` library to work, and also the `todos` table that we'll use to store the todo list for each user.

To apply this schema to your Neon database, you can use the Neon SQL Editor in the web console or a database management tool like `psql`.

### Implement the Todo list feature

Create a new file `app/TodoList.tsx`:

```tsx
'use client';

import { useState } from 'react';

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newTodo }),
    });

    if (response.ok) {
      const todo = await response.json();
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = async (id: number) => {
    const response = await fetch(`/api/todos/${id}`, { method: 'PATCH' });
    if (response.ok) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="mb-2 w-full rounded border p-2"
        />
        <button type="submit" className="w-full rounded border p-2">
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className="flex cursor-pointer items-center space-x-2"
          >
            <input type="checkbox" checked={todo.completed} readOnly className="cursor-pointer" />
            <span className={todo.completed ? 'line-through' : ''}>{todo.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Update the main page

Replace the contents of `app/page.tsx` with:

```tsx
import { auth } from '@/auth';
import TodoList from '@/app/TodoList';
import { Pool } from '@neondatabase/serverless';

async function getTodos(userId: string) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query('SELECT * FROM todos WHERE user_id = $1', [userId]);
  await pool.end();
  return rows;
}

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {!session ? (
          <>
            <h1 className="mb-4 text-2xl">Welcome to the Todo App</h1>
            <p className="mb-4">Please sign in to access your todos.</p>
            <a href="/api/auth/signin" className="inline-block rounded border p-2">
              Sign In
            </a>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-2xl">Welcome, {session.user?.name || session.user?.email}</h1>
            <TodoList initialTodos={await getTodos(session.user?.id as string)} />
            <a href="/api/auth/signout" className="mt-4 inline-block rounded border p-2">
              Sign Out
            </a>
          </>
        )}
      </div>
    </div>
  );
}
```

### Create API routes for the todos feature

Create a new file `app/api/todos/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Pool } from '@neondatabase/serverless';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content } = await req.json();
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const { rows } = await pool.query(
      'INSERT INTO todos (user_id, content) VALUES ($1, $2) RETURNING *',
      [session.user.id, content]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
```

This implements a simple API endpoint that allows users to create new todos.

Create another file `app/api/todos/[id]/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { auth } from '../../auth/[...nextauth]/route';
import { Pool } from '@neondatabase/serverless';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })

  try {
    const { rows } = await pool.query(
      'UPDATE todos SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *',
      [params.id, session.user.id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
```

This implements a simple API endpoint that allows users to update the status of a todo.

## Running the application

To start the application, run:

```bash
npm run dev
```

This will start the Next.js development server. Open your browser and navigate to `http://localhost:3000` to see the application in action. When running for the first time, you'll be see a `Sign In` link which will redirect you to the `Auth.js` widget, prompting you to input your email address. Enter your email to receive a magic link. Once authenticated, you'll be able to add and manage your todos.

Note that if you are using the test email address (`onboarding@resend.dev`) to send emails, you won't be able to sign in from other email accounts.

## Conclusion

In this guide, we demonstrated how to set up a Next.js application with Auth.js for magic link authentication, using Neon Postgres as the database backend for both authentication and application data. We implemented a simple todo list feature to showcase how authenticated users can interact with the application.

Next, we can add more routes and features to the application. The `auth` method can be used in the Next.js API routes or middleware to protect endpoints that require authentication.

To view and manage the users who authenticated with your application, you can query the `users` table of your Neon project. Similarly, all the magic link token generated are logged in the `verification_token` table, making it easy to audit and revoke access to your application.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/auth/guide-neon-next-authjs" description="Authenticate users of your Neon application with Auth.js" icon="github">Authentication flow with Auth.js</a>
</DetailIconCards>

## Resources

For more information on the tools and libraries used in this guide, refer to the following documentation:

- [Neon Documentation](https://neon.tech/docs)
- [Auth.js Documentation](https://authjs.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)

<NeedHelp/>
