Operations represent background jobs Neon runs to fulfill your API requests: creating branches, starting computes, restoring snapshots, and similar work. Each operation has an ID and a status you can poll.

Status values: `scheduling`, `running`, `finished`, `failed`, `cancelling`, `cancelled`, `skipped`.

See [Getting Started](#tag/getting-started) for the polling pattern and an example response.

## Key constraints

- Neon limits overlapping operations on a single project. Requests that conflict with a running operation return `423 Locked`. Retry with exponential backoff, or wait for the in-flight operation to finish.
- Operations older than 6 months may be pruned from Neon's systems.

See [Operations](https://neon.com/docs/manage/operations) for details and handling guidance.
