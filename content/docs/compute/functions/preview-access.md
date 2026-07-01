---
title: Neon Functions preview access
subtitle: What's included in the Neon Functions private preview.
summary: >-
  Neon Functions is in private preview for new projects in the AWS us-east-2
  region. Learn how to request access, what's included, and the current
  limitations.
enableTableOfContents: true
updatedOn: '2026-06-24T23:12:20.545Z'
---

## Request access

Sign up at [neon.com/blog/were-building-backends](https://neon.com/blog/were-building-backends#access). The team will reach out with access details. Functions are available on new projects in AWS us-east-2 only, created on or after June 15, 2026.

## What's included

- Deploy Node.js 24 HTTP handlers to Neon branches
- Web Fetch API handler interface (`fetch(request)` export)
- Long-running compute: WebSocket servers, SSE endpoints, AI agents
- Postgres, [AI Gateway](/docs/ai-gateway/overview), and [Object Storage](/docs/storage/overview) credentials injected automatically when the service is enabled
- `neon dev` for local development with hot reload
- `neon.ts` config with `neon deploy` for declarative branch setup
- `neon functions deploy` for direct CLI deployment
- Neon API for programmatic deployment
- Branch-scoped functions: each branch runs its own version at its own URL

## What's not included

**Memory is fixed at 2048 MiB** and can't be configured during the preview.

**No native job queue.** Functions are request/response: each invocation handles an incoming request and returns a response, a natural fit for REST APIs, webhooks, AI agents, and backend control planes. `waitUntil` runs short post-response work for up to 15 minutes (analytics writes, audit logs, webhook fan-outs, agent callbacks), not long-running jobs. For queued, retryable work, pair a function with a third-party queue or scheduler like [Upstash QStash](https://upstash.com/docs/qstash) or [Inngest](https://www.inngest.com); a native Neon queue and workflow engine is a separate, upcoming offering. See [Runtime limits](/docs/compute/functions/reference/runtime-limits) for details.

**Billing isn't active during the private preview.** Functions usage isn't billed yet.

**Available in AWS us-east-2 only.** Other regions aren't available during the preview.

## Known limitations

- `neon` ships `esbuild` for most platforms. If bundling fails with an `esbuild not found` error, install it (`npm install -g esbuild`) or set `NEON_ESBUILD_PATH` to an esbuild binary.
- Slug names are restricted to `^[a-z0-9]{1,20}$`. No hyphens, no uppercase. Use the `name` field for a human-readable label.
- Logs from deployed functions can't be retrieved yet. Use `neon dev` to see output during development; deployed functions must record diagnostics themselves (in Postgres, or in the response).

## Feedback

The preview feedback channel will be shared in your access confirmation email.

<NeedHelp/>
