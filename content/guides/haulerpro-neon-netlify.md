---
title: Running a multi-tenant SaaS on Neon and Netlify Functions
subtitle: How HaulerPro runs a production transportation management system on serverless Postgres and serverless functions
author: william-suthoff
enableTableOfContents: true
---

HaulerPro is a transportation management system for independent truckers and small fleets, the owner-operators and small carriers that most freight software overlooks. I build and run the whole product myself, which shaped one early decision more than any other: I could not afford to babysit a database server. No dedicated ops person, no time to tune a Postgres instance at midnight, no budget for capacity I was not using.

This guide walks through how HaulerPro runs a real multi-tenant production workload on Neon serverless Postgres paired with Netlify Functions, what that combination is good at for a small team, and where we expect to grow into more of Neon's feature set over time.

## The stack in one breath

Every part of HaulerPro's backend is a Netlify Function. Each function talks to a single Neon serverless Postgres database using the `@neondatabase/serverless` driver and a connection string that Netlify's Neon integration manages for us as `NETLIFY_DATABASE_URL`. There is no separate API server to keep warm, no container, and no database instance sitting idle between requests. Serverless functions on the front, serverless Postgres behind them.

For a one-person engineering team, that shape removes an entire category of work before it ever starts.

## Why serverless Postgres fit a bootstrapped SaaS

Dispatch traffic is spiky. A small carrier might fire off a burst of activity in the morning when loads get booked and drivers head out, then go quiet for hours. Paying for a database server sized to the busy minutes, running flat out through the quiet ones, never made sense for us.

A few things mattered most:

- **No idle cost.** Serverless Postgres means we are not paying to keep a box running through the slow hours. The database is there when a request comes in and does not bill us for time it spends doing nothing.
- **No connection-pool firefighting.** Serverless functions are notorious for exhausting traditional Postgres connection limits, because each invocation can open its own connection. The `@neondatabase/serverless` driver is built for exactly this model, so we never had to stand up a separate pooler just to keep functions from overwhelming the database.
- **Instant provisioning.** Spinning up the database took seconds, not a procurement decision. For a bootstrapped founder, the speed from idea to working backend is the whole game.

## How we structure multi-tenancy

HaulerPro serves many carriers from one application, so multi-tenancy is core. We keep it deliberately simple: a single Neon database with a clear tenant model anchored on a companies table. Every record of business data is tied to its company, so each carrier's data stays logically separated within a shared schema.

This is the classic single-database, shared-schema approach. At our scale it buys a lot: one database to reason about, one place to back up, one connection path, and no per-tenant infrastructure to provision when a new carrier signs up. Tenant separation is a first-class concern throughout the application. For a small SaaS that wants to move fast without an ops team, the simplicity has paid for itself.

## What Neon holds in production

Neon is not a cache or a side store for us. It is the single source of truth for everything the application does. In production it holds:

- **Accounts and access:** user records, roles, and login sessions.
- **The core business:** freight loads and dispatch, plus per-load costs and receipts.
- **Billing:** subscription status and seat counts, kept in sync with Stripe.
- **Compliance and operations:** fuel-tax rate tables, an audit trail for document scanning, support tickets, and per-company settings.

Every Netlify Function in the app, from authentication to billing to document upload, reads and writes here. There is no second data store to keep consistent.

## The Netlify and Neon integration in practice

The piece that made this genuinely low-maintenance is the Netlify and Neon integration. Rather than copying a connection string between two dashboards and rotating it by hand, Netlify provisions and manages the Neon connection and exposes it to our functions as `NETLIFY_DATABASE_URL`. We scope the sensitive variables to the Functions environment so they never leak into the build or the client.

In day-to-day terms, this means deploying a new function that needs the database is nothing more than reading an environment variable that is already there. One less credential to manage is a real win when you are the only person managing credentials.

## Backups are still your job

Serverless does not mean someone else worries about your data for you. We run a daily automated `pg_dump` to object storage through a scheduled GitHub Action, with a retention window so we always have a recent restore point. It is a small amount of plumbing, and it is the kind of thing that is easy to skip until the day you desperately wish you had not. If you take one operational habit from this guide, make it this one.

## Where we expect to grow into Neon

To be honest about where we are: today we make schema changes directly in the Neon console. The schema is stable, the team is small, and a heavyweight migration framework would be more ceremony than the work calls for right now.

As HaulerPro grows, the next Neon capability on our list is branching, so we can test schema changes and run preview environments against production-like data before anything touches live tenant records. That is the natural progression for a serverless Postgres setup, and it is one of the reasons we chose Neon early: the room to grow into more of the platform without re-architecting the database underneath us.

## Takeaway

For a solo founder or a small team, pairing serverless Postgres with serverless functions removes a whole layer of operational work that you would otherwise be doing instead of building your product. HaulerPro runs a real multi-tenant business on Neon and Netlify with no database server to manage, and that has let me keep my attention where it belongs: on the carriers who run their business on the software.

You can see what we built at [haulerpro.app](https://haulerpro.app).

<NeedHelp/>
