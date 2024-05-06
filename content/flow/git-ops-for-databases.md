---

title: 'GitOps for databases: a practical guide for developers'
subtitle: Bring your data to your GitHub workflow to streamline development
enableTableOfContents: true
updatedOn: '2024-02-27T14:37:51.432Z'

---

Git revolutionized the way we develop software, but when databases are involved, the story is quite different. Rapid development cycles with databases remain elusive, as they continue to stubbornly resist the agility tooling that have become standard in other parts of our tech stack.

## Bringing branching to databases 

To change this, in Neon we propose adopting [database branching](/docs/introduction/branching), including both schema and data. Database branches enable instantaneous access to copies of data and schema for developers, who can then modify them without impacting the production database—effectively extending the Git concept of code branching to data.

<Admonition type="info">

**Beyond schema changes: tracking data history**

The integration of databases within development practices isn’t a new idea. Modern teams already use tools to manage schema changes for example, and an increasing number of databases are embracing *schema branching*. But to effectively unblock development workflows involving databases, developers need the ability to not only alter schemas but also isolated data copies across different environments in a similar way that code can be safely modified via branches. 

Git enables collaboration and rapid development by maintaining a detailed history of commits. [Neon mirrors this concept via a custom-built, log-structured storage system, which treats the database as a record of transactions](/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal). Neon captures a comprehensive history of data snapshots, ensuring that developers can manage and revert changes in data states with the same ease as they do with code versions.


</Admonition>

## Adopting branch-based deployments

Traditionally, database deployments are instance-based, with each environment represented as a separate, self-contained instance. By shifting our perspective to view these as branch-based instead, we can align more closely with familiar Git workflows. In this model, each environment has a database branch which functions similarly to a code branch, e.g.:

- Production database branch: The main branch where the live data resides.
- Preview database branches: Temporary branches for reviewing new features or updates.
- Testing branches: Temporary branches dedicated to automated testing.
- Development branches: Where developers experiment and iterate on new features.

![Adopting branch-based deployments](/flow/git-ops-for-databases/deployments.png)

## Database branching workflows

To illustrate how this can be implemented in practice, we’ll cover two key workflows: 

1. **Preview environments**. By automatically creating a database branch for every pull request, any code modifications can be tested against production-like data. Once the PR is merged, the database branch is automatically deleted. We'll demonstrate how to implement this via an [example repo](https://github.com/neondatabase/preview-branches-with-fly?tab=readme-ov-file) using Fly.io and Neon, for projects built with Fastify and managed via GitHub Actions, utilizing Drizzle as the ORM.
2. **Development environments**. Database branching simplifies the creation of personalized development environments for each engineer, providing instant access to a copy of production-like data without leaving their VPC. We’ll share how to set this up using the Neon CLI.

![Database branching workflows](/flow/git-ops-for-databases/branching-workflows.png)

### Workflow for preview environments (one per PR)

