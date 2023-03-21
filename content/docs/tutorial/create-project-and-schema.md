---
title: Create a Neon project and add data
enableTableOfContents: true
---

## Create a Neon account

If you do not have a Neon account, navigate to the [Sign-in page](https://console.neon.tech/sign_in) and create an one using your GitHub or Google account.

When you sig up, you are automatically enrolled in Neon's [Free Tier](/docs/introduction/technical-preview-free-tier). If you are require larger compute and storage limits, Neon also offers paid plans. For more information about those, see [Neon plans](/docs/introduction/billing#neon-plans). 

![Neon sign-in page](/docs/get-started-with-neon/neon_signin.png)

## Create a project

After you have signed in, click on **Create a project**. Enter a name for your project or let Neon generate one for you, select a PostgreSQL version and a region, and click **Create project**. It is generally recommended that you select the region closest to your application or user location. For more information about Neon's region support, see [Regions](/docs/introduction/regions).

![Neon create project](/docs/get-started-with-neon/neon_create_project.png)

You may have noticed that your project was created in just a few seconds. That’s one of the benefits of Neon’s serverless architecture. Neon is serverless PostgreSQL that separates compute and storage. A Neon compute is a stateless PostgreSQL instance, which allows Neon to provision PostgreSQL very quickly.

Neon's _Auto-suspend_ feature will scale your compute to zero after five minutes of activity to save on compute resources and cost. If you navigate to the **Branches** page in the Neon Console, you can watch how a compute switches from an `Active` to an `Idle` state. Active means that the compute is running. `Idle` means that the compute is suspended.

![Neon endpoint active](/docs/get-started-with-neon/neon_endpoint_active.png)

<Admonition type="tip">
In Neon, a compute is referred to as a _compute endpoint_. The **Branches** widget on the Neon **Dashboard** also shows the state of your compute endpoints. A compute endpoint is required to connect to your database branches, including your projects primary branch. For more information, see [Compute endpoints](/docs/manage/endpoints).
</Admonition>

To learn more about Neon's serverless architecture, refer to the [Neon architecture](https://neon.tech/docs/introduction/architecture-overview/) documentation.

## Create a table

This tutorial uses a table called `elements`, which contains data from the [periodic table](https://en.wikipedia.org/wiki/Periodic_table). The example is based on the [Neon with Next.js and Prisma application](https://github.com/neondatabase/examples/tree/main/with-nextjs-prisma), which you can find in our [examples repo](https://github.com/neondatabase/examples) on GitHub.

In the following steps, you will use the Neon **SQL Editor** to create the `elements` table. The SQL Editor allows you to query your databases directly the Neon Console. For more information about this feature, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).

To create the `elements` table:

1. Navigate to the [Neon Console](https://console.neon.tech/app/projects).
2. Select your project.
3. Select **SQL Editor** from the sidebar.
4. Select a branch and a database. This tutorial uses the `main` branch and the default `neondb` database.
5. Enter the following query into the editor and click **Run** or use the `⌘+Enter` shortcut.

```sql
CREATE TABLE elements (
  id INTEGER NOT NULL,
  elementName TEXT NOT NULL,
  atomicNumber INTEGER NOT NULL,
  symbol TEXT NOT NULL
);
```

The editor should report that the request ran successfully.

## Insert data into the elements table

In this step, you will add data to the `elements` table. In the **SQL Editor**, click **New Query** to clear the editor, and enter the following `INSERT` query to add some data to your table:

```sql
INSERT INTO elements (id, elementName, atomicNumber, symbol)
VALUES
  (1, 'Hydrogen', 1, 'H'),
  (2, 'Helium', 2, 'He'),
  (3, 'Lithium', 3, 'Li'),
  (4, 'Beryllium', 4, 'Be'),
  (5, 'Boron', 5, 'B'),
  (6, 'Carbon', 6, 'C'),
  (7, 'Nitrogen', 7, 'N'),
  (8, 'Oxygen', 8, 'O'),
  (9, 'Fluorine', 9, 'F'),
  (10, 'Neon', 10, 'Ne');
```

To view the data that you added, select **Tables** from the sidebar in the Neon Console and select the `elements` table. The data you just inserted should be visible.

The **Tables** feature in the Neon allows you to easily explore the data in your Neon databases.
