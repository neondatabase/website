---
title: Use Neon read replicas with Prisma 
subtitle: Learn how to scale your Prisma applications with Neon read replicas
enableTableOfContents: true
---

Neon read replicas are independent read-only compute instances that perform read operations on the same data as your read-write computes, which means zero additional storage cost since they read from the same source as your read-write compute. There is no data replication involved. When a read replica starts up, it is immediately up to date with your read-write primary. You do not have to wait for updates.

Additionally, read-only computes can take advantage of Neon's Autoscaling and Auto-suspend features, which enable efficient compute resource management.

A key benefit of read replicas is that you can distribute read requests to one or more read replicas, enabling you to achieve higher throughput for both read-write and read-only workloads.

In this guide, we'll show you how you can leverage Neon read replicas to efficiently scale your Prisma applications using [@prisma/extension-read-replicas](https://github.com/prisma/extension-read-replicas), which adds read replica support to Prisma Client.

## Prerequisites

- An application that uses Prisma with a Neon database.
- A [Neon Pro plan](/docs/introduction/pro-plan) account. Read replicas are a Neon Pro plan feature.

## Create a read replica

You can create one or more read replicas for any branch in your Neon project. Creating a read replica involves adding a read-only compute endpoint to the Neon branch. You can add a read-only compute endpoint to a branch in your Neon project by following these steps:

1. In the Neon Console, select **Branches**.
2. Select the branch where your database resides.
3. Click **Add compute**.
4. On the **Create Compute Endpoint** dialog, select **Read-only** as the **Compute type**.
5. Specify the **Compute size** options. You can configure a **Fixed Size** compute with a specific amount of vCPU and RAM (the default) or enable **Autoscaling** and configure a minimum and maximum compute size. You can also configure the **Auto-suspend delay** period, which is the amount of idle time after which your read-only compute is transitioned to an idle state. The default setting is 300 seconds (5 minutes). You can set this value up to 604800 seconds (7 days).
    <Admonition type="note">
    The compute size configuration determines the processing power of your database. More vCPU and memory means more processing power but also higher compute costs. For information about compute costs, see [Billing metrics](/docs/introduction/billing).
    </Admonition>
6. When you finish making your selections, click **Create**.

Your read-only compute is provisioned and appears in the **Computes** section of the **Branches** page.

Alternatively, you can create read replicas using the [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint) or [Neon CLI](/docs/reference/cli-branches#create).

<CodeTabs labels={["API", "CLI"]}>

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/late-bar-27572981/endpoints \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
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
neonctl branches add-compute mybranch --type read_only
```

</CodeTabs>

## Retrieve the connection string for your read replica

Connecting to a read replica is the same as connecting to any branch in a Neon project, except you connect via a read-only compute endpoint instead of a read-write compute endpoint. The following steps describe how to retrieve the connection string (the URL) for a read replica from the Neon Console.

1. On the Neon **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
1. Under **Compute**, select your **Read-only** compute endpoint.
1. Select the connection string and copy it. This is the information you need to connect to the read replica from Prisma.

    The connection string appears similar to the following:

    <CodeBlock shouldWrap>

    ```bash
    postgres://daniel:<password>@ep-raspy-cherry-95040071.us-east-2.aws.neon.tech/neondb
    ```

    </CodeBlock>

    If you expect a high number of connections, select **Pooled connection** to add the `-pooler` flag to the connection string, but remember to append `?pgbouncer=true` to your connection string when using a pooled connection. Prisma requires this flag when using Prisma Client with PgBouncer. See [https://neon.tech/docs/guides/prisma#connect-from-serverless-functions]/docs/guides/prisma#connect-from-serverless-functions) for more information.

## Connect to the read replica from Prisma

The `@prisma/extension-read-replicas` extension allows you to connect to a Neon read replica.

1. Install the extension in your Prisma project:

    ```bash
    npm install @prisma/extension-read-replicas
    ```

2. Extend your Prisma Client instance and point it to the Neon read replica:

    ```javascript
    import { PrismaClient } from '@prisma/client'
    import { readReplicas } from '@prisma/extension-read-replicas'

    const prisma = new PrismaClient()
    .$extends(
        readReplicas({
        url: DATABASE_REPLICA_URL,
        }),
    )
    ```

    <Admonition type="note">
    You can also pass an array of read replica connection strings if you would like to use multiple read replicas.

    ```javascript
    // lib/prisma.ts
    const prisma = new PrismaClient()
    .$extends(
    readReplicas({
        url: [
        process.env.DATABASE_REPLICA_URL_1,
        process.env.DATABASE_REPLICA_URL_2,
        ],
    }),
    )
    ```

    </Admonition>

    When your app runs, all read operations are sent to the read replica. If you specify multiple read replicas, a read replica is selected randomly.

    On the other hand, all write and `$transaction` queries are forwarded to the primary compute endpoint.

    If you would like to read from the primary compute endpoint and bypass read replicas, you can use the `$primary()` method on your extended Prisma Client instance:

    ```bash
    const posts = await prisma.$primary().post.findMany()
    ```

    This Prisma Client query is always routed to your primary database to ensure up-to-date data.

## Examples

This example shows how to use database replication using the @prisma/extension-read-replicas extension in Prisma Client. It uses a simple TypeScript script to read and write data in a PostgreSQL database.

<DetailIconCards>
<a href="https://github.com/prisma/read-replicas-demo" description="A TypeScript example showing how to use the @prisma/extension-read-replicas extension in Prisma Client" icon="github">Prisma read replicas demo</a>
</DetailIconCards>
