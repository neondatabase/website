---

title: 'GitOps for databases: a practical guide for developers'
subtitle: Bring your data to your GitHub workflow to streamline development
enableTableOfContents: true
updatedOn: '2024-02-27T14:37:51.432Z'

---

The agility of modern development seems to hit a bottleneck when it comes to the backend. Teams building apps face data issues that can hinder progress, such as:

- Provisioning new databases quickly
- Reverting to previous data states
- Accessing production-like data for development securely
- Maintaining data consistency across development, staging, and production
- Developing collaboratively without interference
- Managing schema migrations across different environments

Traditionally, database operations remained isolated from the main application development process. Instead, we propose an approach that integrates the database into existing pipelines via a combination of database branching, database version control, and automation:

- **Database branching** extends the Git concept of branching to data. Database branches make data copies instantaneously accessible via copy-on-write, which can be modified without affecting the primary. Having access to database branches eliminates the waiting associated with database provisioning; it also minimizes the risks of development by introducing a navigable history of data modifications, making data as safely modifiable as source code. The improved data experience mirrors the experience Git introduced to code versioning.
- **Database version control** applies version control to database changes (schema and data) in a similar way to source code version control. This means changes to the database are tracked, can be reviewed, reverted, or applied to different environments with a clear history of modifications.
- **Automations** allow to integrate database operations into existing CI/CD pipelines. This ensures automated testing, building, and deploying of database changes alongside application code, reducing manual intervention while ensuring data consistency.

![Automation widget](/flow/automation.png)

<Admonition type="info">
**The data challenge**
<br/>
The concept of integrating database management with development practices—often referred to as “Database DevOps”—is not novel. A variety of tools now exist to support the management of schema changes, simplifying the process for developers. But to effectively merge backend processes into development workflows demands the ability to replicate large data volumes across environments and manage different data states, including rolling back to previous states when necessary.
<br/>
Git repositories mitigate similar risks in code development by maintaining a complete history of commits, thus offering a safety net. The objective is to mirror this level of security and efficiency with databases by introducing the concept of database branches. These branches encapsulate a comprehensive history of data snapshots, ensuring that developers can manage and revert data states with the same ease as managing code versions.
</Admonition>

## The objective: to treat databases as cattle, not pets

We’ll first set common ground by sharing our assumptions of how modern development teams work:

- Your team collaborates on a codebase hosted on platforms like GitHub. You follow the Github flow: you use feature branches, pull requests (PRs), automated checks, peer reviews, and merges into the main branch.
- Your database schema is managed as code. The source of truth for your database schema lives in your repo, and changes to the schema are traceable and version-controlled.
- CI/CD automation tools are integral to your workflow. They automate the deployment pipeline.
- The database is at the core of your architecture. It is an essential component of your application's functionality and acts as the source of truth for data and state.

Within this context, the objectives are clear:

- Provide each developer with a dedicated development database environment, ready and populated with data, allowing for immediate synchronization with the current codebase.
- Automate the application of schema migration scripts for each release, automatically testing the migration before proceeding to ensure integrity and accuracy.
- Align database operations with the deployment cadence in Git, ensuring that database changes are as easily reversible as application code updates.
- Ensure testing, preview, and staging databases stay up-to-date with production through continuous synchronization mechanisms.
- Streamline database operations through automation and integration with existing development tools and workflows.

## Executing a Git-driven database flow

<Admonition type="tip">
💡 **The Tools** section lists a variety of tools to help you build this workflow. These include tools for database branching, anonymizing production data, and tracking schema changes.
</Admonition>

### Environments

#### Production

1. Establish a **main database branch** as your production database.
2. Just like in your code repository, apply special protections to this database branch, setting up roles and restricting access.

#### Staging (optional)

