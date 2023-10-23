---
title: Connect Neon to PolyScale
subtitle: Connect Neon to PolyScale to distribute and cache your data globally
enableTableOfContents: true
isDraft: false
updatedOn: '2023-10-19T23:10:12.832Z'
---

[PolyScale](https://docs.polyscale.ai/) is a serverless database cache service. With PolyScale, you can distribute and cache your data globally, allowing you to scale your database without altering transactional semantics. No coding or infrastructure changes are required. You can connect Neon to PolyScale in minutes, providing your database-backed applications with speedy access to your Neon data from anywhere in the world.

Follow the steps below to connect your Neon database to PolyScale.

## Retrieve your Neon connection details

In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

The connection string includes the user name, password, hostname, and database name.

Copy the hostname. In the example above, the hostname is this part of the connection string:

```text
 ep-raspy-cherry-95040071.us-east-2.aws.neon.tech
 ```

Also, make note of the user, password, and database name. You will need those details when you configure a connection from your  application to PolyScale.

## Create a PolyScale cache

A PolyScale account can have one or more caches. A cache identifies a database by the hostname and port number. Typically, you create one cache per database.

To create the database cache:

1. Log into [PolyScale](https://app.polyscale.ai/signup/). If you do not have an account, you can create one by logging in with your GitHub or Google account. PolyScale has a free tier and does not require a credit card to sign up.
2. If you have just signed up for PolyScale, select **Create new cache** from the **Welcome to PolyScale** dialog.
![Connection details widget](/docs/guides/welcome_to_polyscale.png)
If you already have a PolyScale account, click the **New Cache** button in the upper right corner of the PolyScale dashboard.
3. Enter a name for the cache, select `PostgreSQL` as the type, enter the Neon hostname you copied earlier, and enter the database port number. Neon uses the default Postgres port, `5432`. Leave the default values for the other settings. The **Caching** setting enables the database query cache, so this setting should remain enabled.
![Create a PolyScale cache](/docs/guides/polyscale_create_cache.png)
4. Click **Create**. PolyScale creates a cache for your Neon database and provides a new **Connection URI** to use in your application in place of the Neon connection string. Simply replace `[USERNAME]`, `[PASSWORD]`, and `[DATABASE]` with the values from your Neon connection string.
![Create a PolyScale cache](/docs/guides/polyscale_success.png)

After queries from your application start passing through PolyScale, you can monitor traffic and caching behavior on the **Observability** tab in PolyScale. For more information, see [Observability](https://docs.polyscale.ai/database-observability/), in the _PolyScale documentation_.

By default, PolyScale automatically caches all queries that pass through the platform. That means you can connect to PolyScale, and any queries you run will be cached.

PolyScale identifies caching opportunities by recognizing and remembering patterns in query traffic. New queries typically begin to see cache hits on or about the third query. For more information, see [Time To First Hit](https://docs.polyscale.ai/how-does-it-work/#time-to-first-hit-ttfh), in the _PolyScale documentation_.

For more information about using PolyScale and how it works, refer to the [PolyScale documentation](https://docs.polyscale.ai/).

## Need help?

Join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon. [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).
