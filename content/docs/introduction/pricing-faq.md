---
title: Pricing FAQ
subtitle: Answers to common questions about Neon's pricing and usage-based model
enableTableOfContents: true
isDraft: false
updatedOn: '2025-06-03'
---

Here are answers to common questions about Neon’s pricing, billing, and plan structure. For full plan details, see the [Neon pricing page](https://neon.tech/pricing).

<DefinitionList>

## General

How does Neon’s pricing model work?
: Each plan includes a bundle of monthly resources — such as compute hours, storage, and data transfer — for a flat monthly fee. If you exceed those amounts, you’re billed for extra usage at tiered rates. Paid plans also support optional add-ons like longer restore windows, larger compute sizes, and compliance features.

Do I need to upgrade my plan to use more resources?
: No. Serverless and Business plans let you scale usage without changing plans — you’re only billed for what you use beyond your included resources.

Can I upgrade or downgrade my plan later?
: Yes. You can switch between Free, Serverless, and Business plans at any time. Enterprise plans are customized through our sales team.

Can I pay annually?
: Yes. Annual billing with custom pricing and invoice support is available on the Enterprise plan.

Where can I see my current usage?
: You can view usage metrics for compute, storage, and data transfer in the [Neon Console](https://console.neon.tech/). Projected billing is available on paid plans.

---

## Plans and features

How is the Serverless plan different from the Free plan?
: The Free plan has capped usage (no overages), while the Serverless plan includes higher limits and usage-based billing for additional resources. Serverless also gives you access to add-ons like SOC 2 certification, metrics export, and support upgrades.

How do I know which plan is right for me?
: Use the **Free plan** for testing, learning, or side projects. Choose **Serverless** if your app is growing and needs more flexibility. **Business** adds compliance, security, and bundled add-ons. Go **Enterprise** if you need dedicated support, custom limits, or annual contracts.

Do all plans include the same Postgres features?
: Yes. All plans support branching, connection pooling, logical replication, and 60+ Postgres extensions. Some advanced features (like PrivateLink and custom extensions) are only available on specific plans.

What is Instant Restore?
: Instant Restore lets you rewind a branch to a previous point in time. The window depends on your plan:  
: - Free: 6 hours  
: - Serverless & Business: 24 hours  
: - Up to 30 days with paid add-ons

What add-ons are available?
: Add-ons vary by plan and may include:  
: - Larger compute sizes (up to 16 vCPU / 64 GB RAM)  
: - Restore window extensions (7-day or 30-day)  
: - Priority support  
: - Metrics export to Datadog  
: - IP allowlists  
: - SOC 2 and HIPAA certifications

What support options are available?
: - Free plan: Community support only  
: - Serverless: Standard support (upgradeable to Priority)  
: - Business: Priority support included  
: - Enterprise: Priority support plus dedicated Slack access and a solutions engineer

---

## Compute and usage

What’s a compute hour?
: A compute hour is one active hour of compute at 1 CU (1 CPU + 4 GB RAM). A 2 CU compute uses 2 compute hours per hour of activity. Suspended (idle) compute does not count toward your usage.

What happens if I go over my included resources?
: On paid plans, extra compute, storage, and data transfer are billed automatically at tiered rates. On the Free plan, exceeding compute or transfer limits will suspend your compute until the monthly reset.

Can I purchase additional compute hours or storage?
: Yes. Serverless and Business plans support automatic overage billing for compute, storage, projects, and data transfer. You don’t need to configure limits manually.

---

## Free plan

What happens when I exceed 50 compute hours on the Free plan?
: Your compute is paused until the beginning of the next billing cycle. Consider upgrading to Serverless to continue running without interruption.

Can I run multiple projects on the Free plan?
: Yes — up to 10 projects per organization. All compute usage across those projects counts toward your monthly 50-hour limit per project.

Does the Free plan support autoscaling?
: Yes, up to 2 CU. Just note that autoscaling to a higher CU consumes your compute hours faster.

---

## Serverless plan

How does billing work for the Serverless plan?
: You pay a flat monthly fee starting at $5 per project, which includes bundled resources. Usage beyond the included limits (e.g., extra compute, storage, or transfer) is billed based on volume at tiered rates.

Does the Serverless plan include SOC 2 compliance?
: Not by default, but you can enable it as a $100/month add-on.

What’s included in Standard Support?
: Standard support provides ticket-based help during business hours. You can upgrade to Priority Support for faster response times and escalated issue handling.

---

## Business plan

How do I pay via Azure?
: You can subscribe to the Business plan through the Azure Marketplace and handle billing via your Azure account.

What is PrivateLink and how do I use it?
: PrivateLink provides private network connectivity between your Neon compute and your VPC. It’s included in the Business and Enterprise plans and requires VPC endpoint configuration.

Is HIPAA certification included or an add-on?
: HIPAA compliance is a separately billed add-on for Business and Enterprise plans. It also requires additional setup steps.

What level of support is included?
: Business plans include Priority Support with faster SLAs and escalation access.

---

## Enterprise plan

How do I get started with an Enterprise plan?
: You can [request a trial](https://neon.tech/enterprise#request-trial) or [contact sales](https://neon.tech/contact-sales) to discuss your needs.

Can I use a custom domain on the Enterprise plan?
: Yes. Enterprise customers can configure a custom domain proxy to route database traffic through a domain they own.

What’s involved in a 0-downtime migration?
: We help you replicate data, coordinate cutovers, and maintain continuity — typically using branching or logical replication strategies.

What kind of custom pricing is available?
: Enterprise pricing is flexible and based on usage patterns, commitments, and SLAs. Discounts are available for large-scale workloads and annual contracts.

How does the dedicated solution engineer work?
: You get an assigned technical expert who supports your team during onboarding, migrations, and ongoing performance tuning.

</DefinitionList>
