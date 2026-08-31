Operations represent background jobs the Neon Control Plane runs to fulfill API requests: creating branches, starting computes, restoring snapshots, and provisioning databases. Some operations are system-initiated, such as suspending idle computes or running periodic availability checks.

Status values: `scheduling`, `running`, `finished`, `failed`, `error`, `cancelling`, `cancelled`, and `skipped`. Terminal statuses are `finished` and `skipped` for successful completion, and `failed`, `error`, and `cancelled` for unsuccessful completion. The remaining statuses are nonterminal.

Neon limits overlapping operations per project. Requests that conflict with a running operation return `423 Locked`; retry with exponential backoff or wait for the in-flight operation to finish. Operations older than 6 months may be pruned.

You can also inspect operations from the CLI with [`neon operations`](/docs/cli/operations).

See [System operations](/docs/manage/operations) for polling guidance, retry examples, and a full list of operation types.
