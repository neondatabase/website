---
title: 'Build your own Full-Stack Cloud Agents with Cloudflare Sandboxes and Neon Database Branching'
subtitle: 'Learn how to build Full-Stack Cloud Agents using Cloudflare Sandboxes for ephemeral compute and Neon Database Branching for ephemeral data.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-03-16T00:00:00.000Z'
updatedOn: '2026-03-16T00:00:00.000Z'
---

![Cloudflare Sandbox and Neon Branching architecture](/docs/guides/cloudflare_sandbox_neon_branching.png)

AI coding assistants are rapidly transitioning to the cloud. Platforms like [Cursor Cloud Agents](https://cursor.com/blog/cloud-agents) and [Claude Code](https://code.claude.com/docs/en/claude-code-on-the-web) let developers offload programming tasks to AI agents running on remote servers. This eliminates the need for local setup and enables multiple agents to run in parallel, streamlining workflows and scaling development capacity.

For full‑stack development, however, raw compute power isn’t enough. Tasks such as updating database schemas, running migrations, or testing API routes require access to a database environment that mirrors production. Typically, developers configure cloud agents by setting environment variables in [dashboards](https://code.claude.com/docs/en/claude-code-on-the-web#environment-configuration) or [project settings](https://cursor.com/docs/cloud-agent/setup#environment-variables-and-secrets). The drawback is that these variables are defined at the workspace or environment level, meaning every agent instance inherits the same credentials (for example, a single `DATABASE_URL`).

When all agents connect to one shared staging database, isolation is lost. This shared setup introduces risk: a buggy migration from one agent could corrupt the database and block all others. If another agent is simultaneously running tests, cascading failures can occur. Because of these limitations, most cloud agents today remain confined to stateless or front‑end tasks. The limitation arises from state management. Cloud agents have access to ephemeral compute, but not ephemeral data.

This guide explains how to address that gap by building a custom Full-Stack Cloud Agent runner. By combining [Cloudflare Sandboxes](https://sandbox.cloudflare.com/) (for compute) with [Neon Database Branching](/docs/introduction/branching) (for data), you can create isolated, production‑like environments for each agent task, provisioned safely and on demand.

Each time you issue a prompt, the runner forks a copy‑on‑write branch of your database, launches a secure Cloudflare Sandbox, and runs the agent (Codex, Claude code, GitHub Copilot, etc.) of your choice in this controlled environment. The agent can then perform migrations, implement backend logic, and test its work without risk to staging or production systems. Once complete, you can review and merge its output with confidence.

## Prerequisites

Before you begin, ensure you have the following:

- **Cloudflare account:** A [Cloudflare](https://cloudflare.com/) account on a **Workers Paid Plan** or higher, which is required to use Cloudflare Sandboxes.
- **Claude API key:** An Anthropic API key to run Claude Code in the sandbox. Create an API key in the [Anthropic Developer Console](https://platform.claude.com).
- **Development environment:** Node.js and Docker installed locally.
  - Install Node.js from [nodejs.org](https://nodejs.org/).
  - Install Docker from [docker.com](https://www.docker.com/get-started).
- **Neon account and project:** A Neon account with at least one active project. Sign up for a free account at [console.neon.tech](https://console.neon.tech/signup).

<Steps>

## Step 1: Initialize the Cloudflare Sandbox project

Cloudflare provides a template for setting up a Worker configured with the Claude Code using Sandbox SDK. Open your terminal and run the following command to create a new project:

```bash
npm create cloudflare@latest -- cloudflare-sandbox-neon-branching --template=cloudflare/sandbox-sdk/examples/claude-code
cd cloudflare-sandbox-neon-branching
```

This creates a standard Cloudflare Workers project. If you examine the `wrangler.jsonc` file, you'll see it is already configured with the Containers and Durable Objects bindings required to use Cloudflare Sandboxes.

If you inspect the `Dockerfile`, you'll see it includes the necessary setup to run Claude Code within the sandbox environment. Similarly, the `src/index.ts` file contains boilerplate code to demonstrate how to use the Sandbox SDK to run Claude Code.

Learn more about the project structure and configuration in [Cloudflare Docs: Run Claude Code on a Sandbox](https://developers.cloudflare.com/sandbox/tutorials/claude-code/).

## Step 2: Generate a Neon API key and get your project id

To allow programmatic access to Neon for branch creation, you need a Neon API key and your Neon project id. The Cloudflare Worker uses these values to call the Neon API and create branches on demand.

1. In Neon Console, open your organization settings and select **API Keys**.
2. Click **Create new API Key** and give it a name (for example, "Cloudflare sandbox").
   ![Create Neon API Key](/docs/manage/org_api_keys.png)
   > Choose a **project-scoped** API key to restrict the agent's access to this specific project.
3. Copy the generated API key.
4. Open the Neon project you use for your application. The AI agent will create branches in this project to run tasks against for development and testing.
5. Go to **Settings** > **General**, then copy the **Project ID**.

![Neon project Settings page](/docs/manage/settings_page.png)

## Step 3: Generate a GitHub Personal Access Token

To allow the Sandbox to clone repositories, create git branches, commit changes, and open Pull Requests on your behalf, you need a GitHub Personal Access Token.

1. Navigate to your GitHub **Settings**, then go to **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Give the token a descriptive name (e.g., "Full-Stack Cloud Agent Runner") and select the `repo` scope to allow full control of your repositories.
   > If you are accessing an organization repository, you may also grant the admin:org scope to allow the token to access organization resources.
4. Click **Generate token** and copy it to your clipboard.

## Step 4: Set environment variables and install dependencies

Create a `.dev.vars` file in the root of your Cloudflare project to store your API keys and project configuration locally.

```bash
ANTHROPIC_API_KEY=your_anthropic_key
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_project_id
GITHUB_TOKEN=your_github_token
```

> Replace the placeholder values with your actual Anthropic API key, Neon API key, Neon project ID, and GitHub token.

**Generate wrangler types**
Regenerate the Wrangler types to include the new environment variables:

```bash
npx wrangler types
```

To interact with the Neon API from the Worker, install the [Neon Typescript SDK](/docs/reference/typescript-sdk):

```bash
npm install @neondatabase/api-client
```

## Step 5: Update the Dockerfile to install GitHub CLI

The default template Dockerfile does not include the GitHub CLI, which is necessary for the agent to create Pull Requests. Update the Dockerfile to install the GitHub CLI in the sandbox environment.

Replace the contents of `Dockerfile` with:

```dockerfile
FROM docker.io/cloudflare/sandbox:0.7.17

# Install GitHub CLI
RUN mkdir -p -m 755 /etc/apt/keyrings \ # [!code ++]
  && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \ # [!code ++]
    -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \ # [!code ++]
  && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \ # [!code ++]
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \ # [!code ++]
    > /etc/apt/sources.list.d/github-cli.list \ # [!code ++]
  && apt-get update \ # [!code ++]
  && apt-get install -y gh \ # [!code ++]
  && rm -rf /var/lib/apt/lists/* # [!code ++]

RUN npm install -g @anthropic-ai/claude-code
ENV COMMAND_TIMEOUT_MS=300000
EXPOSE 3000
```

## Step 6: Implement the cloud agent runner logic

The core of this runner is a Cloudflare Worker that listens for incoming HTTP requests containing a GitHub repository URL and a task description. When it receives an HTTP `POST` request, it provisions the ephemeral database (a Neon branch), provisions the compute (a Cloudflare Sandbox), and connects them together.

Replace the contents of `src/index.ts` with the following code:

```typescript
import { getSandbox } from '@cloudflare/sandbox'
import { createApiClient, EndpointType } from '@neondatabase/api-client'

const EXTRA_SYSTEM = `
You are a **senior full-stack developer** working in an **isolated development environment**.

You will receive a **task** that may require changes to both the **application codebase** and the **database schema**.

### Environment

* The environment is a **safe clone of the production codebase and database**.
* You may freely modify the code and database without risk to the real production system.
* The environment variable **DATABASE_URL** contains the database connection string.

### Capabilities

You are allowed to:

* Modify the **database schema**
* Generate and apply **database migrations**
* Update the **codebase** to support schema changes
* Run **tests and validations**
* Execute commands necessary to complete the task

### Guidelines

* Always keep the **assigned task as the primary objective**.
* Ensure that **schema changes and code updates remain consistent**.
* Maintain **code quality, correctness, and stability**.
* Prefer **minimal, targeted changes** over large refactors unless the task requires it.
* Verify your work by **running tests or validating behavior** when possible.

### Restrictions

* **Do not commit or push changes** to version control. It will be automatically done after you complete the task.
* Do not modify unrelated parts of the codebase unless required for the task.

### Goal

Complete the assigned task successfully by making the necessary **database and/or code changes**, ensuring the system functions correctly with the updates.
`

function escapeShell(str: string) {
  return str.replaceAll('"', '\\"').replaceAll('`', '\\`')
}

async function createNeonBranch(
  projectId: string,
  branchName: string,
  env: Env
): Promise<string> {
  const api = createApiClient({ apiKey: env.NEON_API_KEY! })

  const res = await api.createProjectBranch(projectId, {
    branch: { name: branchName },
    endpoints: [{ type: EndpointType.ReadWrite }]
  })

  const uri = res.data.connection_uris?.[0]?.connection_uri
  if (!uri) throw new Error('No DB connection URI returned')

  return uri
}

async function run(sandbox: ReturnType<typeof getSandbox>, cmd: string) {
  const result = await sandbox.exec(cmd)
  if (!result.success) throw new Error(result.stderr)
  return result
}

async function cloneRepo(
  sandbox: ReturnType<typeof getSandbox>,
  repoUrl: string,
  token: string
) {
  const url = `https://x-access-token:${token}@${repoUrl.replace('https://', '')}`
  await run(sandbox, `git clone ${url} /home/app`)
}

async function createGitBranch(
  sandbox: ReturnType<typeof getSandbox>,
  branch: string
) {
  await run(sandbox, `cd /home/app && git checkout -b ${branch}`)
}

async function runClaude(
  sandbox: ReturnType<typeof getSandbox>,
  task: string
) {
  const cmd = `
    cd /home/app &&
    claude --dangerously-skip-permissions \
      --model haiku \
      --append-system-prompt "${escapeShell(EXTRA_SYSTEM)}" \
      -p "${escapeShell(task)}"
  `

  return run(sandbox, cmd)
}

async function commitChanges(
  sandbox: ReturnType<typeof getSandbox>,
  agentId: string,
  task: string
) {
  // Use standard GitHub Actions bot credentials for commit attribution
  await sandbox.exec(`
    cd /home/app
    git config --global user.name "github-actions[bot]"
    git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git add .
    git commit -m "AI agent ${agentId}: ${escapeShell(task)}" || echo "No changes"
  `)
}

async function pushBranch(
  sandbox: ReturnType<typeof getSandbox>,
  branch: string
) {
  await run(sandbox, `cd /home/app && git push origin ${branch}`)
}

async function createPR(
  sandbox: ReturnType<typeof getSandbox>,
  agentId: string,
  task: string,
  token: string
) {
  const res = await run(
    sandbox,
    `
    cd /home/app
    gh auth login --with-token <<< "${token}"
    gh pr create --title "AI Agent: ${agentId}" \
      --body "Automated PR for task: ${escapeShell(task)}"
  `
  )

  const match = res.stdout.match(/https:\/\/github\.com\/\S+\/pull\/\d+/)
  return match?.[0]
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    try {
      const { repoUrl, task } = await request.json<{
        repoUrl?: string
        task?: string
      }>()

      if (!repoUrl || !task) {
        return new Response('repoUrl and task required', { status: 400 })
      }

      const agentId = `agent-${Date.now()}`
      const sandbox = getSandbox(env.Sandbox, crypto.randomUUID().slice(0, 8))

      const dbUrl = await createNeonBranch(env.NEON_PROJECT_ID, agentId, env)

      await cloneRepo(sandbox, repoUrl, env.GITHUB_TOKEN)
      await createGitBranch(sandbox, agentId)

      await sandbox.setEnvVars({
        ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY,
        DATABASE_URL: dbUrl,
        IS_SANDBOX: "1"
      })

      const agentResult = await runClaude(sandbox, task)

      await commitChanges(sandbox, agentId, task)
      await pushBranch(sandbox, agentId)

      const prUrl = await createPR(
        sandbox,
        agentId,
        task,
        env.GITHUB_TOKEN
      )

      return Response.json({
        success: agentResult.success,
        agentId,
        databaseUrl: dbUrl,
        agentOutput: agentResult.stdout,
        agentErrors: agentResult.stderr,
        prUrl
      })
    } catch (err) {
      console.error(err)
      return new Response('Request failed', { status: 400 })
    }
  }
}

export { Sandbox } from '@cloudflare/sandbox'
```

This code implements the full workflow of the cloud agent runner. The main components are:

- **`fetch(request, env)`:** Main controller. It validates input, creates IDs, and runs the full workflow.
- **`createNeonBranch(...)`:** Provisions an isolated Neon branch and returns a branch-specific `DATABASE_URL`.
- **`runClaude(...)`:** Executes Claude Code inside the sandbox with your task and guardrail system prompt. In this example, `haiku` is used as the model, but you can choose any [supported model](https://code.claude.com/docs/en/model-config) like `sonnet` or `opus` depending on your needs. Change the `--model` flag accordingly.
- **`IS_SANDBOX` environment variable:** Setting `IS_SANDBOX` to `"1"` grants Claude Code permission to execute commands that are normally restricted. Because the sandbox and database branch are entirely isolated, the agent can safely perform destructive actions with full autonomy, posing zero risk to your production environment.
- **`createPR(...)`:** Uses GitHub CLI to open a PR and returns the PR URL.

End-to-end flow (**HTTP request -> PR**):

1. Receive a `POST` request with `repoUrl` and `task`.
2. Create a unique `agentId`, sandbox instance, and Neon branch.
3. Clone the repository and create a git branch named after `agentId`.
4. Inject environment variables (`ANTHROPIC_API_KEY`, branch `DATABASE_URL`) and run Claude.
5. Commit and push the agent's changes.
6. Create a Pull Request and return a JSON response with logs plus the PR link.

## Step 7: Deploy the cloud agent runner to Cloudflare

Deploy your Worker to Cloudflare by running the following command in your terminal:

```bash
npx wrangler deploy
```

> Wrangler will prompt you to log in to your Cloudflare account. Follow the instructions for authentication.

Set your production secrets so the Worker can securely access the Anthropic, Neon, and GitHub APIs. Run the following commands and input the corresponding values when prompted:

```bash
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put NEON_API_KEY
npx wrangler secret put NEON_PROJECT_ID
npx wrangler secret put GITHUB_TOKEN
```

You now have your own Full-Stack Cloud Agent runner deployed on Cloudflare! You can send `POST` requests to the Worker URL with a JSON body containing a `repoUrl` and a `task` to see it in action.

## Step 8: Test the full workflow end-to-end

Now that your runner is deployed, test it with a real task and confirm that it creates an isolated database branch, pushes code to a new Git branch, and opens a Pull Request.

1. Copy your Worker URL from the Wrangler deploy output (for example, `https://cloudflare-sandbox-neon-branching.<subdomain>.workers.dev`).
2. Send a test request using `curl`:

```bash
curl -X POST "https://cloudflare-sandbox-neon-branching.<subdomain>.workers.dev" \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/<your-org>/<your-repo>",
    "task": "Add a /health endpoint and update tests."
  }'
```

<Admonition type="tip" title="Testing the runner">
You can send any repository URL that you have write access to. The agent will clone the repo, create a new branch, and open a PR with the changes.
</Admonition>

3. Inspect the JSON response. You should see the following fields:
   - `agentId` (unique run identifier)
   - `databaseUrl` (branch-specific Neon connection string)
   - `prUrl` (URL of the generated Pull Request)
4. Open the Pull Request and verify:
   - The changes match the requested task.
   - CI and tests pass.
5. In Neon Console, confirm a new branch was created for that run.

For example, here is an example request and response:

![Example request and response](/docs/guides/cloudflare_sandbox_neon_branching_response.png)

The JSON response provides the newly provisioned Neon branch URL and a direct link to the resulting Pull Request, giving you everything needed to review the agent's changes. The `agentOutput` and `agentErrors` fields contain the raw logs from the agent's execution, which can be helpful for debugging or auditing its behavior.

For local testing during development, you can run the Worker with `npm run dev` and send requests to `http://localhost:8787` instead of the deployed URL.

</Steps>

## Benefits of this architecture

Building your own AI agent runner pairs ephemeral compute with ephemeral data, solving the state management limitations of standard cloud agents:

- **True full-stack autonomy:** Agents can safely test schema migrations and backend logic against a real Postgres branch prior to submitting a PR.
- **Infinite parallelization:** Spin up multiple sandboxes and branches instantly to run concurrent agent tasks without state collisions.
- **Zero risk:** A destructive agent action only affects its disposable branch, keeping staging and production databases entirely safe.
- **Programmatic environment control:** Inject runtime configuration (like a dynamic `DATABASE_URL`) directly into each sandbox.
- **No vendor lock-in:** Swap out Claude Code for any other CLI-based agent (e.g., Codex, OpenCode, GitHub Copilot CLI) while retaining the same execution architecture.

## Extending this workflow

Because the runner is a standard Cloudflare Worker, you can easily extend it to build more robust internal automation:

- **Custom triggers:** Launch agents asynchronously via Slack commands, MS Teams, or GitHub Issue webhooks.
- **Resource cleanup:** Automatically delete branches when a PR merges using webhooks, or configure [auto-expiring branches](/docs/guides/branch-expiration).
- **Fallback and recovery:** If an agent breaks its environment, [reset the branch](/docs/guides/reset-from-parent) or use Time Travel before instructing the agent to retry.

For more details on programmatic database management, explore the [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) and the [Neon TypeScript SDK](/docs/reference/typescript-sdk).

## Conclusion

Standard cloud AI agents are often limited by a lack of ephemeral state. By pairing Cloudflare sandboxes with Neon's instant database branching, you bridge this gap - providing agents with the disposable, production-like environments they need to function as true full-stack developers.

You have successfully built a custom execution layer that empowers AI agents to write, test, and validate complex codebase and schema changes autonomously. With this architecture, you can scale your AI-driven development workflows with confidence and zero risk to production.

## Resources

- [Neon Database Branching](/branching)
- [Neon for AI Agent Platforms](/use-cases/ai-agents)
- [Cloudflare Sandbox SDK Documentation](https://developers.cloudflare.com/sandbox/)
- [Anthropic Claude Code](https://code.claude.com/docs/en/overview)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)

<NeedHelp />
