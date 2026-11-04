Migrate this Convex app fully to Neon Realtime. Done means the app runs on Neon Postgres with Realtime live queries, and nothing in it depends on Convex.

Realtime is new and in beta, so its APIs aren't in your training data: follow the neon-realtime skill and the docs below rather than guessing. Work through the Neon CLI rather than interactive pickers, and never print secrets.

## How you work

You're the orchestrator. A real app is usually too big for one session, so you plan, delegate, verify and keep state; sub-agents read and write the code.

- **Protect your context.** Don't read app source, docs or long logs yourself. Ask sub-agents for answers, not file contents, and read command output by its tail.
- **Keep state on disk** in `MIGRATION.md` at the app root, under 15 KB: a short "Resume here" block, my decisions, conventions, each slice's contract, and each unit with its files and status. You're its only writer. Sub-agents read it, so their briefs stay short.
- **Set the model.** When you can, give every sub-agent that writes or reviews code the most capable model.
- **Parallelize only file-disjoint work.** Each unit owns its files. Shared files (server entry, router, package manifest, lockfile, env files) belong to you or one named unit; other sub-agents report the change they need.
- **Wait, don't poll.** Never `sleep` to wait for a sub-agent or a background command. A unit still running after 30 minutes stops and reports PARTIAL with its blocker.
- **Use git:** a new branch, a commit after each verified step, no push.
- **No sub-agents?** Run the same units one at a time.

## 1. Set up and take inventory

Dispatch the inventory sub-agent first, so it runs while you set up. It writes `MIGRATION-inventory.md`: the framework, package manager, and install, typecheck, lint, test and build commands; Convex tables; every Convex function (query, mutation, action, internal, HTTP action) with its file and client call sites (`useQuery`, `useMutation`, `usePaginatedQuery`, `useAction`, optimistic updates); auth; Convex-only features (scheduler, crons, file storage, search and vector indexes, components); and any existing server. It returns at most 30 lines.

Meanwhile:

1. Install the app's dependencies with its package manager if needed (the schema tool evaluates `convex/schema.ts`).
2. Install or upgrade the Neon CLI: `npm i -g neon@latest`.
3. Install the Neon agent skills, including Realtime: `neon skills -s neon -s neon-realtime -y`, and commit the files it adds. Skills installed now may not load until a restart, so give sub-agents the path of the installed `neon-realtime/SKILL.md`.
4. If `neon me` shows I'm signed out, run `neon login` (it opens a browser) and wait for my confirmation.

## 2. Ask me everything at once

Then ask me these in one message, each with your recommendation and a one-line reason from the inventory. Record my answers in `MIGRATION.md`, and don't ask again unless you're blocked.

1. **Neon project and branch:** reuse a project (list them) or create one, and the branch to migrate into. In a reused project, recommend a new branch named after the app, never one another app uses. Realtime is available in `aws-us-east-1`, `aws-us-east-2`, `aws-eu-central-1` and `aws-ap-southeast-1`, and not on Claimable projects, so don't create one.
2. **Migration:** schema only, or schema and data from the dev deployment (recommended) or from production, per the guide's "Migrate your schema" step.
3. **Queries:** raw SQL, Drizzle or Kysely.
4. **Client state:** plain React (`useLiveQuery` with `useOptimistic`) or TanStack DB. If the app uses TanStack DB, recommend keeping it.
5. **Backend:** sealing queries and handling writes need trusted server code, which Convex apps often lack. Use the app's server (like Next.js route handlers or TanStack Start server functions), or if it has none, recommend Hono (simplest) or TanStack Start (more comprehensive).
6. **Auth:** keep the provider if it doesn't depend on Convex. For Convex Auth, propose Neon Managed Better Auth and agree how to connect existing users, per the guide's "Migrate auth providers" section.
7. **Convex-only features:** how each maps, per the guide's "Map other Convex features" table.
8. **Database changes:** consent for sub-agents to create, alter and fill tables on the chosen branch, and only that branch. If you need my approval for each command, ask me now to allow `neon psql` on that branch.

## 3. Provision

Run these from the app root:

