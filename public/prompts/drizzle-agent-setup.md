Install Drizzle's official agent skill so you follow Drizzle's own guidance when you work on this project:

1. Open Drizzle's agent skills page at https://orm.drizzle.team/docs/drizzle-kit-skills and follow its current install steps, since that page is the source of truth and the commands change between releases.
2. As documented there today, install Drizzle in the directory that holds your Drizzle schema and config, then run the skills installer and choose this agent when prompted:
   ```bash
   npm i drizzle-orm@rc
   npm i -D drizzle-kit@rc
   npx --no-install drizzle-kit skills
   ```
   Adapt the commands to this project's package manager (yarn, pnpm, or bun) if it is not npm.
3. Load the `drizzle` skill in your skill picker, or ask me to, so it is active before you generate or change any schema or migration.

Tell me which agent and scope you installed it for, and confirm the `drizzle` skill is loaded. Do not run any migrations yet.
