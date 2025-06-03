---
title: Neon plans
subtitle: Learn about the different plans offered by Neon
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/billing#neon-plans
  - /docs/introduction/billing-calculators
  - /docs/introduction/billing-rates
  - /docs/introduction/free-tier
  - /docs/introduction/pro-plan
  - /docs/introduction/custom-plan
  - /docs/reference/technical-preview-free-tier
  - /docs/reference/pricing-estimation-guide
  - /docs/reference/billing-sample
updatedOn: '2025-05-30T16:54:40.485Z'
---

Neon's pricing combines flat-rate plans with usage-based pricing. Each plan includes a bundle of resources — like compute hours, storage, and data transfer — and you only pay extra if you exceed those included amounts. This lets you start small and scale gradually, with predictable base costs and flexible overages that grow with your usage.

On paid plans, you can also enable optional add-ons like extended restore windows, larger compute sizes, metrics export, and compliance features. These are billed monthly and can be added or removed as your needs change.

## Choosing the right plan

Neon’s usage-based pricing makes it easy to grow your project without switching platforms. You only pay for what you use beyond your included resources — no need to upgrade early or over-provision.

Here’s a quick overview to help you decide which plan is right for you:

- **Free**: Great for learning, testing, and personal projects. Usage is capped — no surprise charges or billing.
- **Serverless**: For growing apps that need more compute or storage. Starts at $5/month and includes **bundled resources**, **usage-based pricing** for extra resources, and **optional add-ons**. The Serverless plan lets you scale up without hitting a wall.
- **Business**: Ideal for production teams with performance, compliance, and support requirements. Includes **higher bundled resource limits**, **all usage-based pricing options** found in the Serverless plan, and most **add-ons** are included.
- **Enterprise**: This is our custom plan — designed for teams with complex or large-scale needs. Supports custom pricing, predictable billing, and dedicated support — while still offering **scalable usage-based pricing**.

For a detailed feature and pricing breakdown, visit the [Neon pricing page](https://neon.tech/pricing).

---

## Free plan

**$0/month** — Start for free  
For developers exploring Neon or building side projects.

**What you get on the Free plan:**
- 10 projects per organization
- 10 branches per project
- 3 schema-only branches
- 0.5 GB storage per project
- Up to 2 CU compute size
- 50 compute hours per project/month
- 5 GB data transfer
- 6-hour instant restore window

<Admonition type="info" title="Why upgrade from Free to Serverless?">
Need more compute hours, branching flexibility, or data transfer? Serverless offers 2x the compute, 10x the branches, and support for usage-based scaling — starting at $5/month.
</Admonition>

---

## Serverless

**From $5/month**
For startups and projects that need flexible usage and room to scale.

**What you get with the flat monthly fee:**
- 100 projects per organization
- 100 branches per project
- 5 schema-only branches
- 1 GB storage per project
- Up to 8 CU compute size
- 100 compute hours per project/month
- 100 GB data transfer
- 24-hour instant restore window

**Usage-based pricing if you need extra**
- Additional projects: $5 each
- Storage (per GB-month):
  - 1–10 GB: $0.39
  - 10–100 GB: $0.34
  - 100+ GB: $0.29
- Compute (per active hour):
  - 100–1,000 hours: $0.22
  - 1,000–10,000 hours: $0.20
  - 10,000+ hours: $0.18
- Data transfer: $10 per GB

**Optional add-ons:**
- Larger compute sizes (up to 16 vCPU / 64 GB RAM): $100
- Priority support: $250
- Restore window extensions:
  - 7 days: $50
  - 30 days: $950
- Metrics export to Datadog: $50
- IP allowlist: $50
- SOC 2 certification: $100

<Admonition type="info" title="Why upgrade from Serverless to Business?">
Need HIPAA compliance, private networking, or included add-ons? The Business plan includes all Serverless capabilities plus enhanced support and security features.
</Admonition>

---

## Business

**From $700/month (pay via Azure)**
For production teams needing security, compliance, and advanced support.

**What you get with the flat monthly fee:**
- 100 projects per organization
- 100 branches per project
- 25 schema-only branches
- 1 GB storage per project
- Up to 56 CU compute size
- 100 compute hours per project/month
- 100 GB data transfer
- 24-hour instant restore window

**Usage-based pricing if you need extra**
- Additional projects: $5 each
- Storage (per GB-month):
  - 1–10 GB: $0.39
  - 10–100 GB: $0.34
  - 100+ GB: $0.29
- Compute (per active hour):
  - 100–1,000 hours: $0.22
  - 1,000–10,000 hours: $0.20
  - 10,000+ hours: $0.18
- Data transfer: $10 per GB

**Add-ons (most included):**
- Larger compute sizes: **Included**
- Priority support: **Included**
- 7-day and 30-day restore windows: **Included**
- Metrics export to Datadog: **Included**
- IP allowlist: **Included**
- SOC 2 certification: **Included**
- HIPAA certification: $500

<Admonition type="info" title="Why upgrade to Enterprise?">
Need higher limits, custom pricing, or dedicated support for mission-critical workloads? The Enterprise plan gives you full control over resources, compliance, and support — plus hands-on help with migrations and security reviews.
</Admonition>

---

## Enterprise

**Custom pricing**
For large teams, SaaS vendors, or orgs with strict compliance and migration requirements.

**What you get:**
- Custom project, branch, and storage limits
- Custom compute limits and configurations
- Tailored pricing and resource allocation
- Zero-downtime migrations
- Highest level of support

**Enterprise benefits:**
- Invoice billing and annual commitments
- Security reviews and compliance questionnaires
- Dedicated Slack channel
- Assigned solution engineer
- Custom domain proxy
- HIPAA and SOC 2 included (as needed)

To learn more, [contact our sales team](https://neon.tech/contact-sales) or [request an enterprise trial](https://neon.tech/enterprise#request-trial).

<NeedHelp/>
