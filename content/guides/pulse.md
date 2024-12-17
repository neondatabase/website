---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-12-17T00:00:00.000Z'
updatedOn: '2024-12-17T00:00:00.000Z'
title: Building a Real-Time AI Voice Assistant with ElevenLabs
subtitle: A step-by-step guide to building your own AI Voice Assistant in a Next.js application with ElevenLabs and Postgres
---

Imagine having an AI voice assistant like Iron Man's [J.A.R.V.I.S.](https://en.wikipedia.org/wiki/J.A.R.V.I.S.), capable of understanding and responding to your needs in real-time. In this guide, you will learn how to build your very own real-time AI voice assistant using ElevenLabs, store each conversation in a Postgres database, and index them for faster retrieval.

## Prerequisites

To follow along this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- A [Vercel](https://vercel.com) account

## Create a new Next.js application

Let’s get started by creating a new Next.js project with the following command:

```shell shouldWrap
npx create-next-app@latest pulse
```

When prompted, choose:

- `Yes` when prompted to use TypeScript.
- `No` when prompted to use ESLint.
- `Yes` when prompted to use Tailwind CSS.
- `No` when prompted to use `src/` directory.
- `Yes` when prompted to use App Router.
- `No` when prompted to use Turbopack for `next dev`.
- `No` when prompted to customize the default import alias (`@/*`).

Once that is done, move into the project directory and install the necessary dependencies with the following command:

```shell
cd pulse
npm add @11labs/react @neondatabase/serverless motion framer-motion react-feather sonner
npm add -D tsx
```

The libraries installed include:

- `@11labs/react`: A React library to interact with [ElevenLabs API](https://elevenlabs.io/api).
- `@neondatabase/serverless`: A library to connect and interact with Neon’s serverless Postgres database.
- `motion`: A library to create animations in React applications.
- `framer-motion`: A library for animations in React.
- `react-feather`: A collection of open-source icons for React.
- `sonner`: A notification library for React to display toast notifications.

The development-specific libraries include:

- `tsx`: To execute and rebuild TypeScript efficiently.

## Provision a Serverless Postgres

To set up a serverless Postgres, go to the [Neon console](https://console.neon.tech/app/projects) and create a new project. Once your project is created, you will receive a connection string that you can use to connect to your Neon database. The connection string will look like this:

```bash
postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
```

Replace `<user>`, `<password>`, `<endpoint_hostname>`, `<port>`, and `<dbname>` with your specific details.

Use this connection string as an environment variable designated as `DATABASE_URL` in the `.env` file.

## Create an AI Agent with ElevenLabs

To create a customizable agent, go to ElevenLabs' [AI Agents](https://elevenlabs.io/app/conversational-ai) and then click on `Create an AI agent` button.

![](/guides/images/pulse/agent-1.png)

Next, give it a personalized name and select the kind of Agent you would want. For demonstration purposes, let's start with a `Blank template`.

![](/guides/images/pulse/agent-2.png)

Next, copy the Agent ID displayed just below the customized name of your agent (here, `Custom`). You will use this Agent ID as the `AGENT_ID` environment variable in your application.

![](/guides/images/pulse/agent-3.png)

Next, go to `Advanced > Client Events` in your Agent settings, and add two events named `agent_response` and `user_transcript`.

![](/guides/images/pulse/agent-4.png)

Finally, go to [API Keys](https://elevenlabs.io/app/settings/api-keys), create an API key and use the value obtained as `XI_API_KEY` enviroment variable in your application.

## Database Schema Setup

Create a file named `schema.tsx` at the root of your project directory with the following code:

```tsx
// File: schema.tsx

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const createMessagesTable = async () => {
  if (!process.env.DATABASE_URL) throw new Error(`DATABASE_URL environment variable not found.`);
  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql(
      `CREATE TABLE IF NOT EXISTS messages (created_at SERIAL, id TEXT PRIMARY KEY, session_id TEXT, content_type TEXT, content_transcript TEXT, object TEXT, role TEXT, status TEXT, type TEXT);`
    );
    await sql(
      `CREATE INDEX IF NOT EXISTS idx_session_created_at ON messages (session_id, created_at);`
    );
    console.log('Setup schema succesfully.');
  } catch (error) {
    console.error(error);
    console.log('Failed to set up schema.');
  }
};

createMessagesTable();
```

The code above defines an asynchronous function `createMessagesTable` that connects to a Neon serverless Postgres database using a connection string stored in the `DATABASE_URL` environment variable, creates a `messages` table if it doesn't already exist, and sets up an index on the `session_id` and `created_at` columns for faster retrievals.

To run the migrations, execute the following command:

```
npx tsx schema.tsx
```

## TODO

### Typing Effect

```tsx
// File: components/useTypingEffect.ts

import { useEffect, useState } from 'react';

export const useTypingEffect = (text: string, duration: number = 50, isTypeByLetter = false) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const items = isTypeByLetter ? text.split('') : text.split(' ');
  useEffect(() => {
    setCurrentPosition(0);
  }, [text]);
  useEffect(() => {
    if (currentPosition >= items.length) return;
    const intervalId = setInterval(() => {
      setCurrentPosition((prevPosition) => prevPosition + 1);
    }, duration);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentPosition, items, duration]);
  return items.slice(0, currentPosition).join(isTypeByLetter ? '' : ' ');
};
```

TODO - describe

### Message

```tsx
// File: components/Message.tsx

import { Cpu, User } from 'react-feather';

export default function ({
  conversationItem,
}: {
  conversationItem: { role: string; formatted: { transcript: string } };
}) {
  return (
    <div className="flex max-w-full flex-row flex-wrap items-start gap-x-3">
      <div className="max-w-max rounded border p-2">
        {conversationItem.role === 'user' ? <User /> : <Cpu />}
      </div>
      <div className="flex flex-col gap-y-2">{conversationItem.formatted.transcript}</div>
    </div>
  );
}
```

TODO - describe

### TextAnimation

```tsx
// File: components/TextAnimation.tsx

'use client';

import { useTypingEffect } from '@/components/useTypingEffect';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type AIState = 'idle' | 'listening' | 'speaking';

interface Props {
  onStartListening?: () => void;
  onStopListening?: () => void;
  isAudioPlaying?: boolean;
  currentText: string;
}

export default function AiTalkingAnimation({
  onStartListening,
  onStopListening,
  isAudioPlaying,
  currentText,
}: Props) {
  const [aiState, setAiState] = useState<AIState>('idle');
  const animatedCurrentText = useTypingEffect(currentText, 20);
  const displayedText = useTypingEffect('Click the circle to start the conversation', 20);

  const handleCircleClick = () => {
    if (aiState === 'listening' || aiState === 'speaking') {
      onStopListening?.();
      setAiState('idle');
    } else if (!isAudioPlaying) {
      onStartListening?.();
      setAiState('listening');
    }
  };

  useEffect(() => {
    if (isAudioPlaying) setAiState('speaking');
    else if (aiState === 'speaking' && currentText) setAiState('listening');
  }, [isAudioPlaying]);

  return (
    <div className="bg-gray-100 flex min-h-screen flex-col items-center justify-center p-4">
      <div
        className="relative mb-8 cursor-pointer"
        onClick={handleCircleClick}
        role="button"
        aria-label={aiState === 'listening' ? 'Stop listening' : 'Start listening'}
      >
        <motion.div
          className="from-pink-500 to-violet-600 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg"
          animate={
            aiState === 'idle'
              ? { scale: [1, 1.1, 1] }
              : aiState === 'speaking'
                ? { scale: [1, 1.2, 0.8, 1.2, 1] }
                : {}
          }
          transition={{
            repeat: Infinity,
            ease: 'easeInOut',
            duration: aiState === 'speaking' ? 0.8 : 1.5,
          }}
        />
        {aiState === 'listening' && (
          <svg
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2"
            viewBox="0 0 100 100"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              strokeWidth="4"
              stroke="#8B5CF6"
              transition={{
                duration: 10,
                ease: 'linear',
                repeat: Infinity,
              }}
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 270 }}
            />
          </svg>
        )}
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <p className="text-gray-800 font-mono text-lg" aria-live="polite">
          {aiState === 'listening'
            ? 'Listening...'
            : aiState === 'speaking'
              ? animatedCurrentText
              : displayedText}
        </p>
        {aiState === 'idle' && (
          <motion.div
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="bg-violet-600 mt-2 h-5 w-2"
          />
        )}
      </div>
    </div>
  );
}
```

TODO - describe

## Generating a Signed URL for ElevenLabs Conversations

To create a secure access between user and AI (powered by ElevenLabs), create a new file named `route.ts` in the `app/api/i` directory with the following code:

```tsx
// File: app/api/i/route.ts

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const agentId = process.env.AGENT_ID;
  if (!agentId) throw Error('AGENT_ID is not set or received.');
  const apiKey = process.env.XI_API_KEY;
  if (!apiKey) throw Error('XI_API_KEY is not set or received.');
  try {
    const apiUrl = new URL('https://api.elevenlabs.io/v1/convai/conversation/get_signed_url');
    apiUrl.searchParams.set('agent_id', agentId);
    const response = await fetch(apiUrl.toString(), {
      headers: { 'xi-api-key': apiKey },
    });
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    return NextResponse.json({ apiKey: data.signed_url });
  } catch (error) {
    // @ts-ignore
    const message = error.message || error.toString();
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

The code above defines an API route that generates a signed URL using ElevenLabs API. You will want to use signed URL instead of connecting to a fixed point server so as to allow connection to your personalized, private agents created in ElevenLabs.

## Managing Conversations in Postgres

Create a file named `route.ts` in the `app/api/c` directory with the following code:

```tsx
// File: app/api/c/route.ts

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import { neon, neonConfig } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

neonConfig.poolQueryViaFetch = true;

export async function POST(request: Request) {
  const { id, item } = await request.json();
  if (!id || !item || !process.env.DATABASE_URL) return NextResponse.json({}, { status: 400 });
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql('SELECT COUNT(*) from messages WHERE session_id = $1', [id]);
  await sql(
    'INSERT INTO messages (created_at, id, session_id, content_type, content_transcript, object, role, status, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
    [
      rows[0].count,
      item.id,
      id,
      item.content[0].type,
      item.content[0].transcript,
      item.object,
      item.role,
      item.status,
      item.type,
    ]
  );
  return NextResponse.json({});
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !process.env.DATABASE_URL) return NextResponse.json([]);
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql('SELECT * from messages WHERE session_id = $1', [id]);
  return NextResponse.json(rows);
}
```

The code above defines two endpoint handlers on `/api/c`:

- A `POST` endpoint that allows you to insert a new message into the `messages` table. It expects a JSON payload containing the `id` of the session and the `item` to be inserted. If the session ID or item is missing, it returns a 400 status code.

- A `GET` endpoint that retrieves all messages associated with a specific session ID. It extracts the session ID from the request URL and queries the `messages` table, returning the results as a JSON response. If the session ID is not provided, it returns an empty array.

## Deploy to Vercel

The repository is now ready to deploy to Vercel. Use the following steps to deploy:

- Start by creating a GitHub repository containing your app's code.
- Then, navigate to the Vercel Dashboard and create a **New Project**.
- Link the new project to the GitHub repository you've just created.
- In **Settings**, update the **Environment Variables** to match those in your local `.env` file.
- Deploy.

<DetailIconCards>

<a target="_blank" href="https://github.com/neondatabase-labs/pulse" description="A Real-Time AI Voice Assistant" icon="github">Pulse</a>

</DetailIconCards>

## Summary

TODO - In this guide, you learned how to build a real-time AI voice assistant using ElevenLabs and store conversations in a Postgres database.

<NeedHelp />
