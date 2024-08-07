---
title: Use Neon Postgres with Render
subtitle: Connect a Neon Postgres database to your Node application deployed with Render
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.664Z'
---

[Render](https://render.com) is a comprehensive cloud service that provides hosting for web applications and static sites, with PR previews, zero-downtime deployments, and more. Render supports full-stack applications, offering both web services and background workers.

This guide shows how to deploy a simple Node.js application connected to a Neon Postgres database on Render.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Render account. If you do not have one, sign up at [Render](https://render.com) to get started.
- A GitHub account. Render integrates with public Github providers for continuous deployment. So, you'd need a GitHub account to upload your application code.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Setting up your Neon database

### Initialize a new project

Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.

- Click the `New Project` button to create a new project.

- From your project dashboard, navigate to the `SQL Editor` from the sidebar, and run the following SQL command to create a new table in your database:

  ```sql
  CREATE TABLE books_to_read (
      id SERIAL PRIMARY KEY,
      title TEXT,
      author TEXT
  );
  ```

  Next, we insert some sample data into the `books_to_read` table, so we can query it later:

  ```sql
  INSERT INTO books_to_read (title, author)
  VALUES
      ('The Way of Kings', 'Brandon Sanderson'),
      ('The Name of the Wind', 'Patrick Rothfuss'),
      ('Coders at Work', 'Peter Seibel'),
      ('1984', 'George Orwell');
  ```

### Retrieve your Neon database connection string

Log in to the Neon Console and navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

## Implementing the Node.js application

We'll create a simple Express application that connects to our Neon database and retrieve the sample data from the `books_to_read` table. Run the following commands in a terminal to set it up.

```bash
mkdir neon-render-example && cd neon-render-example
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
    // Fetch books from your database using the postgres connection
    const { rows } = await pool.query('SELECT * FROM books_to_read;');
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch books', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

This code sets up an Express server that listens for requests on port 3000. When a request is made to the `URL`, the server queries the `books_to_read` table in your Neon database and returns the results as JSON.

We can test this application locally by running:

```bash
node --env-file=.env index.js
```

Now, navigate to `http://localhost:3000/` in your browser to check that it returns the sample data from the `books_to_read` table.

## Push Your application to GitHub

To deploy your application to Render, you need to push your code to a GitHub repository. Create a new repository on GitHub by navigating to [GitHub - New Repo](https://github.com/new). You can then push your code to the new repository using the following commands:

```bash
echo "node_modules/" > .gitignore && echo ".env" >> .gitignore
echo "# neon-render-example" >> README.md
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

You can visit the GitHub repository to verify that your code has been pushed successfully.

## Deploying to Render

### Create a New Web Service on Render

Log in to your Render account and navigate to the dashboard. Click on the `New +` button and select "Web Service". Pick the option to `build and deploy` from a Git repository.

Next, choose the GitHub repository hosting the Node.js application we created above. Configure your web service as follows: - **Environment**: Select "Node". - **Build Command**: Enter `npm install`. - **Start Command**: Enter `node index.js`. - **Environment Variables**: Add your Neon database connection string from earlier as an environment variable: - Name: `DATABASE_URL` - Value: `{NEON_DATABASE_CONNECTION_STRING}`

Click "Create Web Service" to finish. Render will automatically deploy your application and redirect you to the service dashboard, showing the deployment progress and the logs.

### Verify Deployment

Once the deployment completes, Render provides a public URL for accessing the web service. Visit the provided URL to verify that your application is running and can connect to your Neon database.

Whenever you update your code and push it to your GitHub repository, Render will automatically build and deploy the changes to your web service.

## Removing Your Application and Neon Project

To remove your application from Render, navigate to the dashboard, select `Settings` for the deployed application, and scroll down to find the "Delete Web Service" option.

To delete your Neon project, follow the steps outlined in the Neon documentation under [Delete a project](/docs/manage/projects#delete-a-project).

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/deploy-with-render" description="Connect a Neon Postgres database to your Node application deployed with Render" icon="github">Use Neon Postgres with Render</a>
</DetailIconCards>

## Resources

- [Render platform](https://render.com/)
- [Neon](https://neon.tech)

<NeedHelp/>
