---
title: The pgvector extension
subtitle: Learn how to use the pgvector extension for embeddings and vector similarity
enableTableOfContents: true
isDraft: true
---

The `pgvector` extension enables vector similarity search and embeddings storage in PostgreSQL. It is particularly useful for applications involving natural language processing, such as those built on top of OpenAI's GPT models. This article covers the concepts of vector similarity and embeddings, explains how to enable the `pgvector` extension, and demonstrates how to create, store, and query vectors.

## Concepts

### Vector similarity

Vector similarity is a method used to measure how similar two items are by representing them as vectors, which are series of numbers. This approach can be applied to various types of data, such as words, images, or other elements. By using a mathematical model, each item is converted into a vector, and then these vectors are compared to determine their similarity. The closer the vectors are in terms of distance, the more alike the items.

### Embeddings

An embedding is a way to represent data points (such as words, images, or other elements) as vectors. Embeddings help capture the relationships and similarities between data points, making it easier for machine learning algorithms to process and analyze them.

A simple example involves word embeddings for natural language processing. Suppose you have three words: "apple", "orange", and "car". We can represent each word as a vector in a 2-dimensional space:

Apple: (1.2, 0.8)
Orange: (1.1, 0.9)
Car: (0.3, 1.5)

In this 2D space, the vectors for "apple" and "orange" are close together, indicating that they are more similar to each other than they are to "car". This embedding has captured the relationship between these words in a way that a machine learning algorithm can understand and use.

## Enable the pgvector extension

You can enable the `pgvector` extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION vector;
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
