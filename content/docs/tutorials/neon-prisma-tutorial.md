---
title: Setup Prisma with Neon
enableTableOfContents: true
---

This tutorial explains how to deploy a Prisma project with a Neon PostgreSQL database.

Prisma is an open source next-generation ORM. It consists of the following parts:
- Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: Migration tool to easily evolve your database schema from prototyping to production
- Prisma Studio: GUI to view and edit data in your database

Neon is a fully managed, serverless PostgreSQL with a generous free tier. Neon separates storage and compute and offers modern developer features such as serverless, branching, bottomless storage, and more.

## Step 1: Sign up with Neon

To sign up for Neon:

1. Navigate to [https://console.neon.tech](https://console.neon.tech).
1. Sign in with a Github or Google account.

After signing in, you are directed to the Neon Console where you can create your first project. 

## Step 2: Create a project and copy the connection string

1. In the Neon Console, Click Create a project to open the Project Creation dialog.
1. Specify a name, a Postgres version, a region, and click Create Project. 
1. The project is created and you are presented with a dialog that provides connection details for the project. Copy the connection string, which will look similar to this:

```
postgres://daniel:4SdLrziY1NFp@ep-throbbing-firefly-664409.us-east-2.aws.neon.build/neondb
```

Every Neon project is created with a default PostgreSQL user named for your account and default database named `neondb`, which are shown in the connection string that you copied. We'll use this user and database for our Prisma project.

## Step 2: Create a shadow database for Prisma Migrate

In addition to the primary database, Prisma Migrate requires a second "shadow" database to manage schema drift. To create a shadow database:

1. In the Neon COnsole, select **Settings** > **Databases**.
1. Click **New Database**.
1. Select the branch where you want to create the database, enter a database name, and select a database owner. For simplecity, we'll name the shadow database `shadow`. Be sure to select the same branch where your primary `neondb` database resides. The default branch is `main`.
1. Click **Create**.

