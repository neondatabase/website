### What's new

- Pageserver: Improved the check for unexpected trailing data when importing a basebackup, which is tarball with files required to bootstrap a compute node.
- Pageserver: Separated the management and `libpq` configuration, making it possible to enable authentication for only the management HTTP API or the Compute API.
- Pageserver: Reduced the amount of metrics data collected for Pageservers.
- Pageserver, Safekeeper: Removed unused Control Plane code.
- Pageserver: JWT (JSON Web Token) generation is now permitted to fail when running Pageservers with authentication disabled, which enables running without the 'openssl' binary. This change enables switching to the EdDSA algorithm for storing JWT authentication tokens.
- Pageserver: Switched to the EdDSA algorithm for the storage JWT authentication tokens. The Neon Control Plane only supports EdDSA.
- Added metrics that enable detection of data layer eviction thrashing (repetition of eviction and on-demand download of data layers).
- Pageserver, Safekeeper: Revised `$NEON_AUTH_TOKEN` variable handling when connecting from a compute to Pageservers and Safekeepers.
- Safekeeper: Added an internal metric to track bytes written or read in PostgreSQL connections to Safekeepers, which enables monitoring traffic between availability zones.
- Proxy: All compute node connection errors are now logged.

### Bug Fixes

- Pageserver: Fixed an issue that resulted in old data layers not being garbage collected.
- Proxy: Fixed an issue that caused Websocket connections through the Proxy to become unresponsive.
