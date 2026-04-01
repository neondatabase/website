---
title: Neon Auth roadmap
subtitle: What's supported today and what's coming next
summary: >-
  Covers the current support status and future roadmap for Neon Auth, including
  frameworks, authentication methods, Better Auth plugins, platform features,
  SDK references, and migration guides.
enableTableOfContents: true
updatedOn: '2026-03-23T15:16:28.134Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is in active development. This page shows what's currently supported and what we're working on next.

## General availability

Neon Auth is targeting general availability this quarter. We're actively working on additional plugins and features to bring Neon Auth out of beta.

## Frameworks

### Supported

| Framework               | Status       | Quick start                                           |
| ----------------------- | ------------ | ----------------------------------------------------- |
| Next.js                 | ✅ Supported | [Get started](/docs/auth/quick-start/nextjs-api-only) |
| Vite + React            | ✅ Supported | [Get started](/docs/auth/quick-start/react)           |
| React + React Router    | ✅ Supported | [Get started](/docs/auth/quick-start/react)           |
| React + TanStack Router | ✅ Supported | [Get started](/docs/auth/quick-start/tanstack-router) |

The [React quick start](/docs/auth/quick-start/react) steps through a **Vite** + React app. If you use **React Router** for URLs and layouts, use the same Neon Auth URL, `@neondatabase/neon-js` client, and SDK calls from that guide, then integrate them into your router and route components. For file-based routing with TanStack, use the TanStack Router quick start instead.

### On the roadmap

| Framework                     | Status          |
| ----------------------------- | --------------- |
| Standalone frontend + backend | 🔜 Coming soon  |
| Other frameworks              | Based on demand |

<Admonition type="note" title="Standalone architectures">
Architectures where frontend and backend are separate deployments (for example, Create-React-App with a separate Node/Express backend) are not yet supported. Neon Auth uses HTTP-only cookies for secure session management, and these cookies cannot be securely shared between frontend and backend applications on different domains. We're actively working on this.
</Admonition>

## Better Auth plugins

Neon Auth is built on [Better Auth](https://www.better-auth.com/). Not all Better Auth plugins are currently supported.

### Supported

| Plugin                                                                             | Status                                          |
| ---------------------------------------------------------------------------------- | ----------------------------------------------- |
| [Email & password](https://www.better-auth.com/docs/authentication/email-password) | ✅ Supported                                    |
| Social OAuth (Google, GitHub, Vercel)                                              | ✅ Supported                                    |
| [Email OTP](/docs/auth/guides/plugins/email-otp)                                   | ✅ Supported                                    |
| [Admin](/docs/auth/guides/plugins/admin)                                           | ✅ Supported                                    |
| [Organization](/docs/auth/guides/plugins/organization)                             | ⚠️ Partial (JWT token claims under development) |
| [JWT](/docs/auth/guides/plugins/jwt)                                               | ✅ Supported                                    |
| [Open API](/docs/auth/guides/plugins/openapi)                                      | ✅ Supported                                    |

See [Set up OAuth](/docs/auth/guides/setup-oauth) for Neon-specific OAuth configuration (including Vercel). Email flows such as verification and password reset are covered in [Email verification](/docs/auth/guides/email-verification), [Password reset](/docs/auth/guides/password-reset), and [User management](/docs/auth/guides/user-management).

### Platform (Console, API, webhooks)

These capabilities are documented in Neon Auth guides but are not Better Auth plugins you enable through the SDK.

| Capability                           | Status    | Documentation                                                    |
| ------------------------------------ | --------- | ---------------------------------------------------------------- |
| Trusted domains (redirect allowlist) | Supported | [Configure trusted domains](/docs/auth/guides/configure-domains) |
| Webhooks (auth events)               | Supported | [Webhooks](/docs/auth/guides/webhooks)                           |
| Manage Auth via Neon API             | Supported | [Manage Auth in the Neon API](/docs/auth/guides/manage-auth-api) |

Branch-aware auth (separate auth state per Neon branch) is supported; see [Branching authentication](/docs/auth/branching-authentication) and [Authentication flow](/docs/auth/authentication-flow).

### On the roadmap

| Plugin                                                            | Status          |
| ----------------------------------------------------------------- | --------------- |
| [Magic link](https://www.better-auth.com/docs/plugins/magic-link) | 🔜 Coming soon  |
| Phone number (bring your own SMS provider)                        | 🔜 Coming soon  |
| MFA support                                                       | 🔜 Coming soon  |
| [Admin](/docs/auth/guides/plugins/admin) plugin customization     | 🔜 Coming soon  |
| Other plugins                                                     | Based on demand |

## SDK and UI references

| Surface                           | Documentation                                            |
| --------------------------------- | -------------------------------------------------------- |
| TypeScript client SDK (`neon-js`) | [Neon TypeScript SDK](/docs/reference/javascript-sdk)    |
| Next.js server SDK                | [Next.js Server SDK](/docs/auth/reference/nextjs-server) |
| Pre-built UI components           | [UI components](/docs/auth/reference/ui-components)      |

## Migration guides

- [From Neon Auth SDK v0.1](/docs/auth/migrate/from-auth-v0.1)
- [From Stack Auth (legacy)](/docs/auth/migrate/from-legacy-auth)
- [From Supabase](/docs/auth/migrate/from-supabase)

## Production and checklist

For launch readiness, see the [production checklist](/docs/auth/production-checklist).

## Let us know

We prioritize based on demand. If you need a specific framework or plugin, let us know through our [Discord](https://discord.com/invite/neon) or [GitHub Discussions](https://github.com/orgs/neondatabase/discussions).

<NeedHelp/>
