---
title: 'Postgres for Dev/Test'
subtitle: Migrate your non-prod environments to Neon. Start shipping faster with up to 75% lower costs.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
---

**TL:DR**

- [Neon](/) is a Postgres database provider. We take the world’s most loved database and deliver it as a serverless platform designed to help teams ship reliable and scalable applications faster with features like instant provisioning, autoscaling, and database branching.
- There are many advantages of using Neon for production, but we know it—migrating a production database is a pain. But there’s no reason why you can’t enjoy the Neon DX in your dev/test workflows.
- What we’re talking about:
  - You keep your production DB in your current Postgres, e.g. RDS;
  - You migrate your non-prod environments to Neon;
  - To build / test / debug in Neon, you create branches instantly via copy-on-write instead of configuring instances; you integrate them with your CI/CD; you sync datasets in one click.
  - Once the changes are tested, you apply them to prod in RDS.
- You not only gain in terms of developer experience—Neon can also save you up to 75% vs AWS RDS in your non-prod costs. Why: in Neon, you only pay for storage once (all branches share the same storage), and you only pay for compute when your DBs are actually running.
- You can sign up for Neon to experiment right away ([we have a Free plan](https://console.neon.tech/signup)) or [reach out to us](/contact-sales) if you want to know more.

## AWS RDS is fine for prod, but terrible for dev

---

**The DX is not there: you need many instances, and costs slowly raise**

<Testimonial
text="The RDS developer experience is not quite there. The AWS console and APIs are quite convoluted and require extensive setup and configuration to achieve even basic tasks"
author={{
  name: 'Guido Marucci',
  company: 'Co-founder at Cedalio',
}}
/>

Databases like AWS RDS are widely used for a reason: they’re robust, reliable, and offer many instance types in all regions… But in terms of developer experience, they are decades behind. They also use resources inefficiently, which leads to high bills.

**Provisioning RDS instances is slow, and once live, you have to babysit them**. New instances have to be configured, they take a while to be available, and once running, they need constant oversight to ensure they are appropriately sized and ready.

**You pay for them 24/7 even if you only use them for a few hours**. Production databases stay on 24/7, but this is not the case for development instances. In RDS, unless you manually pause them, you’ll pay for them even if you’re not running. These inefficient non-prod costs quickly bloat your cloud bill.

**Developer collaboration is hard**. RDS is simply not built to support team workflows where multiple developers need to interact with the same dataset at the same time. It’s easy to quickly run into problems involving shared infrastructure, “noisy neighbors,” and data consistency.

**It takes work to keep data in sync across non-prod environments**. If you’re using many separate RDS instances for development, staging, and testing, maintaining data across all these environments will be time-consuming and prone to errors in RDS.

**These problems get worse over time, not better**. As your fleet of RDS instances grows, the manual setup and configuration work grows too, as do the cost inefficiencies. It just gets worse.

## How Neon can help: FAQ

---

**Build on Neon while keeping production in AWS RDS**

Migrating a production database is a big project: even when your current Postgres provider doesn’t spark joy, your team might not be ready for a full production migration just yet. However, you can enjoy a better experience for your development workflows by moving your non-prod environments to Neon.

### What do I gain by moving my dev databases to Neon?

Neon is a Postgres provider that offers a much more modern developer experience than databases like RDS. We’ve built a serverless platform for Postgres focused on helping you ship faster instead of being held back by database management. And as the cherry on top, you’ll save money—since Neon’s pricing is much more efficient compared to RDS.

### Why it’s faster (and more affordable) to build with Neon vs. RDS?

1. **Instant provisioning**. Neon is serverless Postgres: it takes seconds to spin up new Postgres instances. Developers can start coding and testing immediately.
2. **Intuitive DX**. Neon's modern interface and APIs minimize all database management tasks. Developers on your team can focus on building and testing features, fixing bugs, and staging changes—not navigating AWS obscurities.
3. **Database branching**. Neon comes with a powerful branching feature that allows you to create full copies of your database instantly using copy-on-write technology without consuming extra storage. This not only eliminates the "works on my machine" problem and streamlines collaboration—it’s also very affordable. All developers access a single development dataset without interfering with each other.
4. **Automatic scaling down to zero**. Neon automatically scales your compute resources based on demand. If a database is idle, Neon pauses it automatically to save costs and resumes it when needed—all without manual intervention.
5. **Seamless CI/CD integration**. You can add Neon to your CI/CD pipelines to automate database provisioning and teardown for testing. This ensures consistent, isolated environments for each test run, reducing flakiness and increasing confidence in your deployments.

### How much savings are we talking about?

By leveraging Neon's shared storage and compute autoscaling, it’s not rare to see **customers lowering their non-production database costs by 70%**. You only pay for the compute you actually use—no more bloating in your bill. The same goes for data redundancies—they’re also avoided.

### Show me a real use case example

**Non-prod deployment in AWS RDS (us-east-1):**

- 10 development and test instances (db.m5.large: 2 vCPUs, 8 GB RAM) with 50 GB storage allocated in each instance
- They’re active 4 hours/day on average
- RDS monthly costs: $1,356.90
  - Compute costs: $0.178/hour \* 730 hours \* 10 instances = $1,299.40 /month
  - Storage costs: 50 GB \* $0.115 GB-month \* 10 instances = $57.50

**Equivalent non-prod deployment in Neon:**

- Scale pricing plan: $69 /month
- Includes 50 GB of shared storage between 10 branches - equivalent to the 10 instances in RDS
- Includes 750 compute hours, additional compute hours billed at $0.16 per CU
- **Neon monthly costs: $338.12**
  - Compute hours per branch per month: 2 CU \* 4 hours \* 30.4 days/month = 243.2
  - Total compute hours: 243.2 \* 10 branches = 2432
  - Cost of additional compute hours: [2432 - 750] \* $0.16 = $269.12 /month

In this case, migrating non-production environments from AWS RDS to Neon meant 75% cost savings, together with streamlined development workflows, improved collaboration, and fewer operational complexities.

<CTA title="Reach out to us for an exact quote" description="Tell us more about your use case and we’ll send you back detailed information on how much you could save with Neon." buttonText="Contact us" buttonUrl="/contact-sales" />

### Can Neon also help lower the costs of my production database?

Yes. Overprovisioning is a big problem—we see this daily while talking to customers. If you suspect this is you, Neon can help: [autoscaling](/docs/introduction/autoscaling) is a powerful weapon against overprovisioning and the unnecessarily high costs it causes for production databases. [Read more about it here](/blog/neon-autoscaling-is-generally-available#why-autoscaling), and don’t hesitate to ask us about the migration assistance we offer. **We not only help you move production safely but also waive all migration-related fees.**

<CTA title="Learn more about our Business plan" description="Our most cost-effective plan for hosting all your workloads—production, dev, test, and staging." buttonText="Learn more" buttonUrl="/pricing" />

## Getting started

---

We have self-serve resources, and can also help you 1:1

### Do it yourself

We’ve built tutorials that teach you **how to run a nightly dump from RDS to Neon** so you can sync your non-prod environment. We also cover how to apply changes back to production once you’ve tested them in Neon.

- [Learn how to use pg_dump/restore with GitHub Actions for nightly sync](/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon)
- [Learn how to deploy a change tested in Neon to prod in RDS](/blog/neon-twin-deploy-workflow)
- [Use this app to easily build your dump/restore workflows](/dev-for-rds) (scroll down until you see `Neon Twin`)

<CTA title="Reach out to us" description="We’re running a pilot program where we offer close assistance to help you set up your non-prod environments in Neon." buttonText="Contact us" buttonUrl="/contact-sales" />
