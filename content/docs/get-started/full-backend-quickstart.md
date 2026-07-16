---
title: Build a full backend with Next.js and Neon
subtitle: Postgres, Object Storage, and a Neon Function for AI, declared in one neon.ts
summary: >-
  End-to-end Next.js App Router tutorial that wires Neon Postgres, Drizzle ORM,
  Object Storage, and a Neon Function into a working backend, all declared in one
  neon.ts and provisioned with neon deploy. The function runs a streaming,
  tool-calling AI assistant on compute next to your database. Choose this page
  when building a Next.js project that needs a type-safe Postgres data layer plus
  serverless storage and long-running AI, without stitching together separate
  providers.
enableTableOfContents: true
layout: wide
---

## Before you start

You'll need [Node.js 20.19+](https://nodejs.org/) and the [Neon CLI](/docs/cli/install) installed:

```bash
npm i -g neon
```

<Admonition type="important" title="Create your project in AWS US East (Ohio)">
Object Storage, Functions, and the AI Gateway are in beta and available only in **AWS US East (Ohio) (`aws-us-east-2`)**, on new or existing projects in that region, so use a project there to follow this guide. Postgres works in any region. The three beta services are free to use during beta, subject to usage limits. The AI Gateway requires a paid plan; Object Storage and Functions work on any plan.
</Admonition>

<TwoColumnLayout>

<TwoColumnLayout.Step title="Create a Neon project">
<TwoColumnLayout.Block>

If you don't have a Neon account, sign up at [console.neon.tech](https://console.neon.tech/signup).

Create your project in **AWS US East (Ohio)**. Any path below works; the rest of this guide uses the Neon CLI, which you'll also use in step 3 to link the project and pull its credentials automatically.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Sign in and create the project:

```bash filename="Terminal"
neon auth
neon projects create --name my-backend --region-id aws-us-east-2
```

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project:

```bash filename="Terminal"
export NEON_API_KEY=neon_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-backend", "region_id": "aws-us-east-2"}}'
```

</TabItem>

<TabItem>

In the Neon Console, click **New Project**, name it `my-backend`, and select the **AWS US East (Ohio)** region.

</TabItem>

</Tabs>

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Scaffold a Next.js app">
<TwoColumnLayout.Block>

Create a new Next.js project with TypeScript, Tailwind CSS, and the App Router. The `--yes` flag accepts the remaining defaults without prompting.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npx create-next-app@latest my-backend --typescript --tailwind --app --eslint --yes
cd my-backend
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Declare your backend in neon.ts">
<TwoColumnLayout.Block>

A single [`neon.ts`](/docs/reference/neon-ts) file declares your backend as code. You enable a capability there, run [`neon deploy`](/docs/cli/deploy), and Neon provisions it and writes its credentials into `.env.local`. You'll grow this file as you add capabilities.

Work through the commands on the right:

1. `neon link` and `neon checkout` pull the branch's `DATABASE_URL` into `.env.local`. If you created the project through the API or Console, run `neon auth` first to sign in the CLI.
2. `neon config init` scaffolds `neon.ts` and installs `@neon/config`. The generated file includes a branch policy; leave it in place and add the `preview` block shown in later steps alongside it. The `neon.ts` snippets below omit the branch policy for brevity.

Postgres is already available on the branch, so `DATABASE_URL` is in `.env.local` and you can build the data layer before adding any beta services.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
neon link            # select the my-backend project
neon checkout main   # pull DATABASE_URL into .env.local
neon config init     # scaffold neon.ts, install @neon/config
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Install dependencies">
<TwoColumnLayout.Block>

Install `drizzle-orm` for typed queries and `@neondatabase/serverless` for the HTTP driver (works in Node, edge, and serverless runtimes). Add `drizzle-kit` as a dev dependency for the schema migration.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Define your schema">
<TwoColumnLayout.Block>

Create a TypeScript schema for a `posts` table. This example uses Drizzle for schema management, but you can use any ORM or migration tool. Drizzle uses this schema for both the migration and your type-safe queries. Each post has an `author` so you can tell them apart; this app is single-user, so the author defaults to `anonymous`.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="lib/db/schema.ts"
import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: bigint('id', { mode: 'number' })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  author: text('author').notNull().default('anonymous'),
  content: text('content').notNull(),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

