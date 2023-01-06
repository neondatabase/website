---
title: How to set up Prisma with Neon
enableTableOfContents: true
---

## Introduction

Prisma is an open source next-generation ORM. It consists of the following parts:

- Prisma Client: An auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: A migration tool for evolving your database schema from prototyping to production
- Prisma Studio: A GUI tool for viewing and editing data in your database

In this tutorial, you will learn how to set up a Neon project, set up Prisma project, configure connection to Neon, and run a migration using Prisma Migrate.

## Step 1: Sign up with Neon

To sign up for Neon:

1. Navigate to [https://console.neon.tech](https://console.neon.tech).
2. Sign in with a Github or Google account.

After signing in, you are directed to the Neon Console where you can create your first project.

## Step 2: Create a project and copy the connection string

1. In the Neon Console, Click **Create a project** to open the Project Creation dialog.
1. Specify a name, a Postgres version, a region, and click **Create Project**.
1. The project is created and you are presented with a dialog that provides connection details for the project. Copy the connection string, which looks similar to the following:

```text
postgres://sally:************@ep-throbbing-firefly-664409.us-east-2.aws.neon.build/neondb
```

Every Neon project is created with a default PostgreSQL user named for your account and default database named `neondb`, as shown in the connection string that you copied. We'll use this user and database for our Prisma project.

## Step 3: Create a shadow database for Prisma Migrate

In addition to the your primary database, Prisma Migrate requires a second "shadow" database to manage schema drift. To create a shadow database:

1. In the Neon COnsole, select **Settings** > **Databases**.
1. Click **New Database**.
1. Select the branch where you want to create the database, enter a database name, and select a database owner. For simplicity, we'll name the shadow database `shadow`. Be sure to select the same branch where your primary `neondb` database resides. The default branch is `main`.

The connection string for this database is the same as the connection string for your primary database. Only the database name differs:

```text
postgres://daniel:************@ep-throbbing-firefly-664409.us-east-2.aws.neon.build/shadow
```

## Step 4: Set up your Prisma project

In this step, we'll create a Typescript project and set up Prisma following the instructions in Prisma's [Quickstart](https://www.prisma.io/docs/getting-started/quickstart) guide.

### Prerequisites

To complete these steps, you require Node.js v14.17.0 or higher. For more information about Prisma system requirements, see [System requirements](https://www.prisma.io/docs/reference/system-requirements).

1. Create a project directory and navigate to it.

    ```bash
    mkdir hello-prisma
    cd hello-prisma
    ```

1. Initialize a TypeScript project using npm. This creates a package.json file with the initial setup for your TypeScript app.

    ```bash
    npm init -y
    npm install typescript ts-node @types/node --save-dev
    ```

1. Initialize TypeScript:

    ```bash
    npx tsc --init
    ```

1. Install the Prisma CLI, which is a dependency for the project:

    ```bash
    npm install prisma --save-dev
    ```

1. Set up Prisma with the Prisma CLI `init` command. This creates a `prisma` directory with your Prisma schema file and configures PostgreSQL as your database. 

    ```bash
    npx prisma init --datasource-provider postgresql
    ```

You are now ready to model your data and create your database with some tables.

## Step 5: Configure your project to connect to Neon

In this step, we'll update your project's `.env` file with the connection strings for your primary and shadow data databases.

1. Open the `.env` file, which is located in your `prisma` directory.
2. Update the value of the `DATABASE_URL` variable to the connection string you copied in Step 3.
3. Add a `SHADOW_DATABASE_URL` variable and set the value to the connection string for the shadow database you created in Step 4.

When you are finished, your `.env` file should have entries similar to the following:

```text
DATABASE_URL=postgres://sally:************@ep-white-thunder-826300.us-east-2.aws.neon.tech/neondb
SHADOW_DATABASE_URL=postgres://sally:************@ep-white-thunder-826300.us-east-2.aws.neon.tech/shadow
```

## Step 6: Update your schema.prisma file

In this step, you will update the `datasource db` entry in your `schema.prisma` file and add models for `User` and `Post` tables. The models represent the tables in your underlying database and serve as the foundation for the generated Client API.

1. Update the the `datasource db` entry. Ensure that the provider is set to `postgresql`, and add a `shadowDatabaseUrl` entry.
2. Add the models for the `User` and `Post` tables.

When you are finished, your `schema.prisma` file should appear as follows:

```text
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

## Step 7: Run a migration to create the database tables in Neon

At this point, you still have no database tables in Neon. In this step, you will run a migration with Prisma Migrate, which will create the database tables. The tables are created based on the `User` and `Post` models you defined in the `schema.prisma` file in the previous step. Specifically, Prisma Migrate will:

- Create a SQL migration file for this migration in your `prisma/migrate` directory.
- Run the SQL migration file on your database

To run Prisma Migrate, run the following command:

```bash
npx prisma migrate dev --name init
```

<Admonition type="note">
Since this is your project's first migration, you're setting the `--name` flag to `init`. You can specify a different name for future migrations. If you want to skip the process of creating a migration history, you can use the `db push` command instead of `migrate dev`.

</Admonition>

The output of this command appears similar to the following:

```bash
Environment variables loaded from ../.env
Prisma schema loaded from schema.prisma
Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-white-thunder-826300.us-east-2.aws.neon.tech:5432"

Applying migration `20230105222046_init`

The following migration(s) have been created and applied from new schema changes:

migrations/

  └─ 20230105222046_init/

    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

added 2 packages, and audited 24 packages in 3s

found 0 vulnerabilities

✔ Generated Prisma Client (4.8.1 | library) to ./../node_modules/@prisma/client in 73ms
```

## Viewing your tables in the Neon Console

To view the `User` and `Post` tables that were created in your Neon project by the migration operation performed in the previous step:

1. Navigate to the [Neon console](https://console.neon.tech/).
2. Select your project.
3. Select **Tables**.
4. Select the `neondb` database and default `public` schema. The `User` and `Post` tables should be visible in the sidebar.

## Conclusion

Congratulations! You have successfully connected a Prisma project to a Neon database and performed your first migration. You have learned how to create a Neon project, create a shadow database, deploy a TypeScript sample project and set up Prisma, and perform a migration using Prisma Migrate.

## Next Steps

 If you would like to explore how to send queries to your database with Prisma Client, refer to the [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart). [Part 4: Explore how to send queries to your database with Prisma Client](https://www.prisma.io/docs/getting-started/quickstart#4-explore-how-to-send-queries-to-your-database-with-prisma-client), walks you through those steps.
