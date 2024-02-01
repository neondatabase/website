---
title: Use Neon with Deno Deploy
subtitle: Connect a Neon Postgres database to your Deno Deploy application
enableTableOfContents: true
updatedOn: '2023-10-07T10:43:33.385Z'
---

Deno Deploy is a highly scalable serverless platform for running JavaScript, TypeScript, and WebAssembly at the edge, designed by the creators of Deno. It simplifies the deployment process and offers automatic scaling, zero-downtime deployments, and global distribution.

This guide demonstrates how to connect a Neon Postgres database with an application deployed on Deno Deploy. To follow the instructions in this guide, you will need:

- A Deno Deploy account to deploy your application. Visit [Deno Deploy](https://deno.com/deploy) to sign up or log in.
- A Neon account to deploy your Postgres database. Sign up at [Neon](https://neon.tech) if you haven't already.

## Create a Neon Project

1. Go to the [Neon Console](https://console.neon.tech/).
2. Click **Create a project**.
3. Provide a name for your project, e.g., `deno-neon-app`, choose your preferred Postgres version, and select a region.
4. Hit **Create project**.

After creating the project, you will receive a Neon connection string that looks like this:

```plaintext
postgres://[user]:[password]@[neon_hostname]/[dbname]
```

Make note of this connection string. It will be used to connect your Deno Deploy application to your Neon database.

## Deploy Your Application with Deno Deploy

With your Neon database ready, the next step is to deploy your Deno application that uses this database. Here's a simplified overview of deploying a basic Deno app to Deno Deploy:

1. Develop your Deno application locally. Ensure it uses the Neon connection string to interact with your Postgres database. You might use the `postgres` module available in Deno's third-party modules for database operations.
2. After testing your application locally, push your code to a GitHub repository.
3. Go to [Deno Deploy](https://dash.deno.com/) and create a new project.
4. Link your GitHub repository to Deno Deploy and select the branch you wish to deploy from.
5. Add your Neon connection string as an environment variable (`DATABASE_URL`) in the settings of your Deno Deploy project. This step is crucial for your application to access the database securely.
6. Deploy your application. Deno Deploy will automatically build and distribute your application globally.

## Verifying the Deployment

Once your application is deployed on Deno Deploy, you can verify its connection to the Neon database by invoking endpoints that interact with the database. For example, if your application includes an endpoint to fetch data from the database, access this URL through your browser or use a tool like `curl` to see if the data is returned as expected.