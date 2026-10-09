---
title: Neon serverless driver configuration
subtitle: Result formats, fetch options, connection parameters, and transaction options for the Neon serverless driver
summary: >-
  Configuration reference for the Neon serverless driver
  (`@neondatabase/serverless`): `arrayMode`, `fullResults`, and `fetchOptions`
  for the HTTP `neon()` function; individual and function-valued connection
  parameters (1.2.0+); `transaction()` options (`isolationLevel`, `readOnly`,
  `deferrable`); setting JWT claims for Row-Level Security in a transaction;
  and `neonConfig` options for `Pool` and `Client`. For installation and basic
  usage, see the Neon serverless driver page.
enableTableOfContents: true
---

This page covers configuration options for the Neon serverless driver. The driver works with its defaults, so all of these options are optional. For installation, a quick start, and basic HTTP and WebSocket usage, see [Neon serverless driver](/docs/serverless/serverless-driver).

## Query result and fetch options

The examples in this section assume a query function created with `neon()`:

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const postId = 12;
```

By default, the query function returns only the rows resulting from the provided SQL query, and it returns them as an array of objects where the keys are column names. For example:

```javascript
const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
// -> [{ id: 12, title: "My post", ... }]
```

You can customize the return format using the configuration options `fullResults` and `arrayMode`. These options are available both on the `neon(...)` function and on the query function it returns.

- `arrayMode: boolean`, `false` by default

  The default `arrayMode` value is `false`. When it is true, rows are returned as an array of arrays instead of an array of objects:

  ```javascript
  const sql = neon(process.env.DATABASE_URL, { arrayMode: true });
  const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  // -> [[12, "My post", ...]]
  ```

  Or, with the same effect when using query():

  ```javascript
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query('SELECT * FROM posts WHERE id = $1', [postId], { arrayMode: true });
  // -> [[12, "My post", ...]]
  ```

- `fullResults: boolean`

  The default `fullResults` value is `false`. When it is `true`, additional metadata is returned alongside the result rows, which are then found in the `rows` property of the return value. The metadata matches what would be returned by `node-postgres`:

  ```javascript
  const sql = neon(process.env.DATABASE_URL, { fullResults: true });
  const results = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  /* -> {
    rows: [{ id: 12, title: "My post", ... }],
    fields: [
      { name: "id", dataTypeID: 23, ... },
      { name: "title", dataTypeID: 25, ... },
      ...
    ],
    rowCount: 1,
    rowAsArray: false,
    command: "SELECT"
  }
  */
  ```

  Or, with the same effect when using query():

  ```javascript
  const sql = neon(process.env.DATABASE_URL);
  const results = await sql.query('SELECT * FROM posts WHERE id = $1', [postId], {
    fullResults: true,
  });
  // -> { ... same as above ... }
  ```

- `fetchOptions: Record<string, any>`

  The `fetchOptions` option can also be passed to either `neon(...)` or the `query` function. This option takes an object that is merged with the options to the `fetch` call.

  For example, to increase the priority of every database `fetch` request:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL, { fetchOptions: { priority: 'high' } });
  const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  ```

  Or to implement a `fetch` timeout:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL);
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort('timed out'), 10000);
  const rows = await sql.query('SELECT * FROM posts WHERE id = $1', [postId], {
    fetchOptions: { signal: abortController.signal },
  }); // throws an error if no result received within 10s
  clearTimeout(timeout);
  ```

For additional details, see [Options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration).

## Connection parameters

The usual way to configure the connection is a full connection string:

```javascript
const sql = neon(process.env.DATABASE_URL);
```

You can also pass individual connection parameters in the options object. The supported parameters are `user` (or `username`), `password`, `host` (or `hostname`), `port`, `database`, and `connectionString`. They can supplement a connection string, override parts of it, or fully replace it:

```javascript
// No connection string: pass the parts individually
const sql = neon({ user, password, host, database });

// Override part of a connection string
const sql = neon(process.env.DATABASE_URL, { host: readReplicaHost });
```

Each parameter can be a string (or a number, for `port`), or a **sync or async function that's resolved on every query**. Resolving on every query is useful for short-lived credentials that must be fetched fresh, such as an OIDC token used as the password:

```javascript
const sql = neon(DATABASE_URL_WITHOUT_PASSWORD, {
  password: async () => await getAccessToken(),
});
```

The same connection parameters are accepted by the `query` and `transaction` functions.

The `Client` and `Pool` classes also accept a sync or async `password` function. To combine one with a connection string, use the exported `parseIntoClientConfig` helper:

```javascript
import { Pool, parseIntoClientConfig } from '@neondatabase/serverless';

