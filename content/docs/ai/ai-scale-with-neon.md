---
title: Scale your AI application with Neon
subtitle: Scale your AI application with Neon's Autoscaling and Read Replica features
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.940Z'
---

You can scale your AI application built on Postgres with `pgvector` in the same way you would any Postgres app: Vertically with added CPU, RAM, and storage, or horizontally with read replicas.

In Neon, scaling vertically is a matter of selecting the desired compute size. Neon supports compute sizes ranging from .025 vCPU with 1 GB RAM up to 10 vCPU with 40 GB RAM.

| Compute Units (CU) | vCPU | RAM   | maintenance_work_mem |
| :----------------- | :--- | :---- | :------------------- |
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
| 9                  | 9    | 36 GB | 604 MB               |
| 10                 | 10   | 40 GB | 671 MB               |

See [Edit a compute](/docs/manage/endpoints#edit-a-compute) to learn how to configure your compute size. Available compute sizes differ according to your Neon plan. The Neon Free Plan supports computes starting at 0.25 CU, up to 2 CU with autoscaling enabled. The Launch plan offers compute sizes up to 4 CU. Larger computes are available on the Scale plan. See [Neon plans](/docs/introduction/plans).

To optimize `pgvector` index build time, you can increase the `maintenance_work_mem` setting for the current session beyond the preconfigured default shown in the table above with a command similar to this:

```sql
SET maintenance_work_mem='10 GB';
```

The recommended `maintenance_work_mem` setting is your working set size (the size of your tuples for vector index creation). However, your `maintenance_work_mem` setting should not exceed 50 to 60 percent of your compute's available RAM (see the table above). For example, the `maintenance_work_mem='10 GB'` setting shown above has been successfully tested on a 7 CU compute, which has 28 GB of RAM, as 10 GiB is less than 50% of the RAM available for that compute size.

## Autoscaling

You can also enable Neon's autoscaling feature for automatic scaling of compute resources (vCPU and RAM). Neon's _Autoscaling_ feature automatically scales up compute on demand in response to application workload and down to zero on inactivity.

For example, if your AI application experiences heavy load during certain hours of the day or at different times throughout the week, month, or calendar year, Neon automatically scales compute resources without manual intervention according to the compute size boundaries that you configure. This enables you to handle peak demand while avoiding consuming compute resources during periods of low activity.

Enabling autoscaling is also recommended for initial data loads and memory-intensive index builds to ensure sufficient compute resources for this phase of your AI application setup.

To learn more about Neon's autoscaling feature and how to enable it, refer to our [Autoscaling guide](/docs/introduction/autoscaling).

## Storage

Neon's data storage allowances differ by plan. The Free plan offers 512 MB of storage. The Launch and Scale plans support larger data sizes and purchasing additional units of storage. See [Neon plans](/docs/introduction/plans).

## Read replicas

Neon supports read replicas, which are independent read-only computes designed to perform read operations on the same data as your primary read-write compute. Read replicas do not replicate data across database instances. Instead, read requests are directed to the same data source. This architecture enables read replicas to be created instantly, enabling you to scale out CPU and RAM, but because data is read from a single source, there are no additional storage costs.

Since vector similarity search is a read-only workload, you can leverage read replicas to offload reads from your primary read-write compute to a dedicated compute when deploying AI applications. After you create a read replica, you can simply swap out your current Neon connecting string for the read replica connection string, which makes deploying a read replica for your AI application very simple.

Neon's read replicas support the same compute sizes outlined above. Read replicas also support autoscaling.

To learn more about the Neon read replicas, see [read replicas](/docs/introduction/read-replicas) and refer to our [Working with Neon read replicas](/docs/guides/read-replica-guide) guide.
