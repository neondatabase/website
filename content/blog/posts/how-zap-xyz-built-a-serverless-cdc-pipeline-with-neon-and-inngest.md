---
title: How Zap.xyz Built a Serverless CDC Pipeline with Neon and Inngest
description: Zap processes millions of messages daily—here’s how
excerpt: >-
  “Inngest + Neon handle the entire change data capture process for us. Setting
  it up took a fraction of the time compared to AWS” (Jacob Devore, Co-Founder
  at Zap) Zap.xyz is a new crypto aggregation platform that processes millions
  of messages from community channels like Telegra...
date: '2025-02-12T13:39:09'
updatedOn: '2025-02-12T13:39:10'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-zap-xyz-built-a-serverless-cdc-pipeline-with-neon-and-inngest/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Zap.xyz Built a Serverless CDC Pipeline with Neon and Inngest - Neon
  description: >-
    Learn how Zap used Neon, Inngest, and Vercel to build a serverless CDC
    pipeline able to process millions of messages daily.
  keywords: []
  noindex: false
  ogTitle: How Zap.xyz Built a Serverless CDC Pipeline with Neon and Inngest - Neon
  ogDescription: >-
    Learn how Zap used Neon, Inngest, and Vercel to build a serverless CDC
    pipeline able to process millions of messages daily.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-zap-xyz-built-a-serverless-cdc-pipeline-with-neon-and-inngest/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-zap-xyz-built-a-serverless-cdc-pipeline-with-neon-and-inngest/neon-zapxyz-1-1024x576-8a504ced.jpg)

<blockquote>
<p><strong>“Inngest + Neon handle the entire change data capture process for us. Setting it up took a fraction of the time compared to AWS” </strong>(Jacob Devore, Co-Founder at <a href="https://zap.xyz/login">Zap</a>)</p>
</blockquote>

[Zap.xyz](https://zap.xyz/login/) is a new crypto aggregation platform that processes millions of messages from community channels like Telegram (they’ll expand to X and other platforms soon). By tracking social sentiment and correlating it with on-chain trades, Zap tells you what’s trending in the crypto space and how that’s translating into market movement. They’re in beta, but [you can get in early](https://zap.xyz/login).

<EmbedTweet url="https://twitter.com/fomomofosol/status/1878684577985970340?ref_src=twsrc%5Etfw" />

## Building an event-driven data pipeline at scale

To deliver real-time insights to crypto traders, Zap has to reliably capture and act on a huge stream of incoming messages. These messages (from thousands of Telegram channels and soon Twitter feeds) need to be processed quickly so they can trigger follow-up workflows. This all has to be done with a small team hyper-focused on shipping.

<blockquote>
<p><strong>“If you’re a startup working on a product like ours, every second counts. Developer experience and iteration speed are crucial. We just don’t have time to wrestle with clunky infrastructure”</strong> (Jacob Devore, Co-Founder at <a href="https://zap.xyz/login">Zap</a>)</p>
</blockquote>

## The pain of CDC in AWS

At first, Zap attempted to build their CDC pipeline on AWS using a combination of Amazon Aurora Serverless, Amazon RDS Proxy, and AWS SNS. The architecture looked like this:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-zap-xyz-built-a-serverless-cdc-pipeline-with-neon-and-inngest/684-1024x818-5aa08719.jpg)

They soon discovered the first hiccup. It so happens that Aurora Serverless didn’t natively support database change streams, forcing them to try to implement this on provisioned Aurora with AWS’ [Database Activity Streams](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/DBActivityStreams.html) and AWS SNS. Suddenly the team was contemplating managing SNS topics, subscriber endpoints, bridging events into application logic…

<blockquote>
<p><strong>“We spent about 10 hours just trying to build a proof of concept in AWS, and this was for something as straightforward as “when a row is added to the database, run some code once.” It was a huge time sink.” </strong>(Jacob, Co-Founder at <a href="https://zap.xyz/login">Zap</a>)</p>
</blockquote>

Zap’s core philosophy is to build fast, iterate often, and focus on the product. All this unnecessary complexity was not cutting it. That’s when the team looked around and discovered the [Neon and Inngest stack](https://neon.tech/docs/guides/logical-replication-inngest), which combined wonderfully with their Vercel infra.

## Zap’s serverless CDC stack: Neon, Inngest, and Vercel

By adopting this new architecture, Zap eliminated unnecessary infrastructure management while ensuring their system could scale. Each tool solves a key piece of the puzzle:

- [Neon](https://neon.tech/home) is a serverless Postgres database that eliminates manual scaling and offers built-in connection pooling, key to Zap’s application.
- [Inngest](https://www.inngest.com/) is an eventing framework that [taps directly into Neon’s logical replication](https://neon.tech/blog/serverless-triggers-how-and-why). Inngest provides an out-of-the-box CDC pipeline—every new record inserted in Neon automatically becomes an event that can trigger downstream workflows.
- [Vercel](https://vercel.com/home) gives Zap the ability to deploy serverless functions with minimal overhead, ideal for handling lower-volume events and for quickly iterating on new features. (High-volume events are handled on dedicated servers.)

### Data ingestion into Neon

Each message (plus relevant metadata) is first inserted into a Neon Postgres database. Neon is [serverless](https://neon.tech/docs/introduction/serverless), so Zap doesn’t have to maintain a predefined cluster size. If traffic spikes, Neon scales. **The goal is to continue ingesting data without pausing to reconfigure anything.**

### CDC via Inngest

As soon as a new row is written to Neon, Inngest automatically picks up the change by tapping into Neon’s logical replication feed. There’s no extra logic or self-managed CDC pipeline. Inngest takes care of streaming new and updated rows, then emitting the right event to Zap’s backend.

<blockquote>
<p><strong>“With Inngest, we don’t need to stand up a stream service or maintain it. We just subscribe to database events and then define what needs to happen next. It’s basically zero overhead”</strong> (Jacob Devore, Co-Founder at <a href="https://zap.xyz/login">Zap</a>) </p>
</blockquote>

### Routing to serverless functions

Once Inngest receives an event, it hands off the message to Zap’s chosen runtime. Which is either,

- **Dedicated servers for high-volume events.** If an event is large or triggers a process that needs more control (e.g. heavy data transformations), Inngest routes it to a dedicated HTTP endpoint where Zap runs a custom server.
- **Or [Vercel Functions](https://vercel.com/docs/functions) for smaller workloads.** For lightweight tasks, Inngest invokes serverless functions deployed on Vercel. These functions spin up on demand and scale down automatically.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-zap-xyz-built-a-serverless-cdc-pipeline-with-neon-and-inngest/685-1024x492-623cd84f.jpg)

## Next steps

With these building blocks, Zap can now focus on scaling without the pain of wrangling all the AWS tools. If you’d like to replicate their approach, [try setting up Neon and Inngest](https://neon.tech/blog/serverless-triggers-how-and-why).

And if you’re into crypto, [keep an eye on Zap](https://x.com/zap_xyz)👀 (they’re also hiring!)
