In Neon, a compute endpoint is the Postgres instance attached to a branch, not an HTTP endpoint. Applications connect over the standard Postgres protocol.

Each branch has one primary read-write compute and can have multiple read-only computes for read replicas. Read replicas read from the same storage as the primary; no data is duplicated. Computes scale to zero after a period of inactivity (5 minutes by default) and wake automatically on the next connection. You can configure the timeout via `suspend_timeout_seconds`.

Use these endpoints to create, configure, restart, or delete computes. Common uses include adding read replicas, tuning compute size, and adjusting scale-to-zero behavior. Note that changing a compute's size restarts the endpoint and briefly disconnects active connections.

See [Manage computes](/docs/manage/computes) and [Read replicas](/docs/introduction/read-replicas) for configuration details.
