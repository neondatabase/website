### What's new

- Compute: Released a new `pg_tiktoken` PostgreSQL extension, created by the Neon engineering team. The extension is a wrapper for [OpenAI’s tokenizer](https://github.com/openai/tiktoken). It provides fast and efficient tokenization of data stored in a PostgreSQL database.
  The extension supports two functions:

  - The `tiktoken_encode` function takes text input and returns tokenized output, making it easier to analyze and process text data.
  - The `tiktoken_count` function returns the number of tokens in a text, which is useful for checking text length limits, such as those imposed by OpenAI’s language models.

  For more information about the `pg_tiktoken` extension, refer to the blog post: [Announcing pg_tiktoken: A Postgres Extension for Fast BPE Tokenization](https://neon.tech/blog/announcing-pg_tiktoken-a-postgres-extension-for-fast-bpe-tokenization). The `pg_tiktoken` code is available on [GitHub](https://github.com/kelvich/pg_tiktoken).

- Compute: Added support for the PostgreSQL `prefix`, `hll` and `plpgsql_check` extensions. For more information about PostgreSQL extensions supported by Neon, see [PostgreSQL extensions](https://neon.tech/docs/reference/pg-extensions/).
- Compute, Pageserver, Safekeeper: Added support for RS384 and RS512 JWT tokens, used to securely transmit information as JSON objects.
- Pageserver: Removed the block cursor cache, which provided little performance benefit and would hold page references that caused deadlocks.
- Autoscaling: Added support for scaling Neon's local file cache size when scaling a virtual machine.
