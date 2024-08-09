---
title: Roadmap
redirectFrom:
  - /docs/cloud/roadmap
  - /docs/conceptual-guides/roadmap
  - /docs/reference/roadmap
updatedOn: '2024-08-06T15:23:10.955Z'
---

Our developers are focused on making Neon the default choice for serverless Postgres. This roadmap describes committed features that are coming soon. We are as excited as you are to see new features in Neon, but their development, release, and timing are at our discretion.

As always, we are listening. If you see something you like, something you disagree with, or something you'd love for us to add, let us know in our Discord feedback channel.

<CommunityBanner buttonText="Leave feedback" buttonUrl="https://discord.com/channels/1176467419317940276/1176788564890112042" logo="discord">Share your ideas in&nbsp;Discord</CommunityBanner>

For the latest features and fixes, check our [Changelog](/docs/changelog), updated every Friday. You can subscribe to updates using our [RSS feed](https://neon.tech/docs/changelog/rss.xml).

## Neon Early Access Program

If you would like to get a little more involved, consider signing up for the **Neon Early Access Program**.

Benefits of joining:

- **Exclusive early access**: Get a first look at upcoming features before they go live.
- **Private community**: Gain access to a dedicated Discord channel to connect with the Neon team and provide feedback to help shape what comes next.
- **Weekly insights**: Receive updates on Neon's latest developments and future plans.

[Sign Up Now](https://neon.tech/early-access-program) and start influencing the future of Neon!

## Coming soon

Here's a snapshot of what we're working on now:

- [Observability](#observability)
- [Developer workflows](#developer-workflows)
- [Account management](#account-management)
- [More regions](#more-regions)

### Observability

- **More metrics for the Monitoring page**

  We are also working on adding more metrics to the Monitoring page in the Neon Console to provide the key Postgres and resource usage metrics you require to effectively manage your projects and databases.

### Developer workflows

- **GitHub App**

  We're working on a GitHub App for Neon that will create and delete Neon branches in synchronization with git branch actions.

- **Support for anonymizing data**

  To help with workflows that require protecting personal information, we're adding support for anonymizing data. For example, if you derive your staging branch directly from production, you might want to anonymize the data on staging, which you can then use as the source for all of your development and testing branches.

If there are any new branching features that you think could help your development team's workflow, let us know in [Discord](https://discord.com/channels/1176467419317940276/1176788564890112042).

### Account management

- **Organization support**

  We are adding features to support using Neon in your organization. Later, we'll add support for managing individual teams within the organization as well.

### More regions

- We are currently evaluating new regions. Please reach out on Discord to let us know which region you would like to see next.

## A brief history of Neon

The Neon **Limited Preview** started in February 2022 and was made available to a small number of select users and friends.

On June 15th, 2022, the Neon team announced a [Technical Preview](#technical-preview), making Neon available to a wider audience. Thousands of users were able to try Neon's [Free Plan](/docs/introduction/#free-plan).

On December 6th, 2022, Neon released its branching feature and dropped the invite gate, welcoming everyone to try Neon's Free Plan.

In the first quarter of 2023, Neon launched [paid plans](https://neon.tech/pricing) with new features like Project Sharing, [Autoscaling](/docs/introduction/autoscaling), and [Autosuspend](/docs/introduction/auto-suspend). We also added support for US East (N. Virginia)

In the second quarter of 2023, we released the [Neon CLI](/docs/reference/neon-cli). Enhancements included a configurable [history retention](/docs/introduction/point-in-time-restore) window, support for Postgres 16, and [SOC 2 Type 1](https://neon.tech/blog/soc2-type-1#our-journey-to-soc2) compliance.

In the third quarter of 2023, we added [IP allowlisting](/docs/introduction/ip-allow), email signup, and [logical replication](/docs/introduction/logical-replication). We also announced [SOC 2 Type 2](https://neon.tech/blog/soc2-type2) compliance.

In the fourth quarter of 2023, we added support for the Asia Pacific (Sydney) region, [Branch Restore](/docs/guides/branch-restore) with Time Travel Assist, and new [Pricing](https://neon.tech/pricing) plans.

On April 15th, 2024, Neon announced [General Availability](https://neon.tech/blog/neon-ga).