1. For a new branch in a reused project: `neon branches create --project-id <id> --name <branch> --no-secrets`.
2. Pin the CLI to this app, so it doesn't use a parent folder's `.neon`: `[ -f .neon ] || echo '{}' > .neon`. Then link with `neon link --project-id <id> --branch <branch> --context-file "$PWD/.neon"` (or `--org-id <org-id> --project-name <name> --region-id <region>` to create a project), and check that it says `Linked ./.neon`.
3. Enable Realtime: `neon realtime enable --branch <branch> --allowed-origin http://localhost:<port>`, with an `--allowed-origin` for each dev server that will run in parallel.
4. For Managed Better Auth: `neon neon-auth enable --branch <branch>`.
5. `neon env pull --branch <branch> --service postgres --service realtime` (add `--service auth` for Managed Better Auth) writes `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to the app's env file.
6. For Neon Functions: `neon skills -s neon-functions -y`.

Pass `--branch <branch>` on every later `neon` command. `neon psql` takes the branch as its first argument instead (`neon psql <branch> -- -c "..."`).

## 4. Plan and run the units

The migration guide works in six layers: schema, queries, auth (`seal()`), reactivity (`useLiveQuery`), writes (an endpoint that returns the txid) and optimistic state (`awaitTxId` or TanStack DB). Plan these units in `MIGRATION.md`:

1. **Schema and data.** The guide's "Migrate your schema" step with `@neon/convex-to-postgres`. First write `db/schema.sql` with the tool's `schema` command, for the other units to read, then import the data I chose. Report the tool's warnings and each table's row count.
2. **Foundation and reference slice.** Everything the slices share: row types that match the generated tables exactly, column names included; the database client; `createRealtime`; the auth helper; one backend route module per slice; the browser Realtime client and provider in place of Convex's; env wiring; every package install. It writes each slice's contract (route paths, request and response types, hook signatures, row types) into `MIGRATION.md`. Then it migrates one small slice end to end, as the pattern for the rest, and describes that pattern in `PATTERNS.md`.
3. **Slices.** One per Convex module (for example, `convex/messages.ts`): its functions, endpoints and calling components. A component that calls several modules goes to one slice. Each slice deletes its own Convex module and call sites, and depends on other slices only through their contracts.
4. **Platform features**, as I chose.

Unit 2 starts as soon as `db/schema.sql` exists. Once units 1 and 2 are done, dispatch every slice and platform feature in one wave, each with its own dev port from the allowed origins. After the wave, run one typecheck, and send any failures, with their output, to one repair sub-agent.

**Checks, not test suites.** A unit is done when the typecheck and lint pass. Don't write per-unit test harnesses or browser tests. Unit 2 writes one API-level smoke script (two sessions: sign in, load, write, see the write live in the other), and each slice adds at most one case. Run checks under `timeout`, and close Realtime and database handles so scripts exit. If the app has a test suite, run only your files' tests.

## 5. Sub-agent brief

Sub-agents start with none of your context, so brief every one with this template:

```text
You're migrating part of a Convex app to Neon Realtime. Realtime is in beta and its APIs aren't in your training data: use only the neon-realtime skill (<path to its SKILL.md>) and the docs it links.

Unit: <id and title>
Read first: MIGRATION.md (decisions, conventions, contracts, your unit); PATTERNS.md; the skill's reference files for <1 to 3 areas>; the "<section names>" sections of https://neon.com/docs/realtime/migrate-from/convex.md; <the reference slice's files>.
Owns: <files>. Change nothing else. Report any change you need elsewhere, or a missing package, in your final report; don't contact the user.
Branch: <branch>; pass --branch on every neon command. Ports: <ports>; stop any server you start.
Done when: <behavior to preserve>; no Convex imports remain in your files; typecheck and lint pass; your smoke case passes.
Never print secrets, push or touch the Convex deployment.

End with at most 15 lines: DONE, PARTIAL or BLOCKED; files changed; checks and results; changes needed elsewhere; behavior that differs from Convex.
```

## 6. Finish

1. **Remove Convex:** the `convex` package and its env vars, the rest of `convex/`, `convex.json` and any leftover client code. Leave the Convex deployment and its data alone; I'll shut it down.
2. **Review:** two fresh sub-agents in parallel, one for the server and one for the client, check the diff from the baseline commit against the skill's rules, especially: a session check before every seal, and authorization in each query's SQL; sealed queries kept out of URLs, logs and storage; no secret or `DATABASE_URL` in browser code; each write's txid from its own `RETURNING`, with its access check in the same statement; a timeout on every request and every `awaitTxId`; accounts linked only by verified email; stable row keys; `refreshQuery` on every live query. Each returns at most 15 ranked findings.
3. **Repair:** at most 2 repair sub-agents, 15 minutes each, fix HIGH and MEDIUM findings and list the rest for me.
4. **Verify once:** install, typecheck, tests (or the smoke script) and build pass, and nothing imports `convex`. Then prove it's live: a write in one session appears in another. Without a browser, run `neon realtime subscribe --output json "SELECT ..."` on a migrated query in the background, insert a row with `neon psql <branch> -- -c "INSERT ..."`, show me before and after, then stop the subscription (it never exits).
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
