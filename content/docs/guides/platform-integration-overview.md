---
title: Integrating with Neon
subtitle: Choose the right integration path for your platform or application
enableTableOfContents: true
isDraft: false
updatedOn: '2025-11-05T00:00:00.000Z'
---

Neon provides flexible options for integrating Postgres into your platform, application, or service. This guide will help you choose the right integration approach based on your use case.

<CTA title="Explore our platform integration success stories" description="Discover how platforms like <a href='/blog/neon-postgres-on-vercel'>Vercel</a>, <a href='https://www.linkedin.com/posts/nikitashamgunov_heres-the-story-on-how-we-accidentally-created-activity-7242909460304699393-6mr2/'>Replit</a>, <a href='/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases'>Retool</a>, and <a href='https://www.koyeb.com/blog/serverless-postgres-public-preview'>Koyeb</a> have integrated Neon into their platforms." isIntro></CTA>

## Choose your integration path

Select the integration approach that best matches your use case:

### OAuth integration

**Best for:** Tools and applications that need to interact with existing Neon user accounts

Use OAuth when you're building a tool or service that connects to Neon accounts that users already own. Your application will interact with user accounts and perform authorized actions on their behalf, without requiring direct access to user credentials.

**Key features:**
- Secure, user-authorized access to Neon accounts
- No need to manage Neon projects on users' behalf
- Access control through OAuth scopes
- Users maintain full ownership of their Neon accounts

**Example use cases:**
- Database management tools
- Monitoring and observability platforms
- CI/CD integrations that connect to existing Neon projects
- Development tools that visualize or analyze Neon resources

<DetailIconCards>

<a href="/docs/guides/oauth-integration" description="Learn how to integrate with Neon using OAuth" icon="check">OAuth integration guide</a>

<a href="https://github.com/neondatabase/neon-branches-visualizer" description="See a working OAuth integration example" icon="github">Example OAuth app</a>

</DetailIconCards>

---

### Embedded Postgres

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

<a href="/platforms" description="Learn more about embedding Postgres" icon="handshake">Neon for Platforms</a>

</DetailIconCards>

---

### Neon for AI Agents

**Best for:** AI agent platforms and codegen services that need database versioning and isolated environments

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

<a href="/docs/guides/ai-agent-integration" description="Learn about the agent-specific integration" icon="openai">AI Agent integration guide</a>

<a href="/docs/introduction/agent-plan" description="Understand the agent plan structure" icon="billing">Agent plan details</a>

<a href="/use-cases/ai-agents" description="See how agents use Neon" icon="handshake">Neon for AI Agents</a>

<a href="/docs/ai/ai-database-versioning" description="Learn about database versioning for agents" icon="branching">Database versioning</a>

</DetailIconCards>

---

## Still not sure?

If you're uncertain which path is right for you, here's a quick decision tree:

1. **Are you building a tool to manage/monitor existing Neon accounts?**  
   → Use [OAuth integration](/docs/guides/oauth-integration)

2. **Are you offering Postgres databases as part of your SaaS platform?**  
   → Use [Embedded Postgres](/docs/guides/embedded-postgres)

3. **Are you building an AI agent or codegen platform?**  
   → Use [Neon for AI Agents](/docs/guides/ai-agent-integration)

## Get help

We're here to support you through every step of your integration.

<DetailIconCards>

<a href="/contact-sales" description="Schedule a meeting with our team" icon="todo">Talk to our team</a>

<a href="/docs/introduction/support" description="Get technical support" icon="support">Contact support</a>

</DetailIconCards>
