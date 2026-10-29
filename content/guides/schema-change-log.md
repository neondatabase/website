---
title: Track schema changes in production with Postgres event triggers
subtitle: Log every schema change with metadata in your Neon database
author: sam-harri
enableTableOfContents: true
createdAt: '2025-07-15T00:00:00.000Z'
---

Lakebase Postgres supports event triggers, which run automatically in response to DDL events like `CREATE`, `ALTER`, `DROP`, or any other statement that defines or modifies the structure of the database. On Neon, roles with `neon_superuser` privileges (roles created in the Console, CLI, or API) can create event triggers. See [Manage roles](/docs/manage/roles). In this guide, you'll use event triggers to build a schema audit trail that records who changed the schema of your production database, what changed, and when.

## Set up schema auditing in Postgres

### Set up the audit schema and tables

First, we need two tables to store the audit log. To keep our auditing mechanism separate from the main application schema and to simplify permissions later, we'll place it in its own `audit` schema. One table stores each transaction that contains DDL changes, along with its metadata. The other stores each DDL change and references the transaction it was part of.

```sql
CREATE SCHEMA IF NOT EXISTS audit;

CREATE TABLE audit.transaction_audit (
  transaction_id         BIGINT PRIMARY KEY,
  event_time             TIMESTAMPTZ NOT NULL DEFAULT now(),
  database_user          TEXT NOT NULL,
  application_user_name  TEXT,
  application_user_email TEXT,
  client_address         INET
);

CREATE TABLE audit.ddl_audit (
  id              BIGSERIAL PRIMARY KEY,
  transaction_id  BIGINT NOT NULL
    REFERENCES audit.transaction_audit(transaction_id)
    ON DELETE CASCADE,
  command_tag     TEXT NOT NULL,
  object_identity TEXT,
  query_text      TEXT NOT NULL
);
```

### Create the event trigger function

In Postgres, event triggers are executed using functions, so we need to create a function that returns the `event_trigger` type. This function will create the transaction entry if it does not already exist, then insert the DDL record. Because each DDL change in a transaction fires the trigger, the function handles the case where the transaction has already been logged.

The `usr_name` and `usr_email` values come from the connection's context using `current_setting()`. The CI section below shows how they're set.

```sql
CREATE OR REPLACE FUNCTION audit.log_schema_changes()
  RETURNS event_trigger
  LANGUAGE plpgsql
AS $$
DECLARE
  obj       record;
  tx        BIGINT := txid_current_if_assigned();
  usr_name  TEXT := current_setting('audit.user_name', true);
  usr_email TEXT := current_setting('audit.user_email', true);
BEGIN
  INSERT INTO audit.transaction_audit (
    transaction_id,
    database_user,
    application_user_name,
    application_user_email,
    client_address
  ) VALUES (
    tx,
    session_user,
    usr_name,
    usr_email,
    inet_client_addr()
  )
  ON CONFLICT (transaction_id) DO NOTHING;

  FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() LOOP
    INSERT INTO audit.ddl_audit (
      transaction_id,
      command_tag,
      object_identity,
      query_text
    ) VALUES (
      tx,
      obj.command_tag,
      obj.object_identity,
      current_query()
    );
  END LOOP;
END;
$$;
```

### Attach the trigger to DDL events

Now, we can attach this function to an event trigger, and have it run after the DDL commands complete.

```sql
CREATE EVENT TRIGGER track_schema_changes
  ON ddl_command_end
  EXECUTE FUNCTION audit.log_schema_changes();
```

## Integrate audit logging in production workflows

In a production environment, you would rarely apply database migrations manually. Changes usually go through a CI pipeline, which requires passing a test suite, a staging environment, and review before they can be merged.

### Create a CI-only role

Here, we'll create a dedicated `ci_user` role to run migrations in GitHub Actions. We'll grant this role the minimum permissions necessary, which includes creating objects in the public and audit schemas, referencing users in the `neon_auth` schema (if you use auth in your project), and inserting records into the log table. This also makes it easy to spot any manual changes made outside of the CI process, since the `database_user` would be something other than `ci_user`, and the application user fields would be empty.

The `neon_auth.users_sync` grant below applies to legacy Neon Auth. With Managed Better Auth, users are stored in the `neon_auth.user` table, so grant on that table instead. Skip both lines if you don't use auth.

```sql
CREATE ROLE ci_user WITH LOGIN PASSWORD '<some-strong-password>';

GRANT CREATE ON DATABASE neondb TO ci_user;
GRANT USAGE, CREATE ON SCHEMA public TO ci_user;
GRANT USAGE ON SCHEMA neon_auth TO ci_user;
GRANT REFERENCES, SELECT ON TABLE neon_auth.users_sync TO ci_user;
GRANT USAGE, CREATE ON SCHEMA audit TO ci_user;
GRANT INSERT, SELECT ON ALL TABLES IN SCHEMA audit TO ci_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA audit TO ci_user;
```

### Configure GitHub Actions

Then, in a `.github/workflows/migrate.yml` file we can define the steps to apply the migration in the pipeline. Add the `DATABASE_URL` secret in the GitHub repo's **Secrets and variables** settings. Use the direct (unpooled) connection string, without `-pooler` in the hostname. PgBouncer rejects unsupported startup parameters like the ones `PGOPTIONS` sets below, and runs in transaction mode, which some migration tools don't support. See [Connection pooling](/docs/connect/connection-pooling).

```yaml
name: Migrate Database

on:
  push:
    branches:
      - master

jobs:
  migrate:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}

    steps:
      - name: Check out code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Set PGOPTIONS for audit
        run: |
          echo "PGOPTIONS=-c audit.user_name=${{ github.event.head_commit.author.name }} -c audit.user_email=${{ github.event.head_commit.author.email }}" >> $GITHUB_ENV

      - name: Run Drizzle migrations
        run: npx drizzle-kit migrate
```

The key part of this workflow is the `PGOPTIONS` environment variable, which sets connection parameters and passes context from GitHub Actions to the database. Here, we use it to pass `audit.user_name` and `audit.user_email`, and supply information on who the last committer was.

In practice, a production migration often spans multiple commits from different authors, merged by a reviewer. You can extend the audit log to record all of them.

## Visualize the audit log with read-only access

Once audit data is collected, you'll want a way to view it. You can build a small internal UI to display the audit entries. Because the audit data lives in your production database, create a read-only role that only has access to the `audit` schema, so the tool can't read the rest of the database.

```sql
CREATE ROLE audit_reader WITH LOGIN PASSWORD '<some-strong-password>';
REVOKE ALL ON SCHEMA public FROM audit_reader;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM audit_reader;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM audit_reader;
GRANT USAGE ON SCHEMA audit TO audit_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA audit TO audit_reader;
```

The dashboard shows who made which changes, and when. DDL statements are grouped by transaction, and you can search for keywords in the raw SQL.

![Audit log dashboard](/guides/images/schema-change-log/audit_log_frontend.gif)
