---
title: Neon Auth roadmap
subtitle: What's supported today and what's coming next
summary: >-
  Covers the current support status and future roadmap for Neon Auth, detailing
  supported frameworks and upcoming features as it transitions out of beta.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.773Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is in active development. This page shows what's currently supported and what we're working on next.

## General availability

Neon Auth is targeting general availability this quarter. We're actively working on additional plugins and features to bring Neon Auth out of beta.

## Frameworks

### Supported

| Framework               | Status       | Quick start                                                   |
| ----------------------- | ------------ | ------------------------------------------------------------- |
| Next.js                 | ✅ Supported | [Get started](/docs/auth/quick-start/nextjs)                  |
| React + React Router    | ✅ Supported | [Get started](/docs/auth/quick-start/react-router-components) |
| React + TanStack Router | ✅ Supported | [Get started](/docs/auth/quick-start/tanstack-router)         |
| Vite + React            | ✅ Supported | [Get started](/docs/auth/quick-start/react)                   |

### On the roadmap

| Framework                     | Status          |
| ----------------------------- | --------------- |
| Standalone frontend + backend | 🔜 Coming soon  |
| Other frameworks              | Based on demand |

<Admonition type="note" title="Standalone architectures">
Architectures where frontend and backend are separate deployments (e.g., Create-React-App with a separate Node/Express backend) are not yet supported. Neon Auth uses HTTP-only cookies for secure session management, and these cookies cannot be securely shared between frontend and backend applications on different domains. We're actively working on this.
</Admonition>

## Better Auth plugins

Neon Auth is built on [Better Auth](https://www.better-auth.com/). Not all Better Auth plugins are currently supported.

### Supported

| Plugin                                                                                                                                            | Status                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Email & password](https://www.better-auth.com/docs/authentication/email-password)                                                                | ✅ Supported                                                 |
| Social OAuth ([Google](https://www.better-auth.com/docs/authentication/google), [GitHub](https://www.better-auth.com/docs/authentication/github)) | ✅ Supported                                                 |
| [Email OTP](/docs/auth/guides/plugins/email-otp)                                                                                                  | ✅ Supported                                                 |
| [Admin](/docs/auth/guides/plugins/admin)                                                                                                          | ✅ Supported                                                 |
| [Organization](/docs/auth/guides/plugins/organization)                                                                                            | ⚠️ Partial (invitation emails, JWT token claims in progress) |
| [JWT](/docs/auth/guides/plugins/jwt)                                                                                                              | ✅ Supported                                                 |
| [Open API](/docs/auth/guides/plugins/openapi)                                                                                                     | ✅ Supported                                                 |

### On the roadmap

| Plugin                                                            | Status          |
| ----------------------------------------------------------------- | --------------- |
| [Magic link](https://www.better-auth.com/docs/plugins/magic-link) | 🔜 Coming soon  |
| Webhook support (hook into different auth events)                 | 🔜 Coming soon  |
| Phone number (bring your own SMS provider)                        | 🔜 Coming soon  |
| MFA support                                                       | 🔜 Coming soon  |
| Plugin customization (Organization, Admin)                        | 🔜 Coming soon  |
| Other plugins                                                     | Based on demand |

## Let us know

We prioritize based on demand. If you need a specific framework or plugin, let us know through our [Discord](https://discord.com/invite/neon) or [GitHub Discussions](https://github.com/orgs/neondatabase/discussions).

<NeedHelp/>
