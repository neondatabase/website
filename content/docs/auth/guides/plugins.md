---
title: Plugins
subtitle: Supported Better Auth plugins in Neon Auth
summary: >-
  Covers the supported Better Auth plugins in Neon Auth, detailing their status
  and management through the Neon SDK without direct installation or
  configuration by users.
enableTableOfContents: true
updatedOn: '2026-05-27T14:28:53.887Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/), which supports a variety of plugins to extend authentication functionality.

<Admonition type="info" title="Plugins are managed by Neon Auth">
Neon Auth is a **managed** Better Auth service. You **don’t install or configure Better Auth plugins directly** - instead, Neon Auth exposes a supported subset of plugins through the Neon SDK.

For plugins that have Console settings (for example [Organization](/docs/auth/guides/plugins/organization)), open **Auth** > **Plugins** (beta) in the Neon Console, or use the Neon API. Additional plugin options may still arrive over time; see the [Neon Auth roadmap](/docs/auth/roadmap).
</Admonition>

The following Better Auth plugins are currently supported in Neon Auth:

## Supported plugins

| Plugin                                                 | Status       |
| ------------------------------------------------------ | ------------ |
| [Admin](/docs/auth/guides/plugins/admin)               | ✅ Supported |
| [Email OTP](/docs/auth/guides/plugins/email-otp)       | ✅ Supported |
| [JWT](/docs/auth/guides/plugins/jwt)                   | ✅ Supported |
| [Magic Link](/docs/auth/guides/plugins/magic-link)     | ✅ Supported |
| [Organization](/docs/auth/guides/plugins/organization) | ✅ Supported |
| [Open API](/docs/auth/guides/plugins/openapi)          | ✅ Supported |
| [Phone Number](/docs/auth/guides/plugins/phone-number) | ✅ Supported |

For more runnable Neon Auth samples, see the [neondatabase/neon-js](https://github.com/neondatabase/neon-js/tree/main/examples) examples repository:

| Plugin       | Demo                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Organization | [neon-auth-orgs-example](https://github.com/neondatabase/neon-js/tree/main/examples/neon-auth-orgs-example)             |
| Magic Link   | [neon-auth-magic-link-example](https://github.com/neondatabase/neon-js/tree/main/examples/neon-auth-magic-link-example) |
| Phone Number | [nextjs-phone-login](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login)                     |

For the latest status (including what’s coming next), see the [Neon Auth roadmap](/docs/auth/roadmap).

<NeedHelp/>
