---
title: 'Postgres as Your Platform: Building Event-Driven Systems with Schema Changes'
description: Let Postgres do more than store data
excerpt: >-
  For years, we’ve built elaborate scaffolding around our databases: message
  queues to broadcast changes, cron jobs to sync schemas, webhooks to notify
  downstream systems. We needed this scaffolding because Postgres was “just” a
  database, a place to store rows and run queries. The...
date: '2025-07-25T19:46:32'
updatedOn: '2025-10-06T16:09:15'
category: postgres
categories:
  - postgres
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-as-your-platform/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Postgres as Your Platform: Building Event-Driven Systems with Schema Changes
    - Neon
  description: >-
    Thanks to features like event triggers, Postgres can become much more than a
    database - a platform able to orchestrate your infra.
  keywords: []
  noindex: false
  ogTitle: >-
    Postgres as Your Platform: Building Event-Driven Systems with Schema Changes
    - Neon
  ogDescription: >-
    Thanks to features like event triggers, Postgres can become much more than a
    database - a platform able to orchestrate your infra.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-as-your-platform/social.png
---

For years, we’ve built elaborate scaffolding around our databases: message queues to broadcast changes, cron jobs to sync schemas, webhooks to notify downstream systems. We needed this scaffolding because Postgres was “just” a database, a place to store rows and run queries. The real work happened elsewhere.

