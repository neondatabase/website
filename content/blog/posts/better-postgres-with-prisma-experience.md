---
title: Better Postgres with Prisma Experience
description: One URL to run SQL migrations and scale your applications
excerpt: >-
  We’re Neon. We’re building Postgres that helps you confidently ship reliable
  and scalable apps. We made Postgres on Neon work seamlessly with Prisma. This
  article explains how we did it. We love Prisma, and so do developers. Prisma
  ORM makes it easy to perform schema migrations a...
date: '2024-03-07T14:17:20'
updatedOn: '2024-03-07T15:19:32'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/better-postgres-with-prisma-experience/cover.png
  alt: null
isFeatured: false
seo:
  title: Better Postgres with Prisma Experience - Neon
  description: One URL to run SQL migrations and scale your applications
  keywords: []
  noindex: false
  ogTitle: Better Postgres with Prisma Experience - Neon
  ogDescription: >-
    We’re Neon. We’re building Postgres that helps you confidently ship reliable
    and scalable apps. We made Postgres on Neon work seamlessly with Prisma.
    This article explains how we did it. We love Prisma, and so do developers.
    Prisma ORM makes it easy to perform schema migrations and map any database
    objects with your existing JavaScript […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/better-postgres-with-prisma-experience/social.png
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/better-postgres-with-prisma-experience/image-1024x576-3a07a608.png)

**We’re Neon. We’re building Postgres that helps you confidently ship reliable and scalable apps. We made Postgres on Neon work seamlessly with Prisma. This article explains how we did it.**

