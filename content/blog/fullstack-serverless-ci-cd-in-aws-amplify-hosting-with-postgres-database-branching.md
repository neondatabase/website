---
title: >-
  Fullstack Serverless CI/CD in AWS Amplify Hosting with Postgres Database
  Branching
description: A Postgres database branch for each SSR app branch
excerpt: >-
  This post will guide you through integrating AWS Amplify Hosting CI/CD with
  Neon Postgres with a focus on testing your application’s environment or
  feature branches using real data enabled by Neon’s database branching. This
  architecture automates your workflow and ensures each ne...
date: '2024-03-06T23:50:49'
updatedOn: '2025-04-08T23:00:20'
category: community
categories:
  - community
authors:
  - stephen-siegert
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Fullstack Serverless CI/CD in AWS Amplify Hosting with Postgres Database
    Branching - Neon
  description: A Postgres database branch for each SSR app branch
  keywords: []
  noindex: false
  ogTitle: >-
    Fullstack Serverless CI/CD in AWS Amplify Hosting with Postgres Database
    Branching - Neon
  ogDescription: >-
    This post will guide you through integrating AWS Amplify Hosting CI/CD with
    Neon Postgres with a focus on testing your application’s environment or
    feature branches using real data enabled by Neon’s database branching. This
    architecture automates your workflow and ensures each new feature or
    environment branch in your Amplify application has a corresponding, isolated
    database. […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching/social.jpg
source:
  wpId: 5228
  wpSlug: >-
    fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching/neon-amplify-1024x576-9010d83e.jpg)

