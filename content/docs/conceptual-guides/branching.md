---
title: Branching
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/branches
---

<a id="branches-coming-soon/"></a>

## About branching

Neon allows you to instantly branch your database in the same way you branch your code. You can quickly and cost-effectively branch a database for development, testing, staging, and variety of other purposes, enabling you to improve developer productivity and optimize continuous integration and delivery (CI/CD) pipelines. For more information about the different ways in which branching can help improve your development workflows, see [Branching use cases](#branching-use-cases).

## What is a branch?

A branch is a copy-on-write clone of an existing Neon project branch. That branch can be the `main` branch of your Neon project or another branch. A branch can be created from a current or past state of the parent branch. For example, you can create a branch that includes data up to the point of branch creation or a branch that includes data up to a particular time or a particular Log Sequence Number (LSN).

A branch is completely isolated from its parent Neon project, so you are free play around with it, modify it, or remove it when it's no longer needed. When you create a branch, all of the data in the parent project, in a current or past state according to your selection, is available to the branch, but changes to the branch are independent of the parent Neon project and vice versa. A branch and its parent branch share the same history but diverge at the point of branch creation. Writes to a branch exist as an independent delta. Likewise, writes to a the parent project from the point of branch creation are independent of any child branches.

Creating a branch does not increase load on the parent branch or affect it in any way, which means that you can create a branch at any time without impacting the performance of your production database.

A branch has the following characteristics:

- A branch is subject to the same technical preview limits as Neon project:
  - Project data size is limited to 10GB.
  - The Point in Time Reset (PITR) window is limited to 7 days of reasonable usage.
  - The compute node is limited to 1 vCPU and 256MB of RAM.
- Branches are read-write.
- An endpoint is created for each branch when the branch is created, which permits connecting to the branch as you would connect to a Neon project from a PostgreSQL client, an application, or the Neon API. 

## Creating a branch

Creating a branch requires that you have a Neon project. For information about creating a project, see [Setting up a project](/docs/getting-started-with-neon/setting-up-a-project).

To create a branch:

1. In the Neon Console, select a project.
2. Select the **Branches** tab.
2. Click **New Branch**.
3. Enter a name for the branch or leave the field empty to have one generated for you.
4. Select a parent branch. You can branch from your project's `main` branch or a branch that was created previously.
5. Select one of the following branching options:
    - **Head**: Branch the current state of the parent branch. The branch has access to all data up to the current point in time.
    - **Time**: Branch from a specific point in time. The branch is created with access to project data up to the specified date and time.
    - **LSN**: Branch from a specified Log Sequence Number (LSN). The branch is created with access to project data up to the specified LSN.
6. Click **Create Branch**.

The branch is created with an accompanying endpoint that you can use to connect to the branch from a PostgreSQL client, an application, or the Neon API. 

The branch name is either user-specified or combination of the parent project ID and branch ID in the following format: `{parent-branch-id}-branch-{branch-id}`. For example, a branch name comprised of parent and branch ID values looks similar to: `autumn-lake-518875-branch-fancy-lake-471319`

The branch endpoint name is the endpoint ID and appears similar to: `ep-{endpoint-id}`. For example: `ep-purple-frost-523241`


## Viewing branches

Branches are listed on the **Projects** page in the Neon Console.

To access the Projects page, select **All Projects** from the project drop-down list at the top of the Neon Console.

You can identify a branch by its name, which has the following pattern:

```example
<project_id>-branch-<branch_id>
```

where:

`<project_id>` is the parent project ID
`<branch_id>` is the branch ID

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

Deleting a branch deletes the endpoint associated with the branch.

## Branching from the API

Any branch action that you can perform in the Neon Console can also be performed using the Neon API. The following examples demonstrate how to create, view, and delete branches using the Neon API. For other branch-related API methods, refer to the [Neon API reference](https://neon.tech/api-reference/).

### Prerequisites

- A Neon API request requires an API key. For information about obtaining an API key, see [Using API Keys](/docs/get-started-with-neon/using-api-keys). In the cURL examples below, the API key is represented by `$NEON_API_KEY`. Replace this value with your API key when issuing a request.
- The API examples in this section require a `<project_id>` or `<branch_id>` value. You can find these values in the Neon Console on the **Settings** tab, under **General Settings**. Project and branch IDs generated by Neon appear similar to these: `restless-sea-792742` and `branch-broken-paper-301953`. 

### Creating a branch

The following Neon API method creates a branch:

```bash
POST /projects/{project_id}/branches
```

Specified in a cURL command, the API method appears as follows:

```bash
curl -X POST -H 'Authorization: Bearer $NEON_API_KEY' https://console.neon.tech/api/v2/projects/<project_id>/branches
```

### Listing branches

The following Neon API method lists branches for the specified project.

```bash
GET /projects/{project_id}/branches
```

Specified in a cURL command, the API method appears as follows:

```bash
curl -X GET -H 'Authorization: Bearer $NEON_API_KEY' https://console.neon.tech/api/v2/projects/<project_id>/branches
```

### Deleting a branch

The following Neon API method deletes the specified branch.

```bash
DELETE /branches/{branch_id}
```

Specified in a cURL command, the API method appears as follows:

```bash
curl -X DELETE -H 'Authorization: Bearer $NEON_API_KEY' https://console.neon.tech/api/v2/branches/<branch_id>
```

## Branching use cases

Branching has a variety of possible uses, some of which are described below:

- **Development**
    - Create a branch of your production database for your Development team
    - Create a branch for each Developer
	
- **Testing** 
    -	Run tests on a current branch of production data
    -	Test potentially destructive queries before deploying them to production
    -	Test schema changes
    -	Run tests on real data &mdash; branching eliminates the need to hydrate a test database
    -	Run tests in parallel on separate branches, each with its own dedicated compute

- **Staging**
    - Create a staging database by branching your production data
    - Create a branch for every pull request in your CI/CD pipeline
			
- **Backup**
    -	Quickly and easily create backup branches
    -	Instantly restore a previous state by branching from a previously created backup branch
    -	Name backup branches according to the time they were created for convenient point-in-time restore (PITR)
	
- **Replication**
    - Use branching to quickly and easily clone replicas

- **Historical Analysis**
    -	Run time-travel queries against a historical state
    -	Create a branch from a past point in time to reproduce an issue
	
- **Simulation**
    - Run "what if" scenarios on a branch of your production data
    - Perform each simulation on its own branch
	
- **Analytics**
    - Run costly queries on a branch of your production data, each with its own resources
	
- **Machine Learning**
    -	Create a branch for ML model training
    -	Name or tag a branch for a specific point in time for ML model training repeatability


