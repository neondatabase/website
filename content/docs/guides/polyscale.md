---
title: Use PolyScale with Neon
subtitle: Connect Neon to Polyscale in minutes to distribute your data globally
enableTableOfContents: true
isDraft: false
---

[PolyScale](https://docs.polyscale.ai/) is a serverless database cache service. Using PolyScale, you can distribute and cache your data globally, seamlessly scaling your current database without altering transactional semantics. No coding or infrastructure changes are required. You can connect Neon to PolyScale in minutes, providing your data-driven apps with speedy access to your Neon data from anywhere in the world.

Follow the steps below to connect your Neon database with Polyscale:

## Retrieve your Neon connection details

In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/guides/connection_details.png)

The connection string includes the user name, password, hostname, and database name.

Copy the hostname, which appears similar to this: `ep-shy-tree-275608.us-east-2.aws.neon.tech`

## Create a Polyscale cache

A Polyscale account can have one or more caches defined. A cache simply identifies a database origin via a hostname and port. Typically you create a cache per database for simplicity.

To create your database cache:

1. Log into [Polyscale](https://app.polyscale.ai/signup/). If you do not have an account, you can create one by logging in with your GitHub or Google account. PolyScale has a free tier and does not require a credit card.
2. If you have just signed up for Polyscale, select **Create new cache** from the **Welcome to Polyscale** dialog.
![Connection details widget](/docs/guides/welcome_to_polyscale.png)
If you already have an account, click the **New Cache** button in the upper right of the Polyscale dashboard.
3. Enter a name for the cache, select PostgreSQL type, enter the Neon hostname you copied earlier, and enter the database port number. Neon uses the default PostgreSQL port, `5432`. Leave the default values for the other settings.
![Create a Polyscale cache](/docs/guides/polyscale_create_cache.png)
4. Click **Create**. A cache is created for your Neon database, and you are provided with a Polyscale connection string, which is used in place of your original Neon connection string. Simply replace the user name, password, and database name with the values from your Neon connection string.
![Create a Polyscale cache](/docs/guides/polyscale_success.png)

Once queries are passing through PolyScale, you can monitor traffic and caching behavior on the **Observability** tab in Polyscale.

By default, PolyScale automatically caches all queries that pass through the platform. That means you can connect to PolyScale and any queries that you run will be cached.

PolyScale identifies caching opportunities by recognizing and remembering patterns in query traffic. New queries typically begin to see cache hits on or about the third query. For more information, see [Time To First Hit](https://docs.polyscale.ai/how-does-it-work/#time-to-first-hit-ttfh), in the _Polyscale documentation_.

For more information about using and configuring Polyscale, refer to the [Polyscale documentation](https://docs.polyscale.ai/).
