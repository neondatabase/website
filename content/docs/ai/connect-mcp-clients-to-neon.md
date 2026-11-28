---
title: Set up other agents and MCP clients
subtitle: Install Neon's agent skills and the Neon MCP Server in Devin Desktop, Cline, Zed, Gemini CLI, Kiro, Kimi Code, and other agents
summary: >-
  Set up Neon in AI agents and MCP clients that don't have their own setup
  page, including Antigravity, Cline, Devin Desktop, fx, Gamut, Gemini CLI,
  Grok Build, Jules, Kimi Code, Kiro, Pi, and Zed. Install agent skills and the hosted
  Neon MCP Server (https://mcp.neon.tech/mcp) with the Neon CLI or add-mcp, or
  configure the server by hand with OAuth or an API key.
enableTableOfContents: true
updatedOn: '2026-11-05T18:27:00.401Z'
---

This page covers agents and MCP clients that don't have their own setup page. If you use Claude Code, Cursor, Codex, VS Code, Claude.ai, ChatGPT, or Grok Bot, start from [Set up your AI agent](/docs/ai/agent-setup) instead.

<Admonition type="important" title="Security">
The Neon MCP Server is intended for **development and testing only**. Always review LLM-requested actions before execution. See [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Install for any supported agent

Most agents get Neon's [agent skills](/docs/ai/agent-skills) and the [Neon MCP Server](/docs/ai/neon-mcp-server) as two installs. From your project directory, run:

```bash
npx neon@latest skills --agent <agent>
npx neon@latest mcp --agent <agent>
```

Replace `<agent>` with your agent's ID; `neon skills --help` and `neon mcp --help` list the IDs each command accepts. [`neon mcp`](/docs/cli/mcp) mints a Neon API key by default; pass `--oauth` to sign in on first use instead.

To write only the MCP config, use [add-mcp](https://github.com/neondatabase/add-mcp), the tool the Neon CLI uses to patch each agent's MCP config:

```bash
npx add-mcp https://mcp.neon.tech/mcp -a <agent>
```

Add `-g` for user-level config instead of project-level, then restart your agent. On first use, an OAuth window opens to authorize; for API key auth, add `--header "Authorization: Bearer $NEON_API_KEY"`.

## Supported agents (add-mcp)

Run `npx add-mcp list-agents` for the live list from your installed version. As of [add-mcp](https://github.com/neondatabase/add-mcp) 2.6.0, `--agent` values include:

| Assistant                 | `--agent`            | Setup                                                               |
| :------------------------ | :------------------- | :------------------------------------------------------------------ |
| Antigravity               | `antigravity`        | [Antigravity](#antigravity)                                         |
| Claude Code               | `claude-code`        | [Claude Code page](/docs/ai/agent-setup/claude-code)                |
| Claude Desktop            | `claude-desktop`     | [Claude.ai and Claude Desktop page](/docs/ai/agent-setup/claude-ai) |
| Cline (VS Code extension) | `cline`              | [Cline](#cline-vs-code-extension)                                   |
| Cline CLI                 | `cline-cli`          | [Cline](#cline-vs-code-extension)                                   |
| Codex                     | `codex`              | [Codex page](/docs/ai/agent-setup/codex)                            |
| Cursor                    | `cursor`             | [Cursor page](/docs/ai/agent-setup/cursor)                          |
| Factory Droid             | `factory-droid`      | [Any supported agent](#install-for-any-supported-agent)             |
| fx                        | `fx`                 | [fx](#fx)                                                           |
| Gemini CLI                | `gemini-cli`         | [Any supported agent](#install-for-any-supported-agent)             |
| GitHub Copilot CLI        | `github-copilot-cli` | [VS Code page](/docs/ai/agent-setup/vscode)                         |
| Goose                     | `goose`              | [Any supported agent](#install-for-any-supported-agent)             |
| Grok Build                | `grok-build`         | [Grok Build](#grok-build)                                           |
| Hermes Agent              | `hermes`             | [Any supported agent](#install-for-any-supported-agent)             |
| Junie                     | `junie`              | [Any supported agent](#install-for-any-supported-agent)             |
| Kilo Code                 | `kilo-code`          | [Any supported agent](#install-for-any-supported-agent)             |
| Kimi Code                 | `kimi-code`          | [Kimi Code](#kimi-code)                                             |
| Kiro CLI                  | `kiro-cli`           | [Kiro](#kiro)                                                       |
| Mastra Code               | `mastracode`         | [Any supported agent](#install-for-any-supported-agent)             |
| MCPorter                  | `mcporter`           | [Any supported agent](#install-for-any-supported-agent)             |
| OpenCode                  | `opencode`           | [Any supported agent](#install-for-any-supported-agent)             |
| Pi                        | `pi`                 | [Pi](#pi)                                                           |
| VS Code                   | `vscode`             | [VS Code page](/docs/ai/agent-setup/vscode)                         |
| Windsurf                  | `windsurf`           | [Devin Desktop](#devin-desktop)                                     |
| Zed                       | `zed`                | [Zed](#zed)                                                         |

**Aliases:** `cline-vscode` → `cline`, `droid`/`factory` → `factory-droid`, `gemini` → `gemini-cli`, `github-copilot` → `vscode`, `grok` → `grok-build`, `hermes-agent` → `hermes`, `kilo`/`kilocode` → `kilo-code`, `kimi` → `kimi-code`, `kiro` → `kiro-cli`, `mastra` → `mastracode`, `pi-agent` → `pi`, `codeium`/`cascade` → `windsurf`. Config paths differ by agent and by project vs global (`-g`); see the [add-mcp README](https://github.com/neondatabase/add-mcp#supported-agents).

## Agents with their own page

### ChatGPT

See [Set up Neon in ChatGPT](/docs/ai/agent-setup/chatgpt).

### Claude Code

See [Set up Neon in Claude Code](/docs/ai/agent-setup/claude-code).

### Claude Desktop

See [Set up Neon in Claude.ai and Claude Desktop](/docs/ai/agent-setup/claude-ai).

### Codex

See [Set up Neon in Codex](/docs/ai/agent-setup/codex).

### Cursor

See [Set up Neon in Cursor](/docs/ai/agent-setup/cursor).

### VS Code (with GitHub Copilot)

See [Set up Neon in VS Code and GitHub Copilot](/docs/ai/agent-setup/vscode).

## Antigravity

Antigravity can install Neon's [agent-skills repository](https://github.com/neondatabase/agent-skills) as a plugin, which includes the skills and the Neon MCP Server:

```bash
agy plugin install https://github.com/neondatabase/agent-skills
```

Confirm that Antigravity found the plugin, its skills, and the MCP Server with `agy plugin list`. To authenticate, run `/mcp` in Antigravity, select the Neon MCP Server, and complete the OAuth flow.

To install with the Neon CLI instead, use `--agent antigravity` with the commands in [Install for any supported agent](#install-for-any-supported-agent).

## Cline (VS Code extension)

For skills plus the MCP Server, use the commands in [Install for any supported agent](#install-for-any-supported-agent). To add only the MCP Server:

```bash
npx add-mcp https://mcp.neon.tech/mcp -a cline
```

For the Cline CLI, use `-a cline-cli`. To configure the extension by hand:

1. Open Cline in VS Code (sidebar → Cline icon).
2. Click the **MCP Servers** icon → **Installed** → **Configure MCP Servers** to open the configuration file.
3. Add the Neon server entry within the `mcpServers` object. For OAuth, leave out `headers`. For an API key, replace `<YOUR_NEON_API_KEY>` with your [Neon API key](/docs/manage/api-keys):

   ```json
   {
     "mcpServers": {
       "neon": {
         "type": "streamableHttp",
         "url": "https://mcp.neon.tech/mcp",
         "headers": {
           "Authorization": "Bearer <YOUR_NEON_API_KEY>"
         }
       }
     }
   }
   ```

4. Save the file. Cline should reload the configuration automatically. With OAuth, review the requested permissions and click **Authorize** when the browser window opens.

For more, see [Get started with Cline and Neon MCP Server](/guides/cline-mcp-neon).

## Devin Desktop (formerly Windsurf) (#devin-desktop)

Install Neon from the Devin marketplace:

1.  In Devin Desktop, open **Customize**, then **Marketplace**.
2.  Find **Neon** and install it.
3.  Click **Connect MCP** and sign in to Neon in the browser. The plugin's status changes to **Enabled**.
4.  Start a new session so Devin loads the plugin.

The marketplace plugin includes the Neon MCP Server and Neon agent skills.

## FLUJO

Connect [FLUJO](https://github.com/mario-andreschak/FLUJO) directly to the hosted Neon MCP Server using Streamable HTTP and a Neon API key.

1. Create a [Neon API key](/docs/manage/api-keys#creating-api-keys) and copy the ID of the development project you want to connect.
2. In FLUJO, open **Connected Apps** and click **Connect App**. Select **I have connection details**, then **At a remote URL**.
3. Enter this **Server URL**, replacing `<YOUR_PROJECT_ID>` with your project ID:

   ```text
   https://mcp.neon.tech/mcp?readonly=true&projectId=<YOUR_PROJECT_ID>
   ```

   This limits the connection to [read-only operations in one project](/docs/ai/neon-mcp-server#access-control).

4. Click **Connect**. When FLUJO detects that authentication is required, click **Continue to setup** to open **Configure & Test**. Confirm that **Streamable HTTP** is selected.
5. Under **Custom HTTP headers**, click **Add header**. Enter `Authorization` as the header and `Bearer <YOUR_NEON_API_KEY>` as its value. Select **Secret** to mask the value. Leave the optional OAuth client credentials blank for this API-key setup.
6. Click **3) Test run**. After the connection succeeds, save the server and open the connected app to inspect its tools.
7. To verify database access, use `run_sql` on your development database with `SELECT 1 AS connected;`.

## fx

[fx](https://fx.sh) reads MCP servers only from `~/.fx/mcp.json`. A project file can't add a server. add-mcp always writes that global file; `-g` isn't required.

<Admonition type="note">
fx rejects a literal `Authorization` header. Don't pass `--header "Authorization: Bearer $NEON_API_KEY"` when installing to fx. Use `bearer_token_env` (API key tab) or `/mcp auth` (OAuth tab).
</Admonition>

<Tabs labels={["OAuth", "API key"]}>
<TabItem>

```bash
npx add-mcp https://mcp.neon.tech/mcp -a fx
```

This writes `~/.fx/mcp.json`:

```json
{
  "mcp": {
    "neon": {
      "type": "http",
      "url": "https://mcp.neon.tech/mcp",
      "enabled": true
    }
  }
}
```

A running session applies the change with `/mcp reload`. Then authorize from the fx shell:

```text
/mcp auth neon --open
```

Confirm with `/mcp list`.

</TabItem>

<TabItem>

1. Create a [Neon API key](/docs/manage/api-keys#creating-api-keys) and export it in the environment fx will inherit:

   ```bash
   export NEON_API_KEY=<YOUR_NEON_API_KEY>
   ```

2. Write `~/.fx/mcp.json`:

   ```json
   {
     "mcp": {
       "neon": {
         "type": "http",
         "url": "https://mcp.neon.tech/mcp",
         "enabled": true,
         "bearer_token_env": "NEON_API_KEY"
       }
     }
   }
   ```

3. Start a new `fx` or `fx ask` session from this shell. Confirm with `/mcp list`. `/mcp reload` applies a later file change only in a session that already has `NEON_API_KEY`.

</TabItem>
</Tabs>

See [fx MCP](https://fx.sh/docs/capabilities/mcp) for `/mcp reload`, `/mcp auth`, `/mcp list`, and `bearer_token_env`.

## Gamut

1. In your [Gamut](https://www.gamut.so/mcp/developer-tools/neon) agent, go to **Connections** and click **Add Connection**.
2. Search for **Neon** and click **+** to add it.
3. When the OAuth window opens, sign in to Neon and authorize the connection.
4. Ask your agent to query or manage your database on Neon to verify the connection.

## Grok Build

Grok Build supports the Neon plugin at user level:

```bash
npx neon@latest plugins --agent grok-build
```

The plugin includes the Neon skills and the Neon MCP Server. To add only the MCP Server, run `npx add-mcp https://mcp.neon.tech/mcp -a grok-build`. For the Grok Bot chat app, see [Set up Neon in Grok Bot](/docs/ai/agent-setup/grok-bot).

## Jules

1. Create a [Neon API key](/docs/manage/api-keys#creating-api-keys) from your Neon Console **Settings**.
2. Go to [jules.google.com](https://jules.google.com) > **Settings** > **MCP** (or use [this direct link](https://jules.google.com/settings/mcp)).
3. Click **Connect** on the Neon server and paste your API key when prompted.
4. Run a task invoking the Neon MCP Server to verify the connection.

## Kimi Code

Install Neon's [agent-skills repository](https://github.com/neondatabase/agent-skills) as a plugin. Kimi reads its own manifest (`kimi.plugin.json`), which declares the Neon MCP Server, so one command wires up the skills and the MCP connection. In the Kimi CLI chat, run:

```text
/plugins install https://github.com/neondatabase/agent-skills
```

Plugin changes apply to new sessions, so run `/new` afterward. You can also run `npx neon@latest plugins --agent kimi-code`. To add only the MCP Server, run `npx add-mcp https://mcp.neon.tech/mcp -a kimi-code`, start a new session, and click **Authorize** when the OAuth window opens.

## Kiro

For skills plus the MCP Server, use the commands in [Install for any supported agent](#install-for-any-supported-agent). To add only the MCP Server:

```bash
npx add-mcp https://mcp.neon.tech/mcp -a kiro-cli
```

Restart Kiro (or enable the MCP Server in settings). When the OAuth window opens, click **Authorize** to complete the connection.

For manual configuration, Kiro reads `~/.kiro/settings/mcp.json` (global) or `.kiro/settings/mcp.json` (project). See [Kiro MCP documentation](https://kiro.dev/docs/mcp/).

<Admonition type="tip" title="One-click install for Kiro">
<a href="https://kiro.dev/launch/mcp/add?name=Neon&config=%7B%22url%22%3A%20%22https%3A//mcp.neon.tech/mcp%22%7D"><img src="https://kiro.dev/images/add-to-kiro.svg" alt="Add Neon MCP Server to Kiro" height="32" /></a>
</Admonition>

## Pi

Install Neon's skills in [Pi](https://pi.dev) from npm:

```bash
pi install npm:@neon/skills
```

Or straight from the repository:

```bash
pi install git:github.com/neondatabase/agent-skills
```

Pi reads the `skills/` directory directly, so there's no separate sync step. This installs the skills only. To add the Neon MCP Server, run `npx neon@latest mcp --agent pi`.

## Zed

Zed calls MCP servers **context servers**. For skills plus the MCP Server, use the commands in [Install for any supported agent](#install-for-any-supported-agent). To add only the MCP Server:

<Tabs labels={["OAuth", "API key"]}>
<TabItem>

```bash
npx add-mcp https://mcp.neon.tech/mcp -a zed
```

Restart Zed (or enable the MCP Server in settings). When the OAuth window opens, click **Authorize** to complete the connection.

</TabItem>

<TabItem>

Add this to `~/.config/zed/settings.json`. Replace `<YOUR_NEON_API_KEY>` with your [Neon API key](/docs/manage/api-keys):

```json
"context_servers": {
  "Neon": {
    "source": "custom",
    "type": "http",
    "url": "https://mcp.neon.tech/mcp",
    "headers": {
      "Authorization": "Bearer <YOUR_NEON_API_KEY>"
    }
  }
}
```

</TabItem>
</Tabs>

For more details, including workflow examples and troubleshooting, see [Get started with Zed and the Neon MCP Server](/guides/zed-mcp-neon).

## Other MCP clients

For Gemini CLI, Goose, OpenCode, and the other agents in the [table above](#supported-agents-add-mcp), use [Install for any supported agent](#install-for-any-supported-agent).

For a client that add-mcp doesn't support, build its config with the [config generator](/docs/ai/neon-mcp-server#config-generator) or write it by hand. Most clients accept `"type": "http"` with the URL `https://mcp.neon.tech/mcp`. If your client only supports local (stdio) servers, use the [`mcp-remote` bridge](/docs/ai/neon-mcp-server#deprecated-stdio).

## Troubleshooting

See [MCP troubleshooting](/docs/ai/neon-mcp-server#troubleshooting) for retired SSE endpoints, stdio-only clients, and OAuth `invalid redirect uri` errors.

<NeedHelp/>
