---
title: Preview access
subtitle: What's included in the Neon Functions private preview.
summary: >-
  Neon Functions is in private preview for new projects in the AWS us-east-2
  region. This page covers how to request access, what's included, and the
  current limitations.
enableTableOfContents: true
---

<Admonition type="note" title="Private Preview">
Neon Functions is currently in Private Preview, available for new projects in the AWS us-east-2 region only. To request access, sign up at [We're building backends](https://neon.com/blog/were-building-backends).
</Admonition>

## Request access

Sign up for the waitlist at [neon.com/blog/were-building-backends](https://neon.com/blog/were-building-backends). The team will reach out with access details. Functions are available on new projects only; you can't enable them on an existing project.

## What's included

- Deploy Node.js 24 HTTP handlers to Neon branches
- Workers-compatible handler interface (`fetch(request)` export)
- Long-running compute: WebSocket servers, SSE endpoints, AI agents
- `DATABASE_URL` auto-injected from the branch's Postgres database
- `neonctl dev` for local development with hot reload
- `neonctl functions deploy` for CLI deployment
- Neon API for programmatic deployment
- Branch-scoped functions: each branch runs its own version at its own URL

## What's not included

**Memory is fixed at 2048 MiB.** Memory configuration isn't available during the preview.

**Background jobs are not supported.** `waitUntil` runs post-response work for up to 15 minutes. It's for short cleanup tasks (analytics writes, audit logs), not long-running jobs. Use a dedicated queue or scheduler for work that needs its own lifecycle. `waitUntil` is currently a stub; see [Runtime limits](/docs/compute/functions/reference/runtime-limits) for details.

**Billing isn't active yet.** Functions usage isn't billed during the private preview.

**Available in AWS us-east-2 only.** Other regions aren't available during the preview.

## Known limitations

- `neonctl` ships `esbuild` for most platforms. If bundling fails with an `esbuild not found` error, install it (`npm install -g esbuild`) or set `NEON_ESBUILD_PATH` to an esbuild binary.
- Slug names are restricted to `^[a-z0-9]{1,20}$`. No hyphens, no uppercase. Use the `name` field for a human-readable label.

## Feedback

The preview feedback channel will be shared in your access confirmation email.

<NeedHelp/>
