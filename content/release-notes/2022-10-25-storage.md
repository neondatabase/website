### What's new

- Compute: Added support for PostgreSQL 15.0 and its PostgreSQL extensions.
For information about supported extensions, see [Available PostgreSQL extensions](/docs/extensions/pg-extensions).
- Compute: Disabled the `wal_log_hints` parameter, which is the default PostgreSQL setting. The Pageserver-related issue that required enabling `wal_log_hints` has been addressed, and enabling `wal_log_hints` is no longer necessary.
- Pageserver: Added a timeline `state` field to the `TimelineInfo` struct that is returned by the `timelines` internal management API endpoint. Timeline `state` information improves observability and communication between Pageserver modules.
