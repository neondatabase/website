### Graph-based approximate nearest neighbor search in Postgres

Neon is pleased to announce the release of our new [pg_embedding](https://neon.tech/docs/extensions/pg_embedding#pgembedding-extension-github-repository) extension, which enables using the Hierarchical Navigable Small World (HNSW) algorithm for graph-based approximate nearest neighbor search in Postgres and [LangChain](https://python.langchain.com/docs/modules/data_connection/vectorstores/integrations/pgembedding).
![pg_embedding commands](/docs/relnotes/pg_embedding.png)

The `pg_embedding` extension increases speed by up to 20x for 99% accuracy for approximate nearest neighbor search compared to `pgvector`.

Implementing `pg_embedding` in your application involves running a few simple SQL statements. Prior knowledge of vector indexes is optional. To learn more, read the [blog post](https://neon.tech/blog/pg-embedding-extension-for-vector-search), refer to the [pg_embedding](/docs/extensions/pg_embedding) documentation, or checkout the [AI page](https://neon.tech/ai) on our website.

### Improvements and fixes

- Proxy: The wake-up logic for compute nodes was updated to reduce the number of errors returned to clients attempting to connect to Neon. Wake-up logic now supports quicker retries and will skip a connection attempt if failure is expected. Additionally, a 100ms sleep interval and IO error handling were introduced to manage scenarios in which compute nodes are not yet available as they wait for a Kubernetes DNS to be propagated.
