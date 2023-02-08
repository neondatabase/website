---
title: Use Neon with Koyeb
enableTableOfContents: true
---

Integrate a serverless Neon Postgres database to your application running on Koyeb and benefit from Koyeb native autoscaling, automatic HTTPS (SSL), auto-healing, and global load-balancing across our edge network with zero configuration.

Neon is a lightning-fast, cost-efficient, and easy-to-use serverless Postgres-compatible database provider. Not only a simple database provider, Neon can also be natively integrated into modern development workflows thanks to data branching which instantly deploys environments with an up-to-date copy of your production data.

This guide explains how to connect a Neon Postgres database to an application running on Koyeb. To successfully follow this documentation, you will need to have:

- A Koyeb account to deploy the application. You can optionally install the Koyeb CLI if you prefer to follow this guide without leaving the terminal
- A Neon account to deploy the PostgreSQL database
- If you already have a Neon database running and want to quickly preview how to connect your Neon database to an application running on Koyeb, use the Deploy to Koyeb button below.

## Deploy to Koyeb

Make sure to replace properly set the `DATABASE_URL` environment variable with the connection string of your Neon database.

## Create a Neon serverless PostgreSQL database

To create a Neon PostgreSQL database, sign into your Neon account.

On the Neon control panel, start by clicking the "Create a project" button to access the database creation page.

Name your database, e.g., neon-koyeb
Select the Postgres version to use for the database. Here, we use Postgres 15
Pick the Region to run the database in. Here, we use Europe (Frankfurt) as our compute will be deployed in this region on Koyeb
When you are done configuring your database, click the "Create project" button. Your database will be provisioned.

A modal will pop up with your connection string. Store this value in a safe place, we will use it later.

## Prepare the database on your machine

The application we will deploy on Koyeb that connects to the Neon PostgreSQL uses Prisma as an ORM. Prisma is an open-source ORM. We use it to synchronize our database schema with our Prisma schema.

Before deploying the application, we will need to perform a migration to create the database schema and seed data.

### Clone the example application

Start by cloning the application that will connect to the PostgreSQL database on your machine and navigate to the app directory by running the following commands:

```bash
git clone git@github.com:koyeb/example-express-prisma.git
cd example-express-prisma
```

## Retrieve your Neon Postgres connection string

On the Neon control panel, copy the Connection string tab to retrieve the connection string to connect the database.

### Initialize and seed the database

To synchronize our database schema with our Prisma schema and seed data, run the following commands in your terminal:

DATABASE_URL="<YOUR_NEON_CONNECTION_STRING>" npx prisma db push
DATABASE_URL="<YOUR_NEON_CONNECTION_STRING>" npx prisma db seed
Make sure to replace <YOUR_NEON_CONNECTION_STRING> with your connection string.

## Deploy the application on Koyeb

You can deploy on Koyeb using the control panel or via the Koyeb CLI.

### Via the Koyeb control panel

To deploy the example application using the control panel, follow these steps:

1. Create a new Koyeb App
1. Set `github.com/koyeb/example-express-prisma` as the GitHub repository to deploy and keep the default branch main
1. Add a DATABASE_URL environment variable to indicate the application how to connect to the Postgres database. Give the environment variable a name, DATABASE_URL and enter the connection string from earlier as the value
1. Name your service, for instance express-neon
1. Click the Deploy button

Koyeb is now building the application. Once the build has finished, you will be able to access your application running on Koyeb by clicking the URL ending with .koyeb.app.

The example application exposes a /planets endpoint that you can use to list planets from the database we prepared earlier. Once your deployment is live, you should see the following results when navigating to `https://<YOUR_APP_URL>.koyeb.app/planets`:

```json
[
{
    "id": 1,
    "name": "Mercury"
},
{
    "id": 2,
    "name": "Venus"
},
{
    "id": 3,
    "name": "Mars"
}
]
```

## Via the Koyeb CLI

To deploy the example application using the Koyeb CLI, run the following command in your terminal:

```bash
koyeb app init express-neon \
--git github.com/koyeb/example-express-prisma \
--git-branch main \
--ports 8080:http \
--routes /:8080 \
--env PORT=8080 \
--env DATABASE_URL="<YOUR_NEON_CONNECTION_STRING>"
```

Make sure to replace `<YOUR_NEON_CONNECTION_STRING>` with your connection string.

### Access deployment logs

To track the app deployment and visualize build logs, execute the following command:

```bash
koyeb service logs express-neon/express-neon -t build
```

### Access your app

Once the deployment of your application has finished, you can retrieve the public domain to access your application by running the following command:

```bash
$ koyeb app get express-neon
ID          NAME                     DOMAINS                                    CREATED AT
ec6a4311    express-neon             ["express-neon-myorg.koyeb.app"]          24 Jan 23 11:12 UTC
```

The example application exposes a /planets endpoint that you can use to list planets from the database we prepared earlier. Once your deployment is live, you should see the following results when navigating to https://<YOUR_APP_URL>.koyeb.app/planets:

```jason
[
{
    "id": 1,
    "name": "Mercury"
},
{
    "id": 2,
    "name": "Venus"
},
{
    "id": 3,
    "name": "Mars"
}
]
```

## Delete the example application and Neon database

To delete the example application and the Neon PostgreSQL database and avoid incurring any charges, follow these steps:

From the Neon dashboard, click "Settings" for the database and click "Delete project". Follow the instructions.
From the Koyeb control panel, select the App to delete. Under the "Settings" tab, click the "Delete" button and follow the instructions.
