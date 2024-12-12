---
title: Neon for AI Agents
subtitle: Use Neon as the Postgres backend for your agents
enableTableOfContents: true
updatedOn: '2024-09-08T12:44:00.894Z'
---

AI agents can now provision infrastructure, including databases. With AI Agents already spinning up databases every few seconds, chances are they’re going to manage a big part of the web’s infrastructure in the future—and, just like developers, AI agents love working with Neon: **Replit partnered with Neon to back Replit Agents, which are already creating thousands of Postgres databases per day**.  

## What makes Neon a good database for AI Agents

- **One-second provision times**. AI Agents generate code in seconds, so it's a bad user experience to wait minutes for a new Postgres instance to be deployed. Neon provisions databases nearly instantaneously, eliminating this friction. 

- **Scale to zero makes empty databases economically feasible**. Some databases created by agents might only be used for a few minutes; if you’re the company behind the agent, you’ll quickly have a large database fleet full of inactive databases. With Neon, that’s not a problem—you can still maintain this fleet within a reasonable budget.

- **Straightforward API that even an AI Agent can use**. The same API endpoints that are useful for [developers managing large database fleets on Neon](/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) are also perfect for AI Agents. With the Neon API, you can not only create and delete databases but also track usage, limit resources, and handle configuration.

- **Neon is 100% Postgres**. The most-loved database by developers worldwide is also the best choice for AI agents, thanks to its versatility (it works for almost any app) and the vast amount of resources, examples, and training datasets available.

```javascript
import { NeonToolkit } from "@neondatabase/toolkit";

const toolkit = new NeonToolkit(process.env.NEON_API_KEY!);
const project = await toolkit.createProject();

await toolkit.sql(
  project,
  `
    CREATE TABLE IF NOT EXISTS
      users (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL
      );
  `,
);
await toolkit.sql(
  project,
  `INSERT INTO users (id, name) VALUES (gen_random_uuid(), 'Sam Smith')`,
);

console.log(await toolkit.sql(project, `SELECT name FROM users`));

await toolkit.deleteProject(project);

```

<p className="text-sm tracking-extra-tight text-center text-gray-new-50 mt-3.5">We recently published a package on NPM called <a href="https://github.com/neondatabase/toolkit" target="_blank" rel="noopener noreferrer">@neondatabase/toolkit</a>, merging the already existing packages into a single SDK that is easier for AI agents to consume. <a href="/blog/why-neondatabase-toolkit">Read more</a>. Neon also supports a [Model Context Protocol (MCP) server](https://github.com/neondatabase/mcp-server-neon).</p>
