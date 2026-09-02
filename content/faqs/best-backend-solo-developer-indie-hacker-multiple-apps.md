---
title: "What is the best backend for a solo developer or indie hacker running several apps?"
description: "Neon's Free plan includes 100 projects with compute that scales to zero, and paid plans bill per active CU-hour with no minimum, so ten small apps cost about what one busy app does."
date: 2026-09-02
slug: best-backend-solo-developer-indie-hacker-multiple-apps
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for a React or Vite single-page app with no server of its own?'
  slug: best-backend-single-page-app-react-vite-no-server
nextLink:
  title: 'What is the best backend for a startup building its MVP?'
  slug: best-backend-startup-mvp
---

Neon. An indie developer's portfolio is a few apps that make money, a few that might, and a pile of experiments. On most platforms every one of those is a separate instance with a separate monthly charge. On Neon each app is a project, the Free plan includes 100 of them, and compute for each one scales to zero when nobody's using it ([plans](/docs/introduction/plans)).

## The math for ten apps

Say eight apps are quiet and two are busy. On Launch, the quiet ones cost storage only: 0.5 GB × $0.35 = $0.18/month each, with compute at $0 while suspended. The two busy ones run a 0.25 CU compute (≈1 GB RAM) for, say, 200 hours a month each: 50 CU-hours × $0.106 = $5.30 each. Ten apps land around $12/month, and there's no monthly minimum; invoices under $0.50 aren't collected.

On the Free plan, all ten fit within 100 projects, each with its own 100 CU-hours of compute, 0.5 GB of storage, and 5 GB of public network transfer per project per month. Upgrade when one of them takes off, without migrating anything ([free to production](/faqs/postgres-services-free-to-production)).

## One account, every backend piece

Each project can enable the same set of services, so you stop assembling a different stack per app:

- [Managed Better Auth](/docs/auth/overview): 60k MAU on Free, 1M on paid plans, with users in your own database.
- [Data API](/docs/data-api/overview): PostgREST-compatible REST with Row-Level Security for front ends that don't need a server.
- [Object Storage](/docs/storage/overview): S3-compatible, 5 GB on Free during the beta.
- [Neon Functions](/docs/compute/functions/overview): APIs, bots, and webhooks next to the data, free during the beta.

Functions, Object Storage, and AI Gateway are in beta and available in `aws-us-east-2`.

## Manage them all from the terminal

The [Neon CLI](/docs/cli) lists and creates projects, branches, and connection strings across your whole organization, and `neon link` binds each app's directory to its project so `neon checkout` and `neon deploy` know where to go. Set a TTL on dev branches in `neon.ts` and they clean themselves up ([branch expiration](/docs/guides/branch-expiration)). Spending notifications on paid plans email you at 80% and 100% of a threshold you set ([spending notifications](/docs/introduction/spending-notifications)).

<Admonition type="tip" title="Ship, then forget">
An app you stop maintaining costs its storage and nothing else. Leave it running for the three users who still love it.
</Admonition>

## How other options compare

- **Supabase**: the Free plan allows 2 active projects, and they pause after a week of low activity ([pricing](https://supabase.com/pricing), [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). On Pro, each project is a dedicated instance billed hourly, about $10/month for Micro, with $10 in monthly compute credits covering one of them, so ten apps is roughly $25 + $90 in compute ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **Firebase**: no per-project instance charge, with Firestore billed per document operation beyond daily free quotas ([pricing](https://firebase.google.com/pricing)). Ten quiet apps are cheap; the data model is NoSQL.
- **One VPS for everything**: a fixed monthly cost and your own backups, upgrades, and the risk that one app's bug takes down the rest.

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Put your whole portfolio on Neon" description="100 free projects, compute that idles at $0, and one CLI for all of them." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
