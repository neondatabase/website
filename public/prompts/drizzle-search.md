Add Lakebase Search (full-text and vector) to my Drizzle schema so I can run semantic, keyword, and hybrid search.

Follow Neon's guide for managing Lakebase Search with Drizzle at https://neon.com/docs/ai/skills/neon-postgres/references/lakebase-search-drizzle.md and treat its SQL as the source of truth. In outline:

1. Confirm `drizzle-orm` is 0.36+ and `drizzle-kit` is 0.27+, which the schema below needs.
2. Create the extensions in a custom migration first, because Drizzle cannot express `CREATE EXTENSION` and the vector column depends on it:
   ```bash
   npx drizzle-kit generate --custom --name=lakebase_extensions
   ```
   with `CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;` and `CREATE EXTENSION IF NOT EXISTS lakebase_text;`.
3. In `src/schema.ts`, add the columns, a generated `tsvector` column, and the `lakebase_ann` index for vector search.
4. Generate and apply the migration with `drizzle-kit generate` then `drizzle-kit migrate`, over the direct (unpooled) connection. Never run `drizzle-kit push`, because it drops objects that are not declared in the schema, including the BM25 index.
5. Seed the table, generate embeddings through the Neon AI Gateway, then create the `lakebase_bm25` index after the corpus is loaded.
6. Prove it works: run a vector search, a keyword (BM25) search, and a hybrid search for the same question, and show me the top results from each. Do not print secrets.
