Connect my Reflex app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Offer to install Reflex's agent skills with `npx skills add reflex-dev/agent-skills -a <your agent id> --skill '*' -y`. Look up Reflex docs at https://reflex.dev/docs/llms.txt. If the reflex-docs skill is installed, use it for Reflex APIs.

- Fetch Neon's Reflex guide and follow it: https://neon.com/docs/guides/reflex.md
- Keep my app's Reflex version. Reuse the project's .venv if it exists, and never install packages globally: use .venv/bin/pip (on Windows, .\.venv\Scripts\pip).
- If my app uses Reflex 0.10 or earlier, or rx.Model or rx.session(), follow the guide's notes for those.
- If my app already has rxconfig.py, skip the steps that create the app, and add the guide's changes to my files instead of replacing them. Use my app's own package name wherever the guide says with_reflex.
- Ask me before you pick or create a Neon project.
- Before you run migrations, check that .env sets DATABASE_URL_UNPOOLED, which migrations require, and DATABASE_URL, which the app uses. Use count-only greps (grep -c '^DATABASE_URL_UNPOOLED=' .env and grep -c '^DATABASE_URL=' .env) and never print the lines. If either count is 0, stop and ask me before migrating.
- Finish by showing me the Postgres version from the running server.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
