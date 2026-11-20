Connect my Phoenix app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up Phoenix docs at https://hexdocs.pm/phoenix/llms.txt

- Fetch Neon's Phoenix guide and follow it: https://neon.com/docs/guides/phoenix.md
- If this folder has a mix.exs file, use that app and don't run mix phx.new.
- Each shell command starts fresh, so set DATABASE_URL in the same command that runs mix, as the guide's Connect step shows. Read it from the env file neon link wrote (.env if it exists, otherwise .env.local), or use neon connection-string, and check it isn't empty (`test -n`) before mix. Start the server in the background, and stop it when you finish.
- Keep my app's Phoenix version. If it's Phoenix 1.7, follow the guide's notes for it.
- Ask me before you pick or create a Neon project.
- Finish by showing me the Postgres version from the running server.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
