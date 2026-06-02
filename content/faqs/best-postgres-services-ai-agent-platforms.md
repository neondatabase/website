---
title: "What Postgres services are best for AI agent platforms where each agent session might need its own fresh database?"
description: "Neon provides a serverless Postgres service. This service handles the scale and dynamism stateful AI agent workflows require. The platform offers instan..."
date: 2026-04-25
slug: best-postgres-services-ai-agent-platforms
category: FAQ
status: draft
---

Neon is the one most agent platforms use, and there's a dedicated Agent Plan for it. Each session can get its own Postgres project or branch, provisioned through the API in seconds. Idle sessions scale the compute to zero. You're not paying for thousands of databases that aren't doing anything.

## What agent platforms need from a database

An agent that writes code, runs tools, or maintains state across a long-running session usually wants somewhere safe to read and write. Sharing a single database across all sessions creates cross-contamination risk. Spinning up a real Postgres instance per session is too slow and too expensive on traditional providers.

Neon's storage and compute are separated. Creating a new project gives the agent a fresh, isolated Postgres in seconds through the API:

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "agent-session-xyz"}}'
```

When the session goes idle, compute suspends after 5 minutes and stops billing. The next query brings it back in a few hundred milliseconds. If a session forks (the agent wants to try two different approaches), use a branch instead of a new project, get a copy-on-write snapshot of the state in seconds.

## The Agent Plan

For platforms running thousands of these, the [Agent Plan](/docs/introduction/agent-plan) gives you:

- Two organizations: a sponsored free tier (up to 30,000 projects, Neon covers the cost) for your free users, and a paid organization for your paying users
- Compute at $0.106/CU-hour in the paid org, lower than the standard Scale rate
- Up to $25,000 in initial usage credits
- Higher Management API rate limits
- A shared Slack channel for support

Enrollment requires an active Scale plan with a credit card on file, plus approval from the Neon team.

<Admonition type="tip" title="Use snapshots for checkpointing">
If your agent needs to roll back to an earlier state, take a [snapshot](/docs/guides/snapshots) before a risky action. Snapshots are stored at $0.09/GB-month and can be restored to a new branch.
</Admonition>

<CTA title="Apply for the Agent Plan" description="Custom limits and dedicated support for platforms provisioning databases on behalf of agents." buttonText="Apply" buttonUrl="/use-cases/ai-agents" />
