---
title: Database workflows
subtitle: Use this primer to find out different ways you can integrate your Postgres database into your development workflow
enableTableOfContents: true
---

## Neon Database Branching

With Neon, you can work with your data just like you work with your code. The key is database branching, where you can instantly create branches of your data and include them in your workflow, as many branches as you need.

Neon branches are:

- **Isolated**: changes made to a branch don't affect its parent.
- **Fast to create**: creating a branch takes ~1 second, regardless of the size of your database.
- **Cost-effective**: you're only billed for unique data across all branches, and they scale to zero when not in use (you can configure this behavior for every branch).
- **Ready to use**: branches will have the parent branch's schema and all its data (you can also include data up to a certain point in time).

Every Neon branch has a unique Postgres connection string, so they're completely isolated from one another.

```bash
# Branch 1
postgres://database_name_owner:AbC123dEf@ep-shiny-cell-a5y2zuu0.us-east-2.aws.neon.tech/dbname

# Branch 2
postgres://database_name_owner:AbC123dEf@ep-hidden-hall-a5x58cuv.us-east-2.aws.neon.tech/dbname
```

You can create all of your branches from the primary branch or set up a dedicated branch that you use as a base. The former approach is simpler, while the latter provides greater data isolation.

![database workflow A B](/docs/workflows/database_workflow_AB.jpg)

### Creating branches

Branches can be created using the [Neon CLI](https://neon.tech/docs/reference/neon-cli). This allows you to create branches without leaving your editor and automate creating them in your CI/CD pipeline. 

#### Neon CLI

And here are the key CLI actions you can use:

```bash
# Create branch
neonctl branches create [options]
    
# Get Connection string
neonctl connection-string [branch] [options]
    
# Delete branch
neonctl branches delete <id|name> [options]
```

For more information about the CLI, see our [CLI Reference](/docs/reference/neon-cli).

#### GitHub Actions

If you're using GitHub Actions for your CI workflows, Neon provides GitHub Actions for [creating](/docs/guides/branching-github-actions#create-branch-action) and [deleting](/docs/guides/branching-github-actions#delete-branch-action)branches.

- GitHub Actions

    [Create branch Action](https://github.com/neondatabase/create-branch-action)

    ```bash
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

    [Delete branch Action](https://github.com/neondatabase/delete-branch-action)

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
          api_key: {{ secrets.NEON_API_KEY }}
    ```

## A branch for every environment

Here's how you can integrate Neon branching into your workflow:

### Development

You can create a Neon branch for every developer on your team. This ensures that every developer has an isolated environment that includes schemas and data. These branches are meant to be long-lived, so each developer can tailor their branch based on their needs. With Neon's [branch reset capability](https://neon.tech/docs/manage/branches#reset-a-branch-from-parent), developers can refresh their branch anytime with the latest schemas and data.

To easily identify branches dedicated to development, we recommend prefixing the branch name with `dev/[developer-name] or `dev/[feature-name]` if multiple developers collaborate on the same development branch:

Examples: `dev/alice`, `dev/new-onboarding`

### Preview Environments

Whenever you create a pull request, you can create a Neon branch for your preview deployment. This allows you to test your code changes and SQL migrations against production-like data.

![Alt text](/docs/workflows/database_workflow_AB.jpg)

We recommend following the naming convention of `preview/pr-[pull_request_number]-[git_branch_name]` to identify these branches easily.

Example: `preview/pr-123-feat/new-login-screen`

You can also automate branch creation for every preview. These example applications show how to create Neon branches with GitHub Actions for every preview environment.

<DetailIconCards>

<a href="https://github.com/neondatabase/preview-branches-with-fly" description="Sample project showing you how to create a branch for every Fly.io preview deployment" icon="github">Preview branches with Fly.io</a>

<a href="https://github.com/neondatabase/preview-branches-with-vercel" description="Sample project showing you how to create a branch for every Vercel preview deployment" icon="github">Preview branches with Vercel</a>

</DetailIconCards>

### Testing

When running automated tests that require a database, each test run can have its branch with its own compute resources. You can create a branch at the start of a test run and delete it at the end.

We recommend following the naming convention of `test/[git_branch_name-test_run_name-commit_SHA-time_of_the_test_execution]` to identify these branches easily.

The time of the test execution can be an epoch UNIX timestamp (e.g., 1704305739)

Example: `test/feat/new-login-loginPageFunctionality-1a2b3c4d-20240211T1530`

You can create test branches from the same date and time or Log Sequence Number (LSN) for tests requiring static or deterministic data.

### Production

 optimimizing and maintaining your production database Neon

[leave providers out of it, keep generic with dedicated guides later]

- tune your system: autoscaling, autosuspend, ip allow
- data recovery: restore
- scale with read-replicas: run read-writes on system but some of your big queries are taking up a lot of compute; segregate your big reads to another system; basically adding more compute capacity; protect your data