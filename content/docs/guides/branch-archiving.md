---
title: Branch archiving
subtitle: Learn how Neon automatically archives inactive branches to cost-effective storage
enableTableOfContents: true
updatedOn: '2024-10-15T17:19:50.116Z'
---

<Admonition type="note" title="Only enabled on the Free Plan">
Automatic archiving of inactive branches is only enabled on the Free Plan. Branch archiving will be introduced on paid plans at a later date.
</Admonition>

To minimize storage costs, Neon automatically archives branches that are:

- Older than **14 days**.
- Have not been accessed for the past **24 hours**

Both conditions must be true for a branch to be archived.

## Unarchiving a branch

**No action is required to unarchive a branch. It happens automatically.**

Connecting to an archived branch, querying it, or performing some other action that accesses it will trigger the unarchive process. Connection times and query times may be slower while a branch is unarchived.

The following actions will automatically unarchive a branch, transferring the branch's data back to regular Neon storage:

- [Connecting to or querying the branch from a client or application](https://neon.tech/docs/connect/connect-from-any-app)
- [Querying the branch from the Neon SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor)
- [Viewing the branch on the Tables page in the Neon Console](https://neon.tech/docs/guides/tables)
- [Creating a child branch](https://neon.tech/docs/manage/branches#create-a-branch)
- [Creating a role on a branch](https://neon.tech/docs/manage/roles#create-a-role)
- [Creating a database on a branch](https://neon.tech/docs/manage/databases#create-a-database)
- [Reset the branch from its parent](https://neon.tech/docs/manage/branches#reset-a-branch-from-parent)
- [Performing a restore operation on a branch](https://neon.tech/docs/guides/branch-restore)
- [Setting the branch as protected](https://neon.tech/docs/guides/protected-branches)
- Running [Neon CLI](https://neon.tech/docs/reference/neon-cli) commands or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) calls that access the branch

## Identifying archived branches

Archived branches can be easily identified in the Neon Console. On the **Branches** page, archived branches are identified by an archive icon, as shown below:

![archived_branch_icon](/docs/guides/archived_branch_icon.png)

If you select an archived branch on the **Branches** page to view its details, you can find out when the branch was archived:

![archived_branch_icon](/docs/guides/archived_branch_details.png)

Archive and unarchive operations can also be monitored in the Neon Console or using the Neon API. See [Monitoring branch archiving](#monitoring-branch-archiving).

## About archive storage

For Neon projects created in AWS regions, inactive branches are archived in Amazon S3 storage. For Neon projects created in Azure regions, branches are archived in Azure Blob storage. For more information about how archive storage works in Neon, refer to [Archive storage](/docs/introduction/architecture-overview#archive-storage) in our architecture documentation.

## Is automatic branch archiving configurable?

Branch archiving is not configurable on the Neon Free Plan. When branch archiving becomes available on Neon paid plan, configuration options such as disabling archiving may be offered on those plans.

## Monitoring branch archiving

You can monitor branch archive and unarchive operations from the **System operations** tab on the **Monitoring** page in the Neon Console. Look for the following operations:

- `Timeline archive`: The time when the branch archive operation was initiated
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
- `archived` - the branch is stored in cost-effective archive storage. Expect slow query response times.

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
