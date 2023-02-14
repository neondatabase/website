---
title: Deploy a Next.js app with Prisma and Vercel
enableTableOfContents: true
---

This guide describes how to deploy a Next.js application with Prisma and Vercel and use the Neon-Vercel integration to create a database branch for each preview deployment.

The example application is called **naturesnap**. It is a simple photo gallery application for viewing nature photos. In this guide, you will deploy the application to Vercel, add the Neon integration, and make changes to the application and database schema. When you create a pull request for your changes, the Neon integration automatically creates a database branch for your preview deployment.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [GitHub account](https://github.com/join)
- A working installation of [psql](https://www.postgresql.org/download/)

## Set up the application

1. Download the example **naturesnap** project.

    ```bash
    wget https://github.com/neondatabase/naturesnap/archive/refs/heads/main.zip
    unzip main.zip
    rm main.zip
    mv naturesnap-main naturesnap
    ```

2. Install the dependencies in the project's root directory:

    ```bash
    npm install
    npm install dotenv
    ```

3. Create a Neon project.
    1. Navigate to the [Neon Console](https://console.neon.tech).
    1. Select **Create a project**.
    1. Enter `naturesnap` as the project name and select a PostgreSQL version and a region
    1. Click **Create project**.

    ![Create naturesnap project](/docs/guides/ns_create_project.png)

    Upon creating the project, you are presented with a dialog that provides connection details for your default project user. You will create a different user for the application, so you do not have to save this information.
4. Create a database user named `naturesnap`, which the application uses to access the `naturesnap` application database. In the [Neon Console](https://console.neon.tech):
    1. Select **Users**.
    1. Select **New User**.
    1. Enter `naturesnap` as the user name.
    1. Click **Create**.
    ![Create naturesnap user](/docs/guides/ns_create_user.png)
    1. Upon creating the user, you are presented with a dialog that provides connection details for the user. Save the password. It is required in a later step.
5. Create a database for the application and call it it `naturesnap`. In the [Neon Console](https://console.neon.tech):
    1. Select **Databases**.
    1. Click **New Database**.
    1. Enter  `naturesnap` as the database name.
    1. Select `naturesnap` as the database owner.
    1. Click **Create**.
    ![Create naturesnap database](/docs/guides/ns_create_app_db.png)
6. Create a shadow database for Prisma Migrate. In the [Neon Console](https://console.neon.tech):
    1. Select **Databases**.
    1. Click **New Database**.
    1. Enter  `shadow` as the database name.
    1. Select `naturesnap` as the database owner.
    1. Click **Create**.
    ![Create shadow database](/docs/guides/ns_create_shadow_db.png)
7. Create a `.env` file at the root of your project directory and add the `DATABASE_URL` and `SHADOW_DATABASE_URL` environment variables and set the values to the URLs for the `naturesnp` and `shadow` databases. Prisma Migrate requires these settings to migrate the database schema to the databases. You retrive the connection strings from the **Connection Details** widget on the Neon Dashboard. Don't forget to add the password to the connection string for the `naturesnap` user you created previously.

    ```bash
    cd naturesnap
    touch .env
    ```

    When finished, your `.env`  file should appear similar to the following (your hostname will differ).

    ```text
    DATABASE_URL=postgres://naturesnap:************@ep-snowy-water-747999.us-east-2.aws.neon.tech/naturesnap?sslmode=require&connect_timeout=0
    SHADOW_DATABASE_URL=postgres://naturesnap:************@ep-snowy-water-747999.us-east-2.aws.neon.tech/shadow?sslmode=require
    ```

8. Run the `prisma migrate dev` command to migrate the schema defined in the project's `schema.prisma` file to your `naturesnap` database.

    ```bash
    $ npx prisma migrate dev    
    ```

9. From your project directory, run the following `psl` command to import data into the `naturesnap` database from the `/sql/init.sql` in your project directory:

    ```bash
    psql postgres://naturesnap:************@ep-snowy-water-747999.us-east-2.aws.neon.tech/naturesnap < sql/init.sql
    ```

10. Verify that the data was imported. In the [Neon Console](https://console.neon.tech):
    1. Select **Tables**.
    1. Select your primary branch.
    1. Select the `naturesnap` database.
    1. Select an application table (`snaps`, `topics`, or `users`) to view the project data.
    ![View application data](/docs/guides/ns_tables_view.png)
11. Run the following command to start the **naturesnap** application locally:

    ```bash
    npm run dev
    ```

    Navigate to http://localhost:3000 in your browser to view the application.

    ![View application initial state](/docs/guides/ns_app_initial_view.png)

## Push your code to GitHub

In the previous steps, you set up the **naturesnap** application to run locally. In this step, you will push your code to a GitHub repository.

1. Initialize the repository by running `git init` from the source code folder:

    ```bash
    cd naturesnap
    git init
    Initialized empty Git repository in /home/user1/naturesnap/.git/
    ```

2. With the repository initialized, add and commit the files:

    ```bash
    git add . 
    git commit -m 'Commit naturesnap code' 
    ```

3. Push the code to your GitHub repository by adding the remote:

    ```bash
    git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_GITHUB_REPOSITORY_NAME>.git
    git branch -M main
    git push -u origin main
    ```

## Create a project in Vercel

In the previous step, you pushed your code to GitHub. You can now deploy your application to Vercel.

1. Log in to your Vercel account.
1. Select **Add New** > **Project**.
1. Select your GitHub account.
1. Import your `naturesnap` repository.
1. On the **Configure Project** dialog, under **Environment Variables**, add entries for the `DATABASE_URL` and `SHADOW_DATABASE_URL` variables that you defined earlier in your local `.env` file. These settings required by Prisma Migrate.
1. Click **Deploy**.

![Deploy to Vercel](/docs/guides/ns_vercel_deploy.png)

When the deployment completes successfully, Vercel notifies you and provides links for viewing the deployment. You can also select **Depolyments** in Vercel, locate the the deployment, and select **Inspect Deployment** from the kebab menu to view the **Deployment** page, which lists the deployment links.

![Completed Vercel deployment](/docs/guides/ns_vercel_deployment.png)

## Add the Neon Integration

In the previous step you deployed your application to Vercel. In this step, you will add the Neon integration to your Vercel project. The Neon integration does the following:

- **Connects your Vercel project to your Neon project**. The integration establishes a connection by setting the following environment variables: `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, and `DATABASE_URL`.
- **Creates a database branch for each preview deployment**. The integration creates a database branch for the preview deployment that is generated when you create a pull request in your project's GitHub repository.
- **Creates a database for your development environment**. By default, the integration creates a `vercel-dev` branch for your Vercel development environment. You will use this branch to make schema changes.

### Before you begin

The Neon integration sets the `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, and `DATABASE_URL` in your Vercel project. If these variables are already configured, the integration cannot be added. In an earlier step, you configured the `DATABASE_URL` variable in order to deploy the **naturesnap** application code to Vercel. Now, you must remove or rename the `DATABASE_URL` variable before adding the Neon integration (because the integration needs to set it).

1. In Vercel, select the **naturesnap** project.
1. Select **Settings** > **Environment Variables**.
1. Edit the `DATABASE_URL` environment variable to change its name or remove it entirely

![Rename DATABASE_URL variable](/docs/guides/ns_vercel_rename_variable.png)

### Add the integration

1. Navigate to the [Neon Vercel integrations page](https://vercel.com/integrations/neon), and click **Add integration**.
![Add integration](/docs/guides/vercel_add_integration.png)
1. Select a Vercel account to add the integration to.
1. Select the Vercel project to add the integration to. Select the **naturesnap** project.
1. Review the permissions required by the integration, and click **Add Integration**.
1. In the **Integrate Neon** dialog:
    1. Select the Vercel project. Select the **naturesnap** project if it is not already selected.
    ![Select a Vercel project](/docs/guides/ns_vercel_select_project.png)
    1. Select the Neon **naturesnap** project, the **naturesnap** database, and the **naturesnap** role that Vercel will use to connect. 
    ![Connect to Neon](/docs/guides/ns_vercel_connect_neon.png)

        You have the option to create a database branch for your Vercel development environment. Selecting this option creates a branch named `vercel-dev` and sets Vercel development environment variables for it. The `vercel-dev` branch is a copy-on-write clone of your production branch that you can modify without affecting your production data. You will use `vercel-dev` branch to make schema changes later, so make sure this option is selected.

        When you finish making selections, click **Continue**.
    1. Confirm the integration settings. This allows the integration to:

        - Reset the database user's password, enabling the integration to configure the environment variables that require a password.
        - Set environment variables for your Vercel project's production, development, and preview environments.
        - Create database branches for preview deployments.
        - Create a development branch for your Vercel development environment.
    ![Confirm integration settings](/docs/guides/ns_vercel_confirm_settings.png)

        Click **Connect** to proceed with the integration. If you encounter a connection error, see [Troubleshoot connection issues](/docs/guides/vercel#troubleshoot-connection-issues).

        Once the settings are configured, you are presented with a **Success!** dialog where you can copy the new password for your `naturesnap` database user. Copy the password. You will need it to update the URLs in your local `.env` file.
        ![Vercel integration success](/docs/guides/ns_vercel_success.png)
    1. Click **Done** to complete the installation.
1. To view the results of the integration in Neon:
    1. Navigate to the [Neon Console](https://console.neon.tech/).
    1. Select the project you connected to.
    1. Select **Branches**.
    You will see the primary branch of your project. You will also see the `vercel-dev` branch.
    ![Verify Neon settings](/docs/guides/ns_verify_neon.png)
1. To view the results of the integration in Vercel:
    1. Navigate to [Vercel](https://vercel.com/).
    1. Select the Vercel project you added the integration to.
    1. Select **Settings** > **Environment Variables**. You will see the `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, and `DATABASE_URL` variable settings added by the integration.
    ![Verify Vercel settings](/docs/guides/ns_verify_vercel.png)

## Deploy a preview

You have successfully added the Neon integration. It's now time to try it. In the following steps, you will create a local Git branch to update the  **naturesnap** application and database schema. You will then add a model named `UserTopics` to your `schema.prisma` file, which associates a user with a topic (e.g., boats, flowers, islands, etc.), and change the application so that that it displays topics in black and white to identify the topics a user has not participated. Finally, you will commit your changes and create a pull request, which triggers a preview deployment in Vercel. The schema and application changes are already present in the **naturesnapp** application code, so you only need to uncomment a few lines.

### Update the schema and application

1. Navigate to your local **naturesnapp** project directory, and create a Git branch:

    ```bash
    git checkout -b add_user_topics
    ```

1. In the your project's `prisma/schema.prisma` file, uncomment lines 20, 40, and lines 44 to 51 by removing the forward slashes. This change will add the `UserTopics` table.

    ```text
            model User {
            id      Int    @id @default(autoincrement())
            username String @unique
            avatar String
            snaps   Snap[]
    20      // topics  UserTopics[]
            @@map("users")
            }

            model Snap {
            id    Int    @id @default(autoincrement())
            name  String
            image String
            author User @relation(fields: [authorId], references: [id])
            authorId Int
            topic Topic @relation(fields: [topicId], references: [id])
            topicId Int
            createdAt DateTime @default(now())
            @@map("snaps")
            }

            model Topic {
            id    Int    @id @default(autoincrement())
            name  String
            snaps Snap[]
    40      // users UserTopics[]
            @@map("topics")
            }

    44      // model UserTopics {
    45      //   id      Int    @id @default(autoincrement())
    46      //   user    User @relation(fields: [userId], references: [id])
    47      //   userId  Int
    48      //   topic   Topic @relation(fields: [topicId], references: [id])
    49      //   topicId Int
    50      //   @@map("user_topics")
    51      // }
    ```

1. In your project's `pages/index.tsx` file, uncomment lines 22 and 32:

    ```text
    22         // users: { select: { user: true }, distinct: ['userId'] },


    32         // users: topic.users.map((u) => u.user),  
    ```

1. Update the `DATABASE_URL` and `SHADOW_DATABASE_URL` environment variables in your `.env` file at the root of your local project directory to point to your `vercel-dev` branch. You can find the URLs in your Vercel development environment variable settings.

    ![Vercel development branch settings](/docs/guides/ns_vercel_dev_settings.png)

   ```text
    DATABASE_URL=postgres://naturesnap:<new_password>@ep-quiet-snow-121552.us-east-2.aws.neon.tech/naturesnap?sslmode=require&connect_timeout=0
    SHADOW_DATABASE_URL=postgres://naturesnap:<new_password>@ep-quiet-snow-121552.us-east-2.aws.neon.tech/shadow?sslmode=require
    ```

1. At the root of your local project directory, run the Prisma Migrate command to create the `user_topics` table in Neon:

    ```bash
    npx prisma migrate dev --name add_user_topics
    Environment variables loaded from .env
    Prisma schema loaded from prisma/schema.prisma
    Datasource "db": PostgreSQL database "naturesnap", schema "public" at "ep-snowy-water-747999.us-east-2.aws.neon.tech"

    Applying migration `20230213195808_add_user_topics`

    The following migration(s) have been created and applied from new schema changes:

    migrations/
    └─ 20230213195808_add_user_topics/
        └─ migration.sql

    Your database is now in sync with your schema.

    ✔ Generated Prisma Client (4.9.0 | library) to ./node_modules/@prisma/client in 92ms
    ```

1. The `user_topics` table in your `vercel_dev` branch will be empty. Run the following query in the Neon SQL Editor to populate it with data:

    In the Neon Console:

    1. Navigate to the SQL Editor.
    1. Select the `vercel-dev` branch and the `naturesnap` database.
    1. Run the following query to populate the table:

        ```sql
        INSERT INTO user_topics ("userId", "topicId")
        SELECT "authorId", "topicId"
        FROM snaps
        WHERE NOT EXISTS (
        SELECT *
        FROM user_topics
        WHERE user_topics."userId" = snaps."authorId"
            AND user_topics."topicId" = snaps."topicId"
        )
        ```

        ![Add data in the SQL Editor](/docs/guides/ns_populate_user_topics.png)

1. Run the following command to start the **naturesnap** application and view the changes locally:

    ```bash
    npm run dev
    ```

    You should now see user avatars associated with each topic, and the topics that are not participated in are shown in black and white.

    ![Updated naturesnap app](/docs/guides/ns_app_updated_view.png)

### Push the changes and create a pull request

1. Commit the changes:

    ```bash
    git add pages/index.tsx && git add prisma/* && git commit -m 'add user topics'
    [add_user_topics 5226df1] add user topics
    3 files changed, 26 insertions(+), 12 deletions(-)
    create mode 100644 prisma/migrations/20230213195808_add_user_topics/migration.sql
    ```

1. Push the changes to a new branch on GitHub.

    ```bash
    git push --set-upstream origin add_user_topics
    Enumerating objects: 15, done.
    Counting objects: 100% (15/15), done.
    Delta compression using up to 2 threads
    Compressing objects: 100% (8/8), done.
    Writing objects: 100% (9/9), 1.02 KiB | 1.02 MiB/s, done.
    Total 9 (delta 4), reused 0 (delta 0), pack-reused 0
    remote: Resolving deltas: 100% (4/4), completed with 4 local objects.
    remote: 
    remote: Create a pull request for 'add_user_topics' on GitHub by visiting:
    remote:      https://github.com/user1/naturesnap/pull/new/add_user_topics
    remote: 
    To github.com:user1/naturesnap.git
    * [new branch]      add_user_topics -> add_user_topics
    Branch 'add_user_topics' set up to track remote branch 'add_user_topics' from 'origin'.
    ```

1. Create the pull request in GitHub by navigating to the provided link. Creating a pull request triggers a preview deployment in Vercel.
1. View the status of your preview deployment in Vercel:

    1. Select the **naturesnap** project.
    2. Select **Deployments**.
    3. Select the most recent deployment for your **naturesnap** project.

    ![View preview deployment in Vercel](/docs/guides/ns_check_deployment.png)
1. View your deployment preview branch in Neon

    The Neon integration created a new branch for the preview deployment with the schema changes that you committed. The branch has the same name as your git branch, which is `add_user_topics`. In Vercel, the Neon integration sets the preview environment variables for the new branch. To view the branch, select **Branches** in the Neon Console.

    ![View preview branch in Neon](/docs/guides/ns_neon_preview_branch.png)

## Conclusion

Following the steps in this guide, you deployed an application to Vercel and added the Neon integration. You then made changes to the application and database schema, and when you created a pull request with your changes, the Neon integration automatically created a database branch for the preview deployment.
