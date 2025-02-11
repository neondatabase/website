---
title: Full Twin
subtitle: Create a full Twin of your production database
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-06T19:39:12.345Z'
---

This workflow will create a full Neon Twin using `pg_dump` and `pg_restore`.

<Admonition type="note">
To use this workflow, you'll need the PostgreSQL connection string for your Neon database. Follow our [Getting Started Guide](/docs/get-started-with-neon/signing-up#sign-up) to learn how.
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

      - name: Dump and restore data
        run: |
          $POSTGRES/pg_dump -Fc -f "${{ github.workspace }}/dump-file.bak" "${{ env.PROD_DATABASE_URL }}"
          $POSTGRES/pg_restore --clean --no-owner --no-acl --if-exists -d "${{ env.DEV_DATABASE_URL }}" "${{ github.workspace }}/dump-file.bak"
```

## Action explained

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
- `Dump and restore data`: Uses `pg_dump` to create a `dump-file.bak` and `pg_restore` to read the `dump-file.bak` and apply it to the `DEV_DATABASE_URL`.

### pg_dump flags

The table below provides an explanation of each flag used by `pg_dump`.

| Flag | Meaning                                                         |
| ---- | --------------------------------------------------------------- |
| -FC  | Dumps the database in a custom format.                          |
| -f   | Specifies the output file where the schema dump will be stored. |

### pg_restore flags

The table below provides an explanation of each flag used by `pg_restore`.

| Flag        | Meaning                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| --clean     | Drops existing database objects before recreating them, ensuring a clean restore.                              |
| --no-owner  | Ignores ownership information in the dump file, so restored objects are owned by the user running the restore. |
| --no-acl    | Excludes access control (GRANT/REVOKE) statements from the restore, preventing permission changes.             |
| --if-exists | Ensures that `DROP` commands (used with `--clean`) only execute if the object exists, preventing errors.       |
| -d          | Specifies the target database to restore into.                                                                 |

## Repository secrets

Before running the Action, ensure that both `PROD_DATABASE_URL` and `DEV_DATABASE_URL` are added to your GitHub repository secrets.

In your repository, go to **Settings** > **Secrets and variables** > **Actions** to add them.

![github repository secrects](/docs/guides/twin_diagram_github_secrets.png)

## Test the workflow

To manually trigger your workflow go to **Actions** > **Create Neon Twin** then click **Run workflow**. From the dropdown, click the **Run workflow** button.

![github actions run workflow](/docs/guides/twin_diagram_test_workflow.png)

## Further Reading

- [Neon Twin: Move Dev/Test/Staging to Neon, Keep Production on RDS](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon)
- [Neon Twin: How to deploy a change tested in Neon to prod in RDS](https://neon.tech/blog/neon-twin-deploy-workflow)
