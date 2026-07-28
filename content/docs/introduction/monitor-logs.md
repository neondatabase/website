---
title: Monitor logs
subtitle: View, search, and download logs across your Neon services
summary: >-
  The Logs tab on the Monitoring page shows logs from every service on a
  branch (Functions, Object Storage, or both) in one view. Filter by level
  (DEBUG, INFO, NOTICE, WARN, ERROR, FATAL) or service name, search log
  bodies, poll for new lines with Go live, and download the current view as
  a .log file. Logs are retained for 3 days.
enableTableOfContents: true
---

The **Logs** tab on the Monitoring page shows logs from every service on a branch in one place. It's the same view whether you land on it directly or jump to it from a specific function or storage bucket.

## View logs

1. In the Neon Console, select a project and branch.
2. Go to **Monitoring**.
3. Select the **Logs** tab.

By default, the view shows logs from every service on the branch. Use the entity chips, **All**, **Functions**, and **Storage**, to scope the view to one kind of service, or narrow further with the service name field (see [Scope by service](#scope-by-service)).

You can also jump straight to a scoped view without visiting Monitoring first:

- From the **Functions** list, open a function's menu and select **View logs**.
- From the Object Storage **bucket** list, open a bucket's menu and select **View logs**.

Each row shows a timestamp, a level, and the log message. Expand a row to see its full context: `timestamp`, `severity`, `entity_type`, `scope_name`, and `service_name`. `entity_type` identifies the kind of service a line came from (`function` or `storage`); `service_name` identifies the specific one (`neon-function/<slug>` or `neon-storage/<bucket>`).

For what these fields mean for a given service, and how each service maps its own output onto the shared level set, see [Function logs](/docs/compute/functions/logs) or [Object Storage logs](/docs/storage/logs).

## Scope by service

Use the service name field to narrow the view to one function or bucket. It matches a substring by default; click the `~`/`=` toggle next to it to switch to an exact match on the full name.

## Log levels

Every service reports logs on the same shared level set: `DEBUG`, `INFO`, `NOTICE`, `WARN`, `ERROR`, `FATAL`. Not every service emits every level. See the service-specific pages linked above for what each one actually produces.

## Filter and search

Use the level chips to show only the levels you care about, and the search box to match a literal, case-insensitive substring in the log body. Use the time-range chips (`5m`, `15m`, `1h`, `6h`, `24h`, `7d`) to change the query window. Logs are retained for only 3 days (see [Retention](#retention)), so the `7d` option is selectable but can't return anything older than 3 days back.

If a query matches more than 1,000 lines, the view shows only the most recent 1,000 and displays a banner telling you to narrow the time range or add a search to see the rest.

If no logs match the current filters, the empty state offers a **Widen time range** button that expands the query window in one click.

## Go live

**Go live** polls for new log lines every 5 seconds; it isn't a push-based live tail. Toggle it off to stop polling and inspect a static view.

## Download

**Download** saves the log lines currently loaded in the view, exactly as filtered, to a plain-text `.log` file, newest first. Downloading doesn't re-run the query against the full retention window: it's a snapshot of what's on screen, so narrow your search, levels, and time range first if you want a smaller or more targeted file.

## Retention

Logs are retained for **3 days**. Once a log line falls outside that window, it's no longer queryable in the Console.

<NeedHelp/>
