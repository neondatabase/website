---
title: "Adopting Neon branching in CI/CD pipelines: a practical story by Shepherd"
description: How an insurtech startup uses branching to save developer time and money
excerpt: >-
  “Branching saves us both money and developer time. We no longer have to set up
  an actual testing database instance and make sure the data is always synced
  with production. We now spin up an ephemeral branch when we need to and then
  tear it down via the create/delete Github Action...
date: "2024-07-11T16:14:05"
updatedOn: "2024-10-31T16:07:07"
category: community
categories:
  - community
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Adopting Neon branching in CI/CD pipelines: a practical story by Shepherd - Neon
  description: >-
    Learn how adopting database branching for dev and testing workflows can save
    you money and developer time.
  keywords: []
  noindex: false
  ogTitle: >-
    Adopting Neon branching in CI/CD pipelines: a practical story by Shepherd - Neon
  ogDescription: >-
    Learn how adopting database branching for dev and testing workflows can save
    you money and developer time.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd/neon-shepherd-1024x576-ede6acc2.jpg)

<blockquote>
<p><strong>“Branching saves us both money and developer time. We no longer have to set up an actual testing database instance and make sure the data is always synced with production. We now spin up an ephemeral branch when we need to and then tear it down via the create/delete Github Actions”</strong></p>
<cite>Angelina Quach, Software Engineer at Shepherd</cite>
</blockquote>

