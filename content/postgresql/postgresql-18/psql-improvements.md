---
title: 'PostgreSQL 18 psql Improvements: Pipeline Queries and Prepared Statements'
page_title: 'PostgreSQL 18 psql Improvements: Pipeline Queries and Prepared Statements'
page_description: 'Learn about PostgreSQL 18 psql improvements including pipeline query commands, prepared statement support, improved prompt options, and improved workflow capabilities that make database development more efficient.'
ogImage: ''
updatedOn: '2025-08-02T10:30:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 pg_stat_io Improvements'
  slug: 'postgresql-18/pg-stat-io'
nextLink:
  title: 'PostgreSQL 18 Autovacuum Maintenance Configuration'
  slug: 'postgresql-18/autovacuum-maintenance-configuration'
---

**Summary**: In this tutorial, you will learn about PostgreSQL 18's `psql` improvements, including new pipeline query commands, prepared statement support, improved prompt options, and workflow features that make database development and debugging more efficient.

## Introduction to psql Improvements

PostgreSQL 18 introduces significant improvements to `psql`, the command-line interface that developers and database administrators use daily. These improvements focus on three main areas: pipeline query support, prepared statement management, and better workflow integration.

While `psql` has always been a powerful tool, PostgreSQL 18 brings it closer to the advanced capabilities available through the `libpq` programming interfaces. The new features allow you to work more efficiently with complex query sequences, debug prepared statements directly from the command line, and monitor pipeline operations in real-time.

## Pipeline Query Commands

PostgreSQL 18 adds native support for pipeline queries in `psql`, bringing the performance benefits of libpq's pipeline mode to the command line. Pipeline mode allows you to send multiple queries without waiting for each individual result, reducing network round trips and improving performance especially over high-latency connections.

### Understanding Pipeline Mode

Before diving into the new commands, it's important to understand what pipeline mode does. In normal operation, `psql` sends a query, waits for the complete result, then sends the next query. This creates multiple round trips between client and server.

Pipeline mode changes this by allowing you to queue multiple queries and send them together, then retrieve results in batch. This can dramatically improve performance when you have multiple related operations.

### New Pipeline Commands

PostgreSQL 18 introduces seven new pipeline-related commands:

- `\startpipeline` - Begins a new pipeline session. After running this command, subsequent queries are queued rather than executed immediately.

- `\endpipeline` - Closes the current pipeline and processes all queued queries.

- `\syncpipeline` - Establishes a synchronization point within the pipeline. This is useful for grouping related operations together.

- `\sendpipeline` - Sends queued queries to the server without closing the pipeline.

- `\flushrequest` - Requests that the server flush its output buffer, sending back any available results.

- `\flush` - Forces the client to flush its output buffer to the server.

- `\getresults` - Retrieves and displays results from previously sent pipeline queries.

All these commands work together to allow you to manage complex query sequences efficiently. For this you need to make sure that you have `psql` 18 beta or later installed, as these commands are not available in earlier versions.

### Basic Pipeline Example

Here's a simple example of using pipeline commands to execute multiple related queries:

```sql
-- Start a pipeline
\startpipeline

-- Queue several related queries
INSERT INTO orders (customer_id, total) VALUES (101, 299.99);
INSERT INTO order_items (order_id, product_id, quantity)
  VALUES (currval('orders_id_seq'), 1, 2);
UPDATE customers SET last_order_date = CURRENT_DATE WHERE id = 101;

-- Your prompt will change from postgres=# to postgres=*# indicating pipeline mode is active

-- Send all queries and get results
\endpipeline
```

This approach sends all three operations together, reducing the network overhead compared to executing them individually.

It might not look like much at first glance, but consider the network latency involved.

### Advanced Pipeline Usage

For more complex scenarios, you can use synchronization points to group operations:

```sql
\startpipeline

-- First batch of operations
SELECT COUNT(*) FROM orders WHERE status = 'pending';
UPDATE orders SET status = 'processing' WHERE status = 'pending';

-- Synchronization point
\syncpipeline

-- Second batch that depends on the first
SELECT id FROM orders WHERE status = 'processing';
INSERT INTO processing_log (order_id, started_at)
  SELECT id, CURRENT_TIMESTAMP FROM orders WHERE status = 'processing';

\endpipeline
```

The `\syncpipeline` command ensures the first batch completes before the second batch begins, which is important when later operations depend on earlier ones.

### Performance Benefits

Pipeline mode provides the most benefit when:

- Network latency is significant (cloud environments, remote connections)
- You're executing many small operations in sequence
- Operations can be grouped logically

For example, if you have 100ms network latency and need to execute 10 queries, normal mode would take at least 1 second in network overhead alone. Pipeline mode can reduce this to around 100ms.

## Prepared Statement Support