But, at the same time, Postgres has been evolving. Yes, it’s still a database at heart. But with extensions like pgvector for AI workloads and [pg_cron](https://neon.com/blog/how-to-fix-missing-table-errors-in-pg_cron) for scheduling, plus native features like [event triggers](https://neon.com/postgresql/postgresql-triggers/postgresql-event-trigger), LISTEN/NOTIFY, and transactional DDL, it has become something more – a platform that can orchestrate your entire infrastructure from within.

**The key insight? Schema changes in Postgres aren’t just DDL statements; they’re events.** And unlike most databases, Postgres treats DDL as first-class transactions, making these events reliable, observable, and actionable. When you CREATE TABLE or ALTER COLUMN, Postgres queues notifications and delivers them immediately after the transaction commits. No polling, no lag, no missed changes.

This shift is particularly powerful for platform and internal tools teams who manage constantly evolving schemas. Every new feature means new tables, every optimization means altered indexes, and every deprecation means dropped columns. Instead of manually updating documentation, regenerating client libraries, and syncing analytics schemas, what if these tasks triggered automatically?

To illustrate this pattern, we’ll “build” _FleetOps_, a logistics SaaS where customers define IoT device schemas on the fly. When a customer adds a new sensor type, FleetOps automatically generates TypeScript SDKs, syncs to data warehouses, and updates dashboards. All orchestrated by Postgres.

## The Building Blocks: Postgres’s Event-Driven Arsenal

Modern Postgres ships with a surprising array of event-driven primitives that most developers never discover. These are core features that share Postgres’ transactional guarantees.

### Event Triggers: Your DDL Watchdog

Event triggers fire automatically when DDL commands execute, giving you hooks into CREATE, ALTER, DROP, and more:

```sql
CREATE EVENT TRIGGER capture_schema_changes
  ON ddl_command_end
  EXECUTE FUNCTION log_ddl_activity();
```

Unlike regular triggers that watch row changes, event triggers see _structural_ changes. They run inside the same transaction as the DDL, which means they’re atomic. If your event trigger fails, the schema change rolls back too. This guarantee is crucial for maintaining consistency between your database schema and external systems.

### LISTEN/NOTIFY: Zero-Dependency Pub/Sub

Postgres has shipped with a built-in pub/sub system since version 6.4. It’s dead simple:

```sql
-- Publisher (inside your event trigger)
NOTIFY schema_changed, '{"table": "temperature_sensors", "action": "column_added"}';

-- Subscriber (your worker process)
LISTEN schema_changed;
```

No Redis, no RabbitMQ, no Kafka needed for basic event distribution. Notifications deliver in sub-milliseconds to all connected listeners, with payloads up to 8KB. Perfect for signaling “something happened, go check the outbox table for details.”

### The Outbox Pattern: Reliability Without Complexity

Combining event triggers with a simple table gives you reliable event delivery:

```sql
CREATE TABLE schema_change_log (
    id         bigserial PRIMARY KEY,
    command    text NOT NULL,        -- CREATE TABLE, ALTER TABLE, etc.
    object     jsonb NOT NULL,       -- Full details of what changed
    created_at timestamptz DEFAULT now()
);
```

Your event trigger writes to this table, then sends a NOTIFY. Workers process events from the table, marking them complete. If a worker crashes? The event is still in the outbox, ready for retry. This pattern gives you at-least-once delivery with just Postgres tables, no external infrastructure required.

Neon’s serverless architecture amplifies these patterns:

- **Event triggers just work**: Neon supports event triggers for any role inheriting from neon_superuser. No special configuration needed.
- **Instant branches for testing**: Before deploying that event trigger to production, create a branch and test it with real data. Branches are copy-on-write, so it takes seconds.
- **Scale-to-zero aware**: For development environments, let Neon suspend idle databases. For production listeners, keep one connection alive or disable auto-suspend.
- **No servers to manage**: Focus on your event logic, not on Postgres versions, replication lag, or disk space.

These are all Postgres capabilities that top engineering teams have quietly used for years.

## How FleetOps Could Implement This Pattern

Let’s see how FleetOps could use these building blocks to create a self-managing platform. When a customer adds a new IoT device type, dozens of downstream systems need to know about it immediately and reliably.

### The Core Pattern: Event Trigger → Outbox → Worker

The architecture rests on three components working in harmony. First, we need an event trigger that captures all DDL commands and a function that processes them:

```sql
-- 1. Capture every schema change
CREATE EVENT TRIGGER capture_ddl_changes
    ON ddl_command_end
    WHEN TAG IN ('CREATE TABLE', 'ALTER TABLE', 'DROP TABLE')
    EXECUTE FUNCTION platform.log_and_notify();

-- 2. Minimal trigger function: log and notify
CREATE FUNCTION platform.log_and_notify() RETURNS event_trigger AS $$
DECLARE
    rec record;
    payload jsonb;
BEGIN
    -- pg_event_trigger_ddl_commands() gives us metadata about what just happened
    FOR rec IN SELECT * FROM pg_event_trigger_ddl_commands() LOOP
        payload:= jsonb_build_object(
            'event_id', gen_random_uuid(),
            'command', rec.command_tag,
            'object_identity', rec.object_identity,
            'schema_name', rec.schema_name,
            'timestamp', now()
        );
        
        -- Write to our durable outbox
        INSERT INTO platform.schema_changes (event_data) VALUES (payload);
        
        -- Notify any listening workers
        PERFORM pg_notify('schema_changed', payload->>'event_id');
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

This pattern is deceptively powerful. The trigger function executes inside the DDL transaction, which means:

- If the trigger fails, the schema change rolls back
- The outbox entry is guaranteed to exist if the DDL succeeded
- No possibility of “phantom” events from failed DDL

### The Outbox Table: Your Event Store

The outbox pattern turns a simple table into a reliable event queue. This table serves as both our event store and our safety net when workers disconnect:

```sql
CREATE TABLE platform.schema_changes (
    id          bigserial PRIMARY KEY,
    event_data  jsonb NOT NULL,
    created_at  timestamptz DEFAULT now(),
    processed   boolean DEFAULT false,
    processed_at timestamptz
);

-- Index for efficient polling if LISTEN/NOTIFY goes down
CREATE INDEX idx_unprocessed ON platform.schema_changes (processed, created_at) 
WHERE NOT processed;
```

Why an outbox table instead of just NOTIFY? Three reasons:

1. **Durability**: Notifications vanish if no one’s listening. The outbox persists.
2. **Replayability**: Need to reprocess events after fixing a bug? They’re all here.
3. **Observability**: Query which schemas change most often, which automations are slow, and what failed.

### LISTEN/NOTIFY: The Zero-Latency Bridge

While the outbox provides durability, LISTEN/NOTIFY provides speed. Here’s a Python worker that combines both approaches for maximum reliability:

```python
import psycopg2
import json

# Connect directly to Postgres (not through a connection pooler)
conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True
cur = conn.cursor()

# Start listening
cur.execute("LISTEN schema_changed;")

while True:
    # This blocks until a notification arrives
    conn.poll()
    while conn.notifies:
        notify = conn.notifies.pop(0)
        event_id = notify.payload
        
        # Fetch the full event from the outbox
        cur.execute("""
            UPDATE platform.schema_changes 
            SET processed = true, processed_at = now()
            WHERE event_data->>'event_id' = %s AND NOT processed
            RETURNING event_data
        """, (event_id,))
        
        if row:= cur.fetchone():
            process_schema_change(row [0])
```

This hybrid approach combines the best of both worlds: microsecond latency when everything’s running smoothly, with automatic fallback to polling if the listener disconnects.

### Multi-Tenant Considerations

FleetOps uses schema namespacing to isolate tenants and track ownership. The event trigger automatically captures which tenant’s schema was modified, enabling tenant-specific automation:

```sql
-- Each tenant operates in their own schema
CREATE SCHEMA tenant_acme;
CREATE SCHEMA tenant_globex;

-- The event trigger captures which schema was modified
-- In the trigger function:
IF rec.schema_name LIKE 'tenant_%' THEN
    payload:= payload || jsonb_build_object(
        'tenant_id', substring(rec.schema_name from 8),
        'requires_sync', true
    );
END IF;
```

This metadata drives routing decisions. Acme’s schema changes trigger Acme’s SDK regeneration, not Globex’s.

One critical detail: what happens when your automation creates tables? Without careful design, you’ll create an infinite loop where generated tables trigger more generation:

```sql
-- The worker identifies itself
SET LOCAL app.source = 'schema_automation';

-- The trigger function checks this
CREATE FUNCTION platform.log_and_notify() RETURNS event_trigger AS $$
BEGIN
    -- Skip if this change came from our automation
    IF current_setting('app.source', true) = 'schema_automation' THEN
        RETURN;
    END IF;
    
    -- Otherwise, process normally...
END;
$$ LANGUAGE plpgsql;
```

Without this check, your code generator, when creating a migrations table, would trigger the code generator, creating an infinite loop.

### Why This Architecture Scales

The beauty lies in its simplicity:

- **No external dependencies**: Everything runs inside Postgres
- **Transactional consistency**: Schema and events can’t diverge
- **Natural back-pressure**: If workers slow down, the outbox fills up, and you can monitor this with simple SQL
- **Language agnostic**: Workers can be written in any language that speaks Postgres

FleetOps could run dozens of these workers, such as code generators, compliance checkers, analytics syncers, all orchestrated by schema changes. When a developer adds a column, they don’t file tickets or update documentation. They just run their migration, and Postgres handles the rest.

## Build Your Own Postgres Platform

This pattern transforms how platform teams operate. Instead of building elaborate CI/CD pipelines to keep systems in sync, you let schema changes drive automation. When developers run migrations, documentation updates itself, SDKs regenerate, analytics warehouses sync, and compliance checks run automatically. The database becomes the source of truth not just for data, but for all the processes that depend on that data’s structure.

Neon makes this pattern production-ready from day one. With event triggers fully supported, instant branching for safe testing, and serverless infrastructure that scales with your needs, you can focus on building your automations instead of managing databases. Create a branch to experiment with event triggers, test your automation logic with real data, then deploy with confidence.

Start by creating a simple event trigger in your [Neon project](https://console.neon.tech/) today. Log schema changes to an outbox table, set up a basic LISTEN/NOTIFY worker, and watch as your database transforms into the command center for your entire platform. No additional infrastructure required, just Postgres.
