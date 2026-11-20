Connect my Quarkus app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up Quarkus docs at https://quarkus.io/llms.txt

- Fetch Neon's Quarkus guide and follow it: https://neon.com/docs/guides/quarkus-jdbc.md
- Run commands from the project root (the folder with pom.xml). For an existing app, check that it has the jdbc-postgresql, agroal, and rest extensions, and add any that are missing with the guide's quarkus ext add command.
- Keep my app's Quarkus version. The same keys exist in Quarkus 3.33 LTS, so don't upgrade the app to follow the guide.
- Ask me before you pick or create a Neon project. Once I've picked one, link the directory with the guide's neon link command, which runs without prompts.
- Don't print the connection string, the password, or the contents of .env in your replies.
- Finish by showing me the Postgres version from the running app.
- If my app needs file uploads, long-running or scheduled work, or LLM calls, suggest the matching service from the guide's "Add more of your backend" section.
