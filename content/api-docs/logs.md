Logs from every service on a branch land in one queryable stream. Filter by `source` to scope to functions, storage, or Postgres endpoints. Records follow OpenTelemetry conventions, so you can match on `service_name`, `scope_name`, `severity_text`, or `trace_id`.

Structured filters combine with `AND`, so a record must match every filter. For selections they can't express, supply a raw LogQL expression as `logql`; combining it with any structured filter is rejected rather than ignored.

Give a time window as either `since` or `start_time`, not both; the default window differs per endpoint. The maximum range is seven days, but logs are retained for only 3 days, so a longer range can't return older data. When a response is truncated, pass `next_cursor` back as `cursor`, repeating the range and filters unchanged.

You can also query logs from the CLI with [`neon logs`](/docs/cli/logs).

Logs are in beta. See [Monitor logs](/docs/introduction/monitor-logs) for the Console view and retention details.
