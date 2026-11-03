Migrate this Convex app fully to Neon Realtime. Done means the app runs on Neon Postgres with Realtime live queries, and nothing in it depends on Convex.

Realtime is new and in beta, so its APIs aren't in your training data: follow the neon-realtime skill and the docs below rather than guessing. Work through the Neon CLI rather than interactive pickers, and never print secrets.

## How you work

You're the orchestrator. A real app is usually too big for one session, so you plan, delegate, verify and keep state; sub-agents read and write the code.

- **Protect your context.** Don't read app source, docs or long logs yourself. Ask sub-agents for answers, not file contents, and read command output by its tail. Don't dispatch docs-review or digest sub-agents.
- **Keep state on disk** in `MIGRATION.md` at the app root, under 15 KB. Start it with a "Resume here" block of at most 20 lines (the current unit, next steps, open questions, the baseline commit), then my decisions, conventions, each slice's contract and a unit table. The inventory goes in `MIGRATION-inventory.md`, and history lives in git. You're the only writer of `MIGRATION.md`. Sub-agents read it, so their briefs stay short.
- **Set the model.** When you can, give every sub-agent that writes or reviews code the most capable model.
- **Parallelize only file-disjoint work.** Each unit owns its files. Shared files (server entry, router, package manifest, lockfile, env files) belong to you or one named unit; other sub-agents report the change they need.
- **Never sleep to wait.** Don't `sleep` to wait for a sub-agent or a background command. End your turn and wait for the completion notification. Run checks in the foreground under `timeout`.
- **Between phases, do only three things:** update the unit table, run one typecheck, dispatch. A unit that passes 30 minutes reports PARTIAL with its blocker, rather than carrying on.
- **Use git:** a new branch, a commit after each verified step, no push.
- **No sub-agents?** Run the same units one at a time.

## 1. Set up and take inventory

Dispatch the inventory sub-agent first, so it runs while you set up. It writes `MIGRATION-inventory.md`: the framework, package manager, and install, typecheck, lint, test and build commands; Convex tables; every Convex function (query, mutation, action, internal, HTTP action) with its file and client call sites (`useQuery`, `useMutation`, `usePaginatedQuery`, `useAction`, optimistic updates); auth; Convex-only features (scheduler, crons, file storage, search and vector indexes, components); and any existing server. It returns at most 30 lines.

Meanwhile:

1. Install the app's dependencies with its package manager if needed (the schema tool evaluates `convex/schema.ts`).
2. Install or upgrade the Neon CLI: `npm i -g neon@latest`.
3. Install the Neon agent skills, including Realtime: `neon skills -s neon -s neon-realtime -y`. Skills installed now won't load in this session, so brief sub-agents with the path `.claude/skills/neon-realtime/SKILL.md`. Commit `.claude/skills/` and `skills-lock.json` on the migration branch.
4. If `neon me` shows I'm signed out, run `neon login` (it opens a browser) and wait for my confirmation.

## 2. Ask me everything at once

Then ask me these in one message, each with your recommendation and a one-line reason from the inventory. Record my answers in `MIGRATION.md`, and don't ask again unless you're blocked.

1. **Neon project and branch:** reuse a project (list them) or create one, and which branch to migrate into. For a reused project, recommend a new branch named after the app, not the default branch. Never migrate into a branch that another app uses. Realtime is available in `aws-us-east-1`, `aws-us-east-2`, `aws-eu-central-1` and `aws-ap-southeast-1`, and not on Claimable projects, so don't create one.
2. **Migration:** schema only, or schema and data from the dev deployment (recommended) or from production (`npx convex export --prod`; the flag belongs to the Convex CLI). A local deployment must be running to export, and that also runs its crons.
3. **Queries:** raw SQL, Drizzle or Kysely.
4. **Client state:** plain React (`useLiveQuery` with `useOptimistic`) or TanStack DB. If the app uses TanStack DB, recommend keeping it.
5. **Backend:** sealing queries and handling writes need trusted server code, which Convex apps often lack. Use the app's server (like Next.js route handlers or TanStack Start server functions), or if it has none, recommend Hono (simplest) or TanStack Start (more comprehensive).
6. **Auth:** keep the provider if it doesn't depend on Convex. For Convex Auth, propose Neon Managed Better Auth (email and password for Convex Auth's `Password` provider), and agree how to connect existing users, per the guide's "Migrate Convex Auth" section. Passwords don't transfer. Recommend remapping ids by email when the accounts can be recreated, and never link unverified emails.
7. **Convex-only features:** how each maps, per the guide's "Map other Convex features" table. Default: with a long-running server, run scheduled work, crons and LLM streaming in-process, with their state in rows. Use Neon Functions when the work must be durable or there's no server. Search uses GIN, not BM25.
8. **Database changes:** confirm that sub-agents may create, alter and fill tables on the chosen branch, and only that branch (the import, fix-up migrations, and test rows they clean up). Record the consent in `MIGRATION.md`. If your harness asks for permission per command, ask me to allow `neon psql` for this branch now, not partway through.

