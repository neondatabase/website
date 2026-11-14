---
title: 'Build an AI chatbot with Next.js, the AI SDK, and Postgres chat history'
subtitle: 'Stream replies from OpenAI, Anthropic, or Gemini models with the Vercel AI SDK, and save every conversation to Postgres so chats survive a page reload. One Neon project holds the database and the LLM access, with no provider API keys.'
author: neon-team
enableTableOfContents: true
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T23:25:05.985Z'
---

To build an AI chatbot with chat history in Next.js, stream the model's reply from a route handler with the [Vercel AI SDK](https://ai-sdk.dev), and save the conversation to Postgres when the stream ends. On the next visit, load the saved messages and pass them to `useChat` so the conversation picks up where it left off.

This guide stores chats in a Neon Postgres database and calls models through [Neon AI Gateway](/docs/ai-gateway/overview) with the [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) package. The database and the gateway live in the same Neon project, so one `neon env pull` gives you both, you don't need an OpenAI or Anthropic API key, and switching models is a one-string change.

You'll build four files:

```text
app/api/chat/route.ts      streams the reply and saves the chat
app/chat/[id]/page.tsx     loads a chat's history from Postgres
app/chat/[id]/chat.tsx     the chat UI, built on useChat
lib/chat-store.ts          createChat, loadChat, and saveChat
```

## Create the tables

Each chat has many messages. Store each message in the AI SDK's `UIMessage` shape: an `id`, a `role`, and an array of `parts` (text, tool calls, and so on) in a `jsonb` column. Keeping the shape the AI SDK uses means you can load rows straight back into `useChat` without converting them.

```sql
CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  role TEXT NOT NULL,
  parts JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX messages_chat_id_position_idx ON messages (chat_id, position);
```

`position` keeps messages in conversation order, and `ON DELETE CASCADE` removes a chat's messages when you delete the chat. Run the SQL in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor), with `psql`, or as a migration in your ORM. To tie chats to signed-in users, add a `user_id` column to `chats` (see [Add users](#add-users-and-a-chat-list)).

## Install the packages

Start from a Next.js app with the App Router and TypeScript (`npx create-next-app@latest`), then install the AI SDK, the Neon provider for it, and the Neon serverless driver:

```bash
npm install ai@^7 @ai-sdk/react @neon/ai-sdk-provider @neondatabase/serverless
```

## Set the environment variables

The app reads three variables:

```ini filename=".env.local"
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://[branch-host]
```

