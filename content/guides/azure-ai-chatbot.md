---
title: Building AI-powered chatbots with Azure AI Studio and Neon
subtitle: Learn how to create an AI-powered chatbot using Azure AI Studio with Lakebase Postgres as the backend database
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-11-24T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

In this guide, we'll walk through creating an AI-powered chatbot from scratch. We'll use Azure AI Studio, Lakebase Postgres as the backend database, React for the frontend interface, and Express for the backend API.

We'll deploy a GPT-4 model to Azure AI Studio, which we will then use to build a support chatbot that can answer questions, store conversations, and learn from interactions over time.

## Prerequisites

Before we begin, make sure you have:

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription
- A [Neon account](https://console.neon.tech/signup) and project
- Basic familiarity with SQL and JavaScript/TypeScript
- [Node.js](https://nodejs.org/) 18.x or later installed

## Setting up your development environment

If you haven't already, follow these steps to set up your development environment:

### Create a Neon project

1. Navigate to the [Neon Console](https://console.neon.tech)
2. Click "New Project"
3. Give your project a name (e.g., "chatbot-db")
4. Choose an AWS region close to your Azure OpenAI resource, such as AWS US East (N. Virginia) if your Azure resource is in East US 2
5. Click "Create Project"

Neon runs on AWS, and new projects can't be created in Neon's deprecated Azure regions. If you need your Postgres data to stay in Azure, see [Azure regions deprecation](/docs/import/azure-regions-deprecation) for the Databricks Lakebase option.

Save your connection details. You'll need them to configure your chatbot's database connection.

### Create the database schema

A chatbot needs to store conversations and track how users interact with it. We'll create a schema that stores messages and user data, plus feedback that shows how well the chatbot is performing.

Our schema will include 4 tables:

- `users`: Stores user information
- `conversations`: Manages chat sessions
- `messages`: Stores the messages between users and the bot
- `feedback`: Records user ratings and comments

Connect to your Neon database and execute the following SQL statements to create the tables:

```sql
-- Create users table
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table
CREATE TABLE conversations (
    conversation_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(user_id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived'))
);

-- Create messages table
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(conversation_id),
    sender_type VARCHAR(50) CHECK (sender_type IN ('user', 'bot')),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tokens_used INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER
);

-- Create feedback table for message ratings
CREATE TABLE message_feedback (
    feedback_id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(message_id),
    user_id VARCHAR(255) REFERENCES users(user_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

With our 4 tables in place, we have a schema which allows us to:

- Track user interactions and store user data
- Manage chat sessions and track when they started
- Store messages between users and the bot
- Collect feedback on messages to improve the chatbot

### Set up an Azure AI Studio project

With your Neon database ready, let's set up Azure AI Studio to deploy our own GPT-4 model.

To access Azure OpenAI Studio, you need to create an Azure OpenAI resource. Here's how you can do that:

1. Go to [the Azure OpenAI resources portal](https://oai.azure.com/portal)
1. Click the "Create new Azure OpenAI resource" button
1. Fill in the required fields like the subscription, resource group, region and name
1. Click the "Next" button
1. For the network settings, you can leave the default settings so that all networks can access the resource or you can restrict access to specific networks
1. Click "Next" and under "Review + create" click the "Create" button to create the resource

This will create a new Azure OpenAI resource for you. The deployment might take a few minutes to complete.

Once the deployment is completed, you can again visit the [Azure OpenAI portal](https://oai.azure.com/portal), and you should see your newly created resource there with type "OpenAI".

### Deploy the Azure OpenAI model

With the Azure OpenAI resource set up, we can now deploy the GPT-4 model. To deploy the Azure OpenAI model:

1. Go to the [Azure OpenAI portal](https://oai.azure.com/portal) again
1. Click on your OpenAI resource that you created earlier
1. Click on the "Model catalog" tab
1. Find and click on the "gpt-4" model from the list
1. Click the "Deploy" button
1. Wait for deployment to complete. You'll receive an Endpoint URL and API key

There are other models available in the Azure OpenAI Studio, but for this guide, we'll use the GPT-4 model for our chatbot.

After deployment, click "Open in playground" to test the model. The playground is a web interface where you can:

1. Test your model by chatting with it directly
1. Add training data to help the model understand your specific needs
1. Adjust settings like:
   - Maximum response length (how long answers can be)
   - Temperature (higher = more creative, lower = more focused)
   - Top P and Presence Penalty (control response variety)

Experiment with these settings to see how they affect the model's responses.

#### Setting up model instructions

You can give the model instructions about how it should behave. Think of this like training a new colleague. You're telling them:

- What they should do
- What they shouldn't do
- How they should talk to users
- What information they can access

For example, you might write:

```
You are a customer service agent for a tech company.
- Always be polite and professional
- Only answer questions about our products and services
- If you don't know something, say so
- Format prices as USD with two decimal places
- Include links to our documentation when relevant
```

These instructions will be included with every message to the model. The model will follow these instructions for all conversations.

#### Testing your instructions

After setting up instructions for the model, you can test them in the playground, for example:

1. Try different types of questions in the playground
1. Check if the model follows your guidelines
1. Adjust the instructions if needed
1. Save the instructions when you're happy with the responses

You can also add training data to help the model understand your specific needs. To learn more about training data, check the [Azure OpenAI Studio documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/fine-tuning).

## Building the backend

With the Azure OpenAI model deployed, we can now build the backend API that will interact with the model and store chat data in our Neon database.

Before building the backend, get the sample API code from Azure OpenAI Studio so you use the correct request format.

### Getting the API code from Azure OpenAI Studio

1. In the Azure OpenAI Studio playground, click "View code"
2. From the dropdown menu, select "JSON"
3. Under "Key authentication" you'll see a sample request like this:

   ```json
   {
     "messages": [
       {
         "role": "system",
         "content": [
           {
             "type": "text",
             "text": "You are a marketing writing assistant. You help come up with creative content ideas ...\"\n"
           }
         ]
       }
     ],
     "temperature": 0.7,
     "top_p": 0.95,
     "max_tokens": 800
   }
   ```

This shows us the exact format we need to use when making API calls to Azure OpenAI.

### Setting up the project

First, let's create a new Node.js project and install the dependencies that we'll need for our chatbot backend.

Create a new project folder and initialize a new Node.js project:

```bash
mkdir azure-neon-chatbot
cd azure-neon-chatbot
npm init -y
```

After that, install the required packages:

```bash
npm install express pg dotenv cors axios
```

The packages we're installing are:

- `express`: Web framework for building our API endpoints
- `pg`: Postgres client for connecting to Neon
- `dotenv`: Environment variable management
- `cors`: Handles Cross-Origin Resource Sharing for our frontend
- `axios`: Makes HTTP requests to Azure OpenAI API

### Project structure

We'll use a standard Node.js project structure that separates code into directories by function:

- `config`: Holds configuration files, including database connection settings
- `services`: Contains the core business logic for chat functionality and OpenAI integration
- `routes`: Manages API endpoints and request handling
- `utils`: Stores helper functions and shared utilities
- The `.env` file will store our sensitive configuration values like API keys

The project structure will look like this:

```sh
azure-neon-chatbot/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── services/
│   │   ├── chatService.js
│   │   └── openaiService.js
│   ├── routes/
│   │   └── chatRoutes.js
│   └── utils/
│       └── logger.js
├── .env
└── server.js
```

### Environment configuration

Create a `.env` file in your project root with the following configuration:

```env
# Database Configuration
DATABASE_URL='postgresql://neondb_owner:<your_password>@<your_host>.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://<your-resource-name>.openai.azure.com
AZURE_OPENAI_API_KEY=<your-api-key>
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Server Configuration
PORT=3000
NODE_ENV=development
```

You'll need to replace `<your_password>`, `<your_host>`, `<your-resource-name>`, and `<your-api-key>` with your actual values.

You can get your Azure OpenAI API key from the Azure OpenAI Studio portal under the Chat playground.

### Database configuration

Next, let's set up the database connection. We'll use the `pg` package to connect to our Lakebase Postgres database.

Create a `src/config/database.js` file with the following code:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to Neon database');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
```

This sets up a connection to the Lakebase Postgres database using the `pg` package. We use the `DATABASE_URL` environment variable to connect to the database.

### OpenAI service

Next, let's create a service to interact with the Azure OpenAI API. This service will handle sending messages to the GPT-4 model that we deployed earlier.

Create a `src/services/openaiService.js` file with the following code:

```javascript
// src/services/openaiService.js
const axios = require('axios');
require('dotenv').config();

class OpenAIService {
  constructor() {
    if (!process.env.AZURE_OPENAI_API_KEY) {
      throw new Error('AZURE_OPENAI_API_KEY is required');
    }
    if (!process.env.AZURE_OPENAI_ENDPOINT) {
      throw new Error('AZURE_OPENAI_ENDPOINT is required');
    }
    if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error('AZURE_OPENAI_DEPLOYMENT_NAME is required');
    }

    this.endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    this.apiKey = process.env.AZURE_OPENAI_API_KEY;
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      const url = `${this.endpoint}/openai/deployments/${this.deploymentName}/chat/completions?api-version=2024-02-15-preview`;

      const payload = {
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: 'You are a marketing writing assistant. You help come up with creative content ideas and content like marketing emails, blog posts, tweets, ad copy and product descriptions. You write in a friendly yet professional tone but can tailor your writing style that best works for a user-specified audience. If you do not know the answer to a question, respond by saying "I do not know the answer to your question."\n',
              },
            ],
          },
          ...conversationHistory,
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userMessage,
              },
            ],
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800,
      };

      const headers = {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      };

      const response = await axios.post(url, payload, { headers });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.error('Authentication failed. Please check your AZURE_OPENAI_API_KEY.');
      }
      throw error;
    }
  }
}

module.exports = new OpenAIService();
```

This creates a service that handles all communication with Azure OpenAI. It does two main things:

1. Checks that we have all the required Azure OpenAI settings (API key, endpoint, and deployment name) when the service starts up
2. Provides a `generateResponse` method that:
   - Takes a user's message and any previous conversation history
   - Sends it to our deployed GPT-4 model on Azure
   - Returns the model's response

The service includes the bot's base instructions (as a marketing assistant in this example) and error handling for common issues like authentication problems.

Adjust the instructions and settings to match your chatbot's needs.

### Chat service

Next, let's create a service to manage chat interactions. This service will handle user messages, conversation history, and saving messages to the database.

Create `src/services/chatService.js` with the following code:

```javascript
// src/services/chatService.js
const db = require('../config/database');
const openai = require('./openaiService');

class ChatService {
  async ensureUserExists(userId) {
    // Check if user exists
    const existingUser = await db.query('SELECT user_id FROM users WHERE user_id = $1', [userId]);

    if (existingUser.rows.length === 0) {
      // Create new user if doesn't exist
      await db.query('INSERT INTO users (user_id, first_name, last_name) VALUES ($1, $2, $3)', [
        userId,
        'Anonymous',
        'User',
      ]);
    }
  }

  async saveMessage(conversationId, senderType, content) {
    const query = `
      INSERT INTO messages (conversation_id, sender_type, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    return db.query(query, [conversationId, senderType, content]);
  }

  async getConversationHistory(conversationId, limit = 10) {
    const query = `
      SELECT sender_type, content
      FROM messages
      WHERE conversation_id = $1
      ORDER BY sent_at DESC
      LIMIT $2
    `;
    return db.query(query, [conversationId, limit]);
  }

  async processMessage(userId, message) {
    try {
      await this.ensureUserExists(userId);

      await db.query('BEGIN');

      // Get or create conversation
      let conversationId;
      const existingConversation = await db.query(
        'SELECT conversation_id FROM conversations WHERE user_id = $1 ORDER BY started_at DESC LIMIT 1',
        [userId]
      );

      if (existingConversation.rows.length === 0) {
        const newConversation = await db.query(
          'INSERT INTO conversations (user_id) VALUES ($1) RETURNING conversation_id',
          [userId]
        );
        conversationId = newConversation.rows[0].conversation_id;
      } else {
        conversationId = existingConversation.rows[0].conversation_id;
      }

      // Save user message
      await this.saveMessage(conversationId, 'user', message);

      // Get conversation history
      const history = await this.getConversationHistory(conversationId);
      const formattedHistory = history.rows.map((msg) => ({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: [{ type: 'text', text: msg.content }],
      }));

      // Generate AI response
      const aiResponse = await openai.generateResponse(message, formattedHistory);

      // Save AI response
      await this.saveMessage(conversationId, 'bot', aiResponse);

      // Commit transaction
      await db.query('COMMIT');

      return {
        conversationId,
        reply: aiResponse,
      };
    } catch (error) {
      // Rollback transaction on error
      await db.query('ROLLBACK');
      console.error('Error processing message:', error);
      throw error;
    }
  }

  async startConversation(userId) {
    try {
      await this.ensureUserExists(userId);

      // Create new conversation
      const result = await db.query(
        'INSERT INTO conversations (user_id) VALUES ($1) RETURNING conversation_id',
        [userId]
      );

      return {
        conversationId: result.rows[0].conversation_id,
        message: 'Conversation started successfully',
      };
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }
}

module.exports = new ChatService();
```

This chat service manages all our conversations and messages. There is a lot going on in this service, so let's break it down:

1. Creates or finds users in our database
1. Message handling:
   - Saves messages from both users and the bot
   - Retrieves conversation history
1. Conversation flow:
   - Starts new conversations
   - Processes incoming messages
   - Gets responses from Azure OpenAI
   - Stores everything in our Neon database

We are also using database transactions to make sure that all related data (messages, user info, and conversations) is saved correctly, with rollback if anything fails.

This service coordinates between the database, the Azure AI model, and the chat interface, which we'll build next.

### Chat API routes

With our services in place, let's create the API routes that will handle incoming requests from our chat interface.

Create a `src/routes/chatRoutes.js` file with the following:

```javascript
// src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// Initialize or continue a chat session
router.post('/start', async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await chatService.startConversation(userId);
    res.json(result);
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
});

// Send a message and get a response
router.post('/message', async (req, res) => {
  const { userId, message } = req.body;
  try {
    const result = await chatService.processMessage(userId, message);
    res.json(result);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get conversation history
router.get('/history/:conversationId', async (req, res) => {
  const { conversationId } = req.params;
  try {
    const history = await chatService.getConversationHistory(conversationId);
    res.json(history.rows);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

module.exports = router;
```

The above are our API endpoints that our chat interface will use to communicate with the backend. We set up three main routes:

1. `/start`: Creates a new conversation for a user
2. `/message`: Handles sending messages and getting responses from the bot
3. `/history`: Retrieves past messages from a conversation

Each route connects to our chat service to perform its specific task. We'll use these routes to build our chat interface in the next section.

### Server setup

Finally, let's set up our Express server to run our chatbot API. We'll also add a health check endpoint and error handling middleware.

Create `server.js` in your project root with the following content:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./src/routes/chatRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
```

The above is our main application file that brings everything together. It sets up an Express server with:

- CORS support to allow frontend access
- JSON parsing for API requests
- Our chat routes at `/api/chat`
- A health check endpoint to monitor the server

We also include an error handling middleware to catch any unhandled exceptions and log them to the console for easier debugging.

### Running the application

To start the server, run `node server.js`. Once started, the server will:

- Connect to your Neon database
- Listen for chat requests
- Be ready to handle messages from the chat interface

You can now send requests to `http://localhost:3000/api/chat` (or whichever port you configured) to interact with your chatbot.

## Creating the React frontend

With our backend API ready, let's create a React frontend for our chatbot using Tailwind CSS for styling. We'll use TypeScript for type safety and Vite for faster development.

### Create a React project

First, let's create a new React project using Vite:

```bash
npm create vite@latest chatbot-frontend -- --template react-ts
```

Then navigate to project directory:

```bash
cd chatbot-frontend
```

And install the dependencies for the project:

```bash
npm install
```

After that, let's install the necessary packages for our chatbot interface such as Tailwind CSS and Axios:

```bash
npm install -D tailwindcss postcss autoprefixer
```

Also, let's install some additional utilities for our chatbot interface like clsx, Heroicons, and date-fns:

```
npm install clsx @heroicons/react date-fns
```

The `clsx` package is used to conditionally apply CSS classes, `@heroicons/react` provides SVG icons, and `date-fns` helps with date formatting. Those are not required but will make our chat interface a bit more user-friendly.

### Configure Tailwind CSS

With Tailwind CSS installed, let's set it up in our project. Start by initializing Tailwind CSS:

```bash
npx tailwindcss init -p
```

This will create a `tailwind.config.js` file in your project root. Update the file with the following configuration:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chatbot: {
          primary: '#0EA5E9',
          secondary: '#0284C7',
          accent: '#38BDF8',
          background: '#F0F9FF',
        },
      },
    },
  },
  plugins: [],
};
```

The above configuration extends the default Tailwind theme with custom colors for our chatbot interface and also specifies the content files to process.

After that, add the Tailwind directives to the `src/index.css` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-chatbot-background;
  }
}
```

This will apply the Tailwind CSS styles to our project, so we can use them in our components.

### Create environment configuration

Our chatbot interface will need to connect to the backend API to send and receive messages. Let's set up the API URL in our environment configuration.

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:3000/api
```

Make sure to replace the `VITE_API_URL` with the actual URL of your backend API. This will allow our chatbot interface to communicate with the backend application.

### Frontend project structure

Organize the React components like this:

- `components/Chat`: Contains all chat-related components like message bubbles and input fields
- `components/Layout`: Holds reusable layout components
- `hooks`: Stores custom React hooks for managing chat functionality
- `types`: Defines TypeScript interfaces for our chat data

The project structure will look like this:

```
src/
├── components/
│   ├── Chat/
│   │   ├── ChatBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── ChatInterface.tsx
│   └── Layout/
│       └── Container.tsx
├── hooks/
│   └── useChat.ts
└── types/
    └── chat.ts
```

With our project structure in place, let's start building our chatbot interface. We will create the components for our chat interface starting with the types and basic components, then bringing it all together.

### 1. Define message types

First, let's define TypeScript types for our chat messages:

```typescript
// src/types/chat.ts
export interface Message {
  sender: 'user' | 'bot';
  content: string;
  timestamp?: Date;
}
```

This defines a `Message` interface that tracks:

- Who sent the message (`sender`)
- Message content (`content`)
- When it was sent (`timestamp`)

We'll use this type to manage chat messages in our application.

### 2. Create the layout container

Next, create a container component that provides consistent spacing and width for the chat interface:

```typescript
// src/components/Layout/Container.tsx
export const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
    {children}
  </div>
);
```

The container is a simple component that wraps all our chat components in a centered, responsive layout.

### 3. Build the message bubble component

Each chat message will be displayed as a bubble with different styles for user and bot messages:

```typescript
// src/components/Chat/ChatBubble.tsx
import { Message } from '../../types/chat';
import { format } from 'date-fns';
import clsx from 'clsx';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={clsx(
        'flex w-full mt-2 space-x-3 max-w-xs',
        isUser ? 'ml-auto justify-end' : ''
      )}
    >
      <div>
        <div
          className={clsx(
            'p-3 rounded-lg',
            isUser
              ? 'bg-chatbot-primary text-white'
              : 'bg-white text-gray-800 border border-gray-200'
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        {message.timestamp && (
          <span className="text-xs text-gray-500 leading-none">
            {format(message.timestamp, 'HH:mm')}
          </span>
        )}
      </div>
    </div>
  );
};
```

The chat bubble component:

- Takes a `message` prop with sender and content
- Uses different styles for user vs bot messages
- Shows message timestamp and aligns user messages to the right, bot messages to the left

We are going to use this component to render chat messages in the chat interface.

### 4. Create the message input component

Next, let's build an input field for users to type messages and a submit button:

```typescript
// src/components/Chat/ChatInput.tsx
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const ChatInput = ({ value, onChange, onSubmit, isLoading }: ChatInputProps) => {
  return (
    <div className="border-t bg-white p-4">
      <form
        className="flex space-x-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chatbot-primary"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'rounded-lg px-4 py-2 text-white',
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-chatbot-primary hover:bg-chatbot-secondary'
          )}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
```

This component includes:

- A text input field for messages
- A submit button with loading state
- Simple form handling with `preventDefault()`

The input field will allow users to type messages and submit them to the chatbot over the Azure OpenAI API that we set up earlier.

### 5. Create the chat hook

After building the basic components, let's create a custom hook to manage chat state and interactions. This hook will handle sending messages, loading states, and API calls to the backend:

```typescript
// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { Message } from '../types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useState(() => 'user-' + Date.now())[0];

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        setIsLoading(true);
        const userMessage: Message = {
          sender: 'user',
          content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, message: content }),
        });

        const data = await response.json();

        const botMessage: Message = {
          sender: 'bot',
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          sender: 'bot',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  return { messages, isLoading, sendMessage };
};
```

The hook handles:

- Message state management
- API calls to the backend
- Error handling with user feedback

This hook will be used in the main chat interface component to manage chat interactions and state updates.

### 6. Build the main chat interface

Finally, let's combine everything into the main chat interface component:

```typescript
// src/components/Chat/ChatInterface.tsx
import { useState } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { useChat } from '../../hooks/useChat';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useChat();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b bg-chatbot-primary text-white">
        <h2 className="text-xl font-bold">Neon AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, idx) => (
          <ChatBubble key={idx} message={message} />
        ))}
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
```

The main interface component:

- Uses our chat hook for state management
- Renders message history with `ChatBubble` components
- Handles message input with `ChatInput` component

This component will display the chat interface with message bubbles, input field, and submit button for users to interact with the chatbot.

### 7. Update the App component

Finally, we can update the main App component to use our chat interface and wrap it in a container for layout:

```typescript
// src/App.tsx
import { Container } from './components/Layout/Container';
import { ChatInterface } from './components/Chat/ChatInterface';

function App() {
  return (
    <Container>
      <ChatInterface />
    </Container>
  );
}

export default App;
```

This wraps our chat interface in the container component for proper layout and spacing.

You can now start the development server to see your chat interface:

```bash
npm run dev
```

Visit `http://localhost:5173` to test the chatbot interface. It will automatically connect to your backend API running on port 3000. Make sure your backend server is running before testing the chat interface.

## Conclusion

You've built a chatbot widget that uses a GPT-4 model deployed in Azure AI Studio and stores users, conversations, messages, and feedback in Lakebase Postgres. It fits documentation sites and help systems, where you can embed it as a widget.

Because every query, response, and rating lands in your database, you can query it to find where users get stuck and which docs need work. As a next step, fine-tune the model on your own documentation to improve its answers.

## Additional resources

- [Azure Bot Service documentation](https://docs.microsoft.com/en-us/azure/bot-service/)
- [LUIS documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
- [Neon documentation](/docs)
- [Bot Framework SDK](https://learn.microsoft.com/en-us/azure/bot-service/index-bf-sdk)

<NeedHelp />