This post will guide you through integrating [AWS Amplify Hosting](https://aws.amazon.com/amplify/hosting/) CI/CD with Neon Postgres with a focus on testing your application’s environment or feature branches using real data enabled by Neon’s [database branching](https://neon.tech/docs/introduction/branching). This architecture automates your workflow and ensures each new feature or environment branch in your Amplify application has a corresponding, isolated database. This is especially useful if you’re building and deploying a Server Side Rendering (SSR) application using frameworks like [Next.js](https://nextjs.org/), [Nuxt](https://nuxt.com/), [Astro](https://astro.build/), and [SvelteKit](https://kit.svelte.dev/).

Because both Neon and Amplify Hosting are serverless, the underlying infrastructure doesn’t require maintenance. Also, when not in use, both services scale down to zero. For Amplify Hosting, this involves serverless compute functions (i.e SSR), while for Neon, it pertains to the Postgres cluster compute.

## Solution Overview

In this guide, we cover the deployment process of a serverless full-stack app using Amplify Hosting, leveraging its SSR compute capabilities. SSR enables running code and logic in a server environment, useful for tasks like using routing middleware, interfacing with third-party services, or connecting to a database.

To follow along, check out the YouTube video below that walks through in depth the process of deploying, and verifying the database branch creation in Neon when deploying a Nuxt SSR app that uses an [Amplify Gen 2 backend](https://docs.amplify.aws/gen2/) with Amplify Auth. While the example features Nuxt for server-side APIs, the methodology applies to any [SSR framework compatible with Amplify Hosting’s function-based compute](https://docs.aws.amazon.com/amplify/latest/userguide/amplify-ssr-framework-support.html).

For practical implementation, the scripts referenced in this guide (and video) are located in the [Neon Branches with Amplify Hosting CI/CD](https://github.com/siegerts/neon-branches-amplify-cicd) repo on GitHub.

<YoutubeIframe embedId="sBRI4QAZ-oo" isDocPost={false} />

## AWS Amplify Hosting

AWS Amplify Hosting is a fully managed CI/CD and hosting service that supports static sites, single-page applications (SPAs), and full-stack serverless SSR apps.

In Amplify Hosting, a typical workflow involves [teams managing app branches that align with various environments](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html), such as development, testing, and production. Each branch, like dev, test, and prod, corresponds to its respective environment and is accessible via a unique URL, which incorporates the first-level subdomain and the branch identifier. For example, `https://<branch-name>.<amplify-app-id>.amplifyapp.com/`.

## Serverless Postgres

When developing an SSR app in AWS Amplify Hosting and requiring Postgres or an RDBMS, the choices for a serverless relational database are limited. It’s important that your database can handle your application traffic without manual adjustment since serverless SSR fullstack apps can scale out in response to bursts of request traffic. And then scale back down when not in use – similar to how Lambda (and cloud) functions operate.

Using Amazon RDS involves virtual private cloud (VPC) and architecture configurations, typically requiring a Lambda function or service proxy for database access to bridge the connection from Amplify Hosting to the VPC. Alternatively, directly exposing an RDS database online requires setting up Amazon RDS Proxy, essentially acting as [PgBouncer](https://neon.tech/blog/pgbouncer-the-one-with-prepared-statements), for scaling purposes.

Amazon DynamoDB (DDB) is another serverless database solution, but it doesn’t offer the relational capabilities inherent to RDBMS like Postgres, such as relational data models, complex joins, or transactions.<br /><br />Neon is serverless Postgres with [auto-scaling](https://neon.tech/blog/scaling-serverless-postgres), easy setup, [built-in connection pooling](https://neon.tech/docs/connect/connection-pooling), and database branching. Neon’s branching capability allows developers to clone their entire Postgres cluster in seconds, creating isolated environments for testing new features without affecting the primary database branch. For these reasons, it pairs well with the serverless nature of Amplify Hosting and frontend fullstack SSR application architectures.

## Amplify Hosting CI/CD Integration

This Amplify Hosting SSR app and Neon Postgres integration involves a custom Bash script (`neon-ci.sh`) [to manage Neon database branches alongside Amplify app branches](https://github.com/siegerts/neon-branches-amplify-cicd/blob/main/neon-ci.sh). This script dynamically updates the .env file’s `DATABASE_URL` environment variable with the database connection string for each branch. This `.env` file is then loaded into the application’s server-side runtime as environment variables. To interact with the Postgres database in serverless or edge contexts, the Neon [Serverless Driver for JavaScript and TypeScript](https://neon.tech/blog/serverless-driver-for-postgres) can be used. Additionally, database migrations can be integrated into the CI/CD pipeline since the connection string is available in the build time environment.

![CI/CD flow with Neon Postgres and AWS Amplify Hosting](https://cdn.neonapi.io/public/images/pages/blog/fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching/diagram-2-1024x512-3d714910.png)

#### Here’s how the integration works

1. A new Git branch is created and pushed in a repo that is configured for fullstack continuous deployments in Amplify Hosting
2. During the CI/CD process, a new Neon Postgres branch will be created using the Neon CLI via a custom bash script
3. This branch’s connection string is injected into the `DATABASE_URL` parameter within a `.env` file.
4. The application is deployed and has access to the `DATABASE_URL` environment variable in server-side compute functions
5. Connect to your database using the Neon serverless driver

#### In order to set up this flow, you’ll need to complete the following steps

1. Set up your Amplify app and CI/CD pipeline as per your project requirements
2. Choose the **Amazon Linux: 2023** build image and enable automatic service role creation (if you are not using another role)
3. Copy the [neon-ci.sh script and amplify.yml](https://github.com/siegerts/neon-branches-amplify-cicd) build settings into the root of your app directory
4. Enable branch auto-detection for the app to create a new Amplify app branch for each new Git branch matching the configured pattern
5. Create a [Neon project and your Neon API key](https://console.neon.tech/signup)
6. Create an [SSM **SecureString** parameter](https://neon.tech/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale#create-a-databaseurl-parameter-in-ssm-parameter-store) for the Neon API key
7. Add the correct policy permissions to the Amplify app Service role for SSM Parameter Store and Amplify from the AWS CLI within the CI/CD build time
8. Modify `neon-ci.sh` invocation in your `amplify.yml` build settings with your specific Neon project ID, database name, and other parameters as needed
9. Push your changes and monitor the Amplify console for the deployment status – the Neon console will show the created branch(es)

### Configuring Amplify Hosting Build Settings

To set up build settings in Amplify Hosting, first connect your code repository to AWS Amplify Hosting to activate the CI/CD pipeline. Amplify supports GitHub, Bitbucket, GitLab, or AWS CodeCommit as source control providers.

#### Create an Amplify app

![Create an Amplify Hosting Gen 2 app](https://cdn.neonapi.io/public/images/pages/blog/fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching/creat-amplify-app-1024x433-1f0a6783.png)

#### Confirm the app settings

Choose the build image for your application (i.e. **Amazon Linux: 2023)** and enable automatic service role creation (if you are not using another role). This role will be updated to allow access to your Neon API key parameter in SSM Parameter Store.

![Amplify app build settings](https://cdn.neonapi.io/public/images/pages/blog/fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching/amplify-app-build-settings-1024x353-eec6e6a2.png)

### Update the Amplify Hosting Build Settings

The app build settings are configured in the Amplify Hosting console _or_ checked in as `amplify.yml` within your code repository.

This `amplify.yml` file defines the CI/CD pipeline configuration for AWS Amplify Hosting. It is split into backend and frontend stages, with specific commands executed at different phases (**preBuild**, **build**, and **postBuild**) for both the backend and frontend stages.

Customize the build process by [adjusting the amplify.yml file](https://github.com/siegerts/neon-branches-amplify-cicd/blob/main/amplify.yml), which controls the actions taken during the CI/CD pipeline stages for both frontend and backend components.

```yaml
version: 1
backend:
  phases:
    preBuild:
      commands:
        - sudo yum -y install jq
        - jq --version
        - npm i -g neonctl@latest
    build:
      commands:
        - nvm use 18
        - corepack enable
        - pnpm install
        - |
          if [ "${AWS_BRANCH}" = "main" ] || [ "${AWS_BRANCH}" = "dev" ]; then
            pnpm amplify pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
          else
            pnpm amplify generate config --branch main --app-id $AWS_APP_ID
          fi

          bash neon-ci.sh create-branch --app-id $AWS_APP_ID --neon-project-id <neon-project-id> --branch-name $AWS_BRANCH --parent-branch main --api-key-param "<ssm-param>" --role-name <neon-role> --database-name <neon-db-name> --suspend-timeout 0
  cache:
    paths:
      - $(pnpm store path)
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 18
        - corepack enable
        - npx --yes nypm i
    build:
      commands:
        - npm run build

  artifacts:
    baseDirectory: .amplify-hosting
    files:
      - "**/*"
```

Adjust as needed depending on your app framework requirements, and also make sure to update the `neon-ci.sh` input arguments. The following is a step-by-step breakdown of the sample `amplify.yml` set up:

**Backend:**

1. Pre-Build Phase:
   1. Installs [jq for JSON processing](https://jqlang.github.io/jq/)
   2. Installs the `neonctl` CLI tool globally using npm
2. Build Phase:
   1. Sets the Node version using nvm and enables corepack for package manager version management
   2. Based on the branch (main or dev), it deploys the backend Amplify app and then invokes the `neon-ci.sh` script to manage Neon database branches

**Frontend:**

1. Sets up Node, installs dependencies, and executes the build process for the frontend

**Cache Configuration:**

1. Caches the [pnpm](https://pnpm.io/) store path to enhance the speed of future builds

### Creating a new Postgres Database in Neon

Visit the Neon Console, sign up, and create your first project by following the prompts in the UI. Then, [create an API key](https://neon.tech/docs/manage/api-keys#create-an-api-key) for your Neon account. This key should be stored in SSM Parameter Store and accessed by your Amplify build scripts for authentication with Neon for database branching. Whether you’re working with an existing project or starting a new one, this project will host the database linked to your Amplify SSR app. When you create a new branch in the Amplify app, a corresponding database branch is automatically created in your specified Neon project.

![Get started with Neon Postgres](https://cdn.neonapi.io/public/images/pages/blog/fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching/get-started-with-neon-1024x789-d8b0c6a9.png)

### Add the Neon CI bash script

Include the [Neon bash CI script](https://github.com/siegerts/neon-branches-amplify-cicd/blob/main/neon-ci.sh) in your application directory. This will be referenced during the backend build stage of the CI/CD pipeline. This script can be modified, if needed, to account for your specific use case but the primary function is to create a branch for each Amplify app branch and retrieve the connection string.

The script has the following commands and options:

```bash
./neon-ci.sh <command> [options]

Commands
create-branch:
    Creates a new Neon database branch.

options:
    --app-id <app-id>
    --neon-project-id <project-id>
    --parent-branch-id <parent-branch-id>
    --api-key-param <api-key-param>
    --role-name <role-name>
    --database-name <database-name>
    --suspend-timeout <suspend-timeout>

cleanup-branches:
    Cleans up Neon database branches that no longer
    have corresponding Amplify app branches.

options:
    --app-id <app-id>
    --neon-project-id <project-id>
    --api-key-param <api-key-param>
```

These commands, specifically `create-branch`, are used during the backend **build** phase of the CI/CD process.

### Update the Amplify Hosting app backend build role with the correct policy statements

Update the Amplify Hosting backend build role with the policies below to allow access to SSM Parameter Store and Amplify using the AWS CLI within the CI/CD build environment. The `neon-ci` bash script calls out to SSM and Amplify which will require the service role to have the correct permissions to access.

An example of this from the bash script:

```bash
# neon-ci.sh
...

function set_neon_api_key {
    export NEON_API_KEY=$(aws ssm get-parameter --name $NEON_API_KEY_PARAM --with-decryption --query Parameter.Value --output text)
    if [[ -z "${NEON_API_KEY}" ]]; then
        echo "ERROR: NEON_API_KEY is not set. Exiting."
        exit 1
    fi
}

...
```

To update the role, add the below inline policies to the Amplify app backend build role in AWS Identity and Access Management (IAM). Scope these resources as required by your app.

### For SSM Parameter Store

```bash
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAmplifySSMCalls",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParametersByPath",
        "ssm:GetParameters",
        "ssm:GetParameter"
      ],
      "Resource": ["arn:aws:ssm:*:*:parameter/<name-of-your-parameter>"]
    }
  ]
}
```

### For AWS Amplify access

```bash
[object Object]
```

### Enable branch auto-detection for the app to create a new Amplify app branch

Update the applications repository settings to [enable branch auto-detection](https://docs.aws.amazon.com/amplify/latest/userguide/pattern-based-feature-branch-deployments.html). Once enabled, a new app branch will automatically create new Amplify app branches when a new Git branch is created and pushed to the repo.

![Branch auto detection in Amplify Hosting](https://cdn.neonapi.io/public/images/pages/blog/fullstack-serverless-ci-cd-in-aws-amplify-hosting-with-postgres-database-branching/branch-auto-detection-1024x402-f24606b0.png)

## Post build database branch clean up

If you want to automate database branch cleanup after each build, then you can include logic to use the clean up branches function in the Neon CI bash script. The `cleanup-branches` function will pull all of your Amplify Hosting app branch references with the aws cli and then compare those with the branch names in your Neon project.

_**Note:** Make sure to test any destructive branch actions on test apps and branches first before deploying to production CI/CD pipelines._

```yaml
 ...

postBuild:
        commands:
          - # EXAMPLE: only run the cleanup-branches command if you have tested
          - |
            if ! [ "${AWS_BRANCH}" = "main" ] && ! [ "${AWS_BRANCH}" = "dev" ]; then
              # bash neon-ci.sh cleanup-branches --app-id $AWS_APP_ID --neon-project-id <neon-project-id> --api-key-param "<ssm-param>"
            fi

...
```

## Connecting to Postgres with Nuxt SSR Server Routes

Now, you can use the Neon Serverless Driver to connect to your database. For example, using Nuxt SSR in Amplify Hosting with [server routes](https://nuxt.com/docs/guide/directory-structure/server#server-routes), you can query your database branch using a similar pattern as below:

```javascript
// ./server/routes/api/shows.ts

import { neon } from "@neondatabase/serverless";
const { databaseUrl } = useRuntimeConfig();
const sql = neon(databaseUrl!);

export default defineEventHandler(async (event) => {

  const shows = await sql`SELECT * FROM netflix_shows limit 10`;

  return {
    shows,
  };
});
```

The environment variable is populated into Nuxt with `useRuntimeConfig()`.

```javascript
// nuxt.config.js

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    // The private keys which are only available within server-side
    databaseUrl: process.env.DATABASE_URL,

    // Keys within public, will be also exposed to the client-side
    public: {
      //
    },
  },
});
```

## Best Practices and Considerations

- Securely manage your Neon API key. Do not commit this key to git. Use a SSM Parameter Store SecureString to store and access your Neon API key securely within your build environment.
- Implement logging within your build scripts to track the creation and deletion of database branches. This will be useful for troubleshooting and auditing your CI/CD process.
- Integrate database migration scripts into your CI/CD pipeline to update the schema of your database branches automatically when necessary. [Drizzle](https://orm.drizzle.team/) and [Prisma](https://www.prisma.io/) can be integrated into your build process for this using the database branch connection string environment variable.

## Conclusion

Integrating Neon database branches with Amplify Hosting CI/CD provides a flexible way to automate environment isolation and database creation – in a truly serverless way.

To get started with incorporating Serverless Postgres into your Amplify Hosting SSR apps, [sign up and try Neon for free](https://console.neon.tech/signup). Follow us on [Twitter](https://twitter.com/neondatabase) and join us in [Discord](https://neon.tech/discord) to share your experiences, suggestions, and challenges.
