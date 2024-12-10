---
title: Neon for Dev/Test
subtitle: Migrate your non-prod environments to Neon to ship faster with lower costs
enableTableOfContents: true
updatedOn: '2024-09-08T12:44:00.894Z'
---

**TL:DR**

- [Neon](https://neon.tech/home) is a Postgres database provider. We take the world’s most loved database and deliver it as a serverless platform designed to help teams ship reliable and scalable applications faster with features like instant provisioning, autoscaling, and database branching.
- Even if you can't migrate production from your current Postgres provider yet, there’s no reason why you can’t enjoy the Neon DX in your dev/test workflows.
  - You can keep your production DB in your current Postgres, e.g. RDS.
  - You "move" your non-prod environments to Neon (i.e., by syncing a subset of data daily).
  - To build / test / debug in Neon.
  - Once the changes are tested, you apply them back to prod.
- What you get: more developer velocity with up to 75% less costs.
- You can sign up for Neon to experiment right away ([we have a Free plan](https://console.neon.tech/signup)) or [reach out to us](/contact-sales) if you want to know more.

## RDS/Aurora are inefficient for dev/test

---

- **Provisioning instances is slow.** Once they're live, you have to babysit them. New instances have to be configured, they take a while to be available, and once running, they need constant oversight to ensure they are appropriately sized and ready.

- **You pay for non-prod instances 24/7 even if you only use them for a few hours.** Production databases stay on 24/7, but this is not the case for dev/test instances. But in RDS/Aurora, unless you manually pause them, you’ll keep paying even if they're not running.

- **It's hard to keep data in sync across environments.** Syncing data across many instances requires repetitive, manual work. This leads to discrepancies that compromise test reliability and slow down deployments.

- **These problems get worse over time, not better.** As your number of instances grows, the manual setup and configuration work grows too.

## Why should I move my dev databases to Neon?

Neon is a Postgres provider that offers a much more modern developer experience than databases like RDS. We’ve built a serverless platform for Postgres focused on helping you ship faster instead of being held back by database management. As the cherry on top, you’ll save money.

### Why it’s faster (and more affordable) to build with Neon vs. RDS?

1. **Instant provisioning**. In Neon, it takes seconds to spin up new Postgres instances. Developers can start coding and testing immediately, no waiting time.
2. **Database branching for ephemeral environments**. Neon's copy-on-write branching allows devs to create full copies of their testing dataset instantly and without consuming extra storage. This eliminates the operational load that comes with keeping testing data in sync across environments: In Neon, you can sync data with parent in one click. Branches are also extremely affordable.
3. **Non-prod environments are automatically paused when unused**. If a database branch is idle, Neon pauses it automatically to save costs (and management work).
4. **Intuitive DX with CI/CD integration**. Neon comes with a modern interface and APIs (no need to waste time navigating AWS obscurities). You can add Neon to your CI/CD pipelines to automate branch creation /deletion.

### How much cost savings have you seen vs RDS/Aurora?

Here's how you'll go about it:

1. **Set up a single Neon Project for dev/test**. Many non-prod instances can be substituted by a single Neon project.
2. **Sync testing data to the main branch**. Load data from your staging database / testing data into the main branch within the Neon project. This main branch acts as the primary source for all dev/test environments, and it's the only place you need to update with new data or schema changes.
3. **Creating ephemeral environments as child branches**. To instantly create ephemeral environments, derive child branches from the main branch. These branches are fully isolated resource-wise and provide you a full copy of the testing dataset. They can then be synced with the main branch with just one click, ensuring they always have the latest data while saving you the work of loading testing datasets to every single environment.
4. **Automatic branch cleanup and autosuspend**. After development or testing is complete, ephemeral branches can be deleted automatically via the API. Neon's autosuspend automatically pauses these environments when unused, so you don't have to worry too much about them.

### How much cost savings have you seen vs RDS/Aurora?

By leveraging Neon's shared storage and compute autoscaling, it’s not rare to see customers lowering their non-production database costs by 75% or more. You only pay for the compute you actually use—no more bloating in your bill. The same goes for data redundancies—they’re also avoided.

### Show me a real use case example

**Non-prod deployment in AWS RDS (us-east-1):**

- 10 development and test instances (db.m5.large: 2 vCPUs, 8 GB RAM) with 50 GB storage allocated in each instance
- They’re active 4 hours/day on average
- RDS monthly costs: $1,356.90
  - Compute costs: $0.178/hour \* 730 hours \* 10 instances = $1,299.40 /month
  - Storage costs: 50 GB \* $0.115 GB-month \* 10 instances = $57.50

**Equivalent non-prod deployment in Neon:**

- [Scale pricing plan](/pricing): $69 /month
- Includes 50 GB of shared storage between 10 branches - equivalent to the 10 instances in RDS
- Includes 750 compute hours, additional compute hours billed at $0.16 per CU
- **Neon monthly costs: $338.12**
  - Compute hours per branch per month: 2 CU \* 4 hours \* 30.4 days/month = 243.2
  - Total compute hours: 243.2 \* 10 branches = 2432
  - Cost of additional compute hours: [2432 - 750] \* $0.16 = $269.12 /month

In this case, migrating non-production environments from AWS RDS to Neon meant 75% cost savings, together with streamlined development workflows, improved collaboration, and fewer operational complexities.

### Can Neon also help lower the costs of my production database?

Yes. Overprovisioning is a big problem—we see this daily while talking to customers. If you suspect this is you, Neon can help: [autoscaling](/docs/introduction/autoscaling) is a powerful weapon against overprovisioning and the unnecessarily high costs it causes for production databases. [Read more about it here](/blog/neon-autoscaling-is-generally-available#why-autoscaling), and don’t hesitate to ask us about the migration assistance we offer. **We not only help you move production safely but also waive all migration-related fees.**

## Getting started

We’ve built tutorials that teach you **how to run a nightly dump from RDS to Neon** so you can sync your non-prod environment. We also cover how to apply changes back to production once you’ve tested them in Neon.

- [Learn how to use pg_dump/restore with GitHub Actions for nightly sync](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon)

<CTA title="Let's Connect" description="We’re happy to give you a hand with any technical questions about how to set this up. We can also discuss pricing options, annual contracts, and migration assistance." buttonText="Contact us" buttonUrl="/contact-sales" />
