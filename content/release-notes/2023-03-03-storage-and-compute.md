### Improvements and fixes

- Compute: Added support for the Postgres `rum` and `pgTAP` extensions. For more information about Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions/).
- Pageserver: A system metric that monitors physical data size overflowed when a garbage collection operation was performed on an evicted data layer.
- Pageserver: An index upload was skipped when a compaction operation did not perform an on-demand download from storage. With no on-demand downloads, the compaction function would exit before scheduling the index upload.
