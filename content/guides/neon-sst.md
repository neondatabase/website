---
title: Manage Neon with SST
subtitle: Use SST to provision Neon resources and build a serverless API with a Neon Postgres database.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-10-10T00:00:00.000Z'
updatedOn: '2025-10-10T00:00:00.000Z'
---

[SST](https://sst.dev/) is an open-source framework that simplifies building full-stack applications on your own infrastructure. By integrating Neon with SST, you can automate, version-control, and streamline your database provisioning workflows alongside your serverless applications.

In this guide, you’ll learn how to use SST to provision and manage Neon resources, then connect them to an [Hono](https://hono.dev/) API running on AWS Lambda.

This integration is powered by SST's support for over 150 Pulumi and Terraform providers - in this guide, we’ll be using the Pulumi provider for Neon.

## Prerequisites

Before you start, ensure you have the following:

1.  **Node.js**: This guide uses Node.js. If you don't have it installed, download it from [nodejs.org](https://nodejs.org/).
2.  **Neon Account:** You'll need a Neon account. If you don't have one, sign up [here](https://console.neon.tech/signup).
3.  **Neon API key**: Generate an API key from the Neon Console by navigating to your Account Settings > API Keys. This key is necessary for the provider to authenticate with the Neon API.
4.  **AWS Account**: An AWS account is required to deploy the Hono API to AWS Lambda. If you don't have one, you can create it at [aws.amazon.com](https://aws.amazon.com/).

## Create a new SST app

Run the following command to create a new SST app without any boilerplate:

```bash
npm init -y
npx sst@latest init
npm install
```

You should see the following output:

```bash
$ npm init -y
$ npx sst@latest init

   ███████╗███████╗████████╗
   ██╔════╝██╔════╝╚══██╔══╝
   ███████╗███████╗   ██║
   ╚════██║╚════██║   ██║
   ███████║███████║   ██║
   ╚══════╝╚══════╝   ╚═╝

>  JS project detected. This will...
   - use the JS template
   - create an sst.config.ts

✓  Template: js

✓  Using: aws

✓  Done 🎉
```

> Choose `aws` for the cloud provider when prompted.

## Set up the Neon provider in SST

1.  **Add the Neon provider**

    To add the Neon provider to your SST app, run the following command in your project's root directory:

    ```bash
    npx sst add neon
    ```

    This command updates your `sst.config.ts` to include the Neon provider, installs the necessary packages, and makes the `neon` namespace globally available in your configuration.

2.  **Configure authentication and organization ID**

    The Neon provider requires your API key for authentication. The recommended approach is to set it as an environment variable. You will also need your organization ID, which can be found in the Neon Console under Account Settings > Organization.
    ![finding your organization ID from the settings page](/docs/manage/orgs_id.png)

    Create a `.env` file in your project's root directory and add your Neon API key and organization ID:

    ```bash title=".env"
    NEON_API_KEY="<YOUR_NEON_API_KEY>"
    NEON_ORG_ID="<YOUR_ORG_ID>"
    ```

    SST automatically loads `.env` files, making the variables available in your configuration.

## Manage Neon resources

You can define your Neon resources directly within the `run` function of your `sst.config.ts` file. This example demonstrates creating a complete Neon stack, including a project, a development branch, an endpoint, a role, and a database.

```typescript title="sst.config.ts"
/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'sst-demo',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: { neon: '0.9.0' },
    };
  },
  async run() {
    // 1. Manage a Project
    const myAppProject = new neon.Project('MyAppProject', {
      name: 'my-application-project',
      pgVersion: 17,
      regionId: 'aws-us-east-1',
      orgId: process.env.NEON_ORG_ID!,
      historyRetentionSeconds: 21600,
    });

    // 2. Manage a Branch
    const devBranch = new neon.Branch('DevBranch', {
      projectId: myAppProject.id,
      name: 'feature-x-development',
    });

    // 3. Manage an Endpoint
    const devEndpoint = new neon.Endpoint('DevEndpoint', {
      projectId: myAppProject.id,
      branchId: devBranch.id,
      type: 'read_write',
    });

    // 4. Manage a Role
    const appUser = new neon.Role('AppUser', {
      projectId: myAppProject.id,
      branchId: devEndpoint.branchId,
      name: 'application_user',
    });

    // 5. Manage a Database
    const serviceDb = new neon.Database('ServiceDb', {
      projectId: myAppProject.id,
      branchId: devEndpoint.branchId,
      name: 'service_database',
      ownerName: appUser.name,
    });
  },
});
```

After defining your resources in `sst.config.ts`, you can deploy them to your Neon account.

## Deploying Neon resources

To provision the Neon project, branch, endpoint, role, and database, run the `npx sst deploy` command from your terminal. You should see an output similar to this:

```bash
$ npx sst deploy
SST 3.17.14  ready!

➜  App:        sst-demo
   Stage:      dhanush

~  Deploy

|  Created     MyAppProject neon:index:Project (5.7s)
|  Created     DevBranch neon:index:Branch
|  Created     DevEndpoint neon:index:Endpoint (1.1s)
|  Created     AppUser neon:index:Role
|  Created     ServiceDb neon:index:Database (1.5s)

↗  Permalink   https://sst.dev/u/710fa960

✓  Complete
```

After the deployment completes, you can visit your [Neon Console](https://console.neon.tech/) to see the newly created project and its associated resources.

Now that you have understood how to manage Neon resources with SST, let's explore how to connect these resources to a serverless API using **Resource Linking**.

## Example: Building an API with SST and Neon

A key feature of SST is [Resource Linking](https://sst.dev/docs/linking/), which allows your application code to securely access infrastructure resources in a typesafe manner. In this example, we’ll build a simple API using [Hono](https://hono.dev/) that connects to a Neon Postgres database. The connection string for the database will be securely passed to the API using resource linking.

The Hono API will be deployed to AWS Lambda, and we’ll use SST to manage both the Neon database and the API.

<Admonition type="important" title="Configure AWS credentials">
Make sure you have an AWS account and have configured your AWS IAM credentials. You can follow the instructions on [SST: IAM Credentials](https://sst.dev/docs/iam-credentials/) to set this up.
</Admonition>

## Create the API project

Create a new directory for your project and initialize a new Hono app using the AWS Lambda template:

```bash
npm create hono@latest aws-hono
cd aws-hono
npx sst add neon
```

> Pick the `aws-lambda` template when prompted.

You should see the following output:

```bash
$ npm create hono@latest aws-hono
$ cd aws-hono

> npx
> create-hono aws-hono

create-hono version 0.19.2
✔ Using target directory … aws-hono
✔ Which template do you want to use? aws-lambda
✔ Do you want to install project dependencies? Yes
✔ Which package manager do you want to use? npm
✔ Cloning the template
✔ Installing project dependencies
🎉 Copied project files
```

### Initialize SST

Initialize SST in your project directory and add the Neon provider:

```bash
npx sst@latest init
npx sst add neon
```

### Configure authentication and organization ID

Create a `.env` file in your project's root directory and add your Neon API key and organization ID:

```bash title=".env"
NEON_API_KEY="<YOUR_NEON_API_KEY>"
NEON_ORG_ID="<YOUR_NEON_ORG_ID>"
```

### Define the resources

Add the following code to your `sst.config.ts` file. This code creates a Neon project and makes the connection string available to the API using resource linking.

```typescript title="sst.config.ts"
/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'aws-hono',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: { neon: '0.9.0' },
    };
  },
  async run() {
    // Create the Neon project
    const myAppProject = new neon.Project('MyAppProject', {
      name: 'my-sst-project',
      pgVersion: 17,
      regionId: 'aws-us-east-1',
      orgId: process.env.NEON_ORG_ID!,
      historyRetentionSeconds: 21600,
    });

    // Make the connection string linkable
    const db = new sst.Linkable('NeonDB', {
      properties: {
        connectionString: myAppProject.connectionUri,
      },
    });

    // Create and link the API
    new sst.aws.Function('MyApi', {
      handler: 'src/index.handler',
      link: [db],
      url: true,
    });
  },
});
```

The above code does the following:

1.  Creates a Neon project named `my-sst-project`.
2.  Defines a linkable resource `NeonDB` that exposes the `connectionString` property from the Neon project.
3.  Creates an AWS Lambda function named `MyApi` using the handler defined in `src/index.ts`, and links it to the `NeonDB` resource. This makes the connection string available to the Lambda function.

### Install dependencies

To connect to the Neon database you can use any Postgres client. In this example, we’ll use the Neon serverless driver. Install it using `npm`:

```bash
npm install @neondatabase/serverless
```

### Update the API code

Replace the contents of `src/index.ts` with the following code. This code connects to the Neon database and responds with with postgres version.

```typescript title="src/index.ts"
import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { neon } from '@neondatabase/serverless';
import { Resource } from 'sst';

const sql = neon(Resource.NeonDB.connectionString);

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/version', async (c) => {
  const result = await sql`SELECT version()`;
  return c.json({ version: result[0].version });
});

export const handler = handle(app);
```

<Admonition type="tip">
Your editor might flag a TypeScript error for `Resource.NeonDB`. This is normal, as SST generates these types during its build process. The error will resolve automatically after you run `sst dev` or `sst deploy`.
</Admonition>

### Run the API locally

You can run the API locally using the SST live development environment:

```bash
npx sst dev
```

SST will deploy a development version of your stack and provide you with a local API endpoint. A Neon project will also be created in your Neon account.

You should see the following output:

```bash
SST 3.17.14  ready!

➜  App:        aws-hono
   Stage:      dhanush
   Console:    https://console.sst.dev/local/aws-hono/dhanush

~  Deploy

|  Created     MyApi sst:aws:Function → MyApiRole aws:iam:Role (2.5s)
|  Created     MyAppProject neon:index:Project (5.5s)
|  Created     MyApi sst:aws:Function → MyApiCode aws:s3:BucketObjectv2 (5.2s)
|  Created     MyApi sst:aws:Function → MyApiFunction aws:lambda:Function (8.0s)
|  Created     MyApi sst:aws:Function → MyApiUrl aws:lambda:FunctionUrl (1.2s)

↗  Permalink   https://sst.dev/u/05fb617c

✓  Complete
   MyApi: https://qntxxx.lambda-url.us-east-1.on.aws/
```

You can test the API endpoint using `curl` or by visiting the URL in your browser:

```bash
curl https://qntxxx.lambda-url.us-east-1.on.aws/version
```

You should see a response like this, confirming a successful connection to your Neon database:

```json
{
  "version": "PostgreSQL 17.5 (6bc9ef8) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14+deb12u1) 12.2.0, 64-bit"
}
```

You can also verify that a new project has been created in your [Neon Console](https://console.neon.tech/)

_The Typescript error for `Resource.NeonDB` should now be resolved._

### Deploy to Production

To deploy your application to AWS, run:

```bash
npx sst deploy
```

After the deployment is complete, SST will output the URL of your API endpoint. You can test it using `curl` or by visiting the URL in your browser.

```bash
$ npx sst deploy
SST 3.17.14  ready!

➜  App:        aws-hono
   Stage:      dhanush

~  Deploy

|  Created     MyApi sst:aws:Function → MyApiCode aws:s3:BucketObjectv2 (1.5s)
|  Created     MyApi sst:aws:Function → MyApiSourcemap0 aws:s3:BucketObjectv2 (2.4s)
|  Updated     MyApi sst:aws:Function → MyApiFunction aws:lambda:Function (12.7s)
|  Deleted     MyApi sst:aws:Function → MyApiCode aws:s3:BucketObjectv2

↗  Permalink   https://sst.dev/u/ec9dd207

✓  Complete
   MyApi: https://qn2gxx.lambda-url.us-east-1.on.aws/
```

```bash
curl https://qn2gxx.lambda-url.us-east-1.on.aws/version
```

You should see the same response as before, confirming that your production deployment is working correctly and successfully connected to your Neon database.

You have now successfully provisioned a Neon database and connected it to a serverless API using SST! You can continue to evolve your application by modifying your infrastructure in `sst.config.ts` or updating your API logic in `src/index.ts` as needed.

## Import existing Neon resources

If you have existing Neon resources, you can bring them under SST's management using the `import` option. This allows SST to manage their state moving forward.

**Add the `import` option to your resource definition**

For example, to import an existing Neon project, you would use its ID.

```ts title="sst.config.ts"
const myAppProject = new neon.Project(
  'MyAppProject',
  {
    orgId: process.env.NEON_ORG_ID!,
  },
  {
    import: 'project-id-from-neon-console',
  }
);
```

Similarly, you can import other resources like branches, endpoints, roles, and databases by providing their respective IDs.

## Resources

- [SST Documentation](https://sst.dev/docs/)
- [SST Resource Linking](https://sst.dev/docs/linking/)
- [Pulumi Neon Provider](https://www.pulumi.com/registry/packages/neon/)
- [Manage Neon with Terraform](/docs/reference/terraform)
- [Hono on AWS with SST](https://sst.dev/docs/start/aws/hono/)

<NeedHelp/>
