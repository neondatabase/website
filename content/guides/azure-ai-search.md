---
title: Full-Text Search with Neon and Azure AI Search
subtitle: Build a powerful hybrid search system for developer resources with Neon and Azure AI Search
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-01-05T00:00:00.000Z'
updatedOn: '2025-01-05T00:00:00.000Z'
---

In this guide you will learn how to implement a hybrid search functionality using Neon and Azure AI Search.

For the purpose of this guide, we will create a Node.js application that will allow you to search through your database. We will use the Azure SDK to interact with Azure AI Search. The application itself will represent a developer learning platform, which contains resources such as tutorials, cheat sheets, videos, and interactive code examples.

We will be using Neon for efficient full-text search and Azure AI Search for the AI-driven capabilities.

### What You'll Learn

- Configure Neon for full-text search
- Set up Azure AI Search and use the Azure SDK
- Implement hybrid search combining both systems
- Build a Node.js service to handle search requests

---

## Prerequisites

To follow this guide, ensure you have:

- A [Neon account](https://console.neon.tech/signup) with an active project.
- An [Azure account](https://azure.microsoft.com/free/) with Azure AI Search enabled.
- [Node.js](https://nodejs.org/) 18.x or later.
- Basic knowledge of SQL and JavaScript.

---

## Step 1: Set Up Neon for Full-Text Search

Let's start by creating our database schema and configuring Neon for [full-text search](/guides/full-text-search).

We'll create a schema to store and organize developer learning resources. The schema will include tables for technologies and tutorials, which will allow us to have an efficient categorization and search functionalities. We'll also set up a GIN index for full-text search.

```sql
-- Technologies Table
CREATE TABLE technologies (
    tech_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tutorials Table
CREATE TABLE tutorials (
    tutorial_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tech_id INTEGER REFERENCES technologies(tech_id),
    tags TEXT[],
    difficulty_level TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GIN Index for Full-Text Search
CREATE INDEX idx_tutorials_search ON tutorials
    USING GIN (to_tsvector('english', title || ' ' || content));
```

With the above schema, we will be able to store technologies and tutorials. The `tags` column will be used for categorization, and the `difficulty_level` column will help users filter resources based on their skill level.

The index here is using the `to_tsvector` function to create a GIN index for efficient full-text search. This index will allow us to search through the `title` and `content` columns of the `tutorials` table. For more information on full-text search in PostgreSQL, check out the [Neon Full-Text Search guide](/guides/full-text-search).

Next, you can insert developer resources into the `technologies` and `tutorials` tables.

```sql
-- Insert more Technologies
INSERT INTO technologies (name, category) VALUES ('React', 'Frontend');
INSERT INTO technologies (name, category) VALUES ('Python', 'Backend');

-- Insert Tutorials
INSERT INTO tutorials (title, content, tech_id, tags, difficulty_level)
VALUES ('Getting Started with Node.js', 'Learn the basics of Node.js', 1, ARRAY['Node.js', 'Backend'], 'Beginner');

INSERT INTO tutorials (title, content, tech_id, tags, difficulty_level)
VALUES ('Building a React App', 'Step-by-step guide to building a React application', 1, ARRAY['React', 'Frontend'], 'Intermediate');

INSERT INTO tutorials (title, content, tech_id, tags, difficulty_level)
VALUES ('Python for Data Science', 'Introduction to using Python for data science', 2, ARRAY['Python', 'Data Science'], 'Advanced');
```

Feel free to add more resources to the tables to test the search functionality.

## Step 2: Configure Azure AI Search

With the database schema set up, let's configure Azure AI Search to index and search through our developer resources.

If you haven't already, create an Azure account and enable Azure AI Search. Also, make sure you have the [Azure CLI installed](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).

### Setting Up Azure AI Search

1. Verify your Azure CLI installation and login to your Azure account:

   ```bash
   az --version
   az login
   ```

1. You can start by creating an Azure AI Search Resource.
   You can reference the [latest Azure documentation](https://learn.microsoft.com/en-us/azure/search/search-create-service-portal) to create a search service. Use the "Basic" SKU for testing or scale up for production depending on your requirements.

   ```bash
   az search service create \
       --name developer-search \
       --resource-group <your-resource-group> \
       --sku Basic \
       --location eastus2
   ```

   This command creates a new Azure AI Search service named `developer-search` in the `eastus2` region. You might have to choose a different name based on availability. Also, make sure to replace `<your-resource-group>` with your Azure resource group as per the Azure documentation above.

   Alternatively, you can create the search service using the [Azure Portal](https://learn.microsoft.com/en-us/azure/search/search-create-service-portal).

1. To get your service endpoint, you can the Azure portal and [find your search service](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/%7E/CognitiveSearch).
   - Under the Overview section, copy the URL and save it for a later step.
   - Also grab the API key of your Azure AI Search service from the Azure Portal. In the 'Settings' > 'Keys' section, copy and save an admin key for full rights to create and delete objects. There are two interchangeable primary and secondary keys. Choose either one.

### Creating an Index

In Azure AI Search, an index is your searchable data. It defines the structure of your data and the fields you can search on. You can learn more about [indexing in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-an-index) in the official documentation.

There are a few ways to create an index in Azure AI Search. You can use the Azure Portal, Azure CLI, or the Azure SDK.

For a quick start, you can use the Azure Portal, to create an index schema.

1. [Find your search service](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/%7E/CognitiveSearch) and navigate to the "Indexes" section to create a new index:

1. Here's an example schema for the developer resources:

   ```json
   {
     "name": "developer-index",
     "fields": [
       { "name": "id", "type": "Edm.String", "key": true },
       { "name": "title", "type": "Edm.String", "searchable": true, "sortable": true },
       { "name": "description", "type": "Edm.String", "searchable": true },
       { "name": "tags", "type": "Collection(Edm.String)", "facetable": true },
       { "name": "type", "type": "Edm.String", "searchable": false, "filterable": true },
       { "name": "content", "type": "Edm.String", "searchable": true }
     ],
     "suggesters": [
       {
         "name": "suggester",
         "searchMode": "analyzingInfixMatching",
         "sourceFields": ["title", "description"]
       }
     ]
   }
   ```

   The above schema defines an index named `developer-index` with fields for `id`, `title`, `description`, `tags`, `type`, and `content`. The `suggesters` section enables auto-suggestions based on the `title` and `description` fields.

   We will reference the `developer-index` index in our Node.js application to query the Azure AI Search service so if you choose a different name, make sure to update the application accordingly.

Rather than creating the index manually, you can also use the Azure SDK as well.

1. First, install the Azure SDK for JavaScript:

   ```bash
   npm install @azure/search-documents
   ```

1. Then, initialize the search client:

   ```js
   const { SearchIndexClient, AzureKeyCredential } = require('@azure/search-documents');

   const endpoint = 'YOUR_SEARCH_ENDPOINT';
   const apiKey = 'YOUR_ADMIN_API_KEY';
   const indexName = 'developer-index';

   const searchClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));
   ```

1. Create an index schema that defines the structure of your searchable content:

   ```js
   const indexDefinition = {
     name: 'developer-index',
     fields: [
       {
         name: 'id',
         type: 'Edm.String',
         key: true,
         searchable: false,
       },
       {
         name: 'title',
         type: 'Edm.String',
         searchable: true,
         filterable: true,
         sortable: true,
       },
       {
         name: 'content',
         type: 'Edm.String',
         searchable: true,
         filterable: false,
       },
       {
         name: 'tags',
         type: 'Collection(Edm.String)',
         searchable: true,
         filterable: true,
         facetable: true,
       },
       {
         name: 'category',
         type: 'Edm.String',
         searchable: true,
         filterable: true,
         facetable: true,
       },
     ],
     suggesters: [
       {
         name: 'sg',
         searchMode: 'analyzingInfixMatching',
         sourceFields: ['title'],
       },
     ],
   };

   async function createSearchIndex() {
     try {
       await searchClient.createIndex(indexDefinition);
       console.log(`Index ${indexName} created successfully`);
     } catch (error) {
       console.error('Error creating index:', error);
     }
   }
   ```

You can use the `createSearchIndex` function to create the index schema in Azure AI Search. Note that you need to replace `YOUR_SEARCH_ENDPOINT` and `YOUR_ADMIN_API_KEY` with your Azure AI Search service endpoint and admin API key.

Run the function to create the index schema in Azure AI Search. You can verify the index creation in the Azure Portal under the "Indexes" section of your search service.

### Adding Data to the Index

As of the time of writing, Azure AI Search does not support direct indexing from PostgreSQL, but to populate your index, you can use the Azure Search REST API to upload data to Azure AI Search or use the Azure SDK as well.

Alternatively, you can export data from PostgreSQL to [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/search/search-blob-storage-integration) and then add the blob storage as a data source to Azure AI Search. This method is useful for large datasets or when you need to sync data periodically.

Here's how you can add data to the index using the Azure SDK:

1. First, create a utility function to upload documents to your search index using the Azure SDK:

   ```javascript
   const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');

   async function uploadToSearchIndex(documents, endpoint, indexName, apiKey) {
     const searchClient = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));

     try {
       const uploadResult = await searchClient.uploadDocuments(documents);
       console.log(`Uploaded ${uploadResult.results.length} documents`);

       // Check for any failed uploads
       const failedUploads = uploadResult.results.filter((r) => !r.succeeded);
       if (failedUploads.length > 0) {
         console.warn(`Failed to upload ${failedUploads.length} documents`);
         console.warn(failedUploads);
       }

       return uploadResult;
     } catch (error) {
       console.error('Error uploading documents:', error);
       throw error;
     }
   }
   ```

2. For testing purposes, let's create sample documents directly in the script itself:

   ```javascript
   const sampleDocuments = [
     {
       id: '1',
       title: 'Introduction to PostgreSQL',
       description: 'Learn the basics of PostgreSQL, an open-source relational database system.',
       tags: ['postgresql', 'database'],
       type: 'tutorial',
       content: 'PostgreSQL is a powerful, open-source relational database system.',
     },
     {
       id: '2',
       title: 'Advanced SQL Queries',
       description: 'Master complex SQL queries for data analysis.',
       tags: ['sql', 'data analysis'],
       type: 'tutorial',
       content: 'Learn about joins, subqueries, and window functions in SQL.',
     },
   ];

   // Upload the sample documents
   await uploadToSearchIndex(
     sampleDocuments,
     process.env.AZURE_SEARCH_ENDPOINT,
     'developer-index',
     process.env.AZURE_SEARCH_KEY
   );
   ```

3. Feel free to replace the sample documents with your own data and run the script to upload the documents to your Azure AI Search index.

4. After that, you can use the Azure portal or CLI to query the index and verify the data upload.

If you wanted to you could also directly use the REST API itself, you can find more information on the [Azure Search docs](https://learn.microsoft.com/en-us/rest/api/searchservice/create-data-source) about uploading data to Azure AI Search.

Now that you have your data indexed in Azure AI Search, let's move on to building the hybrid search service that combines Neon and Azure AI Search.

Make sure to go over the [data import strategies](https://learn.microsoft.com/en-us/azure/search/search-what-is-data-import) to understand how to import data into Azure AI Search efficiently.

## Step 3: Build the Hybrid Search Service

For this demo we will build a Node.js application, but Azure AI Search can be integrated with any programming language or framework.

For Node.js Azure provides an [official SDK](https://www.npmjs.com/package/@azure/search-documents) that you can use to interact with the Azure AI Search service. Besides JavaScript, Azure provides SDKs for different languages like Java, Python, and .NET to interact with the search service.

### Project Structure

First, let's set up a clear project structure that will help us organize our code:

```plaintext
hybrid-search/
├─ src/
│   ├─ config/
│   │   └─ database.js     # Database configuration
│   ├─ services/
│   │   ├─ neonService.js  # Neon search implementation
│   │   └─ azureService.js # Azure AI Search implementation
│   ├─ routes/
│   │   └─ searchRoutes.js # API endpoints
│   ├─ utils/
│   │   └─ searchUtils.js  # Shared utilities
│   └─ app.js             # Main application file
├─ .env                   # Environment variables
└─ package.json
```

### Setting Up Dependencies

First, install the required packages:

```bash
npm install @azure/search-documents pg express dotenv cors
```

We are using the following packages:

- `@azure/search-documents`: Official Azure AI Search client library
- `pg`: PostgreSQL client for Node.js
- `express`: Web framework for Node.js
- `dotenv`: Environment variable loader
- `cors`: Cross-origin resource sharing middleware

### Database Configuration

The database configuration module will handle our connection to Neon:

```javascript
// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper function to query the database
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

module.exports = { pool, query };
```

This configuration:

- Creates a connection pool with optimal settings for a web application
- Implements a helper function for executing queries
- Handles client release to prevent connection leaks

### Implementing Neon Search Service

The Neon service which we will create will handle full-text search using Postgres's built-in capabilities:

```javascript
// src/services/neonService.js
const { query } = require('../config/database');

class NeonSearchService {
  async search(searchQuery, filters = {}, limit = 10) {
    try {
      let sql = `
        WITH RankedResults AS (
          SELECT
            t.tutorial_id,
            t.title,
            t.content,
            t.difficulty_level,
            t.tags,
            tech.name as technology,
            ts_rank_cd(
              setweight(to_tsvector('english', title), 'A') ||
              setweight(to_tsvector('english', content), 'B'),
              plainto_tsquery('english', $1)
            ) as rank
          FROM tutorials t
          JOIN technologies tech ON t.tech_id = tech.tech_id
          WHERE to_tsvector('english', title || ' ' || content) @@ plainto_tsquery($1)
      `;

      const values = [searchQuery];
      let paramIndex = 2;

      // Add filters if provided
      if (filters.difficulty) {
        sql += ` AND difficulty_level = $${paramIndex}`;
        values.push(filters.difficulty);
        paramIndex++;
      }

      if (filters.technology) {
        sql += ` AND tech.name = $${paramIndex}`;
        values.push(filters.technology);
        paramIndex++;
      }

      if (filters.tags && filters.tags.length > 0) {
        sql += ` AND tags && $${paramIndex}`;
        values.push(filters.tags);
        paramIndex++;
      }

      sql += `
        )
        SELECT *,
          CASE
            WHEN title ILIKE '%' || $1 || '%' THEN rank * 2  -- Boost exact title matches
            ELSE rank
          END as final_rank
        FROM RankedResults
        ORDER BY final_rank DESC
        LIMIT $${paramIndex}
      `;
      values.push(limit);

      const result = await query(sql, values);
      return result.rows;
    } catch (error) {
      console.error('Neon search error:', error);
      throw error;
    }
  }
}

module.exports = new NeonSearchService();
```

This implementation includes several features:

- Uses a [CTE](/postgresql/postgresql-tutorial/postgresql-cte) for better query organization
- Implements weighted ranking for title and content
- Supports filtering by difficulty, technology, and tags
- Handles SQL injection through parameterized queries

### Implementing Azure AI Search Service

With the Neon service in place, let's create the Azure service to handle AI-powered search features:

```javascript
// src/services/azureService.js
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
require('dotenv').config();

class AzureSearchService {
  constructor() {
    this.client = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT,
      'developer-index',
      new AzureKeyCredential(process.env.AZURE_SEARCH_KEY)
    );
  }

  async search(searchQuery, filters = {}, limit = 10) {
    try {
      const searchOptions = {
        select: ['id', 'title', 'description', 'content', 'tags', 'type'],
        queryType: 'simple',
        semanticConfiguration: 'default',
        highlightFields: 'content',
        top: limit,
        includeTotalCount: true,
        captions: 'extractive',
        answers: 'extractive',
        filter: this.buildFilter(filters),
      };

      const searchResults = await this.client.search(searchQuery, searchOptions);
      return this.processResults(searchResults);
    } catch (error) {
      console.error('Azure search error:', error);
      throw error;
    }
  }

  buildFilter(filters) {
    const filterConditions = [];

    if (filters.difficulty) {
      filterConditions.push(`difficulty eq '${filters.difficulty}'`);
    }

    if (filters.type) {
      filterConditions.push(`type eq '${filters.type}'`);
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags.map((tag) => `tags/any(t: t eq '${tag}')`).join(' or ');
      filterConditions.push(`(${tagConditions})`);
    }

    return filterConditions.length > 0 ? filterConditions.join(' and ') : undefined;
  }

  async processResults(searchResults) {
    const results = [];
    for await (const result of searchResults.results) {
      results.push({
        id: result.document.id,
        title: result.document.title,
        description: result.document.description,
        content: result.document.content,
        tags: result.document.tags,
        highlights: result.highlights,
        captions: result.captions,
        score: result.score,
      });
    }
    return results;
  }
}

module.exports = new AzureSearchService();
```

This implementation includes:

- Azure AI search client initialization
- Result highlighting for better user experience
- Extractive captions for quick content preview
- Filtering options
- Score normalization for better integration with Neon results

For the complete list of search options and features, refer to the [Azure AI Search documentation](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search).

### Implementing the Search Routes

With both Neon and Azure services ready, let's create the routes module to handle search requests:

```javascript
// src/routes/searchRoutes.js
const express = require('express');
const neonSearch = require('../services/neonService');
const azureSearch = require('../services/azureService');
const { mergeResults } = require('../utils/searchUtils');

const router = express.Router();

router.post('/search', async (req, res) => {
  try {
    const { query, filters = {}, limit = 10, searchType = 'hybrid' } = req.body;

    // Validate the search query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Search query is required',
      });
    }

    // Determine search strategy
    let results;
    switch (searchType) {
      case 'hybrid':
        const [neonResults, azureResults] = await Promise.all([
          neonSearch.search(query, filters, limit),
          azureSearch.search(query, filters, limit),
        ]);
        results = mergeResults(neonResults, azureResults);
        break;

      case 'neon':
        results = await neonSearch.search(query, filters, limit);
        break;

      case 'azure':
        results = await azureSearch.search(query, filters, limit);
        break;

      default:
        return res.status(400).json({
          error: 'Invalid search type',
        });
    }

    res.json({
      query,
      results,
      metadata: {
        total: results.length,
        searchType,
        executionTime: process.hrtime()[1] / 1000000,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'An error occurred during search',
    });
  }
});

module.exports = router;
```

This implementation includes:

- Supports different search strategies (hybrid, Neon-only, Azure-only)
- Includes error handling and validation
- Provides execution metadata
- Handles result merging for hybrid searches depending on the search strategy

### Utility Functions

With everything in place, let's also create some utility functions to handle common operations:

```javascript
// src/utils/searchUtils.js

function mergeResults(neonResults, azureResults) {
  const merged = new Map();

  // Process Neon results
  neonResults.forEach((result) => {
    merged.set(result.tutorial_id.toString(), {
      ...result,
      neon_rank: result.rank,
      azure_score: 0,
      final_score: normalizeNeonScore(result.rank),
    });
  });

  // Process Azure results
  azureResults.forEach((result) => {
    const existingResult = merged.get(result.id);
    if (existingResult) {
      existingResult.azure_score = result.score;
      existingResult.highlights = result.highlights;
      existingResult.final_score = calculateHybridScore(existingResult.neon_rank, result.score);
    } else {
      merged.set(result.id, {
        ...result,
        neon_rank: 0,
        final_score: normalizeAzureScore(result.score),
      });
    }
  });

  // Sort by final score and convert to array
  return Array.from(merged.values()).sort((a, b) => b.final_score - a.final_score);
}

function normalizeNeonScore(rank) {
  return Math.min(rank, 1);
}

function normalizeAzureScore(score) {
  return score;
}

function calculateHybridScore(neonRank, azureScore) {
  const normalizedNeon = normalizeNeonScore(neonRank);
  const normalizedAzure = normalizeAzureScore(azureScore);

  const NEON_WEIGHT = 0.4;
  const AZURE_WEIGHT = 0.6;

  return normalizedNeon * NEON_WEIGHT + normalizedAzure * AZURE_WEIGHT;
}

module.exports = {
  mergeResults,
  calculateHybridScore,
};
```

These utilities handle:

- Result merging from both search engines
- Score normalization and weighting
- Proper sorting of combined results

### Main Application File

Finally, let's tie everything together in a main application file where we set up our Express server:

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', searchRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Search service running on port ${PORT}`);
});

module.exports = app;
```

This main file:

- Sets up our middleware
- Configures the routes
- Adds error handling

Each component of this implementation is designed to be maintainable. You can easily extend the search service with additional features like data imports to Azure AI Search from PostgreSQL for example.

### Testing the Search Service

Create a `.env` file in the project root with the following environment variables:

```plaintext
DATABASE_URL=postgres://user:password@localhost:5432/developer_resources
AZURE_SEARCH_ENDPOINT=https://<developer-search>.search.windows.net
AZURE_SEARCH_KEY=your-azure-search-key
PORT=3000
```

Start the application by running:

```bash
node src/app.js
```

To test the search service, run the application and send a POST request to the `/api/search` endpoint with a search query:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "Node.js", "limit": 5, "searchType": "hybrid"}' \
  http://localhost:3000/api/search
```

This request will search for resources related to Node.js using the hybrid search strategy. You can also test the Neon and Azure search strategies by changing the `searchType` parameter.

Feel free to customize the search query, filters, and limit to test different scenarios. Also, consider adding more resources to the database and Azure AI Search index to see the hybrid search in action.

## Conclusion

In this guide, you learned how to build a hybrid search service using Neon and Azure AI Search.

As a next step, you can check out the [Full-Text Search guide](/guides/full-text-search) to learn more about Neon's capabilities and how to optimize your search queries. Additionally, you can explore the [Azure AI Search documentation](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search) to discover more advanced features and integrations.

## Additional Resources

- [Azure AI Language Documentation](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search)
- [Neon Documentation](/docs)
- [Azure AI Language Client Library](https://learn.microsoft.com/en-us/javascript/api/overview/azure/search-documents-readme)

<NeedHelp />
