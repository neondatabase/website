---
title: 'Auth setup with Neon, Keycloak and Koyeb'
description: 'Learn how to use Keycloak with Neon, and how to deploy Keycloak on Koyeb.'
excerpt: >-
  Keycloak is an open-source identity and access management solution that
  centralizes authentication and authorization management. It provides features
  such as single sign-on (SSO), two-factor authentication, social login, and
  user federation with LDAP or Active Directory user fede...
date: '2023-12-15T19:15:41'
updatedOn: '2024-03-01T14:02:26'
category: community
categories:
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/auth-setup-with-neon-keycloak-and-koyeb/cover.jpg
  alt: Keycloak with Neon and Koyeb
isFeatured: false
seo:
  title: 'Auth setup with Neon, Keycloak and Koyeb - Neon'
  description: 'Learn how to use Keycloak with Neon, and how to deploy Keycloak on Koyeb.'
  keywords: []
  noindex: false
  ogTitle: 'Auth setup with Neon, Keycloak and Koyeb - Neon'
  ogDescription: >-
    Keycloak is an open-source identity and access management solution that
    centralizes authentication and authorization management. It provides
    features such as single sign-on (SSO), two-factor authentication, social
    login, and user federation with LDAP or Active Directory user federation.
    Various identity protocols such as Open ID Connect, SAML 2.0, and OAuth 2.0
    are supported, which makes integrating […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/auth-setup-with-neon-keycloak-and-koyeb/cover.jpg
---

![Keycloak with Neon and Koyeb](https://cdn.neonapi.io/public/images/pages/blog/auth-setup-with-neon-keycloak-and-koyeb/neon-keycloak1-1-1024x576-6059864e.jpg)

[Keycloak](https://www.keycloak.org/) is an open-source identity and access management solution that centralizes authentication and authorization management. It provides features such as single sign-on (SSO), two-factor authentication, social login, and user federation with LDAP or Active Directory user federation. Various identity protocols such as Open ID Connect, SAML 2.0, and OAuth 2.0 are supported, which makes integrating Keycloak with new and existing applications easy.

<br />Whether you’re a novice getting started with Keycloak or a veteran user, you’ll need a database to support your Keycloak deployment in production. Since Keycloak has first-class support for Postgres, this guide will outline a minimal setup to use Keycloak with Neon’s Postgres. All configurations and code in this guide can be found in the [neondatabase/keycloak-example](https://github.com/neondatabase/keycloak-example) repository on GitHub.

## Create a Neon project and Keycloak Database

Each Neon project includes a single Postgres instance that contains a `neondb` database by default. Still, it’s best to create a dedicated `keycloak` database to store Keycloak’s data.

To create a project, visit the [Neon console](https://console.neon.tech/app/projects). If it’s your first time visiting the console you should be prompted to create a new project as shown. If you already have a project you’d like to use, select it from the [projects list](https://console.neon.tech/app/projects).

![Image](https://cdn.neonapi.io/public/images/pages/blog/auth-setup-with-neon-keycloak-and-koyeb/create-project-1024x595-1e65d318.png)

Create the Keycloak database by visiting the [SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor) section of your project, and running the following query:

```sql
CREATE DATABASE keycloak;
```

You can verify that the `keycloak` database was created by viewing the **Databases** section of the Neon console or running the `SELECT datname FROM pg_database;` query in the **SQL Editor**.

## Configure a Keycloak Database User

Instead of accessing your new `keycloak` database using the default user with the [`neon_superuser`](https://neon.tech/docs/manage/roles#the-neonsuperuser-role) role, creating a new user named `keycloak_admin` is best. This new user will have administrative privileges limited to the `keycloak` database.

Use the Neon SQL Editor to input the commands to create the user and assign permissions:

1. Visit the **SQL Editor** in your project.
2. Select the `keycloak` database using the dropdown menu in the top-right.

Issue the following command to create a new user named `keycloak_admin`, making sure to replace the password with a value that has 60 bits of entropy, [per our documentation](https://neon.tech/docs/manage/roles#manage-roles-with-sql):

```sql
/* Create a strong password per: https://neon.tech/docs/manage/roles */
CREATE USER keycloak_admin WITH PASSWORD 'r3plac3_th1s';

/* Assign permissions to the `keycloak_admin` user */
GRANT ALL ON SCHEMA public TO keycloak_admin;
```

## Deploy Keycloak on Koyeb

Keycloak can be deployed on a machine with a JDK installed, or from a container image using Docker or Podman. Setting up infrastructure manually can be quite a chore, so instead I’ll show you how to deploy Keycloak on [Koyeb](https://koyeb.com) with valid SSL certificates. If they support deploying container images, you can replace Koyeb with your preferred hosting provider.

To get started, sign up for an account at [koyeb.com](https://koyeb.com). Next, click [this link](https://app.koyeb.com/apps/deploy?type=docker&image=quay.io%2Fkeycloak%2Fkeycloak%3A23.0.1&name=keycloak&env%5BKC_DB_USERNAME%5D=&env%5BKC_DB_PASSWORD%5D=&env%5BKC_DB_URL%5D=jdbc%3Apostgresql%3A%2F%2FNEON_HOSTNAME%2Fkeycloak%3Fsslmode%3Drequire&env%5BKC_HOSTNAME%5D=&env%5BKC_HTTP_ENABLED%5D=true&env%5BKC_PROXY%5D=edge&env%5BKC_DB%5D=postgres&ports=8080%3Bhttp%3B%2F&tag=23.0.1&docker.image.tag=23.0.1&image-tag=23.0.1&command=start&env%5BKEYCLOAK_ADMIN%5D=admin&env%5BKEYCLOAK_ADMIN_PASSWORD%5D=) to start deploying Keycloak on Koyeb from a template with some preconfigured values.

Set the following parameters for the deployment:

1. Instance type: Eco is adequate for testing.
2. Region: Choose the region closest to your Neon Postges database’s region.
3. Configure the following environment variables:
   1. `KC_DB_URL`: Replace the `NEON_HOSTNAME` with your Neon database’s hostname from the **Connection Details** on Neon’s console, e.g `ep-broken-hill-12345.us-east-2.aws.neon.tech`.
   2. `KC_DB_USERNAME`: `keycloak_admin`.
   3. `KC_DB_PASSWORD`: The password you set for `keycloak_admin`.
   4. `KC_HOSTNAME`: This must match the hostname you define when deploying the service on Koyeb. The hostname is listed at the bottom of the deploy page and is a combination of the App name and your organization name, e.g `keycloak-your-org.koyeb.app`.
   5. `KEYCLOAK_ADMIN_PASSWORD`: This will be the password you use to log in as the `admin` user and perform administrative actions in Keycloak

Click the **Deploy** button and you’ll be directed to a screen where you can monitor the status of your deployment.

![Image](https://cdn.neonapi.io/public/images/pages/blog/auth-setup-with-neon-keycloak-and-koyeb/koyeb-deploy-1024x578-f5f4ef84.png)

Scroll down to the bottom of this page and wait for the logs to print a line stating that Keycloak has started. It will resemble the following example:

```
Keycloak 23.0.1 on JVM (powered by Quarkus 3.2.9.Final) started in 33.009s. Listening on: https://0.0.0.0:8080
```

## Create a Keycloak Realm and Client

Keycloak uses the concept of [realms](https://www.keycloak.org/docs/latest/server_admin/#core-concepts-and-terms) to create a self-contained space where you manage users, roles, and authentication settings for one or more client applications. The `master` realm is created by default and is used to manage other realms. A realm contains one or more clients representing applications, e.g., a Next.js application deployed on a specific domain.

Return to your [Koyeb Apps list](https://app.koyeb.com/) and click on the hostname underneath your Keycloak service to visit the Keycloak welcome page. Click the link to access the **Administration Console** and log in using the username and password you set using `KEYCLOAK_ADMIN` and `KEYCLOAK_ADMIN_PASSWORD` when first deploying Keycloak.

The `master` realm will be selected by default. Use the dropdown in the top left corner to click the **Create realm** button. Upload the example [quickstart.json](https://github.com/neondatabase/keycloak-example/blob/main/realms/quickstart.json) realm file from the [neondatabase/keycloak-example](https://github.com/neondatabase/keycloak-example) repository to create a realm.

Once the realm is created you can see a sample user named `alice`, and a client named `nextjs-application` within the **Users** and **Clients** sections.

![Image](https://cdn.neonapi.io/public/images/pages/blog/auth-setup-with-neon-keycloak-and-koyeb/kc-users-1024x573-d1a821ac.png)

By querying some tables, you can confirm that Keycloak is using your Neon Postgres database. For example:

1. Visit the **SQL Editor** in your project on the [Neon console](https://console.neon.tech/).
2. Run the query `SELECT * from user_entity;`.

The user named `alice` defined in the sample realm JSON should be listed in the output.

![Image](https://cdn.neonapi.io/public/images/pages/blog/auth-setup-with-neon-keycloak-and-koyeb/user-alice-in-output-1024x553-5fcd469d.png)

## Connecting a Next.js Application to Keycloak

The repository associated with this blog post at [neondatabase/keycloak-example](https://github.com/neondatabase/keycloak-example) includes a Next.js application that uses [NextAuth.js](https://next-auth.js.org/) to integrate with Keycloak to perform user authentication.

Clone the repository, install the dependencies, and create a `.env.local` file:

```bash
git clone git@github.com:neondatabase/keycloak-example.git

cd keycloak-example/next-auth-example

cp .env.local.example .env.local

npm i
```

Edit the `.env.local` file so that the hostname of the `KEYCLOAK_ISSUER` points to your Keycloak instance, and generate an `AUTH_SECRET` using the instructions in the file. Start the application using the `npm run dev` command, and visit [https://localhost:3000](https://localhost:3000) to interact with it.

Click the **Sign In** button in the top right corner to initiate the OAuth-based login flow using Keycloak. You can sign in using the username `alice` and password `alice`. Once logged in you can visit the different pages in the application and view the user’s session data.

![Image](https://cdn.neonapi.io/public/images/pages/blog/auth-setup-with-neon-keycloak-and-koyeb/next-auth-logged-in-1-1024x573-2f11c6d0.png)

## Conclusion and Next Steps

Now you know how to use Neon as your Postgres storage provider for Keycloak. Consider crafting an [optimized Keycloak container](https://www.keycloak.org/server/containers#_creating_a_customized_and_optimized_container_image) for production deployment to decrease startup time, and refer to the [Keycloak database configuration guide](https://www.keycloak.org/server/db) for information on connection pooling and other database configuration properties. You can also experiment with Neon’s branching and [point-in-time restore](https://neon.tech/docs/guides/branching-pitr) capability to discover how to restore Keycloak data to an earlier version if needed.
