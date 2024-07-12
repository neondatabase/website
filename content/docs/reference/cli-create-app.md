---
title: Neon CLI commands — create-app
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-07-12T11:16:39.827Z'
---

## Before you begin

- Before running the `create-app` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `create-app` command

The `create-app` command initializes a new Neon project and bootstraps a full-stack application using your preferred package manager. The command supports the following stack components:

- **Package Manager**: Choose from `npm`, `pnpm`, and `bun`
- **Frameworks**: `Next.js` (`SvelteKit` and `Nuxt.js` coming soon)
- **ORM**: `Drizzle` (`Prisma` coming soon)
- **Authentication Framework**: `Auth.js`
- **Deployment Platform**: Choose from `Vercel` and `Cloudflare`

Once deployed, the starter app is ready for you to begin building.

![neonctl create-app page-tsx](/docs/reference/neon-create-app.png)

### Usage

```bash
neon create-app
```

### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

### Example

This example shows how the `neon create-app` command bootstraps a full-stack application including a Neon project.

```bash
neon create-app
✔ What is your project named? … my-new-app
✔ Which package manager would you like to use? › npm
✔ What framework would you like to use? › Next.js
✔ What ORM would you like to use? › Drizzle
✔ What authentication framework do you want to use? › Auth.js
✔ What Neon project would you like to use? › Create a new Neon project
Project
┌──────────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                   │ Name          │ Region Id     │ Created At           │
├──────────────────────┼───────────────┼───────────────┼──────────────────────┤
│ sunny-river-12536349 │ my-new-app-db │ aws-us-east-2 │ 2024-07-12T16:20:07Z │
└──────────────────────┴───────────────┴───────────────┴──────────────────────┘
Connection URIs
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ postgresql://neondb_owner:aCEtseiHO72I@ep-empty-fog-a518x4q3.us-east-2.aws.neon.tech/neondb?sslmode=require │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
Need to install the following packages:
create-next-app@14.2.4
Ok to proceed? (y)

Creating a new Next.js app in /Users/dprice/my-app.

Downloading files from repo https://github.com/neondatabase/neonctl-create-app-templates/tree/main/next-drizzle-authjs. This might take a moment.

Installing packages. This might take a couple of minutes.

added 400 packages, and audited 401 packages in 34s

144 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Initialized a git repository.

Success! Created my-new-app at /Users/user_name/my-new-app
Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd my-new-app
  npm run dev

A new version of `create-next-app` is available!
You can update by running: npm i -g create-next-app

Created a Next.js project in my-new-app.

You can now run cd my-new-app && npm run dev
> barebones-app@0.1.0 db:generate
> drizzle-kit generate --name init_db

drizzle-kit: v0.22.8
drizzle-orm: v0.31.4

No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/user_name/my-new-app/drizzle.config.ts'
6 tables
accounts 11 columns 0 indexes 1 fks
authenticators 8 columns 0 indexes 1 fks
passwords 2 columns 0 indexes 1 fks
sessions 3 columns 0 indexes 1 fks
users 5 columns 0 indexes 0 fks
verification_tokens 3 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ migrations/0000_init_db.sql 🚀

> barebones-app@0.1.0 db:migrate
> drizzle-kit migrate

drizzle-kit: v0.22.8
drizzle-orm: v0.31.4

No config path provided, using default path
Reading config file '/Users/user_name/my-new-app/drizzle.config.ts'
Using '@neondatabase/serverless' driver for database querying
 Warning  '@neondatabase/serverless' can only connect to remote Neon/Vercel Postgres/Supabase instances through a websocket
Database schema generated and applied.
✔ Where would you like to deploy? › Vercel
Vercel CLI 34.3.1
? Set up and deploy “~/my-new-app”? yes
? Which scope do you want to deploy to? My projects
? Link to existing project? yes
? What’s the name of your existing project? my-proj
🔗  Linked to my-projects-5ef6f56t/my-proj (created .vercel)
🔍  Inspect: https://vercel.com/my-projects-5ef6f37e/my-proj/DuieAiHmn8WN5jjN7dEz7uokouhc [3s]
✅  Preview: https://my-proj-oibcdro23-my-projects-5ef6f37e.vercel.app [3s]
📝  To deploy to production (my-proj-ashen.vercel.app), run `vercel --prod`

```

<NeedHelp/>
