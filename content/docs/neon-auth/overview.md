---
title: Neon Auth Overview
subtitle: Authentication, user management, and real-time Postgres sync
enableTableOfContents: true
tag: beta
---

Neon Auth connects authentication and user management directly to your Neon Postgres database. Your user data is always available right from Postgres, no need for custom sync code or webhooks.

<FeatureBetaProps feature_name="Neon Auth" />

## Why Neon Auth?

Neon Auth helps you move faster by handling the auth stack for you — from login to user data sync:

- **Add auth to your app in minutes** — with SDKs for Next.js, React, and Node.js. REST API available for any backend.
- **No more custom sync code** — user profiles are always up-to-date in your database, ready for SQL joins and analytics.
- **Built-in support for teams, roles, and permissions**.

<CTA title="Get started with Neon Auth" description="Add authentication to your app and get real-time user data sync in your database." buttonText="Get started" buttonUrl="/docs/guides/neon-auth" />

## Explore Neon Auth

<DetailIconCards>
<a href="/docs/guides/neon-auth" description="Step-by-step setup for Next.js, React, and Javascript" icon="sparkle">Quickstart</a>
<a href="/docs/guides/neon-auth-how-it-works" description="How Neon Auth keeps your user data in sync" icon="sql">How it Works</a>
<a href="/docs/guides/neon-auth-demo" description="See Neon Auth in action" icon="screen">Demo & Tutorial</a>
<a href="/docs/guides/neon-auth-best-practices" description="Tips, patterns, and troubleshooting" icon="warning">Best Practices & FAQ</a>
</DetailIconCards>

## SDKs

<DetailIconCards>
<a href="/docs/neon-auth/sdk/nextjs/overview" description="Next.js SDK and API reference" icon="code">Next.js SDK</a>
<a href="/docs/neon-auth/sdk/react/overview" description="React SDK and API reference" icon="code">React SDK</a>
</DetailIconCards>

## Templates & Demo Apps

<DetailIconCards>
<a href="https://github.com/neondatabase-labs/neon-auth-demo-app" description="Explore the open-source Next.js demo app" icon="github">Next.js Demo App</a>
<a href="https://github.com/neondatabase-labs/neon-auth-react-template" description="Starter template for React + Neon Auth" icon="github">React Template</a>
<a href="https://github.com/neondatabase-labs/neon-auth-ts-template" description="Vanilla TypeScript + Neon Auth template" icon="github">Vanilla TS Template</a>
</DetailIconCards>

## Supported Frameworks

- **Next.js** — Works with both App Router and Pages Router
- **React** — Supports any React app (Vite, CRA, etc.)
- **Node.js/JavaScript** — Use with Express or standalone scripts
- **REST API** — Integrate with any backend over HTTP

## How does it work?

- **Authentication:** Use our SDKs to add sign-up, sign-in, passwordless, and OAuth to your app.
- **Auto-sync:** Neon Auth keeps your `neon_auth.users_sync` up-to-date in your database, with no webhooks, polling, or custom scripts required.
- **Query with SQL:** Join user data with your app data, build analytics, and more.

<NeedHelp />
