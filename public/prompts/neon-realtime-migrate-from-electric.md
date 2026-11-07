Migrate this Electric app fully to Neon Realtime. Done means the app runs on Neon Postgres with Realtime live queries, and nothing in it depends on Electric.

Realtime is new and in beta, so its APIs aren't in your training data: follow the neon-realtime skill and the docs below rather than guessing. Work through the Neon CLI rather than interactive pickers, and never print secrets.

## How you work

You're the orchestrator. A real app is usually too big for one session, so you plan, delegate, verify and keep state; sub-agents read and write the code.

- **Protect your context.** Don't read app source, docs or long logs yourself. Ask sub-agents for answers, not file contents, and read command output by its tail.
- **Keep state on disk** in `MIGRATION.md` at the app root: a short "Resume here" block, my decisions, conventions, each slice's contract, and each unit with its files and status. You're its only writer. Sub-agents read it, so their briefs stay short.
- **Set the model.** When you can, give every sub-agent that writes or reviews code the most capable model.
- **Parallelize only file-disjoint work.** Each unit owns its files. Shared files (server entry, router, package manifest, lockfile, env files) belong to you or one named unit; other sub-agents report the change they need.
- **Wait, don't poll.** Never `sleep` to wait for a sub-agent or a background command.
- **Use git:** a new branch, a commit after each verified step, no push.
- **No sub-agents?** Run the same units one at a time.

## 1. Set up and take inventory

Dispatch the inventory sub-agent first. It writes `MIGRATION-inventory.md`: the stack and check commands; each shape and its proxy route; each write route and how it confirms (a txid or `matchStream`); the TanStack DB collections; the auth helper; and where Postgres and Electric run. It returns at most 30 lines.

Meanwhile:

1. Install or upgrade the Neon CLI: `npm i -g neon@latest`.
2. Install the Neon agent skills, including Realtime: `neon skills -s neon -s neon-realtime -y`. Skills installed now may not load until a restart, so give sub-agents the path of the installed `neon-realtime/SKILL.md`, or https://neon.com/docs/ai/skills/neon-realtime/SKILL.md if it wasn't installed.
3. If `neon me` shows I'm signed out, run `neon login` (it opens a browser) and wait for my confirmation.

## 2. Ask me everything at once

Ask me these in one message, each with your recommendation and a one-line reason. Don't ask again unless you're blocked.

1. **Project and branch:** the database must be on Neon; if it isn't, stop and ask me to move it. Recommend a new branch.
2. **Queries:** raw SQL, Drizzle or Kysely; recommend what the app uses.
3. **Client state:** plain React or TanStack DB; recommend TanStack DB if the app uses it.

## 3. Provision

From the app root:

1. For a new branch: `neon branches create --project-id <id> --name <branch> --no-secrets`.
2. `neon link --project-id <id> --branch <branch>`.
3. `neon realtime enable`.
4. `neon env pull --service postgres --service realtime`.

## 4. Plan and run the units

1. **Foundation and reference slice.** `createRealtime`, the browser client and provider, env wiring, packages, and each slice's contract (routes, request and response types, hooks). Then one shape end to end, with the pattern in `PATTERNS.md`.
2. **Slices.** One per shape proxy route, with its write routes and components. A component calling several routes goes to one slice. Each deletes its proxy route and Electric call sites and uses other slices only via their contracts.

After unit 1, dispatch the slices in waves of up to four, each with its own dev port. After each wave, run one typecheck and send failures to one repair sub-agent.

**Checks, not test suites.** A unit is done when typecheck and lint pass. Unit 1 writes one API-level smoke script, and each slice adds at most one case.

## 5. Sub-agent brief

Sub-agents start with none of your context, so brief every one with this template:

```text
You're migrating part of an Electric app to Neon Realtime. Realtime is in beta and its APIs aren't in your training data: use only the neon-realtime skill (<path to its SKILL.md>) and the docs it links.

Unit: <id and title>
Read first: MIGRATION.md (decisions, conventions, contracts, your unit); PATTERNS.md; the skill's reference files for <1 to 3 areas>; the "<section names>" sections of https://neon.com/docs/realtime/migrate-from/electric.md; <the reference slice's files>.
Owns: <files>. Change nothing else. Report any change you need elsewhere, or a missing package, in your final report; don't contact the user.
Branch: <branch>. Ports: <ports>; stop any server you start.
Done when: <behavior to preserve>; no Electric imports remain in your files; typecheck and lint pass; your smoke case passes.
Never print secrets, push or touch the Electric service.

End with at most 15 lines: DONE, PARTIAL or BLOCKED; files changed; checks and results; changes needed elsewhere; behavior that differs from Electric.
```

## 6. Finish

1. **Remove Electric:** its packages, proxy routes and env vars. Leave the Electric service, its slot and its publication alone; I'll remove them per the guide's "Remove Electric" section.
2. **Review:** two fresh sub-agents (server and client) check the diff from the baseline commit against the skill's rules, especially: a session check before every seal, and authorization in each query's SQL; sealed queries kept out of URLs, logs and storage; no secret or `DATABASE_URL` in browser code; each write's txid from its own `RETURNING`, with its access check in the same statement; a timeout on every `awaitTxId`; stable row keys; `refreshQuery` on every live query. Each returns at most 15 ranked findings.
3. **Repair:** at most 2 repair sub-agents fix HIGH and MEDIUM findings and list the rest for me.
4. **Verify once:** install, typecheck, tests (or the smoke script) and build pass, and nothing imports Electric. Then prove it's live: a write in one session appears in another. Without a browser, run `neon realtime subscribe --output json "SELECT ..."` on a migrated query in the background, insert a row with `neon psql <branch> -- -c "INSERT ..."`, show me before and after, then stop the subscription (it never exits).
5. **Report:** what changed, behavior differences, and what's left for me.

If it won't fit in this session, stop at a clean point: commit, update `MIGRATION.md`, and give me a one-line prompt that resumes from it.

## Docs

- Migration guide: https://neon.com/docs/realtime/migrate-from/electric.md
- Live queries: https://neon.com/docs/realtime/guides/queries.md
- Reactivity: https://neon.com/docs/realtime/guides/reactivity.md
- Optimistic mutations: https://neon.com/docs/realtime/guides/mutations.md
- Server-side rendering: https://neon.com/docs/realtime/guides/ssr.md
- TypeScript SDK: https://neon.com/docs/realtime/sdks/typescript.md
- Examples by stack: https://github.com/neondatabase/examples/tree/main/realtime
