---
title: Automate Database Branching with Alchemy and Neon Postgres
subtitle: Learn how to use Alchemy Infrastructure-as-Code to programmatically create and manage Neon database branches
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-05-10T00:00:00.000Z'
updatedOn: '2025-05-10T00:00:00.000Z'
---

Database branching is one of Neon's most powerful features, letting you create isolated database copies in seconds.

[Alchemy](https://github.com/sam-goodwin/alchemy) is a TypeScript-native Infrastructure-as-Code tool that lets you automate cloud resources with simple async functions. Unlike traditional IaC tools like Terraform that require learning new languages and complex state management, Alchemy lets you manage infrastructure using the TypeScript you already know.

In this guide, you'll learn how to use Alchemy to automatically create, manage, and clean up Neon database branches as part of your development workflow. Think of it as "Git for your database infrastructure", you'll define what branches you want in code, and Alchemy will make sure they exist.

## Prerequisites

To follow along with this guide, you'll need:

- [Node.js 20](https://nodejs.org/) or later installed
- A [Neon account](https://console.neon.tech/signup) with a project
- A [Neon API key](/docs/manage/api-keys) (you'll need this to manage branches programmatically)
- Basic familiarity with TypeScript and REST APIs

## What you'll build

By the end of this guide, you'll have:

- Learn what Alchemy is and how it differs from traditional Infrastructure-as-Code tools
- Create custom Alchemy resources for managing Neon branches
- Automated branch creation for feature development
- Branch cleanup when features are merged

## Understanding Alchemy basics

Before we dive into the implementation, let's understand what makes Alchemy different from traditional Infrastructure-as-Code tools and why it's particularly well-suited for managing Neon database branches.

### What is Alchemy?

Traditional IaC tools like Terraform require you to learn new languages and manage complex state files. Alchemy takes a different approach: you write regular TypeScript functions that describe your infrastructure.

Here's how a typical resource looks in Alchemy:

```typescript
const MyResource = Resource('my::Resource', async function (id, props) {
  if (this.phase === 'delete') {
    // Clean up the resource
    await deleteFromAPI(this.state.resourceId);
    return this.destroy();
  }

  // Create or update the resource
  const result = await createOrUpdateAPI(props);
  return { ...props, resourceId: result.id };
});
```

This function handles the entire lifecycle of a resource. When you run your code, Alchemy calls this function for each resource you've defined, automatically handling creation, updates, and deletion.

### Declarative with imperative code

Even though you write regular functions, the end result is declarative. You define what you want, and Alchemy figures out how to get there:

```typescript
// Define what infrastructure you want
const app = await alchemy('my-app');

const database = await Database('prod-db', {
  name: 'production',
  size: 'large',
});

const testDb = await Database('test-db', {
  name: 'testing',
  size: 'small',
});

await app.finalize();
```

If you run this code twice, Alchemy won't create duplicate resources. If you remove the `testDb` and run again, Alchemy will automatically delete it. This automatic cleanup is what makes Alchemy particularly powerful for managing database branches.

### Why this works well for database branching

Database branches often need dynamic configuration based on feature names, environments, or developer preferences. With Alchemy, you can use regular programming constructs:

```typescript
// Create branches for active pull requests
const pullRequests = await github.getPullRequests();

for (const pr of pullRequests) {
  await NeonBranch(`pr-${pr.number}`, {
    name: `pr-${pr.number}-${pr.title.toLowerCase().replace(/\s+/g, '-')}`,
    parentBranch: pr.targetBranch === 'main' ? 'production' : 'staging',
  });
}
```

When pull requests are merged or closed, the corresponding branches get cleaned up automatically on the next run.

## Security and Encryption with Alchemy

Before we dive into building our Neon branch automation, it's crucial to understand how Alchemy handles sensitive data like API keys and connection strings.

### Why Secret Management Matters

When working with database infrastructure, you'll be dealing with sensitive information like:

- Neon API keys
- Database connection strings
- Authentication credentials

Without proper handling, these values would be stored as plain text in Alchemy's state files, creating a security risk.

### How Alchemy Secrets Work

Alchemy provides built-in encryption for sensitive data through the `alchemy.secret()` function. When you wrap a value with this function, Alchemy automatically encrypts it before storing it in state files.

Here's what happens behind the scenes:

- **Plain text in code**: `alchemy.secret(process.env.API_KEY)`
- **Encrypted in state**: `{"@secret": "Tgz3e/WAscu4U1oanm5S4YXH..."}`

### Encryption Password

Secrets are encrypted using a password that you provide when initializing your Alchemy app. This password is used to encrypt and decrypt all secret values in your application.

**Important**: Always store your encryption password securely and never commit it to source control.

```typescript
const app = await alchemy('my-app', {
  password: process.env.ENCRYPTION_PASSWORD,
});
```

We'll see how to implement this properly in the next section.

## Setting up your project

Let's start by creating a new project and installing the necessary dependencies. We'll build this step by step so you can see exactly how everything fits together.

First, create a new directory for our project. This will be a standalone project that you can later integrate into your existing applications:

```bash
mkdir neon-alchemy-demo
cd neon-alchemy-demo
npm init -y
```

The `npm init -y` command creates a basic `package.json` file with default settings. You'll see it creates a simple Node.js project structure.

Next, let's install all the dependencies we'll need. Alchemy is designed to work seamlessly with TypeScript, so we'll use TypeScript throughout this guide:

```bash
npm install alchemy dotenv
npm install --save-dev typescript @types/node tsx
```

After running this, you'll have Alchemy installed along with TypeScript support and the tools we need to run our code. Alchemy itself has zero dependencies, which means it won't bloat your project or conflict with other tools you're using.

Now let's configure our project for TypeScript and ESM modules. First, update your `package.json` to define the module type and add a start script:

```json
{
  "type": "module",
  "scripts": {
    "start": "tsx main.ts"
  }
}
```

This tells Node.js to treat your project as an ESM module, which is required for Alchemy to work properly. The `tsx` package allows you to run TypeScript files directly without needing to compile them first.

Create a `tsconfig.json` file that tells TypeScript how to compile our code:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

This configuration sets up modern TypeScript with ESM modules, which Alchemy requires. The settings ensure compatibility with Alchemy's async-native design.

Finally, we need to store our credentials securely. Create a `.env` file in your project root:

```bash
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_project_id_here
ENCRYPTION_PASSWORD=your_strong_encryption_password_here
```

Replace the values with:

- `your_neon_api_key_here`: Your actual Neon API key
- `your_project_id_here`: Your project ID from the Neon Console
- `your_strong_encryption_password_here`: A strong password for encrypting secrets (generate this securely)

> **Security note**: The `ENCRYPTION_PASSWORD` is used by Alchemy to encrypt sensitive data like API keys and connection strings. Choose a strong, unique password and store it securely. Never commit this to source control.

## Creating a Neon Branch resource

Here's where Alchemy gets really handy. Alchemy resources are just async functions that create, update, or delete cloud resources. We're going to create a custom resource that knows how to manage Neon branches through the Neon API.

Think of this resource as a "blueprint" that Alchemy can use to create as many Neon branches as you need. Once we write this code, we can reuse it throughout our application.

Create a file called `neon-branch.ts`:

```typescript
import alchemy, { Resource } from 'alchemy';

interface NeonBranchProps {
  name: string;
  projectId: string;
  parentBranchId?: string;
  apiKey: ReturnType<typeof alchemy.secret>;
}

interface NeonBranchState extends Omit<NeonBranchProps, 'apiKey'> {
  branchId: string;
  connectionString: ReturnType<typeof alchemy.secret>;
  createdAt: string;
  apiKey: ReturnType<typeof alchemy.secret>;
}

export const NeonBranch = Resource<NeonBranchState, NeonBranchProps>(
  'neon::Branch',
  async function (id: string, props: NeonBranchProps) {
    const { name, projectId, parentBranchId, apiKey } = props;

    if (this.phase === 'delete') {
      const branchId = this.state?.branchId ?? (this.output as any)?.branchId;

      if (branchId) {
        try {
          const deleteResponse = await fetch(
            `https://console.neon.tech/api/v2/projects/${projectId}/branches/${branchId}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!deleteResponse.ok) {
            console.warn(`Failed to delete branch: ${deleteResponse.statusText}`);
          }
        } catch (err) {
          console.warn(`Error during branch deletion: ${(err as Error).message}`);
        }
      } else {
        console.warn('No branchId found in state or output; skipping deletion.');
      }

      return this.destroy();
    }

    // Check if branch already exists
    if (this.state?.branchId) {
      // Branch exists, return current state
      return this.state;
    }

    // Create a new branch
    const createBranchResponse = await fetch(
      `https://console.neon.tech/api/v2/projects/${projectId}/branches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          parent_id: parentBranchId,
        }),
      }
    );

    if (!createBranchResponse.ok) {
      const errorText = await createBranchResponse.text();
      throw new Error(
        `Failed to create branch: ${createBranchResponse.status} ${createBranchResponse.statusText} - ${errorText}`
      );
    }

    const branchResult = await createBranchResponse.json();
    const branch = branchResult.branch;

    // Get the project's main endpoint to build connection string
    const endpointsResponse = await fetch(
      `https://console.neon.tech/api/v2/projects/${projectId}/endpoints`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!endpointsResponse.ok) {
      throw new Error(`Failed to get endpoints: ${endpointsResponse.statusText}`);
    }

    const endpointsResult = await endpointsResponse.json();

    // Use the primary endpoint (usually the first one or the one marked as primary)
    const primaryEndpoint =
      endpointsResult.endpoints.find((ep: any) => ep.branch_id === parentBranchId) ||
      endpointsResult.endpoints[0];

    if (!primaryEndpoint) {
      throw new Error('No endpoints found for project');
    }

    // Get project details to find the database name
    const projectResponse = await fetch(`https://console.neon.tech/api/v2/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!projectResponse.ok) {
      throw new Error(`Failed to get project details: ${projectResponse.statusText}`);
    }

    const projectResult = await projectResponse.json();
    const databaseName = 'neondb';

    const connectionString = `postgres://${primaryEndpoint.host}/${databaseName}?sslmode=require&channel_binding=require&options=project%3D${projectId}`;

    return {
      ...props,
      branchId: branch.id,
      // Encrypt the connection string
      connectionString: alchemy.secret(connectionString),
      createdAt: branch.created_at,
    };
  }
);
```

Let's break down what this code does:

- The interfaces define the shape of our data. `NeonBranchProps` is what you pass in (the branch name, project ID, etc.), and `NeonBranchState` is what gets stored (including the generated branch ID and connection string).
- The Resource function is where Alchemy manages the lifecycle. When Alchemy runs, it calls this function for each branch resource you've defined. The function checks what phase it's in:
  - Delete phase: If you've removed a branch from your code, Alchemy calls the Neon API to delete it
  - Create/Update phase: If the branch doesn't exist, it creates it. If it already exists, it returns the current state
- The API calls use the standard Neon REST API to create branches and get connection information. This is the same API you could call manually with curl, but now it's automated.
- Notice how we use `ReturnType<typeof alchemy.secret>` to type sensitive values like API keys and connection strings. This ensures they're properly encrypted when stored in Alchemy's state files. When we create the connection string, we wrap it with `alchemy.secret()` to encrypt it before storage.

The great thing about this approach is that you define the resource once, and then Alchemy handles all the complexity of tracking state, making API calls, and cleaning up resources while keeping your sensitive data secure.

## Using the Neon Branch resource

Now let's put our resource to work. We'll create a simple script that demonstrates how to use it. This script will create a couple of branches and show you how Alchemy manages them.

Create a file called `main.ts`:

```typescript
import alchemy from 'alchemy';
import { NeonBranch } from './neon-branch.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Alchemy with encryption password
const app = await alchemy('neon-demo', {
  password: process.env.ENCRYPTION_PASSWORD!,
});

