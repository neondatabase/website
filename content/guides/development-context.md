---
title: 'Setting up a robust development environment with Neon'
subtitle: 'A comprehensive guide to Neon APIs, SDKs, branching, snapshots, and platform integrations for developers and AI agents.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-06-08T00:00:00.000Z'
updatedOn: '2026-06-09T17:30:22.956Z'
---

When building enterprise integrations, platform backends, or AI agents, you need infrastructure that is both flexible and resilient. Early prototypes often emphasize rapid iteration to validate an MVP quickly, favoring speed over robustness. At this stage, teams focus on shipping features rather than carefully designing which microservices, schemas, or workflows to adopt. But as systems scale, growth demands stronger foundations. Shared databases, schema migrations, and automated workflows introduce risks that require isolation, programmability, and reliability at every layer.

A productive development workflow requires database environments that are isolated, easy to provision, and simple to keep in sync. Setting up a local or team development context with traditional databases often introduces friction, such as sharing a single database, schema drift, or time wasted provisioning test environments.

Neon provides an API-first platform designed for these exact needs. With [branching](/docs/introduction/branching), [snapshots](/blog/checkpoints-for-agents-with-neon-snapshots), and [SDKs](/docs/reference/sdk), you can create ephemeral environments, enforce isolation, and integrate seamlessly into enterprise systems or AI-driven workflows. This guide covers the core concepts, best practices, and integration patterns for building a robust development environment with Neon.

## Key concepts

The core principles for building a development environment with Neon are:

