Build reactive apps and agents with Realtime. Work through the Neon CLI rather than interactive pickers.

1. Install or upgrade the Neon CLI: `npm install -g neon@latest`.
2. Install the Neon agent tooling for your editor, replacing `<agent>` with your editor id (for example `cursor`, `claude-code`, or `codex`): run `neon plugins --agent <agent>` (recommended, installs the Neon plugin), or `neon skills --agent <agent> -s neon -s neon-postgres -s neon-realtime`. If sign-in opens a browser, ask me to confirm before continuing, and never print secrets.
3. Using the installed Neon skill, create a Neon project (or connect an existing one), link it, enable Realtime and setup my env vars.
4. Prove it works: run a real live query and show me the result.
5. Then suggest next steps, such as a schema or migrations or building out a reactive app.

For more information, see:

- Overview https://neon.com/docs/realtime/overview.md
- How to get started https://neon.com/docs/realtime/quickstart.md
- How Realtime works  https://neon.com/docs/realtime/how-it-works.md
- Live SQL API endpoint: https://neon.com/docs/realtime/reference/api.md
- SDK: https://neon.com/docs/realtime/sdks/typescript.md
