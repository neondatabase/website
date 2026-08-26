---
title: Configure trusted domains
subtitle: Add your application domains to enable secure authentication redirects
summary: >-
  Managed Better Auth's trusted domain allowlist restricts OAuth and email verification
  redirects to domains you explicitly approve, blocking unauthorized redirects.
  Add exact production origins (https://myapp.com) or wildcard patterns
  (https://*.preview.vercel.app) in Console > Auth > Configuration > Domains.
  Localhost ports are pre-approved and need no entry.
enableTableOfContents: true
updatedOn: '2026-08-26T13:16:52.511Z'
---

<FeatureBetaProps feature_name="Managed Better Auth" />

Add your application domains to Managed Better Auth's allowlist to enable OAuth and email verification redirects in production.

## Why domains are required

Managed Better Auth only redirects to domains in your allowlist. This prevents phishing attacks and unauthorized redirects by ensuring users are only sent to your legitimate application URLs.

Without adding your production domain, OAuth sign-in and verification links will fail when users try to access your application.

## Add a domain

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Go to **Console → Auth → Configuration → Domains**
2. Enter your domain with protocol: `https://myapp.com`
3. Click **Add domain**

Repeat for each domain where your app runs.

</TabItem>

<TabItem>

Add a domain with [`neon neon-auth domain add`](/docs/cli/neon-auth#domain-add):

```bash
neon neon-auth domain add https://myapp.com
```

Use `neon neon-auth domain list` and `neon neon-auth domain delete` to view and remove entries.

</TabItem>

<TabItem>

Send a `POST` request to the [add trusted domain](/docs/reference/api/auth/add-branch-neon-auth-trusted-domain) endpoint. Replace `{project_id}` and `{branch_id}` with your project and branch IDs.

```bash shouldWrap
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/domains' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"domain": "https://myapp.com", "auth_provider": "better_auth"}'
```

Use [`GET`](/docs/reference/api/auth/list-branch-neon-auth-trusted-domains) on the same path to list domains, and [`DELETE`](/docs/reference/api/auth/delete-branch-neon-auth-trusted-domain) to remove them. See [Manage Managed Better Auth via the API](/docs/auth/guides/manage-auth-api#related-auth-endpoints) for the full set of auth endpoints.

</TabItem>

</Tabs>

<Admonition type="note">
Include the protocol (`https://`) and omit trailing slashes. For example: `https://myapp.com` not `https://myapp.com/`
</Admonition>

## Localhost is pre-configured

Development domains are automatically allowed, so you don't need to add them:

- `http://localhost:3000`
- `http://localhost:5173`
- Any `localhost` port

## Production domains

Add all domains where users access your application:

- `https://myapp.com`
- `https://www.myapp.com` (if you support www subdomain)
- `https://app.myapp.com` (if using a subdomain)

## Wildcard domains for previews

For preview environments with dynamic hostnames (for example Vercel preview deployments), you can add a **wildcard trusted domain** such as `https://*.my-app-preview.vercel.app`. One entry can match every preview under that pattern instead of adding hosts one by one.

Use the same rules as fixed domains: include `https://` (or `http://` where appropriate) and omit trailing slashes after the pattern.

<Admonition type="note">
Wildcard patterns apply to the hostname segment you replace with `*`. Production apex domains (for example `https://myapp.com`) are usually still added as exact entries unless your wildcard covers them.
</Admonition>

## Common issues

**Redirect blocked after OAuth sign-in:**

- Verify the domain is in your allowlist
- Ensure you included `https://` (not `http://` for production)
- Check spelling matches exactly (including www vs non-www)

**Verification link doesn't redirect:**

- Verification links use the same domain allowlist
- Add the domain where users should land after clicking the verification link

## Next steps

- [Production checklist](/docs/auth/production-checklist) - Complete setup for launch

<NeedHelp/>
