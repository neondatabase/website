---
title: Sentiment Analysis with Azure AI Services and Neon
subtitle: Learn how to analyze customer feedback using Azure AI Language and store results in Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-11-30T00:00:00.000Z'
updatedOn: '2024-11-30T00:00:00.000Z'
---

Analyzing customer sentiment can help you understand your customer satisfaction and identify areas for improvement. The Azure AI Language Services provide tools for sentiment analysis, key phrase extraction, and language detection which can be used to analyze customer feedback and extract valuable insights.

In this guide, you'll learn how to use Azure AI Language Services to analyze customer feedback and save the results in Neon Postgres. We'll go through setting up your environment, creating a database to store feedback and analysis results, and running the analysis to get useful insights.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription
- A [Neon account](https://console.neon.tech/signup) and project
- Node.js 18.x or later
- Basic familiarity with SQL and JavaScript

## Setting Up Your Development Environment

If you haven't already, follow these steps to set up your development environment:

### Create a Neon Project

1. Navigate to the [Neon Console](https://console.neon.tech)
2. Click "New Project"
3. Select Azure as your cloud provider
4. Choose East US 2 as your region
5. Name your project (e.g., "sentiment-analysis")
6. Click "Create Project"

Save your connection details, you'll need them later to connect to your Neon database.

### Create Database Schema

Next, you'll set up the database tables to store customer feedback and sentiment analysis results. These tables will hold the feedback text, analysis scores, sentiment labels, key phrases, and timestamps.

Connect to your Neon database and create tables for storing our customer feedback and sentiment analysis results from the Azure AI Language service:

```sql
CREATE TABLE customer_feedback (
    feedback_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50),
    feedback_text TEXT NOT NULL,
    product_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sentiment_results (
    result_id SERIAL PRIMARY KEY,
    feedback_id INTEGER REFERENCES customer_feedback(feedback_id),
    sentiment_score DECIMAL(4,3),
    sentiment_label VARCHAR(20),
    key_phrases TEXT[],
    language_code VARCHAR(10),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

With the tables created, let's move on to setting up the Azure AI Language service.

### Set Up Azure AI Language

The [Azure AI Language service](https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview) provides a set of tools for text analytics, including sentiment analysis, key phrase extraction, and language detection. To use the service, you'll need to create a new Language Service resource in your Azure account.

1. Go to the [Azure portal](https://portal.azure.com/)
1. Search for "Azure AI Services" in the search bar
1. From the list of services, select "Language Service"
1. Click the "Create" button to create a new Language Service resource
1. Select your subscription and resource group
1. Choose a region (East US 2 for proximity to Neon)
1. Select a pricing tier (Free tier for testing)
1. Create the resource
1. Once created, copy the endpoint URL and access key

### Project Setup

For the sake of this guide, we'll create a Node.js script that analyzes existing feedback stored in the Neon database. In a real-world app, you could integrate this process directly so that whenever a user posts a review, a queued job or a scheduled task automatically analyzes the feedback right away.

Let's start by creating a new Node.js project:

```bash
mkdir sentiment-analysis
cd sentiment-analysis
npm init -y
```

After creating the project, install the required packages:

```bash
npm install @azure/ai-language-text pg dotenv
```

The packages we're using are:

- `@azure/ai-language-text`: [Azure AI Language client library for JavaScript](https://www.npmjs.com/package/@azure/ai-language-text), this will allow us to interact with the Azure AI Language service to analyze text instead of using the REST API directly.
- `pg`: A PostgreSQL client for Node.js, this will allow us to connect to the Neon database and store the analysis results.
- `dotenv`: A package for loading environment variables from a `.env` file.

With the packages installed, create a `.env` file in the project root and add your Azure AI Language service key and endpoint, as well as your Neon database connection URL:

```env
AZURE_LANGUAGE_KEY=your_key_here
AZURE_LANGUAGE_ENDPOINT=your_endpoint_here
DATABASE_URL=postgres://user:password@your-neon-host.cloud/dbname
```

Change the `DATABASE_URL` to match your Neon database connection details. Also, replace `your_key_here` and `your_endpoint_here` with your Azure AI Language service key and endpoint which you can find in the Azure portal under your Language Service resource.

## Implementation

With everything set up, let's start implementing the sentiment analysis script. We'll create separate modules for database connection, Azure AI Language client, analysis script, and report generation.

### Database Connection

In this step, we'll set up a connection to our Neon Postgres database using the `pg` package. This connection will allow you to read customer feedback and store sentiment analysis results whenever the analysis script runs.

We'll use a connection pool to manage multiple database connections efficiently, which is especially useful when running scripts that perform multiple queries.

Create a new file `src/database.js` and add the following code:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

module.exports = pool;
```

The `pool` object will be used to connect to the database and execute queries. We'll get the connection details from the `.env` file using the `dotenv` package.

### Azure AI Language Client

Now let's set up the Azure AI Language client to perform our sentiment analysis and extract key phrases from customer feedback stored in our Neon database. Here is where we'll use the `@azure/ai-language-text` package to interact with the Azure AI Language service.

Create a new file `src/textAnalytics.js` and add the following code:

```javascript
const { TextAnalysisClient, AzureKeyCredential } = require('@azure/ai-language-text');
require('dotenv').config();

const client = new TextAnalysisClient(
  process.env.AZURE_LANGUAGE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_LANGUAGE_KEY)
);

async function analyzeSentiment(text) {
  const actions = [
    {
      kind: 'SentimentAnalysis',
    },
  ];

  const [result] = await client.analyze('SentimentAnalysis', [text]);

  return {
    score: result.confidenceScores[result.sentiment],
    label: result.sentiment,
    language: result.language,
  };
}

async function extractKeyPhrases(text) {
  const [result] = await client.analyze('KeyPhraseExtraction', [text]);
  return result.keyPhrases;
}

module.exports = {
  analyzeSentiment,
  extractKeyPhrases,
};
```

A quick overview of what we've done here:

- **Azure Client Setup**: We create a `TextAnalysisClient` using the Azure endpoint and API key from the environment variables. This client handles communication with the Azure AI Language service.
- **`analyzeSentiment` Function**: Analyzes the sentiment of the provided text and returns the sentiment label (positive, negative, mixed, or neutral), the sentiment score, and the detected language.
- **`extractKeyPhrases` Function**: Extracts key phrases from the given text, helping identify the main topics or themes.

Now that the Azure AI Language client is ready, let's move on to the main analysis script.

### Main Analysis Script

Now that we have our database connection and Azure AI Language client set up, let's create a script to process customer feedback, analyze it, and store the results in our Neon database.

Create a new file `src/analyze.js` and add the following code:

```javascript
const db = require('./database');
const { analyzeSentiment, extractKeyPhrases } = require('./textAnalytics');

async function processFeedback() {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Get unanalyzed feedback
    const feedbackResult = await client.query(`
      SELECT f.feedback_id, f.feedback_text 
      FROM customer_feedback f
      LEFT JOIN sentiment_results s ON f.feedback_id = s.feedback_id
      WHERE s.feedback_id IS NULL
    `);

    for (const row of feedbackResult.rows) {
      // Analyze sentiment and extract key phrases
      const [sentiment, keyPhrases] = await Promise.all([
        analyzeSentiment(row.feedback_text),
        extractKeyPhrases(row.feedback_text),
      ]);

      // Store results in the sentiment_results table
      await client.query(
        `
        INSERT INTO sentiment_results 
        (feedback_id, sentiment_score, sentiment_label, key_phrases, language_code)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [row.feedback_id, sentiment.score, sentiment.label, keyPhrases, sentiment.language]
      );
    }

    await client.query('COMMIT');
    console.log(`Processed ${feedbackResult.rows.length} feedback items`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { processFeedback };
```

Here we've implemented the following:

1. We start by fetching the customer feedback that hasn't been analyzed yet. We do this by selecting feedback entries that don't have corresponding sentiment analysis results in the `sentiment_results` table.
1. Next, for each feedback entry, it uses the `analyzeSentiment` function to get the sentiment and the `extractKeyPhrases` function to identify key phrases. These operations are performed in parallel using `Promise.all` to speed up the process.
1. After that, we insert the sentiment score, sentiment label, key phrases, and detected language into the `sentiment_results` table.

It is worth mentioning that, we are also using a database transaction (`BEGIN`, `COMMIT`, and `ROLLBACK`) to ensure data integrity. If an error occurs, changes are rolled back.

We can use this script and run it periodically or triggered whenever new feedback is received to keep the sentiment analysis up-to-date.

### Analysis Reports

With the sentiment analysis results stored in the database, we can generate reports to extract insights from the data. Let's create a module to generate sentiment analysis reports based on the stored results.

Create a new file `src/reports.js` and add the following code:

```javascript
const db = require('./database');

async function generateSentimentReport() {
  const client = await db.connect();

  try {
    // Overall sentiment distribution
    const sentimentDist = await client.query(`
      SELECT
        sentiment_label,
        COUNT(*) as count,
        AVG(sentiment_score) as avg_score
      FROM sentiment_results
      GROUP BY sentiment_label
    `);

    // Trending negative feedback topics
    const negativeTopics = await client.query(`
      SELECT
        UNNEST(key_phrases) as topic,
        COUNT(*) as mentions
      FROM sentiment_results
      WHERE sentiment_label = 'negative'
      GROUP BY topic
      ORDER BY mentions DESC
      LIMIT 10
    `);

    return {
      sentimentDistribution: sentimentDist.rows,
      topNegativeTopics: negativeTopics.rows,
    };
  } finally {
    client.release();
  }
}

module.exports = { generateSentimentReport };
```

Here we've defined two main functions that generate two main reports:

- **Sentiment Distribution**: This report shows the count and average sentiment score for each sentiment label (positive, negative, mixed, neutral).
- **Top Negative Topics**: This report lists the most common key phrases in negative feedback, helping identify recurring issues or topics that need attention.

These reports can be used to track customer sentiment trends, identify common complaints, and prioritize areas for improvement. For example, you can set up alerts like sending an email or a Slack message whenever the sentiment score drops below a certain threshold or when a specific topic is mentioned frequently.

## Running the Analysis

To put it all together, we'll create a script that processes customer feedback, analyzes it using Azure AI Language, and generates reports to summarize the insights.

Create a new file `index.js` and add the following code:

```javascript
const { processFeedback } = require('./src/analyze');
const { generateSentimentReport } = require('./src/reports');

async function main() {
  try {
    // Process new feedback
    await processFeedback();

    // Generate reports
    const report = await generateSentimentReport();
    console.log('Sentiment Distribution:', report.sentimentDistribution);
    console.log('Top Negative Topics:', report.topNegativeTopics);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
```

This script will run the sentiment analysis on the customer feedback stored in the Neon database and generate reports based on the analysis results. You can run this script manually or set up a scheduled job to run it periodically.

The script can be extended to include additional reports, alerts, or integrations with other services based on the sentiment analysis results but for now, let's focus on running the analysis.

## Testing the Analysis

As a final step, let's test the sentiment analysis script by adding some sample customer feedback to the database and running the analysis script.

If you haven't already, create a few sample feedback entries in the `customer_feedback` table which we can use for testing. Here's an example SQL script to insert sample feedback with different sentiment labels:

```sql
INSERT INTO customer_feedback (customer_id, feedback_text, product_id) VALUES
-- Positive feedback
('CUST001', 'The new dashboard design is fantastic! Much easier to find everything I need and the analytics features are exactly what we were looking for.', 'SAAS-DASH'),
('CUST002', 'Your customer support team is incredible. Had an issue with our API integration and they helped us resolve it within minutes.', 'SAAS-SUPPORT'),
('CUST003', 'The automated reporting feature saves me hours every week. Best investment we''ve made this year for our analytics stack!', 'SAAS-REPORT'),

-- Mixed feedback
('CUST004', 'Love most of the new features, but the export functionality is a bit limited. Would love to see more format options.', 'SAAS-EXPORT'),
('CUST005', 'Great platform overall, though it can be slow during peak hours. The UI is intuitive but some advanced features are hard to find.', 'SAAS-PERF'),
('CUST006', 'Good value for enterprise plan, but smaller teams might find it pricey. The collaboration features make it worth it for us.', 'SAAS-PRICE'),

-- Negative feedback
('CUST007', 'Been experiencing frequent timeouts for the past week. Our team''s productivity has taken a hit and support hasn''t provided a clear timeline for resolution.', 'SAAS-PERF'),
('CUST008', 'The recent UI update is a massive step backward. Can''t find basic features anymore and my team is frustrated.', 'SAAS-UI'),
('CUST009', 'Pricing increased by 40% with barely any notice. Considering switching to alternatives as this no longer fits our budget.', 'SAAS-PRICE'),

-- Detailed feedback
('CUST010', 'We''ve been using the platform for 6 months now. The API documentation is comprehensive and integration was smooth. The webhook reliability has been perfect, and the custom event tracking is powerful. Only wish the dashboard had more customization options.', 'SAAS-API'),
('CUST011', 'While the data visualization options are powerful, the learning curve is steep. Took our team weeks to fully understand all features. Once mastered though, the insights we get are invaluable.', 'SAAS-VIS'),
('CUST012', 'The collaboration features are game-changing for our remote team. Real-time editing, commenting, and version control work flawlessly. However, the mobile app needs improvement.', 'SAAS-COLLAB'),

-- Technical feedback
('CUST013', 'REST API rate limits are too restrictive on the growth plan. Had to upgrade just for the API limits even though we don''t need the other enterprise features.', 'SAAS-API'),
('CUST014', 'SSO integration was unnecessarily complicated. Documentation is outdated and support couldn''t help with our specific Azure AD setup.', 'SAAS-AUTH'),
('CUST015', 'The new GraphQL API is amazing! Much more efficient than the REST endpoints. Query performance improved our app''s load time significantly.', 'SAAS-API');
```

The feedback entries include a mix of positive, mixed, and negative sentiments, as well as some feedback to test the sentiment analysis and key phrase extraction.

After running the SQL script to insert the sample feedback, let's run the sentiment analysis script:

```bash
node index.js
```

Check the console output for sentiment analysis results and reports:

```shell
Processed 15 feedback items
Sentiment Distribution: [
  {
    sentiment_label: 'negative',
    count: '4',
    avg_score: '0.84500000000000000000'
  },
  {
    sentiment_label: 'positive',
    count: '9',
    avg_score: '0.96777777777777777778'
  },
  { sentiment_label: 'mixed', count: '1', avg_score: null },
  {
    sentiment_label: 'neutral',
    count: '1',
    avg_score: '0.88000000000000000000'
  }
]
Top Negative Topics: [
  { topic: 'support', mentions: '2' },
  { topic: 'team', mentions: '2' },
  { topic: 'recent UI update', mentions: '1' },
  { topic: 'past week', mentions: '1' },
  { topic: 'clear timeline', mentions: '1' },
  { topic: 'SSO integration', mentions: '1' },
  { topic: 'productivity', mentions: '1' },
  { topic: 'Pricing', mentions: '1' },
  { topic: 'resolution', mentions: '1' },
  { topic: 'hit', mentions: '1' }
]
```

This output gives you a snapshot of customer sentiment and highlights recurring issues which can help you identify areas for improvement.

## Automating the Analysis

While running the sentiment analysis manually is useful for testing, in a production environment you'll want to automate this process.

One option is to integrate the sentiment analysis code into your application, so it runs whenever new feedback is submitted.

Alternatively, you can use a scheduled task to process feedback at regular intervals. For example, you could create an Azure Function that runs every few hours to analyze the new feedback and generate reports.

1. If you haven't already, follow the [Azure Functions Quickstart guide](https://learn.microsoft.com/azure/azure-functions/functions-create-first-function) to set up your development environment.

2. Create a new Azure Function with a timer trigger. The schedule expression `0 0 */2 * * *` will run the function every two hours.

3. Replace the default function code with the following to process the feedback from your Neon Postgres database:

   ```javascript
   const { processFeedback } = require('./src/analyze');

   module.exports = async function (context, myTimer) {
     const timeStamp = new Date().toISOString();

     if (myTimer.isPastDue) {
       context.log('Timer function is running late!');
     }

     try {
       await processFeedback();
       context.log('Sentiment analysis completed successfully:', timeStamp);
     } catch (err) {
       context.log.error('Error processing feedback:', err);
       throw err;
     }
   };
   ```

The timer schedule is defined in the `function.json` file as follows:

```json
{
  "bindings": [
    {
      "name": "sentimentAnalysisTrigger",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 */2 * * *"
    }
  ]
}
```

This configuration makes sure that the function runs every two hours. You can adjust the schedule as needed using a [cron expression](https://learn.microsoft.com/en-gb/azure/azure-functions/functions-bindings-timer).

For more details on connecting Azure Functions to a Postgres database and deploying the function to Azure, see the [Building a Serverless Referral System with Neon Postgres and Azure Functions](/guides/azure-functions-referral-system) guide.

## Analyzing Results

Now that you've processed customer feedback and stored the sentiment analysis results, you can run SQL queries to extract insights from the data. Here are some example queries to get you started:

1. This query shows how sentiment varies over time, giving you a sense of customer satisfaction trends:

   ```sql
   SELECT
       DATE_TRUNC('day', cf.created_at) AS date,
       AVG(sr.sentiment_score) AS avg_sentiment,
       COUNT(*) AS feedback_count
   FROM customer_feedback cf
   JOIN sentiment_results sr ON cf.feedback_id = sr.feedback_id
   GROUP BY date
   ORDER BY date;
   ```

2. Identify the most mentioned topics in negative feedback to spot recurring issues:

   ```sql
   SELECT
       kp AS topic,
       COUNT(*) AS mentions
   FROM sentiment_results sr,
        UNNEST(key_phrases) kp
   WHERE sentiment_label = 'negative'
   GROUP BY kp
   ORDER BY mentions DESC
   LIMIT 10;
   ```

## Conclusion

In this guide, we covered how to analyze customer feedback using Azure AI Language Services and store the results in a Neon Postgres database. This setup is just a starting point. You can expand it by adding real-time triggers, building dashboards, or supporting multiple languages.

The Azure AI Language service also includes SDKs for other languages like [Python](https://learn.microsoft.com/en-us/python/api/overview/azure/ai-textanalytics-readme), [Java](https://learn.microsoft.com/en-us/java/api/overview/azure/ai-textanalytics-readme), and [.NET](https://learn.microsoft.com/en-us/dotnet/api/overview/azure/ai.textanalytics-readme), so you can integrate sentiment analysis into your existing applications.

You can extend this system by adding more analysis, visualizations, or multi-language support based on your needs.

## Additional Resources

- [Azure AI Language Documentation](https://learn.microsoft.com/azure/ai-services/language-service/)
- [Neon Documentation](/docs)
- [Azure AI Language Client Library](https://learn.microsoft.com/javascript/api/overview/azure/ai-language-text-readme)

<NeedHelp />
