---
title: How to fix missing table errors in pg_cron
description: Prevent pg_cron job failures with event triggers
excerpt: >-
  “Timing is everything.” Some say that’s a quote from Shakespeare, but imho,
  the true bards of time are the 52 contributors to the pg_cron extension. The
  concept being pg_cron is simple: run scheduled jobs directly within Postgres
  using familiar cron syntax. The simplicity belies...
date: '2025-07-14T16:37:35'
updatedOn: '2025-10-06T16:08:16'
category: postgres
categories:
  - postgres
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-fix-missing-table-errors-in-pg_cron/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How to fix missing table errors in pg_cron - Neon
  description: >-
    Fix “relation does not exist” errors in pg_cron with Postgres event
    triggers, a simple way to keep jobs in sync with schema changes.
  keywords: []
  noindex: false
  ogTitle: How to fix missing table errors in pg_cron - Neon
  ogDescription: >-
    Fix “relation does not exist” errors in pg_cron with Postgres event
    triggers, a simple way to keep jobs in sync with schema changes.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-fix-missing-table-errors-in-pg_cron/social.png
source:
  wpId: 10333
  wpSlug: how-to-fix-missing-table-errors-in-pg_cron
  exportedAt: '2026-03-20T13:31:00.745Z'
---

“Timing is everything.”

