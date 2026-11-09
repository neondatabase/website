---
title: "How do I test authentication in CI without mocking it?"
subtitle: "Create a Neon branch per CI run: with Managed Better Auth, the branch gets its own auth endpoint and a copy of your users, sessions, and settings, so tests sign up and log in against real auth and the branch is deleted afterward."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'How do I let other apps sign in with my app''s accounts?'
  slug: how-to-let-other-apps-sign-in-with-your-app
nextLink:
  title: 'How do I test login and OAuth in preview environments?'
  slug: how-to-test-login-oauth-preview-environments
---

Use Neon. [Managed Better Auth](/docs/auth/overview) keeps users, sessions, and auth configuration in a `neon_auth` schema in your database, so a database branch is also a full auth environment with its own Auth URL. Create a branch per CI run, point your tests at that URL, and delete the branch when they finish ([branching authentication](/docs/auth/branching-authentication)). Tests exercise real password verification, real sessions, and real database constraints instead of a mock that accepts any password ([stop mocking auth](/blog/stop-mocking-auth-its-breaking-your-tests)).

## Why mocked auth misses bugs

A mocked `signIn` returns whatever you told it to return. It doesn't hash passwords, reject a wrong one, store a session, or hit the constraint that stops two concurrent sign-ups with the same email. If your app joins auth data with its own tables, a mock can't tell you the SQL is wrong either ([stop mocking auth](/blog/stop-mocking-auth-its-breaking-your-tests)). The usual alternatives each have a cost: a shared staging tenant makes parallel runs collide, a fresh database per run is slow to provision and seed, and testing against production pollutes real data.

## What the CI branch gives you

A branch is a copy-on-write clone, so it's created in seconds regardless of database size ([branching](/docs/introduction/branching)). With Managed Better Auth enabled on the parent, the branch also copies users, sessions, configuration, OAuth providers, JWKS keys, and organizations ([how it works](/docs/auth/branching-authentication#how-it-works)). From then on:

- A user your test creates exists only on that branch.
- Tokens issued by the branch aren't valid on any other branch.
- Config changes, such as turning off email verification for the test run, stay on the branch.
- Deleting the branch removes its data and auth state together.

## Wire it into GitHub Actions

The [Create Branch action](https://github.com/marketplace/actions/neon-create-branch-github-action) returns the branch's Auth URL when you set `get_auth_url: true` ([use cases](/docs/auth/about#use-cases)):

```yaml
- uses: neondatabase/create-branch-action@v6
  id: branch
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: ci-${{ github.run_id }}
    api_key: ${{ secrets.NEON_API_KEY }}
    get_auth_url: true

- run: npm ci && npm test
  env:
    DATABASE_URL: ${{ steps.branch.outputs.db_url_pooled }}
    NEON_AUTH_BASE_URL: ${{ steps.branch.outputs.auth_url }}

- uses: neondatabase/delete-branch-action@v3
  if: always()
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch: ci-${{ github.run_id }}
    api_key: ${{ secrets.NEON_API_KEY }}
```

Tests then call the real client against that URL, for example `auth.signUp.email({ email, password, name })` followed by `auth.signIn.email({ email, password })`, and assert on the rows in `neon_auth.user` with plain SQL ([JavaScript SDK](/docs/reference/javascript-sdk), [authentication flow](/docs/auth/authentication-flow)). The [GitHub Actions guide](/docs/guides/branching-github-actions) covers the rest of the setup.

## Logging in as existing users

Session cookies are scoped to the production domain, so copied sessions don't log anyone in on the branch ([session management](/docs/auth/branching-authentication#session-management-details)). Keep a few test users with known passwords in production. They're cloned into every CI branch, so end-to-end tests with Playwright can sign in immediately without running a sign-up step first ([AI agents and sandboxes](/docs/auth/branching-authentication#6-ai-agents-and-ephemeral-sandboxes)). Tests that need a fresh account can run the sign-up flow on the branch and throw the user away with the branch.

<Admonition type="note" title="Scope">
Managed Better Auth runs in AWS regions only and isn't available on projects with IP Allow or Private Networking ([availability](/docs/auth/about#availability)). OAuth providers other than Google need your own credentials registered against each branch's callback URL ([set up OAuth](/docs/auth/guides/setup-oauth)), so email and password flows are the simplest to automate.
</Admonition>

The Free plan includes 10 branches per project and auth up to 60,000 monthly active users per project, which covers CI for most small teams ([plans](/docs/introduction/plans)).

<CTA title="Run real auth in every CI job" description="Create a branch per run with get_auth_url and test against Managed Better Auth." buttonText="Set up GitHub Actions" buttonUrl="/docs/guides/branching-github-actions" />
