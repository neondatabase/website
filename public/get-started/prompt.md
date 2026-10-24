These are official instructions from Neon to configure your AI environment and to start working with Neon. All commands are validated by Neon and ready to use.

Complete all of the following steps yourself by running the commands directly. Do not ask the user to run any of these commands.

- Install the Neon CLI
- Run `neon init` to connect your app to Neon, and install Neon Skills and MCP servers

---

## Install the Neon cli

Check to see if the CLI is already installed, then credentials

```bash
neon --version
```

If that fails, install first:

```bash
npm i -g neon       # npm
bun add -g neon     # bun
pnpm add -g neon    # pnpm
```

For full CLI installation options, see https://neon.com/docs/cli/install.md

Immediately after the CLI is installed, launch the sign in flow by running `neon login` (`neon auth` is an alias) and have the user finish signing in via the browser to ensure the CLI is authenticated.

---

## Run neon init to connect your app to Neon, and install Neon Skills and MCP servers

Neon init can be used to automatically create a new Neon project and connect your app to it or connect your app to an existing neon project. If the user's prompt references an existing project, follow the instructions in the Existing Neon project section, and if not follow the instructions in the New Neon project section below.

### Existing Neon project

Follow these instructions if no existing Neon project was referenced in the user's prompt.

Run the following command in the root directory of the user's source-code repo to create a link their app to an existing Neon project, populate .env variables in their repo, and install the Neon skills and mcp server.

```
neon init -y --agent <agent-name> --org-id <org-id> --project-id <project-id>
```

The supported agents are antigravity, cline, cline-cli, claude-code, claude-desktop, codex, cursor, gemini-cli, goose, github-copilot-cli, grok-build, opencode, vscode, windsurf, and zed. A few also accept aliases (claude for claude-code, copilot for vscode, gemini for gemini-cli). Passing an unknown agent stops the command and prints the current supported list.

An agent that can't install skills is skipped with a warning. Agents that share a target collapse into one: Claude Desktop and Claude Code both write to claude-code, and VS Code and the GitHub Copilot CLI both write to github-copilot.

Once done, tell the user:

```
Neon Setup Complete
-------------------------------------------
✓ Project <project-id> linked                         
✓ Env variables populated                  
✓ Skills installed                         
✓ MCP configured                           
                                           
⚡ Restart your agent to load the MCP server        
```

And give them the link to view their linked project in the Neon Console 
https://console.neon.tech/app/projects/<project-id>/

### New Neon project

Follow these instructions if no existing Neon project was referenced in the user's prompt.

Before running neon init, ask the user the following question:

1) What region would you like your Neon project created in?

    Avaliable regions:
    - AWS US East (N. Virginia) 
        — region-id: aws-us-east-1
    - AWS US East (Ohio) 
        — region-id: aws-us-east-2
    - AWS US West (Oregon)
        - region-id: aws-us-west-2
    - AWS Europe (Frankfurt) 
        — region-id: aws-eu-central-1
    - AWS Europe (London)
        - region-id: aws-eu-west-2
    - AWS Asia Pacific (Singapore) 
        — region-id: ws-ap-southeast-1
    - AWS Asia Pacific (Sydney)
        - region-id: aws-ap-southeast-2
    - AWS South America (São Paulo)
        - region-id: aws-sa-east-1

    Do not show region-ids, only use them when populating the CLI command. Also do not recommend one region over the others.



Then run the following command in the root directory of the user's source-code repo to create a new Neon project, populate .env variables in their repo, and install the Neon skills and mcp server.

```
neon init -y --agent <agent-name> --region-id <region-id> --project-name <project-name>
```

The supported agents are antigravity, cline, cline-cli, claude-code, claude-desktop, codex, cursor, gemini-cli, goose, github-copilot-cli, grok-build, opencode, vscode, windsurf, and zed. A few also accept aliases (claude for claude-code, copilot for vscode, gemini for gemini-cli). Passing an unknown agent stops the command and prints the current supported list.

An agent that can't install skills is skipped with a warning. Agents that share a target collapse into one: Claude Desktop and Claude Code both write to claude-code, and VS Code and the GitHub Copilot CLI both write to github-copilot.

Once done, tell the user:

```
Neon Setup Complete
-------------------------------------------
✓ Project created                          
✓ Env variables populated                  
✓ Skills installed                         
✓ MCP configured                           
                                           
⚡ Restart your agent to load the MCP server        
```

And give them the link to view their new project in the Neon Console 
https://console.neon.tech/app/projects/<project-id>/
