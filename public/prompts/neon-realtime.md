Build reactive apps and agents with Realtime. Work through the Neon CLI rather than interactive pickers.

1. Install or upgrade the Neon CLI: `npm install -g neon@latest`.
2. Install the Neon agent tooling for your editor, replacing `<agent>` with your editor id (for example `cursor`, `claude-code`, or `codex`): run `neon plugins --agent <agent>` (recommended, installs the Neon plugin), or `neon skills --agent <agent> -s neon -s neon-postgres -s neon-realtime`. If sign-in opens a browser, ask me to confirm before continuing, and never print secrets.
3. Using the installed Neon skill, create a Neon project in a supported Realtime region (or connect an existing one), link it, enable Realtime with `neon realtime enable`, and pull my env vars with `neon env pull --service postgres --service realtime`. Realtime doesn't work on Claimable projects, so don't create one.
4. Prove it works: create a small table, run `neon subscribe -o json "SELECT ..."`, show me the first result, then stop the command (it never exits on its own).
5. Then suggest next steps, such as a schema or migrations or building out a reactive app.

For more information, see:

- Overview https://neon.com/docs/realtime/overview.md
- How to get started https://neon.com/docs/realtime/quickstart.md
- How Realtime works  https://neon.com/docs/realtime/how-it-works.md
- Live queries: https://neon.com/docs/realtime/guides/queries.md
- SDK: https://neon.com/docs/realtime/sdks/typescript.md
