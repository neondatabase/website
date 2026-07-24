---
title: How Vapi Uses Neon to Power the Next Generation of Voice Agents
description: Let AI handle your conversations. Build it with Vapi
excerpt: >-
  The time is now: you can build voice AI apps that converse with humans using
  just a few API calls. With Vapi, you can create voice AI agents that don’t
  just understand users but also respond naturally and dynamically, just like a
  human. Check this recording out, where James sched...
date: '2025-02-21T18:02:38'
updatedOn: '2025-09-10T01:05:46'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/vapi-voice-agents-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Vapi Uses Neon to Power the Next Generation of Voice Agents - Neon
  description: >-
    The time is now: you can now add an AI voice to your apps using just a few
    API calls. Build it with Vapi (powered by Neon).
  keywords: []
  noindex: false
  ogTitle: How Vapi Uses Neon to Power the Next Generation of Voice Agents - Neon
  ogDescription: >-
    The time is now: you can now add an AI voice to your apps using just a few
    API calls. Build it with Vapi (powered by Neon).
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/vapi-voice-agents-neon/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/vapi-voice-agents-neon/neon-vapi-1024x576-dc6a44e4.jpg)

<Admonition type="tip" title="Apply to our Agents Program">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>

The time is now: you can build voice AI apps that converse with humans using just a few API calls. With [Vapi](https://vapi.ai/?utm_source=partner&utm_campaign=neon-web&utm_term=neon&utm_medium=neon-web&utm_content=blog), you can create voice AI agents that don’t just understand users but also respond naturally and dynamically, just like a human. Check this recording out, where James schedules a plumber via Sam (the AI):

<video controls width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/vapi-voice-agents-neon/jordan-schedules-a-maintenance-request-5e3700d0.mp4" />
</video>

Another 🤯 one, where an AI Healthcare Assistant gives a patient tips for her migraine:

<video controls width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/vapi-voice-agents-neon/tina-calls-a-healthcare-agent-1ff8f53f.mp4" />
</video>

Building something like this is much easier than you think thanks to Vapi. They integrate state-of-the-art language models, text-to-speech engines, and telephony infrastructure—all so you can focus on building without the complexity.

## Adding an AI voice to your apps

A few ideas of cool things you could build:

- **24\*7 customer support.** Create AI-driven voice agents to handle routine queries, manage call routing, and provide on-demand assistance—drastically reducing wait times so your support team can focus on complex issues.
- **Product onboarding.** Embed a voice agent into your SaaS platform to onboard new users and answer their initial questions.
- **Sales roleplay.** Train your sales team with AI-driven calls for practicing pitches, objection handling, and customer engagement scenarios.
- **AI recruiter.** Automate candidate screenings with voice interviews that adapt questions based on responses, ensuring consistent evaluation while freeing recruiters to nurture screened candidates.
- **AI health assistants.** Manage personal wellness and chronic care through voice-enabled health tracking, from daily routines to medication reminders.
- **AI storytime.** Design playful, interactive apps for kids that respond to their questions and commands to create dynamic stories.
- **Executive coaching.** Build a training app that simulates tough conversations—like performance reviews or negotiation training—for managers.

## What sets Vapi apart

### Advanced voice capabilities

Vapi goes beyond conversation. Its [function-calling](https://docs.vapi.ai/tools/default-tools) feature enables voicebots to perform tasks like booking appointments or retrieving data. With [multilingual support](https://docs.vapi.ai/customization/multilingual) for 100+ languages, you can serve a global audience without rebuilding your entire voice flow.

### Real-time performance

Vapi is also built for speed. Its [proprietary endpointing model](https://docs.vapi.ai/how-vapi-works) ensures conversations flow naturally, without awkward pauses or cut-offs. WebRTC streaming, combined with a private internet backbone, keeps call quality consistently high.

### Massive scalability with flexible deployments

When it’s time to scale to millions of concurrent calls, Vapi’s infrastructure has you covered. Vapi also offers [on-prem deployments,](https://docs.vapi.ai/enterprise/onprem) allowing you to run it in your own cloud.

## Scaling voice agents with Neon

<blockquote>
<p><strong><strong>“Neon’s serverless model is a perfect fit for us. Some of our AI voice agents handle thousands of calls in an instant, and then traffic drops off just as fast. With Neon, we don’t have to think about scaling—it just happens” (<a href="https://www.linkedin.com/in/tejas-siripurapu-7b7b81105/overlay/about-this-profile/">Tejas Siripurapu</a>, Founding Engineer at <a href="https://vapi.ai/?utm_source=partner&amp;utm_campaign=neon-web&amp;utm_term=neon&amp;utm_medium=neon-web&amp;utm_content=blog">Vapi.ai</a>) </strong></strong></p>
</blockquote>

Now, let’s take a look at Vapi’s database layer.

Vapi’s AI voice agents handle dynamic, unpredictable workloads. Some of Vapi’s customers have a steady flow of interactions, while others trigger massive spikes (like outbound sales campaigns or a rise in customer service requests) that can generate thousands of concurrent calls.

This load variability makes traditional database provisioning very inefficient. For this reason, Vapi turned to [Neon](https://neon.tech/home) (serverless Postgres) to support their workload.

### Autoscaling for spiky workloads

Neon now powers all of Vapi’s business-critical Postgres workloads. While Vapi’s database workload is primarily read-driven, write operations spike in real time as calls are processed. Call metadata—such as events, status updates, and token usage—is written to Neon instantly. The database scales up when demand surges and scales down when traffic dips.

**Vapi migrated from Supabase to Neon for exactly this reason: real-time** [autoscaling](https://neon.tech/docs/introduction/autoscaling). With Neon’s serverless architecture and compute and storage autoscaling, the Vapi team no longer has to worry about overprovisioning or hitting performance ceilings.

<blockquote>
<p><strong>“Database migrations are always a headache, but the Neon team made it a smooth process. Their support helped us troubleshoot performance issues and get everything running fast” (<a href="https://www.linkedin.com/in/tejas-siripurapu-7b7b81105/overlay/about-this-profile/">Tejas Siripurapu</a>, Founding Engineer at <a href="https://vapi.ai/?utm_source=partner&amp;utm_campaign=neon-web&amp;utm_term=neon&amp;utm_medium=neon-web&amp;utm_content=blog">Vapi.ai</a>)</strong></p>
</blockquote>

### Reliable connection pooling

Connection pooling is critical for Vapi. To efficiently manage their thousands of concurrent voice interactions, Vapi uses Neon’s [connection pooler](https://neon.tech/docs/connect/connection-pooling), built on PgBouncer. Like all resources in Neon, concurrent connections scale automatically with load: as compute autoscales up and down, the pooler adjusts dynamically, supporting up to 10,000 concurrent calls.

<blockquote>
<p><strong>“We love that Neon just uses PgBouncer under the hood—no unexpected behavior, no surprises. It keeps our database connections stable, even under heavy load” (<a href="https://www.linkedin.com/in/tejas-siripurapu-7b7b81105/overlay/about-this-profile/">Tejas Siripurapu</a>, Founding Engineer at <a href="https://vapi.ai/?utm_source=partner&amp;utm_campaign=neon-web&amp;utm_term=neon&amp;utm_medium=neon-web&amp;utm_content=blog">Vapi.ai</a>)</strong></p>
</blockquote>

### Streaming replication to ClickHouse via PeerDB

Postgres isn’t the only data store in Vapi’s stack. To support log analysis and reporting, [Vapi streams data from Neon to ClickHouse via PeerDB](https://neon.tech/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb).

Some logs are written directly to ClickHouse, while others pass through Neon first before being replicated. This setup allows Vapi to correlate structured call data with raw logs, providing a more comprehensive view of interactions.

## Start building

Vapi makes it easy to add real-time voice AI to your apps. [Try it out](https://vapi.ai/?utm_source=partner&utm_campaign=neon-web&utm_term=neon&utm_medium=neon-web&utm_content=blog) and share what you build on [X](https://x.com/vapi_ai) and [Linkedin](https://www.linkedin.com/company/vapi-ai/).

<Admonition type="tip" title="Apply to our Agents Program">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>
