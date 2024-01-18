### Fixes & improvements

- Pageserver, Safekeeper, Compute, and Proxy: Reduced the size of Neon storage binaries by 50% by removing dependency debug symbols from the release build.
- Pageserver: Moved the Write-Ahead Log (WAL) redo process code from Neon's `postgres` repository to the `neon` repository and created a separate `wal_redo` binary in order to reduce the amount of change in the `postgres` repository codebase.
- Compute: Updated prefetching support to store requests and responses in a ring buffer instead of a queue, which enables using prefetches from many relations concurrently.
- Pageserver and Safekeeper: Removed support for the `--daemonize` option from the CLI process that starts the Pageserver and Safekeeper storage components. The required library is no longer being maintained and the option was only used in our test environment.
- Pageserver: Added a tenant sizing model and an endpoint for retrieving the tenant size.
