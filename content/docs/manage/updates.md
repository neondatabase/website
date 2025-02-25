---
title: Manage updates
enableTableOfContents: true
isDraft: false
tag: new
updatedOn: '2025-02-14T10:02:52.634Z'
---

<Admonition type="note" title="updates coming soon">
Free Plan accounts can expect to see update notices in early February, at least 24 hours before any planned update. Update notices for Neon's Launch and Scale plans will start rolling out in the second week of February, with at least 7 days' notice before a planned update. Business and Enterprise plan accounts will see update notices toward the end of February. For the latest information about updates, follow our announcements in the [Neon Changelog](https://neon.tech/docs/changelog).
</Admonition>

To keep your Neon [computes](/docs/reference/glossary#compute) and Postgres instances up to date with the latest patches and features, Neon applies updates to your project's computes. We notify you of updates in advance so that you can plan for them if necessary. On Neon's paid plans, you can select an update window — a specific day and hour for updates.

Neon briefly restarts a compute to apply an update. The entire process takes just a few seconds, minimizing any potential disruption.

## What updates are included?

Updates may include some or all of the following:

- Postgres minor version upgrades, typically released quarterly
- Security patches and fixes
- Neon features and enhancements

## How often are updates applied?

Updates are typically released weekly but may occur more or less frequently, as needed.

Neon applies updates to computes based on the following rules:

- Computes that have been active for 30 days or more receive updates.
- Computes that are restarted receive available updates immediately.
- Computes in a transition state (e.g., shutting down or restarting) at the time of an update are not updated.
- Computes larger than 8 CU are not updated.

If a compute is excluded from an update, Neon will apply the missed update with the next update, assuming the compute meets the update criteria mentioned above.

<Admonition type="important" title="updates outside of scheduled update windows">
Please be aware that Neon may occasionally restart computes outside scheduled update windows to address critical security issues or perform essential platform maintenance.
</Admonition>

## Updates on the Free Plan

On the **Free Plan**, updates are scheduled and applied automatically. You can check your project's settings for updates. We'll post a notice there at least **1 day** ahead of a planned update, letting you know when it's coming.

To view planned updates:

1. Go to the Neon project dashboard.
2. Select **Settings** > **Updates**.

   ![Free plan updates UI](/docs/manage/free_plan_updates.png)

If you want to apply an update ahead of the scheduled date, see [Applying updates ahead of schedule](#applying-updates-ahead-of-schedule).

## Updates on paid plans

On Neon's paid plans, you can set a preferred update window by specifying the day and hour. Updates will be applied within this window, letting you plan for the required compute restart.

You can specify an update window in your Neon project's settings or using the Neon API.

<Tabs labels={["Neon Console", "API"]}>

<TabItem>
In the Neon Console:

1. Go to the Neon project dashboard.
2. Select **Settings** > **Updates**.
3. Choose a day of the week and an hour. Updates will occur within this time window and take only a few seconds.

   ![Paid plan updates UI](/docs/manage/paid_plan_updates.png)

You can check your project's settings for upcoming updates. We'll post a notice there at least **7 days** ahead of a planned update, letting you know when it's coming.

</TabItem>

<TabItem>
On Neon paid plans, the [Create project](https://api-docs.neon.tech/reference/createproject) and [Update project](https://api-docs.neon.tech/reference/updateproject) APIs let you define an update window using the `maintenance_window` object, as shown in the `Update project` example below.

- The `weekdays` parameter accepts an integer (`1` for Monday, `2` for Tuesday, and so on) or an array of integers to specify multiple weekdays.
- The `start_time` and `end_time` values must be in UTC (`HH:MM` format) and at least one hour apart. Shorter intervals are not supported. Both times must fall on the same day. For example, (`22:00`, `23:00`) and (`23:00`, `00:00`) are valid settings, but (`22:00`, `03:00`) is not, as it would span multiple days.

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/fragrant-mode-99795914 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "settings": {
      "maintenance_window": {
        "weekdays": [
          7
        ],
        "start_time": "01:00",
        "end_time": "02:00"
      }
    }
  }
}
'
```

</TabItem>

</Tabs>

## Check for updates using the Neon API

You can retrieve your update window and check for planned updates using the [Retrieve project details](https://api-docs.neon.tech/reference/getproject) endpoint.

To get your project details, send the following request, replacing `<your_project_id>` with your Neon project ID, and `$NEON_API_KEY` with your [Neon API key](/docs/manage/api-keys):

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/<your_project_id> \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

In the response, locate the `maintenance_window` field. It specifies the selected weekday and hour for updates. For Free Plan accounts, the update window is set by Neon. Paid plan accounts can [choose a preferred update window](#updates-on-paid-plans). The `weekdays` value is a number from 1 to 7, representing the day of the week.

```json
{
...
  "settings": {
      "maintenance_window": {
         "weekdays": [5],
         "start_time": "07:00",
         "end_time": "08:00"
      },
   }
  "maintenance_scheduled_for": "2025-02-07T07:00"
...
}
```

If there's a planned update, you'll also find a `maintenance_scheduled_for` field in the response body. This value matches the `start_time` in your `maintenance_window` but is formatted as a timestamp. If the `maintenance_scheduled_for` field in not present in the response, this means there is no planned update at this time.

## Applying updates ahead of schedule

Computes receive available updates immediately upon restart. For example, if Neon notifies you about an upcoming update, you can apply it right away by restarting the compute. However, the notification won't be cleared in this case. When the planned update time arrives, no further action will be taken since the compute is already updated.

If a compute regularly scales to zero, it will receive updates when it starts up again. In such cases, you may not need to pay much attention to update notifications, as updates will be applied naturally through your compute's stop/start cycles.

For compute restart instructions, see [Restart a compute](/docs/manage/endpoints#restart-a-compute).

## Handling connection disruptions

Most Postgres connection drivers include built-in retry mechanisms that automatically handle short-lived connection interruptions. This means that for most applications, a brief restart should result in minimal disruption, as the driver will transparently reconnect.

However, if your application has strict availability requirements, you may want to ensure that your connection settings are configured to allow for retries. Check your driver's documentation for options like connection timeouts, retry intervals, and connection pooling strategies. Your retry configuration should account for the few seconds it takes to apply updates to your Neon compute. For related information, see [Build connection timeout handling into your application](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application).

<NeedHelp/>
