---
title: AI agents on Neon Functions
subtitle: Run streaming, tool-calling agents on Neon Functions.
summary: >-
  Neon Functions are a long-running home for AI agents. A single request can
  stream a response for minutes while the agent calls models and tools, with
  the Neon AI Gateway wired in automatically and Postgres next to your code.
enableTableOfContents: true
updatedOn: '2026-06-24T14:40:50.063Z'
---

<PrivatePreviewEnquire/>

AI agents make several model and tool calls to answer a single request, then stream the result back. That work can run for minutes, but lambda-style serverless caps execution at roughly 10 to 60 seconds, so a multi-step tool loop or an image-generation run gets cut off mid-stream.

A Neon Function doesn't have that cap. The handler just has to begin responding within 15 minutes, and once a stream is open it stays up for as long as it keeps sending data. That's enough time for an agent that makes many model and tool calls before it finishes responding. The function also runs next to your Postgres database, and the [Neon AI Gateway](/docs/ai-gateway/overview) is injected automatically, so one credential reaches the whole model catalog with nothing to configure.

## Stream a tool-calling agent

Declare the AI Gateway and the function in `neon.ts`. `neonctl deploy` provisions the gateway and injects its credentials at runtime:

```ts filename="neon.ts"
import { defineConfig } from '@neondatabase/config/v1';

export default defineConfig({
  preview: {
    aiGateway: true,
    functions: {
      agent: {
        name: 'AI agent',
        source: './functions/agent.ts',
      },
    },
  },
});
```

Install the AI SDK, the Neon provider, and `pg`:

```bash
npm install ai @neondatabase/ai-sdk-provider pg zod
```

The handler streams a tool-calling agent. The `@neondatabase/ai-sdk-provider` reads the injected gateway credentials on its own, so `neon('<model>')` is the only model configuration you need. Tools run inside the function, right next to Postgres:

```ts filename="functions/agent.ts"
import { neon } from '@neondatabase/ai-sdk-provider';
import { streamText, tool, stepCountIs, type ModelMessage } from 'ai';
import { z } from 'zod';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return new Response('POST { messages } here', { status: 405 });
    }
    const { messages } = (await request.json()) as { messages: ModelMessage[] };

    const result = streamText({
      model: neon('claude-sonnet-4-6'), // any model in the AI Gateway catalog
      system: 'You are a concise assistant. Use tools when relevant.',
      messages,
      tools: {
        dbTime: tool({
          description: 'Get the current time from the database.',
          inputSchema: z.object({}),
          execute: async () => {
            const { rows } = await pool.query<{ now: string }>('SELECT now()::text AS now');
            return { now: rows[0].now };
          },
        }),
      },
      // Let the model call tools and then summarize, instead of stopping after
      // the first tool call. The loop runs in-process, with no host timeout.
      stopWhen: stepCountIs(5),
      onError({ error }) {
        console.error('[streamText]', error);
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => (error instanceof Error ? error.message : String(error)),
    });
  },
};

process.on('SIGINT', () => {
  pool.end().then(() => process.exit(0));
});
```

`tool({ inputSchema, execute })` is the AI SDK v5+ shape. Create the `pg` pool once at module scope so it's reused across requests (see [Connecting to Postgres](/docs/compute/functions/get-started#connect-to-postgres)). Pick any model from the [AI Gateway catalog](/docs/ai-gateway/models); swap `claude-sonnet-4-6` for a different one without changing anything else.

Deploy and call it. `toUIMessageStreamResponse()` returns a stream the AI SDK's `useChat` hook consumes directly:

```bash shouldWrap
curl -N -X POST "$(neonctl functions get agent -o json | jq -r .invocation_url)" \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"What time is it in the database?"}]}'
```

## Call the function directly from the client

Call the function directly from the browser, not through your web app's backend. If you proxy the stream through a Vercel, Netlify, or Cloudflare host, it's bound by that host's serverless execution limit (often 10 to 60 seconds), so a long agent run gets cut off even though the function would keep going. A direct call keeps any host out of the stream's path, so the handler authenticates the request itself. See [Authentication](/docs/compute/functions/authentication#call-a-function-directly-from-the-client) for the JWT, CORS, and Vercel AI SDK transport pattern.

## Persist what matters

Module memory is wiped when an isolate is evicted, and several isolates can run in parallel, so keep anything that must last in Postgres: conversation history, run metadata, results. For generated assets like images, declare a bucket in `neon.ts` (`buckets: { images: {} }`) and write them to [Object Storage](/docs/storage/overview), which branches with your database. The storage credentials are injected the same way the gateway's are.

## Examples

- [with-ai-sdk](https://github.com/neondatabase/examples/tree/main/with-ai-sdk): an image-generation agent using the AI SDK, AI Gateway, and Object Storage.
- [with-mastra](https://github.com/neondatabase/examples/tree/main/with-mastra): a personal-assistant agent using Mastra with Postgres-backed memory.

<NeedHelp/>
