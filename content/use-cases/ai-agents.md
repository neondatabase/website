---
title: 'Postgres for AI Agents'
subtitle: Neon databases are fast to provision, easy to manage, and they scale to zero — perfect for AI agents.
enableTableOfContents: true
updatedOn: '2024-10-09T09:00:00.000Z'
image: '/images/social-previews/use-cases/ai-agents.jpg'
---

<Admonition type="note" title="TL;DR">
Replit partnered with Neon to back Replit Agents, which are already creating thousands of Postgres databases. If you’re building an AI agent that interacts with infrastructure, [we’d love to connect](/agent-design-partner) — we’re looking for design partners in this space.
</Admonition>

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

<p className="text-sm tracking-extra-tight text-center text-gray-new-50 mt-3.5">We recently published a package on NPM called <a href="https://github.com/neondatabase/toolkit" target="_blank" rel="noopener noreferrer">@neondatabase/toolkit</a>, merging the already existing packages into a single SDK that is easier for AI agents to consume. <a href="/blog/why-neondatabase-toolkit">Read more</a>.</p>

### Neon is 100% Postgres

The most-loved database by developers worldwide is also the best choice for AI agents, thanks to its versatility (it works for almost any app) and the vast amount of resources, examples, and training datasets available.

Neon is simply Postgres. Everything an agent knows about Postgres is available in Neon, from extensions to full SQL syntax.

<CTA title="Next Steps" description="Sign up here to get the Free Plan plus $100 credit.<br/> Or <a href='/contact-sales'>talk to our team</a> if you have any questions." buttonText="Get the Free Plan + $100 Credit" buttonUrl="https://fyi.neon.tech/credits" />
