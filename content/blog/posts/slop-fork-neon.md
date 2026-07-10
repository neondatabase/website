---
title: "I Slop Forked Neon. You Should Too."
description: >-
  In the agentic era, APIs are the product. I gave my coding agent the Neon API, our OpenAPI spec, and the TypeScript admin SDK, and asked it to rebuild the Neon dashboard. Meet Neon Slop Fork.
excerpt: >-
  Agents are much better at using APIs, CLIs, and MCP servers than clicking
  through dashboards. That's why APIs matter even more in the age of agents.
  At Neon, we aim to expose all platform functionality through our open API —
  if you see an action in our console, the associated endpoint should be open
  too. To illustrate this, I slop forked the Neon console.
date: "2026-06-03T12:00:00"
updatedOn: "2026-06-03T12:00:00"
category: ai
categories:
  - ai
  - app-platform
  - product
authors:
  - andre-landgraf
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/slop-fork-neon/cover.png
  alt: Dark blog cover graphic with the Neon logo and the headline "I Slop Forked Neon. You Should Too."
isFeatured: false
seo:
  title: "I Slop Forked Neon. You Should Too. - Neon"
  description: >-
    In the agentic era, APIs are the product. I rebuilt the Neon dashboard
    with a coding agent using only the Neon public API. Here's why every
    developer platform should be agent-native — and how you can fork it.
  keywords: []
  noindex: false
  ogTitle: "I Slop Forked Neon. You Should Too. - Neon"
  ogDescription: >-
    In the agentic era, APIs are the product. I rebuilt the Neon dashboard
    with a coding agent using only the Neon public API. Here's why every
    developer platform should be agent-native — and how you can fork it.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/slop-fork-neon/cover.png
---