We love [Prisma](https://www.prisma.io/docs/orm/overview/databases/postgresql), and so do developers. [Prisma ORM](https://www.prisma.io/docs/orm/overview/databases/postgresql) makes it easy to perform schema migrations and map _any_ database objects with your existing JavaScript and TypeScript applications, allowing you to integrate type-safe queries into your codebase.

Today, we’re pleased to share significant improvements to the developer experience of Neon using Prisma by adding support to schema migrations via pooled connections, making it possible to use Neon’s default connection string to scale your serverless apps and run schema migrations.

[You can start using Prisma with Neon for free.](https://console.neon.tech)

For reference, when we first introduced Neon, Prisma users needed a direct database URL, a pooled database URL, and a shadow database URL. Here how your `prisma.schema` file looked like:

```typescript
// Initially
datasource db {
  provider  = "postgresql"
  url       = postgres://sally:<password>@ep-throbbing-boat-918849-pooler.us-east-2.aws.neon.tech/neondb?pgbouncer=true 
  directUrl = postgres://sally:<password>@ep-throbbing-boat-918849.us-east-2.aws.neon.tech/neondb
  shadowDatabaseUrl = postgres://sally:<password>@ep-throbbing-boat-918849.us-east-2.aws.neon.tech/shadowdb
}
```

Now, all you need is one database URL. As a bonus, we also removed the need to specify the query parameter `pgbouncer=true` when using pooled connections:

```typescript
// Now
datasource db {
  provider  = "postgresql"
  url       = postgres://sally:<password>@ep-throbbing-boat-918849-pooler.us-east-2.aws.neon.tech/neondb
}
```

This article discusses each step of the process and the changes made to Neon, PgBouncer, and Prisma to make this possible, including:

1. Schema migration support with pooled connections
2. Dropping a shadow database WITH (FORCE)

## Schema migration support with pooled connections

In enhancing the experience with Prisma, we [added support for prepared statements](https://github.com/pgbouncer/pgbouncer/releases/tag/pgbouncer_1_21_0) and [`DISCARD ALL/DEALLOCATE ALL` to PgBouncer](https://github.com/pgbouncer/pgbouncer/releases/tag/pgbouncer_1_22_0) to allow for schema migration using pooled connections. Let’s explore why.

In Postgres, each connection is a backend process that requires memory allocation, which limits the number of concurrent connections. The solution to this problem is connection pooling with PgBouncer, which helps keep the number of active backend processes low.

PgBouncer becomes increasingly important at scale when using serverless services such as [AWS Lambda](https://aws.amazon.com/pm/lambda/) or [Vercel functions](https://vercel.com/docs/functions), since each function call establishes a new connection. We name database connections that use PgBouncer pooled connections.

Additionally, [`prisma migrate`](https://www.prisma.io/docs/orm/prisma-migrate/getting-started) uses prepared statements to optimize SQL query performance, and [`DEALLOCATE ALL`](https://github.com/prisma/prisma-engines/blob/4308b705cc0694626ff407996f3145ddef0ad1c6/quaint/src/connector/postgres/native/mod.rs#L507) to release all prepared statements in the current session [before preparing and executing Prisma Client queries](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer#add-pgbouncertrue-to-the-connection-url). More on prepared statements in the [PgBouncer 1.22.0 support announcement article](https://neon.tech/blog/pgbouncer-the-one-with-prepared-statements#what-are-prepared-statements).

Before version 1.22.0, if you attempted to run `prisma migrate` commands using a pooled connection, you might have seen the following error:

```bash
Error: undefined: Database error
Error querying the database: db error: ERROR: prepared statement "s0" already exists
```

To scale using pooled connections and be able to perform schema migrations, you had to specify both pooled and direct database URLs and set `pgbouncer` mode as a query parameter in your schema file.

Here is how the `datasource db` block in your `prisma.schema` file looked like:

```typescript
// Before PgBouncer 1.22.0 and Prisma Client 5.10.0
datasource db {
  provider  = "postgresql"
  url       = postgres://sally:<password>@ep-throbbing-boat-918849-pooler.us-east-2.aws.neon.tech/neondb?pgbouncer=true 
  directUrl = postgres://sally:<password>@ep-throbbing-boat-918849.us-east-2.aws.neon.tech/neondb
}
```

Here is how it looks now after adding support for prepared statements and `DISCARD ALL/DEALLOCATE ALL` to PgBouncer:

```typescript
// With PgBouncer 1.22.0 and Prisma Client 5.10.0
datasource db {
  provider  = "postgresql"
  url       = postgres://sally:<password>@ep-throbbing-boat-918849-pooler.us-east-2.aws.neon.tech/neondb
}
```

Note you only need the pooled connection to run Prisma with Postgres. It’s no longer required to specify a direct connection to the database and the `pgbouncer=true` query parameter. The pooled connection is used to scale your queries and run schema migrations.

This allows Neon to confidently set the default URL to the pooled connection string on the Console and the [Vercel Integration](https://neon.tech/docs/changelog/2024-02-23-console#neon-vercel-integration-improvements).

## DROP shadow database WITH (FORCE)

When you run `prisma migrate dev`, Prisma Migrate uses a shadow database to detect schema drifts and generate new migrations. During that process, Prisma creates, introspects, and then drops a shadow database. [More on shadow databases on Prisma’s documentation.](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database)

However, certain cloud providers do not allow to drop and create databases via SQL, which forces developers to manually create shadow databases and specify them in the `prisma.schema` file:

```typescript
datasource db {
  provider  = "postgresql"
  url       = postgres://sally:<password>@ep-throbbing-boat-918849.us-east-2.aws.neon.tech/neondb
  shadowDatabaseUrl = postgres://sally:<password>@ep-throbbing-boat-918849.us-east-2.aws.neon.tech/shadowdb
}
```

We have added [support for managing roles and databases via SQL](https://neon.tech/blog/prisma-dx-improvements#removing-the-need-for-manually-creating-the-shadow-database) on Neon, which allowed for removing the need for manually creating a shadow database. Additionally, [Prisma 5.10.0](https://github.com/prisma/prisma/releases/tag/5.10.0) [introduces support for `DROP WITH (FORCE)`](https://github.com/prisma/prisma-engines/pull/4722) as an alternative drop database path in the schema engine, which allows it to dispose of shadow databases.

So, in your `schema.prisma` file, you would have:

```typescript
datasource db {
  provider  = "postgresql"
  url       = postgres://sally:<password>@ep-throbbing-boat-918849.us-east-2.aws.neon.tech/neondb
}
```

## Conclusion

The improvements included in PgBouncer 1.22.0 have significantly streamlined the experience for developers using Postgres on Neon and Prisma, making is more efficient to scale serverless applications and run schema migrations.

We would love to get your feedback. Follow us on [X](https://x.com/neondatabase), join us on [Discord](https://neon.tech/discord) and let us know how we can help you build the next generation of web applications.

Shout out to all contributors for making this possible, including:

- [Jelte Fennema](https://github.com/JelteF)
- [Martijn Dashorst](https://github.com/dashorst)
- [Konstantin Knizhnik](https://github.com/knizhnik)
- [Sverre Boschman](https://github.com/sboschman)
- [Frank Schmager](https://github.com/fschmager)
- [Oleg Tselebrovskiy](https://github.com/Medvecrab)
- [Alex Chi Z](https://github.com/skyzh)
