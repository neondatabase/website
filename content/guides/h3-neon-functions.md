---
title: Run an h3 app on Neon Functions
subtitle: Deploy an h3 (v2) API that queries Postgres and streams server-sent events from a Neon Function.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-11-11T00:00:00.000Z'
updatedOn: '2026-11-12T07:04:55.193Z'
---

[h3](https://h3.dev) is a JavaScript HTTP framework built on the web standard `Request`, `Response`, `URL`, and `Headers` APIs. [Neon Functions](/docs/compute/functions/overview) run any module whose default export has a `fetch(request)` method that returns a `Response`. An h3 (v2) app has a `fetch` method, so you can export the app as the function's default export.

In this guide, you'll build a small todos API with h3, back it with your branch's Postgres database, add a server-sent events (SSE) endpoint, and deploy it with `neon deploy`.

## Prerequisites

- A Neon project in a [region that supports Functions](/docs/compute/functions/overview#about-neon-functions)
- The latest [Neon CLI](/docs/cli), installed and authenticated
- Node.js 24 or later

<Steps>

## Create the project

Create a directory and install h3, the `pg` driver, and the Neon packages:

```bash filename="Terminal"
mkdir h3-neon-functions && cd h3-neon-functions
npm init -y --init-type=module

npm install h3@2 pg
npm install --save-dev @types/pg
npm install @neon/config @neon/functions
```

This installs the latest h3 v2 (the current release on npm).

## Link your Neon project

Link the directory to your Neon project and branch:

```bash filename="Terminal"
neon link
```

`neon link` writes a `.neon` file and pulls the branch's environment variables, including `DATABASE_URL`, into `.env.local`. That file holds your database password, so add `.env.local` to `.gitignore` before you commit. Deployed functions get `DATABASE_URL` injected automatically, so you don't set it yourself.

## Declare the function in `neon.ts`

Create `neon.ts` at the project root. `neon deploy` reads it to know which functions to deploy:

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  functions: {
    api: {
      name: 'h3 API',
      source: './functions/api.ts',
    },
  },
});
```

The key, `api`, is the function's slug. It becomes part of the function URL and can't be renamed after the first deploy. Slugs allow only 1 to 20 lowercase letters and digits.

## Write the h3 app

Create `functions/api.ts`. It sets up a `pg` pool and a `todos` table, then defines the routes:

```ts filename="functions/api.ts" collapse={1-12, 26-31, 44-48, 58-61, 71-75}
import {
  H3,
  HTTPError,
  createEventStream,
  getCookie,
  getQuery,
  getRequestURL,
  getRouterParam,
  readBody,
  redirect,
  setCookie,
} from 'h3';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';

// Create one pool when the module loads and reuse it across requests.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
// Handle the disconnects Postgres sends when the compute scales to zero.
attachDatabasePool(pool);

// Create the todos table on the first request that needs it.
// Later calls reuse the same promise, so the query runs once.
let schemaReady: Promise<unknown> | undefined;
const ensureSchema = () =>
  (schemaReady ??= pool.query(
    `CREATE TABLE IF NOT EXISTS todos (
       id serial PRIMARY KEY,
       title text NOT NULL,
       done boolean NOT NULL DEFAULT false,
       created_at timestamptz NOT NULL DEFAULT now()
     )`
  ));

const app = new H3();

app
  // Send the root path to the todos list.
  .get('/', () => redirect('/todos', 302))
  // Return the Postgres version and server time to confirm the connection.
  .get('/db', async () => (await pool.query('SELECT version(), now()')).rows[0])
  // List todos. ?done=true or ?done=false filters the list. No query returns every row.
  .get('/todos', async (event) => {
    const { done } = getQuery(event);
    await ensureSchema();
    const { rows } = await pool.query(
      'SELECT * FROM todos WHERE $1::boolean IS NULL OR done = $1 ORDER BY id',
      [done === undefined ? null : done === 'true']
    );
    return rows;
  })
  // Create a todo from a JSON body such as {"title":"try h3 on neon"}.
  .post('/todos', async (event) => {
    const body = await readBody<{ title?: string }>(event);
    // A thrown HTTPError becomes a JSON response with its status code.
    if (!body?.title) {
      throw new HTTPError({ status: 400, message: 'title is required' });
    }
    await ensureSchema();
    const { rows } = await pool.query('INSERT INTO todos (title) VALUES ($1) RETURNING *', [
      body.title,
    ]);
    event.res.status = 201;
    return rows[0];
  })
  // Toggle a todo's done flag.
  .patch('/todos/:id', async (event) => {
    const id = Number(getRouterParam(event, 'id'));
    if (!Number.isInteger(id)) {
      throw new HTTPError({ status: 400, message: 'id must be an integer' });
    }
    await ensureSchema();
    const { rows } = await pool.query(
      'UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *',
      [id]
    );
    if (!rows[0]) throw new HTTPError({ status: 404, message: 'todo not found' });
    return rows[0];
  })
  // Count visits in a cookie and return the public URL of the request.
  .get('/visits', (event) => {
    const visits = Number(getCookie(event, 'visits') ?? 0) + 1;
    // Two setCookie calls send two set-cookie headers on one response.
    setCookie(event, 'visits', String(visits));
    setCookie(event, 'last_visit', new Date().toISOString());
    return { visits, url: getRequestURL(event).href };
  })
  // Throw a plain Error. h3 returns a 500 without the error message.
  .get('/boom', () => {
    throw new Error('unexpected failure');
  })
  // Stream five server-sent events, 500 ms apart, then close the stream.
  .get('/sse', (event) => {
    const stream = createEventStream(event);
    let n = 0;
    const timer = setInterval(async () => {
      n++;
      await stream.push({ event: 'tick', data: JSON.stringify({ n, at: Date.now() }) });
      if (n >= 5) {
        clearInterval(timer);
        await stream.close();
      }
    }, 500);
    // Stop the timer if the client disconnects early.
    stream.onClosed(() => clearInterval(timer));
    return stream.send();
  });

