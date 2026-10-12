---
title: "How do I rotate my Neon API keys after they've been exposed?"
subtitle: 'Revoke the compromised key, create a new one, and update every system that uses it.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I rotate my database URL or connection string in Neon?'
  slug: rotate-database-url-connection-string
nextLink:
  title: 'Which serverless database services charge per second instead of per month for Postgres?'
  slug: serverless-database-services-postgres-charge-per-second
---

Neon API keys don't expire or rotate on a schedule, so you rotate them by hand. If a key was exposed, revoke it first (revocation is immediate), then create a replacement and update every CI job, script, or service that used it. For routine rotation, create the replacement first, roll it out, then revoke the old key, so nothing loses access in between. Personal, organization, and project-scoped keys all work this way ([Rotate an API key](/docs/manage/api-keys#rotate-an-api-key)).

## Revoke the compromised key

Revocation is immediate and permanent. Any request that uses the revoked key fails with `401 Unauthorized`, and you can't reactivate it.

<Tabs labels={["Personal", "Organization", "Project-scoped"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech).
2. Open the profile menu in the top right and go to **Settings → API keys**.
3. Find the exposed key and click **Revoke**.

</TabItem>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech) and switch to the organization.
2. Go to **Settings → API keys**.
3. Click **Revoke** next to the affected key. Only organization admins can revoke organization keys.

</TabItem>

<TabItem>

Project-scoped keys belong to the organization, so they're listed on the organization's **Settings → API keys** page. Find the key, confirm the project it's bound to, and click **Revoke**. Only organization admins can revoke project-scoped keys.

</TabItem>

</Tabs>

You can also revoke a key with the CLI or API, using the numeric key ID (not the name) from the key list. For a personal key:

```bash shouldWrap
neon api-keys revoke $KEY_ID

# or with the API
curl -X DELETE \
  "https://console.neon.tech/api/v2/api_keys/$KEY_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json"
```

For organization and project-scoped keys, pass `--org-id` to the CLI command, or use the [Revoke organization API key](/docs/reference/api/organizations/revoke-org-api-key) endpoint. See [Revoke API keys](/docs/manage/api-keys#revoke-api-keys).

## Create a replacement key

Create a new key with the same scope as the old one, and give it a name you'll recognize in the key list. For routine rotation, do this before you revoke the old key.

In the Console, go to **Settings → API keys** from the profile menu (personal) or from your organization (organization or project-scoped), and click **Create new**. From the CLI, run [`neon api-keys create`](/docs/cli/api-keys#create), adding `--project-id` for a project-scoped key.

From the API, the endpoint depends on the key type. For a personal key:

```bash shouldWrap
curl https://console.neon.tech/api/v2/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PERSONAL_API_KEY" \
  -d '{"key_name": "ci-pipeline-rotated-2026-05"}'
```

For an organization key, call the organization endpoint with a personal API key. Add `project_id` to make it project-scoped:

```bash shouldWrap
curl https://console.neon.tech/api/v2/organizations/$ORG_ID/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PERSONAL_API_KEY" \
  -d '{"key_name": "ci-pipeline-rotated-2026-05", "project_id": "some-project-123"}'
```

The new key is shown only once, so copy it into a secret manager right away. See [Creating API keys](/docs/manage/api-keys#creating-api-keys).

## Update everything that used the old key

Update every caller that used the old key:

- GitHub Actions, GitLab CI, CircleCI, or other CI secrets that hold `NEON_API_KEY`
- Terraform Cloud or self-hosted Terraform variable stores
- The Neon CLI, wherever it authenticates with `NEON_API_KEY` or `--api-key`
- Any custom scripts, serverless functions, or workflows that call the Neon API
- MCP server configurations that authenticate with the Neon API

<Admonition type="tip" title="Limit what a leaked key can do">
Store keys in a secret manager so a rotation is one update. For CI, use a [project-scoped key](/docs/manage/api-keys#create-project-scoped-organization-api-keys) instead of a personal key. It can only reach one project and can't create projects or mint API keys.
</Admonition>

For broader credential rotation (Postgres passwords plus API keys), see [How do I rotate all my Neon database credentials?](/faqs/rotate-database-credentials-after-breach).
