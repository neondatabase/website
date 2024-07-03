---
title: Scale your AI application with Neon
subtitle: Learn how to scale your AI application with Neon's Autoscaling and Read Replica features
enableTableOfContents: true
updatedOn: '2024-01-10T18:34:05.849Z'
---

With Neon and `pgvector`, you scale your AL application in the same way that you scale any Postgres app: Vertically with added CPU, RAM, and storage, or horizontally with read replicas.

## Verticle scaling

You can scale vertically by increasing memory, CPU, and storage. 

Neon supports compute sizes ranging from .025 vCPU with 1 GB RAM up to 8 vCPU with 32 GB RAM:

   | Compute Units (CU) | vCPU | RAM   | maintenance_work_mem |
   | ------------------ | ---- | ----- | -------------------- |
   | 0.25               | 0.25 | 1 GB  | 64 MB                |
   | 0.50               | 0.50 | 2 GB  | 64 MB                |
   | 1                  | 1    | 4 GB  | 67 MB                |
   | 2                  | 2    | 8 GB  | 134 MB               |
   | 3                  | 3    | 12 GB | 201 MB               |
   | 4                  | 4    | 16 GB | 268 MB               |
   | 5                  | 5    | 20 GB | 335 MB               |
   | 6                  | 6    | 24 GB | 402 MB               |
   | 7                  | 7    | 28 GB | 470 MB               |
   | 8                  | 8    | 32 GB | 537 MB               |

In Neon, scaling vertically is a matter of selecting the desired compute size. See [Edit a compute endpoint](/docs/manage/endpoints#edit-a-compute-endpoint) for instructions. Available compute sizes differ according to your Neon plan. The Neon Free Tier supports computes with 0.25 vCPU and 1 GB RAM. The Launch plan offers compute sizes up to 4 vCPU with 16 GB RAM. Larger computes are available on the Scale plan. See [Neon plans](/docs/introduction/plans).

To optimize `pgvector` index build time, you can increase the `maintenance_work_mem` setting for the current session beyond the preconfigured default shown in the table above with a command similar to the following:

```sql
SET maintenance_work_mem='10 GB';
```

The recommended setting is your working set size (the size of your tuples for vector index creation). However, your `maintenance_work_mem` setting should not exceed 50 to 60 percent of your compute's available RAM (see the table above). For example, the `maintenance_work_mem='10 GB'` setting shown above has been successfully tested on a 7 CU compute, which has 28 GB of RAM, as 10 GiB is less than 50% of the RAM available for that compute size.

### Autoscaling

In addition, you can also enable Neon's autoscaling feature for automatic scaling of comopute resources (vCPU and RAM). Neon's _Autoscaling_ feature automatically scales up compute on demand in response to application workload and down to zero on inactivity, and you are only charged for the compute resources you use.

For example, if your AI application experiences heavy load during certain hours of the day or at different times throughout the week, month, or calendar year, Neon automatically scales compute resources without manual intervention according to the compute size boundaries that you configure. This enables you to handle peak demand while avoiding paying for compute resources during periods of low activity.

Enabling autoscaling is also recommended for initial data loads and memory-intensive index builds to ensure that you have sufficient compute resources for this phase of your AI application setup.

To learn more about Neon's Autoscaling feature and how to enable it, refer to our [Autoscaling guide](/docs/introduction/autoscaling).

### Storage

Neon's data storage allowances differ by plan. See [Neon plans](/docs/introduction/plans).

## Horizontal scaling

Horizontal scaling is supported by Neon's read replica feature.

### Read replicas

Neon supports read replicas, which are independent read-only compute instances designed to perform read operations on the same data as your read-write computes. Read replicas do not replicate data across database instances. Instead, read requests are directed to a single source. This architecture enables read replicas to be created instantly, and because data is read from a single source, there are additional storage costs.

Since vector similarity search is a read-only workload, you can leverage read replicas to offload reads from your read-write compute instance to a dedicated compute when deploying AI applications. After you create a read replica, you can simply swap out your current Neon connecting string for the read replica connection string, which makes deploying a read replica for your AI application very simple.

Neon's Read replicas support the same compute sizes outlined above. You can also enable autoscaling for read replica computes.

To learn more about the Neon read replica feature, see [Read replicas](/docs/introduction/read-replicas) and refer to our [Working with Neon read replicas](/docs/guides/read-replica-guide) guide.


