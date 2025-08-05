---
author: paul-scanlon
enableTableOfContents: true
createdAt: '2025-02-14T00:00:00.000Z'
updatedOn: '2025-02-14T00:00:00.000Z'
title: How to Create a Reliable Testing Dataset with pg_dump and pg_restore
subtitle: A practical guide to extracting a test dataset from Postgres using pg_dump, pg_restore and psql
---

As your Postgres database grows, you'll likely need a way to generate a smaller, 'good-enough' dataset that preserves the structure and referential integrity of production but is better suited for testing.

There are several ways to do this, but here's a straightforward approach using `pg_dump`, `pg_restore`, `psql` and GitHub Actions.

## Running partial data dumps inside GitHub Actions

You can run `pg_dump`, `pg_restore`, and `psql` from the command line, but sometimes, an automated, reproducible approach is more convenient. To better control when data dumps occur, I use a [scheduled GitHub Action](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule) to export data from my production database and restore it to a testing database. This method works across different Postgres database providers, but if you're looking for a cost-effective testing environment, consider trying Neon. Check out our [getting started guide](/docs/get-started/signing-up#sign-up) to see how easy it is to set up.

## What is a scheduled GitHub Action?

A scheduled GitHub Action runs automatically at a time you define. Since you're dumping data from a production database, you'll likely want to run this job when the system isn't under heavy load, typically outside of business hours. I usually schedule these jobs for midnight, but since I don't want to stay up that late, a scheduled GitHub Action takes care of it while I sleep.

## Getting started with GitHub Actions

To create a GitHub Action, you'll need a GitHub repository to store it. If you don't have one yet, create one now and clone it to your machine for local development.

In the root of your project, create a `.github` directory. Inside it, add another directory called `workflows`. Then, within `workflows`, create a new file named `dump-test-data.yml`, for example:

```
.github
  |-- workflows
    |-- dump-test-data.yml
```

Now add the following code.

There's a lot happening here, so before I get to the `pg_dump`, `pg_restore` and `psql` steps, let me briefly explain what this first part does.

```yml
name: Dump Test Data

on:
  schedule:
    - cron: '0 0 * * *' # Runs at midnight UTC
  workflow_dispatch:

env:
  PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }} # Production or staging database
  DEV_DATABASE_URL: ${{ secrets.DEV_DATABASE_URL }} # Development or testing database
  PG_VERSION: '17'

jobs:
  dump-and-restore:
    runs-on: ubuntu-latest

    steps:
      - name: Install PostgreSQL
        run: |
          sudo apt update
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt install -y postgresql-${{ env.PG_VERSION }}

      - name: Set PostgreSQL binary path
        run: echo "POSTGRES=/usr/lib/postgresql/${{ env.PG_VERSION }}/bin" >> $GITHUB_ENV
```

### name

This name will appear in the **Actions** section of the GitHub UI. Regardless of what you name your file, this is the name that will be displayed.

## on

This section of the workflow determines when the Action will run. The `schedule` field includes a `cron` expression, which uses [POSIX cron syntax](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07) to specify how often the Action should execute.

I've also included the `workflow_dispatch` field, which lets you manually trigger this Action from the GitHub UI—a useful feature while developing and testing the workflow.

### env

This workflow requires two environment variables. The first is the Postgres connection string for the source database, typically your production or staging database. The second is the connection string for the target database, which will serve as your testing database. Both need to use the same version of Postgres. Both of these variables will also need to be added to your GitHub repositories secrets.

To do this, navigate to **Settings** > **Settings and variables** > **Actions** and add them under **Repository secrets**.

![Screenshot of GitHub repository secrets](/guides/images/reliable-testing-dataset-with-pg-dump-and-pg-restore/screenshot-of-github-respository-secrets.jpg)

The last variable defines the Postgres version to install in the Action environment. Since `pg_dump`, `pg_restore`, and `psql` depend on Postgres, you'll need to install it within the Action—I’ll cover this in more detail later. It’s also worth noting the version of Postgres you install here should be the same version used by both your source and target database. In my example, all use [Postgres 17](/blog/postgres-17).

