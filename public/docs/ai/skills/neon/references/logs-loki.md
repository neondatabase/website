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

If the CLI is unavailable, fall back to the Neon MCP server's read-only `query_logs`, `list_log_fields`, and `list_log_field_values` tools.

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

In TypeScript applications, use `@neon/sdk`. Project and branch are positional, and `query` returns a lazy paginated iterable rather than a promise:

```typescript
for await (const record of neon.logs.query(projectId, branchId, {
  since: "1h",
  source: "function",
})) {
  console.log(record.timestamp, record.severity_text, record.message);
}

const { data: fields } = await neon.logs.fields(projectId, branchId);
const { data: serviceNames } = await neon.logs.fieldValues(
  projectId,
  branchId,
  "service_name",
);
```

`query`'s iterator always throws on error, but `fields` and `fieldValues` follow the client's `throwOnError`, which defaults to `false` and hands back `{ data, error }`. `fieldValues` resolves to the whole response, not a bare array: read `serviceNames.values`, and treat them as an arbitrary subset whenever `serviceNames.is_truncated` is true.
