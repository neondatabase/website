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

### Create the source databases

Neosync requires two separate databases to show data syncing from a source to a destination.

To create a source database, which we'll call `neosync-source`, perform the following steps:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select your project.
1. Select **Databases** from the sidebar.
1. Select the branch where you want to create the database.
1. Click **New Database**.
1. Enter a database name (`neosync-source`), and select a database owner.
1. Click **Create**.

### Add data to the source database

We need some sample data to work with. We'll use Neosync to load some synthetic user data into the source database.

1. In the Neon Console, select the **SQL Editor** from the sidebar.
2. Run the following commands to create your schema.

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

3. Next, navigate to the **Dashboard** in Neon and copy the connection string for the source database from the **Connection Details** widget. It should look something like this:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neosync-source?sslmode=require
```

4. Next, navigate to [Neosync](https://www.neosync.dev/) and login. Go to **Connections** > **New Connection** then click on **Postgres**.

5. Enter a unique name for the connection in the **Connection Name** field. We'll give it the same name as the database in this example: `neosync-source`

6. Paste the Neon database connection string in **Connection URL** field and click **Test Connection** to verify that the connection works.

7. Click **Submit** to save the connection configuration.

8. To generate data, create a **Job** in Neosync. Click on **Jobs** and then click on **New Job**. You are presented with a few job types. Since you are seeding a table from scratch, select the **Data Generation** job type and click **Next**.

9. Give the job a name and then set **Initiate Job Run** to **Yes**. You can leave the schedule and advanced options alone.

10. Click **Next** to move onto the **Connect** page. Select the connection you configured previously (`neosync-source`) from the dropdown and click **Next**. 

    <Admonition type="note">
    There are a few different options on the **Connect** page, but such as **Truncate Before Insert**, **Truncate Cascade**, etc., but we don't need these right now, so you can ignore them.
    </Admonition>

11. Specify a value for **Number of Rows**. We'll create 1000 rows of data to use in this example.

12. Under **Table Selection**, select the schema and table (`public.users` in this example) where you want to generate synthetic data, and move it from Source to Destination.

13. Now, for each column in your table, select a **Transfomer** to define the type of data you want to generate for the column. For the `age` column, we used the `Generate Random Int64` to randomly generate ages between 18 and 40. You can configure the generator by clicking on the edit icon next to the transformer and setting min and max values.

14. Now that the transformers are configured, select the checkboxes for all of the transformers and click **Submit** to create the **Job** that we defined previously. On the **Job** page, you can see that the job ran successfully, creating 1000 rows of synthetic data to work within just a few seconds.

15. You can verify that the data was created in Neon by navigating to the Neon Console and selecting the **Tables** from the sidebar. Your data should be visible in `public.users` table.

## Create your destination database

Neosync requires a destination database to sync anonymized data to.

To create the destination database, which we'll call `neosync-destination`, perform the following steps:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select your project.
1. Select **Databases** from the sidebar.
1. Select the branch where you want to create the database.
1. Click **New Database**.
1. Enter a database name (`neosync-destination`), and select a database owner.
1. Click **Create**.
