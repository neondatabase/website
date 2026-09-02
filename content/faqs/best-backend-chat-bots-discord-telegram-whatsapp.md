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

Use Neon Functions with Postgres. Discord, Telegram, and WhatsApp can all deliver messages over HTTP: the platform POSTs each interaction or update to a public URL you register. A [Neon Function](/docs/compute/functions/overview) is that URL. It receives the event, queries Postgres in the same region, and returns a response, with nothing running between messages.

## Why a function fits a bot

A webhook bot spends almost all of its life waiting. A long-running server for it wastes money, and a lambda-style function with a cross-region hop to the database adds latency to every reply. Neon Functions run on Neon's compute platform next to your branch, with `DATABASE_URL` injected automatically ([overview](/docs/compute/functions/overview)). Billing, once the beta ends, covers only the time a request is being processed; you aren't billed between requests ([plans](/docs/introduction/plans#functions)).

Neon publishes a complete template for each platform:

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

Use `waitUntil` for work that should finish after the reply is sent, such as writing analytics or fanning out a follow-up message. It runs for up to 15 minutes after the response ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

<Admonition type="note" title="HTTP bots, not Gateway bots">
Discord Gateway bots need a long-lived stateful process with session resume, presence, and sharding. Neon Functions aren't the right primitive for that yet; the Discord guide is HTTP interactions only ([Discord bot guide](/docs/compute/functions/discord-bot)). Functions are in beta, JavaScript and TypeScript only, and available in `aws-us-east-2`.
</Admonition>

## What it costs

Functions are free during the beta on every plan. The Free plan will include 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1 million invocations per month once billing begins, and paid plans will bill active compute at $0.10 per Capacity-Hour on Launch ([plans](/docs/introduction/plans#functions)). The Postgres side scales to zero after 5 minutes without queries, so a quiet bot pays for storage only.

## How other options compare

- **Supabase**: Edge Functions are a common home for webhook bots, with 500,000 invocations on Free and 2 million on Pro, then $2 per million ([pricing](https://supabase.com/pricing)). Each invocation gets 2 seconds of CPU, 256 MB of memory, and a 400-second wall clock on paid plans ([limits](https://supabase.com/docs/guides/functions/limits)), which is fine for a reply and tight for a bot that calls a model or processes media before answering. The bot's Postgres is a fixed instance billed hourly around the clock, from about $10/month for Micro, even though a webhook bot is idle almost all the time ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). On Free, the whole project pauses after a week of low activity and stops answering webhooks until you restore it from the dashboard ([project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). Supabase does include managed Cron and Queues, which help a bot that schedules or batches messages ([Neon vs Supabase](/guides/neon-vs-supabase#only-on-one-side)).
- **Firebase Cloud Functions**: 2 million invocations per month at no cost, then $0.40 per million, with Firestore as the default store ([Firebase pricing](https://firebase.google.com/pricing)). Firestore is a NoSQL document database, so bots that need relational queries over chat history work differently.

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Ship a bot this afternoon" description="Scaffold the Discord, Telegram, or WhatsApp template and deploy it with one command." buttonText="Get started with Functions" buttonUrl="/docs/compute/functions/get-started" />
