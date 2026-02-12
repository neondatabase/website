---
title: Integrating with Neon
subtitle: Choose the right integration path for your platform or application
summary: >-
  Covers the integration options for incorporating Postgres into platforms and
  applications, focusing on AI agent workflows and instant database provisioning
  without user signup.
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/guides/partner-intro
  - /docs/guides/platform-integration-intro
  - /docs/guides/platform-integration-get-started
updatedOn: '2026-02-06T22:07:33.031Z'
---

Neon provides multiple options for integrating Postgres into your platform, application, or service. Choose the integration approach that best matches your use case.

## ☑ AI Agents integration

**Best for:** AI agent and codegen platforms that need database versioning and isolated environments

Use this approach if you're building an AI agent platform or code generation service where agents create and manage databases programmatically. This integration includes everything from the embedded Postgres approach, plus specific features for agent workflows.

**Key features:**

- Two-organization structure (free tier sponsored by Neon, paid tier for your paying users)
- Database versioning with snapshots and point-in-time recovery
- Isolated development environments per user
- Project transfers between organizations when users upgrade
- Agent-specific pricing and rate limits
- Dedicated support channel

**Example use cases:**

- AI agent platforms
- Code generation platforms
- LLM-powered development tools
- Autonomous database management tools

<DetailIconCards>

<a href="/docs/introduction/agent-plan" description="Learn about the Neon Agent plan and how to enroll" icon="database">Agent plan</a>

<a href="/docs/guides/ai-agent-integration" description="Learn about the agent-specific integration" icon="openai">AI Agent integration guide</a>

<a href="/docs/ai/ai-database-versioning" description="Learn about database versioning for AI agents" icon="branching">Database versioning</a>

</DetailIconCards>

---

## ☑ Claimable database flow (Instagres)

**Best for:** Plugins and platforms that want to offer instant database provisioning as part of their developer experience without requiring user signup

Use this approach when you want to create databases for your users without requiring them to create a Neon account first. Users receive a connection string immediately and can optionally claim ownership of the database later by creating a Neon account. This is ideal for CLI tools, framework plugins, and platforms that want to streamline onboarding.

**Key features:**

- Instant database provisioning with no user signup required
- 72-hour database lifespan if not claimed
- Seamless ownership transfer when users are ready
- Connection strings remain valid after claiming
- Configurable transfer request expiration

**Example use cases:**

- Framework plugins and CLI tools (like TanStack's Vite plugin)
- Demo environments and trial experiences
- Educational platforms providing databases to students
- Development tools that need instant database access
- SaaS applications with deferred account creation
- AI agents requiring database access without authentication overhead

**Example implementations:**

- [TanStack](https://neon.com/blog/neon-joins-tanstack-instant-postgres-integration-for-faster-javascript-development) — Official database partner offering instant Postgres through their Vite plugin and create-tanstack CLI
- [Netlify DB](https://www.netlify.com/blog/netlify-db-database-for-ai-native-development/) — One-click Postgres databases for Netlify projects, built on the claimable database flow
- [Instagres](https://neon.new/) — Try instant Postgres provisioning without signup using `npx get-db` or at [neon.new](https://neon.new/)

<DetailIconCards>

<a href="/docs/workflows/claimable-database-integration" description="Learn how to implement claimable databases" icon="import">Claimable database guide</a>

<a href="/docs/reference/instagres" description="See Instagres implementation details" icon="transactions">Instagres documentation</a>

</DetailIconCards>

---

## ☑ Embedded Postgres integration

**Best for:** SaaS platforms and services that offer Postgres databases to their users

Use the embedded Postgres approach when you want to provision and manage Postgres databases on behalf of your users as part of your platform's offering. This is the **project-per-user model** where you create isolated Neon projects for each of your users via the Neon API.

**Key features:**

- Instant database provisioning (< 1 second)
- Complete data isolation per user
- Scale-to-zero for cost efficiency
- Configure consumption limits per user
- Track usage for billing
- Full API control over resources

**Example use cases:**

- SaaS platforms offering Postgres as a feature
- Low-code/no-code platforms
- Development platforms
- Enterprise platforms requiring isolated databases per customer

<DetailIconCards>

<a href="/docs/guides/embedded-postgres" description="Learn how to embed Postgres in your platform" icon="import">Embedded Postgres guide</a>

<a href="/docs/reference/api-reference" description="Explore the Neon API" icon="transactions">Neon API reference</a>

</DetailIconCards>

---

## ☑ OAuth integration

**Best for:** Tools and applications that need to interact with existing Neon user accounts

Use OAuth when you're building a tool or service that connects to existing Neon accounts. Your application will interact with user accounts and perform authorized actions like creating, reading, and modifying Neon database projects on their behalf, without requiring direct access to user credentials.

**Key features:**

- Secure, user-authorized access to Neon accounts
- Access control through OAuth scopes
- Users maintain full ownership of their Neon accounts

**Example use cases:**

- Database management tools
- Monitoring and observability platforms
- CI/CD integrations that connect to existing Neon projects
- Tools that visualize or analyze Neon resources

**Example implementation:**

- [Hasura Cloud](https://hasura.io/) — Uses OAuth to seamlessly authenticate users and provision Neon databases from Hasura projects

<DetailIconCards>

<a href="/docs/guides/oauth-integration" description="Learn how to integrate with Neon using OAuth" icon="check">OAuth integration guide</a>

<a href="https://github.com/neondatabase/neon-branches-visualizer" description="See a working OAuth integration example" icon="github">Example OAuth app</a>

</DetailIconCards>

## Still not sure?

If you're uncertain which path is right for you, here's a quick decision tree:

1. **Are you building an AI agent or codegen platform?**  
   → Use [Neon for AI Agents](/docs/guides/ai-agent-integration)

2. **Are you building a plugin, CLI tool, or platform that needs instant Postgres without requiring user signup?**  
   → Use [Claimable database flow](/docs/workflows/claimable-database-integration)

3. **Are you offering Postgres databases as part of your SaaS platform?**  
   → Use [Embedded Postgres](/docs/guides/embedded-postgres)

4. **Are you building an application or service that will manage/monitor/interact with existing Neon accounts?**  
   → Use [OAuth integration](/docs/guides/oauth-integration)

## Get help

We're here to support you through every step of your integration.

<DetailIconCards>

<a href="/contact-sales" description="Schedule a meeting with our team" icon="todo">Talk to our team</a>

<a href="/docs/introduction/support" description="Get technical support" icon="discord">Contact support</a>

</DetailIconCards>
