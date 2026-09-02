---
title: 'Neon CLI command: logs'
tag: new
tagTheme: green
subtitle: Query the logs a branch's services emit
summary: >-
  The Neon CLI `neon logs` command reads the logs a branch's services emit.
  Today that covers Neon Functions and Object Storage; Postgres compute logs
  are coming. Query records over a time
  window, filter by source, severity, or OpenTelemetry attributes, run raw
  LogQL, and list which fields and values a branch reports. Logs are in beta
  and available in AWS US East (Ohio) (aws-us-east-2) and AWS Europe
  (Frankfurt) (aws-eu-central-1).
enableTableOfContents: true
updatedOn: '2026-09-02T15:10:53.712Z'
---

<FeatureBeta />

The `logs` command reads the logs a branch's services emit. Today that covers Neon Functions and Object Storage; Postgres compute logs are coming. Query records over a time window, filter by source, severity, or OpenTelemetry attribute, and list which fields and values a branch reports so you can build precise filters.

Logs are in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`), so your project must be in one of these regions to use them. Support is expanding toward all regions.

Every subcommand resolves the project and branch from your [context](/docs/cli/set-context). Pass `--project-id` and `--branch` to target a specific branch instead.

<CliSubcommands command="logs" />

## neon logs query (#query)

Query log records over a time window. By default it returns the last hour of logs on the default branch, newest first.

<CliUsage command="logs query" />

<CliOptions command="logs query" />

Bound the window with `--since` (a duration like `30m` or `1h`, ending at `--end-time` or now) or with an explicit `--start-time`/`--end-time` pair. `--since` and `--start-time` are mutually exclusive, and the maximum window is 7 days.

The structured content filters (`--source`, `--service-name`, `--scope-name`, `--severity-text`, `--body-contains`, and `--trace-id`) combine with each other. Passing `--logql` replaces all of them with a raw [LogQL](https://grafana.com/docs/loki/latest/query/) expression (stream selectors and line filters only); the window, `--limit`, `--sort-order`, and `--cursor` still apply.

`--source` accepts `function`, `storage`, and `pg_endpoint`. Only `function` and `storage` return records today; `pg_endpoint` (Postgres compute) is accepted but comes back empty until Postgres logs ship.

Filter by severity with `--severity-text`, which matches the exact, case-sensitive value a record carries (for example `ERROR` or `INFO`, uppercase). Severities vary by source, so a filter can legitimately return nothing: storage logs are S3 access records and are all `INFO`, so `--source storage --severity-text ERROR` matches none. Run `neon logs field-values severity_text` to see the values a branch actually reports before filtering. `--minimum-severity` (match a level and everything above it) is not supported by the branch log backend; use `--severity-text` for an exact match instead.

```bash
neon logs query --since 30m
```

Filter function errors on a specific branch:

```bash
neon logs query --branch main --source function --severity-text ERROR
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

## Loki-compatible read API (#loki-read-api)

The same branch logs are also readable over HTTP through a Loki-compatible endpoint, for tools that speak the [Loki](https://grafana.com/docs/loki/latest/reference/loki-http-api/) query API directly rather than through the CLI. Authenticate with a Neon API key as a bearer token, against this branch-scoped base URL:

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

Like the CLI, this API reads logs only on branches in a supported region: AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`) during the beta period. Support is expanding toward all regions. A branch in any other region returns `404`.
