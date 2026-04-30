---
title: Track Schema Changes Automatically in Your Pull Requests
description: A GitHub Action to compare schema differences between two Neon branches
excerpt: >-
  We just launched the Schema Diff GitHub Action, a tool that simplifies schema
  migrations by automatically tracking schema changes as a comment in your pull
  requests. Check out our docs for step-by-step instructions to get started.
  Neon branches are great for many things, but test...
date: '2024-11-28T17:09:53'
updatedOn: '2024-11-28T17:23:02'
category: workflows
categories:
  - workflows
authors:
  - luis-tavares
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/track-schema-changes-automatically-in-your-pull-requests/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Track Schema Changes Automatically in Your Pull Requests - Neon
  description: >-
    The Schema Diff GitHub Action automatically posts schema changes as a
    comment in your PRs, simplifying schema migrations.
  keywords: []
  noindex: false
  ogTitle: Track Schema Changes Automatically in Your Pull Requests - Neon
  ogDescription: >-
    The Schema Diff GitHub Action automatically posts schema changes as a
    comment in your PRs, simplifying schema migrations.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/track-schema-changes-automatically-in-your-pull-requests/social.jpg
source:
  wpId: 7779
  wpSlug: track-schema-changes-automatically-in-your-pull-requests
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/track-schema-changes-automatically-in-your-pull-requests/neon-schema-diff-2-1024x576-5085491c.jpg)

