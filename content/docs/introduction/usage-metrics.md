---
title: Usage metrics
enableTableOfContents: true
updatedOn: '2024-07-16T16:42:29.768Z'
---

This topic describes [Storage](#storage), [Compute](#compute), and [Project](#projects) usage metrics in detail so that you can better manage your [plan](/docs/introduction/plans) allowances and extra usage.

## Storage

Storage is the total **data size** and **history** stored in Neon across all of your projects, branches, and databases.

- **Data size**

  This is the size of the data you store in databases across all of your Neon projects and branches. You can think of this as a snapshot of your logical data at any given moment.

- **History**

  This is a log of changes (inserts, updates, and deletes) made to your databases over time in the form of Write-Ahead Log (WAL) records. History enables Neon features such as [point-in-time restore](/docs/introduction/point-in-time-restore) and [time travel](/docs/guides/time-travel-assist). The size of your history depends on a couple of factors:

  - **The volume of changes to your data** &#8212; the volume of inserts, updates, and deletes retained. A heavy write workload will generates more history than a heavy read workload.
  - **Your [history retention window](/docs/introduction/point-in-time-restore#history-retention)** &#8212; it can be an hour, a day, a week, or longer. It's configurable for each Neon project. As you can imagine, retaining 1 day of history requires less storage than retaining 30 days of history, but a shorter history retention window also limits features like point-in-time restore and time travel that depend on it.

    Neon's branching feature can also affect storage. Here are some rules of thumb:

  - **Creating a branch does not add to storage immediately**. At creation time, a branch is a clone of its parent branch; it shares data with its parent. Shared data is not counted toward storage.
  - **A branch shares data with its parent while it remains within its parent's history retention window**. For example, if a parent branch has 7 days of history, a child branch shares data with its parent branch for that period. However, as soon as the branch ages past that period, data is no longer shared &#8212; the child branch's data stands on its own and is counted toward storage.
  - **When you make changes to a branch, you generate data unique to the branch, adding to storage**. The branch may still share data with the parent while it exists within the parent's history retention window, but changes specific to the branch are counted toward storage.

The storage amount you see under **Usage** on the **Billing** page in the Neon Console takes all of these factors into account: The size of your databases across all of your Neon projects and branches, the size of your retained history, and the data shared between branches.

<Admonition type="note">
Remember that each Neon plan comes with an allowance of storage that's already included in your plan's monthly fee. The Launch plan includes 10 GiBs of storage. The Scale plan has an allowance of 50 GiB. You are only billed for extra storage if you go over your plan allowance. To learn how extra storage is allocated and billed for, see [Extra usage](/docs/introduction/extra-usage).
</Admonition>

### Storage FAQs

<details>
<summary>**Do branches add to storage?**</summary>

When branches are created, they initially do not add to storage since they use shared data. However, as soon as changes are made within a branch, new WAL records are created, adding to your history. Also, if your branch ages out of its parent's history retention window, the branch's' data is no longer shared and is counted toward storage. To avoid branches using up storage, reset them or delete them before they age out of their parent's history retention window.

</details>

<details>
<summary>**Does a delete operation add to storage?**</summary>

Like any database, inserting data increases data size, while deleting data decreases it. However, since each operation generates a WAL record, even deletions temporarily increase your history size until those records age out of your history retention window.

</details>

<details>
<summary>**What happens when I reach my storage limit?**</summary>

Your storage allowance varies depending on your Neon plan.

- **Free Tier**: If you reach your storage limit on the Free Tier (0.5 GiB), any further database operations that would increase storage (INSERTs or UPDATEs for example) will fail, and you will receive an error message.
- **Launch and Scale Plans**: For users on Launch and Scale plans, exceeding your storage limit will result in [additional charges](/docs/introduction/extra-usage). Charges are added based on the maximum size your storage reaches and are prorated based on when in the month your storage size increased.

</details>

### How your storage size fluctuates

Storage size changes in Neon are influenced by typical database operations as well as the dynamic behavior of WAL records:

- **Standard database operations**: Like any database, inserting data increases data size, while deleting data decreases it. However, since each operation generates a WAL record, even deletions temporarily increase your history size until those records age out.
- **WAL records and aging**: Every database operation temporarily increases the size of your history. As WAL records age out of your configured [retention window](/docs/introduction/point-in-time-restore#history-retention), they are removed, reducing your history and potentially decreasing your total storage size.
- **Branching**: When branches are created, they initially do not add to storage since they use shared data. However, as soon as changes are made within a branch, new WAL records are created, adding to your history.
- **Aged-out branches**: Over time, as branches age out of the retention window, their data is no longer shared with its parent and is counted independently, thus adding to the storage.

All this is to say, your storage size is a moving target. We recommend you regularly [monitor your usage](/docs/introduction/monitor-usage) and adjust settings to effectively manage your storage costs.

### Tips for minimizing storage

To help manage your storage size, here are some strategies to consider:

- **Adjust history retention**

  Minimizing your history retention period, which controls how much change history your project retains in the form of WAL records. On the other hand, decreasing your history retention period reduces the window available for point-in-time restore or time-travel connections. See [History retention](https://neon.tech/docs/introduction/point-in-time-restore#history-retention) for more information.

- **Consider deletion impact**

  It may seem counterintuitive, but deleting records from a table temporarily increases storage usage because these delete operations are logged as part of your change history. They remain until they age out of your history retention window. For mass deletions, using a `DELETE TABLE` operation is more storage-efficient since it logs only a single operation.

- **Proactive branch management**

  Remove or reset branches before they diverge from the history retention window. Removing old branches that are no longer needed, or resetting them before they accumulate changes that are no longer shared, helps prevent unnecessary storage from building up.

## Compute

Compute hour usage is calculated by multiplying compute size by _active hours_.

<Admonition type="tip" title="Compute Hours Formula">

```
 compute hours = compute size * active hours
```

</Admonition>

- A single **compute hour** is one _active hour_ for a compute with 1 vCPU. For a compute with .25 vCPU, it would take 4 _active hours_ to use 1 compute hour. On the other hand, if your compute has 4 vCPUs, it would only take 15 minutes to use 1 compute hour.
- An **active hour** is a measure of the amount of time a compute is active. The time your compute is idle when suspended due to inactivity is not counted.
- **Compute size** is measured at regular intervals and averaged to calculate compute hour usage. Compute size in Neon is measured in _Compute Units (CUs)_. One CU has 1 vCPU and 4 GB of RAM. A Neon compute can have anywhere from .25 to 10 CUs, as outlined below:

  | Compute Units | vCPU | RAM   |
  | :------------ | :--- | :---- |
  | .25           | .25  | 1 GB  |
  | .5            | .5   | 2 GB  |
  | 1             | 1    | 4 GB  |
  | 2             | 2    | 8 GB  |
  | 3             | 3    | 12 GB |
  | 4             | 4    | 16 GB |
  | 5             | 5    | 20 GB |
  | 6             | 6    | 24 GB |
  | 7             | 7    | 28 GB |
  | 8             | 8    | 32 GB |
  | 9             | 9    | 36 GB |
  | 10            | 10   | 40 GB |

- A connection from a client or application activates a compute. Activity on the connection keeps the compute in an `Active` state. A defined period of inactivity (5 minutes by default) places the compute into an `Idle` state.

### How Neon compute features affect usage

Compute-hour usage in Neon is affected by [autosuspend](/docs/guides/auto-suspend-guide), [autoscaling](/docs/guides/autoscaling-guide), and your minimum and maximum [compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) configuration. With these features enabled, you can get a sense of how your compute hour usage might accrue in the following graph.

![Compute metrics graph](/docs/introduction/compute-usage-graph.jpg)

You can see how compute size scales between your minimum and maximum CPU settings, increasing and decreasing compute usage: compute size never rises above your max level, and it never drops below your minimum setting. With autosuspend, no compute time at all accrues during inactive periods. For projects with inconsistent demand, this can save significant compute usage.

<Admonition type="note">
Neon uses a small amount of compute time, included in your billed compute hours, to perform a periodic check to ensure that your computes can start and read and write data. See [Availability Checker](/docs/reference/glossary#availability-checker) for more information.
</Admonition>

### Estimate your compute hour usage

To estimate what your compute hour usage might be per month:

1. Determine the compute size you require, in Compute Units (CUs).
1. Estimate the amount of _active hours_ per month for your compute(s).
1. Input the values into the compute hours formula:

   ```text
   compute hours = compute size * active hours
   ```

   For example, this is a calculation for a 2 vCPU compute that is active for all hours in a month (approx. 730 hours):

   ```text
   2 * 730 = 1460 compute hours
   ```

   This calculation is useful when trying to select the right Neon plan or when estimating the extra compute usage you might need.

   <Admonition type="note">
   If you plan to use Neon's _Autoscaling_ feature, estimating **compute hours** is more challenging. Autoscaling adjusts the compute size based on demand within the defined minimum and maximum compute size thresholds. The best approach is to estimate an average compute size and modify the compute hours formula as follows:

   ```text
   compute hours = average compute size * active hours
   ```

   To estimate an average compute size, start with a minimum compute size that can hold your data or working set (see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute)). Pick a maximum compute size that can handle your peak loads. Try estimating an average compute size between those thresholds based on your workload profile for a typical day.

   </Admonition>

## Data Transfer

Data transfer usage refers to the total volume of data transferred out of Neon (known as "egress") during a given billing period. Neon does not charge for egress data, but we do limit the amount of egress available on Free Tier projects to 5 GiB per month. The project's compute endpoint is suspended if the data transfer allowance is exceeded. Data transfer is tracked per Neon user account.

For all other plans, Neon maintains a reasonable usage policy. This means there is no set limit on data transfers, but usage is expected to stay within a range typical for standard operations. If your usage significantly exceeds this expected range, Neon may reach out to discuss your pattern and possible plan adjustments.

## Projects

In Neon, everything starts with a project. A project is a container for your branches, databases, roles, and other resources and settings. A project also defines the region your data and resources reside in. We typically recommend creating a project for each application or each client. In addition to organizing objects, projects are a way to track storage and compute usage by application or client.

The following table outlines project allowances for each Neon plan.

| Plan       | Projects  |
| ---------- | --------- |
| Free Tier  | 1         |
| Launch     | 10        |
| Scale      | 50        |
| Enterprise | Unlimited |

- When you reach your limit on the [Free Tier](/docs/introduction/plans#free-tier) or [Launch](/docs/introduction/plans#launch) plan, you cannot create additional projects. Instead, you can upgrade to the [Launch](/docs/introduction/plans#launch) or [Scale](/docs/introduction/plans#scale) plan, which offers allowances of 10 and 50 projects, respectively.
- Extra projects are available with the [Scale](/docs/introduction/plans#scale) plan in units of 10 for $50 each.

## Feedback

We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. If you have feedback for us, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord. We read and consider every submission.

<NeedHelp/>
