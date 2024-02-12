---
title: Use Neon with Cloudflare Pages
subtitle: Connect a Neon Postgres database to your Cloudflare Pages web application
enableTableOfContents: true
updatedOn: '2024-02-12T00:00:00.000Z'
---

`Cloudflare Pages` is a modern web application hosting platform that allows you to build, deploy, and scale your web applications. While it is typically used to host static websites, you can also use it to host interactive web applications by leveraging `functions` to run server-side code. Internally, Cloudflare functions are powered by `Cloudflare Workers`, a serverless platform that allows you to run JavaScript code on Cloudflare's edge network.

This guide demonstrates how to connect to a Neon Postgres database from your Cloudflare Pages application. We'll create a simple web application using `React` that tracks our reading list using the database and provides a form to add new books to it. 

We'll use the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) to connect to the database and make queries.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Cloudflare account. If you do not have one, sign up for [Cloudflare Pages](https://pages.cloudflare.com/) to get started.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your locat machine. We'll use Node.js to build and deploy our `Pages` application.

## Setting up your Neon database

### Initialize a new project

Log in to the Neon console and navigate to the [Projects](https://console.neon.tech/app/projects) section.

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
postgres://username:password@your-database-url.neon.tech/neondb?sslmode=require
```

Keep this connection string handy for later use.

## Setting up your Cloudflare Pages project

### Create a new project

Run the following command in a terminal window to set up a new Cloudflare Pages project:

```bash
npm create cloudflare@latest
```

This initiates an interactive CLI prompt to generate a new project. To follow along with this guide, you can use the following settings:
```bash
╭ Create an application with Cloudflare Step 1 of 3
│
├ In which directory do you want to create your application?
│ dir ./my-neon-page
│
├ What type of application do you want to create?
│ type Website or web app
│
├ Which development framework do you want to use?
│ framework React
```

When asked if you want to deploy your application, select `no`. We'll develop and first test the application locally, before deploying it to the Cloudflare Pages platform. 

The `create-cloudflare` CLI sets up a template `create-react-app` project. It also installs the `wrangler` CLI, which we'll use to test and deploy our application to the Cloudflare platform. 

### Implement the application frontend 

The `create-cloudflare` CLI generates a new project in the `my-neon-page` directory. Navigate to this directory and open the `src/App.js` file. Replace the contents of this file with the following code:

```jsx
// src/App.js

import React, { useState, useEffect } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");

  // Function to fetch books
  const fetchBooks = async () => {
    try {
      const response = await fetch("/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/books/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookName, authorName }),
      });
      const data = await response.json();

      if (data.success) {
        console.log("Success:", data);
        setBooks([...books, { bookName, authorName }]);
      } else {
        console.error("Error adding book:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Reset form fields
    setBookName("");
    setAuthorName("");
  };

  return (
    <div className="App">
      <h1>Book List</h1>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.bookName} by {book.authorName}
          </li>
        ))}
      </ul>

      <h2>Add a Book</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Book Name:
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          />
        </label>
        <label>
          Author Name:
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </label>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default App;
```

The `App` component fetches the list of books from the server and displays them. It also provides a form to add new books to the list. Cloudflare Pages allows us to define the api endpoints as serverless functions, which we'll implement next.

### Implement the serverless functions

We'll use the `neon-serverless` driver to connect to the Neon database, so we need to install it as a dependency first:

```bash
npm install @neondatabase/serverless
```

Next, we'll create two serverless functions for the application. 

#### Function to fetch list of books from the database

Create a new file named `functions/books/index.js` in the project directory with the following content:

```js
import { Client } from '@neondatabase/serverless';

export async function onRequestGet(context) {
  const client = new Client(env.DATABASE_URL);
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
import { Client } from "@neondatabase/serverless";

export async function onRequestPost(context) {
  const client = new Client(env.DATABASE_URL);
  await client.connect();

  // Extract the book details from the request body
  const book = await context.request.json();

  // Logic to insert a new book into your database
  const resp = await client.query(
    "INSERT INTO books_to_read VALUES ($1, $2);",
    [data.title, data.author],
  );

  // Check if insert query was successful
  if (resp.rowCount === 1) {
    return new Response(
      JSON.stringify({ success: true, error: null, data: book }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } else {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to insert book",
        data: book,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
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

Now, to test the `Pages` application locally, we can use the `wrangler` CLI which comes with the Cloudflare project setup.

```bash
npm run pages:dev
```

This command starts a local server simulating the Cloudflare environment.

```bash
[TODO]
```

## Deploying your application with Cloudflare Pages

### Authenticate Wrangler with your Cloudflare account

Run the following command to link the Wrangler tool to your Cloudflare account:

```bash
npx wrangler login
```

This command will open a browser window and prompt you to log into your Cloudflare account. After logging in and approving the access request for `Wrangler`, you can close the browser window and return to your terminal.

### Add your Neon connection string as a secret

Use Wrangler to add your Neon database connection string as a secret to your `Cloudflare Pages` project.:

```bash
npx wrangler secret put DATABASE_URL
```

When prompted, paste your Neon connection string.

### Publish your Pages application and verify the deployment

Now, you can deploy your application to `Cloudflare Pages` by running the following command:

```bash
npm run pages:deploy
```

The Wrangler CLI will output the URL of your application hosted on the Cloudflare platform. Visit this URL in your browser to interact with it. 

```text
[TODO]
```

## Removing the example application and Neon project

To delete your `Cloudflare Pages` application, you can use the Cloudflare dashboard. Refer to the [Pages documentation](https://developers.cloudflare.com/pages) for more details.

To delete your Neon project, follow the steps outlined in the Neon documentation under [Delete a project](/docs/manage/projects#delete-a-project).

## Resources

- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Neon](https://neon.tech)

<NeedHelp/>
