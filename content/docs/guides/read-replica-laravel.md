---
title: Use Neon read replicas with Laravel Database Manager
subtitle: Scale your application with Neon read replicas with Laravel Database Manager
enableTableOfContents: true
---

A Neon read replica is an independent read-only compute that performs read operations on the same data as your primary read-write compute. Adding a read replica to a Neon project requires no additional storage, making it an efficient way to scale your applications.

By distributing read requests across one or more read replicas, you can significantly increase the throughput for read-heavy workloads, reducing the load on your primary database and improving overall performance.

For more information about Neon's read replica feature, see Read replicas.

In this guide, we’ll show you how to integrate Neon read replicas into a Laravel application, leveraging [Laravel's built-in support for read/write database connections](https://laravel.com/docs/4.2/database#read-write-connections).

## Prerequisites

- An application that uses Laravel with a Neon database.
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


## Retrieve the connection string for your read replica

Connecting to a read replica is the same as connecting to any branch in a Neon project, except you connect via a read replica compute instead of your primary read-write compute. The following steps describe how to retrieve the connection string (the URL) for a read replica from the Neon Console.

1. On the Neon **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
1. Under **Compute**, select a **Replica** compute.
1. Select the connection string and copy it. This is the information you need to connect to the read replica from your Laravel application. The connection string appears similar to the following:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```


## Update your environment variables

In your `.env` file, add the connection strings for both the primary database and the read replica. It should look something like this:

```ini
DB_CONNECTION=pgsql
DB_HOST=ep-cool-darkness-123456.us-east-2.aws.neon.tech
DB_PORT=5432
DB_DATABASE=dbname
DB_USERNAME=alex
DB_PASSWORD=AbC123dEf

DB_READ_HOST=ep-damp-cell-123456.us-east-2.aws.neon.tech
DB_READ_USERNAME=alex
DB_READ_PASSWORD=AbC123dEf
```

## Configure Laravel to use read replicas

Laravel provides built-in support for read/write database connections. To configure Laravel to use a read replica, update your `config/database.php` file as follows:

```php'pgsql' => [
    'driver'   => 'pgsql',
    'host'     => env('DB_HOST'),
    'port'     => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE'),
    'username' => env('DB_USERNAME'),
    'password' => env('DB_PASSWORD'),
    'charset'  => 'utf8',
    'prefix'   => '',
    'schema'   => 'public',
    'sslmode'  => 'prefer',
    'options'  => extension_loaded('pdo_pgsql') ? array_filter([
        PDO::PGSQL_ATTR_SSL_CA => env('DB_SSL_CA'),
    ]) : [],

    'read' => [
        'host'     => env('DB_READ_HOST'),
        'username' => env('DB_READ_USERNAME'),
        'password' => env('DB_READ_PASSWORD'),
    ],
    'write' => [
        'host'     => env('DB_HOST'),
        'username' => env('DB_USERNAME'),
        'password' => env('DB_PASSWORD'),
    ],
],
```

<Admonition type="note"> 
You can add multiple read replicas by specifying them in the `read` array. Laravel will automatically balance read queries across the available replicas.
</Admonition>

</CodeTabs>

## Testing and monitoring

After configuring your application, test the read replica setup to ensure that read queries are correctly routed to the replica. Monitoring your database traffic will help you verify the load distribution between the primary and read replicas, optimizing your application’s performance.