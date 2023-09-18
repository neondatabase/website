---
title: AI Concepts
subtitle: Learn about embeddings and how they are used to build AI and LLM applications
enableTableOfContents: true
---

Embeddings are an essential component in building AI applications. Ths topic describes embeddings and how they are used in building AI and LLM applications.

## What are embeddings?

When working with unstructured data, a common objective is to transform it into a more structured format that is easier to analyze and retrieve. This transformation can be achieved through the use of 'embeddings', which are vectors containing an array of floating-point numbers that represent the features or dimensions of the data. For example, a sentence like "The cow jumped over the moon" could be represented by an embedding that looks like this: [0.5, 0.3, 0.1].

The advantage of embeddings is that they allow us to measure the similarity between different pieces of text. By calculating the distance between two embeddings, we can assess their relatedness - the smaller the distance, the greater the similarity, and vice versa. This quality is particularly useful as it enables embeddings to capture the underlying meaning of the text.

Take the following three sentences, for example:

- Sentence 1: "The cow jumped over the moon."
- Sentence 2: "The bovine leapt above the celestial body."
- Sentence 3: "I enjoy eating pancakes."

You can determine the most similar sentences by following these steps:

1. Generate embeddings for each sentence. For illustrative purposes, assume these values represent actual embeddings:

    - Embedding for sentence 1 → [0.5, 0.3, 0.1]
    - Embedding for sentence 2 → [0.6, 0.29, 0.12]
    - Embedding for sentence 3 → [0.1, -0.2, 0.4]

2. Compute the distance between all pairs of embeddings (1 & 2, 2 & 3, and 1 & 3).

3. Identify the pair of embeddings with the shortest distance between them.

When we apply this process, it is likely that sentences 1 and 2, both of which involve bounding cattle, would emerge as the most related according to a distance calculation.

## Vector similarity search

The method of transforming data into embeddings and computing similarities between one or more items is referred to as vector search or similarity search. This process has a wide range of applications, including but not limited to:

- **Information retrieval:** By representing user queries as vectors, we can perform more accurate searches based on the meaning behind the queries, allowing us to retrieve more relevant information.
- **Natural language processing:** Embeddings capture the essence of the text, making them excellent tools for tasks such as text classification and sentiment analysis.
- **Recommendation systems:** Using vector similarity, we can recommend items that are similar to a given item, whether they be movies, products, books, or otherwise. This technique allows us to create more personalized and relevant recommendations.
- **Anomaly detection:** By determining the similarity between items within a dataset, we can identify outliers or anomalies—items that don't quite fit the pattern. This can be crucial in many fields, from cybersecurity to quality control.

### Distance metrics

Vector similarity search computes similarities (the distance) between data points. Calculating how 'far apart' data points are helps us understand the relationship between them. Distance can be computed in different ways using different metrics. Some popular distance metrics include:

- Euclidean (L2): Often referred to as the "ordinary" distance you'd measure with a ruler.
- Manhattan (L1): Also known as "taxicab" or "city block" distance.
- Cosine: This calculates the cosine of the angle between two vectors.

Different distance metrics can be more appropriate for different tasks, depending on the nature of the data and the specific relationships you're interested in. For instance, cosine similarity is often used in text analysis.

## Generating embeddings

A common approach to generate embeddings is to use OpenAI’s Embeddings API. This API allows you to input a text string into an API endpoint, which then returns the corresponding embedding. The "cow jumped over the moon" example above is a simplistic example with 3 dimensions. Most embedding models generate a much larger number of embeddings. OpenAI's `text-embedding-ada-002` model, for example, generates 1536 embeddings.

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

To learn more about OpenAI's embeddings, see [Embeddings](https://platform.openai.com/docs/guides/embeddings).

## Storing vector embeddings in Postgres

Neon supports the [pgvector](/docs/extensions/pgvector) and [pg_embedding](/docs/extensions/pg_embedding) Postgres extensions, which enable storing and retrieving vector embeddings directly within your Postgres database. When building AI and LLM applications, installing either of these extensions eliminates the need to build out your architecture to include a separate vector store.

After installing an extension, you can create a table to store your embeddings. For example, if you install the `pgvector` extension, you might define a table similar to the following to store your embeddings:

```sql
CREATE TABLE items(id BIGSERIAL PRIMARY KEY, embedding VECTOR(1536));
```

To add embeddings to the table, you would insert the data as shown:

```sql
INSERT INTO items(embedding) VALUES ('[
    -0.006929283495992422,
    -0.005336422007530928,
    ...
    -4.547132266452536e-05,
    -0.024047505110502243
]');
```

## Building AI apps with embeddings

The concepts described above provide an introduction to the basic building blocks for developing an AI application with embeddings. You can see how they fit with the general process, which involves these steps:

1. Generate embeddings from your data
2. Store the embeddings in your database
3. Build an interface that prompts for user for input
4. Generate an embedding for the provided user input
5. Perform a similarity search that compares the embedding generated for the provided input against the embeddings stored in your database
6. Return the most similar data to the user

For example applications built based on this general process, see the following:

<DetailIconCards>
<a href="https://github.com/neondatabase/yc-idea-matcher" description="Build an AI-powered semantic search application" icon="github">Semantic search app</a>
<a href="https://github.com/neondatabase/ask-neon" description="Build an AI-powered chatbot with pgvector" icon="github">Chatbot app</a>
</DetailIconCards>
