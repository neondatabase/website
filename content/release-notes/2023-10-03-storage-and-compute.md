### Postgres extension updates

The following Postgres extensions were updated to a newer version and are now supported with Postgres 16:

| Postgres extension           | Old version   | New version   |
|------------------------------|---------------|---------------|
| `pg_jsonschema`              | 0.1.4         | 0.2.0         |
| `pg_grapgql`                 | 1.1.0         | 1.4.0         |
| `pgx_ulid`                   | 0.1.0         | 0.1.3         |

### Fixes & improvements

- Compute: Fixed an issue that caused an invalid database state after a failed `DROP DATABASE` operation.
