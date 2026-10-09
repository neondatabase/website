---
title: 'How do I rotate my Neon database connection string for security purposes?'
subtitle: 'The connection string is derived from the role password, so rotating one rotates the other.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I reset or change my database password in Neon?'
  slug: reset-database-password
nextLink:
  title: 'How do I rotate all my Neon database credentials and connection strings after a security breach?'
  slug: rotate-database-credentials-after-breach
---

A Neon connection string is built from four parts: the role name, the role password, the compute hostname, and the database name. Only the password rotates. To rotate the connection string, reset the role's password, copy the new connection string from the **Connect** modal, and roll it out everywhere it's stored ([Rotate credentials](/docs/security/security-overview#rotate-credentials)).

## What the connection string looks like

Here's a pooled Neon connection string:

```text shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

After a rotation, only `AbC123dEf` (the password) changes. See [Connect from any application](/docs/connect/connect-from-any-app) for what each part means.

## Reset the password and copy the new string

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech) and select your project.
2. In the sidebar, select your branch from the **BRANCH** selector.
3. Under **Postgres database**, select **Roles**.
4. Choose **Reset password** from the role's menu, then click **Reset**.
5. Click **Connect** in the Console nav to copy the updated connection string.

See [Reset a password](/docs/manage/roles#reset-a-password).

</TabItem>

<TabItem>

```bash shouldWrap
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq
```

The response contains the new password under `role.password`. Build the connection string from it, or call the [get connection URI endpoint](/docs/reference/api/projects/get-connection-uri) for a ready-made one.

</TabItem>

</Tabs>

## Update environment variables

Update every place that stores the old connection string:

- Vercel: **Project Settings → Environment Variables** for each environment, then redeploy. With the [Neon-Managed integration](/docs/guides/neon-managed-vercel-integration#password-rotation-behavior), resetting the password of the role you selected during setup syncs the new credentials to Vercel automatically.
- Render, Fly.io, Railway: update the environment variable or secret, then redeploy or restart the service so it picks up the new value.
- GitHub Actions, GitLab CI: repository or organization secrets.
- Secret managers: update the secret, then trigger a reload in any service that caches it.
- Local `.env` files: notify your team to pull the new value.

<Admonition type="warning" title="New connections need the new password">
Postgres checks the password when a connection opens, so sessions that are already open stay connected. Any new connection with the old password fails. Know every place the old value lives before you reset, so you can roll out the new one right away.
</Admonition>

## When you need to keep the old connection string working

If you can't update every consumer at once, create a second role with the same access, move consumers to it one at a time, then reset the old role's password to cut off the old string. The original role usually owns database objects, so you can't drop it until you reassign them ([Rotate without downtime](/docs/security/security-overview#rotate-without-downtime)). [How do I rotate my database URL or connection string?](/faqs/rotate-database-url-connection-string) walks through this approach.

<CTA title="Build connection-string rotation into your workflow" description="Use the Neon API to automate password rotation on a schedule." buttonText="API reference" buttonUrl="/docs/reference/api/branches/reset-project-branch-role-password" />
