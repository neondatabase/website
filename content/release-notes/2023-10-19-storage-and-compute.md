### Support for pgvector 0.5.1

The `pgvector` extension for vector similarity search in Postgres was updated to a newer version:

| Postgres extension           | Old version   | New version   |
|------------------------------|---------------|---------------|
| `pgvector`                   | 0.5.0         | 0.5.1         |

The new version improves HNSW index build performance. For other included in the new version, refer to the [pgvector changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md).

If you installed this extensions previously and want to upgrade to the latest version, please refer to [Update an extension version](/docs/extensions/pg-extensions#update-an-extension-version) for instructions.

For a complete list of Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions).
