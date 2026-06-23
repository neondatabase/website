---
title: 'How do I rotate all my Neon database credentials and connection strings after a security breach?'
subtitle: 'Reset every affected role across every project, update env vars, and revoke API keys.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-22T12:41:06.646Z'
isDraft: false
redirectFrom: []
---

## Quick answer

After a third-party breach (a leaked `.env`, a compromised deploy target, a stolen laptop), rotate every Postgres role password and every Neon API key that might have been exposed. Neon does not have a one-click "rotate all" feature, so you'll script the rotation across projects with the Neon API or CLI, then propagate the new connection strings to every place that stores them.

## Rotation checklist

Work through this list once per affected project. For a team with multiple projects, scripting the loop is faster than clicking through the Console.

- Identify every Neon project that shared the exposed credential or environment.
- Reset the password for each Postgres role that has login privileges. Start with the default role (often `neondb_owner`) and any role used by application servers.
- Copy the new connection string from the **Connect** modal on each Project Dashboard.
- Update environment variables in every deployment platform (Vercel, Render, Fly, Railway, AWS, etc.), CI system, secret manager, and local `.env` files.
- Revoke any Neon API keys that may have been exposed and create new ones. See [How do I rotate my Neon API keys?](/faqs/rotate-neon-api-keys).
- If the breach affects production data access, review the **IP Allow** list under **Project Settings → Network security** and tighten it.
- Audit Postgres roles you don't recognize, and drop any that shouldn't exist.

## Script the password resets

The fastest way to rotate many roles across many projects is to loop through them with the [Neon API](/docs/manage/roles#manage-roles-with-the-neon-api). The reset password endpoint returns the new password in the response. You'll need a Neon API key to make these calls.

```bash shouldWrap
# Reset a role password and capture the new value
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq -r '.role.password'
```

To list every project, branch, and role first:

```bash shouldWrap
# List all projects in the org
curl "https://console.neon.tech/api/v2/projects" \
  -H "Authorization: Bearer $NEON_API_KEY" | jq -r '.projects[].id'

# List roles in a branch
curl "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles" \
  -H "Authorization: Bearer $NEON_API_KEY" | jq -r '.roles[].name'
```

Combine these in a shell or Node script and you can rotate dozens of roles in a few minutes. See the [Manage roles API reference](/docs/manage/roles#manage-roles-with-the-neon-api).

<Admonition type="important" title="Roles live on branches">
In Neon, roles belong to a branch. If you have child branches that inherited a role from the parent before the breach, the password on each child branch is independent. Reset the role on every branch where it can be used to log in.
</Admonition>

## Replace the connection strings everywhere

A reset password changes the connection string. Find every place it's stored:

- Deployment platform environment variables
- CI/CD secrets (GitHub Actions, GitLab CI, CircleCI)
- Secret managers (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, Doppler)
- Configuration files committed to private repos (rotate those too)
- Local developer `.env` files (notify the team)

After the rollout, monitor your application logs for `password authentication failed` errors. Those flag a place you missed.
