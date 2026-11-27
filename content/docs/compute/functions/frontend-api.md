---
title: Add a backend API to a frontend app
subtitle: Give a React, Vue, or static Astro app a server-side API on Neon Functions that reads and writes Lakebase Postgres.
summary: >-
  Add a backend API to a frontend-only app (React with Vite, Vue, or a static
  Astro site) with Neon Functions. A Hono function queries Lakebase Postgres
  with a pg pool, keeps the connection string on the server, and allows your
  frontend's origins with CORS. The frontend calls the function's URL from an
  env variable. Covers local development with neon dev, deploying with neon
  deploy, and building the frontend against the deployed API.
enableTableOfContents: true
updatedOn: '2026-11-27T01:39:33.820Z'
---

A frontend-only app, such as a React app built with Vite, a Vue single-page app, or a static Astro site, runs entirely in the browser. Browser code can't query Lakebase Postgres directly: your connection string would be visible to anyone who opens the page. You need a server-side API between the browser and the database.

A [Neon Function](/docs/compute/functions/overview) can be that API. It runs next to your database, gets `DATABASE_URL` injected automatically, and has a public HTTPS URL that your frontend calls with `fetch`. You keep hosting the frontend wherever you host it now.

This guide builds a small to-do API and calls it from a Vite + React app. The function part works the same for Vue, Astro, or any other frontend.

<Steps>

## Prerequisites

- A Neon project in a [region that supports Functions](/docs/compute/functions/get-started#prerequisites).
- The latest `neon` CLI, installed and authenticated (`npm install -g neon@latest`).
- Node.js 20 or later.

## Create the frontend app

Skip this step if you already have a frontend app. Otherwise, create a Vite + React app:

```bash filename="Terminal"
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

## Link the app to your Neon project

From the app's root directory, link it to your project and branch:

```bash filename="Terminal"
neon link
```

`neon link` writes a `.neon` file and pulls your branch's variables, including `DATABASE_URL`, into `.env.local`. Vite ignores `*.local` files in git, and it only exposes variables that start with `VITE_` to browser code, so the connection string stays out of your frontend bundle.

## Create a table

Open a SQL shell on your branch:

```bash filename="Terminal"
neon psql
```

Create a table and add a few rows:

```sql
CREATE TABLE todos (
  id serial PRIMARY KEY,
  text text NOT NULL,
  done boolean NOT NULL DEFAULT false
);

INSERT INTO todos (text) VALUES ('Read the Neon Functions docs'), ('Deploy my API');
```

## Add a function

Scaffold a function named `api`:

```bash filename="Terminal"
neon config add function api
```

This creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root, a starter handler in `functions/api.ts`, and installs `@neon/config` and `@neon/env`. Install Hono, the `pg` driver, and the Functions runtime helpers:

```bash filename="Terminal"
npm install hono pg @neon/functions
npm install --save-dev @types/pg
```

In `neon.ts`, declare the origins that may call the API. The function reads them at runtime to set CORS headers:

```ts filename="neon.ts" {8-14}
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  functions: {
    api: {
      name: 'api',
      source: './functions/api.ts',
      env: {
        // Origins allowed to call the API, comma-separated.
        ALLOWED_ORIGINS: {
          value: process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173',
          required: true,
        },
      },
    },
  },
});
```

Keep any other settings `neon config add` wrote to the file, such as the `branch` policy.

## Write the API

Replace `functions/api.ts` with a Hono app that lists and adds to-dos:

```ts filename="functions/api.ts"
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';

// Create the pool once so every request reuses it.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

const app = new Hono();

// Let your frontend's origins call the API from the browser.
app.use('/api/*', cors({ origin: process.env.ALLOWED_ORIGINS!.split(',') }));

app.get('/api/todos', async (c) => {
  const { rows } = await pool.query('SELECT id, text, done FROM todos ORDER BY id');
  return c.json(rows);
});

app.post('/api/todos', async (c) => {
  const { text } = await c.req.json<{ text?: string }>();
  if (!text?.trim()) return c.json({ error: 'text is required' }, 400);
  const { rows } = await pool.query(
    'INSERT INTO todos (text) VALUES ($1) RETURNING id, text, done',
    [text.trim()]
  );
  return c.json(rows[0], 201);
});

