### What's new

- Compute: Added support for the PostgreSQL `rum` and `pgTAP` extensions. For more information about PostgreSQL extensions supported by Neon, see [PostgreSQL extensions](/docs/extensions/pg-extensions/).

### Bug Fixes

- Pageserver: A system metric that monitors physical data size overflowed when a garbage collection operation was performed on an evicted data layer.
- Pageserver: An index upload was skipped when a compaction operation did not perform an on-demand download from storage. With no on-demand downloads, the compaction function would exit before scheduling the index upload.
