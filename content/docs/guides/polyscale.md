---
title: Use PolyScale with Neon
enableTableOfContents: true
isDraft: true
---

Note: content has not ben validated

[PolyScale](https://docs.polyscale.ai/) is a serverless database cache service. Using PolyScale, your data can be distributed globally and cached, seamlessly scaling your current database without altering transactional semantics. No coding or infrastructure changes are required. You can connect Neon to PolyScale in minutes, providing your data-driven apps with speedy access to your Neon data from anywhere in the world.

This guide explains how to connect Neon to a PolyScale cache.

This vide from PolyScale shows how to gt connected, or you can read the steps below.

[![Connecting PolyScale to Neon](https://i3.ytimg.com/vi/a94XtB_m9k4/maxresdefault.jpg)](https://www.youtube.com/watch?v=a94XtB_m9k4)

## Create a PolyScale account

You can set up a free PolyScale account [here](https://app.polyscale.ai/signup/). PolyScale has a free tier and does not require a credit card.

## Retrieve your Neon connection string

In the **Connection Details** widget on the Neon Dashboard, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](./images/connection_details.png)

The connection string includes the user name, hostname, and database name.

```text
postgres://casey@ep-square-sea-260584.us-east-2.aws.neon.tech/neondb
             ^                       ^                          ^
             |- <user name>          |- <hostname>              |- <database name>
```

- user name: `casey`
- hostname: `ep-square-sea-260584.us-east-2.aws.neon.tech`
- database name: `neondb`

Passwords are only shown when they are created. If you misplaced your password, you can reset it by selecting the **Reset Password** link in the **Connection Details** widget, or by navigating to **Settings** > **Users**.

Neon uses the default PostgreSQL port, `5432`.

## Create a PolyScale Cache

A Polyscale account can have one or more caches defined. A cache simply identifies a database origin via a hostname and port that you wish to cache data for. Typically you create a cache per database for simplicity.

To create a new cache, click the **New Cache** button in the upper right of the caches dashboard and enter the hostname and port of the database you wish to connect to.

## Connect to the PolyScale Cache

To connect to the origin database via PolyScale simply update any client applications as follows:

1. Use a PolyScale database hostname and port.

- Hostname: `psedge.global`
- Port: The PolyScale port for PostgreSQL is `5432`.

2. Provide a PolyScale Cache ID as part of the connection string

The Cache ID can be found under the Settings tab of any cache (as detailed in Step 2 above). For MySQL, MariaDB and SQL Server, this is prepended to the database username separated with a hyphen (see example below). For PostgreSQL, an application_name property containing the PolyScale Cache ID is required as part of the connection string e.g. application_name=my_database_password.

For further details, see Getting Connected.

Note: PolyScale does not save your database username and password. To connect to your database via PolyScale, no database credentials on the origin database change.

## Cache Automation

Once queries are passing through PolyScale, switch to the Observability tab to view the traffic and cache behavior.

As default, PolyScale will automatically manage the caching of all queries that pass through the platform. That means you can simply connect to PolyScale and queries will begin to be cached.

Keep in mind that the cache will require some period of warming before queries are cached. PolyScale's machine learning algorithms identify caching opportunities by recognizing and remembering patterns in query traffic. For new queries, you will typically begin to see cache hits on or about the third query. (You can read more about Time To First Hit here.)

Read more about Cache Configuration.