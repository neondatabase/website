---
title: Build Your Own AI Voice Assistant
description: Learn how to combine ElevenLabs with Neon by building this example app
excerpt: >-
  It’s very likely that you, like many developers today, are exploring how to
  build AI apps using the hottest tools—and one of them is definitely
  ElevenLabs. That’s why we’ve put together a guide that teaches you how to
  create an app like this—an AI voice assistant we’ve named Puls...
date: '2024-12-19T02:28:26'
updatedOn: '2025-01-30T03:34:11'
category: ai
categories:
  - ai
authors:
  - rishi-raj-jain
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/pulse-voice-assistant/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Build Your Own AI Voice Assistant - Neon
  description: >-
    Learn how to combine ElevenLabs, Neon, and Next.js by building this example
    app: an AI voice assistant that responds you in real-time.
  keywords: []
  noindex: false
  ogTitle: Build Your Own AI Voice Assistant - Neon
  ogDescription: >-
    Learn how to combine ElevenLabs, Neon, and Next.js by building this example
    app: an AI voice assistant that responds you in real-time.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/pulse-voice-assistant/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/pulse-voice-assistant/neon-voice-assistant-3-1024x576-c11493b4.jpg)

It’s very likely that you, like many developers today, are exploring how to build AI apps using the hottest tools—and one of them is definitely [ElevenLabs](https://elevenlabs.io/).

That’s why we’ve put together a [guide](https://neon.tech/guides/pulse) that teaches you how to create an app like this—an AI voice assistant we’ve named Pulse:

<video autoPlay muted controls width="1152" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/pulse-voice-assistant/pulse-2-490b2455.mp4" />
</video>

To try it,

1. Open the [demo](https://ai-pulse.vercel.app/c/1734547247350_0.5937348084340619)
2. Press the purple circle and start conversing with the AI

Here’s the repo: [https://github.com/neondatabase-labs/pulse](https://github.com/neondatabase-labs/pulse)

## Breaking down the tech stack

### ElevenLabs: The voice behind pulse

At the core of Pulse is [ElevenLabs](https://elevenlabs.io/), an AI voice synthesis platform. It’s able to create natural, human-like speech, making it perfect for applications requiring real-time text-to-speech functionality. In our project, ElevenLabs powers the real-time voice responses of Pulse.

Why we choose ElevenLabs:

- It has an API-first integration, something essential for our project
- It’s able to speak in a variety of tones and styles, making it more fun
- It has subscription-based pricing

### Neon: For persistent data storage in Postgres

Pulse wouldn’t be complete without a solution for managing and storing data—and that’s where [Neon](https://neon.tech/home) comes in. Unlike ephemeral in-memory storage or hardcoded responses, Neon provides a reliable way to persist data, ensuring that Pulse can grow in functionality over time.

<Admonition type="info" title="New to Neon?">
Neon is a serverless Postgres database with instant provisioning, autoscaling, database branching, and a generous Free plan. [Get started](https://console.neon.tech/signup) without a credit card.
</Admonition>

### Next.js: The web app framework

The front-end and back-end of Pulse are powered by Next.js. We used it for the user interface, API requests, and the real-time updates.

Why we picked Next.js:

- Granular control over client side and server-side operations in the application
- Simple API routes makes it easy to connect with ElevenLabs and Neon

## Learn how to build it

This guide will walk you through how to build an app like Pulse: [https://neon.tech/guides/pulse](https://neon.tech/guides/pulse). You can also explore [the repository](https://github.com/neondatabase-labs/pulse), and ask us any questions [in Discord.](https://discord.gg/92vNTzKDGp)

---

ElevenLabs has put together an [AI Engineer Starter Pack](https://www.aiengineerpack.com/) with discounts for many AI developer tools (including Neon). Claim your deals before they go away!

![Image](https://cdn.neonapi.io/public/images/pages/blog/pulse-voice-assistant/aiengstarterpack-1-1024x1024-fa44e4b6.jpg)
