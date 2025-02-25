---
title: Partial Twin
subtitle: Create a partial Twin of your production database
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-11T18:04:21.935Z'
---

This workflow will create a partial Neon Twin using `pg_dump`, `pg_restore` and `psql`.

<Admonition type="note">
To use this workflow, you'll need the Postgres connection string for your Neon database. Follow our [Getting Started Guide](/docs/get-started-with-neon/signing-up#sign-up) to learn how.
</Admonition>

## Create the workflow

To create the Twin workflow in any GitHub-hosted repository:

1. Create a new directory named `.github` at the root of your project.
2. Inside this directory, create another directory named `workflows`.
3. Within the `workflows` directory, create a new file named `create-neon-twin.yml`.

```
.github
  |-- workflows
      |-- create-neon-twin.yml
```

Add the following code to `create-neon-twin.yml`.

```yml
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

## GitHub Action explained

Below is an explanation of each part of the GitHub Action.

### on

- `name`: The name of the Action as it appears in the GitHub UI.
- `cron`: The [POSIX cron syntax](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07) that defines when the Action will run.
- `workflow_dispatch`: Enables manual triggering through the GitHub UI.

### env

- `PROD_DATABASE_URL`: The PostgreSQL connection string for your production database.
- `DEV_DATABASE_URL`: The PostgreSQL connection string for your Neon database.
- `PG_VERSION`: The version of PostgreSQL to install in the Action environment.

### steps

- `Install PostgreSQL`: Installs the specified version of PostgreSQL into the Action environment from the [Apt](https://wiki.debian.org/Apt) repository.
- `Set PostgreSQL binary path`: Creates `$POSTGRES` variable for use in subsequent steps.
- `Dump schema`: Exports the database schema (table structures, indexes, constraints) from the production database into a backup file.
- `Dump data`: Extracts a subset of data (50 most recent users) from the production database into a CSV file.
- `Drop tables and schema`: Completely removes the existing schema in the development database and recreates it to ensure a clean state.
- `Restore schema` : Imports the previously dumped schema into the development database, re-creating table structures and constraints.
- `Restore data` : Loads the extracted data subset from the CSV file into the corresponding table in the development database.

### pg_dump flags

The table below provides an explanation of each flag used by `pg_dump`.

| Flag          | Meaning                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| -FC           | Dumps the database in a custom format.                                           |
| --schema-only | Dumps only the schema (table structures, indexes, constraints) without any data. |
| -f            | Specifies the output file where the schema dump will be stored.                  |

### psql flags

The table below provides an explanation of each flag used by `pg_dump`.

| Flag | Meaning                                    |
| ---- | ------------------------------------------ |
| -c   | Executes a single command and then exits.  |
| -d   | Specifies the database name to connect to. |

### pg_restore flags

The table below provides an explanation of each flag used by `pg_restore`.

| Flag          | Meaning                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| --clean       | Drops existing database objects before recreating them, ensuring a clean restore.                              |
| --no-owner    | Ignores ownership information in the dump file, so restored objects are owned by the user running the restore. |
| --no-acl      | Excludes access control (GRANT/REVOKE) statements from the restore, preventing permission changes.             |
| --if-exists   | Ensures that `DROP` commands (used with `--clean`) only execute if the object exists, preventing errors.       |
| --schema-only | Restores only the schema (table structures, indexes, constraints) without inserting any data.                  |
| -d            | Specifies the target database to restore into.                                                                 |

## Working with multiple tables

The action above works well for dumping data from a single table. However, when working with multiple tables that have foreign key relationships, it's important to ensure that those relationships remain intact.

For example, if you're dumping a subset of data from a transactions table that references a `product_id` from the products table and a `user_id` from the users table, you must also query the corresponding products and users data.

This ensures that all referenced `product_id` and `user_id` values exist in the restored dataset, maintaining valid foreign key constraints.

To account for this, you may need to adjust the **Dump data** and **Restore data** steps accordingly.

For example, here is an amended example for the **Dump data** step.

```yml
- name: Dump data
    run: |
        $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM products ORDER BY product_id DESC LIMIT 50) TO '${{ github.workspace }}/products-subset.csv' WITH CSV HEADER"
        $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM transactions WHERE product_id IN (SELECT product_id FROM products ORDER BY product_id DESC LIMIT 10)) TO '${{ github.workspace }}/transactions-subset.csv' WITH CSV HEADER"
        $POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -c "\copy (SELECT * FROM users WHERE user_id IN (SELECT user_id FROM transactions WHERE product_id IN (SELECT product_id FROM products ORDER BY product_id DESC LIMIT 50))) TO '${{ github.workspace }}/users-subset.csv' WITH CSV HEADER"
```

And here is an example for the amended **Restore data** step.

```yml
- name: Restore data
    run: |
        $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.users FROM '${{ github.workspace }}/users-subset.csv' WITH CSV HEADER"
        $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.products FROM '${{ github.workspace }}/products-subset.csv' WITH CSV HEADER"
        $POSTGRES/psql "${{ env.DEV_DATABASE_URL }}" -c "\copy public.transactions FROM '${{ github.workspace }}/transactions-subset.csv' WITH CSV HEADER"
```

## Setting repository secrets

Before running the Action, ensure that both `PROD_DATABASE_URL` and `DEV_DATABASE_URL` are added to your GitHub repository secrets.

In your repository, go to **Settings** > **Secrets and variables** > **Actions** to add them.

![github repository secrects](/docs/guides/twin_diagram_github_secrets.png)

## Testing the workflow

To manually trigger your workflow go to **Actions** > **Create Neon Twin** then click **Run workflow**. From the dropdown, click the **Run workflow** button.

![github actions run workflow](/docs/guides/twin_diagram_test_workflow.png)

## Syncing with migration changes

The GitHub Action runs on a recurring schedule, but you may also want it to trigger when migration changes are applied and a Pull Request is merged. To enable this, update the Action with the following code:

### Handling Pull Request Events

Add a `pull_request` event and configure it to listen for merges into the main `branch`.

```diff

on:
  schedule:
    - cron: '0 0 * * *' # Runs at midnight ET (us-east-1)
  pull_request: // [!code ++]
    types: [closed] // [!code ++]
    branches: // [!code ++]
      - main // [!code ++]
  workflow_dispatch:

```

### Add Concurrency and Conditions

To prevent conflicts between scheduled runs and runs triggered by a Pull Request, set `cancel-in-progress` to `true` under `concurrency`. Additionally, add an `if` statement to ensure the job only executes when specific conditions are met.

```diff

jobs:
  dump-and-restore:
    runs-on: ubuntu-latest
    concurrency: // [!code ++]
      group: 'dump-and-restore' // [!code ++]
      cancel-in-progress: true // [!code ++]
    if: | // [!code ++]
      github.event_name == 'schedule' || github.event_name == 'workflow_dispatch' || (github.event_name == 'pull_request' && github.event.pull_request.merged == true) // [!code ++]

```

## Limitations

Be aware of [usage limits](https://docs.github.com/en/actions/administering-github-actions/usage-limits-billing-and-administration#usage-limits): Each GitHub Action job can run for up to 6 hours. If a job exceeds this limit, it will be terminated and fail to complete. If your dump/restore process takes longer, consider using [self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#about-self-hosted-runners).

## Further reading

- [Automate Partial Data Dumps with PostgreSQL and GitHub Actions](https://neon.tech/blog/automate-partial-data-dumps-with-postgresql-and-github-actions)
- [Neon Twin: How to deploy a change tested in Neon to prod in RDS](https://neon.tech/blog/neon-twin-deploy-workflow)
