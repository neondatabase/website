Connect my Next.js app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up Next.js docs in node_modules/next/dist/docs/ once the app has its dependencies, or at https://nextjs.org/llms.txt

- Fetch Neon's Next.js guide and follow it: https://neon.com/docs/guides/nextjs.md
- Keep my app's router and Next.js version. If it uses the Pages Router, follow the guide's Pages Router section.
- Don't add `export const dynamic = 'force-dynamic'` to an app with Cache Components on (`cacheComponents: true` in `next.config.ts`, `next.config.mts`, `next.config.js`, or `next.config.mjs`), since the build fails. Use the guide's `connection()` and `<Suspense>` instead.
- Use the Neon serverless driver (`@neondatabase/serverless`) unless my app already uses `pg` or `postgres`.
- Ask me before you pick or create a Neon project.
- Finish by showing me the Postgres version from the running app.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
