---
title: AI Concepts
subtitle: Learn how embeddings are used to build AI applications
summary: >-
  Embeddings are floating-point vectors that encode semantic meaning from
  unstructured data, enabling similarity search by computing vector distance in
  Postgres. Read this page to understand how embeddings work before building AI
  features such as semantic search, recommendations, or anomaly detection on
  Neon. Topics include distance metrics (Euclidean, Manhattan, cosine),
  generating embeddings with the Neon AI Gateway or OpenAI, storing vectors with
  the pgvector extension, and searching them at scale with Lakebase Search.
enableTableOfContents: true
updatedOn: '2026-09-30T00:39:07.369Z'
---

Embeddings are an essential component in building AI applications. This topic describes embeddings and how they are used, generated, and stored in Postgres.

## What are embeddings?

Embeddings transform unstructured data into a structured format that's easier to analyze and retrieve. They're vectors containing an array of floating-point numbers that represent the features or dimensions of your data. For example, a sentence like "The cow jumped over the moon" might be represented by an embedding that looks like this: [0.5, 0.3, 0.1].

Embeddings let you measure similarity between pieces of text. By calculating the distance between two embeddings, you can assess how related they are — the smaller the distance, the greater the similarity. This quality is particularly useful as it enables embeddings to capture the underlying meaning of the text.

Take the following three sentences, for example:

- Sentence 1: "The cow jumped over the moon."
- Sentence 2: "The bovine leaped above the celestial body."
- Sentence 3: "I enjoy eating pancakes."

You can determine the most similar sentences by following these steps:

1. Generate embeddings for each sentence. For illustrative purposes, assume these values represent actual embeddings:
   - Embedding for sentence 1 → [0.5, 0.3, 0.1]
   - Embedding for sentence 2 → [0.6, 0.29, 0.12]
   - Embedding for sentence 3 → [0.1, -0.2, 0.4]

2. Compute the distance between all pairs of embeddings (1 & 2, 2 & 3, and 1 & 3).

3. Identify the pair of embeddings with the shortest distance between them.

Applying this process, sentences 1 and 2 should come out as most similar (both involve jumping cattle).

## Vector similarity search

Transforming data into embeddings and computing similarities between items is called vector search or similarity search. This process has a wide range of applications, including:

- **Information retrieval:** By representing user queries as vectors, we can perform more accurate searches based on the meaning behind the queries, allowing us to retrieve more relevant information.
- **Natural language processing:** Embeddings capture the essence of the text, making them excellent tools for tasks such as text classification and sentiment analysis.
- **Recommendation systems:** Using vector similarity, we can recommend items similar to a given item, whether they be movies, products, books, or otherwise. This technique allows us to create more personalized and relevant recommendations.
- **Anomaly detection:** By determining the similarity between items within a dataset, we can identify outliers or anomalies (items that don't quite fit the pattern). This can be crucial in many fields, from cybersecurity to quality control.

### Distance metrics

Vector similarity search computes similarities (the distance) between data points. Calculating how far apart data points are helps us understand the relationship between them. Distance can be computed in different ways using different metrics. Some popular distance metrics include:

- Euclidean (L2): Often referred to as the "ordinary" distance you'd measure with a ruler.
- Manhattan (L1): Also known as "taxicab" or "city block" distance.
- Cosine: This calculates the cosine of the angle between two vectors.

Other distance metrics supported by the `pgvector` extension include [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) and [Jaccard distance](https://en.wikipedia.org/wiki/Jaccard_index).

Different distance metrics can be more appropriate for different tasks, depending on the nature of the data and the specific relationships you're interested in. For instance, cosine similarity is often used in text analysis.

## Generating embeddings

A common approach to generating embeddings is to use an embeddings API, such as the [Neon AI Gateway](/docs/ai-gateway/embeddings) or [OpenAI’s Embeddings API](https://platform.openai.com/docs/api-reference/embeddings). These APIs let you input a text string into an API endpoint, which then returns the corresponding embedding. The "cow jumped over the moon" is a simplistic example with 3 dimensions, but most embedding models generate vectors with many more.

The examples below send the same text to each API and get a vector back. Size your `vector` column to match the model you choose.

<Tabs labels={["Neon AI Gateway", "OpenAI"]}>

<TabItem>

The [Neon AI Gateway](/docs/ai-gateway/embeddings) serves embedding models on an OpenAI-compatible endpoint, using the same Neon credential as the rest of your project instead of a separate provider key. Its `qwen3-embedding-0-6b` and `gte-large-en` models return 1024-dimensional vectors.

```bash
curl "$NEON_AI_GATEWAY_BASE_URL/v1/embeddings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -d '{
    "input": "Your text string goes here",
    "model": "qwen3-embedding-0-6b",
    "encoding_format": "float"
  }'
```

The `model` field in the response reports the resolved, versioned model name that served the request:

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        -0.00520731508731842,
        -0.01622946560382843,
        -0.011803247034549713,
        -0.06526501476764679,
        ... (1024 values total, omitted for spacing)
      ]
    }
  ],
  "model": "qwen3-embedding-0-6b-112025",
  "usage": {
    "prompt_tokens": 6,
    "total_tokens": 6
  }
}
```

</TabItem>

<TabItem>

OpenAI's `text-embedding-3-small` and `text-embedding-3-large` models generate 1536- and 3072-dimensional vectors by default. Generating an embedding requires an API key from [OpenAI](https://platform.openai.com/).

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-3-small",
    "encoding_format": "float"
  }'
```

