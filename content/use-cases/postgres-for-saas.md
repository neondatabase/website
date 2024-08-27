---
title: 'Postgres for SaaS'
subtitle: Learn how teams ship SaaS applications faster on Neon.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
---

<UseCaseContext />

## Summary

Postgres is available everywhere. What makes Postgres on Neon the choice for thousands of teams building SaaS applications? In short:

<DefinitionList>
Database Branching
: Create isolated environments with production-like copies of your data and schema for testing, development, and CI/CD workflows.

Autoscaling
: CPU, Memory, and Storage scale up and down to match your workload. No more paying for resources you dont need. Less stress about outages caused by hitting fixed resource limits.

Low Operational Overhead
: Never touch a `pg_hba.conf`, nowhere to SSH into, no manual configuration of retention policies. In Neon, operational work is either abstracted away or presented in an intuitive UI + API.
</DefinitionList>

**The result:** Teams ship faster, more efficiently, with less risk of outage during times that matter most.

<Testimonial
text="In GCP, we had to constantly think about provisioning new instances and migrating data, which added operational overhead. With Neon, we can start small and scale up. We don’t have to think about some level of operational stuff. That’s awesome."
author={{
  name: 'Paul Dlug',
  company: 'CTO of Comigo.ai',
}}
/>

## Table Stakes Requirements

Before getting to the differentiating features, start with basic requirements:

### Compatibility

<DefinitionList bulletType="check">
It's Just Postgres
: You can deploy Postgres 14, 15, 16 on Neon. There is no lock-in, no proprietary syntax.

Integrates with any language/framework
: Anything that has a Postgres driver or integration works with Neon. [View Integrations]()

70+ Postgres extensions
: `pgvector`, `postGIS`, `timescaledb` and [66 other extensions](/docs/extensions/pg-extensions) are supported on Neon

Logical Replication
: Inbound (Neon as subscriber) and outbound (Neon as publisher) logical replication supported.

Serverless (HTTP) Driver
: Unlock access from serverless environments like AWS Lambda and Cloudflare Workers with the Neon serverless driver. It uses an HTTP API to query from edge/serverless with lower latency.
</DefinitionList>


### Performance

- **Similar Latency Characteristics to RDS Postgres**
  
  Prisma recently published [performance benchmarks](https://benchmarks.prisma.io/?dbprovider=pg-rds) showing similar latency between AWS RDS and Neon.

- **Self-Serve Autoscaling from zero to 10 CPU, 40GB RAM**
  
  Configure 
  
- **Storage up to 2TB**
  Storage on Neon is 

- **Instant Read Replicas**
  Storage on Neon is 

### Security

<DefinitionList bulletType="check">

SOC 2 Type 2 Compliant
: Neon is 

IP Allow List
: Scale Plan accounts can lock down database access to specific IP addresses or ranges.

</DefinitionList>

### Cost

<DefinitionList bulletType="check">
Generous Free Plan
: The free plan doesn't require a credit card and includes core features like branching, autoscaling, point-in-time restore, connection pooling, logical replication and more. [Sign Up here](https://console.neon.tech/signup).

Usage-Based Billing
: Paid plans start at $19 for an allotment of Compute and Storage resources, and scale up predictably as your workload grows. [View Pricing](/pricing)

Pay through AWS Marketplace
: If your business is already active on AWS, you may be able to save hassle and budgets by paying for Neon via AWS Marketplace.

</DefinitionList>


## Differentiated Features

<div align="center">
  [See case studies →](/case-studies)
</div>

## One database per user

If your SaaS project could benefit from multitenancy, Neon makes it simple to create a dedicated database for each user:

- **No pre-provisioning**: In Neon, there’s no need to provision infrastructure in advance. You can scale your architecture progressively, from a few tenants to thousands, without breaking the bank.
- **Cost efficiency**: You only pay for the Neon instances that are actively running. Thanks to scale-to-zero, creating instances doesn’t incur compute costs unless they’re actually in use.
- **Instant deployment**: Neon databases are created in milliseconds via APIs. An API call can spin up a new project whenever your end-user needs a database, without slowing things down.

<Testimonial
text="The ability to spawn databases that can scale down to zero is incredibly helpful and a model fits well with our one database per customer architecture"
author={{
  name: 'Guido Marucci',
  company: 'co-founder at Cedalio',
}}
/>

<div align="center">
  [Why database-per-user?](/cases/database-per-user)
</div>


<CTA text="Have any questions or need more&nbsp;information?" buttonText="Reach out to us" buttonUrl="/contact-sales" />
