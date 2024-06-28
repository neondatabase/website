---
title: 'Database Branching Workflows'
subtitle: Boost development velocity by adding data to your existing GitHub workflows
enableTableOfContents: true
updatedOn: '2024-05-09T14:37:51.432Z'
---

Git revolutionized how we develop software, but the story is quite different when databases are involved. Rapid development cycles that include databases remain elusive as they continue to stubbornly resist the agile tooling that has become standard in other parts of our tech stack.

## Bringing Branching to Databases

To change this, Neon proposes adopting [database branching](/docs/introduction/branching) that includes both data and schema. Database branches enable instantaneous access to full database copies for developers, who can then modify those copies without impacting the production database &#8212; effectively extending the Git concept of code branching to your data.

<Admonition type="tip" title="Branching data and schema">
The integration of databases within development practices isn’t a new idea. Modern teams already use tools to manage schema changes, and an increasing number of database providers are embracing *schema branching*. But for development workflows involving databases to be effectively unblocked, developers require the ability to not only modify schemas but also work with and modify isolated copies of data across different environments, similar to how code can be safely modified in Git branches.

Git enables collaboration and rapid development by maintaining a detailed history of commits. [Neon mirrors this concept via a custom-built, log-structured storage system, which treats the database as a record of transactions](/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal). Neon captures a comprehensive history of data snapshots, ensuring that developers can manage and revert changes in data states with the same ease as they do with code versions.
</Admonition>

## Adopting Branch-based Deployments

Traditionally, database deployments are _instance-based_, with each environment represented as a separate, self-contained instance. By shifting our perspective to view these as _branch-based_ deployments, we can align more closely with familiar Git workflows. In this model, each environment has a database branch, which functions similarly to a code branch. For example:

- **Production database branch**: The main branch where the live data resides.
- **Preview database branches**: Temporary branches for reviewing new features or updates.
- **Testing branches**: Temporary branches dedicated to automated testing.
- **Development branches**: Where developers experiment and iterate on new features.

![Adopting branch-based deployments](/flow/deployments.jpg)

## Database Branching Workflows

To illustrate how a branch-based deployment model can be achieved in practice, we’ll cover two key workflows:

