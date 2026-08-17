---
title: AWS CNI lessons from a Production Outage
date: '2025-06-06T20:57:44'
updatedOn: '2025-06-07T08:49:27'
category: engineering
categories:
  - engineering
authors:
  - em-sharnoff
  - mihai-bojin
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxckdcmuel8sipntjphfv8kyflswpz1nv0xufnyewbs3vgrwxrp3w-r1krk4cv-atdhlpxosudl3lcwv3lxogswgm5fhbaq3kghwncse-oawl8-7twbk1eufxhzhe47geb7yrg-c3a9c973.png
  alt: null
isFeatured: false
seo:
  title: AWS CNI lessons from a Production Outage - Neon
  description: >-
    This post covers what we learned about AWS CNI through our post-mortem and
    root-cause investigation into our outages on 2025-05-16 and 2025-05-19.
  keywords: []
  noindex: false
  ogTitle: AWS CNI lessons from a Production Outage - Neon
  ogDescription: >-
    This post covers what we learned about AWS CNI through our post-mortem and
    root-cause investigation into our outages on 2025-05-16 and 2025-05-19.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxckdcmuel8sipntjphfv8kyflswpz1nv0xufnyewbs3vgrwxrp3w-r1krk4cv-atdhlpxosudl3lcwv3lxogswgm5fhbaq3kghwncse-oawl8-7twbk1eufxhzhe47geb7yrg-c3a9c973.png
---

