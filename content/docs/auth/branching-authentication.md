---
title: Branching authentication
subtitle: How authentication works with Neon database branches
enableTableOfContents: true
updatedOn: '2025-11-23T00:00:00.000Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

One of Neon Auth's unique features is native support for database branching. When you create a database branch, your authentication data branches with it, giving each branch its own isolated authentication environment.

## How it works

Because auth data lives in your database's `neon_auth` schema, it's part of your database. When you create a [database branch](/docs/introduction/branching), you get an exact copy of all authentication data from the parent branch at that point in time:

```
Production (main)                Preview Branch (preview-pr-123)
├── Users                   →    ├── Users (copied at branch time)
├── Sessions                →    ├── Sessions (copied, but will expire)
├── Configuration           →    ├── Configuration (independent copy)
├── OAuth providers         →    ├── OAuth providers (same credentials)
├── JWKS keys               →    ├── JWKS keys (copied)
└── Organizations           →    └── Organizations (copied)
```

After branching, each branch operates independently. Changes in one branch don't affect others:

```
Production Branch              Preview Branch
├── New user: alice@co.com     ├── New user: test@co.com
├── Alice's sessions           ├── Test user's sessions
├── Config: email with links   ├── Config: testing email codes
└── ep-abc123.neonauth...      └── ep-xyz789.neonauth...
    (production endpoint)          (preview endpoint)
```

Each branch gets its own authentication endpoint (matching that branch's default read-write endpoint), so you can test authentication changes without affecting production users.

<Admonition type="note">
Neon Auth works with your branch's **default** database (typically `neondb`) and read-write endpoint only. You cannot use Neon Auth with other databases in the same branch. This aligns with our recommended pattern of one database per branch.
</Admonition>

This branch isolation enables several testing patterns:

## Testing auth changes safely

Say you want to add Google OAuth to your production app, but you're not sure if your configuration will work. Instead of testing directly in production, create a branch:

<CodeWithLabel label="Terminal">

```bash
# Create test branch from production
neon branches create --name test-google-oauth
```

</CodeWithLabel>

<CodeWithLabel label=".env.local">

```env
# Point your local app to the test branch's Auth URL
VITE_NEON_AUTH_URL=https://ep-test-google-oauth.neonauth.region.aws.neon.tech/neondb/auth
```

</CodeWithLabel>

Now configure Google OAuth in the test branch's Console and verify the sign-in flow works locally. Your production app and users are completely unaffected. Once you confirm it works, apply the same OAuth settings to your production branch.

The same approach works for any auth changes: password reset flows, email verification settings, or testing with anonymized production data.

## Developer isolation

You can also use branches to give each developer their own auth instance to test with:

<CodeWithLabel label="Terminal">

```bash
# Alice creates her branch
neon branches create --name dev-alice
```

</CodeWithLabel>

Alice can test auth flows, create test users, and experiment without affecting other developers or shared staging environments.

## OAuth and sessions

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
