---
title: 'Neon Twin: Automate Partial Data Dumps with Postgres and GitHub Actions'
description: >-
  Create a Neon Twin to develop safely with production data—without migrating
  your database.
excerpt: >-
  Your production database is tried and tested and likely bulletproof. Merely
  mentioning migrating to a new provider would likely set off multiple alarms,
  so don’t, use a Neon Twin instead. In this post, I’ll show you how to create a
  partial copy of your production database so you...
date: '2025-02-10T16:31:46'
updatedOn: '2025-02-17T18:50:28'
category: workflows
categories:
  - workflows
authors:
  - paul-scanlon
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/automate-partial-data-dumps-with-postgresql-and-github-actions/cover.jpg
  alt: Automate Partial Data Dumps with PostgreSQL and GitHub Actions
isFeatured: false
seo:
  title: >-
    Neon Twin: Automate Partial Data Dumps with Postgres and GitHub Actions -
    Neon
  description: >-
    Create a Neon Twin to develop safely with production data—without migrating
    your database.
  keywords: []
  noindex: false
  ogTitle: >-
    Neon Twin: Automate Partial Data Dumps with Postgres and GitHub Actions -
    Neon
  ogDescription: >-
    Create a Neon Twin to develop safely with production data—without migrating
    your database.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/automate-partial-data-dumps-with-postgresql-and-github-actions/social.jpg
