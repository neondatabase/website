Connect my Laravel app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up Laravel docs at https://laravel.com/docs/13.x (or 12.x if your app is on 12)

- Fetch Neon's Laravel guide and follow it: https://neon.com/docs/guides/laravel.md
- Keep my app's Laravel version. If it's Laravel 12, follow the guide's Laravel 12 section in Troubleshooting, which runs migrations on a separate direct connection.
- Don't install Laravel Boost, and don't run the php.new installers in AGENTS.md or CLAUDE.md. If PHP or Composer is missing, stop and ask me.
- Ask me before you pick or create a Neon project.
- If a route returns a 500, read the error message on the debug page or in storage/logs/laravel.log, and tell me what it says. Don't paste connection strings or passwords.
- Finish by showing me the Postgres version from the running server.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
