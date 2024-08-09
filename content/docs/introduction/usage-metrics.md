---
title: Usage metrics
enableTableOfContents: true
updatedOn: '2024-08-09T20:21:45.348Z'
---

This topic describes [Storage](#storage), [Compute](#compute), [Data transfer](#data-transfer) and [Project](#projects) usage metrics in detail so that you can better manage your [plan](/docs/introduction/plans) allowances and extra usage.

## Storage

Neon's storage engine is designed to support a serverless architecture and enable features such as [point-in-time restore](/docs/introduction/point-in-time-restore), [time travel](/docs/guides/time-travel-assist), and [branching](/docs/guides/branching-intro). Consequently, storage in Neon differs somewhat from other database services.

In Neon, storage consists of your total **data size** and **history**.

- **Data size**

  This component of Neon storage is similar to what you might expect from most database services — it's simply the size of your data across all of your Neon projects and branches. You can think of it as a snapshot of your data.

- **History**

  This aspect of Neon storage is unique: "History" is a log of changes (inserts, updates, and deletes) to your data over time in the form of Write-Ahead Log (WAL) records. History enables the point-in-time restore, time travel, and branching features mentioned above.

  The size of your history depends on a couple of factors:

  - **The volume of changes to your data** &#8212; the volume of inserts, updates, and deletes. For example, a write-heavy workload will generate more history than a read-heavy workload.
  - **How much history you keep** &#8212; referred to as [history retention](/docs/introduction/point-in-time-restore#history-retention), which can be an hour, a day, a week, or even a month. History retention is configurable for each Neon project. As you might imagine, retaining 1 day of history would generally require much less storage than retaining 30 days, but less history limits the features that depend on it. For example, 1 day of history means that your maximum restore point is only 1 day in the past.

### How branching affects storage

If you use Neon's branching feature, you should be aware that it can also affect storage. Here are some rules of thumb when it comes to branching:

1. **Creating a branch does not add to storage immediately.** At creation time, a branch is a copy-on-write clone of its parent branch and shares its parent's data. Shared data is not counted more than once.
2. **A branch shares data with its parent if it's within the history retention window.** For example, a Neon project has 7-day history retention window, a child branch shares data with its parent branch for 7 days. However, as soon as the child branch ages out of that window, data is no longer shared &#8212; the child branch's data stands on its own and is counted toward storage.
3. **Making changes to a branch adds to storage.** Data changes on a branch are unique to that branch and counted toward storage. For example, an insert operation on the branch adds a record to the branch's history.

The storage amount you see under **Usage** on the **Billing** page in the Neon Console takes all of these factors into account.

<Admonition type="note">
Remember that each Neon plan comes with an allowance of storage that's already included in your plan's monthly fee. The Launch plan includes 10 GiB of storage. The Scale plan has an allowance of 50 GiB. You are only billed for extra storage if you go over your plan allowance. To learn how extra storage is allocated and billed, see [Extra usage](/docs/introduction/extra-usage).
</Admonition>

### Storage FAQs

<details>
<summary>**Do branches add to storage?**</summary>

When branches are created, they initially do not add to storage since they share data with the parent branch. However, as soon as changes are made to a branch, new WAL records are created, adding to your history. Additionally, when a branch ages out of your project's history retention window, its data is no longer shared with its parent and is counted independently, thus adding to storage.

To avoid branches consuming storage unnecessarily, [reset](/docs/guides/reset-from-parent) branches to restart the clock or [delete](/docs/manage/branches) them before they age out of the history retention window.

</details>

<details>
<summary>**Does a delete operation add to storage?**</summary>

Yes. Any data-modifying operation, such as deleting a row from a table in your database, generates a WAL record, so even deletions temporarily increase your history size until those records age out of your history retention window.

</details>

<details>
<summary>**What increases the size of history?**</summary>

Any data-modifying operation increases the size of your history. As WAL records age out of your [history retention window](/docs/introduction/point-in-time-restore#history-retention), they are removed, reducing your history and potentially decreasing your total storage size.

</details>

<details>
<summary>**What can I do to minimize my storage?**</summary>

Here are some strategies to consider:

- **Optimize your history retention**

  Your history retention setting controls how much change history your project retains. Decreasing history reduces the window available for things like point-in-time restore or time-travel. Retaining no history at all would make branches expensive, as a branch can only share data with its parent if history is retained. Your goal should be a balanced history retention configuration; one that supports the features you need but does not consume too much storage. See [History retention](https://neon.tech/docs/introduction/point-in-time-restore#history-retention) for how to configure your retention period.

- **Use branches instead of duplicating data**

  Use short-lived Neon branches for things like testing, previews, and feature development instead of creating separate standalone databases. As long as your branch remains within the history retention window, it shares data with its parent, making branches very storage-efficient. Added to that, branches can be created instantly, and they let you work with data that mirrors production.

- **Consider the impact of deletions**

  It may seem counterintuitive, but deleting rows from a table temporarily increases storage because delete operations are logged as part of your change history. The records for those deletions remain part of your history until they age out of your retention window. For mass deletions, `DELETE TABLE` and `TRUNCATE TABLE` operations are more storage-efficient since they log a single operation rather than a record for each deleted row.

- **Delete or reset branches before they age out**

  [Delete](/docs/manage/branches) old branches or [reset](/docs/guides/reset-from-parent) them before they age out of the history retention window. Deleting branches before they age out avoids potentially large increases in storage. Resetting a branch sets the clock back to zero for that branch.

</details>

<details>
<summary>**What happens when I reach my storage limit?**</summary>

Your storage limit varies depending on your Neon plan.

- **Free Plan**: If you reach your storage limit on the Free Plan (0.5 GiB), any further database operations that would increase storage (inserts, updates, and deletes) will fail, and you will receive an error message.
- **Launch and Scale Plans**: For users on Launch and Scale plans, exceeding your storage limit will result in [extra usage](/docs/introduction/extra-usage). The amount of extra usage is based on the maximum size your storage reaches. Charges are prorated based on when in the month your storage size increased.

</details>

<details>
<summary>**I have a small database. Why is my storage so large?**</summary>

These factors could be contributing to your high storage consumption:

- **Frequent data modifications:** If you are performing a lot of writes (inserts, updates, deletes), each operation generates WAL records, which are added to your history. For instance, rewriting your entire database daily can lead to a storage amount that is a multiple of your database size, depending on the number of days of history your Neon project retains.
- **History retention:** The length of your history retention window plays a significant role. If you perform many data modifications daily and your history retention window is set to 7 days, you will accumulate a 7-day history of those changes, which can increase your storage significantly.

To mitigate this issue, consider adjusting your [history retention](https://neon.tech/docs/introduction/point-in-time-restore#history-retention) setting. Perhaps you can do with a shorter window for point-in-time restore, for example. Retaining less history should reduce your future storage consumption.

Also, make sure you don't have old branches lying around. If you created a bunch of branches and let those age out of your history retention window, that could also explain why your storage is so large.

</details>

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
Neon uses a small amount of compute time, included in your billed compute hours, to perform periodic checks to ensure that your computes can start and read and write data. See [Availability Checker](/docs/reference/glossary#availability-checker) for more information. Availability checks take a few seconds are typically performed a few days apart. You can monitor these checks, how long they take, and how often they occur, on the **Systems operations** tab on the **Monitoring** page in the Neon Console. 
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

Data transfer usage refers to the total volume of data transferred out of Neon (known as "egress") during a given billing period. Neon does not charge for egress data, but we do limit the amount of egress available on Free Plan projects to 5 GB per month. The project's compute is suspended if the data transfer allowance is exceeded, and the following error message will be reported:

```text shouldWrap
Your project has exceeded the data transfer quota. Upgrade your plan to increase limits.
```

If you hit this limit and need to upgrade your plan, you can do so from your Neon account's **Billing** page. For instructions, see [Change your plan](/docs/introduction/manage-billing#change-your-plan). Free Plan users can monitor **Data transfer** usage from the **Resources remaining** widget on the **Project Dashboard**.

For all other plans, Neon maintains a reasonable usage policy. This means there is no set limit on data transfer, but usage is expected to stay within a range typical for standard operations. If your usage significantly exceeds this expected range, Neon may reach out to discuss your usage and possible plan adjustments. Paying users can monitor per-project **Data transfer** usage from the **Usage** widget on the **Project Dashboard**.

## Projects

In Neon, everything starts with a project. A project is a container for your branches, databases, roles, and other resources and settings. A project also defines the region your data and resources reside in. We typically recommend creating a project for each application or each client. In addition to organizing objects, projects are a way to track storage and compute usage by application or client.

The following table outlines project allowances for each Neon plan.

| Plan       | Projects  |
| ---------- | --------- |
| Free Plan  | 1         |
| Launch     | 10        |
| Scale      | 50        |
| Enterprise | Unlimited |

- When you reach your limit on the [Free Plan](/docs/introduction/plans#free-plan) or [Launch](/docs/introduction/plans#launch) plan, you cannot create additional projects. Instead, you can upgrade to the [Launch](/docs/introduction/plans#launch) or [Scale](/docs/introduction/plans#scale) plan, which offers allowances of 10 and 50 projects, respectively.
- Extra projects are available with the [Scale](/docs/introduction/plans#scale) plan in units of 10 for $50 each.

## Feedback

We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. If you have feedback for us, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord. We read and consider every submission.

<NeedHelp/>
