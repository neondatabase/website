---
title: Why your cron job keeps Neon awake, and what to do about it
subtitle: Move your schedules to Function Triggers, which fire even while your compute is scaled to zero, and run jobs that query the database every 15 minutes or less often so it can sleep between runs
author: neon-team
enableTableOfContents: true
isDraft: false
createdAt: '2026-11-20T00:00:00.000Z'
updatedOn: '2026-11-20T14:56:15.533Z'
---

You picked Neon because it [scales to zero](/docs/introduction/scale-to-zero), so you expected to pay only when your app is in use. Then the [monitoring page](/docs/introduction/monitoring-page) shows your compute active all day, every day. Very often the cause is one line in a scheduler: a job that runs every few minutes.

This guide explains why a frequent job stops your compute from sleeping, what it costs, and how to keep scheduled work without paying for a compute that's on 24/7.

## The 5-minute rule

By default, Neon suspends a compute after 5 minutes of inactivity. Each query resets that timer. So whether your compute ever sleeps comes down to how long the longest gap between queries is:

- A job every minute never leaves a gap of 5 minutes = the compute never sleeps.
- A job every 5 minutes resets the timer just as it's about to run out = in practice the compute never sleeps
- A job every 15 minutes lets the compute sleep for about 10 minutes out of every 15, minus the time the job itself takes
- A job every hour lets the compute sleep for most of each hour

The scheduler itself doesn't matter. A Vercel cron, a GitHub Actions schedule, a worker on a VM, or an uptime check all count the same - if they query the database, they reset the timer.

## What it costs

To illustrate the effect of this, here's what each cadence would mean for a compute at the smallest size, 0.25 CU, when nothing else is using the database. These estimates assume each run takes about a minute and the compute stays on for 5 minutes after the last query:

| Job cadence      | Compute active per day | CU-hours per month | Launch plan cost |
| ---------------- | ---------------------- | ------------------ | ---------------- |
| Every minute     | 24 hours               | ~182               | ~$19             |
| Every 5 minutes  | ~24 hours              | ~182               | ~$19             |
| Every 15 minutes | ~9.6 hours             | ~72                | ~$8              |
| Every hour       | ~2.4 hours             | ~18                | ~$2              |
| Once a night     | ~6 minutes             | ~1                 | ~$0.10           |

If your job runs on a compute that autoscales above 0.25 CU, multiply accordingly.

## Other things that keep a compute on

If you've fixed your cron job and the compute still doesn't scale to zero, something else is probably connecting to it. Our [cost optimization guide](/docs/introduction/cost-optimization) lists the most common causes:

- **Long-lived connections:** an app server or connection pool that holds connections open and runs keepalive queries can stop the compute from scaling to zero.
- **Monitoring tools:** dashboards, uptime checks, and metrics exporters that query Postgres every few seconds or minutes work just like a cron job.
- **Logical replication from Neon:** if Neon is the publisher, the compute stays active while subscribers are connected.

To see what's connected, run this while the compute is active:

```sql
SELECT application_name, client_addr, state, backend_start, state_change
FROM pg_stat_activity
WHERE datname = current_database()
  AND pid <> pg_backend_pid();
```

Look for connections that have been open for hours (`backend_start`) but were last active a few seconds ago (`state_change`). Those are probably what's keeping your compute on.

### What about pg_cron

[`pg_cron`](/docs/extensions/pg_cron) schedules jobs from inside Postgres, so it only runs while the compute is active. It doesn't wake a compute that has scaled to zero. Its jobs run if something else has woken the compute, and are skipped if not.

That makes it a good fit for maintenance on a compute that's always on. For scheduled work on a compute that scales to zero, use a scheduled Function Trigger instead (see below), which fires even while the compute is suspended.

## How to stop a scheduled job from keeping your compute on

### Move scheduled work to a Function Trigger

Schedule recurring work with a [Function Trigger](/docs/compute/functions/triggers/schedule) instead of an external cron, a worker on a VM, or `pg_cron`. A scheduled trigger calls a [Neon Function](/docs/compute/functions/overview) on a five-field UTC cron expression, and it fires even while your compute is scaled to zero. The function runs next to your data, on the same branch and in the same region, with `DATABASE_URL` injected. Functions are available on every plan, including Free, though only in some AWS regions for now.

The trigger itself doesn't wake Postgres, the function's first query does. So have the function check whether there's work before it touches the database, for example by reading a queue, calling an API, or looking at a flag outside Postgres, and return early when there's nothing to do. A run that does need the database wakes it, does its work, and lets it go back to sleep 5 minutes later.

### Query the database less often

A trigger doesn't change the 5-minute rule: a function that queries Postgres every minute keeps the compute on, like any other client. So ask whether the job really needs the database that often.

Many jobs that check for new work, like sending pending emails, syncing a feed, or recalculating stats, are fine every 15 minutes or every hour, especially if they process everything that's waiting in one run. Going from every 5 minutes to every hour cuts the compute this job uses by about 90%.

### Close idle connections

If a long-running server holds connections open, use the [connection pooler](/docs/connect/connection-pooling) and configure your client pool to close idle connections, so the database sees no activity between real requests.

### Or keep the compute on, on purpose

Some workloads really do need the database available every minute. If your app has steady traffic all day, scale to zero doesn't help much anyway. On the Launch plan you can [turn off scale to zero](/docs/guides/scale-to-zero-guide), and on Scale you can set the timeout from 1 minute up to always on. Then a frequent job costs nothing extra, and `pg_cron` works as you'd expect.

## Summary

Neon sleeps after 5 minutes without queries. Any job that queries the database every 5 minutes or more often keeps the compute on 24/7 - this eats about 182 CU-hours a month at 0.25 CU.

To fix this, move schedules to Function Triggers (which fire while your compute sleeps), make sure you're querying the database only when there's work and no more often than you need, and close idle connections.

<NeedHelp/>
