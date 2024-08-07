---
title: Use Neon with Cloudflare Pages
subtitle: Connect a Neon Postgres database to your Cloudflare Pages web application
enableTableOfContents: true
updatedOn: '2024-07-02T18:38:56.213Z'
---

`Cloudflare Pages` is a modern web application hosting platform that allows you to build, deploy, and scale your web applications. While it is typically used to host static websites, you can also use it to host interactive web applications by leveraging `functions` to run server-side code. Internally, Cloudflare functions are powered by `Cloudflare Workers`, a serverless platform that allows you to run JavaScript code on Cloudflare's edge network.

This guide demonstrates how to connect to a Neon Postgres database from your Cloudflare Pages application. We'll create a simple web application using `React` that tracks our reading list using the database and provides a form to add new books to it.

We'll use the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) to connect to the database and make queries.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Cloudflare account. If you do not have one, sign up for [Cloudflare Pages](https://pages.cloudflare.com/) to get started.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and deploy our `Pages` application.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.

2. Click the **New Project** button to create a new project.

3. From your project dashboard, navigate to the **SQL Editor** from the sidebar, and run the following SQL command to create a new table in your database:

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

## Setting up your Cloudflare Pages project

### Create a new project

We will create a simple React application using the Vite bundler framework. Run the following command in a terminal window to set up a new Vite project:

```bash
npm create vite@latest
```

This initiates an interactive CLI prompt to generate a new project. To follow along with this guide, you can use the following settings:

```bash
✔ Project name: … my-neon-page
✔ Select a framework: › React
✔ Select a variant: › JavaScript

Scaffolding project in /Users/ishananand/repos/javascript/my-neon-page...

Done. Now run:

  cd my-neon-page
  npm install
  npm run dev
```

We set up a template React configured to be built using Vite.

### Implement the application frontend

Navigate to the `my-neon-page` directory and open the `src/App.jsx` file. Replace the contents of this file with the following code:

```jsx
// src/App.jsx

import React, { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState('');
  const [authorName, setAuthorName] = useState('');

  // Function to fetch books
  const fetchBooks = async () => {
    try {
      const response = await fetch('/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/books/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: bookName, author: authorName }),
      });
      const data = await response.json();

      if (data.success) {
        console.log('Success:', data);
        setBooks([...books, { title: bookName, author: authorName }]);
      } else {
        console.error('Error adding book:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // Reset form fields
    setBookName('');
    setAuthorName('');
  };

  return (
    <div className="App">
      <h1>Book List</h1>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>

      <h2>Add a Book</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Book Name:
          <input type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} />
        </label>
        <label>
          Author Name:
          <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        </label>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default App;
```

The `App` component fetches the list of books from the server and displays them. It also provides a form to add new books to the list. `Cloudflare` Pages allows us to define the API endpoints as serverless functions, which we'll implement next.

### Implement the serverless functions

We'll use the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) to connect to the Neon database, so we first need to install it as a dependency:

```bash
npm install @neondatabase/serverless
```

Next, we'll create two serverless functions for the application. In a `Cloudflare Pages` project, these must be defined in the `functions` directory at the root of the project. For further details, refer to the [Cloudflare Pages - Functions documentation](https://developers.cloudflare.com/pages/functions/).

#### Function to fetch list of books from the database

Create a new file named `functions/books/index.js` in the project directory with the following content:

```js
import { Client } from '@neondatabase/serverless';

export async function onRequestGet(context) {
  const client = new Client(context.env.DATABASE_URL);
  await client.connect();

  // Logic to fetch books from your database
  const { rows } = await client.query('SELECT * FROM books_to_read;');
  return new Response(JSON.stringify(rows));
}
```

This function fetches the list of books from the `books_to_read` table in the database and returns it as a JSON response.

#### Function to add a new book to the database

Create another file named `functions/books/add.js` in the project directory with the following content:

```js
import { Client } from '@neondatabase/serverless';

export async function onRequestPost(context) {
  const client = new Client(context.env.DATABASE_URL);
  await client.connect();

  // Extract the book details from the request body
  const book = await context.request.json();

  // Logic to insert a new book into your database
  const resp = await client.query('INSERT INTO books_to_read (title, author) VALUES ($1, $2); ', [
    book.title,
    book.author,
  ]);

  // Check if insert query was successful
  if (resp.rowCount === 1) {
    return new Response(JSON.stringify({ success: true, error: null, data: book }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to insert book',
        data: book,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}
```

This function extracts the book details from the request body and inserts it into the `books_to_read` table in the database. It returns a JSON response indicating the success or failure of the operation.

### Test the application locally

Our application is now ready to be tested locally. However, we first need to configure the `DATABASE_URL` environment variable to point to our Neon database.

We can do this by creating a `.dev.vars` file at the root of the project directory with the following content:

```text
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

Now, to test the `Pages` application locally, we can use the `wrangler` CLI tool used to manage Cloudflare projects. We can use it using the `npx` command as:

```bash
npx wrangler pages dev -- npm run dev
```

This command starts a local server simulating the Cloudflare environment. The function endpoints are run by the Wrangler tool while requests to the root URL are proxied to the Vite development server.

```bash
❯ npx wrangler pages dev -- npm run dev
Running npm run dev...
.
.
.
.
-------------------
Using vars defined in .dev.vars
Your worker has access to the following bindings:
- Vars:
  - DATABASE_URL: "(hidden)"
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8788
```

Visit the printed localhost URL in your browser to interact with the application. You should see the list of books fetched from the database and a form to add new books.

## Deploying your application with Cloudflare Pages

### Authenticate Wrangler with your Cloudflare account

Run the following command to link the Wrangler tool to your Cloudflare account:

```bash
npx wrangler login
```

This command will open a browser window and prompt you to log into your Cloudflare account. After logging in and approving the access request for `Wrangler`, you can close the browser window and return to your terminal.

### Publish your Pages application and verify the deployment

Now, you can deploy your application to `Cloudflare Pages` by running the following command:

```bash
npm run build
npx wrangler pages deploy dist --project-name <NAME_OF_YOUR_PROJECT>
```

Give a unique name to your `Cloudflare Pages` project above. The Wrangler CLI will output the URL of your application hosted on the Cloudflare platform. Visit this URL in your browser to interact with it.

```bash
✨ Compiled Worker successfully
🌍  Uploading... (4/4)

✨ Success! Uploaded 0 files (4 already uploaded) (0.72 sec)

✨ Uploading Functions bundle
✨ Deployment complete! Take a peek over at https://21ea2a57.my-neon-page.pages.dev
```

### Add your Neon connection string as an environment variable

The Cloudflare production deployment doesn't have access to the `DATABASE_URL` environment variable yet. Hence, we need to navigate to the Cloudflare dashboard and add it manually.

Navigate to the dashboard and select the `Settings` section in your project. Go to the **Environment Variables** tab and add a new environment variable named `DATABASE_URL` with the value of your Neon database connection string.

To make sure the environment variable is available to the serverless functions, go back to the terminal and redeploy the project using the `wrangler` CLI:

```bash
npx wrangler pages deploy dist --project-name <NAME_OF_YOUR_PROJECT>
```

Now, visit the URL of your `Cloudflare Pages` application to interact with it. You should see the list of books fetched from the Neon database and a form to add new books.

## Removing the example application and Neon project

To delete your `Cloudflare Pages` application, you can use the Cloudflare dashboard. Refer to the [Pages documentation](https://developers.cloudflare.com/pages) for more details.

To delete your Neon project, follow the steps outlined in the Neon documentation under [Delete a project](/docs/manage/projects#delete-a-project).

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/deploy-with-cloudflare-pages" description="Connect a Neon Postgres database to your Cloudflare Pages web application" icon="github">Use Neon with Cloudflare Pages</a>
</DetailIconCards>

## Resources

- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Cloudflare Pages - Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Neon](https://neon.tech)

<NeedHelp/>
