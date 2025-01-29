---
title: Manage updates
enableTableOfContents: true
isDraft: false
updatedOn: '2024-12-13T21:17:10.768Z'
---

To keep your Neon computes and Postgres instances up to date with the latest patches and Neon features, Neon automatically applies scheduled updates to your project's computes. On all Neon plans, we notify you by email ahead of scheduled updates so that you can plan for them if necessary. On Neon's paid plans, you will be able to schedule an update window — a specific day and time for updates.

To apply an update, Neon must briefly restart your computes, which typically takes just a few seconds thanks to Neon's serverless architecture. 

<Admonition type="info">
Most Postgres connection drivers include built-in retry mechanisms that automatically handle short-lived connection interruptions. This means that for most applications, a brief restart should result in minimal disruption, as the driver will transparently reconnect.

However, if your application has strict availability requirements, you may want to ensure that your connection settings are configured to allow retries. Check your driver's documentation for options like connection timeouts, retry intervals, and connection pooling strategies.
</Admonition>

- Updates are scheduled so you’ll know when they’re coming, and so that you won't fall behind on important maintenance.
- Updates require a compute restart, but restarts are quick and automatic — taking just a few seconds.

You’ll be able to track scheduled updates in your project settings.
Free Plan accounts will have updates scheduled in advance for a specific day and time, while Paid Plan accounts will be able to choose a preferred update window.

## What updates are included?

Updates can include some or all of the following:

- Postgres minor version upgrades, typically released quarterly
- Security patches and fixes
- New Neon features and enhancements

## How often are updates applied?

Scheduled updates are typically applied weekly but may occur more or less frequently as needed.

Neon applies updates to computes based on the following rules:

- Active computes receive updates.
- Computes that have been active within the last 30 days receive updates.
- Computes that haven’t been active in the past 30 days are not updated.
- Computes in a transition state (e.g., shutting down or restarting) at the time of an update are not updated.

If a compute is excluded from an update, Neon will apply the missed update and any new updates at the next scheduled update once the compute meets the update criteria listed above.

## Scheduled updates on the Free Plan

On the **Free Plan**, updates are scheduled and applied automatically by Neon. You'll receive an email ahead of a planned update, letting you know when it's coming. You can also check your project's settings for upcoming scheduled updates.

1. Go to the Neon project dashboard.
2. Select **Settings** > **Updates**.

![Free plan updates UI](/docs/manage/free_plan_updates.png)

Once a planned update notification is sent via email and posted **Settings** > **Updates**, a subsequent compute restart will apply the available update immediately. You won't have to wait for the scheduled time. For example, Neon computes scale to zero after 5 minutes by default. When you're compute is activated again, that's a restart, and available updates will be applied at that time.

## Schedule updates on Paid Plans

On Neon's paid plans, you can set a preferred update time window, specifying the day of the week and hour. Updates will be applied within this window. This allows you to plan for the compute restart required to apply an update.

You can manage the update schedule in your Neon project's settings:

1. Go to the Neon project dashboard.
2. Select **Settings** > **Updates**.
3. Choose a day of the week and an hour. Updates will occur within this time window and take only a few seconds.

![Paid plan updates UI](/docs/manage/free_plan_updates.png)

As with the Free Plan, once a planned update notification is sent via email and posted **Settings** > **Updates**, a subsequent compute restart will apply the available update immediately. You won't have to wait for the scheduled time. For example, if your compute scales to zero, available updates will be applied the next time your compute starts.

<NeedHelp/>
