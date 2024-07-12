---
title: Neon CLI commands — create-app
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-06-30T14:35:12.895Z'
---

## Before you begin

- Before running the `create-app` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `create-app` command

This command initializes a new Neon project.

### Usage

```bash
neon create-app
```

### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

### Examples

```bash
✔ What is your project named? … my-app
? Which package manager would you like to use? › - Use arrow-keys. Return to submit.
❯   npm
    pnpm
    bun
    ? What framework would you like to use? › - Use arrow-keys. Return to submit.
❯   Next.js
    SvelteKit
    Nuxt.js
    ? What ORM would you like to use? › - Use arrow-keys. Return to submit.
❯   Drizzle
    Prisma
    No ORM
    ? What authentication framework do you want to use? › - Use arrow-keys. Return to submit.
❯   Auth.js
    No Authentication
    ? What Neon project would you like to use? › - Use arrow-keys. Return to submit.
❯   Create a new Neon project
Project
┌─────────────────────────┬───────────┬───────────────┬──────────────────────┐
│ Id                      │ Name      │ Region Id     │ Created At           │
├─────────────────────────┼───────────┼───────────────┼──────────────────────┤
│ winter-thunder-11258242 │ my-app-db │ aws-us-east-2 │ 2024-07-11T21:23:16Z │
└─────────────────────────┴───────────┴───────────────┴──────────────────────┘
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

⠴

added 400 packages, and audited 401 packages in 42s

144 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Initialized a git repository.

Success! Created my-app at /Users/dprice/my-app
Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd my-app
  npm run dev

A new version of `create-next-app` is available!
You can update by running: npm i -g create-next-app

Created a Next.js project in my-app.

You can now run cd my-app && npm run dev
> barebones-app@0.1.0 db:generate
> drizzle-kit generate --name init_db

drizzle-kit: v0.22.8
drizzle-orm: v0.31.4

No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/dprice/my-app/drizzle.config.ts'
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
Reading config file '/Users/dprice/my-app/drizzle.config.ts'
Using '@neondatabase/serverless' driver for database querying
 Warning  '@neondatabase/serverless' can only connect to remote Neon/Vercel Postgres/Supabase instances through a websocket
Database schema generated and applied.
? Where would you like to deploy? › - Use arrow-keys. Return to submit.
❯   Vercel
    We will install the Vercel CLI globally.
    Cloudflare
    Nowhere
✔ Where would you like to deploy? › Vercel
Need to install the following packages:
vercel@34.3.1
Ok to proceed? (y) 

> > No existing credentials found. Please log in:
? Log in to Vercel (Use arrow keys)
❯ Continue with GitHub
  Continue with GitLab
  Continue with Bitbucket
  Continue with Email
  Continue with SAML Single Sign-On
 ─────────────────────────────────
  Cancel

? Set up and deploy “~/my-app”? yes
? Which scope do you want to deploy to? Daniel's projects
? Link to existing project? (y/N) y
? What’s the name of your existing project? elements
🔗  Linked to daniels-projects-5ef6f37e/elements (created .vercel)
🔍  Inspect: https://vercel.com/daniels-projects-5ef6f37e/elements/38exhFjVacQgEY3rXMWJmochHM3P [3s]
✅  Preview: https://elements-hk7vy2u34-daniels-projects-5ef6f37e.vercel.app [3s]
📝  To deploy to production (elements-ashen.vercel.app), run `vercel --prod`
```

![neonctl create-app page-tsx](/docs/reference/neon-create-app.png)

<NeedHelp/>
