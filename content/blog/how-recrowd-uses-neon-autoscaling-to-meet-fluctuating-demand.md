---
title: How Recrowd uses Neon autoscaling to meet fluctuating demand
description: >-
  Autoscaling ensures optimal performance when traffic peaks, avoiding the need
  for overprovisioning or manual resizes
excerpt: >-
  “We use Neon for its great autoscaling capabilities. It allowed us to solve a
  huge problem with simple steps” Pieralberto Colombo, CTO at Recrowd Recrowd is
  Italy’s leading crowdfunding platform, empowering small investors to
  participate in real estate projects with just a few cl...
date: '2024-03-01T16:35:34'
updatedOn: '2024-03-01T16:35:38'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Recrowd uses Neon autoscaling to meet fluctuating demand - Neon
  description: >-
    To assure good database performance during peak traffic, it's often needed
    to overprovision or to manually resize instances—not in Neon.
  keywords: []
  noindex: false
  ogTitle: How Recrowd uses Neon autoscaling to meet fluctuating demand - Neon
  ogDescription: >-
    To assure good database performance during peak traffic, it's often needed
    to overprovision or to manually resize instances—not in Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand/social.jpeg
source:
  wpId: 5075
  wpSlug: how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand/neon-recrowd-1024x576-253a7d50.jpg)

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“We use Neon for its great autoscaling capabilities. It allowed us to solve a huge problem with simple steps”</p>
<cite>Pieralberto Colombo, CTO at Recrowd</cite>
</blockquote>

[Recrowd](https://www.recrowd.com/) is Italy’s leading crowdfunding platform, empowering small investors to participate in real estate projects with just a few clicks. They’re committed to transparency and security for its investors, ensuring quality and reliability, and offering investment opportunities from as low as €250.

## The scalability dilemma

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“When we were using MySQL in Azure, we had to manually upgrade the database during the days of peak traffic and downgrade later in the day, which caused a couple of minutes of downtime. It was also a huge waste of time for our team”</p>
<cite>Pieralberto Colombo, CTO at Recrowd</cite>
</blockquote>

Like it is the case for many applications, Recrowd’s traffic patterns are variable. Right when a new investment project opens, something that typically happens a few times per month, the traffic in Recrowd’s website skyrockets, as thousands of investors request to invest in the new opportunity. These days, the requests to the database are orders of magnitude above average. But it’s precisely at this moment when the database needs to perform at its best to assure a great customer experience.

This is a very common situation that traditional managed databases don’t solve well. When you are required to provision compute instances in advance, you’re essentially forced to make a bet on the level of resources you’ll need to handle your peak traffic. But if your use case involves periods of high traffic followed by longer periods of low activity, you’re faced with a dilemma:

- You can overprovision—in other words, you can choose to always have enough capacity to handle peak demand. This ensures you’re never caught short during high-traffic events, but it’s an expensive approach. Most of the time, you’ll be paying for resources you don’t use.
- Your second option is to manually upgrade and downgrade compute capacity. This is more cost-conscious; you would scale your resources up just before you anticipate a surge in traffic, and scale down afterward. The problem with this approach is that it requires monitoring and manual work. You have to predict and execute the scaling up at the right moment. Also, this manual intervention is not instantaneous—most systems take some time to resize, which may cause downtime.

## Scaling up and down automatically: meeting fluctuating demand with Neon

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“Thanks to autoscaling, we no longer have to worry about performance during our openings or wasting time resizing instances”</p>
<cite>Pieralberto Colombo, CTO at Recrowd</cite>
</blockquote>

The Recrowd team decided to move away from the scalability dilemma by switching to Neon. Being serverless Postgres, Neon comes with [autoscaling](https://neon.tech/docs/introduction/autoscaling), a feature that dynamically adjusts compute resources to match current demand without manual intervention. This makes it seamless to manage traffic peaks without the manual overhead, downtime, or cost inefficiencies.

From a user’s perspective, the process is straightforward and requires minimal intervention:

- Neon continuously monitors the database’s workload. It automatically detects when the current demand exceeds the capacity of the allocated resources, signaling the need for scaling up.
- Once a need for scaling is detected, Neon dynamically adjusts the compute resources, which become available almost instantly. When demand diminishes, resources are scaled down.
- This elastic scaling happens with zero downtime. Applications remain accessible, and database operations continue without interruption.

Users can set [autoscaling limits](https://neon.tech/docs/manage/endpoints#compute-size-and-autoscaling-configuration) to control how aggressively or conservatively resources are scaled.

## Give it a try

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“We’re excited for what’s coming up this year at Recrowd. Neon will be our database partner”</p>
<cite>Pieralberto Colombo, CTO at Recrowd</cite>
</blockquote>

If you also have variable traffic, [request a Neon Enterprise trial](https://neon.tech/enterprise#request-trial) and experiment with autoscaling completely for free for 30 days.

Best of luck to Recrowd as they venture into new territories and continue to disrupt the real estate investment space!
