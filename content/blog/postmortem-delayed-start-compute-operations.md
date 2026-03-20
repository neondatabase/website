---
title: 'Postmortem: Delayed Start Compute Operations'
description: 'Date: May 16 & 19 2025'
excerpt: >-
  Summary On two occasions in the past week, Neon customers in AWS/us-east-1
  were unable to create or start inactive databases, for a total period of 5.5
  hours. Customers with running databases were unaffected. The root cause
  related to our ability to assign IP addresses to new dat...
date: '2025-05-21T18:44:44'
updatedOn: '2025-05-30T20:26:04'
category: engineering
categories:
  - engineering
authors:
  - em-sharnoff
  - mihai-bojin
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: 'Postmortem: Delayed Start Compute Operations - Neon'
  description: >-
    On two occasions in the past week, Neon customers in AWS/us-east-1 were
    unable to create or start inactive databases, for a total period of 5.5
    hours.
  keywords: []
  noindex: false
  ogTitle: 'Postmortem: Delayed Start Compute Operations - Neon'
  ogDescription: >-
    On two occasions in the past week, Neon customers in AWS/us-east-1 were
    unable to create or start inactive databases, for a total period of 5.5
    hours.
  image: null
source:
  wpId: 9698
  wpSlug: postmortem-delayed-start-compute-operations
  exportedAt: '2026-03-20T13:31:00.745Z'
---

## Summary

On two occasions in the past week, Neon customers in AWS/us-east-1 were unable to create or start [inactive databases](https://neon.tech/docs/introduction/scale-to-zero), for a total period of 5.5 hours. Customers with running databases were unaffected.

The root cause related to our ability to assign IP addresses to new database instances. We have taken preventative measures with our IP allocation, subnet size and VPC configuration to avoid re-occurrence. We have also redirected some load from this region to others. We have a longer-term plan to replace our current Kubernetes architecture, which is in progress.

We are continuing to work on action items following these incidents and will post a further update with more details in the coming days.

## Details

On Friday May 16, 2025, starting 14:13 UTC our AWS us-east-1 cluster experienced a [significant outage](https://neonstatus.com/aws-us-east-n-virginia/incidents/01JVCSSZVESGZXC0MSDT0BTZYK) that prevented customers from creating or waking up databases. We were able to mitigate the incident within 2 hours and returned the cluster to full working health in approx. 3.5 hours, with many customers observing recovery, starting 16:50 UTC.

On Monday May 19, 2025 at 13:17 UTC we made further attempts to effect a long-term improvement and unfortunately experienced a [regression](https://neonstatus.com/aws-us-east-n-virginia/incidents/01JVMC87K8HJC1QFB05TEFA9K9#updates) of the same incident, which was mitigated by 15:30 UTC and fully resolved by 17:10 UTC. We continued to monitor the cluster for a few hours to avoid wrongly calling incident resolution.

On Friday,

- A change in the [execution plan](https://neon.com/blog/delayed-start-compute-operations-triggering-event/) for an expensive query in our control plane service’s backing database caused it to overload, increasing query execution times by 1-2 orders of magnitude (10x-100x)
- As a result, our control plane was unable to suspend inactive databases (a usual rate is ~10/second); this led to a very high number of running pods in this cluster (~8000), more than its planned capacity (6000). We test our clusters up to 10,000 pods, but not with the same level of dynamism that we experienced in production today.
- Having that many active pods exhausted all available IP addresses in 2 of the 3 subnets in that region, which prevented starting new databases.
- After reconfiguring [AWS CNI](https://github.com/aws/amazon-vpc-cni-k8s/) with _WARM_IP_TARGET=1_, some IPs were released and more databases were started, until we reached another ceiling of ~10k pods.
- In parallel, we upscaled our control plane database, allowing it to successfully process database suspensions and release previously in use but no longer needed IPs.
- We also enabled rate limiting at the [Neon Proxy](https://neon.tech/docs/reference/glossary#neon-proxy) layer to protect our control plane from experiencing thundering herd symptoms while it was restarting. This resulted in some customers noticing a _Rate Limit Exceeded_ error when trying to connect to their databases.
- IP allocation continued to fail, so we then set _WARM_IP_TARGET_ and _WARM_ENI_TARGET_ to ‘0’, after which IP allocation improved.
- This enabled new databases to start and for normal operations to resume.
- Finally, we then disabled rate limiting in our Proxy layer.

On Monday,

- During the Friday incident, we made several AWS CNI configuration changes. As part of our post-incident process, we reverted these changes to our standard cluster configuration.
- Unexpectedly, restoring _WARM_IP_TARGET to ‘1’_ triggered a new outage; we were once again unable to allocate IP addresses, even though sufficient free IPs were available in each of our subnets.
- We immediately reverted the change, but there was an extended period before IP allocation began to function correctly again. We are continuing to investigate this phase. Our kubernetes clusters are highly customised, and we are continuing to work on reproducing this behaviour in our test environments.
- To mitigate IP allocation errors, we doubled the size of our [prewarmed](https://neon.tech/blog/cold-starts-just-got-hot) compute (database) pools.
- This eliminated the impact experienced by our customers; several hours later, the IP allocation error rate returned to near-zero on its own.

_**Note:** During this incident, there was a period in which IPs were available in our subnets, but only a small number were successfully assigned to pods. We are currently investigating the root cause of this issue and working with AWS Support. We will update this article when the investigation concludes._

Our [Production Readiness checklist](https://neon.tech/docs/get-started-with-neon/production-checklist) recommends that customers with production databases disable [scale-to-zero](https://neon.tech/blog/using-neons-auto-suspend-with-long-running-applications), so these customers were unaffected.

However, many of our customers rely on this mechanism to reduce costs for their development branches. These customers experienced significant outages, for which we apologize. We are taking active steps to prevent this from happening again.

As part of our post-Incident work, we’ve reviewed the code of the [aws-cni plugin](https://github.com/aws/amazon-vpc-cni-k8s) and are doubling the size of our VPC subnets in us-east-1. This will provide significant additional headroom and will prevent future IP allocation errors.

We have, for some time, been aware of the potential for scaling-related issues due to the increase in customer databases across all of our regions. For the past few months, we’ve been working on significant architectural changes to our Kubernetes architecture. This project is called Cells, and we intend to write posts about it as it is delivered. We are testing the Cells architecture in our pre-production, but it is not yet ready for customers. We intend to publish a deep-dive about it soon!

## Closing

We will continue to work on post-Incident action items, and are going deeper in understanding the root causes of these outages. We intend to update this post with more detail in the coming days. Thank you for your patience and trust.
