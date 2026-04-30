---
title: Web-based AI SQL Playground and connecting to Postgres from the browser
description: >-
  Learn how we built a SQL playground for Postgres where you can use AI to
  generate queries using natural language
excerpt: >-
  A few months back, we had an internal AI hackathon at Neon where we could
  learn and experiment with OpenAI’s APIs. One of the ideas was to build an
  online AI SQL playground for Postgres. It would enable developers to connect
  to a Neon Postgres database and have an AI assistant ge...
date: '2023-05-19T13:34:31'
updatedOn: '2024-01-24T22:19:50'
category: community
categories:
  - community
authors:
  - mahmoud-abdelwahab
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-ai-playground/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Web-based AI SQL Playground and connecting to Postgres from the browser -
    Neon
  description: >-
    Learn how we built a Web-based SQL playground for Postgres where you can use
    AI to generate queries using natural language
  keywords: []
  noindex: false
  ogTitle: >-
    Web-based AI SQL Playground and connecting to Postgres from the browser -
    Neon
  ogDescription: >-
    Learn how we built a Web-based SQL playground for Postgres where you can use
    AI to generate queries using natural language
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-ai-playground/cover.jpg
source:
  wpId: 1699
  wpSlug: postgres-ai-playground
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-ai-playground/cover-ai-1024x538-d8fc0ee6.jpg)

