---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2025-01-07T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
title: Building real-time comments with serverless Postgres
subtitle: Build real-time comments in a Next.js application with Ably LiveSync and Postgres.
---

A serverless Postgres database can back a real-time application when you pair it with a publish-subscribe service. In this guide, you'll combine Ably LiveSync with Lakebase Postgres on Neon to build a comment system with optimistic updates in a Next.js application.

## Prerequisites

To follow this guide, you’ll need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- An [Ably](https://ably.com) account
- A [Vercel](https://vercel.com) account

## Create the Next.js application

Clone the Next.js project with the following command:

```shell shouldWrap
git clone https://github.com/neondatabase-labs/ably-livesync-neon
```

Once that is done, move into the project directory and install the necessary dependencies with the following command:

```shell shouldWrap
cd ably-livesync-neon
npm install
```

The libraries installed include:

- `ws`: A WebSocket library for Node.js.
- `ably`: A real-time messaging and data synchronization library.
- `@neondatabase/serverless`: The Neon serverless driver for Postgres.
- `@prisma/client`: Prisma’s auto-generated client for interacting with your database.
- `@prisma/adapter-neon`: A Prisma adapter that connects through the Neon serverless driver.
- `@ably-labs/models`: A library for working with data models and real-time updates in Ably.

The development-specific libraries include:

- `tsx`: A fast TypeScript runtime for development and rebuilding.
- `prisma`: A toolkit for Prisma schema management, migrations, and generating clients.

Once that's done, copy the `.env.example` to `.env` via the following command:

```shell shouldWrap
cp .env.example .env
```

## Provision a Postgres database on Neon

Go to the [Neon Console](https://console.neon.tech/app/projects) and create a new project. Then click **Connect** on your project dashboard to open the **Connect to your branch** modal and copy the connection string for your database. It looks like this:

```bash shouldWrap
postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require
```

Replace `<user>`, `<password>`, `<endpoint_hostname>`, `<port>`, and `<dbname>` with your specific details.

Add this connection string to your `.env` file as `DATABASE_URL`.

## Set up Ably LiveSync with your database on Neon

Sign in to the [Ably Dashboard](https://ably.com/login) and click `+ Create new app`.

![](/guides/images/real-time-comments/create.png)

Next, name the application and select `Data Sync` as the type of application you are building.

![](/guides/images/real-time-comments/name.png)

Next, go to the **Integrations** tab and click `+ New integration rule`.

![](/guides/images/real-time-comments/rule.png)

Next, click the `Choose` button in the **Postgres (Alpha)** card.

![](/guides/images/real-time-comments/postgres.png)

Next, in the integration rule, enter your database connection string and proceed. The Ably integration listens for the `pg_notify` events sent by the outbox trigger (see the schema below), and Neon's connection pooler runs PgBouncer in transaction mode, which doesn't support `LISTEN`/`NOTIFY`. Use the direct connection string here: turn off the **Connection pooling** toggle in the **Connect to your branch** modal. See [Connection pooling](/docs/connect/connection-pooling).

![](/guides/images/real-time-comments/values.png)

Finally, go to the **API Keys** tab and copy the API key that has the capabilities `channel metadata, history, presence, privileged headers, publish, push admin, push subscribe, statistics, subscribe`.

![](/guides/images/real-time-comments/api_keys.png)

Add this API key to your `.env` file as `NEXT_PUBLIC_ABLY_API_KEY`.

## Set up the database schema

The `schema.tsx` file contains the following code:

```tsx
// File: schema.tsx

import 'dotenv/config';
import { WebSocket } from 'ws';
import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = WebSocket;
neonConfig.poolQueryViaFetch = true;

async function prepare() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL environment variable not found.');
  const sql = neon(process.env.DATABASE_URL);
  await Promise.all([
    sql`CREATE TABLE IF NOT EXISTS nodes (id TEXT PRIMARY KEY, expiry TIMESTAMP WITHOUT TIME ZONE NOT NULL);`,
    sql`CREATE TABLE IF NOT EXISTS outbox (sequence_id  serial PRIMARY KEY, mutation_id  TEXT NOT NULL, channel TEXT NOT NULL, name TEXT NOT NULL, rejected boolean NOT NULL DEFAULT false, data JSONB, headers JSONB, locked_by TEXT, lock_expiry TIMESTAMP WITHOUT TIME ZONE, processed BOOLEAN NOT NULL DEFAULT false);`,
  ]);
  await sql`CREATE OR REPLACE FUNCTION public.outbox_notify() RETURNS trigger AS $$ BEGIN PERFORM pg_notify('ably_adbc'::text, ''::text); RETURN NULL; EXCEPTION WHEN others THEN RAISE WARNING 'unexpected error in %s: %%', SQLERRM; RETURN NULL; END; $$ LANGUAGE plpgsql;`;
  await sql`CREATE OR REPLACE TRIGGER public_outbox_trigger AFTER INSERT ON public.outbox FOR EACH STATEMENT EXECUTE PROCEDURE public.outbox_notify();`;
  console.log('Database schema set up successfully.');
}

prepare();
```

The code above defines a function that connects to your Postgres database on Neon using the `DATABASE_URL` environment variable and sets up the necessary schema for the real-time application. It creates two tables, `nodes` and `outbox`, to store data and manage message processing, respectively. A trigger function, `outbox_notify`, sends a notification with `pg_notify` whenever a new row is inserted into the `outbox` table, which is how changes reach Ably.

To run the schema against your database on Neon, execute the following command:

```
npm run db
```

If it runs successfully, you should see `Database schema set up successfully.` in the terminal.

## Set up Prisma for your database on Neon

The `index.ts` file in the `lib/prisma` directory contains the following code:

```tsx
// File: lib/prisma/index.ts

import { neonConfig, Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { WebSocket } from 'ws';

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

neonConfig.webSocketConstructor = WebSocket;
neonConfig.poolQueryViaFetch = true;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
```

The code above sets up a Prisma client for your database on Neon. It configures the Neon database connection using the `@neondatabase/serverless` library, with WebSocket and `fetch` support to execute queries. A global `prisma` instance is created using the `PrismaNeon` adapter and reused in development to avoid multiple instances. Finally, the configured `prisma` client is exported for use throughout the application.

The `api.ts` file in the same directory contains the following code:

```tsx
// File: lib/prisma/api.ts

import prisma from '@/lib/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export type Author = {
  id: number;
  image: string;
  username: string;
};

export type Comment = {
  id: number;
  postId: number;
  author: Author;
  content: string;
  createdAt: Date;
  optimistic?: boolean;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
};

export async function getPosts(): Promise<Post[]> {
  return await prisma.post.findMany({
    include: {
      comments: {
        include: {
          author: true,
        },
      },
    },
  });
}

export async function getPost(id: number): Promise<[Post, number]> {
  return await prisma.$transaction(async (tx) => {
    const post = await getPostTx(tx, id);
    type r = { nextval: number };
    const [{ nextval }] = await tx.$queryRaw<
      r[]
    >`SELECT nextval('outbox_sequence_id_seq')::integer`;
    return [post, nextval];
  });
}

async function getPostTx(tx: TxClient, id: number) {
  return await tx.post.findUniqueOrThrow({
    where: { id },
    include: {
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

export async function getRandomUser() {
  const count = await prisma.user.count();
  return await prisma.user.findFirstOrThrow({
    skip: Math.floor(Math.random() * count),
  });
}

export type TxClient = Omit<PrismaClient, runtime.ITXClientDenyList>;

export async function addComment(
  tx: TxClient,
  mutationId: string,
  postId: number,
  authorId: number,
  content: string
): Promise<Prisma.outboxCreateInput> {
  const comment = await tx.comment.create({
    data: { postId, authorId, content },
    include: { author: true },
  });
  return {
    mutation_id: mutationId,
    channel: `post:${comment.postId}`,
    name: 'addComment',
    data: comment,
    headers: {},
  };
}

export async function editComment(
  tx: TxClient,
  mutationId: string,
  id: number,
  content: string
): Promise<Prisma.outboxCreateInput> {
  await tx.comment.findUniqueOrThrow({ where: { id } });
  const comment = await tx.comment.update({
    where: { id },
    data: { content },
    include: { author: true },
  });
  return {
    mutation_id: mutationId,
    channel: `post:${comment.postId}`,
    name: 'editComment',
    data: comment,
    headers: {},
  };
}

export async function deleteComment(
  tx: TxClient,
  mutationId: string,
  id: number
): Promise<Prisma.outboxCreateInput> {
  const comment = await tx.comment.delete({
    where: { id },
  });
  return {
    mutation_id: mutationId,
    channel: `post:${comment.postId}`,
    name: 'deleteComment',
    data: comment,
    headers: {},
  };
}

export async function withOutboxWrite(
  op: (tx: TxClient, ...args: any[]) => Promise<Prisma.outboxCreateInput>,
  ...args: any[]
) {
  return await prisma.$transaction(async (tx) => {
    const { mutation_id, channel, name, data, headers } = await op(tx, ...args);
    await tx.outbox.create({
      data: { mutation_id, channel, name, data, headers },
    });
  });
}
```

The code above interacts with the Postgres database using Prisma to manage comments. It implements operations like fetching, adding, editing, and deleting comments, and records each operation in the `outbox` table so the event-driven system can capture the change and send it to the other web clients. Here's what each function does:

- `withOutboxWrite()`: **This higher-order function wraps any operation that modifies the database (such as adding, editing, or deleting a comment) and ensures that the change is also written to the outbox table.** It first performs the operation, retrieves the necessary outbox details, and then writes the entry to the outbox table within the same transaction.

- `getPosts()`: Fetches all posts from the database, along with their associated comments and the authors of those comments. The function returns a list of posts, each containing its comments and authors.

- `getPost(id: number): Promise<[Post, number]>`: Fetches a single post by its ID, along with the associated comments and authors. It also executes a raw SQL query within a transaction to get the next value from a Postgres sequence (`outbox_sequence_id_seq`), returning this value alongside the post. The sequence number lets the event-driven system order events relative to the post it returned.

- `getPostTx(tx: TxClient, id: number)`: A helper function used by `getPost()` to retrieve a post within a transaction (`tx`). It fetches the post's comments in ascending order of their creation timestamp.

- `getRandomUser()`: Retrieves a random user from the database. The function first counts the total number of users and then selects one randomly based on the count.

- `TxClient`: This type represents a transaction client: the PrismaClient without certain methods that are restricted during transactions (`ITXClientDenyList`).

- `addComment()`: Adds a new comment to a post within a transaction. The function takes in several parameters, such as the transaction client (`tx`), mutation ID, post ID, author ID, and comment content. It returns an `outbox` entry that can be used in an event-driven system for tracking the mutation. The outbox entry includes details like the mutation ID, channel (based on the post), event name (`addComment`), and the newly created comment.

- `editComment()`: Edits an existing comment. It accepts the transaction client (`tx`), mutation ID, comment ID, and new content. After updating the comment, it returns an outbox entry similar to `addComment()`, but with the event name `editComment`.

- `deleteComment()`: Deletes a comment. It takes in the transaction client (`tx`), mutation ID, and the comment ID to be deleted. Like the other mutation functions, it returns an outbox entry, but with the event name `deleteComment`.

## Create a real-time data model client with Ably

The `modelsClient.ts` file in the `lib/models` directory contains the following code:

```tsx
// File: lib/models/modelsClient.ts

import ModelsClient from '@ably-labs/models';
import { Realtime } from 'ably';

let client: ModelsClient;

export const modelsClient = () => {
  const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
  if (!client) client = new ModelsClient({ ably });
  return client;
};
```

In the code above, a function `modelsClient` is defined which initializes and returns a singleton instance of the `ModelsClient` from the `@ably-labs/models` library, using an Ably Realtime connection. The client is only instantiated once, using the Ably API key stored in environment variables to create the Realtime connection.

The `mutations.ts` file in the same directory contains the following code:

```tsx
// File: lib/models/mutations.ts

import { ConfirmedEvent, OptimisticEvent } from '@ably-labs/models';
import cloneDeep from 'lodash/cloneDeep';
import type { Post as PostType } from '@/lib/prisma/api';
import type { Author as AuthorType } from '@/lib/prisma/api';
import { Comment } from '@/lib/prisma/api';

export async function addComment(
  mutationId: string,
  author: AuthorType,
  postId: number,
  content: string
) {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutationId, authorId: author.id, postId, content }),
  });
  if (!response.ok)
    throw new Error(
      `POST /api/comments: ${response.status} ${JSON.stringify(await response.json())}`
    );
  return response.json();
}

export async function editComment(mutationId: string, id: number, content: string) {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutationId, content }),
  });
  if (!response.ok)
    throw new Error(
      `PUT /api/comments/:id: ${response.status} ${JSON.stringify(await response.json())}`
    );
  return response.json();
}

export async function deleteComment(mutationId: string, id: number) {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
    headers: { 'x-mutation-id': mutationId },
  });
  if (!response.ok)
    throw new Error(
      `DELETE /api/comments/:id: ${response.status} ${JSON.stringify(await response.json())}`
    );
  return response.json();
}

export function merge(existingState: PostType, event: OptimisticEvent | ConfirmedEvent): PostType {
  // Optimistic and confirmed events use the same merge function logic.
  // The models function keeps track of the state before events are applied
  // to make sure the rollback of unconfirmed events works, we need to clone
  // the state here. Our state contains an array of objects so we don't use
  // the regular object spread operator.
  const state = cloneDeep(existingState);
  switch (event.name) {
    case 'addComment':
      const newComment = event.data! as Comment;
      state.comments.push(newComment);
      break;
    case 'editComment':
      const editComment = event.data! as Comment;
      const editIdx = state.comments.findIndex((c) => c.id === editComment.id);
      state.comments[editIdx] = editComment;
      break;
    case 'deleteComment':
      const { id } = event.data! as { id: number };
      const deleteIdx = state.comments.findIndex((c) => c.id === id);
      state.comments.splice(deleteIdx, 1);
      break;
    default:
      console.error('unknown event', event);
  }
  state.comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return state;
}
```

The code above defines three asynchronous functions that handle comment operations:

- **addComment**: Sends a POST request to add a new comment, including the author's details and content, identified by a `mutationId`.
- **editComment**: Sends a PUT request to update an existing comment's content by its `id`.
- **deleteComment**: Sends a DELETE request to remove a comment by its `id`.

Each function validates the server response and throws an error for unsuccessful requests. The `merge` function applies optimistic or confirmed events to the state, so it reflects comment additions, edits, and deletions.

The `hook.ts` file in the same directory contains the following code:

```tsx
// File: lib/models/hook.ts

'use client';

import { useEffect, useState } from 'react';
import { Model, SyncReturnType } from '@ably-labs/models';
import { modelsClient } from './modelsClient';
import { merge } from '@/lib/models/mutations';
import type { Post as PostType } from '@/lib/prisma/api';

export type ModelType = Model<(id: number) => SyncReturnType<PostType>>;

export async function getPost(id: number) {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok)
    throw new Error(
      `GET /api/posts/:id: ${response.status} ${JSON.stringify(await response.json())}`
    );
  const { sequenceId, data } = (await response.json()) as {
    sequenceId: string;
    data: PostType;
  };
  return { sequenceId, data };
}

export const useModel = (id: number | null): [PostType | undefined, ModelType | undefined] => {
  const [postData, setPostData] = useState<PostType>();
  const [model, setModel] = useState<ModelType>();

  useEffect(() => {
    if (!id) return;
    const model: ModelType = modelsClient().models.get({
      channelName: `post:${id}`,
      sync: async () => getPost(id),
      merge,
    });
    setModel(model);
  }, [id]);

  useEffect(() => {
    if (!id || !model) return;
    const getPost = async (id: number) => await model.sync(id);
    getPost(id);
  }, [id, model]);

  useEffect(() => {
    if (!model) return;
    const subscribe = (err: Error | null, data?: PostType | undefined) => {
      if (err) return console.error(err);
      setPostData(data);
    };
    model.subscribe(subscribe);

    return () => model.unsubscribe(subscribe);
  }, [model]);

  return [postData, model];
};
```

In the code above, the following function and hook are defined:

1. **getPost**: Fetches the initial post data and its sequence ID from an API endpoint.
2. **useModel**: Manages a model instance and its associated state. The hook returns the synchronized post data and model instance for use in components. It:
   - Initializes the model with a channel name, `sync` function (to fetch data), and merge logic.
   - Synchronizes the model with the latest data when the `id` changes.
   - Subscribes to real-time updates from the model, updating the component state accordingly.

## API routes for comments and real-time sync

The app runs server-side operations for user actions through API routes. In the Next.js App Router, you create one (a route handler) by adding a `route.ts` file to a directory in `app`.

The `route.ts` file in the `app/api/comments/[id]` directory handles editing and deleting comments:

```tsx
// File: app/api/comments/[id]/route.ts

export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server';
import { withOutboxWrite, editComment, deleteComment } from '@/lib/prisma/api';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    const comment: { mutationId: string; content: string } = await request.json();
    const data = await withOutboxWrite(editComment, comment.mutationId, id, comment.content);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('failed to update comment', error);
    return NextResponse.json({ message: 'failed to update comment', error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    const mutationId = request.headers.get('x-mutation-id') || 'missing';
    const data = await withOutboxWrite(deleteComment, mutationId, id);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('failed to delete comment', error);
    return NextResponse.json({ message: 'failed to delete comment', error }, { status: 500 });
  }
}
```

In the code above, there are two endpoints, `PUT` and `DELETE`, both of which parse the `id` param in the request. The `PUT` endpoint extracts the comment properties (`mutationId`, `content`) to edit the comment in Postgres and sync the change to the other web clients that are streaming comment changes in real time.

The `route.ts` file in the `app/api/comments` directory handles inserting comments:

```tsx
// File: app/api/comments/route.ts

export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server';
import { withOutboxWrite, addComment } from '@/lib/prisma/api';

export async function POST(request: NextRequest) {
  try {
    const comment: {
      mutationId: string;
      postId: number;
      authorId: number;
      content: string;
    } = await request.json();
    const data = await withOutboxWrite(
      addComment,
      comment.mutationId,
      comment.postId,
      comment.authorId,
      comment.content
    );
    return NextResponse.json({ data });
  } catch (error) {
    console.error('failed to add comment', error);
    return NextResponse.json({ message: 'failed to add comment', error }, { status: 500 });
  }
}
```

In the code above, the endpoint parses the request's body to extract the comment properties (`mutationID`, `postId`, `authorId`, `content`). It then inserts the comment into Postgres using the `withOutboxWrite` helper, which also writes the outbox entry so the other web clients streaming comments receive it in real time.

The `route.ts` file in the `app/api/posts/[id]` directory contains the following code:

```tsx
// File: app/api/posts/[id]/route.ts

export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/lib/prisma/api';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    const [data, sequenceId] = await getPost(id);
    return NextResponse.json({ sequenceId, data });
  } catch (error) {
    return NextResponse.json({ message: 'failed to get post', error }, { status: 500 });
  }
}
```

In the code above, the endpoint parses the `id` param in the request and returns the `sequenceId` and the post with its comments from Postgres.

## Deploy to Vercel

The repository is now ready to deploy to Vercel. Use the following steps to deploy:

- Start by creating a GitHub repository containing your app's code.
- Then, navigate to the Vercel Dashboard and create a **New Project**.
- Link the new project to the GitHub repository you've just created.
- In **Settings**, update the **Environment Variables** to match those in your local `.env` file.
- Deploy.

<DetailIconCards>

<a target="_blank" href="https://github.com/neondatabase-labs/ably-livesync-neon" description="A real-time comments application" icon="github">Real-time comments application</a>

</DetailIconCards>

## Summary

You built a real-time comment system in Next.js that writes comments to Postgres on Neon through Prisma, records each change in an outbox table, and uses Ably LiveSync to push changes to every connected client with optimistic updates. You then deployed it to Vercel.

<NeedHelp />
