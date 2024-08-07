---
title: Use Neon Postgres with Railway
subtitle: Connect a Neon Postgres database to your Node application deployed with
  Railway
enableTableOfContents: true
updatedOn: '2024-07-02T18:38:56.218Z'
---

[Railway](https://railway.app) is an application deployment platform that allows users to develop web applications locally, provision infrastructure and then deploy to the cloud. Railway integrates with GitHub for continuous deployment and supports a variety of programming languages and frameworks.

This guide shows how to deploy a simple Node.js application connected to a Neon Postgres database on Railway.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Railway account. If you do not have one, sign up at [Railway](https://railway.app) to get started.
- A GitHub account. Railway integrates with Gitub for continuous deployment. So, you'd need a GitHub account to upload your application code.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.

2. Click the `New Project` button to create a new project.

3. From your project dashboard, navigate to the `SQL Editor` from the sidebar, and run the following SQL command to create a new table in your database:

   ```sql
   CREATE TABLE plant_care_log (
       id SERIAL PRIMARY KEY,
       plant_name VARCHAR(255) NOT NULL,
       care_date DATE NOT NULL
   );
   ```

   Next, we insert some sample data into the `plant_care_log` table, so we can query it later:

   ```sql
   INSERT INTO plant_care_log (plant_name, care_date)
   VALUES
       ('Monstera', '2024-01-10'),
       ('Fiddle Leaf Fig', '2024-01-15'),
       ('Snake Plant', '2024-01-20'),
       ('Spider Plant', '2024-01-25'),
       ('Pothos', '2024-01-30');
   ```

### Retrieve your Neon database connection string

Log in to the Neon Console and navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

## Implementing the Node.js application

We'll create a simple Express application that connects to our Neon database and retrieves the list of plants tended to within the last month. Run the following commands in a terminal to set it up.

```bash
mkdir neon-railway-example && cd neon-railway-example
npm init -y && npm pkg set type="module"
npm install express pg
touch .env
```

We use the `npm pkg set type="module"` command to enable ES6 module support in our project. We also create a new `.env` file to store the `DATABASE_URL` environment variable, which we'll use to connect to our Neon database. Lastly, we install the `pg` library which is the Postgres driver we use to connect to our database.

```bash
# .env
DATABASE_URL=NEON_DATABASE_CONNECTION_STRING
```

Now, create a new file named `index.js` and add the following code:

```javascript
import express from 'express';
import pkg from 'pg';

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON bodies for this app
app.use(express.json());

// Create a new pool using your Neon database connection string
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/', async (req, res) => {
  try {
    // Fetch the list of plants from your database using the postgres connection
    const { rows } = await pool.query('SELECT * FROM plant_care_log;');
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch plants', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

This code sets up an Express server that listens for requests on port 3000. When a request is made to the `URL`, the server queries the `plant_care_log` table in your Neon database and returns the results as JSON.

We can test this application locally by running:

```bash
node --env-file=.env index.js
```

Now, navigate to `http://localhost:3000/` in your browser to check it returns the sample data from the `plant_care_log` table.

## Push Your application to GitHub

To deploy your application to Railway, you need to push your code to a GitHub repository. Create a new repository on GitHub by navigating to [GitHub - New Repo](https://github.com/new). You can then push your code to the new repository using the following commands:

```bash
echo "node_modules/" > .gitignore && echo ".env" >> .gitignore
echo "# neon-railway-example" >> README.md
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

You can visit the GitHub repository to verify that your code has been pushed successfully.

## Deploying to Railway

### Creating a new Railway project

Log in to your Railway account and navigate to the dashboard. Click on the `New Project` button and select the `Deploy from Github repo` option. Pick the repository you created above, which sets off a Railway deployment.

Railway automatically figures out the type of application you're deploying and sets up the necessary build and start commands. However, we still need to add the `DATABASE_URL` environment variable to connect to our Neon database.

Select the project and navigate to the `Variables` tab. Add a new variable named `DATABASE_URL` and set its value to your Neon database connection string. You can redeploy the project by clicking on `Redeploy` from the context menu of the latest deployment.

### Verify Deployment

Once the deployment completes and is marked as `ACTIVE`, Railway provides a public URL for accessing the web service. Visit the provided URL to verify that your application is running and can connect to your Neon database.

Whenever you update your code and push it to your GitHub repository, Railway will automatically build and deploy the changes to your web service.

## Removing Your Application and Neon Project

To remove your application from Railway, select the project and navigate to the `Settings` tab. Scroll down to the end to find the "Delete Service" option.

To delete your Neon project, follow the steps outlined in the Neon documentation under [Delete a project](/docs/manage/projects#delete-a-project).

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/deploy-with-railway" description="Connect a Neon Postgres database to your Node application deployed with Railway" icon="github">Use Neon Postgres with Railway</a>
</DetailIconCards>

## Resources

- [Railway platform](https://railway.app/)
- [Neon](https://neon.tech)

<NeedHelp/>
