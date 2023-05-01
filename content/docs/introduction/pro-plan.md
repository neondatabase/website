---
title: The Neon Pro plan
subtitle: Learn about the advantages of upgrading to the Neon Pro plan
enableTableOfContents: true
isDraft: true
---

The Neon **Pro** plan is a usage-based plan intended for small to medium teams or projects requiring more compute and storage than the [Neon Free Tier](../introduction/technical-preview-free-tier) provides. Because the Pro plan is usage-based, you never have to worry about over-provisioning, and you only pay for what you use. If you find that the Pro plan is more than you need, you can easily revert to the Free Tier in just a few clicks. Our intention is to make upgrading to Pro risk-free and hassle-free as possible for users who want to try it. The Pro plan has no fixed contract or obligations.

The Pro plan bills for usage monthly. Please refer to our [Billing](../introduction/billing) page for information about our billing metrics and prices. For a calculator to estimate monthly costs, see the [Pricing](https://neon.tech/pricing) page on our website. If you still have questions or need help estimating monthly spend, please do not hesitate to reach out to our [Sales](https://neon.tech/contact-sales) team. We're ready to help.

## What comes with the Pro plan?

Upgrading to the Neon Pro plan gives you higher limits, access to advanced features, and added support. Let's look at each of these items in more detail.

### Higher limits

- **More projects:** The Neon Free Tier gives you one project. The Pro Tier offers up to 20. But what is a Neon project, and why would you need more than one? A project is a top-level container in Neon for your computes, branches, databases, and roles. Projects are a way to organize your resources and usage. For example, if you are a company that develops data-driven applications for clients, it would make sense to create a project for each client or each application. For an overview of objects that a project contains, see [Overview of the Neon object hierarchy](../manage/overview).
- **Larger computes:** The Pro plan supports computes with up to **7 vCPUs and 28 GB of RAM**, providing you with the processing power you need to handle any workload. By comparison, Neon Free Tier provides .25 vCPUs and 1GB of RAM, which is great for personal projects or a small website but less than needed at scale. For compute size configuration instructions, see [Compute size configuration](../manage/endpoints#compute-size-configuration).
- **Unlimited storage:** With the Pro plan, data size is not a concern. We offer _bottomless storage_. There's a default storage limit of 200 GB to protect your account from unintended use, but we'll raise that limit on request to whatever you require. Simply contact [support@neon.tech](mailto:support@neon.tech).
- **Unlimited branches** The Neon Free Tier provides 10 branches. With the Pro Tier, there is no limit on branches. You can create as many branches as required to support your CI/CD pipeline. You can instantly and cost-effectively create a database branch for every preview deployment, every client, or every developer.

### Advanced features

The Neon Pro plan comes with the following advanced features, and more will be added in future releases. Free Tier users do not have access to these features.

- **Autoscaling:** The _Autoscaling_ feature automatically adjusts your compute size based on demand. You set a maximum and minimum compute size, and the Autoscaling feature automatically scales compute resources between those two boundaries for optimum performance and cost-efficiency. No manual intervention is required to handle sudden spikes in demand, and no downtime is required to reconfigure system resources. You can easily enable and configure Autoscaling in the Neon Console, on the **Edit Compute Endpoint** dialog. For instructions, see [Compute size configuration](../manage/endpoints#compute-size-configuration).
- **Configurable auto-suspend (sale-to-zero):** With the Neon Free Tier, computes are automatically suspended after 300 seconds (5 minutes) of inactivity, and this setting is not configurable. With the Pro plan, you can increase or decrease the this time period (referred to as the **Auto-suspend** delay), or you can disable Auto-suspension altogether. A lesser delay such as 60 seconds could potentially reduce your compute costs. A longer delay could keep your compute active longer to avoid compute cold starts. To prevent cold starts entirely, in cases where even a delay of a few seconds is not acceptable, you can disable the Auto=suspend feature entirely so that your compute is always active and immediately available for new connections. The Auto-suspend feature is also configured in the Neon Console, on the **Edit Compute Endpoint** dialog. For instructions, see [Auto-suspend configuration](../manage/endpoints#auto-suspend-configuration).
- **Project sharing**: The _Project sharing_ feature allows you to share your Neon projects with other Neon users. Project sharing is performed from the **Settings** page in the Neon Console. Simply add the Google or GitHub email account of the user you want to share your project with. Projects can be shared with any Neon user, including Free Tier users. Usage is applied to the project owner's Neon account. For instructions, see [Share a project](../manage/projects#share-a-project).

### Added support

In addition the [community forum](https://community.neon.tech/) and the ability to open support tickets by contacting [support@neon.com](mailto:support@neon.com), you will have access to Neon Support via video chat when you need to talk though an issue or use case face to face. Send a request to support@neon.com to request a video chat.

For a feature comparison with the Neon Free Tier, refer to the [Neon plans] table on our [Billing](../introduction/billing) page.

## How do I upgrade to Pro?

You can click on **Upgrade to Pro** in the Neon Console or click [here](https://console.neon.tech/app/projects?show_enroll_to_pro=true) to sign up.

## How do I downgrade?

If you find that the Pro plan isn't for you, you can downgrade in just a few clicks. Follow these instructions: [Cancel a subscription](../introduction/billing#cancel-a-subscription).
