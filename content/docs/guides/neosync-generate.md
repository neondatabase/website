---
title: Generate synthetic data with Neosync
subtitle: Learn how to generate synthetic data in your Neon database with Neosync 
enableTableOfContents: true
---

[Neosync](https://www.neosync.dev/) is an open-source synthetic data orchestration platform that can create synthetic data and sync it across all of your Neon database environments.

In this guide, we'll show you how you can seed a Neon database with synthetic data for testing and rapid development using Neosync.

## Prerequisites

To complete the steps in the guide, you require the following:

- A Neon account and project. If you do not have those, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- A [Neosync](https://www.neosync.dev/) account.

## Neon setup

In Neon, we'll create a database for the synthetic data, define a table, and retrieve the database connection string.

### Create a database

To create a database, which we'll call `neon-neosync`, perform the following steps:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select your project.
1. Select **Databases** from the sidebar.
1. Select the branch where you want to create the database.
1. Click **New Database**.
1. Enter a database name (`neon-neosync`), and select a database owner.
1. Click **Create**.

### Create a table

1. In the Neon Console, select the **SQL Editor** from the sidebar.
2. Run the following commands to create your schema.

    ```sql
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE public.users (
        id UUID PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL
    );
    ```

    <Admonition type="note">
    Installing the Postgres UUID extension to auto-generate UUIDs for the `id` column is optional. If you prefer, you can let Neonsync generate the UUIDs column values for you.
    </Admonition>

### Copy the connection string for your database

Navigate to the **Dashboard** in Neon and copy the connection string for the destination database from the **Connection Details** widget. 

<Admonition type="note">
Make sure that you select the correct database (`neon-neosync`) from the **Database** drop-down menu.
</Admonition> 

Your connection string should look something like this:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neon-neosync?sslmode=require
```

## Neosync setup

### Configure a connection to the Neon database

1. Navigate to [Neosync](https://www.neosync.dev/) and login. Go to **Connections** > **New Connection** then click on **Postgres**.

2. Enter a unique name for the connection in the **Connection Name** field. We'll give it the same name as the database in this example: `neon-neosync`

3. Paste the Neon database connection string in **Connection URL** field and click **Test Connection** to verify that the connection works.

4. Click **Submit** to save the connection configuration.

### Generate synthetic data

1. To generate data, create a **Job** in Neosync. Click on **Jobs** and then click on **New Job**. You are presented with a few job types. Since you are seeding a table from scratch, select the **Data Generation** job type and click **Next**.

2. Give the job a name and then set **Initiate Job Run** to **Yes**. You can leave the schedule and advanced options alone.

3. Click **Next** to move onto the **Connect** page. Select the connection you configured previously (`neon-neosync`) from the dropdown and click **Next**. 

    <Admonition type="note">
    There are a few different options on the **Connect** page, such as **Truncate Before Insert**, **Truncate Cascade**, etc., but we don't need these right now, so you can ignore them.
    </Admonition>

4. Specify a value for **Number of Rows**. We'll create 1000 rows of data to use in this example.

5. Under **Table Selection**, select the schema and table (`public.users` in this example) where you want to generate synthetic data, and move it from **Source** to **Destination**.

6. Now, for each column in your table, select a **Transfomer** to define the type of data you want to generate for the column. For the `age` column, we used the `Generate Random Int64` to randomly generate ages between 18 and 40. You can configure the generator by clicking on the edit icon next to the transformer and setting min and max values.

7. Now that the transformers are configured, select the checkboxes for all of the transformers and click **Submit** to create the **Job** that we defined previously. On the **Job** page, you can see that the job ran successfully, creating 1000 rows of synthetic data to work within just a few seconds.

8. You can verify that the data was created in Neon by navigating to the Neon Console and selecting the **Tables** from the sidebar. Your data should be visible in the `public.users` table.

## Conclusion

In this guide, we stepped through how to seed your Neon database using Neosync. This was a minimal example, but you can follow the same steps to generate tens of thousands or more rows of data. The ability to easily generate synthetic data is particularly helpful if you're working on a new application and don't have data yet or want to augment your existing database with more data for performance testing.

Neosync is also able to handle referential integrity in case you need to generate data for tables linked by referential integrity constraints.

## Resources

- [Neosync](https://www.neosync.dev/)
- [Neosync Quickstart](https://docs.neosync.dev/quickstart)
- [Synthetic data generation](https://docs.neosync.dev/core-features#synthetic-data-generation)
- [How to Anonymize Sensitive Data in Neon](https://www.neosync.dev/blog/neosync-neon-sync-job)
- [How to use Synthetic Data to catch more bugs with Neosync](https://neon.tech/blog/how-to-use-synthetic-data-to-catch-more-bugs-with-neosync)
- [How to seed your Neon DB with Synthetic Data](https://www.neosync.dev/blog/neosync-neon-data-gen-job)
