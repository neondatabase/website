---
title: Welcome back to Neon
subtitle: Reconnect to your account and get up and running in a few steps
summary: >-
  You tried Neon before. Use this guide to reconnect, see what you have, install
  Neon for your AI assistant, and choose your next step: connect an app, learn
  concepts, or explore your data.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

You once used Neon. Welcome back. This guide gets you reconnected in three steps: we'll show you what's still in your account, then you pick your next step (connect an app, brush up on concepts, or explore your data). Run the install command below, then use the prompts in your AI chat (Cursor or Claude Code).

<Steps>

## Step 1: Install Neon for your AI assistant

Run this once in your **terminal** so your assistant can talk to Neon again:

```bash
npx neonctl@latest init
```

This signs you in (same email or GitHub), refreshes your API key, and installs the Neon MCP Server, the Neon extension (Cursor/VS Code), and agent skills. **Restart your editor**, then open your **AI chat**. After that, your assistant can list your projects, run SQL, and manage Neon from the chat. Reconnecting doesn't change your projects or billing. Learn more: [neonctl init](/docs/reference/cli-init).

## Step 2: See what you already have

In your AI chat, run these prompts to get a quick picture of your account. Replace `[project-name]` with a project name from the first response if needed.

**List your organizations and projects:**

```text
List my Neon organizations and the projects in each organization
```

**Describe a project (branches, databases):**

```text
Describe my project [project-name]
```

**See tables in a database (optional):**

```text
List the tables in my project [project-name] in the default database
```

You'll see what projects and data you have; from here you can pick up with an existing project or create a new one.

**A few things that might come up:**

- **Is my data still there?** Neon doesn't delete your projects or data without notice. Idle projects may be suspended; use the Describe prompt above or [Neon Console](https://console.neon.tech) to check status and restore if needed.
- **I don't see any projects.** List organizations first; if empty, use [Get started with Neon](/docs/ai/natural-language-guide-get-started).
- **I'm on another database now.** You can import or start fresh: [Get started with Neon](/docs/ai/natural-language-guide-get-started), [Connect your app](/docs/ai/natural-language-guide-connect-app), or [Migrate to Neon](/docs/import/migrate-intro).

## Step 3: Choose your next step

**What might be new since you last saw us?** [What we've shipped recently](/docs/introduction/roadmap#what-weve-shipped-recently). Pick what fits you best; each link below takes you to a short natural language guide you can follow in your AI chat.

| If you want to…                                     | Use this guide                                                                                                                                              |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create a new project or get a connection string** | [Get started with Neon](/docs/ai/natural-language-guide-get-started): create a project and get your connection string in one flow                           |
| **Connect an app (Next.js, Drizzle, etc.)**         | [Connect your app](/docs/ai/natural-language-guide-connect-app): set up a Neon project and app connection with natural language                             |
| **Learn (or relearn) Neon's core concepts**         | [Learn Neon concepts](/docs/ai/natural-language-guide-learn-concepts): branching, scale to zero, serverless Postgres, restore window; answers from our docs |
| **Understand plans, billing, and the free tier**    | [Learn Neon plans and billing](/docs/ai/natural-language-guide-learn-plans-billing): how Neon bills, what's on the Free plan, and how to manage your bill   |
| **Explore your data or run SQL**                    | [Explore projects and run SQL](/docs/ai/natural-language-guide-explore-sql): list projects, branches, tables, and run queries from the chat                 |
| **Try branching (dev, test, migrate)**              | [Branching development workflow](/docs/ai/natural-language-guide-branching-workflow): create a project, branch, change schema, and migrate to production    |

</Steps>

<NeedHelp/>