```typescript filename="drizzle.config.ts"
import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';

loadEnvConfig(process.cwd());

export default defineConfig({
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

`drizzle-kit` is a standalone CLI and doesn't read `.env.local` automatically. `loadEnvConfig` matches Next.js's env loading behavior so the migration step picks up the same `DATABASE_URL` as the app.

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Push the schema and seed sample data">
<TwoColumnLayout.Block>

This example uses Drizzle's CLI to apply the schema, but you can use your ORM or migration tool's equivalent command. `drizzle-kit push` creates the table directly from your schema. In production, you'd typically use `drizzle-kit generate` and `drizzle-kit migrate` for tracked migrations, but push is faster for a tutorial.

Then seed three sample posts in the [Neon Console SQL Editor](https://console.neon.tech): two published and one draft, so the `where(eq(posts.isPublished, true))` filter on the posts page has something visible to do.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npx drizzle-kit push
```

Open your project in the Neon Console, go to **SQL Editor**, and run:

```sql
INSERT INTO posts (author, content, is_published) VALUES
  ('Dana Smith', 'Postgres branching lets you copy your whole database in seconds.', true),
  ('Alex Lopez', 'Serverless compute scales to zero when idle, so you only pay for what you use.', true),
  ('anonymous', 'This draft is hidden. Flip is_published to true in the SQL editor to see it appear.', false);
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="List posts in a Server Component">
<TwoColumnLayout.Block>

Create the Drizzle client and a `/posts` page. The page is a Server Component, so the Drizzle query runs on the server at request time. `dynamic = 'force-dynamic'` keeps the data fresh on every request.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="lib/db/client.ts"
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

```tsx filename="app/posts/page.tsx"
import { db } from '@/lib/db/client';
import { posts } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.createdAt))
    .limit(10);

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Published posts</h1>
      <ul className="space-y-2">
        {allPosts.map((post) => (
          <li key={post.id} className="rounded border p-3">
            <p>{post.content}</p>
            <p className="mt-1 text-xs text-gray-500">by {post.author}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Add Object Storage and upload images">
<TwoColumnLayout.Block>

Add an `images` bucket to your `neon.ts` and run `neon deploy`. Neon provisions the bucket and injects the S3-compatible credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`) into `.env.local`.

Then add a client upload page that submits the file to a Server Action. The [Files SDK](https://files-sdk.dev) `neon` adapter reads the injected `AWS_*` variables and configures the endpoint for you, so there's no client setup.

The action returns the object's public URL. In a real app you'd store that URL on a row, for example an `image_url` column on `posts`, so a record can reference its file. This step keeps the upload standalone to focus on the storage flow.

<Admonition type="note">
`neon deploy` merges credentials into `.env.local` without discarding your own entries.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    buckets: {
      images: { access: 'public_read' },
    },
  },
});
```

```bash filename="Terminal"
neon deploy
npm install files-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @aws-sdk/s3-presigned-post
```

```typescript filename="app/upload/actions.ts"
'use server';

import { Files } from 'files-sdk';
import { neon } from 'files-sdk/neon';

const files = new Files({ adapter: neon({ bucket: 'images' }) });

export async function uploadImage(
  _prev: { error?: string; publicUrl?: string } | null,
  formData: FormData,
) {
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'No file selected' };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const key = `${Date.now()}-${file.name}`;

  await files.upload(key, bytes, { contentType: file.type });

  // The images bucket is public_read, so the object is served directly.
  const publicUrl = `${process.env.AWS_ENDPOINT_URL_S3}/images/${key}`;
  return { publicUrl };
}
```

```tsx filename="app/upload/page.tsx"
'use client';

import { useActionState } from 'react';
import { uploadImage } from './actions';

export default function UploadPage() {
  const [state, formAction, isPending] = useActionState(uploadImage, null);

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Upload an image</h1>
      <form action={formAction} className="mb-4">
        <input name="file" type="file" accept="image/*" required />
        <button
          type="submit"
          disabled={isPending}
          className="mt-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.publicUrl && (
        <p className="text-sm text-gray-500 break-all">Uploaded: {state.publicUrl}</p>
      )}
    </main>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Write the Neon Function">
<TwoColumnLayout.Block>

Now add the piece that makes this a full backend: a [Neon Function](/docs/compute/functions/overview) that runs AI on long-lived compute next to your database. It's a normal [Hono](https://hono.dev) app with two routes:

- `POST /generate` writes a post from a topic with the [AI Gateway](/docs/ai-gateway/overview).
- `POST /assistant` streams a tool-calling assistant that answers questions about your posts. The tool loop queries Postgres and runs in-process, so it isn't cut off by a serverless request limit.

Install the function's dependencies, then create `functions/posts.ts`.

<Admonition type="note" title="Connect with a pooled `pg` client">
A function keeps running across requests, so open a `pg` `Pool` once at module scope and reuse it. Don't use `@neondatabase/serverless` inside a function; it's built for short-lived, per-request invocations. See [Connecting to Postgres](/docs/compute/functions/get-started#connect-to-postgres).
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npm install hono pg ai @neon/ai-sdk-provider zod
npm install -D @types/pg
```

```typescript filename="functions/posts.ts"
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Pool } from 'pg';
import { neon } from '@neon/ai-sdk-provider';
import { streamText, generateText, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';

// Reused across requests. Use a pooled pg client, not the serverless driver.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

const app = new Hono();

// The assistant is called from the browser, so allow cross-origin requests.
app.use('/*', cors());

// One-shot generation: create a post from a topic and save it.
app.post('/generate', async (c) => {
  const { topic, author = 'anonymous' } = await c.req.json();

  const { text } = await generateText({
    model: neon('claude-sonnet-4-6'),
    prompt: `Write a 2 sentence post about the following topic. Just send the post content without any additional text: ${topic}`,
  });

  const { rows } = await pool.query(
    'insert into posts (author, content, is_published) values ($1, $2, true) returning *',
    [author, text],
  );

  return c.json(rows[0]);
});

// Streaming assistant: answers questions about the posts, using a tool that
// queries Postgres. The tool loop runs in-process on Neon compute.
app.post('/assistant', async (c) => {
  const { messages } = await c.req.json();

  const result = streamText({
    model: neon('claude-sonnet-4-6'),
    system:
      "You are a helpful assistant that answers questions about the user's blog posts. Use the queryPosts tool to look them up.",
    messages: await convertToModelMessages(messages),
    tools: {
      queryPosts: tool({
        description: 'Fetch the most recent published posts from the database.',
        inputSchema: z.object({
          limit: z.number().default(10).describe('How many posts to fetch.'),
        }),
        execute: async ({ limit }) => {
          const { rows } = await pool.query(
            'select author, content, created_at from posts where is_published = true order by created_at desc limit $1',
            [limit],
          );
          return rows;
        },
      }),
    },
    stopWhen: stepCountIs(5),
    // Disable telemetry: the function runtime's tracing conflicts with the
    // AI SDK's streaming spans.
    experimental_telemetry: { isEnabled: false },
  });

  return result.toUIMessageStreamResponse();
});

export default app;
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Deploy the function">
<TwoColumnLayout.Block>

Declare the function and the AI Gateway in `neon.ts`, then `neon deploy`. Neon builds the function, gives it a public URL, and injects the AI Gateway credentials (`NEON_AI_GATEWAY_TOKEN`, `NEON_AI_GATEWAY_BASE_URL`) so the `@neon/ai-sdk-provider` inside the function needs no configuration.

Retrieve the function's URL and add it to `.env.local` as `NEXT_PUBLIC_POSTS_FN_URL` (the `NEXT_PUBLIC_` prefix exposes it to the browser, which calls the assistant directly).

A Neon Function has its own URL, so the browser calls it directly. That keeps a long stream off your host's serverless timeout.

<Admonition type="note" title="First call after a deploy">
The first AI Gateway call on a new branch can return a `403` while the credential propagates. It clears within a few seconds, so retry.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    aiGateway: true,
    buckets: {
      images: { access: 'public_read' },
    },
    functions: {
      posts: { name: 'posts assistant', source: './functions/posts.ts' },
    },
  },
});
```

```bash filename="Terminal"
neon deploy

# print the function's details, then copy its invocation_url
neon functions get posts
```

```bash filename=".env.local"
NEXT_PUBLIC_POSTS_FN_URL=https://<branch_id>-posts.compute.<cell>.us-east-2.aws.neon.tech/
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Call the function from your app">
<TwoColumnLayout.Block>

Wire two pages to the function:

- `/generate` calls `POST /generate` from a Server Action (server-to-server, so no CORS). Good for a short, one-shot generation.
- `/assistant` streams from `POST /assistant` directly in the browser with the AI SDK's `useChat` hook. Calling the function directly keeps the stream off any serverless host that would time it out.

```bash filename="Terminal"
npm install @ai-sdk/react
```

<Admonition type="note" title="Authenticate the function in production">
The function has a public URL and no auth check, which is fine for this tutorial. Before shipping, gate it with an API key or a JWT. See [Neon Functions authentication](/docs/compute/functions/authentication).
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="app/generate/actions.ts"
'use server';

export async function generatePost(
  _prev: { error?: string; content?: string } | null,
  formData: FormData,
) {
  const topic = formData.get('topic') as string;

  const res = await fetch(`${process.env.NEXT_PUBLIC_POSTS_FN_URL}generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, author: 'anonymous' }),
  });

  if (!res.ok) return { error: 'Generation failed' };
  const post = await res.json();
  return { content: post.content as string };
}
```

```tsx filename="app/generate/page.tsx"
'use client';

