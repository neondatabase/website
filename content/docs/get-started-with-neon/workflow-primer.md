---
title: Database branching workflow primer
subtitle: An introduction to integrating Postgres branching into your development
  workflow
enableTableOfContents: true
updatedOn: '2024-06-30T14:35:12.881Z'
---

With Neon, you can work with your data just like you work with your code. The key is Neon's database [branching](/docs/guides/branching-intro) feature, which lets you instantly create branches of your data that you can include in your workflow, as many branches as you need.

Neon branches are:

- **Isolated**: changes made to a branch don't affect its parent.
- **Fast to create**: creating a branch takes ~1 second, regardless of the size of your database.
- **Cost-effective**: you're only billed for unique data across all branches, and they scale to zero when not in use (you can configure this behavior for every branch).
- **Ready to use**: branches will have the parent branch's schema and all its data (you can also include data up to a certain point in time).

Every Neon branch has a unique Postgres connection string, so they're completely isolated from one another.

```bash
# Branch 1
postgresql://database_name_owner:AbC123dEf@ep-shiny-cell-a5y2zuu0.us-east-2.aws.neon.tech/dbname

# Branch 2
postgresql://database_name_owner:AbC123dEf@ep-hidden-hall-a5x58cuv.us-east-2.aws.neon.tech/dbname
```

You can create all of your branches from the default branch, or set up a dedicated branch that you use as a base. The first approach is simpler, while the second provides greater data isolation.

![database workflow A B](/docs/get-started-with-neon/database_workflow_AB.jpg)

## Create branch methods

You can use either the Neon CLI or GitHub actions to incorporate branching into your workflow.

### Neon CLI

Using the [Neon CLI](https://neon.tech/docs/reference/neon-cli), you can create branches without leaving your editor or automate branch creation in your CI/CD pipeline.

And here are the key CLI actions you can use:

```bash
# Create branch
neon branches create [options]

# Get Connection string
neon connection-string [branch] [options]

# Delete branch
neon branches delete <id|name> [options]
```

For more information, see:

<DetailIconCards>

<a href="/docs/guides/branching-neon-cli" description="Learn about branching with the Neon CLI" icon="github">Branching with CLI</a>

<a href="/docs/reference/neon-cli" description="Reference for all commands in the Neon CLI" icon="github">CLI Reference</a>

</DetailIconCards>

### GitHub Actions

If you're using GitHub Actions for your CI workflows, Neon provides GitHub Actions for [creating](/docs/guides/branching-github-actions#create-branch-action) and [deleting](/docs/guides/branching-github-actions#delete-branch-action) branches.

<Tabs labels={["Create branch", "Delete branch"]}>

<TabItem>

Here is an example of what a create branch action might look like:

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

</TabItem>

<TabItem>

Here is an example of what a delete branch action might look like:

```yaml
name: Delete Neon Branch with GitHub Actions
run-name: Delete a Neon Branch 🚀
on:
  push:
    branches:
      - 'main'
jobs:
  delete-neon-branch:
    uses: neondatabase/delete-branch-action@v3
    with:
      project_id: rapid-haze-373089
      branch: br-long-forest-224191
      api_key: { { secrets.NEON_API_KEY } }
```

</TabItem>
</Tabs>

You can find these GitHub Actions here:

<DetailIconCards>

<a href="https://github.com/neondatabase/create-branch-action" description="Create Neon Branch with GitHub Actions Demo" icon="github">Create branch Action</a>

<a href="https://github.com/neondatabase/delete-branch-action" description="Delete Neon Branch with GitHub Actions Demo" icon="github">Delete branch Action</a>

</DetailIconCards>

For more detailed documentation, see [Automate branching with GitHub Actions](/docs/guides/branching-github-actions).

## A branch for every environment

Here's how you can integrate Neon branching into your workflow:

### Development

You can create a Neon branch for every developer on your team. This ensures that every developer has an isolated environment that includes schemas and data. These branches are meant to be long-lived, so each developer can tailor their branch based on their needs. With Neon's [branch reset capability](https://neon.tech/docs/manage/branches#reset-a-branch-from-parent), developers can refresh their branch with the latest schemas and data anytime they need.

<Admonition type="tip">
To easily identify branches dedicated to development, we recommend prefixing the branch name with `dev/<developer-name>` or `dev/<feature-name>` if multiple developers collaborate on the same development branch.

<br/>Examples:

```bash
dev/alice             dev/new-onboarding
```

</Admonition>

### Preview environments

Whenever you create a pull request, you can create a Neon branch for your preview deployment. This allows you to test your code changes and SQL migrations against production-like data.

<Admonition type="tip">
We recommend following this naming convention to identify these branches easily:

```bash
preview/pr-<pull_request_number>-<git_branch_name>
```

Example:

```bash
preview/pr-123-feat/new-login-screen
```

</Admonition>

You can also automate branch creation for every preview. These example applications show how to create Neon branches with GitHub Actions for every preview environment.

<DetailIconCards>

<a href="https://github.com/neondatabase/preview-branches-with-fly" description="Sample project showing you how to create a branch for every Fly.io preview deployment" icon="github">Preview branches with Fly.io</a>

<a href="https://github.com/neondatabase/preview-branches-with-vercel" description="Sample project showing you how to create a branch for every Vercel preview deployment" icon="github">Preview branches with Vercel</a>

</DetailIconCards>

### Testing

When running automated tests that require a database, each test run can have its branch with its own compute resources. You can create a branch at the start of a test run and delete it at the end.

<Admonition type="tip">
We recommend following this naming convention to identify these branches easily:

```bash
test/<git_branch_name-test_run_name-commit_SHA-time_of_the_test_execution>
```

The time of the test execution can be an epoch UNIX timestamp (e.g., 1704305739). For example:

```bash
test/feat/new-login-loginPageFunctionality-1a2b3c4d-20240211T1530
```

</Admonition>

You can create test branches from the same date and time or Log Sequence Number (LSN) for tests requiring static or deterministic data.
