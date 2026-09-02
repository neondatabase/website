---
title: Get started with your AI agent
subtitle: Prompt your AI coding agent to build a Next.js app on Neon
summary: >-
  Connect your AI coding assistant to Neon with one command, then send a single
  prompt that creates a table, seeds sample rows, and adds a page that lists
  them. Includes the schema and page to expect, and follow-up prompts for
  sign-in, image uploads, AI summaries, and branching.
enableTableOfContents: true
updatedOn: '2026-09-02T20:53:13.819Z'
---

Connect your AI coding agent to Neon once, send it one prompt, and you'll have a running Next.js app backed by Postgres.

<Steps>

## Connect your agent to Neon

Run this once. It installs the [Neon MCP server](/docs/ai/neon-mcp-server) and [agent skills](/docs/ai/agent-skills) for your editor, links a Neon project, and writes your `DATABASE_URL` into your env file:

```bash
npx neon@latest init
```

Pick how your agent gets Neon (a plugin, or skills and MCP) and which project to use. In an empty folder, `neon init` scaffolds a starter app first. That's it. Your agent now has everything it needs.

<Admonition type="note">
Automating this with no one at the keyboard (CI, an autonomous agent)? `neon init` is interactive, so use the [non-interactive setup sequence](/docs/cli/init#run-it-non-interactively) instead.
</Admonition>

## Build your app with one prompt

Paste this into your editor's AI chat:

```text shouldWrap filename="AI assistant prompt"
Build me a working notes app backed by Neon Postgres, using the Neon skills and MCP server you have. Use Drizzle with @neondatabase/serverless. Create a notes table (title, body, created_at), seed 5 example rows, and add a /notes page, a Server Component, that lists them newest first. Then run it and show me the actual rows, not "done". If anything fails, show me the error instead of working around it.
```

## What you'll get

Your agent writes the schema, a Drizzle client, and the page:

```typescript filename="lib/db/schema.ts"
import { bigint, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

```typescript filename="lib/db/client.ts"
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

```tsx filename="app/notes/page.tsx"
import { desc } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { notes } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const rows = await db.select().from(notes).orderBy(desc(notes.createdAt));

  return (
    <ul>
      {rows.map((note) => (
        <li key={note.id}>
          <strong>{note.title}</strong>
          <p>{note.body}</p>
        </li>
      ))}
    </ul>
  );
}
```

## Run it

```bash
npm run dev
```

Open [localhost:3000/notes](http://localhost:3000/notes) and you'll see your seeded notes, newest first. You can also open the table in the [Neon Console](https://console.neon.tech).

</Steps>

## Keep building

Each prompt below adds one capability to the app you just built. Send them one at a time. Object Storage and the AI Gateway are in beta and run in select regions, so if a prompt reports one isn't available, create your project in a supported region such as `aws-us-east-2`.

```text shouldWrap filename="Prompt: add sign-in"
Add Managed Better Auth so each note belongs to a signed-in user: add a user_id to notes, scope every query to the current user, and add sign-in and sign-out. Follow https://neon.com/docs/auth/authentication-flow.md, since this API is in beta.
```

```text shouldWrap filename="Prompt: add image uploads"
Let each note carry an image using Neon Object Storage. Store the object key on the row, never the bytes, add an upload control, and render each image. Follow https://neon.com/docs/storage/get-started.md.
```

```text shouldWrap filename="Prompt: add AI summaries"
Add a one-line AI summary to each note using the Neon AI Gateway, stored in a summary column. Pick a current model from the catalog. Follow https://neon.com/docs/ai-gateway/models.md.
```

```text shouldWrap filename="Prompt: work on a branch"
Create a Neon branch so I can try changes in isolation, then switch to it: npx neon@latest branches create --name my-feature, then npx neon@latest checkout my-feature.
```

<NeedHelp/>
