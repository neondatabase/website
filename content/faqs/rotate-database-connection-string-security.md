---
title: 'How do I rotate my Neon database connection string for security purposes?'
subtitle: 'The connection string is derived from the role password, so rotating one rotates the other.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

## Quick answer

A Neon connection string is built from four things: the role name, the role password, the compute hostname, and the database name. The hostname and database name don't rotate. The password does. So "rotate the connection string" means reset the role's password, copy the new connection string from the **Connect** modal, and roll it out to every place it's stored.

## What the connection string looks like

A standard Neon connection string has this shape:

```text shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The password is the only segment that changes when you rotate. See [Connect from any application](/docs/connect/connect-from-any-app) for the full breakdown.

## Reset the password and copy the new string

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech) and select your project.
2. Go to **Branches** and select the branch.
3. On the **Roles & Databases** tab, choose **Reset password** from the role's menu.
4. Copy the new password from the confirmation modal.
5. Back on the Project Dashboard, click **Connect** to copy the updated connection string.

See [Reset a password](/docs/manage/roles#reset-a-password).

</TabItem>

<TabItem>

```bash shouldWrap
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles/$ROLE_NAME/reset_password" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq
```

The response contains the new `password`. Construct the connection string with the hostname from your project, or call the [get_connection_uri endpoint](https://api-docs.neon.tech/reference/getconnectionuri) to get a ready-made URI.

</TabItem>

</Tabs>

## Update environment variables

The new connection string needs to land in every place that holds the old one before clients can reconnect:

- Vercel: **Project Settings → Environment Variables** for each environment, then redeploy. If you use the [Neon Vercel integration](/docs/guides/vercel-overview), the integration can push rotated values for you.
- Render, Fly, Railway: their dashboard's environment variables UI, followed by a restart.
- GitHub Actions, GitLab CI: repository or organization secrets.
- Secret managers: update the secret, then trigger a reload in any service that caches it.
- Local `.env` files: notify your team to pull the new value.

<Admonition type="warning" title="New connections need the new password">
Existing open sessions stay connected, but any new connection attempt with the old password fails. Roll out the new value to your deploy targets before (or right after) you reset, so reconnects don't fail to authenticate.
</Admonition>

## When you need to keep the old connection string working

If you can't change every consumer at once, create a second Postgres role with its own password, point new consumers at it, and drop the old role only after you've confirmed nothing still uses it. See the alternative approach in [How do I rotate my database URL or connection string?](/faqs/rotate-database-url-connection-string).

<CTA title="Build connection-string rotation into your workflow" description="The Neon API and CLI make it easy to automate password rotation on a schedule." buttonText="API reference" buttonUrl="https://api-docs.neon.tech/reference/resetprojectbranchrolepassword" />