export default app;
```

See [Get started with Neon Functions](/docs/compute/functions/get-started#define-your-function) for how functions handle database connections.

## Run the app locally

Create `dev.ts` at the project root. It serves the same `app` with h3's own `serve()`, so you test the exact code you deploy. It isn't deployed, because `neon.ts` only points at `functions/api.ts`:

```ts filename="dev.ts"
import { serve } from 'h3';
import app from './functions/api.ts';

// gracefulShutdown: false lets --watch restart right away instead of waiting
// up to 5 seconds for open connections to close.
serve(app, { port: 8787, gracefulShutdown: false });
```

Start it with the branch's environment variables, which `neon link` wrote to `.env.local`. `--watch` restarts the server when you edit a file:

```bash filename="Terminal"
node --env-file=.env.local --watch dev.ts
```

```text
➜ Listening on: http://localhost:8787/ (all interfaces)
```

Create a todo, then send one without a title to see the error response:

```bash filename="Terminal"
curl -X POST -H 'content-type: application/json' -d '{"title":"try h3 on neon"}' http://localhost:8787/todos
curl -X POST -H 'content-type: application/json' -d '{}' http://localhost:8787/todos
```

The first returns `201` with the new row, and the second returns `400` with `title is required`, the same responses the deployed function gives.

<Admonition type="note" title="Why not `neon dev`?">
In Neon CLI, `neon dev` replaces the global `Response` class, which breaks h3 v2's error responses: a `400`, `404`, or `500` comes back as `200` with the body `[object Response]`, while the deployed function answers correctly. Successful responses aren't affected. Until a CLI release fixes this, use `dev.ts` so local responses match what you get when deployed.
</Admonition>

## Deploy the function

Deploy every function declared in `neon.ts` to the linked branch:

```bash filename="Terminal"
neon deploy
```

The CLI bundles the function with esbuild, uploads it, and prints the function URL when the deployment completes:

```text
Function URLs
  • api: https://<branch_id>-api.compute.<cell>.us-east-2.aws.neon.tech/
```

You can also get the URL later with [`neon functions get api`](/docs/cli/functions#get).

## Test the deployed API

Set the URL from the deploy output, then call each route:

```bash filename="Terminal"
API=https://<branch_id>-api.compute.<cell>.us-east-2.aws.neon.tech

curl $API/db
curl -X POST -H 'content-type: application/json' -d '{"title":"try h3 on neon"}' $API/todos
curl -X POST -H 'content-type: application/json' -d '{}' $API/todos
curl -X PATCH $API/todos/1
curl -X PATCH $API/todos/9999
curl -X PATCH $API/todos/abc
curl $API/todos
curl "$API/todos?done=true"
curl -I $API/todos
curl -i $API/
curl -i -b 'visits=2' $API/visits
curl -i $API/boom
curl -i $API/nope
curl -N $API/sse
```

| Request                       | Response                                                                 |
| ----------------------------- | ------------------------------------------------------------------------ |
| `GET /db`                     | `200` with your branch's Postgres version and the current time           |
| `POST /todos` with a title    | `201` with the new row                                                   |
| `POST /todos` without a title | `400` with `title is required`                                           |
| `PATCH /todos/1`              | `200` with the row, `done` toggled                                       |
| `PATCH /todos/9999`           | `404` with `todo not found`                                              |
| `PATCH /todos/abc`            | `400` with `id must be an integer`                                       |
| `GET /todos`                  | `200` with every row                                                     |
| `GET /todos?done=true`        | `200` with only the rows where `done` is `true`                          |
| `HEAD /todos`                 | `200` with headers and no body                                           |
| `GET /`                       | `302` with `location: /todos`                                            |
| `GET /visits` with a cookie   | `200` with `visits: 3` and the public URL, plus two `set-cookie` headers |
| `GET /boom`                   | `500` with a generic message. The error text isn't sent to the client    |
| `GET /nope`                   | `404`, because no route matches                                          |
| `GET /sse`                    | Five `tick` events, about 500 ms apart, delivered as they happen         |

The SSE response streams through the function as each event is pushed, so `curl -N` prints each `tick` as it arrives.

</Steps>

## Frequently asked questions

<Faq>

<FaqItem question="Do I need an adapter to run h3 on Neon Functions?">
No. The `H3` app has a [`fetch(request)` method](https://h3.dev/guide/api/h3), so `export default app` is enough. The Neon runtime calls that method for each request.
</FaqItem>

<FaqItem question="Does this work with h3 v1?">
Yes, with one change. h3 v1 apps don't have a `fetch` method, so wrap the app with the [Web adapter](https://v1.h3.dev/adapters/web) and export `{ fetch: toWebHandler(app) }`. To move to v2, see the [h3 migration guide](https://h3.dev/migration).
</FaqItem>

<FaqItem question="Can I deploy a Nuxt or Nitro app this way?">
This guide covers h3 apps that export a `fetch` handler. Neon Functions are backend primitives and [don't host websites](/docs/compute/functions/overview#how-functions-fit-with-your-app), so host a Nuxt frontend on a frontend platform and call your h3 function from it.
</FaqItem>

</Faq>

## Resources

- [Stream responses with h3](https://h3.dev/examples/stream-response)
- [Get started with Neon Functions](/docs/compute/functions/get-started)
- [Deploy and manage Neon Functions](/docs/compute/functions/deploy)
- [WebSockets and SSE on Neon Functions](/docs/compute/functions/websockets)

<NeedHelp/>
