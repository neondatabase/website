---
title: Neon Database Toolkit for AI Agents
subtitle: Rapidly provision, manage, and interact with Neon Postgres databases in your AI agent workflows
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-01-29T00:00:00.000Z'
updatedOn: '2025-01-29T00:00:00.000Z'
---

The AI landscape is poised for its next "ChatGPT moment" - not with smarter chatbots, but with **autonomous AI agents** that complete real-world tasks. These next-gen assistants go beyond answering questions to independently booking flights, analyzing data trends, and even managing cloud infrastructure.

## The AI Agent revolution

- **Task automation**: Agents now execute multi-step workflows using natural language instructions
- **Environmental awareness**: They interact with apps/APIs like digital employees
- **Persistent memory**: Maintain context across sessions like human colleagues

## The Database challenge

For these agents to thrive, they need infrastructure that matches their dynamic nature. This is where tools like Neon's database toolkit come in. The `@neondatabase/toolkit` simplifies data management for AI agents, providing them with an efficient way to create, manage, and interact with Postgres databases.

As agents evolve from simple helpers to full digital coworkers, their success hinges on infrastructure that's as agile as their programming. Tools like Neon's toolkit aren't just supporting this revolution - they're building the foundation for AI's next evolutionary leap.

This architectural shift isn't just about cost - it enables fundamentally new agent capabilities. When every database interaction becomes as lightweight as an API call, agents can experiment freely, chain operations without hesitation, and manage infrastructure as intuitively as humans manage browser tabs.
There is one thing that is certain: The agent revolution won't be built on legacy infrastructure. Tools like Neon aren't just keeping pace with AI - they're redefining what's possible by making database operations as fluid as the agents themselves.

## Neon: The Perfect Database for AI Agents

Neon's serverless Postgres databases are built to be the ideal partner for AI agents. They offer a powerful, scalable, and cost-effective way to manage data. Here are some key benefits of using Neon databases for AI agents:

| Capability           | Agent Benefit                                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Databases in seconds | Neon lets you create fully working Postgres databases almost instantly. No more waiting around – your agent can start working with data right away.                          |
| Scales easily        | Neon's serverless design automatically adjusts to your agent's needs, whether it's a quiet period or a busy time. You only pay for what you actually use, which saves money. |
| Full Postgres power  | Your agents get all the reliability and features of Postgres, a database trusted by developers everywhere.                                                                   |
| Micro Workloads      | Neon's cost-effective design is perfect for agents that only need a database for specific tasks. You don't have to pay for database resources when they aren't being used.   |
| Cost-optimized       | Ideal for AI agents with varying workloads, which is great for agents that have quiet periods or only need a database for specific tasks.                                    |

The `@neondatabase/toolkit` takes all the best things about Neon and puts them into an easy-to-use software development kit (SDK), designed to make database interaction super easy for AI agents.

The toolkit can simplify the process of creating a Neon project and running SQL queries. This can also be especially helpful in test environments, where you don't want to manually set up a Neon project each time.

## Getting Started with `@neondatabase/toolkit`

<Admonition type="note">
The `@neondatabase/toolkit` is in the early stages of development, so some features might change in the future.
</Admonition>

### Installation:

Add the toolkit to your project:

<CodeTabs labels={["npm", "yarn", "pnpm", "Deno"]}>

```bash
npm install @neondatabase/toolkit
```

```bash
yarn add @neondatabase/toolkit
```

```bash
pnpm add @neondatabase/toolkit
```

```bash
deno add jsr:@neon/toolkit
```

</CodeTabs>

### Usage

Let's see how quickly you can get an AI agent up and running with a Neon database using the toolkit. Imagine your agent needs a database to keep track of user information. The AI agent itself will provide the instructions (SQL) to set up the database structure. Here’s how it works with `@neondatabase/toolkit`:

```typescript
import { NeonToolkit } from '@neondatabase/toolkit';

// Start the toolkit with your Neon API Key
const toolkit = new NeonToolkit(process.env.NEON_API_KEY!);

async function runAgentWorkflow() {
  // Create a Neon Project (Database) - Ready instantly!
  const project = await toolkit.createProject();
  console.log(`Project created: ${project.id}`);

  // AI Agent Provides SQL to Create a Table
  const agentCreateTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      signup_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Run the AI Agent's SQL to create the 'users' table
  await toolkit.sql(project, agentCreateTableQuery);
  console.log("Table 'users' created using the AI agent's SQL.");

  // AI Agent Provides SQL to Add Data
  const agentInsertUserQuery = `
    INSERT INTO users (id, username, email)
    VALUES (gen_random_uuid(), 'agentUser1', 'agent.user1@example.com'),
           (gen_random_uuid(), 'agentUser2', 'agent.user2@example.com');
  `;

  // Run the AI Agent's SQL to add user data
  await toolkit.sql(project, agentInsertUserQuery);
  console.log("User data added using the AI agent's SQL.");

  // Perform more SQL operations as needed...

  // Delete the Project (Database) - Clean up when the agent is finished
  await toolkit.deleteProject(project);
  console.log(`Project ${project.id} deleted.`);
}

runAgentWorkflow().catch(console.error);
```

**Key takeaways from this example**

- **Quick setup:** Just a few lines of code to get a fully working database ready for your agent.
- **Clear and simple:** The code is easy to understand, showing how the toolkit focuses on making things simple for developers and agents.
- **Automatic cleanup:** The `deleteProject` function makes sure resources are freed up when the agent is done.

## Conclusion

`@neondatabase/toolkit` takes away the complexity of databases, letting you concentrate on building smarter and more powerful AI agents. It’s the fastest way to connect your agents to data, helping them learn, think, and perform using the power of serverless Postgres.

For more advanced uses, remember that the toolkit gives you access to the complete [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) through `toolkit.apiClient`. This allows for more detailed customization and integration.

## Resources

- [@neondatabase/toolkit on npm](https://www.npmjs.com/package/@neondatabase/toolkit)
- [@neon/toolkit on JSR](https://jsr.io/@neon/toolkit)
- [Neon Documentation](/docs/introduction)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API keys](/docs/manage/api-keys#creating-api-keys)

<NeedHelp/>
