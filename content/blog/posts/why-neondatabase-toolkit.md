---
title: Why we built @neondatabase/toolkit
description: Because AI Agents need especially terse APIs.
excerpt: >-
  We recently published a package on NPM called @neondatabase/toolkit
  (@neon/toolkit on JSR). The idea behind it was to merge the already existing
  @neondatabase/api-client and @neondatabase/serverless packages into a single
  SDK that is easier for AI agents to consume. AI agents do...
date: '2024-09-27T15:49:18'
updatedOn: '2024-09-27T15:53:58'
category: product
categories:
  - product
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-neondatabase-toolkit/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Why we built @neondatabase/toolkit - Neon
  description: Because AI Agents need especially terse APIs.
  keywords: []
  noindex: false
  ogTitle: Why we built @neondatabase/toolkit - Neon
  ogDescription: >-
    We recently published a package on NPM called @neondatabase/toolkit
    (@neon/toolkit on JSR). The idea behind it was to merge the already existing
    @neondatabase/api-client and @neondatabase/serverless packages into a single
    SDK that is easier for AI agents to consume. AI agents do better when their
    search space is less wide. For example: If these agents had […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-neondatabase-toolkit/social.jpg
---

We recently published a package on NPM called [`@neondatabase/toolkit`](https://github.com/neondatabase/toolkit) ([`@neon/toolkit`](https://jsr.io/@neon/toolkit) on JSR). The idea behind it was to merge the already existing `@neondatabase/api-client` and `@neondatabase/serverless` packages into a single SDK that is easier for AI agents to consume.

### AI agents do better when their search space is less wide.

For example:

- Vercel’s [v0](https://v0.dev/) AI product for UI generation works very well _because_ it is limited to [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com/) and [ShadCN/UI](https://ui.shadcn.com/) (as the “component library”).
- [Replit Agents](https://docs.replit.com/replitai/agent) only currently support [Postgres via Neon](https://neon.tech/blog/building-a-news-app-with-replit-agent-a-step-by-step-guide) which is also important for their efficacy in generating good apps.

If these agents had to support a bunch of different frontend frameworks, or various storage providers, they wouldn’t work as well. This might become less relevant in the future as the models get better, but just like specialized software engineers can generally outperform generic engineers when operating with their comfort stack, the same might be true for all AI agents going forward.

Neon already has [unique features perfect for AI agents](https://x.com/nikitabase/status/1837138637516931252), but we realized that a simple JavaScript script to launch and connect to a Postgres instance required two dependencies:

```typescript
import { createApiClient } from "@neondatabase/api-client"; // [!code ++]
import { neon } from "@neondatabase/serverless"; // [!code ++]

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

const {
  data: { connection_uris },
} = await apiClient.createProject({
  project: {},
});

await neon(
  connection_uris[0].connection_uri
) `CREATE TABLE users (id uuid, name text)`;
```

So, with `@neondatabase/toolkit`, we’ve narrowed down the API to make it easier for AI agents to consume it:

```typescript
import { NeonToolkit } from "@neondatabase/toolkit"; // [!code ++]

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

Since you can access the underlying `toolkit.apiClient`, you can already perform any action from the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). However, we’ll be streamlining more features through the higher-level API such as [branching](https://neon.tech/docs/introduction/branching) and [autoscaling](https://neon.tech/docs/introduction/autoscaling) configuration. Furthermore, we’ll soon expose an easier way for consumers to dictate whether they wish to connect via HTTP, WebSockets or good old TCP. (The default will continue to be HTTP.)

### Building Agents? Try it. Join us.

<Admonition type="note" title="Call for Design Partners">
We are iterating quickly on Neon for Agents and we need feedback. If you're building an Agent that interacts with DB's, [let us know here.](https://neon.tech/agent-design-partner)
</Admonition>

Please file [an issue](https://github.com/neondatabase/toolkit/issues) in the repository, or reach out to us via [Discord](https://discord.gg/92vNTzKDGp) to give us any feedback. We’re especially interested in enabling AI agents with this package, but we know that other use cases will emerge as well, and that’s fine!
