---
title: Launching a Web UI for app.build
description: Build and deploy full-stack apps from your browser
excerpt: >-
  We’re very excited to announce that app.build is launching a web interface
  that builds and deploys React, Laravel or FastAPI applications with zero
  configuration required! Just visit the website, type your prompt, and we’ll
  get your app built and deployed: This makes the experien...
date: '2025-07-31T17:55:47'
updatedOn: '2025-10-01T16:45:09'
category: product
categories:
  - product
  - ai
authors:
  - david-gomes
  - victor-ditadi
  - mario-cadenas
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/launching-a-web-ui-for-app-build/cover.png
  alt: null
isFeatured: false
seo:
  title: Launching a Web UI for app.build - Neon
  description: >-
    app.build is launching a web interface that builds and deploys React,
    Laravel or FastAPI applications with zero configuration required.
  keywords: []
  noindex: false
  ogTitle: Launching a Web UI for app.build - Neon
  ogDescription: >-
    app.build is launching a web interface that builds and deploys React,
    Laravel or FastAPI applications with zero configuration required.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/launching-a-web-ui-for-app-build/cover.png
---

<Admonition type="comingSoon" title="app.build is evolving into something new">
Since publishing this post, we’ve shifted focus. The managed version of app.build has been discontinued, but the source code is available - if you’re also building an agent, you can still explore the app.build [agent](https://github.com/appdotbuild/agent) and [platform](https://github.com/appdotbuild/platform) code for reference and implementation examples. We’re also applying this learnings and code to our next project.
</Admonition>

We’re very excited to announce that [app.build](https://app.build) is launching a web interface that builds and deploys React, Laravel or FastAPI applications with zero configuration required! Just [visit the website](https://app.build/), type your prompt, and we’ll get your app built and deployed:

<video autoPlay muted loop width="1236" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/launching-a-web-ui-for-app-build/appdotbuild-web-ui-2693b365.mp4" />
</video>

This makes the experience of trying app.build much easier.

## A refresher on app.build

If you’re unfamiliar with app.build, it is an open-source AI agent that builds and deploys apps. We built it as a [reference implementation for agent builders](https://neon.com/blog/app-build-open-source-ai-agent), acting as an architecture template:

[https://github.com/appdotbuild/](https://github.com/appdotbuild/agent)

App.build supports three different “tech stacks” as of now:

- React + tRPC
- Laravel (PHP) – [Brand new](https://neon.com/blog/generate-laravel-apps-from-a-prompt)
- FastAPI + NiceGUI (Python)

In the beginning, we decided to build a CLI as we thought it would be much easier than shipping a complete Web UI. In retrospect, however, it is now clear to us that:

1. Web UIs are much more generally useful to most people
2. It is actually easier to build a decent web UI than it is to build a proper CLI. CLIs are hard to get right!

## What’s next?

We want to make a number of improvements to our web UI including a full preview of the app you’re working on. Here’s a quick tease of what that might look like in the future:

<video autoPlay muted loop width="2768" height="1448">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/launching-a-web-ui-for-app-build/preview-830ef960.mov" />
</video>

Also, **we will be deprecating our CLI.** We simply cannot maintain both the UI and the CLI working at the same time, even though they use the same backend API. Very soon, the CLI will not be functional anymore.

## App Generation Tech Stacks

Our biggest focus is the “React + tRPC” stack which uses [Neon](https://neon.com/) for persistent storage and [Neon Auth](https://neon.com/docs/neon-auth/overview) for authentication. Having said that, our agent is quite generic and we can, and will, add more tech stacks in the future. We do not want to be locked in to “Neon” in our tech stacks, as we are an open-source which aims to cater to more people.

The agent will not only develop an app with the tech stack of your choice, but it will also deploy it to a real-life **\*.myneon.app URL**. In the near future, we’ll also start supporting multiple deployment platforms for each tech stack. As an example, we’d like to be able to deploy Laravel apps to Laravel Cloud as well.

**Give the web UI a try here**: [app.build](https://app.build). It is mobile-friendly too!

We welcome any feedback and contributions. Please, send it over [via GitHub](https://github.com/appdotbuild/platform/) or [our Discord](https://discord.com/channels/1176467419317940276/1380858381404737537)!
