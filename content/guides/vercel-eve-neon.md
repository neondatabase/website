---
title: "Running Eve agents and evals on disposable Neon branches"
subtitle: "Learn how to build a Slack-based database assistant with Eve that provisions an isolated, disposable Neon database branch for every session, safe for migrations, exploration, and evals."
author: dhanush-reddy
enableTableOfContents: true
createdAt: "2026-06-23T00:00:00.000Z"
updatedOn: '2026-06-24T07:31:56.813Z'
---

[Eve](https://eve.dev) by [Vercel](https://vercel.com) is a filesystem‑first framework for building durable backend agents. You define an agent as files (its instructions, tools, skills, channels, and schedules), and Eve takes care of the rest: stable HTTP routes, reconnectable session streams, durable state, and native human‑in‑the‑loop approvals. Agents built with Eve can run for days, pause for human review, and resume exactly where they left off.

That durability makes Eve a natural fit for database agents, those that explore schemas, run migrations, and test queries on behalf of developers. But giving an AI agent direct access to a production database is risky. A single misfired `DROP TABLE` or an unoptimized `SELECT` can corrupt data or degrade performance for real users. You need an environment where the agent can work freely, without any risk to production.

Neon's copy‑on‑write Postgres branching solves this problem. Instead of connecting your agent to a fragile production instance, every Eve session can automatically spin up its own isolated database branch in seconds. Because branches share data at the storage layer, they cost nothing extra and create no overhead. The agent gets a full, realistic dataset to explore, run queries and migrations without fear of breaking production.

At first glance, wiring up an agent that handles Slack messages, provisions databases, manages durable state, and gates dangerous operations behind human approval sounds like a lot of plumbing. But Eve's filesystem-first approach keeps it organized. Here is what the finished project looks like:

```text
neon-eve-agent/
├── package.json
├── agent/
│   ├── agent.ts                    # Runtime config (model)
│   ├── instructions.md             # Agent identity and behavior
│   ├── channels/
│   │   ├── eve.ts                  # Default HTTP channel
│   │   └── slack.ts                # Slack channel with Vercel Connect credentials
│   ├── hooks/
│   │   └── provision-branch.ts     # Neon branch lifecycle (create on session.started)
│   ├── lib/
│   │   ├── neon.ts                 # Neon API wrapper (createBranch)
│   │   └── db-state.ts             # Durable per-session state (connection URI)
│   └── tools/
│       ├── run_sql.ts              # SQL execution with predicate-based HITL approval
│       └── list_objects.ts         # Schema exploration (tables, columns, indexes)
```

Here is what each piece does:

- **`agent/agent.ts`**: Runtime config: which model to use. Eve reads this once at boot.
- **`agent/instructions.md`**: The agent's system prompt. Defines its identity, available tools, and safety rules.
- **`agent/channels/`**: Inbound transports. `eve.ts` provides the default HTTP endpoint, while `slack.ts` wires up Slack with Vercel Connect credentials for bot mentions and DMs. This is how users reach the agent.
- **`agent/hooks/`**: Lifecycle event subscribers. `provision-branch.ts` listens for `session.started` to create Neon branches automatically.
- **`agent/lib/`**: Shared helper code. `neon.ts` wraps the Neon API (create branch), and `db-state.ts` holds the per-session connection URI using Eve's durable `defineState`.
- **`agent/tools/`**: The capabilities the model can call. `run_sql` executes SQL with predicate-based human approval (reads auto-approve, writes need a human click). `list_objects` explores schemas safely.

Every file maps directly to an Eve concept, so the framework discovers and wires them automatically from the filesystem. The only manual integration is the Neon API calls in `lib/neon.ts` and `hooks/provision-branch.ts` (together about 60 lines), which handle the full branch lifecycle. Everything else (Slack connectivity, durable sessions, human-in-the-loop approvals, sandbox isolation) is framework-provided.

This pattern works across every Eve surface: channels, local dev, evals, and preview deploys all get their own isolated branch automatically.

In this guide, you'll learn how to build a Slack-based database assistant with Eve that provisions an isolated Neon branch for every session (Slack thread). The agent can explore schemas, run queries, and test migrations safely, without touching production.

## Architecture overview

Here's how the Eve agent and Neon interact to execute safe data operations:

```mermaid
flowchart TD
  A["Developer @mentions bot<br/>in Slack"] --> B["Eve Agent<br/>(Durable Session)"]
  B --> |"Fires session.started hook"| C["Neon API:<br/>Create Branch"]
  C -.->|"Saves DB URL to"| D[("Eve Durable State")]
  B <-->|"Tool: list_objects<br/>(schema exploration)"| E[("Neon Ephemeral Branch")]
  B <-->|"Tool: run_sql<br/>SELECT: auto-approved<br/>DDL/DML: needs human OK"| E
  B -.->|"DDL triggers approval"| F["Suspends & asks human in Slack"]
  F -.->|"User clicks 'Approve'"| E
  B --> |"Branch auto-expires"| G["Neon API:<br/>Delete Branch"]
```

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version `20` or later installed on your machine.
- **Vercel CLI:** Installed globally (`npm i -g vercel`) for linking and deployment.
- **Neon account:** A free account at [console.neon.tech](https://console.neon.tech) with a project created.
- **Neon API Key:** Generate a project-scoped API key in your [Neon Account Settings](/docs/manage/api-keys#create-project-scoped-organization-api-keys).
  ![Neon API Key](/docs/manage/project_scoped_select.png)
  > Copy the key and store it securely. You'll need it for your `.env.local` file in the next step.

<Steps>

## Scaffold the Eve agent

Start by creating a new Eve agent project. The `eve init` command scaffolds the full project structure, installs dependencies, and launches a TUI to configure your model provider.

Run the following command in your terminal:

```bash
npx eve@latest init neon-eve-agent
```

You should see output similar to this:

```text
eve  v0.11.10
✓ Created an eve agent in /home/neon-eve-agent in 11ms
✓ Installed dependencies in 21.2s
```

Next, the TUI will prompt you to choose a model. Select Vercel AI Gateway and connect it to your Vercel project. The output should look like this:

```text
⚠ 1 setup issue: model provider not linked · /model

/model

▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
   Configure the agent model

   ◦ Change model
     anthropic/claude-sonnet-4.6

   ▷ Configure provider
     Required to enable the agent

   ◦ Done

Configure the agent model

   Which model provider do you want to use?

   ▷ Vercel AI Gateway
     one key, every model

   ◦ Something else
     use your own provider credentials

Configure the agent model

   How do you want to connect to AI Gateway?

   ▷ Connect via a project
     vercel link + env pull

   ◦ Use my own key
     paste an AI_GATEWAY_API_KEY

Select your team

   > type to search teams
   ▷ Dhanush Reddy's projects (current)

Vercel project

   ▷ Create a new project · Named neon-eve-agent

/model
   ⎿  Project linked. Connected to AI Gateway via VERCEL_OIDC_TOKEN.

anthropic/claude-sonnet-4.6  ·  AI Gateway (neon-eve-agent)
```

You will be prompted to link the agent to a Vercel project. If you don't have one, the TUI will create it for you. After linking, the TUI will generate a `VERCEL_OIDC_TOKEN` and store it in your `.env.local` file. This token allows the agent to authenticate with Vercel AI Gateway.

Once the project is linked, you will be prompted to select a model. Choose the default model (`anthropic/claude-sonnet-4.6`) or any other model you prefer. The TUI will then confirm that the agent is ready to run. Exit the TUI and navigate into the project directory:

```bash
cd neon-eve-agent
code .
```

Install the [Neon API TypeScript SDK](/docs/reference/typescript-sdk) for branch management and the [serverless driver](/docs/serverless/serverless-driver) for querying branches:

```bash
npm install @neondatabase/api-client @neondatabase/serverless
```

Now configure the environment variables your agent needs. Your `.env.local` file should already contain a `VERCEL_OIDC_TOKEN` from the Vercel link step. Add your Neon credentials to the same file:

```env
VERCEL_OIDC_TOKEN="eyJh..."

NEON_API_KEY="your_neon_api_key"
NEON_PROJECT_ID="your_neon_project_id"
```

> Replace `your_neon_api_key` and `your_neon_project_id` with your actual Neon API key and project ID.

You can find your Neon project ID in the Neon Console under **Project Settings > General > Project ID**.

![Neon Project ID](/docs/manage/settings_page.png)

## Build the Neon branching wrapper

Your Eve agent needs a way to create and delete database branches programmatically. Create a small wrapper around the Neon API that exposes a function: `createBranch`. The wrapper uses your Neon API key and project ID from the environment variables. This is the only file that talks to the Neon control plane. Every branch is created with a 24-hour expiry as a safety net. You can adjust the expiry duration according to your development and testing needs.

Create `agent/lib/neon.ts`:

```typescript
import { createApiClient, EndpointType } from "@neondatabase/api-client";

const api = createApiClient({ apiKey: process.env.NEON_API_KEY! });
const projectId = process.env.NEON_PROJECT_ID!;

export interface Branch {
  id: string;
  name: string;
  connectionUri: string;
}

export async function createBranch(name: string): Promise<Branch> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const res = await api.createProjectBranch(projectId, {
    branch: { name, expires_at: expiresAt },
    endpoints: [{ type: EndpointType.ReadWrite }],
  });

  const id = res.data.branch?.id;
  const connectionUri = res.data.connection_uris?.[0]?.connection_uri;

  if (!id || !connectionUri) {
    throw new Error("Failed to create branch or retrieve connection URI");
  }

  return { id, name, connectionUri };
}
```

## Add session-scoped branch state

Once a branch is created, every tool in the session needs to know its connection string. Eve's [`defineState`](https://eve.dev/docs/guides/session-context#custom-state-with-definestate) gives you durable, typed, per-session memory that survives step boundaries, crashes, and redeploys. You'll use it to hold the branch's connection URI so that `run_sql`, `list_objects`, and any other tool all query the exact same database branch throughout the session.

Create `agent/lib/db-state.ts`:

```typescript
import { defineState } from "eve/context";

export interface BranchState {
  branchId: string;
  branchName: string;
  connectionUri: string;
}

export const dbBranch = defineState<BranchState | null>(
  "neon.session-branch",
  () => null,
);
```

## Provision branches with hooks

This is the heart of the integration. [Eve hooks](https://eve.dev/docs/guides/hooks) subscribe to the runtime event stream, letting you run code at key lifecycle moments. You'll subscribe to `session.started` to create a branch as soon as a conversation begins. This means every Slack thread, local dev session, or eval run automatically gets its own isolated database.

Since long-lived sessions like Slack threads may stay open indefinitely, the branch is created with a 24-hour `expires_at`.

Create `agent/hooks/provision-branch.ts`:

```typescript
import { defineHook } from "eve/hooks";
import { createBranch } from "../lib/neon.js";
import { dbBranch } from "../lib/db-state.js";

export default defineHook({
  events: {
    async "session.started"(_event, ctx) {
      const name = `eve-${ctx.session.id.slice(0, 12)}`.toLowerCase();

      const branch = await createBranch(name);
      dbBranch.update(() => ({
        branchId: branch.id,
        branchName: branch.name,
        connectionUri: branch.connectionUri,
      }));

      console.info(`[neon] provisioned branch ${branch.name} for session ${ctx.session.id}`);
    },
  },
});
```

## Author the database tools

With the branch lifecycle handled, you now need to expose database operations as tools to the Eve agent so it can invoke them. Each tool reads the connection URI from `dbBranch` (set by the hook above) and uses the Neon serverless driver to query the branch.

You'll create two tools that serve distinct purposes:

- **`run_sql`**: Executes SQL against the branch. Uses a predicate-based `needsApproval` that auto-approves read-only queries (`SELECT`, `SHOW`, `EXPLAIN`) but gates any data-modifying statement (`ALTER`, `CREATE`, `DROP`, `INSERT`, `UPDATE`, `DELETE`) on human approval. This is the Eve-native way to handle mixed-safety operations in a single tool. The approval decision is driven by the input, not by a blanket policy. Checkout [Customize the approval predicate](#customize-the-approval-predicate) for more details on a production-ready approval flow.
- **`list_objects`**: A lightweight, always-safe tool that queries `information_schema` and `pg_catalog` to list tables, columns, and indexes. Giving the agent a dedicated schema-exploration tool keeps its discovery queries clean and separate from arbitrary SQL execution.

### The `run_sql` tool

Instead of splitting read-only queries and migrations into two separate tools (which would look identical under the hood), you define a single `run_sql` tool and let the `needsApproval` predicate decide at runtime whether a given statement needs a human sign-off. When the model passes a `SELECT`, the tool runs immediately. When it passes an `ALTER TABLE`, Eve pauses the workflow and renders approval buttons in Slack.

Create `agent/tools/run_sql.ts`:

```typescript
import { neon } from "@neondatabase/serverless";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { dbBranch } from "../lib/db-state.js";

export default defineTool({
  description:
    "Execute SQL against the session's isolated Neon branch. SELECT, SHOW, and EXPLAIN run directly. DDL and DML statements (ALTER, CREATE, DROP, INSERT, UPDATE, DELETE) require human approval.",
  inputSchema: z.object({
    sql: z.string().describe("The SQL statement to execute."),
    reason: z.string().describe("A short explanation of why you are running this statement."),
  }),
  needsApproval: ({ toolInput }) => {
    const sql = toolInput?.sql?.trim().toUpperCase() ?? "";
    const readOnly = ["SELECT", "SHOW", "EXPLAIN"];
    return !readOnly.some((prefix) => sql.startsWith(prefix));
  },
  async execute({ sql: query }) {
    const branch = dbBranch.get();
    if (!branch) return { ok: false, error: "No branch provisioned." };

    const sql = neon(branch.connectionUri);
    try {
      const rows = await sql.query(query);
      return { ok: true, rows };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  },
});
```

<Admonition type="info" title="How predicate-based approval works">
Eve's `needsApproval` accepts a function that receives `{ toolName, toolInput, approvedTools }` and returns a boolean. A predicate lets you gate approval on the actual input. In this case, the tool inspects the SQL prefix: read-only statements pass through, while anything that modifies data or schema triggers a durable pause. When the pause fires, the Slack adapter automatically renders native **Approve** and **Deny** buttons. No extra code needed.

Learn more about [Approvals in Human-In-The-Loop](https://eve.dev/docs/human-in-the-loop#approvals)
</Admonition>

### The schema exploration tool

The `list_objects` tool lets the agent discover what tables, columns, and indexes exist on the branch before writing any SQL. It queries PostgreSQL's catalog views, so it's always safe and never needs approval.

Create `agent/tools/list_objects.ts`:

```typescript
import { neon } from "@neondatabase/serverless";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { dbBranch } from "../lib/db-state.js";

export default defineTool({
  description:
    "List database objects on the session's Neon branch. Use to discover tables, columns, and indexes before writing queries or migrations.",
  inputSchema: z.object({
    kind: z
      .enum(["tables", "columns", "indexes"])
      .describe("Which type of object to list."),
    table: z
      .string()
      .optional()
      .describe("Table name (required for 'columns' and 'indexes')."),
  }),
  async execute({ kind, table }) {
    const branch = dbBranch.get();
    if (!branch) return { ok: false, error: "No branch provisioned." };

    const sql = neon(branch.connectionUri);

    try {
      if (kind === "tables") {
        const rows = await sql.query(
          `SELECT table_name, table_type
           FROM information_schema.tables
           WHERE table_schema = 'public'
           ORDER BY table_name`
        );
        return { ok: true, rows };
      }

      if (kind === "columns") {
        if (!table) return { ok: false, error: "Table name is required for columns." };
        const rows = await sql.query(
          `SELECT column_name, data_type, is_nullable, column_default
           FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = $1
           ORDER BY ordinal_position`,
          [table]
        );
        return { ok: true, rows };
      }

      if (kind === "indexes") {
        if (!table) return { ok: false, error: "Table name is required for indexes." };
        const rows = await sql.query(
          `SELECT indexname, indexdef
           FROM pg_indexes
           WHERE schemaname = 'public' AND tablename = $1`,
          [table]
        );
        return { ok: true, rows };
      }

      return { ok: false, error: `Unknown kind: ${kind}` };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  },
});
```

<Admonition type="tip" title="Why two tools instead of one">
You might wonder why `list_objects` exists as a separate tool instead of relying on `run_sql` for auto-discovery of tables and columns.

There are two key reasons:

1. **Ease of correct usage** - A dedicated tool with a structured `kind` enum is far simpler for the model to invoke reliably than expecting it to recall and construct raw catalog queries. This reduces friction and improves accuracy.

2. **Separation of responsibilities** - `run_sql` should remain focused on user-driven tasks like queries and migrations, while `list_objects` handles the agent’s internal discovery needs. This clean division minimizes confusion, prevents tool misuse, and leads to more consistent results.

For database agents, narrowly scoped, well-defined tools outperform a single catch‑all tool. Specialization reduces errors, improves tool-call precision, and makes the agent’s behavior more predictable.
</Admonition>

## Write the agent instructions

The instructions file defines how the agent behaves. Replace `agent/instructions.md` with a clear description of the agent's purpose, its available tools, and the safety guarantees it operates under. This is what shapes the model's responses when a developer asks it to explore or modify the database.

```markdown
# Identity
You are a database assistant working inside Slack. Developers ask you to explore schemas, run queries, and test migrations.

# How you work
1. **Isolated Environments:** When this conversation started, a copy-on-write Neon branch of production was created just for you. Everything you do lands on that branch. It never touches production.
2. **Explore with `list_objects`.** Use it to discover tables, columns, and indexes before writing SQL. Pass `kind: "tables"` to list all tables, `kind: "columns"` with a `table` name to see columns, or `kind: "indexes"` to see indexes.
3. **Execute with `run_sql`.** Use it for SELECT queries and for schema changes (ALTER, CREATE, DROP). Read-only queries run immediately. Schema changes require developer approval.
4. **Always explain your reasoning.** When calling `run_sql`, fill in the `reason` field so the developer understands why you are running each statement.
```

## Test locally with `eve dev`

Before connecting Slack, you can exercise the entire agent in the `eve dev` TUI. This lets you verify the branch provisioning, tool execution, and human-in-the-loop approval flow all work end-to-end on your machine.

```bash
npm run dev
```

The TUI launches a local development session. When the session starts, the `session.started` hook fires and creates a Neon branch. You can verify this in your [Neon Console](https://console.neon.tech). A new branch named `eve-<session-id>` should appear under **Branches**.

![Eve dev TUI showing a local session with the Neon branch provisioned](/docs/guides/eve_dev_tui.png)

Try these interactions to exercise the full tool surface:

**1. Explore the schema:**
Ask: _"What tables exist in this database?"_

The agent calls `list_objects` with `kind: "tables"`. Since this queries the branch's catalog, it runs immediately with no approval.

**2. Run a read-only query:**
Ask: _"Show me the first 5 rows from the users table."_

The agent calls `run_sql` with a `SELECT` statement. The predicate sees it starts with `SELECT` and auto-approves it. The TUI shows the result inline.

**3. Request a migration:**
Ask: _"Add an email column to the users table."_

The agent calls `run_sql` with `ALTER TABLE users ADD COLUMN email TEXT`. The predicate sees `ALTER`. This is not a read-only statement, so Eve pauses the workflow and asks for approval. In the TUI, this renders as a `y/n` prompt:

![Eve TUI showing the approval prompt for a migration](/docs/guides/eve_dev_approval_prompt.png)

Type `y` to approve. The migration executes on your isolated branch, and the agent confirms the column was added.

**4. Verify the result:**
Ask: _"What columns does the users table have now?"_

The agent calls `list_objects` with `kind: "columns"` and `table: "users"`. The new `email` column appears in the output.

**5. Exit and observe cleanup:**
Type `/exit` to leave the TUI. The branch will be automatically deleted by Neon after its 24-hour expiry window.

Once you're satisfied with the local behavior, add the Neon credentials to your Vercel project so the agent can provision branches in production. Run the following commands:

```bash
vercel env add NEON_API_KEY production
vercel env add NEON_PROJECT_ID production
npx eve deploy
```

## Connect the agent to Slack

To connect the agent to Slack, Eve uses [Vercel Connect](https://vercel.com/docs/connect). Run the following commands to create the connector and wire it to your agent's Slack endpoint:

```bash
# Enable Vercel Connect and install the CLI
npm install -g vercel@latest && export FF_CONNECT_ENABLED=1

vercel connect create slack --name eve-db-agent --triggers
```

You will be prompted to authorize the Slack app and select the workspace.

![Slack: Vercel Connect installation prompt](/docs/guides/eve_slack_connect_install.png)

You will then be prompted to enter the app name and create the connector. Update the details as per your preference. The app will be installed in your Slack workspace, and you can invite it to any channel or DM.

![Slack: Eve create connector](/docs/guides/eve_slack_connector.png)

With the Vercel Connect Slack app installed, you can now add the Slack channel to your Eve agent. This creates `agent/channels/slack.ts`, which configures how the agent handles Slack messages, thread context, and human-in-the-loop interactions. Run the following commands to add the Slack channel:

```bash
npm install @vercel/connect
npx eve channels add slack
```

The `slackChannel` handles incoming `app_mention` and `message.im` events, posts typing indicators, and renders HITL prompts as native Slack buttons. Thread anchoring happens automatically: the first agent reply anchors the session to that thread, and subsequent mentions in the same thread resume the existing session.

The eve agent should be redeployed automatically after adding the channel. If not, run `npx eve deploy` again to make sure the latest code is live.

## See it in action in Slack

With the agent deployed and connected to Slack, you can now interact with it from any channel. Here's a typical workflow that shows the full lifecycle, from schema exploration to a safe, human-approved migration.

### Start a thread

`@mention` the bot (`@eve-db-agent`) in any Slack channel. The moment the thread starts, Eve's `session.started` hook fires and provisions a fresh Neon branch in the background.

### Explore the schema

Type: _"@eve-db-agent What tables do we have?"_

The agent calls `list_objects` with `kind: "tables"` and replies with the tables on your branch. Since this is a catalog query, it runs immediately. No approval needed.

Follow up with: _"How many users do we have?"_

The agent calls `run_sql` with a `SELECT COUNT(*)` query. The predicate sees `SELECT` and auto-approves it. The agent replies with the count.

### Request a migration

Type: _"@eve-db-agent Add a `last_login` timestamp column to the users table."_

The agent calls `run_sql` with `ALTER TABLE users ADD COLUMN last_login TIMESTAMPTZ`. The predicate sees `ALTER`. This is not read-only, so Eve durably pauses the workflow. Slack renders a native Block Kit message with **Approve** and **Deny** buttons:

![Slack thread: eve agent conversation](/docs/guides/eve_slack_thread.png)

The agent holds here. No compute is consumed while waiting. Click **Approve**. The migration executes on the branch, and the agent confirms the updated schema.

### Branches are thread (session) scoped

Each Slack thread gets its own Neon branch. So if you ask the agent in a new message what tables exist, it will provision a new branch from production and return the schema (which does not yet have the `last_login` column). This isolation ensures that every thread can explore and test migrations without affecting other threads or production.

![Slack thread: eve agent new thread](/docs/guides/eve_slack_new_thread.png)

### Turning your agent into a junior developer

The database agent in this guide is intentionally minimal, but Eve's filesystem-first architecture makes it easy to expand its capabilities. Since Eve also gives each agent a [sandbox](https://eve.dev/docs/sandbox) with shell access (`bash`, `read_file`, `write_file`, `glob`, `grep`), your database assistant can inspect codebases, run scripts, and interact with files alongside its database work.

You can turn this agent into a capable junior developer by connecting it to the tools your team already uses. For example:

- **GitHub**: Give the agent access to read pull requests, apply labels, post triage comments, and even propose code changes. See the [PR Triage Agent template](https://github.com/vercel-labs/eve-pr-triage-agent-template) for a production-ready example of an Eve agent that reads diffs and labels PRs automatically. Follow the same pattern mentioned in this guide to wire it up to your Neon database.
- **Linear**: Connect the agent to [Linear](https://linear.app) via Eve's [connections](https://eve.dev/docs/connections) so it can create and update issues and keep your project board in sync.
- **Custom tools**: Add any API or service as a typed tool under `agent/tools/`. Eve discovers and wires them automatically from the filesystem.

Each of these integrations is just a file. Drop a new tool into `agent/tools/` or a new connection into `agent/connections/`, and the agent picks it up on the next deploy. Combine that with Neon's disposable branches and you have an agent that can explore schemas, run migrations, file issues, and triage PRs, all from a single Slack thread, without ever touching production.

</Steps>

## Agent evals with ephemeral databases

Building AI agents requires rigorous testing. A common hurdle when evaluating database agents is state management: if your eval tells an agent to "delete inactive users," your staging database is now mutated. Run the test again and it fails because the users are already gone. You end up manually resetting state between runs, which is error-prone and doesn't scale.

Eve's `eve eval` framework solves this by running every eval against the agent's real session. Because each session automatically provisions its own Neon branch via the `session.started` hook, every eval run gets its own isolated database branch. A hundred concurrent eval runs will never experience race conditions or data pollution, because each one operates in its own ephemeral branch.

The same branching mechanism that isolates Slack sessions and local dev also isolates eval runs. No extra setup is needed: just write your evals and run them. Neon branches are created and cleaned up automatically.

To learn more about writing and running evals with Eve, see the [Eve Evals documentation](https://eve.dev/docs/evals/overview).

## Extending this workflow

This guide gives you a working template for a safe, isolated database agent. You can extend it in several ways to fit your team's needs.

### Customize the approval predicate

The `run_sql` tool in this guide uses a simple prefix check (`SELECT`, `SHOW`, `EXPLAIN`) to decide what runs automatically and what needs human approval. This is a demo pattern. It works for straightforward cases but has limits. A model could craft a `SELECT` that calls a dangerous function, or a statement could be misclassified by prefix alone.

For production use, tighten the predicate to match your actual safety requirements. Consider a parser-based approach, an allowlist of approved statements, or a dedicated read-only database role that enforces constraints at the Postgres level.

### Connect external services with Eve connections

Eve [connections](https://eve.dev/docs/connections) let you wire your agent into external MCP servers and OpenAPI APIs without the model ever seeing credentials. For example, you can connect the [Neon MCP Server](/docs/ai/neon-mcp-server) to give your agent full Neon project management capabilities alongside your custom tools. The API key stays in the app runtime and never reaches the model or the sandbox. You can scope access further with `tools.allow` to expose only the operations your agent needs, or add `approval: once()` to gate every connection tool behind a human click.

### Teach the agent with skills

Eve [skills](https://eve.dev/docs/skills) are load-on-demand context files that the model pulls in only when needed. You can combine this with Neon's [Agent Skills](/docs/ai/agent-skills) to teach your agent Neon branching patterns, SDK usage, and best practices.

### Security considerations

Eve's [security model](https://eve.dev/docs/concepts/security-model) enforces a trust boundary between the app runtime (where your tools, connections, and secrets live) and the sandbox (where the model runs shell commands). The model sees tool results, never your `process.env` or credentials.

Neon's disposable branches reinforce this boundary. Even if the model generates destructive SQL, it executes on an ephemeral branch that cannot affect production. A few things to keep in mind for production deployments:

- **Least-privilege connections:** Scope your Neon API key to a single project and use read-only MCP endpoints (`https://mcp.neon.tech/mcp?readonly=true`) when the agent only needs to explore schemas.
- **Branch expiry:** Always set `expires_at` on branches so they are cleaned up automatically, even if sessions go idle. The 24-hour expiry in this guide is a starting point; adjust it to match your workflow.
- **Credential isolation:** Eve injects connection tokens per step and never serializes them to durable state. Your Neon API key stays in the app runtime and never reaches the model, the sandbox, or conversation history.
- **Approval gates:** For sensitive operations (schema changes, data modifications), use Eve's predicate-based `needsApproval` or connection-level `approval: always()` to require human sign-off before execution.

### Expand the toolset

- **Custom triggers:** Launch agents from Slack commands, [GitHub webhooks](https://eve.dev/docs/channels/github), or [scheduled jobs](https://eve.dev/docs/schedules).
- **Subagents:** Break complex workflows into smaller agents that specialize in schema exploration, migration testing, or reporting. Eve's [subagent](https://eve.dev/docs/subagents) feature lets you orchestrate multiple agents in a single session.

## Conclusion

Standard cloud AI agents are fundamentally limited by shared state. When multiple agents share a staging database, isolation is lost. When an agent writes to production without testing, the risk is immense. Neither scenario is acceptable for agents that need to modify schemas or run migrations.

By pairing Vercel Eve's durable workflows and HITL approvals with Neon's instant database branching, you bridge this gap. Every session gets its own disposable database branch. Migrations require human approval before they execute. Branches are cleaned up automatically via Neon's branch expiry. And eval runs are fully isolated, so you can test confidently in CI/CD. You now have a reusable pattern for building safe, reliable database agents across every surface Eve supports.

## Resources

- [Vercel Eve Framework Documentation](https://eve.dev/docs)
- [Eve Connections](https://eve.dev/docs/connections)
- [Eve Skills](https://eve.dev/docs/skills)
- [Eve Security Model](https://eve.dev/docs/concepts/security-model)
- [Neon Database Branching](/docs/introduction/branching)
- [Neon MCP Server](/docs/ai/neon-mcp-server)
- [Neon Agent Skills](/docs/ai/agent-skills)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Vercel Connect for Slack](https://vercel.com/docs/connect)

<NeedHelp />