All code is included in [this repo](https://github.com/neondatabase/preview-branches-with-fly?tab=readme-ov-file).

### Prerequisites

This example uses the following tech stack:
- Database: [Neon](/)
- Hosting: [Fly.io](http://fly.io)
- App: [Fastify](https://fastify.dev/)
- Node Package Management: [pnpm](https://pnpm.io/)
- ORM: [Drizzle](https://orm.drizzle.team/)

You can copy the files located at .github/workflows/ and add them to your own project.

You will then need to set the following secrets in your repository:

- `FLY_API_TOKEN`: Your Fly.io API token, you can find it in your Fly.io account settings.
- `NEON_PROJECT_ID`: The ID of your Neon project, you can find it in your Neon project settings.
- `NEON_API_KEY`: Your Neon API key, you can find it in your Neon account settings.
- `NEON_DATABASE_USERNAME`: The username for your Neon database. This is the same as the username for your production database.
- `DATABASE_URL`: The connection string for your production database. You can find it in your Neon project's connection details.
- `GH_TOKEN`: A GitHub token with access to your repository, you can create one in your GitHub account settings. You will need to give it access to the repo scope so that the deploy-preview workflow can comment on the pull request. You can uncomment the step which uses this token in the .github/workflows/deploy-preview.yml workflow file.

### How it works

#### Setting up the preview deployment

[.github/workflows/deploy-preview.yml](https://github.com/neondatabase/preview-branches-with-fly/blob/main/.github/workflows/deploy-preview.yml) automates the deployment process to a preview environment, activated on a `pull_request` event.

```
on: [pull_request]
```

The workflow has a single job called `deploy-preview`: 

```
jobs:
  deploy-preview:
```

This job includes the following steps:

1. Ensures concurrency control, allowing only one deployment at a time per pull request.
   ```
    concurrency:
      group: pr-${{ github.event.number }}

   ```
2. Checks out the codebase
   ```
     - uses: actions/checkout@v4
   ```
3. Sets up PNPM (you can use another package manager depending on your setup)
   ```
     - uses: pnpm/action-setup@v2
        with:
          version: 8

   ```
4. Configures Node.js version with caching for PNPM
   ```
     - name: Use Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "pnpm"
   ```
5. Installs dependencies
   ```
    - name: Install dependencies
      run: pnpm install
   ```
6. Installs dependencies
   ```
    - name: Get branch name
      id: branch-name
      uses: tj-actions/branch-names@v8

   ```
7. Installs dependencies
   ```
    - name: Create Neon Branch
    id: create-branch
    uses: neondatabase/create-branch-action@v4
    with:
      project_id: ${{ env.NEON_PROJECT_ID }}
      # parent: dev # optional (defaults to your primary branch)
      branch_name: preview/pr-${{ github.event.number }}-${{ steps.branch-name.outputs.current_branch }}
      username: ${{ env.NEON_DATABASE_USERNAME }}
      api_key: ${{ env.NEON_API_KEY }}
   ```
8. Creates a Neon database branch for every pull request. By default, the database branch name will be `preview/<git-branch-name>-<commit_SHA>`. 
   ```
      - name: Run Migrations
        run: |
          touch .env

          echo DATABASE_URL=${{ steps.create-branch.outputs.db_url_with_pooler }}?sslmode=require >> .env

          pnpm run db:migrate
   ```
9. Deploys the application while including the Neon database URL.
    ```
    - name: Deploy
      id: deploy
      uses: superfly/fly-pr-review-apps@1.2.0
      with:
        secrets: DATABASE_URL=${{ steps.create-branch.outputs.db_url }}?sslmode=require
    ```
10. Comments on the pull request with deployment and database branch details. Here's an [example comment](https://github.com/neondatabase/preview-branches-with-fly/pull/9#issuecomment-1924660371):
    ```
     - name: Comment on Pull Request
        uses: thollander/actions-comment-pull-request@v2
        with:
          # GITHUB_TOKEN: ${{ env.GH_TOKEN }} # Required for commenting on pull requests for private repos
          message: |
            Fly Preview URL :balloon: : ${{ steps.deploy.outputs.url }}
            Neon branch :elephant: : https://console.neon.tech/app/projects/${{ secrets.NEON_PROJECT_ID }}/branches/${{ steps.create-branch.outputs.branch_id }}
    ```

#### Automatic deployment process

[.github/workflows/deploy-production.yml](https://github.com/neondatabase/preview-branches-with-fly/blob/main/.github/workflows/deploy-production.yml) automates the deployment process to a production environment. It is activated on a push event to the main branch and uses the `FLY_API_TOKEN` and `DATABASE_URL` secrets that are set in the repository.

The workflow has a single job called production-deploy and it consists of the following steps:

1. Checks out the codebase using actions/checkout@v4
2. Sets up PNPM using pnpm/action-setup@v2 and specifies version 8. (You can use another package manager depending on your setup.)
3. Configures the environment to use Node.js version 18 using actions/setup-node@v4, with a cache configured for PNPM.
4. Installs project dependencies using pnpm install.
5. Runs database migrations with the command pnpm run db:migrate.
6. Sets up Fly CLI (flyctl) using [superfly/flyctl-actions/setup-flyctl@master](https://github.com/marketplace/actions/github-action-for-flyctl).
7. Finally, deploys the application using Fly CLI with the command flyctl deploy --remote-only.

#### Deleting database branches

.github/workflows/delete-neon-branch.yml automates the cleanup of branches in Neon. It is activated on a pull_request event with the action closed. This will ensure that Neon branches are deleted when a pull request is closed/merged.

The workflow uses [neondatabase/delete-branch-action@v3.1.3](https://github.com/neondatabase/delete-branch-action/tree/v3.1.3/) action which uses the NEON_API_KEY and NEON_PROJECT_ID secrets that are set in the repository.

## Workflow for dev environments (one per engineer) 

### Prerequisites

You’ll need:
- Database: [Neon](/)
- CLI Tool: [Neon CLI](/docs/reference/neon-cli)

### Step-by-step guide

1. Set up your environment to use the Neon API key:
   ```bash
   export NEON_API_KEY=your_neon_api_key_here
   ```
2. Create a database branch for each engineer:
   ```bash
   neonctl branches create --name engineer_name_branch
   ```
3. Get unique connection string:
   ```bash
   neonctl connection-string --branch engineer_name_branch
   ```
4. If needed, you can reset your branch to mirror the parent branch. This is useful for discarding all changes in the dev branch and starting fresh based on the latest state of the parent’s data and schema:
   ```bash
   neonctl branches reset --name engineer_name_branch --parent
   ```
5. Once a dev branch is no longer needed, delete it:
   ```bash
   neonctl branches delete --name engineer_name_branch
   ```

## Future Improvements

In the near future, we’ll be expanding this document to include more workflows, for example covering **staging environments**. Stay tuned.

## Additional resources
- [Using Vercel for your preview deployments](/docs/guides/vercel) (guide)
- [A Postgres database for every Fly.io preview](https://www.youtube.com/watch?v=EOVa68Uviks) (video)
- [A Postgres database for every Vercel preview](https://www.youtube.com/watch?v=s4vIMI9rXeg) (video)
- Guides for [Prisma](/docs/guides/prisma-migrations), [Django](/docs/guides/django-migrations), [Liquibase](/docs/guides/liquibase), [Flyway](/docs/guides/flyway), and [more](/docs/guides/guides-intro)
- [About Branch Reset](/blog/announcing-branch-reset) 
- [About the Neon CLI](/blog/cli)