Some say that’s a quote from Shakespeare, but imho, the true bards of time are the 52 contributors to the [pg_cron](https://github.com/citusdata/pg_cron) extension.

The concept being pg_cron is simple: run scheduled jobs directly within Postgres using familiar cron syntax. The simplicity belies the power, though. With pg_cron, you can schedule database maintenance, automate data transformations, trigger notifications, clean up old records, and orchestrate complex workflows, all without leaving the comfort of your database.

Here, we want to go through some of the aspects of pg_cron, but from a more interesting perspective: when crons go wrong!

<Admonition type="info">
pg_cron, developed by Citus Data, is supported on Neon. [See the docs](https://neon.com/docs/extensions/pg_cron) for usage recommendations.
</Admonition>

## The functionality of pg_cron

At its core, pg_cron leverages Postgres’ background worker infrastructure to execute scheduled tasks. When you [install the extension](https://neon.com/docs/extensions/pg_cron#enable-the-pgcron-extension), it creates a background worker process that wakes up every minute to check the cron.job table for jobs that need to run. Each job definition includes:

- A [cron expression](https://neon.com/docs/extensions/pg_cron#cron-schedule-syntax) (e.g., ‘0 3 \* \* \*’ for daily at 3 AM)
- The target database
- The SQL command to execute
- Optional parameters like username and active status
-

When a job is due, pg_cron spawns a new database connection using libpq, authenticates as the specified user, and executes the command. Job execution history is logged to `cron.job_run_details`, including start time, end time, status, and any error messages.

The extension handles multiple concurrent jobs through Postgres’ connection pooling, but each job runs in its own transaction context. This isolation is crucial. If one job fails or runs long, it won’t block others. However, this architecture also introduces some subtle failure modes.

For instance, pg_cron jobs run with statement_timeout set to 0 by default, meaning they can run indefinitely unless you explicitly set timeouts. Jobs also inherit the search_path of the database they connect to, which can lead to unexpected `relation does not exist` errors if your scheduled SQL assumes a different schema context than what is set.

## Reproducing the ‘relation does not exist’ error

Let’s break pg_cron on purpose and watch it fail to help us learn more about how it works. Here’s how you can trigger a “missing table error” in just a few SQL commands.

First, we’ll create a new table and corresponding cron job that inserts data every minute:

```sql
-- Create a table and schedule a job that inserts into it every minute
CREATE TABLE metrics_daily(id serial PRIMARY KEY, ts timestamptz DEFAULT now());
SELECT cron.schedule('minutely_metrics', '* * * * *',
                     $$ INSERT INTO metrics_daily DEFAULT VALUES; $$);

-- Wait a minute, then check what happened
SELECT jobid, status, return_message
  FROM cron.job_run_details
 ORDER BY end_time DESC
 LIMIT 3;
```

We can see that we have a successful job running with pg_cron:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-fix-missing-table-errors-in-pg_cron/ad4nxchwjnj9e5ko7kih5rb7h-7ij4eaiefsareg9sfckxyoll8pcbwm6ijetsj9ui6z4454kacxty5jek2bkvrnb7db5hzlvqfmithgr4mubkhyqndq0r2gdrbxuqb7c41po3gnqwwa-ede8132c.png)

Now, let’s drop our table and see what happens:

```sql
-- Now drop the table (simulating a schema change or cleanup)
DROP TABLE metrics_daily;

-- Wait a minute, then check what happened
SELECT jobid, status, return_message
  FROM cron.job_run_details
 ORDER BY end_time DESC
 LIMIT 3;
```

You’ll see something like this in the results:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-fix-missing-table-errors-in-pg_cron/ad4nxcs55vboc9f36m0ycejjiqi04m-1ntabkypw1vb4b9dwpuqt3ofqnflb70jm3njk2v3ywe3p8djdxvyukvoyg5f2wup-ijhgo2js1mmfz55scke9sppg8ml5aoeysxgw-3nadgzw-5fdd25ce.png)

The job keeps firing every minute, failing each time with `ERROR: relation "metrics_daily" does not exist`. Your `cron.job_run_details` table is now filling up with failure logs, and there’s no automatic way to stop it.

## Why pg_cron loses track of dropped tables

The root cause is architectural: pg_cron stores jobs as raw SQL text in its catalog tables, completely decoupled from Postgres’ system catalogs. When you drop a table, here’s what happens:

1. **DDL executes**: Postgres removes the table from pg_class and updates all system catalogs
2. **pg_cron is oblivious**: The job definition in cron.job remains unchanged—it’s just text
3. **Scheduler fires**: Every minute, pg_cron dutifully attempts to execute that text
4. **Worker fails**: The libpq connection tries to run the INSERT, Postgres can’t find the table, error logged

This disconnect between pg_cron’s scheduling metadata and Postgres’ actual schema state is what causes these persistent failures. The scheduler has no built-in mechanism to detect that its target objects have vanished.

## The naïve fixes (and why they don’t scale)

You might be tempted to try these workarounds:

### Option 1: Manually unschedule jobs before dropping tables

```sql
SELECT cron.unschedule('minutely_metrics');
DROP TABLE metrics_daily;
```

This works, but requires perfect discipline. One forgotten unschedule, one teammate who doesn’t know about the job, or one migration script that misses this step, and you’re back to error spam.

### Option 2: Wrap every job in defensive SQL

```sql
SELECT cron.schedule('safe_metrics', '* * * * *', $$
    DO $job$
    BEGIN
        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'metrics_daily') THEN
            INSERT INTO metrics_daily DEFAULT VALUES;
        END IF;
    END $job$;
$$);
```

Now your jobs fail silently instead of loudly. But this adds boilerplate to every job, and you still have zombie entries in cron.job that fire needlessly, consuming resources and cluttering your job list.

### Option 3: Periodic cleanup scripts

You could schedule yet another cron job to clean up failed jobs, but now you’re using pg_cron to fix pg_cron’s problems. It’s turtles all the way down.

## Enter Postgres event triggers: a schema-synchronized fix

[Postgres event triggers](https://neon.com/docs/changelog/2025-06-27#support-for-postgres-event-triggers) fire on DDL operations, giving us a hook to intercept schema changes and update pg_cron accordingly. Unlike regular triggers that fire on DML (INSERT/UPDATE/DELETE), event triggers respond to:

- `ddl_command_start`: Before CREATE, ALTER, DROP commands
- `sql_drop`: After objects are dropped
- `ddl_command_end`: After DDL completes successfully
- `table_rewrite`: When ALTER TABLE rewrites data

We can use `sql_drop` to detect when tables disappear and automatically clean up any pg_cron jobs that reference them.

## A 30-line self-healing trigger

Here’s a complete solution that automatically unschedules jobs when their target tables are dropped:

```sql
-- Function: unschedule cron jobs whose command mentions a soon‑to‑be‑dropped table
CREATE OR REPLACE FUNCTION cleanup_cron_on_table_drop()
RETURNS EVENT_TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    obj  record;
    j    record;
BEGIN
    FOR obj IN
        SELECT * FROM pg_event_trigger_dropped_objects()
        WHERE object_type = 'table'
    LOOP
        FOR j IN
            SELECT jobid
              FROM cron.job
             WHERE command ILIKE '%' || quote_ident(obj.object_name) || '%'
        LOOP
            PERFORM cron.unschedule(j.jobid);
            RAISE NOTICE
              'pg_cron job % removed because %.% was dropped',
              j.jobid, obj.schema_name, obj.object_name;
        END LOOP;
    END LOOP;
END;
$$;

-- Attach it to the sql_drop event (requires neon_superuser privileges)
CREATE EVENT TRIGGER cleanup_cron_jobs_on_drop
    ON sql_drop
    EXECUTE FUNCTION cleanup_cron_on_table_drop();
```

This trigger:

1. Fires whenever any object is dropped
2. Filters for table drops specifically
3. Searches cron.job for any commands mentioning the dropped table name
4. Automatically unschedules matching jobs
5. Logs what it did via RAISE NOTICE

## Verification test: from failing job to clean catalog

Let’s prove this works by rerunning our failure scenario:

```sql
-- Create table and job
CREATE TABLE test_metrics(id serial PRIMARY KEY, data text);
SELECT cron.schedule('test_job', '* * * * *',
                     'INSERT INTO test_metrics(data) VALUES(''test'')');

-- Verify job exists
SELECT jobname, command FROM cron.job WHERE jobname = 'test_job';

-- Drop the table (trigger fires here!)
DROP TABLE test_metrics;

-- Check if job was cleaned up
SELECT jobname FROM cron.job WHERE jobname = 'test_job';
-- Returns 0 rows - job is gone!

-- Verify no new failures accumulating
SELECT count(*) FROM cron.job_run_details
WHERE jobname = 'test_job'
  AND status = 'failed'
  AND start_time > now() - interval '5 minutes';
-- Returns 0 - no failures because job was unscheduled
```

In Neon, you’ll see this nifty toast popping up to tell you the job was cleaned up:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-fix-missing-table-errors-in-pg_cron/ad4nxcdtutzpr0zdbdb3cflodymfnl-f2v7xdvlijcp8vplnqkk4ck2cqx1hocn8bvbpagaxvw71cqfjkt2tujnd-m4sk3gx6tunppzhat4lzqesbfagpnyjfiq46k0fuzqcrro-fbf486c5.png)

The trigger detected the drop and automatically cleaned up. No more error spam, no manual intervention required.

Event triggers aren’t just for [Bobby drop tables](https://xkcd.com/327/). You can use them for:<br />

- **Handling table renames**: Automatically update pg_cron jobs, views, and function bodies when tables are renamed to prevent broken references.
- **Auditing schema changes**: Log every CREATE, ALTER, and DROP to a history table with username, timestamp, and full DDL statement for compliance tracking.
- **Enforcing naming conventions**: Automatically reject any table creation that doesn’t follow your team’s standards like tbl*module_name or &lt;app&gt;*&lt;entity&gt;\_&lt;suffix&gt;.
- **Auto-creating indexes on foreign keys**: Detect new foreign key constraints and immediately create matching indexes to prevent slow joins.
- **Invalidating application caches**: Send a NOTIFY message or call pg_notify() whenever table structures change so your app can flush stale cached queries.
- **Preventing accidental drops of critical tables**: Block any attempt to DROP tables matching patterns like users, orders, or payments unless a special “I really mean it” flag is set.

## Operational best practices for pg_cron

Beyond fixing missing table errors, here are essential practices for production pg_cron deployments:

- **Use descriptive job names**: `daily_user_summary` beats `job_17` when debugging at 3 AM
- **Set explicit timeouts**: Add SET `statement_timeout = '5min'`; to prevent runaway jobs
- **Include search_path**: Start jobs with SET search_path TO myschema, public; to avoid ambiguity
- **Log strategically**: For critical jobs, add custom logging to a dedicated audit table
- **Monitor job duration**: Query `cron.job_run_details` for jobs where `end_time - start_time > interval '1 hour'`
- **Implement idempotency**: Design jobs that can safely re-run if they fail partway through
- **Regular cleanup**: Schedule a job to purge old `cron.job_run_details` entries:

```sql
SELECT cron.schedule('cleanup_cron_history', '0 2 * * 0',  $$DELETE FROM cron.job_run_details WHERE end_time < now() - interval '30 days'$$);
```

## When pg_cron is perfect, and when you need something else

**pg_cron excels at:**

- Database maintenance (VACUUM, ANALYZE, partition management)
- Lightweight ETL within the same database
- Materializing views on a schedule
- Data archival and cleanup
- Sending notifications via NOTIFY
- Any task under 1 hour that operates on local data

**Consider alternatives when you need:**

- Cross-database or cross-cluster coordination
- Long-running jobs (hours/days) that could block others
- Complex dependency graphs between jobs
- External API calls or file system access
- Distributed job processing with multiple workers
- Sub-second scheduling precision

For these cases, tools like [Apache Airflow](https://airflow.apache.org/), [Inngest](https://www.inngest.com/), or even a simple external cron with proper monitoring might be better choices.

## Try it yourself on Neon (or your local Postgres)

Want to test this trigger-based solution without setting up infrastructure? [Neon](https://neon.com/) is a serverless Postgres platform with a [Free Plan](https://neon.com/pricing) that provides pg_cron pre-installed and event triggers work out of the box with the [neon_superuser](https://neon.com/docs/manage/roles#the-neonsuperuser-role) role. You can spin up a free Neon project and paste the trigger code directly; no additional permissions needed.

For local Postgres, you’ll need:

1. CREATE EXTENSION pg_cron; (requires superuser)
2. PostgreSQL 9.3+ for event trigger support
3. The `cron.database_name` parameter set in `postgresql.conf`

Whether you’re managing a handful of maintenance jobs or orchestrating complex data pipelines, combining pg_cron with event triggers gives you a self-healing scheduling system that adapts to schema changes automatically. No more 3 AM pages about “relation does not exist,” just PostgreSQL quietly cleaning up after itself, precisely as it should.
