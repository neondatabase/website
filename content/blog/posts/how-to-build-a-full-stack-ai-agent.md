---
title: How to Build a Full-Stack AI Agent
description: >-
  A complete open-source example using Vercel, Freestyle, Assistant UI, Mastra,
  Drizzle, and the Neon stack
excerpt: >-
  More and more teams are using Neon to power vibe coding platforms, so we
  decided to build one too – not as our
  billion-dollar-vibe-coding-startup-side-gig but as a public, open-source
  template you can use as a starting point to learn how to build codegen agents
  yourself. We calle...
date: '2025-10-29T18:40:53'
updatedOn: '2025-10-29T18:46:52'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-build-a-full-stack-ai-agent/cover.jpg
  alt: null
isFeatured: true
seo:
  title: How to Build a Full-Stack AI Agent - Neon
  description: >-
    Learn how to build your own full-stack AI agent from scratch, with
    open-source code and architectural breakdown.
  keywords: []
  noindex: false
  ogTitle: How to Build a Full-Stack AI Agent - Neon
  ogDescription: >-
    Learn how to build your own full-stack AI agent from scratch, with
    open-source code and architectural breakdown.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-build-a-full-stack-ai-agent/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-build-a-full-stack-ai-agent/neon-template-1024x576-879a51ec.jpg)

**More and more teams are using Neon to power vibe coding platforms, so we decided to build one too – not as our _billion-dollar-vibe-coding-startup-side-gig_ but as a public, open-source template you can use as a starting point to learn how to build codegen agents yourself.**

<br />We called the agent Aileen, and all the code lives here:

