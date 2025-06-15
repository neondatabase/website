---
title: Schema migrations with Neon Postgres and Drizzle ORM
subtitle: "Leverage Neon's branching with Drizzle ORM to manage schema changes safely between development and production environments"
enableTableOfContents: true
updatedOn: '2025-02-03T20:41:57.311Z'
---

[Drizzle ORM](https://orm.drizzle.team/) is a TypeScript-first ORM that provides a simple way to define database schemas, execute queries, and manage migrations. When combined with Neon's branching capabilities, you can establish a reliable workflow for developing, testing, and deploying schema changes.

This guide will walk you through:

1.  Setting up your environment to use Neon branches with Drizzle.
2.  (Optional) Introspecting an existing database schema into Drizzle.
3.  Defining your schema and generating migration files using Drizzle.
4.  Two distinct methods for applying migrations: via `drizzle-kit migrate` and a custom migration script.
5.  Applying migrations to your `development` branch for testing.
6.  Promoting those migrations to your `production` branch.

## Prerequisites

Before you begin, ensure you have the following:

- A Neon account. If you do not have one, sign up at [console.neon.tech/signup](https://console.neon.tech/signup).
- A Neon project. Newly created projects come with `production` (default) and `development` branches.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine.
- [Neon CLI](/docs/reference/cli-install) (optional but recommended for managing branches and connection strings quickly from the terminal).

## Setting up your Neon Project and Branches

### Initialize your Neon Project

If you haven't already, log in to the [Neon Console](https://console.neon.tech/) and create a new project. By default, new Neon projects are created with two branches:

- `production`: Your primary database branch.
- `development`: A branch intended for development and testing

### Retrieve Connection strings

You'll need separate connection strings for your production and development branches.

<Admonition type="important" title="Direct connection for migrations">
Neon supports direct and pooled database connections. While pooled connections are excellent for application runtime, they can cause issues with schema migrations due to session-level configurations or transaction behaviors. **Always use a direct (non-pooled) connection string when performing migrations**. Use pooled connections for your application runtime to benefit from connection pooling (allowing more concurrent connections) and performance optimizations. For more information about direct and pooled connections, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

In the Neon Console:

1. Navigate to your project's Dashboard.
2. Click the Connect button to open the connection details modal.
3. Select the `production` branch from the dropdown for the **Branch** field.
   ![Neon Console production direct connection string](/docs/guides/neon-console-direct-connection-string.png)
4. Additionally, chose the **Database** and **Role** you want to connect with.
5. Copy the direct connection string by turning off the **Connection pooling** toggle. This will provide you with a direct connection string.
6. Repeat steps 2-5 for your `development` branch.

Your connection strings will look similar to this:

```bash
# Development branch connection string
postgresql://[database_user]:[user_password]@ep-[dev-endpoint-id].[region].[aws/azure].neon.tech/neondb?sslmode=require

# Production branch connection string
postgresql://[database_user]:[user_password]@ep-[prod-endpoint-id].[region].[aws/azure].neon.tech/neondb?sslmode=require
```

Keep these connection strings handy.

## Initial Project and Drizzle setup

This guide assumes you have an existing Node.js project with Drizzle ORM already configured.

**If you are new to Drizzle ORM or need to set it up with Neon**, please first follow the official [Drizzle ORM + Neon Quickstart guide](https://orm.drizzle.team/docs/get-started/neon-new).

Your project should have the following dependencies installed:

- `drizzle-orm`, `drizzle-kit`, and `@neondatabase/serverless` (Neon HTTP driver).
- `tsx` and `dotenv` installed as development dependencies (`npm install -D tsx dotenv`).
- A `schema.ts` file for your Drizzle schema definitions.
- A `.env` file in your project root containing your Neon branch connection strings:

  ```env
  DATABASE_URL_DEVELOPMENT=YOUR_DEVELOPMENT_NEON_DIRECT_CONNECTION_STRING
  DATABASE_URL_PRODUCTION=YOUR_PRODUCTION_NEON_DIRECT_CONNECTION_STRING
  ```

  Replace the placeholder values with your actual Neon direct connection strings which you obtained in the [Retrieve Connection strings](#retrieve-connection-strings) section.

## Syncing Drizzle schema with an existing Database (optional)

If you have an existing database schema on a Neon branch that you want to bring into your Drizzle `schema.ts` file, you can use the `drizzle-kit pull` command. This is useful to ensure your `schema.ts` aligns with the actual database state before you start defining migrations.

1.  **Ensure your `drizzle.config.ts` is configured for the target database.**

    `drizzle-kit pull` will use the `dbCredentials` specified in your Drizzle configuration file to connect to the database. It will place the generated schema files into the `out` directory also specified in this configuration.

    A typical `drizzle.config.ts` might look like this:

    ```typescript
    import type { Config } from 'drizzle-kit';
    import 'dotenv/config';

    export default {
      schema: './src/schema.ts', // Path to your main working schema file
      out: './drizzle', // `drizzle-kit pull` will place its output here. Migrations also go here.
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.DATABASE_URL_DEVELOPMENT!, // Use DATABASE_URL_PRODUCTION for production branch
      },
    } satisfies Config;
    ```

2.  **Add a `pull` script to `package.json`:**

    ```json
    {
      "scripts": {
        // ... other scripts
        "db:pull": "drizzle-kit pull"
      }
    }
    ```

    If you have separate configurations for development and production branches, you can create `drizzle.config.dev.ts` and `drizzle.config.prod.ts` and adjust the script accordingly. Refer to [Applying Migrations to Neon Branches](#applying-migrations-to-neon-branches) section for more details on how to set up these configurations.

    ```json
    {
      "scripts": {
        // ... other scripts
        "db:pull:dev": "drizzle-kit pull --config=drizzle.config.dev.ts",
        "db:pull:prod": "drizzle-kit pull --config=drizzle.config.prod.ts"
      }
    }
    ```

3.  **Run the `pull` command:**

    ```bash
    npm run db:pull
    # If using separate configurations for branches
    # npm run db:pull:dev # To pull schema from development branch
    # npm run db:pull:prod # To pull schema from production branch
    ```

    Drizzle Kit will connect to the database specified in your config's `dbCredentials`, read its schema, and generate corresponding Drizzle ORM schema definition files (`schema.ts` and potentially `relations.ts`) inside the `out` directory (e.g., `./drizzle/schema.ts`).

4.  **Transfer schema code to your working file:**

    - Navigate to the `out` directory specified in your `drizzle.config.ts` (e.g., `./drizzle`).
    - Locate the generated `schema.ts` file (and, if present, `relations.ts`) created by `drizzle-kit pull`.
    - Copy the contents of `schema.ts` (for example, from `./drizzle/schema.ts`).
    - Paste these contents into your main working schema file (such as `src/schema.ts`), replacing or merging with any existing definitions as needed.
    - If a `relations.ts` file was generated and is relevant to your schema, integrate its contents into your project's structure accordingly.

    ```
    ├ 📂 drizzle
    │ ├ 📂 meta
    │ ├ 📜 migration.sql
    │ ├ 📜 relations.ts ────────┐
    │ └ 📜 schema.ts ───────────┤
    ├ 📂 src                    │
    │ ├ 📂 db                   │
    │ │ ├ 📜 relations.ts <─────┤
    │ │ └ 📜 schema.ts <────────┘
    │ └ 📜 index.ts
    └ …
    ```

    This method enables schema management according to your preferred project organization, ensuring that Drizzle ORM functionalities, such as table relations, are consistent with your current database schema.

    For more details, refer to Drizzle Docs: [Transfer code to your actual schema file](https://orm.drizzle.team/docs/get-started/neon-existing#step-5---transfer-code-to-your-actual-schema-file)

After this process, your `src/schema.ts` file will reflect the structure of your existing database branch, and you can proceed with managing future changes using Drizzle migrations.

## Defining and applying Migrations

If you're defining your database schema from scratch, create it directly using Drizzle ORM syntax in your `schema.ts` file. Alternatively, if you've previously pulled an existing schema into `schema.ts` as described in [Syncing Drizzle schema with an existing Database](#syncing-drizzle-schema-with-an-existing-database-optional) section, you can start modifying it to suit your application's needs.

### Defining or Refining your schema

All schema definitions or modifications are made in your `src/schema.ts` file (or your chosen path, e.g., `db/schema.ts` as per your `drizzle.config.ts`) using Drizzle ORM's syntax.

For example, if you are starting a new schema or adding to an existing one, it might look like this:

```typescript
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const authors = pgTable('authors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  authorId: integer('author_id').references(() => authors.id),
  publishedYear: integer('published_year'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

This example defines two tables: `authors` and `books`, with a foreign key relationship between them. You can add more tables, columns, or relationships as needed.

### Generating Migration files

Whenever you change your schema file (e.g., `src/schema.ts`), you need to generate SQL migration files that Drizzle Kit can use to apply these changes to your database.

1.  **Configure Drizzle for Migration generation.**

    You should have a `drizzle.config.ts` file in your project root. A minimal `drizzle.config.ts` for generation could be:

    ```typescript
    import type { Config } from 'drizzle-kit';
    import 'dotenv/config';

    export default {
      schema: './src/schema.ts', // Path to your schema file
      out: './drizzle', // Output directory for migration files
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.DATABASE_URL_DEVELOPMENT!, // Or DATABASE_URL_PRODUCTION as needed
      },
    } satisfies Config;
    ```

    Adjust `schema` and `out` paths if your project structure is different.

2.  **Add a generation script to `package.json`:**

    ```json
    {
      "scripts": {
        // ... any existing scripts
        "db:generate": "drizzle-kit generate --config=drizzle.config.ts"
      }
    }
    ```

    > Migration generation scripts are **typically the same for both `development` and `production` branches**, as their function is simply to generate SQL files based on the current schema. However, if you have specific needs, you can **configure separate output directories and settings for each**, which is useful for maintaining distinct migration histories or schemas.

    If you have separate configurations for development and production branches, you can create `drizzle.config.dev.ts` and `drizzle.config.prod.ts` for development and production branches respectively, and adjust the script accordingly:

    ```json
    {
      "scripts": {
        // ... other scripts
        "db:generate:dev": "drizzle-kit generate --config=drizzle.config.dev.ts",
        "db:generate:prod": "drizzle-kit generate --config=drizzle.config.prod.ts"
      }
    }
    ```

3.  **Run migration generation:**
    ```bash
    npm run db:generate
    # If using seperate configurations for branches
    # npm run db:generate:dev # To generate migrations for development branch
    # npm run db:generate:prod # To generate migrations for production branch
    ```
    This command compares your `src/schema.ts` with the state recorded from previous migrations (or an empty state if it's the first time) and generates new SQL files in the `out` directory (e.g., `./drizzle`). These files contain the SQL commands needed to update your database schema.

### Applying migrations to Neon Branches

You have two primary methods to apply these generated SQL migrations:

- Using Drizzle Kit's `migrate` command.
- Using a custom TypeScript script for more programmatic control.

#### Method 1: Using `drizzle-kit migrate`

Drizzle Kit can apply migrations directly from the command line. To target different Neon branches (`development` and `production`), you'll use separate Drizzle configuration files, each pointing to the respective branch's connection string.

<Admonition type="note" title="Seperate Configurations for Branches">
When working with Drizzle Kit and multiple Neon branches, you have two main ways to tell Drizzle which database (branch) to use:

1.  **Separate config files:** Create a Drizzle config file for each branch (e.g., `drizzle.config.dev.ts` for your development branch, `drizzle.config.prod.ts` for production).
2.  **Single config file with environment variables:** Use one Drizzle config file. In this file, get the database URL from an environment variable. You'd change this environment variable to point to different branches.

The single config method is handy if you have several environments (like development, staging, and production). You need to ensure that the environment variable is set correctly before running migrations. This can be done in your CI/CD pipeline or locally by setting the environment variable before running the command. In this guide, we use separate files because it makes the steps for each branch very clear. However, the main ideas for running migrations are the same no matter which way you set up your Drizzle configuration.
</Admonition>

1.  **Create `drizzle.config.dev.ts` for the `development` branch:**
    This configuration will use `DATABASE_URL_DEVELOPMENT`.

    ```typescript
    // drizzle.config.dev.ts
    import type { Config } from 'drizzle-kit';
    import 'dotenv/config';

    export default {
      dialect: 'postgresql',
      schema: './src/schema.ts', // Path to your main working schema file
      out: './drizzle', // Directory containing migration files
      dbCredentials: {
        url: process.env.DATABASE_URL_DEVELOPMENT!,
      },
    } satisfies Config;
    ```

2.  **Create `drizzle.config.prod.ts` for the `production` branch:**
    This configuration will use `DATABASE_URL_PRODUCTION`.

    ```typescript
    // drizzle.config.prod.ts
    import type { Config } from 'drizzle-kit';
    import 'dotenv/config';

    export default {
      dialect: 'postgresql',
      schema: './src/schema.ts', // Path to your main working schema file
      out: './drizzle', // Directory containing migration files
      dbCredentials: {
        url: process.env.DATABASE_URL_PRODUCTION!,
      },
    } satisfies Config;
    ```

3.  **Add `drizzle-kit migrate` scripts to `package.json`:**

    ```json
    {
      "scripts": {
        // ... other scripts
        "db:pull:dev": "drizzle-kit pull --config=drizzle.config.dev.ts",
        "db:generate:dev": "drizzle-kit generate --config=drizzle.config.dev.ts",
        "db:migrate:dev": "drizzle-kit migrate --config=drizzle.config.dev.ts",

        "db:pull:prod": "drizzle-kit pull --config=drizzle.config.prod.ts",
        "db:generate:prod": "drizzle-kit generate --config=drizzle.config.prod.ts",
        "db:migrate:prod": "drizzle-kit migrate --config=drizzle.config.prod.ts"
      }
    }
    ```

    Follow the [Step-by-Step Migration Workflow](#the-step-by-step-migration-workflow) section to learn how to apply these migrations to your `development` and `production` branches in a safe and structured manner.

    <Admonition type="tip" title="Preventing Accidental Production Migrations">
    You may add additional confirmation prompts for production migrations to prevent accidental changes. For example here's a simple confirmation prompt for production migrations:
    ```json
    {
      "scripts": {
        // ... other scripts
        "db:migrate:prod": "read -r -p 'Are you sure you want to apply migrations to PRODUCTION BRANCH? (y/N) ' response && [[ \"$response\" =~ ^[Yy]$ ]] && drizzle-kit migrate --config=drizzle.config.prod.ts || echo 'Production migration cancelled.'"
      }
    }
    ```

    This script will prompt the user for confirmation before applying migrations to the production branch. If the user types 'y' or 'Y', it will proceed with the migration; otherwise, it will cancel the operation.
    </Admonition>

#### Method 2: Using a custom migration script

For scenarios demanding finer-grained control over the migration process like implementing custom logging, executing pre/post-migration hooks (such as temporarily pausing application services), or seamlessly integrating with complex CI/CD pipelines, a custom TypeScript script leveraging Drizzle ORM's migrator functions is the recommended approach.

The script provided below serves as a practical starting point. It outlines a basic structure that you can easily adapt and enhance with custom logging, error handling, and other logic specific to your migration workflow.

1.  **Create `src/migrate.ts`:**

    ```typescript
    import { drizzle } from 'drizzle-orm/neon-http';
    import { neon } from '@neondatabase/serverless';
    import { migrate } from 'drizzle-orm/neon-http/migrator';
    import 'dotenv/config';

    async function runMigrations(databaseUrl: string | undefined, branchNameForLog: string) {
      if (!databaseUrl) {
        console.error(`Error: Connection string for ${branchNameForLog} branch is not defined.`);
        console.error(
          `Please ensure DATABASE_URL_${branchNameForLog.toUpperCase()} is set in your .env file.`
        );
        process.exit(1);
      }

      const sql = neon(databaseUrl);
      const db = drizzle(sql);

      console.log(`Applying migrations to ${branchNameForLog} branch...`);
      try {
        await migrate(db, { migrationsFolder: './drizzle' }); // Ensure this path matches your 'out' directory
        console.log(`Migrations applied successfully to ${branchNameForLog} branch.`);
      } catch (error) {
        console.error(`Error applying migrations to ${branchNameForLog} branch:`, error);
        process.exit(1);
      }
    }

    async function main() {
      const targetBranchArg = process.argv[2]?.toLowerCase(); // Expect 'development' or 'production'

      if (
        !targetBranchArg ||
        (targetBranchArg !== 'development' && targetBranchArg !== 'production')
      ) {
        console.error('Invalid target branch specified.');
        console.error('Usage: npm run db:migrate:<dev|prod>:script');
        process.exit(1);
      }

      let dbUrl;
      let branchNameForLog;

      if (targetBranchArg === 'development') {
        dbUrl = process.env.DATABASE_URL_DEVELOPMENT;
        branchNameForLog = 'Development';
      } else {
        // 'production'
        dbUrl = process.env.DATABASE_URL_PRODUCTION;
        branchNameForLog = 'Production';
      }

      await runMigrations(dbUrl, branchNameForLog);
    }

    main();
    ```

2.  **Add custom script migration commands to `package.json`:**
    ```json
    {
      "scripts": {
        // ... other scripts (generate, pull)
        "db:migrate:dev:script": "tsx ./src/migrate.ts development",
        "db:migrate:prod:script": "tsx ./src/migrate.ts production"
      }
    }
    ```

### The Step-by-step migration workflow

Depending on your workflow, you can choose to use either the Drizzle Kit migration commands or the custom script method. The steps below outline the general process for applying schema changes using either method.

To maintain a clean and safe migration process between your `development` and `production` branches, follow these steps:

![Drizzle migration workflow](/docs/guides/drizzle-migrations-workflow.svg)

1.  **Modify schema:** Make your desired changes in your schema file (e.g., `src/schema.ts`).
2.  **Generate migrations:** Run `npm run db:generate`. This creates new SQL files in your `out` directory (e.g., `./drizzle`).
3.  **Apply to `development` branch:** Choose one of your configured methods:
    - Using Drizzle Kit: `npm run db:migrate:dev`
    - Using custom script: `npm run db:migrate:dev:script`
4.  **Verify on `development`:**
    - Thoroughly test the changes on your `development` branch.
    - Connect using [psql](/docs/connect/query-with-psql-editor), the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), or your preferred DB tool to inspect the schema and data.
    - If your application connects to this branch for development, test its functionality.
    - Run any relevant test suites against the `development` branch.
5.  **Apply to `production` branch:** Once confident that the migrations are correct, safe, and tested:
    - Using Drizzle Kit: `npm run db:migrate:prod`
    - Using custom script: `npm run db:migrate:prod:script`
    - For enhanced reliability and consistency, integrate this migration task into your CI/CD pipeline. This automates the application of migrations during deployments, significantly reducing the need for manual, error-prone changes to your production database.
6.  **Verify on `production`:** Perform checks on your `production` environment to ensure the schema was updated as expected and that your application remains healthy.

## Handling subsequent schema changes

The workflow described above (`Modify Schema -> Generate Migrations -> Apply to Dev -> Verify on Dev -> Apply to Prod -> Verify on Prod`) should be repeated for every new set of schema modifications. This ensures that each change is isolated, tested, and safely deployed without impacting the stability of your production environment.

To further enhance your development and testing lifecycle, consider extending this branching model. Utilize dedicated branches for individual developers (e.g., `dev1`, `dev2`), QA teams `(qa`), or staging environments (`staging`). This approach provides even greater isolation for changes and allows for thorough testing before features are promoted to production.

Neon branches enhance your Drizzle migration workflow without the cost of full database duplication. Billing is based on unique data storage. If you create a development branch from a 10 GB production branch, it initially shares the same data. As you introduce schema changes and add data to development (say, 1 GB of new or modified data), only this delta contributes to additional storage costs (totaling 11 GB in this example). This model replaces the cumbersome and costly traditional setup of maintaining separate database servers, manually keeping them in sync, and navigating the complexities of migrating across these isolated instances.

## Advanced strategies for managing schema evolution

Beyond the workflow, Neon's branching capabilities, combined with strategic practices, can further optimize your schema migration process, especially for complex changes or long-lived development cycles.

### Keeping Branches Fresh and Aligned

Over time, your `development` branch can diverge significantly from `production`, or accumulate a long history that might become less relevant. Neon's [Reset from parent](/docs/guides/reset-from-parent) feature allows you to reset a branch to its parent state, effectively bringing it back in line with the latest production schema and data.

#### Why reset your `development` branch?

1.  **Start fresh for new features:** Before beginning a significant new feature or a complex schema change, resetting your `development` branch from `production` ensures you're working against the most current production schema and data. This avoids conflicts or surprises later in the development cycle.
2.  **Prevent history window issues:** Neon retains a history of changes (Write-Ahead Logs or WAL) for each branch, enabling features like Point-in-Time Restore. For long-lived development branches with many changes, this history can grow. While Neon manages storage efficiently, resetting a development branch effectively starts its history anew from the parent's current state. This can be useful if a branch's history is no longer needed or if you want to ensure it's within a more recent recovery window relative to its new baseline.
3.  **Simplify and clean up:** If a development branch has gone through many experimental changes or aborted features, a reset provides a clean slate, making it easier to manage.
4.  **Maintain a consistent baseline for testing:** For QA or staging branches, regularly resetting them from `production` ensures that testing is always performed against a known, reliable baseline that accurately reflects the production environment.

#### How to use "Reset from Parent"

You can reset a branch using the Neon Console or the Neon CLI. For example, to reset your `development` branch:

```bash
neonctl branches reset development --parent production --project-id <project id>
```

> Replace `<project id>` with your actual Neon project ID. You can find this in the Neon Console under your project's settings.

<Admonition type="important" title="Impact of Resetting">
When you reset a branch:
- The branch's current schema and data are **completely replaced** with the latest schema and data from its parent.
- Any unmerged changes or unique data on the child branch **will be lost**. Ensure you have committed any necessary schema changes to your Drizzle migration files and applied them to other relevant branches if needed before resetting.
- The connection string for the reset branch remains the same, simplifying application configuration.
- Existing connections will be temporarily interrupted for the `development` branch during the reset process.
</Admonition>

### Implementing Zero-Downtime complex migrations with the Expand-Contract Pattern

Some schema changes are inherently "breaking" if applied directly – for example, renaming a critical table or column, changing a column's data type in an incompatible way, or splitting a column into multiple new ones. Applying such changes directly to a live `production` database can lead to downtime or errors as your application might temporarily be incompatible with the schema.

The **Expand-Contract pattern** (also known as parallel change) is a robust strategy to perform these types of complex schema migrations with zero or minimal downtime. It involves a series of phased, backward-compatible changes to both your database schema and application code.

The pattern generally involves these phases:

1.  **Expand (Phase 1 - Additive Changes):**

    - **Schema:** Add the new schema elements (new tables, new columns) alongside the old ones. For example, if renaming `users.email_address` to `users.email`, you would add the new `email` column but keep `email_address` for now. New columns should typically be nullable or have a default value to not break existing write operations.
    - **Application:** Modify your application code to write to _both_ the old and new schema elements (dual writes). It should continue to read from the _old_ schema element as the source of truth. This ensures data consistency during the transition.
    - **Data Backfill:** Migrate existing data from the old schema elements to the new ones. This can be a one-time script or a background process.

2.  **Migrate (Phase 2 - Shift Read Source):**

    - **Application:** Update your application code to read from the _new_ schema elements. Writes continue to go to both old and new elements.
    - **Verification:** Thoroughly test that the application works correctly with the new schema elements as the read source.

3.  **Contract (Phase 3 - Cleanup):**
    - **Application:** Modify your application code to stop writing to the _old_ schema elements. Now, reads and writes only use the new schema.
    - **Schema:** Remove the old, now unused, schema elements (old tables, old columns) from your database. This is a Drizzle migration that drops the old structures.

### How Neon Branches support the Expand-Contract Pattern

Neon branches significantly simplify testing and validating each phase of an Expand-Contract migration:

- **Isolated Phase Testing:** You can perform each schema change (e.g., adding a new column, backfilling data, dropping an old column) on your `development` branch (or a dedicated feature branch).
- **Application compatibility checks:** Deploy application code changes corresponding to each phase against this development branch to ensure compatibility.
- **Staging validation:** Before applying changes to `production`, you can use a `staging` branch (which could be a reset of `production` + the current migration phase) to perform end-to-end testing.

### Example scenario

Let's consider a scenario where you need to rename a column in your `books` table from `published_year` to `publication_year`. This is a breaking change that requires careful handling to avoid downtime or data loss.

#### Preparation

- You have your `production` Neon branch.
- You have a `development` Neon branch (ideally recently reset from `production` or a fresh branch for this feature).
- Your application has separate deployment environments (e.g., a `dev` or `staging` environment pointing to your `development` Neon branch, and a `production` environment pointing to your `production` Neon branch).

You can now test the full Expand-Contract cycle on your `development` branch and application environment before promoting to `production`.

#### Expand Phase (on `development` branch & `dev` app environment)

- **Schema change:** In your `schema.ts`, add the new `publication_year DATE` column to the `books` table.

  ```typescript
  import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

  export const authors = pgTable('authors', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });

  export const books = pgTable('books', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    authorId: integer('author_id').references(() => authors.id),
    publishedYear: integer('published_year'),
    publicationYear: integer('publication_year'), // [!code ++]
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });
  ```

- **Generate & apply migration:**

  ```bash
  npm run db:generate
  npm run db:migrate:dev
  ```

  This applies the "add column" migration to your `development` Neon branch.

- **Application code update (dev version):**
  - Modify your application code so that when creating or updating a book, it writes the date to _both_ the old `published_year` and the new `publication_year` columns.
  - Ensure all read operations for this date still use the _old_ `published_year` column as the source of truth.
- **Deploy & test (dev application):** Deploy this updated application version to your `dev` environment (pointing to the `development` Neon branch). Test create/update operations and verify data is written to both columns. Verify reads are still correct.
- **Data Backfill (on `development` branch):** Run a script against your `development` Neon branch to populate the new `publication_year` column for all existing books:
  ```sql
  UPDATE books SET publication_year = published_year;
  ```

Verify the backfill on the `development` branch.

#### Migrate Phase (on `development` branch & `dev` app environment)

- Modify your application code to now read from the _new_ `publication_year` column.
- Writes should ideally continue to go to _both_ `published_year` and `publication_year` for a period to ensure data integrity and easier rollback during this phase if needed. Alternatively, if confident, writes could switch to only the new column.
- **Deploy & Test (dev application):** Deploy this updated application version to your `dev` environment. Thoroughly test all functionalities that read or display this date. Ensure data consistency.

#### Contract phase (on `development` branch & `dev` app environment)

- Modify your application code to stop writing to the old `published_year` column. All reads and writes now exclusively use `publication_year`.
- **Deploy & test (dev application):** Deploy this application version to your `dev` environment. Confirm all operations work as expected using only the new column.
- **Schema shange:** In `schema.ts`, remove the old `published_year` column from the `books` table.

  ```typescript
  import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

  export const authors = pgTable('authors', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });

  export const books = pgTable('books', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    authorId: integer('author_id').references(() => authors.id),
    publishedYear: integer('published_year'), // [!code --]
    publicationYear: integer('publication_year'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });
  ```

- **Generate & apply migration:**

  ```bash
  npm run db:generate
  npm run db:migrate:dev
  ```

  This applies the "drop column" migration to your `development` Neon branch.

- **Final Test (dev application):** Re-test your application thoroughly in the `dev` environment to ensure everything functions correctly after the old column is dropped.

#### Rolling out validated changes to `production` (Phased approach)

Once the entire Expand-Contract cycle (all schema changes and corresponding application code updates for each phase) has been successfully validated on your `development` branch and `dev` application environment, you can proceed to roll out these changes to `production` in the same phased manner. **Each step involves deploying a corresponding _production-ready_ version of your application code alongside the schema migration.**

Here's an illustrated diagram of the Expand-Contract pattern with Neon branches:

![Expand-Contract Pattern](/docs/guides/expand-contract-pattern.svg)

While the Expand-Contract pattern requires more distinct steps and careful coordination between schema and application changes, it is invaluable for maintaining uptime and data integrity during significant schema changes in live production systems. Drizzle helps manage the schema definition and SQL migration generation for each database step, and Neon branches provide the safe, isolated environments essential for testing these intricate transitions thoroughly before they reach production.

## Conclusion

Using Neon's database branching with Drizzle ORM offers a powerful and safe methodology for managing your PostgreSQL schema migrations. By systematically developing and testing schema changes on an isolated `development` branch before applying them to your `production` environment, you significantly reduce deployment risks and ensure a smoother evolution of your application's database backend.

For a more streamlined development workflow, explore Neon's capability to create database branches for each Pull Request (PR). You can automate the entire lifecycle of these ephemeral branches from creation and applying Drizzle schema migrations for testing, to their eventual deletion using GitHub Actions or your preferred CI/CD pipeline. This ensures each PR is tested against an isolated, correctly migrated database. Discover how to set up the branching automation in our guide: [Automate branching with GitHub Actions](/docs/guides/branching-github-actions).

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Migrations with Drizzle Kit](https://orm.drizzle.team/docs/kit-overview)
- [Drizzle with Neon Postgres](https://orm.drizzle.team/docs/tutorials/drizzle-with-neon)
- [Neon Branching Documentation](/docs/introduction/branching)
- [Neon Serverless Driver](/docs/serverless/serverless-driver)

<NeedHelp/>
