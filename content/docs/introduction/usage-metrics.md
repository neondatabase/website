---
title: Usage metrics
enableTableOfContents: true
updatedOn: '2024-09-02T13:42:56.662Z'
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
Remember that each Neon plan comes with an allowance of storage that's already included in your plan's monthly fee. The Launch plan includes 10 GiB of storage, the Scale plan has an allowance of 50 GiB, while the Business plan supports up to 500 GiB. You are only billed for extra storage if you go over your plan allowance. To learn how extra storage is allocated and billed, see [Extra usage](/docs/introduction/extra-usage).
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
- **Launch, Scale, and Business Plans**: For users on a paid plan (Launch, Scale, or Business), exceeding your storage limit will result in [extra usage](/docs/introduction/extra-usage). The amount of extra usage is based on the maximum size your storage reaches. Charges are prorated based on when in the month your storage size increased.

</details>

<details>
<summary>**I have a small database. Why is my storage so large?**</summary>

These factors could be contributing to your high storage consumption:

- **Frequent data modifications:** If you are performing a lot of writes (inserts, updates, deletes), each operation generates WAL records, which are added to your history. For instance, rewriting your entire database daily can lead to a storage amount that is a multiple of your database size, depending on the number of days of history your Neon project retains.
- **History retention:** The length of your history retention window plays a significant role. If you perform many data modifications daily and your history retention window is set to 7 days, you will accumulate a 7-day history of those changes, which can increase your storage significantly.