// Create secrets from environment variables
const apiKey = alchemy.secret(process.env.NEON_API_KEY!);

// Create a feature branch
const featureBranch = await NeonBranch('feature-auth-system', {
  name: 'feature/auth-system',
  projectId: process.env.NEON_PROJECT_ID!,
  apiKey: apiKey,
});

console.log('Feature branch created!');
console.log('Branch ID:', featureBranch.branchId);
// Note: Connection string is encrypted, so we can't log it directly
console.log('Connection string: [encrypted]');

// Create a testing branch from the feature branch
const testingBranch = await NeonBranch('testing-auth-system', {
  name: 'test/auth-system',
  projectId: process.env.NEON_PROJECT_ID!,
  parentBranchId: featureBranch.branchId,
  apiKey: apiKey,
});

console.log('Testing branch created!');
console.log('Testing branch ID:', testingBranch.branchId);

await app.finalize();
```

Here's what this script does step by step:

- First, we initialize an Alchemy app with the name 'neon-demo' and provide an encryption password. This creates a local state file where Alchemy tracks what resources exist and encrypts sensitive data.
- Next, we create a secret from our Neon API key using `alchemy.secret()`, ensuring it's encrypted before being passed to resources.
- Then, we create a feature branch using our `NeonBranch` resource. The first parameter (`'feature-auth-system'`) is a unique ID that Alchemy uses to track this specific branch. The second parameter contains the branch configuration.
- We create a testing branch that branches off from our feature branch. Notice how we pass `featureBranch.branchId` as the `parentBranchId` - this creates a branch hierarchy just like you'd have with git branches.
- Finally, we call `app.finalize()` to tell Alchemy we're done. This is when Alchemy checks if there are any resources that need to be cleaned up.

The connection strings returned by our resource are encrypted secrets. In a real application, you'd decrypt them when needed using Alchemy's mechanisms.

Let's run this script and see it in action. Make sure you have your Neon API key and project ID set in your environment variables, then run:

```bash
npx tsx main.ts
```

When you run this command, you should see output similar to:

```
Feature branch created!
Branch ID: br_cool_darkness_12345
Connection string: [encrypted]
Testing branch created!
Testing branch ID: br_wispy_cloud_67890
```

If you check your Neon Console now, you'll see two new branches have appeared in your project. The connection strings are stored securely in Alchemy's encrypted state, but can be used by your application when needed.

## Automating branch cleanup

Here's where Alchemy really can help compared to manual branch management. With Alchemy, cleanup is automatic. When you remove a resource from your code, Alchemy automatically deletes it on the next run. Let's see this in action with a more practical example.

Create a file called `feature-workflow.ts`:

```typescript
import alchemy from 'alchemy';
import { NeonBranch } from './neon-branch.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize with encryption password
const app = await alchemy('feature-workflow', {
  password: process.env.ENCRYPTION_PASSWORD!,
});

