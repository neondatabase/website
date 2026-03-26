---
title: Connect from Knex to Neon
subtitle: Learn how to connect to Neon from Knex
summary: >-
  How to connect Knex to Neon, including steps for establishing a connection,
  configuring environment variables, and utilizing connection pooling for
  optimal performance in serverless applications.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.995Z'
---

<CopyPrompt src="/prompts/knex-prompt.md" description="Pre-built prompt for connecting Node.js applications with Knex to Neon"/>

Knex is an open-source SQL query builder for Postgres. This guide explains how to connect Knex to Neon. Choose **Connect with neon init** for a quick, guided setup or **Connect manually** for step-by-step instructions.

<Tabs labels={["Connect with neon init", "Connect manually"]}>

<TabItem>

To connect your Knex app to Neon using AI-assisted setup:

<Steps>

## Create a Knex project

Set up a Node.js or TypeScript project if you do not have one.

## Run neon init

1. From your project root, run [`neon init`](/docs/reference/cli-init):

   ```bash
   npx neonctl@latest init
   ```

2. Follow the interactive prompts to sign up for Neon (or log in) and select your editor(s). This installs the AI development tooling for your coding environment:
   - MCP server
   - Agent skills
   - IDE extensions
   - Plugins

3. **Restart your editor** to pick up the new tooling.

## Ask your AI assistant to get started

Open your AI assistant's chat and type:

> Get started with Neon

Your AI assistant will walk you through:

- Creating a database branch in a new or existing Neon project
- Storing the connection string in your project's `.env` file
- Installing the appropriate client libraries
- Configuring your Knex app to connect to Neon

</Steps>

<Admonition type="tip">
For details on what `neon init` creates and how to customize it, see the [CLI init reference](/docs/reference/cli-init).
</Admonition>

</TabItem>

<TabItem>

To create a Neon project and connect from Knex:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Store your Neon credentials

Add a `DATABASE_URL` variable to your `.env` file and set it to the Neon connection string. You can find the connection string for your database by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. We recommend adding `?sslmode=require&channel_binding=require` to the end of the connection string to ensure a [secure connection](/docs/connect/connect-securely).

```text shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

## Configure the Postgres client

Update the Knex initialization in your application to the following:

```typescript {2-5}
export const client = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
});
```

</Steps>

</TabItem>

</Tabs>

## Use connection pooling with Knex

Serverless functions can require a large number of database connections as demand increases. If you use serverless functions in your application, we recommend that you use a pooled Neon connection string, as shown:

```ini shouldWrap
# Pooled Neon connection string
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

A pooled Neon connection string adds `-pooler` to the endpoint ID, which tells Neon to use a pooled connection. You can add `-pooler` to your connection string manually or copy a pooled connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. Enable the **Connection pooling** toggle to add the `-pooler` suffix.

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
