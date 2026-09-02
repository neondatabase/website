Get this project set up on Neon so I can build a backend on it. Work through it with the Neon CLI; don't rely on interactive pickers.

First, ask me in one message (don't guess or pick a default): which org, an existing project in a supported region (`aws-us-east-2` or `aws-eu-central-1`) to reuse or a name to create a new one, and a one-line description of what I'm building. Neon's backend services (Functions, Object Storage, and the AI Gateway) are available in `aws-us-east-2` and `aws-eu-central-1` during beta. Support is expanding toward all regions.

Then set up the tooling and connect:

1. Install or update the Neon CLI: `npm i -g neon@latest`. The rest uses the `neon` command.
2. Sign in if needed: check with `neon me`, and run `neon auth` if it's not signed in (it opens a browser, so pause and ask me to confirm once I've signed in before continuing).
3. Install the Neon agent skills: `npx skills add neondatabase/agent-skills -y` (covers Postgres plus the Functions, Object Storage, and AI Gateway skills). Optional: set up the Neon MCP server with `npx add-mcp https://mcp.neon.tech/mcp --agent <your editor> --yes`.
4. Connect the project from the answers above:
   - Reuse an existing one: `neon link --project-id <id>`, then `neon env pull`. Linking records the project but doesn't write env; `env pull` writes the connection variables (like `DATABASE_URL`) into `.env.local`, or `.env` if it exists.
   - Or create a new one: `neon link --org-id <org-id> --project-name <name> --region-id aws-us-east-2`. In one step this creates the project, links this directory, pins the default branch, and writes those variables into `.env.local`.

Then build the backend, using only the capabilities the app needs:

- Postgres for anything relational (system of record).
- Object Storage for files too large for a row. Store the object key on a row, not the bytes.
- Functions for long-running or streaming work such as an AI call, a background job, or a websocket; a quick query can stay in a normal route handler.
- AI Gateway for LLM calls through one credential. Check the model catalog for the model and modality you need (text, image, etc.).
- Managed Better Auth if the app is multi-user; scope every query to the signed-in user.

Declare what you need in a single `neon.ts` (see the docs below; these beta APIs, packages, and model IDs change often, so trust the docs over your training data), run `neon deploy` to provision everything, then run `neon env pull` again to pull the new service credentials into `.env.local`. Create your database tables as a separate step (a migration, `neon psql`, or the `run_sql` MCP tool); `neon deploy` provisions services, not schema. To test in isolation, create and switch to a branch with `neon branches create --name <name>` then `neon checkout <name>` (always name the branch; bare `neon checkout` prompts interactively), so the database, buckets, and functions fork together.

When done, don't just tell me it works: exercise each capability I enabled (run a query with `neon psql -- -c "..."`, store and retrieve an object, call a function endpoint, make a model request, verify a signed-in user), show me the results, and give me commands I can rerun. Never print connection strings or other secrets back to me.

Read the current docs for exact package names, config syntax, injected env var names, and model IDs:

- Agent skills (install and keep current): https://neon.com/docs/ai/agent-skills.md
- `neon.ts` config: https://neon.com/docs/reference/neon-ts.md
- Functions (deploy, connect, injected env vars): https://neon.com/docs/compute/functions/get-started.md
- Object Storage: https://neon.com/docs/storage/get-started.md
- AI Gateway models, endpoints, and modality: https://neon.com/docs/ai-gateway/models.md
- Managed Better Auth (sign-in flow, JWT, and verifying the caller): https://neon.com/docs/auth/authentication-flow.md