// Create encrypted API key
const apiKey = alchemy.secret(process.env.NEON_API_KEY!);

// Simulate different features being worked on
const activeFeatures = [
  'user-authentication',
  'payment-integration',
  // 'email-notifications', // Simulate a completed feature by commenting this out
];

// Create branches for active features
for (const feature of activeFeatures) {
  const branch = await NeonBranch(`feature-${feature}`, {
    name: `feature/${feature}`,
    projectId: process.env.NEON_PROJECT_ID!,
    apiKey: apiKey,
  });

  console.log(`Branch created for ${feature}: ${branch.branchId}`);
}

await app.finalize();
```

This script simulates a development workflow where you have multiple features being worked on simultaneously. Notice the commented-out line for 'email-notifications' - this represents a feature that was completed and merged in our fictitious project.

Here's what happens when you run this script:

- First run: Alchemy creates branches for `user-authentication` and `payment-integration`. If the `email-notifications` branch existed from a previous run, it gets deleted because it's no longer in the active features list.

- Subsequent runs: If you add new features to the array, Alchemy creates branches for them. If you remove features (like commenting out lines), Alchemy automatically deletes the corresponding branches.

Run the script to see this in action:

```bash
npx tsx feature-workflow.ts
```

You'll see output showing which branches were created. If you run it again, the existing branches won't be recreated (Alchemy is smart about this), but any branches that are no longer defined in your code will be deleted.

This automatic cleanup means you never have to remember to delete old branches manually. Your database infrastructure stays clean, and you only pay for what you're actually using.

## Troubleshooting

While using Alchemy, you might encounter some common issues. Here are some tips to help you troubleshoot:

### Authentication errors

If you see errors about authentication or permissions, first test your API key manually to make sure it works:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://console.neon.tech/api/v2/projects
```

