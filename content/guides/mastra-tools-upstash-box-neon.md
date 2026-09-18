---
title: 'Build a Slack bot with a Mastra agent, Upstash Box, and Neon Functions'
subtitle: 'Learn how to build a Slack bot that runs a Mastra agent on Neon Functions, using a disposable Upstash Box and a dedicated branch on Neon for each session.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-09-14T00:00:00.000Z'
updatedOn: '2026-09-18T09:41:55.645Z'
---

[Mastra](https://mastra.ai) is a TypeScript framework for building AI agents in production. It provides the primitives you need to define an agent, its tools, and the reasoning loop that decides which tool to call next. With Mastra, you can build agents that explore databases, run Python scripts, generate charts, and write Markdown reports.

But this kind of agent needs two things that are risky to hand out: a place to run code, and a database it can explore freely. You don't want the agent executing arbitrary code on your production server, or querying and modifying your production database directly.

This guide explains how to solve both problems by building a Slack-based data-analysis agent. The stack combines [Mastra](https://mastra.ai) for the agent reasoning loop, [Neon Functions](/docs/compute/functions/overview) to host the Mastra agent as a serverless HTTP endpoint, [Upstash Box](https://upstash.com/docs/box) as an isolated sandbox where the agent runs Python and shell commands, and [branching](/docs/introduction/branching) to give every session its own copy-on-write clone of your database. Each question gets a fresh, disposable workspace: the agent runs code inside the box against the branch, and both are deleted when the session ends.

By the end of this guide, you'll have a Slack bot that can answer questions about your data, generate charts, and post the results back into the thread where the question was asked.

You'll implement:

- A Mastra agent hosted on a Neon Function, whose tools run Python, shell commands, and file operations inside an Upstash Box
- A fresh branch on Neon per session, deleted when the session ends, so production stays untouched
- A Slack bot that receives @mentions, provisions the branch and box, runs the agent, and posts the answer and chart back into the thread

<CopyPrompt
  src="/prompts/mastra-tools-upstash-box-neon-prompt.md"
  description="Use this prompt to customize the guide and build it with your AI agent."
  buttonText="Copy prompt"
/>

## Architecture overview

The runner has four components, each with a clear role:

- **Slack:** Users ask questions by @mentioning the bot in a thread.
- **Branch on Neon:** A disposable, copy-on-write clone of your database, created per session so the agent can query and modify it without touching production.
- **Mastra:** The reasoning loop. It defines the agent, its tools, and the logic that decides which tool to call next. It runs inside a Neon Function.
- **Upstash Box:** The isolated sandbox where the tools execute. It runs Python and shell commands and holds the files the agent produces.

Here is how a question flows through the system:

1. **Event:** A user @mentions the bot. Slack sends the event to `POST /slack/events`, the adapter verifies the signature and returns `200` within Slack's 3-second window, and the real work happens in the background.
2. **Provision:** The mention handler posts an acknowledgment message, creates a branch with an `expires_at` backstop, and restores an Upstash Box from a prepared snapshot with the branch connection string injected as `DATABASE_URL`.
3. **Reason:** The handler runs the agent with the box ID in the request context. The agent calls `run-python`, `run-shell`, and the file tools as it works, and each tool call executes inside the box.
4. **Deliver:** The agent writes a Markdown report and, optionally, a chart into `/workspace/out`. The handler reads both, deletes the box and the branch, and posts the answer and chart back into the thread.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version 22 or higher installed. Download from [nodejs.org](https://nodejs.org/).
- **Neon account:** Sign up for a free account at [console.neon.tech](https://console.neon.tech/signup).
- **Neon CLI:** Installed globally (`npm install -g neon@latest`) and authenticated (`neon login`). See the [Neon CLI Quickstart](/docs/cli/quickstart) for details.
- **Slack workspace:** Permission to create and install a Slack app.
- **Upstash and Anthropic credentials:** An API key from the [Upstash Console](https://console.upstash.com) for Box, and an [Anthropic API key](https://platform.claude.com/settings/keys) for the Mastra agent.
  <Admonition type="note" title="Neon AI Gateway">
  You can also use [Neon AI Gateway](/docs/ai-gateway/overview) to access Anthropic models without an Anthropic account. This feature requires a paid Neon plan. Follow the "Using Neon AI Gateway" instructions in the steps below to use it instead of an Anthropic API key.
  </Admonition>

<Steps>

## Scaffold the project

Create a new directory and install the dependencies:

```bash
mkdir mastra-box-analyst && cd mastra-box-analyst
npm init -y
npm pkg set type=module
mkdir -p functions src/lib src/mastra/agents src/mastra/tools
npm install @mastra/core @neon/sdk @neon/config @upstash/box hono zod @neon/functions chat @chat-adapter/slack @chat-adapter/state-memory
npm install -D typescript @types/node dotenv
```

The above command installs the Mastra core, Neon SDK, Upstash Box SDK, Hono for the HTTP function, Zod for schema validation, and the Chat SDK with Slack adapter. By the end of the guide, the project looks like this:

```text
mastra-box-analyst/
├── functions/
│   └── analyst.ts        # HTTP routes: Slack webhook + /analyze
├── src/
│   ├── lib/
│   │   └── neon.ts       # Neon SDK client and helpers
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
neon skills -s neon -s neon-functions
```

Link or Create a Neon project by running the following command:

```bash
neon link
```

You'll be prompted to select your organization, then a project. **Create a new project** named `mastra-box-analyst` (or pick an existing one). Next, select a region. Choose **AWS US East (Ohio)** (`aws-us-east-2`), **AWS US East (N. Virginia)** (`aws-us-east-1`), **AWS Europe (Frankfurt)** (`aws-eu-central-1`), or **AWS Asia Pacific (Singapore)** (`aws-ap-southeast-1`); this guide uses US East (Ohio). Neon Functions are currently available in these regions. Support is expanding toward [all regions](/docs/introduction/regions). When asked which Neon services you require, select **Functions**. Finally, confirm that you want to manage your setup as code, which generates a `neon.ts` file in your project root.

The `link` command also creates a placeholder function `hello.ts` at your project root. You'll build the Slack bot in your own `functions/analyst.ts` file, so delete the placeholder:

```bash
rm hello.ts
```

The `link` command also saves the linked project details to the `.neon` context file and creates a `.env.local` file containing the project credentials. Add `NEON_PROJECT_ID` to your `.env.local`, using the `projectId` value from the `.neon` context file. While you're in there, add `ANTHROPIC_API_KEY` from the prerequisites as well.

<Tabs labels={["Using Anthropic API key", "Using Neon AI Gateway"]}>

<TabItem>

```bash filename=".env.local"
# Other credentials...
NEON_PROJECT_ID=your_project_id

# Use your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
```

</TabItem>

<TabItem>

```bash filename=".env.local"
# Other credentials...
NEON_PROJECT_ID=your_project_id

# Use your Neon AI Gateway key
ANTHROPIC_API_KEY=sk-ant-your_neon_ai_gateway_key

# Set this to your Neon AI Gateway endpoint
ANTHROPIC_BASE_URL=https://br-xxxx.neon.tech/v1
```

</TabItem>

</Tabs>

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

   Optionally, restrict the key to the project you linked earlier by creating a project-scoped key.

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

You'll use an Upstash Box to run Python and shell commands in an isolated sandbox. Snapshots are point-in-time copies of a box's filesystem, so you can prepare a snapshot with the Python packages the agent needs and restore it for each session. Customize the snapshot with any additional packages your agent requires.

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
The snapshot is a point-in-time copy of the box's filesystem. If you later need different or additional Python packages, create a new snapshot with the same script and update `UPSTASH_BOX_SNAPSHOT_ID`. Snapshots are independent of the box that created them, so deleting that box does not affect the snapshot.
</Admonition>

## Create the Neon client helper

Create `src/lib/neon.ts`:

```ts filename="src/lib/neon.ts"
import { createNeonClient } from '@neon/sdk';

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getNeon() {
  return createNeonClient({
    apiKey: requiredEnv('NEON_API_KEY'),
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

Setting `throwOnError: true` makes the SDK throw a typed error instead of returning a `{ data, error }` envelope. The slug is deliberately short because it becomes part of the session branch name (`agent/<slug>`), and the random suffix keeps two sessions from colliding on a branch name when the same session ID prefix appears twice.

## Create the session runner

The session runner provisions a branch and a box, runs the agent, and cleans up. Both the Slack handler and the HTTP API call it, so there is a single place where the branch, box, agent, and cleanup live. It imports the Mastra instance (`src/mastra/index.ts`) and the sandbox tools (`src/mastra/tools/sandbox.ts`), which you create in the following sections; the file tree from the scaffold step shows how they fit together. Create `src/mastra/session.ts`:

```ts filename="src/mastra/session.ts"
import { RequestContext } from '@mastra/core/request-context';
import { Box } from '@upstash/box';
import { mastra } from './index';
import { releaseBox } from './tools/sandbox';
import { getNeon, requiredEnv, slugForSession } from '../lib/neon';

export type SessionResult = {
  sessionId: string;
  answer: string;
  report: string;
  chart: Buffer | null;
};

export async function runSession(question: string): Promise<SessionResult> {
  const sessionId = slugForSession(crypto.randomUUID());
  const projectId = requiredEnv('NEON_PROJECT_ID');
  const neonClient = getNeon();

  const connection = await neonClient.branches.createAndConnect(projectId, {
    name: `agent/${sessionId}`,
  });

  // Backstop: the branch is deleted automatically if cleanup fails.
  // See /docs/guides/branching-neon-api#creating-a-branch-with-expiration-using-the-api
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000)
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z');
  await neonClient.branches.update(projectId, connection.branch.id, {
    expires_at: expiresAt,
  });

  const box = await Box.fromSnapshot(requiredEnv('UPSTASH_BOX_SNAPSHOT_ID'), {
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
      report = await box.files.read('/workspace/out/report.md');
    } catch {
      report = '';
    }

    // The chart must leave the box before the box is deleted. files.read
    // returns text, so pull the binary PNG out as base64 through exec.
    let chart: Buffer | null = null;
    try {
      const entries = await box.files.list('/workspace/out');
      if (entries.some((entry) => entry.path === '/workspace/out/chart.png')) {
        const encoded = await box.exec.command('base64 -w0 /workspace/out/chart.png');
        if (encoded.status === 'completed') {
          chart = Buffer.from(encoded.result.replace(/\s+/g, ''), 'base64');
        }
      }
    } catch {
      chart = null;
    }

    return { sessionId, answer: result.text, report, chart };
  } finally {
    await box.delete().catch(() => {});
    releaseBox(box.id);
    await neonClient.branches.delete(projectId, connection.branch.id).catch(() => {});
  }
}
```

The session logic works like this. `branches.createAndConnect` creates the branch, attaches compute, and polls until the branch is ready; the `expires_at` backstop makes Neon delete the branch automatically if the function is evicted before cleanup runs. The box is restored from the snapshot with the branch connection string injected as `DATABASE_URL`, plus `MPLBACKEND=Agg` so matplotlib works without a display.

The agent's box ID travels in the Mastra request context rather than through the model, so the tools can reach the box but the model never sees it and cannot leak or tamper with it. `maxSteps: 25` bounds the run: the default of 5 is too few for exploratory analysis, while an unbounded run can loop.

Cleanup happens in a `finally` block, so the box and the branch are deleted whether the run succeeded, failed, or threw. Anything worth keeping leaves the box first: the report is read from `/workspace/out/report.md`, and the chart is pulled out as base64 through `exec` (the `files.read` API returns text, so it's the wrong tool for a PNG) before `box.delete()`.

## Create the Slack module

The Slack layer is one module built on the Chat SDK: it creates the `Chat` instance with the Slack adapter, registers a mention handler that calls the session runner, and exposes the webhook entry point. The adapter handles signature verification, URL verification, deduplication of retried events, and thread tracking. Create `src/mastra/slack.ts`:

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
  await thread.post('On it. Provisioning a branch and a sandbox; this takes a minute.');

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

What the adapter takes off your plate: HMAC signature verification against `SLACK_SIGNING_SECRET`, the `url_verification` handshake Slack performs when you save the event URL, deduplication of retried events, mention detection, and thread IDs that stay stable across a conversation. The `concurrency: 'queue'` setting makes a second mention in the same thread wait for the running session instead of being dropped, and `waitUntil` keeps the invocation alive after the `200` response so the session can finish in the background.

The mention handler is where your logic lives. It strips the bot's own mention from the message text, calls the shared `runSession` function, and posts the answer back with the chart attached. Posting a message with `thread.post({ markdown, files })` handles both the text and the file upload in one call; the adapter runs Slack's staged upload flow internally.

## Create the sandbox tools

Each tool wraps one Box operation, and the agent decides when to call it. Create `src/mastra/tools/sandbox.ts`:

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
    await box.files.mkdir('/workspace/scripts', { parents: true });
    const path = `/workspace/scripts/${crypto.randomUUID()}.py`;
    await box.files.write({ path, content: code });
    const run = await box.exec.command(`cd /workspace && python3 ${path}`);
    return {
      status: run.status,
      output: truncate(run.result ?? ''),
    };
  },
});

export const runShellTool = createTool({
  id: 'run-shell',
  description:
    'Run a shell command inside the sandbox from the /workspace directory and return its combined output.',
  inputSchema: z.object({
    command: z.string().describe('The shell command to run.'),
  }),
  requestContextSchema: z.object({ boxId: z.string() }),
  execute: async ({ command }, context) => {
    const box = await getBox(context);
    const run = await box.exec.command(`cd /workspace && ${command}`);
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
      .describe('Absolute path inside the sandbox, for example /workspace/out/report.md.'),
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
    path: z.string().default('/workspace'),
  }),
  requestContextSchema: z.object({ boxId: z.string() }),
  execute: async ({ path }, context) => {
    const box = await getBox(context);
    const entries = await box.files.list(path);
    return {
      files: entries.map((entry) => ({
        path: entry.path,
        type: entry.type,
        size: entry.size,
      })),
    };
  },
});
```

A few design choices matter here. The tool pulls `boxId` out of the Mastra `RequestContext`, so the same tool definition works for every session and can live at module scope. `getBox` caches the client per box ID because an agent makes several tool calls in a row and each `Box.get` is a round trip; the cache is scoped to the isolate and keyed by box ID, so two concurrent sessions never share a client, and the route calls `releaseBox` when the session ends. Output is truncated to the last 6000 characters because raw `stdout` can be megabytes and would blow the model's context window. Finally, `run-python` writes a script file and executes it: each call is a fresh process, so the agent must persist state through files rather than variables. The instructions make that explicit.

<Admonition type="tip" title="Do you need run-shell?">
You can drop `runShellTool` and keep the agent to `run-python` plus the file tools. It's included here because shell access is a Box primitive the agent sometimes needs, for example to inspect a directory or check an installed package. The next section shows how to add a policy that blocks destructive commands at the Mastra layer.
</Admonition>

## Create the agent

Create `src/mastra/agents/index.ts`:

```ts filename="src/mastra/agents/index.ts"
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';
import {
  listFilesTool,
  readFileTool,
  runPythonTool,
  runShellTool,
  writeFileTool,
} from '../tools/sandbox';

const BLOCKED_SHELL =
  /(rm\s+-rf\s+\/(?:\s|$)|\bmkfs\b|\bdd\s+if=|\bshutdown\b|\breboot\b|curl[^|\n]*\|\s*(?:ba|z)?sh\b)/;

export const dataAnalystAgent = new Agent({
  id: 'data-analyst',
  name: 'Data analyst',
  model: 'anthropic/claude-sonnet-4-6',
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
      /workspace and read it back later.
    - Work from /workspace and write output to /workspace/out.

    Method:
    1. Inspect the schema before writing queries, for example with
       information_schema.
    2. Answer the question with code and real query results. Never estimate or
       invent numbers.
    3. If a chart helps, save it to /workspace/out/chart.png.
    4. Write a short Markdown report to /workspace/out/report.md with the
       answer, the method you used, and any caveats.
    5. Reply with the report text as your final answer.

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

The instructions carry most of the agent's behavior, and they are specific on purpose. Telling the agent the table schema, where to write output, and that Python memory does not persist between calls removes the most common ways a code-interpreter agent wastes turns.

The `beforeToolCall` hook is a policy layer at the Mastra level. It runs before the tool executes and can short-circuit the call by returning `{ proceed: false, output }`, in which case the agent receives `output` as the tool result. The check here blocks a small set of destructive commands. Because the box is already an isolated, disposable container, this is defense in depth rather than a hard boundary. For a production deployment, combine it with [Box network policy](https://upstash.com/docs/box/overall/network-policy) to restrict outbound access.

## Configure the Mastra instance

Register the agent so the route can retrieve it by name. Create `src/mastra/index.ts`:

```ts filename="src/mastra/index.ts"
import { Mastra } from '@mastra/core';
import { dataAnalystAgent } from './agents';

export const mastra = new Mastra({
  agents: { dataAnalystAgent },
});
```

Because this agent has no memory or durable workflow, it needs no storage adapter and no `storage.init()` call. If you later add [Mastra memory](https://mastra.ai/docs/memory/overview) to keep session history, that is the point where you would add a Postgres store backed by your Neon database.

Registering agents on the instance rather than importing them directly is what makes `mastra.getAgent()` work inside the session runner.

## Wire up the HTTP routes

The function has two routes. `POST /slack/events` hands the request to the Chat SDK webhook handler, and `POST /analyze` runs a session synchronously and returns JSON for scripts and other clients. Create `functions/analyst.ts`:

```ts filename="functions/analyst.ts"
import { Hono } from 'hono';
import type { Context } from 'hono';
import { handleSlackWebhook } from '../src/mastra/slack';
import { runSession } from '../src/mastra/session';

const app = new Hono();

function authorized(c: Context): boolean {
  const key = process.env.API_KEY;
  return Boolean(key) && c.req.header('authorization') === `Bearer ${key}`;
}

app.post('/slack/events', (c) => handleSlackWebhook(c.req.raw));

app.post('/analyze', async (c) => {
  if (!authorized(c)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const body = await c.req.json<{ question?: string }>();
  if (!body.question) {
    return c.json({ error: 'question is required' }, 400);
  }

  const result = await runSession(body.question);

  return c.json({
    sessionId: result.sessionId,
    answer: result.answer,
    report: result.report,
    chart: result.chart ? result.chart.toString('base64') : null,
  });
});

export default app;
```

The Slack route is one line: the adapter verifies the signature against the raw request, answers the `url_verification` handshake, returns `200` within Slack's 3-second window, and runs the mention handler under `waitUntil`. `POST /analyze` is the escape hatch for programmatic use: it authenticates with `API_KEY` and returns the same `SessionResult` as JSON, with the chart base64-encoded so it survives JSON.

<Admonition type="note" title="The synchronous route and long sessions">
`POST /analyze` is synchronous: the request stays open until the agent finishes. That keeps the example small, but it means a session must complete within the function's [15-minute time-to-first-byte budget](/docs/compute/functions/reference/runtime-limits#timeouts). The Slack route does not have this constraint, because the adapter acknowledges immediately and finishes the work under `waitUntil`, which has the same [15-minute budget](/docs/compute/functions/reference/runtime-limits#timeouts) of its own. For longer sessions, or for work you want to survive an eviction, move the run into a durable workflow: start the work, persist a checkpoint, and resume from a callback.
</Admonition>

## Declare the function and its secrets

All the code exists now, so the next step is to declare the function that Neon Functions deploys. First, generate an `API_KEY` that protects the function's HTTP endpoints with `openssl` or any other secure random generator:

```bash filename="Terminal"
openssl rand -hex 32
```

Add it to `.env.local` as `API_KEY`. Your `.env.local` now contains six values (the two Slack values come later):

```bash filename=".env.local"
NEON_API_KEY=napi_your_neon_api_key
NEON_PROJECT_ID=your_project_id
UPSTASH_BOX_API_KEY=box_your_upstash_api_key
UPSTASH_BOX_SNAPSHOT_ID=snap_your_snapshot_id
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
API_KEY=your_generated_api_key
```

Now declare the function. Neon Functions uses the `neon.ts` file to define your function: which source file to deploy, which environment variables to inject, and how branches are managed. `neon link` generated a starter `neon.ts`; update the `preview.functions` block to point to the `analyst.ts` source file and inject the secrets from `.env.local`:

```ts filename="neon.ts" {4-21}
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    functions: {
      analyst: {
        name: 'Data analyst agent',
        source: './functions/analyst.ts',
        env: {
          NEON_API_KEY: process.env.NEON_API_KEY!,
          NEON_PROJECT_ID: process.env.NEON_PROJECT_ID!,
          UPSTASH_BOX_API_KEY: process.env.UPSTASH_BOX_API_KEY!,
          UPSTASH_BOX_SNAPSHOT_ID: process.env.UPSTASH_BOX_SNAPSHOT_ID!,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
          API_KEY: process.env.API_KEY!,
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

The `env` block injects your secrets into the function at deploy time. The two Slack values use `?? ''` because you won't have them until you create the Slack app in a later step: the empty fallback lets this first deploy succeed, and you'll redeploy with the real values right after. You don't list `DATABASE_URL`: Neon injects it automatically, because the function is deployed onto your branch. The per-session branch connection comes from the Neon SDK at runtime instead.

The `@upstash/box` SDK reads `UPSTASH_BOX_API_KEY` from the environment, so no tool needs to pass it explicitly.

## Deploy the function (first deploy)

Deploy with the Neon CLI. The `--env` flag loads your `.env.local` file before evaluating the policy, so the `env` values in `neon.ts` resolve to your real secrets:

```bash
neon deploy --env .env.local
```

Get the function public URL:

```bash
neon functions get analyst -o yaml
```

```yaml
id: analyst
slug: analyst
name: Data analyst agent
invocation_url: https://br-wispy-brook-a1b2c3d4-analyst.compute.c-2.us-east-2.aws.neon.tech/
current_deployment:
  id: 1
  status: completed
  runtime: nodejs24
active_deployment:
  id: 1
  status: completed
  runtime: nodejs24
```

When `status` is `completed`, the function is live.

<Admonition type="note" title="No ngrok needed">
Unlike most Slack tutorials, you don't need a tunnel. The function is already a public HTTPS endpoint, and Slack delivers events straight to it. Local development against a deployed function works too: deploy early, then iterate with `neon deploy`.
</Admonition>

You now have the `invocation_url` Slack needs. The Slack credentials themselves don't exist yet, which is why the deploy above succeeded with the empty `?? ''` fallbacks. Create the Slack app next, then redeploy with the real values.

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

   The manifest scopes are the minimum the bot needs: `app_mentions:read` to receive @mentions, `chat:write` to reply, and `files:write` to upload the chart. The bot reacts to mentions only, so it needs no history scopes.

3. Replace `https://YOUR_FUNCTION_URL/slack/events` with your function's `invocation_url` from the previous step, keeping `/slack/events` at the end. Slack verifies this URL when you save the manifest, which is why the deploy had to happen first.
4. Click **Next** and **Create**.
5. Under **OAuth & Permissions**, click **Install to Workspace** and copy the **Bot User OAuth Token** (it starts with `xoxb-`). Put it in `.env.local` as `SLACK_BOT_TOKEN`.
6. Under **Basic Information** > **App Credentials**, copy the **Signing Secret** and put it in `.env.local` as `SLACK_SIGNING_SECRET`.

<Admonition type="warning">
Treat the bot token like a password. Anyone who has it can act as your bot. Never commit it or paste it into screenshots, tickets or chat.
</Admonition>

The Slack adapter reads both values from the environment automatically: `SLACK_BOT_TOKEN` to post replies and upload files, `SLACK_SIGNING_SECRET` to verify that a POST really came from Slack.

Your `.env.local` now contains all eight values:

```bash filename=".env.local"
NEON_API_KEY=napi_your_neon_api_key
NEON_PROJECT_ID=your_project_id
UPSTASH_BOX_API_KEY=box_your_upstash_api_key
UPSTASH_BOX_SNAPSHOT_ID=snap_your_snapshot_id
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
API_KEY=your_generated_api_key
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your_slack_signing_secret
```

Invite the bot to a channel where you want to test it:

```text
/invite @Data analyst
```

## Redeploy with the Slack credentials

The deployed function still has the empty Slack values from the first deploy. Redeploy so the real bot token and signing secret are baked in. Deployed env is a snapshot at apply time, so this second deploy is what makes the bot able to reply:

```bash
neon deploy --env .env.local
```

That's the only change needed: the `invocation_url` stays the same, so the manifest you saved in the Slack app step keeps working.

## Ask a question end to end

Try the Slack path first. In a channel with the bot invited, send:

```text
@Data analyst Which region had the highest revenue last month, and how did it trend week over week?
```

The bot replies immediately with a status message. A minute or so later, the answer lands in the thread along with the chart the agent produced.

If the bot doesn't reply, check [function logs](/docs/compute/functions/logs) first: a failed signature check (the `SLACK_SIGNING_SECRET` must match **Basic Information** > **App Credentials**) or a session error shows up there. The adapter posts an error message to the thread when a session fails, so a silent thread usually means the event never arrived: the bot isn't in the channel, or the manifest's `request_url` doesn't point at your function URL with `/slack/events` appended. Also check for stale env: deployed env is a snapshot at apply time, so redeploy after editing `.env.local`.

Slack retries events when your endpoint doesn't return a `2xx` response. The adapter deduplicates retried deliveries automatically, but if you add side effects of your own, make them safe to run more than once.

Behind the scenes, a branch named like `agent/9f1c8e2-a3f9` appeared under **Branches** in the Neon Console and a box labeled `session:9f1c8e2-a3f9` showed up in the Upstash Console, then both disappeared when the session ended. You can watch this happen in both consoles while the agent works.

The same question works over HTTP. Send it with `curl`:

```bash filename="Terminal" shouldWrap
curl -X POST https://br-wispy-brook-a1b2c3d4-analyst.compute.c-2.us-east-2.aws.neon.tech/analyze \
  -H "Authorization: Bearer your_generated_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Which region had the highest revenue last month, and how did it trend week over week?"
  }'
```

The agent will inspect the schema, write a query, compute revenue as `units * unit_price`, group by region and week, and save a chart. A typical response looks like this:

```json
{
  "sessionId": "9f1c8e2-a3f9",
  "answer": "Asia Pacific had the highest revenue last month at $X, rising Y% week over week...",
  "report": "## Answer\nAsia Pacific led last month...\n\n## Method\nRevenue is units * unit_price, grouped by region and ISO week.\n\n## Caveats\nThe dataset covers 2000 rows over roughly 83 days.",
  "chart": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

The response is plain JSON: `answer` is the agent's final message, `report` is the Markdown file it wrote, and `chart` is the PNG it produced, base64-encoded so it survives JSON.

</Steps>

## How the agent reaches the sandbox

The integration point is small: `runSession` puts the box ID into the request context, and each tool reads it when the agent calls the tool. There is no MCP server and no built-in harness involved. The tools are ordinary Mastra tools whose `execute` functions call the Box SDK, so Mastra owns the reasoning loop and the policy layer while Box stays a plain execution environment. Slack is just another client of the same session: the adapter delivers the question, and the handler posts the answer and artifacts back.

## Keeping the sandbox safe

The agent writes and runs code, so it deserves a boundary. The branch being disposable is the reason to branch at all: the agent can run `UPDATE`, `CREATE TABLE AS`, or a heavy `EXPLAIN ANALYZE` without consequence, because the branch is a copy-on-write clone deleted when the session ends. The box adds isolation at the compute layer: each box is its own container with its own filesystem, process tree, and network stack, and `box.delete()` destroys it when you're done.

Harden two things before production. First, scope the database role: the connection string from `createAndConnect` has the privileges of the branch owner, so if the agent only reads, create a read-only Postgres role and build a connection string for it instead. Second, restrict egress with a [Box network policy](https://upstash.com/docs/box/overall/network-policy) if the agent only needs the database, so a prompt-injected instruction cannot exfiltrate data. Keep the `beforeToolCall` policy either way, and prefer removing `runShellTool` if the task does not need it.

## What it costs

Each session uses four billable resources:

- Claude tokens for the agent's reasoning and tool calls (`maxSteps` caps the number of model calls)
- The Upstash Box, billed per active CPU time (the snapshot restore and the agent's tool calls, not idle time)
- The branch on Neon (copy-on-write, so a session branch stores only the pages the agent changes)
- The Neon Function, which is free during beta

Tokens dominate the per-session cost; the packages are installed once in the snapshot, so the box adds little beyond its restore.

## Extending this guide

Because the session is a plain function and the agent is a normal Mastra agent, there are several directions to take it:

- **Follow-up questions in the thread.** The Chat SDK already tracks threads; subscribe to the thread in the mention handler with `thread.subscribe()` and handle `onSubscribedMessage` to route follow-ups through the same session (see [this pattern in action](/guides/ai-sdk-neon-data-assistant) with the Vercel AI SDK). Pass the conversation history to `agent.generate` and add a Postgres-backed [Mastra memory](https://mastra.ai/docs/memory/overview) store keyed by thread ID to persist history across restarts.
- **Persist artifacts.** The chart goes straight to Slack, but nothing keeps a copy. Upload `/workspace/out` to object storage, or store small files in an `analysis_artifacts` table in Neon.
- **Run sessions in parallel.** Each session owns a branch and a box, so several Slack threads can run at once without interfering. Watch the account-wide concurrency limit if you fan out heavily.
- **Make the box a reusable Mastra sandbox.** Mastra defines a [sandbox provider interface](https://mastra.ai/reference/editor/sandbox-provider), so you can implement one backend and get workspace tools and per-thread sandboxes for every agent, instead of writing tools per box operation.
- **Durability for long sessions.** If sessions regularly approach the `waitUntil` budget, move the run into a Mastra workflow and suspend while the box works, then resume from a callback.

If you're new to Mastra, [Build an AI agent with Mastra](/guides/mastra-neon) walks through the agent, tools, and Neon setup without the Slack and sandbox layers.

## Conclusion

You built a data-analysis agent that answers questions with real query results, right where your team asks them. Mastra owns the reasoning loop and the policy layer, the Chat SDK adapter handles the Slack plumbing, Upstash Box runs the agent's Python in an isolated sandbox, and every session gets its own disposable branch on Neon so production data is never at risk. The same session logic stays available over HTTP for scripts and other clients.

The same pattern extends beyond data analysis. Any agent that needs to run code against a database, whether for report generation, ETL experiments, or exploratory work, can follow this shape: branch the data, sandbox the compute, and tear both down when the session ends.

## Resources

- [Neon Functions overview](/docs/compute/functions/overview)
- [Neon Functions runtime limits](/docs/compute/functions/reference/runtime-limits)
- [Branching](/docs/introduction/branching)
- [Neon TypeScript SDK](/docs/reference/typescript-sdk)
- [neon.ts configuration reference](/docs/reference/neon-ts)
- [Mastra agents](https://mastra.ai/docs/agents/overview)
- [Mastra tools](https://mastra.ai/docs/agents/using-tools)
- [Mastra channels](https://mastra.ai/docs/channels)
- [Mastra request context](https://mastra.ai/docs/server/request-context)
- [Mastra agent generate reference](https://mastra.ai/reference/agents/generate)
- [Upstash Box documentation](https://upstash.com/docs/box)
- [Upstash Box shell and code execution](https://upstash.com/docs/box/overall/shell)
- [Upstash Box filesystem](https://upstash.com/docs/box/overall/files)
- [Upstash Box network policy](https://upstash.com/docs/box/overall/network-policy)
- [Chat SDK Slack adapter](https://chat-sdk.dev/adapters/official/slack)
- [Slack app manifests](https://docs.slack.dev/app-manifests/configuring-apps-with-app-manifests)

<NeedHelp/>
