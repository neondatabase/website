---
title: Branch archiving
subtitle: Learn how Neon automatically archives inactive branches to cost-effective archive storage
enableTableOfContents: true
updatedOn: '2024-10-15T17:19:50.116Z'
---

<Admonition type="note" title="Only enabled on the Free Plan">
Currently, branch archiving is only enabled on the Free Plan. Branch archiving will be introduced on paid plans at a later date.
</Admonition>

To minimize storage costs, Neon automatically archives branches that are:

- Older than **14 days**. 
- Have not been accessed for the past **24 hours**

Both conditions must be true.

**No action is required to unarchive a branch. It happens automatically.** Accessing an archived branch through actions such as connecting to the branch or querying it will automatically unarchive the the branch. However, connection and query times may be slower during the unarchive process. For all actions that trigger the unarchive process, see [Actions that automatically unarchive branches](#actions-that-automatically-unarchive-branches).

## Identifying archived branches

Archived branches are easy to identify in the Neon Console. On the **Branches** page, archived branches are identified by an archive icon, as shown below.

![archived_branch_icon](/docs/guides/archived_branch_icon.png)

If you select an archived branch, you can find out exactly when the branch was archived:

![archived_branch_icon](/docs/guides/archived_branch_details.png)

Archive and unarchive operations can also be monitored in the Neon Console or using the Neon API. See [Monitoring branch archiving](#monitoring-branch-archiving).  

## About archive storage

For Neon projects created in AWS regions, are archived to cost-efficient storage on Amazon S3. For Neon projects created in Azure regions, branches are archived to Azure Blob storage.

## Is automatic branch archiving configurable?

Branch archiving  is not configurable on the Neon Free Plan. When branch archiving becomes available on Neon paid plan, configuration options such as disabling archiving will be available on those plans.

## Actions that automatically unarchive branches

Any action that accesses an archived branch will trigger the the unarchive process, which transfers the branch from archive storage back to regular Neon storage. Any actions that accesses a branch will unarchive it. For example these action unarchive a branch:

- **Connecting to the branch**
- **Querying the branch from the Neon SQL Editor**
- **Viewing the branch on the Tables page in the Neon Console**
- **Creating a child branch**
- **Creating a role on a branch**
- **Creating a database on a branch**
- **Reset from parent**
- **Restore**
- **Delete**
- **Setting the branch as protected**
- **Setting the branch as default**
- **Renaming the branch**
- **Any Neon CLI commands and API calls that access the branch**

## Checking branch archive status

In the Neon Console, you can check the state of a Neon branch on the **Branches** page. Archived branches are listed with an archive icon.

[branches page with archived branches](/docs/guides/archived_branches.png)

For additional details, such as when the branch was archived, select the branch to view details about the branch including its **Archive status**, which provides a timestamp for when the brach was archived.

[branches page with archived branches](/docs/guides/archived_branch_status.png)

## Monitoring branch archiving

You can monitor branch archive and unarchive operations from the **System operations** tab on the **Monitoring** page in the Neon Console. Look for the the following operations:

- `Timeline archive`: The time when the branch archive operations was initiated
- `Timeline unarchive`: The time when the branch unarchive operation was initiated

You can also monitor branch archive and unarchive operations using Neon's [Get branch details](https://api-docs.neon.tech/reference/getprojectbranch) API.

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/{project-id}/branches/{branch_id} \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

The endpoint response includes either the branch's `current_state` or `pending_state`. A pending state is reported if the branch is transitioning between states. State values include:

- `init` - the branch is being created but is not available for querying.
- `ready` - the branch is fully operational and ready for querying. Expect normal query response times.
- `archived` - the branch is stored in cost-effective archival storage. Expect slow query response times.

```json {6}
{
  "branch": {
    "id": "br-cool-bread-a5mb9shh",
    "project_id": "dark-bar-78675274",
    "name": "main",
    "current_state": "ready",
    "state_changed_at": "2024-10-31T15:49:48Z",
    "logical_size": 30900224,
    "creation_source": "console",
    "primary": true,
    "default": true,
    "protected": false,
...
```

For example, if a branch is in the process of being archived, the `pending_state` will be `archived`. When a branch is being unarchived, the `pending_state` will be `ready`.
