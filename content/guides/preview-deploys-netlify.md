---
title: Automate preview deployments with Netlify and Neon database branching
subtitle: Set up automated preview deployments with isolated database branches for every pull request using GitHub Actions, Netlify, and Lakebase Postgres
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2025-11-25T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

## Introduction

Before merging changes to a web application, you want to test them in an environment that closely mirrors production. This guide shows you how to create an automated workflow that:

- Creates a separate Neon database branch for each pull request
- Deploys a preview version of your application to Netlify
- Runs database migrations automatically
- Cleans up resources when the pull request is closed

By the end of this guide, every pull request in your repository will get its own isolated database branch and preview URL, so you can test changes without touching your production database.

> **Sample starter**:  
> You can try out (or fork) this complete starter: [rishi-raj-jain/preview-branches-with-netlify](https://github.com/rishi-raj-jain/preview-branches-with-netlify)

## Prerequisites

Before starting, make sure you have:

- A [GitHub](https://github.com) account
- A [Neon](https://console.neon.tech/signup) account with a project
- A [Netlify](https://netlify.com) account
- [Node.js](https://nodejs.org) 20.x or later installed locally
- Basic knowledge of Next.js, Prisma, and Git

## Architecture overview

The workflow consists of two main GitHub Actions:

1. **Deploy Preview**: triggered when a PR is opened or updated
   - Creates a new Neon database branch
   - Runs Prisma migrations on the new branch
   - Deploys the application to Netlify with the branch database URL
   - Comments on the PR with links to the preview deployment and database branch

2. **Cleanup Preview**: triggered when a PR is closed
   - Deletes the Neon database branch

## Create a Next.js project

Start by creating a new Next.js project with TypeScript:

```bash
npx create-next-app@latest preview-branches-netlify
cd preview-branches-netlify
```

When prompted, select the following options:

- Yes, use recommended defaults

## Set up Prisma

Install Prisma and initialize it:

```bash
npm install prisma @prisma/client
npx prisma init
```

This creates a `prisma` directory with a `schema.prisma` file. Update it with a simple schema:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Element {
  id           String @id @default(cuid())
  elementName  String
  atomicNumber Int    @unique
  symbol       String
}
```

> **Note**: We include `rhel-openssl` binary targets for Netlify's build environment.

## Create database migrations

Create your first migration:

```bash
npx prisma migrate dev --name initial_migration
```

This creates a migration file in `prisma/migrations/` and applies it to your local database.

## Create a seed file

Create a seed file at `prisma/seed.ts` to populate your database with initial data:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const elements = [
    { elementName: 'Hydrogen', atomicNumber: 1, symbol: 'H' },
    { elementName: 'Helium', atomicNumber: 2, symbol: 'He' },
    { elementName: 'Lithium', atomicNumber: 3, symbol: 'Li' },
  ];
  for (const element of elements) {
    await prisma.element.upsert({
      where: { atomicNumber: element.atomicNumber },
      update: {},
      create: element,
    });
  }
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Install `tsx` to run TypeScript files:

```bash
npm install --save-dev tsx
```

Update your `package.json` to include the necessary scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "setup": "prisma migrate dev && prisma db seed",
    "generate-migrate": "prisma generate && prisma migrate deploy"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Create a Prisma client instance

Create a file at `lib/prisma.ts` to instantiate the Prisma client:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        // when using a pooled database connection with prisma, you need to append`?pgbouncer=true` to the connection string.
        // This ensures proper connection pooling with Neon's database.
        url: `${process.env.DATABASE_URL}?pgbouncer=true&connect_timeout=10&pool_timeout=10`,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Build a simple UI

Update your `app/page.tsx` to display data from the database:

```tsx
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const elements = await prisma.element.findMany();
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Periodic Table Elements</h1>
        <div className="grid gap-4">
          {elements.map((element) => (
            <div
              key={element.id}
              className="rounded-lg border p-4 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="text-blue-600 text-3xl font-bold">{element.symbol}</div>
                <div>
                  <h2 className="text-xl font-semibold">{element.elementName}</h2>
                  <p className="text-gray-600">Atomic Number: {element.atomicNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

## Set up your Neon database

1. Go to the [Neon Console](https://console.neon.tech)
2. Create a new project or use an existing one
3. Click **Connect** in the Console nav and copy your connection strings. Use the pooled connection string for `DATABASE_URL` and the direct (unpooled) one for `DIRECT_URL`
4. Create a `.env` file in your project root:

```bash
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"
```

5. Run the setup script to apply migrations and seed data:

```bash
npm run setup
```

## Set up Netlify

1. Create a new site on [Netlify](https://app.netlify.com)
2. Connect it to your GitHub repository
3. **Disable automatic preview builds** in Netlify:
   - Go to **Site configuration** → **Build & deploy** → **Continuous deployment**
   - Under **Branches and deploy contexts**, click **Configure**
   - Set **Deploy previews** to **None**
   - Save changes

   > GitHub Actions will trigger the preview deployments instead, so each one gets the correct database URL.

4. Add environment variables for **Production only**:
   - Go to **Site configuration** → **Environment variables**
   - Add `DATABASE_URL` with your production database connection string
   - Add `DIRECT_URL` with your production direct connection string
   - Make sure both are set to **Production** context only

## Set Secrets for GitHub Actions

You'll need the following secrets for [GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets):

### Neon

1. **NEON_API_KEY**:
   - In the Neon Console, go to **Account settings** > **API keys** ([direct link](https://console.neon.tech/app/settings/api-keys))
   - Create a new API key
   - Copy the key and save it securely. It's only displayed once.

2. **NEON_PROJECT_ID**:
   - Go to your project in the Neon Console
   - Click **Settings** → **General**
   - Copy the **Project ID**

3. **NEON_DATABASE_NAME**:
   - Usually `neondb`, the default database name
   - You can find it in your connection string or in the Neon Console

4. **NEON_DATABASE_USERNAME**:
   - The Postgres role in your connection string (for example, `neondb_owner`)

### Netlify

1. **NETLIFY_AUTH_TOKEN**:
   - Go to [Netlify User Settings](https://app.netlify.com/user/applications#personal-access-tokens)
   - Under **Personal access tokens**, click **New access token**
   - Give it a descriptive name and copy the token

2. **NETLIFY_SITE_ID**:
   - Go to your Netlify site dashboard
   - Navigate to **Site configuration** → **General** → **Site information**
   - Copy the **Site ID**

## Create the GitHub Actions workflows

Create a `.github/workflows` directory in your project:

```bash
mkdir -p .github/workflows
```

### Deploy preview workflow

Create `.github/workflows/deploy-preview.yml`:

```yml
name: Deploy Preview

on: [pull_request]

env:
  NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
  NEON_PROJECT_ID: ${{ secrets.NEON_PROJECT_ID }}
  NEON_DATABASE_NAME: ${{ secrets.NEON_DATABASE_NAME }}
  NEON_DATABASE_USERNAME: ${{ secrets.NEON_DATABASE_USERNAME }}
  NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
  NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}

jobs:
  deploy-preview:
    permissions: write-all
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Get branch name
        id: branch-name
        uses: tj-actions/branch-names@v8

      - name: Create Neon Branch
        id: create-branch
        uses: neondatabase/create-branch-action@v5
        with:
          api_key: ${{ env.NEON_API_KEY }}
          project_id: ${{ env.NEON_PROJECT_ID }}
          database: ${{ env.NEON_DATABASE_NAME }}
          username: ${{ env.NEON_DATABASE_USERNAME }}
          branch_name: preview/pr-${{ github.event.number }}-${{ steps.branch-name.outputs.current_branch }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Migrations
        run: npm run generate-migrate
        env:
          DIRECT_URL: ${{ steps.create-branch.outputs.db_url }}
          DATABASE_URL: ${{ steps.create-branch.outputs.db_url_with_pooler }}

      - name: Install Netlify CLI
        run: npm install -g netlify-cli && netlify link --id ${{ env.NETLIFY_SITE_ID }} --auth ${{ env.NETLIFY_AUTH_TOKEN }}

      - name: Deploy Preview to Netlify with CLI
        id: deploy
        run: |
          # Pull down the environment variables for the deploy-preview context
          netlify env:list --context deploy-preview --plain >> .env

          # Add the database connection URLs to the .env file
          echo DIRECT_URL="${{ steps.create-branch.outputs.db_url }}" >> .env
          echo DATABASE_URL="${{ steps.create-branch.outputs.db_url_with_pooler }}" >> .env

          # Deploy the preview to Netlify
          netlify deploy --alias="pr-${{ github.event.number }}" --context=deploy-preview --json > netlify-deploy.json

          # Get the deploy URL from the netlify-deploy.json file
          DEPLOY_URL=$(cat netlify-deploy.json | jq -r '.deploy_url')

          # Export the deploy URL as an output for this step
          echo "deploy_url=$DEPLOY_URL" >> "$GITHUB_OUTPUT"

      - name: Comment on Pull Request
        uses: thollander/actions-comment-pull-request@v2
        with:
          message: |
            | Resource | Link |
            |----------|------|
            | Netlify Preview 🚀 | ${{ steps.deploy.outputs.deploy_url }} |
            | Neon branch 🐘 | https://console.neon.tech/app/projects/${{ env.NEON_PROJECT_ID }}/branches/${{ steps.create-branch.outputs.branch_id }} |
```

This workflow creates a Neon database branch and a Netlify preview deploy for every pull request. It then posts links to both on the PR.

### Cleanup preview workflow

Create `.github/workflows/cleanup-preview.yml`:

```yml
name: Delete Preview Branch on Neon

on:
  pull_request:
    types: [closed]

env:
  NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
  NEON_PROJECT_ID: ${{ secrets.NEON_PROJECT_ID }}

jobs:
  delete-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: oven-sh/setup-bun@v2

      - name: Delete Neon Branch
        run: bunx neon branches delete preview/pr-${{ github.event.number }}-${{ github.event.pull_request.head.ref }} --project-id ${{ vars.NEON_PROJECT_ID }}
        env:
          api_key: ${{ env.NEON_API_KEY }}
```

This workflow deletes the preview branch when the pull request is closed, so branches don't pile up in your project.

## Test the workflow

To see the workflow in action, open a pull request that edits any file (even a markdown file) in your repository. The GitHub Actions workflow will:

- Create a new Neon database branch for your PR
- Deploy your app to a Netlify preview URL, connected to the new database branch
- Post a comment on the PR with links to both the preview deployment and the Neon branch

For a real-world example, see this sample PR and its corresponding workflow run:

- **Sample PR**: [rishi-raj-jain/preview-branches-with-netlify#32](https://github.com/rishi-raj-jain/preview-branches-with-netlify/pull/32)
- **Automated comment** (with preview and Neon links): [View the GitHub Comment](https://github.com/rishi-raj-jain/preview-branches-with-netlify/pull/32#issuecomment-3575723043)
- **Branch deletion workflow**: https://github.com/rishi-raj-jain/preview-branches-with-netlify/actions/runs/19671544817

The sample PR only edits a file. The workflow created the database branch, deployed the Netlify preview, and posted the comment on its own.

## Conclusion

You've set up a workflow that gives every pull request its own Neon database branch and Netlify preview, and deletes the branch when the PR closes. To go further, see [Automate branching with GitHub Actions](/docs/guides/branching-github-actions).