PostgreSQL 18 brings first-class prepared statement support to `psql` with three new commands that mirror the low-level protocol operations. This makes it much easier to debug prepared statement issues and understand how your application's database interactions work.

### New Prepared Statement Commands

- `\parse <statement_name> <sql_query>` - Parses and stores a prepared statement on the server. This is equivalent to the PREPARE SQL command but gives you more control over the process.

- `\bind_named <statement_name> [parameters...]` - Binds parameters to a named prepared statement and creates a portal ready for execution.

- `\close_prepared <statement_name>` - Closes and deallocates a prepared statement, freeing server resources.

### Working with Prepared Statements

Let's walk through a complete example of using the new prepared statement commands:

```sql
-- Ensure no existing prepared statement
\close_prepared get_user_name

-- Parse a simple prepared statement
SELECT name FROM users WHERE id = $1 \parse get_user_name

-- Bind a single parameter
\bind_named get_user_name 42

-- Execute and display results
EXECUTE get_user_name;

-- Inspect the prepared statement
SELECT name, statement, parameter_types
FROM pg_prepared_statements
WHERE name = 'get_user_name';

-- Clean up
\close_prepared get_user_name
```

This workflow gives you fine-grained control over each step of prepared statement execution, making it easier to understand what's happening at the protocol level.

### Debugging Applications

The new commands are particularly useful for debugging application issues. You can replicate the exact sequence of operations your application performs:

```sql
-- Replicate what your application does
SELECT id, name, email FROM users WHERE email = $1 \parse user_lookup
\bind_named user_lookup 'user@example.com'

-- Check the prepared statement details
SELECT statement, parameter_types FROM pg_prepared_statements
WHERE name = 'user_lookup';

-- Execute and see results
EXECUTE user_lookup('user@example.com');
```

This approach helps you isolate whether performance or correctness issues are related to prepared statement handling, parameter binding, or the SQL logic itself.

### Parameter Binding Examples

The `\bind_named` command supports various parameter types:

```sql
-- Text parameters
INSERT INTO logs (messages, level, created_at) VALUES ($1, $2, $3) \parse insert_log
\bind_named insert_log 'System started' 'INFO' '2025-08-04 10:30:00'
EXECUTE insert_log

-- Numeric parameters
UPDATE products SET price = $1 WHERE id = $2 \parse update_price
\bind_named update_price 299.99 42

-- NULL parameters
UPDATE users SET last_login = $1 WHERE id = $2 \parse clear_field
\bind_named clear_field NULL 123
```

This flexibility allows you to test various scenarios directly from `psql`, making it a powerful tool for application development and debugging.

## Better Prompt Options

PostgreSQL 18 improves psql's prompt system with pipeline status indicators and new state variables that help you track what's happening during complex operations.

### Pipeline Status in Prompt

The new `%P` prompt character shows the current pipeline status:

- `on` - Pipeline mode is active
- `off` - Normal query mode
- `abort` - Pipeline encountered an error and is in abort state

You can add pipeline status to your prompt:

```sql
-- Set prompt to show pipeline status
\set PROMPT1 '%n@%M:%>/%/ [%P]%R%# '
```

This would show a prompt like:

```sql
postgres@localhost:5432/testdb [off]=#
```

When you start a pipeline, it changes to:

```sql
postgres@localhost:5432/testdb [on]=#
```

### New Pipeline State Variables

PostgreSQL 18 introduces three new variables that track pipeline state:

- `PIPELINE_SYNC_COUNT` - Number of pending sync operations in the current pipeline.

- `PIPELINE_COMMAND_COUNT` - Number of queued commands (including \bind, \bind_named, \close, and \parse operations).

- `PIPELINE_RESULT_COUNT` - Number of results available for retrieval with \getresults.

You can use these variables in prompts or check them with `\echo`:

```sql
-- Check current pipeline state
\echo Pipeline commands: :PIPELINE_COMMAND_COUNT
\echo Pending syncs: :PIPELINE_SYNC_COUNT
\echo Available results: :PIPELINE_RESULT_COUNT

-- Use in prompt for detailed status
\set PROMPT1 '%n@%M [C:%:PIPELINE_COMMAND_COUNT: S:%:PIPELINE_SYNC_COUNT: R:%:PIPELINE_RESULT_COUNT:]%# '
```

This would turn your prompt into a detailed status display, helping you monitor pipeline operations in real-time, for example:

```sql
postgres@localhost:5432/testdb [C:3 S:1 R:0]=#
```

### Connection Service Name Support

PostgreSQL 18 also adds support for displaying the connection service name in prompts and accessing it via the `SERVICE` variable. This is useful when working with multiple configured connections:

```sql
-- Add service name to prompt
\set PROMPT1 '%n@%M:%>/%/ (%s)%R%# '

-- Check current service
\echo Current service: :SERVICE
```

This allows you to easily identify which connection service you're using, especially in environments with multiple database configurations.
