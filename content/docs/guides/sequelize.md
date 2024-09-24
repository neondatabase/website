---
title: Schema migration with Neon Postgres and Sequelize
subtitle: Set up Neon Postgres and run migrations for your Javascript project using
  Sequelize ORM
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.665Z'
---

[Sequelize](https://sequelize.org/) is a promise-based Node.js ORM that supports multiple relational databases. In this guide, we'll explore how to use `Sequelize` ORM with a Neon Postgres database in a JavaScript project.

We'll create a Node.js application, configure `Sequelize`, and show how to set up and run migrations with `Sequelize`.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select an existing project or click the `New Project` button to create a new one.

### Retrieve your Neon database connection string

Navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

<Admonition type="note">
Neon supports both direct and pooled database connection strings, which can be copied from the **Connection Details** widget on your Neon Project Dashboard. A pooled connection string connects your application to the database via a PgBouncer connection pool, allowing for a higher number of concurrent connections. However, using a pooled connection string for migrations can lead to errors. For this reason, we recommend using a direct (non-pooled) connection when performing migrations. For more information about direct and pooled connections, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## Setting Up the Node application

### Create a new Node project

We'll create a simple catalog with API endpoints that query the database for authors and a list of their books. Run the following commands in your terminal to set up a new project using `Express.js`:

```bash
mkdir neon-sequelize-guide && cd neon-sequelize-guide
npm init -y && touch .env index.js
npm install express dotenv
```

Add the `DATABASE_URL` environment variable to the `.env` file, which you'll use to connect to your Neon database. Use the connection string that you obtained from the Neon Console earlier:

```bash
# .env
DATABASE_URL=NEON_DATABASE_CONNECTION_STRING
```

To use the `Sequelize` ORM to run queries, we need to install the `sequelize` package and the `pg` driver to connect to Postgres from Node.js. We also need to install the `sequelize-cli` package to manage data models and run migrations. Run the following commands to install the required packages:

```bash
npm install sequelize pg pg-hstore
npm install sequelize-cli --save-dev
```

### Configure Sequelize

Run the following command to initialize the `sequelize` configuration:

```bash
npx sequelize init
```

This command creates `config`, `migrations`, `models`, and `seeders` directories at the project root.

The `config` directory contains the `config.json` file, which holds the database configuration. We want to have the database URL read as an environment variable, so we replace it with a `config.js` file. Create a `config.js` file in your `config/` directory and add the following code:

```javascript
// config/config.js

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true } },
  },
};
```

To make the `sequelize` CLI aware of the path to the new configuration file, we need to create a `.sequelizerc` file at the project root and add the following code:

```javascript
// .sequelizerc

const path = require('path');

module.exports = {
  config: path.resolve('config', 'config.js'),
};
```

### Create models and set up migrations

We'll create an `Author` and a `Book` model to represent the tables in our database. Run the following commands to create the models:

```bash
npx sequelize model:generate --name Author --attributes name:string,bio:string
npx sequelize model:generate --name Book --attributes title:string
```

Sequelize creates a new file for each model in the `models/` directory and a corresponding migration file in the `migrations/` directory. Sequelize automatically adds an `id` field as the primary key for each model, and `createdAt` and `updatedAt` fields to track the creation and update times of each record.

We still need to define the relationships between the `Author` and `Book` models. Update the `book.js` file with the following code:

```javascript
// models/book.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Author, {
        foreignKey: 'authorId',
        as: 'author',
        onDelete: 'CASCADE',
      });
    }
  }
  Book.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      authorId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};
```

Sequelize does not automatically regenerate the migration files when you update the models. So, we need to manually update the migration files to add the foreign key constraint.

Update the migration file corresponding to the `Book` model with the following code:

```javascript
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      authorId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Authors',
          key: 'id',
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Books');
  },
};
```

Run the following command to apply the migrations and create the tables in the database:

```bash
npx sequelize db:migrate
```

If `Sequlize` successfully connects to the database and runs the migrations, you should see a success message in the terminal.

### Add sample data to the database

We'll add some sample data to the database using the `Sequelize` ORM. Create a new file named `seed.js` at the project root and add the following code:

```javascript
// seed.js

const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('dotenv');

config();
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

const Author = require('./models/author')(sequelize, DataTypes);
const Book = require('./models/book')(sequelize, DataTypes);

const seedDatabase = async () => {
  const author = await Author.create({
    name: 'J.K. Rowling',
    bio: 'The creator of the Harry Potter series',
  });
  await Book.create({ title: "Harry Potter and the Philosopher's Stone", authorId: author.id });
  await Book.create({ title: 'Harry Potter and the Chamber of Secrets', authorId: author.id });

  const author2 = await Author.create({
    name: 'J.R.R. Tolkien',
    bio: 'The creator of Middle-earth and author of The Lord of the Rings.',
  });
  await Book.create({ title: 'The Hobbit', authorId: author2.id });
  await Book.create({ title: 'The Fellowship of the Ring', authorId: author2.id });
  await Book.create({ title: 'The Two Towers', authorId: author2.id });
  await Book.create({ title: 'The Return of the King', authorId: author2.id });

  const author3 = await Author.create({
    name: 'George R.R. Martin',
    bio: 'The author of the epic fantasy series A Song of Ice and Fire.',
  });
  await Book.create({ title: 'A Game of Thrones', authorId: author3.id });
  await Book.create({ title: 'A Clash of Kings', authorId: author3.id });

  await sequelize.close();
};

seedDatabase();
```

Run the following command to seed the database with the sample data:

```bash
node seed.js
```

Sequelize will print logs to the terminal as it connects to the database and adds the sample data.

### Create API endpoints

Now that the database is set up and populated with data, we can implement the API to query the authors and their books. We'll use [Express](https://expressjs.com/), which is a minimal web application framework for Node.js.

Create an `index.js` file at the project root, and add the following code to set up your Express server:

```javascript
// index.js

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('dotenv');

config();
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: { ssl: { require: true } },
});

// Set up the models
const Author = require('./models/author')(sequelize, DataTypes);
const Book = require('./models/book')(sequelize, DataTypes);

// Create a new Express application
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  res.send('Hello World! This is a book catalog.');
});

app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).send('Error fetching authors');
  }
});

app.get('/books/:author_id', async (req, res) => {
  const authorId = parseInt(req.params.author_id);
  try {
    const books = await Book.findAll({
      where: {
        authorId: authorId,
      },
    });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books for author:', error);
    res.status(500).send('Error fetching books for author');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

This code sets up a simple API with two endpoints: `/authors` and `/books/:authorId`. The `/authors` endpoint returns a list of all the authors, and the `/books/:authorId` endpoint returns a list of books written by the specific author for the given `authorId`.

Run the application using the following command:

```bash
node index.js
```

This will start the server at `http://localhost:3000`. Navigate to `http://localhost:3000/authors` and `http://localhost:3000/books/1` in your browser to check that the API works as expected.

## Conclusion

In this guide, we set up a new Javascript project using `Express.js` and the `Sequelize` ORM, and connected it to a `Neon` Postgres database. We created a schema for the database, generated and ran migrations, and implemented API endpoints to query the database.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-sequelize" description="Run Neon database migrations using Sequelize" icon="github">Migrations with Neon and Sequelize</a>
</DetailIconCards>

## Resources

For more information on the tools used in this guide, refer to the following resources:

- [Sequelize](https://sequelize.org/)
- [Express.js](https://expressjs.com/)

<NeedHelp/>
