---
title: Neon for Database-per-user
subtitle: How to configure Neon for multi-tenancy - plus a few design tips
enableTableOfContents: true
updatedOn: '2024-12-12T19:49:26.797Z'
---

With its serverless and API-first nature, Neon is an excellent choice for building database-per-user applications (or apps where each user/customer has their own Postgres database). Neon is particularly well-suited for architectures that prioritize maximum database isolation, achieving the equivalent of instance-level isolation.

This guide will help you get started with implementing this architecture.

## Multi-tenant architectures in Postgres

In a multi-tenant architecture, a single system supports multiple users (tenants), each with access to manage their own data. In a database like Postgres, this setup requires careful structuring to keep each tenant’s data private, secure, and isolated—all while remaining efficient to manage and scale.

Following these principles, there are three primary routes you could follow to implement multi-tenant architectures in Postgres:

- Creating one separate database per user (the focus of this guide);
- Creating one schema-per-user, within the same database;
- And keeping your tenants separate within a shared schema.

To better situate our use case, let’s briefly outline the differences between these architectures:

### Database-per-user

![Database-per-user](/docs/use-cases/database_per_user.png)

In a database-per-user design, each user’s data is fully isolated in its own database, eliminating any risk of data overlap. This setup is straightforward to design and highly secure. However, implementing this in managed Postgres databases has traditionally been challenging. For users of AWS RDS, Amazon Aurora, or similar services, two primary options have existed for achieving a database-per-user design:

1. **Using one large instance to host multiple user databases.** This option can be tempting due to the reduced number of instances to manage and (probably) lower infrastructure costs. But the trade-off is a higher demand for DBA expertise—this is a design that requires careful planning, especially at scale. Hosting all users on shared resources can impact performance, particularly if users have varying workload patterns, and if the instance fails, all customers are affected. Migrations and upgrades also become complex.

2. **Handling multiple instances, each hosting a single production database.** In this scenario, each instance scales independently, preventing resource competition between users and minimizing the risk of widespread failures. This is a much simpler design from the perspective of the database layer, but managing hundreds of instances in AWS can get very costly and complex. As the number of instances grows into the thousands, management becomes nearly impossible.

As we’ll see later throughout this guide, Neon offers a third alternative by providing a logical equivalent to the instance-per-customer model with near-infinite scalability, without the heavy DevOps overhead. This solution involves creating one Neon project per customer.

### Schema-per-user

![Schema-per-user](/docs/use-cases/schema_per_user.png)

But before focusing on database-per-user, let’s briefly cover another multi-tenancy approach in Postgres: the schema-per-user model. Instead of isolating data by database, this design places all users in a single database, with a unique schema for each.

In Neon, we generally don’t recommend this approach for SaaS applications, unless this is a design you’re already experienced with. This approach doesn’t reduce operational complexity or costs if compared to the many-databases approach, but it does introduce additional risks; it also limits the potential of Neon features like instant Point-in-Time Recovery (PITR), which in a project-per-customer model allows you to restore customer databases independently without impacting the entire fleet’s operations. More about this later.

### Shared schema

![Shared schema](/docs/use-cases/shared_schema.png)

Lastly, Postgres’s robustness actually makes it possible to ensure tenant isolation within a shared schema. In this model, all users' data resides within the same tables, with isolation enforced through foreign keys and row-level security.

While this is a common choice—and can be a good starting point if you’re just beginning to build your app—we still recommend the project-per-user route if possible. Over time, as your app scales, meeting requirements within a shared schema setup becomes increasingly challenging. Enforcing compliance and managing access restrictions at the schema level grows more complex as you add more users.

You’ll also need to manage very large Postgres tables, as all customer data is stored in the same tables. As these tables grow, additional Postgres fine-tuning will be required to maintain performance.

## Setting up Neon for Database-per-user

Now that we’ve reviewed your options, let’s focus on the design choice we recommend for multi-tenancy in Neon: creating isolated databases for each user, with each database hosted on its own project.

### Database-per-user = Project-per-user

![Project per user](/docs/use-cases/project_per_user.png)

We recommend setting up one project per user, rather than, for example, using a branch per customer. A Neon [project](/docs/manage/overview) serves as the logical equivalent of an "instance" but without the management overhead. Here’s why we suggest this design:

