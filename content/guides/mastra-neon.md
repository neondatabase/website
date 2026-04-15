---
title: 'Building stateful AI Agents with Mastra and Neon Postgres'
subtitle: 'Learn how to give your Mastra AI agents long-term memory by integrating them with Neon Postgres for scalable, persistent storage.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-03-30T00:00:00.000Z'
updatedOn: '2026-03-30T00:00:00.000Z'
---

AI agents are increasingly used to create conversational assistants, customer support bots, and productivity tools. A common limitation, however, is their lack of memory. Most agents are stateless, meaning each interaction begins without awareness of past conversations or user preferences. Without the ability to recall prior exchanges, agents struggle to manage multi-turn dialogues or maintain continuity across sessions.

[Mastra](https://mastra.ai/) is an unopinionated TypeScript framework for building full‑stack AI applications. To address the challenge of statelessness, it includes a native Memory module. By default, Mastra uses local file‑based storage (such as libSQL) to support rapid prototyping. For production environments, however, applications require a storage backend that is scalable, durable, and cloud‑native.

This guide explains how to integrate Mastra’s Memory component with Neon Postgres. By connecting Mastra to Neon, you can easily build robust AI assistants that remember user interactions across threads and sessions.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version `18` or later installed on your machine.
- **Neon account:** A free Neon project. If you don't have one, sign up at [Neon](https://console.neon.tech/signup).
- **OpenRouter API key**: An API key from [OpenRouter](https://openrouter.ai/) (or any another provider supported by [Mastra](https://mastra.ai/models) such as OpenAI, Anthropic, etc.) to power your AI agent.

<Steps>

## Create a Neon project

You need a Neon Postgres database to store your agent's memory. Mastra will automatically create the necessary tables for you on its first interaction.

1. Log in to the [Neon Console](https://console.neon.tech) and select your project.
2. Navigate to the **Dashboard** and click on the **Connect** button to view your connection details.
3. Copy the Postgres connection string (it should look like `postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/postgres?sslmode=require&channel_binding=require`).

![Connection details in Neon Console](/docs/connect/connection_details.png)

## Initialize a new Mastra project

Open your terminal and create a new directory for your agent project. Initialize a standard Node.js project and install Mastra's core packages alongside the PostgreSQL adapter and Memory module.

```bash
mkdir mastra-neon-agent && cd mastra-neon-agent
npm init -y

npm install -D typescript @types/node mastra@latest
npm install @mastra/core@latest zod@^4 @mastra/memory@latest @mastra/pg@latest

npx tsc --init
```

Update your `tsconfig.json` to ensure TypeScript resolves modules correctly for Mastra:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

Update your `package.json` to add `dev` and `build` scripts:

```json
{
  "scripts": {
    "dev": "mastra dev", // [!code ++]
    "build": "mastra build" // [!code ++]
  }
}
```

## Set your environment variables

Create a `.env` file in the root of your project to hold your API keys and Neon connection string.

```bash
touch .env
```

Add the following values, replacing the placeholders with your actual credentials:

```bash
DATABASE_URL="postgresql://<user>:<password>@<endpoint>.neon.tech/<dbname>?sslmode=require"
OPENROUTER_API_KEY="your-openrouter-api-key"
```

## Configure Mastra to use Neon Postgres for storage

Mastra uses a central configuration file to tie your agents, workflows, and storage together. By default, agents share **instance-level storage**.

Create a new directory structure `src/mastra` and add an `index.ts` file:

```bash
mkdir -p src/mastra
touch src/mastra/index.ts
```

Add the following code to `src/mastra/index.ts` to configure Mastra to use Neon as the storage backend:

```typescript
import { Mastra } from '@mastra/core';
import { PostgresStore } from '@mastra/pg';

export const mastra = new Mastra({
  storage: new PostgresStore({
    id: 'neon-storage',
    connectionString: process.env.DATABASE_URL!,
  }),
});
```

## Create a stateful agent

Create a simple agent that uses Mastra's Memory module to remember user interactions. This agent will store its memory in Neon, allowing it to recall past conversations.

1. Create a folder for your agents:

   ```bash
   mkdir src/mastra/agents
   ```

2. Create a new file `src/mastra/agents/memory-agent.ts` and add the following code:

   ```typescript
   import { Agent } from '@mastra/core/agent';
   import { Memory } from '@mastra/memory';

   export const memoryAgent = new Agent({
     id: 'memory-agent',
     name: 'Memory Agent',
     instructions: 'You are a helpful assistant. You remember details the user shares with you.',
     model: 'openrouter/anthropic/claude-haiku-4.5',
     memory: new Memory({
       options: {
         lastMessages: 10, // Injects the last 10 messages into the context window
       },
     }),
   });
   ```

   The above code defines a simple agent that uses the Memory module to retain the last 10 messages of conversation. The agent is powered by the `claude-haiku-4.5` model from OpenRouter.

3. Update your Mastra configuration in `src/mastra/index.ts` to include the new agent:

   ```typescript
   import { Mastra } from '@mastra/core';
   import { PostgresStore } from '@mastra/pg';
   import { memoryAgent } from './agents/memory-agent'; // [!code ++]

   export const mastra = new Mastra({
       storage: new PostgresStore({
           id: 'neon-storage',
           connectionString: process.env.DATABASE_URL!,
       }),
       agents: { memoryAgent } // [!code ++]
   });
   ```

## Test the agent's memory

You can now test your agent to see how it retains memory across interactions. In this example, we will simulate a conversation where the user shares their favorite color, and the agent remembers it in a subsequent turn. The Memory module uses a combination of `resource` and `thread` identifiers to manage context:

- **`resource`**: The entity that owns the thread (e.g., a `user_id`).
- **`thread`**: A specific conversation session.

Create a `src/test.ts` file in your project root:

```typescript
import { mastra } from './mastra/index';

async function main() {
    const agent = mastra.getAgentById('memory-agent');

    const memoryContext = {
        resource: 'user-123',
        thread: 'conversation-1',
    };

    const response1 = await agent.generate(
        'Hello, my favorite color is Blue.',
        { memory: memoryContext }
    );
    console.log('Agent:', response1.text);

    const response2 = await agent.generate(
        'What is my favorite color?',
        { memory: memoryContext }
    );
    console.log('Agent:', response2.text);

    const randomQuestionResponse1 = await agent.generate(
        'What is the capital of France?',
        { memory: memoryContext }
    );
    console.log('\n--- Random Question ---');
    console.log('Agent:', randomQuestionResponse1.text);

    const randomQuestionResponse2 = await agent.generate(
        'What is the speed of light in vacuum?',
        { memory: memoryContext }
    );
    console.log('\n--- Another Random Question ---');
    console.log('Agent:', randomQuestionResponse2.text);

    const summaryResponse = await agent.generate(
        'Can you summarize our conversation so far?',
        { memory: memoryContext }
    );
    console.log('\n--- Conversation Summary ---');
    console.log('Agent:', summaryResponse.text);
}

main().then(() => {
    console.log('Test completed successfully.');
}).catch((error) => {
    console.error('Error during test execution:', error);
});
```

Execute the script using `tsx` (which automatically loads your `.env` and executes TypeScript):

```bash
npx tsx --env-file=.env src/test.ts
```

You should see output similar to the following:

```text shouldWrap
Agent: Hello! Nice to meet you! I've noted that your favorite color is **Blue**. I'll remember this detail about you for our future conversations.

Is there anything I can help you with today?

Agent: Your favorite color is **Blue**!

I remembered that from when you told me at the start of our conversation.

--- Random Question ---
Agent: The capital of France is **Paris**.

Is there anything else you'd like to know?

--- Another Random Question ---
Agent: The speed of light in vacuum is approximately **299,792,458 meters per second**, or about **300,000 km/s**.

It's often rounded to **3 × 10⁸ m/s** in scientific calculations and is denoted by the letter "c" in physics equations.

--- Conversation Summary ---
Agent: Of course! Here's a summary of our conversation so far:

1. **Your favorite color**: You told me that Blue is your favorite color, which I've remembered.

2. **Question about your favorite color**: You asked me to recall your favorite color, and I correctly answered that it's Blue.

3. **Capital of France**: You asked what the capital of France is, and I answered Paris.

4. **Speed of light**: You asked about the speed of light in vacuum, and I explained that it's approximately 299,792,458 meters per second (or about 300,000 km/s), often denoted as "c" in physics.

5. **This summary**: You've now asked me to summarize our conversation, which I'm doing right now!

Is there anything else you'd like to discuss?
```

You can see that the agent successfully recalls the user's favorite color and can answer questions based on that memory. Additionally, it can provide a summary of the conversation, demonstrating its ability to retain and utilize context across multiple interactions.

If you log into the [Neon Console](https://console.neon.tech) and inspect your database tables, you will now see tables like `mastra_messages` and `mastra_threads` populated with these interactions.

![Mastra Memory tables in Neon Console](/docs/guides/mastra-tables-neon.png)

</Steps>

## Conclusion

You’ve successfully built a stateful AI agent using Mastra and Neon Postgres. Your agent can now retain context across sessions, supporting more natural and consistent interactions over time.

To go further, you can explore Mastra’s advanced memory features:

- [Observational Memory](https://mastra.ai/docs/memory/observational-memory): enables long‑context, continuously evolving agent memory.
- [Semantic Recall](https://mastra.ai/docs/memory/semantic-recall): retrieves relevant past interactions using vector similarity.
- [Custom Templates](https://mastra.ai/docs/memory/working-memory#custom-templates): define what information to store or discard for finer control.

Together, these tools allow you to design agents with richer memory management, tailored to the needs of your application.

## Resources

- [Neon Documentation](/docs)
- [Mastra Docs](https://mastra.ai/docs)
- [Mastra Memory](https://mastra.ai/docs/memory/overview)

<NeedHelp />
