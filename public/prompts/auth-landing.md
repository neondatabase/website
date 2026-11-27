Help me get set up with Neon's managed Better Auth, based on my project:

1. Install the Neon CLI with `npm install -g neon@latest`.
2. Read the `neon-auth` skill at https://neon.com/.well-known/agent-skills/neon-auth/SKILL.md and use it to guide this setup.
3. Run `neon init` to link a project and install Neon's agent tooling. Then turn on Neon's managed Better Auth: add `auth: true` to `neon.ts`, run `neon deploy`, and confirm it with `neon neon-auth status`.
4. Add authentication to this project using Neon's Auth SDK (`@neon/auth`), starting with email-and-password sign-up and sign-in plus any OAuth providers or plugins my app needs, then prove it works: sign up a real test user and read the current user back. Don't print secrets.
