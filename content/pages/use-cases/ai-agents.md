---
title: 'Neon for AI Agent Platforms'
subtitle: Use Neon as the database layer for your
enableTableOfContents: true
updatedOn: '2025-07-26T09:00:00.000Z'
image: '/images/social-previews/use-cases/ai-agents.jpg'
---

Industry-leading AI Agent Codegen Platforms like Replit, V0, and Anything use Neon to provision, iterate on, and operate full-stack applications on behalf of their users. 

**Neon Features for Agents:**

- **Instant Provisioning** keeps your users building.
- **Checkpointing:** an easy and instant way to toggle between state for users.
- **Low cost-per-Database** with scale to zero and auto wake on activity.
- **Full-Stack, Batteries-Included:** Neon Auth, Data API included at no added charge.
- **Granular API Controls:** Track and control usage for flexible limits and invoicing.

<LogosSection containerClassName='py-3' logos={[
'anything',
'replit',
'same',
'solar',
'databutton',
]} />

<ProgramForm type="agent" />

<QuoteBlock quote="The speed of provisioning and serverless scale-to-zero of Neon is critical for us. We can serve users iterating on quick ideas efficiently while also supporting them as they scale, without making them think about database setup." author="dhruv-amin" role="Co-founder at Anything" />

## Agent Plan Pricing

|               | Agent Plan |
| ------------- | ------------- |
| Projects      |   **Unlimited**  <br/> _Agents create a new project for each user application._|
| Branches per Project  | **Custom limits available** <br/> _Agents use branches to quickly toggle between application states._ |
| Compute | **$0.26 per CU-hour** <br/> _Same as Scale_ |
| Storage | **$0.35 per GB-month** <br/> _Same as Scale_ |
| Instant Restore (PITR) | **$0.2 per GB-month** <br/> _Same as Scale_ |
| Neon Auth | **Included** <br/> _All-in-one API for handling user signup and management in Neon_  |
| Management API | **Higher Rate Limits Available** <br/> _API for instant provisioning and management of databases_ |
| Data API (PostgREST) | **Higher Rate Limits Available** |
| Support | **Shared Slack Channel** |
| <br/>**Agent Incentives** |  |
| **Your Free Tier is Free** | Up to 30,000 of your monthly free tier customers are subsidized by Neon. |
| **General Use Credits** | Up to $30K in credits for those not eligible for the [Startup Program](/startups). |
| **Co-Marketing** | Access to co-marketing opportunities with Neon: Blog and Social promotions, hackathons and more. |


## How It Works

<FeatureList />

<QuoteBlock quote="Integrating Neon was a no-brainer. It gives every Databutton app a production-grade Postgres database in seconds, with zero overhead. Our AI agent can now create, manage, and debug the entire stack, not just code." author="martin-skow-røed" role="CTO and co-founder of Databutton" />

## Platform Scale

> **AI Agents are now provisioning 80% of Neon databases (tens of thousands per day)**


The scale is massive, and Neon is built to handle it.

The [Neon MCP server](https://mcp.neon.tech/) enables any client to interact with Neon's API using natural language. AI agents can use Neon's MCP server to automate tasks such as creating databases, running SQL queries, and managing database migrations. 

The [@neondatabase/toolkit](https://github.com/neondatabase/toolkit) is a lightweight client designed for AI agents that need to spin up Postgres databases in seconds and run SQL queries. It includes both the Neon TypeScript SDK and the Neon Serverless Driver.

<QuoteBlock quote="The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer." author="lincoln-bergeson" role="Infrastructure Engineer at Replit" />

## Application Form
<ProgramForm type="agent" />
