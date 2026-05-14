---
title: Improving the developer experience for Prisma users
description: >-
  Learn about the latest improvements we made to ensure a better developer
  experience when using Neon with Prisma.
excerpt: >-
  One of our goals during the past few months was to improve the developer
  experience when using Prisma with Neon. This article highlights all the
  improvements we shipped, including reducing cold starts, having a better
  experience working with Prisma Migrate, and improving connecti...
date: '2023-07-13T11:08:15'
updatedOn: '2025-10-14T06:01:52'
category: community
categories:
  - community
authors:
  - mahmoud-abdelwahab
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/prisma-dx-improvements/cover.jpg
  alt: >-
    Database server illustration on the right with the following text next to it
    on the left: - Easier migrations - connection pooling - Reduced cold starts
isFeatured: false
seo:
  title: Improving the developer experience for Prisma users - Neon
  description: >-
    Learn about the latest improvements we made to ensure a better developer
    experience when using Neon with Prisma.
  keywords: []
  noindex: false
  ogTitle: Improving the developer experience for Prisma users - Neon
  ogDescription: >-
    Learn about the latest improvements we made to ensure a better developer
    experience when using Neon with Prisma.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/prisma-dx-improvements/social.jpg
---

![Database server illustration on the right with the following text next to it on the left: - Easier migrations - connection pooling - Reduced cold starts](https://cdn.neonapi.io/public/images/pages/blog/prisma-dx-improvements/neon-managing-roles-via-sql-2-1024x576-94eab64f.jpg)

One of our goals during the past few months was to improve the developer experience when using Prisma with Neon. This article highlights all the improvements we shipped, including reducing cold starts, having a better experience working with Prisma Migrate, and improving connection pooling support.

All of the improvements already had workarounds. However, we wanted to ensure a frictionless experience for Prisma users.

## Improving our cold start times

Neon automatically scales up compute on demand based on your application’s workload and scales down to zero on inactivity. This means you never overprovision resources and only pay for what you use.

The trade-off of scaling down to zero is that it introduces a “cold start”, which is the time it takes for the database to be ready before being able to accept connections. This behavior sometimes results in the Prisma query engine timing out before establishing a connection, leading to the following error:

```bash
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`

Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`: `5432`.
```

To address this issue, your can adjust your Neon connection string by configuring the `connect_timeout` parameter. It defines the maximum number of seconds to wait for a new connection to be opened (the default is 5 seconds).

A higher setting provides the time required to avoid connection timeout issues. For example:

```bash
DATABASE_URL=postgres://daniel:<password>@ep-mute-rain-952417-pooler.us-east-2.aws.neon.tech/neondb?pgbouncer=true&connect_timeout=10
```

We have been actively working on reducing the cold start time over the past few months, and we are excited to share that we have made a lot of progress. If your application server and Neon database are located in the same geographical region, and you are [using Prisma 5](https://www.prisma.io/blog/prisma-5-f66prwkjx72s), this workaround is most likely no longer needed.

However, if that is not the case, or perhaps you are developing against a Neon database that is not close to where you are geographically, you might still need this workaround.

## Providing pooled and direct connections to the database

The process of frequently opening and closing database connections is time consuming and resource intensive. You can also easily exhaust all available database connections if the number of clients is high.

To overcome this challenge, you can introduce a connection pooler, an infrastructure layer that sits between the client and the database.

The role of a connection pooler is to maintain a pool of pre-established connections. When a client needs to perform a database operation, it reuses an existing connection from the connection pool rather than opening a new one. This results in improved performance, scalability and ensures the database server is not overwhelmed with excessive connection requests. Neon supports connection pooling using [PgBouncer](https://www.pgbouncer.org/) out of the box, enabling up to 10,000 concurrent connections.

![Image](https://cdn.neonapi.io/public/images/pages/blog/prisma-dx-improvements/providing-pooled-and-direct-connections-to-the-database-1024x588-2e4e31df.png)

Previously, you had to pick which connection you wanted to use: connect through PgBouncer or directly to the database.

However, if you use Prisma, you need _both_ connections. The pooled connection works great when deploying your application to production and the direct one for running migrations. That is because Prisma Migrate requires a direct connection and does not support connection pooling with PgBouncer.

If you try to run Prisma Migrate when using the pooled connection, you will get the following error:

```bash
Error: undefined: Database error

Error querying the database: db error: ERROR: prepared statement "s0" already exists
```

That is why we added support for using both database connections simultaneously:

![Image](https://cdn.neonapi.io/public/images/pages/blog/prisma-dx-improvements/neon-console-1024x570-fd601cb7.png)

The pooled connection has a `-pooler` suffix appended to the compute endpoint ID. Here is an example:

```bash
#.env 
# Pooled connection
DATABASE_URL=postgres://sally:<password>@ep-throbbing-boat-918849-pooler.us-east-2.aws.neon.tech/neondb?pgbouncer=true 

# Direct connection
DIRECT_DATABASE_URL=postgres://sally:<password>@ep-throbbing-boat-918849.us-east-2.aws.neon.tech/neondb
```

You can then specify both database connection strings in your `schema.prisma` file:

```javascript
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

The `directUrl` will be used by Prisma Migrate when you run commands such as prisma migrate dev or prisma db push. The `url` will be used when instantiating Prisma Client.

## Removing the need for manually creating the shadow database

When using the `prisma migrate dev` command, Prisma Migrate automatically creates and deletes a “shadow” database. This database enables Prisma Migrate to generate new migrations and detect schema drift (checking that no manual changes have been made to the development database).

Previously, if you tried running `prisma migrate dev`, you would get the following error:

```bash
Error: A migration failed when applied to the shadow database Database error: Error querying the database: db error: ERROR: permission denied to create database
```

The reason was that previously it was not possible to manage roles and databases via SQL. To work around this issue, you needed to:

1. Manually create a shadow database
2. Specify the connection string of that database in your `schema.prisma` file using the `shadowDatabaseUrl` field.

So in your `schema.prisma` file you would have:

```javascript
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

Fortunately, managing roles and databases via SQL is now possible, so this workaround is no longer needed, and you can remove the `shadowDatabaseUrl` field. This makes the getting started experience when using Prisma with Neon much smoother.

## Final thoughts

We aim to build a world-class developer experience for Postgres in the Cloud, and these updates bring us closer to this goal.

If you are using Prisma with Neon, we would love your feedback. If you think there are ways for us to improve your experience, you can reach out to us on [Twitter](https://twitter.com/neondatabase), in our [community](https://community.neon.tech), or by emailing us at [feedback@neon.tech](mailto:feedback@neon.tech)

Also, if you are new to Neon, you can [sign up today](https://console.neon.tech) for free.
