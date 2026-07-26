---
title: 'Launch Postgres in Your Browser, Keep It On Neon'
description: We built a no-signup Postgres tool with Cloudflare Workers and Drizzle ORM
excerpt: >-
  Sometimes you need a Postgres database right now, and you’d like to have it
  without setting up containers, deploying infra, or creating an account
  anywhere. Maybe you’re following a tutorial online or testing a quick idea.
  Enter Instagres—a tool that lets you spin up a fully func...
date: '2025-01-23T19:32:26'
updatedOn: '2025-01-23T19:58:07'
category: postgres
categories:
  - postgres
authors:
  - guillaume-rivals
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/launch-postgres-in-your-browser-keep-it-on-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Launch Postgres in Your Browser, Keep It On Neon - Neon'
  description: >-
    We built a no-signup Postgres tool with Cloudflare Workers and Drizzle ORM.
    If you want to keep your database, you can transfer it to Neon.
  keywords: []
  noindex: false
  ogTitle: 'Launch Postgres in Your Browser, Keep It On Neon - Neon'
  ogDescription: >-
    We built a no-signup Postgres tool with Cloudflare Workers and Drizzle ORM.
    If you want to keep your database, you can transfer it to Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/launch-postgres-in-your-browser-keep-it-on-neon/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/launch-postgres-in-your-browser-keep-it-on-neon/neon-postgres-browser-1024x576-5987384e.jpg)

Sometimes you need a Postgres database _right now_, and you’d like to have it without setting up containers, deploying infra, or creating an account anywhere. Maybe you’re following a tutorial online or testing a quick idea.

**Enter** [Instagres](https://www.instagres.com)—a tool that lets you spin up a fully functional Postgres database in your browser in under a second, giving you a connection string that you can start using immediately:

<video autoPlay muted loop width="1592" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/launch-postgres-in-your-browser-keep-it-on-neon/instagres-845659f0.mp4" />
</video>

But what happens if after a while, you decide **you’d actually like to keep the database**? Maybe the quick idea you were playing with it’s actually worth keeping and sharing it with a teammate, or you’d like to resume the tutorial where you left it.

This is where some “Postgres in the browser” tools fall short—you cannot keep your DB afterwards. But Instagres has you covered: it doesn’t just offer instant access to a Postgres database, it also gives you the flexibility to transfer your database to a free account in [Neon](https://neon.tech/home) whenever you’re ready to make it persistent:

![Image](https://cdn.neonapi.io/public/images/pages/blog/launch-postgres-in-your-browser-keep-it-on-neon/ad4nxepelwey4t8kvirlvrjltnkcosbx-tjtxcn-chk5wlg6mmwklu1wacdghu3gwjk3xunrbztrbpg176iegftuqci-qcmdpzzpphckpbnenbmpdakfqstudsdhyw9rb6z5uvzr0l-0d9ea4f2.png)

**To claim your database, you only have to click on “Transfer it to your Neon account”**. If you are not a Neon user yet, you’ll be prompted to create an account: it’s **free** and you don’t need a credit card (it truly takes seconds). Once you do this, you’ll be able to access your new database whenever you want.

## Instant Postgres in your browser and also in your terminal

There’s actually two ways to launch Postgres using Instagres:

### In your browser

You can simply open [https://www.instagres.com/](https://www.instagres.com/)

### Or in your terminal

You can launch Postgres databases equally fast using the CLI, which is pretty cool. If you have NodeJS installed, you can just run:

```bash
npx instagres
```

You’ll be prompted:

```bash
Would you like an instant Postgres connection string from Neon (No signup required)? (Y/n):
```

After confirming, a page will automatically open in your browser showing your database URL and the button where you can claim it for posterity.

## How Instagres works

The project lives in these repos:

[https://github.com/neondatabase-labs/instagres-js<br />](https://github.com/neondatabase-labs/instagres-js) [https://github.com/neondatabase-labs/instagres-demo<br />](https://github.com/neondatabase-labs/instagres-demo) [https://github.com/neondatabase-labs/instagres](https://github.com/neondatabase-labs/instagres)

### Instant database creation via Neon

At the heart of Instagres is [Neon](https://neon.tech/home), a serverless Postgres platform that allows databases to be created in under a second. When a user accesses Instagres, either through the browser or the CLI, the tool interacts with [Neon’s API](https://neon.tech/docs/reference/api-reference) to spin up a new Postgres database.

<Admonition type="info" title="FYI">
Tools like Retool and Replit Agent leverage this instant provisioning speed to quickly create databases for end-users and AI agents. Explore their stories [here](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) and [here](https://neon.tech/blog/how-to-add-a-postgres-database-to-your-replit-agent-project).
</Admonition>

<br />This lightning-fast provisioning generates a connection string almost instantly. Once you claim your database, Neon also handles the backend heavy lifting, such as autoscaling for storage and compute.

### Backend: Cloudflare Workers, React Router, and Drizzle ORM

Instagres is built as a [Cloudflare Workers](https://workers.cloudflare.com/) app, using [React Router v7](https://reactrouter.com/home) (an evolution of Remix) for its frontend and routing. To interact with the Postgres databases, Instagres uses [Drizzle ORM](https://orm.drizzle.team/), which enables the app to execute queries while maintaining a clean codebase.

### Bot protection by Cloudflare

One challenge with offering free, no-signup databases is preventing abuse from bots. Instagres addresses this with two layers of bot protection, made possible by hosting on Cloudflare Workers:

- [Cloudflare Turnstile:](https://www.cloudflare.com/application-services/products/turnstile/) Turnstile is a CAPTCHA alternative that uses browser signals and heuristics to detect bots. For real users, it’s pretty much invisible (no complex puzzles to solve). Turnstile automatically “turns green,” allowing legitimate users to proceed without interruption.
- [Rate Limiting API](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/): Cloudflare’s also offers very handy built-in rate limiters (currently in beta), This avoided the work of a separate Redis setup.

### Database transfer to your Neon account

Instagres databases are temporary by default: they self-destruct after an hour. But if you want to save your database for later, Instagres has a feature for long-term use: transferring databases to a Neon account.

This feature works by using [Neon’s OAuth](https://neon.tech/docs/guides/oauth-integration) for authentication. When a user decides to transfer their database, Instagres securely links the temporary database to their Neon account.

The actual transfer process is powered by a [Docker-based AWS Lambda function](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html), which uses pg_dump to export the data from the temporary database and pg_restore to import it into the persistent Neon database.

## The result

This simple app allows you to get a fully functional Postgres database in seconds, whether you’re learning a new trick, prototyping, or following a tutorial. And when you’re ready to persist your work, you can transfer your database to a Neon free account with one click.

Give it a try at [instagres.com](https://instagres.com/) or through your command line!
