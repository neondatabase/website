---
title: 'Empowering developers with production-like snapshots: how Snaplet uses Neon'
description: They leverage copy-on-write branches to provide instant data copies to users
excerpt: >-
  “As soon as we found out about Neon’s branching model with copy-on-write, we
  knew it was exactly what we were looking for” Julien Goux, Software Engineer
  at Snaplet Snaplet uses Neon to power its Snapshot feature. Neon’s partnership
  plans make it possible to manage thousands of d...
date: '2024-05-20T15:19:22'
updatedOn: '2024-05-20T15:19:24'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/empowering-developers-with-production-like-snapshots-how-snaplet-uses-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Empowering developers with production-like snapshots: how Snaplet uses Neon
    - Neon
  description: >-
    Snaplet uses Neon to power Snapshots, using database branching to provide
    decelopers with preview databases with production-like data.
  keywords: []
  noindex: false
  ogTitle: >-
    Empowering developers with production-like snapshots: how Snaplet uses Neon
    - Neon
  ogDescription: >-
    Snaplet uses Neon to power Snapshots, using database branching to provide
    decelopers with preview databases with production-like data.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/empowering-developers-with-production-like-snapshots-how-snaplet-uses-neon/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/empowering-developers-with-production-like-snapshots-how-snaplet-uses-neon/neon-snapshots-1-1024x576-89ab6f62.jpg)

<blockquote>
<p>“As soon as we found out about Neon’s branching model with copy-on-write, we knew it was exactly what we were looking for”</p>
<cite>Julien Goux, Software Engineer at Snaplet</cite>
</blockquote>

