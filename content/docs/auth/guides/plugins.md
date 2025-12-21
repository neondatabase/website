---
title: Plugins
subtitle: Supported Better Auth plugins in Neon Auth
enableTableOfContents: true
updatedOn: '2025-12-18T00:00:00.000Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/), which supports a variety of plugins to extend authentication functionality.

<Admonition type="info" title="Plugins are managed by Neon Auth">
Neon Auth is a **managed** Better Auth service. You **don’t install or configure Better Auth plugins directly** - instead, Neon Auth exposes a supported subset of plugins through the Neon SDK.

More granular controls like enabling/disabling specific plugins and customizing plugin behavior are on the roadmap.
</Admonition>

The following Better Auth plugins are currently supported in Neon Auth:

## Supported plugins

| Plugin                                                 | Status                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| [Email OTP](/docs/auth/guides/plugins/email-otp)       | ✅ Supported                                                 |
| [Admin](/docs/auth/guides/plugins/admin)               | ✅ Supported                                                 |
| [Organization](/docs/auth/guides/plugins/organization) | ⚠️ Partial (invitation emails, JWT token claims in progress) |
| [JWT](/docs/auth/guides/plugins/jwt)                   | ✅ Supported                                                 |

For the latest status (including what’s coming next), see the [Neon Auth roadmap](/docs/auth/roadmap).

<NeedHelp/>
