---
title: Neon for Platforms
subtitle: Let your users create their own isolated Postgres databases by integrating Neon into your platform
enableTableOfContents: true
updatedOn: '2024-09-08T12:44:00.894Z'
---

Due to its severless nature, Neon makes it possible for companies to manage huge fleets of Postgres databases (= Neon projects) even with small teams and budgets. Examples include:

- Retool ([read the case study](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases))
- Replit and Replit Agent
- Vercel
- Koyeb, Genezio, and many other IaaS

What all these platforms had in common:

- They needed to create one database per user
- They needed deployment to be nearly instantaneous, to not make their users wait
- Everything had to be programmable via API
- The cost of idle instances had to be negligible

The solution: **they're creating a Neon project per customer, scaling up to hundreds of thousands of projects**. [Explore our Partners page to learn more](https://neon.tech/partners).

To get started with the implementation, navigate to the [Database-per-user guide](https://neon.tech/docs/use-cases/database-per-user)

## Neon features that make this possible

- **Management API**. Use the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) to provision new databases of any size, in any region, set up usage quotes, even pass through costs to end-users with detailed per-database metrics.
- **Instant provisioning**. Neon databases provision in less than 1 second.
- **Scale-to-zero**. You don't pay for inactive databases in Neon, meaning you're not paying a fixed cost for every database you onboard.

## Getting started

### How to integrate with Neon

Find details about the different ways you can integrate with Neon.

<DetailIconCards>

<a href="/docs/guides/oauth-integration" description="Integrate with Neon using OAuth" icon="check">OAuth</a>

<a href="/docs/reference/api-reference" description="Integrate using the Neon API" icon="transactions">API</a>

<a href="https://neon-experimental.vercel.app/" description="See a sample application using OAuth" icon="lock-landscape">Sample OAuth</a>

</DetailIconCards>

### How to set up billing

Learn how to set up quotas and track key consumption metrics.

<DetailIconCards>

<a href="/docs/guides/partner-consumption-limits" description="Use the Neon API to set consumption limits for your customers" icon="cheque">Configure consumption limits</a>

<a href="/docs/guides/partner-consumption-metrics" description="Track usage with Neon's consumption metrics APIs" icon="queries">Query consumption metrics</a>

</DetailIconCards>
