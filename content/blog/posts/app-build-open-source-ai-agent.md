---
title: 'app.build: An Open-Source AI Agent That Builds Full-Stack Apps'
description: >-
  A reference implementation for any codegen product looking to build on top of
  Neon
excerpt: >-
  Code generation has been one of the most interesting use cases for LLMs. While
  the best models can generate decent code for isolated problems, there is a big
  gap between these code snippets and fully functional applications. Agent-based
  solutions are better suited to create apps....
date: '2025-06-04T19:40:32'
updatedOn: '2025-10-01T16:46:35'
category: ai
categories:
  - ai
  - company
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/app-build-open-source-ai-agent/neon-appbuild.jpg
  alt: null
isFeatured: true
seo:
  title: 'app.build: An Open-Source AI Agent That Builds Full-Stack Apps - Neon'
  description: >-
    A reference implementation built from everything we’ve learned helping agent
    platforms scale. Use it, fork it, remix it.
  keywords: []
  noindex: false
  ogTitle: 'app.build: An Open-Source AI Agent That Builds Full-Stack Apps - Neon'
  ogDescription: >-
    A reference implementation built from everything we’ve learned helping agent
    platforms scale. Use it, fork it, remix it.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/app-build-open-source-ai-agent/neon-appbuild-1.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/app-build-open-source-ai-agent/neon-appbuild.jpg)

<Admonition type="comingSoon" title="app.build is evolving into something new">
Since publishing this post, we’ve shifted focus. The managed version of app.build has been discontinued, but the source code is available - if you’re also building an agent, you can still explore the app.build [agent](https://github.com/appdotbuild/agent) and [platform](https://github.com/appdotbuild/platform) code for reference and implementation examples. We’re also applying this learnings and code to our next project.
</Admonition>

Code generation has been one of the most interesting use cases for LLMs. While the best models can generate decent code for isolated problems, there is a big gap between these code snippets and fully functional applications. Agent-based solutions are better suited to create apps. To close the gap, an agent needs to iterate on the code, test the result and make decisions based on the feedback – either human comments or technical (like logs, test results, linters output etc.). In the last few months, a lot of AI app builders have come to market to tackle this problem, but the gap is not closed yet.

And today, we’re launching [app.build](https://app.build) – an **open-source agent that can build and deploy full-stack applications, with end-to-end tests and automated deployments**. We want to build a community around this project, since we know a lot of developers are interested in hacking in this space, particularly by bringing their own models and doing most things locally.

## How can I try it then?

```
npx @app.build/cli
```

**This very simple command is all you need to get started.**

Notice that, by default, it will ask you to sign in with GitHub. Any application that you generate will have its own repository (in your GitHub account), and will be deployed to the Internet with a real backend and a real database. This is our “managed service” experience. We’re also working on a smoother way for you to run everything locally (which will include being able to choose which models you want for which tasks, and even self-hosted models).

## Can I run this locally?

Yes, everything runs locally. Our [README.md](https://readme.md/) contains instructions for how to run this locally, but we have yet to create a full guide for running both the CLI and the agent locally with more detail.

We also want to write down instructions on how you can bring your own models (including self-hosted ones).

## What features does app.build offer?

Our CLI allows both creating new apps from scratch, and iterating on previously created apps (add new features or other types of changes). **It is extremely barebones for now!**

But our platform gives you:

- An authentication provider (it defaults to Neon Auth)
- A hosted database (it defaults to Neon Postgres)
- Your app’s frontend and backend get deployed immediately (in Neon and Koyeb’s infrastructure)
- Hosted repository on your own GitHub account

1.

## How does the agent work?

We’ve taken a lot of steps towards having an agent architecture that is focused on generating really high-quality applications that actually work as intended. This is why our agent writes end-to-end tests and actually runs them to succession as part of the generation pipeline.

Furthermore, we have a very solid base template for every app (for now, just 1 template, which is for web apps), and we made sure that the agent is extremely well-versed on all the technologies that are used in this template (Fastify, Drizzle, React, Vite, etc.).

![Image](https://cdn.neonapi.io/public/images/pages/blog/app-build-open-source-ai-agent/appbuild-1-1024x928-81e63aed.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/app-build-open-source-ai-agent/appbuild-2-1024x686-0d9ff52f.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/app-build-open-source-ai-agent/appbuild-3-1024x819-9d3a69a5.png)

Our agent follows the “divide-and-conquer” principle — app creation is decomposed into multiple tasks, and each can be solved independently. Furthermore, those tasks themselves may have their own subtasks, so we don’t rely on LLMs generating large chunks of code at once. Each particular task passes a series of checks (e.g. Does it compile? Does it pass ESLint? Does it pass tests?), thus ensuring the final app works.

In future blog posts and talks, we’ll definitely dive deeper into the inner workings of the agent.

## How can I get involved?

For now, we’re hacking over at [github.com/appdotbuild](https://github.com/appdotbuild). You can see all the code, all the commits and all of our planned tasks. We hope to create a Discord channel, and a proper public-facing roadmap soon!

We’re also currently working on more blog posts and videos explaining our code generation pipeline, and other architectural decisions we made while building the agent.
