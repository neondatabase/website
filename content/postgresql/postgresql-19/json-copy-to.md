---
title: 'PostgreSQL 19 JSON Format for COPY TO'
page_title: 'PostgreSQL 19 JSON COPY TO - Native JSON Data Export'
page_description: 'Learn how to use PostgreSQL 19 COPY TO with FORMAT JSON to export data as NDJSON or JSON arrays, replacing workarounds with native streaming JSON output.'
ogImage: ''
updatedOn: '2026-04-14T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 Logical Replication Improvements'
  slug: 'postgresql-19/logical-replication-improvements'
nextLink:
  title: 'PostgreSQL 19 Query Improvements'
  slug: 'postgresql-19/query-improvements'
---

**Summary**: PostgreSQL 19 adds native JSON output support to the `COPY TO` command. You can export table data as NDJSON (one JSON object per line) or as a JSON array, with streaming output that handles large datasets without loading everything into memory.

## Introduction to JSON COPY TO

Exporting PostgreSQL data as JSON has always been possible, but the workarounds were awkward. You could wrap every row in `row_to_json()` inside a COPY command, but that produced text-format COPY output with escaped JSON strings. You could use `json_agg()`, but that loaded the entire result set into memory before outputting anything. Or you could export as CSV and convert to JSON with external tools.

PostgreSQL 19 adds `FORMAT JSON` as a native COPY format. The output is clean, streaming JSON with no double-escaping issues and constant memory usage regardless of table size.

## Basic usage

`COPY ... TO` with `FORMAT JSON` writes one JSON object per row. By default the rows are emitted as newline-delimited JSON (NDJSON); the optional `FORCE_ARRAY` flag wraps them in a single JSON array.

### NDJSON output (default)

Export a table as newline-delimited JSON (NDJSON), where each line is a complete JSON object:

```sql
COPY users TO STDOUT WITH (FORMAT JSON);
```

Output:

```json
{"id":1,"email":"alice@example.com","name":"Alice Johnson","active":true}
{"id":2,"email":"bob@example.com","name":"Bob Smith","active":true}
{"id":3,"email":"charlie@example.com","name":"Charlie Brown","active":false}
```

Each row becomes an independent JSON object on its own line. This format is widely supported by tools like `jq`, Apache Kafka, AWS Kinesis, and most ETL pipelines.

### JSON Array Output

If you need a valid JSON array (wrapped in `[` and `]`), use the `FORCE_ARRAY` option:

```sql
COPY users TO STDOUT WITH (FORMAT JSON, FORCE_ARRAY);
```

Output:

```json
[
 {"id":1,"email":"alice@example.com","name":"Alice Johnson","active":true}
,{"id":2,"email":"bob@example.com","name":"Bob Smith","active":true}
,{"id":3,"email":"charlie@example.com","name":"Charlie Brown","active":false}
]
```

This is useful for tools that expect a JSON array, such as document stores or APIs that consume batch imports.

## Exporting to Files

Write JSON directly to a file on the server:

```sql
COPY users TO '/tmp/users.json' WITH (FORMAT JSON);
```

Or use `\copy` in psql to write to a local file:

```
\copy users TO '/tmp/users.json' WITH (FORMAT JSON)
```

## Column Selection

Export specific columns instead of the entire row:

```sql
COPY users (email, name) TO STDOUT WITH (FORMAT JSON);
```

Output:

```json
{"email":"alice@example.com","name":"Alice Johnson"}
{"email":"bob@example.com","name":"Bob Smith"}
```

## Using Queries

Export the result of any query:

```sql
COPY (
    SELECT u.email, u.name, count(o.id) AS order_count
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    GROUP BY u.id
) TO STDOUT WITH (FORMAT JSON);
```

Output:

```json
{"email":"alice@example.com","name":"Alice Johnson","order_count":15}
{"email":"bob@example.com","name":"Bob Smith","order_count":3}
```

This is useful when you need to export joined or aggregated data rather than raw table contents.

## Comparison to Previous Workarounds

Before PostgreSQL 19, exporting JSON required one of these approaches:

### row_to_json Workaround

Wrap each row in `row_to_json()` and let `COPY` write the result as a single text column.

```sql
COPY (SELECT row_to_json(t) FROM users t) TO STDOUT;
```

This produces text-format COPY output where the JSON is wrapped in additional escaping:

