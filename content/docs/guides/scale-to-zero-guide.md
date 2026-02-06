---
title: Configuring Scale to Zero for Neon computes
subtitle: Learn how to configure Neon's Scale to Zero feature
summary: >-
  How to configure Neon's Scale to Zero feature to manage compute idleness based
  on inactivity, including enabling, disabling, and setting thresholds for
  different plans.
redirectFrom:
  - /docs/guides/auto-suspend-guide
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.050Z'
---

Neon's [Scale to Zero](/docs/introduction/scale-to-zero) feature controls whether a Neon compute transitions to an idle state due to inactivity. For example, if scale to zero is enabled, your compute will transition to an idle state after it's been inactive for 5 minutes. Neon's paid plans allow you to disable scale to zero to keep your compute active. On the Scale plan, you can configure the scale to zero threshold.

<Admonition type="important">
If you disable scale to zero entirely, your compute will remain active, and you will have to manually restart your compute to pick up the latest updates to Neon's compute images. Neon typically releases compute-related updates weekly. Not all releases contain critical updates, but a weekly compute restart is recommended to ensure that you do not miss anything important. For how to restart a compute, see [Restart a compute](/docs/manage/computes#restart-a-compute). 
</Admonition>

This guide demonstrates how to configure the scale to zero setting for a new project, for an existing project, or for an individual compute.

### Scale to zero limits

Paid plans permit disabling scale to zero. On the Scale plan, you can configure the scale to zero threshold.

| Plan      | Scale to zero after                  | Can be disabled? |
| :-------- | :----------------------------------- | :--------------- |
| Free plan | 5 minutes                            |                  |
| Launch    | 5 minutes                            | &check;          |
| Scale     | Configurable (1 minute to always on) | &check;          |

<Admonition type="note">
Scale to zero is only available for computes up to 16 CU in size. Computes larger than 16 CU remain always active to ensure best performance.
</Admonition>

## Enable or disable scale to zero

To enable or disable scale to zero:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. On the **Computes** tab, click **Edit**.
1. Enable or disable the scale to zero setting, and save your selection.

> Disabling scale to zero is only supported on paid plans.

### Configuring the scale to zero time

On the Scale plan, you can configure "Scale to zero after" time to increase or decrease the amount of time after which a compute scales to zero. For example, decreasing the time to 1 minute means that your compute will scale to zero faster (after the compute is inactive for 1 minute), or increasing the value to an hour means that your compute will only scale to zero after being inactive for an hour.

Initial configuration of the scale to zero time is only supported via an [Update compute endpoint](https://api-docs.neon.tech/reference/updateprojectendpoint#/) or [Update project](https://api-docs.neon.tech/reference/updateproject#/) API call. Use the `Update compute endpoint` API to change the setting for an existing compute. The `Update project` API sets a default for all compute endpoints created in the future — it does not change the configuration of existing computes.

<CodeTabs labels={["Update compute endpoint", "Update project"]}>

```bash
# change the setting for an existing compute

curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project-id}/endpoints/{endpoint-id} \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "suspend_timeout_seconds": 60
  }
}
'
```

```bash
# Change the default setting for computes created in the future

curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project-id} \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "default_endpoint_settings": {
      "suspend_timeout_seconds": 60
    }
  }
}
'
```

</CodeTabs>

**API parameters:**

- The `suspend_timeout_seconds` setting is defined in seconds
- The default setting is 300 seconds (5 minutes)
- The minimum setting is 60 seconds
- The maximum setting is 604800 seconds (1 week)
- You must supply an [API key](/docs/manage/api-keys), your [project ID](/docs/reference/glossary#project-id), and the [endpoint ID](/docs/reference/glossary#endpoint-id)

After configuring a non-default value via the Neon API, you'll be able to adjust the setting via the console. Setting a non-default value makes the time selector control visible on the **Edit compute** modal.

![Scale to zero control on the Edit compute page](/docs/guides/scale_to_zero_setting.png)

### Configure the scale to zero default

Configuring the scale to zero setting in your project's settings sets the project's default, which is applied to all computes created from that point forward. The scale to zero settings for existing computes are unaffected. See [Change your project's default compute settings](/docs/manage/projects#change-your-projects-default-compute-settings) for more info about compute defaults.

To configure the scale to zero default for an existing project:

1. Select a project in the Neon Console.
1. On the **Dashboard**, select **Settings**.
1. Navigate to the **Compute defaults** section.
1. Select **Modify defaults**.
1. Enable or disable the scale to zero setting, and save your selection.

## Monitor scale to zero

You can monitor scale to zero on the **Branches** page in the Neon Console. A compute reports either an **Active** or **Idle** status.

![Compute status](/docs/introduction/compute_state.png)

You can also view compute state transitions in the **Branches** widget on the Neon **Dashboard**.

User actions that activate an idle compute include [connecting from a client such as psql](/docs/connect/query-with-psql-editor), running a query on your database from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor), or accessing the compute via the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="info">
The Neon API includes a [Start endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) method for the specific purpose of activating and suspending a compute.
</Admonition>

You can try any of these methods and watch the status of your compute as it transitions from an **Idle** to an **Active** state.

## Session context considerations

When a compute suspends and later restarts, the [session context](/docs/reference/compatibility#session-context) resets. This includes in-memory statistics, temporary tables, prepared statements, and autovacuum thresholds, among other session-specific data. If your workflow requires persistent session data, consider disabling scale to zero on a paid plan to keep your compute active continuously. On the Free plan, scale to zero is always enabled and automatically suspends your compute after 5 minutes of inactivity.

<NeedHelp/>
