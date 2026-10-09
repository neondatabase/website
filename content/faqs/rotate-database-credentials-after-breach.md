---
title: 'How do I rotate all my Neon database credentials and connection strings after a security breach?'
subtitle: 'Reset every affected role across every project, update env vars, and revoke API keys.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I rotate my Neon database connection string for security purposes?'
  slug: rotate-database-connection-string-security
nextLink:
  title: 'How do I rotate my database password in Neon after a security incident?'
  slug: rotate-database-password-after-leak
---

After a breach (a leaked `.env` file, a compromised deploy target, a stolen laptop), reset the password of every Postgres role and revoke every Neon API key that might have been exposed. Neon has no single command that rotates everything, so script the resets across projects with the Neon API, then roll the new connection strings out to every place that stores them ([Rotate after a leak or breach](/docs/security/security-overview#rotate-after-a-leak-or-breach)).

## Rotation checklist

Work through this list for each affected project.

- Identify every Neon project that shared the exposed credential or environment.
- Reset the password for each Postgres role that can log in, on every branch where it can log in. Start with the default role (often `neondb_owner`) and any role your application servers use.
- Close sessions that were opened with the old credentials. A reset only blocks new connections, so [restart the compute](/docs/manage/computes#restart-a-compute) to drop existing ones.
- Copy each new connection string from the **Connect** modal.
- Update environment variables on every deploy target (Vercel, Render, Fly.io, Railway, AWS), CI system, secret manager, and local `.env` file.
- Revoke any Neon API keys that may have been exposed and create new ones. See [How do I rotate my Neon API keys?](/faqs/rotate-neon-api-keys).
- On the Scale plan, tighten [IP Allow](/docs/introduction/ip-allow) under **Settings → Networking** so only known addresses can connect.
- Audit your Postgres roles and drop any you don't recognize.

## Script the password resets

To rotate many roles across projects, loop through them with the Neon API. There's no CLI command for password resets. The [Reset role password](/docs/reference/api/branches/reset-project-branch-role-password) endpoint returns the new password in its response. If the breach exposed your API key, create a new one first and use it for these calls.

```bash shouldWrap
# Reset a role password and capture the new value
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq -r '.role.password'
```

To build the list of projects, branches, and roles:

```bash shouldWrap
# List all projects in the org (org_id is needed with a personal API key)
curl "https://console.neon.tech/api/v2/projects?org_id=$ORG_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" | jq -r '.projects[].id'

# List branches in a project
curl "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" | jq -r '.branches[].id'

# List roles in a branch
curl "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles" \
  -H "Authorization: Bearer $NEON_API_KEY" | jq -r '.roles[].name'
```

Loop over projects, then branches, then roles, and reset each one. Write each new password straight to your secret manager rather than to the terminal or a log.

<Admonition type="important" title="Roles live on branches">
Roles are branch-scoped. A child branch created before the breach has its own copy of each role, with the old password. Resetting the role on the parent doesn't change it, so reset the role on every branch where it can log in.
</Admonition>

## Replace the connection strings everywhere

Each reset changes a connection string. Check every place one might be stored:

- Deployment platform environment variables
- CI/CD secrets (GitHub Actions, GitLab CI, CircleCI)
- Secret managers (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, Doppler)
- Configuration files committed to private repos
- Local developer `.env` files (notify the team)

After the rollout, monitor your application logs for `password authentication failed` errors. Those flag a place you missed.
