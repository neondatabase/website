---
title: Transfer projects
summary: >-
  Move Neon projects between organizations without changing credentials or
  connection strings, via the Console or API. The destination organization's
  plan must be the same tier or higher than the source.
enableTableOfContents: true
updatedOn: '2026-07-21T16:33:46.856Z'
---

Move projects between organizations you belong to in the Neon Console or via the Neon API. You can also hand a project to a different Neon account with a claim link.

Transferring a project does not change its credentials or connection string, so connected applications keep working. Billing and usage move to the destination organization, and project limits follow the destination organization's [plan](/docs/introduction/plans).

Before you transfer, review [Limits and requirements](#limits-and-requirements). In particular, disconnect any project integrations first, and make sure the destination organization's plan is the same tier or higher than the source organization's.

## Ways to transfer

<Tabs labels={["Console (single)", "Console (multiple)", "API"]}>

<TabItem>

1. Open the project's **Settings** page.
2. Select **Transfer** from the sidebar.
3. Choose the destination organization.

![transfer single project to another org](/docs/manage/transfer_project.png)

**Alternative: create a claim link**

The steps above transfer a project to one of your own organizations. As an alternative, you can hand a project to a **different Neon account**. On the same **Transfer** page, select **Create claim link** and share the generated link with the recipient. When they sign in and open it, they choose which of their organizations to transfer the project into. The link expires after 24 hours by default.

To automate this flow, see [Claimable database integration](/docs/workflows/claimable-database-integration).

</TabItem>

<TabItem>

1. Use the organization switcher to select the source organization.
2. Open **Settings** > **Transfer projects**.
3. Select the projects to transfer, then click **Next**.

   <img src="/docs/manage/transfer_multiple.png" alt="transfer multiple projects from org settings" width="480" />

4. Choose the destination organization, then click **Transfer**.

   <img src="/docs/manage/transfer_multiple_org.png" alt="choose the destination organization" width="480" />

</TabItem>

<TabItem>

Transfer projects with a [personal API key](/docs/manage/api-keys#create-a-personal-api-key) that has access to both organizations. Organization API keys are not supported.

`POST /organizations/{source_org_id}/projects/transfer`

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/organizations/{source_org_id}/projects/transfer' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $PERSONAL_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
  "project_ids": [
    "project-id-1",
    "project-id-2"
  ],
  "destination_org_id": "destination-org-id"
}'
```

Where:

- `source_org_id` (in URL path) is the organization where projects currently reside
- `destination_org_id` is the organization receiving the projects
- `project_ids` is an array of up to 400 project IDs to transfer

A `200` response with an empty object (`{}`) means the transfer succeeded. A `406` (plan or capacity) or `422` (active integrations) means it failed; see [Limits and requirements](#limits-and-requirements) to resolve.

For the full request and response schema, see the [API reference](/docs/reference/api/organizations/transfer-projects-from-org-to-org).

As an alternative, to hand a project to a different Neon account, create a claim link. See [Claimable database integration](/docs/workflows/claimable-database-integration).

</TabItem>

</Tabs>

## Limits and requirements

- Transfer up to **200** projects at a time in the Console, or **400** via the API.
- Destination organization must have capacity for the projects under its [plan](/docs/introduction/plans) (for example, project count limits).
- Destination organization plan must be the **same tier or higher** than the source organization plan (for example, Launch to Scale works; Scale to Launch does not). This is a plan-level check, independent of the project's settings.
- Requires **Admin** in the source organization and at least **Member** in the destination organization. See [User Permissions](/docs/manage/user-permissions).
- Disconnect project integrations before you transfer. Open the project's **Integrations** page and remove any added integrations (for example, GitHub or Vercel). See [Manage integrations](/docs/manage/integrations).
- [Vercel-managed organizations](/docs/guides/vercel-managed-integration) are not supported as source or destination.
- HIPAA projects can only move to a HIPAA-enabled organization.

If a transfer fails:

- **Plan or capacity** (API `406`): the destination organization has a lower plan than the source, no free project slots, or doesn't allow a project's region. Upgrade the destination organization, free up slots, or choose a different organization.
- **Integrations** (API `422`): one or more projects still have active integrations (for example, GitHub or Vercel). Remove them and retry.

<NeedHelp/>