1. **Branch-per-task isolation:** Each developer, feature branch, or CI run operates in its own isolated Postgres environment via a [copy-on-write](/docs/reference/glossary#copy-on-write) branch. This ensures safe experimentation without impacting shared resources.
2. **Replayable state with snapshots:** Revert databases to a specific point-in-time to test migrations, debug issues, or reset agent environments.
3. **Resilient orchestration:** Programmatically provision databases with automatic retry and backoff mechanisms to handle concurrent CI jobs or scripts.

<Admonition type="important" title="Neon is API-first">
Every action available in the [Neon Console](https://console.neon.tech) is also exposed through the [public REST API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Developers can build custom CLI scripts, automation pipelines, or custom control planes for team provisioning, while enterprises can build custom control planes, embed lightweight dashboards into their own UIs, or fully white-label the database provisioning experience for their users.
</Admonition>

## Prerequisites

Before diving into the integration patterns, ensure you have the following in place:

**A Neon account and an Organization**

Sign up for free at [console.neon.tech/signup](https://console.neon.tech/signup) and create an Organization. You can have multiple projects within an Organization, and you can also create multiple Organizations if needed for different teams.

<Admonition type="note" title="Organization roles">
Neon Organizations support three roles: **Admin** (full access to billing, members, and all projects), **Member** (access to all organizational projects), and **Collaborator** (limited access to specific shared projects). For details, see [Organizations](/docs/manage/organizations).
</Admonition>

<Steps>

## Install the SDK

Neon cleanly separates its SDKs into distinct domains. Choose the right interface based on whether you are querying data or provisioning infrastructure.

- **Management SDKs:** Use the [Neon API TypeScript SDK](/docs/reference/typescript-sdk) or [Python SDK](/docs/reference/python-sdk) for infrastructure automation: creating projects, branching databases, and configuring computes.
- **Client SDKs:** Use the [Neon Serverless Driver](/docs/serverless/serverless-driver) (`@neondatabase/serverless`) inside your application's business logic to execute SQL queries over HTTP or WebSocket from serverless and edge runtimes.
- **AI Agent Toolkits:** Use the [`@neondatabase/toolkit`](/docs/reference/neondatabase-toolkit) for ephemeral AI agents. It combines project creation, SQL execution, and deletion into a single streamlined workflow.

To install the Management SDK for your language, run the appropriate command:

<CodeTabs labels={["npm", "yarn", "pnpm", "python"]}>

```bash
npm install @neondatabase/api-client
```

```bash
yarn add @neondatabase/api-client
```

```bash
pnpm add @neondatabase/api-client
```

```bash
pip install neon-api
```

</CodeTabs>

## Authenticate with API Keys

To programmatically manage your Neon resources (like creating branches or database projects), you need an API key.

1. Go to the **Settings** page in the [Neon Console](https://console.neon.tech).
2. Create a new API Key and copy it.
   ![Create API Key](/docs/manage/org_api_keys.png)
   <Admonition type="tip" title="Choose the right scope">
   Use an [**Organization-level API key**](/docs/manage/api-keys#create-an-organization-api-key) for platform applications that need to manage multiple projects. For scripts or applications limited to a single project, create a [**project-level API key**](/docs/manage/api-keys#create-project-scoped-organization-api-keys) instead.  
    </Admonition>
   <br/>
3. Export it as an environment variable in your development environment or project configuration:

   ```bash
   export NEON_API_KEY="your_api_key_here"
   ```

   In your application code, initialize the client using this key:

   ```typescript
   import { createApiClient } from '@neondatabase/api-client';

   const apiClient = createApiClient({ apiKey: process.env.NEON_API_KEY! });
   ```

## Handle asynchronous operations and retries

In Neon, infrastructure operations are asynchronous. Most changes such as creating a branch return an `operations` array. To track progress, poll the `/operations/{operation_id}` endpoint until the operation reaches a **terminal status** (`finished`, `skipped`, or `cancelled`).

When orchestrating these operations, you’ll also need to account for Control Plane safeguards:

- **Rate limits (`429 Too Many Requests`):** 700 requests per minute, with a burst limit of 40 requests per second per route. See [Rate limiting](/docs/reference/api-reference#rate-limiting) for details.
- **Concurrency locks (`423 Locked`):** Neon prevents conflicting operations from running simultaneously. For example, if you attempt to create a branch while the system’s [Availability Checker](/docs/reference/glossary#availability-checker) is active, the API will reject the request. See [Handle concurrent operation errors](/docs/manage/operations#handle-concurrent-operation-errors) for guidance.

The following examples demonstrate how to implement polling with exponential backoff to handle these scenarios gracefully:

```typescript
import { EndpointType, createApiClient } from '@neondatabase/api-client';

const apiClient = createApiClient({ apiKey: process.env.NEON_API_KEY! });
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Polls a Neon Operation until it reaches a terminal state.
async function waitForOperation(projectId: string, operationId: string) {
  const terminalStates = ['finished', 'skipped', 'cancelled'];

  while (true) {
    const { data } = await apiClient.getProjectOperation(projectId, operationId);

    if (terminalStates.includes(data.operation.status)) {
      if (data.operation.status === 'cancelled') throw new Error(`Operation cancelled.`);
      return data.operation;
    }
    if (data.operation.status === 'failed') throw new Error(`Operation failed.`);
    await sleep(2000);
  }
}

// Safely executes a Neon API request with Exponential Backoff for 423/429 errors.
async function executeWithBackoff<T>(apiCall: () => Promise<T>): Promise<T> {
  const MAX_RETRIES = 5;
  let delayMs = 500;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 423 || status === 429) {
        if (attempt === MAX_RETRIES) throw new Error(`Failed after ${MAX_RETRIES} attempts.`);
        console.warn(`Received ${status}. Retrying in ${delayMs}ms (Attempt ${attempt})...`);
        await sleep(delayMs);
        delayMs *= 2;
      } else {
        throw error;
      }
    }
  }
  throw new Error("Execution failed.");
}

// Creates a new branch from the specified parent branch, waiting for all operations to complete.
export async function safelyCreateBranch(projectId: string, parentBranchId: string) {
  const response = await executeWithBackoff(() =>
    apiClient.createProjectBranch(projectId, {
      branch: { parent_id: parentBranchId },
      endpoints: [{ type: EndpointType.ReadWrite }]
    })
  );

  const operations = response.data.operations || [];
  for (const op of operations) {
    await waitForOperation(projectId, op.id);
  }

  return response.data.branch;
}
```

## Manage API drift

Neon’s APIs are stable and backwards compatible, so drift is exceptionally rare. In practice, your automation and environments remain synchronized without issue. The only exceptions occur when new capabilities are introduced in beta (such as [Neon Auth](/docs/auth/overview) or the [Data API](/docs/data-api/get-started)) where occasional adjustments may be needed. Managing API drift ensures your systems stay aligned even as experimental features evolve into fully supported platform capabilities.

### Stay updated on API and SDK changes

Subscribe to the [Neon Changelog](/docs/changelog) RSS feed to stay informed about new features, API changes, and SDK updates. This is the primary way to learn about changes that might affect your integration.

```bash
https://neon.com/docs/changelog/rss.xml
```

You can also follow the changelog via [Slack](/docs/reference/feeds#subscribe-to-feeds-in-slack) or your preferred RSS reader. For details on all available feeds, see [Neon RSS feeds](/docs/reference/feeds).

### Automating API drift detection

For teams that want automated detection of API changes, set up a CI pipeline that tracks the Neon OpenAPI spec (`https://neon.com/api_spec/release/v2.json`):

1. **Use openapi-typescript:** Run a weekly GitHub Action that fetches the `v2.json` file and generates TypeScript interfaces using [openapi-typescript](https://openapi-ts.dev/).
2. **Compile and compare:** If the freshly generated types cause a TypeScript compilation error (`tsc`) against your existing codebase, the pipeline fails safely. This alerts your team that Neon has introduced a breaking or changed API surface.

## Connect to AI assistants via MCP

If you are developing alongside an LLM or building an autonomous agent, equip your environment with Neon's capabilities so the agent understands your infrastructure natively.

### The Neon MCP Server (for IDEs and assistants)

Equip IDEs like [Cursor](/docs/ai/ai-cursor-plugin), [Claude Code](/docs/ai/ai-claude-code-plugin), or [Codex](/docs/ai/ai-codex-plugin) with the ability to safely query schemas and branch databases using the [Model Context Protocol (MCP)](/docs/ai/connect-mcp-clients-to-neon). Initialize it in your workspace:

```bash
npx neonctl@latest init
```

This securely bridges your local AI assistant to the Neon API, allowing you to say "Create a branch for this PR and apply the schema changes" in plain English.

### Agent Skills (for coding assistants)

While the MCP Server gives your assistant the ability to _act_ on Neon, [Agent Skills](/docs/ai/agent-skills) give it the _knowledge_ to write correct code. Skills are structured context files (`SKILL.md`) that teach your assistant Neon's APIs, SDKs, and best practices so generated code is correct on the first attempt, avoiding common mistakes like wrong imports, missing connection pooling, or incorrect serverless driver usage.

Install the core skill for any compatible tool (Cursor, Claude Code, OpenAI Codex):

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

The skill covers connections (serverless driver, pooling, connection strings), Neon Auth, the Data API, platform APIs and SDKs (REST API, TypeScript SDK, Python SDK), and developer tools (CLI, VS Code extension, MCP server). For example, ask your assistant to "set up Neon Auth in my Next.js app" and it will provide the correct imports, configuration, and middleware setup.

Additional specialized skills are available for specific workflows:

- `neon-postgres-branches`: branch management patterns
- `neon-postgres-egress-optimizer`: optimizing egress traffic
- `claimable-postgres`: [disposable databases](/docs/reference/claimable-postgres)

Checkout the [Neon Agent Skills repository](https://github.com/neondatabase/agent-skills) for the full details and skill catalog.

### LLMs.txt (for autonomous agents)

To ensure your custom AI tools understand Neon's platform architecture and API surface without hallucinating, provide them with the `llms.txt` context files:

- **Platform documentation:** [`https://neon.com/llms.txt`](https://neon.com/llms.txt)
- **API documentation:** [`https://api-docs.neon.tech/llms.txt`](https://api-docs.neon.tech/llms.txt)

</Steps>

## Branching workflows and lifecycle

Just like your codebase, database changes should follow a strict promotion lifecycle. You should build your development or team workflows around this pattern:

1. **Clone from production:** Create a copy-on-write branch from your default branch.
2. **Make schema and data changes:** Develop, migrate, and test on the isolated branch.
3. **Run tests:** Execute your CI/CD test suite against the branch.
4. **Promote to production:** Promote the schema changes to the parent branch (e.g., production).

<Admonition type="warning" title="Protect sensitive data in branches">
When creating ephemeral branches for AI agents or external users, use [data anonymization](/docs/workflows/data-anonymization) or [schema-only branching](/docs/guides/branching-schema-only) to ensure PII is not exposed to third-party LLMs or untrusted sandbox environments. The [Data Anonymization API](/docs/workflows/data-anonymization-api) lets you programmatically create branches with masked data.
</Admonition>

### Branch lifecycle management

Ephemeral branches can accumulate if not managed. Use these features to keep your project organized:

- **Branch expiration:** Set an expiration timestamp when creating a branch. Neon automatically deletes the branch after the specified time. Ideal for CI/CD preview branches or agent sandboxes. See [Branch expiration](/docs/guides/branch-expiration).
- **Reset from parent:** Reset a development branch to match its parent's current state, pulling in the latest production data without creating a new branch. See [Reset from parent](/docs/guides/reset-from-parent).
- **Protected branches:** Mark critical branches (like production) as protected to prevent accidental deletion, resets, or archiving. Computes attached to protected branches also cannot be deleted. See [Protected branches](/docs/guides/protected-branches).
- **Automated snapshot schedules:** Configure daily, weekly, or monthly automated snapshots for backup and compliance. See [Backup and restore](/docs/guides/backup-restore).

## Automate branching with CI/CD integrations

The branching lifecycle described above becomes most powerful when it is automated directly in your CI/CD pipeline. Instead of manually creating branches via the SDK or Console, let your pull requests and preview deployments handle provisioning and cleanup automatically.

### GitHub Actions

Neon provides a set of [GitHub Actions](/docs/guides/branching-github-actions) that wire database branching into your Git workflow. The typical pattern is:

1. **Pull request opens** → a [Create branch action](https://github.com/neondatabase/create-branch-action) provisions an isolated copy-on-write branch named after the PR. Run your tests against this branch to ensure schema changes are validated in an environment identical to production.
2. **Schema changes** → run migrations against the branch, then use the [Schema diff action](https://github.com/neondatabase/schema-diff-action) to post a diff comment directly on the pull request for review.
3. **Pull request closes** → a [Delete branch action](https://github.com/neondatabase/delete-branch-action) tears down the ephemeral branch, so no resources are wasted.

A [Reset branch action](https://github.com/neondatabase/reset-branch-action) is also available for refreshing a long-lived development branch to match its parent before starting new work.

The [Neon GitHub integration](/docs/guides/neon-github-integration) handles authentication automatically: it installs a GitHub App that injects a `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable into your repository, so your workflows are ready to run with zero manual secret configuration.

The following is a simplified psuedo-example of how your GitHub Actions workflow might look. Check the [integration docs](/docs/guides/neon-github-integration) for full example workflows and best practices.

```yaml
on:
  pull_request:
    types: [opened, synchronize, closed]

jobs:
  create_branch:
    if: github.event.action != 'closed'
    steps:
      - uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}

  delete_branch:
    if: github.event.action == 'closed'
    steps:
      - uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch: ${{ branch-name-or-id-from-create-action }}
```

<Admonition type="tip" title="Combine with preview deployments">
Pair Neon's GitHub Actions with hosting platforms like Vercel, Cloudflare Pages, or Fly.io to get a fully isolated preview environment (application and database) for every pull request. See the [example applications](/docs/guides/neon-github-integration#example-applications-with-github-actions-workflows) for deployable starters.
</Admonition>

### Vercel integration

If your application is deployed on Vercel, Neon offers first-class integrations that automatically provision a database branch for every Vercel preview deployment. Three paths are available:

- **Vercel-Managed**: Neon is provisioned and billed entirely through the Vercel Marketplace. Ideal for new users who want a single bill.
- **Neon-Managed**: Link an existing Neon project to Vercel while keeping billing with Neon. Best if you already have a Neon account.
- **Manual**: Connect via environment variables for full CI/CD control with no automatic branching.

Both managed integrations auto-provision isolated branches for preview deployments and support [Neon Auth](/docs/auth/overview) out of the box. They differ in branch cleanup timing: Vercel-Managed follows Vercel's deployment retention policy, while Neon-Managed cleans up branches when the corresponding Git branch is deleted.

For a full comparison and setup instructions, see [Integrating Neon with Vercel](/docs/guides/vercel-overview).

## Configure compute, scaling, and connection pooling

Your integration must account for Neon's autoscaling and lifecycle features to prevent unexpected runtime errors and optimize costs.

### Region selection

When programmatically creating projects for your users or teams, select a `region_id` closest to your application's compute (e.g., Vercel or Cloudflare Workers) to minimize latency. Retrieve available regions using the `GET /api/v2/regions` endpoint.

### Autoscaling

Neon dynamically adjusts [Compute Units (CU)](/docs/reference/glossary#compute-unit-cu) based on load. Each CU allocates approximately 4 GB of RAM. Autoscaling adjusts resources instantly with no restarts required.

- **Maximum autoscaling range:** The difference between your minimum and maximum compute size cannot exceed 8 CU. For example, if you set the minimum to 1 CU, the maximum can be at most 9 CU. See [Autoscaling](/docs/introduction/autoscaling) for details.
- **Compute size range:** Autoscaling supports from 0.25 CU to 16 CU. For available sizes, see [Compute size and autoscaling configuration](/docs/manage/computes#compute-size-and-autoscaling-configuration).
- **Project-level defaults:** You can configure default autoscaling settings at the project level so that newly created computes (including those for new branches or read replicas) inherit the same configuration. See [Change your project's default compute settings](/docs/manage/projects#change-your-projects-default-compute-settings).

### Scale to Zero

Computes with no active queries for 5 minutes automatically [scale to zero](/docs/introduction/scale-to-zero). When a new connection arrives, activation generally takes a few hundred milliseconds. Ensure your CI/CD test runners, agent toolkits, and client database drivers are configured with adequate connection timeouts to tolerate this brief activation latency.

<Admonition type="tip" title="Disable Scale to Zero">
On paid plans, you can disable Scale to Zero for an always-active compute. This is useful for latency-sensitive production workloads. See [Edit a compute](/docs/manage/computes#edit-a-compute).
</Admonition>

### Connection pooling

If your application serves many concurrent users or uses serverless functions, enable [connection pooling](/docs/connect/connection-pooling). Neon uses PgBouncer in transaction mode, supporting up to 10,000 concurrent client connections.

- **Pooled connections:** Add `-pooler` to your compute endpoint hostname to route through PgBouncer. You can copy a pooled connection string from the Neon Console by enabling the **Connection pooling** toggle on your project dashboard.
  ![Connection pooling toggle](/docs/connect/connection_details.png)
- **Direct connections:** Use unpooled (direct) connections for schema migrations, `LISTEN/NOTIFY`, temporary tables, and `SET`/`RESET` commands, which are not supported in transaction mode.
- **Serverless and edge runtimes:** For HTTP-based or WebSocket queries from environments like Cloudflare Workers or Vercel Edge Functions, use the [Neon Serverless Driver](/docs/serverless/serverless-driver) (`@neondatabase/serverless`).

## Use Neon Snapshots for checkpoints

Neon Snapshots let you capture the state of a branch at a specific point in time and restore it later. This is ideal for testing schema migrations, debugging issues, or resetting AI agent environments without affecting production data.

1. **Take a snapshot:** Programmatically call the Neon API to create a snapshot of the active branch.
2. **Save agent state:** Serialize the agent's memory to JSON.
3. **Execute:** Allow the agent to proceed.

If the action fails or produces incorrect results, call the Neon [Restore API](https://api-docs.neon.tech/reference/restoresnapshot) with `"finalize_restore": true`. This restores the data in-place without changing your `DATABASE_URL`. You can then load the agent's saved memory, reject the bad decision, and let the AI try a different path against the cleanly restored database.

<Admonition type="note" title="Branch IDs after restore">
When `finalize_restore` is `true`, Neon preserves your connection string by moving the compute endpoint to the restored branch. The connection string stays stable, but the **active branch ID changes**. Store the new branch ID (from the Restore API response) before creating subsequent snapshots. See the [Restore snapshot API reference](https://api-docs.neon.tech/reference/restoresnapshot) for response details.
</Admonition>

## Conclusion

When you build a robust development environment on Neon, you treat your database as software, eliminating the friction associated with traditional database administration. A robust setup means:

1. Installing SDKs and authenticating via API keys for programmatic control.
2. Handling `423 Locked` states and async polling gracefully so your provisioning pipelines never fail.
3. Subscribing to the changelog and automating drift detection to keep integrations in sync.
4. Equipping your AI assistants with MCP, Agent Skills, and `llms.txt` so they understand your infrastructure.
5. Isolating developers and feature branches with branching and snapshots.
6. Automating branch provisioning and cleanup with GitHub Actions and Vercel preview deployments.
7. Enabling connection pooling and connection limits for scalable database access.

With these foundations, your development teams and platform applications can provision, scale, and manage thousands of isolated Postgres environments securely and reliably.

## Resources

- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon TypeScript SDK](/docs/reference/typescript-sdk)
- [Neon Python SDK](/docs/reference/python-sdk)
- [Neon Serverless Driver](/docs/serverless/serverless-driver)
- [Poll operation status](/docs/manage/operations#poll-operation-status)
- [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon)
- [Agent Skills](/docs/ai/agent-skills)
- [Connection pooling](/docs/connect/connection-pooling)
- [Data Anonymization](/docs/workflows/data-anonymization)
- [Organizations](/docs/manage/organizations)
- [Automating Neon Branch Creation with Git Hooks](/blog/automating-neon-branch-creation-with-githooks)
- [The Neon GitHub Integration](/docs/guides/neon-github-integration)
- [Automate Branching with GitHub Actions](/docs/guides/branching-github-actions)
- [Integrating Neon with Vercel](/docs/guides/vercel-overview)

<NeedHelp />