- **Straightforward scalability**  
  Instead of learning how to handle large Postgres databases, this model allows you to simply create a new project when a user joins—something that can be handled automatically via the Neon API. This approach is very cost-effective, as we’ll see below. Databases remain small, keeping management at the database level simple.

- **Better performance with lower costs**  
  This design is also highly efficient in terms of compute usage. Each project has its own dedicated compute, which scales up and down independently per customer; a spike in usage for one tenant doesn’t affect others, and inactive projects remain practically free.

- **Complete data isolation**  
  By creating a dedicated project for each customer, their data remains completely separate from others, ensuring the highest level of security and privacy.

- **Easier regional compliance**  
  Each Neon project can be deployed in a specific region, making it easy to host customer data closer to their location.

- **Per-customer PITR**  
  Setting up a project per customer allows you to run [PITR on individual customers](/docs/guides/branch-restore) instantly, without risking disruption to your entire fleet.

## Managing many projects

As you scale, following a project-per-user design means eventually managing thousands of Neon projects. This might sound overwhelming, but it’s much simpler in practice than it seems—some Neon users [manage hundreds of thousands of projects](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) with just one engineer. Here’s why that’s possible:

- **You can manage everything with the Neon API**  
  The API allows you to automate every step of project management, including setting resource limits per customer and configuring resources.

- **No infrastructure provisioning**  
  New Neon projects are ready in milliseconds. You can set things up to create new projects instantly when new customers join, without the need to manually pre-provision instances.

- **You only pay for active projects**  
  Empty projects are virtually free thanks to Neon’s [scale-to-zero](/docs/guides/auto-suspend-guide) feature. If, on a given day, you have a few hundred projects that were only active for a few minutes, that’s fine—your bill won’t suffer.

- **Subscription plans**  
  To support this usage pattern, our pricing plans include a generous number of projects within the monthly subscription fee, allowing you to scale without a big budget:
  - The Launch plan includes 100 projects for $19/month.
  - The Scale plan includes 1,000 projects for $69/month.
  - The Business plan includes 5,000 projects for $700/month.

### Dev/test environments

In Neon, [database branching](/docs/introduction/branching) is a powerful feature that enables you to create fast, isolated copies of your data for development and testing. You can use child branches as ephemeral environments that mirror your main testing database but operate independently, without adding to storage costs. This feature is a game-changer for dev/test workflows, as it reduces the complexity of managing multiple test databases while lowering non-prod costs significantly.

