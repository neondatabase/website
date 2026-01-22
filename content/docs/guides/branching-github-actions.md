---
title: Automate branching with GitHub Actions
subtitle: Create and delete branches with GitHub Actions
enableTableOfContents: true
updatedOn: '2025-07-30T11:06:50.989Z'
---

Neon provides a set of GitHub Actions to automate the creation, deletion, and management of database branches in your Neon projects.
These actions allow you to automate database branching as part of your CI/CD workflows, enabling you to create ephemeral database branches for pull requests, run tests against isolated data, and clean up resources automatically.

This guide covers how to set up and use the Neon GitHub Actions for managing database branches, including creating, deleting, resetting branches, and comparing schemas.

## Getting started

To use Neon's GitHub Actions, you need to add your Neon API key and Project ID to your GitHub repository. This allows the actions to authenticate with your Neon project and perform operations on your database branches.

### Automatically set up with the Neon GitHub integration

The easiest way to get started is with the [Neon GitHub integration](/docs/guides/neon-github-integration). It connects your Neon project to a GitHub repository, automatically creating the necessary `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable for you. If you use the integration, you can skip the manual setup steps below.

### Manually set up your repository

1.  **Create a Neon API key.** For instructions, see [Create an API key](/docs/manage/api-keys#create-an-api-key).
2.  **Add the key to GitHub.** In your GitHub repository, navigate to **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  Name the secret `NEON_API_KEY` and paste your API key into the value field.
5.  Click **Add secret**.
6.  You will also need your Neon **Project ID**, which you can find in the **Settings** page of the Neon console.
    ![Neon Project ID in the console](/docs/manage/settings_page.png)
7.  Add the Project ID to your GitHub repository as a **variable**:
    - In your GitHub repository, navigate to **Settings** > **Secrets and variables** > **Actions**.
    - Select **Variables** and click **New repository variable**.
    - Name the variable `NEON_PROJECT_ID` and set its value to your Neon Project ID.
    - Click **Add variable**.

You can now use the Neon GitHub Actions in your workflows by referencing them in your `.github/workflows` YAML files.

## Available actions

Neon provides the following GitHub Actions for working with Neon branches. For detailed information on usage, inputs, and outputs, please refer to the official documentation for each action on the GitHub Marketplace.

- **[Create branch action](https://github.com/marketplace/actions/neon-create-branch-github-action)**: Creates a new database branch in your Neon project. This is ideal for setting up isolated environments for preview deployments or running tests against a feature branch.
- **[Delete branch action](https://github.com/marketplace/actions/neon-database-delete-branch)**: Deletes a specified database branch. Use this to automate the cleanup of ephemeral branches after a pull request is merged or closed.
- **[Reset branch action](https://github.com/marketplace/actions/neon-database-reset-branch-action)**: Resets a branch to the latest state of its parent. This is useful for refreshing a development or staging branch with the most up-to-date data.
- **[Schema diff action](https://github.com/marketplace/actions/neon-schema-diff-github-action)**: Compares the schemas of two branches and posts a diff summary as a comment on a pull request, allowing for easy review of schema changes.

For detailed information on how to use these actions, including required inputs, outputs, and examples, check the individual actions documentation on GitHub Marketplace:

<DetailIconCards>

<a href="https://github.com/marketplace/actions/neon-create-branch-github-action" description="Creates a new database branch. Ideal for setting up isolated environments for preview deployments or feature testing." icon="github">Create branch action</a>

<a href="https://github.com/marketplace/actions/neon-database-delete-branch" description="Deletes a specified database branch. Use this to clean up ephemeral branches after a pull request is merged or closed." icon="github">Delete branch action</a>

<a href="https://github.com/marketplace/actions/neon-database-reset-branch-action" description="Resets a branch to the latest state of its parent. Useful for refreshing a development branch with production data." icon="github">Reset branch action</a>

<a href="https://github.com/marketplace/actions/neon-schema-diff-github-action" description="Compares the schema of two branches and posts a diff summary as a comment on a pull request." icon="github">Schema diff action</a>

</DetailIconCards>

## Example applications

For complete, deployable examples, explore these starter repositories:

<DetailIconCards>

<a href="https://github.com/neondatabase/preview-branches-with-cloudflare" description="Demonstrates using GitHub Actions workflows to create a Neon branch for every Cloudflare Pages preview deployment" icon="github">Preview branches with Cloudflare Pages</a>

<a href="https://github.com/neondatabase/preview-branches-with-vercel" description="Demonstrates using GitHub Actions workflows to create a Neon branch for every Vercel preview deployment" icon="github">Preview branches with Vercel</a>

<a href="https://github.com/neondatabase/preview-branches-with-fly" description="Demonstrates using GitHub Actions workflows to create a Neon branch for every Fly.io preview deployment" icon="github">Preview branches with Fly.io</a>

<a href="https://github.com/neondatabase/neon_twitter" description="Demonstrates using GitHub Actions workflows to create a Neon branch for schema validation and perform migrations" icon="github">Neon Twitter app</a>

</DetailIconCards>

<NeedHelp/>