## 3. Provision

Run these from the app root:

1. If I chose a new branch in a reused project, create it: `neon branches create --project-id <id> --name <branch> --no-secrets`.
2. Create `.neon` if there isn't one, so the CLI doesn't adopt a parent folder's: `[ -f .neon ] || echo '{}' > .neon`. Then link: `neon link --project-id <id> --branch <branch> --context-file "$PWD/.neon"` (or `--org-id <org-id> --project-name <name> --region-id <region>` to create a project). Check that the output says `Linked ./.neon` or the app's absolute path.
3. Enable Realtime for your dev origins: `neon realtime enable --branch <branch> --allowed-origin http://localhost:<port>`. Repeat `--allowed-origin` for each dev server that will run in parallel.
4. If auth is Managed Better Auth: `neon neon-auth enable --branch <branch>`.
5. `neon env pull --branch <branch> --service postgres --service realtime` (add `--service auth` for Managed Better Auth) writes `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to the app's env file. Then add the browser variables, for example `VITE_NEON_REALTIME_URL=$NEON_REALTIME_URL` (and `VITE_NEON_AUTH_URL=$NEON_AUTH_BASE_URL`).
6. If I chose Neon Functions: `neon skills -s neon-functions -y`, and brief those units with `.claude/skills/neon-functions/SKILL.md`.

Pass `--branch <branch>` on every later `neon` command, and `--no-secrets` where it's supported. `neon psql` takes the branch as its first argument instead (`neon psql <branch> -- -c "..."`); without it, it connects to the default branch.

## 4. Plan and run the units

The migration guide works in six layers: schema, queries, auth (`seal()`), reactivity (`useLiveQuery`), writes (an endpoint that returns the txid) and optimistic state (`awaitTxId` or TanStack DB). Plan these units in `MIGRATION.md`:

1. **Schema and data.** Export with `npx convex export --path <dir>/snapshot.zip`. For a local deployment, start it only to export, then stop it. Keep the snapshot out of git. Following the guide's "Migrate your schema" step, write `db/schema.sql` first with the tool's `schema` command, for the other units to read, then load the data I chose with `import --apply-schema` and the same flags, which also builds the search indexes. Report the tool's warnings and each table's row count.
2. **Foundation and reference slice.** Don't split it. It builds everything the slices share: row types that match the generated tables exactly, column names included; the database client; `createRealtime`; the auth helper; one backend route module per slice; the browser Realtime client and provider in place of Convex's; env wiring; every package install. It writes each slice's **contract** into `MIGRATION.md`: route paths, request and response types, hook and provider signatures, and row types. Then it migrates one small slice end to end, writes `PATTERNS.md` (under 4 KB) from it, and writes `scripts/smoke.ts`.
3. **Slices.** One per Convex module (for example, `convex/messages.ts`): its functions, endpoints and calling components. A component that calls several modules goes to one slice. Each slice deletes its own `convex/` module and call sites. Slices depend on each other only through contracts.
4. **Platform features**, as I chose.

Unit 2 starts as soon as `db/schema.sql` exists, while unit 1 imports the data. Both finish before you dispatch every slice and platform feature in **one wave** (up to 6 for a medium app), each with its own spare dev port from the Realtime allowed origins. After the wave, run one typecheck, and send any failures, with their output, to one repair sub-agent.

**Checks, not test suites.** A unit is done when the typecheck and lint pass. Don't write per-unit harnesses or browser tests. Unit 2 writes one API-level `scripts/smoke.ts` (two sessions: sign in, load, write, see the write live in the other session). Each slice adds at most one case and runs it once. Wrap every check in `timeout 90`, and close Realtime and database handles so scripts exit. Build, and run one browser end-to-end check, only in Finish. If the app has a test suite, run only your files' tests. Verify scheduled jobs by running their logic directly, not by waiting for a tick.

## 5. Sub-agent brief

Sub-agents start with none of your context, so brief every one with this template:

```text
You're migrating part of a Convex app to Neon Realtime. Realtime is in beta and its APIs aren't in your training data: use only the neon-realtime skill (.claude/skills/neon-realtime/SKILL.md) and the docs it links.

