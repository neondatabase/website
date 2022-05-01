### Getting Started  with Prisma

Prisma is an open-source type-safe ORM for the javascript ecosystem. It consists of the following parts:

- Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: Migration tool to easily evolve your database schema from prototyping to production
- Prisma Studio: GUI to view and edit data in your database

This document discusses the concepts behind using Prisma with Neon for development and production setups.

#### Connecting to Neon from Prisma

To connect Prisma-based app to Neon you need to specify `postgresql` datasource and connection string.

First, add the following to the `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
}
```

Then, go to the Project dashboard in Neon and generate a connection string in `Connection Details` widget. You can specify this connection string in `.env`:

```shell
DATABASE_URL=postgres://user:pass@start.stage.neon.tech/project-name-123
```

#### Using Neon for development with Prisma

Prisma used a so-called shadow database to detect schema drift, therefore you need to have a second database to perform `prisma migrate dev` command. One way to deal with it is to creat>

For example, you can configure Prisma in the following way:

in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

and in `.env`:

```shell
DATABASE_URL="<connection string to the project1>"
SHADOW_DATABASE_URL="<connection string to the project2>"
```

