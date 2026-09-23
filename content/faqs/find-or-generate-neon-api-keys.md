---
title: 'Where can I find or generate API keys for Neon?'
subtitle: 'Generate keys in Account or Organization settings. Neon shows the token once at creation.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Where can I find my DATABASE_URL in Neon?'
  slug: find-database-url-neon
nextLink:
  title: 'Where can I find the pooled connection string in my Neon dashboard?'
  slug: find-pooled-connection-string-dashboard
---

Personal API keys live under **Account settings** > **API keys** in the [Neon Console](https://console.neon.tech). Organization and project-scoped keys live under your organization's **Settings** > **API keys**. Each page lists your existing keys with their name, ID, and creation details, but the Console shows the secret token only once, right after you create the key. Save it in a secret manager at that point.

## Generate a key

<Tabs labels={["Personal", "Organization", "Project-scoped"]}>

<TabItem>

Any user can create a personal key. It can access every project you're a member of across your organizations, and it loses access to an organization's projects if you leave that organization.

1. In the [Neon Console](https://console.neon.tech), open the user menu and click **Account settings**.
2. Select **API keys**.
3. Click **Create new API key**, give it a descriptive name, then click **Create**.
4. Copy the token immediately. You won't be able to view it again.

See [Create a personal API key](/docs/manage/api-keys#create-a-personal-api-key).

</TabItem>

<TabItem>

Organization keys have admin-level access to every project in the organization. Only organization admins can create them.

1. Switch to your organization in the breadcrumb at the top of the Console.
2. Open **Settings** > **API keys**.
3. Click **Create new**, choose **Organization**, name the key, and click **Create**.
4. Copy the token now.

See [Create an organization API key](/docs/manage/api-keys#create-an-organization-api-key).

</TabItem>

<TabItem>

Project-scoped keys have Editor access on a single project: they can read and modify project resources but can't delete the project or manage who can access it. Only organization admins can create them.

1. In your organization's **Settings** > **API keys**, click **Create new** and select **Project-scoped**.
2. Pick the project, name the key, and click **Create**.
3. Copy the token.

See [Create project-scoped organization API keys](/docs/manage/api-keys#create-project-scoped-organization-api-keys).

</TabItem>

</Tabs>

Send the key as `Authorization: Bearer $NEON_API_KEY` on Neon API calls. With the Neon CLI, pass it with the global `--api-key` option or set the `NEON_API_KEY` environment variable. Either one skips `neon login`, which opens a browser to authenticate. See [neon login](/docs/cli/login).

## List or revoke existing keys

- Personal keys: **Account settings** > **API keys**, then click **Revoke** next to the key.
- Organization and project-scoped keys: your organization's **Settings** > **API keys**. Organization admins can revoke them.

Revocation is immediate and permanent, and any request that uses a revoked key fails with `401 Unauthorized`. Neon API keys don't expire, so you rotate them by hand: create a new key with the same scope, switch your callers over, then revoke the old key. If a key was exposed, revoke it first. See [Rotate an API key](/docs/manage/api-keys#rotate-an-api-key).

<Admonition type="warning" title="The token is shown once">
Neon displays the secret token one time, right after you click **Create**. The Console lists the key's name and ID afterward, but you can't view the token again. If you didn't save it, revoke the key and create a new one.
</Admonition>

<Admonition type="note" title="There are no client-safe Neon keys">
Every Neon API key is a secret that can manage projects, branches, and roles. There's no "publishable" key type, so never ship a Neon API key in a browser bundle or mobile app. For client-side access, use the [Data API](/docs/data-api/overview), which validates user JWTs from [Managed Better Auth](/docs/auth/overview) or another provider and enforces Row-Level Security.
</Admonition>

<CTA title="API keys reference" description="Full guide to creating, listing, and revoking keys via the Console and the API." buttonText="Read the docs" buttonUrl="/docs/manage/api-keys" />
