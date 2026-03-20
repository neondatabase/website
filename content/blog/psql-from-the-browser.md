---
title: psql from the browser
description: We built a psql browser app using Neon branches as connection strings
excerpt: >-
  If you’ve ever worked with Postgres, you’ve probably launched psql at least
  once. It’s the default database client packaged with the Postgres server. This
  is a command-line application, written in C, and it’s packed with many
  features such as autocompletion, command history, and...
date: '2024-12-11T18:48:43'
updatedOn: '2025-01-21T15:38:09'
category: postgres
categories:
  - postgres
authors:
  - eduard-dyckman
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/psql-from-the-browser/cover.jpg
  alt: null
isFeatured: true
seo:
  title: psql from the browser - Neon
  description: >-
    The idea was born during a Neon hackathon: let's build an app that allows
    developers to run psql from their browser. Here's the result.
  keywords: []
  noindex: false
  ogTitle: psql from the browser - Neon
  ogDescription: >-
    The idea was born during a Neon hackathon: let's build an app that allows
    developers to run psql from their browser. Here's the result.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/psql-from-the-browser/social.jpg
source:
  wpId: 7892
  wpSlug: psql-from-the-browser
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/psql-from-the-browser/neon-psql-browser-1-1024x576-5c935f2e.jpg)

If you’ve ever worked with Postgres, you’ve probably launched [psql](https://www.google.com/search?client=safari&rls=en&q=psql+postgres&ie=UTF-8&oe=UTF-8) at least once. It’s the default database client packaged with the Postgres server. This is a command-line application, written in C, and it’s packed with many features such as autocompletion, command history, and data export/import.

psql is very popular in the Postgres community, and many developers use it daily. So, we decided to explore the possibility of running it in the browser.

Here’s the result—try it: [https://psql.sh/](https://psql.sh/)

<video controls width="1728" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/psql-from-the-browser/psqlsh-6-december-2024-ffd712b9.mp4" />
</video>

## It all started in a hackathon…

This idea was born during one of our internal Neon hackathons. We occasionally hold these to explore new ideas in a fast, non-production environment without fear of breaking things.

After that, we were so enthusiastic about this idea that we decided to move forward and turn it into a real, working tool.

## But we can’t just connect to the database from the browser, right?

Technically, that’s correct. Postgres relies on the TCP stack, which isn’t accessible from the browser environment. However, at Neon, we’ve deployed a [WebSocket proxy](https://github.com/neondatabase/wsproxy) that allows users to connect to their databases directly from browser-like environments. (Initially, we built this for serverless environments without TCP stack access, like Cloudflare Workers.)

We also developed a [serverless driver](https://neon.tech/docs/serverless/serverless-driver) to act as a client for the WebSocket proxy. It works great in many JavaScript environments—Node, Vercel Edge, Cloudflare Workers—and browsers!

So, when starting this project, we already had all the infrastructure in place; we just needed to emulate psql’s behavior in the browser.

## What can the psql browser app do?

Our browser app instantiates a database from one of the chosen templates, so you can start with some data already present. Then, you get an almost instantaneous fresh connection spun up for you (I’ll explain how we achieve this in the next section).

You can write SQL queries that will be executed against this fresh database. This database is exclusive to you, so you can experiment with its data any way you like. You can also use slash commands to inspect the database schema, such as `\\d` or `\\d <table-name>`.

![Image](https://cdn.neonapi.io/public/images/pages/blog/psql-from-the-browser/ad4nxfekoryv7uvanyp6tmzolrelwgmkr9fwfmbqnmfv-whzysq3ebrqzsuyuzffsvzs6psqkncokmq8x3wiqvjddcuxwl9duzywb0j2huebh5oqxaafkcqba86vsudx3rehgbgzr-929456c4.png)

## How we built it

### Connection string

As mentioned, we use our serverless driver to connect to the database. But where do we get the connection string from?

For this, I created a Neon project with several branches—one for each template. So, **the templates in psql.sh are actually** [Neon branches](https://neon.tech/docs/introduction/branching):

When someone instantiates a new connection, the backend simply creates a new child branch from the corresponding template (the `main` branch):

![Image](https://cdn.neonapi.io/public/images/pages/blog/psql-from-the-browser/screenshot-2024-12-11-at-102932percente2percent80percentafam-1024x437-38999378.png)

Since Neon branching is instantaneous, we can get a connection string right away. This connection string is also unique and isolated.

![Image](https://cdn.neonapi.io/public/images/pages/blog/psql-from-the-browser/screenshot-2024-12-11-at-102910percente2percent80percentafam-1024x420-2bd2778d.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/psql-from-the-browser/screenshot-2024-12-11-at-102918percente2percent80percentafam-1024x464-961f8ad9.png)

### Slash commands

For slash commands, I used the same library we use in our Neon SQL Editor, created by [George MacKerron](https://mackerron.com/home/). If you haven’t read about it, I highly recommend [this blog post](https://neon.tech/blog/bringing-psqls-d-to-your-web-browser)—it’s quite the journey!

### Terminal emulation

For terminal emulation, I initially considered [xterm.js](https://xtermjs.org/), but I soon realized it would be overkill for our needs. Our app doesn’t emulate a full terminal; it only replicates the psql session, which is much simpler.

So, I built a terminal-like experience from scratch 🙂 and it was quite fun.

## Next steps: Help us decide

We have plenty of ideas to improve the app experience (and sadly, so little spare time!)

- Would you like the ability to query your actual databases running in Neon or even elsewhere?
- How about AI-powered features like “SQL generation”?

Let us know your thoughts on [Discord](https://discord.gg/92vNTzKDGp) or in our [GitHub](https://github.com/neondatabase-labs/psqlsh) discussions.

This project is also open-source, so feel free to explore the code and contribute directly: [https://github.com/neondatabase-labs/psqlsh](https://github.com/neondatabase-labs/psqlsh)<br />
