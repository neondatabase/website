---
title: Use Prisma Migrate with Neon
enableTableOfContents: true
---

## Introduction

Prisma is an open source next-generation ORM that includes the following tools:

- Prisma Client: An auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: A migration tool for evolving your database schema from prototyping to production
- Prisma Studio: A GUI tool for viewing and editing data in your database

This tutorial focusses on setting up Prisma with Neon and performing a migration using Prisma Migrate. You will learn how to create a Neon project, set up a Prisma project, model database tables in Prisma, and perform a migration. At the end of the tutorial, we'll point you to instructions you can follow to build upon this setup by executing queries using Prisma Client.

## Step 1: Sign up with Neon

To sign up for Neon:

1. Navigate to [https://console.neon.tech](https://console.neon.tech).
2. Sign in with a Github or Google account.

After signing in, you are directed to the Neon Console where you can create your first project.

## Step 2: Create a project and copy the connection string

1. In the Neon Console, click **Create a project** to open the **Project Creation** dialog.
1. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

The project is created and you are presented with a dialog that provides connection details. Copy the connection string, which looks similar to the following:

```text
postgres://sally:************@ep-throbbing-firefly-664409.us-east-2.aws.neon.build/neondb
```

<Admonition type="note">
Every Neon project is created with a default PostgreSQL user named for your account, and default database named `neondb`, as shown in the connection string that you copied. We'll use this user and database for our Prisma project.
</Admonition>

## Step 3: Create a shadow database for Prisma Migrate

Prisma Migrate requires a second "shadow" database to detect schema drift and generate new migrations. For more information about the the purpose of the shadow database, refer to [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), in the _Prisma documentation_.

For cloud-hosted databases like Neon, you need to create the shadow database manually. To create the shadow database:

1. In the Neon Console, select **Settings** > **Databases**.
1. Click **New Database**.
1. Select the branch where you want to create the database, enter a database name, and select a database owner. For simplicity, we'll name the shadow database `shadow`, and we'll select the same branch where the `neondb` database resides.

The connection string for this database is the same as the connection string for your `neondb` database. Only the database name differs:

```text
postgres://sally:************@ep-throbbing-firefly-664409.us-east-2.aws.neon.build/shadow
```

## Step 4: Set up your Prisma project

In this step, we'll deploy a sample Typescript project and set up Prisma closely following the instructions in Prisma's [Quickstart](https://www.prisma.io/docs/getting-started/quickstart) guide.

**Prerequisites**

To complete these steps, you require Node.js v14.17.0 or higher. For more information about Prisma's system requirements, see [System requirements](https://www.prisma.io/docs/reference/system-requirements).

1. Create a project directory and navigate to it.

    ```bash
    mkdir hello-prisma
    cd hello-prisma
    ```

1. Initialize a TypeScript project using `npm`. This creates a `package.json` file with the initial setup for your TypeScript app.

    ```bash
    npm init -y
    npm install typescript ts-node @types/node --save-dev
    ```

1. Initialize TypeScript:

    ```bash
    npx tsc --init
    ```

1. Install the Prisma CLI, which is a project dependency:

    ```bash
    npm install prisma --save-dev
    ```

1. Set up Prisma with the Prisma CLI `init` command. This creates a `prisma` directory with a Prisma schema file and configures PostgreSQL as your database.

    ```bash
    npx prisma init --datasource-provider postgresql
    ```

You are now ready to model your data and create some tables in your `neondb` database.

## Step 5: Configure your project to connect to Neon

In this step, we'll update your project's `.env` file with the connection strings for your `neondb` and `shadow` data databases.

1. Open the `.env` file, which is located in your `prisma` directory.
2. Update the value of the `DATABASE_URL` variable to the connection string you copied in Step 2.
3. Add a `SHADOW_DATABASE_URL` variable and set the value to the connection string for the shadow database you created in Step 3.

When you are finished, your `.env` file should have entries similar to the following:

```text
DATABASE_URL=postgres://sally:************@ep-white-thunder-826300.us-east-2.aws.neon.tech/neondb?connect_timeout=30
SHADOW_DATABASE_URL=postgres://sally:************@ep-white-thunder-826300.us-east-2.aws.neon.tech/shadow?connect_timeout=30
```

<Admonition type="note">
A `?connect_timeout=30` option is added to the connection strings shown above to avoid database connection timeouts. The default `connect_timeout` setting is 5 seconds, which is usually enough time for a database connection to be established. However, network latency combined with the couple of seconds it takes to start an idle Neon compute instance can sometimes cause the default `connect_timeout` setting to be exceeded. Setting `connect_timeout=30` helps avoid this potential connection timeout issue.
</Admonition>

## Step 6: Update your schema.prisma file

In this step, you will update the `datasource db` entry in your `schema.prisma` file and add models for the `User` and `Post` tables. The models represent the tables in your underlying database and serve as the foundation for the generated Client API. For more information about data modeling in Prisma, see [Data modeling](https://www.prisma.io/docs/concepts/overview/what-is-prisma/data-modeling), in the _Prisma documentation_.

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

At this point, you still have no database tables in Neon. In this step, you will run a migration with Prisma Migrate, which will create the database tables. The tables are created based on the `User` and `Post` models that you defined in the `schema.prisma` file in the previous step. Specifically, Prisma Migrate performs the following actions:

- Creates an SQL migration file for this migration in your `prisma/migrate` directory.
- Runs the SQL migration file on your database

To run Prisma Migrate, issue the following command:

```bash
npx prisma migrate dev --name init
```

<Admonition type="note">
Since this is your project's first migration, we set the migration `--name` flag to `init`. You can use a different name for future migrations. If you want to skip the process of creating a migration history, you can use the `db push` command instead of `migrate dev`. The `db push` command pushes the state of your Prisma schema file to the database without using migrations. For more information see [db push](https://www.prisma.io/docs/reference/api-reference/command-reference#db-push).
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

## Step 8: View your tables in the Neon Console

To view the `User` and `Post` tables that were created in your `neondb` database by the migration performed in the previous step:

1. Navigate to the [Neon console](https://console.neon.tech/).
2. Select your project.
3. Select **Tables**.
4. Select the `neondb` database and default `public` schema. The `User` and `Post` tables should be visible in the sidebar (the tables have no data at this point).

## Step 9: Evolve your schema with Prisma Migrate

In this step, you will evolve your Prisma schema and generate and apply a migration with `prisma migrate dev`.

Add a `tag` field to your `Post` model. The modified schema should appear as follows:

```text
model Post {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(255)
  createdAt DateTime @default(now()) @db.Timestamp(6)
  content   String?
  published Boolean  @default(false)
  authorId  Int
  user      User     @relation(fields: [authorId], references: [id])
  tag       String?      
}   
    ```

3. Apply the Prisma schema change to your database using `prisma migrate dev` command. In this example, name given to the migration is `add-tag-field`.

    ```bash
    npx prisma migrate dev --name add-tag-field
    ```

    This command creates a new SQL migration file for the migration, applies the generated SQL migration to your database, and regenerates the Prisma Client. The output resembles the following:

    ```bash
    Environment variables loaded from .env
    Prisma schema loaded from prisma/schema.prisma
    Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-white-thunder-826300.us-east-2.aws.neon.tech:5432"

    Applying migration `20230113120852_add_tag_field`



    The following migration(s) have been created and applied from new schema changes:

    migrations/
      └─ 20230113120852_add_tag_field/
        └─ migration.sql

    Your database is now in sync with your schema.

    ✔ Generated Prisma Client (4.8.1 | library) to ./node_modules/@prisma/client in 
    91ms
    ```
     
    You can view the migration in your `prisma/migrations` folder.

## Conclusion

Congratulations! You have successfully connected a Prisma project to a Neon database and performed migrations using Prisma Migrate.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
