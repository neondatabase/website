---
title: Plugins
subtitle: Supported Better Auth plugins in Neon Auth
summary: >-
  Neon Auth exposes a managed subset of Better Auth plugins (Admin, Email OTP,
  JWT, Magic Link, Organization, Open API, Phone Number) through the Neon SDK;
  plugins are not installed or configured directly. Use this page to check which
  plugins are fully supported versus partially supported, and how to configure
  them via the Neon Console or Neon API. The Organization plugin has partial
  support while JWT token claims are still under development.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
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
| [Magic Link](/docs/auth/guides/plugins/magic-link)     | ✅ Supported                                    |
| [Organization](/docs/auth/guides/plugins/organization) | ⚠️ Partial (JWT token claims under development) |
| [Open API](/docs/auth/guides/plugins/openapi)          | ✅ Supported                                    |
| [Phone Number](/docs/auth/guides/plugins/phone-number) | ✅ Supported                                    |

For more runnable Neon Auth samples, see the [neondatabase/neon-js](https://github.com/neondatabase/neon-js/tree/main/examples) examples repository:

| Plugin       | Demo                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Organization | [neon-auth-orgs-example](https://github.com/neondatabase/neon-js/tree/main/examples/neon-auth-orgs-example)             |
| Magic Link   | [neon-auth-magic-link-example](https://github.com/neondatabase/neon-js/tree/main/examples/neon-auth-magic-link-example) |
| Phone Number | [nextjs-phone-login](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login)                     |

For the latest status (including what’s coming next), see the [Neon Auth roadmap](/docs/auth/roadmap).

<NeedHelp/>
