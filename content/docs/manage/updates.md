---
title: Manage updates
enableTableOfContents: true
isDraft: false
tag: new
updatedOn: '2024-12-13T21:17:10.768Z'
---

<FeatureBeta />

To keep your Neon computes and Postgres instances up to date with the latest patches and Neon features, Neon automatically applies scheduled updates to your project's computes. We notify you of scheduled updates in advance so that you can plan for them if necessary. On Neon's paid plans, you can schedule an update window — a specific day and hour for updates.

To apply an update, Neon must briefly restart your project's computes. The entire process takes just a few seconds, minimizing any potential disruption.

## What updates are included?

Updates can include some or all of the following:

- Postgres minor version upgrades, typically released quarterly
- Security patches and fixes
- New Neon features and enhancements

## How often are updates applied?

Scheduled updates are typically applied weekly but may occur more or less frequently as needed.

Neon applies updates to computes based on the following rules:

- Computes that are currently active receive updates.
- Computes that have been consistently active for 30 days or more receive updates.
- Computes that are restarted receive available updates immediately.
- Computes in a transition state (e.g., shutting down or restarting) at the time of an update are not updated.

If a compute is excluded from an update, Neon will apply the missed update with the next scheduled update, assuming the compute meets the update criteria mentioned above.

<Admonition type="note" title="Regular updates keep your database healthy">
Neon schedules updates in advance so you know when to expect them and stay up to date with important changes. Without scheduled updates, always-active computes or those with scale to zero disabled may miss critical maintenance.
</Admonition>

## Applying updates ahead of schedule

Computes receive available updates immediately upon restart. For example, if Neon notifies you about an upcoming update, you can apply it right away by restarting the compute. However, the notification won't be cleared in this case. When the scheduled update time arrives, no further action will be taken since the compute is already updated.

If a compute regularly scales to zero, it will receive updates when it starts up again. In such cases, you may not need to pay much attention to update notifications, as updates will be applied naturally through your compute's stop/start cycles.

For compute restart instructions, see [Restart a compute](/docs/manage/endpoints#restart-a-compute).

## Updates on the Free Plan

On the **Free Plan**, updates are scheduled and applied automatically by Neon. You can check your project's settings for upcoming scheduled updates. We'll post a notice there at least **1 day** ahead of a planned update, letting you know when it's coming.

To view scheduled updates:

1. Go to the Neon project dashboard.
2. Select **Settings** > **Updates**.

   ![Free plan updates UI](/docs/manage/free_plan_updates.png)

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

You can check your project's settings for upcoming scheduled updates. We'll post a notice there at least **7 days** ahead of a planned update, letting you know when it's coming.

</TabItem>

<TabItem>
On Neon paid plans, the [Create project](https://api-docs.neon.tech/reference/createproject) and [Update project](https://api-docs.neon.tech/reference/updateproject) APIs let you define an update window using the `maintenance_window` object, as shown in the `Update project` example below.

- The `weekdays` parameter accepts an integer (`1` for Monday, `7` for Sunday) or an array of integers to specify multiple weekdays.
- The `start_time` and `end_time` values must be in UTC (`HH:MM` format) and at least one hour apart. Shorter intervals are not supported. Both times must fall on the same day. For example, (`22:00`, `23:00`) and (`23:00–00:00`) are valid settings, but (`22:00`, `03:00`) is not, as it would span multiple days.

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

## Handling connection disruptions

Most Postgres connection drivers include built-in retry mechanisms that automatically handle short-lived connection interruptions. This means that for most applications, a brief restart should result in minimal disruption, as the driver will transparently reconnect.

However, if your application has strict availability requirements, you may want to ensure that your connection settings are configured to allow for retries. Check your driver's documentation for options like connection timeouts, retry intervals, and connection pooling strategies. You retry configuration should account for the few seconds it takes to apply updates to your Neon compute.

<NeedHelp/>
