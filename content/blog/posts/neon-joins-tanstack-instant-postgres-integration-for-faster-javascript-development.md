---
title: >-
  Neon Joins TanStack: Instant Postgres Integration for Faster JavaScript
  Development
description: Neon has joined TanStack as their official database partner.
excerpt: >-
  It’s no secret that Neon loves TanStack, and we’re proud to support Tanner and
  the team as they prepare TanStack Start for its much-anticipated 1.0 launch.
  Vite’s popularity is hard to ignore at this point. It’s everywhere! We believe
  that part of its success is the amazing devel...
date: '2025-07-02T12:10:31'
updatedOn: '2025-10-17T17:02:24'
category: postgres
categories:
  - postgres
  - community
authors:
  - atila
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-joins-tanstack-instant-postgres-integration-for-faster-javascript-development/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Neon Joins TanStack: Instant Postgres Integration for Faster JavaScript
    Development - Neon
  description: >-
    Neon Launchpad brings instant PostgreSQL to JavaScript developers with
    seamless integrations for Vite, TanStack, and open-source tools, no sign-up
    required.
  keywords: []
  noindex: false
  ogTitle: >-
    Neon Joins TanStack: Instant Postgres Integration for Faster JavaScript
    Development - Neon
  ogDescription: >-
    Neon Launchpad brings instant PostgreSQL to JavaScript developers with
    seamless integrations for Vite, TanStack, and open-source tools, no sign-up
    required.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-joins-tanstack-instant-postgres-integration-for-faster-javascript-development/social.png
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/neon-joins-tanstack-instant-postgres-integration-for-faster-javascript-development/neon-neon-joins-tanstack-1024x576-8d0e16d9.jpg)

It’s no secret that Neon loves TanStack, and we’re proud to support Tanner and the team as they prepare TanStack Start for its much-anticipated 1.0 launch. Vite’s popularity is hard to ignore at this point. It’s everywhere! We believe that part of its success is the amazing developer experience it offers. So we’ve developed a Create Tanstack integration to help deliver a great developer experience across the entire TanStack ecosystem when using Neon.

### Neon Joins TanStack

TanStack Start, along with frameworks like Nuxt, Analog, and SolidStart, has chosen Vite as a foundational technology. Recognizing this powerful combination, Neon created an official add-on for Create TanStack that enables developers to set up a fullstack application with a Neon Postgres instance instantly:

```
pnpm create tanstack --add-on neon
```

This official add-on to Create TanStack helps you quickly integrate TanStack with Postgres, providing a smooth and straightforward experience. Neon was chosen as the official data layer, complementing tools like TanStack Router and TanStack Query to deliver a smooth experience.

### Empowering TanStack with Neon Launchpad

At Neon, our mission has always been to simplify the process of integrating Postgres into JavaScript projects, making it ridiculously easy for developers. Earlier this month, we introduced [Neon Launchpad](https://neon.new), a way to instantly spin up a Postgres instance without requiring sign-up. Just grab your connection string, and you’re good to go! What to claim your database later? No problem, Launchpad makes that effortless too.

Just days after its launch, [Sentry](https://sentry.io) used Neon Launchpad to get over 200 workshop attendees working with databases in minutes.

<EmbedTweet url="https://twitter.com/Codydearkland/status/1932822938681815260?ref_src=twsrc%5Etfw" />

[Netlify DB](https://www.netlify.com/blog/netlify-db-database-for-ai-native-development/) has also adopted Launchpad’s robust infrastructure, bringing the power of Neon Postgres databases directly to their users.

You don’t need to take our word for it, look at what Jack Herrigonton had to say when he tried it!

<YoutubeIframe embedId="gBEZ9SYfFDU" isDocPost={false} />

And that was just the start.

### Open Source is in Our DNA

At Neon, open-source is in our DNA: we use it, love it, and support it. Launchpad gave us the opportunity to lift two of the most influential and growing open-source communities in JavaScript: Vite and TanStack.

To empower developers further, we created two open-source packages NeonDB and @neondatabase/vite-plugin-postgres to enable even easier integration and customization.

### Flexible Development with NeonDB

Getting started with NeonDB is simple:

npx neondb –yes

The NeonDB package has a binary that can be executed and will prompt you with the right questions to get you started. It can also be used as a SDK for you to create your own starter. It can be integrated as an SDK:

```
import { instantNeon } from 'neondb/launchpad';
const { connectionString } = await instantNeon({
  referrer: "my-awesome-starter",
});
```

We hope this will help library and framework authors get their users even further ahead into creating awesome web experiences.

### Seamless Integration for Vite Ecosystem

While we’re on the subject of library and framework authors, it’s impossible not to consider Vite’s enormous and evergrowing popularity. To make things even more ergonomic to open-source developers and to app creators, we also built a special Vite Plugin that seamlessly integrates Neon Launchpad:

```
npm add -D @neondatabase/vite-plugin-postgres
```

<br />Our new Vite Plugin utilizes Neon Launchpad right from your development server. Available now to any [Vite](https://vite.dev) based application and with default configurations, hooking up a database to your app takes one-line:

```
import postgresPlugin from "@neondatabase/vite-plugin-postgres";
import framework from "@vitejs/plugin-{{framework}}";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [
    postgresPlugin(),
    framework(),
  ],
});
```

The plugin also accepts .sql files to easily seed your database with schema and data:<br />

```
export default defineConfig({
  plugins: [
    postgresPlugin({
      seed: {
        type: 'sql-script',
        path: 'seed.sql'
      }
    }),
  ],
});
```

We know developers love writing ToDo apps to try things out (not!). But anyway, here’s one if you feel like taking a shortcut:

```
-- Schema for a simple to-do list

CREATE TABLE IF NOT EXISTS todos (
   id SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   description TEXT,
   is_completed BOOLEAN DEFAULT FALSE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial data for the to-do list
INSERT INTO todos (title, description, is_completed) VALUES
('Try Tanstack Start', 'setup an app and add Neon Launchpad', TRUE),
('Share on socials', 'Mention us showing what you built!', FALSE),
('Star on GitHub', 'Go to the repository and let us know you liked it', FALSE);
```

Give it a try and build something with it. The code is [open-source on GitHub](https://github.com/neondatabase/neondb-cli). We’d love to hear about your experiences, share it with us on [discord](https://discord.com/invite/92vNTzKDGp), [X](https://x.com/neondatabase), or [LinkedIn](https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A72287133&keywords=Neon&origin=ENTITY_SEARCH_HOME_HISTORY&position=0&sid=SA8). We’d love to hear from you.
