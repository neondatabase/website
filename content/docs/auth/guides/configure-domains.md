---
title: Configure trusted domains
subtitle: Add your application domains to enable secure authentication redirects
summary: >-
  Covers the setup of application domains in Neon Auth's allowlist to enable
  secure OAuth and email verification redirects, preventing unauthorized access
  and ensuring proper functionality in production environments.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.738Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Add your application domains to Neon Auth's allowlist to enable OAuth and email verification redirects in production.

## Why domains are required

Neon Auth only redirects to domains in your allowlist. This prevents phishing attacks and unauthorized redirects by ensuring users are only sent to your legitimate application URLs.

Without adding your production domain, OAuth sign-in and verification links will fail when users try to access your application.

## Add a domain

1. Go to **Console → Auth → Configuration → Domains**
2. Enter your domain with protocol: `https://myapp.com`
3. Click **Add domain**

Repeat for each domain where your app runs.

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

<Admonition type="important">
Add each subdomain explicitly. Wildcards like `*.myapp.com` are not supported.
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
