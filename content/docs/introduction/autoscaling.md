---
title: Autoscaling
subtitle: Learn how Neon automatically and transparently scales compute on demand
enableTableOfContents: true
---

Autoscaling is the process of automatically increasing or decreasing the CPU and memory allocated to a Neon compute based on its current load without requiring manual intervention.

## Benefits of Autoscaling

- Accommodate varying and unexpected workloads: Many workloads, such as e-commerce sites with differing loads across regions or daily and weekly fluctuations, vary over time. Autoscaling helps handle these variations efficiently.
- Highly scalable: Autoscaling enables applications to seamlessly handle a large number of requests and adapt to rapid growth in traffic without manual intervention.
- Save time: Managing your database can be time-consuming. Autoscaling frees up your time to add features and improve your application.
- Scale without restarting: Autoscaling requires the ability to scale without restarting, which is a valuable feature in itself.
- Simplified management: Autoscaling reduces the need for manual intervention making it easier for teams to maintain and monitor their applications.
- Cost efficiency: Autoscaling optimizes resource usage, meaning you only pay for the resources you actually need rather than over-provisioning for peak loads.
- Autoscaling operates within a range of compute units, so you can sleep soundly knowing that your endpoint won’t scale to infinity.

## How it works

To understand how autoscaling works, we’ll start from a high-level overview of Neon’s architecture and zoom into the particular components that make up the autoscaling system.

![High-level architecture diagram](/docs/introduction/autoscale-high-level-architecture.webp)

