---
title: Current Limitations
subtitle: Known limitations and unsupported use cases for Neon Auth
enableTableOfContents: true
updatedOn: '2025-12-16T00:00:00.000Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is in active development. Before you start building, review these current limitations to check if your use case is supported.

## Standalone frontend + backend architectures

Architectures where the frontend and backend are separate deployments are **not yet supported**. This includes:

- Create-React-App with a separate Node/Express backend
- Static frontends (Vite, etc.) calling a standalone API server
- Any setup where auth needs to be validated across two different deployment targets

We're actively working on adding support for these architectures.

## Better Auth plugins

Not all [Better Auth plugins](https://www.better-auth.com/docs/plugins) are supported with Neon Auth. Notably:

- **Organization plugin** — The [organization plugin](https://www.better-auth.com/docs/plugins/organization) for managing members, teams, and roles requires additional work and documentation before it's fully functional with Neon Auth.

If you need a specific Better Auth plugin that isn't working, let us know.

## Framework support

Our quick start guides currently cover React-based frameworks:

- [Next.js](/docs/auth/quick-start/nextjs)
- [React with React Router](/docs/auth/quick-start/react-router-components)
- [React with TanStack Router](/docs/auth/quick-start/tanstack-router)

Other frameworks may work but aren't officially documented yet.

## Let us know

We'll update this page as we expand support. If you run into an issue not listed here, let us know through our [Discord](https://discord.com/invite/neon) or [GitHub Discussions](https://github.com/orgs/neondatabase/discussions).

<NeedHelp/>