const pool = new Pool({
  ...parseIntoClientConfig(process.env.DATABASE_URL),
  password: async () => await getAccessToken(),
});
```

<Admonition type="note">
Connection parameters, password functions with `pipelineConnect` enabled (the default), and `parseIntoClientConfig` require `@neondatabase/serverless` 1.2.0 or later.
</Admonition>

## Transaction options

For how to run queries with `transaction()`, see [Issue multiple queries with the transaction() function](/docs/serverless/serverless-driver#issue-multiple-queries-with-the-transaction-function).

The optional second argument to `transaction()`, `options`, has the same keys as the options to the ordinary query function (`arrayMode`, `fullResults` and `fetchOptions`) plus three additional keys that concern the transaction configuration. These transaction-related keys are: `isolationLevel`, `readOnly` and `deferrable`.

Pass query and transaction options as the second argument of `transaction()`, not on the individual queries inside it. The TypeScript types don't accept options on individual queries, and `fetchOptions` can't apply per query because the whole transaction is sent as a single `fetch` request. For example:

```javascript
const [rows] = await sql.transaction([sql`SELECT now()`], { arrayMode: true });
```

- `isolationLevel`

  This option selects a Postgres [transaction isolation mode](https://www.postgresql.org/docs/current/transaction-iso.html). If present, it must be one of `ReadUncommitted`, `ReadCommitted`, `RepeatableRead`, or `Serializable`.

- `readOnly`

  If `true`, this option ensures that a `READ ONLY` transaction is used to execute the queries passed. This is a boolean option. The default value is `false`.

- `deferrable`

  If `true` (and if `readOnly` is also `true`, and `isolationLevel` is `Serializable`), this option ensures that a `DEFERRABLE` transaction is used to execute the queries passed. This is a boolean option. The default value is `false`.

For additional details, see [transaction(...) function](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#transaction-function).

## Using transactions with JWT self-verification

When using Row-Level Security (RLS) to secure backend SQL with the Neon serverless driver, you may need to set JWT claims within a transaction context. Use this for custom JWT verification flows in backend APIs, where you want to ensure user-specific access to rows according to RLS policies.

Here's an example of how to use the `transaction()` function with self-verified JWT claims:

```javascript
import { neon } from '@neondatabase/serverless';

// Example JWT verification function, typically in a separate auth utilitiy file (implement according to your auth provider)
async function verifyJWT(jwtToken, jwksURL) {
  // Your JWT verification logic here
  // This should return the decoded payload
  return { payload: { sub: 'user123', email: 'user@example.com' } };
}

const sql = neon(process.env.DATABASE_URL);

// Get JWT token from request headers or context
const jwtToken = req.headers.authorization?.replace('Bearer ', '');
const jwksURL = process.env.JWKS_URL; // Your JWKS endpoint

// Verify the JWT and extract claims
const { payload } = await verifyJWT(jwtToken, jwksURL);
const claims = JSON.stringify(payload);

// Use transaction to set JWT claims and query data
const [, my_table] = await sql.transaction([
  sql`SELECT set_config('request.jwt.claims', ${claims}, true)`,
  sql`SELECT * FROM my_table`,
]);
```

<Admonition type="important">
When using JWT self-verification with RLS, ensure your database connection string uses a role that does **not** have the `BYPASSRLS` attribute. Avoid using the `neondb_owner` role in your connection string, as it bypasses Row-Level Security policies.
</Admonition>

This pattern allows you to:

- Verify JWTs using your own authentication logic
- Set the JWT claims in the database session context
- Access JWT claims in your RLS policies
- Execute multiple queries within a single transaction while maintaining the auth context

## neonConfig options

The `neonConfig` object configures `Pool` and `Client` connections over WebSockets, for example to supply a WebSocket constructor on Node.js 21 and earlier, or to change pipelining and proxy settings. For the full list, see [neonConfig configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#neonconfig-configuration) in the driver repository.

<NeedHelp/>
