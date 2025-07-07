---
title: Building an End-to-End Full-Text Search Experience With pg_search on Neon
subtitle: A guide to building a full-text search experience with pg_search on Neon
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-04-06T00:00:00.000Z'
updatedOn: '2025-04-06T00:00:00.000Z'
---

Full-text search is an essential component for applications that need to search through large text collections. While many developers use dedicated search engines like Elasticsearch, Neon's `pg_search` extension lets you build search capabilities directly in your Postgres database, eliminating the need for additional services.

This guide shows you how to build a search solution with `pg_search` on Neon, from database setup to creating a responsive search interface for a developer snippet manager. You'll learn how to create and query search indexes, highlight relevant search results, and build a simple interface for searching code snippets.

## Prerequisites

To follow this guide, you'll need:

- A [Neon](https://console.neon.tech/signup) account
- Basic SQL knowledge
- Familiarity with a backend language (we use Node.js in our examples but you can adapt it to your preferred language)
- Basic understanding of HTML, CSS, and JavaScript for the frontend

## What is `pg_search`?

The [`pg_search`](/docs/extensions/pg_search) extension adds full-text search capabilities to Postgres using the BM25 scoring algorithm—the same approach used by modern search engines. It offers:

- Fast and relevant search results
- Easy integration with your existing database
- Support for fuzzy matching to handle typos
- Advanced filtering capabilities and no need for additional services

This means you can implement search without adding complexity to your infrastructure.

## Enabling `pg_search` on Neon

<Admonition type="note" title="pg_search on Neon">

`pg_search` is currently only available on Neon projects created in an [AWS region](/docs/introduction/regions#aws-regions).

</Admonition>

First, let's enable the `pg_search` extension on your Neon database. Connect to your database using the Neon SQL Editor or a client like `psql` and run the following command:

```sql
CREATE EXTENSION IF NOT EXISTS pg_search;
```

This adds the `pg_search` functionality to your database.

Once enabled, you'll have access to new operators and functions for full-text search that will make building a snippet search tool much easier.

## Understanding how `pg_search` works

Before diving into implementation, it's helpful to understand the two key components that make `pg_search` efficient:

1. **BM25 scoring** calculates how relevant each result is based on:
   - Word frequency within a document (how often a search term appears)
   - Word rarity across all documents (uncommon terms get higher scores)
   - Document length (adjusts scores so longer documents don't automatically rank higher)

2. **Inverted indexes** map words to the documents containing them, making searches fast by directly finding relevant documents instead of scanning everything. Think of it like the index at the back of a book that tells you exactly which pages contain specific topics.

These components are particularly valuable for code snippet search, where developers often need to quickly locate specific algorithms, functions, or techniques across a large collection of code snippets.

## Setting up a database for our snippet manager

For the purposes of this guide, we'll create a simple code snippet manager. This will allow developers to store, search, and categorize code snippets across different programming languages.

The following SQL creates our database structure:

```sql
CREATE TABLE languages (
  language_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE snippets (
  snippet_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language_id INTEGER REFERENCES languages(language_id),
  user_id INTEGER REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  tag_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE snippet_tags (
  snippet_id INTEGER REFERENCES snippets(snippet_id),
  tag_id INTEGER REFERENCES tags(tag_id),
  PRIMARY KEY (snippet_id, tag_id)
);
```

This schema creates five tables:

- `languages` for categorizing snippets by programming language
- `users` to track who created each snippet
- `snippets` for storing the actual code snippets and their metadata
- `tags` for categorizing snippets (algorithms, utilities, etc.)
- `snippet_tags` for the many-to-many relationship between snippets and tags

Now let's add some sample data to work with, which will help us demonstrate the search capabilities of our snippet manager.

The following SQL inserts a few sample records into our tables:

```sql
-- Add programming languages
INSERT INTO languages (name) VALUES
('JavaScript'),
('Python'),
('Go'),
('SQL'),
('TypeScript');

-- Add users
INSERT INTO users (username, email) VALUES
('devguru', 'dev@example.com'),
('codedojo', 'dojo@example.com'),
('scriptpro', 'pro@example.com');

-- Add tags
INSERT INTO tags (name) VALUES
('algorithm'),
('utility'),
('frontend'),
('database'),
('middleware');

-- Add code snippets
INSERT INTO snippets (title, description, code, language_id, user_id) VALUES
('Quick Sort Implementation', 'Efficient implementation of the quicksort algorithm',
'function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}',
1, 1),

('Database Connection Pool', 'Reusable database connection pool using the pg library',
'const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    return client;
  }
};',
1, 2),

('Simple API Middleware', 'Express middleware for API authentication',
'function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}',
1, 3),

('Binary Search Algorithm', 'Efficient binary search implementation in Python',
'def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1  # Target not found',
2, 1),

('SQL Transaction Helper', 'Helper function for managing SQL transactions',
'async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}',
1, 2);

-- Add snippet tags
INSERT INTO snippet_tags (snippet_id, tag_id) VALUES
(1, 1),  -- Quick Sort: algorithm
(2, 4),  -- Database Connection Pool: database
(3, 5),  -- Simple API Middleware: middleware
(4, 1),  -- Binary Search: algorithm
(5, 4);  -- SQL Transaction Helper: database
```

This gives us a foundation of coding snippets across different languages and categories to demonstrate search capabilities.

## Creating search indexes

Now that we have our data, we need to create BM25 indexes to enable efficient searching.

For a code snippet manager, these indexes are essential since they will allow developers to quickly find relevant code:

```sql
CREATE INDEX snippet_search_idx ON snippets
USING bm25 (snippet_id, title, description, code)
WITH (key_field='snippet_id');

CREATE INDEX language_search_idx ON languages
USING bm25 (language_id, name)
WITH (key_field='language_id');

CREATE INDEX tag_search_idx ON tags
USING bm25 (tag_id, name)
WITH (key_field='tag_id');
```

Let's break down what this does:

- The first index enables searching across snippet titles, descriptions, and actual code
- The language index allows searching for programming languages
- The tag index enables searching for specific categories like "algorithm" or "utility"
- Each index specifies `key_field` to identify which column uniquely identifies each row

These indexes make searching efficient by pre-processing and organizing the text data for quick lookups, which is key when developers need to search through potentially thousands of code snippets.

## Basic search queries with `pg_search`

Now with our indexes in place, let's perform some searches using the `@@@` operator, which is the main search operator provided by `pg_search`.

### Simple keyword search

Find snippets that mention "connection" in any of the indexed fields:

```sql
SELECT snippet_id, title, description
FROM snippets
WHERE title @@@ 'connection' OR description @@@ 'connection' OR code @@@ 'connection'
ORDER BY paradedb.score(snippet_id) DESC;
```

This query searches for the term "connection" across multiple fields. The `paradedb.score()` function returns the relevance score of each match, allowing us to show the most relevant snippets first. This is particularly useful for developers who often need to find code examples based on certain keywords or concepts.

### Exact phrase search

When you need to find an exact sequence of words, such as a specific function signature, use double quotes around the phrase:

```sql
SELECT snippet_id, title, description
FROM snippets
WHERE code @@@ '"function authMiddleware"'
ORDER BY paradedb.score(snippet_id) DESC;
```

This searches for the exact phrase "`function authMiddleware`" in the code. Without the quotes, it would find snippets containing both words in any order or position, which could lead to less precise results when looking for specific function definitions. You can give it a try with other phrases to see how it works.

### Fuzzy matching for typos

Naturally everyone makes mistakes while typing, and developers are no exception. Typos are common, especially when searching for function names or variable names. The `@@@` operator supports fuzzy matching to help find relevant results even with minor errors:

```sql
SELECT snippet_id, title
FROM snippets
WHERE title @@@ paradedb.match('title', 'binary serch', distance => 1);
```

This would find "`Binary Search Algorithm`" even though "`search`" was misspelled as "`serch`".

The `distance => 1` parameter allows for one character difference, making your search more forgiving and practical for real-world use. You can tweak the distance parameter to allow for more or fewer errors based on your needs.

### Combining search with filters

You can combine text search with standard SQL filtering to narrow down results by language or tag:

```sql
SELECT s.snippet_id, s.title, l.name AS language
FROM snippets s
JOIN languages l ON s.language_id = l.language_id
WHERE s.code @@@ 'function' AND l.name = 'JavaScript'
ORDER BY paradedb.score(s.snippet_id) DESC;
```

This query finds JavaScript snippets that contain the word "function" in their code. It demonstrates how you can combine full-text search with traditional SQL conditions, which is especially useful when developers want to narrow their search to a specific programming language.

### Highlighting search results

To help developers quickly identify relevant code sections, you can highlight the matching terms:

```sql
SELECT
  snippet_id,
  title,
  paradedb.snippet(code) AS code_highlight
FROM snippets
WHERE code @@@ 'pool';
```

This wraps matched terms in `<b></b>` tags by default:

```
 snippet_id |          title           |                       code_highlight
------------+--------------------------+---------------------------------------------------------------
         2  | Database Connection Pool | const { <b>Pool</b> } = require("pg");\n\nconst <b>pool</b> = new <b>Pool</b>({...
         5  | SQL Transaction Helper   | ... const client = await <b>pool</b>.connect(); ...
```

You can customize the highlighting with different tags to match your UI:

```sql
SELECT
  snippet_id,
  title,
  paradedb.snippet(code, start_tag => '<code class="highlight">', end_tag => '</code>') AS code_highlight
FROM snippets
WHERE code @@@ 'pool';
```

This feature is particularly valuable in a code snippet manager as it allows developers to quickly see where their search terms appear in potentially lengthy code blocks.

## Building the Search API and Frontend

Now that we've set up the `pg_search` indexes and the backend database, let's integrate the search functionality into a simple API and frontend. This section walks you through setting up a Node.js API to handle search queries and a React-based frontend to display the results.

Start by creating a new directory for your project:

```bash
mkdir snippet-search
cd snippet-search
```

Then you are ready to create the backend API and frontend application.

### 1. Setting Up the API

We'll create a simple Node.js API to handle incoming search requests. The API will query the Neon Postgres database using the `pg_search` extension and return the results to the frontend.

#### Install Required Dependencies

First, we need a few packages to set up the backend. These include Express for the server, pg for interacting with the Postgres database, and `dotenv` for managing environment variables like your Neon database connection string.

```bash
mkdir snippet-search-api
cd snippet-search-api
npm init -y
npm install express pg dotenv cors
```

#### Create the Database Connection

We'll start by setting up the database connection in a separate file (`db.js`). This makes it easier to manage the connection and reuse it in other parts of the application.

```javascript
// db.js - Database connection
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

module.exports = pool;
```

In this file, we are creating a connection pool to manage connections to the Neon database. Make sure your `DATABASE_URL` is stored in a `.env` file like so:

```
DATABASE_URL=postgres://[username]:[password]@[endpoint]/[dbname]
```

For more information on how to work with Neon and Node.js, check out the [Neon documentation](/docs/guides/node).

#### Search Logic

Next, we'll write the search logic in a `searchService.js` file. This function will handle querying the database, applying the search filters, and returning the relevant results.

```javascript
// searchService.js - Search functionality
const db = require('./db');

async function searchSnippets({ query, language, tag, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  let searchQuery = `
    SELECT 
      s.snippet_id, 
      s.title, 
      s.description,
      l.name AS language,
      u.username AS created_by,
      paradedb.snippet(s.code) AS code_highlight,
      paradedb.score(s.snippet_id) AS relevance
    FROM snippets s
    JOIN languages l ON s.language_id = l.language_id
    JOIN users u ON s.user_id = u.user_id
  `;

  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  if (query) {
    whereConditions.push(
      `(s.title @@@ $${paramIndex} OR s.description @@@ $${paramIndex} OR s.code @@@ $${paramIndex})`
    );
    queryParams.push(query);
    paramIndex++;
  }

  if (language) {
    whereConditions.push(`l.name = $${paramIndex}`);
    queryParams.push(language);
    paramIndex++;
  }

  if (tag) {
    searchQuery += ` JOIN snippet_tags st ON s.snippet_id = st.snippet_id JOIN tags t ON st.tag_id = t.tag_id`;
    whereConditions.push(`t.name = $${paramIndex}`);
    queryParams.push(tag);
    paramIndex++;
  }

  if (whereConditions.length > 0) {
    searchQuery += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  searchQuery += ` ORDER BY relevance DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(limit, offset);

  const results = await db.query(searchQuery, queryParams);

  let countQuery = `
    SELECT COUNT(*) 
    FROM snippets s
    JOIN languages l ON s.language_id = l.language_id
  `;

  if (tag) {
    countQuery += ` JOIN snippet_tags st ON s.snippet_id = st.snippet_id JOIN tags t ON st.tag_id = t.tag_id`;
  }

  if (whereConditions.length > 0) {
    countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  const countResult = await db.query(countQuery, queryParams.slice(0, -2));
  const total = parseInt(countResult.rows[0].count);

  const snippetIds = results.rows.map((row) => row.snippet_id);

  if (snippetIds.length > 0) {
    const tagsQuery = `
      SELECT st.snippet_id, array_agg(t.name) as tags
      FROM snippet_tags st
      JOIN tags t ON st.tag_id = t.tag_id
      WHERE st.snippet_id = ANY($1)
      GROUP BY st.snippet_id
    `;

    const tagsResult = await db.query(tagsQuery, [snippetIds]);

    const snippetTags = {};
    tagsResult.rows.forEach((row) => {
      snippetTags[row.snippet_id] = row.tags;
    });

    results.rows.forEach((row) => {
      row.tags = snippetTags[row.snippet_id] || [];
    });
  }

  return {
    results: results.rows,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = {
  searchSnippets,
};
```

This function receives search parameters and constructs a SQL query with the appropriate filters. It also handles pagination by calculating `limit` and `offset` values, so only a subset of results is returned at a time.

#### Set Up the Express Server

Now, let's set up the Express server in a `server.js` file. This file will expose a simple `/api/search` endpoint that accepts GET requests with query parameters, handles them using the `searchSnippets` function, and returns the search results.

```javascript
// server.js - Express server
const express = require('express');
const cors = require('cors');
const { searchSnippets } = require('./searchService');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
  try {
    const { query, language, tag, page, limit } = req.query;

    if (!query && !language && !tag) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }

    const result = await searchSnippets({
      query,
      language,
      tag,
      page: parseInt(page || 1),
      limit: parseInt(limit || 10),
    });

    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

This server listens for search requests on the `/api/search` endpoint. It supports query parameters like `query`, `language`, and `tag`, and it passes these to the `searchSnippets` service to fetch and return the results.

### 2. Frontend: React Search Interface

Now that we have the API set up, let's create a simple frontend in React to allow users to perform searches.

#### Set Up the React App

Create a new React app and install the necessary dependencies:

```bash
npx create-react-app snippet-search-ui
cd snippet-search-ui
npm install axios highlight.js
```

#### Create the API Service

In the `src/services/api.js` file, we'll set up an Axios service to make requests to the backend API.

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Function to search snippets
export const searchSnippets = async (params) => {
  const response = await axios.get(`${API_URL}/search`, { params });
  return response.data;
};

export const getLanguages = async () => {
  // Mock API call to fetch languages
  return [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'Python' },
    { id: 3, name: 'Go' },
    { id: 4, name: 'SQL' },
    { id: 5, name: 'TypeScript' },
  ];
};

export const getTags = async () => {
  // Mock API call to fetch tags
  return [
    { id: 1, name: 'algorithm' },
    { id: 2, name: 'utility' },
    { id: 3, name: 'frontend' },
    { id: 4, name: 'database' },
    { id: 5, name: 'middleware' },
  ];
};
```

#### Build the Search Form Component

We need a form component where users can enter a search query, select a language, or filter by tags. The form will trigger the search when submitted.

```jsx
// src/components/SearchForm.js
import React, { useState, useEffect } from 'react';
import { getLanguages, getTags } from '../services/api';

const SearchForm = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [tag, setTag] = useState('');
  const [languages, setLanguages] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      const languagesData = await getLanguages();
      const tagsData = await getTags();
      setLanguages(languagesData);
      setTags(tagsData);
    };

    loadFilters();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, language, tag });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="">All Languages</option>
        {languages.map((lang) => (
          <option key={lang.id} value={lang.name}>
            {lang.name}
          </option>
        ))}
      </select>
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">All Tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
```

#### Code Snippet Component

Let's now create a component that displays a single code snippet:

```jsx
// src/components/CodeSnippet.js
import React from 'react';

const CodeSnippet = ({ snippet }) => {
  return (
    <div>
      <h3>{snippet.title}</h3>
      <pre>{snippet.code}</pre>
      <p>{snippet.description}</p>
    </div>
  );
};

export default CodeSnippet;
```

#### Display Search Results

Finally, let's put everything together in the main `App` component. We'll handle search requests, display the results, and paginate.

```jsx
// src/App.js
import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import CodeSnippet from './components/CodeSnippet';
import { searchSnippets } from './services/api';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (params) => {
    setLoading(true);
    try {
      const response = await searchSnippets(params);
      setResults(response.results);
    } catch (error) {
      console.error('Error during search', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      <div>
        {results.map((snippet) => (
          <CodeSnippet key={snippet.snippet_id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}

export default App;
```

This app handles searches, displays results, and allows users to filter based on query terms, languages, and tags.

You can also add styling to make the search form and results look better. For example, you can use CSS or a library like Tailwind CSS to style the components. For simplicity, we won't cover styling in this guide, but feel free to customize the UI to your liking.

### 3. Dockerizing the Application and Using Docker Compose

To deploy and run the search API and frontend in isolated containers, we can use Docker. In this section, we'll show you how to dockerize both the backend API and the frontend, and use Docker Compose to orchestrate the entire application.

#### Dockerizing the Backend API

To begin, let's create a Dockerfile for the backend API. This file will define the steps to build a container image for the Node.js API.

1. Create a `Dockerfile` in the root of the `snippet-search-api` directory:

   ```dockerfile
   FROM node:20-alpine

   WORKDIR /usr/src/app

   COPY package*.json ./

   RUN npm install

   COPY . .

   EXPOSE 3000

   CMD ["node", "server.js"]
   ```

   This Dockerfile uses the official Node.js image, sets up the working directory, installs dependencies, and exposes port 3000 (the port the API will listen on).

2. Create a `.dockerignore` file to avoid copying unnecessary files to the Docker image:

   ```plaintext
   node_modules
   npm-debug.log
   .env
   ```

#### Dockerizing the Frontend

Next, we'll dockerize the frontend React application. We'll create a separate `Dockerfile` for the frontend.

1. **Create a `Dockerfile` in the `snippet-search-ui` directory:**

   ```dockerfile
   FROM node:20-alpine

   WORKDIR /app

   COPY package*.json ./

   RUN npm install

   COPY . .

   RUN npm run build

   FROM nginx:alpine

   COPY --from=0 /app/build /usr/share/nginx/html

   EXPOSE 80

   CMD ["nginx", "-g", "daemon off;"]
   ```

   This Dockerfile does the following:
   - It first builds the React app using the Node.js image.
   - Then, it uses an Nginx image to serve the build files, ensuring that the app is ready for production.

#### Docker Compose Setup

Now, we'll use Docker Compose to run both the backend API and the frontend together in one command. We'll create a `compose.yml` file in the root directory of the project.

1. Create a `compose.yml` file in the root directory of the project, e.g. `snippet-search` which contains both `snippet-search-api` and `snippet-search-ui` directories:

   ```yaml
   services:
   # Backend API service
   api:
     build:
     context: ./snippet-search-api
     container_name: snippet-api
     environment:
       - DATABASE_URL=postgres://[username]:[password]@[endpoint]/[dbname]
     ports:
       - '3000:3000'
     networks:
       - snippet-network

   # Frontend service
   frontend:
     build:
     context: ./snippet-search-ui
     container_name: snippet-frontend
     ports:
       - '80:80'
     networks:
       - snippet-network

   networks:
   snippet-network:
     driver: bridge
   ```

   This file defines three services:
   - **`api`**: The backend service, built from the `snippet-search-api` directory. It expects the `DATABASE_URL` environment variable to connect to the Neon database. You should replace `[username]`, `[password]`, and `[endpoint]` with your actual Neon database credentials or use a `.env` file to manage these variables securely.
   - **`frontend`**: The React frontend service, built from the `snippet-search-ui` directory. It will serve the static build files via Nginx.

#### Building and Running the Application

With the Dockerfiles and `compose.yml` file in place, we can now build and start all the services with Docker Compose.

1. Build the images and start the containers:

   ```bash
   docker compose up --build
   ```

   This command will:
   - Build the Docker images for the backend API and the frontend.
   - Create and start the containers for the backend API, frontend, and Postgres database.

2. Access the application:
   - The backend API will be available at `http://localhost:3000`.
   - The frontend React app will be served at `http://localhost`.

3. Shut down the application:

   If you want to stop the containers, run:

   ```bash
   docker compose down
   ```

## Performance optimization tips

When working with larger collections containing thousands of code snippets, you can optimize `pg_search` performance with these adjustments:

### Configure PostgreSQL settings

Adjust these settings for better performance on large datasets:

```sql
-- Allocate more memory for index building
SET maintenance_work_mem = '1GB';  -- Adjust based on your compute size

-- Enable parallel workers
SET max_parallel_workers_per_gather = 4;
SET max_parallel_workers = 8;
```

These settings help Postgres use more system resources effectively. In Neon, `maintenance_work_mem` is set based on your compute size, don't exceed 50-60% of your compute's available RAM. For larger code repositories, these optimizations can significantly speed up both index creation and search queries.

### Pre-warm your indexes

When you restart your database or after creating indexes, you can pre-load them into memory for faster queries:

```sql
-- Install the extension
CREATE EXTENSION IF NOT EXISTS pg_prewarm;

-- Pre-warm indexes
SELECT pg_prewarm('snippet_search_idx');
```

Pre-warming loads index data into memory, eliminating disk read latency for initial searches. This is particularly valuable for snippet search, as it ensures the first developer searching after a system restart gets fast results.

## Conclusion

With `pg_search` on Neon, you can build a powerful code snippet search system directly within your Postgres database. This approach eliminates the need for separate search services while providing excellent search performance and features tailored to developers' needs.

The BM25 algorithm and inverted indexes ensure your searches are both fast and relevant, while the integration with standard SQL gives you powerful filtering and sorting capabilities.

For repositories with millions of snippets, only index columns you actually search on (this keeps index size manageable). Also consider partial indexes if you only search active or public snippets and monitor index size and rebuild periodically for optimal performance.

<NeedHelp />
