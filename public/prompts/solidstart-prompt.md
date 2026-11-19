Connect my SolidStart app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up SolidStart 2 (@solidjs/start 2.x) docs at https://start.solidjs.com

- Fetch Neon's SolidStart guide and follow it: https://neon.com/docs/guides/solid-start.md
- Check the `@solidjs/start` major version in my package.json. This guide covers SolidStart 2 (`@solidjs/start` 2.x). If it's SolidStart 1 (1.x), tell me and stop until I answer.
- If this folder has no package.json, or no `@solidjs/start` in it, ask me to run the guide's create command from the folder that should contain the app, then continue inside the new `my-app` folder. Don't run it yourself.
- Ask me before you pick or create a Neon project.
- Finish by showing me the Postgres version on the running page.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
