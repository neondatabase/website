---
title: The @neondatabase/toolkit
subtitle: A terse client for AI agents that can spin up Postgres in seconds and run SQL
  queries
enableTableOfContents: true
updatedOn: '2024-11-19T20:20:15.583Z'
---

<InfoBlock>

<DocsList title="What you will learn:">
<p>What is the @neondatabase/toolkit</p>
<p>How to get started</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/reference/typescript-sdk">TypeScript SDK for the Neon API</a>
  <a href="/docs/reference/api-reference">Neon API Reference</a>
  <a href="https://neon.tech/blog/why-neondatabase-toolkit">Why we built @neondatabase/toolkit</a>
</DocsList>

<DocsList title="Source code" theme="repo">
  <a href="https://github.com/neondatabase/toolkit">@neondatabase/toolkit</a>
  <a href="https://jsr.io/@neon/toolkit">@neon/toolkit (JSR)</a>
</DocsList>

</InfoBlock>

## About the toolkit

The [@neondatabase/toolkit](https://github.com/neondatabase/toolkit) ([@neon/toolkit](https://jsr.io/@neon/toolkit) on JSR) is a terse client that lets you spin up a Postgres database in seconds and run SQL queries. It includes both the [Neon TypeScript SDK](/docs/reference/typescript-sdk) and the [Neon Serverless Driver](https://github.com/neondatabase/serverless), making it an excellent choice for AI agents that need to quickly set up an SQL database or test environments where manually deploying a new database isn't practical.

<Admonition type="note">
This is an experimental feature and is subject to change.
</Admonition>

## Getting started

With a few lines of code, you can create a Postgres database on Neon, run SQL queries, and tear down the database when you're done. Here's a quick look:

```javascript
import { NeonToolkit } from "@neondatabase/toolkit";

const toolkit = new NeonToolkit(process.env.NEON_API_KEY!);
const project = await toolkit.createProject();

await toolkit.sql(
  project,
  `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `,
);

await toolkit.sql(
  project,
  `INSERT INTO users (id, name) VALUES (gen_random_uuid(), 'Sam Smith')`,
);

console.log(
  await toolkit.sql(
    project,
    `SELECT name FROM users`,
  ),
);

await toolkit.deleteProject(project);
```

To run this:

```bash
NEON_API_KEY=<YOUR_NEON_API_KEY> node index.js # bun also works
```

## Accessing the API Client

```javascript
import { NeonToolkit } from "@neondatabase/toolkit";

const toolkit = new NeonToolkit(process.env.NEON_API_KEY!);

const project = await toolkit.createProject();

const apiClient = toolkit.apiClient;

// Now, you have the underlying API client which lets you interact with Neon's API.
```

As with all of our experimental features, changes are ongoing. If you have any feedback, we'd love to hear it. Let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.
