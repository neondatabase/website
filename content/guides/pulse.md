---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-12-17T00:00:00.000Z'
updatedOn: '2024-12-17T00:00:00.000Z'
title: Building a Real-Time AI Voice Assistant with ElevenLabs
subtitle: A step-by-step guide to building your own AI Voice Assistant in a Next.js application with ElevenLabs and Postgres
---

Imagine having an AI voice assistant like Iron Man's [J.A.R.V.I.S.](https://en.wikipedia.org/wiki/J.A.R.V.I.S.), capable of understanding and responding to your needs in real-time. In this guide, you will learn how to build your very own real-time AI voice assistant using ElevenLabs, store each conversation in a Postgres database, and index them for faster retrieval.

<Admonition type="note" title="Deal alert">
Take advantage of the [AI Engineer Starter Pack](https://www.aiengineerpack.com) by ElevenLabs to get discounts for the tools used in this guide.
</Admonition>

## Prerequisites

To follow this guide, you’ll need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- A [ElevenLabs](https://elevenlabs.io/) account
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
npm install @11labs/react @neondatabase/serverless motion framer-motion react-feather sonner
npm install -D tsx
```

The libraries installed include:

- `framer-motion`: A library for animations in React.
- `react-feather`: A collection of open-source icons for React.
- `motion`: A library to create animations in React applications.
- `sonner`: A notification library for React to display toast notifications.
- `@11labs/react`: A React library to interact with [ElevenLabs API](https://elevenlabs.io/api).
- `@neondatabase/serverless`: A library to connect and interact with Neon’s serverless Postgres database.

The development-specific libraries include:

- `tsx`: To execute and rebuild TypeScript efficiently.

## Provision a Serverless Postgres

To set up a serverless Postgres, go to the [Neon console](https://console.neon.tech/app/projects) and create a new project. Once your project is created, you will receive a connection string that you can use to connect to your Neon database. The connection string will look like this:

```bash shouldWrap
postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require
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

If it runs succesfully, you should see `Setup schema succesfully.` in the terminal.

## Build Reusable React Components and Hooks

### 1. Typing Effect Animation

To enhance the user experience by simulating real-time interactions, implement a typing effect in the UI to render AI responses incrementally. Create a file named `useTypingEffect.ts` in the `components` directory with the following code:

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

The provided code exports a custom React hook called `useTypingEffect`. This hook simulates a typing effect for a specified text over a given duration, enhancing the user interface by rendering text incrementally.

### 2. Conversation Message

To render each message in the conversation history, you need to dynamically indicate whether the message is from the User or the AI. Create a file named `Message.tsx` in the `components` directory with the following code:

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

The code above exports a React component that renders a message. It conditionally displays a `Cpu` icon for messages from the AI and a `User` icon for messages from the user, along with the message content.

### 3. Various States During AI Interaction

Create a file named `TextAnimation.tsx` in the `components` directory with the following code:

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
        role="button"
        onClick={handleCircleClick}
        className="relative mb-8 cursor-pointer"
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
            viewBox="0 0 100 100"
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2"
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

The code above exports a React component that creates an interactive UI for the AI voice assistant. It utilizes the `useTypingEffect` hook to simulate a typing effect for the AI's responses and displays different states of interaction, such as "idle," "listening," and "speaking." The component also includes a clickable circle that toggles between starting and stopping the listening state, providing visual feedback through animations.

## Generate a Signed URL for private conversations with ElevenLabs

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

## Sync Conversations to a Postgres database

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

<a target="_blank" href="https://github.com/neondatabase-labs/pulse" description="A Real-Time AI Voice Assistant" icon="github">Pulse</a>

</DetailIconCards>

## Summary

In this guide, you learned how to build a real-time AI voice assistant using ElevenLabs and Next.js, integrating it with a Postgres database to store and retrieve conversation histories. You explored the process of setting up a serverless database, creating a customizable AI agent, and implementing a user-friendly interface with animations and message handling. By the end, you gained hands-on experience connecting various technologies to create a fully functional AI voice assistant application.

<NeedHelp />
