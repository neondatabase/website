---
title: Neon for Platforms
subtitle: Let your users create their own isolated Postgres databases by integrating Neon into your platform
enableTableOfContents: true
updatedOn: '2024-09-08T12:44:00.894Z'
---

Due to its severless nature, Neon makes it possible for companies to manage huge fleets of Postgres databases (= Neon projects) even with small teams and budgets. Examples include:

- Retool ([read the case study](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases))
- Replit and Replit Agent ([Learn more](https://neon.tech/blog/looking-at-how-replit-agent-handles-databases))
- Vercel
- Koyeb, Genezio, and many other IaaS

What all these platforms had in common:

- They needed to create one database per user
- They needed deployment to be nearly instantaneous, to not make their users wait
- Everything had to be programmable via API
- The cost of idle instances had to be negligible

The solution: **they're creating a database per customer, scaling up to hundreds of thousands of databases**. 

<CTA title="Want to know more?" description="Our database-per-user guide walks you through how to set up a database-per user model in Neon" buttonText="Database-per-user guide" buttonUrl="/docs/use-cases/database-per-user" />

## Neon features that make this possible

- **Management API**. Use the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) to provision new databases of any size, in any region, set up usage quotes, even pass through costs to end-users with detailed per-database metrics.
- **Instant provisioning**. Neon databases provision in less than 1 second.
- **Scale-to-zero**. You don't pay for inactive databases in Neon, meaning you're not paying a fixed cost for every database you onboard.

## Getting started

When you're ready to get started, you can learn how to integrate your platform or service with Neon by reading our [Partner guide](https://neon.tech/docs/guides/partner-intro), which covers how to become a Neon partner, how to integrate your platform or service with Neon, how to set usage limits for your users, and more.
