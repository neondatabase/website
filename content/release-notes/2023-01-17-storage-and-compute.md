### What's new

- Compute: Added support for several PostgreSQL extensions. Newly supported extensions include:
  - `bloom`
  - `pgrowlocks`
  - `intagg`
  - `pgstattuple`
  - `earthdistance`
  - `address_standardizer`
  - `address_standardizer_data_us`
  
  For more information about PostgreSQL extensions supported by Neon, see [PostgreSQL extensions](/docs/extensions/pg-extensions).
- Compute: The `pg8000` Python PostgreSQL driver, version 1.29.3 and higher, now supports connecting to Neon.
- Compute: Added statistics to `EXPLAIN` that show prefetch hits and misses for sequential scans.
- Proxy: Updated the error message that is reported when attempting to connect from a client or driver that does not support Server Name Indication (SNI). For more information about the SNI requirement, see [Connection errors](/docs/connect/connection-errors). Previously, the error message indicated that the "Project ID" is not specified. The error message now states that the "Endpoint ID" is not specified. Connecting to Neon with a Project ID remains supported for backward compatibility, but connecting with an Endpoint ID is now the recommended connection method. For general information about connecting to Neon, see [Connect from any application](/docs/connect/connect-from-any-app/).
