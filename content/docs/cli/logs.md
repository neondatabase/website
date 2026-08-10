---
title: 'Neon CLI command: logs'
subtitle: Query the logs a branch's services emit
summary: >-
  The Neon CLI `neon logs` command reads the logs a branch's services emit
  (Postgres compute, storage, and Neon Functions). Query records over a time
  window, filter by source, severity, or OpenTelemetry attributes, run raw
  LogQL, and list which fields and values a branch reports. Logs are in beta
  and available only in AWS US East (Ohio) (aws-us-east-2).
enableTableOfContents: true
updatedOn: '2026-08-10T15:04:49.412Z'
---

<FeatureBeta />

The `logs` command reads the logs a branch's services emit: the Postgres compute, storage, and Neon Functions. Query records over a time window, filter by source, severity, or OpenTelemetry attribute, and list which fields and values a branch reports so you can build precise filters.

Logs are in beta and available only in **AWS US East (Ohio) (`aws-us-east-2`)**, so your project must be in that region to use them.

Every subcommand resolves the project and branch from your [context](/docs/cli/set-context). Pass `--project-id` and `--branch` to target a specific branch instead.

<CliSubcommands command="logs" />

## neon logs query (#query)

Query log records over a time window. By default it returns the last hour of logs on the default branch, newest first.

<CliUsage command="logs query" />

<CliOptions command="logs query" />

Bound the window with `--since` (a duration like `30m` or `1h`, ending at `--end-time` or now) or with an explicit `--start-time`/`--end-time` pair. `--since` and `--start-time` are mutually exclusive, and the maximum window is 7 days.

The structured content filters (`--source`, `--service-name`, `--scope-name`, `--minimum-severity`, `--severity-text`, `--body-contains`, and `--trace-id`) combine with each other. Passing `--logql` replaces all of them with a raw [LogQL](https://grafana.com/docs/loki/latest/query/) expression (stream selectors and line filters only); the window, `--limit`, `--sort-order`, and `--cursor` still apply.

```bash
neon logs query --since 30m
```

Filter Postgres compute errors on a specific branch:

```bash
neon logs query --branch main --source pg_endpoint --minimum-severity error
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
