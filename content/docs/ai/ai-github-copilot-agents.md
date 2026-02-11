---
title: Neon agents for GitHub Copilot
subtitle: Custom agents for safe database migrations and query optimization in VS Code
summary: >-
  Covers the setup of custom agents for GitHub Copilot that facilitate safe
  database migrations and query optimization in VS Code, utilizing Neon's
  branching workflow for efficient development.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.719Z'
---

GitHub Copilot now supports custom agents, and we've built two specialized agents that bring Neon's branching workflow directly into your IDE. These agents help you run safe database migrations and identify slow queries — all without leaving VS Code.

## Available agents

### Neon Migration Specialist

The [Neon Migration Specialist](https://github.com/github/awesome-copilot/blob/main/agents/neon-migration-specialist.agent.md) helps you run safe Postgres migrations with zero downtime using Neon's branching workflow.

**What it does:**

1. Creates a temporary database branch from your main branch
2. Runs your migration on the test branch to validate it works
3. Validates the changes thoroughly
4. Deletes the test branch after validation
5. Creates migration files and opens a PR — letting you or your CI/CD apply the migration to your main branch

The agent works with your existing ORM migration system (Prisma, Drizzle, SQLAlchemy, Django, Rails, and more) and falls back to [migra](https://github.com/djrobstep/migra) if no migration system exists.

<Admonition type="important">
The Migration Specialist never runs migrations directly on your main branch. All changes are tested on temporary branches first, and the actual migration is committed to your git repository for you or your CI/CD to execute.
</Admonition>

### Neon Performance Analyzer

The [Neon Performance Analyzer](https://github.com/github/awesome-copilot/blob/main/agents/neon-optimization-analyzer.agent.md) helps you identify and fix slow Postgres queries automatically.

**What it does:**

1. Creates an analysis branch from your main branch
2. Enables `pg_stat_statements` if not already installed
3. Identifies slow queries by analyzing execution statistics
4. Uses `EXPLAIN` to understand bottlenecks
5. Investigates your codebase to understand query context
6. Tests optimizations (indexes, query rewrites) on a temporary branch
7. Provides recommendations via PR with clear before/after metrics
8. Cleans up all temporary branches

The agent provides actionable code fixes with performance metrics showing execution time improvements, rows scanned, and other relevant data.

## Prerequisites

Both agents require:

- **Neon API Key**: Create one at [console.neon.tech/app/settings/api-keys](https://console.neon.tech/app/settings#api-keys)
- **Project ID or connection string**: The agent will ask for this if not provided

## Installation

### Option 1: Install from VS Code marketplace

The agents are available in the GitHub Copilot agent marketplace in VS Code:

1. Open VS Code
2. Go to the Extensions view
3. Search for "Neon Migration Specialist" or "Neon Performance Analyzer"
4. Click **Install**

### Option 2: Add to your repository

You can add the agent definition files directly to your project:

1. Create a `.github/copilot/agents/` directory in your repository
2. Download the agent files:
   - [neon-migration-specialist.agent.md](https://raw.githubusercontent.com/github/awesome-copilot/main/agents/neon-migration-specialist.agent.md)
   - [neon-optimization-analyzer.agent.md](https://raw.githubusercontent.com/github/awesome-copilot/main/agents/neon-optimization-analyzer.agent.md)
3. Save them to your `.github/copilot/agents/` directory

## Usage

Once installed, invoke the agents in GitHub Copilot Chat by mentioning their name:

### Migration examples

```
@neon-migration-specialist Add a new email column to my users table
```

```
@neon-migration-specialist Create a posts table with title, content, and author_id columns
```

```
@neon-migration-specialist Add a foreign key from orders.customer_id to customers.id
```

### Performance analysis examples

```
@neon-performance-analyzer Find and fix slow queries in my database
```

```
@neon-performance-analyzer Analyze why my user search query is slow
```

```
@neon-performance-analyzer Optimize the queries in my checkout flow
```

## How branching keeps your data safe

Both agents leverage Neon's instant branching to create isolated environments for testing. This means:

- **No changes to production**: All migrations and optimizations are tested on temporary branches first
- **Full data copy**: Test branches include a complete copy of your schema and data
- **Automatic cleanup**: Temporary branches are deleted after validation (default TTL: 4 hours)
- **Git-based workflow**: Changes are committed to your repository, not applied directly

This workflow ensures you can safely experiment with schema changes and performance optimizations without risking your production data.

## Resources

- [Neon Migration Specialist on GitHub](https://github.com/github/awesome-copilot/blob/main/agents/neon-migration-specialist.agent.md)
- [Neon Performance Analyzer on GitHub](https://github.com/github/awesome-copilot/blob/main/agents/neon-optimization-analyzer.agent.md)
- [Neon branching documentation](/docs/introduction/branching)
- [awesome-copilot repository](https://github.com/github/awesome-copilot)

<NeedHelp />
