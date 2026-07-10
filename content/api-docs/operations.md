Operations represent background jobs the Neon Control Plane runs to fulfill API requests: creating branches, starting computes, restoring snapshots, and provisioning databases. Some operations are system-initiated, such as suspending idle computes or running periodic availability checks.

Status values: `scheduling`, `running`, `finished`, `failed`, `cancelling`, `cancelled`, `skipped`. Terminal statuses are `finished`, `skipped`, and `cancelled`. A `failed` operation is not terminal and may be retried.

Neon limits overlapping operations per project. Requests that conflict with a running operation return `423 Locked`; retry with exponential backoff or wait for the in-flight operation to finish. Operations older than 6 months may be pruned.

See [System operations](/docs/manage/operations) for polling guidance, retry examples, and a full list of operation types.
