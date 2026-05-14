---
title: From Shared Chaos to Isolated Control with Neon
description: 'A better way to build: spin up a Neon Twin and keep production untouched.'
excerpt: >-
  Your traditional database is rock-solid for handling production
  workloads—reliable, resilient, and built to withstand just about anything. But
  when it comes to the developer experience? Not so much. If you’ve ever had
  multiple developers colliding on the same dev or test instance...
date: '2025-03-11T14:30:00'
updatedOn: '2025-03-20T08:57:10'
category: workflows
categories:
  - workflows
authors:
  - paul-scanlon
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/from-shared-chaos-to-isolated-control-with-neon/cover.jpg
  alt: 'A better way to build: spin up a Neon Twin and keep production untouched.'
isFeatured: true
seo:
  title: From Shared Chaos to Isolated Control with Neon - Neon
  description: 'A better way to build: spin up a Neon Twin and keep production untouched.'
  keywords: []
  noindex: false
  ogTitle: From Shared Chaos to Isolated Control with Neon - Neon
  ogDescription: >-
    Your traditional database is rock-solid for handling production
    workloads—reliable, resilient, and built to withstand just about anything.
    But when it comes to the developer experience? Not so much. If you’ve ever
    had multiple developers colliding on the same dev or test instance,
    overwriting each other’s schema changes, accidentally siphoning resources
    from production, or dealing with […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/from-shared-chaos-to-isolated-control-with-neon/social.jpg
---

![A better way to build: spin up a Neon Twin and keep production untouched.](https://cdn.neonapi.io/public/images/pages/blog/from-shared-chaos-to-isolated-control-with-neon/neon-shared-chaos-cover-image-1024x576-dbdb13d0.jpg)

Your traditional database is rock-solid for handling production workloads—reliable, resilient, and built to withstand just about anything. But when it comes to the developer experience? Not so much. If you’ve ever had multiple developers colliding on the same dev or test instance, overwriting each other’s schema changes, accidentally siphoning resources from production, or dealing with over-provisioned environments that sit idle, you know exactly what I’m talking about.

You might think, _“Why not migrate to a better provider?”_ But let’s be honest—just suggesting a production migration is enough to trigger endless meetings, risk assessments, and so much red tape it barely feels worth it, and there’s a good chance, you’ll end up right back where you started anyway.

So don’t migrate. Leave production where it is. Instead, supercharge your development and testing environments with Neon, which is built to handle any size, from small projects to massive datasets.

In this post, I’ll describe some of our best features, walk you through our [Dev/Test workflow](https://neon.tech/docs/use-cases/dev-test), and introduce the process of creating a [Neon Twin](https://neon.tech/docs/guides/neon-twin-intro).

## What are Neon’s best features?

Neon is designed to make developer workflows simpler, faster, and safer. Traditional databases come with well-known pain points—shared environments, risky schema changes, and constant resource management. Neon solves these challenges with features built specifically for modern development teams, including:

1. **Serverless Architecture with Autoscaling**: Neon automatically scales resources to match workload demand, with no manual intervention required.
2. **Branching for Development and Testing:** Instantly create isolated copies of your data and schema—or schema-only. No matter the size of your database, branching is always instant and seamless.
3. **Integration and Compatibility**: Neon supports all the latest Postgres versions and numerous extensions, ensuring compatibility with a wide range of applications and frameworks.
4. **Provisioning Environments**: Neon simplifies the provisioning and management of environments through its console or API. New branches can be spun up instantly, resources can be managed, and settings can be configured—either through a user-friendly console or automated using API calls.

## See Neon in Action: Customer Case Studies

- [Adopting Neon branching in CI/CD pipelines: a practical story by Shepherd](https://neon.tech/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd)
- [Why Invenco Migrated From Aurora Serverless v2 to Neon](https://neon.tech/blog/why-invenco-migrated-from-aurora-serverless-v2-to-neon)
- [How Dispatch speeds up development with Neon while keeping workloads on Aurora](https://neon.tech/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora)
- [How Mindvalley Minimizes Time-To-Launch With Neon Branches](https://neon.tech/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches)

## What is the Dev/Test Workflow?

Our [Dev/Test](https://neon.tech/docs/use-cases/dev-test) workflow is simple: production stays put, while development and testing move to a [Neon Twin](https://neon.tech/docs/guides/neon-twin-intro). In this workflow, your dev and test environments are clones of your existing production or staging databases, kept in sync through two key processes:

1. Nightly automated dump and restore to keep your data up to date.
2. Dump and restore triggered by GitHub events to prevent schema drift.

[Branches](https://neon.tech/docs/introduction/branching) of the Twin can be created instantly, giving each member of your team a safe space to build, test, and iterate with real production data and schema without impacting the stability or performance of your production environment—or each other!

![Neon Twin workflow displaying a traditional database setup with the development and testing environments shutdown.](https://cdn.neonapi.io/public/images/pages/blog/from-shared-chaos-to-isolated-control-with-neon/twin-workflow-1024x316-5bdce811.jpg)

## What is a Neon Twin?

A Neon Twin is a full or partial copy of your production or staging database, giving developers isolated, sandboxed environments that closely mirror production

With a Neon Twin, teams can streamline their workflows, move faster, and stay productive—while avoiding the complexity and costs of traditional dev and test environments.

We currently have two Twin workflows available in our [docs](https://neon.tech/docs/guides/neon-twin-intro), which include:

- **Full Twin**: [A Full Twin](https://neon.tech/docs/guides/neon-twin-full-pg-dump-restore) is an exact copy of your production or staging database, including all data and schema.
- **Partial Twin**: [A Partial Twin](https://neon.tech/docs/guides/neon-twin-partial-pg-dump-restore) is an exact copy of your production or staging databases schema but only includes a subset of dat

GitHub Actions power both workflows and can be added to any existing GitHub repository. You can configure them to run on a recurring schedule that fits your needs or trigger them with specific [GitHub events](https://neon.tech/docs/guides/neon-twin-partial-pg-dump-restore#handling-pull-request-events)—such as when a pull request is closed and merged—to keep schema changes in sync. Plus, both workflows support [concurrency controls](https://neon.tech/docs/guides/neon-twin-partial-pg-dump-restore#add-concurrency-and-conditions) to prevent overlapping runs.

<blockquote>
<p><em>We are using the Neon Twin workflow. We just install the GitHub action and it takes care of the rest. Developers may not know how to dump and restore well, but they know how to run a GitHub Action. It’s amazing (Alex Co, Head of Platform Engineering at Mindvalley)</em></p>
</blockquote>

We’re also exploring additional workflows, including:

- **Anonymized Twin**: Automatically anonymizes sensitive PII data for safer testing.
- **Synthetic Twin**: Automatically generates realistic synthetic data based on your schema.

### GitHub Actions limitations

There are a few limitations to consider when using GitHub Actions. By default, they run on shared infrastructure, meaning you can’t control the execution region or use a fixed IP address. This can be an issue if your production or staging environments require IP allowlisting for access.

Second, GitHub Actions have a default timeout of six hours. For larger databases that may take longer to complete a full dump and restore, GitHub recommends using a self-hosted runner.

## Self-hosted runners

A self-hosted runner can help solve both of these limitations by giving you control over the environment, region, IP address and execution time. I’ve published a guide that walks through how to build and configure your own self-hosted runner: [How to use self-hosted runners with GitHub Actions](https://neon.tech/guides/gihub-actions-self-hosted-runners).

## Team notifications

For larger teams, it’s essential to keep developers informed when a new Twin is available so they can [reset their own branches](https://neon.tech/docs/guides/reset-from-parent) to maintain consistency. To help with this, we’ve put together a guide on setting up Slack notifications to keep everyone in the loop: [Building Slack notifications to monitor pg_dump and restore workflows](https://neon.tech/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows).

![Mockup of Slack interface displyang a message in the engineering-general channel explaining a new Neon Twin is available](https://cdn.neonapi.io/public/images/pages/blog/from-shared-chaos-to-isolated-control-with-neon/twin-slack-notifications-1024x641-272b37b8.jpg)

If migrating production isn’t an option, use Neon for development and testing—cut through the chaos, reduce infrastructure costs, and get more done.

## Let’s Connect

Curious about how Neon can fit into your workflow? Whether you have technical questions, need help with setup, or want to discuss pricing, [let’s chat](https://neon.tech/contact-sales). Our team is happy to help.
