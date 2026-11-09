# Logs: CLI, Loki, and SDK pagination

Neon exposes branch-scoped logs. **Today they cover Neon Functions and Object Storage only.** Postgres computes and the AI Gateway are coming; until then, neither emits records. Logs are available in `aws-us-east-2`, `aws-us-east-1`, `aws-eu-central-1`, and `aws-ap-southeast-1`. A branch that can't serve logs at all answers `404` with `reason: telemetry_not_enabled` (the message says whether it's the wrong region or a branch not collecting telemetry yet), versus a `200` empty result when the branch is enabled but has no records in the window; an unknown branch answers `reason: branch_not_found`.

Use Neon CLI 3.1 or newer first. **Decide which branch you are querying.** Without `--branch`, the CLI uses the branch pinned in `.neon`, or the project's default branch when the workspace isn't linked. A deployed function or bucket usually lives on a different branch than the one checked out for development, so an empty result is more often the wrong branch than a missing log.

```bash
neon logs query --since 1h
neon logs query --branch production --source function --minimum-severity error --since 6h
neon logs query --source storage --since 1h --output json
neon logs fields
neon logs field-values service_name --since 1h
```

`--source` accepts `function`, `storage`, and `pg_endpoint`, but only `function` and `storage` return records today — `pg_endpoint` is accepted and comes back empty until Postgres logs ship. The window defaults to 1h on `query` and 6h on `field-values`, and cannot exceed 7d on either. If Neon reports `--minimum-severity` as unsupported on a branch, use `--severity-text` instead (an exact, case-sensitive match, e.g. `ERROR`); severities vary by source, so confirm what a branch carries with `neon logs field-values severity_text`. Run `neon logs --help` for the full filter and pagination interface.

`--logql` replaces the structured filters with a raw stream selector or line filter. Its stream label is `entity_type`, not `source`:

```bash
neon logs query --since 1h --logql '{entity_type="function"} |= "timeout"'
```

`neon logs loki` (Neon CLI 9.1 or newer) reads the same records through the Loki-compatible API below and prints Loki's JSON response: lines grouped by stream labels, with nanosecond timestamp strings where `logs query` rounds to the second. Use it when ordering within a second matters or a tool expects Loki output:

```bash
neon logs loki '{entity_type="function"} |= "timeout"' --since 30m --limit 100
neon logs loki --endpoint labels
neon logs loki '{entity_type="function"}' --endpoint label/scope_name/values --since 6h
```

It has no cursor. A result with `--limit` lines, or 10,000 lines (the server's cap, which adds no `warnings` entry), may be incomplete, so narrow `--since` or the selector instead of trusting it as complete.

If the CLI is unavailable, fall back to the Neon MCP server's read-only `query_logs`, `query_loki_logs`, `list_log_fields`, and `list_log_field_values` tools.

## Loki-compatible read API

For direct HTTP reads, authenticate with `Authorization: Bearer <NEON_API_KEY>` and use this branch-scoped base URL:

```text
https://console.neon.tech/telemetry/v1/projects/{projectId}/branches/{branchId}/loki
```

The available endpoints are:

- `GET /api/v1/query_range`
- `GET /api/v1/labels`
- `GET /api/v1/label/{name}/values`

This is a read-only Loki-compatible subset, not a push endpoint or complete Loki deployment. `query_range` supports LogQL stream selectors and line filters, plus `since` or `start`/`end`, `limit`, and `direction`; it does not support aggregations, parsers, or formatting stages.

The paths above are the ones to call directly. A Loki client that builds its own paths — a Grafana data source appends `/loki/api/v1` to whatever URL it is given — may need a different root, so confirm the data-source URL against the Neon docs rather than pasting this base.

In TypeScript applications, use `@neon/sdk`. Every method takes one named parameter object, and `query` returns a lazy paginated iterable rather than a promise:

```typescript
for await (const record of neon.logs.query({
  projectId,
  branchId,
  since: "1h",
  source: "function",
})) {
  console.log(record.timestamp, record.severity_text, record.message);
}

const { data: fields } = await neon.logs.fields({ projectId, branchId });
const { data: serviceNames } = await neon.logs.fieldValues({
  projectId,
  branchId,
  fieldName: "service_name",
});
```

`query`'s iterator always throws on error, but `fields` and `fieldValues` follow the client's `throwOnError`, which defaults to `false` and hands back `{ data, error }`. `fieldValues` resolves to the whole response, not a bare array: read `serviceNames.values`, and treat them as an arbitrary subset whenever `serviceNames.is_truncated` is true.

`neon.logs.loki` (`@neon/sdk` 7.11 or newer) calls the Loki-compatible API with the client's key and returns Loki's response body unchanged:

```typescript
const { data, error } = await neon.logs.loki.queryRange({
  projectId,
  branchId,
  query: '{entity_type="function"} |= "timeout"',
  since: "30m",
  limit: 100,
});
if (error) throw error;
for (const { stream, values } of data.data.result) {
  for (const [timestampNs, line] of values) console.log(timestampNs, stream.service_name, line);
}

await neon.logs.loki.labels({ projectId, branchId });
await neon.logs.loki.labelValues({ projectId, branchId, name: "service_name" });
```

A rejected query, such as one with a parser stage, comes back as a `NeonApiError` carrying Loki's message.
