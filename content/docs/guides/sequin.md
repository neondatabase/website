---
title: Stream data to Neon with Sequin
subtitle: Learn how to sync data from platforms like Stripe, Linear, and GitHub into
  your Neon database in real time.
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.408Z'
---

Sequin streams data from platforms like Stripe, Linear, and GitHub into your Neon database in real time. The moment a new subscription is created, a ticket is closed, or a PR is merged, a row in your database will reflect the change.

With data from these services in your database, you can build integrations fast. For instance, you can quickly query for a customer’s subscription status or display the comments from a user’s support ticket.

In this guide, you’ll learn how to stream data to Neon Postgres via Sequin by:

- Connecting Sequin to an API source
- Creating a Sequin Postgres consumer that streams to Neon
- Querying your API data in Neon Postgres
- Creating views to make querying easier

## Prerequisites

- A [Sequin account](https://sequin.io/signup)
- A [Neon account](https://console.neon.tech/)
- An [API Source](https://sequin.io/integrations) you want to sync

## Create a schema and table for Sequin

As a first step, create a table in your Neon database for Sequin to sync API data to. We also recommend creating a dedicated Postgres schema for Sequin tables, but that's not required:

1. Select your project in the Neon Console
2. Navigate to the SQL Editor in the sidebar.
3. Create a `sequin` schema by running the following statement:

   ```sql
   create schema sequin;
   ```

4. Run the following command to create a table for Sequin to sync API data to:

   ```sql
   create table sequin.records (
   sequin_id uuid not null,
   sync_id uuid not null,
   collection_id text not null,
   upstream_id text not null,
   payload jsonb not null,
   upstream_updated_at timestamp with time zone not null,
   upstream_created_at timestamp with time zone,
   inserted_at timestamp with time zone not null,
   updated_at timestamp with time zone not null,
   primary key (sequin_id)
   );
   ```

You can use this table to store data from any API. API data is stored denormalized in the `payload` column. Later, you'll see how to create views on top of this table.

## Create a Postgres user for Sequin

Create a user for Sequin to use when connecting to your Neon database. This user will need `insert`, `update`, and `delete` privileges on the `sequin.records` table:

1. In the Neon SQL Editor, run the following create statement:

```sql
create user sequin with password 'generate-a-strong-password-here';
```

2. Then, grant the `sequin` user the necessary privileges by running the following statements:

```sql
grant usage on schema sequin to sequin;
grant select, insert, update, delete on all tables in schema sequin to sequin;
alter default privileges in schema sequin grant select, insert, update, delete on tables to sequin;
```

These statements do the following:

- Grants the `sequin` user usage permissions on the `sequin` schema.
- Grants the `sequin` user `select`, `insert`, `update`, and `delete` permissions on all existing tables in the `sequin` schema.
- Sets default privileges so that the `sequin` user will have `select`, `insert`, `update`, and `delete` permissions on any new tables created in the `sequin` schema.

With this user, Sequin will only have access to the tables it needs and will not be able to modify any other data in your database.

With your `sequin` schema and `records` table in your Neon database, you’ll now configure Sequin to authenticate with your API source, create a sync, and stream data to your database.

## Connect Sequin to an API source

You can connect Sequin to an upstream API using either the Sequin console or API. For this guide, let’s use the Sequin Console for simplicity:

1. Login to the Sequin console and click the **+ Add sync** button
2. Select the source you want to sync.
3. Click the **+ Add new** button in the credential section to complete the authentication flow for your selected API source.
4. Once authenticated, you’ll see a list of objects available to sync. Select the object you want to sync and click the **Start syncing** button.

Sequin will begin to backfill all historic records from the API source and set up a real-time stream as new records are created, updated, and deleted.

## Create a Sequin Postgres consumer

Next, you'll create a Postgres consumer to stream data from your API source to your Neon Postgres database. Consumers are how you stream data from Sequin's syncs to destinations.

As a first step, you need to connect your Neon database to Sequin as a target:

1. In the Sequin Console, navigate to the **Targets** tab and click the **+ Add target** button. Enter the credentials for your database:
   - You’ll find the host and database on the **Connection Details** widget on your Neon project dashboard.
   - The port is `5432`
   - Make sure you check the **SSL** option. (This is required by Neon.)
   - Use the username and password for the `sequin` user you created earlier.
2. Sequin will validate its connection to your Neon database and you’ll be able to **Save**.

Now, create a consumer to stream data from your Sync to your Neon database target. Consumers allow you to sync multiple sources into one Neon DB target:

1. In the Sequin Console, navigate to the **Consumers** tab and click the **+ Add consumer** button.
2. Select your API provider (e.g. GitHub, Stripe, etc) and your Sync.
3. Then select your Neon database for the target and enter the schema (i.e., `sequin`) and table (i.e., `records`) you set up earlier.
4. Sequin will confirm your database is configured properly - then click the **Start consumer** button.

At this point, your API data should be flowing into Neon Postgres! Let's verify by querying the database.

## Query your API data in Neon Postgres

In the Neon Console, open the **SQL Editor**.

Verify data is being synced by running this query:

```sql
select count(*) from sequin.records;
```

You should see a non-zero count, indicating that Sequin has begun streaming data from GitHub into your Neon database.

To see an example record:

```sql
select * from sequin.records limit 1;
```

Now, any time a record is created, updated, or deleted in your API source, Sequin will upsert a row in the `sequin.records` table in real-time!

## Create views to make querying easier

While you can query the `sequin.records` table directly, you'll usually want to create views that flatten the nested JSONB payload.

For example, here's how you could create a view for GitHub pull requests:

```sql
create view sequin.github_pull_requests as
select
  payload->>'id' as github_id,
  payload->>'title' as title,
  payload->>'body' as body,
  (payload->>'created_at')::timestamp as created_at,
  (payload->>'merged_at')::timestamp as merged_at,
  payload->>'head'->>'label' as head_label,
from sequin.records
where collection_id = 'github:pull_request';
```

The `payload->>` syntax extracts a value from the JSONB payload. The `where collection_id` clause is used to filter the view to only pull requests.

With this approach, you can create a view for each collection you're syncing from a given API source. This gives you full control of the schemas for your API data. Because Sequin is syncing to the core `sequin.records` table, you can change your views and it won't affect your sync.

You can query views like any other table:

```sql
select title, state, created_at
from sequin.github_pull_requests
order by created_at desc
limit 10;
```

To generate these views, you can use [this handy tool](https://materialize.com/docs/ingest-data/stripe/#json-parsing).

## Where to next?

By streaming your API data to Neon Postgres, you have a complete picture of your API data at rest. This means you can query your API data using the full power of SQL, without rate limits, and join it with other data in your Neon database.

If you have any questions or need any support, contact the Sequin team: [support@sequin.io](mailto:support@sequin.io).

## References

- [What is Sequin](https://sequin.io/docs/introduction)
- [Sequin Postgres consumer reference](https://sequin.io/docs/consumers/postgres)
- [Sequin Management API reference](https://sequin.io/docs/management-api/introduction)
