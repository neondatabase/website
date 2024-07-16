---
title: AI Concepts
subtitle: Learn how embeddings are used to build AI applications
enableTableOfContents: true
updatedOn: '2024-07-16T11:13:23.834Z'
---

Embeddings are an essential component in building AI applications. This topic describes embeddings and how they are used, generated, and stored in Postgres.

## What are embeddings?

When working with unstructured data, a common objective is to transform it into a more structured format that is easier to analyze and retrieve. This transformation can be achieved through the use of 'embeddings', which are vectors containing an array of floating-point numbers that represent the features or dimensions of your data. For example, a sentence like "The cow jumped over the moon" might be represented by an embedding that looks like this: [0.5, 0.3, 0.1].

The advantage of embeddings is that they allow us to measure the similarity between different pieces of text. By calculating the distance between two embeddings, we can assess their relatedness - the smaller the distance, the greater the similarity, and vice versa. This quality is particularly useful as it enables embeddings to capture the underlying meaning of the text.

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

When we apply this process, it is likely that sentences 1 and 2, both of which involve jumping cattle, will emerge as the most related according to a distance calculation.

## Vector similarity search

Transforming data into embeddings and computing similarities between one or more items is referred to as vector search or similarity search. This process has a wide range of applications, including:

- **Information retrieval:** By representing user queries as vectors, we can perform more accurate searches based on the meaning behind the queries, allowing us to retrieve more relevant information.
- **Natural language processing:** Embeddings capture the essence of the text, making them excellent tools for tasks such as text classification and sentiment analysis.
- **Recommendation systems:** Using vector similarity, we can recommend items similar to a given item, whether they be movies, products, books, or otherwise. This technique allows us to create more personalized and relevant recommendations.
- **Anomaly detection:** By determining the similarity between items within a dataset, we can identify outliers or anomalies—items that don't quite fit the pattern. This can be crucial in many fields, from cybersecurity to quality control.

### Distance metrics

Vector similarity search computes similarities (the distance) between data points. Calculating how far apart data points are helps us understand the relationship between them. Distance can be computed in different ways using different metrics. Some popular distance metrics include:

- Euclidean (L2): Often referred to as the "ordinary" distance you'd measure with a ruler.
- Manhattan (L1): Also known as "taxicab" or "city block" distance.
- Cosine: This calculates the cosine of the angle between two vectors.

Other distance metrics supported by the `pgvector` extension include [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) and [Jaccard distance]https://en.wikipedia.org/wiki/Jaccard_index).

Different distance metrics can be more appropriate for different tasks, depending on the nature of the data and the specific relationships you're interested in. For instance, cosine similarity is often used in text analysis.

## Generating embeddings

A common approach to generating embeddings is to use an LLM API, such as [OpenAI’s Embeddings API](https://platform.openai.com/docs/api-reference/embeddings). This API allows you to input a text string into an API endpoint, which then returns the corresponding embedding. The "cow jumped over the moon" is a simplistic example with 3 dimensions. Most embedding models generate embeddings with a much larger number of dimensions. OpenAI's newest and most performant embedding models, `text-embedding-3-small` and `text-embedding-3-large`, generate embeddings with 1536 and 3072 dimensions by default, respectively.

Here's an example of how to use OpenAI's `text-embedding-3-small` model to generate an embedding:

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-3-small"
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
        -0.006929283495992422,
        -0.005336422007530928,
        ... (omitted for spacing)
        -4.547132266452536e-05,
        -0.024047505110502243
      ],
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
```

To learn more about OpenAI's embeddings, see [Embeddings](https://platform.openai.com/docs/guides/embeddings). Here, you'll find an example of obtaining embeddings from an [Amazon fine-food reviews](https://www.kaggle.com/datasets/snap/amazon-fine-food-reviews) dataset supplied as a CSV file. See [Obtaining the embeddings](https://platform.openai.com/docs/guides/embeddings/use-cases).

There are many embedding models you can use, such as those provided by Mistral AI, Cohere, Hugging Face, etc. AI tools like [LanngChain](https://www.langchain.com/) provide interfaces and integrations for working with a variety of models. See [LangChain: Text embedding models](https://js.langchain.com/v0.1/docs/integrations/text_embedding/). You'll also find a [Neon Postgres guide](https://js.langchain.com/v0.1/docs/integrations/vectorstores/neon/) on the LangChain site and [Class NeonPostgres](https://v02.api.js.langchain.com/classes/langchain_community_vectorstores_neon.NeonPostgres.html), which provides an interface for working with a Neon Postgres database.

## Storing vector embeddings in Postgres

Neon supports the [pgvector](/docs/extensions/pgvector) Postgres extension, which enables the storage and retrieval of vector embeddings directly within your Postgres database. When building AI applications, installing this extension eliminates the need to extend your architecture to include a separate vector store. Installing the `pgvector` extension simply requires running the following `CREATE EXTENSION` statement from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any SQL client connected to your Neon Postgres database.

```sql
CREATE EXTENSION vector;
```

After installing the `pgvector` extension, you can create a table to store your embeddings. For example, you might define a table similar to the following to store your embeddings:

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
