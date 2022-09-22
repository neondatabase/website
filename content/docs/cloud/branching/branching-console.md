---
title: Branching using the Console
enableTableOfContents: true
---

This topic describes how to create and manage branches using the Neon Console.

## Creating a branch

Creating a branch requires that you have a project to branch from. For information about creating a project, see [Setting up a project](/docs/getting-started-with-neon/setting-up-a-project).

To create a branch:

1. In the Neon Console, select the **Branches** tab.

2. Click **New Branch**.

3. Enter a name for the branch.

3. Select the project or brach that you want to branch from.

4. Select the type of branch you want to create. 
    - **Head**: Branch the current state of the parent project. The branch is created with all of the parent project data.
    - **Time**: Branch a specific point in time. The branch is created with the project data as it existed at the specified date and time.
    - **LSN**: Branch from a specified Log Sequence Number (LSN). The branch is created with the project data as it existed at the specified LSN.

5. Select whether or not to create an endpoint for the branch. An endpoint may not be necessary when using branch as a backup, for example.


## Viewing branches

Branches are listed on the **Projects** page in the Neon Console.

To access the Projects page, select **All Projects** from the project drop-down list at the top of the Neon Console.

You can identify a branch by its name, which has the following pattern:

```example
<project_id>-branch-<branch_id>
```

where:

<project_id> is the parent project
<branch_id> is the branch ID

For example, a branch name appears similar to the following:

```example
super-star-526912-branch-rough-queen-523183
```


## Renaming a branch

To rename a branch:

1. In the Neon Console, select the **Branches** tab.

2. Select the branch you want to rename.

3. If the left pane, select **Rename** from the menu associated with the branch.

4. Specify the new name and click **Save**.


## Deleting a branch

To delete a branch:

1. In the Neon Console, select the **Branches** tab.

2. Select the branch you want to delete.

3. If the left pane, select **Delete** from the menu associated with the branch.

4. In the **Delete the branch** dialog, click **Delete**.

Deleting a branch deletes all endpoints associated with the branch.