### jobs/steps

The job is named `dump-and-restore`, which will be displayed in the GitHub UI when the Action is running. You can choose any name you prefer.

The first step in the job is to install Postgres. While there are various methods and alternative options available in the [GitHub Marketplace](https://github.com/marketplace?query=Postgres), I prefer to install directly from Apt (Advanced Packaging Tool) for added security, especially since you're providing direct access to your production database.

The next step is to define a variable that is needed when using `pg_dump`, `pg_restore`, and `psql`. This variable is named `POSTGRES` and will be referenced later as `$POSTGRES/pg_dump`.

Before I jump into the dump/restore parts, I'll quickly explain the schema I've used in this example. It’s important to note the foreign key relationships between the tables.

In my example, the foreign key relationships are as follows:

- The **transactions** table has a foreign key `user_id` that references the `user_id` column in the **users** table. This establishes a relationship where each transaction is linked to a specific user.
- The **transactions** table is linked to the **products** table through the `product_id` foreign key. This establishes a relationship where each transaction is associated with a specific product.

### users

This is the schema used to create the `users` table.

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### products

This is the schema used to create the `products` table.

```sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### transactions

This is the schema used to create the `transactions` table.

```sql
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'failed'))
);
```

The **transactions** table in my example relies on data from both the **users** and **products** tables. When performing a partial data dump, it's important that transaction rows can reference either a `user_id` from the **users** table or a `product_id` from the **products** table.

With this in mind, I'll start with the `transactions` table when deciding which data to include in the partial dump.

## Dump and restore partial data

Add the following code after the **Set PostgreSQL binary path** step.

```yml {23-46}
name: Dump Test Data
on:
  schedule:
    - cron: '0 0 * * *' # Runs at midnight UTC
  workflow_dispatch:
env:
  PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }} # Production or staging database
  DEV_DATABASE_URL: ${{ secrets.DEV_DATABASE_URL }} # Development or testing database
  PG_VERSION: '17'
jobs:
  dump-and-restore:
    runs-on: ubuntu-latest
    steps:
      - name: Install PostgreSQL
        run: |
          sudo apt update
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt install -y postgresql-${{ env.PG_VERSION }}

      - name: Set PostgreSQL binary path
        run: echo "POSTGRES=/usr/lib/postgresql/${{ env.PG_VERSION }}/bin" >> $GITHUB_ENV

     - name: Dump schema
        run: |
          $POSTGRES/w "${{ github.workspace }}/all-schema.bak" "${{ env.PROD_DATABASE_URL }}"

      - name: Dump data
        run: |
          $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM transactions ORDER BY transaction_id DESC LIMIT 50) TO '${{ github.workspace }}/transactions-subset.csv' WITH CSV HEADER"
          $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM products WHERE product_id IN (SELECT product_id FROM transactions ORDER BY transaction_id DESC LIMIT 50)) TO '${{ github.workspace }}/products-subset.csv' WITH CSV HEADER"
          $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM users WHERE user_id IN (SELECT user_id FROM transactions ORDER BY transaction_id DESC LIMIT 50)) TO '${{ github.workspace }}/users-subset.csv' WITH CSV HEADER"

      - name: Drop tables and schema
        run: |
          $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "DROP SCHEMA IF EXISTS public CASCADE;"
          $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "CREATE SCHEMA public;"

      - name: Restore schema
        run: |
          $POSTGRES/pg_restore --clean --no-owner --no-acl --if-exists --schema-only -d "${{ env.DEV_DATABASE_URL }}" "${{ github.workspace }}/all-schema.bak"

      - name: Restore data
        run: |
          $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.users FROM '${{ github.workspace }}/users-subset.csv' WITH CSV HEADER"
          $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.products FROM '${{ github.workspace }}/products-subset.csv' WITH CSV HEADER"
          $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.transactions FROM '${{ github.workspace }}/transactions-subset.csv' WITH CSV HEADER"
