---
title: Plugins
subtitle: Supported Better Auth plugins in Neon Auth
summary: >-
  Covers the supported Better Auth plugins in Neon Auth, detailing their status
  and management through the Neon SDK without direct installation or
  configuration by users.
enableTableOfContents: true
updatedOn: '2026-04-09T23:59:58.000Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/), which supports a variety of plugins to extend authentication functionality.

<Admonition type="info" title="Plugins are managed by Neon Auth">
Neon Auth is a **managed** Better Auth service. You **don’t install or configure Better Auth plugins directly** - instead, Neon Auth exposes a supported subset of plugins through the Neon SDK.

For plugins that have Console settings (for example [Organization](/docs/auth/guides/plugins/organization)), open **Auth** > **Plugins** (beta) in the Neon Console, or use the Neon API. Additional plugin options may still arrive over time; see the [Neon Auth roadmap](/docs/auth/roadmap).
</Admonition>

The following Better Auth plugins are currently supported in Neon Auth:

## Supported plugins

| Plugin                                                 | Status                                          |
| ------------------------------------------------------ | ----------------------------------------------- |
| [Admin](/docs/auth/guides/plugins/admin)               | ✅ Supported                                    |
| [Email OTP](/docs/auth/guides/plugins/email-otp)       | ✅ Supported                                    |
| [JWT](/docs/auth/guides/plugins/jwt)                   | ✅ Supported                                    |
| [Organization](/docs/auth/guides/plugins/organization) | ⚠️ Partial (JWT token claims under development) |
| [Open API](/docs/auth/guides/plugins/openapi)          | ✅ Supported                                    |

For more runnable Neon Auth samples, see [Example applications](/docs/auth/overview#example-applications). The **Organization** plugin demo is **[neon-auth-orgs-example](https://github.com/neondatabase/neon-js/tree/main/examples/neon-auth-orgs-example)**; see the [Organization plugin](/docs/auth/guides/plugins/organization) page for context.

For the latest status (including what’s coming next), see the [Neon Auth roadmap](/docs/auth/roadmap).

<NeedHelp/>
