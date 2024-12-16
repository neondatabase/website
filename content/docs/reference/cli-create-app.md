---
title: Neon CLI commands — create-app
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-10-07T13:55:51.300Z'
---

## Before you begin

- Before running the `create-app` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `create-app` command

The `create-app` command initializes a new Neon project with a primary database branch (for deployment) and a development database branch and bootstraps a full-stack application using your preferred package manager. The command supports the following stack components:

- **Package Manager**: Choose from `npm`, `pnpm`, and `bun`
- **Frameworks**: `Next.js` (`SvelteKit` and `Nuxt.js` coming soon)
- **ORM**: `Drizzle`, `Prisma`
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
✔ What is your project named? … my-app
✔ Which package manager would you like to use? › npm
✔ What framework would you like to use? › Next.js
✔ What ORM would you like to use? › Drizzle
✔ What authentication framework do you want to use? › Auth.js
✔ What Neon project would you like to use? › Create a new Neon project
Project
┌────────────────────────┬────────────────┬───────────────┬──────────────────────┐
│ Id                     │ Name           │ Region Id     │ Created At           │
├────────────────────────┼────────────────┼───────────────┼──────────────────────┤
│ nameless-lake-65868340 │ my-app-project │ aws-us-east-2 │ 2024-07-26T12:52:19Z │
└────────────────────────┴────────────────┴───────────────┴──────────────────────┘

Branch
┌───────────────────────────┬────────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                        │ Name           │ Default │ Created At           │ Updated At           │
├───────────────────────────┼────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-crimson-sound-a5t7emzs │ dev-62SVOKgaFW │ false   │ 2024-07-26T12:52:22Z │ 2024-07-26T12:52:22Z │
└───────────────────────────┴────────────────┴─────────┴──────────────────────┴──────────────────────┘
Creating a new Next.js app in /Users/user_name/my-app.

Downloading files from repo https://github.com/neondatabase/neonctl-create-app-templates/tree/main/next-drizzle-authjs. This might take a moment.

Installing packages. This might take a couple of minutes.

added 399 packages, and audited 400 packages in 39s

143 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Initialized a git repository.

Success! Created my-app at /Users/user_name/my-app
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
Reading config file '/Users/user_name/my-app/drizzle.config.ts'
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
Reading config file '/Users/user_name/my-app/drizzle.config.ts'
Using '@neondatabase/serverless' driver for database querying
 Warning  '@neondatabase/serverless' can only connect to remote Neon/Vercel Postgres/Supabase instances through a websocket
Database schema generated and applied.
✔ Where would you like to deploy? › Vercel
Database
┌─────────────────┬──────────────┬──────────────────────┐
│ Name            │ Owner Name   │ Created At           │
├─────────────────┼──────────────┼──────────────────────┤
│ my-app-vm22Z-db │ neondb_owner │ 2024-07-26T12:53:12Z │
└─────────────────┴──────────────┴──────────────────────┘

> barebones-app@0.1.0 db:migrate
> drizzle-kit migrate

drizzle-kit: v0.22.8
drizzle-orm: v0.31.4

No config path provided, using default path
Reading config file '/Users/user_name/my-app/drizzle.config.ts'
Using '@neondatabase/serverless' driver for database querying
 Warning  '@neondatabase/serverless' can only connect to remote Neon/Vercel Postgres/Supabase instances through a websocket
(node:66659) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:66659) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
Vercel CLI 34.3.1
? Set up and deploy “~/my-app”? yes
? Which scope do you want to deploy to? My projects
? Link to existing project? yes
? What’s the name of your existing project? elements
🔗  Linked to daniels-projects-5ef6f37f/elements (created .vercel)
🔍  Inspect: https://vercel.com/daniels-projects-5ef6f37f/elements/9beMr7sXfTt9EchymWGzjRp7XQvZ [3s]
✅  Preview: https://myproj-cj3z2k49s-daniels-projects-5ef6f37f.vercel.app [3s]
📝  To deploy to production (myproj-ashen.vercel.app), run `vercel --prod`
INFO:

You can now run:

  cd my-app && npm run dev

to start the app locally.
```

## Your Neon project

If you selected `Create a new Neon project` when prompted with `What Neon project would you like to use?`, you'll find your newly created Neon project on the [Projects](https://console.neon.tech/app/projects) page in the Neon Console. Your new Neon project will be named for the app project name you specified. For example, in the `create-app` example above, the app project name given was `my-app`. For a project with this name, you would see a Neon project named: `my-app-project`:

![Neon project page](/docs/reference/create_app_neon_project.png)

### Neon project branches

Whether you created a new Neon project or selected an existing one, the `create-app` command creates a development branch in your Neon project, which you can see on the **Branches** page.

![Neon project branches page](/docs/reference/create_app_neon_project_branches.png)

To get acquainted with Neon's database branching feature and how you can use branching in your development workflow, see [Database Branching Workflows](https://neon.tech/flow).

## Your local app directory

After running the `create-app` command, you can explore your new bootstrapped app in your local app directory. It will appear similar to the following, depending on your selections:

![local app directory](/docs/reference/create_app_local_dir.png)

## Feedback and future improvements

If you've got feature requests or feedback about what you'd like to see from the Neon CLI `create-app` command, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

## Resources

- [YouTube: CLI command for scaffolding full stack JS apps](https://www.youtube.com/watch?v=-V203i5QiAI)

<NeedHelp/>