With the [Neon CLI](/docs/cli), `neon env pull --file .env.local` writes all three for the current branch ([`neon env pull`](/docs/cli/env#pull)). You can also copy them from the Neon Console: click **Connect**, then open the **AI Gateway** tab for the gateway values. `@neon/ai-sdk-provider` reads the two gateway variables on its own, so the model code needs no configuration ([Get started with AI Gateway](/docs/ai-gateway/get-started)).

AI Gateway needs [prepaid credits](/docs/ai-gateway/prepaid-credits), which you can buy on any Neon plan, including Free, with a $5 minimum. Your project must be in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions).

## Write the chat store

`lib/chat-store.ts` holds every database call. It uses the [Neon serverless driver](/docs/serverless/serverless-driver), which runs queries over HTTP and suits route handlers and server components.

```typescript filename="lib/chat-store.ts"
import { neon } from '@neondatabase/serverless';
import { generateId, type UIMessage } from 'ai';

const sql = neon(process.env.DATABASE_URL!);

export async function createChat(): Promise<string> {
  const id = generateId();
  await sql`INSERT INTO chats (id) VALUES (${id})`;
  return id;
}

export async function loadChat(id: string): Promise<UIMessage[]> {
  const rows = await sql`
    SELECT id, role, parts FROM messages
    WHERE chat_id = ${id}
    ORDER BY position`;
  return rows as UIMessage[];
}

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  await sql`
    INSERT INTO messages (id, chat_id, position, role, parts)
    SELECT m.id, ${chatId}, m.position - 1, m.role, m.parts
    FROM ROWS FROM (
      jsonb_to_recordset(${JSON.stringify(messages)}::jsonb)
        AS (id TEXT, role TEXT, parts JSONB)
    ) WITH ORDINALITY AS m(id, role, parts, position)
    ON CONFLICT (id) DO NOTHING`;
}
```

`saveChat` receives the whole conversation and writes it in one statement. `jsonb_to_recordset` turns the messages array into rows, `WITH ORDINALITY` numbers them in order, and `ON CONFLICT (id) DO NOTHING` skips messages that are already stored, so only the new user message and the new reply get inserted.

## Stream the reply and save the chat

The route handler receives the newest message and the chat ID, loads the earlier messages from Postgres, and streams a reply. When the stream ends, `onEnd` gets the full conversation, including the reply, and saves it. This follows the AI SDK's [message persistence](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence) pattern.

```typescript filename="app/api/chat/route.ts"
import { neon } from '@neon/ai-sdk-provider';
import {
  convertToModelMessages,
  createIdGenerator,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { loadChat, saveChat } from '@/lib/chat-store';

export async function POST(req: Request) {
  const { message, id }: { message: UIMessage; id: string } = await req.json();

  const messages = [...(await loadChat(id)), message];

  const result = streamText({
    model: neon('gpt-5-mini'),
    system: 'You are a helpful assistant. Keep answers short.',
    messages: await convertToModelMessages(messages),
  });

  // Keep generating and saving even if the browser disconnects mid-stream.
  result.consumeStream();

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
      onEnd: async ({ messages }) => {
        await saveChat({ chatId: id, messages });
      },
    }),
  });
}
```

`generateMessageId` gives the reply a server-side ID before it's saved, so the ID in the browser matches the ID in Postgres. `consumeStream()` removes the AI SDK's backpressure, so the reply still finishes and gets saved when the user closes the tab.

## Load the history and render the chat

The home page creates a chat and redirects to it. The chat page loads the saved messages on the server and passes them to the client component.

```tsx filename="app/page.tsx"
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createChat } from '@/lib/chat-store';

export default async function Home() {
  await connection();
  const id = await createChat();
  redirect(`/chat/${id}`);
}
```

`await connection()` tells Next.js to render this page on each request, so every visit gets a new chat instead of one chat created at build time.

```tsx filename="app/chat/[id]/page.tsx"
import { loadChat } from '@/lib/chat-store';
import { Chat } from './chat';

export default async function ChatPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const initialMessages = await loadChat(id);
  return <Chat id={id} initialMessages={initialMessages} />;
}
```

The client component passes the saved messages to `useChat`. `prepareSendMessagesRequest` sends only the newest message, since the server already has the rest.

```tsx filename="app/chat/[id]/chat.tsx"
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useState } from 'react';

export function Chat({ id, initialMessages }: { id: string; initialMessages: UIMessage[] }) {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } };
      },
    }),
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
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
          placeholder="Ask anything"
          className="flex-1 rounded border px-2 py-1"
        />
        <button
          type="submit"
          disabled={status !== 'ready'}
          className="rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white"
        >
          Send
        </button>
      </form>
    </main>
  );
}
```

Run `npm run dev`, open `http://localhost:3000`, and send a few messages. Reload the page: the conversation is still there, read back from Postgres. To see what's stored:

```sql
SELECT position, role, parts FROM messages WHERE chat_id = '<chat-id>' ORDER BY position;
```

## Switch models

The model is a string. To move the chatbot from an OpenAI model to Anthropic or Google, change one line in the route handler:

```typescript filename="app/api/chat/route.ts"
model: neon('gpt-5-mini'), // [!code --]
model: neon('claude-sonnet-4-6'), // [!code ++]
```

Saved chats keep working after the switch, because the history is stored in the AI SDK's model-agnostic `UIMessage` format, not in any one provider's format. `@neon/ai-sdk-provider` routes each model to the right AI Gateway endpoint for its provider, and the cost of every call lands on your Neon bill. Browse the model IDs and prices in the [model catalog](/docs/ai-gateway/models). For the same switch outside the AI SDK, see [Switch between OpenAI, Anthropic, and Gemini models with one base URL change](/guides/switch-openai-anthropic-gemini-models-one-base-url).

## Add users and a chat list

The guide keeps chats anonymous: anyone with a chat ID can read it. Before you ship, add authentication, store the owner on each chat, and check ownership in `loadChat`, `saveChat`, and the route handler.

```sql
ALTER TABLE chats ADD COLUMN user_id TEXT NOT NULL;
CREATE INDEX chats_user_id_idx ON chats (user_id, created_at DESC);
```

[Managed Better Auth](/docs/auth/overview) stores users and sessions in your database under the `neon_auth` schema, and every branch gets its own isolated auth environment, so test branches get their own users too. A sidebar of the user's recent chats, with the first message as a preview, is one query:

```sql
SELECT c.id, c.created_at, m.parts->0->>'text' AS preview
FROM chats c
LEFT JOIN messages m ON m.chat_id = c.id AND m.position = 0
WHERE c.user_id = $1
ORDER BY c.created_at DESC
LIMIT 20;
```

## Test changes on a branch

A Neon branch is a copy-on-write clone of your database, with its own AI Gateway endpoint. To try a new model or system prompt against real conversations without touching production, create a branch and point a local copy of the app at it:

```bash
neon branches create --name chatbot-test
neon env pull --branch chatbot-test --file .env.local
```

The branch starts with production's chats, and anything you write there stays there. The first gateway call on a new branch can return `403` for a few seconds while the credential propagates, so retry briefly. To give each preview deployment its own branch automatically, see [How do I test a different LLM model on a preview branch before switching production?](/faqs/test-different-llm-model-preview-branch)

## Things to watch for

- **Route timeouts**: replies stream from a route handler, so the host's function duration limit caps how long a reply can run. On Vercel, raise it with the `maxDuration` [route segment config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) if long answers get cut off.
- **Validate messages if you add tools**: when messages include tool calls, custom metadata, or data parts, run them through the AI SDK's `validateUIMessages` before sending them to the model, so stored messages that no longer match your tool schemas fail early ([validating messages](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence#validating-messages-on-the-server)).
- **Unknown chat IDs**: `saveChat` fails with a foreign key error if the chat doesn't exist. Return a `404` from the route handler for unknown or unowned chat IDs instead.
- **Usage limits**: AI Gateway applies soft limits of 200,000 tokens per minute (input and output counted separately) and $20 of spend per day, which may vary by account. Requests over a limit return `429`, so show a friendly retry message in the UI ([usage limits](/docs/ai-gateway/prepaid-credits)).

## Related resources

- [AI Gateway overview](/docs/ai-gateway/overview)
- [Chatbot message persistence in the AI SDK](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence)
- [Neon serverless driver](/docs/serverless/serverless-driver)
- [Connect a Next.js application to Neon](/docs/guides/nextjs)
- [Build a full backend with Next.js and Neon](/docs/get-started/full-backend-quickstart)
- [What is the best backend for an AI chatbot or RAG app that needs vector search and LLM access?](/faqs/best-backend-ai-chatbot-rag-llm-app)

<NeedHelp/>
