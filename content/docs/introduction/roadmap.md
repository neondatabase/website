---
title: Roadmap
enableTableOfContents: true
tag: updated
redirectFrom:
  - /docs/cloud/roadmap
  - /docs/conceptual-guides/roadmap
  - /docs/reference/roadmap
updatedOn: '2024-08-09T17:28:16.003Z'
---

Our development teams are focused on helping you ship faster with Postgres. This roadmap describes committed features that we're working on right now, plus a peak at some of the upcoming features we'll be taking on next.

## What we've just launched

For the latest features and fixes, check our [Changelog](/docs/changelog), updated every Friday. Or watch for our Changelog email, also sent regularly on Fridays. You can also subscribe to updates using our [RSS feed](https://neon.tech/docs/changelog/rss.xml).

## What we're working on now

Here's a snapshot of what we're working on now:

- **Neon on Azure**: If you didn't catch the post, Neon is coming to Azure. [Read more](https://neon.tech/blog/neon-is-coming-to-azure) about this big news.
- **Autoscaling GA**: One of our defining features, Autoscaling, is soon going GA. Look for an announcement with details coming out soon!
- **Autoscaling on the Free Plan**: Users on the Free Plan will soon be able to try Neon's Autoscaling feature, within reasonable Free Plan limits.
- **Postgres 17**: We've been at work on this for a while now. We plan to support Postgres 17 the day it's released. Postgres 17 will support direct SSL connections, which can eliminate one round-trip from establishing a connection.
- **Database deploy previews**: Our GitHub App is available now for all users, with more refinements to come &#8212; including better integration with GitHub Actions, making it easier to incorporate your database into your development workflow.
- **Better deletes**: We're adding support for deleting obsolete branches, especially after [restore](/docs/guides/branch-restore) operations.
- **Migrations (Beta)**: We’re adding inbound logical replication as a first step towards offering seamless, low-downtime migrations from your current database provider to Neon. Inbound replication can also help you use Neon as your staging environment, letting you take advantage of developer-friendly features like branching and our GitHub Integration, even if you decide to keep production with your current provider.
- **Snapshots**: Create regularly scheduled snapshots as a way to archive your database &#8212; a cost-effective alternative to long-lived branches.
- **SQL Editor improvements**: Stay tuned for interesting updates we have planned for our SQL Editor.
- **Plans & Billing**: We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. You can expect to see changes in this area, including:

  - A new plan tailored to business needs, with key features and usage allowances that better fit business-focused development teams.
  - Storage-related billing optimizations.

- **Organizations Beta**: We're thankful to our private preview customers for the feedback they've given us so far &#8212; and happy to say that **Organization Accounts** are on track for Early Access users soon.
- **Neon CLI**: We've recently added a [create-app](/docs/reference/cli-create-app) command that lets you bootstrap your application with common dev stacks. `create-app` is maturing fast, with new frameworks, ORMs, and features coming out regularly.
- **An email app service**: This service will provide support for email verification and password recovery workflows.

If you have other feature ideas, [let us know](#share-your-thoughts).

## What's on the horizon

And here's a quick list of what we'll be taking on in the near future:

- **Staging Environments**: A critical part of making it easy for you to use Neon as the staging environment for your team's app development &#8212; simple, robust anonymization of PII data. We're working on it.
- **Support for exporting logs and metrics**: We'd like to help users integrate Neon into their monitoring platforms and services with exportable logs and metrics.
- **Support for soft deletions**: Work is underway to build a deletion workflow for Neon projects. As part of this workflow, we'll support a recovery grace period for unintended deletions, and we'll also add a little friction to the deletion process to avoid accidental deletions &#8212; something similar to the steps required to delete a repository in GitHub.
- **Larger computes**: We are working on adding support for ever-larger compute sizes.
- **New authentication method:** We're working on a new authentication method for Postgres that will enable simplified application -> database connections, as well as allow for Neon to be integrated into various marketplaces.

## Join the Neon Early Access Program

If you would like to get a little more involved, consider signing up for the **Neon Early Access Program**.

Benefits of joining:

- **Exclusive early access**: Get a first look at upcoming features before they go live.
- **Private community**: Gain access to a dedicated Discord channel to connect with the Neon team and provide feedback to help shape what comes next.
- **Weekly insights**: Receive updates on Neon's latest developments and future plans.

[Sign Up Now](https://neon.tech/early-access-program) and start influencing the future of Neon!

## A note about timing

We are as excited as you are to see new features in Neon, but their development, release, and timing are at our discretion.

## Share your thoughts

As always, we are listening. If you see something you like, something you disagree with, or something you'd love for us to add, let us know in our Discord feedback channel.

<CommunityBanner buttonText="Leave feedback" buttonUrl="https://discord.com/channels/1176467419317940276/1176788564890112042" logo="discord">Share your ideas in&nbsp;Discord</CommunityBanner>

## A brief history of Neon

The Neon **Limited Preview** started in February 2022 and was made available to a small number of select users and friends.

On June 15th, 2022, the Neon team announced a [Technical Preview](#technical-preview), making Neon available to a wider audience. Thousands of users were able to try Neon's [Free Plan](/docs/introduction/#free-plan).

On December 6th, 2022, Neon released its branching feature and dropped the invite gate, welcoming everyone to try Neon's Free Plan.

In the first quarter of 2023, Neon launched [paid plans](https://neon.tech/pricing) with new features like Project Sharing, [Autoscaling](/docs/introduction/autoscaling), and [Autosuspend](/docs/introduction/auto-suspend). We also added support for US East (N. Virginia)

In the second quarter of 2023, we released the [Neon CLI](/docs/reference/neon-cli). Enhancements included a configurable [history retention](/docs/introduction/point-in-time-restore) window, support for Postgres 16, and [SOC 2 Type 1](https://neon.tech/blog/soc2-type-1#our-journey-to-soc2) compliance.

In the third quarter of 2023, we added [IP allowlisting](/docs/introduction/ip-allow), email signup, and [logical replication](/docs/introduction/logical-replication). We also announced [SOC 2 Type 2](https://neon.tech/blog/soc2-type2) compliance.

In the fourth quarter of 2023, we added support for the Asia Pacific (Sydney) region, [Branch Restore](/docs/guides/branch-restore) with Time Travel Assist, and new [Pricing](https://neon.tech/pricing) plans.

On April 15th, 2024, Neon announced [General Availability](https://neon.tech/blog/neon-ga).
