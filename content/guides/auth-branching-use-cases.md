---
title: Common use cases for Auth branching
subtitle: 'Learn how to leverage isolated authentication environments for safer testing, development, and debugging'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-12-16T00:00:00.000Z'
updatedOn: '2025-12-16T00:00:00.000Z'
---

Authentication is often one of the hardest parts of the application stack to test. In traditional architectures, identity data lives in a separate third-party service, while your business data lives in your database. This separation makes it difficult to create realistic staging environments or test changes to permissions without affecting production users.

With **Neon Auth**, authentication data (users, sessions, and configuration) lives directly in your database. This means that when you use [Neon Branching](/docs/introduction/branching), your authentication state is cloned along with your data.

This guide explores the most common use cases for Auth Branching and how they can improve your development workflow.

## How Auth branching works

Before diving into use cases, it's important to understand what happens when you create a new branch in Neon with Auth enabled.

When you create a branch from a parent database that has Neon Auth set up, the following occurs:

1.  **Data copy:** The `neon_auth` schema is copied from the parent branch. This includes your User table, active Sessions, Account links, and Organization data.
2.  **Configuration copy:** Your auth configuration (providers, email templates, token settings) is copied. You can modify these settings in the branch without affecting the parent.
3.  **Isolation:** The new branch gets a unique Auth API and JWKS URL. This ensures that tokens issued in one branch are not valid in another.

<Admonition type="note" title="Session security">
While session data is copied to the new branch, session cookies are scoped to specific domains. A user logged into your Production app will not automatically be logged into your Branch app, and vice versa. This isolation prevents cross-environment security risks.
</Admonition>

Now that you have a basic understanding of how Auth Branching works, let's explore some practical use cases.

## 1. Preview environments for pull requests

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

## 2. Testing multi-tenant & RBAC hierarchies

For applications with complex Role-Based Access Control (RBAC) or multi-tenant architectures, testing permission changes can be risky. A misconfiguration could lock out users or expose sensitive data.

**The scenario:** You are refactoring your RLS policies to allow "Managers" to view "Department" data, but not modify it.

**The workflow:**

1.  Create a branch `refactor-rbac`.
2.  This branch contains your real production users and their existing role assignments.
3.  Modify your RLS policies in the branch.
4.  You can log in as a "Manager" user and verify they can only view the appropriate data.
5.  If the policy is incorrect and you accidentally expose data or lock a user out, **it only affects the branch**. Production users are never impacted.

## 3. Developer isolation

In a team environment, developers often step on each other's toes when sharing a single development database.

**The workflow:**
Each developer creates their own branch for their current task:

```bash
neon branches create --name dev-alice
neon branches create --name dev-bob
```

- **Alice** is working on the "Delete Account" flow. She can delete users and test the full flow without worrying about affecting Bob's work.
- **Bob** is working on the "User Dashboard". His user list remains intact, even though Alice is deleting users in her environment.

Because Neon Auth is part of the database, Alice and Bob don't need to set up separate auth providers or mock data. They can work in parallel without conflicts.

## 4. AI agents and ephemeral sandboxes

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

To streamline this, consider maintaining specific test users with known credentials in your production database; these records are automatically cloned to child branches during creation, allowing agents to log in immediately without needing to perform a sign-up step
</Admonition>

## 5. Major refactors and "v2" betas

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

## Conclusion

By treating authentication data as part of your database, Neon removes the friction of managing external identity providers across different environments. Whether you are manually testing a new OAuth provider or automating preview environments in CI/CD, Auth Branching ensures that your production identity data remains secure and unpolluted.

## Resources

- [Neon Auth Overview](/docs/auth/overview)
- [Database Branching](/docs/introduction/branching)
- [Branching authentication](/docs/auth/branching-authentication)
- [Database Branching using GitHub Actions](/docs/guides/branching-github-actions)
- [Row-Level Security with Neon](/docs/guides/row-level-security)

<NeedHelp />
