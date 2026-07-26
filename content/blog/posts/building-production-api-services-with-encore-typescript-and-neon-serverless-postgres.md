---
title: >-
  Building Production API Services with Encore, TypeScript, and Neon Serverless
  Postgres
description: Deploy Backends Faster with Encore and Neon
excerpt: >-
  Starting today, Encore now supports using Neon Postgres for all Encore
  environments, including those in the cloud on Amazon Web Services (AWS) and
  Google Cloud Platform (GCP). “This means you can connect your Neon account to
  use highly scalable serverless Postgres for all your En...
date: '2024-05-08T13:41:20'
updatedOn: '2024-05-08T13:54:58'
category: community
categories:
  - community
authors:
  - stephen-siegert
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Building Production API Services with Encore, TypeScript, and Neon
    Serverless Postgres - Neon
  description: Deploy Backends Faster with Encore and Neon
  keywords: []
  noindex: false
  ogTitle: >-
    Building Production API Services with Encore, TypeScript, and Neon
    Serverless Postgres - Neon
  ogDescription: >-
    Starting today, Encore now supports using Neon Postgres for all Encore
    environments, including those in the cloud on Amazon Web Services (AWS) and
    Google Cloud Platform (GCP). “This means you can connect your Neon account
    to use highly scalable serverless Postgres for all your Encore managed
    environments, in the same seamless way youʼre already using […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/cover.jpg
---

![Deploy backends faster with Neon and Encore](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/neon-deploy-faster-1-1024x576-2f2a5213.jpg)

Starting today, [Encore](https://encore.dev/) now supports using Neon Postgres for all Encore environments, including those in the cloud on Amazon Web Services (AWS) and Google Cloud Platform (GCP).

_“This means you can connect your Neon account to use highly scalable serverless Postgres for all your Encore managed environments, in the same seamless way youʼre already using Encore to orchestrate your Cloud SQL and RDS databases.” –_ [Encore x Neon announcement post](https://encore.dev/blog/neon-serverless-postgres)

Encore offers a streamlined development platform for building cloud backend applications, enabling developers to focus on building cloud-first solutions rather than struggling with vendor-specific infrastructure complexities. Pairing Encore with Neon Serverless Postgres enhances this developer experience, providing a flexible and robust foundation for building scalable API services.

![Neon Postgres with Encore](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/neonxencore-1024x939-3cc49c6b.png)

Now, with Encore, you can leverage Neon Postgres through your entire development lifecycle. From local development to production. This includes services and APIs, Databases (as with Neon), Cron Jobs, Pub/Sub & Queues, and Secrets.

In this post, we’ll walk through setting up a [URL Shortener Web Service](https://encore.dev/docs/tutorials/rest-api#1-create-a-service-and-endpoint-1) using an Encore template and CLI. Then, after deploying the local environment to a staging environment, we’ll push to a production environment.

This web service will use the [Encore TypeScript SDK](https://encore.dev/blog/encore-for-typescript), now Generally Available, to build out the backend cloud infrastructure.

## Prerequisites

To follow along, you’ll need:

- A [Neon account](https://console.neon.tech/signup)
- The [Encore CLI](https://encore.dev/docs/install#install-the-encore-cli) installed and configured
- Docker desktop running to test locally to test the app

If you’d like to deploy the final application to AWS or GCP, then you’ll need to configure those accounts separately and link within the Encore console. The application in this post will be deployed to the Encore Cloud.

## Encore’s Development Flow

Encore’s TypeScript SDK speeds up backend development by allowing frontend and full-stack developers to build production-ready applications and distributed systems using a language that is already familiar. Leveraging TypeScript, developers can transition from frontend to backend development, ensuring type safety throughout the process. The TypeScript SDK simplifies backend development by allowing developers to declare common infrastructure primitives directly in application code, streamlining workflows and facilitating rapid iteration and debugging.

Additionally, If you use Neon for your production or testing database, you can now configure Encoreʼs built-in ephemeral Preview Environments to automatically branch off this database, seeding your Preview Environment with real-world data to simplify testing.

Here’s how Encore facilitates a seamless development workflow:

**Local Development**

- Encore’s local development workflow reduces the hassle of setting up infrastructure manually. With just a few commands, developers can instantiate a local environment that mirrors the cloud setup.
- The local environment accurately mirrors the cloud environment, helping to maintain consistency and minimizing discrepancies during development.
- Encore’s built-in tools, such as type-aware infrastructure and automatic API documentation generation, enhance developer productivity.

**Testing**

- Encore simplifies testing by providing built-in support for service/API mocking and dedicated test infrastructure.
- Developers can leverage preview environments for each Pull Request, facilitating comprehensive end-to-end testing before deployment.

**DevOps**

- Encore provides automatic infrastructure provisioning in the cloud, eliminating the need for manual configuration.
- By leveraging the Backend SDK, developers can declare infrastructure semantics within their application code, enabling seamless infrastructure management across environments.
- Encore offers a suite of DevOps tools, including least-privilege IAM setup, infrastructure tracking, and cost analytics, empowering teams to focus on product development rather than infrastructure management.

If you aren’t using AWS or GCP directly, you can deploy your apps directly to Encore’s cloud infrastructure.

## Using Neon Serverless Postgres with Encore

Neon Serverless Postgres complements Encore by offering a serverless Postgres service optimized for cloud environments. Here’s how Neon Serverless Postgres enhances the development experience:

- Neon abstracts away the complexities of managing Postgres databases, allowing developers to focus on application logic.
- With Neon’s serverless architecture, [databases automatically scale](https://neon.tech/blog/1-year-of-autoscaling-postgres-at-neon#architecture-of-autoscaling-a-refresher) to accommodate fluctuating workloads, providing optimal performance without manual intervention.
- Neon enables [database branching](https://neon.tech/blog/move-fast-and-branch-things), making it fast and cost effective to create a separate database instance for each environment, such as development, staging, and production.

## Create and Deploy the URL shortener app

Let’s dive into the quick start guide to build your first app in just a few minutes using the Encore CLI, TypeScript SDK, and Neon.

First, Install the Encore CLI. The Encore CLI provisions your local development environment and simplifies application setup:

```bash
brew install encoredev/tap/encore
```

After the CLI is installed, use `encore app create` flow to create an app locally.

```bash
encore app create

  Select language for your application [Use arrows to move]

    Go
    Build performant and scalable backends with Go

  │ TypeScript
  │ Build backend and full-stack applications with TypeScript and Node.JS
```

Select TypeScript and the URL Shortener template.

```bash
 ✔ Language: TypeScript

  Template [Use arrows to move]
    Hello World
    A simple REST API

    Uptime Monitor
    Microservices, SQL Databases, Pub/Sub, Cron Jobs

  │ URL Shortener
  │ REST API, SQL Database

    Empty app
    Start from scratch (experienced users only)
```

Follow the prompts to pick a name for your app and select the URL Shortener template. If you’re only doing local development or managing your own deployments, no Encore account is needed. For this guide, we’ll be using Encore’s cloud platform to automate cloud deployments, so if it’s your first time using Encore you’ll need to sign up for a free account.

```bash
 ✔ Language: TypeScript
  ✔ Template: URL Shortener

  App Name [Use only lowercase letters, digits, and dashes]
  > neon-short-url
```

And just like that, your app is set up locally. You’ll also have an app project created in the Encore web dashboard.

```bash
Successfully created app neon-short-url!
App ID:  neon-short-url-a7f2
Web URL: https://app.encore.dev/neon-short-url-a7f2

Useful commands:

    encore run
        Run your app locally

    encore test
        Run tests

    git push encore
        Deploys your app

Get started now: cd neon-short-url && encore run
```

Open the generated TypeScript file (`url.ts`) in your code editor to explore the template. You’ll notice that defining API endpoints is straightforward and follows standard TypeScript conventions.

View the App in the Encore Dashboard locally with:

```bash
encore run
```

In this example, Encore is using Docker to recreate the environment and pull in the Postgres Docker image for testing. You’ll also notice that the database migrations are run as part of this command execution. This migration is located in the project directory at `url/migrations/url/1_create_tables.up/sql`.

```bash
neon-short-url encore run                                                 (main)
  ✔ Building Encore application graph... Done!
  ✔ Analyzing service topology... Done!
  ✔ Creating Postgres database cluster... Done!
  ✔ Pulling Postgres docker image... Done!
  ✔ Running database migrations... Done!
  ✔ Starting Encore application... Done!

  Encore development server running!

  Your API is running at:     https://127.0.0.1:4000
  Development Dashboard URL:  https://localhost:9400/neon-short-url-a7f2
```

The app is now running locally and can be inspected using the Development Dashboard URL.

![Encore local development dashboard](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-local-dev-dash-1024x287-fbf9f7fd.png)

Open the Local Development Dashboard at [https://localhost:9400](https://localhost:9400/) to view the API explorer and service catalog.

Now, we’ll push the new app and deploy. Push your changes to deploy your application to Encore’s free development Cloud:

```bash
git add -A .
git commit -m 'Init deploy 🚀'
git push encore
```

When prompted, connect to Encore’s Git, `git.encore.dev`. This will trigger a deployment through the Encore cloud. You can also [integrate your app with GitHub](https://encore.dev/docs/how-to/github), connect to a specific app repo, and activate preview environments for each pull request (PR). Additionally, preview environments allow you to take advantage of [Neon’s branching](https://encore.dev/docs/deploy/infra#development-infrastructure) automatically through Encore for a DB per PR.

## View the app in the Encore dashboard

In Encore, each app has environments. When you first push the app from the local environment, a live (deployed) staging environment is created. This app will, by default, have a Neon database provisioned and managed for you by Encore. You can see this by viewing the infrastructure for the `staging` environment for the app.

For example, when the URL shortener app is deployed initially, you’ll see the provisioned Postgres database.

The infrastructure and Neon Database is managed by Encore. This is why it is not showing in your account (if you’ve already configured your Neon API key).

![Encore Dashboard Infrastructure](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-stage-db-1024x533-04ddad11.png)

## Deploy a Prod Environment with Neon

Next, you’ll create a new production environment and integrate your Neon account for database use.

### Configure Neon in your Encore Account

Visit the [Neon Console](https://console.neon.tech/), sign up, and create your first project by following the prompts in the UI. You can use an existing project or create another if you’ve already used Neon.

![Neon Postgres Getting Started](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/neon-getting-started-1024x789-2ea15d9a.png)

### Add the Neon API Key

Next, [create a Neon API ke](https://neon.tech/docs/manage/api-keys#create-an-api-key) y for your Neon account. Add this API key to the Neon section of the URL Shortener App Settings at `https://app.encore.dev/<app-id>/settings/integrations/neon` and **Save**.

![Encore link Neon account](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-neon-link-1024x692-7339bfaa.png)

This allows Encore to provision and configure Neon projects in your Neon account using the [Neon API](https://neon.tech/docs/reference/api-reference). So, instead of the production database being hosted in the Encore account; the production Neon database will be in your personal Neon account.

![Linked Neon account in Encore](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/linked-neon-account-1024x397-34d6d294.png)

Next, you’ll create the prod environment.

### Create a Production Encore environment

Create a new environment, `prod`, in the application and **Save**.

![Encore create environment](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-create-env-1024x742-c7cf304f.png)

For the application database, select Neon. Adjust the settings depending on your preferred region and **Encore > Neon** integration name (from the Neon API key settings).

![Encore create environment Postgres database](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-create-env-db-978x1024-4dbf3acb.png)

**Create** the environment.

### View the deployed app resources and Postgres database

Once the deployment is complete (which only takes a few seconds), you can test the app and view the database resources.

![Encore deployed Neon database](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-deployed-neon-db-1024x468-dad65805.png)

Not only is the app deployed and operational, but the Neon Postgres database has been created in your account, and the migrations have been applied. Using Neon Postgres Branching, Encore created a `prod` Postgres branch from the parent branch for the environment.

![Encore Neon branches](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-neon-branches-1024x211-4ae3393d.png)

Inspecting the database tables, we can see that the migrations were applied.

![Neon Postgres tables](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-schema-neon-1024x440-ec87ec26.png)

## Testing the URL shortener with cURL

Now, you can test the API service by using the Encore Cloud Dashboard with cURL.

```bash
curl 'https://<app-url>.encr.app/url' -d '{"url":"<url-to-create-id-for>"}'
```

After a successful request, you’ll see the data written into the integrated database in your Neon account.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres/encore-neon-populated-table-1024x493-1e8afc4f.png)

## Clean up

To clean up your application infrastructure. Navigate through each environment and remove the environment from the **environments > environment-name > settings** section.

## Conclusion

Using [Neon with Encore](https://encore.dev/blog/neon-serverless-postgres) offers a robust foundation for developing scalable API services across multiple environments and cloud platforms. Encore streamlines application development and deployment, while Neon manages your serverless Postgres database, enabling you to focus on innovation and speed.

Starting today, Encore supports using Neon Postgres for all Encore environments, including those in the cloud on AWS and GCP. This capability is now available for developers to take advantage of, enabling seamless database management across different environments and cloud providers.

To accelerate your development process and leverage the power of Neon Serverless Postgres, [sign up and try Neon for free](https://console.neon.tech/signup). Stay updated by following us on [Twitter/X](https://twitter.com/neondatabase), and join our [Discord](https://neon.tech/discord) community to share your experiences and explore how we can support you in building the next generation of applications.
