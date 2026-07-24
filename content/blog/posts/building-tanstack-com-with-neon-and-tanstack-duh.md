---
title: Building TanStack.com with Neon and TanStack (duh)
description: 'Combining TanStack Start, TanStack Query, Drizzle, and Neon'
excerpt: >-
  “Neon was so easy to get started, and it worked flawlessly with TanStack Start
  and TanStack Query. When you start a new project with TanStack Start and
  select Neon in the CLI, you get a working database instantly and later you can
  go claim it, which is one of the coolest things I...
date: '2026-01-20T17:17:15'
updatedOn: '2026-01-20T17:20:32'
category: product
categories:
  - product
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-tanstack-com-with-neon-and-tanstack-duh/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Building TanStack.com with Neon and TanStack (duh) - Neon
  description: >-
    What better proof than production? See how the TanStack team runs
    tanstack.com using Neon, TanStack Start, and TanStack Query.
  keywords: []
  noindex: false
  ogTitle: Building TanStack.com with Neon and TanStack (duh) - Neon
  ogDescription: >-
    What better proof than production? See how the TanStack team runs
    tanstack.com using Neon, TanStack Start, and TanStack Query.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-tanstack-com-with-neon-and-tanstack-duh/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-tanstack-com-with-neon-and-tanstack-duh/neon-object-storage-1024x576-7091f146.jpg)

<blockquote>
<p><strong>“Neon was so easy to get started, and it worked flawlessly with TanStack Start and TanStack Query. When you start a new project with TanStack Start and select Neon in the CLI, you get a working database instantly and later you can go claim it, which is one of the coolest things I’ve seen” </strong><br></br><br></br>(<a href="https://x.com/tannerlinsley?s=20">Tanner Linsley</a>, founder of <a href="https://tanstack.com/">TanStack</a>)</p>
</blockquote>

[TanStack](https://tanstack.com/) is one of the most exciting projects in web development right now, and it’s never been a secret that we’re fans (we’re actually one of its [partners](https://tanstack.com/partners?status=active)). **Recently, everything came full circle: the TanStack team also started using Neon to power [tanstack.com](http://tanstack.com) itself**, which turned out to be a great way to test the TanStack stack + Neon developer experience. Teaser: it didn’t disappoint.

## In case you don’t know TanStack yet…

TanStack is an open-source ecosystem of tools for building modern web applications that started as a few focused libraries and has now grown into a cohesive stack used by teams building all kinds of things, from side projects to large production apps.

<video autoPlay muted loop width="3456" height="1722">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/building-tanstack-com-with-neon-and-tanstack-duh/tanstackdotcom-0b952971.mov" />
</video>

We invite you to [explore the tools](https://tanstack.com/) and [take a look what people are building with them](https://tanstack.com/showcase?page=1), but here’s a flash list of what’s available today – with many more things in the works:

- [TanStack Start](https://tanstack.com/start/latest), a full-stack framework for React and Solid
- [TanStack Router](https://tanstack.com/router/latest), type-safe routing for React and Solid
- [TanStack Query](https://tanstack.com/query/latest), for data fetching, caching, and synchronization across client and server
- [TanStack Table](https://tanstack.com/table/latest), a headless UI for building data grids and tables
- [TanStack DB](https://tanstack.com/db/latest), client-side database that works beautifully with the rest of the ecosystem
- [TanStack AI](https://tanstack.com/ai/latest), a framework-agnostic AI SDK for building AI features
- [TanStack Form](https://tanstack.com/form/latest), a headless UI for building performance and type-safe forms
- [TanStack Virtual,](https://tanstack.com/virtual/latest) a headless UI for rendering large data sets efficiently
- [TanStack Pacer](https://tanstack.com/pacer/latest), utilities for scheduling, rate-limiting, and controlling async work
- [TanStack Store](https://tanstack.com/store/latest), a framework-agnostic data store,
- and [TanStack Devtools](https://tanstack.com/devtools/latest), a devtool panels for inspecting and debugging TanStack apps<br />

<figure>
<video autoPlay muted loop width="3456" height="2094">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/building-tanstack-com-with-neon-and-tanstack-duh/tanstack-showcase-f6181a7d.mov" />
</video>
<figcaption>Check out the showcase</figcaption>
</figure>

Across these libraries, TanStack follows a consistent set of principles:

- Strong type safety by default
- Composable, headless primitives over rigid abstractions
- Framework awareness without lock-in
- Tooling that scales with real applications, not demos

TanStack is possible thanks to a core team of sponsored open-source maintainers supported by a much larger group of contributors from around the world. [Shoutout to them](https://tanstack.com/maintainers?viewMode=compact&groupBy=none&sortBy=none).

<Admonition type="important" title="Neon Open Source Program">
If you’re also building an open source project that uses Postgres, we’re happy to help you scale. [Apply to our open source program](https://neon.com/programs/open-source) to get credits, referral payouts, and marketing support.
</Admonition>

## Running the stack (plus Neon) to power tanstack.com

Of course, [tanstack.com](http://tanstack.com) became the obvious place to put TanStack itself to the test. The site isn’t just a simple marketing page – it hosts TanStack’s documentation and community resources, serving millions of visitors per year.

What’s behind it:

- At the core is TanStack Start, which TanStack uses as the full-stack framework driving the site. Start handles routing, server functions, and rendering, while keeping everything type-safe end to end.
- On the data side, TanStack Query powers client and server data fetching, caching, and synchronization.
- For persistence, the team uses [Neon](https://neon.com/) with [Drizzle](https://orm.drizzle.team/), backing many pieces of the site – e.h. authentication tables, TanStack Stats (which caches and serves npm download data), and the community showcase where users can submit and browse projects built with TanStack.

The architecture itself is intentionally straightforward: a serverless, lambda-style runtime, React on the frontend, and Postgres on the backend.

Being just Postgres, Neon fit well into the TanStack stack since the start, but a few things stood out that made the experience especially smooth:

- **Works seamlessly with TanStack Start and TanStack Query,** without requiring any special adapter or workarounds.
- **Instant setup, no friction.** When starting a new TanStack project, selecting Neon immediately provisions a working Postgres database. You can build with it right away, and if you decide to keep it, you simply claim the database later. Is that easy.
- **No need to manually provision or configure anything.** In Neon, compute autoscaling does the job of resizing the database and storage scales as needed. It’s pretty much _set it and forget it._
- **Branching for DX.** The TanStack team takes advantage of Neon [branches](https://neon.com/docs/introduction/branching) for development, including [schema-only branches](https://neon.com/docs/guides/branching-schema-only) with no data.
- **Compatibility with AI-assisted coding.** Much of the TanStack site was built using AI coding tools like Claude Code, which proved very good working with Neon.

## Give it a try

If you want to try the same setup, go ahead and give it a go. [Run TanStack Start](https://tanstack.com/start/latest) and select Neon in the CLI, experiment for a while, and if it clicks, claim your database, and keep going.

<Admonition type="important" title="Add a claimable DB to your own OSS project or framework">
The claimable Neon database experience that TanStack offers is built on [Instagres](https://neon.new/). This setup makes it easy to embed a claimable database flow to open-source projects and frameworks, so your end users can get a working database instantly, no signup required. [Check out the Instagres docs to learn more.](https://neon.com/docs/reference/instagres)
</Admonition>
