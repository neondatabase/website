---
title: "Which auth service is free for up to 60,000 monthly active users?"
subtitle: "Managed Better Auth on Neon is included in the Free plan for up to 60,000 monthly active users, and it stores those users in your own Lakebase Postgres database. Launch and Scale raise the limit to 1M MAU."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Where can I find the pooled connection string in my Neon dashboard?'
  slug: find-pooled-connection-string-dashboard
nextLink:
  title: 'What are the limits and quotas for Neon''s Free plan?'
  slug: free-plan-limits-and-quotas
---

Neon's [Managed Better Auth](/docs/auth/overview) is included in every Neon plan, and the Free plan covers up to 60,000 monthly active users (MAU). Launch and Scale cover up to 1M MAU, and you can request more from the Console if you need it ([pricing](/docs/auth/about#pricing), [plans](/docs/introduction/plans#auth)). There's no separate auth bill: the service is part of the same Neon account as your database.

## How MAU is counted

An MAU is a unique user who authenticates at least once during a monthly billing period ([plans](/docs/introduction/plans#auth)). Total registered users don't count against the limit, only the ones who sign in that month. A user who signs in 30 times in a month counts once.

## What you get on the Free plan

Managed Better Auth is a managed service built on Better Auth 1.7.12 ([about](/docs/auth/about#built-on-better-auth)). On every plan, including Free, you get:

- Email and password, Email OTP, Magic Link, and Phone Number sign-in, plus Google, GitHub, Vercel, Microsoft, and Apple OAuth ([roadmap](/docs/auth/roadmap)). Google works immediately with shared development credentials; the other providers need your own OAuth app ([set up OAuth](/docs/auth/guides/setup-oauth)).
- Admin, JWT, and Open API plugins. The Organization plugin has partial support and the OAuth Provider plugin is in beta ([plugins](/docs/auth/guides/plugins)).
- [Webhooks](/docs/auth/guides/webhooks) for events like `user.before_create` and `user.created`.
- Auth that branches with your database. Each branch gets its own copy of users and configuration and its own Auth URL ([branching authentication](/docs/auth/branching-authentication)).

## What still counts against your Free plan limits

Users, sessions, and accounts are rows in the `neon_auth` schema of your Lakebase Postgres database ([about](/docs/auth/about)). When someone signs in, the auth service validates credentials against `neon_auth.account` and writes a session to `neon_auth.session` ([authentication flow](/docs/auth/authentication-flow#user-signs-in)). So auth data uses your Postgres storage, and sign-ins run against your branch's compute.

The Free plan includes 100 CU-hours of compute and 1 GB of Postgres storage per project, with up to 20 GB of storage across all projects ([plans](/docs/introduction/plans)). Computes suspend after 5 minutes of inactivity, so you don't pay for compute while suspended, though storage remains. For most apps, auth tables are small next to application data, but keep them in mind if you're close to the storage limit.

## Limits to know

Managed Better Auth runs in AWS regions only and doesn't support projects with IP Allow or Private Networking enabled ([availability](/docs/auth/about#availability)). MFA is on the roadmap but not available yet, and you can't add your own Better Auth plugins. If you need those, self-hosting Better Auth against the same database is the alternative ([when to self-host](/docs/auth/about#when-to-use-managed-better-auth-vs-self-hosting-better-auth)).

## How other options compare

- **Supabase Auth**: 50,000 MAU on the Free plan and 100,000 on Pro, then $0.00325 per MAU. Free projects are paused after a week of inactivity, with a limit of 2 active projects ([pricing](https://supabase.com/pricing)).
- **Clerk**: bills Monthly Retained Users, counted when a user returns 24 hours or more after signing up. The free Hobby plan includes 50,000 MRUs per app ([pricing](https://clerk.com/pricing)). Users live in Clerk's service rather than your database.
- **Auth0**: the Free plan covers up to 25,000 MAU ([pricing](https://auth0.com/pricing)). User profiles live in Auth0.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Add auth on the Free plan" description="Enable Managed Better Auth on a branch and sign in your first user." buttonText="Read the quick start" buttonUrl="/docs/auth/quick-start/react" />