At a very high level, Neon runs many compute endpoints, which are each individual Postgres instances. The storage is decoupled from the endpoints, meaning that the Postgres servers running queries are physically separate from where the data is stored. This separation provides many benefits – and it is also important for autoscaling. (See also: [Heikki’s blog post about Neon’s architecture](https://neon.tech/blog/architecture-decisions-in-neon), which goes into more depth on this subject.)

Zooming in a little, each Postgres instance is running in its own VM1 in some Kubernetes cluster, with each node in the Kubernetes cluster hosting many VMs. At its core, we implement autoscaling by allocating (and removing) CPUs and memory from each VM — there’s only a couple Postgres-specific considerations.

![Autoscaling diagram](/docs/introduction/autoscale-architecture.webp)

At a very high level, Neon runs many compute endpoints, which are each individual Postgres instances. The storage is decoupled from the endpoints, meaning that the Postgres servers running queries are physically separate from where the data is stored. This separation provides many benefits – and it is also important for autoscaling. (See also: [Heikki’s blog post about Neon’s architecture](https://neon.tech/blog/architecture-decisions-in-neon), which goes into more depth on this subject.)

Zooming in a little, each Postgres instance is running in its own VM1 in some Kubernetes cluster, with each node in the Kubernetes cluster hosting many VMs. At its core, we implement autoscaling by allocating (and removing) CPUs and memory from each VM — there’s only a couple Postgres-specific considerations.

## Autoscaling agent

Each Kubernetes node has a single instance of the autoscaler-agent, a program that is basically the brains of the autoscaling system. It collects metrics from the VMs on its node (currently: 1-minute and 5-minute load average), makes scaling decisions (e.g. “increase to 4 CPUs and 16GB memory”), and does the necessary checks and requests to make that happen.

When described like this, this program can sound rather simple — just collect some metrics and maybe figure out how many compute units the VM should have, right? This is actually mostly correct! The logic at the core of the autoscaler-agent is relatively simple.

Unfortunately though, what makes the system complex is that it needs to gracefully handle a variety of “annoying” circumstances – things like:

- What happens when all the resources are allocated but we still need to upscale some VM?
- What if Postgres starts using memory really quickly – too fast for our metrics collection to notice in time?

Our first area of particular concern is around making sure that we don’t overcommit resources. We could get away with it for CPU2, but if we try to allocate more memory than is actually available, Kubernetes will start killing our VMs. This is generally a Bad Thing™ — Postgres connections are stateful, so we can’t just pick up the pieces if the VM gets killed. So how do we avoid this?

We could make the autoscaler-agent aware of the resource usage on each node. However, there’s always the possibility that the Kubernetes scheduler (which is responsible for picking which nodes to run something on) will add something to a node at the same time as the autoscaler-agent upscales, leading to overcommitting3.

Instead, we modify the scheduler so that each autoscaler-agent can coordinate with it.

Kubernetes’ scheduler provides a [rich set of plugin APIs](https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/), so we treat the scheduler as a single source of truth for resource allocation and require that the autoscaler-agent gets all upscaling approved by the scheduler. The scheduler has a global view of all changes in resource usage and all additional resource usage requires its pre-approval (either via autoscaler-agent or normal scheduling), so it’s responsible for preventing overcommitting. If a node ever runs out of resources (which should be rare, but more on that later!), new pods won’t be scheduled there, and the autoscaler-agent won’t be allowed to allocate more resources for its VMs.

## Handling VMs with NeonVM

So far, we’ve sort of been hand-waving away the interactions with VMs. Unfortunately, however, Kubernetes does not natively support creating or interacting with VMs, so we developed a tool for it — [NeonVM](https://github.com/neondatabase/autoscaling/tree/main/neonvm). Like other VMs-in-Kubernetes projects, NeonVM provides a custom resource definition and controller for VMs. It handles many of the more complex tasks relating to VMs, like adding/removing CPUs and memory. NeonVM uses QEMU and KVM (if available) internally, which allows it to achieve near-native performance.

What all this means is that when the autoscaler-agent needs to change a VM’s resource allocation, it just updates the appropriate NeonVM object in Kubernetes, and the VM controller takes care of the rest.

## Live migration

Even with everything we’ve mentioned so far, it’s still possible for a Kubernetes node to fill up! If that happened, we wouldn’t be able to accommodate scaling requests until other VMs scaled down. This sort of behavior isn’t acceptable, so we need a workaround… Thankfully NeonVM provides a way to help here as well!

QEMU (among other hypervisors) provides the ability to “live migrate” a VM ­— to move the entire VM from one machine to another with only minimal pauses (typically around 100ms). At a high level, live migration transfers the internal state of the original VM to a new one while the old one is still running4, performing a quick switchover to the new VM once there’s not much left to copy. Inside the VM, the only signs that a migration ever happened might be a slight performance dip — so because the VM keeps its IP address, all the connections are preserved and queries aren’t interrupted!

NeonVM handles all of this process for us, which allows us to preemptively reduce the load on a node by migrating VMs away before it gets full. And of course, it’s still possible to fill up the node in the meantime, but our separation of storage and compute means that the VMs typically have little disk usage, so migrations tend to be quick. Otherwise, we might be seriously limited by network bandwidth when trying to make room for new VMs.

## Memory scaling

There’s some additional considerations with memory that make it just a bit trickier to handle. When a VM has a sudden spike in CPU usage, the worst-case scenario is that there’s some added latencies in the queries. But when there’s a sudden spike in memory usage, Postgres might be OOM killed (killed by the Linux kernel because the VM ran out of memory), which will unexpectedly terminate all ongoing queries.

There’s almost no limit on how fast memory can be used up (and sometimes you do have to let Postgres OOM), but if the autoscaler-agent is only fetching metrics every few seconds or so, there’s plenty of load patterns we wouldn’t respond well to. Unfortunately, though, we don’t want to be spamming the VM with metrics requests to maybe catch some sudden increase in memory — ideally, we’d like to get notified when memory’s increased.

And it turns out that cgroups provide a clean way to do this! By running Postgres inside a cgroup inside its VM5, we can receive notifications when its memory usage crosses above a certain threshold. This requires a program inside the VM, so we run the vm-informant alongside Postgres, which is responsible for both (a) requesting more resources from the autoscaler-agent when Postgres starts to use too much, and (b) validating that proposed downscaling from the autoscaler-agent will leave enough memory.

When the cgroup memory.high signal is triggered, the vm-informant freezes the cgroup (temporarily stopping Postgres) to prevent further allocations and requests for more memory from the autoscaler-agent. The autoscaler-agent in turn, requests memory from the scheduler and NeonVM. If the memory is added quickly, the cgroup is unfrozen, resuming Postgres’ execution. The vm-informant will also thaw the cgroup after a short timeout (at the time of writing, 20ms) if the memory wasn’t available in time — any time spent waiting while Postgres’ cgroup is frozen will add latency to ongoing and future queries.

## Local File Cache

As a final touch to speed up queries, we’ve also added a Postgres extension that adds a cache in front of our storage layer. One of the distinct difficulties with separated storage and compute is that there will always be some delay in getting the data from the “storage” side to the “compute” side. We’ve been hard at work minimizing the impact of this, and the local file cache is yet another step in this direction.

Many queries can significantly benefit from additional memory6 — particularly those that require scanning the database multiple times (like creating an index). The local file cache allows us to make use of additional memory when it’s added to the VM by allocating some of it to the cache. The cache is stored in a single file, in a tmpfs (for now) to reduce disk usage, with entries stored as 1MB chunks and evicted with a LRU policy7. Thanks to our storage model, we don’t have to perform writebacks, so evictions are about instant.

And, of course, the vm-informant resizes the file cache when scaling by the autoscaler-agent happens, so this all happens seamlessly.

## Conclusion

In this topic, you have learned the basics of autoscaling, its benefits, and the technical details of its implementation here at Neon.

If you want to learn more about our autoscaling implementation, check out the [Autoscaling GitHub repo](https://github.com/neondatabase/autoscaling). Autoscaling is not fully designed for external use, but you are welcome to explore and contribute.
