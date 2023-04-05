---
title: Autoscaling
subtitle: Learn how Neon automatically and transparently scales compute on demand
enableTableOfContents: true
---

A Beta version of Neon's _Autoscaling_ feature is now available for [paid plan](https://neon.tech/docs/introduction/billing#neon-plans) users in selected regions. The Autoscaling feature dynamically adjusts the allocation of vCPU and RAM for a Neon compute endpoint in response to the current load, eliminating the need for manual intervention.

## Benefits of Autoscaling

Autoscaling provides adaptability to fluctuating and unforeseen workloads, making it particularly beneficial for workloads that experience variations over time, such as e-commerce sites with region-specific or daily and weekly changes in demand. This feature allows for efficient handling of these fluctuations. Enhanced scalability is another benefit, as autoscaling permits applications to accommodate a substantial volume of requests and adapt to rapid traffic growth without necessitating manual intervention. Autoscaling also saves time in database management, enabling developers to allocate more time to enhancing features and refining their applications.

A crucial aspect of Autoscaling is its ability to scale without restarting the application, which is an advantageous feature in itself. Autoscaling streamlines management by minimizing the need for manual intervention, simplifying the maintenance and monitoring process for development teams. Cost effectiveness is another advantage, as autoscaling optimizes resource utilization, ensuring that organizations pay only for the resources they genuinely require, rather than over-provisioning for peak loads. Finally, autoscaling operates within a predefined range of vCPU and RAM, providing reassurance that your compute resources do not scale indefinitely.

## How to enable Autoscaling

The Autoscaling feature can be enabled when creating a Neon project. For existing projects, you can enable Autoscaling by editing a compute endpoint. For instructions, see:

- [Create a project](/docs/manage/projects#create-a-project)
- [Edit a compute endpoint](/docs/manage/endpoints#edit-a-compute-endpoint)

## How Autoscaling works

In order to understand the functionality of Autoscaling, it is essential to start with a high-level view and then proceed to examine the specific components that make up the autoscaling system.

At a high level, a Neon project can have one or more computes, each representing an individual PostgreSQL instance. Storage is decoupled from these computes, meaning that the PostgreSQL servers executing queries are physically separate from the data storage location. This separation offers numerous advantages and is crucial for autoscaling.

![High-level architecture diagram](/docs/introduction/autoscale-high-level-architecture.webp)

Focusing more closely, each PostgreSQL instance operates within its own virtual machine inside a [Kubernetes cluster](/docs/reference/glossary#kubernetes-cluster), with multiple VMs hosted on each node of the cluster. Fundamentally, autoscaling is implemented by allocating and deallocating vCPU and RAM to each VM, with only a few PostgreSQL-specific considerations involved.

![Autoscaling diagram](/docs/introduction/autoscale-architecture.webp)

### Autoscaling agent

Each Kubernetes node hosts a single instance of the autoscaler-agent, which serves as the control mechanism for the autoscaling system. The agent collects metrics from the VMs on its node, makes scaling decisions, and performs the necessary checks and requests to implement those decisions.

While the program may appear simple at first glance—merely collecting metrics and determining the appropriate number of compute units for a VM—the system's complexity arises from the need to gracefully handle various challenging situations. Examples of such circumstances include:

Unfortunately though, what makes the system complex is that it needs to gracefully handle a variety of “annoying” circumstances – things like:

- How to manage upscaling when all resources are allocated
- What actions to take if PostgreSQL begins using memory too rapidly for the metrics collection to detect in time

A primary concern is ensuring that resources are not overcommitted. Overcommitting CPU resources may be acceptable; however, if more memory is allocated than is available, Kubernetes will terminate VMs. This is generally undesirable, as PostgreSQL connections are stateful, and recovery is not a simple process if a VM is terminated. To avoid this situation, the autoscaler-agent must be made aware of the resource usage on each node.

However, potential conflicts may arise if the [Kubernetes scheduler](/docs/reference/glossary#kubernetes-scheduler) assigns tasks to a node simultaneously with the autoscaler-agent, which could lead to overcommitting resources. To resolve this issue, the scheduler is modified to enable coordination with the autoscaler-agent.

Neon treats the Kubernetes' scheduler as the single source of truth for resource allocation. The autoscaler-agent must obtain approval for all upscaling from the scheduler. With the scheduler maintaining a global view of all resource usage changes and requiring pre-approval for any additional resource usage (either via the autoscaler-agent or standard scheduling), it assumes responsibility for preventing overcommitting. In the rare event that a node exhausts its resources, new pods will not be scheduled on that node, and the autoscaler-agent will be denied permission to allocate more resources for its VMs.

### Handling VMs with NeonVM

Kubernetes does not inherently support the creation or management of VMs. To address this limitation, Neon uses a tool called [NeonVM](/docs/reference/glossary#neonvm). Similar to other VMs-in-Kubernetes projects, NeonVM offers a custom resource definition and controller for VMs, handling more intricate tasks related to VMs, such as adding or removing CPUs and memory. Internally, NeonVM utilizes [QEMU](/docs/reference/glossary#qemu) and [KVM](/docs/reference/glossary#kvm) (when available) to achieve near-native performance.

Consequently, when the autoscaler-agent needs to modify a VM's resource allocation, it simply updates the corresponding NeonVM object in Kubernetes. The VM controller then manages the rest of the process.

### Live migration

Despite the measures described thus far, it remains feasible for a Kubernetes node to become saturated. Under such circumstances, accommodating scaling requests would be impossible until other VMs scaled down. This outcome is undesirable, necessitating an alternative solution, which NeonVM fortunately provides.

QEMU, among other hypervisors, offers the capability to [live migrate](/docs/reference/glossary#live-migration) a VM, enabling the transfer of an entire VM from one machine to another with minimal interruptions (typically around 100ms). In essence, live migration transmits the internal state of the original VM to a new one while the former continues to operate, swiftly transitioning to the new VM once little data remains to be copied. From within the VM, the only indication that a migration occurred might be a minor performance reduction. Importantly, the VM retains its IP address, ensuring that connections are preserved and queries remain uninterrupted.

NeonVM manages this entire process, allowing for the proactive reduction of node load by migrating VMs away before reaching capacity. Although it is still possible for the node to fill up in the interim, the separation of storage and compute implies that the VMs typically have minimal disk usage, resulting in faster migrations. Without this feature, network bandwidth limitations could significantly hinder the process of creating space for new VMs.

### Memory scaling

Memory management presents additional challenges, as it is slightly more complex to handle than CPU usage. When a VM experiences a sudden spike in CPU usage, the worst-case scenario typically involves increased query latencies. However, a sudden increase in memory usage might result in PostgreSQL being terminated by the Linux kernel due to memory exhaustion, causing an abrupt termination of all ongoing queries.

Memory consumption can escalate rapidly. Relying solely on the autoscaler-agent's infrequent metrics collection might not effectively address certain load patterns. Ideally, the system should be able to detect memory usage increases without the need for constant metrics requests to the VM.

[cgroups](/docs/reference/glossary#cgroup) offer a solution to this issue by enabling notifications when memory usage crosses a specified threshold. Running Postgres within a cgroup inside the VM allows for the receipt of such notifications. This requires an additional program within the VM, so the [vm-informant](/docs/reference/glossary#vm-informant) is executed alongside Postgres to both (a) request more resources from the autoscaler-agent when Postgres consumes too much memory, and (b) verify that proposed downscaling from the autoscaler-agent will leave sufficient memory.

When the cgroup `memory.high` signal is activated, the vm-informant temporarily freezes the cgroup (halting Postgres) to prevent further allocations and requests additional memory from the autoscaler-agent. The autoscaler-agent then seeks memory from the scheduler and NeonVM. If memory is allocated swiftly, the cgroup is unfrozen, allowing Postgres to resume execution. The vm-informant will also lift the freeze after a brief timeout (currently 20ms) if memory was not made available in time. Any duration spent waiting while the Postgres cgroup is frozen will introduce latency to ongoing and future queries.

### Local File Cache

As a final enhancement to expedite queries, a Postgres extension has been incorporated to introduce a cache in front of the storage layer. 
Numerous queries can substantially benefit from increased memory, particularly those necessitating multiple database scans (such as creating an index). The [local file cache](/docs/reference/glossary#local-file-cache) capitalizes on any additional memory allocated to the VM by dedicating a portion of it to the cache. The cache is stored in a single file within a [tmpfs](/docs/reference/glossary#tmpfs) to minimize disk usage, with entries maintained as 1 MB chunks and evicted using a [Least Recently Used (LRU) policy](/docs/reference/glossary#lru-policy). Due to the storage model, writebacks are not required, resulting in near-instant evictions.

Additionally, the vm-informant adjusts the file cache size when scaling occurs through the autoscaler-agent, ensuring seamless operation.

## Conclusion

This topic has covered the fundamentals of autoscaling, its advantages, and the technical specifics of Neon's implementation.

To further explore Neon's autoscaling implementation, visit the [Autoscaling GitHub repository](https://github.com/neondatabase/autoscaling). While not primarily designed for external use, Neon welcomes exploration and contributions.
