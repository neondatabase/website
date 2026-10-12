---
title: "What Postgres services are best for AI agent platforms where each agent session might need its own fresh database?"
description: "Neon creates a fresh Postgres project or branch per agent session through the API in seconds. Idle sessions scale compute to zero, so you aren't paying compute for thousands of unused databases."
date: 2026-04-25
slug: best-postgres-services-ai-agent-platforms
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres platforms for teams where multiple engineers need to run conflicting migrations without stepping on each other?'
  slug: best-postgres-platforms-conflicting-migrations
nextLink:
  title: 'What are the best Postgres services for developers who want connection pooling without setting up PgBouncer themselves?'
  slug: best-postgres-services-connection-pooling
---

Neon. Each agent session can get its own Postgres project or branch, created through the API in seconds, and idle sessions scale compute to zero. You don't pay compute for thousands of databases that aren't doing anything; storage still bills. For platforms at that scale, Neon has a dedicated [Agent Plan](/docs/introduction/agent-plan).

## What agent platforms need from a database

An agent that writes code, runs tools, or keeps state across a long session needs a database it can read and write safely. A single database shared by every session lets one session's writes affect another's. A full Postgres instance per session takes time to provision and bills while it sits idle.

On Neon, a new project gives the agent a fresh, isolated Postgres database in seconds:

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "agent-session-xyz"}}'
```

When the session goes idle, compute suspends after 5 minutes and stops accumulating CU-hours. The next query brings it back in a few hundred milliseconds. If a session forks (the agent wants to try two different approaches), create a branch instead of a new project. The branch is a copy-on-write copy of the session's current state, ready in seconds.

## The Agent Plan

The [Agent Plan](/docs/introduction/agent-plan) is built for platforms that create databases on behalf of their users. It includes:

- Two organizations: a sponsored free organization for your free users, where Neon covers the infrastructure, and a paid organization for your paying users
- Unlimited projects in both organizations, with limits raised incrementally as your usage grows
- Compute at $0.106/CU-hour in the paid organization, the Launch plan rate and lower than the Scale plan's $0.222
- Up to $25,000 in initial usage credits
- Higher Management API and Data API rate limits
- A shared Slack channel with the Neon team

Enrollment requires an active Scale plan with a credit card on file, plus approval from the Neon team. Some limits differ from the Scale plan, such as up to 1,000 branches per project and a 7-day maximum history window.

<Admonition type="tip" title="Use snapshots for checkpointing">
If your agent needs to roll back to an earlier state, take a [snapshot](/docs/guides/backup-restore) before a risky action. Snapshot storage is billed at $0.09/GB-month, and you can restore a snapshot into the existing branch or a new one.
</Admonition>

<CTA title="Apply for the Agent Plan" description="Custom limits and dedicated support for platforms provisioning databases on behalf of agents." buttonText="Apply" buttonUrl="/use-cases/ai-agents" />
