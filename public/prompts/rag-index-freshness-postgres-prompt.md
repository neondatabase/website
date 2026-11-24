I want to build an incremental RAG indexing job on Neon Functions and run it on a schedule trigger, so a pgvector index stays fresh as source documents change.

Use the guide and following docs as a reference:
- https://neon.com/guides/rag-index-freshness-postgres
- https://neon.com/docs/compute/functions/triggers/schedule
- https://neon.com/docs/compute/functions/triggers/overview
- https://neon.com/docs/ai-gateway/embeddings
- https://neon.com/docs/extensions/pgvector
- https://neon.com/docs/reference/neon-ts

Before writing any code:

1. Inspect my existing project and find where source documents are stored. If there is no source table yet, ask me before creating one.

2. Check whether pgvector is enabled and whether an embeddings or chunks table already exists. Reuse what is there when it is compatible.

3. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon login` and wait for me to complete sign-in before continuing.

4. Check that the project is set up as code. `neon link` only creates `neon.ts` and its example `hello.ts` function when you accept the interactive **Manage this project's Neon setup as code** prompt; in non-interactive runs it skips that step. If `neon.ts` doesn't exist, or doesn't declare `functions` and `aiGateway`, run `neon config init --services functions,ai-gateway` to create it, then delete the example `hello.ts`. If it already declares those services, keep it as it is.

5. Ask me for the source table, the embedding model, and the schedule cadence. Ask only the questions you need.

6. Wait for my confirmation before making significant changes.

Then build:

- A `documents` table with a `version` column, and a `chunks` table with a `version` column and a vector column.
- A `POST /sync` route that selects documents with no chunk at their current version, embeds only those through the AI Gateway, and inserts the new chunks.
- A schedule trigger in `neon.ts` with the cadence I confirm, using `functionPath: '/sync'`.
- A retrieval query that joins `chunks` to `documents` on `version`, so superseded chunks never reach the results.
- A Node.js script (`search.mjs`, run with `node search.mjs`) that loads `.env.local` with `process.loadEnvFile`, embeds a question through the AI Gateway with the same model as the sync handler, and prints the joined retrieval query's results.
- A Node.js script (`ask.mjs`, run with `node ask.mjs "question"`) that runs the same retrieval, puts the retrieved chunks in a prompt, and calls a chat model through the AI Gateway so I get a grounded answer.

Constraints:

- Use Hono and a module-scope `pg` Pool with `attachDatabasePool` from `@neon/functions`. Do not use `@neondatabase/serverless`.
- Return `401` from `/sync` unless the `X-Neon-Trigger-Invocation-Id` header is present.
- Use the Neon AI Gateway with an OpenAI-compatible client, and pass `encoding_format: "float"`.
- Keep the handler idempotent. A redelivered trigger must not create duplicate chunks.
- Keep the implementation as simple as possible. Do not add a queue, an ORM, a workflow engine, or a sync-state table unless I ask for one.

After implementation, show me how to:

- run the function locally with `neon dev`,
- replay a trigger payload with `curl` and the `X-Neon-Trigger-Invocation-Id` header,
- run the search script and read its output,
- ask a question with the answer script and check the answer comes from the retrieved chunks,
- deploy and read the function logs,
- and confirm the trigger is scheduled with `neon triggers list`.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database or storage (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting objects, and similar) without showing me the exact command first and getting my explicit approval. If `neon deploy` stops and asks for `--allow-protected`, `--update-existing`, or `-y`, show me the changes it printed and ask me before re-running with any of them.

Never print connection strings or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.