---
title: Neon Functions preview access
subtitle: What's included in the Neon Functions private preview.
summary: >-
  Neon Functions is in private preview for new projects in the AWS us-east-2
  region. Learn how to request access, what's included, and the current
  limitations.
enableTableOfContents: true
updatedOn: '2026-06-24T15:13:00.240Z'
---

## Request access

Sign up at [neon.com/blog/were-building-backends](https://neon.com/blog/were-building-backends#access). The team will reach out with access details. Functions are available on new projects only.

## What's included

- Deploy Node.js 24 HTTP handlers to Neon branches
- Workers-compatible handler interface (`fetch(request)` export)
- Long-running compute: WebSocket servers, SSE endpoints, AI agents
- Zero-config access to Postgres, the [AI Gateway](/docs/ai-gateway/overview), and [Object Storage](/docs/storage/overview): credentials are injected automatically when the service is enabled
- `neonctl dev` for local development with hot reload
- `neon.ts` config with `neonctl deploy` for declarative branch setup
- `neonctl functions deploy` for direct CLI deployment
- Neon API for programmatic deployment
- Branch-scoped functions: each branch runs its own version at its own URL

## What's not included

**Memory is fixed at 2048 MiB.** Memory configuration isn't available during the preview.

**Background jobs are not supported.** Functions are request/response: every invocation starts from an incoming request and returns a response. `waitUntil` runs post-response work for up to 15 minutes, for short cleanup tasks (analytics writes, audit logs), not long-running jobs. Use a dedicated queue or scheduler (a separate, upcoming Neon offering) for work that needs its own lifecycle. See [Runtime limits](/docs/compute/functions/reference/runtime-limits) for details.

**Billing isn't active yet.** Functions usage isn't billed during the private preview.

**Available in AWS us-east-2 only.** Other regions aren't available during the preview.

## Known limitations

- `neonctl` ships `esbuild` for most platforms. If bundling fails with an `esbuild not found` error, install it (`npm install -g esbuild`) or set `NEON_ESBUILD_PATH` to an esbuild binary.
- Slug names are restricted to `^[a-z0-9]{1,20}$`. No hyphens, no uppercase. Use the `name` field for a human-readable label.
- Logs from deployed functions can't be retrieved yet. Use `neonctl dev` to see output during development; deployed functions must record diagnostics themselves (in Postgres, or in the response).

## Feedback

The preview feedback channel will be shared in your access confirmation email.

<NeedHelp/>
