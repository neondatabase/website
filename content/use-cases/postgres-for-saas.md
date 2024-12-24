---
title: 'Postgres for SaaS'
subtitle: Teams build SaaS faster on Neon with autoscaling, database branching, and the serverless operating model.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
image: '/images/social-previews/use-cases/postgres-for-saas.jpg'
---

<UseCaseContext />

## Summary

Three features make Postgres on Neon a solid foundation for teams building SaaS applications:

<DefinitionList bulletType="check">
Database branching
: Create ephemeral environments with production-like copies of your data and schema for end-to-end testing, development, and previews.

Autoscaling
: CPU, Memory, and storage scale up and down to match your workload. No more manual resizes or paying for resources you don't need.

Serverless
: Never touch a `pg_hba.conf`, or SSH into anywhere. In Neon, operational work is either abstracted away or presented in an intuitive UI + API.
</DefinitionList>

**The result:**
Teams ship faster and more efficiently, with less risk of outage during times that matter most.

<Testimonial
text="In GCP, we had to constantly think about provisioning new instances and migrating data, which added operational overhead. With Neon, we can start small and scale up. We don’t have to think about some level of operational stuff. That’s awesome."
author={{
  name: 'Paul Dlug',
  company: 'CTO of Comigo.ai',
}}
/>

## Key features

---

### Database branching

A branch in Neon is a copy-on-write clone of your database. Branches include both schema and data. Teams use them to create ephemeral environments for development, testing, and preview environments.

- **Branch creation is instant** - Independent of DB size. Storage is not duplicated for each branch.
- **Branches are cost-efficient** - You can deploy thousands of branches for $19 /month.
- **Branch compute can scale to zero when idle** - to further reduce cost.

How branches can be used to increase development velocity:
<DefinitionList bulletType="check">
Onboard Faster, Keep Collaboration in Sync
: Give each developer on your team their own branch for local development. They can use [branch reset](/docs/introduction/point-in-time-restore) to instantly restore and catch up with the latest changes.

One Branch per PR
: Use automation to give each git branch or Pull Request a corresponding database branch. This can be done with automation tools like GitHub Actions, or more easily as part of an integration:
: - [Neon GitHub integration](/docs/guides/neon-github-integration) - An easier way to create a branch for every PR.
: - [Neon Vercel Integration](/docs/guides/vercel) - Create and integrate a branch into every Vercel Preview deployment.

Ephemeral Environments for Dev/Test
: Deploy confidently by using branches to run your test suite on an exact copy of your production database. No handling of seed data, no manual work keeping environments in sync.
: - [See guide in docs](/docs/use-cases/dev-test)
: - [Read how others do it](https://neon.tech/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle)

</DefinitionList>

---

### Autoscaling

Neon dynamically adjusts the amount of resources allocated to your database in response to the current load, eliminating the need for manual intervention.

<DefinitionList bulletType="check">
Performance w/ cost-efficiency
: Your CPU/memory automatically scale up during traffic spikes. When you no longer need the extra resources, your database scales down.

No manual resizes for compute or storage
: Other platforms require downtime for resizes, limit the frequency of resizes, and don't let you scale storage down. On Neon everything is automated and instant.

Performance for high connections  
: Neon has pbBouncer built-in at no extra cost. Use pooling and keep scaling.
</DefinitionList>

---

### Serverless

Neon abstracts away the concept of servers so that you can focus on building your SaaS, not managing your database.

- No compute/storage management: With Neon you don’t need to provision, maintain, resize, or administer servers.
- Managed infrastructure: Neon handles all underlying infrastructure, including security patches, load balancing, and capacity planning.
- Built-in availability and fault tolerance: Neon has multi-AZ storage redundancy and rapid recovery built-in.

---

## Database-per-tenant SaaS

If your SaaS project could benefit from multitenancy, Neon makes it simple to create a dedicated database for each user:

- **Instant deployment**: Neon projects are created in milliseconds via APIs.
- **No pre-provisioning**: You can scale your architecture progressively, from a few tenants to thousands.
- **Pay per usage**: You only pay for the tenants that are actively running.

[Learn how to build this](/docs/use-cases/database-per-user)

<Testimonial
text="The ability to spawn databases that can scale down to zero is incredibly helpful and a model fits well with our one database per customer architecture"
author={{
  name: 'Guido Marucci',
  company: 'co-founder at Cedalio',
}}
/>

## Table Stakes

### Compatibility

---

<DefinitionList bulletType="check">
It's Just Postgres
: Deploy Postgres 15, 16, and 17 on Neon. There is no lock-in and no proprietary syntax to learn.

Integrates with any language/framework
: Anything that has a Postgres driver or integration works with Neon.

70+ Postgres extensions
: `pgvector`, `postGIS`, `timescaledb` and [66 other extensions](/docs/extensions/pg-extensions) are supported on Neon

Logical Replication
: Inbound (Neon as subscriber) and outbound (Neon as publisher) logical replication supported.

Serverless (HTTP) Driver
: Unlock access from serverless environments like AWS Lambda and Cloudflare Workers with the Neon serverless driver. It uses an HTTP API to query from edge/serverless with lower latency.
</DefinitionList>

### Security and Compliance

---

<DefinitionList >

Data regulations
: Neon complies with CCPA, GDPR, ISO 27001, ISO 27701, SOC 2, SOC 3, and HIPAA.

99.95% SLA
: For Business and Enterprise customers.

Private Link, IP Allow
: To restrict access to trusted addresses.

</DefinitionList>

### Billing

---

<DefinitionList bulletType="check">
Subscription plans
: Paid plans start at $19, with compute and storage resources already included. [Review our pricing plans](https://neon.tech/pricing).

Pay via AWS/Azure Marketplace
: You can subscribe to Neon via the marketplaces to consolidate billing. Click [here](https://aws.amazon.com/marketplace/pp/prodview-fgeh3a7yeuzh6?sr=0-1&ref_=beagle&applicationId=AWSMPContessa) for AWS, and [here](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=PlansAndPrice) for Azure.

</DefinitionList>

<CTA title="Need more&nbsp;information?" buttonText="Book time with our team" buttonUrl="/contact-sales" />
