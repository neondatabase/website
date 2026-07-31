---
title: Generate Laravel Apps from a Prompt
description: app.build now supports Laravel via a new open-source template
excerpt: >-
  At Laracon 2025, we just demoed a new way to build Laravel apps: by writing a
  prompt! app.build is an open-source reference architecture for agent codegen,
  able to generate full-stack web apps from natural language. It handles
  everything from scaffolding the project to writing te...
date: '2025-07-29T21:22:52'
updatedOn: '2025-07-31T18:17:27'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/generate-laravel-apps-from-a-prompt/cover.png
  alt: null
isFeatured: true
seo:
  title: Generate Laravel Apps from a Prompt - Neon
  description: >-
    app.build, an open-source agent that generates full-stack web apps from
    natural language, can now build Laravel apps.
  keywords: []
  noindex: false
  ogTitle: Generate Laravel Apps from a Prompt - Neon
  ogDescription: >-
    app.build, an open-source agent that generates full-stack web apps from
    natural language, can now build Laravel apps.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/generate-laravel-apps-from-a-prompt/cover.png
---

At Laracon 2025, we just demoed a new way to build Laravel apps: by writing a prompt!

[app.build](https://www.app.build/) is an open-source reference architecture for agent codegen, able to generate full-stack web apps from natural language. It handles everything from scaffolding the project to writing tests, deploying to the cloud, and wiring up a Postgres database. It’s all on GitHub:

[https://github.com/appdotbuild](https://github.com/appdotbuild)

We started with React/Node templates – and as of today, we’re adding Laravel to the list!

<figure>
<a href="https://neon.com/blog/launching-a-web-ui-for-app-build">
<img src="https://cdn.neonapi.io/public/images/pages/blog/generate-laravel-apps-from-a-prompt/screenshot-2025-07-31-at-111406percente2percent80percentafam-1024x866-ac8a6622.png" alt="Image" />
</a>
<figcaption>We also just launched a brand new <a href="https://neon.com/blog/launching-a-web-ui-for-app-build">web UI </a>– check out the open-source code for that</figcaption>
</figure>

## Laravel Meets Codegen

app.build started as a research project inside [Neon](https://neon.com/) to better support platforms using AI agents and codegen tooling. Tools like Replit already use Neon branches to let agents manage Postgres databases, and app.build helps us go deeper – allowing us to explore how these agents should behave, what kind of infra they need, and how templates shape their output.

<Admonition type="info" title="Reading material">
We’ve shared some of our learnings from building app.build on our blog. If you’re curious, start with [this post covering six principles for agent builders.](https://neon.com/blog/six-principles-for-production-ai-agents)
</Admonition>

To celebrate Laracon, and with help from the Laravel team, we’ve added a new [Laravel template](https://github.com/appdotbuild/agent/tree/main/agent/laravel_agent/template) to app.build that allows you to generate apps from a prompt. This is a great way to quickly prototype apps, bootstrap a starting point, or see what’s possible with AI agents and Laravel.

## Try it

To try it out, install the CLI and use the Laravel template:

```javascript
npx @app.build/cli --template=laravel
```

The CLI will:

1. Ask for a prompt describing your app
2. Create a private GitHub repo on your behalf
3. Generate your Laravel app with built-in tests
4. Structure the code according to Laravel best practices
5. Output instructions to deploy on Laravel Cloud

In fact, we used this same flow to build and deploy our [Laracon slide deck](https://github.com/appdotbuilder/laravel-react-slideshow) 🙂

<video autoPlay muted loop controls width="3840" height="2160">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/generate-laravel-apps-from-a-prompt/laracon-v2-f320a9b7.mp4" />
</video>

Try it and tell us what you’re building by tagging [@neondatabase](https://x.com/neondatabase) on X.

You can also contribute – we’re building app.build under the Apache 2 license, and we welcome external contributions! Feel free to send us a PR: [https://github.com/appdotbuild/agent](https://github.com/appdotbuild/agent)
