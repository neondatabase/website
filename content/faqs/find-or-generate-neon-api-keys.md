---
title: 'Where can I find or generate API keys for Neon?'
subtitle: 'Generate keys in Account or Organization settings. Neon shows the token once at creation.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Personal API keys live under **Account settings** > **API keys** in the [Neon Console](https://console.neon.tech). Organization and project-scoped keys live under your organization's **Settings** > **API keys**. The Console lists every key's name, who created it, and when it was last used, but it does not show the secret token after creation. Save the token in a secret manager as soon as you create the key.

## Generate a key

<Tabs labels={["Personal", "Organization", "Project-scoped"]}>

<TabItem>

Personal keys give you access to every organization and project you're a member of.

1. In the [Neon Console](https://console.neon.tech), open the user menu and click **Account settings**.
2. Select **API keys**.
3. Click **Create new API key**, give it a descriptive name, then click **Create**.
4. Copy the token immediately. You won't be able to view it again.

See [Create a personal API key](/docs/manage/api-keys#create-a-personal-api-key).

</TabItem>

<TabItem>

Organization keys have admin-level access to every project in the organization. Only org admins can create them.

1. Switch to your organization in the breadcrumb at the top of the Console.
2. Open **Settings** > **API keys**.
3. Click **Create new**, choose **Organization**, name the key, and click **Create**.
4. Copy the token now.

See [Create an organization API key](/docs/manage/api-keys#create-an-organization-api-key).

</TabItem>

<TabItem>

Project-scoped keys can only access a single project and can't delete it. Any org member can create one.

1. In your organization's **Settings** > **API keys**, click **Create new** and select **Project-scoped**.
2. Pick the project, name the key, and click **Create**.
3. Copy the token.

See [Create project-scoped organization API keys](/docs/manage/api-keys#create-project-scoped-organization-api-keys).

</TabItem>

</Tabs>

Use the key with `Authorization: Bearer $NEON_API_KEY` on Neon API calls. For the CLI, pass it with the `--api-key` global option (or set the `NEON_API_KEY` environment variable) instead of running `neon auth`, which launches an interactive browser login.

## List or revoke existing keys

- Personal: **Account settings** > **API keys** shows existing keys with **Revoke** buttons.
- Organization or project-scoped: org **Settings** > **API keys**.

Revocation is immediate and permanent. Any request using a revoked key returns `401 Unauthorized`. To rotate, create a new key first, switch your callers over, then revoke the old one.

<Admonition type="warning" title="The token is shown once and only once">
Neon displays the secret token a single time, in the modal that opens right after you click **Create**. The Console will list the key's name and ID afterward, but there's no way to view the token again. If you didn't save it, you'll need to revoke the key and create a new one. Store new tokens in a secret manager (AWS KMS, Azure Key Vault, 1Password, Vault, etc.) at creation time.
</Admonition>

<Admonition type="note" title="There are no client-safe Neon keys">
All Neon API keys are secrets and grant access to manage projects, branches, and roles. There's no equivalent of a "publishable" key. Never ship a Neon API key in a browser bundle or mobile app. For client-facing access, use the [Data API](/docs/data-api/overview) with [Neon Auth](/docs/auth/overview) instead.
</Admonition>

<CTA title="API keys reference" description="Full guide to creating, listing, and revoking keys via the Console and the API." buttonText="Read the docs" buttonUrl="/docs/manage/api-keys" />
