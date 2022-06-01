---
title: Run a Prisma App
---

### Introduction

Prisma is an open-source type-safe ORM for the Javascript ecosystem. It consists of the following three parts:

- Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: Migration tool to easily evolve your database schema from prototyping to production
- Prisma Studio: GUI to view and edit data in your database

This section will discuss the concept and step-by-by process of connecting Prisma with Neon for development and product setups.

## Step 1 — Connecting to Neon from Prisma

To connect Prisma-based app to Neon, you need to specify the `postgresql` datasource and connection string.

First, add the following to the `prisma/schema.prisma`:

```typescript
datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
}
```

Next, go to the **Project** dashboard in Neon and generate a connection string in `Connection Details` widget.

You can specify this connection string in `.env`:

```shell
DATABASE_URL=postgres://user:pass@project-name-123.cloud.neon.tech/main
```

## Step 2 — Using Neon for Development With Prisma

Prisma uses a shadow database to detect schema drift, therefore you need to have a second database to perform the `prisma migrate dev` command. One way to deal with it is to creat>

For example, you can configure Prisma in the following way:

Add the following code in `prisma/schema.prisma`:

```typescript
datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

Add the following code in `.env`:

```shell
DATABASE_URL="<connection string to the project1>"
SHADOW_DATABASE_URL="<connection string to the project2>"
```
