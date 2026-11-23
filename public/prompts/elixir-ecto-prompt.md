Connect my Elixir Ecto app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up Ecto docs at https://hexdocs.pm/ecto/llms.txt

- Fetch Neon's Elixir Ecto guide and follow it: https://neon.com/docs/guides/elixir-ecto.md
- Use my app's name from mix.exs.
- If config/runtime.exs or lib/<app>/application.ex has code I wrote, ask me before you replace it.
- If my app uses an older Ecto version, ask me before upgrading it.
- Ask me before you pick or create a Neon project.
- Ask me which branch to use before you run a migration.
- Run migrations on the direct connection (DATABASE_URL_UNPOOLED), as the guide shows. The app uses the pooled DATABASE_URL.
- If a migration command asks to reset or drop data, stop and ask me.
- Finish by showing me the Postgres version that the script prints.
- If my app needs sign-in, file uploads, long-running or scheduled work, or LLM calls, suggest the matching service from the guide's "Next steps" section.
