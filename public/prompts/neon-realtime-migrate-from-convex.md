Migrate this Convex app fully to Neon Realtime. Done means the app runs on Neon Postgres with Realtime live queries, and nothing in it depends on Convex.

Realtime is new and in beta, so its APIs aren't in your training data: follow the neon-realtime skill and the docs below rather than guessing. Work through the Neon CLI rather than interactive pickers, and never print secrets.

## How you work

You're the orchestrator. A real app is usually too big for one session, so you plan, delegate, verify and keep state; sub-agents read and write the code.

- **Protect your context.** Don't read app source, docs or long logs yourself. Ask sub-agents for answers, not file contents, and read command output by its tail.
- **Keep state on disk** in `MIGRATION.md` at the app root: the inventory, my decisions, conventions, and each unit with its files and status. The inventory sub-agent creates it; then you're its only writer. Sub-agents read it, so their briefs stay short.
- **Set the model.** When you can, give every sub-agent that writes or reviews code the most capable model.
- **Parallelize only file-disjoint work.** Each unit owns its files. Shared files (server entry, router, package manifest, lockfile, env files) belong to you or one named unit; other sub-agents report the change they need.
- **Wait, don't poll.** Use completion notifications when available.
- **Use git:** a new branch, a commit after each verified step, no push.
- **No sub-agents?** Run the same units one at a time.

## 1. Set up and take inventory

Dispatch the inventory sub-agent first, so it runs while you set up. It writes to `MIGRATION.md`: the framework, package manager, and install, typecheck, test and build commands; Convex tables; every Convex function (query, mutation, action, internal, HTTP action) with its file and client call sites (`useQuery`, `useMutation`, `usePaginatedQuery`, `useAction`, optimistic updates); auth; Convex-only features (scheduler, crons, file storage, search and vector indexes, components); and any existing server. It returns at most 30 lines.

Meanwhile:

1. Install the app's dependencies with its package manager if needed (the schema tool evaluates `convex/schema.ts`).
2. Install or upgrade the Neon CLI: `npm i -g neon@latest`.
3. Install the Neon agent skills, including Realtime: `neon skills -s neon -s neon-realtime -y`. If a new skill needs a restart to load, read https://neon.com/docs/ai/skills/neon-realtime/SKILL.md instead.
4. If `neon me` shows I'm signed out, run `neon login` (it opens a browser) and wait for my confirmation.

## 2. Ask me everything at once

Then ask me these in one message, each with your recommendation and a one-line reason from the inventory. Record my answers in `MIGRATION.md`, and don't ask again unless you're blocked.

1. **Neon project:** reuse one (list them) or create one. Realtime is available in `aws-us-east-1`, `aws-us-east-2`, `aws-eu-central-1` and `aws-ap-southeast-1`, and not on Claimable projects, so don't create one.
2. **Migration:** schema only, or schema and data from the dev deployment (recommended) or from production (`--prod`).
3. **Queries:** raw SQL, Drizzle or Kysely.
4. **Client state:** plain React (`useLiveQuery` with `useOptimistic`) or TanStack DB. If the app uses TanStack DB, recommend keeping it.
5. **Backend:** sealing queries and handling writes need trusted server code, which Convex apps often lack. Use the app's server (like Next.js route handlers or TanStack Start server functions), or if it has none, recommend Hono (simplest) or TanStack Start (more comprehensive).
6. **Auth:** keep the provider if it doesn't depend on Convex. For Convex Auth, propose Neon Managed Better Auth and agree whether and how to migrate existing accounts.
7. **Convex-only features:** how each maps, per the guide's wider platform features section.

## 3. Provision

1. Link the project: `neon link --project-id <id>`, or `neon link --org-id <org-id> --project-name <name> --region-id <region>`.
2. Enable Realtime: `neon realtime enable`.
3. Run `neon env pull --service postgres --service realtime` to write `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to the app's env file.

## 4. Plan and run the units

The migration guide works in six layers: schema, queries, auth (`seal()`), reactivity (`useLiveQuery`), writes (an endpoint that returns the txid) and optimistic state (`awaitTxId` or TanStack DB). Plan these units in `MIGRATION.md`:

1. **Schema and data.** The guide's schema step with `@neon/convex-to-postgres`, importing the data I chose. Report the tool's warnings and each table's row count.
2. **Foundation and reference slice.** Everything the slices share: the schema module or row types, matching the generated tables exactly, column names included; the database client; `createRealtime`; the auth helper; one backend route module per slice; the browser Realtime client and provider in place of Convex's; env wiring; every package install. Then migrate one small slice end to end, as the pattern for the rest.
3. **Slices.** One per Convex module (for example, `convex/messages.ts`): its functions, endpoints and calling components. A component that calls several modules goes to one slice.
4. **Platform features**, as I chose.

Run units 1 and 2 in order, verifying each, then dispatch the slices and platform features in waves of up to four. After each wave, run the typecheck and tests (tails only), and send any failure, with its output, to a repair sub-agent.

## 5. Sub-agent brief

Sub-agents start with none of your context, so brief every one with this template:

```text
You're migrating part of a Convex app to Neon Realtime. Realtime is in beta and its APIs aren't in your training data: use only the neon-realtime skill (or https://neon.com/docs/ai/skills/neon-realtime/SKILL.md) and the docs it links, and read the skill's reference file for each area before writing that code.

Unit: <id and title>
Read first: MIGRATION.md (decisions, conventions, your unit); the sections of https://neon.com/docs/realtime/migrate-from/convex.md for <layers>; <the reference slice's files>.
Owns: <files>. Change nothing else. Report any change you need elsewhere, or a missing package.
Done when: <behavior to preserve>; no Convex imports remain in your files; the typecheck and your files' tests pass.
Never print secrets, push or touch the Convex deployment.

End with at most 15 lines: DONE, PARTIAL or BLOCKED; files changed; checks and results; changes needed elsewhere; behavior that differs from Convex.
```

## 6. Finish

1. **Remove Convex:** the `convex` package and `convex/` directory, Convex env vars and leftover client code. Leave the Convex deployment and its data alone; I'll shut it down.
2. **Review:** a fresh sub-agent checks the diff against the skill's rules, especially: a session check before every seal, and authorization in each query's SQL; sealed queries kept out of URLs, logs and storage; no secret or `DATABASE_URL` in browser code; each write's txid from its own `RETURNING`; a timeout on every `awaitTxId`; stable row keys; `refreshQuery` on every live query. Repair sub-agents fix its findings.
3. **Verify:** install, typecheck, test and build pass, and nothing imports `convex`. Then prove it's live: a write in one session appears in another. Without a browser, run `neon realtime subscribe --output json "SELECT ..."` on a migrated query in the background, insert a row with `neon psql -- -c "INSERT ..."`, show me before and after, then stop the subscription (it never exits).
4. **Report:** what changed, how each Convex feature works now, behavior differences, and what's left for me.

If it won't fit in this session, stop at a clean point: commit, update `MIGRATION.md`, and give me a one-line prompt that resumes from it.

## Docs

- Migration guide: https://neon.com/docs/realtime/migrate-from/convex.md
- Live queries: https://neon.com/docs/realtime/guides/queries.md
- Reactivity: https://neon.com/docs/realtime/guides/reactivity.md
- Optimistic mutations: https://neon.com/docs/realtime/guides/mutations.md
- Server-side rendering: https://neon.com/docs/realtime/guides/ssr.md
- TypeScript SDK: https://neon.com/docs/realtime/sdks/typescript.md
- Examples by stack: https://github.com/neondatabase/examples/tree/main/realtime
