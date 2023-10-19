---
title: Automate branching with GitHub Actions
subtitle: Create and delete branches with GitHub Actions
enableTableOfContents: true
updatedOn: '2023-10-19T22:50:50.187Z'
---

Neon provides the following GitHub Actions for working with Neon branches, which you can add to your CI workflows:

- [Create branch action](#create-branch-action)
- [Delete branch action](#delete-branch-action)

## Create branch action

This GitHub Action creates a new branch in your Neon project.

<Admonition type="info">
The source code for this action is available on [GitHub](https://github.com/neondatabase/create-branch-action).
</Admonition>

### Prerequisites

- Using the action requires a Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- Add your Neon API key to your GitHub Secrets:
    1. In your GitHub repository, go to **Settings** and locate **Secrets** at the bottom of the left sidebar.
    2. Click **Actions** > **New Repository Secret**.
    3. Name the secret `NEON_API_KEY` and paste your API key in the **Secret** field
    4. Click **Add Secret**.

### Example

The following example creates a branch from the `main` branch in your Neon project 

```yaml
name: Create Neon Branch with GitHub Actions Demo
run-name: Create a Neon Branch 🚀
jobs:
  Create-Neon-Branch:
    uses: neondatabase/create-branch-action@v4
    with:
      project_id: rapid-haze-373089
      parent_id: br-long-forest-224191
      branch_name: from_action_reusable
      api_key: {{ secrets.NEON_API_KEY }}
    id: create-branch
  - run: echo project_id ${{ steps.create-branch.outputs.project_id}}
  - run: echo branch_id ${{ steps.create-branch.outputs.branch_id}}
```

### Input variables

- `project_id`: The ID of your Neon project. You can find this value in the Neon Console, on the **Settings** page.
- `parent_branch_id`: The ID of the parent branch, typically the `main` branch of your project. You can find this value in the Neon Console. Select **Branches** from the sidebar, and then select the branch. A branch ID has a `br-` prefix.
- `branch_name`: This is an optional parameter. If unspecified, the branch name will default to the same value as the `branch_id` of the newly created branch, which is a generated value that starts with a `br-` prefix.
- `api_key`: An API key created in your Neon account. For instructions, see [Create an API key](/docs/manage/api-keys#create-an-api-key).

### Outputs

```yaml
outputs:
  branch_id:
    description: "Newly created branch Id"
    value: ${{ steps.output-branch-id.outputs.branch_id }}
  project_id:
    description: "Project Id"
    value: ${{ steps.output-project-id.outputs.project_id }}
```

- `branch_id`: The ID of the newly created branch.
- `project_id`: The ID of the parent branch.

## Delete branch action

This GitHub Action deletes a branch from your Neon project.

<Admonition type="info">
The source code for this action is available on [GitHub](https://github.com/neondatabase/delete-branch-action).
</Admonition>

### Prerequisites

- Using the action requires a Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- Add your Neon API key to your GitHub Secrets:
    1. In your GitHub repository, go to **Settings** and locate **Secrets** at the bottom of the left sidebar.
    2. Click **Actions** > **New Repository Secret**.
    3. Name the secret `NEON_API_KEY` and paste your API key in the **Secret** field
    4. Click **Add Secret**.

### Example

The following example deletes a branch with the `br-long-forest-224191` branch ID from a Neon project with the project ID `rapid-haze-373089` when a pull request is merged.

```yaml
name: Delete Neon Branch with GitHub Actions Demo
run-name: Delete a Neon Branch 🚀
on: [push]
jobs:
  delete-neon-branch:
    uses: neondatabase/delete-branch-action@v3
    with:
      project_id: rapid-haze-373089
      branch: br-long-forest-224191
      api_key: {{ secrets.NEON_API_KEY }}
```

### Input variables

- `project_id`: The ID of your Neon project. You can find this value in the Neon Console, on the **Settings** page.
- `branch:` The ID or name of the branch you want to delete. Select **Branches** from the sidebar, and then select the branch. A branch ID has a `br-` prefix.
- `api_key`: An API key created in your Neon account. For instructions, see [Create an API key](/docs/manage/api-keys#create-an-api-key).

### Outputs

This Action has no outputs.

## Example applications

The following example applications use GitHub Actions to create and delete branches in Neon.

<DetailIconCards>
<a href="https://github.com/neondatabase/neon_twitter" description="A micro-blogging application that uses GitHub Actions to create and delete a branch with each pull request" icon="github">Neon Twitter app</a>
<a href="https://github.com/neondatabase/preview-branches-with-vercel" description="An application demonstrating using GitHub Actions with preview deployments in Vercel" icon="github">Preview branches app</a>
</DetailIconCards>

## Need help?

Join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon. [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).
