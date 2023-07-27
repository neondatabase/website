---
title: Choosing a vector search extension
subtitle: Neon supports pg_embedding and pgvector search extensions
enableTableOfContents: true
isDraft: true
---

When building AI applications with Neon, there are two extensions you can use to enable PostgreSQL as a vector database: `pgvector` and `pg_embedding`.

The `pg_embedding` extension is based on the Hierarchical Navigable Small World (HNSW) algorithm for graph-based approximate nearest neighbor search. It shines particularly in high-dimensional vector spaces, providing faster query times and superior recall rates compared to many other methods. However, it currently only supports L2 distance and may have higher memory requirements due to the graph-based nature of the HNSW algorithm.

The `pgvector` extension, designed for vector similarity search, is straightforward to use and versatile in the variety of indexing methods it supports. Notably, it includes options for both exact search (via Brute-Force) and approximate search (via Product Quantization (PQ) or the Inverted File (IVF) methods). It also offers multiple distance metrics such as Euclidean distance (L2), Cosine similarity, and Dot product (inner product), catering to a wide array of use cases.

The choice between `pg_embedding` `pgvector` and  depends largely on your specific needs. Factors such as the dimensionality of your data, speed requirements, memory constraints, desired accuracy, and preferred distance metric all influence which extension is the best fit for your application.

For a detailed comparison of `pgvector` and `pg_embedding`, you can refer to the dedicated section in the `pg_embedding` guide titled [Comparing pgvector and pg_embedding](#comparing-pgvector-and-pgembedding). This section provides a comprehensive comparison between the two extensions in terms of search speed, accuracy, memory usage, index construction speed, and distance metrics.

Both `pgvector` and `pg_embedding` extensions are supported by Neon and have rich documentation and support resources to help you get started and troubleshoot any issues.
