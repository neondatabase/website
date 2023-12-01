---
title: Add the Neon PolyScale integration
subtitle: Set up a global database cache with Neon's PolyScale integration
enableTableOfContents: true
---

[PolyScale](https://docs.polyscale.ai/) allows you to easily distribute and cache your data globally through its low-latency edge network, enabling speedy access to your data from anywhere in the world. A PolyScale cache can reduce load on your database and automatically improve slow query performance while offering a simple alternative to cross-regional replication. No coding or infrastructure chnages are required to use PolyScale.

Adding the PolyScale integration to your Neon project automatically creates a global cache. It also provides a PolyScale connection string, which you can use in your application as a direct replacement for the Neon connection string.

By default, PolyScale automatically caches all queries that pass through its platform. This means that when you connect using the PolyScale connection string, any queries you run will be automatically cached. Reqiuests are routed to the closest Point Of Presence (POP) where the query results are then cached for low latency access.

<Admonition type="note">
The PolyScale integration creates a cache for the read-write compute endpoint associated with the [primary branch](/docs/manage/branches#primary-branch) of your Neon project. It does not cache queries for read-only compute endpoints ([read replicas](/docs/introduction/read-replicas)) or [non-primary branches](/docs/manage/branches#non-primary-branch). If you want to set up a cache for those, please refer to the [manual PolyScale setup instructions](/docs/guides/polyscale).
</Admonition>

For more information about PolyScale, see [How PolyScale works](#how-polyscale-works).

To get started with the Neon PolyScale integration, follow the instructions below.

## Prerequisites

- A Neon account and project. For instructions, see [Sign up](/docs/get-started-with-neon/signing-up).
- A database on the primary branch of your Neon project. See [Create a database](/docs/manage/databases#create-a-database).

## Add the PolyScale integration

To add the PolyScale integration to your Neon project:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Under **Add**, locate the PolyScale integration and click **Add** to open the **Add PolyScale** drawer.
    ![Integrations page showing PolyScale](/docs/guides/polyscale_int_add_integration.png)
3. Under **How to add**, click **Sign in**, and sign in to PolyScale using your Google, GitHub, or email account. If you do not have a PolyScale account, you can create one. PolyScale offers a free plan and no credit card is required.
    ![PolyScale sign in](/docs/guides/polyscale_int_sign_in.png)
4. Select the desired PolyScale **Workspace** and click **Authorize Access** to allow Neon to access read and write caches on PolyScale.
    ![PolyScale authorize access](/docs/guides/polyscale_int_authorize.png)

    After the integration is added, you are returned to the **Integrations** page in the Neon Console where the PolyScale integration appears under the **Manage** heading and the **Manage PolyScale** drawer is open. 

    ![PolyScale manage drawer](/docs/guides/polyscale_int_manage.png)

    Here, you can view information about your newly created PolyScale cache and copy the PolyScale connection string. Use this connection string in place of your Neon connection string in your application.

    You might notice the drop-down menus for **Database** and **Role**. If you have multiple databases and roles on the primary branch of your Neon project, use the drop-down menus to select the database and role you want to connect with. Your selections will be reflected in the PolyScale connection string.
   
    <Admonition type="note">
    To ensure your cache remains current, always use the PolyScale connection string. Modifying your database directly through a Neon connection string or the Neon SQL Editor can result in an outdated cache.
    </Admonition>

## View your PolyScale cache

You can access your PolyScale cache directly from the Neon PolyScale integration.

1. In the Neon Console, navigate to the **Integrations** page.
2. Under **Manage**, locate the PolyScale integration and click **Manage** to open the **Manage PolyScale** drawer.
3. Click the **View cache in PolyScale** link. You directed to PolyScale where you will be required to log in if not logged in already.

## Purging your PolyScale cache

Occasionally, it may be necessary to purge your PolyScale cache. For example, you may want to purge your cache after modifying your data directly without using the PolyScale connection string, which can result in an outdated cache.

To purge your PolyScale cache:

1. In the Neon Console, navigate to the **Integrations** page.
2. Under **Manage**, locate the PolyScale integration and click **Manage** to open the **Manage PolyScale** drawer.
3. Click **Purge PolyScale cache**.

Purging the cache purges all cached data globally.

## Remove the PolyScale integration

To remove the PolyScale integration:

1. In the Neon Console, navigate to the **Integrations** page.
2. Under **Manage**, locate the PolyScale integration and click **Manage** to open the **Manage PolyScale** drawer.
3. Click **Remove integration**.

Removing the integration deletes the cache and terminates all current connections using the PolyScale connection string.

## How PolyScale works

When you use a PolyScale connection string in your application, PolyScale automatically caches the queries that pass through its platform via the connection string. That means any queries you run using the PolyScale connection string are cached, by default.

PolyScale identifies caching opportunities by recognizing and remembering patterns in query traffic. New queries typically begin to see cache hits on or about the third query. For more information on this topic, see [Time To First Hit](https://docs.polyscale.ai/how-does-it-work/#time-to-first-hit-ttfh), in the _PolyScale documentation_.

After queries from your application start passing through PolyScale, you can monitor traffic and caching behavior on the **Observability** tab in PolyScale. For instructions, see [Observability](https://docs.polyscale.ai/database-observability/), in the _PolyScale documentation_.

For additional information about the PolyScale platform, please refer to the [PolyScale documentation](https://docs.polyscale.ai/).

<NeedHelp/>