Unit: <id and title>
Read first: MIGRATION.md (decisions, conventions, contracts, your unit); PATTERNS.md; <1 to 3 files under .claude/skills/neon-realtime/references/>; the "<section names>" sections of https://neon.com/docs/realtime/migrate-from/convex.md; <the reference slice's files>.
Owns: <files>. Change nothing else. Report any change you need elsewhere, or a missing package, in your final report to me, the orchestrator. Never message the user or "main" directly.
Branch: <branch>; pass --branch on every neon command, and --no-secrets where it's supported. Ports: <ports>; stop any server you start, by PID.
Done when: <behavior>; no Convex imports in your files; typecheck and lint pass; your smoke case passes once.
Never print secrets, push or touch the Convex deployment.

End with at most 15 lines: DONE, PARTIAL or BLOCKED; files changed; checks and results; changes needed elsewhere; behavior that differs from Convex.
```

## 6. Finish

1. **Remove Convex:** the `convex` package and its env vars (one install), the rest of `convex/`, `convex.json`, and any leftover client code. Leave the Convex deployment and its data alone; I'll shut it down. Keep the export snapshot (it holds password hashes) gitignored, and for a local deployment keep `.convex/` too (it holds the data). List them in your report.
2. **Review:** two fresh sub-agents in parallel, one for the server and one for the client, check the diff from the baseline commit against this list only, and each returns at most 15 ranked lines. A session check before every seal, and authorization in each query's SQL; sealed queries kept out of URLs, logs and storage; no secret or `DATABASE_URL` in browser code; each write's txid from its own `RETURNING`; a timeout on every `awaitTxId` and every request (write, seal and `refreshQuery` fetches); live components unmounted on sign-out (a renewal that gets 401 keeps retrying); stable row keys; `refreshQuery` on every live query; `debugMode` on only when `NODE_ENV === "development"` (plain Node doesn't set it); no raw database errors in responses; request body limits; each check and its write in one statement, or in a transaction that locks what it checks; accounts linked only by verified email; the JWT algorithm pinned.
3. **Repair:** at most 2 repair sub-agents, each capped at 15 minutes, fix HIGH and MEDIUM findings and list the rest for me.
4. **Verify once:** install, typecheck, tests (or the smoke script, if the app has no tests) and build pass, and nothing imports `convex`. Then prove it's live: one browser end-to-end check where a write in one session appears in another. Without a browser, run `neon realtime subscribe --output json "SELECT ..."` on a migrated query in the background, insert a row with `neon psql <branch> -- -c "INSERT ..."`, show me before and after, then stop the subscription (it never exits).
5. **Report:** what changed, how each Convex feature works now, behavior differences, and what's left for me.

If it won't fit in this session, stop at a clean point: commit, update `MIGRATION.md`, and give me a one-line prompt that resumes from it.

## Docs

- Migration guide: https://neon.com/docs/realtime/migrate-from/convex.md
- Live queries: https://neon.com/docs/realtime/guides/queries.md
- Reactivity: https://neon.com/docs/realtime/guides/reactivity.md
- Optimistic mutations: https://neon.com/docs/realtime/guides/mutations.md
- Server-side rendering: https://neon.com/docs/realtime/guides/ssr.md
- TypeScript SDK: https://neon.com/docs/realtime/sdks/typescript.md
- Examples by stack: https://github.com/neondatabase/examples/tree/main/realtime
