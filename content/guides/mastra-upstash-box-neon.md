---
title: 'Build a Slack bot with a Mastra agent, Upstash Box, and Neon Functions'
subtitle: 'Learn how to build a Slack bot that runs a Mastra agent on Neon Functions, using a disposable Upstash Box and a dedicated branch on Neon for each session.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-09-14T00:00:00.000Z'
updatedOn: '2026-09-18T16:08:45.923Z'
---

[Mastra](https://mastra.ai) is a TypeScript framework for building AI agents in production. It provides the primitives you need to define an agent, its tools, and the reasoning loop that decides which tool to call next. With Mastra, you can build agents that explore databases, run Python scripts, generate charts, and write Markdown reports.

But this kind of agent needs two things that are risky to hand out: a place to run code, and a database it can explore freely. You don't want the agent executing arbitrary code on your production server, or querying and modifying your production database directly.

This guide solves both problems with a Slack-based data-analysis agent. Every question runs in a fresh, disposable workspace, so the agent can execute code and explore your data without touching production. You'll implement:

- A Mastra agent hosted on a [Neon Function](/docs/compute/functions/overview), whose tools run Python, shell commands, and file operations inside an isolated [Upstash Box](https://upstash.com/docs/box)
- A fresh [branch](/docs/introduction/branching) on Neon per session, deleted when the session ends, so production stays untouched
- A Slack bot that receives @mentions, provisions the branch and box, runs the agent, and posts the answer and chart back into the thread

<CopyPrompt
  src="/prompts/mastra-upstash-box-neon-prompt.md"
  description="Use this prompt to customize the guide and build it with your AI agent."
  buttonText="Copy prompt"
/>

## Architecture overview

The runner has four components, each with a clear role:

- **Slack:** Users ask questions by @mentioning the bot in a thread.
- **Branch on Neon:** A disposable branch of your database, created per session so the agent can query and modify it without touching production.
- **Mastra:** The agent's reasoning loop. It defines the agent and its tools and runs inside a Neon Function.
- **Upstash Box:** The isolated sandbox where the tools execute. It runs Python and shell commands and holds the files the agent produces.

Here is how a question flows through the system:

1. **Event:** A user @mentions the bot. Slack sends the event to `POST /slack/events`. The adapter verifies the signature and returns `200` within Slack's 3-second window, while the real work happens in the background.
2. **Provision:** The mention handler posts an acknowledgment message, creates a branch with an `expires_at` backstop, and restores an Upstash Box from a prepared snapshot with the branch connection string injected as `DATABASE_URL`.
3. **Reason:** The handler runs the agent with the box ID in the request context. The agent calls `run-python`, `run-shell`, and the file tools as it works, and each tool call executes inside the box.
4. **Deliver:** The agent writes a Markdown report and, optionally, a chart into `/work/out`. The handler reads both, deletes the box and the branch, and posts the answer and chart back into the thread.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version 22 or higher installed. Download from [nodejs.org](https://nodejs.org/).
- **Neon account:** Sign up for an account at [console.neon.tech](https://console.neon.tech/signup).
- **Neon CLI:** Installed globally (`npm install -g neon@latest`) and authenticated (`neon login`). See the [Neon CLI Quickstart](/docs/cli/quickstart) for details.
- **Slack workspace:** Permission to create and install a Slack app.
- **Upstash credentials:** An API key from the [Upstash Console](https://console.upstash.com) for Box.

<Admonition type="note" title="AI model access">
This guide uses the [Neon AI Gateway](/docs/ai-gateway/overview) to access the AI model, which is only available on paid Neon plans. If you prefer to use your own model provider, you can bring your own API key (for example, an [Anthropic API key](https://platform.claude.com/settings/keys)) and configure Mastra to use it directly as described in the [Mastra Anthropic provider docs](https://mastra.ai/models/providers/anthropic).
</Admonition>

<Steps>

## Scaffold the project

Create a new directory and install the dependencies:

```bash
mkdir mastra-box-analyst && cd mastra-box-analyst
npm init -y
npm pkg set type=module
mkdir -p functions src/lib src/mastra/agents src/mastra/tools
npm install @mastra/core @neon/sdk @upstash/box hono zod @neon/functions chat @chat-adapter/slack @chat-adapter/state-memory
npm install -D typescript @types/node dotenv
```

The above command installs the Mastra core, Neon SDK, Upstash Box SDK, Hono for the HTTP function, Zod for schema validation, and the Chat SDK with Slack adapter. By the end of the guide, the project looks like this:

```text
mastra-box-analyst/
├── functions/
│   └── analyst.ts        # HTTP route: Slack webhook
├── src/
│   ├── lib/
│   │   ├── env.ts         # Typed env via parseEnv(config, 'analyst')
│   │   └── neon.ts        # Neon SDK client and helpers
│   └── mastra/
│       ├── agents/
│       │   └── index.ts  # The data analyst agent
│       ├── tools/
│       │   └── sandbox.ts # Box tools: run-python, run-shell, files
│       ├── index.ts      # Mastra instance and agent registry
│       ├── session.ts    # Session runner: branch + box + cleanup
│       └── slack.ts      # Chat SDK Slack adapter and mention handler
├── neon.ts               # Function declaration and branch policy
└── prepare-snapshot.js   # Builds the Upstash Box snapshot
```

Add the Neon agent skills so AI agents such as Claude Code and Cursor can help you with the code in this project. Run the following command in your project directory:

```bash
neon skills -s neon -s neon-functions -s neon-ai-gateway
```

Follow the prompts to select your coding agent and add the skills.

Next, link or create a Neon project by running the following command:

```bash
neon link
```

You'll be prompted to select your organization, then a project. **Create a new project** named `mastra-box-analyst` (or pick an existing one). Next, select a region. Choose **AWS US East (Ohio)** (`aws-us-east-2`), **AWS US East (N. Virginia)** (`aws-us-east-1`), **AWS Europe (Frankfurt)** (`aws-eu-central-1`), or **AWS Asia Pacific (Singapore)** (`aws-ap-southeast-1`); this guide uses US East (Ohio). Neon Functions are currently available in these regions. Support is expanding toward [all regions](/docs/introduction/regions). Next, confirm that you want to manage your project's Neon setup as code. When prompted to select the Neon services, select **Functions** and **AI Gateway**. This generates a `neon.ts` file in your project root.

The `link` command also creates a placeholder function `hello.ts` at your project root. You'll build the Slack bot in your own `functions/analyst.ts` file, so delete the placeholder:

```bash
rm hello.ts
```

The `link` command also saves the linked project details to the `.neon` context file and creates a `.env.local` file containing the project credentials. Add `NEON_PROJECT_ID` to your `.env.local`, using the `projectId` value from the `.neon` context file.

```bash filename=".env.local"
# Other credentials...
NEON_PROJECT_ID=your_project_id
```

You'll also need a `tsconfig.json` file to compile the TypeScript code. Create `tsconfig.json` in the project root with the following content:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "types": ["node"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["neon.ts", "functions", "src"]
}
```

## Create a Neon API key

You'll need a Neon API key for the Mastra agent to create and delete branches. Create one in the Neon Console:

1. In the [Neon Console](https://console.neon.tech), open your organization settings and select **API Keys**.
2. Click **Create new API key** and give it a name (for example, "data agent").

   ![Create Neon API Key](/docs/manage/org_api_keys.png)

   <Admonition type="tip" title="Project-scoped key">
   Restrict the key to the project you linked earlier. The agent only needs to create and delete branches in that project.
   </Admonition>

3. Copy the API Key and add it to `.env.local` as `NEON_API_KEY`.

## Seed the demo tables in Neon

This guide uses a sample `sales` table to demonstrate the agent's capabilities. You can use the provided schema and seed data, or adapt it to your own tables.

Create the table on your project's default branch using `neon psql` or the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor).

<CodeTabs labels={["Use neon CLI", "Raw SQL"]}>

```bash shouldWrap
neon psql main -- -c "CREATE TABLE IF NOT EXISTS sales (
  id         bigserial PRIMARY KEY,
  region     text          NOT NULL,
  product    text          NOT NULL,
  units      integer       NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  sold_at    timestamptz   NOT NULL DEFAULT now()
);"
```

```sql
CREATE TABLE IF NOT EXISTS sales (
  id         bigserial PRIMARY KEY,
  region     text          NOT NULL,
  product    text          NOT NULL,
  units      integer       NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  sold_at    timestamptz   NOT NULL DEFAULT now()
);
```

</CodeTabs>

Seed it with some sample rows so the agent has data to explore:

<CodeTabs labels={["Use neon CLI", "Raw SQL"]}>

```bash shouldWrap
neon psql main -- -c "INSERT INTO sales (region, product, units, unit_price, sold_at)
SELECT
  (ARRAY['North America','Europe','Asia Pacific','Latin America'])[1 + (i % 4)],
  (ARRAY['Starter','Pro','Enterprise'])[1 + (i % 3)],
  1 + (i % 40),
  (ARRAY[19.00, 49.00, 199.00])[1 + (i % 3)],
  now() - (i || ' hours')::interval
FROM generate_series(1, 2000) AS i;"
```

```sql
INSERT INTO sales (region, product, units, unit_price, sold_at)
SELECT
  (ARRAY['North America','Europe','Asia Pacific','Latin America'])[1 + (i % 4)],
  (ARRAY['Starter','Pro','Enterprise'])[1 + (i % 3)],
  1 + (i % 40),
  (ARRAY[19.00, 49.00, 199.00])[1 + (i % 3)],
  now() - (i || ' hours')::interval
FROM generate_series(1, 2000) AS i;
```

</CodeTabs>

## Prepare the box snapshot

You'll use an Upstash Box to run Python and shell commands in an isolated sandbox. Snapshots are point-in-time copies of a box's filesystem. You can prepare a snapshot with the Python packages the agent needs and restore it for each session. Customize the snapshot with any additional packages your agent requires.

Create a `prepare-snapshot.js` script in the project root:

```javascript filename="prepare-snapshot.js"
import { Box } from "@upstash/box";
import { config } from "dotenv";

config({ path: ".env.local" });

const main = async () => {
    const box = await Box.create({ runtime: "python" });
    await box.exec.command(
        'python3 -m pip install --quiet --disable-pip-version-check pandas "psycopg[binary]" matplotlib',
    );
    const snapshot = await box.snapshot({ name: "analyst-base" });
    await box.delete();
    console.log("Snapshot ID:", snapshot.id);
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
```

Add `UPSTASH_BOX_API_KEY` to `.env.local` with your [Upstash Box API key](https://upstash.com/docs/box/overall/quickstart#1-get-your-api-key). The script creates a new box, installs the Python packages, takes a snapshot, deletes the box, and prints the snapshot ID.

```bash filename="Terminal"
node prepare-snapshot.js
```

You'll see output like this:

```text
Snapshot ID: exxx-xxxx-xxxx-xxxx-xxxxxxxx
```

Copy the printed Snapshot ID and add it to `.env.local` as `UPSTASH_BOX_SNAPSHOT_ID`. The snapshot is now ready to restore for each session.

<Admonition type="note" title="Re-snapshot when dependencies change">
The snapshot is a point-in-time copy of the box's filesystem. If you later need different or additional Python packages, create a new snapshot with the same script and update `UPSTASH_BOX_SNAPSHOT_ID`. Snapshots are independent of the box that created them, so deleting that box doesn't affect the snapshot.
</Admonition>

## Declare the function and its secrets

Before writing the application code, declare the function that Neon Functions deploys. The `neon.ts` file defines which source file to deploy, which environment variables to inject, and how branches are managed.

Your `.env.local` now contains the Neon API key, project ID, Upstash Box API key, and snapshot ID:

```bash filename=".env.local"
# other credentials...
NEON_API_KEY=napi_your_neon_api_key
NEON_PROJECT_ID=your_project_id
UPSTASH_BOX_API_KEY=box_your_upstash_api_key
UPSTASH_BOX_SNAPSHOT_ID=snap_your_snapshot_id
```

Now update the function declaration. `neon link` generated a starter `neon.ts`; update the `preview.functions` block to point to the `analyst.ts` source file you'll create later and inject the secrets from `.env.local`:

```ts filename="neon.ts" {6-20}
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    aiGateway: true,
    functions: {
      analyst: {
        name: 'Data analyst agent',
        source: './functions/analyst.ts',
        env: {
          NEON_API_KEY: process.env.NEON_API_KEY!,
          NEON_PROJECT_ID: process.env.NEON_PROJECT_ID!,
          UPSTASH_BOX_API_KEY: process.env.UPSTASH_BOX_API_KEY!,
          UPSTASH_BOX_SNAPSHOT_ID: process.env.UPSTASH_BOX_SNAPSHOT_ID!,
          SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN ?? '',
          SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET ?? '',
        }
      }
    }
  },
  branch: (branch) => {
    if (branch.isDefault) { return {}; }
    if (!branch.exists) { return { ttl: "7d" }; }
    return {};
  },
});
```

The `env` block injects your secrets into the function at deploy time. The two Slack values use `?? ''` because you won't have them until you create the Slack app in a later step. The empty fallback lets this first deploy succeed. You'll redeploy with the real values right after.

You also don't list `DATABASE_URL` as Neon injects it automatically, because the function is deployed onto your branch. The per-session branch connection comes from the Neon SDK at runtime instead.

## Create the env and Neon client helpers

Set up two small helper modules that the rest of the code imports.

First, create `src/lib/env.ts`. This parses the `neon.ts` config you declared earlier and exposes a typed `env` object:

```ts filename="src/lib/env.ts"
import { parseEnv } from '@neon/env';
import config from '../../neon';

export const env = parseEnv(config, 'analyst');
```

[`parseEnv`](https://www.npmjs.com/package/@neon/env) validates the injected variables and returns a typed `env` object. Passing the function's slug (`analyst`) adds a typed `env.function` namespace for the variables you declared in `neon.ts`, so `env.function.NEON_API_KEY` is checked at build time instead of failing with a missing variable at runtime.

Then create `src/lib/neon.ts`:

```ts filename="src/lib/neon.ts"
import { createNeonClient } from '@neon/sdk';
import { env } from './env';

export function getNeon() {
  return createNeonClient({
    apiKey: env.function.NEON_API_KEY,
    throwOnError: true,
  });
}

export function slugForSession(sessionId: string): string {
  const base =
    sessionId
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+/, '')
      .slice(0, 7)
      .replace(/-+$/, '') || 'session';
  const rand = crypto.randomUUID().slice(0, 4);
  return `${base}-${rand}`;
}
```

Setting `throwOnError: true` makes the SDK throw a typed error instead of returning a `{ data, error }` envelope. The slug is deliberately short because it becomes part of the session branch name (`agent/<slug>`). The random suffix keeps two sessions from colliding when the same session ID prefix appears twice.

## Create the sandbox tools

Create `src/mastra/tools/sandbox.ts`. This module defines the tools the agent uses to run Python and shell commands and read/write files inside the Upstash Box. Each tool pulls the box ID from the Mastra request context, so the same tool definition works for every session.

```ts filename="src/mastra/tools/sandbox.ts"
import { createTool } from '@mastra/core/tools';
import type { RequestContext } from '@mastra/core/request-context';
import { Box } from '@upstash/box';
import { z } from 'zod';

export type SandboxContext = { boxId: string };

type BoxClient = Awaited<ReturnType<typeof Box.get>>;

const MAX_OUTPUT_CHARS = 6000;
const boxCache = new Map<string, BoxClient>();

function truncate(text: string, limit = MAX_OUTPUT_CHARS): string {
  if (text.length <= limit) return text;
  return `[truncated ${text.length - limit} chars]\n${text.slice(-limit)}`;
}

function boxIdFrom(context: { requestContext?: RequestContext<SandboxContext> }): string {
  const boxId = context.requestContext?.get('boxId');
  if (!boxId) {
    throw new Error('boxId is missing from the request context');
  }
  return boxId;
}

async function getBox(context: {
  requestContext?: RequestContext<SandboxContext>;
}): Promise<BoxClient> {
  const boxId = boxIdFrom(context);
  const cached = boxCache.get(boxId);
  if (cached) return cached;
  const box = await Box.get(boxId);
  boxCache.set(boxId, box);
  return box;
}

export function releaseBox(boxId: string): void {
  boxCache.delete(boxId);
}

export const runPythonTool = createTool({
  id: 'run-python',
  description:
    'Run a Python 3 script inside the sandbox and return its combined output. The sandbox has pandas, psycopg, and matplotlib installed, and DATABASE_URL points at an isolated branch on Neon. Each call runs in a fresh process, so write anything you need to keep into a file.',
  inputSchema: z.object({
    code: z.string().describe('The complete Python script to execute.'),
  }),
  requestContextSchema: z.object({ boxId: z.string() }),
  execute: async ({ code }, context) => {
    const box = await getBox(context);
    await box.files.mkdir('/work/scripts', { parents: true });
    const path = `/work/scripts/${crypto.randomUUID()}.py`;
    await box.files.write({ path, content: code });
    const run = await box.exec.command(`cd /work && python3 ${path}`);
    return {
      status: run.status,
      output: truncate(run.result ?? ''),
    };
  },
});

export const runShellTool = createTool({
  id: 'run-shell',
  description:
    'Run a shell command inside the sandbox from the /work directory and return its combined output.',
  inputSchema: z.object({
    command: z.string().describe('The shell command to run.'),
  }),
  requestContextSchema: z.object({ boxId: z.string() }),
  execute: async ({ command }, context) => {
    const box = await getBox(context);
    const run = await box.exec.command(`cd /work && ${command}`);
    return {
      status: run.status,
      output: truncate(run.result ?? ''),
    };
  },
});

export const writeFileTool = createTool({
  id: 'write-file',
  description: 'Write a text file inside the sandbox, creating or overwriting it.',
  inputSchema: z.object({
    path: z
      .string()
      .describe('Absolute path inside the sandbox, for example /work/out/report.md.'),
    content: z.string(),
  }),
  requestContextSchema: z.object({ boxId: z.string() }),
  execute: async ({ path, content }, context) => {
    const box = await getBox(context);
    await box.files.write({ path, content });
    return { path, bytes: Buffer.byteLength(content, 'utf8') };
  },
});

export const readFileTool = createTool({
  id: 'read-file',
  description:
    'Read a text file from the sandbox. Returns at most 8 KiB starting from the requested offset.',
  inputSchema: z.object({
    path: z.string(),
    offset: z.number().int().min(0).optional(),
    length: z.number().int().min(1).max(8192).optional(),
  }),
  requestContextSchema: z.object({ boxId: z.string() }),
  execute: async ({ path, offset, length }, context) => {
    const box = await getBox(context);
    const content = await box.files.read(path, { offset, length });
    return { content: truncate(content) };
  },
});

export const listFilesTool = createTool({
  id: 'list-files',
  description: 'List the files and directories at a path inside the sandbox.',
  inputSchema: z.object({
    path: z.string().default('/work'),
  }),
  requestContextSchema: z.object({ boxId: z.string() }),
  execute: async ({ path }, context) => {
    const box = await getBox(context);
    const entries = await box.files.list(path);
    return {
      files: entries.map((entry) => ({
        path: entry.path,
        type: entry.is_dir ? ('directory' as const) : ('file' as const),
        size: entry.size,
      })),
    };
  },
});
```

The above code defines five tools:

- `run-python` runs a Python script in the sandbox and returns its output.
- `run-shell` runs a shell command in the sandbox and returns its output.
- `write-file` writes a text file in the sandbox.
- `read-file` reads a text file from the sandbox, returning at most 8 KiB.
- `list-files` lists the files and directories at a given path in the sandbox.

<Admonition type="tip" title="Do you need run-shell?">
You can drop `runShellTool` and keep the agent to `run-python` plus the file tools. The agent can run shell commands from Python using `subprocess.run()`, which is safer because you can control the command and its arguments more precisely. The `run-shell` tool is still included here for demonstration purposes and to show how to implement a policy layer in the next section.
</Admonition>

## Create the agent

Create `src/mastra/agents/index.ts`:

```ts filename="src/mastra/agents/index.ts"
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';
import { listFilesTool, readFileTool, runPythonTool, runShellTool, writeFileTool } from '../tools/sandbox';

const BLOCKED_SHELL =
  /(rm\s+-rf\s+\/(?:\s|$)|\bmkfs\b|\bdd\s+if=|\bshutdown\b|\breboot\b|curl[^|\n]*\|\s*(?:ba|z)?sh\b)/;

export const dataAnalystAgent = new Agent({
  id: 'data-analyst',
  name: 'Data analyst',
  model: 'neon/glm-5-3-flash',
  requestContextSchema: z.object({ boxId: z.string() }),
  instructions: `
    You are a data analyst. You answer questions about a Postgres database by
    writing and running code inside an isolated Linux sandbox.

    You cannot read the database from this conversation. Everything happens
    through tools:
    - run-python runs a Python script in the sandbox and returns its output.
    - run-shell runs a shell command in the sandbox.
    - write-file, read-file, and list-files work with files in the sandbox.

    Environment facts:
    - The sandbox has pandas, psycopg, and matplotlib installed.
    - DATABASE_URL points at an isolated branch of the production database on Neon.
      It contains a sales table with the columns id, region, product, units,
      unit_price, and sold_at.
    - The branch is disposable. You can create temporary tables and run
      expensive queries without affecting production.
    - Each run-python call starts a new process. Nothing stays in memory
      between calls, so save anything you need to keep to a file under
      /work and read it back later.
    - Work from /work and write output to /work/out.

    Method:
    1. Inspect the schema before writing queries, for example with
       information_schema.
    2. Answer the question with code and real query results. Never estimate or
       invent numbers.
    3. If a chart helps, save it to /work/out/chart.png.
    4. Write a full Markdown report to /work/out/report.md with the
       answer, the method you used, and any caveats.
    5. Your final answer is what gets posted to Slack, so keep it short and
       scannable: lead with the direct answer in one or two sentences, then
       at most 3-5 bullet points with the key numbers. No methodology, no
       caveats, no long prose. The full report goes in report.md, not in
       your reply.

    If a script fails, read the error and fix it. Do not repeat the same
    failing call.
  `,
  tools: { runPythonTool, runShellTool, readFileTool, writeFileTool, listFilesTool },
  hooks: {
    beforeToolCall: ({ toolName, input }) => {
      if (toolName === 'runShellTool' || toolName === 'run-shell') {
        const command = String((input as { command?: unknown })?.command ?? '');
        if (BLOCKED_SHELL.test(command)) {
          return {
            proceed: false,
            output: 'Blocked by sandbox policy: destructive shell command.',
          };
        }
      }
    },
  },
});
```

The above code defines a Mastra agent that answers questions about a Postgres database by writing and running code inside an isolated Linux sandbox. The agent uses the tools defined earlier to run Python scripts, shell commands, and read/write files in the sandbox. The instructions provide guidance on how the agent should operate, including inspecting the schema, answering questions with real query results, and writing reports.

The `beforeToolCall` hook is a policy layer at the Mastra level. It runs before the tool executes and can short-circuit the call by returning `{ proceed: false, output }`. In that case the agent receives `output` as the tool result. The check here blocks a small set of destructive commands. Because the box and database branch are already isolated and disposable, this is defense in depth rather than a hard boundary. For a production deployment, combine it with [Box network policy](https://upstash.com/docs/box/overall/network-policy) to restrict outbound access.

## Configure the Mastra instance

Register the agent on the Mastra instance so the session runner can find it. Create `src/mastra/index.ts`:

```ts filename="src/mastra/index.ts"
import { Mastra } from '@mastra/core';
import { dataAnalystAgent } from './agents';

export const mastra = new Mastra({
  agents: { dataAnalystAgent },
});
```

Because this agent has no memory or durable workflow, it needs no storage adapter and no `storage.init()` call. If you later add [Mastra memory](https://mastra.ai/docs/memory/overview) to keep session history, add a Postgres store backed by your database on Neon at that point. See [Building stateful AI Agents with Mastra and Lakebase Postgres](/guides/mastra-neon), which wires up `@mastra/pg`'s `PostgresStore` against Neon for exactly that.

## Create the session runner

The session runner provisions a branch and a box, runs the agent, and cleans up afterward. It ties together the Mastra instance and the sandbox tools you created in the previous section. Create `src/mastra/session.ts`:

```ts filename="src/mastra/session.ts"
import { RequestContext } from '@mastra/core/request-context';
import { Box } from '@upstash/box';
import { mastra } from './index';
import { releaseBox } from './tools/sandbox';
import { env } from '../lib/env';
import { getNeon, slugForSession } from '../lib/neon';

export type SessionResult = {
  sessionId: string;
  answer: string;
  report: string;
  chart: Buffer | null;
};

export async function runSession(question: string): Promise<SessionResult> {
  const sessionId = slugForSession(crypto.randomUUID());
  const projectId = env.function.NEON_PROJECT_ID;
  const neonClient = getNeon();

  const connection = await neonClient.branches.createAndConnect({
    projectId,
    name: `agent/${sessionId}`,
  });

  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000)
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z');
  await neonClient.branches.update({
    projectId,
    branchId: connection.branch.id,
    expires_at: expiresAt,
  });

  const box = await Box.fromSnapshot(env.function.UPSTASH_BOX_SNAPSHOT_ID, {
    env: {
      DATABASE_URL: connection.connectionString,
      MPLBACKEND: 'Agg',
    },
  });

  try {
    const requestContext = new RequestContext<{ boxId: string }>();
    requestContext.set('boxId', box.id);

    const agent = mastra.getAgent('dataAnalystAgent');
    const result = await agent.generate(question, {
      requestContext,
      maxSteps: 25,
    });

    let report = '';
    try {
      report = await box.files.read('/work/out/report.md');
    } catch {
      report = '';
    }

    let chart: Buffer | null = null;
    try {
      const entries = await box.files.list('/work/out');
      if (entries.some((entry) => entry.path === '/work/out/chart.png')) {
        const encoded = await box.exec.command('base64 -w0 /work/out/chart.png');
        if (encoded.status === 'completed') {
          chart = Buffer.from(encoded.result.replace(/\s+/g, ''), 'base64');
        }
      }
    } catch {
      chart = null;
    }

    const finalStep = result.steps.at(-1);
    const answer = finalStep?.text?.trim() || result.text;

    return { sessionId, answer, report, chart };
  } finally {
    await box.delete().catch(() => {});
    releaseBox(box.id);
    await neonClient.branches.delete({ projectId, branchId: connection.branch.id })
  }
}
```

The session runner does three things in order: provision, run, and clean up. Provisioning starts with `branches.createAndConnect`, which creates the branch, attaches compute, and polls until the branch is ready to accept connections. The `expires_at` update is a backstop in case the cleanup fails: Neon deletes the branch automatically after 12 hours. That's long enough for a session to finish but short enough to avoid leaving a dangling branch.

The `Box.fromSnapshot` call restores the snapshot you prepared earlier with the branch connection string injected as `DATABASE_URL`, and sets `MPLBACKEND=Agg` so matplotlib can render charts without a display.

Inside the `try` block, the box ID goes into the Mastra request context rather than into the prompt. The tools read it from there on every call, so the model never sees the ID and can't leak or tamper with it. `maxSteps: 25` bounds the run so the agent can't loop forever, and the `generate` call returns the final text answer.

Cleanup runs in a `finally` block, so the box and the branch are deleted whether the session succeeded, failed, or threw. Anything worth keeping leaves the box before that happens: the report is read from `/work/out/report.md`, and the chart is read as base64 from `/work/out/chart.png` through a shell command.

## Create the Slack module

The Slack module wires the [Chat SDK](https://chat-sdk.dev/adapters/official/slack) to your Mastra session runner. Create `src/mastra/slack.ts`:

```ts filename="src/mastra/slack.ts"
import { Chat } from 'chat';
import { createSlackAdapter } from '@chat-adapter/slack';
import { createMemoryState } from '@chat-adapter/state-memory';
import { waitUntil } from '@neon/functions';
import { runSession } from './session';

export const chat = new Chat({
  userName: 'Data analyst',
  adapters: { slack: createSlackAdapter() },
  state: createMemoryState(),
  concurrency: 'queue',
});

chat.onNewMention(async (thread, message) => {
  await thread.post('On it!');

  const question = message.text.replace(/@\S+\s*/, '').trim();
  const { answer, chart } = await runSession(question);

  await thread.post({
    markdown: answer,
    files: chart ? [{ data: chart, filename: 'chart.png' }] : undefined,
  });
});

export async function handleSlackWebhook(request: Request): Promise<Response> {
  return chat.webhooks.slack(request, { waitUntil });
}
```

The above code creates a `Chat` instance with the Slack adapter and registers an `onNewMention` handler that fires whenever a user @mentions the bot. The handler posts an acknowledgment, strips the bot's own mention from the message text to get the question, calls `runSession` to provision the branch and box and run the agent, and posts the answer back into the thread with the chart attached if the agent produced one.

The `concurrency: 'queue'` option makes a second mention in the same thread wait for the running session to finish instead of being dropped or run in parallel, so two agent runs never share a branch or a box. `waitUntil` keeps the function invocation alive after the `200` response is sent to Slack, so the session can finish in the background.

## Expose the Slack webhook endpoint

Create `functions/analyst.ts` to expose the Slack webhook endpoint:

```ts filename="functions/analyst.ts"
import { Hono } from 'hono';
import { handleSlackWebhook } from '../src/mastra/slack';

const app = new Hono();

app.post('/slack/events', (c) => handleSlackWebhook(c.req.raw));

export default app;
```

The above code creates a Hono app that listens for POST requests at `/slack/events` and forwards them to the Slack webhook handler you defined earlier.

## Deploy the function

You will need to deploy the function to get a public URL for Slack to send events to. Run the following command:

```bash
neon deploy --env .env.local
```

You'll see output like this:

```text
Applied changes
  + function analyst

Function URLs
  • analyst: https://br-xxx-analyst.compute.c-6.us-east-2.aws.neon.tech
```

Copy the Function URL for the `analyst` function. You'll use it in the next step when creating the Slack app.

## Create the Slack app

You'll need a Slack app to receive @mentions and post replies. The app needs a bot user, a few scopes, and an event subscription for `app_mention`. Create the app in your workspace:

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App** > **From a manifest**.
2. Choose **YAML** and select your Workspace. Add the following manifest:

   ```yaml
   display_information:
     name: Data analyst
     description: Runs data analysis against a disposable branch on Neon in an isolated sandbox and posts the results back.
   features:
     bot_user:
       display_name: Data analyst
       always_online: true
   oauth_config:
     scopes:
       bot:
         - users:read
         - app_mentions:read
         - chat:write
         - files:write
   settings:
     event_subscriptions:
       request_url: https://YOUR_FUNCTION_URL/slack/events
       bot_events:
         - app_mention
     org_deploy_enabled: false
     socket_mode_enabled: false
     token_rotation_enabled: false
   ```

   ![Slack manifest screenshot](/docs/guides/mastra-data-analyst-slack-manifest.png)

   The manifest scopes include: `users:read` to read user information, `app_mentions:read` to receive @mentions, `chat:write` to reply, and `files:write` to upload the chart. The bot reacts to mentions only, so it needs no history scopes.

3. Replace `https://YOUR_FUNCTION_URL/slack/events` with the Function URL you copied in the previous step. Keep the `/slack/events` path at the end; it matches the route the Hono app listens on.
4. Click **Next**, then **Create and Install**. Slack validates the manifest and installs the app in your workspace.
5. In the confirmation dialog, click **Go to app settings**. Open **OAuth & Permissions** in the left sidebar, copy the **Bot User OAuth Token**, and add it to `.env.local` as `SLACK_BOT_TOKEN`.
6. Under **Basic Information** > **App Credentials**, copy the **Signing Secret** and add it to `.env.local` as `SLACK_SIGNING_SECRET`.

The Slack adapter picks up both values from the environment on its own: `SLACK_BOT_TOKEN` authorizes posting replies and uploading files, and `SLACK_SIGNING_SECRET` verifies that each incoming POST actually came from Slack.

With these two values added, `.env.local` now holds every secret the function needs to run:

```bash filename=".env.local"
# other Neon managed credentials...
NEON_API_KEY=napi_your_neon_api_key
NEON_PROJECT_ID=your_project_id
UPSTASH_BOX_API_KEY=box_your_upstash_api_key
UPSTASH_BOX_SNAPSHOT_ID=snap_your_snapshot_id
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your_slack_signing_secret
```

Invite the bot to a channel where you want to test it:

```text
/invite @Data analyst
```

## Redeploy with the Slack credentials

Redeploy the function so the Slack credentials are injected into the environment:

```bash
neon deploy --env .env.local
```

You can now test the bot in Slack. The next section shows how to ask a question and get an answer.

## Ask a question end to end

Try the Slack path first. In a channel with the bot invited, send:

```text
@Data analyst Which region had the highest revenue last month, and how did it trend week over week?
```

The bot replies immediately with a status message, then runs the session in the background. When the agent finishes, it posts a Markdown report with the answer and attaches a chart if it produced one.

If the bot doesn't reply, check [function logs](/docs/compute/functions/logs) first. A failed signature check or a session error shows up there. (The `SLACK_SIGNING_SECRET` must match **Basic Information** > **App Credentials**.) The adapter posts an error message to the thread when a session fails, so a silent thread usually means the event never arrived. In that case, check that the bot is in the channel and that the manifest's `request_url` points at your function URL with `/slack/events` appended. Also check for stale env: deployed env is a snapshot at apply time, so redeploy after editing `.env.local`.

Slack retries events when your endpoint doesn't return a `2xx` response. The adapter deduplicates retried deliveries automatically, but if you add side effects of your own, make them safe to run more than once.

If successful, the session runner provisions a branch and a box, the agent runs in the box, and the bot posts the answer back to Slack. The branch and box are deleted when the session ends, so production data is never at risk.

![Mastra data analyst responding in Slack](/docs/guides/mastra-data-analyst-slack-response.png)

</Steps>

## Conclusion

You built a data-analysis agent that answers questions with real query results, right where your team asks them. Mastra owns the reasoning loop and the policy layer, the Chat SDK adapter handles the Slack connectivity, Upstash Box runs the agent's Python in an isolated sandbox, and every session gets its own disposable branch on Neon so production data is never at risk.

The same pattern extends beyond data analysis. Any agent that needs to run code against a database, whether for report generation, ETL experiments, or exploratory work, can follow this shape: branch the data, sandbox the compute, and tear both down when the session ends.

Before taking this to production, restrict egress with a [Box network policy](https://upstash.com/docs/box/overall/network-policy) so a prompt-injected instruction can't exfiltrate data.

## Extending this guide

Once the bot is working, you can evolve it in several directions:

- **Follow-up questions in the thread.** The Chat SDK already tracks threads; subscribe with `thread.subscribe()` and handle `onSubscribedMessage` to route follow-ups through the same session (see [this pattern in action](/guides/ai-sdk-neon-data-assistant) with the Vercel AI SDK). Add a Postgres-backed [Mastra memory](https://mastra.ai/docs/memory/overview) store keyed by thread ID to persist history across restarts.
- **Persist artifacts.** The chart goes into the Slack thread, but you can also save it to Neon Object Storage for later retrieval.

## Resources

- [Neon Functions overview](/docs/compute/functions/overview)
- [Branching](/docs/introduction/branching)
- [Mastra tools](https://mastra.ai/docs/agents/using-tools)
- [Upstash Box documentation](https://upstash.com/docs/box)
- [Chat SDK Slack adapter](https://chat-sdk.dev/adapters/official/slack)

<NeedHelp/>
