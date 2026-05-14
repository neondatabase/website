---
title: Measuring uptime for Neon’s multi-tenant architecture
description: 'Uptime, incidents, and what''s ahead'
excerpt: >-
  In the past two months, we’ve had several incidents that affected different
  aspects of our service. We’ve been transparent about them, and we made sure
  that each major one included details on what happened, the size of the impact,
  and what we’re doing to prevent it from happening...
date: '2023-12-08T21:49:03'
updatedOn: '2024-03-01T14:15:08'
category: community
categories:
  - community
  - engineering
authors:
  - stas-kelvich
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/multi-tenant-uptime/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Measuring uptime for Neon's multi-tenant architecture - Neon
  description: >-
    This post highlights the decision-making behind how Neon reports on uptime
    percentage and what's ahead for Neon over the next few months.
  keywords: []
  noindex: false
  ogTitle: Measuring uptime for Neon's multi-tenant architecture - Neon
  ogDescription: >-
    This post highlights the decision-making behind how Neon reports on uptime
    percentage and what's ahead for Neon over the next few months.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/multi-tenant-uptime/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/multi-tenant-uptime/image-3-1024x576-d0dde65e.png)

In the past two months, we’ve had several incidents that affected different aspects of our service. We’ve been transparent about them, and we made sure that each major one included details on what happened, the size of the impact, and what we’re doing to prevent it from happening again.

We’ve communicated about all of the incidents through our [status page](https://neonstatus.com/). Anyone can subscribe for updates using email or RSS, and our status page is tightly integrated with our monitoring, alerting, and incident response systems, which helps us keep you fully informed.

The page has gone through several iterations, most recently, we removed the percentage uptime metric because it wasn’t an accurate measure of our service’s uptime. This post highlights the decision-making behind that change and what’s ahead for Neon over the next few months.

## Communicating uptime

At a high level, Neon is a multi-tenant, distributed system with several moving parts. Over the past year, we’ve grown rapidly to host almost 400,000 databases on the platform across six regions.

For the first version of the status page, we used the standard uptime percentage formula. This is calculated by tracking the time the service has been operational without an active incident as a percentage of the total possible operational time. For example, if a system has been operational for 99 out of 100 hours, the uptime is 99%.

<br />The goal of this metric is to represent the health of a system. However, we found this binary “is there an incident or not” approach wasn’t accurate for describing our service. For example, in the past 30 days, 99.9% of projects hosted on Neon had an uptime better than 99.95%; however, the status page displayed 99.89% uptime.

For a metric that better represents the health of our system, we’re exploring displaying the uptime percentage of projects at different ranges: below 99.5%, 99.9%, and 99.95%. We’re currently working with our incident service provider to implement this metric, which we believe will provide a more accurate reflection of our system status.

In the meantime, we stopped displaying the default uptime metric on the Neon status page. Looking back, we should have communicated this decision and our rationale to our users to avoid raising concerns.

## Reflecting on recent incidents

We knew that by taking on building a cloud-native storage system on top of Postgres, we would eventually face some technical challenges. Looking back at the incidents of the past 90 days, each one falls under one of the following categories:

- Noisy neighbor causing a high IO on the compute node
- Noisy neighbor causing a high rate of internal API requests
- Misconfiguration

### Noisy neighbor causing high IO on the compute node

Neon’s architecture separates the storage and compute layers. Postgres (compute) runs in a Kubernetes container and has no persistent storage attached to it. Postgres, however, can still use the local disk as external storage for temporary files during the execution of a transaction, e.g., for sorting large amounts of data that cannot fit in memory.

While Kubernetes supports imposing CPU and memory limits, there is no built-in way to set IO rate limits. Moreover, if one rogue [pod](https://kubernetes.io/docs/concepts/workloads/pods/) causes a lot of IO, it can leave [containerd](https://containerd.io/) (the container runtime) in a permanently degraded state, such that further attempts to start or stop pods continually time out. This compounds the problem, making it much more difficult to recover: the underlying processes may be successfully terminated, but if the state in Kubernetes hasn’t updated to reflect that, the pods’ controllers cannot create a replacement, resulting in visible downtime.

We faced this problem multiple times during November and have since gained a thorough understanding of how to effectively prevent it. Our mitigation involved writing a Kubernetes DaemonSet that monitors all new pods and applies cgroup IO limits for new compute nodes. Since then, we have had no cases of high IO causing problems for other tenants.

### Noisy neighbor causing a high rate of internal API requests

While waking up a suspended database, we need to:

1. Authenticate the user
2. Assign an existing pod from [the pool](https://neon.tech/blog/cold-starts-just-got-hot#compute-pools) or start a new one
3. Establish a connection between Neon’s proxy, Postgres, and the storage nodes.

During this process, we can encounter transient errors. For example, if a connection is not established at the first attempt, any of the API calls could return a retriable error. This can be caused by kube-proxy rules propagating through the cluster non-atomically (e.g., a user tries connecting to the database right when it is scheduled to be suspended). For this type of internal error, we avoid spilling it to users and rely on an internal retry process.

We ran into issues with our retry implementation due to misalignment between systems regarding which error codes are considered retriable and which are not. Additionally, the absence of a rate limiter on one of the internal APIs led to instances where specific user activities triggered a surge in internal API requests. This surge, exacerbated by our retry logic, resulted in broader system issues.

To address this issue and prevent it from recurring, we improved our implementation and set up rate limiters. Since then, we haven’t had a reoccurrence of this issue.

### Misconfiguration

Several other incidents could be broadly classified as misconfiguration. The main reason is that some critical components are centralized across regions. This means any issue with them will have a global blast radius.

We’re in the process of switching these components to region-local deployments, and aim to finish this project in January. This work will reduce the blast radius for any issues associated with these components, and allow the gradual rollout of specific changes.

## The road ahead

[Open source](https://github.com/neondatabase/neon) is at the core of everything we do. Neon is built by a global team of dedicated engineers, committed to leveling up the standard for cloud Postgres. We carefully designed our architecture, focusing on cloud independence, performance, and developer experience.

As we approach general availability, our highest priority is ensuring the platform’s reliability and scalability. We’re grateful for all the support and feedback we received from the community, and we’ll continue to work together toward building the best Postgres service in the cloud.
