---
title: Postgres at your fingertips with the Neon CLI
description: >-
  Today, we are releasing Neon CLI, a command-line interface that enables
  developers to manage Neon resources directly from the terminal! With Neon
  CLI, you can handle authentication, and manage projects, branches,
  databases, roles, and much more without leaving your command line. Get
  started by installing the CLI using the following command: Use neonctl auth
  command […]
excerpt: >-
  Today, we are releasing Neon CLI, a command-line interface that enables
  developers to manage Neon resources directly from the terminal! With Neon CLI,
  you can handle authentication, and manage projects, branches, databases,
  roles, and much more without leaving your command line....
date: '2023-07-12T12:57:50'
updatedOn: '2023-12-20T21:00:54'
category: community
categories:
  - community
  - workflows
authors:
  - raouf-chebri
  - daniel-price
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/cli/image-34.png'
  alt: null
isFeatured: false
seo:
  title: Postgres at your fingertips with the Neon CLI - Neon
  description: >-
    Today, we are releasing Neon CLI, a command-line interface that enables
    developers to manage Neon resources directly from the terminal! With Neon
    CLI, you can handle authentication, and manage projects, branches,
    databases, roles, and much more without leaving your command line. Get
    started by installing the CLI using the following command: Use neonctl auth
    command […]
  keywords: []
  noindex: false
  ogTitle: Postgres at your fingertips with the Neon CLI - Neon
  ogDescription: >-
    Today, we are releasing Neon CLI, a command-line interface that enables
    developers to manage Neon resources directly from the terminal! With Neon
    CLI, you can handle authentication, and manage projects, branches,
    databases, roles, and much more without leaving your command line. Get
    started by installing the CLI using the following command: Use neonctl auth
    command […]
  image: 'https://cdn.neonapi.io/public/images/pages/blog/cli/social.png'
---

![Old computer with a terminal being displayed, placed on a colorful background](https://cdn.neonapi.io/public/images/pages/blog/cli/image-33-1024x576-ac5d9c0c.png)

Today, we are releasing Neon CLI, a command-line interface that enables developers to manage Neon resources directly from the terminal! With Neon CLI, you can handle authentication, and manage projects, branches, databases, roles, and much more without leaving your command line.

<video autoPlay muted loop width="10056" height="2160">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/cli/neonctl-add-compute-5e0ed184.mp4" />
</video>

Get started by installing the CLI using the following command:

```bash
npm i -g neonctl
```

Use `neonctl auth` command to connect to your Neon account, or create a new one.

## What Can You Do with the Neon CLI?

The CLI offers an integrated approach to managing other aspects of your projects, including CRUD (Create, Read, Update, Delete) operations on your projects, branches, databases, and roles. Here are a few examples of what you can do using the CLI:

### Projects

With Neon CLI you can create a Postgres database and get a connection string in seconds:

```bash
neonctl projects create
```

Output:

```bash
┌───────────────────┬──────┬───────────────┬──────────────────────┐
│ Id                │ Name │ Region Id     │ Created At           │
├───────────────────┼──────┼───────────────┼──────────────────────┤
│  cold-lab-971294  │ cli  │ aws-us-east-2 │ 2023-07-05T12:05:02Z │
└───────────────────┴──────┴───────────────┴──────────────────────┘
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                        │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ postgres://<user>:<password>@ep-lingering-moon-792025.us-east-2.aws.neon.tech/neondb │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

The `projects create` returns your new project-id (cold-lab-971294) and the connection string so you can immediately use it in your project.

### Branches and connection string

You can also list your branches and create a new one to use for local development:

```bash
neonctl branches list
```

Output:

```bash
┌────────────────────────┬──────┬──────────────────────┬──────────────────────┐
│ Id                     │ Name │ Created At           │ Updated At           │
├────────────────────────┼──────┼──────────────────────┼──────────────────────┤
│ br-purple-tooth-335860 │ main │ 2023-07-05T12:06:49Z │ 2023-07-05T12:11:04Z │
└────────────────────────┴──────┴──────────────────────┴──────────────────────┘
```

The CLI allows you to create Neon branches, similarily to when you create a local Git branch for local development. Neon branches are isolated copy of your database that you can modify without compromising your main database, ideal for development and testing. You can create a branch using the following command:

```bash
neonctl branches create –-project-id=<your-project-id>
```

The branches and projects `create` commands return a connection string. However, you can use the following command to display your connection string at any moment:

```bash
neonctl cs <branch> --project-id=<your-project-id>
```

Once you are done with your feature and have merged your code and schema changes, you can dispose of the branch:

```bash
neonctl branches delete <your-branch-id> --project-id <your-project-id> 
```

### Integrated the CLI in your CI/CD pipelines

You can use the CLI in your developer workflows and pipelines. If not authenticated, the CLI expects a `NEON_API_KEY` as an argument, that you can create in the [Neon console](https://console.neon.tech). You can also pass the API key as a parameter like in the command below:

```bash
npx neonctl branches create --project-id=<your_project_id> --api-key=<key>
```

We invite you to visit the [documentation](https://neon.tech/docs/reference/neon-cli) for more information about the supported commands.

## We’d love to hear your feedback

We are currently actively developing CLI, so more features to the CLI are to come. [Share feedback](https://community.neon.tech/) and let us know what you’d like to see in Neon CLI.

We thank you for your valuable contributions, encourage you to explore Neon CLI, and would love to hear from you to make the experience managing your Postgres databases better.
