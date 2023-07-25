---
label: 'Storage'
---

### What's new

- Updated the `pgvector` extension to version 0.4.4. If you installed this extension previously and want to upgrade to the latest version, please refer to [Update an extension version](https://neon.tech/docs/extensions/pg-extensions#update-an-extension-version) for instructions.
- Added a check for available memory when creating an Hierarchical Navigable Small World (HNSW) index using the [pg_embedding](https://neon.tech/docs/extensions/pg_embedding) extension. HNSW builds indexes in memory. Insufficient memory for the index size could result in out-of-memory errors. For related information, see [Create an HNSW index](/docs/extensions/pg_embedding#create-an-hnsw-index).
