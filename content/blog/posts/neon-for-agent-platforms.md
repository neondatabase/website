---
title: "Neon for Agent Platforms: A Companion Skill for the AI Agent Program"
description: >-
  Introducing neon-for-agent-platforms, a companion skill for building and operating fleets of Postgres databases with Neon.
excerpt: >-
  We've been working on neon-for-agent-platforms, a companion skill that
  complements our existing neon-postgres skill. The existing skill covers auth,
  drivers, branching, the Data API, MCP, and core Postgres-on-Neon guidance.
  Agent platforms have a different problem though: they don't just use one
  database, they provision and operate fleets of them.
date: "2026-05-22T09:00:00"
updatedOn: "2026-05-22T09:00:00"
category: ai
categories:
  - ai
authors:
  - savannah-longoria
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-for-agent-platforms/cover.png
  alt: Terminal window showing the npx skills add command for neon-for-agent-platforms
isFeatured: false
seo:
  title: "Neon for Agent Platforms: A Companion Skill for the AI Agent Program - Neon"
  description: >-
    Introducing neon-for-agent-platforms, a companion skill for AI coding agents
    that need to provision and operate fleets of Postgres databases.
  keywords: []
  noindex: false
  ogTitle: "Neon for Agent Platforms: A Companion Skill for the AI Agent Program - Neon"
  ogDescription: >-
    Introducing neon-for-agent-platforms, a companion skill for AI coding agents
    that need to provision and operate fleets of Postgres databases.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-for-agent-platforms/cover.png
---

We've been working on [neon-for-agent-platforms](https://github.com/neondatabase/neon-for-agent-platforms), a companion skill that complements our existing neon-postgres skill. The existing skill covers auth, drivers, branching, the Data API, MCP, and core Postgres-on-Neon guidance. Agent platforms have a different problem though: they don't just use one database, they provision and operate fleets of them.

This companion skill fills that gap with dual-org fleets, project transfer, per-tenant provisioning, compound checkpoints, and the consumption API. It teaches agents how to create and manage thousands of databases as a platform, using real-life patterns adopted by some of our biggest agent customers like Replit and Retool.

## What it includes

The repo includes a companion Agent Skill and sample TypeScript scripts you can run directly. It covers the control-plane patterns agent platforms actually need:

- **Dual-org fleet model:** Two Neon organizations (sponsored free-tier vs. paid), with your control plane choosing `NEON_ORG_ID` per customer tier when creating projects. Org-scoped API keys per org, personal API key for cross-org transfer.
- **Per-tenant provisioning and transfer:** Programmatic project creation, one project per customer app, and project transfer into the paid org on upgrade.
- **Dev, staging, and preview vs. production:** How to model non-prod alongside production inside each tenant project — usually a production branch (root/main) plus development branches for isolated dev, staging, or previews. Branches are copy-on-write and get their own compute; patterns like shorter suspend timeouts on dev branches help keep fleet costs predictable. The skill also ties this to branch limits *(free vs paid orgs)* so you can reason about guardrails at scale.
- **Versioning and compound checkpoints:** Branch-based snapshots for workflow checkpoints, plus compound checkpoint patterns for app-level metadata beyond Neon IDs.
- **Consumption API:** Track usage across orgs and projects.
- **Runnable samples:** `npm run neon:list-projects`, `npm run branch -- list`, `npm run consumption`, `npm run auth-users -- meta`, `npm run versioning-flow`. The full catalog and env var mapping can be found in [MANAGEMENT_API_SAMPLES.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/references/MANAGEMENT_API_SAMPLES.md).

For drivers, connection strings, and everyday Neon app integration, it refers to neon-postgres and the Neon docs so it stays up to date.

## How to use it

Install both skills in your editor of choice:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
npx skills add neondatabase/neon-for-agent-platforms -s neon-postgres-agent-platforms
```

Once both skills are installed, your AI assistant has the context it needs for platform-level work. Ask it to set up a dual-org fleet, provision a project for a new user, create a compound checkpoint, or pull consumption data across an org. It'll know the right API calls and patterns without you having to paste in docs.

Some example prompts:

- I want each tenant to have prod on the main branch and a throwaway staging database. Show me how to create a dev branch from prod, run migrations against it, and tear it down or reset it without changing prod's connection string.
- Create a new Neon project for a user who just signed up, and show me how to transfer it to the paid org when they upgrade.
- I need to snapshot the current state of a user's project before running a migration. Create a branch checkpoint and store the metadata somewhere I can look it up later.
- How do I set up guardrails so one tenant can't spin up unlimited branches and run up costs?
- Pull consumption data across my org and break it down by project so I can attribute costs per customer.
- Walk me through the full provisioning flow: user signs up, gets a database, works in free tier, upgrades to paid. What API calls happen at each step?

If you want to try the scripts outside of an editor, clone the repo and run them directly:

```bash
git clone https://github.com/neondatabase/neon-for-agent-platforms.git
cd neon-for-agent-platforms/scripts
npm install
cp .env.example .env
# Set NEON_API_KEY, NEON_ORG_ID
npm run neon:list-projects
```

We built this because our largest agent platform customers kept solving the same control-plane problems independently. Now that it's open, we'd love your input. Try the skill, run the scripts, and open an issue or PR if something's missing from your workflow.

Get started: [neon-for-agent-platforms repo](https://github.com/neondatabase/neon-for-agent-platforms) · [neon-postgres skill](https://github.com/neondatabase/agent-skills) · [Neon docs](https://neon.com/docs/introduction). If you're building an agent platform on Neon and want to talk architecture, reach out. We're happy to pair on it.
