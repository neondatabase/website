---
title: Branch archiving
subtitle: Learn how Neon automatically archives inactive branches to cost-effective object storage
enableTableOfContents: true
updatedOn: '2024-10-15T17:19:50.116Z'
---

To minimize storage costs, Neon automatically archives branches that have not been accessed for 7 days. These branches are transferred to cost-efficient archive storage. 

Archive storage is billed $0.10 per GB-month, which is significantly cheaper than regular storage. For more information about how archive storage is billed, see [Archive storage billing](#tbd).

## About archive storage

For Neon projects created in AWS regions, branches that have not been accessed for 7 days are archived to Amazon S3. For Neon projects created in Azure regions, branches are archived to Azure Blob storage.

## How branch archiving works

Neon performs a periodic check for branches that have not been accessed for 7 days. For any branch that exceeds this threshold, an archive process is triggered, which transfers the branch from regular Neon storage to archive storage.

## Is automatic branch archiving configurable?

Automatic archiving of inactive branches is currently not configurable. With the exception of protected branches, any branch that is not access for 7 days is automatically moved to archive storage.

## Performance of archived branches

The archiving process itself has no impact on the performance of other branches, as each branch is isolated with its own compute resources. However, the archive / unarchive process does impact connection and query performance for the branch itself as it moves in or out of archive storage. You can expect connection and query response times for the branch to be slower during this period.

**How log does it take to archive or unarchive a branch?**

## Actions that automatically unarchive branches

Any action that accesses an archived branch will trigger the transfer of the branch from archive storage back to regular storage. For example, any of the following actions will bring a branch out of archive storage:

- **Connecting to the branch**: For example, if you connect to an archived branch from an application or database client, this will trigger a transfer of the branch out of archive storage. 
- **Querying the branch from the Neon SQL Editor**: Querying a branch from the editor initiates a connection to the branch, which in turn causes the branch to be transferred from archive storage.
- **Creating a child branch**: Creating a child branch on an archived branch brings the branch out of archive storage. The child branh creation process will be slow during this process.
- **Creating a role on a branch**
- **Creating a database on a branch**
- **Reset from parent**
_ **Restore**
- **Delete**
- **Neon CLI commands and API calls that access the branch**

## Checking branch archive status

In the Neon Console, you can check the state of a Neon branch on the **Branches** page. Archived branches are listed with an archive icon.

[branches page with archived branches](/docs/guides/archived_branches.png)

For additional details, such as when the branch was archived, select the branch to view details about the branch including its **Archive status**, which provides a timestamp for when the brach was archived.

[branches page with archived branches](/docs/guides/archived_branch_status.png)

## Monitoring branch archiving

You can monitor branch archive and unarchive operations from the **System operations** tab on the **Monitoring** page in the Neon Console. Look for the the following operations:

- `Timeline archive`: The time when the branch archive operations was initiated
- `Timeline unarchive`: The time when the branch unarchive operation was initiated

You can also monitor branch archiving and unarchiving using Neon's [Get branch details](https://api-docs.neon.tech/reference/getprojectbranch) API. 

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

For example, if a branch is in the process of being archived, the `pending_state` will be `archived`. When a branch is being unarchived, the `pending_state`  will be `ready`.
