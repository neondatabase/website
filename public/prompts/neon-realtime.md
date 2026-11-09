Help me build a realtime, reactive app with Neon Realtime, which makes any SQL query live. Realtime is new and in beta, so its APIs aren't in your training data: follow the neon-realtime skill and the docs below rather than guessing. Work through the Neon CLI rather than interactive pickers, and never print secrets.

1. Install or upgrade the Neon CLI: `npm i -g neon@latest`.
2. Install the Neon agent skills, including Realtime: `neon skills -s neon -s neon-realtime -y`. If you can't load a newly installed skill without a restart, read https://neon.com/docs/ai/skills/neon-realtime/SKILL.md instead.
3. Sign in if needed: check with `neon me`, and run `neon login` if I'm not signed in (it opens a browser, so pause and ask me to confirm once I've signed in).
4. Ask me whether to reuse an existing project or create a new one, then link it: `neon link --project-id <id>`, or `neon link --org-id <org-id> --project-name <name> --region-id <region>`. Realtime is available in `aws-us-east-1`, `aws-us-east-2`, `aws-eu-central-1` and `aws-ap-southeast-1`, and not on Claimable projects, so don't create one.
5. Enable Realtime with `neon realtime enable`, then run `neon env pull --service postgres --service realtime` to write `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to `.env.local`.
6. Prove it works: create a small table with a primary key, run `neon realtime subscribe --output json "SELECT ..."` in the background, insert a row with `neon psql -- -c "INSERT ..."`, and show me the result before and after the insert. Then stop the subscription, because it never exits on its own.
7. Then suggest next steps from the skill: add live queries and optimistic writes to my app, or start a new one with `neon bootstrap my-app --template realtime-react`.

Read the current docs for exact package names and APIs:

- Overview: https://neon.com/docs/realtime/overview.md
- Quickstart: https://neon.com/docs/realtime/quickstart.md
- How Realtime works: https://neon.com/docs/realtime/how-it-works.md
- Live queries: https://neon.com/docs/realtime/guides/queries.md
- Subscribing: https://neon.com/docs/realtime/guides/subscribing.md
- Reactivity (React, TanStack DB): https://neon.com/docs/realtime/guides/reactivity.md
- Optimistic mutations: https://neon.com/docs/realtime/guides/mutations.md
- Server-side rendering: https://neon.com/docs/realtime/guides/ssr.md
- TypeScript SDK reference: https://neon.com/docs/realtime/sdks/typescript.md
- Full-stack examples: https://neon.com/docs/realtime/examples/nextjs.md, https://neon.com/docs/realtime/examples/tanstack.md