_This post is the last in a series discussing the Neon outages on 2025-05-16 and 2025-05-19 in our AWS us-east-1 region. In this post, we cover the IP allocation failures that persisted through the majority of the disruption. For further details, read our_ [top-level Post-Mortem here](https://neon.com/blog/postmortem-delayed-start-compute-operations)_._

## Summary

Neon separates Storage and Compute to provide [Serverless Postgres](https://neon.com/blog/scaling-serverless-postgres). Our Compute Instances run in lightweight Virtual Machines in Kubernetes, each Compute running in its own Pod.

On 2025-05-16, the [Neon Control Plane](https://neon.com/blog/control-planes-for-database-per-user-in-neon)’s periodic job responsible for terminating idle Computes started failing, eventually resulting in our VPC subnets running out of IP addresses in two of three availability zones. Configuration changes to AWS CNI to free up IP addresses, while beneficial in the immediate term, later prevented returning to a healthy state. A post-incident follow-up to revert this temporary state on 2025-05-19, resulted in similar issues.

During this investigation, we have learned a lot about the behaviour of the AWS CNI plugin, how it interacts with our highly-dynamic environment, and have [filed an improvement PR](https://github.com/aws/amazon-vpc-cni-k8s/pull/3300).

This article covers how the incident happened and details about what we learned about AWS CNI through our post-mortem and root-cause investigation.

### Glossary of terms

- **AWS CNI**: refers to the [AWS VPC CNI plugin](https://github.com/aws/amazon-vpc-cni-k8s/). A more in-depth description of AWS CNI is provided below.
- **ipamd**: part of AWS CNI, refers to the L-IPAM [daemon](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go)
- **AWS ENI**: AWS Elastic Network Interface; ENIs are allocated to EC2 instances and are associated with a subnet
- **AWS VPC**: logically isolated [virtual network](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) provided by AWS
- **AWS VPC subnet (or _subnet_)**: represents a range of IP addresses in a VPC
- **Allocated IPs**: AWS subnet IPs allocated to ENIs
- **Assigned IPs**: IP addresses assigned to Kubernetes Pods (most Pods in our clusters are Neon Computes)
- **Total IPs**: total IP addresses available for allocation in a subnet (or subnets)

## 2025-05-16: Running out of IP addresses

Neon operates Kubernetes clusters in 11 cloud regions. Our _us-east-1_ cluster in AWS typically operates a daily peak of 6,000 running databases (which we call Computes), with an incoming rate of 500 new Pods started every minute and a similar rate of terminating idle databases.

When the incident started, the job responsible for shutting down idle databases failed (we have described this in more detail in a separate [post](https://neon.com/blog/delayed-start-compute-operations-triggering-event)). As terminations were not processed, but creations continued, the number of running Computes quickly rose past our cluster’s typical operating conditions, reaching ~8k active Computes in the space of a few minutes.

At ~8k active computes, our AWS VPC subnets ran out of IPv4 addresses. This was unexpected, as we test our clusters for up to 10k Computes, and our subnets were sized to a total of 12k IP addresses!

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxckdcmuel8sipntjphfv8kyflswpz1nv0xufnyewbs3vgrwxrp3w-r1krk4cv-atdhlpxosudl3lcwv3lxogswgm5fhbaq3kghwncse-oawl8-7twbk1eufxhzhe47geb7yrg-c3a9c973.png)

### A summary of the conditions that led to IP allocation unavailability

- With its default settings, AWS CNI reserves at least 1-2 _extra_ ENIs worth of IP addresses on each node
- Our nodes can utilize up to 49 IPv4 addresses per ENI
- Our AWS _us-east-1_ region only had 12k total IP addresses instead of the 24k we have in other regions.
- During the incident, we had ~4k extra IPs allocated on nodes that didn’t have enough CPU or memory available for new compute Pods to be scheduled.
- As a result, we became unable to start new computes while only 8k of 12k IPs were assigned to compute Pods — at the time, this was confusing and unexpected.

### Aside: Why only 12k IP addresses?

As one of our first regions, we hadn’t originally planned to run the cluster at this scale. Our load testing had indicated that our clusters could work with vertical scaling up to 10k Computes, but that after that, we would need to scale out horizontally.

Even though each of our three subnets was configured with a /20 CIDR block (half the size of our other clusters), we assumed we would always have sufficient available IPs due to the identified upper bound of 10k active Computes.

The rate of growth of our service in recent months has been faster than anticipated, so we’ve been working in parallel on deeper architectural changes to support horizontal scaling. We will post articles describing the new architecture after we launch it.

### Background: What is AWS CNI? How does it work?

Explaining the behaviour we saw, requires some understanding of how AWS CNI works.

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxfsm4sj69hmintf3oqdvghpxwmegnk4t1kq2jn3jo5v6wzvvutjwc9vteqfmnrdrgg4c-6o6qcmljoc4dwdp3b7kppyrh41kfgxld13be-hydanx7qwdeblz85kvpvyiaaba6ysvw-d3d14cdd.png)

The Kubernetes [Container Networking Interface](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) (CNI) is the standard interface used for configuring Pod networking in Kubernetes. CNI _plugins_ are called by the container runtime to set up (“_add_”) and tear down (“_del_”) networking for each Pod. “AWS CNI” is how we refer to the [AWS VPC CNI plugin](https://github.com/aws/amazon-vpc-cni-k8s/). At the time of this incident we were using AWS CNI v1.18.6.

Each Pod needs an IP address for networking within the cluster, and AWS CNI’s job is mostly assigning IP addresses to Pods, pulling from the appropriate VPC subnet. Internally, the CNI plugin itself makes RPC calls to _ipamd_ — the host daemon on each node, responsible for allocating IPs from the subnet onto the ENIs attached to the EC2 instance and handing those out to Pods.

To isolate Pod starts from AWS API calls (and vice versa), _ipamd_ keeps a pool of IP addresses – more than is strictly necessary for the number of Pods on the node. The pool is resized every few seconds by a [separate reconcile loop](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L658-L665), outside the context of any individual CNI request.

AWS CNI has several configuration options to influence how it manages its pool of IP addresses. We include details about our choice of options below.

### A quick recap

Our AWS _us-east-1_ cluster typically operates with 5-6k active Computes. We run our Compute Pods on [m6id.metal](https://aws.amazon.com/ec2/instance-types/m6i/) AWS instances, with 49 IP addresses per ENI (plus one IP address assigned to the network interface itself). In theory, these instances can support up to [737 pods each](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/misc/eni-max-pods.txt#L499) (or more, with [prefix delegation](https://docs.aws.amazon.com/eks/latest/userguide/cni-increase-ip-addresses.html)) — in practice, we tend to run 100-400 pods per node.

It’s worth mentioning that not all databases are equal — the number of running compute Pods on any Kubernetes node is dynamic and depends on the size of the scheduled workloads. For example, a 128 CPU node can run 128 pods with 1 CPU each, 4 pods with 32 CPUs each, or any combination in between.

During Friday’s incident, our Control Plane became [unable to terminate](https://neon.com/blog/delayed-start-compute-operations-triggering-event) idle databases. This resulted in the number of active Compute Pods quickly rising from ~5k to ~8.1k. As new Pods exhausted all schedulable CPU and memory across the cluster, [our cluster-autoscaler](https://github.com/neondatabase/autoscaling/tree/244f0f0725f1d523315bf04e2228600221dd9465/cluster-autoscaler) added more nodes.

At this point, we had old nodes without CPU or memory capacity, but with many additional allocated IPs that could never be assigned to Pods due to these scheduling constraints. This issue was not clear to us at the time.

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxfsx9lu6vh8zwnzxpskcqtocx8prjnzpbqeivvxnd7jcq4p9nmbbfmtvpwqfnva3tqghydvpujhtf2fdsz6maxyjlak9elay1blxsyjdtsqztptiswoukus9fhgmr39m20cbw-6628a39d.png)

As more nodes were added, we started observing IP allocation errors when new Pods were scheduled but were unable to start.

### Why did we run out of IP addresses?

Prior to the incident on Friday, we were using the default AWS CNI configuration (`WARM_ENI_TARGET=1` and `WARM_IP_TARGET` unset, more on these later).

Prior to the incident, each of the cluster’s 3 subnets had 3.7-3.9k **allocated** IP addresses (stored in _ipamd_’s IP pools), with only 1.6-2.3k IP addresses **assigned** to Pods (~50% utilization). Each of our three subnets were configured with a /20 CIDR block. This meant we had up to (4096 – 5) × 3 = 12273 **total** IP addresses ([5 IPs in each VPC subnet are reserved](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html#subnet-sizing-ipv4)).

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxdfejjnhoazs9-mxzkuyxoicifaktwp6fhkmg4d730hktnblhemdvevlzwk4q2ipbjfmxkqkjvvuo7otcie1qckwwhptnviijy-x-y9pek1d2wzwhorpx9kj50u5mqr7aziuae3a-931c6c37.png" alt="" />
<figcaption>(11:09 UTC on 2025-05-16)</figcaption>
</figure>

During the incident, with the sudden increase in running Pods, the cluster had **assigned**~8.8k total IP addresses (71%). However, across our three subnets, _99% of all IPs_ were **allocated**, totaling ~12,200 out of 12,273.

Because only 8.8k IP addresses were assigned, we expected that the already allocated IP addresses would be assignable to Pods, but the result was different and unexpected: IPs allocated to old nodes were, in practice, unusable. These were allocated to nodes already at CPU/memory capacity and were also not being released by AWS CNI.

Because of this detail, it appeared that the subnets had sufficient unassigned IPs available to be used for new Pods.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxepnljur1xd9jb6-fb4ahmzsxccz4e6uscearww93jjogknohvlwttmguxu20ct1qpqnqoxtt-9cbptz1-yivuzvwqiodv7iamr8lqvkb8fbjtinqgvqo27d2ssghamna-p6oyq-57eaa914.png" alt="" />
<figcaption>(15:00 UTC on 2025-05-16)</figcaption>
</figure>

In practice, as new nodes were added, they became unable to obtain sufficient IPs to match available CPU/memory capacity.

### Why were there so many IPs allocated to nodes with no spare resources?

Overallocation of IPs has to do with AWS CNI’s behavior under the default settings, which has `WARM_ENI_TARGET=1` and `WARM_IP_TARGET/MINIMUM_IP_TARGET` unset:

- Whenever _ipamd_ sees that the number of “available” IP addresses (allocated minus assigned) is [less than WARM_ENI_TARGET × (IPs per ENI)](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L2179), it will attempt to allocate more.
- Allocating more IPs – if none of the existing ENIs have room – will attempt to allocate an ENI’s worth of IP addresses [[1](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L863-L865), [2](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L2119-L2120), [3](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L1831-L1832)], specifically by the code block below:

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxdxkgeupdu3k1pfeuiksp7zl3dkxwc81-7ktlqlsqjgrvw9pswc4c-0ew9ompptly14bi7iiizbtbll4s28mjtl1bljl7yaj7cwc24phz2d4dvytzataxhkjjq0rylbkm-xihw-09783b91.png)

- Releasing IPs is desired when the number of “available” IP addresses is [more than (WARM_ENI_TARGET + 1) × (IPs per ENI)](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L1276) — e.g., if an ENI’s worth of IPs could be removed without falling below the target.
- However, releasing IPs can only happen [when there’s an **ENI with no assigned IPs**](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/datastore/data_store.go#L918-L921), because this configuration limits removal to happen only at the ENI level.
- Critically, IP assignment to Pods [randomly picks among all ENIs](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/datastore/data_store.go#L680) (because ENIs are [stored in a hashmap](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/datastore/data_store.go#L237-L238), and in Go, [hashmap iteration order is random](https://github.com/golang/go/blob/go1.24.3/src/runtime/map_noswiss.go#L912)!)

The target for available IPs means that _ipamd_ must allocate 50-100 IP addresses above what’s needed by Pods (50 IPs per ENI for the _m6id.metal_ instance type). Because we have a stable rate of incoming Pods in our cluster, the random distribution of Pods onto ENIs keeps all ENIs in use, once added _we never free IP addresses back to the subnet_.

We were surprised to find this, so [we have opened a PR to AWS CNI to improve ipamd’s behavior](https://github.com/aws/amazon-vpc-cni-k8s/pull/3300) under these circumstances.

As an example of just how severe this can be, consider a node that very occasionally peaks up to 400 active Pods, but normally has enough large workloads that it only has the CPU / memory capacity to support 200 active Pods. We might see a sequence of events such as the following:

1. A burst of Pod starts causes the node to have 400 active pods, with no available IPs left
2. _ipamd_ sees that the number of “available” IPs is [low](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L674-L679), and [allocates more](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L790) (with a new ENI) from the VPC subnet, aiming to always maintain at least 50 available (extra) IPs
3. As older Pods on the node are removed, their IP addresses are **kept in cooldown for 30s** before they can be reused – so IP addresses on the new ENIs must be used for new Pod starts during this period
4. After the load subsides, the random distribution of Pods onto ENIs results in a high probability of having at least one Pod per ENI, causing all 50 IPs per ENI to remain allocated to the node (remember: the **entire** ENI must be unused to remove any of the IPs.)
5. As a result: This node is left with 200 running pods but 450 allocated IPs!

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxfm2cccvl5u1qwj8mqihxzaxxuhztxoxwogxriue4slsfcucwcu6uwa8y6vn-vkms5atfswxdidvzhfko-suaub9djicyv97ejyrqnmadqxojlobtsaawhy2z0c-bo4g8ra4xg-edb91527.png)

This happened enough in practice that almost all the IP addresses in our VPC subnets were either assigned to Pods (~8.8k) or allocated to nodes with no remaining CPU/Memory capacity (~3.4k, including ENI device IPs). Once we ran out of IPs in the subnet, we were unable to start new compute Pods, which in turn meant that idle databases couldn’t be woken up.

That still leaves ~100 IP addresses in our subnets unaccounted for – we’re not certain why they weren’t allocated (and we are following up with AWS Support to understand why this was the case). However, an extra 100 IPs likely wouldn’t have helped much, since our cluster needed an additional ~3.4k IPs.

## 2025-05-16: WARM_IP_TARGET=1, Releasing IPs, IPs still not assignable

After our VPC subnets ran out of IP addresses, we looked to simultaneously unblock further compute Pod creation and fix our control plane’s [periodic job](https://neon.com/blog/delayed-start-compute-operations-triggering-event) so that old computes _were_ terminated.

To unblock compute Pod creation, we set [WARM_IP_TARGET=1](https://github.com/aws/amazon-vpc-cni-k8s/?tab=readme-ov-file#warm_ip_target). This had the immediate intended and expected effect – freeing allocated IP addresses from nodes that couldn’t use them, and allowing more Pods to start.

Once our control plane started successfully terminating idle Computes, we observed a significant drop in the rate of successful Pod starts. As we later found out, `WARM_IP_TARGET=1` unexpectedly _prevents_ new Pod starts for 30s after each Pod deletion.

### Background: What does WARM_IP_TARGET do?

Above, we described how `WARM_ENI_TARGET=<T>` works: _ipamd_ ensures that there are at least T _ENIs_ worth of extra IP addresses allocated to the node, only freeing them when an entire ENI is unused.

In contrast, when `WARM_IP_TARGET=<N>` is set, _ipamd_ attempts to maintain _exactly_ N extra IP addresses on the node. More IP addresses are allocated when fewer than N IPs are available Extra IP addresses are freed if there are more than N available.

If both `WARM_IP_TARGET` and `WARM_ENI_TARGET` are set, `WARM_IP_TARGET` takes precedence.

### Why set WARM_IP_TARGET=1?

During the incident, we observed that our VPC subnets were out of IP addresses with only 72% of those IPs actually assigned to Pods. We inferred that those unused IPs must have been allocated to nodes with no room to start new Pods and looked for a quick way to free them up.

Setting `WARM_IP_TARGET` appeared to be the most straightforward option.

At the time, we were operating AWS CNI with the default configuration options. During the incident, we misread the documentation, mistakenly believing that the default value for `WARM_IP_TARGET` was 5 when unset, leading us to decide to “reduce” it to one.

However, when this parameter is unset, AWS CNI actually bases its logic on `WARM_ENI_TARGET`, which has substantially different behaviour from using `WARM_IP_TARGET`. Unbeknownst to us, this had much larger implications than just reducing the value, many of which we didn’t understand until much later.

### What happened with WARM_IP_TARGET=1?

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxfmxovy3mcjxhcopp1jdqvzpo1vt725ukl3b9akwltsr-jvf6mpaplmdtgki1o33va4hhyiunfnbeze0omhb6hybt7qwp1wc8zcentcwg5vangavk8hjlg4qbppjiogkwo-5fh-8b0bffbe.png)

The immediate effects _were_ as we expected: Thousands of IP addresses were returned to the VPC subnets from nodes that couldn’t use them, and subsequently allocated by nodes with CPU / memory capacity to start Pods. New Pods started on these nodes, and when we eventually hit ~10k concurrent Pods, our rate of starts slowed again due to limits we’d previously identified in load testing (e.g. kube_proxy sync latency).

Soon after, we stabilized our Control Plane’s failing job and ~7k idle computes were terminated. However, the rate of successful Pod starts remained far below the pre-incident baseline.

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxe0fgvzfgyr9k-mvgy7q0m75-n80wylnb8sjegwg0joj5rzsiz7jl8khwyxyuwdb40nfnc3cmjddkildvwlwkessoul-yjztny6khss-l2zf122ocoz2zdag8rlbmdkscpni4c2a-1c69e81c.png)

Investigation at the time showed that most of our new Pods were failing to start due to IP assignment issues — even though VPC subnet metrics confirmed that there were thousands of **unallocated** IP addresses that should have been available.

At the time, we couldn’t figure out why IP allocation was failing. The AWS CNI documentation mentioned that [WARM_IP_TARGET can trigger rate-limiting on EC2 API requests](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/docs/eni-and-ip-target.md?plain=1#L48-L50), however, this is not a problem we expected with only 1-2 Pod starts **per node, per minute**. Shouldn’t _ipamd_ be able to request more than that?

We spent much of the time following this incident digging through [AWS CNI’s source code](https://github.com/aws/amazon-vpc-cni-k8s/) to understand its behaviour, cross-referencing with metrics and logs we’d captured from the time of the incident.

### Why did WARM_IP_TARGET=1 prevent Pods from starting?

Broadly, AWS CNI has two methods of operation, depending on whether WARM_IP_TARGET and/or MINIMUM_IP_TARGET are specified (internally referred to as the [“warm target” being “defined”](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L1685-L1688)).

We described the default above – if there _isn’t_ a warm target, ipamd relies on `WARM_ENI_TARGET`’s value to determine how many IPs to allocate. But with `WARM_IP_TARGET` set, ipamd has the following behavior:

- When the number of unused IP addresses is [less than the warm target](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L2165-L2168), more IPs are allocated from the VPC subnet until there are `WARM_IP_TARGET` available IPs [[1](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L1829), [2](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L921), [3](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L930-L931)] (automatically adding ENIs as needed).
- If the number of unused IP addresses is [more than the warm target](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L2189-L2192), unassigned IPs are returned to the VPC subnet (subject to [rate limiting](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/ipamd.go#L694-L699)).
- As with other configurations, IP addresses go into “cooldown” for [30 seconds](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/datastore/data_store.go#L224-L230) after being unassigned, during which they [cannot be reused](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/datastore/data_store.go#L1321).
- Crucially, and perhaps unexpectedly, **IP addresses in cooldown** [count towards the warm target](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/pkg/ipamd/datastore/data_store.go#L787-L789).

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxeyuswvd48341kg0eimyfrdz2jhxrxo7omsbjjaeacnjz9do26fgz4rtonmyk15nqemg97n7r4scq4dat8m-iqlh-m3cyksgag697ukapp4g0ffkjvcntwhdehoqbdjnczcdbm-66227fda.png)

This combination of factors means that **setting `WARM_IP_TARGET=1` _can prevent all Pod starts on a node for 30 seconds after each Pod removal_ **, because _ipamd_ will ensure that there’s exactly one “available” IP address (even if that IP address can’t be assigned due to the 30-second cooldown period).

That’s why we only saw this problem _after_ our control plane started terminating idle computes. When no Pods are removed, _ipamd_ can sustain a high rate of Pod starts, in spite of the small warm IP target. Deleting Pods, however, can simultaneously prevent assigning existing allocated IPs while _also_ preventing _ipamd_ from allocating more (because `WARM_IP_TARGET=1` is guaranteed to be satisfied while any IP address is in cooldown).

To make matters worse, our control plane retries compute creation if it doesn’t succeed within the timeout window (currently 2 minutes). Combined with our preexisting long Pod startup times, these retries exacerbated the problem as many of the successful Pod starts were deleted shortly before the rest of setup could continue – each time resetting the 30 second countdown to being able to start more Pods.

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxdprcahf5w-t2kxprrpxlcy-ktvpeh5bstij3knzfwdqu1hyupbuxutdbd4vxvub-d1w8bixlcedjlsjh-gggeuefo1clb9xn9izlbvtre2gilv3afjzm29hxyh3vrvvboxyip-9790ca82.png)

### Back to the incident: What did we do at the time?

At the time, we didn’t understand why our rate of successful Pod starts was so low.

We thought that it was _theoretically_ possible that there were still unused IP addresses somewhere, or maybe `WARM_IP_TARGET=1` was misbehaving. So in a last-ditch effort to free up any other allocated IP addresses, we reduced `WARM_IP_TARGET` even further, **to zero**, also setting `MINIMUM_IP_TARGET=0` and `WARM_ENI_TARGET=0`. This helped!

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxf236eosv-selgkriwz1ihjmbrs5dc943rq0asgh7ctr12imyuwuiet4-vs9mukqoq3li5b7rawv8nzfo80hxl3yuntezhmzjmj6rcdf6tdkniqt72c9pewoqjhljqhervx9-sg-23da9533.png)

Unbeknownst to us at the time, setting `WARM_IP_TARGET` to zero is _equivalent to disabling it_, resulting in _ipamd_ using the `WARM_ENI_TARGET` logic.

There were **two key side effects** of this configuration:

1. Similarly to before the incident, _ipamd_ effectively stopped returning IP addresses to the subnet
2. New IP allocations from the subnet attempted to reserve as many IPs as could fit on the ENI (instead of one IP at a time)

Together, these resulted in enough IP addresses being allocated to the nodes, allowing the cluster to stabilize. The average number of allocated IP addresses on each node increased from ~75 per node to ~250, and our rate of successful Pod starts returned to normal.

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxei8hmsya4n-ciwutsggpzkyku7d04kfzkpxouyct5l15-r52-mnvme9rs1sn9wg4zpcbvtrfhroefwbtrh2p5aew-h3awbofeiochynmrqkdwyddo3ctbnnuyyvufaxlxrg1yq-cc755912.png)

We continued to monitor the cluster over the weekend and observed a stable state until the following Monday.

## 2025-05-19: AWS CNI config change goes wrong, reverting doesn’t help

**The following Monday**, as an incident follow-up, we decided to revert the final change to our AWS CNI configuration. We believed that the state of our _us-east-1_ cluster after Friday’s incident was not stable, and thought that switching back to `WARM_IP_TARGET=1` would help.

At the time, we were concerned that AWS CNI’s behavior with `WARM_IP_TARGET=0` was unspecified, and believed that `WARM_IP_TARGET=1` would be more stable.

Rolling out `WARM_IP_TARGET=1` triggered the same behavior where deleting Pods interfered with our ability to start new ones. Upon observing the same conditions, we then undid that change back to `WARM_IP_TARGET=0`. However, IP assignment errors continued.

We compensated for high error rates by increasing the size of our [pre-created compute pools](https://neon.com/blog/cold-starts-just-got-hot). The IP assignment errors continued for hours afterwards, until a 86-second window where our control plane didn’t stop any Pods, allowing more IPs to be allocated and resolving the errors.

### Why set WARM_IP_TARGET=1 again?

As is often the case, we knew much less then than we do now.

We were becoming less certain about the behavior of `WARM_IP_TARGET=0`. [In one place](https://github.com/aws/amazon-vpc-cni-k8s/blob/v1.18.6/README.md?plain=1#L301-L303), the documentation said that zero was equivalent to “_not setting the variable_”, but that the default was “_None_”, leaving us uncertain about the actual behavior with that configuration. If zero were the default, that would have been the same configuration that originally caused us to run out of IP addresses.

We also suspected that Friday’s IP assignment issues may have been resolved by coincidence and not by setting `WARM_IP_TARGET=0`. For example, we saw temporary improvements every time we restarted the `aws-node` DaemonSet (which reinitializes _ipamd_) — the symptoms could have been resolved by the final restart.

Remembering that setting `WARM_IP_TARGET=1` had initially helped on Friday, we believed that it was likely to be more stable than the unknown situation we found ourselves in.

This was a mistake at the time. Further, reverting back to `WARM_IP_TARGET=0` was not sufficient to recover from the resulting degraded state.

### What happened with WARM_IP_TARGET=1 this time?

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxdoxknbh7spojjuccfhbadtbv9nwznfxb7jzsrqifhnn4nv3fuqhgcqiqwy3vjpze8cyzsu8rwe2yi16quywvtfqvj1o2sdyuzlki3hyadndxe7hvpj3djsajyujpphxfiatg-3e5cb270.png)

IP assignment immediately started failing, and with it, our rate of successful Pod starts dropped to the same level as it was with `WARM_IP_TARGET=1` on Friday.

This was unexpected. At the time, we thought Friday’s IP assignment errors were due to the cluster being left in a bad state after our VPC subnets ran out of IP addresses. Here, the errors started from a stable state — clearly inconsistent with our understanding.

Aiming to avoid further outages, we wanted to be sure of any additional configuration changes. We took some time to examine _ipamd_ logs and eventually determined that there were likely specific issues with `WARM_IP_TARGET=1`.

We reverted back to `WARM_IP_TARGET=0`, but continued to see IP assignment errors.

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxdycmgpejwlzxjbnfl7lucloaacuvb7gozbop3wkudndoq7ya7wwrxjsaomspvx20n41ymfx8cdsio9ybkwy-twptkk2n08kylqbmivvigyaudthpsp2srgad4dcxwnormtxuw-c27ccf49.png)

### Why didn’t reverting fix the issue?

It was very unexpected that issues persisted after reverting WARM_IP_TARGET back to 0. This was the healthy state through the weekend, so why didn’t it work now!?

The rate of errors _had_ decreased enough for more Pods to get through, but the overall success rate was far below expectations:

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxdqzaru4tn9p327yrzhnhixwpia8erresdvmixvh6mjimggbaxufh8p3ilepcteigj0aql4yuhvf5bzu0n04gwqfuqugrmcwnuznrysmmemu-aixbqipo6gyfpsq1gg6nz762q-4cb88c32.png)

In our investigation over the following weeks, we attained a deeper understanding of the AWS CNI codebase.

When `WARM_IP_TARGET=0` and `MINIMUM_IP_TARGET=0`, AWS CNI uses the behavior for `WARM_ENI_TARGET` — even though we had `WARM_ENI_TARGET=0` as well.

Under these conditions, ipamd will only allocate more IP addresses to the node [if there are **no available IP addresses**](https://github.com/aws/amazon-vpc-cni-k8s/blob/0d02624a2d97e65ebde0977f608cb129184f9cb5/pkg/ipamd/ipamd.go#L2179). Together with our finding that IP addresses in cooldown are counted towards the number of available addresses.

This means that these settings only allow allocating more IP addresses if:

1. All of the IP addresses on the node are assigned to Pods; **and**
2. No Pods on the node were removed in the last 30 seconds

Setting `WARM_IP_TARGET=1` released many of the IP addresses on our nodes. Setting it back to zero while we continued to have high Pod churn meant that _ipamd_ never saw the necessary conditions to reallocate those IP addresses. This only happened because we had also set `WARM_ENI_TARGET=0`.

### What did we do to work around errors in the meantime?

Internally, our control plane maintains a pool of “warm” Compute pods, so that [Pod starts are not on the hot path](https://neon.com/blog/cold-starts-just-got-hot) for waking an idle database.

We were only seeing ~10% of Pods failing to start, so we were able to compensate for failures by increasing the size of the pool.

This mitigated the user impact as errors continued behind the scenes.

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxchxzeycqqjnshtpy6p0ohxffjajplesxgiofhlnwiagdyox8f6frngm-5nul5xjswbvwjxt05yzlopjnvegkb6xadgxcmhd4p-hohp38te62rp1pp6ujvxfuvbipv-phxabf-96638155.png)

### What eventually caused the errors to stop?

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxeseajhnylpn2lqmo0ur3rbflhlizqotdc6ujvi7jn5vqdkky-ciaz5oqlt3jvcrm8lomgvyfftfkxho-pcbp6bs6zdi0g-aqswbq6ktfvzdcjwrxw55c6n5mgij-ewnncbgg-b8e1c626.png)

Many hours after we’d mitigated user impact, we saw the IP assignment errors suddenly drop to near-zero.

We weren’t sure why at the time, but in the course of our deeper investigation, we found that this recovery was ironically due to the same issue that initially triggered Friday’s incident: Our control plane stopped shutting down idle computes for 86 seconds, due to an expensive query to the backing Postgres database. (We wrote more about this query and our changes to improve its execution plan in [this related blog post](https://neon.com/blog/delayed-start-compute-operations-triggering-event).)

![](https://cdn.neonapi.io/public/images/pages/blog/aws-cni-lessons-from-a-production-outage/ad4nxcy4anh3xrndfndjlyf7hvcpmeedzk4ncdnazuztgtdrz8expod3au61-fhknqj53fxtvjhglhieegjnj1b68sr9bsmgt9rxj2vfndkjvummreklqdx59uhjncgevqxbklbapg-80a74bd5.png)

This brief gap with no Pod deletions meant there were no IP addresses in cooldown, so further compute starts allowed _ipamd_’s conditions for allocating more IP addresses to be satisfied. And indeed, there were simultaneous allocations across the cluster, which in turn reduced the Pod start failure rate.

## Final thoughts

This incident resulted in significant downtime for our customers and we were determined to understand the conditions that led to it, so we can prevent it – and incidents like it – from happening again.

Throughout this investigation our team learned a lot about AWS CNI internals, and we’ve even submitted a pull request to help improve the behavior for others.

In keeping with our philosophy of learning from incidents, we decided to make the investigation public. We hope that other teams can benefit from what we’ve learned, helping us all move towards a more reliable future.
