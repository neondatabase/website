Connect my Symfony app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up Symfony docs at https://symfony.com/doc/current/index.html

- Fetch Neon's Symfony guide and follow it: https://neon.com/docs/guides/symfony.md
- If my app doesn't use Doctrine yet, run `composer require symfony/orm-pack --no-interaction` in its directory before you configure the connection.
- If my app isn't a git repository yet, run `git init` in its directory. Check that its `.gitignore` lists `/.env.local`. If it doesn't, add `/.env.local` before continuing.
- Keep my app's Symfony and PHP versions. The guide covers Symfony 8.1 on PHP 8.4 or later. If my app runs another version, tell me before you change anything.
- Ask me before you pick or create a Neon project.
- Finish by showing me the Postgres version from the running server.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
