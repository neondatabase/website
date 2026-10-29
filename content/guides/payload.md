---
title: Using Payload CMS with Lakebase Postgres to build an e-commerce store in Next.js
subtitle: Build your own e-commerce store in a Next.js application with Payload CMS and Postgres on Neon.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-06-06T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

In this guide, you will learn how to set up a Postgres database on Neon, configure Payload CMS with Postgres, and seed the database using the pre-populated data in the Payload CMS ecommerce template.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account

## Steps

- [Provision a Postgres database on Neon](#provision-a-postgres-database-on-neon)
- [Create a new Payload CMS application with Next.js](#create-a-new-payload-cms-application-with-nextjs)
- [Seed your Postgres database](#seed-your-postgres-database)
- [Build and test your e-commerce store locally](#build-and-test-your-e-commerce-store-locally)
- [Scale to zero on Neon](#scale-to-zero-on-neon)

## Provision a Postgres database on Neon

A Neon compute scales to zero when it's idle, so you don't pay for compute while the database isn't in use. Storage is still billed.

To get started, go to the [Neon Console](https://console.neon.tech/app/projects) and create a project.

Click **Connect** on your project dashboard to open the **Connect to your branch** modal, and copy the connection string. The **Connection pooling** toggle is enabled by default, which gives you a pooled connection string.

![](/guides/images/payload/98592ce7-3b8a-411b-a769-a0b89eaac8a3.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require
```

- `<user>` is the database user.
- `<password>` is the database user’s password.
- `<endpoint_hostname>.neon.tech` is the host with `neon.tech` as the [top-level domain (TLD)](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `<port>` is the Neon port number. The default port number is 5432.
- `<dbname>` is the name of the database. **neondb** is the default database created with each Neon project if you do not define your own.
- `?sslmode=require&channel_binding=require` are optional query parameters that enforce [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode and channel binding for better security when connecting to the Postgres instance.

Save the connection string somewhere safe. You will use it later to configure the `POSTGRES_URL` variable.

## Create a new Payload CMS application with Next.js

Let's begin with creating a Payload CMS backend to serve all the content for your e-commerce store in Next.js. Open your terminal and run the following command:

```bash
npx create-payload-app@latest payload-neon-ecommerce-store
```

`npx create-payload-app` scaffolds a Payload CMS and Next.js project.

When prompted, choose the following:

![Welcome to Payload command line](/guides/images/payload/6c1f1650-7cc6-4b37-b293-611ba32dc6cc.png)

- `ecommerce` as the project template.
- `PostgreSQL (beta)` as the database.
- The connection string you obtained earlier as the Postgres connection string: `postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require&channel_binding=require` .

Once that's done, change to the project directory and start the app:

```bash
cd payload-neon-ecommerce-store
yarn && yarn dev
```

![E-commerce template page](/guides/images/payload/e736400e-e52a-4b28-bb61-7f10fa7c2bc4.png)

The app should be running on [localhost:3000](http://localhost:3000). Let's keep the development server running as we work through the next steps.

Next, let's add e-commerce seed data to your database.

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

## Build and test your e-commerce store locally

To test the e-commerce store in action, prepare a build and run the preview server using the following command:

```bash
yarn build && yarn serve
```

The app should now be running on [localhost:3000](http://localhost:3000). Navigate to http://localhost:3000/products/online-course to view the product display page of **Online Course** product.

![Online course page](/guides/images/payload/906a90a5-a17c-4573-8e45-87b67606f0c6.png)

You have now built your own e-commerce store.

## Scale to zero on Neon

While you set up this app, your Neon compute used [scale to zero](/docs/introduction/scale-to-zero), which suspends the compute after 5 minutes of inactivity. Open the **Monitoring** page in the Neon Console and view **System operations** to see when the compute started and when it was suspended.

![Neon Monitoring page](/guides/images/payload/74a2aa54-6d28-4f47-b181-077957df6779.png)

## Summary

You built an e-commerce store in Next.js using Payload CMS and a Postgres database on Neon. While the app was idle for more than 5 minutes, the compute scaled to zero, so you weren't billed for compute during that time.

<NeedHelp />