[Shepherd](https://shepherdinsurance.com/) is a startup building an all-in-one commercial insurance platform aimed at high-hazard industries. They specialize in underwriting and pricing complex insurance risks efficiently, minimizing administrative waste. Their approach combines fast underwriting, AI-powered risk reduction, and integration with leading safety technologies, offering significant premium savings and enhanced risk management for clients.

## The backend journey: from Excel to SQLite to Postgres

**👉 Dig deeper: Shepherd explained their migration story in detail** [here](https://shepherdinsurance.com/blog/the-great-database-migration).

Motivated by the growth [following their Series A round](https://www.globenewswire.com/en/news-release/2024/02/07/2825155/0/en/Shepherd-Raises-13-5-Million-in-Series-A-Funding-to-Help-Insure-the-10-Trillion-Commercial-Construction-Industry.html), earlier this year Shepherd decided to migrate the database for their pricing engine (called Alchemist) from SQLite to Postgres, looking for a more robust system that could support their growth.

Alchemist is a crucial component of Shepherd’s product, responsible for underwriting and pricing complex insurance risks. It integrates complex actuarial models, factors, and Shepherd’s proprietary algorithms to deliver accurate and efficient pricing decisions. When Sheperd first started, Alchemist ran on Excel and JSON; then it moved to SQLite. As the business scaled, the limitations of the SQLite setup asked for a move to Postgres.

## Adopting Neon branching

When evaluating different Postgres options, Shepherd was attracted to Neon mostly because of its [branching paradigm](https://neon.tech/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal). Neon implements database branching at the storage level, enabling users to create database branches with data and schema via copy-on-write.

The team at Shepherd immediately recognized the **benefits of this model**, especially when combined with Neon’s serverless architecture with auto-scaling and scale to zero:

- **Less wasted time and money.** The branching model would enable Shepherd to immediately create temporary branches for testing, vs manually setting up clusters and making sure data is kept in sync. On top of this, Neon branches scale to zero when idle: no more paying 24/7 for a database that’s only being used for a few hours a day.

<blockquote>
<p><strong>“On a conventional database, we’d have to set up a database cluster or instance and ensure it always stays synced with production data for accurate testing. We’d also have to scale instances appropriately, avoiding unnecessary expenses when instances are idle. As a startup, we are especially conscious of cost, but doing this manually is very time-consuming and requires engineering bandwidth. Neon eliminates these issues with branching”</strong></p>
<cite>Angelina Quach, Software Engineer at Shepherd</cite>
</blockquote>

- **Improved workflows.** Since Neon branches can be managed via Github Actions, Shepherd could directly integrate them into their existing CI/CD pipelines.
- **Automatic scalability.** Since Neon branches autoscale according to load, there’ll be no need to manually resize them up and down to make sure resources are used optimally.
- **Less risk.** This setup also provides inherent guardrails against data-breaking changes. A junior dev in the team could quickly spin up a branch with the peace of mind that they cannot interfere with the production environment.

## Adding Neon branches to CI/CD pipelines: how Shepherd does it

Shepherd implemented [Neon branching](https://neon.tech/flow) to streamline their development and deployment processes, integrating it deeply with GitHub actions. Here’s an overview of their setup:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd/screenshot-2024-07-10-at-10844percente2percent80percentafpm-1024x429-77ab9922.png)

**👉** **TL;DR workflow overview:**

- GitHub is used to manage all SQL and code files.
- Shepherd creates short-lived testing branches for every PR. Data and schema changes are first tested in these short-lived branches, which are created and deleted automatically via Github Actions as PRs get opened and merged.
- Render is used to then deploy migration scripts against the staging (stg db) and production branches (prod db).
- Migrations are tracked via a separate database table, ensuring that scripts are applied in the correct order and not duplicated.

### Branch hierarchy

Shepherd uses different database branches for each step of the pipeline:

- **Development testing branches**. Each developer creates a “development” testing branch for their own testing purposes. These branches are derived from the production branch.
- **Temporary test branches (short-lived)**. When a PR is opened, a temporary test branch is created from the main branch using Neon’s GitHub actions. Once the test passes and the PR is closed, this temporary branch gets deleted automatically.
- **Staging branch**: Once changes have been tested in the temporary test branches, they are deployed to the staging branch via Render scripts.
- **Production branch**: Once changes are confirmed stable in the staging branch, they are promoted to the production branch.

💡 _Shepherd is also exploring a “hot swapping” solution to alternate traffic between staging and production databases, ensuring zero downtime during deployments. More info coming soon._

### Workflow

- **Temporary branch creation for PRs**. When a pull request (PR) is opened on GitHub, Shepherd uses Neon’s GitHub actions to create a temporary testing branch derived from the production branch. The [`create branch` action](https://github.com/marketplace/actions/neon-database-create-branch-action) looks similar to this:

```bash
name: Create Neon Branch

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  create-branch:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Create Neon Branch
      run: |
        curl -X POST https://console.neon.tech/api/v1/projects/<project-id>/branches \
        -H "Authorization: Bearer ${{ secrets.NEON_API_KEY }}" \
        -d '{"name": "${{ github.head_ref }}"}'
```

- **Deploying schema and data changes**. Any schema or data changes associated with the PR are first deployed to the temporary branch.
- **Integration and performance testing**. The temporary branch is used for running a series of integration and performance tests.
- **Branch cleanup**. Once the tests pass and the PR is approved, [Neon’s GitHub actions then trigger the deletion of the temporary branch](https://github.com/neondatabase/delete-branch-action):

1.

```bash
name: Delete Neon Branch

on:
  pull_request:
    types: [closed]

jobs:
  delete-branch:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Delete Neon Branch
      run: |
        curl -X DELETE https://console.neon.tech/api/v1/projects/<project-id>/branches/${{ github.head_ref }} \
        -H "Authorization: Bearer ${{ secrets.NEON_API_KEY }}"
```

- **Deploying to staging and production**. Once the changes have been tested in the temporary branches, they are then deployed to the staging branch, where the team performs additional checks and manual verifications. After confirming stability and correctness, the changes deployed to the production branch.

### Automated deployment of database changes via Render

Shepherd uses Render to deploy database changes through automated migration scripts. Once changes are tested in the temporary branches, Render executes pre-deploy commands, applying SQL changes against the Neon staging database (`stg db`). These migration scripts are tracked using a dedicated table, ensuring each script is logged with a timestamp to prevent duplication and make sure they’ve been applied in order. After successful verification in staging, the same pre-deploy commands apply the changes to the Neon production database (`prod db`).

## Start small: create your first branch today

If you’ve never experimented with database branches yet, the best way to get a feel for it is via the [Neon Free plan](https://console.neon.tech/signup). Create an account in seconds, load some data, and create your first branch.

A huge thank you to [Shepherd](https://shepherdinsurance.com/) for sharing their story and [the work they’re doing](https://shepherdinsurance.com/case-studies)! Can’t wait to see how far you get 🚀
