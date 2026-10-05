---
title: Lakebase Postgres
subtitle: The serverless database in the Neon backend
summary: >-
  Lakebase Postgres is a fully managed, serverless PostgreSQL database compatible
  with any Postgres driver, ORM, or framework. Key features include
  autoscaling, scale to zero, database branching, instant point-in-time
  restore, and read replicas. Use this page as a starting point to create a
  project, connect an application, or explore Neon-specific features.
enableTableOfContents: true
layout: wide
hideCopyPage: true
---

<div className="not-prose -mb-4 grid grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-start gap-16 lg:mb-6 lg:grid-cols-1 lg:gap-10">

<div className="[&>div]:my-0!">
<p className="mt-0 mb-6 max-w-2xl text-base leading-[1.6] tracking-tight text-gray-new-20 [text-wrap:pretty] dark:text-gray-new-80">Serverless Postgres with storage and compute separated, so your database branches instantly, scales up with demand, and down to zero when idle.</p>
<AgentPrompt title="Set up with your agent" src="/prompts/postgres-landing.md" buttonText="Copy prompt" />
</div>

<img
  src="/docs/postgres/hero-postgres.svg"
  alt="Stateless Postgres compute reads from and writes to separate, durable Postgres storage."
  className="not-prose aspect-[364/350] w-full max-w-[320px] object-contain object-top lg:max-w-[420px]"
/>

</div>

## Get started

<DetailIconCards>

<a href="/docs/get-started/signing-up" description="Sign up for Neon and create your first project in minutes." icon="todo">Create a project</a>

<a href="/docs/get-started/connect-neon" description="Get your connection string and connect from any Postgres-compatible app." icon="network">Connect to your database</a>

<a href="/docs/get-started/frameworks" description="Step-by-step guides for Next.js, Django, Rails, and more." icon="gamepad">Connect your framework</a>

<a href="/docs/get-started/query-with-neon-sql-editor" description="Run SQL queries directly in the Neon Console, no client required." icon="sql">Query with the SQL Editor</a>

</DetailIconCards>

## Explore features

<DetailIconCards>

<a href="/docs/introduction/branching" description="Create isolated copies of your database for every branch, preview, and test run." icon="branching">Branching</a>

<a href="/docs/introduction/autoscaling" description="Automatically scale compute up and down with your workload." icon="autoscaling">Autoscaling</a>

<a href="/docs/introduction/read-replicas" description="Offload reads to replicas and scale read traffic independently." icon="split-branch">Read replicas</a>

<a href="/docs/introduction/branch-restore" description="Restore your database to any point in time within your history window." icon="todo">Instant restore</a>

<a href="/docs/connect/connection-pooling" description="Handle thousands of concurrent connections without exhausting your database." icon="network">Connection pooling</a>

<a href="/docs/serverless/serverless-driver" description="Optimized driver for serverless and edge runtimes using HTTP or WebSockets." icon="audio-jack">Serverless driver</a>

</DetailIconCards>

## About Lakebase Postgres

Lakebase Postgres is fully managed and compatible with any Postgres driver, ORM, or framework. Key capabilities include:

- **Autoscaling.** Compute scales up and down automatically with your workload.
- **Scale to zero.** Idle databases suspend, so you only pay for what you use.
- **Branching.** Create isolated, instant copies of your database for development, testing, and CI.
- **Instant restore.** Restore to any point in time within your history window.
- **Read replicas.** Scale your app by offloading read traffic to read replicas.

<NeedHelp/>
