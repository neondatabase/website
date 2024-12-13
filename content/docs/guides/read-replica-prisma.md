---
title: Use Neon read replicas with Prisma
subtitle: Learn how to scale Prisma applications with Neon read replicas
enableTableOfContents: true
updatedOn: '2024-12-11T21:23:33.086Z'
---

A Neon read replica is an independent read-only compute that performs read operations on the same data as your primary read-write compute, which means adding a read replica to a Neon project requires no additional storage.

A key benefit of read replicas is that you can distribute read requests to one or more read replicas, enabling you to easily scale your applications and achieve higher throughput for both read-write and read-only workloads.

For more information about Neon's read replica feature, see [Read replicas](/docs/introduction/read-replicas).

In this guide, we'll show you how you can leverage Neon read replicas to efficiently scale Prisma applications using Prisma Client's read replica extension: [@prisma/extension-read-replicas](https://github.com/prisma/extension-read-replicas).

## Prerequisites

- An application that uses Prisma with a Neon database.

## Create a read replica

You can create one or more read replicas for any branch in your Neon project.

You can add a read replica by following these steps:

1. In the Neon Console, select **Branches**.
2. Select the branch where your database resides.
3. Click **Add Read Replica**.
4. On the **Add new compute** dialog, select **Read replica** as the **Compute type**.
5. Specify the **Compute size settings** options. You can configure a **Fixed Size** compute with a specific amount of vCPU and RAM (the default) or enable autoscaling by configuring a minimum and maximum compute size. You can also configure the **Scale to zero** setting, which controls whether your read replica compute is automatically suspended due to inactivity after 5 minutes.
   <Admonition type="note">
   The compute size configuration determines the processing power of your database. More vCPU and memory means more processing power but also higher compute costs. For information about compute costs, see [Billing metrics](/docs/introduction/billing).
   </Admonition>
6. When you finish making selections, click **Create**.

   Your read replica compute is provisioned and appears on the **Computes** tab of the **Branches** page.

Alternatively, you can create read replicas using the [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint) or [Neon CLI](/docs/reference/cli-branches#create).

<CodeTabs labels={["API", "CLI"]}>

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/late-bar-27572981/endpoints \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "endpoint": {
    "type": "read_only",
    "branch_id": "br-young-fire-15282225"
  }
}
' | jq
```

```bash
neon branches add-compute mybranch --type read_only
```

</CodeTabs>

## Retrieve the connection string for your read replica

Connecting to a read replica is the same as connecting to any branch in a Neon project, except you connect via a read replica compute instead of your primary read-write compute. The following steps describe how to retrieve the connection string (the URL) for a read replica from the Neon Console.

1. On the Neon **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
1. Under **Compute**, select a **Replica** compute.
1. Select the connection string and copy it. This is the information you need to connect to the read replica from your Prisma Client. The connection string appears similar to the following:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```

   If you expect a high number of connections, select **Pooled connection** to add the `-pooler` flag to the connection string, but remember to append `?pgbouncer=true` to the connection string when using a pooled connection. Prisma requires this flag when using Prisma Client with PgBouncer. See [Use connection pooling with Prisma](/docs/guides/prisma#use-connection-pooling-with-prisma) for more information.

## Update your env file

In your `.env` file, set a `DATABASE_REPLICA_URL` environment variable to the connection string of your read replica. Your `.env` file should look something like this, with your regular `DATABASE_URL` and the newly added `DATABASE_REPLICA_URL`.

```text
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname"
DATABASE_REPLICA_URL="postgresql://alex:AbC123dEf@ep-damp-cell-123456.us-east-2.aws.neon.tech/dbname"
```

Notice that the `endpoint_id` (`ep-damp-cell-123456`) for the read replica compute differs. The read replica is a different compute and therefore has a different `endpoint_id`.

## Configure Prisma Client to use a read replica

[@prisma/extension-read-replicas](https://github.com/prisma/extension-read-replicas) adds support to Prisma Client for read replicas. The following steps show you how to install the extension and configure it to use a Neon read replica.

1. Install the extension in your Prisma project:

   ```bash
   npm install @prisma/extension-read-replicas
   ```

2. Extend your Prisma Client instance by importing the extension and adding the `DATABASE_REPLICA_URL` environment variable as shown:

   ```javascript
   import { PrismaClient } from '@prisma/client';
   import { readReplicas } from '@prisma/extension-read-replicas';

   const prisma = new PrismaClient().$extends(
     readReplicas({
       url: DATABASE_REPLICA_URL,
     })
   );
   ```

   <Admonition type="note">
   You can also pass an array of read replica connection strings if you want to use multiple read replicas. Neon supports adding multiple read replicas to a database branch.

   ```javascript
   // lib/prisma.ts
   const prisma = new PrismaClient().$extends(
     readReplicas({
       url: [process.env.DATABASE_REPLICA_URL_1, process.env.DATABASE_REPLICA_URL_2],
     })
   );
   ```

   </Admonition>

   When your application runs, read operations are sent to the read replica. If you specify multiple read replicas, a read replica is selected randomly.

   All write and `$transaction` queries are sent to the primary compute defined by `DATABASE_URL`, which is your read/write compute.

   If you want to read from the primary compute and bypass read replicas, you can use the `$primary()` method in your extended Prisma Client instance:

   ```bash
   const posts = await prisma.$primary().post.findMany()
   ```

   This Prisma Client query will be routed to your primary database.

## Examples

This example demonstrates how to use the [@prisma/extension-read-replicas](https://github.com/prisma/extension-read-replicas) extension in Prisma Client. It uses a simple TypeScript script to read and write data in a Postgres database.

<DetailIconCards>
<a href="https://github.com/prisma/read-replicas-demo" description="A TypeScript example showing how to use the @prisma/extension-read-replicas extension in Prisma Client" icon="github">Prisma read replicas demo</a>
</DetailIconCards>

<NeedHelp/>