3. If you have a fixed staging environment, create a **staging database branch**. To populate it with data, have two options:
   a. Derive it directly from the production database branch (see [Use case 1](#use-case-1)).
      i. If you follow this route, set up automation to regularly reset the staging database branch to avoid drifting from production.
      ii. Consider anonymizing personal information, if appropriate.
   b. Use a separate, transformed dataset for staging—e.g. to avoid real emails or PII (see [Use case 2](#use-case-2)).
      i. In this case, create an independent 'staging' database branch and load it with its own synthetic or transformed dataset.

#### Development

4. Create a **main dev database branch**.
   a. From this primary branch, create one **dev database branch for every engineer**. When starting a new line of work, reset to a clean state.
   b. For features that need extra testing before they are committed or merged, you can also consider creating short-lived **feature dev database branches** derived from the main dev branch.
5. To populate the main dev database branch with data, you have two options:
   a. Derive it from the staging database branch, if it exists (See [Use case 1](#use-case-1), [Use case 2](#use-case-2)).
   b. For simpler deployments without a staging environment, you can derive it directly from the production database (see [Use case 3](#use-case-3)).
6. When starting a new line of work in the 'dev' database branches, reset to clean state.
7. Set up roles and restrict access for safety.

#### Database version control

8. Store your database schema and changes in a **version control system** alongside your application code, treating your main database branch as your production state.

#### CI/CD automations

9. Use GitHub Actions or similar tools to manage the lifecycle of 'preview' and 'testing' database branches, including their automatic creation and deletion:
   a. For every pull request you open, create a **preview database branch** derived from the staging database branch (see [Use case 1](#use-case-1), [Use case 2](#use-case-2)). If you don’t have a staging environment, derive them directly from the production database branch.
   b. Once the PR is merged, delete the preview branch and your preview environment.
   c. For every test run execution, create a **test database branch** derived from the staging database branch. If you don’t have a staging environment, derive them directly from the production database.
   d. Once the test is done, delete the test database branch.
10. Integrate **schema migrations** into your CI/CD pipelines by including scripts in your version control system.
   a. Regularly check for schema drift, ensuring that the database schema matches the expected state before applying changes.  

## Implementation scenarios

### Use case 1: Staging with production-like data

_For environments where mirroring production data is essential for development and testing._

- The staging database branch is directly derived from production.
- Dev branches are derived from the staging branch.
- Short-lived preview database branches are created for every PR and commit and deleted once PRs are merged.
- Similarly, short-lived test branches are created and deleted for every test.
- All operations are automated within the CI/CD pipeline, including schema migrations.

![Staging with production-like data widget](/flow/use-case-1.png)

### Use case 2: Transformed data for staging

_For environments with strict privacy regulations or where transformed datasets work best for development and testing purposes._

- An independent staging database branch is created with its own transformed or synthetic dataset to avoid using real emails or PII.
- Dev, preview, and test databases are derived from the staging branch.

![Transformed data for staging widget](/flow/use-case-2.png)

### Use case 3: Simplified deployment

_For more simple deployments may not have a staging environment, e.g. in pre-production scenarios that prioritize engineering velocity._

- The development database branches are derived directly from the main production database branch.
- The dev branches are often reset from the parent to mirror the latest state.

![Simplified deployment widget](/flow/use-case-3.png)

### Use case 4: Multi-tenancy with customer isolation

_For multi-tenancy deployments with full isolation requirements (e.g. one database per customer)._

- One production database branch is created per customer, enabling customer-specific point-in-time restores.
- A separate staging branch is created, with development, preview, and testing databases derived from it.

![Multi-tenancy with customer isolation widget](/flow/use-case-4.png)

## Workflow example

<Admonition type="important">
⚠️  Take this code as a general guideline. The main goal of this example is to illustrate the entirety of the workflow. Make sure you adapt the code to your particular use case, tools, and needs.
</Admonition>

If you wanted to implement a scenario like the one in [Use case 1](#use-case-1-staging-with-production-like-data), here’s what the workflow would look like. This example workflow uses [Neon](/) to create database branches, [Prisma](https://www.prisma.io/) for schema migrations, and [GitHub Actions](https://docs.github.com/en/actions) for CI/CD. Navigate to the [Tools](#tools) section for more information.

- Create a Neon project with a main database branch as your production database:

```yaml
curl -X DELETE \
- name: Authenticate with Neon
  run: neonctl auth

- name: Create Neon project (if not exists)
  id: create_project
  run: |
    if ! neonctl projects list | grep -q "<project_name>"; then
      neonctl projects create <project_name> 
    fi

- name: Create main production branch (if not exists)
  id: create_main_branch
  run: |
    if ! neonctl branches list --project <project_name> | grep -q "main"; then
      neonctl branches create main --project <project_name>
    fi 

# ... set up roles and access restrictions (consider Neon's role management commands)
```

- Create a staging database branch derived from the production database branch:

```yaml
- name: Create staging branch
  run: neonctl branches create staging --project <project_name> --parent main
```

- Create a main dev database branch derived from the staging database branch. From this primary branch, create one dev database branch for every engineer:

```yaml
- name: Create main dev branch (if not exists)
  id: create_main_dev
  run: |
    if ! neonctl branches list --project <project_name> | grep -q "dev"; then
      neonctl branches create dev --project <project_name> --parent staging
    fi

- name: Create developer branches
  run: |
    for developer in dev1 dev2 dev3; do  
      neonctl branches create ${developer} --project <project_name> --parent dev
    done
```

- When starting a new line of work, reset to a clean state.

```fish
neonctl branches reset ${{ developer }} --project <project_name>
```

- For every pull request you open, use GitHub Actions to create a preview database branch derived from the staging database branch.  Once the PR is merged, delete the preview database branch.

```yaml
name: Database CI/CD

on: 
  pull_request:
    branches: [ main ] 

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # ... Install Neon CLI, Authenticate 

      - name: Create preview branch
        run: neonctl branches create preview-$(echo $GITHUB_SHA | cut -c1-8) --project <project_name> --parent staging

      - name: Run migrations
        run: npx prisma migrate deploy

      # ... Your testing steps

      - if: ${{ github.event.action == 'closed' }} 
        name: Delete preview branch
        run: neonctl branches delete preview-$(echo $GITHUB_SHA | cut -c1-8) --project <project_name> 
```

- Similar to previews, for every test run execution, create a test database branch derived from the staging database branch. Once the test is done, delete the test database branch.
- Integrate schema migrations into your CI/CD pipelines. Example script:

```bash
#!/bin/bash

# Install Prisma CLI if needed
if ! command -v prisma &> /dev/null
then
    npm install -g prisma
fi

# 1. Generate Prisma Client (adjust if not needed for your workflow)
npx prisma generate

# 2. Apply Migrations
npx prisma migrate deploy

# 3. Schema Drift Detection (Simplified)
npx prisma migrate diff --from schema.prisma --to postgresql://...  # Replace with your database URL
if [ $? -ne 0 ]; then
  echo "**Schema drift detected!** Review changes before proceeding."
  exit 1  # You might want a more nuanced approach than simply failing the build
fi

echo "Database schema is in sync."
```

- Within your GitHub Actions, you would include a step that executes this script.

```yaml
- name: Schema Migrations and Drift Check
  run: ./prisma_migrate_and_check.sh 
```

## Tools

- [Neon](/): A serverless, branch-based Postgres database. Neon allows you to create database branches instantly (including schema + data) and to manage thousands of them programmatically. [See this example repo](https://github.com/neondatabase/preview-branches-with-vercel).
- [GitHub Actions](https://docs.github.com/en/actions): GitHub's built-in CI/CD platform that lets you automate workflows like testing, building, and deployments directly within your repositories. [This guide includes Actions you can use to automate the creation and deletion database branches.](/docs/guides/branching-github-actions)
- [PostgreSQL Anonymizer](https://postgresql-anonymizer.readthedocs.io/en/stable/): This extension allows you to anonymize sensitive data (PII) for your non-production environments. This tutorial shows you how to use PostgreSQL Anonymizer in Neon. _This is interesting if you’re directly deriving your staging database branch from the production branch (as in [Example 1](#use-case-1-staging-with-production-like-data))_.
- [Neosync](https://www.neosync.dev/): This tool allows you to build fully synthetic datasets that mimic your production data. [This blog post introduces you to the concept of synthetic data](/blog/how-to-use-synthetic-data-to-catch-more-bugs-with-neosync); for steps on how to implement this in Neon,[see this tutorial.](https://www.neosync.dev/blog/neosync-neon-data-gen-job) _Synthetic datasets are interesting if you’re choosing to completely avoid production data in non-production environments (see [Example 2](#use-case-2-transformed-data-for-staging))_.
- [Prisma](https://www.prisma.io/): A framework for Node.js and TypeScript, popular for database schema management, migrations, and data access. [This guide shows you how to manage schema migrations using Prisma and Neon.](/docs/guides/prisma-migrations)
- [Drizzle](https://orm.drizzle.team): A TypeScript ORM that connects to all major databases and works across most Javascript runtimes. [This guide shows you how to manage schema migrations using Drizzle and Neon.](/docs/guides/drizzle-migrations)
- [Liquibase](https://www.liquibase.com): An open-source library for database change management. [This guide shows you how to manage schema migrations using Liquibase and Neon.](/docs/guides/liquibase)
- [Flyway](https://flywaydb.org/):  A database migration tool that facilitates version control for databases. [This guide shows you how to manage schema migrations using Flyway and Neon.](/docs/guides/flyway)

<Admonition type="info">
📖 **Contribute**

Help us improve this list! If you know of more great tools, share them with us in [Discord](/discord) or [Twitter](https://x.com/neondatabase).
</Admonition>

## Acknowledgments

This content is inspired by the community. Special mention to Eric Bernhandsson ([article](https://erikbern.com/2021/04/19/software-infrastructure-2.0-a-wishlist.html)), Ryan Booz ([article](https://www.softwareandbooz.com/10-requirements-for-managing-database-changes/)), Evis Drenova, Martin Fowler ([article](https://martinfowler.com/articles/evodb.html)), Tonie Huizer ([article](https://www.sqlservercentral.com/articles/a-version-control-strategy-for-branch-based-database-development)), Franck Pachot, Jacob Prall, Umair Shahid, and Alex Klarfeld. Additional references: [Github flow](https://docs.github.com/en/get-started/using-github/github-flow), [The Planetscale workflow](https://planetscale.com/docs/concepts/planetscale-workflow), [Framework-defined infrastructure by Vercel](https://vercel.com/blog/framework-defined-infrastructure), [Guide to Database DevOps](https://www.liquibase.com/resources/guides/database-devops) and [Database GitOps](https://www.liquibase.com/gitops) by Liquibase.
