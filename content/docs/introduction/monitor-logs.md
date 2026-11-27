---
title: Monitor logs
subtitle: View, search, and download logs for Functions, Object Storage, Realtime, and Managed Better Auth
summary: >-
  Logs for Functions, Object Storage, Realtime, and Managed Better Auth live on
  the Monitoring page, split across the Functions, Storage, Realtime, and Auth
  tabs (one viewer per service, no combined view). Filter by level (DEBUG, INFO, NOTICE, WARN, ERROR, FATAL) or service
  name, search log bodies, poll for new lines with Go live, and download the
  current view as a .log file.
enableTableOfContents: true
updatedOn: '2026-11-27T09:42:21.822Z'
---

The Monitoring page shows service logs in four tabs: **Functions**, **Storage**, **Realtime**, and **Auth**. Each tab is a log viewer for that service on the current branch; there is no combined, all-services view. The tabs share the same controls, described below. The **Realtime** tab appears only on branches where [Realtime](/docs/realtime/overview) is available. The **Auth** tab shows [Managed Better Auth](/docs/auth/overview) events, such as sign-ups and sign-ins.

<Admonition type="note" title="Turn on logs export for the Auth tab">
Managed Better Auth events appear on the **Auth** tab only while logs export is on for the branch. Export is on by default when you enable Managed Better Auth on a branch, but a branch that had Managed Better Auth before logs export was available may have it off, and its **Auth** tab stays empty. To turn it on, go to **Settings** > **Better Auth**, and under **Logs**, turn on **Enable logs**. You can also use the [Neon API or CLI](/docs/auth/guides/manage-auth-api#export-managed-better-auth-logs). Turning export off stops new events, but events already exported stay visible.
</Admonition>

## View logs

1. In the Neon Console, select a project and branch.
2. Go to **Monitoring**.
3. Open the **Functions**, **Storage**, **Realtime**, or **Auth** tab.

Each tab shows logs from every function or bucket on the branch. Narrow to a single service with the service name field (see [Scope by service](#scope-by-service)).

You can also jump straight to a service's tab without visiting Monitoring first:

- From the **Functions** list, open a function's menu and select **View logs**.
- From the Object Storage **bucket** list, open a bucket's menu and select **View logs**.

Both land you on the matching tab.

Each row shows a timestamp, a level, and the log message. Expand a row to see its full context: `timestamp`, `severity`, `entity_type`, `scope_name`, and `service_name`. `entity_type` identifies the kind of service a line came from (`function` or `storage`); `service_name` identifies the specific one (`neon-function/<slug>` or `neon-storage/<bucket>`). Managed Better Auth lines use the service name `neon-auth`, with scope names such as `neon.auth.sign_in` and `neon.auth.sign_up`.

For what these fields mean for a given service, and how each service maps its own output onto the shared level set, see [Function logs](/docs/compute/functions/logs), [Object Storage logs](/docs/storage/logs), or [Export Managed Better Auth logs](/docs/auth/guides/manage-auth-api#export-managed-better-auth-logs).

## Scope by service

Use the service name field to narrow the view to one function or bucket. It matches a substring by default; click the `~`/`=` toggle next to it to switch to an exact match on the full name.

## Log levels

Every service reports logs on the same shared level set: `DEBUG`, `INFO`, `NOTICE`, `WARN`, `ERROR`, `FATAL`. Not every service emits every level. See the service-specific pages linked above for what each one actually produces.

## Filter and search

Use the level chips to show only the levels you care about, and the search box to match a literal, case-insensitive substring in the log body. Use the time-range chips (`5m`, `15m`, `1h`, `6h`, `24h`, `7d`) to change the query window.

If a query matches more than 1,000 lines, the view shows only the most recent 1,000 and displays a banner telling you to narrow the time range or add a search to see the rest.

If no logs match the current filters, the empty state offers a **Widen time range** button that expands the query window in one click.

## Go live

**Go live** polls for new log lines every 5 seconds; it isn't a push-based live tail. Toggle it off to stop polling and inspect a static view.

## Download

**Download** saves the log lines currently loaded in the view, exactly as filtered, to a plain-text `.log` file, newest first. Downloading doesn't re-run the query: it's a snapshot of what's on screen, so narrow your search, levels, and time range first if you want a smaller or more targeted file.

## Log retention

Neon keeps logs for about 30 days after it receives them. Retention counts from when Neon receives a log, not from the timestamp the log carries. Each query covers at most 7 days, which is the widest time range the chips offer. Logs older than 30 days may no longer be available.

## Query logs from the CLI

The same branch logs are available from the terminal with [`neon logs query`](/docs/cli/logs), so you can filter and script against them without opening the Console:

```bash
neon logs query --since 30m
```

Combine filters like `--source`, `--service-name`, and `--severity-text`, or pass a raw `--logql` expression.

To read logs with a tool that speaks the Loki HTTP API, use the branch's [Loki-compatible read API](/docs/cli/logs#loki-read-api). [`neon logs loki`](/docs/cli/logs#loki) calls it from the terminal and prints its JSON response.

<NeedHelp/>
