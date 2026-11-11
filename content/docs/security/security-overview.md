---
title: Security overview
subtitle: The controls you use to secure your Neon account, projects, and data
summary: >-
  How to secure Neon: what Neon enforces for you (TLS on every Postgres
  connection, strong role passwords, GitHub secret scanning), and the controls
  you configure yourself. Covers 2FA, passkeys, organization roles and per-project permissions, API keys and scoped
  credentials, Enterprise SSO and SCIM (coming soon), verify-full and channel binding, IP Allow and Private
  Networking (Postgres only), protected branches, row-level security, Neon
  Functions caller authentication, AI agent access, and credential rotation
  after a leak. Links to the security checklist and compliance details.
enableTableOfContents: true
redirectFrom:
  - /docs/security/security
  - /docs/security
updatedOn: '2026-11-11T13:15:40.948Z'
---

Neon secures the platform your data runs on. You decide who can reach your account, your projects, and your data. This page walks through the controls you have at each layer and links to the page that sets each one up.

To work through these controls one at a time for a production project, use the [security checklist](/docs/security/security-checklist). For Neon's certifications and how Neon protects its own infrastructure, see [Compliance](/docs/security/compliance).

## What Neon enforces for you

These protections are always on. You don't configure them.

- **Encrypted Postgres connections.** Neon rejects Postgres connections that don't use SSL/TLS. To also verify that you're talking to Neon, see [Verify the server when you connect](#verify-the-server-when-you-connect).
- **Strong role passwords.** Every Postgres role password needs at least 60 bits of entropy. Neon generates passwords like that for roles you create in the Console, CLI, or API, and rejects weaker passwords set with `CREATE ROLE` or `ALTER ROLE`. Neon accepts passwords only in plaintext, so a pre-hashed password can't skip the check.
- **Secret scanning on GitHub.** Neon is a GitHub secret scanning partner. See [GitHub secret scanning](#github-secret-scanning).

## Secure your account and organization

Your Neon account is the way into every organization you belong to, so protect it first.

- **Two-factor authentication and passkeys.** Turn on [2FA](/docs/manage/accounts#two-factor-authentication) or add a [passkey](/docs/manage/accounts#passkeys) in **Account settings**.
- **Require 2FA for your organization.** Admins can [require 2FA](/docs/manage/orgs-manage#require-2fa-for-organization-members) for every member. A passkey also meets the requirement. It applies when members open the organization while signed in, but not to requests made with an API key, so also review who holds API keys for your organization.
- **Enterprise SSO and SCIM (coming soon).** Members will sign in through your identity provider, and SCIM provisioning will keep organization membership in sync with your directory.
- **Verified domains.** When you [verify an email domain](/docs/manage/orgs-add-members-by-domain), anyone who signs up or signs in with an email on that domain joins your organization as an Editor, with access to every project. Verify only domains where everyone should have that access, or [change their role](/docs/manage/user-permissions#set-the-organization-role) once they join.

## Control who can access each project

Give each person and agent only the access they need.

- **Organization roles.** Every member has one of four [organization roles](/docs/manage/user-permissions#organization-roles): Admin, Editor, Viewer, or Collaborator. Every role except Collaborator can create projects. To keep someone to specific projects only, make them a Collaborator.
- **Per-project permissions.** Grant [per-project access](/docs/manage/user-permissions#per-project-permissions) to give someone more access on one project than their organization role gives them everywhere. The [permissions quickstart](/docs/manage/project-permissions-get-started) walks through a typical setup.
- **API keys.** Neon has personal, organization, and project-scoped [API keys](/docs/manage/api-keys). For automation that works on a single project, use a project-scoped key, so a leaked key can't reach your other projects.

## Give your app scoped credentials

An API key manages your Neon setup. Your running app shouldn't hold one. Give each workload its own scoped credential instead, so a leak exposes only what that workload can do. [Credentials and access](/docs/concepts/credentials-access) explains which credential each job needs.

For the services outside Postgres, the credential is the only access control. [IP Allow](#restrict-network-access-to-postgres) and Private Networking don't apply to them.

- **Object Storage and the AI Gateway** accept [scoped credentials](/docs/concepts/credentials-access#scoped-credentials) tied to a branch. Grant only the scopes a workload needs, such as `storage:read` without `storage:write`. See [Object Storage authentication](/docs/storage/authentication) and [AI Gateway authentication](/docs/ai-gateway/authentication).
- **Neon Functions** have public HTTPS URLs. Neon doesn't check who calls a function, so [authenticate callers](/docs/compute/functions/authentication) at the top of your handler.
- **The Data API** authorizes each request with a JWT, then applies your Postgres grants and row-level security policies. See [Data API access control](/docs/data-api/access-control).

## Secure Postgres connections

### Verify the server when you connect

Neon encrypts every connection, but encryption alone doesn't prove the server is Neon. To verify the server's certificate and hostname, connect with `sslmode=verify-full`. Add `channel_binding=require` so the client authenticates over a channel bound to that TLS session. See [Connect securely](/docs/connect/connect-securely).

### Restrict network access to Postgres

- **[IP Allow](/docs/introduction/ip-allow)** blocks Postgres connections from addresses outside your allowlist, including pooled connections and the serverless driver. You can apply it to [protected branches only](/docs/introduction/ip-allow#ip-allow-together-with-protected-branches). Available on the Scale plan.
- **[Private Networking](/docs/guides/neon-private-networking)** routes Postgres connections from your AWS VPC over AWS PrivateLink, and can block access from the public internet. Available on the Scale plan.

Both controls restrict Postgres only. Some Neon services also stop working while they're on. Check [IP Allow and other Neon services](/docs/introduction/ip-allow#ip-allow-and-other-neon-services) before you turn one on.

### Limit what each Postgres role can do

The default role on a new project, usually `neondb_owner`, can do almost anything in your databases. For your app, create roles with only the privileges it needs. See [Manage database access](/docs/manage/database-access) for read-only, read-write, and developer role examples. To restrict which rows each user sees, use [row-level security](/docs/guides/row-level-security).

## Protect production data

- **Protected branches.** Mark your production branch as [protected](/docs/guides/protected-branches). A protected branch can't be deleted or reset, and a project with a protected branch can't be deleted. A branch created from a protected branch gets new passwords for its Postgres roles, so the production passwords don't work on it. Available on paid plans.
- **Keep sensitive data out of development branches.** A branch is a full copy of its parent's data. To develop without production data, create a [schema-only branch](/docs/guides/branching-schema-only), or [anonymize](/docs/workflows/data-anonymization) sensitive columns on a development branch.

## Use AI agents safely

Agents act with the access of the credential you give them.

- Follow the [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance), and review what an agent asks to do before you approve it.
- Use [read-only mode](/docs/ai/neon-mcp-server#read-only-mode) when an agent only needs to look.
- Scope an agent to the projects it needs. See [Scoping access for agents](/docs/manage/project-permissions-get-started#scoping-access-for-agents).

## GitHub secret scanning

Neon is a [GitHub secret scanning partner](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning-for-partners). When GitHub finds a Neon API key or a Neon connection string in a public repository or a public npm package, it notifies Neon.

Don't rely on that to catch a leak. GitHub doesn't scan private repositories or other places you store code for partner alerts, so keep credentials out of source code:

- Use environment variables instead of hardcoding credentials.
- Store credentials in a secret manager, such as AWS Secrets Manager or HashiCorp Vault.
- If a credential is exposed, [rotate it](#rotate-after-a-leak-or-breach).

## Rotate credentials

Rotate your database credentials regularly, and immediately if one is exposed. A Neon connection string is built from a role and its password, so you rotate it by resetting the role's password. See [Reset a password](/docs/manage/roles#reset-a-password) for the Console, CLI, API, and SQL methods.

After you reset a password, new connections with the old password fail. Sessions that are already open stay connected until they disconnect. Copy the new connection string from the **Connect** modal (**Connect** in the Console nav) and roll it out everywhere it is stored, including deployment platform environment variables, CI/CD secrets, secret managers, and local `.env` files, before clients reconnect.

### Rotate after a leak or breach

If a credential is exposed, for example through a leaked `.env` file, a compromised deployment target, or a stolen device, rotate every affected credential rather than just one:

1. Reset the password for every role that can log in, starting with the default role (often `neondb_owner`). Roles are branch-scoped, so reset the role on every branch where it can log in.
2. End the sessions that are already open. A reset only blocks new connections, so [restart the compute](/docs/manage/computes#restart-a-compute) to drop existing ones.
3. Roll the new connection strings out to every secret store, then watch your application logs for `password authentication failed` errors, which flag a location you missed.
4. Revoke any exposed Neon API keys and create new ones. See [Manage API keys](/docs/manage/api-keys).
5. Revoke any exposed scoped credentials for Object Storage or the AI Gateway. See [Revoking credentials](/docs/storage/authentication#revoking-credentials).
6. Tighten your [IP allowlist](/docs/introduction/ip-allow) to limit which addresses can connect.
7. Audit your roles and remove any you do not recognize.

Neon has no single command to rotate everything at once. To rotate many roles, list every project, branch, and role, then loop the [reset-password API](/docs/manage/roles#reset-a-password).

### Rotate without downtime

Resetting a password cuts over all consumers at once. To rotate gradually, create a parallel role, grant it the access the old role had, and migrate consumers one service at a time, since both connection strings keep working during the migration. Reset the old role's password at the end to invalidate it. In most projects the original role owns database objects and cannot be dropped while it does, so resetting its password is what closes the leak. To remove the role later, [reassign ownership](https://www.postgresql.org/docs/current/sql-reassign-owned.html) of its objects, then [delete the role](/docs/manage/roles#delete-a-role).

## Report a vulnerability

To report a security issue in Neon, see [Security reporting](/docs/security/security-reporting). Neon also runs a [public bug bounty program with HackerOne](/docs/security/security-reporting#bug-bounty-program-with-hackerone).

## Questions about Neon security?

For Neon's audit reports and security documentation, visit the [Neon Trust Center](https://trust.neon.com/). For other questions, [submit a support ticket](/docs/introduction/support).

<NeedHelp/>
