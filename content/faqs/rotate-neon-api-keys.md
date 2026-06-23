---
title: "How do I rotate my Neon API keys after they've been exposed?"
subtitle: 'Revoke the compromised key, create a new one, and update every system that uses it.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-22T12:41:06.646Z'
isDraft: false
redirectFrom: []
---

## Quick answer

Neon API keys don't auto-rotate. To rotate a compromised key, revoke it (which immediately invalidates it), create a new key, and update every CI job, script, or service that uses the old value. You'll handle personal, organization, and project-scoped keys the same way, just from different settings pages.

## Revoke the compromised key

Revocation is immediate and permanent. Any request using the revoked key returns `401 Unauthorized` on the next call.

<Tabs labels={["Personal", "Organization", "Project-scoped"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech).
2. Click your account avatar and go to **Account settings → API keys**.
3. Find the exposed key and click **Revoke**.

</TabItem>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech) and switch to the organization.
2. Go to **Settings → API keys**.
3. Click **Revoke** next to the affected key. Only org admins can revoke organization keys.

</TabItem>

<TabItem>

Project-scoped keys live under the organization's API keys page. Find the key, confirm the `project_id` it's bound to, and click **Revoke**. Only org admins can revoke project-scoped keys.

</TabItem>

</Tabs>

You can also revoke via the API. Replace `$KEY_ID` with the numeric ID from the API keys list:

```bash shouldWrap
curl -X DELETE \
  "https://console.neon.tech/api/v2/api_keys/$KEY_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json"
```

See [Revoke API keys](/docs/manage/api-keys#revoke-api-keys).

## Create a replacement key

After revoking, create a new key with the same scope as the old one. Use a descriptive name so you can tell keys apart in the dashboard.

In the Console, go to **Account settings → API keys** (personal) or your organization's **Settings → API keys** (organization or project-scoped) and click **Create new**.

From the API, the endpoint differs by key type. Personal key:

```bash shouldWrap
curl https://console.neon.tech/api/v2/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PERSONAL_API_KEY" \
  -d '{"key_name": "ci-pipeline-rotated-2026-05"}'
```

Organization or project-scoped key (set `project_id` for project-scoped):

```bash shouldWrap
curl https://console.neon.tech/api/v2/organizations/$ORG_ID/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PERSONAL_API_KEY" \
  -d '{"key_name": "ci-pipeline-rotated-2026-05", "project_id": "some-project-123"}'
```

The new key value is shown once. Copy it immediately into a secret manager. See [Creating API keys](/docs/manage/api-keys#creating-api-keys).

## Update everything that used the old key

After rotation, find and update:

- GitHub Actions, GitLab CI, CircleCI, or other CI secrets that hold `NEON_API_KEY`
- Terraform Cloud or self-hosted Terraform variable stores
- The Neon CLI on developer laptops (run `neon auth` again, or set `--api-key`)
- Any custom scripts, serverless functions, or workflows that call the Neon API
- MCP server configurations that authenticate with the Neon API

<Admonition type="warning" title="There's no automatic rotation feature">
Neon does not currently rotate API keys on a schedule. Build rotation into your own operational cadence, store keys in a secret manager so updates only happen in one place, and prefer [project-scoped keys](/docs/manage/api-keys#create-project-scoped-organization-api-keys) over personal keys for CI workloads.
</Admonition>

For broader credential rotation (Postgres passwords plus API keys), see [How do I rotate all my Neon database credentials?](/faqs/rotate-database-credentials-after-breach).
