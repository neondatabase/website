---
title: Create project schema
enableTableOfContents: true
---

## Create a Neon account

If you do not have a Neon account, navigate to the Signup page and create an account using GitHub or Google.

<screen-shot Sign-in>

## Create a project

Once you have signed in to the Neon Console, click on `Create a project`. Enter the name of your project and select a region (We recommend selecting the region closest to your application or user location).

<Image>

### What happens behind the scenes
You noticed that your project was created in a few seconds. That’s one of the benefits of Neon’s serverless architecture.

Neon is serverless Postgres and separates compute and storage. Because the compute node is a stateless Postgres instance, Neon can provision one very quickly. 

Neon also suspends a compute node if it is inactive for 5 minutes, to save on compute resources. 

If you navigate to the Endpoints page in the Neon Console, notice how the endpoint switches between Active and Idle states. Active means that the compute node is running. Idle on the other handle means that the compute node is suspended.

<Image>

[Learn more about Neon’s architecture](https://neon.tech/docs/introduction/architecture-overview/).

## Create a schema

Navigate to the SQL Editor and run the following query:

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

The above query creates a `shoes` table. 
Insert data into the shoes table
You can find sample queries on the migrate.sql file on [GitHub](https://github.com/neondatabase/examples/tutorial/migrate.sql). The `migrate.sql` file contains queries to `INSERT` data to the shoes table.

```sql
INSERT INTO shoes ("brand", "model", "description", "color", "image") VALUES ('Nike', 'Air Zoom Alphafly', 'Men''s Road Racing Shoes', 'Scream Green/Bright Crimson/Honeydew/Black', 'https://static.nike.com/a/images/c_limit,w_400,f_auto/t_product_v1/c24ddc33-6e38-4cc9-b548-dc48cd3528ea/image.jpg');
```

Copy and paste the queries from the `migrate.sql` file to the SQL Editor and click run (or use the shortcut `⌘+Enter`).
