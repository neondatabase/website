---
title: 'Realtime examples'
subtitle: 'Code examples and demo apps for building with Realtime.'
summary: >-
  Examples of building realtime, reactive apps and agents with Neon Realtime: walkthroughs for Next.js, TanStack, Mastra, Drizzle and Kysely, plus demo apps that combine Realtime with the rest of the Neon platform.
enableTableOfContents: true
---

The [code&nbsp;examples](#code-examples) teach you how to use Realtime with a specific framework or library. The [demo&nbsp;apps](#demo-apps) show what you can build with Realtime and the wider Neon platform.

## Code examples

Build full-stack, reactive apps with your framework, or drive live agent workflows from your database:

<DetailIconCards cols={3} theme="green-dotted">

<a href="/docs/realtime/examples/nextjs" description="Build a realtime, reactive app using Next.js with SSR support." icon="next-js">Next.js</a>

<a href="/docs/realtime/examples/tanstack" description="Build a realtime, reactive app using TanStack Start and DB." icon="tanstack">TanStack</a>

<a href="/docs/realtime/examples/mastra" description="Drive agent workflows directly from Lakebase Postgres." icon="mastra">Mastra</a>

</DetailIconCards>

Use Realtime with your existing ORM or query builder schema, queries and writes:

<DetailIconCards cols={3} theme="green-dotted">

<a href="/docs/realtime/examples/drizzle" description="Seal Drizzle queries and keep live rows typed." icon="drizzle">Drizzle</a>

<a href="/docs/realtime/examples/kysely" description="Seal Kysely queries and keep live rows typed." icon="kysely">Kysely</a>

</DetailIconCards>

## Demo apps

These apps use Realtime alongside other parts of the Neon platform, such as Auth, Functions, Object Storage and the AI Gateway. Try the live demos, or read the source on GitHub.

<DemoCards>

<DemoCard
  title="1 Million Boxes"
  description="The world's largest game of dots and boxes. Players join a team and draw lines to claim boxes, with every move synced to everyone playing."
  image="/docs/realtime/examples/one-million-boxes.png"
  stack="Postgres, Realtime, Vercel"
  demo="https://one-million-boxes.vercel.app"
  github="https://github.com/samwillis/one-million-boxes"
/>

<DemoCard
  title="Hacker News Realtime"
  description="A live Hacker News viewer. It ingests the Hacker News feed into Postgres, so you can watch scores, comment counts and rankings change as they happen."
  image="/docs/realtime/examples/hackernews-realtime.png"
  stack="Postgres, Realtime, Functions, Vercel"
  demo="https://hackernews-realtime.vercel.app"
  github="https://github.com/samwillis/hackernews-realtime"
/>

<DemoCard
  title="Neonbricks"
  description="A collaborative brick-building app. Share a workspace and build a model together, or ask the AI to build one for you. The model and the AI chat both live in Postgres."
  image="/docs/realtime/examples/neonbricks.png"
  stack="Postgres, Realtime, Functions, AI Gateway, Vercel"
  demo="https://neonbricks-app.vercel.app"
  github="https://github.com/samwillis/neonbricks"
/>

<DemoCard
  title="Carriage"
  description="A collaborative markdown editor built on Yjs. Edits are saved to Postgres and synced to everyone viewing the doc. Agents can read and edit docs through an MCP server, and show up as present alongside people."
  image="/docs/realtime/examples/carriage.png"
  stack="Postgres, Realtime, Auth, Functions, Vercel"
  demo="https://carriage-neon.vercel.app"
  github="https://github.com/samwillis/carriage"
/>

</DemoCards>

## Other examples

Other community maintained examples:

- [Livebase](https://github.com/thruflo/livebase) agentic CRM app using Realtime with Mastra
- [Realtime image jobs](https://github.com/msfstef/neon-realtime-image-jobs) upload an image and watch it move through AI processing

<NeedHelp/>
