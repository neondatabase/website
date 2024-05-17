---
title: Anonymize sensitive data with Neosync
subtitle: Learn how to anonymize sensitive data stored in your Neon Postgres dfatabase with Neosync 
enableTableOfContents: true
---

[Neosync](https://www.neosync.dev/) is an open-source synthetic data orchestration platform that can create anonymized data and sync it across all of your Neon database environments for better security, privacy, and development.

In this guide, we'll show you how to anonymize sensitive data in a Neon database for testing and rapid development using Neosync.

## Prerequisites

To complete the steps in the guide, you require the following:

- A Neon account and project. If you do not have those, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- A source database in Neon. In this guide, we start with a source database named `neondb`, which has a `users` table populated with 1000 rows of user data.
- A [Neosync](https://www.neosync.dev/) account.

## Neon setup

In Neon, we'll set up two databases. One will act as the source database and the other as the destination. We'll then add some synthetic data to the source database and a database schema to the destination database, where we will eventually generate an anonymized version of the data.

### The Neon source database

This guide assumes you have a source database in Neon. Our source database has a `users` table, created in the `public` schema. The `users` table has 1000 rows and is defined as shown below:

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL
);
```

If you would like to create the same table and data, see [Seeding your Neon database with synthetic data](tbd).

### Create the destination database schema

1. In the Neon Console, select the **SQL Editor** from the sidebar.
2. Run the following commands to create your schema:

```sql
-- Optionally, enable the UUID extension to auto-generate UUIDs for the id column
-- or you can let Neonsync generate the UUIDs for you
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL
);
```

You can do a quick sanity check by navigating to **Tables** in the Neon Console to verify that the table was created successfully.

### Copy the connection string for your destination database

Next, navigate to the **Dashboard** in Neon and copy the connection string for the destination database from the **Connection Details** widget. 

<Admonition type="note">
Make sure that you select the destination database (`neosync-destination`) from the **Database** drop-down menu.
</Admonition> 

Your connection strting should look something like this:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neosync-destination?sslmode=require
```

You'll need the connection string to set up Neosync, which we'll do next.

## Neosync setup

### Create a destination database connection

1. Navigate to [Neosync](https://www.neosync.dev/) and log in. Go to **Connections** > **New Connection** then click on **Postgres**.

2. Enter a unique name for the connection in the **Connection Name** field. We'll give it the same name as the database in this example: `neosync-destination`

3. Paste the Neon database connection string in **Connection URL** field and click **Test Connection** to verify that the connection works.

4. Click **Submit** to save the connection configuration.

### Create a data synchronization job

To generate anonymized data, we need to create a **Job** in Neosync. 

1. In Neonsync, click on **Jobs** and then click on **New Job**. You are presented with a few job types. Since you are anonymizing existing data, select the **Data Synchronization** job type and click **Next**.

2. Give the job a name (e.g. `anonymize-user-data`) and then set **Initiate Job Run** to **Yes**.

3. Click **Next** to move to the **Connect** page. 
    - Select the source data set from the dropdown. In this example, the source data set is located in the `neondb` database in Neon.
    - Select the destination database where the data should be synced. In this example, the destination is the `neosync-destination` database you configured previously.
    - We'll also enable the **Truncate Before Insert** option to truncate the table before inserting data so that we get a fresh set of data each time.

    Click **Next**.

5. Under **Table Selection**, select the schema and table (`public.users` in this example) for which you want to anonymize data, and move it from **Source** to **Destination**.

6. Under **Transformer Mapping**, select all of the columns and choose a **Transfomer** to define the type of data you want to generate for each column. For the `age` column, we used the `Generate Random Int64` to randomly generate ages between 18 and 40. You can configure the generator by clicking on the edit icon next to the transformer and setting min and max values.

7. Click **Next** to go to the **Subset** page. The subset feature allows you to automatically subset data for child tables by defining SQL filters. Since we're only anonymizing data for a single table in this guide, we'll just click **Save** to create the job and start the first run.

    <Admonition type="note">
    To learn more about Neosync's subset feature, see [Subsetting with referential integrity](https://www.neosync.dev/blog/subset-referential-integrity).
    </Admonition>

    You can see that the job ran successfully and in just a few seconds, copying, anonymizing, and moving data from your source database to your destination database in Neon.

8. You can verify that the anonymized data was generated in your destination database by navigating to the Neon Console, selecting **Tables** from the sidebar, selecting the the `neosync-destination` database. Your data should be visible in `public.users` table:

In this guide, we stepped through how to anonymize sensitive data and generate synthetic data from one Neon database to another. The cool thing about this is that it doesn't have to be from one Neon database to another. Neosync supports any Postgres database. So it can be from Neon to RDS, RDS to Neon, RDS to Cloud SQL, etc. 

This was a small test with only 1000 rows of data, but you can follow the same procedure to anonymize millions of rows of data, and Neosync can manage any referential integrity constraints for you. To learn more, refer to the topic under [Resources](#resources).

## Resources

