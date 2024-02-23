---
title: Roadmap
redirectFrom:
  - /docs/cloud/roadmap
  - /docs/conceptual-guides/roadmap
  - /docs/reference/roadmap
updatedOn: '2024-02-08T20:07:48.873Z'
---
Our developers are focused on making Neon the default choice for serverless PostgreSQL. This roadmap describes committed features that are coming soon. We are as excited as you are to see new features in Neon, but their development, release, and timing are at our discretion.

As always, we are listening. If you see something you like, something you disagree with, or something you'd love for us to add, let us know in our Discord feedback channel.

<CommunityBanner buttonText="Leave feedback" buttonUrl="https://discord.com/channels/1176467419317940276/1176788564890112042" logo="discord">Share your ideas in&nbsp;Discord</CommunityBanner>

For the latest features and fixes, check our [Changelog](/docs/changelog), updated every Friday. You can subscribe to updates using our [RSS feed](https://neon.tech/docs/changelog/rss.xml).

## Coming soon

Here's a snapshot of what we're working on now:

* [Observability](#observability)
* [Developer workflows](#developer-workflows)
* [Account management](#account-management)
* [More regions](#more-regions)

### Observability

* **Autoscaling charts in Project Dashboard**

    Keeping with our improvements to monitoring and observability in Neon, our new [Autoscaling graphs](/docs/guides/autoscaling-guide#monitor-autoscaling) &#8212; available now when you edit a branch's compute instance &#8212; will soon be added to the Project Dashboard as well.

* **New Monitoring page**

   We are also working on adding a new Monitoring page to the Neon Console that will display key Posgres, connection, and resource usage metrics in a dashboard.

### Developer workflows

* **Schema Diff**

    We are currently building a Schema Diff tool that lets you precisely compare database schemas between different branches to help streamline your integration process.

    If there are any new branching features that you think could help your development team's workflow, let us know in [Discord](https://discord.com/channels/1176467419317940276/1176788564890112042).

* **Improvements to Vercel integration**

    To ensure that users of the integration that access Neon from Vercel's serverless environment do not run out of connections, we're changing the database connection settings added to a Vercel project to pooled connections by default.

### Account management

* **Organization support**

    We are adding features to support using Neon in your organization. Later, we'll add support for managing individual teams within the organization as well.

### More regions

*  We are currently evaluating new regions. Please reach out on Discord to let us know which region you would like to see next. 

## A brief history of Neon

The Neon **Limited Preview** started in February 2022 and was made available to a small number of select users and friends.

On June 15th, 2022, the Neon team announced the [Technical Preview](#technical-preview), making Neon available to a wider audience. Thousands of users were able to try Neon's [Free Tier](/docs/introduction/free-tier).

On December 6th, 2022, Neon released its branching feature and dropped the invite gate, welcoming everyone to try Neon's Free Tier.

In the spring of 2023, Neon launched [paid plans](https://neon.tech/pricing) with new features like Project Sharing, [Autoscaling](/docs/introduction/autoscaling), and [Autosuspend](/docs/introduction/auto-suspend). We also added support for US East (N. Virginia)

In the summer of 2023, we released the [Neon CLI](/docs/reference/neon-cli). New features included a configurable [history retention](/docs/introduction/point-in-time-restore) window as well as support for Postgres 16 and the Isreal (Tel Aviv) region. We also announced [SOC 2 Type 1](https://neon.tech/blog/soc2-type-1#our-journey-to-soc2) compliance.

In the fall of 2023, we added [IP allowlisting](/docs/introduction/ip-allow), email signup, and [logical replication](/docs/introduction/logical-replication). We also announced [SOC 2 Type 2](https://neon.tech/blog/soc2-type2) compliance.

In the winter of 2024, we added support for the Asia Pacific (Sydney) region, [Branch Restore](/docs/guides/branch-restore) with Time Travel Assist, and new [Pricing](https://neon.tech/pricing) plans.

## Technical Preview

Neon sets a high standard for what constitutes a feature-complete product, meaning that all intended core functionality is implemented and operates as expected. While many features may be operational today, there may still be some that are under development or refinement. Neon will remain in Technical Preview while the remaining features are still being developed and perfected.
