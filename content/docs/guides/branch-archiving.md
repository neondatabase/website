---
title: Branch archiving
subtitle: Learn how Neon automatically archives inactive branches to cost-effective
  storage
enableTableOfContents: true
updatedOn: '2024-12-02T23:14:56.367Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How Neon archives inactive branches</p>
<p>How branches are unarchived</p>
<p>How to monitor branch archiving</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/introduction/architecture-overview#archive-storage">Archive storage</a>
  <a href="/docs/reference/cli-branches#list">Branches list command (Neon CLI)</a>
  <a href="https://api-docs.neon.tech/reference/getprojectbranch">Get branch details (Neon API)</a>
</DocsList>

</InfoBlock>

To minimize storage costs, Neon automatically archives branches that are:

- Older than **14 days**.
- Have not been accessed for the past **24 hours**

Both conditions must be true for a branch to be archived.

Additionally, these conditions apply:

- A branch cannot be archived if it has an unarchived child branch.
- A child branch must be archived before a parent branch can be archived.
- Protected branches cannot be archived.

<Admonition type="note">
If your Neon project was inactive for more than a week before the introduction of branch archiving on November 11, 2024, the thresholds mentioned above are not tracked until the next time you access branches in your project.
</Admonition>

## Unarchiving a branch

**No action is required to unarchive a branch. It happens automatically.**

Connecting to an archived branch, querying it, or performing some other action that accesses it will trigger the unarchive process. Branches with large amounts of data may experience slightly slower connection and query times while a branch is being unarchived.

<Admonition type="note">
When a branch is unarchived, its parent branches, all the way up to the root branch, are also unarchived.
</Admonition>

The following actions will automatically unarchive a branch, transferring the branch's data back to regular Neon storage:

- [Connecting to or querying the branch from a client or application](/docs/connect/connect-from-any-app)
- [Querying the branch from the Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor)
- [Viewing the branch on the Tables page in the Neon Console](/docs/guides/tables)
- [Creating a child branch](/docs/manage/branches#create-a-branch)
- [Creating a role on a branch](/docs/manage/roles#create-a-role)
- [Creating a database on a branch](/docs/manage/databases#create-a-database)
- [Reset the branch from its parent](/docs/manage/branches#reset-a-branch-from-parent)
- [Performing a restore operation on a branch](/docs/guides/branch-restore)
- [Setting the branch as protected](/docs/guides/protected-branches)
- Running [Neon CLI](/docs/reference/neon-cli) commands or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) calls that access the branch

## Identifying archived branches

Archived branches can be easily identified in the Neon Console. On the **Branches** page, archived branches are identified by an archive icon, as shown below:

![the archive icon shown on a branch in the branches list page](/docs/guides/archived_branch_icon.png)

If you select an archived branch on the **Branches** page to view its details, you can find out when the branch was archived:

![the archive status shown on a branch in the branch detail page](/docs/guides/archived_branch_details.png)

Archive and unarchive operations can also be monitored in the Neon Console or using the Neon API. See [Monitoring branch archiving](#monitoring-branch-archiving).

## About archive storage

For Neon projects created in AWS regions, inactive branches are archived in Amazon S3 storage. For Neon projects created in Azure regions, branches are archived in Azure Blob storage. For more information about how archive storage works in Neon, refer to [Archive storage](/docs/introduction/architecture-overview#archive-storage) in our architecture documentation.

## Is automatic branch archiving configurable?

Branch archiving is not configurable. Archiving and unarchiving happen automatically. However, you can prevent a branch from being archived by setting it as a **protected branch**. For instructions, see [Set a branch as protected](/docs/manage/branches#set-a-branch-as-protected).

## Monitoring branch archiving

You can monitor branch archive and unarchive operations from the **System operations** tab on the **Monitoring** page in the Neon Console. Look for the following operations:

- `Timeline archive`: The time when the branch archive operation was initiated
- `Timeline unarchive`: The time when the branch unarchive operation was initiated

For related information, see [System operations](/docs/manage/operations).

You can also monitor branch states using the Neon CLI or Neon API.

<Tabs labels={["CLI", "API"]}>

<TabItem>
The Neon CLI [branches list](/docs/reference/cli-branches#list) command shows a branch's `Current State`. Branch states include:

- `init` - the branch is being created but is not available for querying.
- `ready` - the branch is fully operational and ready for querying. Expect normal query response times.
- `archived` - the branch is stored in cost-effective archive storage. Expect slow query response times.

      ```bash
      neon branches list --project-id green-hat-46829796
      ┌───────────────────────────┬──────┬─────────┬───────────────┬──────────────────────┐
      │ Id                        │ Name │ Default │ Current State │ Created At           │
      ├───────────────────────────┼──────┼─────────┼───────────────┼──────────────────────┤
      │ br-muddy-firefly-a7kzf0d4 │ main │ true    │ ready         │ 2024-10-30T14:59:57Z │
      └───────────────────────────┴──────┴─────────┴───────────────┴──────────────────────┘
      ```

</TabItem>

<TabItem>
The Neon API's [Get branch details](https://api-docs.neon.tech/reference/getprojectbranch) endpoint can retrieve a branch's state:

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/{project-id}/branches/{branch_id} \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

The response includes a `current_state`, a `state_changed_at` timestamp for when the current state began, and a `pending_state` if the branch is currently transitioning between states. State values include:

- `init` - the branch is being created but is not available for querying.
- `ready` - the branch is fully operational and ready for querying. Expect normal query response times.
- `archived` - the branch is stored in cost-effective archive storage. Expect slow query response times.

This example shows a branch that is currently `archived`. The `state_changed_at` shows a timestamp indicating when the state last changed.

```json {6}
{
  "branch": {
    "id": "br-broad-smoke-w2sqcu0i",
    "project_id": "proud-darkness-91591984",
    "parent_id": "br-falling-glade-w25m64ct",
    "parent_lsn": "0/1F78F48",
    "parent_timestamp": "2024-10-02T08:54:18Z",
    "name": "dev/alex",
    "current_state": "archived",
    "state_changed_at": "2024-11-06T14:20:58Z",
    "logical_size": 30810112,
    "creation_source": "console",
    "primary": false,
    "default": false,
    "protected": false,
    ...
```

</TabItem>

</Tabs>

<NeedHelp/>
