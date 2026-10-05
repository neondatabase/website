---
title: Managed Better Auth
subtitle: Managed authentication that branches with your database
summary: >-
  Managed Better Auth is a managed authentication service built on Better Auth. It stores
  users, sessions, and OAuth configuration in your database under
  the neon_auth schema, compatible with Row Level Security. Every database branch
  gets its own isolated auth environment, so you can test sign-up, login, and
  OAuth flows in preview or CI branches without touching production.
enableTableOfContents: true
updatedOn: '2026-09-29T21:04:10.398Z'
redirectFrom:
  - /docs/neon-auth/quick-start/nextjs
  - /docs/auth/migrate/from-stack-auth
  - /docs/neon-auth/overview
  - /docs/neon-auth/claim-project
  - /docs/neon-auth/create-users
  - /docs/guides/neon-auth-claim-project
layout: wide
hideCopyPage: true
---

<div className="not-prose -mb-4 grid grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-start gap-16 lg:mb-6 lg:grid-cols-1 lg:gap-10">

<div className="[&>div]:my-0!">
<p className="mt-0 mb-6 max-w-2xl text-base leading-[1.6] tracking-tight text-gray-new-20 [text-wrap:pretty] dark:text-gray-new-80">Neon's managed Better Auth keeps your users and sessions in your own Postgres database, so your auth state branches with your data.</p>
<AgentPrompt title="Set up with your agent" src="/prompts/auth-landing.md" buttonText="Copy prompt" />
</div>

<img
  src="/docs/auth/hero-auth.svg"
  alt="Neon's managed Better Auth stores users and sessions in a neon_auth schema inside your Postgres database, next to your tables."
  className="not-prose aspect-[364/350] w-full max-w-[320px] object-contain object-top lg:max-w-[420px]"
/>

</div>

## Quick start guides

Choose your framework to get started:

<TechCards>

<a href="/docs/auth/quick-start/nextjs-api-only" title="Next.js" description="Quick start with API methods" icon="next-js"></a>

<a href="/docs/auth/quick-start/react" title="React" description="Quick start with API methods" icon="react"></a>

<a href="/docs/auth/quick-start/tanstack-router" title="TanStack Router" description="With UI components" icon="tanstack"></a>

</TechCards>

## Explore Managed Better Auth

<DetailIconCards>

<a href="/docs/auth/about" description="How Neon's managed Better Auth works, when to use it instead of self-hosting, pricing, and availability." icon="lock-landscape">About Managed Better Auth</a>

<a href="/docs/auth/branching-authentication" description="Every database branch gets its own isolated users, sessions, and auth configuration." icon="split-branch">Branching authentication</a>

<a href="/docs/auth/authentication-flow" description="Follow a request from sign-in to session through the SDK and the auth service." icon="network">Authentication flow</a>

<a href="/docs/auth/guides/setup-oauth" description="Add Google, GitHub, and other OAuth providers to your app." icon="setup">Set up OAuth</a>

<a href="/docs/auth/production-checklist" description="Check domains, email, and OAuth credentials before you go live." icon="todo">Production checklist</a>

<a href="/docs/auth/roadmap" description="See which frameworks and Better Auth plugins are supported today." icon="research">Roadmap</a>

</DetailIconCards>

<NeedHelp/>
