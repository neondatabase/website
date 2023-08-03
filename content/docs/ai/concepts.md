---
title: Concepts
subtitle: Learn about vector embeddings and how they are a core component in building AI applications
enableTableOfContents: true
isDraft: true
---

Vector embeddings are an essential component in building AI applications. Ths topic describes what vector embeddings are and how they are used in building AI applications.

## What are embeddings?

When dealing with unstructured data, such as text, images, or audio, a common objective is to transform it into a more structured format that is easier to analyze and retrieve. This transformation can often be achieved through the use of 'embeddings', which are essentially vectors containing floating-point numbers that represent the data. For instance, a sentence like "The astronaut explores space" might be represented by the followign vector embedding: [0.3, 0.8, -0.9].

A key advantage of embeddings is that they allow us to measure similarity between different text strings. By calculating the distance between two vectors, we can assess their relatedness - the smaller the distance, the greater the similarity, and vice versa. This quality is particularly useful as it enables embeddings to capture the underlying meaning of the text.

Let's take the following three phrases that summarize different movie plots:

- Plot 1: "An astronaut embarks on a perilous interstellar voyage to save humanity."
- Plot 2: "Scientists create a theme park with genetically engineered dinosaurs."
- Plot 3: "A renegade computer hacker unravels a reality-altering conspiracy."

Our aim is to ascertain which two plot summaries bear the greatest resemblance, by following these steps:

1. We first generate embeddings for each plot:
   - Embedding for Plot 1 → [0.1, 0.1, 0.1]
   - Embedding for Plot 2 → [-0.2, 0.2, 0.3]
   - Embedding for Plot 3 → [0.3, -0.2, 0.4]

2. We then compute the distance between all pairs of embeddings (Plot 1 & Plot 2, Plot 2 & Plot 3, and Plot 1 & Plot 3).

The pair of embeddings with the shortest distance between them are identified as the most similar.

When we apply this process to our movie plots, it is likely that Plots 1 and 3, both of which involve high-tech scenarios and survival themes, would emerge as the most related according to our calculations.

## Vector similarity search

The method of transforming data into embeddings and computing similarities between one or more items is referred to as vector search or similarity search. This process has a wide range of applications, including but not limited to:

- **Information Retrieval:** By representing user queries as vectors, we can perform more accurate searches based on the meaning behind the queries, allowing us to retrieve more relevant information.
- **Natural Language Processing:** Embeddings capture the essence of the text, making them excellent tools for tasks such as text classification and sentiment analysis.
- **Recommendation Systems:** Using vector similarity, we can recommend items that are similar to a given item, whether they be movies, products, books, or otherwise. This technique allows us to create more personalized and relevant recommendations.
- **Anomaly Detection:** By determining the similarity between items within a dataset, we can identify outliers or anomalies—items that don't quite fit the pattern. This can be crucial in many fields, from cybersecurity to quality control.

Through the lens of these applications, the power of vector similarity search in structuring and understanding unstructured data becomes evident.

## Generating embeddings

A common approach to generate embeddings is by using OpenAI’s Embeddings API. This API allows you to input a text string into an API endpoint, which then returns the corresponding vector embedding. Here's an example of how to use it:

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-ada-002"
  }'
```

Upon successful execution, you'll receive a response in the following format:

```json
{
  "data": [
    {
      "embedding": [
        -0.006929283495992422,
        -0.005336422007530928,
        ...
        -4.547132266452536e-05,
        -0.024047505110502243
      ],
      "index": 0,
      "object": "embedding"
    }
  ],
  "model": "text-embedding-ada-002",
  "object": "list",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
```

## Storing vector embeddings in PostgreSQL

Neon supports the PostgreSQL extensions `pg_embedding` and `pgvector` extensions, which enable the storage and retrieval of vector embeddings directly within your Postgres database. When building AI and LLM applications, installing either of these extensions eliminate the need for an external vector store, streamlining your architecture and reducing system complexity.

After installing an extension, you can create a table to store your vector embeddings. For example, if you installed the `pg_embedding` extension, you might define the following table for your vector embeddings:

```sql
CREATE TABLE documents(id BIGSERIAL PRIMARY KEY, embedding REAL[1536]);
```

And to add vector embedding to the table, you would insert the data as follows:

```sql
INSERT INTO documents(embedding) VALUES (ARRAY[
    -0.006929283495992422,
    -0.005336422007530928,
    ...
    -4.547132266452536e-05,
    -0.024047505110502243
]);
```
