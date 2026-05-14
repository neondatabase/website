---
title: app.build Can Now Build Python Data Apps
description: Generate data apps and dashboards in seconds
excerpt: >-
  When we started working on app.build, we knew in the longer run we wanted to
  build a generic agent that could build apps with different “coding stacks”.
  However, for our first release and initial announcement, we could only build
  apps written with a single fixed stack: In the rec...
date: '2025-07-18T15:08:01'
updatedOn: '2025-10-02T00:17:33'
category: product
categories:
  - product
  - ai
authors:
  - arseni-kravchenko
  - david-gomes
  - pedro-figueiredo
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/app-build-can-now-build-python-data-apps/cover.jpg
  alt: null
isFeatured: false
seo:
  title: app.build Can Now Build Python Data Apps - Neon
  description: >-
    app.build now supports Python, enabling you to build data applications and
    ML dashboards with a modern Python stack.
  keywords: []
  noindex: false
  ogTitle: app.build Can Now Build Python Data Apps - Neon
  ogDescription: >-
    app.build now supports Python, enabling you to build data applications and
    ML dashboards with a modern Python stack.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/app-build-can-now-build-python-data-apps/social.png
---

<Admonition type="comingSoon" title="app.build is evolving into something new">
Since publishing this post, we’ve shifted focus. The managed version of app.build has been discontinued, but the source code is available - if you’re also building an agent, you can still explore the app.build [agent](https://github.com/appdotbuild/agent) and [platform](https://github.com/appdotbuild/platform) code for reference and implementation examples. We’re also applying this learnings and code to our next project.
</Admonition>

![Post image](https://cdn.neonapi.io/public/images/pages/blog/app-build-can-now-build-python-data-apps/ad4nxfqab9g0mxpa8aksmys7qf6gynm0m-exeqooxvvvmvumrydokemtrmrcxasw1vf-l6wvqagiazsqa4dlxyh54k8rrrfzyhjvkisrddbjj-wcikpxcmwvrakltolqdi-75de0oiw-265fb0d1.png)

When we started working on [app.build](https://app.build), we knew in the longer run we wanted to build a generic agent that could build apps with different “coding stacks”. However, for our first release and initial announcement, we could only build apps written with a single fixed stack:

- React + Vite + Tailwind CSS + Radix UI for frontend;
- tRPC + Fastify for backend;
- Postgres + DrizzleORM for data persistence.

In the [recent blog post on design decisions](https://www.app.build/blog/design-decisions), we elaborated why we introduced those restrictions in the first place.

But our original implementation was designed to be extendable. For that reason, we’ve been eager to add new supported stacks to app.build. Today we’re announcing we got a new one – data apps based on a modern Python stack with the [NiceGUI](https://nicegui.io/) framework.

NiceGUI has many built-in features for data visualization, making it a solid default choice for data apps – e.g. dashboards or ML demos. NiceGUI apps we build are also more flexible compared to the tRPC apps we supported before. While not as visually polished initially, they are more functional – our agent adapts to user requirements and adds specific Python libraries if needed.

Unlike some alternative frameworks like Streamlit, NiceGUI apps are more production-ready – they’re basically FastAPI under the hood, so there are no problems with concurrent usage, state management, and testing. And, of course, app.build’s NiceGUI apps use PostgreSQL for persistent storage! You can find the base template [here on GitHub](https://github.com/appdotbuild/agent/tree/e9a4503ab3dc61ebb6357daa004c71b8cb4def58/agent/nicegui_agent/template).

Unlike tRPC apps, this new NiceGUI stack is more suitable for internal enterprise apps – such as dashboards, tech demos and other glue. For now, users can leverage from the rich Python ecosystem to add new libraries. We aim to add more advanced integrations supported in this stack similar to how we treat PostgreSQL as first class addition, starting with Databricks Unity Catalog. However, those integrations will stay optional, so app.build stays friendly to any customizations for your specific needs.

Here’s an example of an app that was generated with Python+NiceGUI:

<video autoPlay muted loop width="3022" height="1796">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/app-build-can-now-build-python-data-apps/cleanshot-2025-07-03-at-213904-5f9a1d38.mp4" />
</video>

Another example of the [app created by app.build](https://github.com/appdotbuilder/stock-tracker) on Python template leveraging real Yahoo Finance API to fetch up-to-date data has been deployed to [https://app-0e0689a4-d17d-465f-a5d4-f4f80a0a4595.build.myneon.app/](https://app-0e0689a4-d17d-465f-a5d4-f4f80a0a4595.build.myneon.app/) as interactive demo.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/app-build-can-now-build-python-data-apps/ad4nxegjbe27zf6pgssf8zjiaep3sn1b9kiosdoo4rbvrwksngof9pjtxwhxtesgbxicoob0lrasem1mgx6ffbwamu-njq2ajypav1zcqn7denlbadnvc3q9ifzq6wu-64in-3lyxq-c6eb741d.png)

To create your own NiceGUI app like that, just run `npx @app.build/cli --template=python`.

Our approach to generating the apps requires proper scaffolding – we start with a polished default template and a set of validation checks to establish the feedback loop for the agent. Despite it taking way more time than just vibe-coding an app in any stack one can imagine, those efforts pay off very soon – once the stable scaffolding is ready, those apps’ quality becomes acceptable for typical usage scenarios.

We aim to support a limited but well-curated set of stacks for various needs. A little sneak peek: we’re working on the third stack to add to the collection. Stay tuned for the new announcements and technical details posts!

---

_This blog post was originally published in the [app.build blog](https://www.app.build/blog/appbuild-can-now-build-python-data-apps)._
