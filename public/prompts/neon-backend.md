Get this project set up on Neon and build a backend on it. If I haven't told you what to build, ask me before writing app code.

First, set up your tooling:

1. Run `neon init --agent` in the terminal and help me answer its prompts (which editor, which Neon org, OAuth, and the MCP server).
2. Install and update the Neon agent skills with `npx skills add neondatabase/agent-skills -y`. This installs all skills (including the Functions, Object Storage, and AI Gateway skills that `neon init` alone doesn't add) and updates any already present to the latest. Do this even if `neon init` ran, since it doesn't refresh existing skills.

Then create the project (console, CLI, or MCP) in `aws-us-east-2` (required for the beta services), run `neon link` to bind this directory to it, and manage the whole backend as code in a single `neon.ts`. Neon's backend services (Functions, Object Storage, and the AI Gateway) are new and in beta, and their APIs, packages, and model IDs change often, so your training data is likely outdated or wrong. Prefer the agent skills and the docs linked below over your own memory, and if they disagree, trust the docs.

Once you know what I'm building, use only the capabilities that app needs:

- Postgres for anything relational (system of record).
- Object Storage for files too large for a row. Store the object key on a row, not the bytes.
- Functions for long-running or streaming work such as an AI call, a background job, or a websocket; a quick query can stay in a normal route handler.
- AI Gateway for LLM calls through one credential. Check the model catalog for the model and modality you need (text, image, etc.).
- Auth if the app is multi-user; scope every query to the signed-in user.

Enable what you need in `neon.ts`, run `neon deploy` to provision everything, then read the injected environment variables. Create your database tables as a separate step (a migration or `run_sql`); `neon deploy` provisions services, not schema. Test changes on a branch (`neon checkout`) so the whole backend (database, buckets, functions) forks together. When done, verify each capability responds.

Read the current docs for exact package names, config syntax, injected env var names, and model IDs:

- Agent skills (install and keep current): https://neon.com/docs/ai/agent-skills.md
- `neon.ts` config: https://neon.com/docs/reference/neon-ts.md
- Functions (deploy, connect, injected env vars): https://neon.com/docs/compute/functions/get-started.md
- Object Storage: https://neon.com/docs/storage/get-started.md
- AI Gateway models, endpoints, and modality: https://neon.com/docs/ai-gateway/models.md
- Auth (sign-in flow, JWT, and verifying the caller): https://neon.com/docs/auth/authentication-flow.md