To mitigate this issue, consider adjusting your [history retention](https://neon.tech/docs/introduction/point-in-time-restore#history-retention) setting. Perhaps you can do with a shorter window for point-in-time restore, for example. Retaining less history should reduce your future storage consumption.

Also, make sure you don't have old branches lying around. If you created a bunch of branches and let those age out of your history retention window, that could also explain why your storage is so large.

</details>

<details>
<summary>**How does running `VACUUM` or `VACUUM FULL` affect my storage costs?**</summary>

If you're looking to control your storage costs, you might start by deleting old data from your tables, which reduces the data size you're billed for going forward. Since, in typical Postgres operations, deleted tuples are not physically removed until a vacuum is performed, you might then run `VACUUM`, expecting to see a further reduction in the `Data size` reported in the Console &#8212; but you don't see the expected decrease.

### Why no reduction?

In Postgres, `VACUUM` doesn't reduce your storage size. Intead, it marks the deleted space in the table for reuse, meaning future data can fill that space without increasing data size. While, `VACUUM` by itself won't make the data size smaller, it is good practice to run it periodically, and it does not impact availability of your data.

```sql
VACUUM your_table_name;
```

### Use VACUUM FULL to reclaim space

Running `VACUUM FULL` _does_ reclaim physical storage space by rewriting the table, removing empty spaces, and shrinking the table size. This can help lower the **Data size** part of your storage costs.

To reclaim space, you can run the following command:

```sql
VACUUM FULL your_table_name;
```

However, there are some trade-offs:

- **Table locking** &#8212; `VACUUM FULL` locks your table during the operation. If this is your production database, this may not be an option.
- **Temporary storage spike** &#8212;The process creates a new table, temporarily increasing your [peak storage](/docs/reference/glossary#peak-storage). If the table is large, this could push you over your plan's limit, trigging extra usage charges. On the Free Plan, this might even cause the operation to fail if you hit the storage limit.

In short, `VACUUM FULL` can help reduce your data size and future storage costs, but it can also cause a a temporary extra usage charges for the current billing period.

### Recommendations

- **Set a reasonable history window** &#8212; We recommend setting your history retention period to balance your data recovery needs and storage costs. Longer history means more data recovery options, but it costs more.
- **Use VACUUM FULL sparingly** &#8212; Because it locks tables and can temporarily increase storage costs, only run `VACUUM FULL` when there is significant amount of space to be reclaimed.
_ **Consider timing** &#8212; Running `VACUUM FULL` near the end of the month can help minimize the time that temporary storage spikes impact your bill, since charges are prorated.
- **Manual VACUUM for autosuspend users** — If your project uses [autosuspend](/docs/guides/auto-suspend-guide#considerations), it’s safer to run manual `VACUUM` rather than rely on [autovacuum](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) to avoid issues caused by losing statistics when the endpoint is suspended.

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

### Compute FAQs

<details>
<summary>**What is a compute hour?**</summary>

It's a metric for tracking compute usage. 1 compute hour is equal to 1 [active hour](#active-hours) for a compute with 1 vCPU. If you have a compute with .25 vCPU, as you would on the Neon Free Plan, it would require 4 _active hours_ to use 1 compute hour. On the other hand, if you have a compute with 4 vCPU, it would only take 15 minutes to use 1 compute hour.

To calculate compute hour usage, you would use the following formula:

```
compute hours = compute size * active hours
```

</details>

<details>
<summary>**I used a lot of compute hours, but I don't use the compute that often. Where is the usage coming from?**</summary>

If you're noticing an unexpectedly high number of compute hours, consider the following steps:

- **Check your compute size:** Compute sizes range from 0.25 CU to 10 CUs. Larger compute sizes will consume more compute hours for the same active period. The formula for compute hour usage is: `compute hours = compute size * active hours`. If your application can operate effectively with a smaller compute size (less vCPU and RAM), you can reduce compute hours by configuring a smaller compute. See [Edit a compute](/docs/manage/endpoints#edit-a-compute) for instructions.
- **Check for active applications or clients**: Some applications or clients might be polling or querying to your compute regularly, preventing it from auto-suspending. For instance, if you're replicating data from Neon to another service, that service may poll your compute endpoint at regular intervals to detect changes for replication. This behavior is often configurable.

  To investigate database activity, you can run the following query to check connections:

  ```sql
  SELECT
      client_addr,
      COUNT(*) AS connection_count,
      MAX(backend_start) AS last_connection_time
  FROM
      pg_stat_activity
  GROUP BY
      client_addr
  ORDER BY
      connection_count DESC;
  ```

This query displays the IP addresses connected to the database, the number of connections, and the most recent connection time.

</details>

<details>
<summary>**How many compute hours do I get with my plan?**</summary>

Each of [Neon's plans](/docs/introduction/plans) includes a certain number of compute hours per month:

- **Free Plan**: This plan includes 191.9 compute hours per month, and you can use up to 5 of those compute hours with non-default branches, in case you want to use Neon's branching feature. Why 191.9? This is enough compute hours to provide 24/7 availability on a 0.25 vCPU compute (our smallest compute size) on your default branch. The math works like this: An average month has about 770 hours. A 0.25 vCPU compute uses 1/4 compute hours per hour, which works out to 180 compute hours per month if you run the 0.25 vCPU compute non-stop. The 11.9 additional compute hours per month are a little extra that we've added on top for good measure. You can enable autoscaling on the Free Plan to allow your compute to scale up to 2 vCPU, but please be careful not to use up all of your 191.5 compute hours before the end of the month.
- **Launch Plan**: This plan includes 300 compute hours (1,200 active hours on a 0.25 vCPU compute) total per month for all computes in all projects. Beyond 300 compute hours, you are billed for compute hours at $0.16 per hour.
- **Scale Plan**: This plan includes 750 compute hours (3000 active hours on a 0.25 vCPU compute) total per month for all computes in all projects. Beyond 750 compute hours, you are billed an extra $0.16 per additional hour.
- **Business Plan**: This plan inclues 1000 compute hours (4000 active hours on a 0.24 vCPU compute) total per month for all computes in all projects. Beyond 1000 compute hours, you are billed an extra $0.16 per additional hour.

</details>

<details>
<summary>**Where can I monitor compute hour usage?**</summary>

You can monitor compute hour usage for a Neon project on the [Project Dashboard](/docs/introduction/monitor-usage#project-dashboard). To monitor compute usage for your Neon account (all compute usage across all projects), refer to your **Billing** page. See [View usage metrics in the Neon Console](https://neon.tech/docs/introduction/monitor-usage#view-usage-metrics-in-the-neon-console).

</details>

<details>
<summary>**What happens when I go over my plan's compute hour allowance?**</summary>

On the Free Plan, if you go over the 5 compute hour allowance for non-default branch computes, those computes are suspended until the allowance resets at the beginning of the month. If you go over the 191.9 compute hour allowance, all computes are suspended until the beginning of the month.

On our paid plans (Launch, Scale, and Business), you are billed automatically for any compute hours over your monthly allowance, which is 300 compute hours on Launch and 750 compute hours on Scale. The billing rate is $0.16 per compute hour.

</details>

<details>
<summary>**Can I purchase more compute hours?**</summary>

On the Free Plan, no. You'll have to upgrade to a paid plan. On the Launch, Scale, and Business plans, you are billed automatically for any compute hours over your monthly allowance: 300 compute hours on Launch, 750 compute hours on Scale, and 1000 hours on Business. The billing rate is $0.16 per compute hour.

</details>

<details>
<summary>**How does autoscaling affect my compute hour usage?**</summary>

The formula for compute hour usage is: `compute hours = compute size * active hours`. You will use more compute hours when your compute scales up in size to meet demand. When you enable autoscaling, you define a max compute size, which acts as a limit on your maximum potential compute usage. See [Configuring autoscaling](/docs/introduction/autoscaling#configuring-autoscaling).

</details>

<details>
<summary>**How does compute size affect my compute hour usage?**</summary>

The formula for compute hour usage is: `compute hours = compute size * active hours`. If you increase your compute size for more vCPU and RAM to improve performance, you will use more compute hours.

</details>

<details>
<summary>**How does autosuspend (scale to zero) affect my compute hour usage?**</summary>

Autosuspend places your compute into an idle state when it's not being used, which helps minimize compute hour usage. Computes are suspended after 5 minutes of inactivity by default. On Neon's paid plans, you can adjust autosuspend behavior to have it suspend computes more or less quickly after compute activity ceases. See [Autosuspend](docs/introduction/auto-suspend).

</details>

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
| Business   | 100       |
| Enterprise | Unlimited |

- When you reach your limit on the [Free Plan](/docs/introduction/plans#free-plan) or [Launch](/docs/introduction/plans#launch) plan, you cannot create additional projects. Instead, you can upgrade to the [Launch](/docs/introduction/plans#launch), [Scale](/docs/introduction/plans#scale), or [Business](/docs/introduction/plans#business) plan, which offers allowances of 10, 50, and 100 projects, respectively.
- Extra projects are available on both the [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans in units of 10 for $50 each.

## Feedback

We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. If you have feedback for us, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord. We read and consider every submission.

<NeedHelp/>