[github.com/andrelandgraf/aileen](https://github.com/andrelandgraf/aileen?utm_source=chatgpt.com)

You can also try it out yourself [here](https://aileen-blue.vercel.app/). Here’s how it looks in action:

<YoutubeIframe embedId="P65x5LBz-7w" isDocPost={false} />

Let’s walk you through how it works.

## What Aileen (The Agent) Can Do

Aileen is an AI chat app and codegen platform that ties together everything you need to prompt (aka. vibe code) web applications front to back. It can

- **Generate complete web apps from a prompt.** You describe what you want to build and Aileen scaffolds it for you with the right files, dependencies, and setup.
- **Provision a Postgres database automatically.** Every app Aileen generates comes with its own database with schema and connection already configured.
- **Add authentication.** Each generated app also includes a working auth layer, so users can sign up, log in, and interact securely without extra setup.
- **Track project versions.** Aileen saves your generated apps and their versions so you can revisit previous iterations or roll back to an earlier state. Notably, your database always stays in sync with the selected project version.
- **Run and preview apps instantly.** You can test each generated project right from the UI or visit the preview URL directly. Even a VS Code for the Web instance of the development server is accessible through the UI.
- **Keep context between generations.** Conversations with Aileen aren’t one-off: the agent remembers your previous instructions and builds on them, enabling iterative creation.
- **Scale down when idle.** Because each app uses a serverless Neon database, unused projects automatically pause, reducing resource usage to zero when you’re not building.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-to-build-a-full-stack-ai-agent/image-6-1024x566-a46cd70e.png" alt="Image" />
<figcaption><em>Aileen UI. Note the versions list and the Create checkpoint button</em></figcaption>
</figure>

## The Architecture

**The stack is intentionally modular,** so you can swap parts without rewriting the world. At a high level, there’s a core platform that coordinates users, projects, and conversations, and a per-app provisioning flow that spins up isolated resources for each generated project.

### Neon (Postgres for the control plane)

[Neon](https://neon.com/) stores the platform’s own data: users, projects, projects versions…This is your source of truth for “what exists,” “who owns it,” and “what version is current.” Because it’s Postgres, you also get transactional safety for writes during multi-step generation flows.

### Neon Auth (powered by Stack Auth)

[Neon Auth](https://neon.com/docs/neon-auth/overview) handles sign-up/sign-in, session management, and user identity. The app checks this session on every request (server and API routes) and uses the authenticated user ID as the join key across projects, versions, and persisted chat. Defaults are compatible with RLS so you can enforce per-row access if you extend the schema.

### Assistant UI (chat + persistence)

[Assistant UI Cloud](https://www.assistant-ui.com/) renders the chat interface, streams model outputs, and keeps message state coherent across turns. All conversation data is persisted so threads survive refreshes, can be reloaded across sessions, and remain queryable for retrieval or long-term “memory.”

### Mastra (agent orchestration + hosting)

[Mastra](https://mastra.ai/) is the framework that executes tool calls and the multi-step agent loop. When a user asks for a new app or a change, the codegen-agent iterates on the prompt and decides what tools to call to fullfill the request (e.g. query or inspect the Neon database, read and write files on the development server, or search the web). Mastra Cloud is used to run the Mastra agent in a long-running environment that streams responses to the core platform’s Assistant UI chat.

You can also explore the Mastra Playground, which lists all available agents (in Aileen’s case, just one) and the tools they have registered. It’s a great debugging companion and lets you run the same agent logic locally before deploying it to Mastra Cloud.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-to-build-a-full-stack-ai-agent/image-7-1024x566-c42d2525.png" alt="Image" />
<figcaption><em>Mastra Playground, with a list of all currently available tools</em></figcaption>
</figure>

### Vercel (app hosting & background tasks)

The core platform runs as a Next.js application deployed on [Vercel](https://vercel.com/). In addition to hosting the app, Vercel is also used to queue and execute longer-running background tasks. Creating a new codegen project (including provisioning a development server) can exceed the execution limits of serverless functions, so these operations are handled through Vercel Workflows. The [Workflow Development Kit (WDK)](https://vercel.com/blog/introducing-workflow) makes it straightforward to build step functions that reliably orchestrate those tasks on Vercel. 👀

### Freestyle (development servers & Git integration)

[Freestyle.sh](https://www.freestyle.sh/) powers Aileen’s development environments. It gives the platform high-level primitives to:

- create new Git repositories for every generated app
- spin up isolated development sandboxes with filesystem and process access for the agent, and<br />deploy apps to a lightweight, serverless runtime

Freestyle also includes a full MCP server, which exposes filesystem and process commands directly to the agent. In theory, Aileen could use it out of the box; in practice, the implementation relies on custom Freestyle tools for tighter control and easier debugging… And, honestly, just for fun 🙂

### Per-app provisioning

Each user-created project is isolated so one project’s experiments don’t interfere with another’s:

- **Dedicated Neon Postgres database (with** [snapshots](https://neon.com/docs/ai/ai-database-versioning)**).** On “create project,” the platform calls Neon’s API to provision a Neon project for that app. Each project’s data is isolated at the database level, and snapshots are used to capture version states over time. They are tied to the matching Git commit for consistent rollback and version history.
- **Auth configuration (via** [Neon Auth](https://neon.com/docs/neon-auth/overview)**).** Neon Auth brings authentication and user management natively to your Neon Postgres database. Each code-generated app is automatically set up to work with Neon Auth so that the codegen agent can immediately start using user authentication utilities.
- [Freestyle.sh](https://freestyle.sh) **dev server with git integration.** Freestyle provides high-level primitives to create a new Git repository for each generated app, provision development sandboxes with filesystem and process access for the agent, and handle production deployments to a serverless environment.

## How it Works: End-to-End Flow

We can break things down into two stages: project setup (handled by the control plane) and project iteration (driven by the agent).

### Project setup (control plane)

When a new project is created, the control plane coordinates a full environment setup before the agent starts coding, with source repo, database, auth, and dev server.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-to-build-a-full-stack-ai-agent/image-9-1024x566-42044826.png" alt="Image" />
<figcaption><em>Here’s how the control-plane, meta db Neon project looks like in the Neon console</em></figcaption>
</figure>

1. **Create Neon project (with Neon Auth)** The control plane calls the [Neon API](https://neon.com/docs/reference/api-reference) to create a new database inside a shared multi-tenant Neon organization. It also initializes [Neon Auth](https://neon.com/docs/neon-auth/overview) for the project, generating client and server keys and registering callback URLs.
2. **Create new git repo.** A new repository is created on [Freestyle.sh](https://freestyle.sh). This will host all generated code and subsequent commits. The repository is based on [a starter Next.js template](https://github.com/andrelandgraf/neon-freestyle-template) that is set up to serve as a good starting point for the agent.
3. **Request dev server (Freestyle).** The control plane sends a request to Freestyle to spin up a development server linked to the repo. This server will later run CLI commands for code scaffolding and preview builds.
4. **Save credentials and secrets.** The resulting DATABASE_URL, Neon Auth keys, and other environment variables are stored securely in the meta database (the control-plane Postgres on Neon).
5. **Retrieve initial commit.** Once Freestyle finishes scaffolding, the system retrieves the initial Git commit hash from the dev server using CLI commands.
6. **Create initial snapshot (Neon).** The control plane calls Neon again to create a [snapshot](https://api-docs.neon.tech/reference/createsnapshot) of the project database, capturing its initial state before the agent begins work.
7. **Save version metadata.** The snapshot ID and Git commit hash are stored together as version 1 of the project in the control-plane database.

### Project iteration (agent loop)

Once setup is complete, the agent steps in to plan and execute changes. Each agent execution starts with a prompt sent from the frontend (Assistant UI components) to Mastra Cloud. The agent has access to a toolkit composed of MCP servers (context7 for docs retrieval, Neon for database management) and several custom tools for environment variable management and interacting with the Freestyle development server.

1. **Prompt.** The user describes what to build or change (“Add a notes table,” “Deploy a new route,” etc)
2. **Agent reasoning.** The agent can take up to 50 steps per task, invoking tools, reading context, and iterating toward a solution.
3. **Tool calls.** The agent uses:
   - Custom tools to interact with the Freestyle development server’s filesystem and execute bash commands (ls, read_file, write_file, exec)
   - [Neon MCP tools](https://github.com/neondatabase/mcp-server-neon) to inspect the database, run SQL queries, and otherwise manage the project as it sees fit
   - A custom commit and push tool that uses Freestyle’s git service to commit and push the changes and then create a new project version – more about that in the next step
   - Environment-variable management tools to update the development servers’ environment variables (delete, list, add), later stored in the `project_secret` table. The `project_secrets` table stores all environment variables (like Neon Auth keys and database URLs) and versions them alongside each app release._PS, Be aware hey’re stored in plain text for now; it’s a demo, after all 🙂_
   - Context7 MCP server for optional documentation retrieval, letting the agent fetch external references on demand.
4. **Completion, commit and push.** Once the agent declares the task done, the system prompt instructs it to finalize the iteration by committing changes (calling the commit and push tool). The tool performs:
   - `git commit` and `git push` on the Freestyle repo
   - Retrieves the new Git commit hash
   - Calls Neon to create a new snapshot of the project database
   - Stores both identifiers (commit + snapshot) as the next project version in the `project_versions` table
   - Persists the latest environment variables in the `project_secrets` table
5. **Version tracking.** Each version pairs code and data: the Git commit represents code changes, and the Neon snapshot represents the exact matching database state. This guarantees you can always roll back or branch from any version with full fidelity.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-to-build-a-full-stack-ai-agent/image-10-1024x566-01bfb571.png" alt="Image" />
<figcaption><em>Here’s how the code-generated projects look like in the Neon console</em></figcaption>
</figure>

## Magic Features

### Checkpointing & versioning via Neon Snapshots

Aileen treats each version of an app as a [lightweight checkpoint for both code and data](https://neon.com/blog/checkpoints-for-agents-with-neon-snapshots). Every time the agent commits new code, a corresponding Neon snapshot captures the exact state of the project’s database (schema + data) at that moment. The Git commit hash and Neon snapshot ID are stored together, forming a perfectly synced record of that version.

You can easily jump between versions or fully revert back in case the agent messes up or you decide to discard made changes. This dual versioning model (Git for code, Neon for data) makes it safe to iterate, experiment, and recover from mistakes without losing alignment between your app and its database.

Here’s the create-snapshot API call:

```typescript
   const res = await fetch(
     `${this.baseUrl}/projects/${neonProjectId}/branches/${prodBranch.id}/snapshot`,
     {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${this.apiKey}`,
         Accept: "application/json",
       },
       body: JSON.stringify({
         timestamp: options.timestamp?? new Date().toISOString(),
         name: options.name,
       }),
     },
   );
```

The restore-snapshot API call:

```typescript
   const res = await fetch(
     `${this.baseUrl}/projects/${neonProjectId}/snapshots/${snapshotId}/restore`,
     {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${this.apiKey}`,
         Accept: "application/json",
       },
       body: JSON.stringify({
         name: `before_restore_${Date.now()}`,
         finalize_restore: true,
         target_branch_id: targetBranchId,
       }),
     },
   );
```

And the create-snapshot workflow:

```typescript
export async function createManualCheckpoint(
 projectId: string,
 repoId: string,
 neonProjectId: string,
 currentDevVersionId: string,
 secrets: Record<string, string>,
 assistantMessageId: string | null,
) {
 "use workflow";
 const [currentCommitHash, snapshotId] = await Promise.all([
   getCurrentCommitHash(repoId, secrets),
   createCheckpointSnapshot(neonProjectId),
 ]);
 const checkpointVersion = await createCheckpointVersion(
   projectId,
   currentCommitHash,
   snapshotId,
   assistantMessageId,
 );
 await Promise.all([
   copyProjectSecrets(currentDevVersionId, checkpointVersion.id),
   setCurrentDevVersion(projectId, checkpointVersion.id),
 ]);
 return { success: true, versionId: checkpointVersion.id };
}
```

### Schema migrations with Drizzle

The Neon MCP server offers migration tools, but for Aileen, we decided to use Drizzle for managing migrations. Whenever the agent makes changes to the Drizzle schema, it is tasked to then generate the migration files and apply them using the drizzle-kit generate and drizzle-kit migrate commands. This makes migrations much easier to replay as they are part of the version controlled code base.

Here’s part of the system prompt:

```bash
Drizzle ORM (for schema management):
- Define and modify database schemas in Drizzle schema files
- Use Drizzle in the application code for type-safe queries
- Run schema changes via package.json scripts using the freestyle-exec tool:
 - Generate migrations: \`cd /template && npm run db:generate\` (background: false - run in foreground to inspect output)
 - Run migrations: \`cd /template && npm run db:migrate\` (background: false - run in foreground to inspect output)
- Never hardcode database credentials - use environment variables
```

### Persistence of chat state

Messages, tool runs, and planning notes are displayed with [Assistant UI](https://www.assistant-ui.com/) and persisted with Assistant UI Cloud so the agent can build context acrosss22 and sessions. That enables “continue where we left off,” auditability of what the agent decided, and retrieval of prior instructions when creating new versions. Referencing message identifiers with project version metadata also makes it easy to correlate a conversation turn with the version it produced.

### Versioned project secrets

Each generated project includes a schema for managing and versioning environment variables. Every `project_version` entry references its own set of secrets (database URL, Neon Auth keys, etc.) stored in the `project_secrets` table. This ensures that even if credentials or environment settings change later, historical versions remain reproducible. This is a simple implementation, but demonstrates how agents can manage environment state alongside code and data.

### Scale-to-zero by default

Every generated app gets its own serverless Postgres on Neon, which idles automatically when unused and wakes on demand. That’s a perfect fit for codegen/agent workloads, where bursts of activity are followed by long quiet periods. You can run lots of projects concurrently without carrying idle database costs.

## Wrapping Up

**Use Aileen as your reference template for building your agent.** You can fork the repo, run it locally, or adapt it to your own setup [: github.com/andrelandgraf/aileen](https://github.com/andrelandgraf/aileen?utm_source=chatgpt.com)

If you have any questions, you can find us in [Discord](https://discord.com/invite/92vNTzKDGp)!

<Admonition type="important" title="Neon's Agent Plan">
If you're building your own agent platform and need a backend, [take a look at Neon's Agent Plan.](https://neon.com/use-cases/ai-agents) You can get special pricing, resource limits, and assistance to get your platform up and running.
</Admonition>
