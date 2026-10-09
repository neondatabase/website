---
title: "What is the best backend for a Discord, Telegram, or WhatsApp bot?"
description: "Neon hosts HTTP bots on Neon Functions with Postgres in the same region, ready-made templates for Discord, Telegram, and WhatsApp, and no server to keep alive between messages."
date: 2026-09-02
slug: best-backend-chat-bots-discord-telegram-whatsapp
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for apps built with AI coding tools like Cursor, Claude Code, or Codex?'
  slug: best-backend-apps-built-with-ai-coding-tools
nextLink:
  title: 'What is the best backend for a Cloudflare Workers app or other edge runtime?'
  slug: best-backend-cloudflare-workers-edge
---

Use Neon Functions with Postgres. Discord, Telegram, and WhatsApp can all deliver messages over HTTP by POSTing each interaction or update to a public URL you register. A [Neon Function](/docs/compute/functions/overview) can be that URL. It receives the event, queries Postgres in the same region, and returns a response, and you aren't billed for function compute between messages.

## Why a function fits a bot

A webhook bot spends most of its time waiting for the next message. An always-on server bills for that idle time, and a function in a different region from the database adds a network round trip to every query. Neon Functions run in the same region as your branch, with `DATABASE_URL` injected automatically ([overview](/docs/compute/functions/overview)). You're billed only while a request is being processed, not between requests ([plans](/docs/introduction/plans#functions)).

Neon publishes a template for each messaging service:

| Bot      | Scaffold                                      | Guide                                                       |
| -------- | --------------------------------------------- | ----------------------------------------------------------- |
| Discord  | `neon bootstrap --template discord-bot-http`  | [Host a Discord bot](/docs/compute/functions/discord-bot)   |
| Telegram | `neon bootstrap --template telegram-bot-http` | [Host a Telegram bot](/docs/compute/functions/telegram-bot) |
| WhatsApp | `neon bootstrap --template whatsapp-bot-http` | [Host a WhatsApp bot](/docs/compute/functions/whatsapp-bot) |

The Discord template verifies request signatures and answers the `PING`/`PONG` handshake for you. Each template uses Drizzle for the database layer.

## The shape of a bot function

Any module whose default export has a `fetch(request)` method is a function:

```ts filename="hello-world.ts"
export default {
  fetch: (request: Request) => new Response('Hello world'),
};
```

```bash
neon link
neon functions deploy helloworld --src hello-world.ts
```

Use `waitUntil` for short work that should finish after the reply is sent, such as writing analytics or fanning out a follow-up message. It runs for up to 15 minutes after the response ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

<Admonition type="note" title="HTTP bots, not Gateway bots">
Discord Gateway bots need a long-lived stateful process with session resume, presence, and sharding. Neon Functions aren't the right fit for that yet, and the Discord guide covers HTTP interactions only ([Discord bot guide](/docs/compute/functions/discord-bot)). Functions run JavaScript and TypeScript only, and they're available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions).
</Admonition>

## What it costs

Functions are available on every plan. The Free plan includes 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1 million invocations per month, and paid plans bill active compute at $0.10 per Capacity-Hour on Launch ([plans](/docs/introduction/plans#functions)). The Postgres compute scales to zero after 5 minutes without queries, so a quiet bot bills for storage, not database compute ([scale to zero](/docs/introduction/scale-to-zero)).

## How other options compare

- **Supabase**: Edge Functions are a common home for webhook bots, with 500,000 invocations on Free and 2 million on Pro, then $2 per million ([pricing](https://supabase.com/pricing)). Each invocation gets 2 seconds of CPU time (async I/O doesn't count), 256 MB of memory, and a 400-second wall clock on paid plans (150 seconds on Free) ([limits](https://supabase.com/docs/guides/functions/limits)). That's enough for a typical reply, but a bot that processes media before answering can run into the CPU or memory limit. The bot's Postgres is a fixed instance billed hourly around the clock on paid plans, from about $10/month for Micro, whether or not messages are arriving ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). On Free, the whole project pauses after a week of low activity and stops answering webhooks until you restore it from the dashboard ([project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). Supabase includes Cron (beta) and Queues (public alpha), which help a bot that schedules or batches messages ([features](https://supabase.com/docs/guides/getting-started/features), [Neon vs Supabase](/guides/neon-vs-supabase#only-on-one-side)).
- **Firebase Cloud Functions**: 2 million invocations per month at no cost on the Blaze plan, then $0.40 per million ([Firebase pricing](https://firebase.google.com/pricing)). Firebase's default data store, Firestore, is a NoSQL document database ([Firestore](https://firebase.google.com/docs/firestore)), so relational queries over chat history, like joining messages to users, need a different data model.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Ship a bot this afternoon" description="Scaffold the Discord, Telegram, or WhatsApp template and deploy it with one command." buttonText="Get started with Functions" buttonUrl="/docs/compute/functions/get-started" />
