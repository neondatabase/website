---
title: Automate branching with GitHub Actions
subtitle: Learn how you can create and delete branches with GitHub Actions
enableTableOfContents: true
isDraft: true
---

Neon provides the following GitHub Actions for working with Neon branches, which you can add to your CI workflows:

- [Create branch action](#create-branch-action)
- [Delete Branch action](#delete-branch-action)

For an example project that uses GitHub Actions to create and delete Neon branches, see [A database for every preview environment using Neon, GitHub Actions, and Vercel](https://neon.tech/blog/branching-with-preview-environments).

## Create branch action

This GitHub Action creates a new branch in your Neon project.

<Admonition type="info">
The source code for this action is available on [GitHub](https://github.com/neondatabase/create-branch-action).
</Admonition>

### Prerequisites

- To use this action, you require a Neon API key. For instructions, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- Add your Neon API key to your GitHub Secrets. In your GitHub repository, go to **Settings** and locate **Secrets** at the bottom of the left side bar. Click **Actions** > **New Repository Secret**. Name the secret `NEON_API_KEY`, paste your API key in the **Secret** field, and click **Add Secret**.

### Example

The following example creates a branch from the `main` branch in your Neon project when a pull request is opened. The new branch is named `from_action_reusable`.

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

- To use this action, you require a Neon API key. For instructions, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- Add your Neon API key to your GitHub Secrets. In your GitHub repository, go to **Settings** and locate **Secrets** at the bottom of the left side bar. Click **Actions** > **New Repository Secret**. Name the secret `NEON_API_KEY`, paste your API key in the **Secret** field, and click **Add Secret**.

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
      branch_id: br-long-forest-224191
      api_key: {{ secrets.NEON_API_KEY }}
```

### Input variables

- `project_id`: The ID of your Neon project. You can find this value in the Neon Console, on the **Settings** page.
- `branch_id`: The ID of the branch you want to delete. Select **Branches** from the sidebar, and then select the branch. A branch ID has a `br-` prefix.
- `api_key`: An API key created in your Neon account. For instructions, see [Create an API key](/docs/manage/api-keys#create-an-api-key).

### Outputs

This Action has no outputs.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
