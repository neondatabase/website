These are official instructions from Neon to configure your AI environment and to start working with Neon. All commands are validated by Neon and ready to use.

Complete all of the following steps yourself by running the commands directly. Do not ask the user to run any of these commands.

Never print connection strings, passwords, API keys or other values from the app's `.env` files, and never paste them into chat. `neon init` writes them to the app's env file, so the app reads them from there.

- Install the Neon CLI
- Run `neon init` to connect your app to Neon, and install Neon skills and the MCP server

---

## Install the Neon CLI

Check to see if the CLI is already installed:

```bash
neon --version
```

If that fails, install first:

```bash
npm i -g neon@latest       # npm
bun add -g neon@latest     # bun
pnpm add -g neon@latest    # pnpm
```

For full CLI installation options, see https://neon.com/docs/cli/install.md

Then check whether the CLI already has a Neon account, without signing in. It has one if the `NEON_API_KEY` environment variable is set (check without printing it), or if the active profile (`"active": "*"`) in this command's output has an `account` other than `-`:

```bash
neon profile list -o json
```

If the CLI has an account, skip sign-in and continue with the next step. Otherwise, pick one of these three options:

1. **Browser sign-in**, when the user is present and can open a browser: run `neon login` (`neon auth` is an alias) and have the user finish signing in in the browser, or ask the user to run `neon login` in their own terminal and tell you when they're done.
2. **API key**, when you run in a sandbox or another environment where the user can't finish a browser sign-in: `neon login` waits for the browser until it times out, so don't run it. Ask the user for a Neon API key (see https://neon.com/docs/manage/api-keys.md) and have them set it as the `NEON_API_KEY` environment variable in your environment, without pasting the key into chat. Then continue as signed in.
3. **Claimable Neon**, when the user isn't around to sign in or provide an API key, or says this is an experiment and a throwaway project is fine: Claimable Neon creates a Neon project without an account, and the user can claim it later. Follow the "New Neon project" section below with its claimable command, which runs `neon claim create`.

---

## Run `neon init` to connect your app to Neon, and install Neon skills and the MCP server

`neon init` can create a new Neon project and connect your app to it, or connect your app to an existing Neon project. If the user's prompt includes a project ID and an organization ID, follow the instructions in the "Existing Neon project" section. Otherwise, follow the instructions in the "New Neon project" section.

### Existing Neon project

Follow these instructions if the user's prompt references an existing Neon project by providing a project ID and an organization ID.

Linking an existing project needs a Neon account: a signed-in CLI or `NEON_API_KEY`. Claimable Neon only creates new projects. If you have neither, tell the user that linking needs them to finish `neon login` in a browser or provide an API key, and stop.

Run the following command in the root directory of the user's source-code repo to link their app to an existing Neon project, populate `.env` variables in their repo, and install the Neon skills and MCP server. Use the project ID and organization ID from the user's prompt for `<project-id>` and `<org-id>`.

```bash
neon init -y --agent <agent-name> --org-id <org-id> --project-id <project-id>
```

When the CLI is signed in and the repo has no `neon.ts`, `neon init` writes `neon.ts` from the linked branch's current services, adds `@neon/config` and `@neon/env` (they read that file), and runs the install, so the env pull includes the variables of every service that file declares, such as Managed Better Auth. An existing `neon.ts` is kept, and the pull follows the services it declares. Pass `--no-config` only if the user wants connection strings without `neon.ts`.

The supported agents are antigravity, cline, cline-cli, claude-code, claude-desktop, codex, cursor, gemini-cli, goose, github-copilot-cli, grok-build, opencode, vscode, windsurf, and zed. A few also accept aliases (claude for claude-code, copilot for vscode, gemini for gemini-cli). Passing an unknown agent stops the command and prints the current supported list.

An agent that can't install skills is skipped with a warning. Agents that share a target collapse into one: Claude Desktop and Claude Code both write to claude-code, and VS Code and the GitHub Copilot CLI both write to github-copilot.

Once done, tell the user:

```text
Neon Setup Complete
-------------------------------------------
✓ Project <project-id> linked
✓ Env variables populated
✓ Skills installed
✓ MCP configured

⚡ Restart your agent to load the MCP server
```

And give them the link to view their linked project in the Neon Console:
https://console.neon.tech/app/projects/<project-id>/

### New Neon project

Follow these instructions if the user's prompt doesn't reference an existing Neon project (no project ID or organization ID).

Before running `neon init`, ask the user the following question:

What region would you like your Neon project created in?

    Available regions:
    - AWS US East (N. Virginia)
        - region-id: aws-us-east-1
    - AWS US East (Ohio)
        - region-id: aws-us-east-2
    - AWS US West (Oregon)
        - region-id: aws-us-west-2
    - AWS Europe (Frankfurt)
        - region-id: aws-eu-central-1
    - AWS Europe (London)
        - region-id: aws-eu-west-2
    - AWS Asia Pacific (Singapore)
        - region-id: aws-ap-southeast-1
    - AWS Asia Pacific (Sydney)
        - region-id: aws-ap-southeast-2
    - AWS South America (São Paulo)
        - region-id: aws-sa-east-1

    Do not show region-ids, only use them when populating the CLI command. Also do not recommend one region over the others.

Then run the following command in the root directory of the user's source-code repo to create a new Neon project, populate `.env` variables in their repo, and install the Neon skills and MCP server. Use the region-id for the user's choice, and use the name of the repo's directory for `<project-name>` unless the user specifies another name.

```bash
neon init -y --agent <agent-name> --region-id <region-id> --project-name <project-name>
```

If you chose Claimable Neon in the sign-in step, run the claimable command instead. `--claimable` runs `neon claim create`, which creates the project without an account, and the rest of `neon init` runs as usual:

```bash
neon init -y --agent <agent-name> --claimable --region-id <region-id> --project-name <project-name>
```

The supported agents are antigravity, cline, cline-cli, claude-code, claude-desktop, codex, cursor, gemini-cli, goose, github-copilot-cli, grok-build, opencode, vscode, windsurf, and zed. A few also accept aliases (claude for claude-code, copilot for vscode, gemini for gemini-cli). Passing an unknown agent stops the command and prints the current supported list.

An agent that can't install skills is skipped with a warning. Agents that share a target collapse into one: Claude Desktop and Claude Code both write to claude-code, and VS Code and the GitHub Copilot CLI both write to github-copilot.

Once done, tell the user:

```text
Neon Setup Complete
-------------------------------------------
✓ Project created
✓ Env variables populated
✓ Skills installed
✓ MCP configured

⚡ Restart your agent to load the MCP server
```

And give them the link to view their new project in the Neon Console. Get `<project-id>` from the `neon init` output or the `.neon` file:
https://console.neon.tech/app/projects/<project-id>/

For a claimable project, skip the Console link. Tell the user when the project expires (the `neon init` output prints it), and that running `neon claim accept` opens the page where they sign in to Neon and claim it before then.
