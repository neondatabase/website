---
title: How to stop AI crawlers from using up your CU-hours
subtitle: Cache your pages, block unwanted bots, and keep health checks off the database so your compute only runs for real users
author: carlota-soto
enableTableOfContents: true
createdAt: '2026-11-16T00:00:00.000Z'
updatedOn: '2026-11-16T03:24:20.042Z'
---

AI companies, search engines, and SEO tools fetch pages around the clock. If every page they fetch runs a database query, your compute never gets a chance to sleep. This guide explains how that happens, how to check whether it's happening to you, and what to change so crawlers stop spending your compute.

## How a crawler keeps your compute awake

By default, [Lakebase Postgres suspends a compute after 5 minutes without activity](/docs/introduction/scale-to-zero) and starts it again on the next query, typically within a few hundred milliseconds. That makes quiet apps cheap on Neon: you pay for compute only while it's running.

A crawler can break that pattern without sending much traffic. If something requests a database-backed page every few minutes, the 5-minute idle timer never runs out, and the compute stays on all day.

When a [Free plan project](/pricing) uses up its CU-hours, Neon suspends its compute until the next billing period or until you upgrade. Also, if autoscaling pushes the compute above 0.25 CU while a crawler hammers it, your free compute allowance will run out even sooner.

On a paid plan, this pattern can also cause you problems: it won't stop your app, but the extra consumption will show up on your bill.

## Step 1: Check whether crawlers are the cause

To check if this is happening to you, start with the shape of your compute usage. In the Neon Console, the project's [monitoring page](/docs/introduction/monitoring-page) shows when the compute was active. A healthy low-traffic app shows short bursts with gaps between them. A crawler problem shows a compute that's active almost all the time, including overnight in your users' time zone.

![Monitoring graphs: a compute that scales to zero between visits, and one kept active all week by frequent requests](/guides/images/stop-ai-crawlers-cu-hours/compute-active-pattern.png 'no-border')

Then look at who's requesting your pages. Your hosting platform's request logs or analytics usually break traffic down by user agent. Look for:

- AI crawlers, such as OpenAI's GPTBot, Anthropic's ClaudeBot, Common Crawl's CCBot, and Meta's crawlers
- Search engine crawlers
- SEO and monitoring tools
- Uptime checks that hit a page or endpoint that queries the database

## Reduce crawler load on your database

### Fix 1: Serve crawlers from a cache

The most effective fix is to make sure most requests never reach the database at all. Pages that look the same for every visitor, like a blog, a product listing, a job board, or a docs page, can be cached at the edge:

- Generate the page at build time, or with incremental regeneration, if your framework supports it
- Set `Cache-Control` headers so your CDN keeps a copy for a few minutes or longer
- Cache the result of expensive queries in your app, so a page served to a hundred crawlers runs the query once

With caching in place, a crawler that fetches 10,000 pages gets them from the CDN, and your compute can scale to zero between real visits.

### Fix 2: Tell crawlers what they can fetch

`robots.txt` lets you ask crawlers to skip parts of your site, or skip it entirely. If you don't want AI crawlers to fetch your app's dynamic pages, block those paths for their user agents:

```text filename="robots.txt"
User-agent: GPTBot
Disallow: /app/
Disallow: /search

User-agent: ClaudeBot
Disallow: /app/
Disallow: /search

User-agent: CCBot
Disallow: /
```

Crawlers from the major AI companies say they respect `robots.txt`, but it's a request, not enforcement.

Think about what you block, though: if you want your product to show up in AI answers, you probably want crawlers to read your public marketing pages and docs. Block the routes that query the database, like search results, filters, and logged-in pages.

### Fix 3: Block or rate-limit at the edge

For crawlers that ignore `robots.txt`, block or rate-limit them before they reach your app. Vercel and Cloudflare both offer firewall rules and bot protection that can challenge or block automated traffic by user agent or behavior. A rate limit on routes that query the database means a crawler can't fetch hundreds of uncached pages a minute.

### Keep health checks off the database

Uptime monitors are crawlers you set up yourself. A check every minute against a route that queries Postgres keeps the compute on around the clock, the same way a crawler does.

Point uptime checks at a static route, or at a health endpoint that doesn't touch the database. If you want to know the database is reachable, check it less often, for example every 15 or 30 minutes, so the compute can sleep in between.

### Set up notifications

On paid plans, [spending notifications](/docs/introduction/spending-notifications) email you at 80% and 100% of a threshold you set. Set them up to keep an eye out for this issue.

<NeedHelp/>
