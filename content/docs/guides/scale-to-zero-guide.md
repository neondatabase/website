---
title: Configuring Scale to Zero for Neon computes
subtitle: Learn how to configure Neon's Scale to zero feature
redirectFrom:
  - /docs/guides/auto-suspend-guide
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.056Z'
---

Neon's [Scale to zero](/docs/introduction/scale-to-zero) feature controls when a Neon compute transitions to an idle state due to inactivity. For example, if your scale to zero setting is 5 minutes, your compute will "scale to zero" after it's been inactive for 5 minutes. Neon's paid plans allow you to configure this time period to keep your compute active for longer, suspend it more quickly, or disable scale to zero entirely, depending on your requirements.

<Admonition type="important">
If you disable scale to zero entirely or your compute is never idle long enough to be automatically suspended, you will have to manually restart your compute to pick up the latest updates to Neon's compute images. Neon typically releases compute-related updates weekly. Not all releases contain critical updates, but a weekly compute restart is recommended to ensure that you do not miss anything important. For how to restart a compute, see [Restart a compute](/docs/manage/endpoints#restart-a-compute). 
</Admonition>

This guide demonstrates how to configure the scale to zero setting for a new project, for an existing project, or for an individual compute.

### Scale to zero limits

The scale to zero limits differ by [Neon plan](/docs/introduction/plans). The limits for each plan are outlined below. The initial default setting for all plans is 5 minutes.

| Plan       | Scale to zero delay      | Can be disabled? |
| :--------- | :--------------------- | :--------------- |
| Free Plan  | 5 minutes              |                  |
| Launch     | 5 minutes to 7 days    | &check;          |
| Scale      | 1 minute to 7 days     | &check;          |
| Business   | 1 minute to 7 days     | &check;          |
| Enterprise | 0 seconds up to 7 days | &check;          |

### Configure the scale to zero setting for a new project

Configuring the scale to zero setting for a new project sets the project's default, which is applied to all computes created from that point forward. You can adjust this scale to zero default at any time, or configure the setting for individual computes later, as necessary.

To configure the scale to zero default setting when you first create your project:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. If you are creating your very first project, click **Create a project**. Otherwise, click **New Project**.
1. Specify a name, a Postgres version, and a region.
1. Under **Compute size**, configure your scale to zero setting.
1. Click **Save**.
1. Click **Create Project**. Your initial compute is created with the specified setting.

### Configure the scale to zero setting for an existing project

Configuring the scale to zero setting for an existing project sets the project's default, which is applied to all computes created from that point forward. Existing computes are unaffected. You can adjust the scale to zero default or configure the setting for individual computes later, as necessary.

To configure the scale to zero default for an existing project:

1. Select a project in the Neon Console.
1. On the Neon **Dashboard**, select **Project settings**.
1. Select **Compute** and click **Change**.
1. Specify your scale to zero setting.
1. Click **Save**.

## Configure scale to zero for a compute

To configure the scale to zero setting for an individual compute:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the menu in the **Computes** table, and select **Edit**.
   ![Edit compute menu](/docs/guides/autoscaling_edit.png)
1. Under **Compute size**, specify your scale to zero setting. The maximum setting is 7 days.
1. Click **Save**.

## Monitor scale to zero

You can monitor scale to zero on the **Branches** page in the Neon Console. A compute reports either an **Active** or **Idle** status.

![Compute status](/docs/connect/compute_endpoint_state.png)

You can also view compute state transitions in the **Branches** widget on the Neon **Dashboard**.

User actions that activate an idle compute include [connecting from a client such as psql](/docs/connect/query-with-psql-editor), running a query on your database from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), or accessing the compute via the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="info">
The Neon API includes [Start endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) and [Suspend endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) APIs for the specific purpose of activating and suspending a compute.
</Admonition>

You can try any of these methods and watch the status of your compute as it transitions from an **Idle** to an **Active** state.

## Considerations

When a compute suspends and later restarts, the [session context](/docs/reference/compatibility#session-context) resets. This includes in-memory statistics, temporary tables, prepared statements, and autovacuum thresholds, among other session-specific data. If your workflow requires persistent session data, consider disabling scale to zero on a paid plan to keep your compute active continuously. On the Free plan, scale to zero is always enabled and automatically suspends after 5 minutes of inactivity.
