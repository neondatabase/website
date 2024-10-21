---
title: Use Neon read replicas with ActiveRecord (Rails)
subtitle: Learn how to scale Rails applications with Neon read replicas
enableTableOfContents: true
isDraft: true
---

A Neon read replica is an independent read-only compute that performs read operations on the same data as your primary read-write compute. Adding a read replica to a Neon project requires no additional storage, making it an efficient way to scale your applications.

By distributing read requests across one or more read replicas, you can significantly increase the throughput for read-heavy workloads, reducing the load on your primary database and improving overall performance.

For more information about Neon's read replica feature, see [Read replicas](/docs/introduction/read-replicas).

In this guide, we’ll show you how to integrate Neon read replicas into a Rails application, leveraging [ActiveRecords support for multiple databases](https://guides.rubyonrails.org/active_record_multiple_databases.html).

## Prerequisites

- A Rails application that uses ActiveRecord with a Neon database.
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
1. Select the connection string and copy it. This is the information you need to connect to the read replica from your Rails application. The connection string appears similar to the following:

   ```bash shouldWrap
   postgresql://dbuser:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```

## Update your database.yml file

In your `config/database.yml` file, configure both the primary database and the read replicas. Here’s an example configuration:

```yaml
production:
  primary:
    adapter: postgresql
    database: dbname
    username: dbuser
    password: <%= ENV['dbuser_PASSWORD'] %>
    host: ep-cool-darkness-123456.us-east-2.aws.neon.tech
    pool: 5

  replica:
    adapter: postgresql
    database: dbname
    username: dbuser
    password: <%= ENV['dbuser_PASSWORD'] %>
    host: ep-damp-cell-123456.us-east-2.aws.neon.tech
    pool: 5
    replica: true
    reconnect: true
```

**Key points:**

- The `primary` section configures your read-write database connection.
- The `replica` section configures your read-only database connection. The `replica: true` setting indicates this is a read replica.

## Configure Rails to use read replicas

Starting with Rails 6, ActiveRecord supports automatic database switching between a primary and replica databases for read and write queries.

Add the following configuration to your `application.rb` or environment-specific configuration file (`production.rb`):

```ruby
# config/environments/production.rb

Rails.application.configure do
  config.active_record.database_selector = { delay: 2.seconds }
  config.active_record.database_resolver = ActiveRecord::Middleware::DatabaseSelector::Resolver
  config.active_record.database_resolver_context = ActiveRecord::Middleware::DatabaseSelector::Resolver::Session
end
```

<Admonition type="note" title="Notes"> 
- Automatic Switching: Rails will automatically route read queries to the replica and write queries to the primary database. You can control the delay before switching back to the primary after a write operation using the delay option.
- Manual Control: If you need to manually force a query to go to the primary database, use the use_primary method:

```ruby
ActiveRecord::Base.connected_to(role: :writing) do
  User.first
end
```

</Admonition>

## Testing and monitoring

After configuring your Rails application, thoroughly test the setup to ensure that read queries are being routed to the read replica and write queries to the primary database. Additionally, monitor the load on both the primary and replica databases to optimize performance.

<NeedHelp/>