source:
  wpId: 8441
  wpSlug: automate-partial-data-dumps-with-postgresql-and-github-actions
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Automate Partial Data Dumps with PostgreSQL and GitHub Actions](https://cdn.neonapi.io/public/images/pages/blog/automate-partial-data-dumps-with-postgresql-and-github-actions/neon-partial-data-dumps-cover-1024x576-86d428a9.jpg)

Your production database is tried and tested and likely bulletproof. Merely mentioning migrating to a new provider would likely set off multiple alarms, so don’t, use a Neon Twin instead.

In this post, I’ll show you how to create a partial copy of your production database so you and your team can start developing on Neon while leaving production where it is.

## What is a Neon Twin?

A [Neon Twin](https://neon.tech/docs/guides/neon-twin-intro) is a copy of your production database, free from the cumbersome, hard-to-manage, and expensive workflows. With a Neon Twin, you can instantly spin up a new branch, develop features, or track down bugs, all from the safety of an isolated environment using production data. Any changes made to a Twin would be migrated back to your production database using your existing workflow or pipeline.

## How to create a Neon Twin

In the code below, I’ll show you how to create a scheduled, recurring GitHub Action that performs a partial data dump of a production (or staging) Postgres database and restore it to a Neon Serverless Postgres instance.

### Creating a GitHub Action

At the root of your project, create a new directory named `.github`. Within this directory, create another directory named `workflows`, and within this directory, create a new file named `create-neon-twin.yml` e.g.

```
.github
  |-- workflows
    |-- create-neon-twin.yml
```

Now add the following code.

```yaml
name: Create Neon Twin

on:
  schedule:
    - cron: '0 0 * * *' # Runs at midnight ET (us-east-1)
  workflow_dispatch:

env:
  PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }} # Production or primary database
  DEV_DATABASE_URL: ${{ secrets.DEV_DATABASE_URL }} # Development database
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
          $POSTGRES/pg_dump -Fc --schema-only -f "${{ github.workspace }}/all-schema.bak" "${{ env.PROD_DATABASE_URL }}"

      - name: Dump data
        run: |
          $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM users ORDER BY user_id DESC LIMIT 50) TO '${{ github.workspace }}/users-subset.csv' WITH CSV HEADER"

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
```

### The GitHub Action Explained

At the top of the file is the `name` of the Action (Create Neon Twin), which will be displayed in the GitHub UI.

Below is the `cron` schedule. It is written using [POSIX cron syntax](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07) and is set to run each night at midnight (Eastern Time).<br />Below that is `workflow_dispatch`, this allows you to trigger the workflow manually from the GitHub UI (useful when developing/testing this Action)

#### Environment Variables

There are three environment variables, the first two will be securely stored as GitHub secrets:

1. `PROD_DATABASE_URL`: The Postgres connection string for your production or staging database.
2. `DEV_DATABASE_URL`: The Postgres connection string for your Neon database. If you don’t have a Neon account, [sign up here](https://console.neon.tech/signup) and follow our [getting started guide](https://neon.tech/docs/get-started-with-neon/signing-up).
3. `PG_VERSION`: The Postgres version is to be installed in the Action environment. It should be compatible with both your production and Neon Twin databases.

You’ll also need to add the values from steps 1 and 2 as GitHub repository secrets—I’ll cover that later.

#### Install PostgreSQL

This job installs the specified Postgres version using Apt (Advanced Packaging Tool) on the Ubuntu environment in GitHub Actions. While there are other ways to install Postgres available in the [GitHub Marketplace](https://github.com/marketplace?query=Postgres), I personally recommend using Apt for added security.<br />_GitHub Action runners come with a_ [built-in version of Postgres](https://github.com/actions/runner-images?tab=readme-ov-file#package-managers-usage)_, which would remove the need to manually install the package, but as of now, you can’t control which version of Postgres is installed. If you’d like to follow the progress, I’ve opened an issue here:_ [Update/Add Postgres Version option #11531](https://github.com/actions/runner-images/issues/11531)

#### Set PostgreSQL binary path

This step stores the installed Postgres binary path as a GitHub Action environment variable named `POSTGRES`. You’ll notice that it’s referenced in all the following steps, using, e.g., `$POSTGRES/psql`.

#### Dump schema

This step uses `pg_dump` to export all the schema from the production database into a file named `all-schema.bak`, which is temporarily stored in the GitHub Actions workspace.

| Flag         | Meaning                                                                          |
| ------------ | -------------------------------------------------------------------------------- |
| -Fc          | Dumps the database in a custom format.                                           |
| –schema-only | Dumps only the schema (table structures, indexes, constraints) without any data. |
| -f           | Specifies the output file where the schema dump will be stored.                  |

#### Dump data

This step uses `psql` to query the production database. In my example, I’m querying the `users` table and limiting the response to `50`. The result of this query is saved in a file named `users-subset.csv`, which is also temporarily stored in the GitHub Actions workspace.

#### Drop tables and schema

This step uses `psql` to ensure a fully clean database state before restoring data. It’ll prevents conflicts with existing tables, sequences, and constraints and avoids errors where `pg_restore` tries to create objects that already exist.

| Step                                  | Effect                                                   |
| ------------------------------------- | -------------------------------------------------------- |
| DROP SCHEMA IF EXISTS public CASCADE; | Removes the public schema and everything inside it.      |
| CREATE SCHEMA public;                 | Recreates the public schema for a clean restore process. |

#### Restore schema

This step uses `pg_restore` to restore the database schema from the `all-schema.bak` backup file.

| Flag         | Meaning                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| –clean       | Drops existing database objects before recreating them, ensuring a clean restore.                              |
| –no-owner    | Ignores ownership information in the dump file, so restored objects are owned by the user running the restore. |
| –no-acl      | Excludes access control (GRANT/REVOKE) statements from the restore, preventing permission changes.             |
| –if-exits    | Ensures that DROP commands (used with –clean) only execute if the object exists, preventing errors.            |
| –schema-only | Restores only the schema (table structures, indexes, constraints) without inserting any data.                  |
| -d           | Specifies the target database to restore into.                                                                 |

#### Restore data

And lastly, this step uses `psql` to restore the data to the `public.users` table from the `users-subset.csv` file.

## Dump from multiple tables

You can dump and restore as many or as few rows/tables as needed to create an accurate copy of the production database. The closer it mirrors production, the better for testing and development. Just ensure that any foreign key constraints remain intact within the selected data.

For example, my test database includes two additional tables: **products** and **transactions**. The transactions table references both `product_id` from the products table and `user_id` from the users table.

If I want to dump a subset of transactions, I must also include a corresponding subset of products while ensuring that all `product_id` and `user_id` values referenced in transactions are present in the dumped data. This guarantees that the restored dataset maintains valid foreign key relationships.<br />Following on from the above example, i’ve modified two of the steps; **Dump data** and **Restore data**.

### Modified Dump data

In this modified step, I first select 50 products and store them in a subset. When extracting data from the `transactions` table, I ensure that only transactions referencing product_ids from this `product` table subset are included. Similarly, when dumping user data, I filter for user_ids that exist in the transactions subset, ensuring that only users associated with the selected products and transactions are included.

```yaml
     - name: Dump data
        run: |
          $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM products ORDER BY product_id DESC LIMIT 50) TO '${{ github.workspace }}/products-subset.csv' WITH CSV HEADER"

          $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM transactions WHERE product_id IN (SELECT product_id FROM products ORDER BY product_id DESC LIMIT 50)) TO '${{ github.workspace }}/transactions-subset.csv' WITH CSV HEADER"

          $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM users WHERE user_id IN (SELECT user_id FROM transactions WHERE product_id IN (SELECT product_id FROM products ORDER BY product_id DESC LIMIT 50))) TO '${{ github.workspace }}/users-subset.csv' WITH CSV HEADER"
```

### Modified Restore data

Now that i’m confident the correct data has been extracted into the CSV files, I can now restore it while maintaining the correct order. Users are restored first, ensuring that `user_id` values exist before inserting transactions. Products follow next, so `product_id` references are established. Finally, transactions are restored last, ensuring all foreign key dependencies are met.

```yaml
     - name: Restore data
        run: |
          $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.users FROM '${{ github.workspace }}/users-subset.csv' WITH CSV HEADER"
          $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.products FROM '${{ github.workspace }}/products-subset.csv' WITH CSV HEADER"
          $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.transactions FROM '${{ github.workspace }}/transactions-subset.csv' WITH CSV HEADER"
```

## Adding connection strings as GitHub Secrets

There are two environment variables used in the Action: one for the production database and the other for the Neon Twin. Both must be added as Repository Secrets in GitHub to give the Action access to them.<br />

In the GitHub UI, navigate to **Settings** > **Secrets and variables** > **Actions**, then add both variables as **Repository secrets**.

![Adding connection strings as GitHub Secrets](https://cdn.neonapi.io/public/images/pages/blog/automate-partial-data-dumps-with-postgresql-and-github-actions/post-images-githb-secrets-1024x640-eac6acaf.jpg)

## Issues with production data

Dumping production data into development environments can raise potential concerns, especially regarding Personally Identifiable Information (PII).

However, sensitive information is often confined to specific tables and columns. Partial data dumps can potentially avoid these issues and ensure that only safe-to-use data is included. That said, data privacy remains an important consideration. [We’ve been actively working on a new solution](https://neon.tech/docs/introduction/roadmap#what-were-working-on-now) that enables the anonymization of sensitive data whenever a branch is created, addressing these privacy concerns more effectively.

## Conclusion

With a [Neon Twin](https://neon.tech/docs/guides/neon-twin-intro), you can create isolated environments that mirror staging or production for safe development and testing. And our plans to help you anonymize sensitive data will further secure your workflow, making your testing more effective. Happy coding!!
