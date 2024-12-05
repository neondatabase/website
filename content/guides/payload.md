---
title: Using Payload CMS with Neon Postgres to Build an E-commerce Store in Next.js
subtitle: Build your own E-commerce Store in a Next.js application with Payload CMS and Postgres (powered by Neon).
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-06-06T00:00:00.000Z'
updatedOn: '2024-06-06T00:00:00.000Z'
---

In this guide, you will learn how to set up a serverless Postgres database with Neon, configure Payload CMS with Postgres, and seed the Postgres database using the pre-populated information in Payload CMS Ecommerce template.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account

## Steps

- [Provisioning a Serverless Postgres database powered by Neon](#provisioning-a-serverless-postgres-database-powered-by-neon)
- [Create a new Payload CMS application with Next.js](#create-a-new-payload-cms-application-with-nextjs)
- [Seed your Postgres database](#seed-your-postgres-database)
- [Build and Test your E-commerce Store (locally)](#build-and-test-your-e-commerce-store-locally)
- [Scale-to-zero with Postgres (powered by Neon)](#scale-to-zero-with-postgres-powered-by-neon)

## Provisioning a Serverless Postgres database powered by Neon

Using a serverless Postgres database powered by Neon lets you scale down to zero, which helps you save on compute costs.

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and create a project.

Enable **Pooled connection** in the **Connection String** section of the **Connection Details** panel to obtain the Postgres connection string.

![](/guides/images/payload/98592ce7-3b8a-411b-a769-a0b89eaac8a3.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
```

- `<user>` is the database user.
- `<password>` is the database user’s password.
- `<endpoint_hostname>.neon.tech` is the host with `neon.tech` as the [top-level domain (TLD)](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `<port>` is the Neon port number. The default port number is 5432.
- `<dbname>` is the name of the database. **neondb** is the default database created with each Neon project if you do not define your own.
- `?sslmode=require` is an optional query parameter that enforces [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode for better security when connecting to the Postgres instance.

Save the connecting string somewhere safe. You will use it later to configure the `POSTGRES_URL` variable.

## Create a new Payload CMS application with Next.js

Let's begin with creating a Payload CMS backend to serve all the content for your e-commerce store in Next.js. Open your terminal and run the following command:

```bash
npx create-payload-app@latest payload-neon-ecommerce-store
```

`npx create-payload-app` is the recommended way to scaffold a Payload CMS + Next.js project quickly.

When prompted, choose the following:

![Welcome to Payload command line](/guides/images/payload/6c1f1650-7cc6-4b37-b293-611ba32dc6cc.png)

- `ecommerce` as the project template.
- `PostgreSQL (beta)` as the database.
- The connection string you obtained earlier as the PostgreSQL connection string: `postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require` .

Once that's done, change to the project directory and start the app:

```bash
cd payload-neon-ecommerce-store
yarn && yarn dev
```

![E-commerce template page](/guides/images/payload/e736400e-e52a-4b28-bb61-7f10fa7c2bc4.png)

The app should be running on [localhost:3000](http://localhost:3000). Let's keep the development server running as we work through the next steps.

Next, let's move on to adding e-commerce seed data to your Neon Postgres database.

## Seed your Postgres database

The `ecommerce` template is pre-configured with a seed database. To add the seed data to your Postgres database, navigate to the Payload CMS admin console at [localhost:3000/admin](http://localhost:3000/admin). Enter only the required attributes: **Email**, **Password**, **Name** and **Role**.

![Sign-in page](/guides/images/payload/fd54ff4f-400b-43fb-a08d-6f4fb0f8dd99.png)

Once you are inside the admin view, click **Seed your database** to start the process of seeding your database with e-commerce data.

![Welcome to your dashboard page](/guides/images/payload/086ae87d-d994-4fbf-b2fd-031ac711a4d1.png)

Once you see the following message in your terminal, you are done with adding seed data to the database.

```bash
INFO (payload): Seeded database successfully!
```

Now, let's move on to building the application and previewing it in action.

## Build and Test your E-commerce Store (Locally)

To test the e-commerce store in action, prepare a build and run the preview server using the following command:

```bash
yarn build && yarn serve
```

The app should now be running on [localhost:3000](http://localhost:3000). Navigate to http://localhost:3000/products/online-course to view the product display page of **Online Course** product.

![Online course page](/guides/images/payload/906a90a5-a17c-4573-8e45-87b67606f0c6.png)

Congratulations! You have now completed creating your own e-commerce store ✨

## Scale-to-zero with Postgres (powered by Neon)

Interestingly, during the entire process of setting up this app, you were using Neon's **Scale-to-zero** feature, which places your Postgres compute endpoint into an idle state when the database is inactive for more than 5 minutes. Click the **Operations** button in your Neon console sidebar to see when the compute was started and automatically suspended to reduce compute usage.

![Neon Monitoring page](/guides/images/payload/74a2aa54-6d28-4f47-b181-077957df6779.png)

## Summary

In this guide, you learned how to build an e-commerce store in Next.js using Payload CMS and a serverless Postgres database (powered by Neon). Furthermore, using Postgres (powered by Neon) allowed you to save on cloud compute resources when the compute endpoint that runs Postgres was idle for more than 5 minutes.

<NeedHelp />
