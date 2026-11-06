---
title: Time Travel tutorial
subtitle: Use Time Travel to analyze changes made to your database over time
summary: >-
  Neon Time Travel tutorial that shows how to use the SQL Editor's Time Travel
  toggle to run point-in-time SELECT queries and confirm exactly when a feature
  flag changed state after a CI/CD deployment. Reach for this guide when you
  need to debug a production regression by comparing database state before and
  after a specific timestamp, without restoring a branch or snapshot. The
  tutorial covers creating a feature_flags table, recording the activation
  timestamp from query history, and verifying pre- and post-activation values
  with time-scoped queries.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
---

This tutorial shows how to use Time Travel to debug a common problem: an issue that appears right after a CI/CD deployment to production.

In this scenario, your team has released a streamlined checkout process behind a `new_checkout_process` feature flag. Soon after the flag was turned on, customer support started getting complaints about checkout. You need to confirm whether the complaints line up with the moment the feature was activated.

## Before you start

To follow this tutorial, you need:

- A Neon account. If you don't have one, see [Sign up](/docs/get-started/signing-up).
- A [history window](/docs/postgres/backup-restore/history-window) that covers the time period you want to query. Time Travel can only query points in time inside your history window.

<Steps>

## Prepare your database

To simulate this scenario, create a `feature_flags` table that controls which features are available.

1. In the Neon Console, select your branch, then open **Postgres database** > **SQL Editor**. This tutorial uses the default `neondb` database.

1. Create the `feature_flags` table:

   ```sql
   CREATE TABLE feature_flags (
       feature_name TEXT PRIMARY KEY,
       enabled BOOLEAN NOT NULL
   );
   ```

1. Add a feature flag that starts out disabled:

   ```sql
   INSERT INTO feature_flags (feature_name, enabled)
   VALUES ('new_checkout_process', FALSE);
   ```

This mirrors a typical release stage: the feature is deployed, but it stays inactive until the flag is turned on.

## Enable the feature flag

Run the following statement in the **SQL Editor** to turn on the feature:

```sql
UPDATE feature_flags SET enabled = TRUE WHERE feature_name = 'new_checkout_process';
```

In production, a step like this usually runs as part of your CI/CD pipeline.

## Find when the feature was enabled

Because the complaints started right after the release, your first step is to pin down exactly when the `new_checkout_process` flag was turned on. In a real investigation, you'd get this timestamp from your deployment logs or CI/CD pipeline history. In this tutorial, the activation time is `2025-08-06 at 10:52 PM IST`.

To find the timestamp of your own `UPDATE`, select **History** in the left pane of the **SQL Editor**:

![SQL Editor History pane showing the timestamp of the UPDATE statement](/docs/guides/time_travel_tutorial_activation.png)

<Admonition type="note">
The Neon Console shows timestamps in your local time zone. The time in this screenshot, `2025-08-06 at 10:52 PM IST`, is `2025-08-06 at 5:22 PM UTC`.
</Admonition>

## Check the flag before activation

Confirm that the feature was disabled just before the flag was turned on.

1. Select the **Time Travel** (🕣) icon in the **SQL Editor** and turn on **Time Travel Enabled**.

1. In the date and time selector, choose a time just before the activation timestamp. This example uses `2025-08-06 at 10:51 PM IST`, one minute before activation.

1. Run the query:

   ```sql
   SELECT * FROM feature_flags WHERE feature_name = 'new_checkout_process';
   ```

   The flag shows `f` (false), as expected.

   ![Time Travel query showing the flag disabled one minute before activation](/docs/guides/time_travel_tutorial_before.png)

## Check the flag after activation

Now check the flag's state just after activation.

1. In the date and time selector, choose a time just after the activation timestamp. This example uses `2025-08-06 at 10:53 PM IST`, one minute after activation.

1. Run the same query again:

   ```sql
   SELECT * FROM feature_flags WHERE feature_name = 'new_checkout_process';
   ```

   The flag now shows `t` (true).

   ![Time Travel query showing the flag enabled one minute after activation](/docs/guides/time_travel_tutorial_after.png)

The flag changed state at the same moment the complaints started, which points to the new checkout process as the likely cause. From here, you can turn off the flag, fix the problem, and update stakeholders.

</Steps>

## Use Time Travel from the CLI

You can run the same point-in-time queries without the Console. The Neon CLI returns a connection string for a branch at a specific timestamp (RFC 3339 format), and `--psql` connects you directly:

```bash
neon connection-string main@2025-08-06T17:21:00Z --psql
```

Then run the same `SELECT` query. For more options, including connecting at a specific LSN, see [Time Travel](/docs/postgres/backup-restore/time-travel-assist).

<NeedHelp/>
