---
title: The Neon Pro plan
subtitle: Learn about the advantages of upgrading to the Neon Pro plan
enableTableOfContents: true
isDraft: true
---

The Neon **Pro** plan is a usage-based plan intended for small to medium teams or projects that require more compute and storage than are available with the [Neon Free Tier](../introduction/technical-preview-free-tier). Because the Pro plan is usage-based, you only pay for what you use and you never have to worry about over-provisioning. If you find that the Pro plan is more than you require, you can easily revert back to the Free Tier in just a few clicks. No calls, conversations, or waiting required. Our intention is to make upgrading to Pro risk-free and hassle-free for users who want to try it. The Pro plan has no fixed contract or obligations.

The Pro plan bills for usage on a monthly basis. For information about our billing metrics and prices, please refer to our [Billing](../introduction/billing) page. For a calculator you can use to estimate monthly costs, see the [Pricing](https://neon.tech/pricing) page on our website. If you still have questions or need help estimating monthly costs, please do not hesitate to reach out to our [Sales](https://neon.tech/contact-sales) team. We're ready to help.

## What comes with the Pro plan?

Upgrading to the Neon Pro plan gives you higher limits, access to advanced features, and added support. Let's look at each of these items in more detail.

### Higher limits

- **More projects:** THe Neon Free Tier allows a single project. The Pro Tier offers up to 20. But what is a Neon project and why would you need more than one?
- **Larger computes:** The Pro plan supports computes with up to **7 vCPUs and 28 GB of RAM**, providing you with the processing power you need to handle large loads. By comparison, Neon Free Tier provides .25 vCPUs and 1GB of RAM, which is great for personal projects or a small website but less than needed at scale.
- **Unlimited storage:** With the Pro plan, data size is not a concern. We offer _bottomless storage_. There's a storage limit of 200 GB by default but only to protect your account from unintended use. We'll raise that limit on request to whatever you require.
- **Unlimited branches** The Neon Free Tier provides 10 branches. With the Pro Tier, there is no limit on branches. You can create as many branches as required to support your CI/CD pipeline. You can instantly and cost-effectively create a database branch for every preview deployment, every client, or every developer.

### Advanced features

The Neon Pro plan comes with the following advanced features, and we will be adding more. Free Tier users do not have access to these features.

- **Autoscaling:** The _Autoscaling_ feature automatically adjusts your compute size based on demand. You set a maximum and minimum compute size, and the Autoscaling feature automatically scales vCPU and RAM for optimum performance and cost-efficiency. No manual intervention is required to handle sudden spikes in demand, and no downtime is required to reconfigure system resources. You can easily enable and configure Autoscaling in the Neon Console, on the **Edit Compute Endpoint** dialog. For instructions, see [Configure Autoscaling](tbd).
- **Configurable auto-suspend (sale-to-zero):** With the Neon Free Tier, computes are automatically suspended after 300 seconds (5 minutes) of inactivity, and this setting is not configurable. With the Pro plan, you can increase or decrease the this time period (referred to as the **Auto-suspend** delay), or you can disable Auto-suspension altogether. A lesser delay such as 60 seconds could potentially reduce your compute costs. A longer delay could keep your compute active longer to avoid compute cold starts. To prevent cold starts entirely, in cases where even a delay of a few seconds is not acceptable, you can disable the Auto=suspend feature entirely so that your compute is always active and immediately available for new connections. The Auto-suspend feature is also configured in the Neon Console, on the **Edit Compute Endpoint** dialog. For instructions, see [Configure Auto-suspension](tbd).
- **Project sharing**: The _Project sharing_ feature allows you to share your Neon projects with other Neon users. Project sharing is performed from the Settings page in the Neon Console. The project sharing feature is available only to Neon paid plan users, but projects can be shared with any Neon user, including Free Tier users. For instructions, see Manage projects.

### Added support

In addition the [community forum](https://community.neon.tech/) and the ability to open support tickets, you will have access to Neon Support via video chat when you need to talk though an issue or use case face to face. Send a request to support@neon.com to request a video chat.

For a feature comparison with the Neon Free Tier, refer to the [Neon plans] table on our [Billing](../introduction/billing) page.

## How do I upgrade to Pro?

You can upgrade to Pro by clicking on Upgrade to Pro in the Neon Console. 

