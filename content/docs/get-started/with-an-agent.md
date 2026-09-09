---
title: Build a Next.js app with your AI agent
subtitle: Connect Neon to your agent, then build and grow your app from prompts
summary: >-
  Connect your AI coding assistant to Neon with one command, then send a single
  prompt that builds a public blog with seeded posts and a publish form.
  Includes the key files to expect, three service follow-up prompts, and a
  hands-on Neon branching demo.
enableTableOfContents: true
updatedOn: '2026-09-09T18:04:36.000Z'
---

Connect your AI coding agent to Neon once, send it one prompt, and you'll have a running Next.js app backed by Postgres. Your agent uses the [Neon MCP server](/docs/ai/neon-mcp-server) and [agent skills](/docs/ai/agent-skills) to create the table, run the SQL, and seed the data, so you watch it work instead of copy-pasting code.

<Steps>

## Connect your agent to Neon

Run these in your terminal to create your app and connect Neon (you'll sign in to Neon when prompted):

```bash filename="Terminal"
npx create-next-app@latest my-app --yes --app
cd my-app
npx neon@latest init
```

`neon init` links a Neon project to your app and installs your AI tooling. It asks you two things: which tooling to set up (a plugin, or agent skills and the Neon MCP server), and which project to link. Linking writes your `DATABASE_URL` to your env file.

When `neon init` asks "Manage this project's Neon setup as code?", choose **Yes**. At the service picker, select **no** optional services for now. This scaffolds a starter `neon.ts` that you'll add services to with the follow-up prompts.

Open your AI coding agent in the newly created `my-app` directory so it works on this project.

## Build your app with one prompt

In your AI agent's chat, paste:

```text shouldWrap filename="AI assistant prompt"
In this Next.js App Router project, build me a working public blog backed by Neon Postgres, using the Neon skills and MCP server you have. Use Drizzle with @neondatabase/serverless. Create a posts table (title, body, created_at), seed a few example posts, add a public page that lists them newest first, and add a simple create/publish form so you can add a post. Run it and show me the actual posts, not "done"; if anything fails show me the error instead of working around it.
```

## What you'll get

Your agent writes these key files and uses Neon's MCP tools to create the `posts` table and seed it. It may add others too, such as `drizzle.config.ts`. You review the result, not every step.

```typescript filename="lib/db/schema.ts"
import { bigint, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
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

```tsx filename="app/page.tsx"
import { desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db/client';
import { posts } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

async function createPost(formData: FormData) {
  'use server';

  const title = formData.get('title');
  const body = formData.get('body');

  if (typeof title !== 'string' || typeof body !== 'string') return;

  await db.insert(posts).values({ title, body });
  revalidatePath('/');
}

export default async function BlogPage() {
  const rows = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <main>
      <form action={createPost}>
        <input name="title" placeholder="Post title" required />
        <textarea name="body" placeholder="Write your post" required />
        <button type="submit">Publish</button>
      </form>

      {rows.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </main>
  );
}
```

## Run it

If it's not already running, start it with:

```bash filename="Terminal"
npm run dev
```

Open [localhost:3000](http://localhost:3000) and you'll see your seeded posts, newest first, with a form to publish another. You can also open the table in the [Neon Console](https://console.neon.tech).

</Steps>

## Keep building

These three prompts each add a backend service to the app you just built.

```text shouldWrap filename="Prompt: add sign-in"
Add Managed Better Auth so readers sign in to publish while the public feed stays visible to everyone. Gate posting, not reading. Attribute new posts to the signed-in author, and keep the seeded posts visible with a demo author or no author. Update neon.ts to declare Managed Better Auth, then run neon deploy to apply and provision it.
```

```text shouldWrap filename="Prompt: save posts as files"
Save each post as a Markdown file in Neon Object Storage and show a Download link on every post. Store the file in a private bucket, keep the object key on the post, and fetch it through a short-lived presigned URL. Update neon.ts to declare Object Storage, then run neon deploy to apply and provision it.
```

```text shouldWrap filename="Prompt: add AI summaries"
Generate a short summary or excerpt from each post body using Neon AI Gateway, store it in Postgres, and display it on the post. Update neon.ts to declare AI Gateway, then run neon deploy to apply and provision it. If the request is rejected because AI Gateway needs a paid Neon plan, tell me to upgrade rather than working around it.
```

## Try changes safely with branching

A Neon branch is an instant, isolated copy of your database, including its current data and schema. Use one to try a risky change, prove the result, and throw the branch away without touching production.

```text shouldWrap filename="Prompt: try a destructive change safely"
Create a Neon branch named my-feature and switch this project to it: run npx neon@latest branches create --name my-feature, then npx neon@latest checkout my-feature. Restart the dev server so it picks up the branch's updated DATABASE_URL. Then delete every post and show me the blog feed is now empty. Switch back to the default branch with npx neon@latest checkout main, restart the server, and show me that all the original posts are still there — proving the branch let me run a destructive change without touching production data. When you're done, delete the throwaway branch with npx neon@latest branches delete my-feature.
```

Want each code branch to get its own preview URL with a matching database branch? See [Neon's preview deployments guide](/docs/guides/neon-managed-vercel-integration).

<NeedHelp/>