If it works, you'll get a response like this:

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        -0.006929283495992422,
        -0.005336422007530928,
        ... (omitted for spacing)
        -4.547132266452536e-05,
        -0.024047505110502243
      ]
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
```

</TabItem>

</Tabs>

See [Embeddings](/docs/ai-gateway/embeddings) for the full gateway model list and options.

To learn more about OpenAI's embeddings, see [Embeddings](https://platform.openai.com/docs/guides/embeddings). Here, you'll find an example of obtaining embeddings from an [Amazon fine-food reviews](https://www.kaggle.com/datasets/snap/amazon-fine-food-reviews) dataset supplied as a CSV file. See [Obtaining the embeddings](https://platform.openai.com/docs/guides/embeddings/use-cases).

There are many embedding models you can use, such as those provided by Mistral AI, Cohere, Hugging Face, etc. AI tools like [LangChain](https://www.langchain.com/) provide interfaces and integrations for working with a variety of models. See [LangChain: Text embedding models](https://js.langchain.com/v0.1/docs/integrations/text_embedding/). You'll also find a [Neon Postgres guide](https://js.langchain.com/v0.1/docs/integrations/vectorstores/neon/) on the LangChain site and [Class NeonPostgres](https://v02.api.js.langchain.com/classes/langchain_community_vectorstores_neon.NeonPostgres.html), which provides an interface for working with a Lakebase Postgres database.

## Storing vector embeddings in Postgres

Neon supports the [pgvector](/docs/extensions/pgvector) Postgres extension, which enables the storage and retrieval of vector embeddings directly within your Postgres database. When building AI applications, installing this extension eliminates the need to extend your architecture to include a separate vector store. Installing the `pgvector` extension requires running the following `CREATE EXTENSION` statement from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any SQL client connected to your Lakebase Postgres database.

```sql
CREATE EXTENSION vector;
```

After installing `pgvector`, you can create a table to store your embeddings. For example:

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

For detailed information about using `pgvector`, refer to our guide: [The pgvector extension](/docs/extensions/pgvector).

## Searching vector embeddings at scale

`pgvector` gives you the `vector` type and similarity operators. To index and search embeddings at scale, Neon offers [Lakebase Search](/docs/ai/lakebase-search). Its [`lakebase_vector`](/docs/extensions/lakebase-vector) extension adds the `lakebase_ann` index for approximate nearest-neighbor search on your existing `pgvector` columns, with no schema or query changes, and scales to over a billion vectors on a single index. Pair it with `lakebase_text` for BM25 keyword search and hybrid results.

For an end-to-end walkthrough that generates embeddings with the AI Gateway, stores them in Postgres, and runs vector, keyword, and hybrid searches, see [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started).
