---
title: Neon Auth roadmap
subtitle: What's supported today and what's coming next
enableTableOfContents: true
updatedOn: '2025-12-16T12:23:55.558Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is in active development. This page shows what's currently supported and what we're working on next.

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

| Plugin                                                                                          | Status                                                       |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Email & password](https://www.better-auth.com/docs/authentication/email-password)              | ✅ Supported                                                 |
| [Social OAuth](https://www.better-auth.com/docs/authentication/social-sign-in) (Google, GitHub) | ✅ Supported                                                 |
| [Email OTP](https://www.better-auth.com/docs/plugins/email-otp)                                 | ✅ Supported                                                 |
| [Admin](https://www.better-auth.com/docs/plugins/admin)                                         | ✅ Supported                                                 |
| [Organization](https://www.better-auth.com/docs/plugins/organization)                           | ⚠️ Partial (invitation emails, JWT token claims in progress) |

### On the roadmap

| Plugin                                                            | Status          |
| ----------------------------------------------------------------- | --------------- |
| [Magic link](https://www.better-auth.com/docs/plugins/magic-link) | 🔜 Coming soon  |
| Other plugins                                                     | Based on demand |

## Let us know

We prioritize based on demand. If you need a specific framework or plugin, let us know through our [Discord](https://discord.com/invite/neon) or [GitHub Discussions](https://github.com/orgs/neondatabase/discussions).

<NeedHelp/>
