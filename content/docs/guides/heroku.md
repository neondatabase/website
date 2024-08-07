---
title: Deploy Your Node.js App with Neon Postgres on Heroku
subtitle: A step-by-step guide to deploying a Node application with a Neon Postgres
  database on Heroku
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.653Z'
---

[Heroku](https://heroku.com) is a popular platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud. It simplifies the deployment process, making it a favorite among developers for its ease of use and integration capabilities.

This guide walks you through deploying a simple Node.js application connected to a Neon Postgres database, on Heroku.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Heroku account. Sign up at [Heroku](https://signup.heroku.com/) to get started.
- Git installed on your local machine. Heroku uses Git for version control and deployment.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Setting Up Your Neon Database

### Initialize a New Project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/projects) section.

2. Click **New Project** to create a new project.

3. In your project dashboard, go to the **SQL Editor** and run the following SQL command to create a new table:

   ```sql
   CREATE TABLE music_albums (
       album_id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       artist VARCHAR(255) NOT NULL
   );

   INSERT INTO music_albums (title, artist)
   VALUES
       ('Rumours', 'Fleetwood Mac'),
       ('Abbey Road', 'The Beatles'),
       ('Dark Side of the Moon', 'Pink Floyd'),
       ('Thriller', 'Michael Jackson');
   ```

### Retrieve your Neon database connection string

Log in to the Neon Console and navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

## Implementing the Node.js Application

We'll create a simple Express application that connects to our Neon database and retrieves the list of music albums. Run the following commands in your terminal to set it up:

```bash
mkdir neon-heroku-example && cd neon-heroku-example
npm init -y && npm pkg set type="module" && npm pkg set scripts.start="node index.js"
npm install express pg
touch .env
```

We use the `npm pkg set type="module"` command to enable ES6 module support in our project. We'll also create a new `.env` file to store the `DATABASE_URL` environment variable, which we'll use to connect to our Neon database. Lastly, we install the `pg` library which is the Postgres driver we use to connect to our database.

In the `.env` file, store your Neon database connection string:

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

This code sets up an Express server that listens for requests on port 3000. When a request is made to the `URL`, the server queries the `music_albums` table in your Neon database and returns the results as JSON.

We can test this application locally by running:

```bash
node --env-file=.env index.js
```

Now, navigate to `http://localhost:3000/` in your browser to check it returns the sample data from the `music_albums` table.

## Deploying to Heroku

### Create a New Heroku App

We will use the `Heroku CLI` to deploy our application to Heroku manually. You can install it on your machine by following the instructions [here](https://devcenter.heroku.com/articles/heroku-cli). Once installed, log in to your Heroku account using:

```bash
❯ heroku login
 ›   Warning: Our terms of service have changed:
 ›   https://dashboard.heroku.com/terms-of-service
heroku: Press any key to open up the browser to login or q to exit:
Opening browser to https://cli-auth.heroku.com/auth/cli/browser/...
```

You will be prompted to log in to your Heroku account in the browser. After logging in, you can close the browser and return to your terminal.

Before creating the Heroku application, we need to initialize a new Git repository in our project folder:

```bash
git init && echo "node_modules" > .gitignore && echo ".env" >> .gitignore
git branch -M main
git add . && git commit -m "Initial commit"
```

Next, we can create a new app on Heroku using the following command. This creates a new Heroku app with the name `neon-heroku-example`, and sets up a new Git remote for the app called `heroku`.

```bash
heroku create neon-heroku-example
```

You'll also need to set the `DATABASE_URL` on Heroku to your Neon database connection string:

```bash
heroku config:set DATABASE_URL='NEON_DATABASE_CONNECTION_STRING' -a neon-heroku-example
```

### Deploy Your Application

To deploy your application to Heroku, use the following command to push your code to the `heroku` remote. Heroku will automatically detect that your application is a Node.js application, install the necessary dependencies and deploy it.

```bash
> git push heroku main
.
.
.
remote: -----> Launching...
remote:        Released v4
remote:        https://neon-heroku-example-fda03f6acbbe.herokuapp.com/ deployed to Heroku
remote:
remote: Verifying deploy... done.
remote: 2024/02/21 07:26:49 Rollbar error: empty token
To https://git.heroku.com/neon-heroku-example.git
remote: Verifying deploy... done.
```

Once the deployment is complete, you should see a message with the URL of your deployed application. Navigate to this URL in your browser to see your application live on Heroku.

You've now successfully deployed a Node.js application on Heroku that connects to a Neon Postgres database. For further customization and scaling options, you can explore the Heroku and Neon documentation.

## Removing Your Application and Neon Project

To remove your application from Heroku, select the app from your [Heroku dashboard](https://dashboard.heroku.com/apps). Navigate to the `Settings` tab and scroll down to the end to find the "Delete App" option.

To delete your Neon project, follow the steps outlined in the Neon documentation under [Delete a project](/docs/manage/projects#delete-a-project).

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/deploy-with-heroku" description="Deploying a Node application with a Neon Postgres database on Heroku" icon="github">Use Neon with Heroku</a>
</DetailIconCards>

## Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [Neon](https://neon.tech/docs)
- [Import data from Heroku Postgres to Neon](/docs/import/import-from-heroku)

<NeedHelp/>