```
{"id":1,"email":"alice@example.com","name":"Alice Johnson","active":true}
```

It looks similar but is actually a text column containing a JSON string, which can cause quoting issues when imported by other tools.

### json_agg Workaround

Aggregate everything into a single JSON array on the server side, then return it as one row.

```sql
SELECT json_agg(t) FROM users t;
```

This produces a valid JSON array, but it materializes the entire result in memory before outputting anything. For a table with millions of rows, this can use gigabytes of memory.

### Native FORMAT JSON

PostgreSQL 19 emits JSON directly from `COPY` without per-row wrappers or full-result aggregation.

```sql
COPY users TO STDOUT WITH (FORMAT JSON);
```

Native JSON output is streaming (constant memory), produces clean JSON objects, and does not require wrapping each row in a function call.

| Approach | Streaming | Clean Output | Memory Usage |
|---|---|---|---|
| `row_to_json()` in COPY | Yes | Extra escaping | Constant |
| `json_agg()` | No | Clean | Proportional to result |
| `FORMAT JSON` (new) | Yes | Clean | Constant |

## Practical use cases

These are the places where native `FORMAT JSON` output replaces something that previously needed a helper query or post-processing step.

### ETL pipeline export

Export data for processing by external ETL tools:

```sql
-- Export to NDJSON for a Kafka producer or S3 upload
COPY (
    SELECT id, event_type, payload, created_at
    FROM events
    WHERE created_at > now() - interval '1 day'
) TO STDOUT WITH (FORMAT JSON);
```

NDJSON is the standard format for streaming data pipelines. Each line can be processed independently.

### API Response Seeding

Generate JSON fixtures for API testing or development environments:

```sql
COPY (
    SELECT id, name, email, role
    FROM users
    WHERE role = 'admin'
    ORDER BY name
) TO '/tmp/admin_users.json' WITH (FORMAT JSON, FORCE_ARRAY);
```

The `FORCE_ARRAY` output can be directly consumed by application code expecting a JSON array.

<Admonition type="note">
Server-side `COPY ... TO 'filename'` requires the `pg_write_server_files` role or superuser, and writes to the path on the database server, not the client. For local development or any non-superuser, run the command from `psql` with the meta-command `\copy` instead. The syntax is the same after the initial `\`, but the file is written on the client machine and no special privileges are needed.

```text
mydb=# \copy (SELECT id, name, email, role FROM users WHERE role = 'admin') TO 'admin_users.json' WITH (FORMAT JSON, FORCE_ARRAY)
```
</Admonition>

### Data Warehouse Loading

Export data for loading into JSON-native systems like Elasticsearch, MongoDB, or BigQuery:

```sql
-- Export with specific columns for the target schema
COPY products (id, name, category, price, metadata)
TO '/tmp/products_export.json' WITH (FORMAT JSON);
```

### Piping to External Tools

Combine with shell tools for processing:

```bash
psql -c "COPY users TO STDOUT WITH (FORMAT JSON)" mydb | jq '.email' > emails.txt
```

## NULL Handling

SQL `NULL` values are output as JSON `null`:

```json
{"id":1,"email":"alice@example.com","phone":null}
```

<Admonition type="note">
SQL NULL and JSON null are indistinguishable in the output. If your application needs to differentiate between "field is null" and "field is missing," consider using column selection to exclude nullable columns when they are not needed.
</Admonition>

## Limitations

- **COPY TO only.** There is no `COPY FROM` with `FORMAT JSON` in PostgreSQL 19.
- **No pretty printing.** Output is compact JSON with no indentation.
- **Incompatible options.** JSON format cannot be combined with `HEADER`, `DELIMITER`, `QUOTE`, `ESCAPE`, `NULL`, `DEFAULT`, `FORCE QUOTE`, `FORCE NOT NULL`, or `FORCE NULL`. These options are specific to text and CSV formats.

## Summary

`FORMAT JSON` in `COPY TO` gives PostgreSQL native, streaming JSON export capability. NDJSON output works with most modern data tools out of the box, and `FORCE_ARRAY` covers cases where a JSON array wrapper is needed.

## References

- [Commit `7dadd38c`: json format for COPY TO](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=7dadd38c)
- [PostgreSQL devel docs: COPY](https://www.postgresql.org/docs/devel/sql-copy.html)
