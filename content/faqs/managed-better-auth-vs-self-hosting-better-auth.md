---
title: "Should I use Managed Better Auth or self-host Better Auth?"
subtitle: "Use Managed Better Auth on Neon when you want Better Auth without running it: users and sessions live in your Lakebase Postgres database, auth branches with your data, and the Data API verifies its tokens out of the box. Self-host Better Auth when you need custom plugins, hooks, or full control over the auth code."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Is there an LLM gateway that charges provider prices and puts all model usage on one bill?'
  slug: llm-gateway-provider-prices-single-bill
nextLink:
  title: 'Which managed Postgres databases have a free tier generous enough to run a real app without paying anything until you have users?'
  slug: managed-postgres-databases-free-tier
---

Start with Managed Better Auth unless you need something it doesn't support yet. [Managed Better Auth](/docs/auth/overview) is a managed service built on Better Auth 1.7.12 that runs in the same region as your database and stores users, sessions, and auth configuration in a `neon_auth` schema in your Lakebase Postgres database ([about](/docs/auth/about#built-on-better-auth)). Self-hosting [Better Auth](https://www.better-auth.com/) makes sense when you need custom plugins, hooks, or options the managed service doesn't offer, or want to run the auth code inside your own infrastructure ([when to self-host](/docs/auth/about#when-to-use-managed-better-auth-vs-self-hosting-better-auth)).

## What the managed service takes off your plate

With self-hosted Better Auth, the auth server is part of your app. You run its migrations, handle connection pooling (especially in serverless runtimes where each request can open a new connection), and decide when to upgrade ([comparison guide](/guides/nextauth-neon-auth-better-auth-postgres)). Managed Better Auth runs as a REST API service you configure in the Console, from the CLI with `neon neon-auth enable`, or by declaring `auth: true` in [`neon.ts`](/docs/reference/neon-ts). Your app talks to it through `@neon/auth` 0.8.1 or later, which uses a Better Auth 1.7.12 client, or through your own Better Auth 1.7+ client ([about](/docs/auth/about)).

The managed service also adds things a library can't do by itself ([about](/docs/auth/about#when-to-use-managed-better-auth-vs-self-hosting-better-auth)):

- **Branch-aware auth.** Every branch gets a copy of users, sessions, configuration, OAuth providers, JWKS keys, and organizations, plus its own Auth URL. Tokens from one branch aren't valid on another ([branching authentication](/docs/auth/branching-authentication)).
- **Data API integration.** The [Data API](/docs/data-api/overview) validates Managed Better Auth JWTs without extra setup, so Row-Level Security policies can call `auth.user_id()` directly ([authentication flow](/docs/auth/authentication-flow#data-api-integration)).
- **Shared Google OAuth credentials** for testing, so you can try social sign-in before registering your own app ([set up OAuth](/docs/auth/guides/setup-oauth)).

## What you give up

Managed Better Auth supports a fixed set of Better Auth features. Email and password, social OAuth (Google, GitHub, Vercel, Microsoft, Apple), Email OTP, Magic Link, Admin, JWT, Open API, and Phone Number are supported. The Organization plugin has partial support, the OAuth Provider plugin is in beta, and MFA is coming soon ([roadmap](/docs/auth/roadmap), [plugins](/docs/auth/guides/plugins)). SAML SSO isn't supported ([API compatibility](/docs/auth/migrate/from-supabase#api-compatibility)). You can't add your own Better Auth plugins or custom hooks.

For customization, the managed service offers [webhooks](/docs/auth/guides/webhooks) instead. Blocking events like `user.before_create`, `send.otp`, and `send.magic_link` let you validate signups or deliver codes through your own channel, and non-blocking events like `user.created` let you sync new users to other systems.

Architecture matters too. Managed Better Auth uses HTTP-only cookies, so setups where the frontend and backend are separate deployments on different domains aren't supported yet ([roadmap](/docs/auth/roadmap#frameworks)). It runs in AWS regions only and doesn't work with projects that have IP Allow or Private Networking enabled ([availability](/docs/auth/about#availability)).

## Self-hosting Better Auth on Neon

Self-hosting doesn't mean leaving Neon. Better Auth has a Postgres adapter and a CLI that generates and migrates its tables, so you can point it at your Lakebase Postgres database and keep users next to your data ([comparison guide](/guides/nextauth-neon-auth-better-auth-postgres)). Because those tables are ordinary rows in your database, they still come along when you create a branch. What you don't get is a separate auth endpoint per branch or built-in Data API token validation; you'd configure the Data API with your own JWKS URL ([custom providers](/docs/data-api/custom-authentication-providers)).

## Cost

Managed Better Auth is included in every plan: up to 60,000 monthly active users on Free and up to 1M on Launch and Scale ([pricing](/docs/auth/about#pricing)). With self-hosted Better Auth, you pay for the compute that runs it and the database it writes to.

## A quick way to decide

- Pick **Managed Better Auth** if the supported plugins cover your needs and you want auth that branches with previews and CI without running an auth server.
- Pick **self-hosted Better Auth** if you need a plugin or hook outside the [supported list](/docs/auth/roadmap), a separate frontend and backend on different domains, or a region outside AWS.

<CTA title="Try Managed Better Auth" description="Enable auth on a branch and sign in your first user with the React quick start." buttonText="Read the overview" buttonUrl="/docs/auth/overview" />