**We just launched the Schema Diff GitHub Action, a tool that simplifies schema migrations by automatically tracking schema changes as a comment in your pull requests. [Check out our docs](https://neon.tech/docs/guides/branching-github-actions#schema-diff-action) for step-by-step instructions to get started.**

[Neon branches](https://neon.tech/docs/introduction/branching) are great for many things, but testing schema changes has to be at the top of the list. With Neon, you can create child branches that serve as [isolated environments](https://neon.tech/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora) containing an exact copy of the data and schema from the parent branch. This setup allows you to safely test schema changes in the child branch, ensuring everything works as expected before applying those changes to the parent branch.

This is a common workflow for Neon users, so we introduced our [Schema Diff](https://neon.tech/docs/guides/schema-diff) tool a while back to help them track their schema changes.

## The starting point: Schema Diff

This tool allows developers to easily identify differences between the schemas of two Neon branches via Neon Console or the Neon CLI, whether they’re preparing a schema migration or simply tracking updates across environments:

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/track-schema-changes-automatically-in-your-pull-requests/screenshot-2024-11-28-at-85731percente2percent80percentafam-1024x317-dc5afb57.png" alt="Image" />
<figcaption>To open this view in the console, navigate to the Branches page > Open the detailed view for the branch whose schema you want to inspect > Find the COMPARE TO PARENT block > Click on Open schema diff</figcaption>
</figure>

## Turning Schema Diff into a GitHub Action

To take things a step further, we’ve built a GitHub action that brings the insights of schema diff straight to your repos:

<video controls width="1110" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/track-schema-changes-automatically-in-your-pull-requests/schema-diff-action-01dc36ae.mp4" />
</video>

Once installed, the Schema Diff GitHub Action automatically runs schema comparisons between a main Neon branch and its child branch. It updates a comment directly in the pull request whenever a specific action defined in your workflow is triggered. **It’s ideal for workflows where schema changes are made on a development branch, and pull requests are created for review before merging the changes into the main branch.**

The comment (which stays updated) allows you to quickly identify differences in database structure, such as added, modified, or deleted schema elements. Take a look at an example in our [GitHub repository](https://github.com/neondatabase/schema-diff-action/blob/main/docs/pr_comment.md).

![Image](https://cdn.neonapi.io/public/images/pages/blog/track-schema-changes-automatically-in-your-pull-requests/screenshot-2024-11-28-at-90308percente2percent80percentafam-1024x723-5e30bcc8.png)

## How schema migrations look like with Neon branches and GitHub Actions

The action works best combined with the [Neon GitHub Integration](https://neon.tech/docs/guides/neon-github-integration), managing migrations as [database branching workflows](https://neon.tech/flow).

An example pipeline that incorporates the schema diff action would look similar to this:

```yaml
name: Pull request branching with schema diff

on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize
      - closed

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

jobs:
  setup:
    name: Setup
    outputs:
      branch: ${{ steps.branch_name.outputs.current_branch }}
    runs-on: ubuntu-latest
    steps:
      - name: Get branch name
        id: branch_name
        uses: tj-actions/branch-names@v8

  test-migrations:
    permissions:
      pull-requests: write
      contents: read
    name: Test migrations with Neon branches
    needs: setup
    if: |
      github.event_name == 'pull_request' && (github.event.action == 'synchronize' || github.event.action == 'opened' || github.event.action == 'reopened')
    runs-on: ubuntu-latest
    steps:
      - name: Create Neon Branch
        id: create_neon_branch
        uses: neondatabase/create-branch-action@v5
        with:
          username: neondb_owner
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch_name: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - uses: actions/checkout@v4

      - name: Run Migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: ${{ steps.create_neon_branch.outputs.db_url_with_pooler }}

      - name: Post schema diff comment
        uses: neondatabase/schema-diff-action@v1
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          compare_branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

  delete-neon-branch:
    name: Delete Neon Branch
    needs: setup
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Delete Neon Branch
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

In this pipeline,

- We’re dynamically creating Neon branches via `create-branch-action`. This would be the isolated environment for testing schema changes;
- To apply database migrations, this example runs npm run `db:migrate` . The environment variable `DATABASE_URL` is dynamically set using the connection details from the previous step;
- The schema diff action is triggered after migrations have been applied to the new branch, comparing the updated schema in the child branch with the base branch schema. The `base_branch` field is explicitly defined to `main`, however, by default the action compare the compare branch with its parent.

## A deeper dive into the Schema Diff action

On a glimpse, the schema diff action has two key characteristics:

1. It makes schema comparisons fully automated. Every PR gets an up-to-date schema diff if changes exist;
2. The action outputs a `comment_url`, allowing developers or scripts to programmatically access the comment if needed for additional automation. For example, you can automate a Slack message with the URL to schema changes.

The action is triggered by pull request events such as `opened`, `reopened`, or `synchronize` (when new commits are pushed to an existing PR). You can change these events in your own workflow.

When setting up the action in your GitHub workflow, you will specify the branches to compare using the `compare_branch` and `base_branch` inputs:

- `compare_branch` is the branch linked to the pull request, _i.e._ the “downstream” dev branch that contains your proposed schema changes.
- `base_branch` is the branch you are merging into, _i.e._ the “upstream” branch used as the reference point for the comparison. If you don’t explicitly specify the `base_branch`, the action defaults to comparing the `compare_branch` with its immediate parent branch.

The action uses GitHub variables like `$\{\{ github.event.number \}\}` to dynamically resolve the correct branches during the workflow. For example, a typical setup might dynamically set the `compare_branch` to `preview/pr-123`.

After performing the schema comparison:

1. If the schema differs between the branches, the action generates an SQL patch summarizing the changes
2. The action then posts a single comment to the pull request containing the details of the schema diff
3. From there, the action doesn’t spam the PR with multiple comments — instead, it edits the same comment to reflect any updates made as new commits are pushed. If there are no schema differences between the branches, the action doesn’t add or update a comment, keeping the PR clean.

## Simplify schema migrations

Reviewing and keeping track of schema changes can be a big pain, and we honestly hope this tool (combined with Neon branches) makes this experience smoother for developers. Here’s how it can help:

- **Less manual work.** This tool automates a tedious part of the development workflow, saving you time and reducing errors during schema updates.
- **Schema migrations are easier to review.** Automatically posting schema differences as comments keeps everyone on your team in the loop. More reviewers can understand what’s changing and provide feedback without digging into SQL files.
- **Enhances branching workflows for schema changes:** Paired with Neon branches, this tool makes it simple to test schema changes in an isolated environment before applying them to production with production-like data.

Ultimately, this gives developers more confidence in managing schema changes while keeping the workflow as efficient and developer-friendly as possible.

## How to get started

Every Neon user can install this Action, including the [Free Plan](https://console.neon.tech/signup). [Go to our docs](https://neon.tech/docs/guides/branching-github-actions#schema-diff-action) and follow the instructions to get started.

We would also love it if you make suggestions and directly contribute to our Schema Diff action in our [GitHub repository](https://github.com/neondatabase/schema-diff-action). It’s open source!
