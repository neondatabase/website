Connect this Nuxt project to Postgres on Neon. Run each command yourself; I only complete browser sign-ins and answer questions. Use the project's package manager (the examples use npm). If the directory has no Nuxt project (no `nuxt` in `package.json`), create one with `npm create nuxt@latest my-app -- --template minimal --packageManager npm --no-gitInit --no-modules` and work inside `my-app`. Without a terminal, `--template`, `--packageManager`, and `--no-gitInit` are required: a missing one exits with code 2 and can leave a partial `my-app`, so delete it before retrying.

1. Set up the Neon CLI: run `neon --version`, and install it with `npm install -g neon@latest` if it's missing. Run `neon me`; if it says I'm not signed in, tell me you're opening a browser, run `neon login`, and wait for me to confirm.
2. Install Neon's agent skills for this project: `neon skills -y --agent <your agent id>` (for example `claude-code`, `cursor`, or `codex`). Use them for the rest of this setup and for later Neon work. Installing skills needs Node.js 22.20 or later; if Node is older, tell me and continue without them. If your agent only loads new skills after a restart, keep going: this prompt covers every step.
3. Link a Neon project: first create an empty `.env` if there isn't one (`touch .env`), because Nuxt reads `.env` and the Neon CLI writes there only when it exists. Then run `neon orgs list`, then `neon projects list --org-id <org-id> --output json` for the org I pick, and ask me which project to use or whether to create one (ask for a name, and use region `aws-us-east-2` unless I choose another). Run `neon link -y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id`. Linking writes `DATABASE_URL` to `.env`. Check that `.env` is git-ignored. Never print it or ask me to paste a connection string.
4. Work on a development branch: run `neon checkout dev --create`. It creates the branch and repoints `.env` at it, so local work doesn't touch the default branch.
5. Install the driver: `npm install @neondatabase/serverless`.
6. Create `server/utils/db.ts` exporting `sql = neon(process.env.DATABASE_URL!)`. Nuxt auto-imports it in server code.
7. Add a server route that runs `SELECT version()` with `sql` and returns `{ version }`. In a new project, name it `server/api/version.get.ts` and replace `app/app.vue` with a page that calls it with `useFetch('/api/version')` and renders `data.version`. In an existing project, name it `server/api/neon-version.get.ts` and don't change any pages.
8. Prove it works: run `npm run build`, start `npm run dev` in the background with its output in a log file, and fetch the page (new project) or `/api/neon-version` (existing project) at the URL it logs. It can be IPv6 only (`[::1]`), so don't assume `127.0.0.1`. Show me the Postgres version you got, not just "setup complete."

Nuxt rules:

- Import the database client only from server code (`server/`). Nuxt doesn't stop `app/` code from importing `server/utils/`, and that code also runs in the browser.
- Read env values from `process.env` in server code, not `runtimeConfig`: `runtimeConfig` only picks up `NUXT_`-prefixed variables at runtime, and Neon writes `DATABASE_URL`.
- Keep secrets out of `runtimeConfig.public` and out of route responses.
- `nuxt dev` reads `.env`, but the built server doesn't, so tell me to set `DATABASE_URL` in my host's environment before deploying (for a Node server: `node --env-file=.env .output/server/index.mjs`).
- This is Nuxt 4, which supports Node.js 22.22.3, 24.15, or 26 or later. On another version, npm only warns (`EBADENGINE`), so continue. On Nuxt 3 (`nuxt` 3.x), `app.vue` is at the project root instead of `app/`; the rest is the same.
- Don't change other routes or app files.

When you're done, tell me the Neon project and branch you used, the files you created or changed, and how to stop the dev server. Then suggest next steps: a first table (with `neon psql` or an ORM), and Neon's other backend services (Managed Better Auth, Object Storage, the AI Gateway, Neon Functions, Realtime), each added with `neon config add <service>` and provisioned with `neon deploy`.

These steps come from https://neon.com/docs/guides/nuxt.md, which has more detail and troubleshooting.