1. **Preview Environment Workflow (one database branch per PR)**

   1. In this workflow, we automatically create a [preview environment for every pull request](https://github.com/neondatabase/preview-branches-with-fly?tab=readme-ov-file) with its own Neon database branch. We use Fly.io as the deployment platform and Drizzle as the ORM.
   2. The preview database branch gives the developer access to an isolated “copy” of the database. Any code modifications will be tested against this database.
   3. Once the PR is merged, the preview environment and its database branch will be automatically deleted.

2. **Local Development Environment Workflow (one database branch per developer)**
   1. This workflow showcases how to use database branching to create personalized development environments for every developer on a team.
   2. Each developer gets instant access to an isolated “copy” of production-like data.
   3. When the work is done, a developer can reset their development environment to the current state of `main` (both data and schema).

![Database branching workflows](/flow/branching-workflows.jpg)

### Preview Environment Workflow

**One database branch per pull request**

The code for this workflow is provided in [this repo](https://github.com/neondatabase/preview-branches-with-fly?tab=readme-ov-file), and also described in the following video:

<YoutubeIframe embedId="6XezQQJGdjI" />

### The Tech Stack

- Database: [Neon](/)
- Hosting: [Fly.io](http://fly.io)
- App: [Fastify](https://fastify.dev/)
- Node Package Management: [pnpm](https://pnpm.io/)
- ORM: [Drizzle](https://orm.drizzle.team/)

### How it Works

This is a [GitHub Actions workflow](https://github.com/neondatabase/preview-branches-with-fly/blob/main/.github/workflows/deploy-preview.yml) that automatically deploys preview applications associated with PRs using Fly.io. Each preview environment is deployed with its own Neon database branch:

```yaml
name: Preview Deployment
on: [pull_request]

env:
  NEON_PROJECT_ID: ${{ vars.NEON_PROJECT_ID }} # You can find this in your Neon project settings
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} # You can generate a Fly API token in your account settings
  GH_TOKEN: ${{ secrets.GH_TOKEN }} # Required for commenting on pull requests for private repos

jobs:
  deploy-preview:
    runs-on: ubuntu-latest

    # Only run one deployment at a time per PR.
    concurrency:
      group: pr-${{ github.event.number }}

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install

      - name: Get git branch name
        id: branch-name
        uses: tj-actions/branch-names@v8

      - id: create-branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ env.NEON_PROJECT_ID }}
          username: 'neondb_owner' # Change this to the role you use to connect to your database
          # parent: dev # optional (defaults to your project's default branch)
          branch_name: preview/${{ steps.branch-name.outputs.current_branch }}
          api_key: ${{ secrets.NEON_API_KEY }} # Generate a an API key in your Neon account settings

      - run: |
          echo "DATABASE_URL=${{ steps.create-branch.outputs.db_url_with_pooler }}" >> "$GITHUB_ENV"

      - run: pnpm run db:migrate

      - id: deploy
        uses: superfly/fly-pr-review-apps@1.2.1
        with:
          secrets: DATABASE_URL=$DATABASE_URL

      - name: Comment on Pull Request
        uses: thollander/actions-comment-pull-request@v2
        with:
          GITHUB_TOKEN: ${{ env.GH_TOKEN }} # Required for commenting on pull requests for private repos
          message: |
            Fly Preview URL :balloon: : ${{ steps.deploy.outputs.url }}
            Neon branch :elephant: : https://console.neon.tech/app/projects/${{ env.NEON_PROJECT_ID }}/branches/${{ steps.create-branch.outputs.branch_id }}
```

Let’s break down the steps in this preview environment workflow where we have one database branch for each pull request:

1. **Checkout code:** Checks out the code of the PR to the runner.
2. **Setup Node.js:** Sets up a Node.js environment, using version 4 of the actions/setup-node action.
3. **Install dependencies:** Runs `pnpm install` to install necessary Node.js packages.
4. **Get the git branch name:** Uses the `tj-actions/branch-names@v8` action to get the name of the current branch.
5. **Set up the Neon database branch:** Uses the `neondatabase/create-branch-action@v5` action to set up a preview database branch and exports a `DATABASE_URL` environment variable for further use.
6. **Perform schema migrations:** Executes `pnpm run db:migrate` to apply database migrations using the `DATABASE_URL` from the previous step.
7. **Deploy:** Uses the `superfly/fly-pr-review-apps@1.2.0` action to deploy the application to Fly.io. This action takes the `DATABASE_URL` as input under `secrets`, ensuring the app connects to the correct Neon database branch.

To automatically delete a preview environment when a PR is closed, including the associated Neon database branch, we use this [Clean up Preview Deployment](https://github.com/neondatabase/preview-branches-with-fly/blob/main/.github/workflows/cleanup-preview.yml) GitHub Actions workflow:

```yaml
name: Clean up Preview Deployment
on:
  pull_request:
    types: [closed]

env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} # You can generate a Fly API token in your account settings

jobs:
  delete-preview:
    runs-on: ubuntu-latest
    steps:
      - name: Delete Fly app
        uses: superfly/fly-pr-review-apps@1.2.0

      - name: Delete Neon Branch
        uses: neondatabase/delete-branch-action@v3.1.3
        with:
          project_id: ${{ var.NEON_PROJECT_ID }}
          branch: preview/${{ github.event.pull_request.head.ref }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

The `superfly/fly-pr-review-apps@1.2.0` action deletes the preview environment associated with the PR, while the `neondatabase/delete-branch-action@v3.1.3` action deletes the associated database branch.

## Local Development Environment Workflow

**One database branch per developer**

### The Tech Stack

- Database: [Neon](/)
- CLI Tool: [Neon CLI](/docs/reference/neon-cli)

### Workflow Steps

These are the basic steps to implement a local development workflow with a database branch per developer:

1. [Download the Neon CLI](/docs/reference/neon-cli#install).
2. Connect your Neon account:

   ```bash
   neonctl auth
   ```

3. Create a database branch for each developer:

   ```bash
   neonctl branches create --name dev/developer_name
   ```

4. Get the connection string for the Neon database branch:

   ```bash
   neonctl connection-string dev/developer_name
   ```

5. Optionally, reset the development branch to the current state of `main` (data and schema).

   ```bash
   neonctl branches reset  dev/developer_name --parent
   ```

   This step is useful when you want to discard the changes in your existing dev branch and start fresh with dev branch that reflects the current state of the parent's data and schema.

## Upcoming Improvements

The workflows described above are basic examples. We’ll keep expanding on them to provide complete production deployments with staging environments and handling of Personal Identifiable Information (PII). This work is ongoing.

## Additional Resources

- [Using Vercel for your preview deployments](/docs/guides/vercel)
- [A Postgres database for every Fly.io preview](https://www.youtube.com/watch?v=EOVa68Uviks)
- [A Postgres database for every Vercel preview](https://www.youtube.com/watch?v=s4vIMI9rXeg)
- Guides for [Prisma](/docs/guides/prisma-migrations), [Django](/docs/guides/django-migrations), [Liquibase](/docs/guides/liquibase), [Flyway](/docs/guides/flyway), and [more](/docs/guides/guides-intro)
- [About Branch Reset](/blog/announcing-branch-reset)
- [About the Neon CLI](/blog/cli)
