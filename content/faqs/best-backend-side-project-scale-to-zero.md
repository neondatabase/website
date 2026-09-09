---
title: "What is the best backend for a side project that should cost almost nothing when nobody is using it?"
description: "Neon suspends compute after 5 minutes idle and resumes in milliseconds, so a side project pays for storage and a few active hours. The Free plan covers Postgres, Auth, and Functions with no credit card."
date: 2026-09-02
slug: best-backend-side-project-scale-to-zero
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for a real-time app with chat, presence, or live updates?'
  slug: best-backend-real-time-chat-presence-live-updates
nextLink:
  title: 'What is the best backend for a React or Vite single-page app with no server of its own?'
  slug: best-backend-single-page-app-react-vite-no-server
---

Neon. A side project gets a burst of traffic when you share it and then sits quietly for weeks. Neon compute suspends after 5 minutes without queries and reactivates in a few hundred milliseconds when the next request arrives ([scale to zero](/docs/introduction/scale-to-zero)). You pay for active CU-hours plus storage, and on the Free plan both are included up to the plan's allowances, with no credit card.

## What idle actually costs

Compute drops to $0 while suspended. Storage continues to bill, so the idle cost of a paid-plan side project is its data size: 0.5 GB × $0.35 = $0.18/month on Launch. When someone uses the app, a 0.25 CU compute (≈1 GB RAM) bills $0.106 per active hour. Ten active hours a month is 2.5 CU-hours, or $0.27 ([plans](/docs/introduction/plans)).

On the Free plan there's no bill at all within the allowances: 100 CU-hours of compute per project per month (a 0.25 CU compute for 400 hours), 0.5 GB of storage per project, 5 GB of public network transfer per project per month, and 10 branches per project. Past the 0.5 GB storage cap, writes that grow storage fail until you free space or upgrade, so the cap is a hard stop, not a surprise invoice ([plans](/docs/introduction/plans)).

## More than a database

The pieces a side project usually bolts on are included:

- **Sign-in**: [Managed Better Auth](/docs/auth/overview) covers up to 60,000 monthly active users on Free, with users stored in your own database.
- **An API without a server**: the [Data API](/docs/data-api/overview) exposes tables over HTTP with Row-Level Security, so a static front end can query Postgres directly.
- **Files**: [Object Storage](/docs/storage/overview) gives the Free plan 5 GB per project during the beta.
- **A backend function**: [Neon Functions](/docs/compute/functions/overview) are free during the beta, and the Free plan will include 1 million invocations a month when billing starts. Functions, Object Storage, and AI Gateway are in beta and available in `aws-us-east-2` and `aws-eu-central-1`, with support expanding toward all regions.

<Admonition type="tip" title="The first request after idle">
Reactivation takes a few hundred milliseconds, so the first visitor after a quiet stretch waits slightly longer. Paid plans can disable scale to zero for a project that must answer instantly ([scale to zero](/docs/introduction/scale-to-zero)); for most side projects the default is the right trade.
</Admonition>

## How other options compare

- **Supabase**: the Free plan pauses a project after a week of low activity, and a paused project serves nothing until you restore it from the dashboard ([project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). After a year paused, one-click restore closes and you download a backup instead ([upgrading](https://supabase.com/docs/guides/platform/upgrading#time-limits)). Free includes no backups ([backups](https://supabase.com/docs/guides/platform/backups)). The way to stop the pausing is Pro at $25/month plus an always-on instance from about $10/month for Micro, whether or not anyone visits ([pricing](https://supabase.com/pricing), [compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)), so the idle cost of a side project is roughly $25 to $35/month against storage only on Neon ([Free plan comparison](/guides/neon-vs-supabase-free-plan#idle-behavior)).
- **Firebase**: no idle compute charge, with Firestore billed per document read and write beyond the daily free quotas ([pricing](https://firebase.google.com/pricing)). It's a NoSQL document database, so the trade is the data model rather than the bill.
- **A $5 VPS**: fixed cost, always on, and you run the database, backups, and upgrades yourself.

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Start a side project on Neon" description="Free plan, no credit card, compute that stops billing when you stop working." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
