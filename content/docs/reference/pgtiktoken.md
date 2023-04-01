---
title: The pg_tiktoken extension
subtitle: Efficiently tokenize data and manage tokens in your PostgreSQL database
enableTableOfContents: true
---

`pg_tiktoken` is a PostgreSQL extension that enables efficient tokenization using OpenAI's `tiktoken` library, based on the [Byte Pair Encoding (BPE)](https://en.wikipedia.org/wiki/Byte_pair_encoding) algorithm. This plugin is designed to streamline natural language processing tasks within your PostgreSQL database.

This article will guide you through the process of using the `pg_tiktoken` extension, illustrating its capabilities with examples. We will demonstrate how to install the extension, use the `tiktoken_count` and `tiktoken_encode` functions, and manage text tokens efficiently.

## What is a token?

Language models process text in units called tokens. In English, a token can be as short as a single character or as long as a complete word, such as "a" or "apple." In some languages, tokens may comprise less than a single character or even extend beyond a single word.

For example, consider the sentence "Neon is Serverless Postgres." It can be divided into seven tokens: ["Ne", "on", "is", "Server", "less", "Post", "gres"].

## What problem does pg_tiktoken solve?

The `pg_tiktoken` extension addresses the challenge of tokenizing text data within a PostgreSQL database. By offering two key functions, `tiktoken_encode` and `tiktoken_count`, it streamlines the process of analyzing and processing text data for a range of applications.

The `tiktoken_encode` function simplifies tokenization by accepting text inputs and returning tokenized outputs. This functionality allows users to seamlessly tokenize their text data, facilitating analysis and various use cases.

The `tiktoken_count` function provides users with the ability to determine the number of tokens in a given text. This feature proves particularly useful for adhering to text length limitations, such as those set by OpenAI's language models. By leveraging these functions, `pg_tiktoken` effectively simplifies text data tokenization and management within Postgres databases.

## Installing the pg_tiktoken extension

You can enable the `pg_tiktoken` extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION pg_tiktoken
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](https://neon.tech/docs/connect/query-with-psql-editor).

## Using the tiktoken_encode Function

The `tiktoken_encode` function tokenizes text inputs and returns a tokenized output, simplifying the analysis and processing of text data. Like `tiktoken_count`, the function also accepts both encoding names and OpenAI model names as the first argument:

```sql
SELECT tiktoken_encode('text-davinci-003', 'The universe is a vast and captivating mystery, waiting to be explored and understood.');
tiktoken_encode

---------------

{464,6881,318,257,5909,290,3144,39438,10715,11,4953,284,307,18782,290,7247,13}
```

This will tokenize the input text using the BPE algorithm and return the tokenized output.

The `tiktoken_count` function return the number of tokens in a text:

```sql
SELECT tiktoken_count('text-davinci-003', 'The universe is a vast and captivating mystery, waiting to be explored and understood.');

tiktoken_count

---------------

17
```

## Integrating pg_tiktoken with the ChatGPT Model

The pg_tiktoken extension allows you to store message history in a Postgres database and retrieve messages that comply with OpenAI's model limitations.

For example, consider the "message" table below:

```sql
CREATE TABLE message (
  role VARCHAR(50) NOT NULL, -- corresponds to 'system', 'user', or 'assistant'
  content TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT NOW(),
  n_tokens INTEGER -- number of content tokens
);
```

The gpt-3.5-turbo model requires specific parameters:

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

The "messages" parameter is an array of message objects, with each object containing two crucial pieces of information: the role of the message sender (either "system," "user," or "assistant") and the actual message content. Conversations can be brief, with just one message, or span multiple pages as long as the combined message tokens do not exceed the 4096-token limit.

To insert role, content, and the number of tokens into the database, use the following query:

```sql
INSERT INTO message (role, content, n_tokens)
VALUES ('user', 'Hello, how are you?', tiktoken_count('Hello, how are you?'));
```

## Managing Text Tokens

When a conversation contains more tokens than a model can process (e.g., over 4096 tokens for gpt-3.5-turbo), you'll need to truncate the text to fit within the model's limit. However, note that if you remove a message from the conversation, the model will lose knowledge of it.

Additionally, lengthy conversations may result in incomplete replies. For example, if a gpt-3.5-turbo conversation spans 4090 tokens, the response will be limited to just six tokens.

The following query retrieves messages up to your desired token limits:

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

`MAX_HISTORY_TOKENS` represents the conversation history to maintain for chat completion, following this formula:

```text
MAX_HISTORY_TOKENS = MODEL_MAX_TOKENS – NUM_SYSTEM_TOKENS – NUM_COMPLETION_TOKENS
```

For example, let's assume the desired completion length is 100 tokens (`NUM_COMPLETION_TOKENS=90`).

```text
MAX_HISTORY_TOKENS = 4096 – 6 – 90 = 4000
```

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

## Supported Models

The `tiktoken_count` and `tiktoken_encode` functions accept both encoding and OpenAI model names as the first argument:

```text
tiktoken_count(<encoding or model>,<text>)
```

The following models are supported:

| Encoding name      | OpenAI models                                      |
|:-------------------|:---------------------------------------------------|
| cl100k_base        | ChatGPT models, text-embedding-ada-002            |
| p50k_base          | Code models, text-davinci-002, text-davinci-003    |
| p50k_edit          | Use for edit models like text-davinci-edit-001, code-davinci-edit-001 |
| r50k_base (or gpt2)| GPT-3 models like davinci                         |

## Conclusion

The `pg_tiktoken` extension offers fast and efficient tokenization within PostgreSQL databases, simplifying the analysis and processing of text data for various applications. We demonstrated how to use `tiktoken_count` to retrieve messages that fit within OpenAI's model limits and avoid failing API calls. By incorporating the `pg_tiktoken` extension into your database, you can streamline your natural language processing tasks and improve your application's efficiency.

As you explore the capabilities of the `pg_tiktoken extension`, we encourage you to provide feedback and suggest features you'd like to see added in future updates. We look forward to seeing the innovative natural language processing applications you create using `pg_tiktoken`.

## Resources:

- [Open AI tiktoken source code on GitHub](https://github.com/openai/tiktoken)
- [pg_tiktoken source code on GitHub](https://github.com/kelvich/pg_tiktoken)
- [Announcing pg_tiktoken: A Postgres Extension for Fast BPE Tokenization](https://neon.tech/blog/announcing-pg_tiktoken-a-postgres-extension-for-fast-bpe-tokenization)
