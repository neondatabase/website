---
title: Neon Pro plan
subtitle: Learn about the advantages of upgrading to the Neon Pro plan
enableTableOfContents: true
isDraft: false
---

The Neon **Pro** plan is a usage-based plan intended for small to medium teams or projects requiring more compute and storage than the [Neon Free Tier](../introduction/technical-preview-free-tier) provides. Because the Pro plan is usage-based, you never have to worry about over-provisioning, and you only pay for what you use. If you find that the Pro plan is more than you need, you can easily revert to the Free Tier. Our goal is to make upgrading to Pro hassle-free for users who want to try it. The Pro plan has no fixed contract or obligations.

## What comes with the Pro plan?

Upgrading to the Neon Pro plan gives you higher limits, access to advanced features, and added support. Let's look at each of these items in more detail.

### Higher limits

- **More projects:** The Pro Tier offers unlimited projects, while the Free Tier offers only one. But what is a Neon project, and why would you need more than one? A project is a top-level container in Neon for your computes, branches, databases, and roles. Projects are a way to organize your resources and usage. If you are a company that develops data-driven apps for clients, it might make sense to create a project for each client or each application, for example. For information about objects that a project contains, see [The Neon object hierarchy](../manage/overview).
- **Unlimited storage:** The Pro plan supports any data size. There's a default limit of 200 GB to protect your account from unintended use, but if you contact [support@neon.tech](mailto:support@neon.tech), we'll raise the limit to whatever you require.
- **Unlimited branches:** With the Pro plan, there is no limit on branches. You can create as many branches as required to support your CI/CD pipeline. You can instantly and cost-effectively create a database branch for every preview deployment, every client, or every developer.

### Advanced features

The Neon Pro plan comes with the following advanced features, and we plan to add more.

- **Autoscaling:** The _Autoscaling_ feature automatically adjusts compute size based on demand. You set a maximum and minimum compute size, and the Autoscaling feature automatically scales compute resources between those boundaries for optimum performance and cost-efficiency. No manual intervention is required to handle sudden load spikes, and no downtime is required to reconfigure system resources. Pro plan users can enable and configure Autoscaling in the Neon Console, on the **Edit Compute Endpoint** dialog. For instructions, see [Autoscaling configuration](../manage/endpoints#compute-size-and-autoscaling-configuration).
- **Configurable compute size:** The Pro plan supports computes with up to **7 vCPUs and 28 GB of RAM**, providing the processing power you need to handle any workload. By comparison, the Neon Free Tier provides .25 vCPUs and 1GB of RAM, which is great for personal projects or a small website but less than needed at scale. For configuration instructions, see [Compute size configuration](../manage/endpoints#compute-size-and-autoscaling-configuration).
- **Configurable Auto-suspend:** The Free Tier automatically suspends computes after 300 seconds (5 minutes) of inactivity. With the Pro plan, you can increase or decrease this time (referred to as the **Auto-suspend delay**), or you can disable the Auto-suspend feature entirely. A shorter delay such as 60 seconds can potentially reduce compute costs. A longer delay keeps your compute active for longer intervals for less frequent cold starts. To prevent cold starts entirely, in cases where even a few seconds delay is too much, you can disable the Auto-suspend feature entirely so that your compute is always active and ready for new connections. The Auto-suspend feature is configured in the Neon Console, on the **Edit Compute Endpoint** dialog. For instructions, see [Auto-suspend configuration](../manage/endpoints#auto-suspend-configuration).
- **Project sharing:** The _Project sharing_ feature allows you to share your Neon projects with other Neon users. Project sharing is managed on the **Settings** page in the Neon Console. Simply add the Google or GitHub email account of the user you want to share your project with. Projects can be shared with any Neon user, including Free Tier users. Usage is applied to the project owner's Neon account. For instructions, see [Share a project](../manage/projects#share-a-project).

### Added support

In addition to the [community forum](https://community.neon.tech/) and the ability to open support tickets, Pro plan users have access to Neon Support via video chat to discuss issues face-to-face. As a Pro user, you can send a request to [support@neon.tech](mailto:support@neon.tech) to request a video chat.

## How does billing work?

The Pro plan bills for usage monthly. Please refer to our [Billing](../introduction/billing) page for information about our billing metrics and prices. For a calculator to estimate monthly costs, see the [Pricing](https://neon.tech/pricing) page on our website. If you still have questions or need help estimating monthly spend, please do not hesitate to reach out to our [Sales](https://neon.tech/contact-sales) team. We're ready to help.

## How do I upgrade to Pro?

You can click on **Upgrade to Pro** in the Neon Console or click [here](https://console.neon.tech/app/projects?show_enroll_to_pro=true) to sign up.

## How do I downgrade?

If you find that the Pro plan isn't for you, you can downgrade in just a few clicks. Follow the steps described in [Cancel a subscription](../introduction/billing#cancel-a-subscription).