To handle [dev/test](https://neon.tech/use-cases/dev-test) in a project-per-user design, consider creating a dedicated Neon project as your non-prod environment. This Neon project can serve as a substitute for the numerous non-prod instances you might maintain in RDS/Aurora.

The methodology:

- **Within the non-prod project, load your testing data into the main branch.** This main branch will serve as the primary source for all dev/test environments.
- **Create ephemeral environments via child branches.** For each ephemeral environment, create a child branch from the main branch. These branches are fully isolated in terms of resources and come with an up-to-date copy of your testing dataset.
- **Automate the process.** Use CI/CD and automations to streamline your workflow. You can reset child branches with one click to keep them in sync with the main branch as needed, maintaining data consistency across your dev/test environments.

## Designing a Control Plane

Once you have everything set up, as your number of projects grows, you might want to create a control plane to stay on top of everything in a centralized manner.

### The catalog database

![catalog database](/docs/use-cases/catalog_database.png)

The catalog database is a centralized repository that tracks and manages all Neon projects and databases. It holds records for every Neon project your system creates. You can also use it to keep track of tenant-specific configurations, such as database names, regions, schema versions, and so on.

You can set up your catalog database as a separate Neon project. When it's time to design its schema, consider these tips:

- Use foreign keys to link tables like `project` and `payment` to `customer`.
- Choose data types carefully: `citext` for case-insensitive text, `uuid` for unique identifiers to obscure sequence data, and `timestamptz` for tracking real-world time.
- Track key operational data, like `schema_version`, in the `project` table.
- Index wisely! While the catalog will likely remain smaller than user databases, it will grow—especially with recurring events like payments—so indexing is crucial for control plane performance at scale.
- Start with essential data fields and plan for future extensions as needs evolve.
- Standard Neon metadata (e.g., compute size, branch info) is accessible via the console. Avoid duplicating it in the catalog database unless separate access adds significant complexity.

### Automations

To effectively scale a multi-tenant architecture, leveraging automation tools is essential. The Neon API will allow you to automate various tasks, such as creating and managing projects, setting usage limits, and configuring resources. Beyond the API, Neon offers several integrations to streamline your workflows:

- **GitHub Actions**  
  Neon's [GitHub integration](/docs/guides/neon-github-integration) allows you to automate database branching workflows directly from your repositories. By connecting a Neon project to a GitHub repository, you can set up actions that create or delete database branches in response to pull request events, facilitating isolated testing environments for each feature or bug fix.

- **Vercel Integration**  
  You can [connect your Vercel projects to Neon](/docs/guides/neon-github-integration), creating database branches for each preview deployment.

- **CI/CD pipelines**  
  By combining Neon branching into your CI/CD, you can simplify your dev/test workflows by creating and deleting ephemeral environments automatically as child branches.

- **Automated backups to your own S3**  
  If you must keep your own data copy, you can [schedule regular backups](https://neon.tech/blog/nightly-backups-for-multiple-neon-projects) using tools like `pg_dump` in conjunction with GitHub Actions.

## The Application Layer

Although the application layer isn’t our main focus, a common question developers ask us when approaching a multi-tenant architecture is: _Do I deploy one application environment per database, or connect all databases to a single application environment?_

Both approaches are viable, each with its own pros and cons.

### Shared application environments

![shared application environments](/docs/use-cases/shared_application_environments.png)

#### Pros of shared environments

- Managing a single application instance minimizes operational complexity.
- Updates and new features are easy to implement since changes apply universally.
- Operating one environment reduces infrastructure and maintenance costs.

#### Cons of shared environments

- A single application environment makes it difficult to offer tailored experiences for individual customers.
- Compliance becomes challenging when users' databases span multiple regions.
- Updates apply to all users simultaneously, which can be problematic for those needing specific software versions.
- A single environment heightens the risk of data breaches, as vulnerabilities can impact all users.

#### Advice

- **Implement robust authorization**  
  Ensure secure access as all users share the same application environment.

- **Define user authentication and data routing**

  - Users provide their organization details during login.
  - Users access the application via an organization-specific subdomain.
  - The system identifies the user's organization based on their credentials.

- **Monitor usage and performance**  
  Regularly track application usage to prevent performance bottlenecks.

- **Plan maintenance windows carefully**  
  Minimize disruptions for all users by scheduling maintenance during low-usage periods.

### Isolated application environments

![isolated application environments](/docs/use-cases/isolated_application_environments.png)

In this architecture, each customer has instead a dedicated application environment alongside their own database. Similar to the shared environment option, this design has pros and cons:

#### Pros of isolated environments

- Since each customer can now have a unique application environment, it’s easier to implement personalized features and configurations, to keep separate versions for particular customers, and so on.
- Compliance is also simpler if you’re handling multiple regions. Deploying the application in multiple regions can also help with latency.
- This design also opens the door for customers to control their own upgrade schedules, e.g., via defining their own maintenance windows.

#### Cons of isolated environments

- This design has an obvious tradeoff: it comes with higher complexity of deployment, monitoring, and maintenance.
- You’ll need to think about how to route optimal resource utilization across multiple environments, and how to keep observability on-point to diagnose issues.
- Operating separate environments for each customer might also lead to higher costs.

#### Advice

If you decide to implement isolated environments, here’s some advice to consider:

- Design your architecture to accommodate growth, even if your setup is small today.
- Similarly as you’re doing with Neon projects, take advantage of automation tools to streamline the creation and management of your application environments.
- Set up proper monitoring to track key metrics across all environments.

## Migrating Schemas

Is database-per-user design, it is common to have the same schema for all users/databases. Any changes to the user schema will most likely be rolled out to all individual databases simultaneously. In this section, we teach you how to use DrizzleORM, GitHub Actions, the Neon API, and a couple of custom template scripts to manage many databases using the same database schema.

### Example app

To walk you through it, we’ve created example code [in this repository](https://github.com/PaulieScanlon/neon-database-per-tenant-drizzle). The example includes 4 Neon databases, all using Postgres 16 and all deployed to AWS us-east-1.

The schema consists of three tables, `users`, `projects` and `tasks`. You can see the schema here: [schema.ts](https://github.com/PaulieScanlon/neon-database-per-tenant-drizzle/blob/main/src/db/schema.ts), and for good measure, here’s the raw SQL equivalent: [schema.sql](https://github.com/PaulieScanlon/neon-database-per-tenant-drizzle/blob/main/schema.sql). This default schema is referenced by each of the `drizzle.config.ts` files that have been created for each customer.

### Workflow using Drizzle ORM and GitHub Actions

#### Creating Neon projects via a CLI script

Our example creates new Neon projects via the command line, using the following script:

```javascript
// src/scripts/create.js

import { Command } from 'commander';
import { createApiClient } from '@neondatabase/api-client';
import 'dotenv/config';

const program = new Command();
const neonApi = createApiClient({
  apiKey: process.env.NEON_API_KEY,
});

program.option('-n, --name <name>', 'Name of the company').parse(process.argv);

const options = program.opts();

if (options.name) {
  console.log(`Company Name: ${options.name}`);

  (async () => {
    try {
      const response = await neonApi.createProject({
        project: {
          name: options.name,
          pg_version: 16,
          region_id: 'aws-us-east-1',
        },
      });

      const { data } = response;
      console.log(data);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  })();
} else {
  console.log('No company name provided');
}
```

This script utilizes the `commander` library to create a simple command-line interface (CLI) and the Neon API's `createProject` method to set up a new project. Ensure that your Neon API key is stored in an environment variable named `NEON_API_KEY`.

To execute the script and create a new Neon project named "ACME Corp" with PostgreSQL version 16 in the aws-us-east-1 region, run:

```bash
npm run create -- --name="ACME Corp"
```

In this example, the same approach was used to create the following projects:

- ACME Corp
- Payroll Inc
- Finance Co
- Talent Biz

To interact with the Neon API, you'll need to generate an API key. For more information, refer to the Neon documentation on [creating an API key](https://api-docs.neon.tech/reference/createapikey).

#### Generating a workflow to prepare for migrations

```javascript
// src/scripts/generate.js

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { createApiClient } from '@neondatabase/api-client';
import { Octokit } from 'octokit';
import 'dotenv/config';

import { encryptSecret } from '../utils/encrypt-secret.js';
import { drizzleConfig } from '../templates/drizzle-config.js';
import { githubWorkflow } from '../templates/github-workflow.js';

const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });
const neonApi = createApiClient({ apiKey: process.env.NEON_API_KEY });

const repoOwner = 'neondatabase-labs';
const repoName = 'neon-database-per-tenant-drizzle';
let secrets = [];

(async () => {
  // Ensure configs directory exists
  if (!existsSync('configs')) mkdirSync('configs');

  // Fetch GitHub public key for encrypting secrets
  const { data: publicKeyData } = await octokit.request(
    `GET /repos/${repoOwner}/${repoName}/actions/secrets/public-key`,
    { headers: { 'X-GitHub-Api-Version': '2022-11-28' } }
  );

  // List all Neon projects
  const {
    data: { projects },
  } = await neonApi.listProjects();

  await Promise.all(
    projects.map(async (project) => {
      const { id, name } = project;

      // Fetch database connection URI
      const {
        data: { uri },
      } = await neonApi.getConnectionUri({
        projectId: id,
        database_name: 'neondb',
        role_name: 'neondb_owner',
      });

      // Prepare variables
      const safeName = name.replace(/\s+/g, '-').toLowerCase();
      const path = `configs/${safeName}`;
      const file = 'drizzle.config.ts';
      const envVarName = `${safeName.replace(/-/g, '_').toUpperCase()}_DATABASE_URL`;
      const encryptedValue = await encryptSecret(publicKeyData.key, uri);

      // Store environment variable name for later use
      secrets.push(envVarName);

      // Create project directory and config file if not present
      if (!existsSync(path)) mkdirSync(path);
      if (!existsSync(`${path}/${file}`)) {
        writeFileSync(`${path}/${file}`, drizzleConfig(safeName, envVarName));
        console.log(`Created drizzle.config for: ${safeName}`);
      }

      // Add encrypted secret to GitHub
      await octokit.request(`PUT /repos/${repoOwner}/${repoName}/actions/secrets/${envVarName}`, {
        owner: repoOwner,
        repo: repoName,
        secret_name: envVarName,
        encrypted_value: encryptedValue,
        key_id: publicKeyData.key_id,
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      });

      // Generate migrations using drizzle-kit
      execSync(`drizzle-kit generate --config=${path}/${file}`, { encoding: 'utf-8' });
      console.log(`Ran drizzle-kit generate for: ${safeName}`);
    })
  );

  // Ensure GitHub Actions workflow directories exist
  if (!existsSync('.github')) mkdirSync('.github');
  if (!existsSync('.github/workflows')) mkdirSync('.github/workflows');

  // Generate GitHub workflow file
  const workflow = githubWorkflow(secrets);
  writeFileSync(`.github/workflows/run-migrations.yml`, workflow);
  console.log('GitHub Actions workflow created.');
})();
```

The script above goes through these steps:

1. Ensures the `configs` directory exists, creating it if necessary.
2. Retrieves the GitHub public key for encrypting secrets.
3. Lists all projects in your Neon account.
4. For each project:
   - Retrieves the connection URI from Neon.
   - Sanitizes project names for safe usage in directory names and environment variables.
   - Creates DrizzleORM config files.
   - Encrypts secrets and adds them to the GitHub repository.
   - Generates migrations using `drizzle-kit`.
5. Finally, it generates GitHub Actions workflow that includes all generated environment variables for running migrations.
6. To run the script, use the following command:

   ```bash
   npm run generate
   ```

Ensure the following environment variables are set:

- `NEON_API_KEY`: Your Neon API key.
- `PERSONAL_ACCESS_TOKEN`: Your GitHub personal access token.

And update `repoOwner` and `repoName` to match your repository details.

Here’s an example output for the Drizzle configuration:

```javascript
// src/configs/acme-corp/drizzle.config.ts

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/acme-corp',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.ACME_CORP_DATABASE_URL!,
  },
});
```

And for the GitHub workflow:

```yaml
// .github/workflows/run-migrations.yml

name: Migrate changes

on:
  pull_request:
    types: [closed]
    branches:
      - main
  workflow_dispatch:

env:
  TALENT_BIZ_DATABASE_URL: ${{ secrets.TALENT_BIZ_DATABASE_URL }}
  PAYROLL_INC_DATABASE_URL: ${{ secrets.PAYROLL_INC_DATABASE_URL }}
  ACME_CORP_DATABASE_URL: ${{ secrets.ACME_CORP_DATABASE_URL }}
  FINANCE_CO_DATABASE_URL: ${{ secrets.FINANCE_CO_DATABASE_URL }}

jobs:
  migrate:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run migration script
        run: node src/scripts/migrate.js
```

#### Running migrations

Now, we’re ready to run migrations:

```javascript
// src/scripts/migrate.js

import { readdirSync, existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

(async () => {
  const configDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../configs');

  if (existsSync(configDir)) {
    const customers = readdirSync(configDir);

    const configPaths = customers
      .map((customer) => path.join(configDir, customer, 'drizzle.config.ts'))
      .filter((filePath) => existsSync(filePath));

    console.log('Found drizzle.config.ts files:', configPaths);

    configPaths.forEach((configPath) => {
      console.log(`Running drizzle-kit for: ${configPath}`);
      execSync(`npx drizzle-kit migrate --config=${configPath}`, { encoding: 'utf-8' });
    });
  } else {
    console.log('The configs directory does not exist.');
  }
})();
```

This script:

- Only runs after a pull request (PR) has been merged. It reads through the configs directory and applies the migrations defined in each `drizzle.config.ts` file for every project or customer, ensuring that all databases are using the same schema.
- Uses `npx` to run the `drizzle-kit migrate` command against each `drizzle.config.ts` file, ensuring that the schema is applied to all databases.

The source code for this migration script is located at: `src/scripts/migrate.js`. This approach automatically includes any new projects or customers added to the system, as well as schema changes that need to be applied across all databases.

### Summary

Here’s an overview of the workflow:

- We used a script to automate the creation of DrizzleORM configuration files (`drizzle.config.ts`) and securely store database connection strings as GitHub secrets.management.
- We used a migration script to iterate through the configs directory and apply schema changes to all databases via `drizzle-kit migrate`.
- The GitHub Actions workflow triggers migrations automatically when a PR is merged. Environment variables for each project are explicitly injected into the workflow, giving DrizzleORM access to the connection strings needed for schema updates.

## Backing up Projects to Your Own S3

As a manage database, Neon already takes care of securing your data, always keeping a full copy of your dataset in object storage. But if your use case or company demands that you also keep a copy of your data in your own S3, this section covers how to automate the process via a scheduled GitHub Action. A more extensive explanation can be found in this two-part blog post series: [Part 1](https://neon.tech/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups), [Part 2](https://neon.tech/blog/nightly-backups-for-multiple-neon-projects).

### AWS IAM configuration

First, GitHub must be added as an identity provider to allow the Action to use your AWS credentials. To create a new Identity Provider, navigate to IAM > Access Management > Identity Providers, and click Add provider.

![S3 backup IAM configuration](/docs/use-cases/s3_backup_iam_config.png)

On the next screen select OpenID Connect and add the following to the Provider URL and Audience fields.

1. Provider URL: https://token.actions.githubusercontent.com
2. Audience: `sts.amazonaws.com`

When you’re done, click **Add Provider**. You should now see this provider is visible in the list under **IAM > Access Management > Identity Providers**.

Now, you must create a role, which is an identity that you can assume to obtain temporary security credentials for specific tasks or actions within AWS. Navigate to **IAM > Access Management > Roles**, and click **Create role**.

On the next screen you can create a Trusted Identity for the Role. Select **Trusted Identity**. On the next screen, select **Web Identity**, then select `token.actions.githubusercontent.com` from the **Identity Provider** dropdown menu.

![S3 backup select trusted entity](/docs/use-cases/s3_select_trusted_entity.png)

Once you select the Identity Provider, you’ll be shown a number of fields to fill out. Select `sts.amazonaws.com` from the **Audience** dropdown menu, then fill out the GitHub repository details as per your requirements. When you’re ready, click **Next**. For reference, the options shown in the image below are for this repository.

![S3 backup web identity](/docs/use-cases/s3_web_identity.png)

You can skip selecting anything from the Add Permissions screen and click **Next** to continue.

On this screen give the **Role** a name and description. You’ll use the Role name in the code for the GitHub Action. When you’re ready click **Create role**.

### S3 bucket policy

This section assumes you already have an S3 bucket. If you need instructions on how to create a bucket, refer to [this blog post](https://neon.tech/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups).

To ensure the Role being used in the GitHub Action can perform actions on the S3 bucket, you’ll need to update the bucket policy. Select your bucket then select the Permissions tab and click **Edit**.

![S3 backup web identity](/docs/use-cases/s3_bucket_policy.png)

You can now add the following policy which grants the Role you created earlier access to perform S3 List, Get, Put and Delete actions. Replace the Role name (`neon-multiple-db-s3-backups-github-action`) with your Role name and replace the S3 bucket name (`neon-multiple-db-s3-backups`) with your S3 bucket name.

```yaml
{
  'Version': '2012-10-17',
  'Statement':
    [
      {
        'Effect': 'Allow',
        'Principal':
          { 'AWS': 'arn:aws:iam::627917386332:role/neon-multiple-db-s3-backups-github-action' },
        'Action': ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        'Resource':
          [
            'arn:aws:s3:::neon-multiple-db-s3-backups',
            'arn:aws:s3:::neon-multiple-db-s3-backups/*',
          ],
      },
    ],
}
```

When you’re ready click **Save** changes.

### GitHub secrets

Create the following GitHub Secrets to hold various values that you likely won’t want to expose or repeat in code:

- `AWS_ACCOUNT_ID`: This can be found by clicking on your user name in the AWS console.
- `S3_BUCKET_NAME`: In my case, this would be, neon-multiple-db-s3-backups
- `IAM_ROLE`: In my case this would be, neon-multiple-db-s3-backups-github-action

### Scheduled pg_dump/restore GitHub Action

Before diving into the code, here’s a look at this example in the Neon console dashboard. These are three databases set up for three fictional customers, all running Postgres 16 and all are deployed to us-east-1. We will be backing up each database into its own folder within an S3 bucket, with different schedules and retention periods. All the code in this example lives [in this repository](https://github.com/neondatabase-labs/neon-multiple-db-s3-backups).

![S3 backup three databases](/docs/use-cases/s3_backup_three_databases.png)

Using the same naming conventions, there are three new files in the ``.github/workflows` folder in the repository:

1. `paycorp-payments-prod.yml`
2. `acme-analytics-prod.yml`
3. `paycorp-payments-prod.yml`

All the Actions are technically the same, (besides the name of the file), but there are several areas where they differ.

These are:

1. The workflow name
2. The `DATABASE_URL`
3. The `RETENTION` period

For example, in the first `.yml` file, the workflow name is `acme-analytics-prod`, the `DATABASE_URL` points to `secrets.ACME_ANALYTICS_PROD`, and the `RETENTION` period is 7 days.

Here’s the full Action, and below the code snippet, we'll explain how it all works.

```yaml
// .github/workflows/acme-analytics-prod.yml

name: acme-analytics-prod

on:
  schedule:
    - cron: '0 0 * * *' # Runs at midnight
  workflow_dispatch:

jobs:
  db-backup:
    runs-on: ubuntu-latest

    permissions:
      id-token: write

    env:
      RETENTION: 7
      DATABASE_URL: ${{ secrets.ACME_ANALYTICS_PROD }}

      IAM_ROLE: ${{ secrets.IAM_ROLE }}
      AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
      S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
      AWS_REGION: 'us-east-1'
      PG_VERSION: '16'

    steps:
      - name: Install PostgreSQL
        run: |
          sudo apt install -y postgresql-common
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt install -y postgresql-${{ env.PG_VERSION }}

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ env.AWS_ACCOUNT_ID }}:role/${{ env.IAM_ROLE }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Set file, folder and path variables
        run: |
          GZIP_NAME="$(date +'%B-%d-%Y@%H:%M:%S').gz"
          FOLDER_NAME="${{ github.workflow }}"
          UPLOAD_PATH="s3://${{ env.S3_BUCKET_NAME }}/${FOLDER_NAME}/${GZIP_NAME}"

          echo "GZIP_NAME=${GZIP_NAME}" >> $GITHUB_ENV
          echo "FOLDER_NAME=${FOLDER_NAME}" >> $GITHUB_ENV
          echo "UPLOAD_PATH=${UPLOAD_PATH}" >> $GITHUB_ENV

      - name: Create folder if it doesn't exist
        run: |
          if ! aws s3api head-object --bucket ${{ env.S3_BUCKET_NAME }} --key "${{ env.FOLDER_NAME }}/" 2>/dev/null; then
            aws s3api put-object --bucket ${{ env.S3_BUCKET_NAME }} --key "${{ env.FOLDER_NAME }}/"
          fi

      - name: Run pg_dump
        run: |
          /usr/lib/postgresql/${{ env.PG_VERSION }}/bin/pg_dump ${{ env.DATABASE_URL }} | gzip > "${{ env.GZIP_NAME }}"

      - name: Empty bucket of old files
        run: |
          THRESHOLD_DATE=$(date -d "-${{ env.RETENTION }} days" +%Y-%m-%dT%H:%M:%SZ)
          aws s3api list-objects --bucket ${{ env.S3_BUCKET_NAME }} --prefix "${{ env.FOLDER_NAME }}/" --query "Contents[?LastModified<'${THRESHOLD_DATE}'] | [?ends_with(Key, '.gz')].{Key: Key}" --output text | while read -r file; do
            aws s3 rm "s3://${{ env.S3_BUCKET_NAME }}/${file}"
          done

      - name: Upload to bucket
        run: |
          aws s3 cp "${{ env.GZIP_NAME }}" "${{ env.UPLOAD_PATH }}" --region ${{ env.AWS_REGION }}
```

Starting from the top, there are a few configuration options:

#### Action configuration

```yaml
name: acme-analytics-prod

on:
  schedule:
    - cron: '0 0 * * *' # Runs at midnight
  workflow_dispatch:
```

- `name`: This is the workflow name and will also be used when creating the folder in the S3 bucket.
- `cron`: This determines how often the Action will run, take a look a the GitHub docs where the [POSIX cron syntax](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule) is explained.

#### Environment variables

```yaml
env:
  RETENTION: 7
  DATABASE_URL: ${{ secrets.ACME_ANALYTICS_PROD }}

  IAM_ROLE: ${{ secrets.IAM_ROLE }}
  AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
  S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
  AWS_REGION: 'us-east-1'
  PG_VERSION: '16'
```

- `RETENTION`: This determines how long a backup file should remain in the S3 bucket before it’s deleted.
- `DATABASE_URL`: This is the Neon Postgres connection string for the database you’re backing up.
- `IAM_ROLE`: This is the name of the AWS IAM Role.
- `AWS_ACCOUNT_ID`: This is your AWS Account ID.
- `S3_BUCKET_NAME`: This is the name of the S3 bucket where all backups are being stored.
- `AWS_REGION`: This is the region where the S3 bucket is deployed.
- `PG_VERSION`: This is the version of Postgres to install.

#### GitHub Secrets

As we mentioned above, several of the above environment variables are defined using secrets. These variables can be added to **Settings > Secrets and variables > Actions**.

Here’s a screenshot of the GitHub repository secrets including the connection string for the fictional ACME Analytics Prod database.

![S3 backup three databases](/docs/use-cases/github_secrets.png)

#### Action steps

This step installs Postgres into the GitHub Action’s virtual environment. The version to install is defined by the `PG_VERSION` environment variable.

**Install Postgres**

```yaml
- name: Install PostgreSQL
        run: |
          sudo apt install -y postgresql-common
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt install -y postgresql-${{ env.PG_VERSION }}
```

**Configure AWS credentials**

This step configures AWS credentials within the GitHub Action virtual environment, allowing the workflow to interact with AWS services securely.

```yaml
- name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ env.AWS_ACCOUNT_ID }}:role/${{ env.IAM_ROLE }}
          aws-region: ${{ env.AWS_REGION }}
```

**Set file, folder and path variables**

In this step I’ve created three variables that are all output to `GITHUB_ENV`. This allows me to access the values from other steps in the Action.

```yaml
     - name: Set file, folder and path variables
        run: |
          GZIP_NAME="$(date +'%B-%d-%Y@%H:%M:%S').gz"
          FOLDER_NAME="${{ github.workflow }}"
          UPLOAD_PATH="s3://${{ env.S3_BUCKET_NAME }}/${FOLDER_NAME}/${GZIP_NAME}"

          echo "GZIP_NAME=${GZIP_NAME}" >> $GITHUB_ENV
          echo "FOLDER_NAME=${FOLDER_NAME}" >> $GITHUB_ENV
          echo "UPLOAD_PATH=${UPLOAD_PATH}" >> $GITHUB_ENV
```

The three variables are as follows:

1. `GZIP_NAME`: The name of the `.gz` file derived from the date which would produce a file name similar to, `October-21-2024@07:53:02.gz`
2. `FOLDER_NAME`: The folder where the `.gz` files are to be uploaded
3. `UPLOAD_PATH`: This is the full path that includes the S3 bucket name, folder name and `.gz` file

**Create folder if it doesn’t exist**

This step creates a new folder (if one doesn’t already exist) inside the S3 bucket using the `FOLDER_NAME` as defined in the previous step.

## Final remarks

You can create as many of these Actions as you need. Just be careful to double check the `DATABASE_URL` to avoid backing up a database to the wrong folder.

<Admonition type="important">
GitHub Actions will timeout after ~6 hours. The size of your database is and how you’ve configured it will determine how long the `pg_dump` step takes. If you do experience timeout issues, you can self host [GitHub Action runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners). 
</Admonition>
