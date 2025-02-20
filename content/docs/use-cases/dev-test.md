---
title: Neon for Development and Testing
subtitle: Boost developer productivity with Neon—a flexible development sandbox for
  running non-production workloads.
enableTableOfContents: true
updatedOn: '2025-02-11T18:04:21.936Z'
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

Not every team is ready for a full database migration. However, even if teams aren’t ready to migrate their production databases, they can still improve efficiency by moving their non-production workloads to Neon using a [Neon Twin](/docs/guides/neon-twin-intro).

![Dev/Test Twin Workflow](/use-cases/dev-test-twin-workflow.png)

<CTA title="Create a Neon Twin" description="A Neon Twin is a full or partial clone of your production or staging database, providing developers and teams with isolated, sandboxed environments that closely mirror production. <br><br>Learn how to create a Twin <a href='/docs/guides/neon-twin-intro'>here</a>." isIntro />

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

## Further Reading

- [Neon Twin: Move Dev/Test/Staging to Neon, Keep Production on RDS](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon)
- [Building Slack notifications to monitor pg_dump and restore workflows](https://neon.tech/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows)
- [Neon Twin: How to deploy a change tested in Neon to prod in RDS](https://neon.tech/blog/neon-twin-deploy-workflow)

<CTA title="Let's Connect" description="We’re happy to give you a hand with any technical questions about how to set this workflow up. We can also discuss pricing options, annual contracts, and provide migration assistance." buttonText="Contact us" buttonUrl="/contact-sales" />
