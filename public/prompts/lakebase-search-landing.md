Help me get set up with Lakebase Search, based on my project:

1. Install the Neon CLI with `npm install -g neon@latest`.
2. Read Neon's skill at https://neon.com/.well-known/agent-skills/neon/SKILL.md and use it to guide this setup. The Lakebase Search guidance lives in the Lakebase Search section of the neon-postgres skill.
3. Run `neon init` to link a project and install Neon's agent tooling. Lakebase Search needs Postgres 16 or later, which new projects already run.
4. Add a small table of sample documents with vector and keyword search indexes, generating embeddings through the AI Gateway, then prove it works: run a vector search, a keyword search, and a hybrid search for the same question and show me the top results from each. If the AI Gateway isn't available on my plan, run the keyword search only and tell me what vector search needs. Don't print secrets.
