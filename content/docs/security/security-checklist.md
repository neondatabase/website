---
title: Security checklist
subtitle: Lock down your Neon account, projects, and data before you go to production
summary: >-
  A security checklist for production Neon projects. Covers 2FA and passkeys,
  requiring 2FA for an organization, verified domains, the Collaborator role,
  project-scoped API keys, scoped credentials for Object Storage and the AI
  Gateway, authenticating Neon Functions callers, verify-full and channel
  binding, least-privilege Postgres roles and row-level security, keeping
  production data out of development branches, limiting AI agent access, and
  rotating credentials after a leak, then paid-plan controls: protected
  branches (Launch and Scale) and IP Allow and Private Networking (Scale).
enableTableOfContents: true
updatedOn: '2026-11-11T14:12:13.720Z'
---

Use this checklist to secure a Neon project before it holds production data. Start with the controls available on every plan, then add the ones your paid plan includes. Each item links to a section below, and each section links to the page that sets it up. For an explanation of how these controls fit together, see the [Security overview](/docs/security/security-overview). For what each plan includes, see [Security features by plan](/docs/security/security-overview#security-features-by-plan).

## All plans

<CheckList title="Security checklist for all plans">

<CheckItem title="1. Turn on 2FA or a passkey" href="#turn-on-2fa-or-a-passkey">
  Protect the account that signs in to every organization you belong to.
</CheckItem>
<CheckItem title="2. Require 2FA for your organization" href="#require-2fa-for-your-organization">
  Make sure every member signs in with a second factor.
</CheckItem>
<CheckItem title="3. Review your verified domains" href="#review-your-verified-domains">
  Anyone with an email on a verified domain joins your organization as an Editor.
</CheckItem>
<CheckItem title="4. Give each member the narrowest role" href="#give-each-member-the-narrowest-role">
  Use Collaborator and per-project permissions to keep people to the projects they need.
</CheckItem>
<CheckItem title="5. Use project-scoped API keys for automation" href="#use-project-scoped-api-keys-for-automation">
  Limit what a leaked key can reach.
</CheckItem>
<CheckItem title="6. Give each workload a scoped credential" href="#give-each-workload-a-scoped-credential">
  Keep API keys out of your running app.
</CheckItem>
<CheckItem title="7. Authenticate Neon Functions callers" href="#authenticate-neon-functions-callers">
  Function URLs are public.
</CheckItem>
<CheckItem title="8. Connect with verify-full and channel binding" href="#connect-with-verify-full-and-channel-binding">
  Verify that you're connecting to Neon.
</CheckItem>
<CheckItem title="9. Connect your app with a least-privilege role" href="#connect-your-app-with-a-least-privilege-role">
  Don't run your app as the project's owner role.
</CheckItem>
<CheckItem title="10. Keep production data out of development branches" href="#keep-production-data-out-of-development-branches">
  A branch copies all of its parent's data.
</CheckItem>
<CheckItem title="11. Limit what AI agents can do" href="#limit-what-ai-agents-can-do">
  Agents act with the access of the credential you give them.
</CheckItem>
<CheckItem title="12. Know how to rotate credentials after a leak" href="#know-how-to-rotate-credentials-after-a-leak">
  Have the steps ready before you need them.
</CheckItem>

</CheckList>

### Turn on 2FA or a passkey

In **Account settings**, turn on [two-factor authentication](/docs/manage/accounts#two-factor-authentication) or add a [passkey](/docs/manage/accounts#passkeys). You can set up both.

### Require 2FA for your organization

Organization admins can [require 2FA](/docs/manage/orgs-manage#require-2fa-for-organization-members) for every member. A passkey also meets the requirement. The requirement doesn't apply to requests made with an API key, so also review who holds API keys for your organization.

### Review your verified domains

When you [verify an email domain](/docs/manage/orgs-add-members-by-domain), anyone who signs up or signs in with an email on that domain joins your organization as an Editor, with access to every project. Remove any domain where not everyone should have that access.

### Give each member the narrowest role

Every [organization role](/docs/manage/user-permissions#organization-roles) except Collaborator gives access to every project in the organization, and can create projects. For people who should work on specific projects only, assign Collaborator and grant [per-project permissions](/docs/manage/user-permissions#per-project-permissions). To check your setup, see [Review who has access](/docs/manage/user-permissions#review-who-has-access).

### Use project-scoped API keys for automation

For CI jobs and scripts that work on a single project, use a project-scoped [API key](/docs/manage/api-keys) instead of a personal or organization key. Revoke keys you no longer use.

### Give each workload a scoped credential

Your running app shouldn't hold a Neon API key. Give each workload its own [scoped credential](/docs/concepts/credentials-access#scoped-credentials) with only the scopes it needs. IP Allow and Private Networking don't protect Object Storage, the AI Gateway, or the Data API, so for these services the credential is the access control. See [Credentials and access](/docs/concepts/credentials-access).

### Authenticate Neon Functions callers

A Neon Function has a public HTTPS URL, and Neon doesn't check who calls it. [Authenticate the caller](/docs/compute/functions/authentication) at the top of your handler.

### Connect with verify-full and channel binding

Neon rejects Postgres connections without SSL/TLS, but encryption alone doesn't verify the server. Use `sslmode=verify-full` and `channel_binding=require` in your connection string. See [Connect securely](/docs/connect/connect-securely).

### Connect your app with a least-privilege role

Create a Postgres role with only the privileges your app needs, and connect as that role. See [Manage database access](/docs/manage/database-access). If your users must see only their own rows, add [row-level security](/docs/guides/row-level-security) policies.

### Keep production data out of development branches

Create development branches as [schema-only branches](/docs/guides/branching-schema-only), or [anonymize](/docs/workflows/data-anonymization) sensitive columns before developers use them.

### Limit what AI agents can do

Follow the [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance), use [read-only mode](/docs/ai/neon-mcp-server#read-only-mode) when an agent only needs to look, and [scope agents](/docs/manage/project-permissions-get-started#scoping-access-for-agents) to the projects they need.

### Know how to rotate credentials after a leak

Resetting a password blocks new connections but leaves open sessions connected, so a full rotation also restarts every compute on the branch, including read replicas. Read [Rotate after a leak or breach](/docs/security/security-overview#rotate-after-a-leak-or-breach) now, so the steps are ready if you need them.

## Paid plans

<CheckList title="Security checklist for paid plans">

<CheckItem title="13. Protect your production branch" href="#protect-your-production-branch">
  Prevent accidental deletes and resets.
</CheckItem>
<CheckItem title="14. Restrict network access to Postgres" href="#restrict-network-access-to-postgres">
  Allow Postgres connections only from addresses you trust.
</CheckItem>

</CheckList>

### Protect your production branch

Available on the Launch and Scale plans. Mark your production branch as [protected](/docs/guides/protected-branches), so it can't be deleted or reset. Branches created from it get new Postgres role passwords.

### Restrict network access to Postgres

Available on the Scale plan. Use [IP Allow](/docs/introduction/ip-allow) to block Postgres connections from addresses outside your allowlist, or [Private Networking](/docs/guides/neon-private-networking) to connect from your AWS VPC over AWS PrivateLink. Both restrict Postgres only, and some Neon services stop working while they're on. Check [IP Allow and other Neon services](/docs/introduction/ip-allow#ip-allow-and-other-neon-services) first.

<NeedHelp/>
