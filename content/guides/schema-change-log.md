---
title: Track Schema Changes in Production with Postgres Event Triggers
subtitle: Log every schema change with metadata in your Neon database
author: sam-harri
enableTableOfContents: true
createdAt: '2025-07-15T00:00:00.000Z'
---

Event triggers are now fully supported in Neon Postgres databases, and allow you to automatically respond to DDL events like `CREATE`, `ALTER`, `DROP`, or any other statements that define or modify the structure of the database. In this post, we'll show how you can use this feature to build a simple schema audit trail that can record who made schema changes in your production database, what those changes were, and when they occurred.

## Set Up Schema Auditing in Postgres

### Set Up the Audit Schema and Tables

First, we need two tables to store the audit log. To keep our auditing mechanism separate from the main application schema and to simplify permissions later, we'll place it in its own `audit` schema. Here, we have one table for the transactions containing the DDL changes, along with their metadata, then another table for all the DDL changes which reference the transaction they were a part of.

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

### Create the Event Trigger Function

In Postgres, event triggers are executed using functions, so we need to create a function that returns the `event_trigger` type. This function will create the transaction entry if it does not already exist, then insert the DDL record. Given each DDL change within the same transaction will fire the trigger, we handle the case where the transaction has already been logged.

The `usr_name` and `usr_email` values are taken from the connection's context using `current_setting()`, though more on these later.

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

### Attach the Trigger to DDL Events

Now, we can attach this function to an event trigger, and have it run after the DDL commands complete.

```sql
CREATE EVENT TRIGGER track_schema_changes
  ON ddl_command_end
  EXECUTE FUNCTION audit.log_schema_changes();
```

## Integrate Audit Logging in Production Workflows

In a production environment, you would rarely apply database migrations manually. Changes would instead be managed through a CI pipeline, which typically require passing a test suite, a staging environment, and review before being able to be merged.

### Create a CI-Only Role

Here, we'll create a dedicated `ci_user` role to run migrations in GitHub Actions. We'll grant this role the minimum permissions necessary, which includes creating objects in the public and audit schemas, referencing users in the Neon Auth schema (if you’re using auth for your project), and inserting records into the log table. This also makes it easy to spot any manual changes made outside of the CI process, since the `database_user` would be something other than `ci_user`, and the application user fields would be empty.

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

Then, in a `.github/workflows/migrate.yml` file we can define the steps to apply the migration in the pipeline. Likewise, we need to add the `DATABASE_URL` environment variable in the GitHub repo’s Secrets and Variables section.

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

The key part of this workflow is setting the `PGOPTIONS` environment variable which allows us to set connection parameters and easily pass context from GitHub Actions to our database. Here, we use it to pass `audit.user_name` and `audit.user_email`, and supply information on who the last committer was.

Realistically, schema migrations in production often involve multiple commits, possibly from different authors, and merged by reviewers. Ideally, your audit log should include information about all of these, though this can easily be added based on your needs.

## Visualize the Audit Log Safely with Read-Only Access

Once audit data is collected, you'll want a straightforward way to visualize it. Using the Neon internal tool template seen in a previous blog post, you can quickly build, secure, and host a UI to display these audit entries. Though, given the audit data lives in our production database, it’s a good idea to create a new read-only role that only has access to the `audit` schema to avoid exposing the entire production database to this tool.

```sql
CREATE ROLE audit_reader WITH LOGIN PASSWORD '<some-strong-password>';
REVOKE ALL ON SCHEMA public FROM audit_reader;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM audit_reader;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM audit_reader;
GRANT USAGE ON SCHEMA audit TO audit_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA audit TO audit_reader;
```

From this dashboard, we now have a clear view of who made what changes, and when. DDLs are grouped by transaction, and you can easily search for keywords in the raw SQL.

![Audit log dashboard](/guides/images/schema-change-log/audit_log_frontend.gif)
