---
title: Deploy a Next.js app with Prisma and Vercel
enableTableOfContents: true
---

This guide describes how to setup and deploy a Next.js application on Vercel that creates a database branch in Neon for each Preview Deployment. Schema changes are managed using Prisma.

The example application is called NatureSnap. It is a simple photo gallery application for viewing nature photos. The application currently displays photographs only. The example shows how to modify the application to add the name of the photographer, demonstrating how you can use Neon integration with Vercel to create a database branch for each preview deployment.

## Prerequisites

- A Vercel account
- A GitHub account
- Prisma

## Clone the example application and install dependencies

1. Clone the example NatureSnap project.

    ```bash
    git clone https://github.com/neondatabase/naturesnap.git
    ```

    The project directory has the following structure:

    ```bash
    $ tree
    └── naturesnap
        ├── components
        │   ├── Breadcrumbs.tsx
        │   ├── Layout.tsx
        │   ├── Navbar.tsx
        │   ├── SnapCard.tsx
        │   └── SnapGroup.tsx
        ├── data.ts
        ├── lib
        │   ├── prisma.ts
        │   └── utils.ts
        ├── next.config.js
        ├── package.json
        ├── package-lock.json
        ├── pages
        │   ├── api
        │   │   └── hello.ts
        │   ├── _app.tsx
        │   ├── _document.tsx
        │   ├── index.tsx
        │   └── my
        │       └── index.tsx
        ├── postcss.config.js
        ├── prisma
        │   ├── migrations
        │   │   ├── 20230205191454_initial_migration
        │   │   │   └── migration.sql
        │   │   └── migration_lock.toml
        │   └── schema.prisma
        ├── public
        │   ├── favicon.ico
        │   ├── me.png
        │   ├── user1.jpeg
        │   ├── user2.jpeg
        │   ├── user3.jpeg
        │   ├── user4.jpeg
        │   └── user5.jpeg
        ├── README.md
        ├── sql
        │   ├── init.sql
        │   └── migrate.sql
        ├── styles
        │   ├── globals.css
        │   └── Home.module.css
        ├── tailwind.config.js
        ├── tsconfig.json
        └── types.ts

    12 directories, 35 files
    ```

2. Install the dependencies:

    ```bash
    cd naturesnap
    npm install
    npm install dotenv
    ```

## Initialize a Git repository and push the application code to GitHub

## Deploy the application on Vercel

## Create a project in Neon

Create Neon project and name it `naturesnap`.

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select **Create a project**.
3. Enter `naturesnap` as the project name and select a PostgreSQL version and a region
4. Click **Create Project**.

![Create naturesnap project](/docs/guides/ns_create_project.png)

Upon creating the project, you are presented with a dialog that provides connection details for the project. Passwords are reset in a later step, so you don't need this information yet. You can close the dialog.

## Prepare your Neon project

In this step you create a user (a PostgreSQL role) that will be use by the NatureSnap application and two databases, one for NatureSnap data, and one for the Prisma shadow database that is required to perform schema migrations.

### Create the database user

Create a database user named `naturesnap`. In the [Neon Console](https://console.neon.tech):

1. Select **Users**.
1. Select **New User**.
1. Enter `naturesnap` as the user name.
1. Click **Create**.

role and two databases: naturesnap and shadow. Then add the DATABASE_URL and SHADOW_DATABASE_URL to the .env file:

Create a database user that will be used by the application to access the application database. Name the user `naturesnap`.

### Create the application database

Create a database for the application. Name the database `naturesnap`. In the [Neon Console](https://console.neon.tech):

1. Select **Databases**.
1. Click **New Database**.
1. Enter  `naturesnap` as the database name.
2. Select `naturesnap` as the database owner.
1. Click **Create**.

### Create the shadow database for Prisma Migrate

Create a shadow database for Prisma Migrate, which is required to manage schema changes. Name the database `shadow`. In the [Neon Console](https://console.neon.tech):

1. Select **Databases**.
1. Click **New Database**.
1. Enter  `shadow` as the database name.
2. Select `naturesnap` as the database owner.
1. Click **Create**.

## Import the application data

Import data for the NatureSnap application.

### Verify that data was imported

Verify that the data was imported by viewing the data from the Neon Console.

## Add the Neon Integration to your Vercel account

Add the Neon-Vercel integration.

### View the results of the integration

View the results of the integration in Neon and Vercel

## Set the shadow database and development environment variables

couple of small things to really get me going in dev
populate the shadow database url for prisma migrations

now i’m set to developer locally
let’s check the env variables that i have locally
these will need to be updated, so i’ll just pull the new set of env variables from vercel
the app can run locally now and i use new neon branch here!

## Update the application and database locally

create a new branch
Add new feature and table: i want to map the users of my app to the topics they participated in
modify the UI & update the prisma schema

### Inspect the changes

Check what I changed
I maped users to the topics they participated in
I added UI elements and changed the schema

## Generate migration

Generate the migration based on the updated schema
Behind the scenes, I actually add data into the new table
From the photo authors, I can infer some first users to topics connections and add them right away

## Conclusion

Now it runs locally
The new small icons on the list of topics are topic participants, the data that i’ve added
The app now shows in black/white, the topics that i haven’t participated in 

Time to commit the changes!
just a quick check before i do that
all good, ready to push this new branch to git

my branch is on now github

Vercel picks it up
notifies Neon
neon picked this up and created a new database branch for my preview, add user topics!

In Vercel, Neon has pushed the new DATABASE_URL variable to the Vercel preview environment variables, specific to my new branch

Vercel is building
Deployed

and this runs my migrations and seed the data as part of them too
