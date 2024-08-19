---
title: Connect from Knex to Neon
subtitle: Learn how to connect to Neon from Knex
tag: new
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.653Z'
---

Knex is an open-source SQL query builder for Postgres. This guide covers the following topics:

- [Connect to Neon from Knex](#connect-to-neon-from-knex)
- [Use connection pooling with Knex](#use-connection-pooling-with-knex)
- [Performance tips](#performance-tips)

## Connect to Neon from Knex

To establish a basic connection from Knex to Neon, perform the following steps:

1. Retrieve your Neon connection string. In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
   ![Connection details widget](/docs/connect/connection_details.png)
   The connection string includes the user name, password, hostname, and database name.

2. Update the Knex's initialization in your application to the following:

   ```typescript {2-5}
   export const client = knex({
     client: 'pg',
     connection: {
       connectionString: process.env.DATABASE_URL,
     },
   });
   ```

3. Add a `DATABASE_URL` variable to your `.env` file and set it to the Neon connection string that you copied in the previous step. We also recommend adding `?sslmode=require` to the end of the connection string to ensure a [secure connection](/docs/connect/connect-securely).

   Your setting will appear similar to the following:

   ```text shouldWrap
   DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
   ```

## Use connection pooling with Knex

Serverless functions can require a large number of database connections as demand increases. If you use serverless functions in your application, we recommend that you use a pooled Neon connection string, as shown:

```ini shouldWrap
# Pooled Neon connection string
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

A pooled Neon connection string adds `-pooler` to the endpoint ID, which tells Neon to use a pooled connection. You can add `-pooler` to your connection string manually or copy a pooled connection string from the **Connection Details** widget on the Neon **Dashboard**. Use the **Pooled connection** checkbox to add the `-pooler` suffix.

## Performance tips

This section outlines performance optimizations you can try when using Knex with Neon.

### Enabling NODE_PG_FORCE_NATIVE

Knex leverages a [node-postgres](https://node-postgres.com) Pool instance to connect to your Postgres database. Installing [pg-native](https://npmjs.com/package/pg-native) and setting the `NODE_PG_FORCE_NATIVE` environment variable to `true` [switches the `pg` driver to `pg-native`](https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/index.js#L31-L34), which can produce noticeably faster response times according to some users.

### Replacing query parameters

You may be able to achieve better performance with Knex by replacing any parameters you've defined in your queries, as performed by the following function, for example:

```tsx
// Function to replace query parameters in a query
function replaceQueryParams(query, values) {
  let replacedQuery = query;
  values.forEach((tmpParameter) => {
    if (typeof tmpParameter === 'string') {
      replacedQuery = replacedQuery.replace('?', `'${tmpParameter}'`);
    } else {
      replacedQuery = replacedQuery.replace('?', tmpParameter);
    }
  });
  return replacedQuery;
}

// So instead of this
await client.raw(text, values);

// Do this to get better performance
await client.raw(replaceQueryParams(text, values));
```

You can try this optimization yourself by downloading our [Get started with Knex example](#examples) and running `npm run test`.

## Examples

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-knex" description="Get started with Knex and Neon" icon="github">Get started with Knex and Neon</a>

</DetailIconCards>

<NeedHelp/>
