---
title: Use Neon with Koyeb
enableTableOfContents: true
---

[Koyeb](https://www.koyeb.com/) is a developer-friendly serverless platform designed to easily deploy reliable and scalable applications globally. Koyeb offers native autoscaling, automatic HTTPS (SSL), auto-healing, and global load-balancing across their edge network with zero configuration.

This guide describes how to connect a Neon Postgres database to an application running on Koyeb. To successfully follow the instructions in this guide, you require:

- A [Koyeb account](https://app.koyeb.com/) to deploy the application. You can optionally install the [Koyeb CLI](https://www.koyeb.com/docs/quickstart/koyeb-cli) if you prefer to follow this guide without leaving the terminal. The Koyeb CLI requires an API access token, which you can generate in the Koyeb [control panel](https://app.koyeb.com/), under **Account** > **API**.
- A [Neon account](https://console.neon.tech/) to deploy the PostgreSQL database.

## Create a Neon project

1. Navigate to the [Neon Console](https://console.neon.tech/).
1. Select **Create a project**.
1. Enter a name for the project (e.g., `neon-koyeb`), and select a PostgreSQL version and and region.
1.  Click **Create project**.

A dialog pops up with your connection string. Store this value in a safe place. It is required later. You may notice that the connection string `neondb` as the database. This is the default database created with each Neon project. You will use this database with the example application.

## Prepare the database on your machine

The example application connects to the Neon PostgreSQL using [Prisma](https://www.prisma.io/) as an ORM. It is used to synchronize the database schema with the Prisma schema included in the application. Before you deploy the application, you will perform a migration to create the database schema and seed it with data.

### Clone the example application

Clone the example application to your machine and navigate to the application directory by running the following commands:

```bash
git clone git@github.com:koyeb/example-express-prisma.git
cd example-express-prisma
```

### Initialize and seed the database

To synchronize your Neon database schema with the Prisma schema and seed the data, run the following commands in your terminal. Replace `<YOUR_NEON_CONNECTION_STRING>` with the Neon connection string that you saved when you created your Neon project.

```bash
DATABASE_URL=`<YOUR_NEON_CONNECTION_STRING>` npx prisma db push
DATABASE_URL=`<YOUR_NEON_CONNECTION_STRING>` npx prisma db seed
```

## Deploy the application on Koyeb

You can deploy on Koyeb using the control panel or via the Koyeb CLI.

### Via the Koyeb control panel

To deploy the example application from the Koyeb [control panel](https://app.koyeb.com/), follow these steps:

1. Select **Create App**.
1. Select GitHub as the deployment method.
1. Enter `https://github.com/koyeb/example-express-prisma` in the **Public GitHub repository** field.
1. Keep `example-express-prisma` as the name and `main` as the branch.
1. In **Build and deployment settings**, toggle **Override** and add the following **Build command**: `npm run postgres:init`
1. Select the region closest to your Neon project.
1. Under **Advanced** > **Environment variables**, add a `DATABASE_URL` environment variable to enable the application connect to your Neon Postgres database. Enter the Neon connection string that you used previously.
1. Enter a name for your app. For example, `express-neon`
1. Click the **Deploy** button.

Koyeb is now building the application. Once the build has finished, you will be able to access your application running on Koyeb by clicking the URL ending with `.koyeb.app`.

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

To deploy the example application using the [Koyeb CLI](https://www.koyeb.com/docs/quickstart/koyeb-cli), run the following command in your terminal:

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
ID          NAME         STATUS         DOMAINS                                CREATED AT          
b8611a1d    express-neon HEALTHY       ["express-neon-myorg.koyeb.app"]       16 Feb 23 18:13 UTC
```

The example application exposes a `/planets` endpoint that you can use to list planets from the database we prepared earlier. Once your deployment is live, you should see the following results when navigating to `https://<YOUR_APP_URL>.koyeb.app/planets`:

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

## Delete the example application and Neon project

To delete the example application on Koyeb to avoid incurring any charges, follow these steps:

1. From the Koyeb [control panel](https://app.koyeb.com/), select the App to delete.
1. On the **Settings** tab, select **Danger Zone** and click **Delete**.

To delete your Neon project, refer to [Delete a project](/docs/manage/projects#delete-a-project) for instructions.
