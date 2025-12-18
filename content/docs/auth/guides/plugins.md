---
title: Plugins
subtitle: Supported Better Auth plugins in Neon Auth
enableTableOfContents: true
updatedOn: '2025-12-18T00:00:00.000Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/), which supports a variety of plugins to extend authentication functionality.

Because Neon Auth is a **managed** Better Auth service, you **don’t install or configure Better Auth plugins yourself**. Instead, Neon Auth exposes a subset of Better Auth plugins through Neon-managed APIs and the Neon SDK.

Neon Auth currently supports the following Better Auth plugins:

## Supported plugins

| Plugin                                                                | Status                                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Email OTP](/docs/auth/guides/plugins/email-otp)                      | ✅ Supported                                                 |
| [Admin](https://www.better-auth.com/docs/plugins/admin)               | ✅ Supported                                                 |
| [Organization](https://www.better-auth.com/docs/plugins/organization) | ⚠️ Partial (invitation emails, JWT token claims in progress) |

For the latest status (including what’s coming next), see the [Neon Auth roadmap](/docs/auth/roadmap).

<NeedHelp/>
