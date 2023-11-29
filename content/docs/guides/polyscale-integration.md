---
title: Add the Neon PolyScale integration
subtitle: Set up a global database cache with Neon's PolyScale integration
enableTableOfContents: true
---

[PolyScale](https://docs.polyscale.ai/) allows you to easily distribute and cache your data globally through its low-latency edge network for speedy access to your data from anywhere in the world. With Neon's PolyScale integration, you can create a global cache for your Neon database in a few clicks. No coding or infrastructure changes are required. 

Adding the PolyScale integration to your Neon project automatically creates a global cache and provides you with a PolyScale connection string to use in your application in place of your Neon connection string.

By default, PolyScale automatically caches all queries that pass through its platform. That means you can connect using the PolyScale connection string, and any queries you run will be cached.

<Admonition type="note">
The PolyScale integration creates a cache for the read-write compute endpoint associated with the primary branch of your Neon project. It does not cache queries for read-only compute endpoints or non-primary branches. If you want to set up a cache for those, please refer to the [manual PolyScale setup instructions](/docs/guides/polyscale).
</Admonition>

For more information about PolyScale, see [How PolyScale works](#how-polyscale-works).

To get started with the Neon PolyScale integration, follow the instructions below.

## Prerequisites

- A PolyScale account. If you do not have one, you can sign up [here](https://app.polyscale.ai/signup).
- A Neon account and project. For instructions, see [Sign up](/docs/get-started-with-neon/signing-up).
- A database on the primary branch of your Neon project. See [Create a database](/docs/manage/databases#create-a-database).

## Add the PolyScale integration

To add the PolyScale integration to your Neon project:

1. In the Neon Console, navigate to the **Integrations** page.
2. Under **Available**, locate the PolyScale integration and click **Add** to open the **Add PolyScale** drawer.
    ![Integrations page showing PolyScale](/docs/guides/polyscale_int_add_integration.png)
3. Under **How to add**, click **Sign in**.
    ![Integrations page showing PolyScale](/docs/guides/polyscale_int_how_to_add.png)
4. Sign in to PolyScale using your Google, GitHub, or email account.
    ![Connection details widget](/docs/guides/polyscale_int_sign_in.png)
5. Select the desired PolyScale **Workspace** and click **Authorize Access** to allow Neon to access read and write caches on PolyScale.
    ![Connection details widget](/docs/guides/polyscale_int_authorize.png)

    After the integration is added, you are returned to the **Integrations** page in the Neon Console where the PolyScale integration appears under the **Configured** heading.
    ![Connection details widget](/docs/guides/polyscale_int_configured.png)

6. Click **Manage** to open the **Manage PolyScale** drawer. 

    ![Connection details widget](/docs/guides/polyscale_int_manage.png)

    In the PolyScale drawer, you can view information about your newly created PolyScale cache and copy the PolyScale connection string. Use this connection string in place of your Neon connection string in your application.

    You might notice the drop-down menus for **Database** and **Role**. If you have multiple databases and roles on the primary branch of your Neon project, use the drop-down menus to select the database and role you want to connect with. Your selection will be reflected in the PolyScale connection string.
   
    <Admonition type="note">
    To ensure your cache remains current, always use the PolyScale connection string. Modifying your database directly through a Neon connection string or the Neon SQL Editor can result in an outdated cache.
    </Admonition>

## View your PolyScale cache

You can access your PolyScale cache directly from the Neon PolyScale integration.

1. In the Neon Console, navigate to the **Integrations** page.
2. Under **Configured**, locate the PolyScale integration and click **Manage** to open the **Manage PolyScale** drawer.
3. Click the **View cache in PolyScale** link. You directed to PolyScale where you will be required to log in if not logged in already.

## Purging your PolyScale cache

Occasionally, it may be necessary to purge your PolyScale cache. For example, you may want to purge your cache after modifying your data directly without using the PolyScale connection string, which can result in an outdated cache.

To purge your PolyScale cache:

1. In the Neon Console, navigate to the **Integrations** page.
2. Under **Configured**, locate the PolyScale integration and click **Manage** to open the **Manage PolyScale** drawer.
3. Click **Purge PolyScale cache**.

Purging the cache purges all cached data globally.

## Remove the PolyScale integration

To remove the PolyScale integration:

1. In the Neon Console, navigate to the **Integrations** page.
2. Under **Configured**, locate the PolyScale integration and click **Manage** to open the **Manage PolyScale** drawer.
3. Click **Remove integration**.

Removing the integration deletes the cache and terminates all current connections using the PolyScale connection string.

## How PolyScale works

When you use a PolyScale connection string in your application, PolyScale automatically caches the queries that pass through its platform via the connection string. That means any queries you run using the PolyScale connection string are cached, by default.

PolyScale identifies caching opportunities by recognizing and remembering patterns in query traffic. New queries typically begin to see cache hits on or about the third query. For more information on this topic, see [Time To First Hit](https://docs.polyscale.ai/how-does-it-work/#time-to-first-hit-ttfh), in the _PolyScale documentation_.

After queries from your application start passing through PolyScale, you can monitor traffic and caching behavior on the **Observability** tab in PolyScale. For instructions, see [Observability](https://docs.polyscale.ai/database-observability/), in the _PolyScale documentation_.

For additional information about the PolyScale platform, please refer to the [PolyScale documentation](https://docs.polyscale.ai/).

<NeedHelp/>