---
title: Postgres Event Triggers Are Now Supported in Neon
description: 'Track schema changes, automate workflows, and unlock sync engines like Zero'
excerpt: >-
  Postgres event triggers are a powerful (although often overlooked) feature.
  Regular Postgres triggers respond to row-level changes in a table, but event
  triggers fire on DDL commands like CREATE, ALTER, and DROP – allowing you to
  track schema changes, enforcing rules, and automat...
date: '2025-07-03T15:25:22'
updatedOn: '2025-10-17T16:56:47'
category: product
categories:
  - product
  - company
  - workflows
authors:
  - ben-hagan
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-event-triggers/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Postgres Event Triggers Are Now Supported in Neon - Neon
  description: >-
    Neon now supports Postgres Event Triggers via the neon_superuser role. This
    unlocks schema change detection, automation, and sync engines.
  keywords: []
  noindex: false
  ogTitle: Postgres Event Triggers Are Now Supported in Neon - Neon
  ogDescription: >-
    Neon now supports Postgres Event Triggers via the neon_superuser role. This
    unlocks schema change detection, automation, and sync engines.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-event-triggers/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-event-triggers/neon-track-schema-1024x576-3880c888.jpg)

<Admonition type="info" title="just shipped">
Neon now supports [Postgres Event Triggers](https://neon.com/postgresql/postgresql-triggers/postgresql-event-trigger) via the [neon_superuser](https://neon.com/docs/manage/roles#the-neonsuperuser-role) role. This unlocks many use cases around schema change detection, automation, and unlock sync engines like Zero. Event triggers in Neon work exactly as they do in vanilla Postgres.
</Admonition>

Postgres event triggers are a powerful (although often overlooked) feature. Regular Postgres triggers respond to row-level changes in a table, but event triggers fire on DDL commands like `CREATE`, `ALTER`, and `DROP` – allowing you to track schema changes, enforcing rules, and automating workflows that depend on database structure, not data.

[We now support event triggers in Neon](https://neon.com/docs/changelog/2025-06-27#support-for-postgres-event-triggers). Here’s some inspiration on things you can build with them.

## Track schema changes in real time

If you’d like to know when someone from your team adds a table, drops a column, or modifies an index, event triggers give you a built-in mechanism to monitor and log these changes. You would simply set up an event trigger on `ddl_command_end`, and route key context (user, command, object) to an audit_ddl table or an external log system.

```sql
CREATE EVENT TRIGGER log_ddl_changes
  ON ddl_command_end
  EXECUTE FUNCTION log_to_audit_table();
```

## Automate what happens when your schema changes

Schema changes come with maintenance (tagging new tables, generating access policies, syncing metadata). With event triggers, you can build those actions directly into your database workflow. You would use `ddl_command_end` to listen for `CREATE`, `ALTER`, or `DROP` events, and in your trigger function, inspect the command and respond accordingly – e.g. inserting rows into a metadata table, sending a Slack alert, or calling an API.

```sql
IF TG_TAG = 'CREATE TABLE' THEN
  INSERT INTO table_catalog (...) VALUES (...);
END IF;
```

## Power sync engines like Zero

Platforms like [Zero](https://zero.rocicorp.dev/) rely on tracking schema changes to keep local and remote databases in sync, using event triggers to react instantly when things change. If you’re using Zero together with Neon,

- Create an event trigger on `ddl_command_end` to listen for schema changes
- Use the `pg_event_trigger_ddl_commands()` function inside your trigger to extract information about what changed
- Forward that data to Zero via a webhook or messaging queue so it can update its local model accordingly

## Set up production guardrails

It’s much better if schema changes in production are not a `DROP TABLE` away. Event triggers let you enforce rules on your production database, e.g. restricting destructive commands to specific roles or blocking all DDL operations during deploy windows.

This example code defines an event trigger function that inspects every DDL command before it runs. If the current user is not ‘`admin'` and tries to execute a `DROP TABLE`, the function raises an exception and blocks the command from executing:

```sql
CREATE OR REPLACE FUNCTION prevent_dangerous_ddl()
RETURNS event_trigger AS $$
DECLARE
  cmd RECORD;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands() LOOP
    IF current_user != 'admin' AND cmd.command_tag = 'DROP TABLE' THEN
      RAISE EXCEPTION 'DROP TABLE not allowed for non-admins in production';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE EVENT TRIGGER enforce_guardrails
  ON ddl_command_start
  EXECUTE FUNCTION prevent_dangerous_ddl();
```

## Clean up pg_cron jobs automatically

If you’re using `pg_cron`, dropping a table doesn’t clean up its jobs, which can lead to recurring errors like `relation does not exist` every time the job tries to run. Event triggers give you a chance to catch the drop and clean up in the same transaction.

To do this, create an event trigger on `sql_drop`. Inside the trigger function, use `pg_event_trigger_dropped_objects()` to inspect what was removed. If any of the dropped objects are tied to active cron jobs, you can delete the corresponding entries from `cron.job`. This keeps your scheduled tasks aligned with your schema and prevents old jobs from cluttering up your database.

```sql
DELETE FROM cron.job WHERE target_table = dropped_table_name;
```

## Get started

Event triggers open up a new layer of control in Neon. If you’ve been blocked by the lack of event triggers in other managed Postgres platforms, [give Neon a try](https://console.neon.tech/signup). Event trigger support is available by default through the neon_superuser role in any branch.

Check out the [docs on event triggers](https://www.postgresql.org/docs/current/event-triggers.html) for more. And if you have questions, [find us on Discord](https://discord.gg/92vNTzKDGp).
