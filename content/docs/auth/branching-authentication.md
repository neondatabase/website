---
title: Branching Authentication
subtitle: How authentication works with Neon database branches
enableTableOfContents: true
updatedOn: '2025-11-23T00:00:00.000Z'
---

One of Neon Auth's unique features is native support for database branching. When you create a database branch, that branch gets its own isolated authentication instance with separate users, sessions, and configuration.

## What happens when you branch

When you create a [database branch](/docs/introduction/branching), your authentication data branches with it automatically. Because auth data lives in your database's `neon_auth` schema, it's part of your database. Each branch then operates as an independent authentication environment.

**What gets copied at branch time:**

Along with the copy of your application data, your new branch also includes an exact copy of all authentication data from the parent branch:

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

## Branch-specific auth URLs

Each database branch has its own authentication endpoint. This solves common auth testing pain points: trying new OAuth providers, testing email verification changes, or experimenting with auth configuration, without risking your production users.

### Test auth changes safely

Create a branch from production to test auth changes locally:

<CodeWithLabel label="Terminal">

```bash
# Create test branch from production
neon branches create --name test-google-oauth
```

</CodeWithLabel>

<CodeWithLabel label=".env.local">

```env
# Point to test branch
VITE_NEON_BASE_URL=https://ep-test-google-oauth.region.domain/neondb/
```

</CodeWithLabel>

Now you can test your auth changes. For example, configure Google OAuth in the test branch's Console and verify the sign-in flow works. Your production users are unaffected. If everything works you know you can apply the same settings to production; if not, you can just delete the brnach.

The same approach works for testing any auth changes:

- Password reset flows (without spamming real users with reset emails)
- Email verification methods (code vs. link)
- "Require email verification" settings
- Testing with anonymized user data (branch from production, anonymize PII, test with realistic patterns)

### Developer isolation

Each developer can work with their own auth instance:

<CodeWithLabel label="Terminal">

```bash
# Alice creates her branch
neon branches create --name dev-alice
```

</CodeWithLabel>

Alice can test auth flows, create test users, and experiment without affecting other developers or shared staging environments.

## OAuth provider configuration

OAuth works across all branches automatically when using Neon's shared credentials (development mode).

## Session management

Sessions don't transfer between branches. If you sign in to your production app and then visit your staging environment, you'll need to sign in again; each branch has separate sessions.

This isolation is intentional and prevents security issues like sessions accidentally working across environments or test actions affecting production users.

## What's Next

<DetailIconCards>

<a href="/docs/introduction/branching" description="Learn about database branching fundamentals" icon="split-branch">Database Branching</a>

<a href="/docs/guides/branching-neon-cli" description="Create and manage branches with CLI" icon="cli">Branching with CLI</a>

<a href="/docs/guides/branching-github-actions" description="Automate branching in CI/CD" icon="split-branch">Branching with GitHub Actions</a>

</DetailIconCards>

<NeedHelp/>
