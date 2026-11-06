The Data API is an HTTP SQL endpoint attached to a branch. It lets you run queries over HTTPS without a Postgres driver, useful for edge runtimes, browser clients, or environments where a persistent TCP connection is impractical.

Use these endpoints to enable, configure, or disable the Data API on a branch. To run queries once it's enabled, use the Data API URL returned by the enable endpoint.

You can also manage the Data API from the CLI with [`neon data-api`](/docs/cli/data-api).

See [Neon Data API](/docs/data-api/overview) for query syntax, authentication, and usage details.