A few months back, we had an internal AI hackathon at Neon where we could learn and experiment with [OpenAI](https://openai.com/)’s APIs.

One of the ideas was to build an online AI SQL playground for Postgres. It would enable developers to connect to a Neon Postgres database and have an AI assistant generate SQL queries using natural language.

We are excited to share that it is no longer an idea and that the playground is live! You can try it out here: [Postgres AI Playground](https://neon.tech/demos/playground)

The playground currently works with Neon databases, but it is possible to make it work with other Postgres databases hosted on other providers (more on that later). If you do not already have a Neon database, you can [sign up and get one for free](https://console.neon.tech/).

This blog post will go over the playground experience and explain how it works under the hood.

## Overview of the Playground

To get started, click on the “connect” button and paste your database connection string. After connecting successfully, you will be able to write queries and run them. You can see the different tables and views in the sidebar if your database already has a schema.

<video autoPlay playsInline muted loop width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/postgres-ai-playground/connect-edited-aacc97dc.mp4" />
</video>

Next, you can use AI to generate SQL queries using natural language. To do that, click the “Ask AI” button or use the `⌘+k` (`ctrl+k` if you are on Windows/Linux) shortcut to show the dialog where you can submit your prompt.

An example prompt could be “Design a database schema for a URL shortening app”.

<video autoPlay playsInline muted loop width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/postgres-ai-playground/ai-60878934.mp4" />
</video>

A cool addition is that the AI knows your database schema. So you can ask questions about it and even ask the AI for help modifying it. Here we are asking “What is my database schema?”, but we can also say something like “Add created_at and updated_at fields to the urls table”.

<video autoPlay playsInline muted loop width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/postgres-ai-playground/ai-is-aware-of-your-schema-c3cf8da5.mp4" />
</video>

If you want to delete the connection string, click the “connect” button again and choose “remove connection”.

<video autoPlay playsInline muted loop width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/postgres-ai-playground/remove-connection-edited-f412a22d.mp4" />
</video>

The playground is [open source](https://github.com/neondatabase/postgres-ai-playground). You can [create an issue](https://github.com/neondatabase/postgres-ai-playground/issues) if you find any bugs or have a feature request.

## How the playground works: Establishing a connection between Postgres and the browser

Postgres database connections are established via TCP ([Transmission Control Protocol](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/)). You cannot establish a connection if the environment you want to connect from does _not_ support this protocol (e.g., a serverless at edge runtime or browsers).

To overcome this limitation, we launched the Neon [serverless driver](https://github.com/neondatabase/serverless). It redirects the PostgreSQL wire protocol via a WebSocket-to-TCP proxy and relays traffic in both directions. This is similar to an ordinary Postgres connection, meaning your queries should require little to no change.

The playground uses the Neon serverless driver to connect directly to Postgres from the browser.

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-ai-playground/image-8-1024x538-e695d2f4.png)

### Configuring the proxy

To make it possible to connect with Postgres databases hosted on other providers, the proxy can be configured to route connections to other TCP target domain names. It is [open-source](https://github.com/neondatabase/wsproxy), so you can self-host and configure it to depending on your needs. This way, you can use the serverless driver with Postgres databases other than Neon.

We are also actively working on an HTTP-based driver and will release it soon. To be notified as soon as it comes out, [follow us on Twitter](https://twitter.com/neondatabase).

## Adding AI-generated SQL queries

The playground uses OpenAI’s [gpt-3.5-turbo model](https://platform.openai.com/docs/models/gpt-3-5) to generate SQL queries. This is the same model powering [ChatGPT](https://chat.openai.com/). It is cost-effective and provides good results when it comes to code generation. Here is how we use it:

```javascript
// /api/chat
import { ratelimit } from '@/utils/ratelimit';
import { OpenAIStream, OpenAIStreamPayload } from '@/utils/stream';
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<Response> {
  const id = req.ip ?? 'anonymous';

  const limit = await ratelimit.limit(id ?? 'anonymous');

  if (!limit.success) {
    return NextResponse.json(limit, { status: 429 });
  }

  const { prompt, schema } = (await req.json()) as {
    prompt: string;
    schema?: string;
  };

  if (!prompt) {
    return new Response('No prompt in the request', { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant that only knows about PostgreSQL. All of your responses will be about Postgres. If asked about anything else, say you do not know`,
      },
      {
        role: 'user',
        content: `
        my database schema is: ${schema}

        --${prompt}

        prefix the response with -- unless it is SQL code
      `,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };
  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
```

This is a Vercel edge function that accepts POST requests, and is located at /api/chat. We use [Upstash](https://upstash.com) Redis and the [`@upstash/ratelimit`](https://github.com/upstash/ratelimit) library to rate limit the API endpoint.

We then get the user’s prompt and the database schema from the request’s body. Finally, we are using the [OpenAI Node SDK](https://www.npmjs.com/package/openai) to generate the query. First, we set the system message to the following:

```bash
You are an AI assistant who only knows about PostgreSQL.
All of your responses will be about Postgres.
If asked about anything else, say you do not know
```

This makes it less likely that the AI model responds with something unrelated to the user’s prompt. We then send the following prompt to OpenAI’s API, including the user’s database schema and prompt:

```bash
My database schema is: ${schema}

--${prompt}

prefix the response with -- unless it is SQL code.
```

`prefix the response with -- unless it is SQL code` formats the response so it can be copy-pasted into the editor immediately. This works most of the time but not always, so this prompt might need more tweaking. Please open a pull request if you have suggestions for producing more consistent results.

This is how we get the database schema and format it to be included in the prompt:

```javascript
// get all tables and columns in the database
const { rows } = await client.query(
  ` SELECT table_name, array_agg(column_name || ' ' || data_type)
AS columns_and_types FROM information_schema.columns
 WHERE table_schema = 'public' GROUP BY table_name ORDER BY table_name;`
);

// transform into CSV like format
const databaseSchema = rows
  .map((table) => {
    const columns = table.columns_and_types
      .map((column) => {
        const [name, type] = column.split(' ');
        return `${name} ${type}`;
      })
      .join(', ');

    return `${table.table_name} (${columns});`;
  })
  .join('\n');

// example response:
// urls (id integer, original_url text, created_at timestamp, short_url text);
// users (id integer, username text, password text);
```

Finally, we stream the response so that the end user does not need to wait until the full request is processed, which is a better user experience.

## Final thoughts

We enjoyed building this project and experimenting with Open AI’s APIs. We would love your feedback, so let us know what you think on [Twitter](https://twitter.com/neondatabase) or by posting in our [Neon community forum](https://community.neon.tech/).
