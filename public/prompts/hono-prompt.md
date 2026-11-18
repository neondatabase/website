Connect my Hono app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Offer to install Hono's agent skill with `npx skills add honojs/skills --skill hono -a <your agent id> -y`. Look up Hono docs at https://hono.dev/llms.txt

- Fetch Neon's Hono guide and follow it: https://neon.com/docs/guides/hono.md
- Keep my app's runtime and Hono version. If it doesn't run on Node.js, or it uses `@hono/node-server` 1.x, follow the guide's notes for them.
- Ask me before you pick or create a Neon project.
- Finish by showing me the Postgres version from the running server.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