[Snaplet](https://www.snaplet.dev/) **uses Neon to power its Snapshot feature. [Neon’s partnership plans](https://neon.tech/partners) make it possible to manage thousands of databases without cost overhead or management burden. Companies like** [Retool](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases), [Vercel](https://neon.tech/blog/neon-postgres-on-vercel), [Replit](https://neon.tech/blog/neon-replit-integration)**, and [Koyeb](https://www.koyeb.com/blog/serverless-postgres-public-preview) also use Neon to provide serverless Postgres to their user base.**

Having access to realistic, production-like data is crucial for effective testing and debugging, but it’s easier said than done. Snaplet, a cutting-edge developer tool, aims to make this process as seamless as a snap 🫰 of the fingers.

## Simplifying access to production-like data for development and testing

The inspiration behind Snaplet came from the team’s personal experience with large production database dumps. These dumps were necessary for various crucial tasks, such as testing new features to ensure they worked as expected, developing locally to replicate real-world scenarios, debugging issues by reproducing them in a controlled environment, and staging to create pre-production environments that mirrored the live system.

Ideally, each of these activities required realistic, production-like data. In practice, this proved not only time-consuming to obtain but also made the team nervous due to the presence of sensitive, personally identifiable information (PII).

Snaplet aims to improve this experience by providing developers with easy access to production-like data without the associated risks. Through [Seed](https://www.snaplet.dev/seed), developers can populate their local and testing environments with realistic, AI-generated seed datasets. For those teams who prefer to access production-like database copies, Snaplet offers [Snapshot](https://www.snaplet.dev/snapshot), which allows users to access isolated database copies with anonymized sensitive data that can be used for testing, shared among team members, and quickly reset as needed.

## How database branches power Snapshots under the hood

<blockquote>
<p>“Neon is completely committed to developer experience, which is what we’re also obsessed about at Snaplet”</p>
<cite>Jian Reis, COO at Snaplet</cite>
</blockquote>

Snaplet relies on Neon’s serverless Postgres to power Snapshot, with database branching being the key feature behind it. Here’s a breakdown of how it works:

![Image](https://cdn.neonapi.io/public/images/pages/blog/empowering-developers-with-production-like-snapshots-how-snaplet-uses-neon/image-4-1024x479-0b7f3d07.png)

- **Each Snapshot in Snaplet corresponds to a project in Neon.** Snaplet restores the snapshot to the main branch within Neon, which serves as a base for creating new database branches.
- **When users require a new preview database, Snaplet creates a branch from the main snapshot branch.** This process is quick and efficient, leveraging [Neon’s copy-on-write technology](https://neon.tech/blog/get-page-at-lsn) to avoid unnecessary data duplication.
- **Snaplet users work against these branched databases in isolated environments.** They have the flexibility to delete and create new preview databases as needed, without affecting the main snapshot or other branches. This isolation ensures a secure and efficient development workflow.
- **Developers can use GitHub actions to automate the process.** They can hook a Snapshot into a preview environment, providing both the application and data parts of the preview in a unified, isolated setup. This solves the challenge of having separate environments for frontend, backend, and data, which often leads to inconsistencies and mistakes.
- **Snaplet’s Snapshot includes subsetting and transformation capabilities to solve the PII problem.** Developers can sample a portion of their database if it’s too large (e.g., taking just 10% of the data). They can also anonymize sensitive data using JavaScript functions, with default settings for detecting and transforming probable PII columns. Snaplet’s deterministic transformation library, [copycat](https://github.com/snaplet/copycat), ensures that transformed data remains consistent across environments.

![Image](https://cdn.neonapi.io/public/images/pages/blog/empowering-developers-with-production-like-snapshots-how-snaplet-uses-neon/quick-start-06-1024x865-a08790e9.webp)

<blockquote>
<p>“Moving to Neon gave us more clarity and comfort around the architecture and pricing predictability, allowing us to move forward with the development of Snapshot with a high degree of confidence”</p>
<cite>Jian Reis, COO at Snaplet</cite>
</blockquote>

Before adopting Neon, Snaplet tried a previous design for Snapshot on Fly.io. To manage preview databases in Fly, Snaplet used a workaround: using Postgres databases and Fly Machines, the Snaplet team created a main database with a “template” and copied the data to generate more databases to mimic a branching structure. When a user wanted to deploy a snapshot, Snaplet performed a pg_restore to a hidden template database, from which branches were created.

This setup worked, but it had significant limitations. Fly.io’s storage did not support file systems with copy-on-write features like ZFS. While the system was fast due to everything being on the same disk, it caused memory usage to essentially double with each new database, making the setup increasingly expensive.

Managing this architecture was also complex. Snaplet had to deal with VMs and operating systems, which added a layer of complexity that they preferred to avoid in the long run. They wanted to find a way to focus on single databases rather than infrastructure and OS management.

Discovering Neon and its copy-on-write branching model was a game-changer for Snaplet, as it provided a logical model that aligned perfectly with their needs. This transition to Neon solved the scalability and cost problems they previously faced, enabling them to focus on delivering a superior product to their users.

## The Snaplet tech stack

<blockquote>
<p>“We’re using the Neon API with an auto-generated TypeScript client thanks to their OpenAPI compliance. The integration went great and without issues”</p>
<cite>Julien Goux, Software Engineer at Snaplet</cite>
</blockquote>

Before we wrap up, let’s touch on the rest of Snaplet’s tech stack. They use Node.js for their server-side operations and React for the front end. Their entire stack is 100% JavaScript, with a strong emphasis on TypeScript. To integrate with the database, Snaplet uses the Neon API. Additionally, Snaplet leverages the OpenAI API to enhance its [Seed](https://www.snaplet.dev/seed) product to generate realistic seed datasets.

## Become a Neon partner

<blockquote>
<p>“This partnership sets the standard for us in terms of how responsive the Neon team has been”</p>
<cite>Jian Reis, COO at Snaplet</cite>
</blockquote>

Neon’s [partnership plans](https://neon.tech/partners) are designed to scale with companies like Snaplet, interested in managing a high number of Neon projects for their users. If you’re interested in becoming a partner, [send us your info](https://neon.tech/partners). You can also [take a quick look at Neon](https://console.neon.tech/signup) (it’s free!)
