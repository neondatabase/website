---
title: Why we built app.build
description: A reference architecture for agent-built applications
excerpt: >-
  LLMs are fantastic at code generation. They can produce hundreds of lines of
  code, entire functions and components, that compile perfectly, implement
  complex algorithms elegantly, and even follow best practices for style and
  structure. They suck at full-blown software generation,...
date: '2025-08-25T15:55:20'
updatedOn: '2025-10-01T16:43:50'
category: ai
categories:
  - ai
authors:
  - arseni-kravchenko
  - pedro-figueiredo
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-we-built-app-build/cover.jpg
  alt: Post image
isFeatured: true
seo:
  title: Why we built app.build - Neon
  description: >-
    app.build is our open-source reference architecture for agents, inspired by
    our work with partners and lessons learned along the way.
  keywords: []
  noindex: false
  ogTitle: Why we built app.build - Neon
  ogDescription: >-
    app.build is our open-source reference architecture for agents, inspired by
    our work with partners and lessons learned along the way.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-we-built-app-build/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/why-we-built-app-build/neon-why-appbuild-1024x576-08ad9f14.jpg)

<Admonition type="comingSoon" title="app.build is evolving into something new">
Since publishing this post, we’ve shifted focus. The managed version of app.build has been discontinued, but the source code is available - if you’re also building an agent, you can still explore the app.build [agent](https://github.com/appdotbuild/agent) and [platform](https://github.com/appdotbuild/platform) code for reference and implementation examples. We’re also applying this learnings and code to our next project.
</Admonition>

LLMs are fantastic at code generation. They can produce hundreds of lines of code, entire functions and components, that compile perfectly, implement complex algorithms elegantly, and even follow best practices for style and structure.

They suck at full-blown software generation, though. Production-ready software is more than a couple of files of code. It requires consistent architecture across dozens of files, database schemas that match API endpoints that match frontend types, authentication, error handling, tests, configs, deployment pipelines.

## Learning from experience

[Neon](https://neon.com/use-cases/ai-agents) has been a backend for agents from the start, beginning with [Replit](https://replit.com/) and continuing with [Create.xyz/Anything](https://neon.com/blog/anything-the-new-ai-agent-for-building-mobile-and-web-apps), [Databutton](https://neon.com/blog/databutton-neon-integration), and [many others.](https://neon.com/blog/dyad-brings-postgres-to-local-ai-app-building-powered-by-neon) Along the way, we’ve learned what agents really need to produce true production-ready apps reliably, and [app.build](https://www.app.build/) is our way of open-sourcing those learnings.

[app.build](https://app.build) is a reference architecture for anyone building AI-native systems. It’s an agent that generates complete applications with real backends, real databases, proper testing, and automated deployments. You can, of course, play with it as an agent – but the most interesting piece of app.build is [the code.](https://github.com/appdotbuild/agent) We designed it to explore and demonstrate how developers and agent builders can use Neon’s backend to build codegen tools, evolving from LLM code generation to full-stack applications with CI/CD, auth, and real deployments.

## Code gen needs to move from code snippets to shipped software

Why did we think it was important to open source this full-stack approach?

First, many AI codegen platforms today are optimized for speed (build the next line, the next block), not for producing a coherent product. That leads to two big problems that ultimately affect the quality of the outcome:

### Demo-driven development

Most AI coding tools celebrate when the code compiles or when a component renders. But compilation is the bare minimum. Software needs to handle edge cases, validate inputs, recover from failures, and persist data somewhere. The gap between “look, it renders!” and “users can rely on this” is massive, and it’s precisely where current tools abandon you. We’re trying to improve upon this.

### Frontend bias

Open any AI app builder, and you’ll get beautiful UI components in seconds. But where’s the data going? We saw that the backend is an afterthought. This makes sense for demos and small apps, but is useless for real applications. You need proper data modeling, transaction handling, query optimization, and all the unsexy backend work that makes software useful (and we at Neon love).

These issues make the journey from npm run dev to a working application a slog through slop. It may look working, but every implicit error will bite you later.

## The missing scaffolding

With app.build, we want to explore a different approach, inspired by the user feedback we’re hearing from our partners. When app.build generates an application, depending on the template you select, it creates:

- A complete repository in GitHub with proper project structure and separation of concerns
- Backend API handlers with full CRUD operations connected to a real Postgres database through Drizzle ORM
- Type-safe APIs using tRPC that ensure frontend–backend consistency
- Comprehensive test suites, including unit tests for handlers and Playwright end-to-end tests
- Linters flagging anti-patterns in the code on early stages
- Automated deployments with real hosting and proper database provisioning on Neon
- Authentication providers pre-configured and ready to use
- Authorization flows through imperative logic in handlers

The result is a production-ready application, deployed and tested, backed by Git/Github for version control and immediate use by real users.

## Stack agnosticism by design

Our first release deliberately constrained the stack: TypeScript, React, Fastify, Drizzle, and tRPC. That wasn’t because we think the world should standardize on that setup, it was to prove the model. A narrow foundation gave us reliability, repeatability, and confidence that the agent could ship working apps end-to-end.

Because our vision for app.build has always been any language, any framework. Developers should be able to bring their own stack, and the agent should handle the universal complexities: infrastructure, deployment, scaling, database provisioning, authentication.

The architecture reflects that ambition:

- Finite State Machines (FSM) that abstract away stack-specific details into configurable actors
- Validation pipelines are modular, so they can adapt to different languages and frameworks
- Template-based generation means new stacks can be added without reworking the core agent

This isn’t just theoretical, it’s already happening. Since the React + tRPC launch, [app.build now supports Python apps with FastAPI](https://neon.com/blog/app-build-can-now-build-python-data-apps) and NiceGUI, and PHP applications with [Laravel](https://neon.com/blog/using-app-build-to-create-production-ready-laravel-apps). Adding new stacks helps us separate what’s universal and what’s niche, enforcing code modularity and reusability. Also we’re learning the hard way that some stacks are way more AI-codegen friendly than the others, and that’s why we appreciate strong static typing.

More stacks will follow, but only once we’re confident the agent can generate, test, and deploy software in that environment reliably. Not only stacks – we also experiment with additional integrations available for every stack.

## Proving it in production

Every generated app provisions a real Neon database, hits real quotas, and runs on the same infrastructure our partners use. That scale quickly surfaced both opportunities and challenges that mirror what real agent workloads look like:

- Hundreds of ephemeral databases being created daily, each with its own connection pools, branches, and compute endpoints
- Documentation gaps becoming obvious when the agent struggled with specific configurations
- Performance bottlenecks showing up only under heavy, sustained load

These challenges drove immediate improvements in our approach:

- We optimized app.build’s database provisioning patterns to be more efficient
- Documentation gaps were identified and fixed when our own agent struggled with specific configurations. This mainly meant writing better prompts for our product: [https://neon.com/docs/ai/ai-rules](https://neon.com/docs/ai/ai-rules).
- Performance bottlenecks that only appeared under heavy, sustained load were discovered and addressed in app.build’s code
- Adapting Neon Auth endpoints to be Agentic friendly

Every day, agents running on Neon show us what matters most, and app.build packages those lessons into a working reference architecture. And it also works the other way around – app.build is also a great proving ground to battle-test new capabilities before they reach general availability in Neon.

## Teaching agents how to build software, not just write code

app.build encapsulates our agent philosophy: AI codegen should aim higher than producing impressive prototypes. AI has the potential to reshape software development, but to do so, it must generate software you can actually ship.

By focusing on complete applications, stack flexibility, and Neon’s production-proven backend, app.build bridges the gap between what LLMs are great at (generating code) and what developers actually need: deployed, tested, production-grade software. If you’re interested in building agents like this, play with [app.build](https://app.build) and [explore its code](https://github.com/appdotbuild/agent).
