---
title: Use Neon with Netlify Functions
subtitle: Connect a Neon Postgres database to your Netlify Functions application
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.660Z'
---

[Netlify Functions](https://www.netlify.com/products/functions/) provide a serverless execution environment for building and deploying backend functionality without managing server infrastructure. It's integrated with Netlify's ecosystem, making it ideal for augmenting web applications with server-side logic, API integrations, and data processing tasks in a scalable way.

This guide will show you how to connect to a Neon Postgres database from your Netlify Functions project. We'll use the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) to connect to the database and make queries.

## Prerequisites

Before starting, ensure you have:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Netlify account for deploying your site with `Functions`. Sign up at [Netlify](https://netlify.com) if necessary. While Netlify can deploy directly from a Github repository, we'll use the `Netlify` CLI tool to deploy our project manually.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed locally for developing and deploying your Functions.

## Setting up your Neon database

### Initialize a new project

After logging into the Neon Console, proceed to the [Projects](https://console.neon.tech/app/projects) section.

1. Click `New Project` to start a new one.

2. In the Neon **Dashboard**, use the `SQL Editor` from the sidebar to execute the SQL command below, creating a new table for coffee blends:

   ```sql
   CREATE TABLE favorite_coffee_blends (
       id SERIAL PRIMARY KEY,
       name TEXT,
       notes TEXT
   );
   ```

   Populate the table with some initial data:

   ```sql
   INSERT INTO favorite_coffee_blends (name, origin, notes)
   VALUES
       ('Morning Joy', 'Citrus, Honey, Floral'),
       ('Dark Roast Delight', 'Rich, Chocolate, Nutty'),
       ('Arabica Aroma', 'Smooth, Caramel, Fruity'),
       ('Robusta Revolution', 'Strong, Bold, Bitter');
   ```

### Retrieve your Neon database connection string

Log in to the Neon Console and navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

## Setting up your Netlify Functions project

We'll use the Netlify CLI to create a new project and add functions to it. To install the CLI, run:

```bash
npm install netlify-cli -g
```

To authenticate the CLI with your Netlify account, run:

```bash
netlify login
```

This command opens a browser window to authenticate your terminal session with Netlify. After logging in, you can close the browser window and interact with your Netlify account from the terminal.

### Create a new Netlify project

We will create a simple HTML webpage that fetches the coffee blends from the Neon database using a Netlify Function and displays them. To create a new `Netlify Site` project, run:

```bash
mkdir neon-netlify-example && cd neon-netlify-example
netlify sites:create
```

You will be prompted to select a team and site name. Choose a unique name for your site. This command then links the current directory to a `Site` project in your Netlify account.

```
❯ netlify sites:create
? Team: Ishan Anand’s team
? Site name (leave blank for a random name; you can change it later): neon-netlify-example

Site Created

Admin URL: https://app.netlify.com/sites/neon-netlify-example
URL:       https://neon-netlify-example.netlify.app
Site ID:   ed43ba05-ff6e-40a9-9a68-8f58b9ad9937

Linked to neon-netlify-example
```

### Implement the function

We'll create a new function to fetch the coffee blends from the Neon database. To set up the function entrypoint script, you can run the command below and use the settings provided:

```bash
❯ netlify functions:create get_coffee_blends

? Select the type of function you'd like to create Serverless function (Node/Go/Rust)
? Select the language of your function JavaScript
? Pick a template javascript-hello-world
◈ Creating function get_coffee_blends
◈ Created ./netlify/functions/get_coffee_blends/get_coffee_blends.js

Function created!
```

This command creates a new directory `netlify/functions/get_coffee_blends` with a `get_coffee_blends.js` file inside it. We are using the ES6 `import` syntax to implement the request handler, so we will change the script extension to `.mjs` for the runtime to recognize it.

We also install the `Neon serverless` driver as a dependency to connect to the Neon database and fetch the data.

```bash
mv netlify/functions/get_coffee_blends/get_coffee_blends.js netlify/functions/get_coffee_blends/get_coffee_blends.mjs
npm install @neondatabase/serverless
```

Now, replace the contents of the function script with the following code:

```javascript
// netlify/functions/get_coffee_blends/get_coffee_blends.mjs
import { neon } from '@neondatabase/serverless';

export async function handler(event) {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const rows = await sql('SELECT * FROM favorite_coffee_blends;');
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
```

This function connects to your Neon database and fetches the list of your favorite coffee blends.

### Implement the frontend

To make use of the `Function` implemented above, we will create a simple HTML page that fetches and displays the coffee information by calling the function.

Create a new file `index.html` at the root of your project with the following content:

```html
<!doctype html>
<html>
  <head>
    <title>Coffee Blends</title>
  </head>
  <body>
    <h1>My favourite coffee blends</h1>
    <ul id="blends"></ul>
    <script>
      (async () => {
        try {
          const response = await fetch('/.netlify/functions/get_coffee_blends');
          const blends = await response.json();
          const blendsList = document.getElementById('blends');
          blends.forEach((blend) => {
            const li = document.createElement('li');
            li.innerText = `${blend.name} - ${blend.notes}`;
            blendsList.appendChild(li);
          });
        } catch (error) {
          console.error('Error:', error);
        }
      })();
    </script>
  </body>
</html>
```

### Test the site locally

Set the `DATABASE_URL` environment variable in a `.env` file at the root of your project:

```text
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

We are now ready to test our Netlify site project locally. Run the following command to start a local development server:

```bash
netlify dev
```

The Netlify CLI will print the local server URL where your site is running. Open the URL in your browser to see the coffee blends fetched from your Neon database.

### Deploying your Netlify Site and Function

Deploying is straightforward with the Netlify CLI. However, we need to set the `DATABASE_URL` environment variable for the Netlify deployed site too. You can use the CLI to set it.

```bash
netlify env:set DATABASE_URL "YOUR_NEON_CONNECTION_STRING"
```

Now, to deploy your site and function, run the following command. When asked to provide a publish directory, enter `.` to deploy the entire project.

```bash
netlify deploy --prod
```

The CLI will build and deploy your site and functions to Netlify. After deployment, Netlify provides a URL for your live function. Navigate to the URL in your browser to check that the deployment was successful.

## Removing the example application and Neon project

For cleanup, delete your Netlify site and functions via the Netlify dashboard or CLI. Consult the [Netlify documentation](https://docs.netlify.com/) for detailed instructions.

To remove your Neon project, follow the deletion steps in Neon's documentation under [Manage Projects](https://neon.tech/docs/manage/projects#delete-a-project).

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/deploy-with-netlify-functions" description="Connect a Neon Postgres database to your Netlify Functions application" icon="github">Use Neon with Netlify Functions</a>
</DetailIconCards>

## Resources

- [Netlify Functions](https://www.netlify.com/products/functions/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Neon](https://neon.tech)

<NeedHelp/>
