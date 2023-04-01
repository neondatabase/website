---
title: Supported PostgreSQL Extensions
subtitle: 
enableTableOfContents: true
---

The pgvector extension is a versatile tool for implementing vector similarity search and embeddings storage in PostgreSQL databases. Particularly beneficial for applications involving natural language processing, such as those built on top of OpenAI's GPT models, pgvector offers a range of advanced features and options for optimization. In this article, we will cover the concepts of vector similarity and embeddings, explain how to enable and optimize the pgvector extension, and demonstrate how to create tables, store, and query vectors effectively in a cloud-hosted PostgreSQL database.

## Concepts

### Vector similarity

Vector similarity quantifies the similarity between two related items, such as products or documents, by representing each item as a vector of numbers derived from a mathematical model. Applicable to various data types, including text and images, vector similarity calculations can be fine-tuned using different distance metrics and normalization techniques.

### Embeddings

Embeddings facilitate the representation of complex data structures, such as text, in a lower-dimensional vector space. Generated using machine learning models like OpenAI's GPT models, embeddings are especially useful for natural language processing tasks, as they capture semantic information in a compact form.

## Enabling and optimizing pgvector extension

You can enable the pgvector extension by running the following CREATE EXTENSION statement in the Neon SQL Editor or from a client such as psql that is connected to Neon.

```sql
CREATE EXTENSION pgvector
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](https://neon.tech/docs/connect/query-with-psql-editor).

## Creating a table to store vectors

To create a table for storing vectors, use the following SQL command, adjusting the dimensions as needed:

```sql
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  embedding VECTOR(1536)
);
```

This command generates a table named `items` with an `embedding` column capable of storing vectors with 1536 dimensions.

## Storing vectors and embeddings

Once you have generated an embedding using a service like the OpenAI API, you can store the resulting vector in the database. Using a PostgreSQL client library in your preferred programming language, execute an `INSERT` statement:

```sql
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

This command inserts two new rows into the items table with the provided embeddings.

## Querying vectors

To retrieve vectors and calculate similarity, use SQL SELECT statements and the built-in vector operators. For instance, you can find the top 5 most similar items to a given embedding using the following query:

```sql
SELECT * FROM items ORDER BY embedding <-> '[1, 2, 3, ..., 1536]' LIMIT 5;
```

his query computes the Euclidean distance (L2 distance) between the given vector and the vectors stored in the items table, sorts the results by the calculated distance, and returns the top 5 most similar items. Alternatively, you can use other distance metrics, such as cosine similarity or Manhattan distance, to fine-tune the similarity search.

## Indexing vectors

For optimal performance, consider tuning the PostgreSQL configuration parameters, such as shared_buffers, work_mem, and maintenance_work_mem. Moreover, using an index on the vector column can significantly improve query performance. For example, you can create an index on the "embedding" column using the following SQL command:

```sql
CREATE INDEX items_embedding_idx ON items USING gin(embedding);
```

## Conclusion

The `pgvector` extension is a powerful addition to PostgreSQL databases for implementing vector similarity searches and managing embeddings. By understanding the underlying concepts, enabling the extension, and tuning the database configuration, you can harness the full potential of `pgvector` for a wide range of applications, including those built on top of cutting-edge machine learning models such as OpenAI's GPT models. With the ability to create tables specifically designed to store vectors, store embeddings effectively, and perform advanced queries to calculate similarity, `pgvector` is a valuable tool for anyone working with PostgreSQL databases.

## Resources

- [pgvector source code: github.com/pgvector/pgvector](github.com/pgvector/pgvector)
