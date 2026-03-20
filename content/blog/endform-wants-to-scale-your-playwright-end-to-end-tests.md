---
title: Endform Wants to Scale your Playwright End-to-end Tests
description: >-
  They’re building a platform that uses Lambda, Cloudflare Durable Objects, and
  Neon to run massive Playwright test suites
excerpt: >-
  “Every tech choice we make is about staying lightweight and scalable. Neon
  fits that perfectly: we can spin up real Postgres databases in CI, in seconds,
  with zero hassle.” (Oliver Stenbom, co-founder of Endform) Before starting
  Endform, Oliver spent years working at Mentimeter,...
date: '2025-05-15T23:46:42'
updatedOn: '2025-05-15T23:46:44'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/endform-wants-to-scale-your-playwright-end-to-end-tests/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Endform Wants to Scale your Playwright End-to-end Tests - Neon
  description: >-
    Endform is a platform that helps engineering teams run their end-to-end
    tests quickly, reliably, and repeatedly. Built on Neon.
  keywords: []
  noindex: false
  ogTitle: Endform Wants to Scale your Playwright End-to-end Tests - Neon
  ogDescription: >-
    Endform is a platform that helps engineering teams run their end-to-end
    tests quickly, reliably, and repeatedly. Built on Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/endform-wants-to-scale-your-playwright-end-to-end-tests/social.jpg
source:
  wpId: 9652
  wpSlug: endform-wants-to-scale-your-playwright-end-to-end-tests
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/endform-wants-to-scale-your-playwright-end-to-end-tests/neon-endform-1-1024x576-281ccc0f.jpg)

> **“Every tech choice we make is about staying lightweight and scalable. Neon fits that perfectly: we can spin up real Postgres databases in CI, in seconds, with zero hassle.”** _(Oliver Stenbom, co-founder of [Endform](https://endform.dev/))_

Before starting Endform, [Oliver](https://www.linkedin.com/in/oliverstenbom/) spent years working at [Mentimeter](https://v/), a hypergrowth company, with an engineering team that was shipping up to 80 times a day. That kind of velocity exposed some harsh bottlenecks in the current state of E2E testing: pulling this off meant running hundreds of tests per pull request, across every deploy – aka hundreds of runs per day. The team had to build custom infra just to handle it.

[This is a common wall that fast-moving teams hit](https://endform.dev/blog/the-fastest-playwright-runner), but [Endform](https://endform.dev/) is here to fix that. Designed for [Playwright](https://playwright.dev/), Endform is a platform that helps engineering teams run their end-to-end tests quickly, reliably, and repeatedly.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/endform-wants-to-scale-your-playwright-end-to-end-tests/screen-recording-2025-05-06-at-35451percente2percent80percentafpm-1bd56462.gif" alt="Image" />
<figcaption>Source endform.dev</figcaption>
</figure>

But good tooling isn’t enough if the environments under test are brittle. Fast tests need fast, repeatable environments: every part of the stack should be scalable, isolated, and quick to spin up, including the database.

## Why Endform Needed a New Database Layer

> **“We started by building on Supabase because it was really easy to get going, but eventually we realized we didn’t want to be locked in. With Neon, we get Postgres without the constraints, and full control over our infrastructure.”** _(Oliver Stenbom, co-founder of [Endform](https://endform.dev/))_

When the Endform team first started building, they chose Supabase. It offered Postgres (the DB of choice for the founders) and a quick setup, a good match for a scrappy early-stage team. But they quickly wondered of the tradeoffs of being locked into Supabase’s suite early on.

Authentication was especially problematic. The Endform team wanted to keep the freedom to choose their own auth provider (they now use [Better Auth](https://www.better-auth.com/)) but Supabase favoured coupling auth to its managed stack, and heavily using row-level-security. That constraint made the team reconsider their entire infrastructure: because once auth was decoupled, the database layer was up for debate.

Both founders had years of experience with Postgres, but preferred something that kept the overhead of managing Postgres at a minimum. That’s when they chose Neon. The team had used Neon at a previous company and knew it could deliver the right blend of performance, scale, and simplicity.

Neon didn’t force any particular auth model or infrastructure choices: it was just Postgres but serverless and developer-first.

## How Endform Uses Neon Today

> **“I caught a broken migration thanks to a Neon branch that mirrored production. That bug would’ve made it to prod in any other setup”** _(Oliver Stenbom, co-founder of [Endform](https://endform.dev/))_

Switching away from Supabase also opened the door to smarter workflows. For example, Endform could now start experimenting with Neon’s branching model to create ephemeral databases tied to every pull request.

Here’s a high-level view of their setup:

- Every PR gets its own Neon branch, spun up via [Alchemy](https://github.com/sam-goodwin/alchemy), a new Typescript-native infrastructure-as-code tool that the Endform team is loving.
- These branches serve as the backing database for integration and end-to-end tests, both in CI and locally.
- Branches include data from the parent branch, which helps catch issues that wouldn’t surface in empty test databases (e.g, a missing default on a NOT NULL column, _true story_).
- Developers can test locally using the same infrastructure that runs in CI. No need to wait for GitHub Actions.
- Temporary infra is tied together with [linkup](https://github.com/mentimeter/linkup/) to give each branch a complete environment.

## The Architecture: Serverless, Fast, Built for Scale

> **“Weave together a few lightweight primitives (Neon branches, Hyperdrive URLs, Workers) and you get a setup where there’s just no excuse for breaking prod.”** _(Oliver Stenbom, co-founder of [Endform](https://endform.dev/))_

Endform’s infrastructure is optimized for two things: speed and scale. Their platform needs to spin up thousands of browser sessions in parallel, run full end-to-end tests, and coordinate it all across ephemeral environments, without bloated DevOps around.

Here’s how they do it:

- **Browsers run on AWS Lambda.** Endform launches hundreds to thousands of Playwright browser instances per test run. Lambda scales well, yet has the wide operating system access needed to run browsers.**Cloudflare powers the rest.** The frontend is deployed as a Cloudflare Worker. Communication between components flows through Durable Objects, which orchestrate test execution and browser coordination.
- **Neon is the backing database.** Customers, organizations, test runs, suite definitions live in Neon. Branches are provisioned dynamically for each PR, and used across integration and end-to-end tests.
- **Alchemy ties it together.** Endform uses [Alchemy](https://www.alchemyinfra.dev/) to define infrastructure programmatically. One pull request triggers:
  - A Neon branch
  - A Cloudflare Worker with a unique Hyperdrive connection
  - A fully wired environment, all provisioned in seconds

## Looking Ahead

Endform is building the fastest way to run end-to-end Playwright tests, and Neon is a key part of that equation. If you want to experiment with the same kind of workflow, [Neon’s free plan](https://neon.tech/pricing) it’s a great place to start. [Give it a try](https://console.neon.tech/signup), you don’t need a credit card.

<Admonition type="tip" title="Join Endform’s Waitlist">
If you're running end-to-end tests with Playwright, [request access to join Endform’s waitlist](https://endform.dev/) and experience what reliable, production-grade testing can feel like.
</Admonition>
