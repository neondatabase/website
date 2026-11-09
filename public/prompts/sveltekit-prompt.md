Connect this SvelteKit project to Postgres on Neon. Run each command yourself; I only complete browser sign-ins and answer questions. Use the project's package manager (the examples use npm). If the directory has no SvelteKit project (no `@sveltejs/kit` in `package.json`), create one with `npx sv create my-app --template minimal --types ts --no-add-ons --install npm` and work inside `my-app`. Keep `--no-add-ons`: without it the command waits on a prompt, then exits 0 without creating anything.

1. Set up the Neon CLI: run `neon --version`, and install it with `npm install -g neon@latest` if it's missing. Run `neon me`; if it says I'm not signed in, tell me you're opening a browser, run `neon login`, and wait for me to confirm.
2. Install Neon's agent skills for this project: `neon skills -y --agent <your agent id>` (for example `claude-code`, `cursor`, or `codex`). Use them for the rest of this setup and for later Neon work. Installing skills needs Node.js 22.20 or later; if Node is older, tell me and continue without them. If your agent only loads new skills after a restart, keep going: this prompt covers every step.
3. Link a Neon project: run `neon orgs list`, then `neon projects list --org-id <org-id> --output json` for the org I pick, and ask me which project to use or whether to create one (ask for a name, and use region `aws-us-east-2` unless I choose another). Run `neon link -y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id`. Linking writes `DATABASE_URL` to `.env.local` (or `.env` if one exists). Check that the file is git-ignored. Never print it or ask me to paste a connection string.
4. Work on a development branch: run `neon checkout dev --create`. It creates the branch and repoints the env file at it, so local work doesn't touch the default branch.
5. Install the driver: `npm install @neondatabase/serverless`. If I ask for node-postgres or postgres.js instead, install `pg` (plus `@types/pg` as a dev dependency) or `postgres`, and use the client and `load` code for that driver from the guide linked at the end.
6. Declare the variable in `src/env.ts` (add it to `variables` if the file exists):
   `import { defineEnvVars } from '@sveltejs/kit/env'; export const variables = defineEnvVars({ DATABASE_URL: {} });`
7. Create `src/lib/server/db.ts`, importing `DATABASE_URL` from `$app/env/private` and exporting `sql = neon(DATABASE_URL)`.
8. Add a page that queries the database. In a new project, use `src/routes/`; in an existing one, use `src/routes/neon/` so you don't replace my pages. Create `+page.server.ts` that imports `sql` from `#lib/server/db.ts` and exports `load: PageServerLoad` (type from `./$types`), which runs `SELECT version()` and returns `{ version }`. Render `data.version` in `+page.svelte` with `let { data } = $props();`.
9. Prove it works: run `npm run check`, start `npm run dev` in the background with its output in a log file, open the page at the URL it logs (Vite moves to another port when the default is taken), and show me the Postgres version on it, not just "setup complete."

SvelteKit rules:

- Import the database client only from server code (`+page.server.ts`, `+server.ts`, `hooks.server.ts`). Importing `src/lib/server/` from browser code fails the build with `server_only_import`.
- Read env values from `$app/env/private`, not `process.env`; SvelteKit doesn't load `.env` or `.env.local` into `process.env`.
- Keep `DATABASE_URL` private: never declare it with `public: true` or return it in page data.
- A declared variable is required at build time and at startup. Tell me to set `DATABASE_URL` in my host and CI environment before deploying.
- This is SvelteKit 3 (Node.js 22.17 or later). On SvelteKit 2 (`@sveltejs/kit` 2.x), where `src/env.ts` needs the experimental `explicitEnvironmentVariables` option, skip `src/env.ts`, use `import { env } from '$env/dynamic/private'` and `neon(env.DATABASE_URL)`, and import the client from `$lib/server/db`. There, the build doesn't need `DATABASE_URL`, but the running app does.
- Don't change other routes or app files.

When you're done, tell me the Neon project and branch you used, the files you created or changed, and how to stop the dev server. Then suggest next steps: a first table (with `neon psql` or an ORM), and Neon's other backend services (Managed Better Auth, Object Storage, the AI Gateway, Neon Functions, Realtime), each added with `neon config add <service>` and provisioned with `neon deploy`.

These steps come from https://neon.com/docs/guides/sveltekit.md, which has more detail and troubleshooting.
