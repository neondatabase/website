---
title: How to create previews with anonymized production-like data in seconds
description: Use Neon with Neosync to anonimize PII in your database branches
excerpt: >-
  Database branching makes it easy to create database copies for your non-prod
  environments, but some companies face the obstacle of how to anonymize PII to
  ensure privacy. This can be solved with Neosync, an open-source tool that
  allows developers to anonymize data across branches...
date: '2024-05-28T16:46:39'
updatedOn: '2024-05-28T16:46:41'
category: community
categories:
  - community
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-create-previews-with-anonymized-production-like-data-in-seconds/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    How to create previews with anonymized production-like data in seconds -
    Neon
  description: >-
    Learn how to create database branches with anonymized PII for your previews
    and other non-prod environments using Neon and Neosync.
  keywords: []
  noindex: false
  ogTitle: >-
    How to create previews with anonymized production-like data in seconds -
    Neon
  ogDescription: >-
    Learn how to create database branches with anonymized PII for your previews
    and other non-prod environments using Neon and Neosync.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-create-previews-with-anonymized-production-like-data-in-seconds/social.jpg
source:
  wpId: 6101
  wpSlug: how-to-create-previews-with-anonymized-production-like-data-in-seconds
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-previews-with-anonymized-production-like-data-in-seconds/neon-neosync-1-1-1024x576-57ab1bdf.jpg)

**[Database branching](https://neon.tech/flow) makes it easy to create database copies for your non-prod environments, but some companies face the obstacle of how to anonymize PII to ensure privacy. This can be solved with [Neosync](https://www.neosync.dev/), an open-source tool that allows developers to anonymize data across branches. [Try it with Neon](https://console.neon.tech/signup?__hstc=159041573.148f5164810b8449c97a4f4b95e0d6b4.1716597077123.1716597077123.1716597077123.1&__hssc=159041573.2.1716597077123&__hsfp=1117521915).**

Developers worldwide are adopting Postgres to run their production workloads. But when it comes to setting up and maintaining lower-level environments, teams face some challenges. First, creating database copies for these environments gets expensive and time-consuming. Second, anonymizing sensitive production data to make it safe for previews or even dev environments can get complex.

The first problem (how to create database copies efficiently) is being solved by Neon and the database branching model. The second problem (the data anonymization problem) is the one Neosync is focusing on.

## Creating database branches with anonymized data: a workflow by Neon and Neosync

One of the standout features of Neon is its ability to perform [database branching including data and schema](https://neon.tech/docs/introduction/branching) via copy-on-write. This feature is inspired by code branching in Git, enabling developers to create lightweight, isolated database branches in seconds.

These branches effectively act like database copies but without duplicating storage, saving you the time and money required to duplicate your entire dataset. Database branches [can be added to your existing workflows](https://neon.tech/flow) via GitHub Actions. [Preview deployments with prod-like data are a perfect application for database branches.](https://neon.tech/flow)

But, how to anonymize PII in non-prod branches if your application demands it? Here’s where [Neosync](https://www.neosync.dev/) comes into play. Neosync is an open-source platform that helps developers anonymize production data and sync it across their environments for a better developer experience.

By combining both tools, developers can anonymize data in their database branches, for example for their preview environments. Here’s the workflow:

<YoutubeIframe embedId="IcoOpnAcO1Y" isDocPost={false} />

[You can check out our docs for a complete walkthrough](https://neon.tech/docs/guides/neosync-anonymize) of the Neon and Neosync integration. For setting up your Preview workflows, [follow the Actions on this page](https://neon.tech/flow).

_PS: If you would like to see a tighter integration between Neon and Neosync, where database branches are anonymized without configuring them in Neosync, let us know on [Twitter](https://x.com/neondatabase)._

## Try it out

Both Neosync and Neon offer generous free tiers. If you’re interested in trying this workflow for free, [follow the steps in the guide](https://neon.tech/docs/guides/neosync-anonymize) and get started in just a few minutes.
