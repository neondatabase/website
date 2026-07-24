---
title: 'Announcing pg_tiktoken: A Postgres Extension for Fast BPE Tokenization'
description: Analyze and Process Text Data in Neon with pg_tiktoken's Fast BPE Tokenization
excerpt: >-
  We’re excited to announce the release of the pg_tiktoken extension on Neon.
  This new Postgres extension provides fast and efficient tokenization using the
  BPE (Byte Pair Encoding) algorithm. pg_tiktoken is a wrapper around OpenAI’s
  tokenizer, known for its speed and performance i...
date: '2023-03-14T17:04:34'
updatedOn: '2023-06-01T11:11:48'
category: engineering
categories:
  - engineering
authors:
  - stas-kelvich
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-pg-tiktoken-a-postgres-extension-for-fast-bpe-tokenization/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Announcing pg_tiktoken: A Postgres Extension for Fast BPE Tokenization -
    Neon
  description: >-
    Analyze and Process Text Data in Neon with pg_tiktoken's Fast BPE
    Tokenization
  keywords: []
  noindex: false
  ogTitle: >-
    Announcing pg_tiktoken: A Postgres Extension for Fast BPE Tokenization -
    Neon
  ogDescription: >-
    We’re excited to announce the release of the pg_tiktoken extension on Neon.
    This new Postgres extension provides fast and efficient tokenization using
    the BPE (Byte Pair Encoding) algorithm. pg_tiktoken is a wrapper around
    OpenAI’s tokenizer, known for its speed and performance in handling natural
    language processing tasks. pg_tiktoken solves the problem of tokenizing text
    data […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-pg-tiktoken-a-postgres-extension-for-fast-bpe-tokenization/social.png
---

We’re excited to announce the release of the `pg_tiktoken` extension on Neon. This new Postgres extension provides fast and efficient tokenization using the BPE (Byte Pair Encoding) algorithm. `pg_tiktoken` is a wrapper around [OpenAI’s tokenizer](https://github.com/openai/tiktoken), known for its speed and performance in handling natural language processing tasks.

`pg_tiktoken` solves the problem of tokenizing text data within a Postgres database. The `tiktoken_encode` function allows you to tokenize text inputs and returns a tokenized output, making it easier to analyze and process text data for various applications. The `tiktoken_count` function enables users to return the number of tokens in a text, which is useful for checking text length limits, like those imposed by OpenAI’s language models.

## What are text tokens

Language models process text in chunks known as tokens. In English, a token can range from a single character to a complete word such as “a” or “apple.” In certain languages, tokens can even be shorter than one character or longer than one word.

For instance, the sentence “Neon is Serverless Postgres” is divided into seven tokens: [“Ne”, “on”, ” is”, ” Server”, “less”, ” Post”, “gres”].

## Get started with `pg_tiktoken`

With `pg_tiktoken`, you can tokenize text data within your Postgres database, making it easier to analyze and process the data for various applications. The extension supports various text inputs, including multiple languages and special characters, and is optimized for speed and efficiency.

To start with `pg_tiktoken`, you need to install the extension:

```sql
CREATE EXTENSION pg_tiktoken
```

Once the extension is installed, you can use the pg_tiktoken function within your queries to tokenize text data within your database. The function takes a text input and returns a tokenized output:

```sql
SELECT tiktoken_encode('text-davinci-003', 'The universe is a vast and captivating mystery, waiting to be explored and understood.');

tiktoken_encode

---------------

{464,6881,318,257,5909,290,3144,39438,10715,11,4953,284,307,18782,290,7247,13}
```

This will tokenize the input text using the BPE algorithm and return the tokenized output.

You can also return the number of tokens in a text using the `tiktoken_count` function:

```sql
SELECT tiktoken_count('text-davinci-003', 'The universe is a vast and captivating mystery, waiting to be explored and understood.');

tiktoken_count

---------------

17
```

### Supported models

`tiktoken_count` and `tiktoken_encode` functions accept both encoding and OpenAI model names as the first argument:

```sql
tiktoken_count(<encoding or model>,<text>)
```

Here is the list of supported models:

| **Encoding** **name**   | **OpenAI** **models**                                                     |
| ----------------------- | ------------------------------------------------------------------------- |
| `cl100k_base`           | ChatGPT models, `text-embedding-ada-002`                                  |
| `p50k_base`             | Code models, `text-davinci-002`, `text-davinci-003`                       |
| `p50k_edit`             | Use for edit models like `text-davinci-edit-001`, `code-davinci-edit-001` |
| `r50k_base` (or `gpt2`) | GPT-3 models like davinci                                                 |

## Use `pg_tiktoken` with the ChatGPT model

You can persist the message history in Postgres and query the database to get messages that fit within OpenAI’s model limits.

Here is an example of the “message” table:

```sql
CREATE TABLE message (
  role VARCHAR(50) NOT NULL, -- equals to 'system', 'user' or 'assistant'
  content TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT NOW(),
  n_tokens INTEGER -- number of content tokens
);
```

The `gpt-3.5-turbo` model requires the following parameters:

```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."}
    ]
}
```

The “messages” parameter consists of an array of message objects. Each object within the array should contain two key pieces of information: the role of the message sender (either “system,” “user,” or “assistant”) and the actual message content. Conversations can be brief, consisting of just one message, or they may continue for multiple pages as long as the sum of the message tokens is within the 4096 limit.

You can use the following query to insert role, content, and the number of tokens into the database:

```sql
INSERT INTO message (role, content, n_tokens)
VALUES ('user', 'Hello, how are you?', tiktoken_count('Hello, how are you?'));
```

## Manage your text tokens

When you have a conversation with more tokens than a model can handle (like more than 4096 tokens for `gpt-3.5-turbo`), you’ll need to shorten your text to fit the limit. But be careful. If you remove a message from the conversation, the model will not know about it anymore.

Also, you might receive incomplete replies if your conversation is too long. For instance, if your `gpt-3.5-turbo` conversation is 4090 tokens long, you’ll only get a reply of 6 tokens.

The query below allows you to get messages up to your desired token limits:

```sql
WITH cte AS (
  SELECT role, content, created, n_tokens,
         SUM(tokens) OVER (ORDER BY created DESC) AS cumulative_sum
  FROM message
)

SELECT role, content, created, n_tokens, cumulative_sum
FROM cte
WHERE cumulative_sum <= <MAX_HISTORY_TOKENS>;
```

`MAX_HISTORY_TOKENS` represents the conversation history you want to keep for the chat completion and follow the following formula:

MAX_HISTORY_TOKENS = MODEL_MAX_TOKENS – NUM_SYSTEM_TOKENS – NUM_COMPLETION_TOKENS

Let’s use the example seen above and assume that the desired completion length is 100 tokens (`NUM_COMPLETION_TOKENS=90`).

MAX_HISTORY_TOKENS = 4096 – 6 – 90 = 4000

```json
{
  "model": "gpt-3.5-turbo", // MODEL_MAX_TOKENS = 4096
  "messages": [
         {"role": "system", "content": "You are a helpful assistant."}, // NUM_SYSTEM_TOKENS = 6
         {"role": "user", "content": "Who won the world series in 2020?"},
         {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
         {"role": ...}
         .
         .
         .
         {"role": "user", "content": "Great! Have a great day."}  // MAX_HISTORY_TOKENS = 4000
    ] 
}
```

## Conclusion

In summary, the `pg_tiktoken` extension provides fast and efficient tokenization using the BPE algorithm within Postgres, making it easier to analyze and process text data for various applications. We explored how to use the `tiktoken_count` function to query the database and retrieve messages that fit within OpenAI’s model limits and how to avoid failing API calls.

What is your use case for the `pg_tiktoken` extension and AI? We would love to hear your feedback and learn about features you would like to see added to the `pg_tiktoken` in future updates.

We look forward to seeing the natural language processing applications you will build with `pg_tiktoken`!
