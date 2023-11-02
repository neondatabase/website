---
title: Neon Pro Plan
subtitle: Learn about the advantages of upgrading to the Neon Pro Plan
enableTableOfContents: true
isDraft: false
updatedOn: '2023-11-02T15:51:42.314Z'
---

The Neon Pro Plan plan is intended for users who have completed their evaluation of Neon on the Neon Free Tier and are ready to transition to a production-level plan with higher limits and advanced features.

Because the Neon Pro Plan is usage-based, you never have to worry about over-provisioning. You only pay for what you use. Transitioning to the Neon Pro Plan has been designed to be as smooth and hassle-free as possible. However, we understand that the Neon Pro Plan might not be for everyone &mdash; so if it turns out to be more than you need, reverting to the Neon Free Tier is a simple process. There are no fixed contracts or obligations.

## What comes with the Neon Pro Plan?

Upgrading to the Neon Pro Plan gives you higher limits, advanced features, and added support. Let's look at each of these items in more detail.

### Higher limits

- **More projects:** The Neon Pro Plan offers unlimited projects, while the Neon Free Tier offers only one. But what is a Neon project, and why would you need more than one? A project is a top-level container in Neon for your computes, branches, databases, and roles. Projects are a way to organize your resources and usage. If you are a company that develops data-driven applications, it might make sense to create a project for each client or each application. For information about objects that a project contains, see [The Neon object hierarchy](/docs/manage/overview).
- **Unlimited storage:** The Neon Pro Plan supports any data size. There's a default limit of 200 GiB to protect your account from unintended use, but if you [open a support ticket](/docs/introduction/support), we can raise the limit to whatever you require.
- **Unlimited branches:** With the Neon Pro Plan, there is no limit on branches. You can create as many branches as required to support your CI/CD pipeline. You can instantly and cost-effectively create a database branch for every preview deployment, client, or developer.
- **Unlimited databases:** There is no limit on Postgres databases in any Neon plan. You can create as many databases as you need.

<Admonition type="note">
The Neon Pro Plan has default limit of 20 simultaneously active computes to protect against unintended usage. To request an increase this limit, please [open a support ticket](/docs/introduction/support). The simultaneously active compute limit does not affect the primary branch compute, which always remains available. If you encounter `Console request failed` errors, this may indicate that you have reached the active compute limit.
</Admonition>

### Advanced features

The Neon Pro Plan comes with the following advanced features, and we plan to add more.

- **Autoscaling:** The _Autoscaling_ feature automatically adjusts compute size based on demand. You set a maximum and minimum compute size, and the Autoscaling feature automatically scales compute resources between those boundaries for optimum performance and cost-efficiency. No manual intervention is required to handle sudden usage spikes, and no downtime is required to reconfigure system resources. Neon Pro Plan users can enable and configure Autoscaling in the Neon Console. For instructions, see [Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).
- **Larger computes:** The Neon Pro Plan supports computes with up to **7 vCPUs and 28 GB of RAM**, providing the processing power  to handle any workload. By comparison, the Neon Free Tier provides .25 vCPUs and 1GB of RAM, which is great for prototyping and evaluation but less than needed at scale. For configuration instructions, see [Compute size configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).
- **Configurable Auto-suspend:** The Neon Free Tier automatically suspends computes after 5 minutes of inactivity. With the Neon Neon Pro Plan, you can increase or decrease this time period, or you can disable the Auto-suspend feature entirely. A shorter delay, such as 60 seconds, can potentially reduce compute costs. A longer delay keeps your compute active for longer intervals, reducing the number of cold starts. To prevent cold starts entirely, in cases where even a few seconds delay is too much, you can disable the Auto-suspend feature entirely so that your compute is always active. The Auto-suspend feature is configured in the Neon Console. For instructions, see [Auto-suspend configuration](/docs/manage/endpoints#auto-suspend-configuration).
- **Project sharing:** The _Project sharing_ feature allows you to share your Neon projects with other Neon users. Project sharing is managed on the **Settings** page in the Neon Console. Simply add the email account of the user you want to share your project with. Projects can be shared with any Neon user, including Neon Free Tier users. Usage is applied to the project owner's Neon account. For instructions, see [Share a project](/docs/manage/projects#share-a-project).
- **Read replicas:** Neon's read replica feature enhances scalability and performance by allowing you to create read-only compute instances that operate on the same data as your read-write computes. With this feature, you can offload analytics or reporting queries, efficiently distribute read requests to achieve higher throughput, or provide read-only data access to certain users or applications. For more information, see [Read replicas](/docs/introduction/read-replicas).

### Added support

In addition to the [community forum](https://community.neon.tech/) and the ability to open support tickets, Neon Pro Plan users have access to Neon Support via video chat. Please [open a support ticket](/docs/introduction/support) to request a video chat.

## How does billing work?

The Neon Pro Plan bills for usage monthly. Please refer to our [Billing metrics](/docs/introduction/billing) page for information about metrics and rates. To estimate monthly costs, try the [pricing calculator](https://neon.tech/pricing#calc) on our [Pricing](https://neon.tech/pricing) page or the [Pro Plan Cost Estimator](/docs/introduction/billing#pro-plan-cost-estimator) in the Neon Console. If you still have questions or need help estimating costs, please reach out to our [Sales](https://neon.tech/contact-sales) team. We're ready to help.

## How do I upgrade to Pro?

You can click on **Upgrade to Pro** in the Neon Console or click [here](https://console.neon.tech/app/projects?show_enroll_to_pro=true) to sign up.

After upgrading to a Neon Pro Plan account, Neon Free Tier limits are lifted the next time your project's compute endpoint restarts.

<Admonition type="note">
If your compute was active before upgrading, it continues to be bound by Neon Free Tier limits until it restarts, which can result in limit-related errors such as this one if Neon Free Tier limits are exceeded:

```text
ERROR: could not extend file because cluster size limit (3072 MB) has been exceeded
HINT: This limit is defined by neon.max_cluster_size GUC
```

To force a restart of your compute endpoint, you can temporarily set your compute's **Suspend compute after a period of inactivity*** setting to 1 second (the default is 5 minutes). See [Auto-suspend configuration](/docs/manage/endpoints#auto-suspend-configuration) for instructions. After doing so, check the **Operations** page in the Neon Console to see if your compute endpoint restarted. Look for `suspend_compute` and `start_compute` actions. Alternatively, you can issue [Suspend endpoint](https://api-docs.neon.tech/reference/suspendprojectendpoint) and [Start endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) API calls. Please be aware that restarting a compute endpoint interrupts any connections currently using the compute endpoint.
</Admonition>

## How do I downgrade?

If you find that the Neon Pro Plan isn't for you, you can downgrade in just a few clicks. Follow the steps described in [Downgrade your plan](/docs/introduction/manage-billing#downgrade-your-plan).
