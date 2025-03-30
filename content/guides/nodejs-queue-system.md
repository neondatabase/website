---
title: Building a Job Queue System with Node.js, Bull, and Neon Postgres
subtitle: Learn how to implement a job queue system to handle background tasks efficiently using Node.js, Bull, and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-03-16T00:00:00.000Z'
updatedOn: '2025-03-16T00:00:00.000Z'
---

Job queues are essential components in modern applications. Queues enable you to handle resource-intensive or time-consuming tasks asynchronously. This approach improves application responsiveness by moving heavy processing out of the request-response cycle.

In this guide, we'll walk through building a job queue system using Node.js, Bull (a Redis-backed queue library), and Neon Postgres to process jobs efficiently at scale.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- [Redis](https://redis.io/download) installed locally
- Basic understanding of JavaScript and PostgreSQL

## Understanding Job Queues

Job queues allow applications to offload time-consuming tasks to be processed in the background. Some common use cases include:

- Email delivery
- Image or video processing
- Data aggregation and reporting
- Webhook delivery
- Regular maintenance tasks

Here's how our architecture will work:

1. The main application adds jobs to the queue
2. Bull manages the queue in Redis
3. Worker processes consume jobs from the queue
4. Job statuses and results are stored in Neon Postgres
5. The application can check job status and retrieve results

This separation improves system performance, reliability, and scalability. It also allows for better error handling, retry logic, monitoring and even user experience as the application can respond quickly to user requests regardless of the job processing time.

## Create a Neon project

First, let's set up a new Neon Postgres database to store our job metadata.

1. Navigate to the [Neon Console](https://console.neon.tech/app/projects) and create a new project.

2. Choose a name for your project, for example "job-queue-system".

3. After creating the project, you'll see the connection details. Save the connection string, you'll need it to connect to your database.

4. Using the SQL Editor in the Neon Console or your preferred PostgreSQL client, create the tables for our job queue system:

```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  job_id VARCHAR(255) UNIQUE NOT NULL,
  queue_name VARCHAR(100) NOT NULL,
  data JSONB,
  status VARCHAR(50) NOT NULL,
  result JSONB,
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_queue_name ON jobs(queue_name);
```

This jobs table will track:

- Unique job identifiers
- The queue a job belongs to
- Job data/parameters
- Current status (pending, active, completed, failed)
- Results or errors
- Timestamps for tracking job lifecycle
- Retry information

## Set up your Node.js project

Now that our database is ready, let's create a Node.js project:

1. Create a new directory for your project:

```bash
mkdir job-queue-system
cd job-queue-system
```

2. Initialize a new Node.js project:

```bash
npm init -y
```

3. Install the required dependencies:

```bash
npm install bull pg dotenv express
```

These packages provide:

- `bull`: Queue management with Redis
- `pg`: PostgreSQL client for Node.js
- `dotenv`: Environment variable management
- `express`: Web framework to create a simple API for our example

4. Create a `.env` file to store your configuration:

```
# Database
DATABASE_URL=postgres://[user]:[password]@[hostname]/[database]?sslmode=require

# Redis
REDIS_URL=redis://localhost:6379

# Application
PORT=3000
```

Replace the `DATABASE_URL` with your Neon connection string.

## Integrate Bull for job processing

Bull is a Node.js library that implements a fast queue system based on Redis.

If you don't have Redis installed, you can run it using Docker:

```bash
docker run -d -p 6379:6379 redis
```

Let's set up the basic queue structure for our job queue system.

Create a file named `src/queues/index.js`:

```javascript
// src/queues/index.js
const Bull = require('bull');
const dotenv = require('dotenv');

dotenv.config();

// Create queues
const emailQueue = new Bull('email', process.env.REDIS_URL);
const imageProcessingQueue = new Bull('image-processing', process.env.REDIS_URL);
const dataExportQueue = new Bull('data-export', process.env.REDIS_URL);

// Export the queues to be used elsewhere in the application
module.exports = {
  emailQueue,
  imageProcessingQueue,
  dataExportQueue,
};
```

What the queues represent in this context is a way to group similar jobs together. This file creates three different queues for different types of jobs. In a production application, you might have many more queues for various tasks.

Now, let's create a utility to add jobs to these queues. Create a file named `src/utils/queueHelper.js`:

```javascript
// src/utils/queueHelper.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Helper function to add a job to a queue and record it in Postgres
async function addJob(queue, data, options = {}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Add job to Bull queue
    const job = await queue.add(data, options);

    // Record job in Postgres
    const result = await client.query(
      `INSERT INTO jobs (job_id, queue_name, data, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [job.id.toString(), queue.name, JSON.stringify(data), 'pending']
    );

    await client.query('COMMIT');

    return {
      jobId: job.id,
      dbId: result.rows[0].id,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Helper function to update job status in Postgres
async function updateJobStatus(jobId, queueName, updates) {
  const client = await pool.connect();

  try {
    // Build the SET clause based on provided updates
    const setClauses = [];
    const values = [jobId, queueName];
    let paramIndex = 3;

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return;
    }

    const setClause = setClauses.join(', ');

    await client.query(
      `UPDATE jobs
       SET ${setClause}
       WHERE job_id = $1 AND queue_name = $2`,
      values
    );
  } finally {
    client.release();
  }
}

module.exports = {
  addJob,
  updateJobStatus,
};
```

This helper file provides two main functions:

1. `addJob`: Adds a job to a Bull queue and records it in our Neon Postgres database
2. `updateJobStatus`: Updates a job's status in the Neon Postgres as it progresses through the queue

## Create the job processor

Now, let's create processors for each type of job. We'll create processors for email sending, image processing, and data exports. A processor is a function that takes a job object from Bull, processes it, and updates the job status in Postgres.

First, let's set up our directory structure:

```bash
mkdir -p src/processors
```

Create a file for email processing at `src/processors/emailProcessor.js`:

```javascript
// src/processors/emailProcessor.js
const { updateJobStatus } = require('../utils/queueHelper');

async function sendEmail(to, subject, body) {
  // In a real application, you'd use a library like Nodemailer
  // This is a simplified example
  console.log(`Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return success
  return { delivered: true, timestamp: new Date() };
}

// The processor function takes a job object from Bull
async function processEmailJob(job) {
  try {
    // Update job status in Postgres
    await updateJobStatus(job.id, 'email', {
      status: 'active',
      started_at: new Date().toISOString(),
    });

    // Extract job data
    const { to, subject, body } = job.data;

    // Process the job
    const result = await sendEmail(to, subject, body);

    // Update job status on success
    await updateJobStatus(job.id, 'email', {
      status: 'completed',
      result: JSON.stringify(result),
      completed_at: new Date().toISOString(),
    });

    // Return the result
    return result;
  } catch (error) {
    // Update job status on failure
    await updateJobStatus(job.id, 'email', {
      status: 'failed',
      error: error.message,
      completed_at: new Date().toISOString(),
    });

    // Re-throw the error for Bull to handle
    throw error;
  }
}

module.exports = processEmailJob;
```

Similarly, create a processor for image processing at `src/processors/imageProcessor.js`:

```javascript
// src/processors/imageProcessor.js
const { updateJobStatus } = require('../utils/queueHelper');

async function processImage(imageUrl, options) {
  // In a real application, you'd use libraries like Sharp
  // This is a simplified example
  console.log(`Processing image from ${imageUrl}`);
  console.log('Options:', options);

  // Simulate CPU-intensive task
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Return processed image details
  return {
    processed: true,
    originalUrl: imageUrl,
    processedUrl: `processed-${imageUrl}`,
    dimensions: { width: 800, height: 600 },
    timestamp: new Date(),
  };
}

async function processImageJob(job) {
  try {
    // Update job status in Postgres
    await updateJobStatus(job.id, 'image-processing', {
      status: 'active',
      started_at: new Date().toISOString(),
    });

    // Extract job data
    const { imageUrl, options } = job.data;

    // Process the job
    const result = await processImage(imageUrl, options);

    // Update job status on success
    await updateJobStatus(job.id, 'image-processing', {
      status: 'completed',
      result: JSON.stringify(result),
      completed_at: new Date().toISOString(),
    });

    // Return the result
    return result;
  } catch (error) {
    // Update job status on failure
    await updateJobStatus(job.id, 'image-processing', {
      status: 'failed',
      error: error.message,
      completed_at: new Date().toISOString(),
    });

    // Re-throw the error for Bull to handle
    throw error;
  }
}

module.exports = processImageJob;
```

Now, let's create a processor for data exports at `src/processors/dataExportProcessor.js`:

```javascript
// src/processors/dataExportProcessor.js
const { updateJobStatus } = require('../utils/queueHelper');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function exportData(query, format) {
  console.log(`Executing query: ${query}`);
  console.log(`Export format: ${format}`);

  // Actually execute the query against Neon Postgres
  const result = await pool.query(query);

  // Simulate file creation
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return export details
  return {
    records: result.rowCount,
    format: format,
    downloadUrl: `https://example.com/exports/${Date.now()}.${format}`,
    timestamp: new Date(),
  };
}

async function processDataExportJob(job) {
  try {
    // Update job status in Postgres
    await updateJobStatus(job.id, 'data-export', {
      status: 'active',
      started_at: new Date().toISOString(),
    });

    // Extract job data
    const { query, format } = job.data;

    // Process the job
    const result = await exportData(query, format);

    // Update job status on success
    await updateJobStatus(job.id, 'data-export', {
      status: 'completed',
      result: JSON.stringify(result),
      completed_at: new Date().toISOString(),
    });

    // Return the result
    return result;
  } catch (error) {
    // Update job status on failure
    await updateJobStatus(job.id, 'data-export', {
      status: 'failed',
      error: error.message,
      completed_at: new Date().toISOString(),
    });

    // Re-throw the error for Bull to handle
    throw error;
  }
}

module.exports = processDataExportJob;
```

Each processor function follows a similar pattern:

- Update the job status to `active` when processing starts
- Extract job data from the Bull job object
- Process the job
- Update the job status to `completed` on success or `failed` on error
- Return the result

The core logic of each processor is kept separate from the job queue management, which allows for easier testing, maintenance, and reuse.

## Implement PostgreSQL job tracking

With the processors in place, let's create a module to retrieve job information from PostgreSQL. Create a file named `src/utils/jobsRepository.js`:

```javascript
// src/utils/jobsRepository.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getJobById(jobId) {
  const result = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [jobId]);

  return result.rows[0] || null;
}

async function getJobsByStatus(status, limit = 100, offset = 0) {
  const result = await pool.query(
    'SELECT * FROM jobs WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [status, limit, offset]
  );

  return result.rows;
}

async function getJobsByQueue(queueName, limit = 100, offset = 0) {
  const result = await pool.query(
    'SELECT * FROM jobs WHERE queue_name = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [queueName, limit, offset]
  );

  return result.rows;
}

async function getJobStats() {
  const result = await pool.query(`
    SELECT 
      queue_name,
      status,
      COUNT(*) as count
    FROM jobs
    GROUP BY queue_name, status
    ORDER BY queue_name, status
  `);

  return result.rows;
}

module.exports = {
  getJobById,
  getJobsByStatus,
  getJobsByQueue,
  getJobStats,
};
```

This module provides several functions to query job information from our Postgres database:

1. `getJobById`: Retrieve a specific job by its ID
2. `getJobsByStatus`: Get jobs filtered by their status
3. `getJobsByQueue`: Get jobs from a specific queue
4. `getJobStats`: Get statistics about jobs across all queues

These functions will be used by the API to provide job status and statistics to the user.

## Build retry and error handling

Bull provides built-in retry capabilities. Let's set up our worker with proper retry and error handling. Create a file named `src/worker.js`:

```javascript
// src/worker.js
const { emailQueue, imageProcessingQueue, dataExportQueue } = require('./queues');

const processEmailJob = require('./processors/emailProcessor');
const processImageJob = require('./processors/imageProcessor');
const processDataExportJob = require('./processors/dataExportProcessor');
const { updateJobStatus } = require('./utils/queueHelper');

// Set up processors with retry logic
emailQueue.process(processEmailJob);
imageProcessingQueue.process(processImageJob);
dataExportQueue.process(processDataExportJob);

// Global error handlers for each queue
const setupErrorHandlers = (queue) => {
  queue.on('failed', async (job, err) => {
    console.error(`Job ${job.id} in ${queue.name} queue failed:`, err.message);

    // Update job status and increment attempt count
    await updateJobStatus(job.id, queue.name, {
      status: job.attemptsMade >= job.opts.attempts ? 'failed' : 'waiting',
      attempts: job.attemptsMade,
      error: err.message,
    });
  });

  queue.on('completed', async (job, result) => {
    console.log(`Job ${job.id} in ${queue.name} queue completed`);
  });

  queue.on('stalled', async (job) => {
    console.warn(`Job ${job.id} in ${queue.name} queue has stalled`);

    // Update job status
    await updateJobStatus(job.id, queue.name, {
      status: 'stalled',
    });
  });
};

// Set up error handlers for all queues
setupErrorHandlers(emailQueue);
setupErrorHandlers(imageProcessingQueue);
setupErrorHandlers(dataExportQueue);

console.log('Worker started processing jobs...');
```

This worker file:

1. Imports all our queues and job processors
2. Assigns each processor to its respective queue
3. Sets up error handlers for failed, completed, and stalled jobs
4. Updates the job status in Postgres based on these events

## Set up a simple API

Let's create a simple Express API to add jobs to the queue and check their status. Create a file named `src/api.js`:

```javascript
// src/api.js
const express = require('express');
const { emailQueue, imageProcessingQueue, dataExportQueue } = require('./queues');
const { addJob } = require('./utils/queueHelper');
const {
  getJobById,
  getJobsByStatus,
  getJobsByQueue,
  getJobStats,
} = require('./utils/jobsRepository');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Add email job
app.post('/jobs/email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // Validate input
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add job to queue with 3 retry attempts
    const job = await addJob(
      emailQueue,
      { to, subject, body },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      }
    );

    res.status(201).json({
      message: 'Email job added to queue',
      jobId: job.jobId,
    });
  } catch (error) {
    console.error('Error adding email job:', error);
    res.status(500).json({ error: 'Failed to add job to queue' });
  }
});

// Add image processing job
app.post('/jobs/image', async (req, res) => {
  try {
    const { imageUrl, options } = req.body;

    // Validate input
    if (!imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add job to queue with 2 retry attempts
    const job = await addJob(
      imageProcessingQueue,
      { imageUrl, options },
      {
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      }
    );

    res.status(201).json({
      message: 'Image processing job added to queue',
      jobId: job.jobId,
    });
  } catch (error) {
    console.error('Error adding image processing job:', error);
    res.status(500).json({ error: 'Failed to add job to queue' });
  }
});

// Add data export job
app.post('/jobs/export', async (req, res) => {
  try {
    const { query, format } = req.body;

    // Validate input
    if (!query || !format) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add job to queue with 3 retry attempts
    const job = await addJob(
      dataExportQueue,
      { query, format },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );

    res.status(201).json({
      message: 'Data export job added to queue',
      jobId: job.jobId,
    });
  } catch (error) {
    console.error('Error adding data export job:', error);
    res.status(500).json({ error: 'Failed to add job to queue' });
  }
});

// Get job status
app.get('/jobs/:id', async (req, res) => {
  try {
    const job = await getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Get jobs by status
app.get('/jobs/status/:status', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const jobs = await getJobsByStatus(req.params.status, limit, offset);

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs by status:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get jobs by queue
app.get('/jobs/queue/:queue', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const jobs = await getJobsByQueue(req.params.queue, limit, offset);

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs by queue:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job stats
app.get('/stats', async (req, res) => {
  try {
    const stats = await getJobStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({ error: 'Failed to fetch job stats' });
  }
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
```

This API provides endpoints to:

1. Add jobs to the different queues
2. Check the status of a specific job
3. List jobs by status or queue
4. Get job statistics

We will later add a Bull Board dashboard to monitor the job queues in real-time and use these endpoints to test our job queue system.

## Create the main entry point

With all the above in place, let's create the main entry point for our application. Create a file named `src/index.js`:

```javascript
// src/index.js
const dotenv = require('dotenv');
dotenv.config();

// In a production environment, you would typically run the API and worker in separate processes
// For simplicity, we're starting both in the same file
const startMode = process.env.START_MODE || 'all';

if (startMode === 'all' || startMode === 'api') {
  require('./api');
  console.log('API server started');
}

if (startMode === 'all' || startMode === 'worker') {
  require('./worker');
  console.log('Worker process started');
}
```

Update your `package.json` to include start scripts:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "start:api": "START_MODE=api node src/index.js",
    "start:worker": "START_MODE=worker node src/index.js"
  }
}
```

## Run the application

Now you can run the application:

```bash
npm start
```

If you were to navigate to `http://localhost:3000`, you would see the API server running.

This will start both the API server and the worker process. In a production environment, you might want to run them separately:

```bash
# Start the API server
npm run start:api

# Start the worker in a different terminal
npm run start:worker
```

## Monitor your job queue

To monitor your job queue in real-time, you can use Bull UI tools like [Bull Board](https://github.com/felixmosh/bull-board).

Install Bull Board:

```bash
npm install @bull-board/express @bull-board/api
```

Then add the following to your `src/api.js` file:

```javascript
// Add at the top of the file
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

// Add before app.use(express.json())
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullAdapter(emailQueue),
    new BullAdapter(imageProcessingQueue),
    new BullAdapter(dataExportQueue),
  ],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

Now you can access the Bull Board dashboard at `http://localhost:3000/admin/queues`.

## Testing Your Job Queue System

Now that you've set up your job queue system, let's test it to ensure everything works correctly. We'll create several test jobs, monitor their progress, and examine the results.

First, make sure your system is running with both the API server and worker process:

```bash
npm start
```

Using a tool like cURL or Postman, you can send requests to your API to create new jobs:

### 1. Create an Email Job

```bash
curl -X POST http://localhost:3000/jobs/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "This is a test email from our job queue system."
  }'
```

You should receive a response like:

```json
{
  "message": "Email job added to queue",
  "jobId": "1"
}
```

### 2. Create an Image Processing Job

```bash
curl -X POST http://localhost:3000/jobs/image \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/sample-image.jpg",
    "options": {
      "resize": { "width": 800, "height": 600 },
      "format": "webp"
    }
  }'
```

### 3. Create a Data Export Job

```bash
curl -X POST http://localhost:3000/jobs/export \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM jobs LIMIT 10",
    "format": "csv"
  }'
```

### Monitor Job Progress

After creating the jobs, you can monitor their progress in several ways:

#### Check Job Status via API

Use the job ID returned when you created the job to check its status:

```bash
curl http://localhost:3000/jobs/1 | jq
```

You should see the job details, including its current status (pending, active, completed, or failed):

```json
{
  "id": 1,
  "job_id": "1",
  "queue_name": "email",
  "data": {
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "This is a test email from our job queue system."
  },
  "status": "completed",
  "result": { "delivered": true, "timestamp": "2025-03-16T11:32:47.123Z" },
  "error": null,
  "created_at": "2025-03-16T11:32:45.678Z",
  "started_at": "2025-03-16T11:32:46.789Z",
  "completed_at": "2025-03-16T11:32:47.890Z",
  "attempts": 1,
  "max_attempts": 3
}
```

#### View Jobs by Status

To see all jobs with a specific status:

```bash
curl http://localhost:3000/jobs/status/completed
```

This will return a list of all completed jobs. You can also check for "pending", "active", or "failed" jobs.

#### Check Queue Statistics

To see statistics about all your queues:

```bash
curl http://localhost:3000/stats | jq
```

This will show you a breakdown of job counts by queue and status:

```json
[
  { "queue_name": "email", "status": "completed", "count": "1" },
  { "queue_name": "image-processing", "status": "active", "count": "1" },
  { "queue_name": "data-export", "status": "pending", "count": "1" }
]
```

### Bull Board Dashboard

If you've set up Bull Board as described earlier, you can visit `http://localhost:3000/admin/queues` in your browser to see a visual dashboard of all your queues and jobs.

![Bull Board Dashboard](/guides/images/job-queue-system/bull-board.png)

This dashboard provides a real-time view of your queues, including active, waiting, and completed jobs.

## Verifying Database Records

To check that the job information is being correctly stored in your Neon Postgres database, you can use the Neon SQL Editor or any PostgreSQL client to run queries:

```sql
SELECT * FROM jobs;
```

You can also check processing times for completed jobs:

```sql
SELECT
  job_id,
  queue_name,
  status,
  EXTRACT(EPOCH FROM (completed_at - started_at)) AS processing_time_seconds
FROM jobs
WHERE status = 'completed';
```

This query will show you the processing time for each completed job in seconds.

## Conclusion

In this guide, you've built a job queue system using Node.js, Bull, and Neon Postgres. This system can handle different types of background tasks, retry failed jobs, and track job status and results in a PostgreSQL database.

The combination of Bull's queue management backed by Redis and Neon's serverless Postgres for persistent job tracking provides a scalable and reliable solution for background processing. It is a great foundation for building more complex job processing systems in your applications.

You can extend this system by adding more specialized queues, extending the monitoring, implementing user notifications, or integrating with other services in your architecture.

## Additional resources

- [Bull Documentation](https://github.com/OptimalBits/bull/blob/master/REFERENCE.md)
- [Neon Postgres Documentation](/docs)
- [Node.js PostgreSQL Client (pg)](https://node-postgres.com/)
- [Redis Documentation](https://redis.io/documentation)

<NeedHelp />
