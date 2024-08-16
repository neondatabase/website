---
title: Connect from TypeORM to Neon
subtitle: Learn how to connect to Neon from TypeORM
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.667Z'
---

TypeORM is an open-source ORM that lets you to manage and interact with your database. This guide covers the following topics:

- [Connect to Neon from TypeORM](#connect-to-neon-from-typeorm)
- [Use connection pooling with TypeORM](#use-connection-pooling-with-typeorm)
- [Connection timeouts](#connection-timeouts)

## Connect to Neon from TypeORM

To establish a basic connection from TypeORM to Neon, perform the following steps:

1. Retrieve your Neon connection string. In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
   ![Connection details widget](/docs/connect/connection_details.png)
   The connection string includes the user name, password, hostname, and database name.

2. Update the TypeORM's DataSource initialization in your application to the following:

   ```typescript {4,5,6}
   import { DataSource } from 'typeorm';

   export const AppDataSource = new DataSource({
     type: 'postgres',
     url: process.env.DATABASE_URL,
     ssl: true,
     entities: [
       /*list of entities*/
     ],
   });
   ```

3. Add a `DATABASE_URL` variable to your `.env` file and set it to the Neon connection string that you copied in the previous step. We also recommend adding `?sslmode=require` to the end of the connection string to ensure a [secure connection](/docs/connect/connect-securely).

   Your setting will appear similar to the following:

   ```text shouldWrap
   DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
   ```

<Admonition type="tip">
TypeORM leverages a [node-postgres](https://node-postgres.com) Pool instance to connect to your Postgres database. Installing [pg-native](https://npmjs.com/package/pg-native) and setting the `NODE_PG_FORCE_NATIVE` environment variable to `true` [switches the `pg` driver to `pg-native`](https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/index.js#L31-L34), which, according to some users, produces noticeably faster response times.
</Admonition>

## Use connection pooling with TypeORM

Serverless functions can require a large number of database connections as demand increases. If you use serverless functions in your application, we recommend that you use a pooled Neon connection string, as shown:

```ini shouldWrap
# Pooled Neon connection string
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

A pooled Neon connection string adds `-pooler` to the endpoint ID, which tells Neon to use a pooled connection. You can add `-pooler` to your connection string manually or copy a pooled connection string from the **Connection Details** widget on the Neon **Dashboard**. Use the **Pooled connection** checkbox to add the `-pooler` suffix.

## Connection timeouts

A connection timeout that occurs when connecting from TypeORM to Neon causes an error similar to the following:

```text shouldWrap
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`
Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`.
```

This error most likely means that the TypeORM query timed out before the Neon compute was activated.

A Neon compute has two main states: _Active_ and _Idle_. Active means that the compute is currently running. If there is no query activity for 5 minutes, Neon places a compute into an idle state by default.

When you connect to an idle compute from TypeORM, Neon automatically activates it. Activation typically happens within a few seconds but added latency can result in a connection timeout. To address this issue, you can adjust your Neon connection string by adding a `connect_timeout` parameter. This parameter defines the maximum number of seconds to wait for a new connection to be opened. The default value is 5 seconds. A higher setting may provide the time required to avoid connection timeouts. For example:

```text shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&connect_timeout=10"
```

<Admonition type="note">
A `connect_timeout` setting of 0 means no timeout.
</Admonition>

<NeedHelp/>
