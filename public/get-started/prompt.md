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

Immediately after the CLI is installed, launch the sign-in flow by running `neon login` (`neon auth` is an alias) and have the user finish signing in via the browser to ensure the CLI is authenticated.

---

## Run `neon init` to connect your app to Neon, and install Neon skills and the MCP server

`neon init` can create a new Neon project and connect your app to it, or connect your app to an existing Neon project. If the user's prompt includes a project ID and an organization ID, follow the instructions in the "Existing Neon project" section. Otherwise, follow the instructions in the "New Neon project" section.

### Existing Neon project

Follow these instructions if the user's prompt references an existing Neon project by providing a project ID and an organization ID.

Run the following command in the root directory of the user's source-code repo to link their app to an existing Neon project, populate `.env` variables in their repo, and install the Neon skills and MCP server. Use the project ID and organization ID from the user's prompt for `<project-id>` and `<org-id>`.

```bash
neon init -y --agent <agent-name> --org-id <org-id> --project-id <project-id>
```

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