```

The above code snippet might look a bit complicated at first, but it’s actually not that bad—let me break it down for you.

### Dump schema

In this step, I use `pg_dump` to export the entire schema from the production database and save it to the GitHub workspace as a file named `all-schema.bak`. This file is stored in memory so it can be accessed later by the **Restore schema** step towards the end of the job.

The flags used in this step are explained below:

| Flag            | Meaning                                                                          |
| --------------- | -------------------------------------------------------------------------------- |
| `-Fc`           | Dumps the database in a custom format.                                           |
| `--schema-only` | Dumps only the schema (table structures, indexes, constraints) without any data. |
| `-f `           | Specifies the output file where the schema dump will be stored.                  |

### Dump data

In this step, I use `psql` to query the data. This is the most complex step, involving three SQL queries, each targeting one of the three tables. The queries are as follows:

#### Transactions query

This query selects the 50 most recent **transactions** from the `transactions` table. Depending on your requirements, you can increase the `LIMIT` or modify the query.

```sql
SELECT * FROM transactions ORDER BY transaction_id DESC LIMIT 50
```

The results are saved to the GitHub workspace memory as a file called `transactions-subset.csv`, which will be used in a later step.

#### Products query

This query selects **products**, but only those with a `product_id` present in the 50 most recent **transactions**:

```sql
SELECT * FROM products WHERE product_id IN (SELECT product_id FROM transactions ORDER BY transaction_id DESC LIMIT 50)
```

The results are saved to the GitHub workspace memory as a file called `products-subset.csv`, which will be used in a later step.

#### Users query

This query selects **users**, but only those with a `user_id` present in the 50 most recent **transactions**:

```sql
SELECT * FROM users WHERE user_id IN (SELECT user_id FROM transactions ORDER BY transaction_id DESC LIMIT 50)
```

The results are saved to the GitHub workspace memory as a file called `users-subset.csv`, which will be used in a later step.

### Drop tables and schema

In this step, I use `psql` to drop the schema and create a fresh one. Since this Action runs on a schedule, this cleanup ensures the target database is ready for new schema and data, avoiding any errors from schema changes since the last run.

The queries used in this step are explained below:

| Step                                    | Effect                                                   |
| --------------------------------------- | -------------------------------------------------------- |
| `DROP SCHEMA IF EXISTS public CASCADE;` | Removes the public schema and everything inside it.      |
| `CREATE SCHEMA public;`                 | Recreates the public schema for a clean restore process. |

### Restore schema

In this step, I use `pg_restore` to restore the schema from the `all-schema.bak` file, which was saved to the GitHub workspace during the Dump schema step.

The flags used in this step are explained below:

| Flag            | Meaning                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| `--clean`       | Drops existing database objects before recreating them, ensuring a clean restore.                              |
| `--no-owner`    | Ignores ownership information in the dump file, so restored objects are owned by the user running the restore. |
| `--no-acl`      | Excludes access control (GRANT/REVOKE) statements from the restore, preventing permission changes.             |
| `–if-exits`     | Ensures that DROP commands (used with --clean) only execute if the object exists, preventing errors.           |
| `--schema-only` | Restores only the schema (table structures, indexes, constraints) without inserting any data.                  |
| `-d`            | Specifies the target database to restore into.                                                                 |

## Restore data

In this step, I use `psql` to restore the data to the target database from the `.csv` files generated in the **Dump data** step.

## Finished

Once the Action completes successfully, your target database will have a fresh test data set ready for use!

This Action is part of our [Dev/Test use case](/use-cases/dev-test), widely used by Neon customers who face limitations with traditional databases for testing. By leveraging a dedicated Neon database, while leaving production environments where they are, developers gain access to Neon's full suite of features, including the [built-in SQL editor](/docs/get-started/query-with-neon-sql-editor), [table explorer](/docs/guides/tables), and [branching](/docs/introduction/branching).

If you'd like to learn more about using Neon for testing, check out our [dev/test use case](/use-cases/dev-test) or contact our [sales team](/contact-sales).
