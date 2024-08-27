---
title: Use Neon read replicas with Sequelize
subtitle: Learn how to use Neon read replicas with Sequelize
enableTableOfContents: true
---

A Neon read replica is an independent read-only compute that performs read operations on the same data as your primary read-write compute. Adding a read replica to a Neon project requires no additional storage, making it an efficient way to scale your applications.

By distributing read requests across one or more read replicas, you can significantly increase the throughput for read-heavy workloads, reducing the load on your primary database and improving overall performance.

For more information about Neon's read replica feature, see [Read replicas](/docs/introduction/read-replicas).

In this guide, we’ll show you how to integrate Neon read replicas into a Sequelize application, leveraging [Sequelize’s built-in support for read replication](https://sequelize.org/docs/v6/other-topics/read-replication/).

## Prerequisites

- An application that uses Sequelize with a Neon database.
- A Neon paid plan account. Read replicas are a paid plan feature.

## Create a read replica

You can create one or more read replicas for any branch in your Neon project.

You can add a read replica by following these steps:

1. In the Neon Console, select **Branches**.
2. Select the branch where your database resides.
3. Click **Add Read Replica**.
4. On the **Add new compute** dialog, select **Read replica** as the **Compute type**.
5. Specify the **Compute size settings** options. You can configure a **Fixed Size** compute with a specific amount of vCPU and RAM (the default) or enable autoscaling by configuring a minimum and maximum compute size. You can also configure the **Suspend compute after inactivity** setting, which is the amount of idle time after which your read replica compute is automatically suspended. The default setting is 5 minutes.
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
1. Select the connection string and copy it. This is the information you need to connect to the read replica from your Sequelize application. The connection string appears similar to the following:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```

   If you expect a high number of connections, select **Pooled connection** to add the `-pooler` flag to the connection string, but remember to append `?pgbouncer=true` to the connection string when using a pooled connection. Prisma requires this flag when using Prisma Client with PgBouncer. See [Use connection pooling with Prisma](/docs/guides/prisma#use-connection-pooling-with-prisma) for more information.

## Update your environment variables

In your environment configuration file (e.g., `.env`), add the connection strings for both the primary database and the read replica. It should look something like this:

```ini
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname"
DATABASE_REPLICA_URL="postgresql://alex:AbC123dEf@ep-damp-cell-123456.us-east-2.aws.neon.tech/dbname"
```

## Configure Sequelize to use read replicas

Sequelize provides built-in support for read replicas through its **replication** option. To configure Sequelize to use a read replica, update your Sequelize initialization code as follows:

```js
const { Sequelize } = require('sequelize');
const { parse } = require('pg-connection-string');

// Parse the connection strings from the environment variables
const primaryConfig = parse(process.env.DATABASE_URL);
const replicaConfig = parse(process.env.DATABASE_REPLICA_URL);

const sequelize = new Sequelize({
  dialect: 'postgres',
  replication: {
    read: [
      {
        host: replicaConfig.host,
        username: replicaConfig.user,
        password: replicaConfig.password,
        database: replicaConfig.database,
      },
    ],
    write: {
      host: primaryConfig.host,
      username: primaryConfig.user,
      password: primaryConfig.password,
      database: primaryConfig.database,
    },
  },
  pool: { max: 20, idle: 30000 },
});
```

<Admonition type="note" title="Notes"> 
- **Read Replicas Array**: You can add multiple read replicas by including more objects in the read array. Sequelize will automatically balance read queries across the available replicas. 
- **Connection Pooling**: Sequelize uses a pool to manage connections to your replicas. Internally, Sequelize will maintain separate pools for reads and writes. If you want to modify these, you can adjust the `pool` configuration when instantiating Sequelize, as shown in the example above. 
</Admonition>

## Testing and monitoring

After configuring your application, test the read replica setup to ensure that read queries are correctly routed to the replica. Monitoring your database traffic will help you verify the load distribution between the primary and read replicas, optimizing your application’s performance.

<NeedHelp/>
