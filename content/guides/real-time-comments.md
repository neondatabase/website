---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-01-07T00:00:00.000Z'
updatedOn: '2024-01-07T00:00:00.000Z'
title: Building Real-Time Comments with a Serverless Postgres
subtitle: A step-by-step guide to building your own real-time comments in a Next.js application with Ably LiveSync and Postgres
---

Can a serverless Postgres database really handle the demands of a real-time application? The answer lies in pairing it with the right publish-subscribe model. In this guide, you will learn how to combine the real-time capabilities of Ably LiveSync with the structured power of Neon Postgres to build a optimistic and scalable comment system in your Next.js application.

## Prerequisites

To follow this guide, you’ll need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- An [Ably](https://ably.com) account
- A [Vercel](https://vercel.com) account

## Create the Next.js application

Let’s get started by cloning the Next.js project with the following command:

```shell shouldWrap
git clone https://github.com/neondatabase-labs/ably-livesync-neon
```

Once that is done, move into the project directory and install the necessary dependencies with the following command:

```shell shouldWrap
cd ably-livesync-neon
npm install
```

The libraries installed include:

- `@ably-labs/models`: A library for working with data models and real-time updates in Ably.
- `@neondatabase/serverless`: A serverless Postgres client designed for Neon.
- `@prisma/adapter-neon`: A Prisma adapter for connecting with Neon serverless Postgres.
- `@prisma/client`: Prisma’s auto-generated client for interacting with your database.
- `ably`: A real-time messaging and data synchronization library.
- `ws`: A WebSocket library for Node.js.

The development-specific libraries include:

- `prisma`: A toolkit for Prisma schema management, migrations, and generating clients.
- `tsx`: A fast TypeScript runtime for development and rebuilding.

Once that's done, copy the `.env.example` to `.env` via the following command:

```shell shouldWrap
cp .env.example .env
```

## Provision a Serverless Postgres

To set up a serverless Postgres, go to the [Neon console](https://console.neon.tech/app/projects) and create a new project. Once your project is created, you will receive a connection string that you can use to connect to your Neon database. The connection string will look like this:

```bash shouldWrap
postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
```

Replace `<user>`, `<password>`, `<endpoint_hostname>`, `<port>`, and `<dbname>` with your specific details.

Use this connection string as an environment variable designated as `DATABASE_URL` in the `.env` file.

## Set up Database Schema

In the file named `schema.tsx`, you would see the following code:

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
  console.log('Database schema set up succesfully.');
}

prepare();
```

The code above defines a function that connects to a Neon serverless Postgres database using a `DATABASE_URL` environment variable and sets up the necessary schema for the real-time application. It creates two tables, `nodes` and `outbox`, to store data and manage message processing, respectively. A trigger function, `outbox_notify`, is implemented to send notifications using `pg_notify` whenever new rows are inserted into the `outbox` table. This ensures the database is ready for real-time updates and WebSocket-based communication.

To run the schema against your Neon Postgres, execute the following command:

```
npm run db
```

If it runs succesfully, you should see `Database schema set up succesfully.` in the terminal.

## TODO

TODO

```tsx
// File: app/api/comments/[id]/route.ts

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { withOutboxWrite, editComment, deleteComment } from '@/lib/prisma/api'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id)
    const comment: { mutationId: string; content: string } = await request.json()
    const data = await withOutboxWrite(editComment, comment.mutationId, id, comment.content)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('failed to update comment', error)
    return NextResponse.json({ message: 'failed to update comment', error }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id)
    const mutationId = request.headers.get('x-mutation-id') || 'missing'
    const data = await withOutboxWrite(deleteComment, mutationId, id)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('failed to delete comment', error)
    return NextResponse.json({ message: 'failed to delete comment', error }, { status: 500 })
  }
}
```

In the code above, there are two endpoints, `PUT` and `DELETE`, both of which parse the `id` param in the request. The `PUT` endpoint extracts the comment properties (`mutationId`, `content`) to edit the comment in Postgres and sync the changes to the rest of the web clients that are actively looking to stream comment changes in real-time.

```tsx
// File: app/api/comments/route.ts

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { withOutboxWrite, addComment } from '@/lib/prisma/api'

export async function POST(request: NextRequest) {
  try {
    const comment: {
      mutationId: string
      postId: number
      authorId: number
      content: string
    } = await request.json()
    const data = await withOutboxWrite(addComment, comment.mutationId, comment.postId, comment.authorId, comment.content)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('failed to add comment', error)
    return NextResponse.json({ message: 'failed to add comment', error }, { status: 500 })
  }
}
```

In the code above, the endpoint parses the request's body to extract the comment properties (`mutationID`, `postId`, `authorId`, `content`). Further, it inserts into Postgres using the `withOutboxWrite` helper function which makes sure to sync it in Postgres and rest of the web clients that are actively looking to stream comments in real-time.

```tsx
// File: app/api/posts/[id]/route.ts

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { getPost } from '@/lib/prisma/api'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id)
    const [data, sequenceId] = await getPost(id)
    return NextResponse.json({ sequenceId, data })
  } catch (error) {
    return NextResponse.json({ message: 'failed to get post', error }, { status: 500 })
  }
}
```

In the code above, the endpoint parses the `id` param in the request and returns the `sequenceId` and the comment details associated with that ID in Postgres.

## Create the UI for Starting Conversations and Synchronizing Chat History

Create a file named `page.tsx` in the `app/c/[slug]` directory with the following code:

```tsx
// File: app/c/[slug]/page.tsx

