> [!NOTE]
> In Neon, a **compute endpoint** is the Postgres compute instance attached to a [branch](#tag/branch), not an HTTP endpoint. Your applications connect to it over the standard Postgres protocol.

A compute endpoint runs your Postgres workload. Each branch has one `read_write` endpoint and can have any number of `read_only` endpoints (used for read replicas and analytics).

Computes [scale to zero](https://neon.com/docs/guides/scale-to-zero-guide) after 5 minutes of inactivity by default, and wake automatically on the next connection. You can tune the timeout via `suspend_timeout_seconds`.

## When to use this API

Use these endpoints to create, configure, restart, or delete computes. Typical cases: adding read replicas, tuning compute size, or changing scale-to-zero behavior. The [Neon Console](https://console.neon.tech) and [Neon CLI](https://neon.com/docs/reference/neon-cli) cover the same operations for interactive work.

See [Manage compute endpoints](https://neon.com/docs/manage/computes) for configuration details and [Read replicas](https://neon.com/docs/introduction/read-replicas) for the read-only variant.