export default app;
```

A few things to note:

- The function connects with a `pg` pool created once at module scope, not the serverless driver, because a function keeps running across requests. See [Use a connection pool](/docs/compute/functions/get-started#connect-to-postgres).
- The `cors` middleware answers the browser's preflight requests and sets `Access-Control-Allow-Origin` only for origins in `ALLOWED_ORIGINS`. A browser on any other origin can't read the response.

## Run the API locally

Start the Functions dev server:

```bash filename="Terminal"
neon dev
```

It serves the function at `http://localhost:8787` with your branch's `DATABASE_URL` and the `ALLOWED_ORIGINS` value from `neon.ts`. Check it in another terminal:

```bash filename="Terminal"
curl http://localhost:8787/api/todos
```

```json
[
  { "id": 1, "text": "Read the Neon Functions docs", "done": false },
  { "id": 2, "text": "Deploy my API", "done": false }
]
```

## Call the API from the frontend

Tell the frontend where the API is. Create `.env.development` with the local URL:

```bash filename=".env.development"
VITE_API_URL=http://localhost:8787
```

Then fetch from it. Replace `src/App.tsx`:

```tsx filename="src/App.tsx"
import { useEffect, useState, type FormEvent } from 'react';

type Todo = { id: number; text: string; done: boolean };

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  async function addTodo(event: FormEvent) {
    event.preventDefault();
    const res = await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const todo: Todo = await res.json();
      setTodos((current) => [...current, todo]);
      setText('');
    }
  }

  return (
    <main>
      <h1>Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      <form onSubmit={addTodo}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
        <button type="submit">Add</button>
      </form>
    </main>
  );
}
```

With `neon dev` still running, start Vite in another terminal and open `http://localhost:5173`:

```bash filename="Terminal"
npm run dev
```

The page lists the to-dos from Postgres, and new ones you add are saved to the `todos` table.

## Deploy the API

Add the origins that should reach the deployed API to `.env.local`. Include your frontend's production origin, plus `http://localhost:5173` and `http://localhost:4173` (Vite's dev and preview servers) while you test:

```bash filename=".env.local"
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173,https://my-app.example.com
```

Then deploy. `--env .env.local` loads that file so `neon.ts` can read `ALLOWED_ORIGINS`:

```bash filename="Terminal"
neon deploy --env .env.local
```

The output prints the function's URL:

```text
Function URLs
  • api: https://br-floral-flower-a1b2c3d4-api.compute.c-9.us-east-2.aws.neon.tech/
```

Later `neon env pull` runs keep your `ALLOWED_ORIGINS` line. To change the origins, edit the line and run `neon deploy --env .env.local` again. Remove the `localhost` origins when you no longer need them.

## Build the frontend against the deployed API

Create `.env.production` with the function URL, without the trailing slash. A double slash in the request path (`//api/todos`) returns a 404.

```bash filename=".env.production"
VITE_API_URL=https://br-floral-flower-a1b2c3d4-api.compute.c-9.us-east-2.aws.neon.tech
```

Build and preview the production bundle:

```bash filename="Terminal"
npm run build
npm run preview
```

Open `http://localhost:4173`. The app now reads and writes through the deployed function. Deploy the `dist/` folder to any static host, and set `VITE_API_URL` in the host's build settings if you don't commit `.env.production`.

</Steps>

<Admonition type="important" title="Protect the API before you go live">
The function's URL is public, and CORS only controls which browsers can read responses. Anyone can still call the API with `curl`. Before you take writes from real users, verify the caller in the function: for example, sign users in with [Managed Better Auth](/docs/auth/quick-start/react) and verify their JWT in the function. See [Authentication](/docs/compute/functions/authentication).
</Admonition>

## Use it with other frontends

The function doesn't depend on React. Only the frontend step changes:

- **Vue with Vite:** use the same `.env.development` and `.env.production` files and read `import.meta.env.VITE_API_URL` in a component.
- **Astro without an adapter:** a static Astro site has no server, so call the function from a client-side script. Name the variable `PUBLIC_API_URL`, since Astro exposes `PUBLIC_` variables to the browser. If your Astro app already renders on demand, you can query Postgres in the page instead. See [Connect an Astro application to Neon](/docs/guides/astro).

Add each frontend's origin to `ALLOWED_ORIGINS`. Astro's dev server runs on `http://localhost:4321`.

## Next steps

- [Authentication](/docs/compute/functions/authentication): verify callers before the function runs.
- [Custom domains](/docs/compute/functions/custom-domains): serve the API from a domain you own.
- [Branching](/docs/introduction/branching): give each preview deployment its own database and its own copy of the API.
- [Use function templates](/docs/compute/functions/templates): start from a ready-made REST API, MCP server, or bot.

<NeedHelp/>
