---
title: 'The Postgres API for Agents'
subtitle: Join Replit Agent and Create.xyz and let your agent deploy Neon databases with no friction for the user.
enableTableOfContents: true
updatedOn: '2024-10-09T09:00:00.000Z'
image: '/images/social-previews/use-cases/ai-agents.jpg'
---

<Admonition type="note" title="TL;DR">
Replit Agent and Create.xyz have deeply integrated Neon into their agentic experience. The apps their agents build come with a Postgres database powered by Neon—without requiring the end-user to sign up with an external third party. If you're looking to build something similar, reach out to us.
</Admonition>

<Testimonial
text="The speed of provisioning and serverless scale-to-zero of Neon is critical for us. We can serve users iterating on quick ideas efficiently while also supporting them as they scale, without making them think about database setup."
author={{
  name: 'Dhruv Amin',
  company: 'Co-founder at Create.xyz',
}}
/>

---

AI agents can now provision infrastructure, including databases. With AI Agents already spinning up databases every few seconds, chances are they’re going to manage a big part of the web’s infrastructure in the future—and, just like developers, AI agents love working with Neon.

## Neon is ideally suited to AI Agents. Here’s why:

---

### One-second provision times.

If you’re a dev writing code, a five-minute deploy isn’t a big deal. But AI Agents generate the same code in seconds, waiting five minutes for a deployment is painful. This gets even more painful at scale.

[Neon](/) takes the world's most loved database (Postgres) and delivers it as a [serverless platform](/docs/introduction/serverless). This means that spinning up new Neon databases takes seconds vs minutes in other Postgres services.

### With scale to zero, empty databases are very, very cheap.

Imagine spinning up a new RDS instance every few seconds—you’d blow your budget on the first invoice. In most managed databases, managing thousands of isolated instances is unthinkable, and even more so without breaking the bank.

Neon’s serverless architecture solves this. In Neon, databases [automatically scale to zero](/docs/introduction/scale-to-zero) when idle and wake up instantly. You don’t pay for a database unless it’s being used or has data on it.

Some databases created by agents might only be used for a few minutes; if you’re the company behind the agent, you’ll quickly have a large database fleet full of inactive databases.

With Neon, that’s not a problem. You can still maintain this fleet within a reasonable budget.

### Straightforward API that even an AI Agent can use.

The same API endpoints that are useful for [developers managing large database fleets on Neon](/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) are also perfect for AI Agents.
Just like developers appreciate a simple, clear API, so do AI agents. If it’s easy enough for a junior dev, it’s great for AI. Neon checks that box.

With the Neon API, you can not only create and delete databases but also track usage, limit resources, and handle configuration.

### Neon is 100% Postgres

The most-loved database by developers worldwide is also the best choice for AI agents, thanks to its versatility (it works for almost any app) and the vast amount of resources, examples, and training datasets available.

Neon is simply Postgres. Everything an agent knows about Postgres is available in Neon, from extensions to full SQL syntax.

<SubscriptionForm title="If you’re building an AI agent, let’s talk!" description="We’re working closely with design partners to make Neon even better for agents, in exchange for discounts and other services. Let’s work together and make your AI project a success." />

## AI agents are now provisioning more databases on Neon than humans—many thousands per day. 

---

The scale is massive, and Neon is built to handle it. 

### Purpose-built interfaces for AI Agents.
Neon offers dedicated interfaces that make it easy for AI agents to deploy and manage databases:

**[Model Context Protocol (MCP) server](https://github.com/neondatabase-labs/mcp-server-neon):** Enables any MCP Client to interact with Neon's API using natural language. AI agents can use Neon's MCP server to automate tasks such as creating databases, running SQL queries, and managing database migrations. [Explore our MCP guides](https://neon.tech/blog?query=MCP). 

**[@neondatabase/toolkit](https://github.com/neondatabase/toolkit):** A lightweight client designed for AI agents that need to spin up Postgres databases in seconds and run SQL queries. It includes both the Neon TypeScript SDK and the Neon Serverless Driver. 

```jsx showLineNumbers
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

### Control resource consumption at scale. 
Managing thousands of databases requires predictable resource allocation. With Neon’s API, you can:

- Set limits on compute uptime, CPU usage, data writes, storage, and data transfer
- Define different quota tiers (e.g. for free, pro, and enterprise plans)

### Define compute configuration. 
AI agents need flexibility in how they allocate and scale database resources. Neon enables precise compute management:

- Configure autoscaling limits to control min/max CPU allocation
- Adjust scale to zero behavior

### Monitor the fleet. 
Tracking thousands of databases requires visibility: 
- Monitor total compute uptime, CPU seconds used, and data written/transferred
- Notify users before they hit hard limits

<CTA title="Next Steps" description="Meet with our team to explore possibilities for your own project." buttonText="Book time with us" buttonUrl="https://neon.tech/contact-sales" />