import { useActionState } from 'react';
import { generatePost } from './actions';

export default function GeneratePage() {
  const [state, formAction, isPending] = useActionState(generatePost, null);

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Generate a post</h1>
      <form action={formAction} className="mb-4 flex gap-2">
        <input name="topic" placeholder="Topic" required className="rounded border px-2 py-1" />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white"
        >
          {isPending ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.content && <p className="rounded border p-3">{state.content}</p>}
    </main>
  );
}
```

```tsx filename="app/assistant/page.tsx"
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function AssistantPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_POSTS_FN_URL}assistant`,
    }),
  });

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Ask about your posts</h1>
      <div className="mb-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="rounded border p-3">
            <span className="font-medium">{m.role}: </span>
            {m.parts.map((p, i) => (p.type === 'text' ? <span key={i}>{p.text}</span> : null))}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your posts"
          className="flex-1 rounded border px-2 py-1"
        />
        <button
          type="submit"
          disabled={status !== 'ready'}
          className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white"
        >
          Send
        </button>
      </form>
    </main>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Run the app">
<TwoColumnLayout.Block>

Start the dev server, then open the URL it prints. Try each page:

- `/posts` lists the seeded posts.
- `/generate` generates a post and saves it.
- `/assistant` chats about your posts, streaming from the function.
- `/upload` uploads an image to your bucket.

To iterate on the function locally, run [`neon dev`](/docs/cli/dev), which serves it with the same injected Neon variables it gets in production.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npm run dev
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

</TwoColumnLayout>

## What you built

You now have a Next.js app where:

- Published posts are queried server-side via Drizzle with full TypeScript types
- Images upload to a Neon Storage bucket through a Server Action and the Files SDK
- A Neon Function generates posts and runs a streaming, tool-calling AI assistant on compute next to your database
- The whole backend is declared in one `neon.ts` and provisioned with `neon deploy`, which injects every credential into `.env.local`
- The Next.js app deploys to any App Router host that supports server actions, including Vercel, Netlify, and self-hosted Node, while the long-running AI lives on the Neon Function

## Next steps

- **Make it multi-user with Managed Better Auth:** add [`auth: true`](/docs/reference/neon-ts) to `neon.ts` for [Managed Better Auth](/docs/auth/overview), gate the pages with a session, and verify the caller's JWT inside the function ([Neon Functions authentication](/docs/compute/functions/authentication)). See the [Auth quickstart](/docs/auth/quick-start/nextjs-api-only).
- **Go deeper on Functions:** hold open [WebSockets and SSE](/docs/compute/functions/websockets) or build a fuller [AI agent](/docs/compute/functions/agents) on the same function.
- **Branch your whole backend:** [`neon checkout`](/docs/cli/checkout) forks the database, buckets, and function together for preview environments. See [Branching](/docs/introduction/branching).
- **Generated migrations:** for tracked schema changes, switch from a direct push to generated migrations. If you're using Drizzle, that means moving from `drizzle-kit push` to [`drizzle-kit generate`](https://orm.drizzle.team/docs/migrations); other ORMs and migration tools offer an equivalent.

<NeedHelp/>