Replace `YOUR_API_KEY` with your actual API key. If this doesn't return a list of your projects, the problem is with your API key. Make sure you created it correctly and that it has the right permissions.

### Rate limiting

Most APIs have rate limits to prevent abuse. For example, if you're creating many branches quickly, you might hit these limits. You can add small delays between branch creations to avoid this:

```typescript
// Add a small delay between branch creations
for (const feature of features) {
  await NeonBranch(`feature-${feature}`, {
    /* ... */
  });

  // Wait 1 second before creating the next branch
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
```

This is usually only necessary if you're creating a large number of resources in a short time. For normal development workflows, you shouldn't run into this issue.

### Branch name conflicts

Neon branch names must be unique within a project. If you get errors about duplicate names, you can use prefixes or timestamps to make them unique:

```typescript
const uniqueName = `feature-${Date.now()}-${featureName}`;
```

Or use a more readable format:

```typescript
const uniqueName = `feature-${featureName}-${new Date().toISOString().split('T')[0]}`;
```

### State file issues

Alchemy stores its state in a local file (usually `.alchemy/state.json`). If this file gets corrupted or deleted, Alchemy might lose track of your resources. You can usually fix this by:

1. Deleting the `.alchemy` directory
2. Running your script again (Alchemy will detect existing resources)

Or by manually cleaning up resources in the Neon Console and starting fresh.

## Summary

You've learned how to use Alchemy to automate Neon database branching with proper security practices.

The combination of Alchemy's simple TypeScript approach and Neon's branching makes database infrastructure management almost invisible. You focus on building features, and the database branches you need just exist.

<NeedHelp />
