### Improvements and fixes

- Pageserver: Added `disk_size` and `instance_type` properties to the Pageserver API. This data is required to support assigning Neon projects to Pageservers based on Pageserver disk usage.
- Proxy: Added error reporting for unusually low `proxy_io_bytes_per_client metric` values.
- Proxy: Added support for additional domain names to enable partner integrations with Neon.
- Safekeeper: The `wal_backup_lsn` is now advanced after each WAL segment is offloaded to storage to avoid lags in WAL segment cleanup.
- Safekeeper: Added a timeout for reading from the socket in the Safekeeper WAL service to avoid an accumulation of waiting threads.

### Bug fixes

- Pageserver: Corrected an issue that caused data layer eviction to occur at a percentage above the configured disk-usage threshold.
- Proxy: The passwordless authentication proxy ignored non-wildcard common names, passing a `None` value instead. A non-wildcard common name is now set, and an error is reported if a `None` value is passed.
