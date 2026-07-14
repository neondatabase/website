---
title: Neon Functions logs
subtitle: View, search, and download logs for a deployed function.
summary: >-
  View a deployed function's logs in the Neon Console: standard output and
  standard error from your handler, plus a platform-emitted invoke begin /
  invoke end line around each request. Covers the console-method-to-level
  mapping and common log entries that look like a problem but aren't.
enableTableOfContents: true
---

<PrivatePreviewEnquire/>

Every deployed function streams its logs to the Neon Console: standard output and standard error from your handler, plus a platform-emitted `invoke begin` / `invoke end` line around each request:

```text
2026-07-09T19:31:43.902476000Z    INFO    invoke end
2026-07-09T19:31:43.831541000Z    INFO    invoke begin
```

## View logs

Function logs live on the branch's [Monitoring page, in the Logs tab](/docs/introduction/monitor-logs), the same shared viewer used for every service on the branch. To jump straight to one function's logs, open the **Functions** list, open that function's menu, and select **View logs**. Or go to **Monitoring** > **Logs** and click the **Functions** chip to see every function's logs together.

Expand a row to see its full context: `timestamp`, `severity`, `entity_type`, `scope_name`, and `service_name`.

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

## Common log entries

Most of what shows up in your logs is your own `console.log`/`console.error` output. A few entries look like something's wrong when it isn't, or point you somewhere other than the log itself. Here's what to do when you see them.

**Seeing this SSL warning on cold start? Ignore it, or set `sslmode=verify-full` to silence it.**

```text
(node:95) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
```

It's a `pg` (node-postgres) deprecation warning, not a connection problem: the injected `DATABASE_URL` uses `sslmode=require`, and `pg` warns on that mode regardless of whether anything is wrong. It logs at `ERROR` because Functions maps all `stderr` output to `ERROR`, not because the severity was assessed. If you'd rather not see it, connect with `sslmode=verify-full` explicitly instead of relying on the default.

**Seeing an `ERROR` `invoke end` with no other detail? It's not your code, don't debug your handler for it.** The platform never puts internal failure detail (no execution node reachable, a launch or scheduler failure) into customer-facing logs, so this line won't tell you more than "the platform failed to complete this request." Retry; if it keeps happening, contact support rather than searching your own code for the cause. (Your own handler returning an error response is a different case and logs as `INFO`, since the platform still successfully invoked your function.)

**Requests not showing up in your logs at all? Check the invocation URL and branch, not the logs.** A wrong branch, a typo'd slug, or a momentary control-plane hiccup returns a 404 or 503 straight to the caller and never reaches your function's log stream, because the platform hasn't resolved which function to attribute logs to yet. If you expect traffic and see nothing, the request likely never reached your function.

**Function not starting after a deploy? Read the response body, not the logs.** A missing entry point, an import that throws at load time, or a default export of the wrong shape returns a `function_load_failed` error with your actual error message in the response body of the failed request, not as a log line. Check the response you got back from calling the function, not the Logs tab.

## Filter, search, and retention

For details on filtering by level or service name, searching log bodies, live tail, downloading logs, and the 3-day retention window, see [Monitor logs](/docs/introduction/monitor-logs).

<NeedHelp/>
