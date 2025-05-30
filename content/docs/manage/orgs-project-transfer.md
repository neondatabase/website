---
title: Transfer projects
enableTableOfContents: true
updatedOn: '2025-02-28T20:32:00.526Z'
---

You can transfer your projects to any organization you are a member of. You can do this individually from project **Settings**, in bulk from organization **Settings**, or via the Neon API.

## Limits & requirements

- Transfer up to **200** projects at a time in the Console, or **400** via the API.
- Limited by the destination org’s plan.
- Requires **Admin** rights in the source org and at least **Member** rights in the destination org.
- Projects with GitHub or Vercel integrations cannot be transferred.
- Vercel-managed orgs are not supported.

<Steps>
## Transfer a single project

Navigate to the **Settings** page of the project you want to transfer, and select **Transfer** from the sidebar. Then use the dialog to select the organization you want to transfer this project into.

Since this removes the project from your current org, you need **Admin** rights in this org to move the project (like if you wanted to delete the project). You only need **Member** access in the destination org.

![transfer single project to another org](/docs/manage/transfer_project.png)

## Transfer multiple projects at once

Use the org switcher in the top navbar to select the Organization that owns the projects you want to move. From Organization **Settings**, select **Transfer projects** from the sidebar and use the dialog to:

- Choose the **projects** you want to move
- Choose the **org** you want to move them to

You'll need **Admin** rights in the source org, and at least **Member** rights in the destination.

![transfer mulitple projects from org settings](/docs/manage/transfer_multiple.png)

## Via API (for automation or large numbers of projects)

You can also transfer projects from one org to another using the Neon API:

`POST /organizations/{source_org_id}/projects/transfer`

**You'll need:**

<div style={{ display: 'flex', alignItems: 'start', marginBottom: '0.5em' }}>
  <span style={{ marginRight: '0.5em' }}>✅</span>
  <span>
    <a href="/docs/manage/api-keys#create-a-personal-api-key">Personal API key (with access to both orgs)</a>
    </span>
</div>

<div style={{ display: 'flex', alignItems: 'start', marginBottom: '0.5em' }}>
  <span style={{ marginRight: '0.5em' }}>✅</span>
  <span>Admin rights in the source org</span>
</div>

<div style={{ display: 'flex', alignItems: 'start', marginBottom: '0.5em' }}>
  <span style={{ marginRight: '0.5em' }}>✅</span>
  <span>At least Member rights in the destination org</span>
</div>

<div style={{ display: 'flex', alignItems: 'start', marginBottom: '0.5em' }}>
  <span style={{ marginRight: '0.5em' }}>✅</span>
  <span>Compatible billing plans between orgs (for example, projects can move from Scale to Launch but not the other way around)</span>
</div>

**Example request**

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/organizations/{source_org_id}/projects/transfer' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $API_KEY' \
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

### Response behavior

A successful transfer returns a 200 status code with an empty JSON object:

```json
{}
```

You can verify the transfer in the Neon Console or by listing the projects in the destination organization via API.

### Error responses

The API may return these errors:

- **`406`** – Transfer failed - the target organization has too many projects or its plan is incompatible with the source organization. Reduce projects or upgrade the organization.
- **`422`** – One or more of the provided project IDs have GitHub or Vercel integrations installed. Transferring integration projects is currently not supported.

</Steps>

<NeedHelp/>
