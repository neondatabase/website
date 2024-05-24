---
title: Anonymize data with Neosync
subtitle: Learn how to anonymize sensitive data in Neon with Neosync 
enableTableOfContents: true
---

[Neosync](https://www.neosync.dev/) is an open-source synthetic data orchestration platform that can create anonymized data and sync it across all of your database environments for better security, privacy, and development.

In this guide, we'll show you how to anonymize sensitive data in a Neon database for testing and rapid development using Neosync.

## Prerequisites

To complete the steps in the guide, you require the following:

- A Neon account and project. If you do not have those, see [Sign up](/docs/get-started-with-neon/signing-up#step-1-sign-up).
- A source database in Neon. This guide uses a source database named `neon-neosync`, which has a `users` table populated with 1000 rows of data. To set up this table, see [Generate synthetic data with Neosync](/docs/guides/neosync-generate).
- A [Neosync](https://www.neosync.dev/) account.

## Neon setup

Anonymizing data requires source and destination databases. This section describes the source database that is used and how to set up a destination database in Neon where you will sync anonymized data using Neosync. 

### The source database

This guide assumes you already have a source database in Neon. The source database referenced in this guide has a `users` table, created in the `public` schema. The `users` table has 1000 rows and is defined as shown below:

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL
);
```

If you do not have a source database and would like to create one with the same table and data, see [Generate synthetic data with Neosync](/docs/guides/neosync-generate).

### Create the destination database

To create a destination database in Neon, which we'll name `neosync-destination`, perform the following steps:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select your project.
1. Select **Databases** from the sidebar.
1. Select the branch where you want to create the database.
1. Click **New Database**.
1. Enter a database name (`neosync-destination`), and select a Postgres role to be the database owner.
    ![Create a database for neosync](/docs/guides/neosync_anon_create_db.png)
1. Click **Create**.

### Create the destination database schema

Your destination database should have the same schema as the source database.

1. In the Neon Console, select the **SQL Editor** from the sidebar.
2. Select the correct branch and the `neosync-destination` database you just created.
3. Run the following commands to create your schema:

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

### Copy the connection string for your destination database

Navigate to the **Dashboard** in Neon and copy the connection string for the destination database from the **Connection Details** widget. 

<Admonition type="note">
Make sure you select the destination database (`neosync-destination`) from the **Database** drop-down menu.
</Admonition> 

Your connection string should look something like this:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neosync-destination?sslmode=require
```

You'll need the connection string to set up Neosync, which we'll do next.

## Neosync setup

The Neosync setup involves setting up a connection to the destination database and creating a data synchronization job to create anonymized data in the destination database.

### Create a destination database connection

1. Navigate to [Neosync](https://www.neosync.dev/) and log in. Go to **Connections** > **New Connection** and click on **Postgres**.

2. Enter a unique name for the connection in the **Connection Name** field. We'll give the connection the same name as the database: `neosync-destination`

3. Paste the Neon database connection string in the **Connection URL** field and click **Test Connection** to verify that the connection works.

    ![Test Neosync Neon destination database connection](/docs/guides/neosync_anon_test_connection.png)

4. Click **Submit** to save the connection configuration.

### Create a data synchronization job

To generate anonymized data, we need to create a **Job** in Neosync. 

1. In Neonsync, click on **Jobs** and then click **New Job**. You are presented with a few job types. Since you are anonymizing existing data, select the **Data Synchronization** job type and click **Next**.

   ![Select Neosync job type](/docs/guides/neosync_anon_job_type.png)

2. Give the job a name (e.g. `anonymize-user-data`) and set **Initiate Job Run** to **Yes**.

    ![Define Neosync job definition](/docs/guides/neosync_anon_job_definition.png)

3. Click **Next** to move to the **Connect** page. 
    - Select the source data set from the dropdown. In this example, the source data set is located in the `neon-neosync` database in Neon.
    - Select the destination database where the data should be synced. In this example, the destination is the `neosync-destination` database you configured previously.
    - We'll also enable the **Truncate Before Insert** option to truncate the table before inserting data so that you get a fresh set of data each time the job runs.

    ![Define Neosync job connection](/docs/guides/neosync_anon_job_connect.png)

    Click **Next**.

5. On the **Schema** page:

    - Under **Table Selection**, select the schema and table (`public.users` in this example) and move it from the source to the destination table.
    - Under **Transformer Mapping**, select all of the columns and choose a **Transfomer** to define the type of data you want to generate for each column. For the `age` column, we used the `Generate Random Int64` to randomly generate ages between 18 and 40. You can configure the generator by clicking on the edit icon next to the transformer and setting min and max values.

    ![Define Neosync job schema](/docs/guides/neosync_anon_job_schema.png)

7. Click **Next** to go to the **Subset** page. The subset feature allows you to automatically subset data for child tables by defining SQL filters. Since we're only anonymizing data for a single table in this guide, we'll just click **Save** to create the job and start the first run.

    <Admonition type="note">
    To learn more about Neosync's subset feature, see [Subsetting with referential integrity](https://www.neosync.dev/blog/subset-referential-integrity).
    </Admonition>

    You can see that the job ran successfully, and in just a few seconds, it copied, anonymized, and moved data from your source database to your destination database in Neon.

    ![Neosync job status](/docs/guides/neosync_anon_job_status.png)

8. You can verify that the anonymized data was generated in your destination database by navigating to the Neon Console, selecting **Tables** from the sidebar, and selecting the `neosync-destination` database. Your data should be visible in `public.users` table.

    ![Verify data in Neon](/docs/guides/neosync_verify_anon_data.png)

## Conclusion

In this guide, we stepped through how to sync and anonymize sensitive data between source and destination databases in Neon using Neosync. Neosync supports any Postgres database, so you can also sync and anonymize data from Neon to RDS or from RDS to Neon, for example.

This was a small test with only 1000 rows of data, but you can follow the same procedure to anonymize millions of rows of data, and Neosync can manage any referential integrity constraints for you.

## Resources

- [Neosync](https://www.neosync.dev/)
- [Neosync Quickstart](https://docs.neosync.dev/quickstart)
- [Anonymization in Neosync](https://docs.neosync.dev/core-features#anonymization)
- [Synthetic data generation](https://docs.neosync.dev/core-features#synthetic-data-generation)
- [How to Anonymize Sensitive Data in Neon](https://www.neosync.dev/blog/neosync-neon-sync-job)
- [How to use Synthetic Data to catch more bugs with Neosync](https://neon.tech/blog/how-to-use-synthetic-data-to-catch-more-bugs-with-neosync)
- [How to seed your Neon DB with Synthetic Data](https://www.neosync.dev/blog/neosync-neon-data-gen-job)
