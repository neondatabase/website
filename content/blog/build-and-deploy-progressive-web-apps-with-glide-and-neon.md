---
title: Build and deploy progressive web apps with Glide and Neon
description: >-
  The easiest way to build custom interfaces and dashboards for managing
  Postgres data
excerpt: >-
  Neon makes it easy to get scalable, fully-managed Postgres instances up and
  running. It’s a dream for software developers. But what if you need to let
  non-technical users manage your Postgres data? SQL clients are overwhelming,
  and it takes too long to code something from scratch...
date: '2024-02-07T16:02:42'
updatedOn: '2024-02-29T11:24:07'
category: community
categories:
  - community
authors:
  - andy-claremont
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-progressive-web-apps-with-glide-and-neon/cover.png
  alt: null
isFeatured: false
seo:
  title: Build and deploy progressive web apps with Glide and Neon - Neon
  description: >-
    The easiest way to build custom interfaces and dashboards for managing
    Postgres data
  keywords: []
  noindex: false
  ogTitle: Build and deploy progressive web apps with Glide and Neon - Neon
  ogDescription: >-
    Neon makes it easy to get scalable, fully-managed Postgres instances up and
    running. It’s a dream for software developers. But what if you need to let
    non-technical users manage your Postgres data? SQL clients are overwhelming,
    and it takes too long to code something from scratch. Thankfully, those
    aren’t your only options. You can give […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-progressive-web-apps-with-glide-and-neon/cover.png
source:
  wpId: 4520
  wpSlug: build-and-deploy-progressive-web-apps-with-glide-and-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-progressive-web-apps-with-glide-and-neon/image-6-1024x576-355f5718.png)

Neon makes it easy to get scalable, fully-managed Postgres instances up and running. It’s a dream for software developers. But what if you need to let non-technical users manage your Postgres data?

SQL clients are overwhelming, and it takes too long to code something from scratch.

Thankfully, those aren’t your only options.

You _can_ give your users the freedom to access and manage Postgres data, _without_ having to teach them a complex tool or spending your time writing code.

Here’s how.

## Do it with Glide

[Glide](https://glideapps.com?utm_source=neontech&utm_medium=referral&utm_campaign=ecosystem) lets you quickly build and deploy progressive web apps without code. You can think of it as the perfect front-end counterpart to Neon’s serverless back-end.

<YoutubeIframe embedId="TTciDAeBfvc" isDocPost={false} />

Glide apps look and feel like native apps, but since they run in the browser, there’s nothing for your users to download or install.

Here’s how to use Glide and Neon to build a progressive web app in under an hour.

## Getting started with Neon + Glide

### Connect your data

Connect to your Neon-hosted database using Glide’s [PostgreSQL data source](https://www.glideapps.com/docs/postgresql).

Once connected, you can add an entire table with live two-way sync, or run a custom query to pull a read-only version. The returned data will appear as a table in Glide’s Data Editor.

If it’s a full table with two-way sync, you’ll be able to add and modify values in Glide, and see those changes pushed back to Neon.

![Image](https://lh7-us.googleusercontent.com/sZ_60QAn1F6eHYcMsHOHBBe5qKo9vEpfxRMKnxVkcxRw0SylmbRJ0k7WOl9Uo01c-O57VxVpE7dQBwBRERLxX1hjwXWLW28VF9Z2fy26yYUpQ585B6_QUi22F0ONbe63NwNhl4tNIEEDWgkcYelc3TU)

You can connect to [multiple data sources](https://www.glideapps.com/docs/essentials/data-sources) in a single Glide app, too.

Let’s say you want to combine data from Postgres with business data stored in Excel or Google Sheets. You can add those additional data sources and build relations between them using [computed columns](https://www.glideapps.com/docs/automation/computed-columns).

Computed columns are Glide’s way of extending your data without affecting the data source. They let you run local calculations and operations along with AI, API calls, and 3rd party integrations.

### Customize your layout

With your data connected to Glide, you’re ready to build an interface with screens and components.

[Components](https://www.glideapps.com/docs/essentials/components) are the building blocks of layouts in Glide. Use them to display values from your data, or to add input and interaction through forms and buttons.

![Image](https://lh7-us.googleusercontent.com/aHJQAFTl8QEfAQ0_49ydBve9QIUFSvnUMJs4sX80BUwP9Sq5fzGyqE9ET24QGe9Du9Xod_HlY1T_HViUfstFcIgErdh4To244N0IfTAZvwJ-U4Arb_xYFb01PTVoOjedunIUoCmDcv8oAtWQXrEXV1s)

You don’t need to fuss over styling details, either. Glide’s opinionated design system handles the heavy lifting by giving each component a set of appearance options.

Glide’s Layout Editor is fully interactive, so you can toggle between mobile and large screen displays to test your interface while you build.

### Add actions and workflows

Components can trigger [actions](https://www.glideapps.com/docs/automation/actions), like showing a notification or updating data values.

Use the Actions Editor to chain multiple actions together in a custom workflow with branching and conditional logic. These action workflows can then be assigned to components in the Layout Editor.

Action sequences can use integrations. For example, you could use Glide’s [OpenAI integration](https://www.glideapps.com/docs/automation/integrations/openai-and-glide) to generate a prompt response, then store that prompt response as plaintext in a table. Your Glide app can then reference that value through a relation lookup.

![Image](https://lh7-us.googleusercontent.com/p-GooGQNnZTfTvIEL0mvm9MmWiMRgIaAHYsRhDDB5TOmOItKR4QJfMWsqJk8CJ25aAyVbTN4H2k4RGsH3qGVtvpuINsfApnDpbjarlKVW5PRw7RLUbNPcPhG6iihJyP2QlTIz4EWXa5piZWmmmGr1No)

### Publish and share

The final step is to confirm your app settings.

Review your appearance, privacy, and integration configurations, making final changes as needed.

When you’re happy with your settings, hit Publish.

![Image](https://lh7-us.googleusercontent.com/hipKbATE0D6XbK3k6yprDZag6-ymQNWmGRle5MkVdMY83QRXoKeF_3NaRwaDOOFI2zupCGjIlpi9qeUwY2D1IGxQL_-hINbjaxjEkgWT3-Spu0uyDe2n8MfB6R1K2cUZR3_D2y4uhaCMjE90hKffxuE)

Glide hosts everything for you, so there’s no need to think about deployment. You can stick with the default subdomain that Glide provides, or use a custom domain.

Published apps will automatically update when you make a change in the builder. This ensures your users always have the latest version of your app. You can also flip to the manual publishing mode if you’d rather push the changes live yourself.

### Putting it all together

Here’s an example of a Glide app connected to a Postgres table hosted on Neon.

<YoutubeIframe embedId="-UJgFoweXis" isDocPost={false} />

## What’s next?

Neon is the easiest way for dev teams to get up and running with serverless Postgres. Likewise, Glide is the easiest way to build custom interfaces and dashboards for managing Postgres data.

Dev teams use Glide for in-house solutions that would otherwise pull resources away from other projects. It’s the best of both worlds. You get a fully managed PWA with no DevOps overhead, and your users get a familiar UI that behaves like the other apps they use every day.

[Learn more about Glide and start building for free.](https://glideapps.com?utm_source=neontech&utm_medium=referral&utm_campaign=ecosystem)
