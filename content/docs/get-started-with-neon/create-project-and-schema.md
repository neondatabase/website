---
title: Create a Neon project and add data
enableTableOfContents: true
---

## Create a Neon account

If you do not have a Neon account, navigate to the [Sign-in page](https://console.neon.tech/sign_in) and create an account using your GitHub or Google account.

![Neon sign-in page](/docs/get-started-with-neon/neon_signin.png)

## Create a project

After you have signed in, click on **Create a project**. Enter a name for your project or let Neon generate one for you, select a PostgreSQL version and a region region, and click **Create project**. Select the region closest to your application or user location.

![Neon create project](/docs/get-started-with-neon/neon_create_project.png)

### What happens behind the scenes

You may have noticed that your project was created in just a few seconds. That’s one of the benefits of Neon’s serverless architecture.

Neon is serverless PostgreSQL that separates compute and storage. A Neon compute node is a stateless PostgreSQL instance, which allows Neon to provision a PostgreSQL instance very quickly.

Neon's _Auto-suspend_ feature scales the compute node to zero if it is inactive for five minutes, to save on compute resources and cost.

If you navigate to the **Branches** page in the Neon Console, you can view how an endpoint switches from an `Active` to an `Idle` state after a five minutes of inactivity. Active means that the compute node is running. `Idle`, on the other hand, means that the compute node is suspended.

![Neon endpoint active](/docs/get-started-with-neon/neon_endpoint_active.png)

[Learn more about Neon’s architecture](https://neon.tech/docs/introduction/architecture-overview/).

## Create a table

This tutorial uses "shoe" data collected from Nike.com’s website using Nike’s API.

To create a table for the shoe data:

1. Navigate to the [Neon Console](https://console.neon.tech/app/projects).
2. Select your project.
3. Select **SQL Editor** from the sidebar.
4. Select a branch and a database. This tutorial uses the `main` branch and the default `neondb` database.
5. Enter the following query into the editor and click **Run** or use the shortcut `⌘+Enter`.

```sql
CREATE TABLE IF NOT EXISTS shoes (
   id SERIAL PRIMARY KEY,
   brand VARCHAR(255) NOT NULL,
   model VARCHAR(255) NOT NULL,
   description VARCHAR(255) NOT NULL,
   color VARCHAR(255) NOT NULL,
   image VARCHAR(255) NOT NULL
);
```

The editor should report that the request ran successfully.

## Insert data into the shoes table

In this step, you will add a row of data to the `shoes` table. In the **SQL Editor**, enter the following query:

```sql
INSERT INTO shoes ("brand", "model", "description", "color", "image") VALUES ('Nike', 'Air Zoom Alphafly', 'Men''s Road Racing Shoes', 'Scream Green/Bright Crimson/Honeydew/Black', 'https://static.nike.com/a/images/c_limit,w_400,f_auto/t_product_v1/c24ddc33-6e38-4cc9-b548-dc48cd3528ea/image.jpg');
```

<Admonition type="tip">
You can find more sample data in the `migrate.sql` file available in our `examples` repository on [GitHub](https://github.com/neondatabase/examples/tutorial/migrate.sql).
To add more rows of data, copy `INSERT` queries from the `migrate.sql` file and run them in the **SQL Editor**.
</Admonition>
