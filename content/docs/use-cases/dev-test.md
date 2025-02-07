---
title: Neon for Development and Testing
subtitle: Boost developer productivity by running non-production workloads on Neon
enableTableOfContents: true
updatedOn: '2025-02-03T16:55:54.792Z'
---

What sets Neon apart from other Postgres providers, beyond its true serverless nature, is its focus on delivering an exceptional developer experience.

Here are some of our standout features:

## Standout features

Together, these features create a fast, flexible, and developer-friendly database experience that traditional solutions can’t match.

1. **Serverless Architecture with Autoscaling**: Neon automatically scales resources to match workload demand, with no manual intervention required.

2. **Branching for Development and Testing**: Neon enables instant branching that creates isolated copies of data and schema. This allows for safe development and testing without impacting production.

3. **Integration and Compatibility**: Neon supports all the latest PostgreSQL versions and numerous extensions, ensuring compatibility with a wide range of applications and frameworks.

4. **Provisioning Environments**: Neon simplifies the provisioning and management of environments through its console or API. New databases and branches can be spun up instantly, resources can be managed, and settings configured—either through a user-friendly console or automated API calls.

## Move non-production to Neon

Not every team is ready for a full database migration. However, even if teams aren’t ready to migrate their production databases, they can still improve efficiency by moving their non-production environments to Neon.

## Workflows

Most teams running dev/test workloads on Neon while keeping production on another Postgres platform implement a workflow similar to this:

1. **Set up a Neon Project for dev/test environments**

   Teams start by [creating a single Neon project](/docs/get-started-with-neon/signing-up#sign-up) to host multiple dev/test environments.

2. **Create a Neon Twin**

   Next, teams create a [Neon Twin](/docs/guides/neon-twin-intro) —a full or partial clone of their production or staging database that remains automatically synchronized.

3. **Develop on branches**

   Once a Neon Twin is set up, teams can instantly create [branches](/docs/introduction/branching). These branches are fully isolated and provide teams with a complete copy of the testing dataset immediately.

4. **Migrate changes**
   Migrate changes developed and tested on a Twin back to your production or staging database using your existing workflows.

Learn how Neon Twin workflows can optimize your development process. Check out the full documentation [here](/docs/guides/neon-twin-intro).

<CTA title="Let's Connect" description="We’re happy to give you a hand with any technical questions about how to set this up. We can also discuss pricing options, annual contracts, and migration assistance." buttonText="Contact us" buttonUrl="/contact-sales" />
