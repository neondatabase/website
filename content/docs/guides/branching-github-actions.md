---
title: Automate branching with GitHub Actions
subtitle: Create and delete branches with GitHub Actions
enableTableOfContents: true
updatedOn: '2024-08-28T21:00:06.070Z'
---

Neon provides the following GitHub Actions for working with Neon branches, which you can add to your CI workflows:

- [Create branch action](#create-branch-action)
- [Delete branch action](#delete-branch-action)
- [Reset from parent action](#reset-from-parent-action)

<Admonition type="tip">
Neon supports a GitHub integration that connects your Neon project to a GitHub repository. The integration automatically configures a `NEON_API_KEY` secret and `PROJECT_ID` variable in your GitHub repository and provides a sample GitHub Actions workflow that utilizes Neon's [Create branch](#create-branch-action) and [Delete branch](#delete-branch-action) actions. See [Neon GitHub integration](/docs/guides/neon-github-integration) for more.
</Admonition>

## Create branch action

This GitHub Action creates a new branch in your Neon project.

<Admonition type="info">
The source code for this action is available on [GitHub](https://github.com/neondatabase/create-branch-action).
</Admonition>

### Prerequisites

- Using the action requires a Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- Add your Neon API key to your GitHub Secrets:
  1. In your GitHub repository, go to **Project settings** and locate **Secrets** at the bottom of the left sidebar.
  2. Click **Actions** > **New Repository Secret**.
  3. Name the secret `NEON_API_KEY` and paste your API key in the **Secret** field
  4. Click **Add Secret**.

### Example

The following example creates a branch based on the specified parent branch:

```yaml
name: Create Neon Branch with GitHub Actions Demo
run-name: Create a Neon Branch 🚀
jobs:
  Create-Neon-Branch:
  steps:
    - uses: neondatabase/create-branch-action@v5
      id: create-branch
      with:
        project_id: rapid-haze-373089
        # optional (defaults to your project's default branch)
        parent: dev
        # optional (defaults to neondb)
        database: my-database
        branch_name: from_action_reusable
        username: db_user_for_url
        api_key: ${{ secrets.NEON_API_KEY }}
    - run: echo db_url ${{ steps.create-branch.outputs.db_url }}
    - run: echo host ${{ steps.create-branch.outputs.host }}
    - run: echo branch_id ${{ steps.create-branch.outputs.branch_id }}
```

### Input variables

```yaml
inputs:
  project_id:
    required: true
    description: 'The project id'
  branch_name:
    required: false
    description: 'The branch name'
  api_key:
    description: 'The Neon API key'
    required: true
  username:
    description: 'The db role name'
    required: true
  database:
    description: 'The database name'
    default: neondb
  prisma:
    description: 'Use prisma or not'
    default: 'false'
  parent:
    description: 'The parent branch name or id or LSN or timestamp. By default the primary branch is used'
  suspend_timeout:
    description: >
      Duration of inactivity in seconds after which the compute endpoint is
      For more information, see [Auto-suspend configuration](https://neon.tech/docs/manage/endpoints#auto-suspend-configuration).
    default: '0'
  ssl:
    description: >
      Add sslmode to the connection string. Supported values are: "require", "verify-ca", "verify-full", "omit".
    default: 'require'
```

### Outputs

```yaml
outputs:
  db_url:
    description: 'New branch DATABASE_URL'
    value: ${{ steps.create-branch.outputs.db_url }}
  db_url_with_pooler:
    description: 'New branch DATABASE_URL with pooling enabled'
    value: ${{ steps.create-branch.outputs.db_url_with_pooler }}
  host:
    description: 'New branch host'
    value: ${{ steps.create-branch.outputs.host }}
  host_with_pooler:
    description: 'New branch host with pooling enabled'
    value: ${{ steps.create-branch.outputs.host_with_pooler }}
  branch_id:
    description: 'New branch id'
    value: ${{ steps.create-branch.outputs.branch_id }}
  password:
    description: 'Password for connecting to the new branch database with the input username'
    value: ${{ steps.create-branch.outputs.password }}
```

## Delete branch action

This GitHub Action deletes a branch from your Neon project.

<Admonition type="info">
The source code for this action is available on [GitHub](https://github.com/neondatabase/delete-branch-action).
</Admonition>

### Prerequisites

- Using the action requires a Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- Add your Neon API key to your GitHub Secrets:
  1. In your GitHub repository, go to **Project settings** and locate **Secrets** at the bottom of the left sidebar.
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
    steps:
      uses: neondatabase/delete-branch-action@v3
      with:
        project_id: rapid-haze-373089
        branch: br-long-forest-224191
        api_key: ${{ secrets.NEON_API_KEY }}
```

### Input variables

```yaml
inputs:
  project_id:
    required: true
    description: 'The Neon project id'
  branch_id:
    description: 'The Neon branch id'
    deprecationMessage: 'The `branch_id` input is deprecated in favor of `branch`'
  api_key:
    description: 'The Neon API key, read more at https://neon.tech/docs/manage/api-keys'
    required: true
  branch:
    description: 'The Neon branch name or id'
```

### Outputs

This Action has no outputs.

## Reset from parent action

This GitHub Action resets a child branch with the latest data from its parent branch.

<Admonition type="info">
The source code for this action is available on [GitHub](https://github.com/neondatabase/reset-branch-action).
</Admonition>

### Prerequisites

- Using this action requires a Neon API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
- Add your Neon API key to your GitHub Secrets:
  1. In your GitHub repository, go to **Project settings** and locate **Secrets** at the bottom of the left sidebar.
  2. Click **Actions** > **New Repository Secret**.
  3. Name the secret `NEON_API_KEY` and paste your API key in the **Secret** field.
  4. Click **Add Secret**.

### Example

The following example demonstrates how to reset a branch in your Neon project:

```yaml
name: Reset Neon Branch with GitHub Actions Demo
run-name: Reset a Neon Branch 🚀
jobs:
  Reset-Neon-Branch:
    steps:
      - uses: neondatabase/reset-branch-action@v1
        id: reset-branch
        with:
          project_id: rapid-haze-373089
          parent: true
          branch: child_branch
          api_key: ${{ secrets.NEON_API_KEY }}
      - run: echo branch_id ${{ steps.reset-branch.outputs.branch_id }}
```

### Input variables

```yaml
inputs:
  project_id:
    required: true
    description: 'The project id'
  branch:
    required: true
    description: 'The branch name or id to reset'
  api_key:
    description: 'The Neon API key'
    required: true
  parent:
    description: 'If specified, the branch will be reset to the parent branch'
    required: false
  cs_role_name:
    description: 'The output connection string db role name'
    required: false
  cs_database:
    description: 'The output connection string database name'
    required: false
  cs_prisma:
    description: 'Use prisma in output connection string or not'
    required: false
    default: 'false'
  cs_ssl:
    description: >
      Add sslmode to the connection string. Supported values are: "require", "verify-ca", "verify-full", "omit".
    required: false
    default: 'require'
```

- `project_id`: The ID of your Neon project. Find this value in the Neon Console on the Settings page.
- `parent`: If specified, the branch will be reset to the latest state of the parent branch.
- `branch`: The name or id of the branch to reset.
- `api_key`: An API key created in your Neon account.

The action outputs a connection string. You can modify the connection string with these optional connection string (`cs_*`) inputs:

- `cs_role_name`: The output connection string database role name.
- `cs_database`: The output connection string database name.
- `cs_prisma`: Use Prisma in output connection string or not. The default is 'false'.
- `cs_ssl`: Add `sslmode` to the connection string. Supported values are: `"require"`, `"verify-ca"`, `"verify-full"`, `"omit"`. The default is `"require"`.

### Outputs

```yaml
outputs:
  branch_id:
    description: 'Reset branch id'
    value: ${{ steps.reset-branch.outputs.branch_id }}
  db_url:
    description: 'DATABASE_URL of the branch after the reset'
    value: ${{ steps.reset-branch.outputs.db_url }}
  db_url_with_pooler:
    description: 'DATABASE_URL with pooler of the branch after the reset'
    value: ${{ steps.reset-branch.outputs.db_url_with_pooler }}
  host:
    description: 'Branch host after reset'
    value: ${{ steps.reset-branch.outputs.host }}
  host_with_pooler:
    description: 'Branch host with pooling enabled after reset'
    value: ${{ steps.reset-branch.outputs.host_with_pooler }}
  password:
    description: 'Password for connecting to the branch database after reset'
    value: ${{ steps.reset-branch.outputs.password }}
```

- `branch_id`: The ID of the newly reset branch.
- `db_url`: Database connection string for the branch after the reset.
- `db_url_with_pooler`: The pooled database connection string for the branch after the reset.
- `host`: The branch host after the reset.
- `host_with_pooler`: The branch host with pooling after the reset.
- `password`: The password for connecting to the branch database after the reset.

## Example applications

The following example applications use GitHub Actions workflows to create and delete branches in Neon.

<DetailIconCards>

<a href="https://github.com/neondatabase/preview-branches-with-cloudflare" description="Demonstrates using GitHub Actions workflows to create a Neon branch for every Cloudflare Pages preview deployment" icon="github">Preview branches with Cloudflare Pages</a>

<a href="https://github.com/neondatabase/preview-branches-with-vercel" description="Demonstrates using GitHub Actions workflows to create a Neon branch for every Vercel preview deployment" icon="github">Preview branches with Vercel</a>

<a href="https://github.com/neondatabase/preview-branches-with-fly" description="Demonstrates using GitHub Actions workflows to create a Neon branch for every Fly.io preview deployment" icon="github">Preview branches with Fly.io</a>

<a href="https://github.com/neondatabase/neon_twitter" description="Demonstrates using GitHub Actions workflows to create a Neon branch for schema validation and perform migrations" icon="github">Neon Twitter app</a>

</DetailIconCards>

<NeedHelp/>
