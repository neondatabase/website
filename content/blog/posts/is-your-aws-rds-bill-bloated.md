---
title: Is your AWS RDS bill bloated?
description: 'If yes, you’re like most developers'
excerpt: >-
  “We definitely were wasting money in unused compute. We could have used
  burstable instances, we could have shut down servers at night—but the
  pressures of the daily tasks never gave us the time to get to it” (Director of
  Sofware Engineering) We see this all the time: companies us...
date: '2024-09-25T19:46:25'
updatedOn: '2024-12-24T18:16:08'
category: company
categories:
  - company
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/is-your-aws-rds-bill-bloated/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Is your AWS RDS bill bloated? - Neon
  description: >-
    Many companies using AWS RDS are wasting money due to overprovisioned/unused
    instances. Results from a recent developer survey confirm this.
  keywords: []
  noindex: false
  ogTitle: Is your AWS RDS bill bloated? - Neon
  ogDescription: >-
    Many companies using AWS RDS are wasting money due to overprovisioned/unused
    instances. Results from a recent developer survey confirm this.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/is-your-aws-rds-bill-bloated/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/is-your-aws-rds-bill-bloated/neon-aws-bill-2-1024x576-2234b16c.jpg)

<blockquote>
<p>“We definitely were wasting money in unused compute. We could have used burstable instances, we could have shut down servers at night—but the pressures of the daily tasks never gave us the time to get to it” (Director of Sofware Engineering)</p>
</blockquote>

We see this all the time: companies using AWS RDS are wasting money. Their database bills grow month after month _unnecessarily_ mainly due to two reasons:

1. **Overprovisioned production databases**. To avoid potential performance issues, teams provision more compute in their production instances than what they actually need. As a result, they end up paying for capacity that sits idle most of the time.
2. **Non-prod environments running up costs**. Development databases might only be used for a few hours each day, by teams end up paying for them 24/7 the entire time they’re up—even when no one is using them.

We ran a recent developer survey that confirms our first-hand experience. Many teams seem to be trapped in this cycle. Even though managed databases like RDS don’t seem expensive at first, the bill grows into the thousands due to paying for resources that aren’t being used.

## Asking developers about their prod/non-prod usage

<blockquote>
<p>“We have so many dev/test instances that aren’t being used frequently but are always provisioned” (Software Engineer)</p>
</blockquote>

<blockquote>
<p>“To save costs, we tried doing temporary shutdowns, but our QA was on a different timezone so there was little room” (DevOps Engineer)</p>
</blockquote>

To give you an objective view of how common this problem is, consider the results of a recent survey we conducted. We asked 32 random developers running relational databases on AWS RDS or similar services about their database deployments and usage patterns. They had no connection to Neon.

Here’s what we found:

### Overprovisioning in production databases

**63% of developers needed their allocated compute capacity for 8 hours a day or less, with traffic being much lower the rest of the time.**

- 53% of developers reported that their production databases had 10 CPUs or more.
- 28% of developers reported to only need that capacity for 4–8 hours per day.
- Some needed that capacity even more rarely: 28% of developers needed this capacity for only 1-3 hours each day.

### Underutilization of non-production databases

**56 % of developers were using their dev/test instances for 4 hours per day or less.**

- This was despite having a considerable number of non-production instances. 47% of developers had 5 or more dev/test databases running simultaneously and continuously.
- These instances also had considerable size. 41% of developers used instance sizes of 2 CPUs or more for their dev/test environments.

## How does this translate into money wasted?

<blockquote>
<p>“We used to have our dev instances up all the time. We just started the process of having them up during work hours, but it’s still WIP” (Staff Software Engineer)</p>
</blockquote>

<blockquote>
<p>“We run around 20 RDS databases 24/7 hours a day, 365 days a year. To save on costs, we are working on consolidating multiple RDS databases into 1”  (Sr DevOps Engineer) </p>
</blockquote>

Let’s put this into perspective. We’ll pick an example deployment and usage pattern that is average among the respondents of this survey, using AWS RDS Postgres prices (us-east-1, single-AZ).

- Production: `db.m5.4xlarge` (16 vCPUs, 64 GiB RAM). On average, production traffic reaches close to full capacity for 6 hours per day, being much lower the rest of the time.
- Development/test: let’s assume 10 `db.t3.large` instances (2 vCPUs, 8 GiB RAM). These dev/test instances are used for 4 hours per day on average.

Let’s estimate the monthly _compute costs_ of this deployment in RDS:

- Production: [$1.424 per hour &#42; 730 hours] = $1,039.5 /month in compute
- Dev/test: [$0.145 per hour &#42; 730 hours &#42; 10 instances] = $1,058.5 /month in compute

Now, let’s answer the million-dollar question…

**How much of this monthly bill is wasted money?**

Here’s the math:

- Money wasted in production database: $629.41 per month (60.5% of the monthly compute cost)
  - _Reasoning: For 18 hours per day, the production database needs much less capacity. This estimation assumes that during those hours, the production database would be fine with 20% of the CPU/memory capacity compared to the hours of peak traffic._
- Money wasted in non-prod databases: $884.50 per month (83.6% of the dev/test monthly compute cost)
  - _Reasoning: For 20 hours per day, these databases are not being used. This estimation assumes that we could simply scale those databases down to zero during that time, saving the compute costs._

Considering the effect of both production and non-prod, in this example use case, **$1,513.91 per month (72% of the total compute budget) is wasted money** that could be avoided if we were paying only for the compute we used.

## Stop wasting money. Try Neon

<blockquote>
<p>“We were spending too much, and we also really didn’t need to make it as complicated as it was. We had dedicated DevOps to take care of our managed database” (Senior Software Engineer) <br></br></p>
</blockquote>

I’m sure you agree with us—**this is such an inefficient way to do cloud**. Managed databases are supposed to help us consume resources more efficiently rather than waste most of our budget on machines that are _computing nothing_.

[Neon](https://neon.tech/home) is a managed Postgres provider that offers solutions for this problem. We’ve built a serverless platform for Postgres that allows you to pay only for the compute you’re using:

- [Neon’s autoscaling](https://neon.tech/docs/introduction/autoscaling) eliminates the need to overprovision your production database. Your production database dynamically autoscales according to load between minimum and maximum limits defined by you—you get full capacity when traffic peaks and save money when things are slower.
- To lower the costs of your non-prod databases, Neon comes with [scale-to-zero functionality](https://neon.tech/docs/introduction/auto-suspend). When your non-prod databases are not being accessed, they are automatically paused by the platform—you only pay for compute when you’re using them, period.

Neon has [a Free plan](https://neon.tech/pricing) with more than enough resources to get started and get a feel for the experience. Create an account in seconds [here](https://console.neon.tech/signup).

<Admonition type="tip" title="Neon vs RDS: FAQ">
If you're interested in a detailed comparison of Neon vs RDS, check out [neon.tech/rds](https://neon.tech/rds).
</Admonition>