'use client';

import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { type Role, useConversation } from '@11labs/react';

export default function () {
  const { slug } = useParams();
  const [currentText, setCurrentText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const loadConversation = () => {
    fetch(`/api/c?id=${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          setMessages(
            res.map((i: any) => ({
              ...i,
              formatted: {
                text: i.content_transcript,
                transcript: i.content_transcript,
              },
            }))
          );
        }
      });
  };
  const conversation = useConversation({
    onError: (error: string) => {
      toast(error);
    },
    onConnect: () => {
      toast('Connected to ElevenLabs.');
    },
    onMessage: (props: { message: string; source: Role }) => {
      const { message, source } = props;
      if (source === 'ai') setCurrentText(message);
      fetch('/api/c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slug,
          item: {
            type: 'message',
            status: 'completed',
            object: 'realtime.item',
            id: 'item_' + Math.random(),
            role: source === 'ai' ? 'assistant' : 'user',
            content: [{ type: 'text', transcript: message }],
          },
        }),
      }).then(loadConversation);
    },
  });
  const connectConversation = useCallback(async () => {
    toast('Setting up ElevenLabs...');
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const response = await fetch('/api/i', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.error) return toast(data.error);
      await conversation.startSession({ signedUrl: data.apiKey });
    } catch (error) {
      toast('Failed to set up ElevenLabs client :/');
    }
  }, [conversation]);
  const disconnectConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);
  const handleStartListening = () => {
    if (conversation.status !== 'connected') connectConversation();
  };
  const handleStopListening = () => {
    if (conversation.status === 'connected') disconnectConversation();
  };
  useEffect(() => {
    return () => {
      disconnectConversation();
    };
  }, [slug]);
  return <></>;
}
```

The code above does the following:

- Defines a `loadConversation` function which calls the `/api/c` route to fetch the conversation history based on the particular slug (i.e. the conversation ID).
- Uses the `useConversation` hook by ElevenLabs to display the toast when the instance is connected, and to sync the real-time message to Postgres using the `onMessage` callback.
- Defines a `connectConversation` function that instantiates a private conversation with the agent after obtaining a signed URL using the `/api/i` route.
- Defines a `disconnectConversation` function that disconnects the ongoing conversation with the agent.
- Creates a `useEffect` handler which on unmount, ends the ongoing conversation with the agent.

Next, import the `TextAnimation` component which displays different state of the conversation, whether AI is listening or speaking (and what if so).

```tsx ins={4,10-15}
'use client';

// ... Existing imports ...
import TextAnimation from '@/components/TextAnimation';

export default function () {
  // ... Existing code ...
  return (
    <>
      <TextAnimation
        currentText={currentText}
        onStopListening={handleStopListening}
        onStartListening={handleStartListening}
        isAudioPlaying={conversation.isSpeaking}
      />
    </>
  );
}
```

Finally, add a `Show Transcript` button that displays the conversation history stored in Neon to the user.

```tsx ins={4,5,9,13-37}
'use client';

// ... Existing imports ...
import { X } from 'react-feather';
import Message from '@/components/Message';

export default function () {
  // ... Existing code ...
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  return (
    <>
      {/* Existing code */}
      {messages.length > 0 && (
        <button
          className="fixed right-4 top-2 text-sm underline"
          onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
        >
          Show Transcript
        </button>
      )}
      {isTranscriptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90%] max-w-[90%] overflow-y-scroll rounded bg-white p-4 text-black shadow-lg">
            <div className="flex flex-row items-center justify-between">
              <span>Transcript</span>
              <button onClick={() => setIsTranscriptOpen(false)}>
                <X />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-y-4 border-t py-4">
              {messages.map((conversationItem) => (
                <Message key={conversationItem.id} conversationItem={conversationItem} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

Now, let's move on to deploying the application to Vercel.

## Deploy to Vercel

The repository is now ready to deploy to Vercel. Use the following steps to deploy:

- Start by creating a GitHub repository containing your app's code.
- Then, navigate to the Vercel Dashboard and create a **New Project**.
- Link the new project to the GitHub repository you've just created.
- In **Settings**, update the **Environment Variables** to match those in your local `.env` file.
- Deploy.

<DetailIconCards>

<a target="_blank" href="https://github.com/neondatabase-labs/ably-livesync-neon" description="A Real-Time Comments Application" icon="github">Real-Time Comments Application</a>

</DetailIconCards>

## Summary

TODO - In this guide, you learned how to build a real-time AI voice assistant using ElevenLabs and Next.js, integrating it with a Postgres database to store and retrieve conversation histories. You explored the process of setting up a serverless database, creating a customizable AI agent, and implementing a user-friendly interface with animations and message handling. By the end, you gained hands-on experience connecting various technologies to create a fully functional AI voice assistant application.

<NeedHelp />
