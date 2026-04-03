---
title: 'Build a Data-Driven AI Assistant on Slack with Vercel AI SDK and Neon Read Replicas'
subtitle: 'Learn how to build a Slack bot that can safely query your production Postgres database using Neon Read Replicas and the Vercel AI SDK.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-03-31T00:00:00.000Z'
updatedOn: '2026-03-31T00:00:00.000Z'
---

In many organizations, critical business data lives in a production Postgres database. Product, sales, and marketing teams rely on this information, but direct access is usually restricted to developers and data engineers with SQL expertise. As a result, non-technical teams often face delays: they must request queries, while engineers spend valuable time answering routine data questions.

An AI assistant in Slack can streamline this process by providing instant answers to questions like _"Which regions drove the most sales this week?"_. However, connecting an AI agent directly to a production database introduces risks. Even read-only queries can be resource-intensive and impact performance, and there is always the possibility of unintended write operations.

This guide explains how to build a data driven AI Assistant that avoids these pitfalls. By combining the [**Vercel AI SDK**](https://ai-sdk.dev/), [**Chat SDK**](https://chat-sdk.dev/), and [**Neon Read Replicas**](/docs/introduction/read-replicas), the assistant queries a dedicated read-only replica. This architecture ensures real-time access to business data without slowing down production systems or risking accidental modifications.

## Architecture overview

To build this AI assistant on Slack you will create a Node.js application that integrates the following components:

- **Vercel AI SDK:** Enables the AI agent to generate SQL queries and interpret results. It also allows you to define custom tools that the AI can call, such as executing a query or generating a chart.
- **Neon Read Replicas:** Serve as the data source for the AI. By connecting to a read replica, you ensure that all AI-generated queries are strictly read-only and do not impact the performance of your primary database.
- **Chat SDK & Hono:** Handle incoming Slack events, manage conversation state, and orchestrate the flow of messages between Slack and the Vercel AI SDK.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version `20` or later installed on your machine.
- **Neon account:** A free account at [console.neon.tech](https://console.neon.tech) with a project and a populated table (e.g., `users` or `sales`).
- **Anthropic API Key:** For the AI agent to generate SQL and interpret results, you need an Anthropic API key. You can obtain one from [platform.claude.com](https://platform.claude.com/).
- **Slack Workspace:** Permissions to create and install a new Slack App.
- **ngrok** (or a similar tunneling tool): To test webhooks locally, you will need `ngrok` installed and configured on your machine. See the [ngrok Quickstart](https://ngrok.com/docs/getting-started/) to sign up, install the CLI, and authenticate with your auth token.

<Steps>

## Create a Neon Read Replica

Create a dedicated Neon read replica for your assistant. This keeps AI queries on a read-only compute.

1. Open [Neon Console](https://console.neon.tech) and select your project.
2. Navigate to the **Branches** tab and select the branch you want to connect to (e.g., `production`).
3. On your branch click **Add Read Replica**.
   ![Create a read replica](/docs/introduction/create_read_replica.png)
4. Choose the compute size and create the replica.
5. Wait for the status to become **Active**.
6. Click **Connect** on the read replica and copy the connection string.
7. Also, copy the connection string for your primary compute. The Chat SDK uses this to store state, but it won’t be used for AI queries.

Now you have two database URLs: one for the primary compute (with read-write access) and one for the read replica (with strict read-only access). You will use the replica URL in your application to ensure all AI queries are safely isolated.

## Start Ngrok

Slack needs a public HTTPS endpoint to deliver event webhooks to your local app. Set up `ngrok` so you can use its URL when creating your Slack App manifest.

1. Install and authenticate ngrok if you have not already.
2. Start a tunnel to your local server port:

   ```bash
   ngrok http 3000
   ```

3. Copy the **Forwarding** HTTPS URL (for example, `https://<your-ngrok-id>.ngrok.app`).
4. Keep this ngrok process running while you build and test the bot.

You will use this forwarding URL as the `request_url` in the Slack App manifest in the next step.

## Create and configure a Slack App

You will need to create a Slack App to interact with the Slack API and receive events when users mention the bot or post messages in channels.

1. Navigate to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App** > **From a manifest**.
   ![Create Slack App](/docs/guides/create_slack_app_from_manifest.png)
2. Select your target workspace and paste the following YAML manifest:

   ```yaml
   display_information:
     name: Neon Analytics Bot
     description: AI Assistant for running ad-hoc analytics queries against a Neon read replica.
   features:
     bot_user:
       display_name: Neon Analytics Bot
       always_online: true
   oauth_config:
     scopes:
       bot:
         - app_mentions:read
         - channels:history
         - channels:read
         - chat:write
         - groups:history
         - groups:read
         - im:history
         - im:read
         - mpim:history
         - mpim:read
         - reactions:read
         - reactions:write
         - users:read
         - files:write
     pkce_enabled: false
   settings:
     event_subscriptions:
       request_url: https://<your-ngrok-id>.ngrok.app/api/webhooks/slack
       bot_events:
         - app_mention
         - message.channels
         - message.groups
         - message.im
         - message.mpim
     interactivity:
       is_enabled: true
       request_url: https://<your-ngrok-id>.ngrok.app/api/webhooks/slack
     org_deploy_enabled: false
     socket_mode_enabled: false
     token_rotation_enabled: false
   ```

   This manifest defines how your bot can communicate in Slack. Some key configurations to note:
   - `oauth_config.scopes` sets the permissions your bot needs to read mentions and post replies.
   - `event_subscriptions.bot_events` tells Slack which events should trigger webhook calls.
   - `request_url` points Slack to your local webhook endpoint exposed through ngrok.
   - `interactivity.request_url` enables interactive payloads (buttons, actions, and some rich responses).

   > Replace `https://<your-ngrok-id>.ngrok.app` with your actual ngrok forwarding URL from [previous step](#start-ngrok).

3. Click **Next** and then **Create** to create your Slack App with the specified configuration.

   ![Slack App Manifest](/docs/guides/slack_app_manifest.png)

4. Navigate to **OAuth & Permissions** in the left sidebar, click **Install to Workspace** under **OAuth Tokens**, and copy the **Bot User OAuth Token** (it will start with `xoxb-`).
   ![Bot User OAuth Token](/docs/guides/slack_bot_token.png)
5. Navigate to **Basic Information** > **App Credentials** and copy your **Signing Secret**.

## Initialize a new Hono app

You will use Hono to create a lightweight web server that can receive Slack webhooks and route them to your bot logic. The Vercel AI SDK will handle the AI generation and tool-calling, while the Chat SDK will manage conversations and Slack interactions.

Create a new Hono project:

```sh
npm create hono@latest neon-slack-bot
```

When prompted by `create-hono`, select the `vercel` template and `npm` as the package manager.

Open the project in your code editor and install the libraries required for Slack integration, AI tool-calling, and Neon:

```bash
# Chat SDK and Slack Adapter for handling conversations and Slack events
npm install chat @chat-adapter/slack @chat-adapter/state-pg @vercel/functions

# Vercel AI SDK and Anthropic model for AI generation and tool-calling
npm install ai @ai-sdk/anthropic zod

# Neon Serverless Driver for connecting to your Neon read replica
npm install @neondatabase/serverless dotenv
```

Create a `.env` file in the root of your project to store your configuration securely:

```env
# Slack Credentials
SLACK_BOT_TOKEN="xoxb-your-bot-token"
SLACK_SIGNING_SECRET="your-signing-secret"

# Anthropic
ANTHROPIC_API_KEY="your-anthropic-key"

# Database Connections
# Used by Chat SDK to persist Slack thread conversation states (Primary DB)
CHAT_STATE_DATABASE_URL="postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"

# Used by the AI to safely run analytical queries (Read Replica)
REPLICA_DATABASE_URL="postgres://[user]:[password]@[neon_read_replica_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The two database URLs serve different purposes:

- `CHAT_STATE_DATABASE_URL` is used for bot state persistence (read/write).
- `REPLICA_DATABASE_URL` is used by AI-generated SQL (read-only).

Keeping them separate prevents analytics queries from touching your primary write path.

## Create the AI agent

You will define two tools that the AI can call:

1. `query_database`: Executes SQL queries against the Neon read replica and returns results as JSON.
2. `generate_chart`: Takes data and generates a chart image URL using the [QuickChart API](https://quickchart.io)

With these tools, the AI can autonomously run queries and generate visualizations based on user requests in Slack.

### Create the database query helper function

You need a simple utility that the Vercel AI SDK can call to execute its generated SQL against the read replica.

Create `lib/db.ts`:

```typescript
import { neon } from '@neondatabase/serverless';

export const runQueryOnReplica = async (sql: string) => {
    const sqlClient = neon(process.env.REPLICA_DATABASE_URL!);
    try {
        const result = await sqlClient.query(sql);
        return result;
    } catch (error: any) {
        // Return the error so the AI can attempt to self-correct its SQL query
        return { error: error.message };
    }
}
```

By routing all AI queries through this function via the `REPLICA_DATABASE_URL`, you enforce strict read-only access at the infrastructure level. Even if the AI attempts an `UPDATE` or `DELETE`, the database will outright reject it.

### Configure the Vercel AI SDK Tools

Next, you will set up the AI agent with the two tools: one for querying the database and another for generating charts. The agent will use these tools to fulfill user requests in Slack.

Create `lib/ai.ts`:

```typescript
import { tool, ToolLoopAgent } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { toAiMessages, Message } from "chat";
import { runQueryOnReplica } from "./db.js";

const SYSTEM_PROMPT = `
You are an expert data analyst assistant responding in a Slack channel.
Your goal is to help users analyze their database safely.
You have access to a tool that runs SQL queries against a read replica of the production database.
Always query the database when asked for data insights.
If the user asks for a chart or graph, use the generate_chart tool to create a visualization.
When returning a chart, return the image URL directly as the response, without any additional text.
When returning tabular data, format it as a clean Markdown table.
`;

const agent = new ToolLoopAgent({
    model: anthropic("claude-sonnet-4-5"),
    instructions: SYSTEM_PROMPT,
    tools: {
        query_database: tool({
            description: "Run a PostgreSQL query to analyze data. The connection is strictly read-only. Returns JSON rows.",
            inputSchema: z.object({
                sql: z.string().describe("The PostgreSQL query to execute.")
            }),
            execute: async ({ sql }) => {
                const results = await runQueryOnReplica(sql);
                return results;
            }
        }),
        generate_chart: tool({
            description: "Generate a chart image URL based on data.",
            inputSchema: z.object({
                chartConfig: z.any().describe("A valid Chart.js configuration object.")
            }),
            execute: async ({ chartConfig }) => {
                const configString = encodeURIComponent(JSON.stringify(chartConfig));
                const url = `https://quickchart.io/chart?c=${configString}`;
                return { url };
            }
        })
    }
});

export async function processSlackThread(messages: Message[]) {
    // Convert Chat SDK message format into the Vercel AI SDK format
    const aiMessages = await toAiMessages(messages);
    const result = await agent.generate({ messages: aiMessages });

    const image_url = result.text.startsWith("https://quickchart.io/chart") ? result.text : null;
    const text = image_url ? "Here is the chart you requested:" : result.text;

    return { text, image_url };
}
```

The above code sets up the AI agent with two tools and defines how to process a Slack thread of messages:

- `ToolLoopAgent` allows the model to call tools iteratively until it determines it has a final answer.
- `query_database` executes SQL against the read replica and returns results as JSON. If the query fails (for example, due to a syntax error), it returns the error message so the AI can attempt to self-correct.
- `generate_chart` takes a Chart.js configuration object and returns a QuickChart URL that renders the chart.
- `processSlackThread` converts the Slack conversation history into a format the AI can understand, runs the agent, and then determines if the response is a chart URL or text to return to Slack.

<Admonition type="tip" title="Provide rich schema context in the system prompt">
In this guide, the `SYSTEM_PROMPT` is intentionally basic so the example stays easy to follow. In production, include a concise schema context that explains what tables exist, key columns, relationships, and metric definitions. Without this context, the agent often spends extra turns discovering schema details (for example, listing tables) on new requests, which wastes tokens and increases latency. Better context up front leads to better SQL quality, faster responses, and more reliable analytics answers.

For example, extend your prompt with a schema section like this:

```typescript
const SCHEMA_CONTEXT = `
Tables:
- users(id, email, created_at, region)
- orders(id, user_id, total_amount, status, created_at)
- order_items(id, order_id, product_id, quantity, unit_price)

Relationships:
- orders.user_id -> users.id
- order_items.order_id -> orders.id

Business rules:
- total_amount is stored in USD
- status in ('pending', 'paid', 'refunded')
`;

const SYSTEM_PROMPT = `
You are an expert data analyst assistant responding in Slack.
Your goal is to help users analyze their database safely.
... other instructions ...

${SCHEMA_CONTEXT}
`;
```

With rich schema context, the AI can jump straight to generating correct SQL instead of using SQL tools to explore the schema first. This leads to faster, more accurate answers.

</Admonition>

### Create the Chat SDK bot

The Chat SDK is responsible for managing conversations and routing messages between Slack and the Vercel AI SDK. You will set up event handlers to trigger AI processing when the bot is mentioned or when new messages are posted in subscribed threads.

Create `lib/bot.ts`:

```typescript
import { Chat, Thread } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createPostgresState } from "@chat-adapter/state-pg";
import { processSlackThread } from "./ai.js";

// Initialize Chat SDK with Slack and Postgres state
export const bot = new Chat({
    userName: "Neon Analytics Bot",
    adapters: { slack: createSlackAdapter() },
    // Persists thread subscriptions using your primary DB (needs write access)
    state: createPostgresState({ url: process.env.CHAT_STATE_DATABASE_URL }),
    onLockConflict: 'force',
});

// Helper function to handle AI generation and Slack posting
async function generateAndPostReply(thread: Thread) {
    await thread.startTyping();
    // Retrieve all historical messages in the thread for context
    const messages = [];
    for await (const msg of thread.allMessages) {
        messages.push(msg);
    }

    // Process the conversation with Vercel AI SDK
    const { text, image_url } = await processSlackThread(messages);

    // Post the AI response back to Slack, handling text and images appropriately
    if (image_url) {
        const res = await fetch(image_url);
        const buffer = Buffer.from(await res.arrayBuffer());
        await thread.post({
            markdown: 'Here is the chart you requested:',
            files: [{ data: buffer, filename: "chart.png" }]
        });
    } else if (text) { await thread.post({ markdown: text }); }
}

// Fired when the bot is first @mentioned in a new thread
bot.onNewMention(async (thread) => {
    // Subscribe to the thread to receive future messages and maintain context
    await thread.subscribe();
    await generateAndPostReply(thread);
});

// Fired for all subsequent messages in a subscribed thread
bot.onSubscribedMessage(async (thread) => {
    await generateAndPostReply(thread);
});
```

The above code sets up the Chat SDK bot with a Slack adapter and Postgres state management. It defines two event handlers:

- `onNewMention`: Triggered when the bot is first mentioned in a thread. It subscribes to the thread and processes the initial message.
- `onSubscribedMessage`: Triggered for all subsequent messages in threads the bot is subscribed to. This allows the bot to maintain context and continue the conversation as users ask follow-up questions.

Learn more about the Chat SDK and various adapter and state options in the [Chat SDK documentation](https://chat-sdk.dev/docs/).

### Update the Hono server entrypoint

To expose your bot to Slack, you need a web server. You will use Hono to handle incoming HTTP POST requests from Slack and route them directly into the Chat SDK.

Update `src/index.ts`:

```typescript
import { Hono } from 'hono';
import { waitUntil } from "@vercel/functions";
import { bot } from '../lib/bot.js';
import 'dotenv/config';

const app = new Hono();

app.get('/', (c) => c.text('Neon Analytics Bot is running!'));

app.post('/api/webhooks/slack', async (c) => {
  return bot.webhooks.slack(c.req.raw, { waitUntil });
});

export default app;
```

This code sets up a Hono server with two routes:

- `GET /` gives a simple health response for quick checks.
- `POST /api/webhooks/slack` forwards raw Slack requests to your Chat SDK bot handler.
- The `waitUntil` function from Vercel allows you to perform asynchronous work (like AI processing) without blocking the HTTP response, which is important for handling Slack's request timeout requirements.

## Test the full workflow end-to-end

You can now test your bot locally. With your ngrok tunnel running and your Hono server set up, you will be able to interact with your bot in Slack and see it generate SQL queries, return results, and create charts based on your database.

1. **Start the local server:**

   ```bash
   vercel dev
   ```

   If prompted, configure the Vercel CLI to setup your project. This will start the Hono server locally.

2. **Talk to your bot:**
   - Go to your Slack workspace and invite your bot to a channel by typing `/invite @Neon Analytics Bot`.
   - Ask it a question: For example, _"@Neon Analytics Bot Which states had the highest sales last month?"_
   - You should see the bot respond with a cleanly formatted Markdown table of results.
   - Follow up in the thread with: _"@Neon Analytics Bot Can you generate a bar chart visualizing it?"_
   - The bot will reply with a generated chart image based on the query results.

     ![Example slack bot interaction](/docs/guides/slack_bot_interaction_example.png)

Congratulations! You have successfully built an AI-powered Slack assistant that can safely run analytical queries against your production data using Neon Read Replicas and the Vercel AI SDK.

## Deploying to production

Once your bot performs as expected in the development environment, you can deploy it to production. Follow the deployment instructions on [Hono Docs](https://hono.dev/docs/getting-started/vercel) to deploy your Hono app.

After deployment, update the Event Subscription `request_url` in your Slack app's manifest to point to your production webhook endpoint (e.g., `https://yourdomain.com/api/webhooks/slack`).

</Steps>

## Extending this workflow

Once your assistant is working, you can evolve it from an on-demand Q&A bot into a lightweight analytics platform inside Slack.

This guide intentionally uses basic tools to demonstrate the core workflow end-to-end. For example, QuickChart is used as a simple charting option, but in production you can replace it with more advanced visualization frameworks or libraries that better match your product requirements. Treat this tutorial as a foundation, then tailor the architecture, tools, and guardrails to your team's specific needs. For example, you could add:

- **Scheduled executive digests:** Post daily or weekly KPI summaries to a channel (for example: revenue, conversion rate, top regions, and week-over-week deltas). Pair each summary with a chart for quick scanning. See [Vercel Chat SDK scheduled posts](https://chat-sdk.dev/docs/guides/scheduled-posts-neon) for implementation ideas.
- **Artifact generation tools:** Add tools that return CSV links, shareable PDF summaries with charts, or even Google Sheets exports. This allows users to take AI-generated insights and easily share them or perform further analysis.
- **Role-aware analytics guardrails:** Apply per-channel or per-role policies that restrict which tables/columns can be queried and which metrics can be shown. This helps enforce least-privilege access while keeping self-serve analytics fast.

As your data model grows, keep the schema context in your system prompt updated. Better context leads to better SQL, lower token usage, and more reliable analytical answers.

## Resources

- [Neon Read Replicas](/docs/introduction/read-replicas)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Chat SDK Documentation](https://chat-sdk.dev/)
- [Neon Serverless Driver](/docs/serverless/serverless-driver)

<NeedHelp />
