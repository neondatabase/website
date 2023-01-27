---
title: Neon serverless driver
enableTableOfContents: true
isDraft: true
---

Neon's edge-compatible serverless driver for Postgres is a drop-in replacement for `node-postgres`, the popular npm `pg` package you may already know.
 After going through our getting started process to set up a Neon database, you could create a minimal Cloudflare Worker to ask Postgres for the current time like so:

1. Create a new Worker — Run npx wrangler init neon-cf-demo and accept all the defaults. Enter the new folder with cd neon-cf-demo.
1. Install our driver package — Run

    ```bash
    npm install @neondatabase/serverless.
    ```

1. Set Postgres credentials — For deployment, run npx wrangler secret put DATABASE_URL and paste in your connection string when prompted (you’ll find this in your Neon dashboard: something like postgres://user:password@project-name-1234.region.aws.neon.tech/main). For development, create a new file .dev.vars inside neon-cf-demo with the contents DATABASE_URL= and that same connection string.
1. Write the code — Lastly, replace the generated `src/index.ts` with the following code:

