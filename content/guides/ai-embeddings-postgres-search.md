---
title: Building semantic search with AI embeddings, Neon, and pgvector
subtitle: Learn how to create a semantic search system using AI embeddings, Neon, and pgvector.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-05-17T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Traditional text search relies on exact keyword matches, which often misses the semantic meaning behind queries.

When someone searches for "car maintenance," they might also be interested in results about "vehicle servicing" or "auto repair", but keyword-based search won't make these connections.

AI embeddings solve this problem by converting text into high-dimensional vectors that capture semantic meaning. Words and phrases with similar meanings cluster together in this vector space, so search can match on meaning rather than exact words.

The pgvector extension adds vector similarity search to Postgres, so you can store embeddings alongside your regular data and run semantic searches with SQL. On Neon, the database's compute autoscales with query load.

In this guide, you'll learn how to build a semantic search system that can power document search and content recommendations using OpenAI embeddings stored in Neon with pgvector.

## What you'll build

By the end of this guide, you'll have:

- An understanding of AI embeddings and how they improve search
- A Neon database configured with the pgvector extension
- An embedding generation service powered by OpenAI's API
- A document search system that understands semantic similarity

## Prerequisites

To follow along with this guide, you'll need:

- A [Neon account](https://console.neon.tech/signup) with a project
- An [OpenAI API key](https://platform.openai.com/api-keys)
- Node.js 20.x or later installed
- Basic familiarity with SQL and REST APIs
- Understanding of JavaScript promises and async/await

## Understanding AI embeddings and vector search

Before the implementation, here's how AI embeddings work and why they help with search.

### What are embeddings?

Embeddings are numerical representations of text that capture semantic meaning in high-dimensional space. When you send text to OpenAI's embedding API, it returns an array of floating-point numbers (typically 1,536 dimensions for the `text-embedding-3-small` model) that represents the "meaning" of that text.

Here's a simplified example of how embeddings work:

```javascript
// These texts have similar meanings
const text1 = "The cat jumped over the fence";
const text2 = "A feline leaped across a barrier";

// Their embeddings would be mathematically similar
const embedding1 = [-0.02, 0.15, -0.08, ...]; // 1,536 numbers
const embedding2 = [-0.01, 0.16, -0.09, ...]; // Similar values
```

Semantically similar texts produce similar embedding vectors, so a search can find relevant content even when it doesn't share exact keywords with the query.

### Why pgvector?

pgvector extends Postgres with vector data types and similarity search operations. Instead of moving your data to specialized vector databases, you can store embeddings alongside your existing relational data and perform vector similarity searches with SQL:

```sql
-- Find documents most similar to a query embedding
SELECT title, content,
       embedding <-> $1 as distance
FROM documents
ORDER BY embedding <-> $1
LIMIT 5;
```

The `<->` operator calculates the distance between vectors, with smaller distances indicating higher similarity.

## Setting up pgvector on Neon

We'll start by enabling pgvector on your Neon database and creating the necessary tables for our search system.

First, create a new Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech)
2. Click "New Project"
3. Name your project "semantic-search-system"
4. Choose a region close to your users
5. Click **Create project**
6. After the project is created, consider [editing the compute](/docs/manage/computes#edit-a-compute) to use at least 1 CU (≈4 GB RAM), since vector operations can be CPU-intensive

Next, enable the pgvector extension. Connect to your database and run this SQL:

```sql
-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify the extension is working
SELECT extversion FROM pg_extension WHERE extname = 'vector';
```

This command adds vector data types and similarity functions to your Postgres database. The second query returns the installed pgvector version.

Next, we'll create the database schema for our semantic search system. This includes tables for documents and their embeddings, along with indexes for fast vector similarity search.

```sql
-- Table for storing documents with their embeddings
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    embedding vector(1536) -- OpenAI's text-embedding-3-small produces 1536-dimensional vectors
);

-- Create indexes for fast vector similarity search
CREATE INDEX documents_embedding_idx ON documents USING ivfflat (embedding vector_cosine_ops);
```

The `vector(1536)` data type stores 1,536-dimensional vectors, matching OpenAI's embedding size. The `ivfflat` index enables approximate nearest neighbor search using cosine distance, which speeds up searches across thousands of embeddings. See [Performance optimization](#performance-optimization) for tuning, and the [pgvector docs](/docs/extensions/pgvector#ivfflat) for why IVFFlat indexes work best when built after the table has data.

## Building an embedding generation service

Next, create a Node.js service that generates embeddings with [OpenAI's API](https://platform.openai.com/docs/guides/embeddings). It turns your text content into the vectors you store in the database.

Let's set up the project structure and install the necessary dependencies:

```bash
mkdir semantic-search-service
cd semantic-search-service
npm init -y
npm install openai pg dotenv express cors
```

Create a `.env` file to store your API credentials:

```bash
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://user:password@ep-abc123.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Now let's create an embedding service that handles OpenAI API interactions. This service preprocesses text, generates embeddings, and handles errors:

```javascript
// embedding.js
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class EmbeddingService {
  constructor() {
    this.model = 'text-embedding-3-small'; // Cost-effective and performant
    this.maxTokens = 8191; // Maximum tokens for this model
  }

  async generateEmbedding(text) {
    try {
      // Clean and prepare text for embedding generation
      const cleanText = this.preprocessText(text);

      const response = await openai.embeddings.create({
        model: this.model,
        input: cleanText,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  preprocessText(text) {
    // Remove extra whitespace and normalize the text
    let cleaned = text.trim().replace(/\s+/g, ' ');

    // Truncate if too long (rough estimate: 1 token ≈ 4 characters)
    const maxChars = this.maxTokens * 3; // Conservative estimate
    if (cleaned.length > maxChars) {
      cleaned = cleaned.substring(0, maxChars) + '...';
    }

    return cleaned;
  }

  // Create optimized text for embedding generation
  createDocumentText(title, content, category = '') {
    return `Title: ${title}\nCategory: ${category}\nContent: ${content}`;
  }
}

module.exports = EmbeddingService;
```

This service preprocesses text so it fits within OpenAI's token limits, combines document fields into a single labeled string, and handles API errors. The `createDocumentText` method labels the title, category, and content so the embedding reflects all three.

At the time of writing, OpenAI's `text-embedding-3-small` model is its lowest-cost embedding model. Check [OpenAI's embeddings guide](https://platform.openai.com/docs/guides/embeddings) for current models.

## Creating a document management system

Next, build a service that stores documents in the database and generates an embedding for each one:

```javascript
// document-service.js
const { Pool } = require('pg');
const EmbeddingService = require('./embedding');
require('dotenv').config();

class DocumentService {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
      max: 20,
    });
    this.embeddingService = new EmbeddingService();
  }

  async addDocument(title, content, category = null) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Combine document fields into optimized text for embedding
      const fullText = this.embeddingService.createDocumentText(title, content, category || '');

      // Generate embedding using OpenAI API
      console.log(`Generating embedding for document: ${title}`);
      const embedding = await this.embeddingService.generateEmbedding(fullText);
      const formattedEmbedding = `[${embedding.join(',')}]`;

      // Store document with its embedding in the database
      const result = await client.query(
        `
        INSERT INTO documents (title, content, category, embedding)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, created_at
      `,
        [title, content, category, formattedEmbedding]
      );

      await client.query('COMMIT'); // Complete transaction

      console.log(`Document added successfully: ${result.rows[0].id}`);
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK'); // Undo changes on error
      console.error('Error adding document:', error);
      throw error;
    } finally {
      client.release(); // Return connection to pool
    }
  }

  async searchDocuments(query, limit = 10, category = null) {
    try {
      // First, convert the search query into an embedding
      const fullText = this.embeddingService.createDocumentText(query, '', category || '');
      const queryEmbedding = await this.embeddingService.generateEmbedding(fullText);

      // Format embedding as a pgvector-compatible string
      const formattedEmbedding = `[${queryEmbedding.join(',')}]`;

      // Start building the SQL query
      let sql = `
            SELECT
                id,
                title,
                content,
                category,
                created_at,
                1 - (embedding <=> $1) as similarity_score
            FROM documents
            WHERE 1 - (embedding <=> $1) > 0.3
            `;

      const params = [formattedEmbedding];

      // Add category filter if needed
      if (category) {
        sql += ` AND category = $2`;
        params.push(category);
      }

      // Append ORDER BY and LIMIT clauses
      sql += ` ORDER BY embedding <=> $1 LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await this.pool.query(sql, params);

      // Format results
      return result.rows.map((row) => ({
        ...row,
        similarity_score: parseFloat(row.similarity_score.toFixed(4)),
        preview: row.content.length > 200 ? row.content.substring(0, 200) + '...' : row.content,
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

  async getDocumentById(id) {
    try {
      const result = await this.pool.query(
        `
        SELECT id, title, content, category, created_at
        FROM documents
        WHERE id = $1
      `,
        [id]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }
}

module.exports = DocumentService;
```

The `addDocument` method generates embeddings and stores them alongside the document data, while `searchDocuments` performs the actual semantic search by converting queries to embeddings and finding the most similar documents using pgvector's distance operators.

The `<=>` operator in the SQL query calculates cosine distance between vectors, with smaller values indicating higher similarity. The query converts it to a similarity score (`1 - distance`) that's easier to read, where higher is more similar.

The `getDocumentById` method retrieves a document by its ID so applications can fetch the full content.

## Building the search API

With the document service in place, create an Express API with endpoints for adding documents and running semantic searches.

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const DocumentService = require('./document-service');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const documentService = new DocumentService();

// Add a single document with automatic embedding generation
app.post('/documents', async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        error: 'Title and content are required',
      });
    }

    // Add document and generate embedding
    const result = await documentService.addDocument(title, content, category);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({
      error: 'Failed to add document',
      message: error.message,
    });
  }
});

// Perform semantic search across all documents
app.post('/search', async (req, res) => {
  try {
    const { query, limit = 10, category } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Search query is required',
      });
    }

    const startTime = Date.now();

    // Execute semantic search using vector similarity
    const results = await documentService.searchDocuments(query, limit, category);

    const searchTime = Date.now() - startTime;

    res.json({
      query,
      results,
      count: results.length,
      search_time_ms: searchTime,
    });
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message,
    });
  }
});

// Get a specific document by ID
app.get('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await documentService.getDocumentById(parseInt(id));

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({
      error: 'Failed to get document',
      message: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await documentService.pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Semantic search service running on port ${PORT}`);
});
```

The `/search` endpoint takes natural language queries and returns semantically relevant documents, even when there are no exact keyword matches.

The endpoint also returns the search time, which you can use to monitor performance as your document collection grows.

## Testing the semantic search system

With the API in place, add some sample documents and run a few queries to see how the search matches on meaning rather than exact keywords.

Create a test script to populate your database with sample content and test the search functionality:

```javascript
// test-search.js
const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function testSemanticSearch() {
  try {
    console.log('Adding sample documents to test semantic search...\n');

    // Add diverse sample documents across different topics
    const sampleDocuments = [
      {
        title: 'Getting Started with Machine Learning',
        content:
          'Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed. This guide covers the basics of supervised learning, unsupervised learning, and neural networks.',
        category: 'technology',
      },
      {
        title: 'Healthy Cooking Tips',
        content:
          "Eating nutritious meals doesn't have to be complicated. Focus on fresh ingredients, reduce processed foods, and try cooking methods like steaming and grilling. Meal prep can save time and help maintain a balanced diet.",
        category: 'health',
      },
      {
        title: 'Remote Work Best Practices',
        content:
          'Working from home requires discipline and good habits. Set up a dedicated workspace, maintain regular hours, and use collaboration tools effectively. Communication with team members is crucial for remote success.',
        category: 'productivity',
      },
      {
        title: 'Understanding Neural Networks',
        content:
          'Neural networks are computing systems inspired by biological neural networks. They consist of layers of interconnected nodes that process information. Deep learning uses multi-layered neural networks to solve complex problems.',
        category: 'technology',
      },
    ];

    // Add each document to the system
    for (const doc of sampleDocuments) {
      await axios.post(`${baseURL}/documents`, doc);
      console.log(`✓ Added: ${doc.title}`);
    }

    console.log('\nDocuments added successfully! Now testing semantic search...\n');

    // Test semantic searches that don't use exact keywords
    const testQueries = [
      'artificial intelligence and computers', // Should find ML and neural network docs
      'how to stay healthy while eating', // Should find cooking tips
      'working from home effectively', // Should find remote work practices
      'deep learning algorithms', // Should find both AI-related documents
    ];

    // Run each test query and display results
    for (const query of testQueries) {
      console.log(`🔍 Searching for: "${query}"`);

      const response = await axios.post(`${baseURL}/search`, {
        query,
        limit: 3,
      });

      const { results, search_time_ms } = response.data;

      console.log(`   Found ${results.length} results in ${search_time_ms}ms`);

      // Display the most relevant results
      results.forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.title} (similarity: ${doc.similarity_score})`);
        console.log(`      Category: ${doc.category}`);
        console.log(`      Preview: ${doc.preview}\n`);
      });

      console.log('---\n');
    }
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Start the server and run tests
console.log('Make sure your server is running with: node server.js\n');
testSemanticSearch();
```

Install `axios` for the test script and run it:

```bash
npm install axios

# Start your server in one terminal
node server.js

# Run the test in another terminal
node test-search.js
```

You should see output showing how the semantic search finds relevant documents even when the search terms don't appear exactly in the document text.

For example, searching for "artificial intelligence and computers" should return documents about machine learning and neural networks, because the search matches on meaning rather than keywords.

Scores closer to 1.0 indicate higher semantic similarity.

## Performance optimization

As your document collection grows, tune the pgvector index. The default index settings work for small datasets, but larger collections need tuning:

```sql
-- Drop existing indexes to recreate with optimal settings
DROP INDEX IF EXISTS documents_embedding_idx;

-- Create optimized indexes based on your data size
-- Rule of thumb: lists = rows / 1000, with minimum of 10
CREATE INDEX documents_embedding_idx ON documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);  -- Adjust based on your document count

-- Update table statistics for optimal query planning
ANALYZE documents;
```

The index speeds up queries by running approximate nearest neighbor searches instead of comparing every vector.

Adjust the `lists` parameter as your data grows. More documents need more lists. For other index types and tuning options, see [The pgvector extension](/docs/extensions/pgvector).

## Conclusion

You've built a semantic search API that stores OpenAI embeddings in a Postgres database on Neon and queries them with `pgvector`. From here, you could add features like search suggestions or multilingual support.

## Additional resources

- [pgvector documentation](https://github.com/pgvector/pgvector)
- [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings)
- [Neon documentation](/docs)
- [pgvector best practices](https://github.com/pgvector/pgvector#best-practices)

<NeedHelp />
