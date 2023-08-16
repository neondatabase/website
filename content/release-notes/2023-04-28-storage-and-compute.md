### Support for the US East (N. Virginia) region

Added support for the `US East (N. Virginia) — aws-us-east-1` region. For more information about Neon's region support, see [Regions](/docs/introduction/regions).

### Postgres extension support

- Added support for the `ip4r` and `pg_hint_plan` extensions. For more information about Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions).

### Improvements and fixes

- Compute: Added support for `lz4` and `zstd` WAL compression methods.
- Compute: Added support for `procps`, which is a set of utilities for process monitoring.
- Pageserver: Implemented `syscalls` changes in the WAL redo `seccomp` (secure computing mode) code to ensure AArch64 support.