<Admonition type="info" title="slopfork">
*/ˈslɑpˌfɔrk/* — A hastily produced software clone that imitates the surface features, design language, or "vibe" of an existing product while lacking architectural rigor, security hardening, or production readiness.

— [slopfork.dev](https://www.slopfork.dev/)
</Admonition>

Agents are changing how we build software and how we interact with developer tools. Agents are much better at using APIs, CLIs, and MCP servers than clicking through dashboards.

They *can* use UIs. Tools like [agent-browser](https://github.com/vercel-labs/agent-browser) are getting pretty good. But navigating complex dashboards is still slower, more fragile, and harder than giving an agent an API key and letting it use programmatic tools directly.

That's why APIs matter even more in the age of agents. The best developer platforms are becoming agent-native by exposing functionality through:

- REST APIs
- CLIs
- MCP servers
- SDKs

This means agents can become far more autonomous. They can provision resources, inspect state, automate workflows, and manage infrastructure without needing to "drive" a UI or ask their human to provision and manage infrastructure for them. With the [auth.md](https://workos.com/auth-md) spec, agents can even sign up for services themselves.

This is already happening everywhere:

- [Salesforce](https://www.salesforce.com/news/stories/salesforce-headless-360-announcement/) is pushing hard into APIs and agents with Salesforce headless.
- [Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/announcing-official-mcp-support-for-google-services) is investing heavily into MCP and agent tooling.
- [X](https://x.com/chrisparkX/status/2040770361566826685) recently announced their own MCP server.

Following the same line of thinking — creating the best possible developer and agent experience — at Neon, we aim to expose all platform functionality through our open API. If you see an action in our Neon console, we should also have the associated endpoint be open as well. Going even further, we're releasing APIs for things that aren't even exposed through the console yet — like our new [consumption metrics API](https://neon.com/docs/guides/consumption-metrics). To illustrate this, I slop forked the Neon console.

## Meet Neon Slop Fork

![Screenshot of the Neon Slop Fork dashboard showing the branch overview for the "my-app" project — compute, storage, history, and network transfer metrics, plus the primary compute and connect button.](https://cdn.neonapi.io/public/images/pages/blog/slop-fork-neon/dashboard.png)

- Live demo: [Neon Slop Fork](https://neon-slop-fork.vercel.app/)
- Source code: [GitHub Repository](https://github.com/andrelandgraf/neon-slop-fork)

I gave my coding agent:

- the [Neon public API](https://neon.com/docs/reference/api-reference)
- our [OpenAPI spec](https://neon.com/api_spec/release/v2.json)
- the [TypeScript admin SDK](https://neon.com/docs/reference/typescript-sdk)
- a few screenshots of the Neon console

Then I told it: "Go recreate the Neon dashboard — make no mistakes."

And no mistakes it did.

The fork supports:

- project management
- branch creation
- compute controls
- consumption views
- Neon Auth
- Data API
- and more

I skipped billing, payments, and team management because that would require integrating email flows and Stripe APIs. Everything else is powered directly through Neon APIs.

## How I built it

All it took was a few prompts and tools:

- **[Cursor](https://cursor.com/)** as the coding agent. Any SOTA coding agent should get you to the same place — pick whichever one you already pay for.
- **[agent-browser](https://github.com/vercel-labs/agent-browser)** as a tool the agent could call to drive a real browser, click around the live Neon console, and compare what it had built against it.

I started with a few setup prompts to scaffold the repo (create a public GitHub repo, drop in Next.js + Better Auth + a small meta DB for virtual orgs and users, point it at my real Neon org, deploy to Vercel). Then one main prompt:

> Clone the Neon console end-to-end on top of the public API. No shortcuts, no mocks. If the public API can't do something, disable the button. Use agent-browser to verify each screen against the real Neon dashboard before you say you're done.

Then, of course, I had to follow up with a few short fix prompts to make it feel finished:

- Add spinners or skeletons for loading UIs so nothing feels frozen.
- Gray out anything the public API doesn't cover (sign in with GitHub, billing, team invites).
- Fix the reflow in Backup & Restore.
- Match the sidebar tabs to the real Neon console — drop the ones we don't have, line up the ones we do.
- Inspect Neon's branch-creation modal with agent-browser and port the *previous data* and *TTL* options over.

Rough totals:

- About 20 prompts.
- ~6M input tokens and ~300k output tokens. Most of the spend is input.
- ~$100 in Claude Opus credits, give or take.
- Around half a Saturday afternoon.

I almost certainly did more than I needed to. You can easily one-shot a workable version with 1-2 prompts and 1-2 hours of agent run time.

`agent-browser` or similar tools for letting the agent navigate both the real and slop-forked dashboards allow the agent to verify and fix more autonomously, which has been a huge unlock for longer and more successful agent runs for me.

## Why to slop fork

First, it's a pretty cool demonstration of how capable the Neon API already is. You can build a fully custom dashboard on top of Neon today. That's important not only because of agent-access but also because Neon itself is used as infrastructure behind other platforms.

For example:

- Vercel's [Neon Marketplace Integration](https://vercel.com/marketplace/neon)
- Netlify DB is powered by Neon
- Replit uses Neon for Serverless Postgres
- Laravel Cloud uses Neon as well

Those platforms manage fleets of Neon databases through the same APIs you can access yourself.

So why not build your own management surface too?

### Slop forks as product prototyping

This gets even more interesting internally. A slop fork is actually a very fast way to prototype product ideas. For example, we're currently exploring object storage capabilities at Neon. With a fork like this, it becomes trivial to experiment with:

- new UI concepts
- dashboard layouts
- workflows
- resource management experiences

Then see how it feels. That feedback loop is much faster than local development on the real Neon console codebase.

### Build your own Neon dashboard

The fun part is that this idea is not limited to Neon employees. You can fork this project and build your own custom Neon dashboard around your workflow.

Maybe you want:

- tighter integrations with your own tooling
- custom observability views
- internal deployment workflows
- simplified controls for your team
- AI-native workflows
- or a completely different UX philosophy

Go build it! And if you think the official Neon console should work differently, tell us. We genuinely want that feedback — drop into the [Neon Discord](https://discord.gg/HjupxCjXXp) and let us know what's missing.

But sometimes the best workflow for *you* is highly specific to your own projects and infrastructure. APIs make that possible. 

In the agentic era, APIs are the product.

With that said: slop fork Neon and happy prompting!