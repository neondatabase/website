Connect my Node.js project to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up the docs for the driver I choose:
  - node-postgres: https://node-postgres.com
  - postgres.js: https://github.com/porsager/postgres
  - Neon serverless driver: https://neon.com/docs/serverless/serverless-driver.md
- If I haven't chosen a driver, ask me which one to use.

- Fetch Neon's Node.js guide and follow it: https://neon.com/docs/guides/node.md
- Keep my Node.js version and module system. If my project uses CommonJS, follow the guide's note for it.
- Use the package manager this project already uses; the guide's commands use npm.
- If index.js already has code I wrote, ask me before you replace it.
- Ask me before you pick or create a Neon project.
- Finish by showing me the Postgres version that the script printed.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
