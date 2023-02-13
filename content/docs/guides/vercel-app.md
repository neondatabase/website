---
title: Deploy a Next.js app with Prisma and Vercel
enableTableOfContents: true
---

This guide describes how to setup and deploy a Next.js application on Vercel that creates a database branch in Neon for each Preview Deployment. Schema changes are managed using Prisma.

The example application is called NatureSnap. It is a simple photo gallery application for viewing nature photos. The application currently displays photographs only. The example shows how to modify the application to add the name of the photographer, demonstrating how you can use Neon integration with Vercel to create a database branch for each preview deployment.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [GitHub account](https://github.com/join)
- Prisma

## Clone the example application and install dependencies

1. Download the example **naturesnap** project.

    ```bash
    wget https://github.com/neondatabase/naturesnap/archive/refs/heads/main.zip
    unzip main.zip
    rm main.zip
    mv naturesnap-main naturesnap
    ```

    You can view the project's structure using the `tree` command:

    ```bash
    cd naturesnap
    tree
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

2. Install the dependencies in the project's root directory:

    ```bash
    npm install
    npm install dotenv
    ```

## Create a project in Neon

Create Neon project and name it `naturesnap`.

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select **Create a project**.
3. Enter `naturesnap` as the project name and select a PostgreSQL version and a region
4. Click **Create project**.

![Create naturesnap project](/docs/guides/ns_create_project.png)

Upon creating the project, you are presented with a dialog that provides connection details for your default project user. You can save the connection details, but a different user will be created for the application to access the database.

## Prepare your Neon project

In this step you create a user (a PostgreSQL role) that will be use by the NatureSnap application and two databases, one for NatureSnap data, and one for the Prisma shadow database that is required to perform schema migrations.

### Create the database user

Create a database user named `naturesnap`. The application uses the `naturesnap` user to access the application database. In the [Neon Console](https://console.neon.tech):

1. Select **Users**.
1. Select **New User**.
1. Enter `naturesnap` as the user name.
1. Click **Create**.

![Create naturesnap user](/docs/guides/ns_create_user.png)

Upon creating the user, you are presented with a dialog that provides connection details for the user. Copy the password

### Create the application database

Create a database for the application. Name the database `naturesnap`. In the [Neon Console](https://console.neon.tech):

1. Select **Databases**.
1. Click **New Database**.
1. Enter  `naturesnap` as the database name.
1. Select `naturesnap` as the database owner.
1. Click **Create**.

![Create naturesnap database](/docs/guides/ns_create_app_db.png)

### Create the shadow database for Prisma Migrate

Create a shadow database for Prisma Migrate, which is required to manage schema changes. Name the database `shadow`. 

In the [Neon Console](https://console.neon.tech):

1. Select **Databases**.
1. Click **New Database**.
1. Enter  `shadow` as the database name.
1. Select `naturesnap` as the database owner.
1. Click **Create**.

![Create shadow database](/docs/guides/ns_create_shadow_db.png)

## Create a .env file and add database URLs

1. Create a `.env` file at the root of your project director

    ```bash
    cd naturesnap
    touch .env
    ```

1. Add the `DATABASE_URL` and `SHADOW_DATABASE_URL` settings to your `.env` file. These settings are required to migrate the database schema to your databases. When finished, your `.env`  file should appear similar to:

    ```text
    DATABASE_URL=postgres://naturesnap:************@ep-snowy-water-747999.us-east-2.aws.neon.tech/naturesnap?sslmode=require&connect_timeout=0
    SHADOW_DATABASE_URL=postgres://naturesnap:************@ep-snowy-water-747999.us-east-2.aws.neon.tech/shadow?sslmode=require
    ```

## Migrate the project schema

Run the `prisma migrate dev` command to migrate the schema defined in the project's `schema.prisma` file to your `naturesnap` database:

```bash
$ npx prisma migrate dev

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "naturesnap", schema "public" at "ep-snowy-water-747999.us-east-2.aws.neon.tech:5432"
Applying migration `20230205191454_initial_migration`
The following migration(s) have been applied:

migrations/
  └─ 20230205191454_initial_migration/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)
npm WARN idealTree Removing dependencies.prisma in favor of devDependencies.prisma

added 316 packages, and audited 317 packages in 7s

113 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

changed 2 packages, and audited 317 packages in 4s

113 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

✔ Generated Prisma Client (4.8.1 | library) to ./node_modules/@prisma/client in 63ms
```

## Import the application data

From your project directory, run the following command to import data into the `naturesnap` database from the `/sql/init.sql` in your project directory:

```bash
psql postgres://naturesnap:************@ep-snowy-water-747999.us-east-2.aws.neon.tech/naturesnap < sql/init.sql
```

### Verify that data was imported

You can verify that the data was imported by viewing the tables in the Neon Console.

In the [Neon Console](https://console.neon.tech):

1. Select **Tables**
1. Select your primary branch.
1. Select the `naturesnap` database.
1. Select an application table (`snaps`, `topics`, or `users`) to view the project data.

![View application data](/docs/guides/ns_tables_view.png)

## Run the application

Run the following command to start the naturesnap application:

```bash
npm run dev
```

Navigate to http://localhost:3000 in your browser to view the application.

![View application initial state](/docs/guides/ns_app_initial_view.png)


## Initialize a Git repository and push the application code to GitHub

In the previous steps, you downloaded the application code and and performed sme initial configuration to get it up and running. In this step, you will initialize a Git repository locally so that you can push your code to a GitHub repository.

To do so, run `git init` from the source code folder:

```bash
cd naturesnap
git init
Initialized empty Git repository in /home/user1/naturesnap/.git/
```

With the repository initialized, add and commit the files:

```bash
git add . 
git commit -m 'Commit naturesnap code' 
```

Checkpoint: git log -1 should show the commit:

```bash
commit ca5ffcdc6ba1d32d60f254769034cd32e8423ba3 (HEAD -> master)
```

Push the code to your GitHub repository by adding the remote:

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_GITHUB_REPOSITORY_NAME>.git
git branch -M main
git push -u origin main
```

## Create a project in Vercel

1. Log in to your Vercel account.
1. Select **Add New** > **Project**.
1. Select your GitHib account.
1. Import your `naturesnap` repository.
1. On the Configure Project dialog, under Environment Variables, add entries for `DATABASE_URL` and `SHADOW_DATABASE_URL` variables that you defined earlier in your local `.env` file. These are required by Prisma.
1. Click **Deploy**.

![Deploy to Vercel](/docs/guides/ns_vercel_deploy.png)

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
Add new feature and table. I want to map the users of my app to the topics they participated in.
Modify the UI & update the prisma schema

### Inspect the changes

Check what I changed
I mapped users to the topics they participated in
I added UI elements and changed the schema

## Generate migration

Generate the migration based on the updated schema
Behind the scenes, I add data into the new table
From the photo authors, I can infer some first users to topics connections and add them right away

## Conclusion

Now it runs locally
The new small icons on the list of topics are topic participants, the data that i’ve added
The app now shows pictures in black/white for the topics that i haven’t participated in

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
