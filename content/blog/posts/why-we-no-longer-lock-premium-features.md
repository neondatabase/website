---
title: Why We No Longer Lock Premium Features
description: >-
  HIPAA, SLAs, SOC 2, and logs export are available to everyone with costs
  proportional to usage - vs flat monthly minimums
excerpt: >-
  Most database providers follow the classic SaaS playbook: bundle features into
  tiered plans with progressively higher monthly fees. This looks neat on a
  pricing page. Almost nobody questions this model, but it creates a quagmire
  inside product teams. We know it from experience, a...
date: '2025-09-04T16:01:18'
updatedOn: '2025-12-09T01:19:38'
category: product
categories:
  - product
  - company
authors:
  - monica-steinke
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-we-no-longer-lock-premium-features/cover.png
  alt: null
isFeatured: true
seo:
  title: Why We No Longer Lock Premium Features - Neon
  description: >-
    With our recent repricing, we stopped gating security and compliance
    features behind flat monthly fees - they're now available from $5/month.
  keywords: []
  noindex: false
  ogTitle: Why We No Longer Lock Premium Features - Neon
  ogDescription: >-
    With our recent repricing, we stopped gating security and compliance
    features behind flat monthly fees - they're now available from $5/month.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-we-no-longer-lock-premium-features/social.png
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/why-we-no-longer-lock-premium-features/screenshot-2025-09-04-at-84516percente2percent80percentafam-1024x572-5d105f67.png)

Most database providers follow the classic SaaS playbook: bundle features into tiered plans with progressively higher monthly fees.

This looks neat on a pricing page. Almost nobody questions this model, but it creates a quagmire inside product teams. We know it from experience, and if you’ve worked in a database company, you know it too.

Companies are put into a catch-22: focus on users on the one hand, and profitability on the other. Do you place the most valuable features in higher tiers to drive upgrades, or do you make them accessible to the users who actually need them?

## The trap of traditional pricing tiers for databases

### Essential features locked away

Features like HIPAA compliance, SOC 2, or private networking are among the first candidates to be packaged as “Enterprise” features – but they’re a must for many companies even if they’re small. A healthcare startup may be handling modest Postgres workloads worth a few hundred dollars a month, but they may need HIPAA from day one. Yet the traditional model forces the small team to buy into an expensive enterprise plan just to access it.

### Small users start subsidizing larger users

The situation above creates an inherently unfair revenue model. When deciding which monthly price to attach to the largest tiers, it’s nearly impossible to average this out in a way that works for everyone (unless the customer base is mostly enterprises).

Many smaller companies like the one above are forced to pay a monthly minimum far above what they would organically pay according to their usage, just to unlock a feature – while a large enterprise enjoys the same feature at marginal cost relative to their bill. It’s a cross-subsidy that leaves smaller teams paying more than they should.

### Add-ons with flat monthly fees are unfair

Something similar happens when features are “unlocked” as add-ons with a fixed monthly fee. For this model to be sustainable and automated (again, unless most of your customers are contract and sales-led), the fee has to be set at one level for everyone. The team has no choice but to set a price that will inevitably be too high for many users, and merely acceptable for a few who could probably have paid much more.

Charging the same for vastly different workloads makes little sense – paying the same fee for PITR, HIPAA, or log export whether you’re moving 100 GB or 1 TB of data a month doesn’t reflect actual platform costs. Bills end up inflated in an artificial way for the majority of customers.

## How we decided to solve it in Neon

### Moving away from flat fees

[With our recent repricing](https://neon.com/blog/new-usage-based-pricing), we moved away from the classic _good-better-best_ approach. We now have two plans with the same monthly minimum. We know this looks odd at first, but our reasoning was this: the most elegant way to cover the extra costs of premium features while keeping the model fair is to bill in proportion to usage, not to rely on arbitrary plan gating.

### Usage-based access to enterprise features

That’s what we decided to do. In our new plans, there are no fixed feature fees. Instead, the “premium” plan (Scale) unlocks all of our enterprise features in exchange for a higher compute (CU-hour) unit price. A startup with small workloads isn’t forced into the same flat fee as an enterprise running terabytes of data. Both pay more when accessing premium features, but the smaller company isn’t hit with a fee disproportionate to its footprint.

When a higher compute price alone isn’t enough to cover the costs of especially expensive features (HIPAA is a good example), we introduce an additional usage-based markup – never a flat fee that’s the same for everyone.

### HIPAA as a case study

Take HIPAA as an example. Supporting HIPAA involves real infrastructure costs, which is why some providers charge flat fees in the thousands per month. HIPAA requires audit logging (via pgaudit), longer log retention, and several compliance controls.

The reality is that these costs are far higher for large workloads than for small ones. In the traditional model, both pay the same flat add-on fee. In Neon, everyone on Scale ($5/month minimum) can access HIPAA. If you need it for a project, we cover our costs with a usage-based surcharge. A small healthcare startup might see an incremental cost under $50, while an enterprise with a much larger workload might see $500 or more, which makes sense.

<Admonition type="info" title="Inspired by Databricks model">
We mirrored this model from Databricks’ serverless pricing, which successfully proved that large-scale infrastructure features can be aligned directly with resource consumption.
</Admonition>

## Premium features are no longer locked

<Admonition type="important" title="Neon pricing update (December 2025)">
We are no longer enforcing the $5 minimum in our paid plans - if you consume $3, that's what you'll be charged. [Check our pricing page for the up to date pricing information.](https://neon.com/pricing)
</Admonition>

In other Postgres providers, these are locked behind expensive plans. Not in Neon.

| “Premium” feature | Competition | Neon |
| --- | --- | --- |
| SOC 2 | $599/mo plan | Available in Scale: $5 minimum |
| **SSO** | $599/mo plan | Available in Scale: $5 minimum |
| **PrivateLink** | Enterprise only | Available in Scale: $5 minimum |
| **SLA** | Enterprise only | Available in Scale: $5 minimum |
| **HIPAA** | $599/mo plan, plus additional monthly flat fee | Available in Scale: $5 minimum + usage-based surcharge |
| **Log export** | $599/mo plan, plus $60/drain/mo + usage fees | Available in Scale: $5 minimum |
| **PITR** | $25/mo plan, plus $100 extra/month | Available in Scale: $5 minimum +<br />$0.20/GB-month of data changes |

## Sign up and try it

You don’t have to hop on a call with any sales rep to try these features. [Just sign up for Neon](https://console.neon.tech/signup) and start using them right away. If you have any questions, [join us in Discord.](https://neon.com/docs/changelog)
