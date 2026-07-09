---
title: Neon Functions logs
subtitle: View, search, and download logs for a deployed function.
summary: >-
  View a deployed function's logs in the Neon Console: filter by level
  (DEBUG, INFO, NOTICE, WARN, ERROR, FATAL), search log bodies, poll for new
  lines with Go live, and download the current view as a .log file. Logs are
  retained for 3 days.
enableTableOfContents: true
---

<PrivatePreviewEnquire/>

Every deployed function streams its logs to the Neon Console: standard output and standard error from your handler, plus a platform-emitted `invoke begin` / `invoke end` line around each request.

## View logs

In the Neon Console, open **Functions**, select a function, and go to the **Logs** tab. Each row shows a timestamp, a level, and the log message. Expand a row to see its full context: `timestamp`, `severity`, `entity_type`, `scope_name`, and `service_name`.

`scope_name` distinguishes platform-emitted lines from your own output:

- `neon.function.request`: the `invoke begin` / `invoke end` line the platform emits around each request.
- Your own `console.log`/`console.error` output is scoped to the function's app logs, alongside whatever your handler or dependencies print.

## Log levels

A function's log level comes from the `console` method used to emit it:

| Level   | Emitted by                    |
| ------- | ----------------------------- |
| `DEBUG` | `console.debug`               |
| `INFO`  | `console.log`, `console.info` |
| `WARN`  | `console.warn`                |
| `ERROR` | `console.error`               |

`NOTICE` and `FATAL` also appear as filters in the log viewer but aren't currently emitted by Functions; they're part of the console's shared log-level set.

## Filter and search

Use the level chips to show only the levels you care about, and the search box to match a literal, case-insensitive substring in the log body. Use the time-range chips (`5m`, `15m`, `1h`, `6h`, `24h`, `7d`) to change the query window. Logs are currently retained for only 3 days (see [Retention](#retention)), so the `7d` option is selectable but can't return anything older than 3 days back.

## Go live

**Go live** polls for new log lines every 5 seconds; it isn't a push-based live tail. Toggle it off to stop polling and inspect a static view.

## Download

**Download** saves the log lines currently loaded in the view, exactly as filtered, to a plain-text `.log` file, newest first:

```text
2026-07-09T19:31:43.902476000Z    INFO    invoke end
2026-07-09T19:31:43.831541000Z    INFO    invoke begin
```

Downloading doesn't re-run the query against the full retention window. It's a snapshot of what's on screen, so narrow your search, levels, and time range first if you want a smaller or more targeted file.

## Retention

Function logs are retained for **3 days**. Once a log line falls outside that window, it's no longer queryable in the Console.

<NeedHelp/>
