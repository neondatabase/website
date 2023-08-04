---
title: AI Concepts
subtitle: Learn about embeddings and how they are used to build AI and LLM applications
enableTableOfContents: true
isDraft: true
---

Embeddings are an essential component in building AI applications. Ths topic describes embeddings and how they are used in building AI and LLM applications.

## What are embeddings?

When working with unstructured data, such as text, images, or audio, a common objective is to transform it into a more structured format that is easier to analyze and retrieve. This transformation can often be achieved through the use of 'embeddings', which are vectors containing an array of floating-point numbers that represent the features or dimensions of the data. For illustrative purposes, you can imagine a sentence like "The cow jumped over the moon" being represented by the following embedding: [0.5, 0.3, 0.1].

A key advantage of embeddings is that they allow us to measure similarity between different text strings. By calculating the distance between two embeddings, we can assess their relatedness - the smaller the distance, the greater the similarity, and vice versa. This quality is particularly useful as it enables embeddings to capture the underlying meaning of the text.

Take the following three sentences, for example:

- Sentence 1: "The cow jumped over the moon."
- Sentence 2: "The bovine leapt above the celestial body."
- Sentence 3: "I enjoy eating pancakes."

The goal is to determine which two sentences are the most similar, by following these steps:

1. Generate embeddings for each sentence. For illustrative purposes, assume these values represent actual embeddings:

- Embedding for sentence 1 → [0.5, 0.3, 0.1]
- Embedding for sentence 2 → [0.6, 0.29, 0.12]
- Embedding for sentence 3 → [0.1, -0.2, 0.4]

2. Compute the distance between all pairs of embeddings (1 & 2, 2 & 3, and 1 & 3).

3. Identifying the pair of embeddings with the shortest distance between them.

When we apply this process to our sentences, it is likely that sentences 1 and 2, both of which involve bounding cattle, would emerge as the most related according to our calculations.

## Vector similarity search

The method of transforming data into embeddings and computing similarities between one or more items is referred to as vector search or similarity search. This process has a wide range of applications, including but not limited to:

- **Information Retrieval:** By representing user queries as vectors, we can perform more accurate searches based on the meaning behind the queries, allowing us to retrieve more relevant information.
- **Natural Language Processing:** Embeddings capture the essence of the text, making them excellent tools for tasks such as text classification and sentiment analysis.
- **Recommendation Systems:** Using vector similarity, we can recommend items that are similar to a given item, whether they be movies, products, books, or otherwise. This technique allows us to create more personalized and relevant recommendations.
- **Anomaly Detection:** By determining the similarity between items within a dataset, we can identify outliers or anomalies—items that don't quite fit the pattern. This can be crucial in many fields, from cybersecurity to quality control.

## Generating embeddings

A common approach to generate embeddings is to use OpenAI’s Embeddings API. This API allows you to input a text string into an API endpoint, which then returns the corresponding embedding. The "The cow jumped over the moon" example above is a simple example with 3 dimensions. Most embedding models generate a much larger number of embeddings. OpenAI's `text-embedding-ada-002` model, for example, generates 1536 embeddings.

Here's an example of how to use OpenAI's `text-embedding-ada-002` model to generate an embedding:

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-ada-002"
  }'
```

<Admonition type="note">
Running the command above requires an OpenAI API key, which must be obtained from [OpenAI](https://platform.openai.com/).
</Admonition>

Upon successful execution, you'll receive a response similar to the following:

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        -0.007009038,
        -0.0053659794,
        ...
        -0.00010458116,
        -0.024071306
      ]
    }
  ],
  "model": "text-embedding-ada-002-v2",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
```

To learn more about about OpenAI's embeddings, see [Embeddings](https://platform.openai.com/docs/guides/embeddings).

## Storing vector embeddings in PostgreSQL

Neon supports the [pg_embedding](/docs/extensions/pg_embedding) and [pgvector](/docs/extensions/pgvector) PostgreSQL extensions, which enable the storage and retrieval of vector embeddings directly within your Postgres database. When building AI and LLM applications, installing either of these extensions eliminate the need for an external vector store, streamlining your architecture and reducing system complexity.

After installing an extension, you can create a table to store your vector embeddings. For example, if you installed the `pg_embedding` extension, you might define the following table for your vector embeddings:

```sql
CREATE TABLE documents(id BIGSERIAL PRIMARY KEY, embedding REAL[1536]);
```

To add vector embedding to the table, you would insert the data as shown:

```sql
INSERT INTO documents(embedding) VALUES (ARRAY[
    -0.006929283495992422,
    -0.005336422007530928,
    ...
    -4.547132266452536e-05,
    -0.024047505110502243
]);
```

## Building AI apps with embeddings

When building your AI application, you will generally follow this set of steps:

1. Generate embeddings from your data
2. Store the embeddings in your database
3. Build an interface that prompts for user for input
4. Generate an embedding for the provided user input
5. Perform a similarity search that compares the embedding generated for the provided input against the embeddings stored in your database
6. Return the most similar data to the user

For example applications built using this general process, see the following:

<DetailIconCards>
<a href="https://github.com/neondatabase/yc-idea-matcher" description="Build an AI-powered semantic search application with pg_embedding" icon="github">Semantic search app</a>
<a href="https://github.com/neondatabase/ask-neon" description="Build an AI-powered chatbot with pgvector" icon="github">Chatbot app</a>
</DetailIconCards>
