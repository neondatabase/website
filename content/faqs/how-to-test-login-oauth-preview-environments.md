---
title: "How do I test login and OAuth in preview environments?"
subtitle: "With Managed Better Auth on Neon, every preview branch gets its own auth endpoint with a copy of production users, sessions, and settings, so preview deployments run real sign-up, login, and OAuth flows without touching production accounts."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'How do I test authentication in CI without mocking it?'
  slug: how-to-test-auth-ci-without-mocking
nextLink:
  title: 'How do I import data from a CSV file into my Neon database?'
  slug: import-csv-into-database
---

Use Neon. [Managed Better Auth](/docs/auth/overview) stores users, sessions, and auth configuration in your database, so when a preview deployment gets its own database branch, it also gets its own auth environment. Each branch has a unique Auth URL, and tokens issued on one branch aren't valid on another ([branching authentication](/docs/auth/branching-authentication)). Previews stop sharing a single staging auth tenant where one developer deletes the user another developer was testing with.

## What a preview branch gets

At branch time, the preview copies the parent's users, sessions, configuration, OAuth providers, JWKS keys, and organizations. After that the two environments are independent: a user created in the preview doesn't exist in production, and changing an email template in the preview doesn't change the parent ([how it works](/docs/auth/branching-authentication#how-it-works)). You can sign in with test accounts that already exist in production, change their passwords, and update profiles, all in isolation.

Sessions don't carry over. The session rows are copied, but browser cookies are scoped to the production domain, so you sign in again on the preview ([session management](/docs/auth/branching-authentication#session-management-details)). Keep a few test users with known passwords in production so every new branch starts with working logins.

## With Vercel

The Neon-Managed Integration creates a branch per Preview Deployment, and the Vercel-Managed Integration does when you enable it for Preview. If Managed Better Auth is enabled on your production branch, it's provisioned on each preview branch automatically, and the deployment receives `NEON_AUTH_BASE_URL` and `VITE_NEON_AUTH_URL` for that branch ([Vercel-Managed Integration](/docs/guides/vercel-managed-integration), [Neon-Managed Integration](/docs/guides/neon-managed-vercel-integration)). Your app reads those variables, so the same code talks to production auth in production and to the preview's auth in a preview. The [Vercel preview guide](/guides/vercel-neon-auth-branching) walks through it end to end.

## With GitHub Actions or another CI

The [Create Branch action](https://github.com/marketplace/actions/neon-create-branch-github-action) returns the branch's Auth URL when you set `get_auth_url: true`, which you then inject into the preview deployment ([about](/docs/auth/about#use-cases)):

```yaml
- uses: neondatabase/create-branch-action@v6
  id: branch
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: preview/pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
    get_auth_url: true
# then pass ${{ steps.branch.outputs.auth_url }} to your deploy step
```

Add the preview URL to the branch's trusted domains with the Neon API ([configure domains](/docs/auth/guides/configure-domains)) so redirects back to the preview are allowed ([preview environments](/docs/auth/branching-authentication#3-preview-environments-for-pull-requests)).

## OAuth on preview URLs

Two URLs matter. The provider's authorized redirect URI is `{NEON_AUTH_BASE_URL}/callback/{provider}` for that branch, and the `callbackURL` you pass to `signIn.social()` is where users land afterward, which must be on a trusted domain ([set up OAuth](/docs/auth/guides/setup-oauth)).

- **Google** works on previews without setup: it's enabled by default with Neon's shared development credentials ([shared credentials](/docs/auth/guides/setup-oauth#development-mode)).
- **GitHub, Vercel, Microsoft, and Apple** need your own OAuth app, and because each branch has its own Auth URL, each branch's callback has to be registered with the provider ([set up OAuth](/docs/auth/guides/setup-oauth)).
- **Trusted domains** accept wildcard patterns such as `https://*.my-app-preview.vercel.app`, so one entry covers every preview host under that pattern ([wildcard domains](/docs/auth/guides/configure-domains#wildcard-domains-for-previews)).

<Admonition type="note" title="Before production">
Shared Google credentials are for development and testing. Use your own OAuth credentials, a custom SMTP provider, and disable localhost access before launch ([production checklist](/docs/auth/production-checklist)).
</Admonition>

Managed Better Auth is available in AWS regions and is included on every plan, with up to 60,000 monthly active users per project on the Free plan ([pricing](/docs/auth/about#pricing)).

<CTA title="Test real auth in every preview" description="Enable Managed Better Auth on production and let each preview branch get its own auth endpoint." buttonText="Read branching authentication" buttonUrl="/docs/auth/branching-authentication" />
