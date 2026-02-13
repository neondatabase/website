---
title: Branching authentication
subtitle: How authentication works with Neon database branches
summary: >-
  Covers the setup of Neon Auth's branching feature, enabling isolated
  authentication environments for testing changes to permissions and
  configurations without impacting production data.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.737Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Authentication is often one of the hardest parts of the application stack to test. In traditional architectures, identity data lives in a separate third-party service, while your business data lives in your database. This separation makes it difficult to create realistic staging environments or test changes to permissions without affecting production users.

One of Neon Auth's unique features is native support for [database branching](/docs/introduction/branching). Because authentication data (users, sessions, and configuration) lives directly in your database's `neon_auth` schema, it is cloned along with your business data when you create a branch.

This gives each branch its own isolated authentication environment, enabling safe testing of permission changes, new OAuth providers, or full application refactors.

<Admonition type="info">
Neon Auth branching is also supported via API. See the [Neon Auth API reference](https://api-docs.neon.tech/reference/getneonauth) for a full set of REST API endpoints.
</Admonition>

## How it works

When you create a [database branch](/docs/introduction/branching), you get an exact copy of all authentication data from the parent branch at that point in time:

```
Production (main)                Preview Branch (preview-pr-123)
├── Users                   →    ├── Users (copied at branch time)
├── Sessions                →    ├── Sessions (copied, but will expire)
├── Configuration           →    ├── Configuration (independent copy)
├── OAuth providers         →    ├── OAuth providers (same credentials)
├── JWKS keys               →    ├── JWKS keys (copied)
└── Organizations           →    └── Organizations (copied)
```

After branching, the environments operate independently:

1.  **Data Isolation:** Changes in one branch don't affect others. Creating a user in a preview branch does not create them in production.
2.  **Config Isolation:** You can modify auth settings (e.g., email templates, token settings) in the branch without affecting the parent.
3.  **Endpoint Isolation:** Each branch gets a unique Auth API URL. Tokens issued in one branch are not valid in another.

```
Production Branch              Preview Branch
├── New user: alice@co.com     ├── New user: test@co.com
├── Alice's sessions           ├── Test user's sessions
├── Config: email with links   ├── Config: testing email codes
└── ep-abc123.neonauth...      └── ep-xyz789.neonauth...
    (production endpoint)          (preview endpoint)
```

<Admonition type="note">
Neon Auth works with your branch's **default** database (typically `neondb`) and read-write endpoint only. You cannot use Neon Auth with other databases in the same branch. This aligns with our recommended pattern of one database per branch.
</Admonition>

## Session management details

Sessions do not transfer between branches. If you sign in to your production app and then visit your staging environment:

1.  The session _record_ exists in the staging database (if it was created before the branch happened).
2.  However, your browser's _cookie_ is scoped to the production domain.
3.  Therefore, you will need to sign in again on the staging environment.

This isolation is intentional and prevents security issues like sessions accidentally working across environments or test actions affecting production users.

## Common Use Cases

This branch isolation enables several powerful workflows for developers, QA teams, and product managers.

### 1. Developer isolation

In a team environment, developers often step on each other's toes when sharing a single development database. With branching, each developer can have their own instance:

```bash filename="Terminal"
# Alice and Bob create their own branches
neon branches create --name dev-alice
neon branches create --name dev-bob
```

- **Alice** works on a "Delete Account" flow. She can delete users and test the full flow without worrying about affecting others.
- **Bob** works on the "User Dashboard". His user list remains intact, even though Alice is deleting users in her environment.

Because Neon Auth is part of the database, Alice and Bob don't need to set up separate auth providers or mock data. They can work in parallel without conflicts.

### 2. Testing auth configuration safely

Say you want to add Google OAuth to your production app, but you're not sure if your configuration will work. Instead of testing directly in production, create a branch:

```bash filename="Terminal"
# Create test branch from production
neon branches create --name test-google-oauth
```

```env filename=".env.local"
# Point your local app to the test branch's Auth URL
VITE_NEON_AUTH_URL=https://ep-test-google-oauth.neonauth.region.aws.neon.tech/neondb/auth
```

Now configure Google OAuth in the test branch's Console and verify the sign-in flow works locally. Your production app and users are completely unaffected. Once you confirm it works, apply the same OAuth settings to your production branch.

The same approach works for any auth changes: password reset flows, email verification settings, or testing with anonymized production data.

### 3. Preview environments for pull requests

When building full-stack applications, you often deploy "Preview Deployments" (using Vercel, Netlify, etc.) for every Pull Request. Without Auth Branching, these previews usually share a single "Staging" auth tenant. This leads to data conflicts where one developer deletes a user that another developer was testing with.

**The workflow:**

You can automate this using GitHub Actions. When a PR is opened:

1.  Create a Neon branch.
2.  Deploy your frontend/backend to a preview URL.
3.  Inject the **Branch Auth URL** into the preview deployment's environment variables.
4.  Set the Redirect URLs in the branch's Auth configuration to point to the preview URL using the [Neon API](https://api-docs.neon.tech/reference/addbranchneonauthtrusteddomain).

Because the branch contains a snapshot of production data, the preview environment is fully functional immediately. You can log in with real test accounts that exist in production, but any actions taken (changing passwords, updating profiles) happen in isolation.

<Admonition type="tip">
See the [GitHub Actions guide](/docs/guides/branching-github-actions) for instructions on how to automate branch creation for preview environments.
</Admonition>

### 4. Testing multi-tenant & RBAC hierarchies

For applications with complex Role-Based Access Control (RBAC) or multi-tenant architectures, testing permission changes can be risky. A misconfiguration could lock out users or expose sensitive data.

**The scenario:** You are refactoring your RLS policies to allow "Managers" to view "Department" data, but not modify it.

**The workflow:**

1.  Create a branch `refactor-rbac`.
2.  This branch contains your real production users and their existing role assignments.
3.  Modify your RLS policies in the branch.
4.  You can log in as a "Manager" user and verify they can only view the appropriate data.
5.  If the policy is incorrect and you accidentally expose data or lock a user out, **it only affects the branch**. Production users are never impacted.

### 5. Major refactors and "v2" betas

When rebuilding your application from scratch or launching a major "v2" update, you often need to validate the new system with real user data before the official switch-over. Traditionally, this required complex data dumps or asking users to re-register on a beta site.

With Neon Auth, you can spin up a complete parallel environment for your new version instantly.

**The workflow:**

1.  **Branch production:** Create a branch named `v2-beta` from your main production database. This clones your entire application state, including the `neon_auth` schema containing all user identities and hashed passwords.
2.  **Deploy v2:** Deploy your new application code (e.g., to `beta.myapp.com`) and point it to the `v2-beta` branch's Auth URL.
3.  **Seamless login:** Existing users can visit your new v2 site and **log in immediately using their existing credentials**. They do not need to sign up again or reset their passwords.

This allows you to test radical architectural changes such as renaming database columns, changing table structures, or modifying authentication flows in a live environment. Your v1 application remains completely unaffected, while your v2 beta feels like a production-ready extension of your platform.

<Admonition type="note" title="Data separation">
Remember that once branched, the environments are separate. If a user changes their password on the v2 site, it will not change on the v1 site, and vice versa. This makes this workflow ideal for "Public Betas" or staging environments prior to a final cutover.
</Admonition>

### 6. AI agents and ephemeral sandboxes

AI Agents, particularly those designed for coding or QA, require safe, isolated environments to generate code, run migrations, and validate features. Traditionally, giving an agent access to a full authentication stack was complex - you had to mock auth tokens or risk exposing production user pools.

With Neon, an agent can programmatically provision its own "sandbox." Because Neon Auth moves with the data, this branch instantly creates a working Authentication service isolated from production, complete with its own user tables, sessions, and configuration. **This ensures your entire application stack mimics production behavior without risking real user data.**

**The workflow:**

1.  **Provision:** The Agent uses the Neon API to create a new database branch. It instantly receives a dedicated Auth URL for that specific environment.
2.  **Interact:** The Agent uses tools like Playwright or Puppeteer to interact with the application, registering new users and performing real login flows against the branch's auth service.
3.  **Validate:** The Agent runs a test suite to verify that the code it generated works correctly with the database schema, RLS policies, and authentication rules.
4.  **Teardown:** Once the task is complete, the Agent deletes the branch, cleaning up all data and auth state.

This capability allows agents to spin up "full stack" environments (Database + Auth + Compute) in seconds, enabling autonomous testing loops that rigorously test user-facing security without manual setup.

<Admonition type="important">
An AI agent cannot log in as a real production user in a branch. Although user records are copied, valid session cookies are domain-scoped and remain with the user's browser; they are not sent to the branch URL. Unless the agent explicitly knows a user's password, it must either perform a sign-up flow or use existing test credentials to log in.

To streamline this, consider maintaining specific test users with known credentials in your production database; these records are automatically cloned to child branches during creation, allowing agents to log in immediately without needing to perform a sign-up step.
</Admonition>

## What's Next

<DetailIconCards>

<a href="/docs/introduction/branching" description="Learn about database branching fundamentals" icon="split-branch">Database Branching</a>

<a href="/docs/guides/branching-neon-cli" description="Create and manage branches with CLI" icon="cli">Branching with CLI</a>

<a href="/docs/guides/branching-github-actions" description="Automate branching in CI/CD" icon="split-branch">Branching with GitHub Actions</a>

<a href="/docs/guides/row-level-security" description="Secure data with RLS" icon="lock-landscape">Row-Level Security</a>

</DetailIconCards>

<NeedHelp/>
