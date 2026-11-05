Set this project up with Drizzle ORM on Lakebase Postgres, and work out which other Neon services it needs.

1. Inspect this repository first: the framework, the package manager, existing database or ORM code, any `.env` files, and how the app is deployed (long-running server, serverless, or edge). If the repository is empty or greenfield, ask me what I am building and what framework I want before continuing.
2. Set up Neon if it is not already linked: install the Neon CLI with `npm install -g neon@latest`, then follow the base setup at https://neon.com/prompts/agent-setup.md to sign in, link a project, and write the connection variables to `.env.local` (or `.env`).
3. Wire up Drizzle against the Neon Postgres database: pick the driver that matches how this app runs (Neon serverless HTTP for serverless or edge, a TCP driver such as node-postgres for a long-running server), add `drizzle.config.ts` and a schema, and point Drizzle Kit at the direct (unpooled) connection string for migrations. Follow the Drizzle guide at https://neon.com/docs/guides/drizzle.md.
4. Based on what you found in step 1, recommend which Neon services this app should use, and tell me why for each. Only suggest what the app needs:
   - Auth (Managed Better Auth) if it is multi-user or has sign-in.
   - Object Storage if it stores files, images, or uploads.
   - Functions if it needs long-running, streaming, or scheduled backend work.
   - AI Gateway if it calls an LLM or generates embeddings.
   - Realtime if the UI or an agent needs live updates from database rows.
5. Wait for me to confirm the list before you provision anything. Then set up only the services I approve, and prove each one works. Never print connection strings or other secrets.
