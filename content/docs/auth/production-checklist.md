---
title: Auth production checklist
subtitle: Required configuration before launching with Neon Auth
enableTableOfContents: true
updatedOn: '2025-11-30T00:00:00.000Z'
---

Complete these steps before taking your application to production with Neon Auth.

<Admonition type="note">
By default, anyone can sign up for your application. Review email verification settings and ensure your application properly controls user access before launching.
</Admonition>

<CheckList title="Auth production checklist">

<CheckItem title="1. Configure trusted domains" href="/docs/auth/guides/configure-domains">
  Add your production domain(s) to enable OAuth and email verification redirects. See [Configure trusted domains](/docs/auth/guides/configure-domains).
</CheckItem>

<CheckItem title="2. Set up custom email provider" href="/docs/auth/guides/configure-email-provider">
  Replace shared SMTP (`auth@mail.myneon.app`) with your own email service for reliable delivery and higher limits. See [Configure email provider](/docs/auth/guides/configure-email-provider).
</CheckItem>

<CheckItem title="3. Configure OAuth credentials (if using OAuth)" href="/docs/auth/guides/setup-oauth#production-setup">
  Set up your own Google and GitHub OAuth apps to replace shared development keys. See [OAuth production setup](/docs/auth/guides/setup-oauth#production-setup).
</CheckItem>

<CheckItem title="4. Enable email verification (recommended)" href="/docs/auth/guides/email-verification">
  Email verification is not enabled by default. We recommend enabling it to ensure users own their email address and reduce fake accounts. See [Email verification guide](/docs/auth/guides/email-verification).
</CheckItem>

</CheckList>

<NeedHelp/>
