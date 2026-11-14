---
title: Updates
summary: >-
  Neon compute updates deliver Postgres minor version upgrades, security
  patches, and OS changes by restarting the compute, typically in seconds,
  with automatic cache prewarming to avoid cold-cache performance loss after
  restart. Paid plan users can schedule a preferred update window via the
  console or API. Free plan updates are scheduled by Neon with advance notice.
  Computes larger than 16 CU are excluded from automatic
  updates and must be restarted manually. Restart computes shortly before a
  critical event to keep scheduled updates out of it. Configure connection
  retry logic to handle the brief disruption.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-11-04T20:40:59.376Z'
---

To keep your Neon [computes](/docs/reference/glossary#compute) and Postgres instances up to date with the latest patches and features, Neon applies updates to your project's computes. We notify you of updates in advance so that you can plan for them if necessary. On Neon's paid plans, you can select an update window (a specific day and hour for updates).

## How Neon applies updates

To apply updates to your compute (Postgres upgrades, security patches, and similar changes), Neon restarts the compute where Postgres runs. On paid plans, this happens within the [update window](#updates-on-paid-plans) you choose. On the Free plan, Neon schedules updates for you. The restart itself typically takes only a few seconds.

To protect performance, Neon **prewarms** your compute's cache during the update process, without adding time to the restart. Prewarming means repopulating Postgres's in-memory buffer cache from storage before your workload continues, so frequently used data is already in memory instead of being read cold from storage after the restart. Prewarming runs automatically. You do not configure it. There are no additional compute or storage costs associated with this behavior.

For technical details, see [Zero-Downtime Patching Part 1: Prewarming](/blog/prewarming).

<Admonition type="important">
Brief connection drops are expected during compute updates. Verify that your application has a retry policy configured to handle these brief interruptions. For guidance on implementing retry logic, see [Building resilient applications with Postgres](/guides/building-resilient-applications-with-postgres).
</Admonition>

## What updates are included?

Updates to Neon computes may include some or all of the following:

- Postgres minor version upgrades, typically released quarterly
- Security patches and updates
- Operating system updates
- Neon features and enhancements
- Updates to other tools and components included in Neon compute images

Neon compute updates do not include [Neon platform maintenance](/docs/manage/platform-maintenance).

## How often are updates applied?

Updates are typically released weekly but may occur more or less frequently, as needed.

Neon applies updates to computes based on the following rules:

- Computes that have been active for 30 days or more receive updates.
- Computes that are restarted receive available updates immediately.
- Computes in a transition state (for example, shutting down or restarting) at the time of an update are not updated.
- Computes **larger than 16 CU** are not updated automatically. Autoscaling computes, which have a maximum of 16 CU, and fixed-size computes up to 16 CU receive scheduled updates. See [Updating large computes](#updating-large-computes).

If a compute is excluded from an update, Neon will apply the missed update with the next update, assuming the compute meets the update criteria mentioned above.

<Admonition type="important" title="updates outside of scheduled update windows">
Please be aware that Neon must occasionally perform essential **platform maintenance** outside the scheduled updates performed on Neon computes. This means that you may experience brief disruptions from time to time. To learn more, see [Platform maintenance](/docs/manage/platform-maintenance).
</Admonition>

## Updates on the Free plan

On the **Free plan**, updates are scheduled and applied automatically. You can check your project's settings for updates. We'll post a notice there at least **1 day** ahead of a planned update, letting you know when it's coming.

To view planned updates:

1. Open your project in the Neon Console.
2. Select **Settings** > **Postgres**.

   ![Free plan updates UI](/docs/manage/free_plan_updates.png)

If you want to apply an update ahead of the scheduled date, see [Applying updates ahead of schedule](#applying-updates-ahead-of-schedule).

## Updates on paid plans

On Neon's paid plans, you can set a preferred update window by specifying the day and hour. Updates will be applied within this window, letting you plan for the required compute restart.

You can specify an update window in your Neon project's settings or using the Neon API.

<Tabs labels={["Neon Console", "API"]}>

<TabItem>
In the Neon Console:

1. Open your project in the Neon Console.
2. Select **Settings** > **Postgres**.
3. Choose a day of the week and an hour. Updates will occur within this time window and take only a few seconds.

   ![Paid plan updates UI](/docs/manage/paid_plan_updates.png)

You can check your project's settings for upcoming updates. On all paid plans, we post a notice there at least **3 days** ahead of a planned update, letting you know when it's coming.

> On the **Scale** and **Enterprise** plans, you also receive an **email notification** 3 days in advance of a planned update, in addition to the in-console notice. On the **Launch** plan, advance notice is provided in the console only, with no email.

</TabItem>

<TabItem>
On Neon paid plans, the [Create project](/docs/reference/api/projects/create-project) and [Update project](/docs/reference/api/projects/update-project) APIs let you define an update window using the `maintenance_window` object, as shown in the `Update project` example below.

- The `weekdays` parameter accepts an integer (`1` for Monday, `2` for Tuesday, and so on) or an array of integers to specify multiple weekdays.
- The `start_time` and `end_time` values must be in UTC (`HH:MM` format) and at least one hour apart. Shorter intervals are not supported. Both times must fall on the same day. For example, (`22:00`, `23:00`) and (`23:00`, `00:00`) are valid settings, but (`22:00`, `03:00`) is not, as it would span multiple days.

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/fragrant-mode-99795914 \
     --header 'accept: application/json' \
     --header "authorization: Bearer $NEON_API" \
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

You can retrieve your update window and check for planned updates using the [Retrieve project details](/docs/reference/api/projects/get-project) endpoint.

To get your project details, send the following request, replacing `<your_project_id>` with your Neon project ID, and `$NEON_API_KEY` with your [Neon API key](/docs/manage/api-keys):

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/<your_project_id> \
     --header 'accept: application/json' \
     --header "authorization: Bearer $NEON_API_KEY"
```

In the response, locate the `maintenance_window` field. It specifies the selected weekday and hour for updates. For Free plan accounts, the update window is set by Neon. Paid plan accounts can [choose a preferred update window](#updates-on-paid-plans). The `weekdays` value is a number from 1 to 7, representing the day of the week.

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

For compute restart instructions, see [Restart a compute](/docs/manage/computes#restart-a-compute).

## Avoid restarts during a critical period

If a brief restart would disrupt an event, such as a product launch or a sales peak, you can keep scheduled updates out of it. Restarting a compute resets its 30-day update clock, so a restart shortly before the event pushes the next scheduled update past it.

1. **Pick a time to restart.** Choose a quiet time a few days before the event starts, and make sure the event ends within 30 days of the restart. For longer events, see [Events longer than 30 days](#events-longer-than-30-days).
2. **Restart every compute the event depends on**, including read replicas. Each compute has its own update schedule, so a compute you don't restart can still be updated during the event. See [Restart a compute](/docs/manage/computes#restart-a-compute).
3. **Move your update window (paid plans).** If the event lasts less than a week, set your project's update window to a day and hour outside the event. See [Updates on paid plans](#updates-on-paid-plans). On the Free plan, Neon sets the update window, so skip this step.
4. **Check for planned updates.** In the Neon Console, open your project and select **Settings** > **Postgres**, or check the `maintenance_scheduled_for` field with the API. See [Check for updates using the Neon API](#check-for-updates-using-the-neon-api). Confirm nothing is planned during the event.

A compute that scales to zero restarts when it wakes up, so it can restart during the event if it goes idle. On paid plans, you can disable scale to zero on the computes the event depends on until the event ends. See [Configuring scale to zero for Neon computes](/docs/guides/scale-to-zero-guide).

<Admonition type="note" title="These steps don't cover every restart">
These steps keep scheduled updates out of your event. [Platform maintenance](/docs/manage/platform-maintenance), urgent security fixes, and hardware failures can still restart a compute, and computes smaller than 4 CU can be restarted for platform maintenance at any time. Make sure your application retries dropped connections. See [Handling connection disruptions during compute updates](#handling-connection-disruptions-during-compute-updates).
</Admonition>

If the timing of an upcoming update is a problem for your business, [contact Neon Support](/docs/introduction/support).

### Events longer than 30 days

A single restart can't cover an event longer than 30 days, so a scheduled update might happen during it. To limit the impact on paid plans, set your update window to the quietest hour of your week.

## Updating large computes

<Admonition type="note" title="Threshold raised to 16 CU">
As of early November 2026, computes up to 16 CU receive scheduled updates. Previously, computes configured to scale beyond 8 CU were not updated automatically and needed a manual restart.
</Admonition>

Fixed-size computes **larger than 16 CU** are not updated automatically (_scheduled updates do not apply_). Computes up to 16 CU, including all autoscaling computes, follow the usual [automatic update rules](#how-often-are-updates-applied) above. To apply updates on a large compute, you'll need to restart it manually. Computes larger than 16 CU don't [scale to zero](/docs/introduction/scale-to-zero), so they won't pick up updates through a stop/start cycle. Plan for manual restarts.

Neon typically releases compute updates weekly, so we recommend scheduling weekly compute restarts.

For restart instructions, see [Restart a compute](/docs/manage/computes#restart-a-compute).

## Handling connection disruptions during compute updates

Prewarming helps keep the cache warm through the update, so query performance is not affected by a cold cache, but you may still experience a brief connection drop due to the compute restart.

Most Postgres connection drivers include built-in retry mechanisms that automatically handle short-lived connection interruptions. This means that for most applications, a brief restart should result in minimal disruption, as the driver will reconnect automatically.

However, if your application has strict availability requirements, you may want to ensure that your connection settings are configured to allow for retries. Check your driver's documentation for options like connection timeouts, retry intervals, and connection pooling strategies. Your configuration should account for the few seconds it takes to apply updates to your Neon compute. For related information, see [Build connection timeout handling into your application](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application).

If your application or integration uses the [Neon API](/docs/reference/api) or [SDKs](/docs/reference/sdk) that wrap the Neon API, we recommend building in the same type of retry logic.

## See also

- [Building resilient applications with Postgres](/guides/building-resilient-applications-with-postgres): Best practices for handling connection drops with retry logic, connection pooling, and idempotency
- [Connection latency and timeouts](/docs/connect/connection-latency): Strategies for managing connection latencies and timeouts

<NeedHelp/>
