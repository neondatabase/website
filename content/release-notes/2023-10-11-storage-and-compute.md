### Postgres extension update

The following Postgres extension was updated to a newer version:

| Postgres extension           | Old version   | New version   |
|------------------------------|---------------|---------------|
| `plpgsql_check`              | 2.4.0         | 2.5.3         |

If you installed this extension previously and want to upgrade to the latest version, please refer to [Update an extension version](/docs/extensions/pg-extensions#update-an-extension-version) for instructions.

For a complete list of Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions).

### Fixes & improvements

- Proxy: Increased the maximum request body size for SQL requests over HTTP from 1 MB to 10 MB.
- Proxy: Added a 15 second proxy timeout for SQL requests over HTTP. Long running queries that exceed the 15 second threshold are terminated.
