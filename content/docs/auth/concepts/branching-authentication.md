---
title: Branching Authentication
subtitle: How authentication works with database branches
enableTableOfContents: true
updatedOn: '2025-11-23T00:00:00.000Z'
---

One of Neon Auth's unique features is native support for database branching. When you create a database branch, that branch gets its own isolated authentication instance with separate users, sessions, and configuration.

## What Happens When You Branch

When you create a [database branch](/docs/introduction/branching), Neon Auth creates a complete copy of your authentication data at the point of branching. Each branch operates as an independent authentication environment.

**What gets copied at branch time:**

Your new branch includes a snapshot of all authentication data from the parent branch:

```
Production (main)                Preview Branch (preview-pr-123)
├── Users                   →    ├── Users (copied at branch time)
├── Sessions                →    ├── Sessions (copied, but will expire)
├── Configuration           →    ├── Configuration (independent copy)
├── OAuth providers         →    ├── OAuth providers (same credentials)
├── JWKS keys               →    ├── JWKS keys (copied)
└── Organizations           →    └── Organizations (copied)
```

**What remains isolated after branching:**

Changes in each branch stay separate and don't affect other branches:

```
Production Branch              Preview Branch
├── New user: alice@co.com     ├── New user: test@co.com
├── Alice's sessions           ├── Test user's sessions
├── Config: email with links   ├── Config: testing email codes
└── ep-abc123.neonauth...      └── ep-xyz789.neonauth...
    (production endpoint)          (preview endpoint)
```

This isolation means you can test authentication changes, try new OAuth providers, or experiment with settings without affecting your production environment.

## Branch-Specific Auth URLs

Each database branch has its own authentication endpoint. Your application needs to use the correct Auth URL for the environment it's running in.

**Production branch:**

```
https://ep-abc123.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

**Feature branch:**

```
https://ep-xyz789.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

Use environment variables to switch between branches:

<CodeWithLabel label=".env.production">

```env
VITE_NEON_BASE_URL=https://ep-abc123.region.domain/neondb/
```

</CodeWithLabel>

<CodeWithLabel label=".env.preview">

```env
VITE_NEON_BASE_URL=https://ep-xyz789.region.domain/neondb/
```

</CodeWithLabel>

<CodeWithLabel label="app.tsx">

```typescript
import { createClient } from '@neondatabase/neon-js';

// SDK automatically derives auth and data API URLs from base URL
const client = createClient(import.meta.env.VITE_NEON_BASE_URL);
```

</CodeWithLabel>

## OAuth Provider Configuration

[Content coming soon - configuring OAuth redirect URLs for branching workflows]

## Session Management

Sessions are isolated to their branch and don't transfer between environments. A user who signs in on your production site has a production session. That same user visiting a preview deployment needs to sign in again, creating a separate preview session.

This isolation is intentional. It prevents sessions from accidentally working across environments and ensures each branch maintains its own security boundary.

## What's Next

<DetailIconCards>

<a href="/docs/introduction/branching" description="Learn about database branching fundamentals" icon="split-branch">Database Branching</a>

<a href="/docs/guides/branching-neon-cli" description="Create and manage branches with CLI" icon="cli">Branching with CLI</a>

<a href="/docs/guides/branching-github-actions" description="Automate branching in CI/CD" icon="split-branch">Branching with GitHub Actions</a>

</DetailIconCards>

<NeedHelp/>
