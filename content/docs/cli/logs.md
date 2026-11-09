---
title: 'Neon CLI command: logs'
subtitle: Query the logs a branch's services emit
summary: >-
  The Neon CLI `neon logs` command reads the logs a branch's services emit.
  Today that covers Neon Functions and Object Storage; Postgres compute logs
  are coming. Query records over a time
  window, filter by source, severity, or OpenTelemetry attributes, run raw
  LogQL, list which fields and values a branch reports, and call the branch's
  Loki-compatible read API. Logs are
  available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt),
  and Asia Pacific (Singapore).
enableTableOfContents: true
updatedOn: '2026-11-06T22:09:40.723Z'
---

The `logs` command reads the logs a branch's services emit. Today that covers Neon Functions and Object Storage; Postgres compute logs are coming. Query records over a time window, filter by source, severity, or OpenTelemetry attribute, and list which fields and values a branch reports so you can build precise filters. For output in Loki's format, use [`neon logs loki`](#loki).

Logs are currently available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`), so your project must be in one of these regions to use them. Support is expanding toward [all regions](/docs/introduction/regions).

Every subcommand resolves the project and branch from your [context](/docs/cli/link). Pass `--project-id` and `--branch` to target a specific branch instead.

<CliSubcommands command="logs" />

## neon logs query (#query)

Query log records over a time window. By default it returns the last hour of logs on the default branch, newest first.

<CliUsage command="logs query" />

<CliOptions command="logs query" />

Bound the window with `--since` (a duration like `30m` or `1h`, ending at `--end-time` or now) or with an explicit `--start-time`/`--end-time` pair. `--since` and `--start-time` are mutually exclusive, and the maximum window is 7 days.

The structured content filters (`--source`, `--service-name`, `--scope-name`, `--severity-text`, `--body-contains`, and `--trace-id`) combine with each other. Passing `--logql` replaces all of them with a raw [LogQL](https://grafana.com/docs/loki/latest/query/) expression (stream selectors and line filters only); the window, `--limit`, `--sort-order`, and `--cursor` still apply.

`--source` accepts `function`, `storage`, and `pg_endpoint`. Only `function` and `storage` return records today; `pg_endpoint` (Postgres compute) is accepted but comes back empty until Postgres logs ship.

Filter by severity with `--severity-text`, which matches the exact, case-sensitive value a record carries (for example `ERROR` or `INFO`, uppercase). Severities vary by source, so a filter can legitimately return nothing. Storage logs take their level from the HTTP status (`WARN` for 4xx, `ERROR` for 5xx, `INFO` otherwise), so `--source storage --severity-text ERROR` returns only server errors. Run `neon logs field-values severity_text` to see the values a branch actually reports before filtering. `--minimum-severity` (match a level and everything above it) is not supported by the branch log backend; use `--severity-text` for an exact match instead.

```bash
neon logs query --since 30m
```

Filter function errors on a specific branch:

```bash
neon logs query --branch main --source function --severity-text ERROR
```

Read one function's logs. A function's service name is `neon-function/<slug>`:

```bash
neon logs query --source function --service-name neon-function/hello
```

Use a raw LogQL selection instead of the structured filters:

```bash
neon logs query --since 1h --logql '{entity_type="function"} |= "timeout"'
```

When more records match than fit in one page, the command reports a pagination cursor on stderr. Re-run with the same window and filters plus `--cursor=<value>` to fetch the next page.

## neon logs fields (#fields)

List the log fields a branch reports. Pass any of these field names to `neon logs field-values` to see the values it carries.

<CliUsage command="logs fields" />

<CliOptions command="logs fields" />

## neon logs field-values (#field-values)

List the distinct values a single field carries over a time window, so you know what to filter on with `neon logs query`. By default it looks back six hours.

<CliUsage command="logs field-values" />

<CliOptions command="logs field-values" />

Show the service names seen in the last six hours:

```bash
neon logs field-values service_name --since 6h
```

## neon logs loki (#loki)

Call the branch's [Loki-compatible read API](#loki-read-api) and print its JSON response unchanged. Lines come back grouped by their stream labels, with nanosecond timestamps, where [`neon logs query`](#query) returns one record per line rounded to the second. Use `neon logs loki` when the order of lines within a second matters or a tool expects Loki output. You can also use it to try a LogQL selector before you point a Loki client at the endpoint. For readable tables, structured filters, and cursor pagination, use `neon logs query`.

<CliUsage command="logs loki" />

<CliOptions command="logs loki" />

The default endpoint, `query_range`, needs a LogQL query. `--endpoint labels` and `--endpoint label/<name>/values` list labels and their values; for these, the query is optional and can only be a stream selector. Neon supports stream selectors and line filters, and rejects metric queries and parser stages. The window can be at most 168 hours. Output is JSON or YAML only.

Each value in a range result is a `[timestamp, line]` pair, with the timestamp as a nanosecond string. There's no cursor: a result that reaches `--limit`, or the server's cap of 10,000 lines, may be incomplete. Narrow the window or the selector to get everything.

List the services that logged on the branch in the last six hours:

```bash
neon logs loki --endpoint label/service_name/values --since 6h
```

Query function log lines that contain `invoke end`:

```bash
neon logs loki '{entity_type="function"} |= "invoke end"' --since 6h --limit 2
```

<details>
<summary>Show output</summary>

```json
{
  "status": "success",
  "data": {
    "resultType": "streams",
    "result": [
      {
        "stream": {
          "entity_type": "function",
          "scope_name": "neon.function.request",
          "service_name": "neon-function/todos",
          "severity_text": "INFO"
        },
        "values": [
          [
            "1793993911665404000",
            "invoke end"
          ],
          [
            "1793993910924177000",
            "invoke end"
          ]
        ]
      }
    ]
  }
}
```

</details>

## Loki-compatible read API (#loki-read-api)

The same branch logs are also readable over HTTP through a Loki-compatible endpoint, for tools that speak the [Loki](https://grafana.com/docs/loki/latest/reference/loki-http-api/) query API directly rather than through the CLI. [`neon logs loki`](#loki) calls the same endpoints from the terminal. Authenticate with a Neon API key as a bearer token, against this branch-scoped base URL:

```text
https://console.neon.tech/telemetry/v1/projects/{project_id}/branches/{branch_id}/loki
```

It exposes a read-only subset of the Loki HTTP API:

- `GET /api/v1/query_range`: query log lines over a window. Supports LogQL stream selectors and line filters, `since` or `start`/`end`, `limit`, and `direction`. It does not support aggregations, parsers, or formatting stages.
- `GET /api/v1/labels`: list the available stream labels (for example `entity_type`, `service_name`, `severity_text`).
- `GET /api/v1/label/{name}/values`: list the values a label carries (for example `entity_type` returns `function` and `storage`).

```bash
curl "https://console.neon.tech/telemetry/v1/projects/$PROJECT_ID/branches/$BRANCH_ID/loki/api/v1/labels" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

The stream label is `entity_type` (not `--source`), so a LogQL selector reads `{entity_type="function"}`. This is a read-only subset, not a push endpoint or a complete Loki deployment. A Loki client that builds its own paths may need a different root: a Grafana data source, for example, appends `/loki/api/v1` to whatever URL it is given. Confirm the data-source URL against this base rather than pasting it verbatim.

Like the CLI, this API reads logs only on branches in a supported region: AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), or AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Support is expanding toward all regions. A branch in any other region returns `404`.
