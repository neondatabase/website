---
title: Use Lakebase Postgres with Fly.io
subtitle: Connect a Lakebase Postgres database to your Node application deployed on
  Fly.io
summary: >-
  Deploy a Node.js Express app to Fly.io with Lakebase Postgres as the database
  backend. Covers pooled and direct connection strings, running migrations with
  a Fly release command, picking the Fly region closest to your Neon region,
  and deploying from the terminal, from GitHub, or with a coding agent.
enableTableOfContents: true
updatedOn: '2026-11-21T19:16:06.000Z'
---

[Fly.io](https://fly.io) runs applications on fast-booting VMs called Fly Machines. Fly builds a container image from your code and runs it in the region you pick.

This guide walks you through deploying a simple Node.js application connected to a Lakebase Postgres database on Fly.io. We'll deploy from the terminal with `flyctl`, the Fly.io CLI. You can also [deploy from GitHub](#deploy-from-github) or [with a coding agent](#deploy-with-a-coding-agent).

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Fly.io account. Sign up at [Fly.io](https://fly.io/app/sign-up) to get started.
- [Node.js](https://nodejs.org/) 20.6 or later and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Set up your Neon database

### Create a project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.

2. Click **New Project** to create a new project. Note the region you pick, since you'll deploy your Fly app close to it.

### Retrieve your Neon connection strings

You'll use two connection strings. Click the **Connect** button in the Console nav to find them:

- With the **Connection pooling** toggle on, copy the pooled connection string. The endpoint ID in its hostname has a `-pooler` suffix. Your app uses this one to serve requests.
- With the toggle off, copy the direct connection string. Migrations use this one, because schema changes should run over a direct connection. See [Connection pooling](/docs/connect/connection-pooling) for details.

They should look similar to this:

```bash
# Pooled
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
# Direct
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Keep both connection strings handy for later use.

## Build the Node.js application

We'll create a simple Express application that connects to our Neon database and retrieves the list of music albums, plus a small migration script that creates the table. Run the following commands in your terminal to set it up:

```bash
mkdir neon-fly-example && cd neon-fly-example
npm init -y && npm pkg set type="module" && npm pkg set scripts.start="node index.js"
npm install express pg
touch .env
```

We use the `npm pkg set type="module"` command to enable ES6 module support in our project. The `start` script is what Fly runs to start your app. We'll also create a new `.env` file to store the `DATABASE_URL` and `DIRECT_URL` environment variables, which we'll use to connect to our Neon database. Lastly, we install the `pg` library which is the Postgres driver we use to connect to our database.

In the `.env` file, store your Neon connection strings:

```bash
# .env
DATABASE_URL=NEON_POOLED_CONNECTION_STRING
DIRECT_URL=NEON_DIRECT_CONNECTION_STRING
```

Create a file named `migrate.js` that creates the `music_albums` table and adds some sample rows. It connects with `DIRECT_URL`:

```javascript filename="migrate.js"
import pkg from 'pg';

// Migrations use the direct (non-pooled) connection string
const { Client } = pkg;
const client = new Client({ connectionString: process.env.DIRECT_URL });
await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS music_albums (
    album_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL
  );
`);

// Add sample rows the first time the migration runs
const { rows } = await client.query('SELECT count(*)::int AS count FROM music_albums;');
if (rows[0].count === 0) {
  await client.query(`
    INSERT INTO music_albums (title, artist)
    VALUES
      ('Rumours', 'Fleetwood Mac'),
      ('Abbey Road', 'The Beatles'),
      ('Dark Side of the Moon', 'Pink Floyd'),
      ('Thriller', 'Michael Jackson');
  `);
}

await client.end();
console.log('Migration complete');
```

Now, create a new file named `index.js` and add the following code:

```javascript filename="index.js"
import express from 'express';
import pkg from 'pg';

const app = express();
const port = process.env.PORT || 3000;

// Create a new pool using your pooled Neon connection string
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/', async (req, res) => {
  try {
    // Fetch the list of music albums from your database using the postgres connection
    const { rows } = await pool.query('SELECT * FROM music_albums;');
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch albums', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

This code sets up an Express server that listens on port 3000. When you request `/`, the server queries the `music_albums` table in your Neon database and returns the results as JSON.

We can test this application locally by running the migration, then starting the server:

```bash
node --env-file=.env migrate.js
node --env-file=.env index.js
```

Now, navigate to `http://localhost:3000/` in your browser to check it returns the sample data from the `music_albums` table.

## Deploy to Fly.io

### Install flyctl and log in

Install `flyctl` with the following command, or follow the [installation instructions](https://docs.fly.io/flyctl/install) for your platform:

```bash
curl -L https://fly.io/install.sh | sh
```

Once installed, log in to your Fly.io account:

```bash
fly auth login
```

### Create a Fly app

From the project folder, run `fly launch` to create the app. Fly detects a Node.js application and generates a `Dockerfile`, a `.dockerignore` and a `fly.toml` configuration file.

```bash
fly launch --no-deploy --no-db --region ord
```

- `--no-deploy` creates the app without deploying it, so you can add the connection strings first.
- `--region` picks where your app runs. Choose the Fly region closest to your Neon project's region to keep query latency low. This example uses `ord` (Chicago) for a Neon project in `aws-us-east-2` (Ohio). See [Fly.io regions](https://docs.fly.io/reference/regions) for the full list.

| Neon region                      | Closest Fly region |
| :------------------------------- | :----------------- |
| `aws-us-east-1` (N. Virginia)    | `iad` (Ashburn)    |
| `aws-us-east-2` (Ohio)           | `ord` (Chicago)    |
| `aws-us-west-2` (Oregon)         | `sjc` (San Jose)   |
| `aws-eu-central-1` (Frankfurt)   | `fra` (Frankfurt)  |
| `aws-eu-west-2` (London)         | `lhr` (London)     |
| `aws-ap-southeast-1` (Singapore) | `sin` (Singapore)  |
| `aws-ap-southeast-2` (Sydney)    | `syd` (Sydney)     |
| `aws-sa-east-1` (São Paulo)      | `gru` (São Paulo)  |

Next, tell Fly to run the migration on every deploy. Add a `[deploy]` section with a `release_command` to the generated `fly.toml`:

```toml filename="fly.toml"
[deploy] # [!code ++]
  release_command = "node migrate.js" # [!code ++]
```

Fly runs the release command in a temporary Machine before it starts the new version of your app. If the migration fails, the deploy stops and the current version keeps running.

Then set both connection strings as secrets on your Fly app. Fly encrypts secrets and passes them to your app and the release command as environment variables.

```bash
fly secrets set DATABASE_URL='NEON_POOLED_CONNECTION_STRING' DIRECT_URL='NEON_DIRECT_CONNECTION_STRING'
```

### Deploy your application

Deploy the application with:

```bash
fly deploy
```

Fly builds the image, runs the migration, starts your app on Fly Machines, and prints the URL of your app when it's done, for example `https://neon-fly-example.fly.dev/`. Open it in your browser, or run `fly open`, to see the list of albums from your Neon database.

<Admonition type="tip">
By default, Fly stops Machines when your app has no traffic and starts them again on the next request. Neon also scales to zero when idle, so the first request after a quiet period can take a moment while both start.
</Admonition>

You've now deployed a Node.js application on Fly.io that connects to a Lakebase Postgres database. To deploy changes, run `fly deploy` again.

## Other ways to deploy

### Deploy from GitHub

If you haven't run `fly launch`, you can deploy from GitHub instead. The dashboard doesn't run `migrate.js`, so run it from your machine before the first deploy and after each schema change:

```bash
node --env-file=.env migrate.js
```

Push your project to a new GitHub repository, keeping `node_modules` and your `.env` file out of it:

```bash
echo "node_modules/" > .gitignore && echo ".env" >> .gitignore
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Then, in the [Fly.io dashboard](https://fly.io/dashboard):

1. Click **Launch an App** > **From GitHub**. If you don't have any apps yet, click **Connect GitHub** or **Choose a repository** instead.
2. Pick your repository. Under **Machine**, set **Region** to the Fly region closest to your Neon project.
3. Under **Environment variables**, add `DATABASE_URL` with your pooled connection string. Fly stores these as secrets.
4. Click **Deploy**.

Fly builds and deploys the app, and deploys it again each time you push to the branch. If you'd rather deploy from your own CI, see [Continuous deployment with GitHub Actions](https://docs.fly.io/launch/continuous-deployment-with-github-actions).

### Deploy with a coding agent

A coding agent can create the Neon project and deploy the app.

1. Set up Neon in your agent by following [Set up your AI agent](/docs/ai/agent-setup). This adds the [Neon MCP Server](/docs/ai/neon-mcp-server), so the agent can create a project, run SQL and get a connection string.
2. Set up Fly.io in your agent with [`fly setup agent`](https://docs.fly.io/model-context-protocol/setup-agent). This installs the Fly.io agent skills and the Fly.io MCP server, and signs you in to Fly.io. It needs flyctl v0.5.2 or later, so run `fly version upgrade` first.

   ```bash
   fly setup agent
   ```

3. Restart your agent and give it a prompt like this one:

   ```text
   Create a Neon project and build a small Express app that returns rows from a
   music_albums table as JSON. Add a migration that creates the table and runs as the
   Fly release command. Deploy it to Fly.io in the region closest to the Neon project,
   with the pooled connection string as DATABASE_URL and the direct one as DIRECT_URL.
   ```

## Remove your application and Neon project

To remove your application from Fly.io, run the following command, replacing `neon-fly-example` with your app's name:

```bash
fly apps destroy neon-fly-example
```

To delete your Neon project, follow the steps outlined in the Neon documentation under [Delete a project](/docs/manage/projects#delete-a-project).

## Resources

- [Fly.io Documentation](https://docs.fly.io/)
- [JavaScript on Fly.io](https://docs.fly.io/js)
- [flyctl reference](https://docs.fly.io/flyctl)
- [Neon](/docs)

<NeedHelp/>
