---
title: Building Azure Static Web Apps with Neon
subtitle: A step-by-step guide to creating and deploying static sites using Azure and Neon Postgres
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2024-12-14T00:00:00.000Z'
updatedOn: '2024-12-14T00:00:00.000Z'
---

If you've been looking for a modern approach to deploying web applications without managing traditional server infrastructure, [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static) might be exactly what you need. At its core, it's a service optimized for hosting static assets with global distribution, but its true power lies in its integration with [Azure Functions](https://azure.microsoft.com/en-us/products/functions) for backend operations.

What makes Azure Static Web Apps particularly compelling for developers is its built-in CI/CD pipeline powered by [Github Actions](https://github.com/features/actions). When you connect your repository, Azure automatically configures the necessary Github workflows – push your code and watch as Github Actions builds, optimizes, and deploys your entire application across a global network

In this guide, we'll show you how to build a simple todo application using Azure Static Web Apps. You'll learn the basics of getting your website online and creating your first API endpoint with Azure Functions. By the end of this tutorial, you'll understand how to combine static web content with dynamic features to create a fully functional web application.

## Prerequisites

Before we begin, make sure you have:

- [Node.js](https://nodejs.org/) 18.x or later installed
- [Visual Studio Code](https://code.visualstudio.com/) with the [Azure Static Web Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) and [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extensions installed
- An [Azure account](https://azure.microsoft.com/free/) with an active subscription
- A [Neon account](https://console.neon.tech/signup) and project
- [Azure Functions Core Tools version 4.x](https://learn.microsoft.com/en-gb/azure/azure-functions/create-first-function-vs-code-node?pivots=nodejs-model-v4#install-or-update-core-tools)
- [Azure Static Web Apps CLI](https://www.npmjs.com/package/@azure/static-web-apps-cli)

## Create a Neon Project

Neon is now available in Azure! You can create serverless Postgres databases that run on Azure infrastructure. To learn more about Neon's Azure launch, check out the [announcement post](/blog/neon-is-coming-to-azure).

To create Neon project on Azure, follow our [Getting Started with Neon on Azure guide](/guides/neon-azure-integration).

Once created, save your database connection string, which you'll need to connect to your Neon Postgres database from Azure Functions.

## Database Schema

For our todo application, we'll need a simple database schema to store todo items. We'll create a `todos` table with the following fields:

- `id`: Auto-incrementing unique identifier (Primary Key)
- `text`: Required text field to store the task description
- `completed`: Boolean field with a default value of false to track task completion status

\*We will be creating the table via Azure Functions later in the guide.

## Setting up your development environment

To begin building your Azure Static Web App with Neon Postgres, you'll need to set up your development environment. This involves installing the required tools and configuring your project.

### Installing required tools

1. Install the **Azure Static Web Apps** and **Azure Functions** extensions for Visual Studio Code:

   - Open VS Code
   - Click the Extensions icon or press `Ctrl+Shift+X` or `Cmd+Shift+X`
   - Search for "Azure Static Web Apps" and "Azure Functions" extensions
   - Install both of the extensions from Microsoft

   ![Extensions to Download](/docs/guides/swa-extensions-to-download.png)

2. Install **Azure Functions Core Tools version 4.x**:

   In Visual Studio Code, select `F1` to open the command palette, and then search for and run the command 'Azure Functions: Install or Update Core Tools' and select **Azure Functions v4**.

3. Install the **Azure Static Web Apps CLI**:

   Open a terminal and run the following command to install the Azure Static Web Apps CLI:

   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

   The CLI makes it easy to run your static web app and Azure Functions locally for testing and debugging.

### Project setup

With the required Azure tools installed, we can now create a new Azure Static Web App.

Open a terminal and navigate to the directory where you want to create your project.

```bash
mkdir swa-todo
cd swa-todo && code .
```

## Creating the Static Web App

We'll start by creating the frontend of our todo application. The frontend will be a simple HTML, CSS, and JavaScript application that allows users to add, update, and delete todo items. For the backend, we'll use Azure Functions to handle API requests and interact with the Neon Postgres database.

Architecture overview:

- Frontend: A web application built with HTML, CSS, and JavaScript
- Backend: Serverless API endpoints using Azure Functions
- Hosting: Azure Static Web Apps for reliable and scalable web hosting
- Database: Neon serverless Postgres for storing todo data

Project structure:

```
swa-todo/
├── index.html     # The main HTML file for the todo app
├── styles.css     # The CSS file for styling the app
└── app.js         # The JavaScript file for handling user interactions
└── api/           # Azure Functions backend
```

### Building the Frontend

Create a new file named `index.html` in the root directory of your project and add the following content:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simple Todo App</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="todo-container">
      <h1>Todo List</h1>
      <div class="todo-input">
        <input type="text" id="todoInput" placeholder="Add a new todo" />
        <button onclick="addTodo()">Add</button>
      </div>
      <ul id="todoList" class="todo-list">
        <!-- Todos will be inserted here -->
      </ul>
      <div id="error" class="error"></div>
    </div>
    <script src="app.js"></script>
  </body>
</html>
```

The simple html file contains a form for adding new todos and a list to display existing todos. To display the todos, we'll use JavaScript to fetch the data from the backend API and update the DOM accordingly.

Create a new file named `styles.css` in the root directory of your project and add the following CSS styles:

```css
/* Base styles */
body {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
}

/* Container styles */
.todo-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Input area styles */
.todo-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input[type='text'] {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #45a049;
}

/* Todo list styles */
.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: #888;
}

/* Delete button styles */
.delete-btn {
  background-color: #f44336;
  margin-left: auto;
}

.delete-btn:hover {
  background-color: #da190b;
}

/* Utility styles */
.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}

.error {
  color: #f44336;
  margin-top: 10px;
}
```

The CSS file contains styles for the todo app, including the layout, input fields, buttons, and todo list items. You can customize the styles to match your design preferences. We have kept it very simple for this example.

Create a new file named `app.js` in the root directory of your project and add the following JavaScript code:

```javascript
// State management
let todos = [];

// Initialize app
document.addEventListener('DOMContentLoaded', loadTodos);

// Load todos from API
async function loadTodos() {
  try {
    showLoading();
    const response = await fetch('/api/todos');
    if (!response.ok) throw new Error('Failed to load todos');
    todos = await response.json();
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
    renderTodos();
  }
}

// Add new todo
async function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();

  if (!text) return;

  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, completed: false }),
    });

    if (!response.ok) throw new Error('Failed to add todo');
    const todo = await response.json();
    const todoId = todo?.[0]?.id;

    todos.push({ id: todoId, text, completed: false });
    renderTodos();
    input.value = '';
  } catch (error) {
    showError(error.message);
  }
}

// Toggle todo completion
async function toggleTodo(id) {
  try {
    const todo = todos.find((t) => t.id === id);
    if (!todo) throw new Error('Todo not found');

    const response = await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !todo.completed }),
    });

    await response.json();
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    todos[todos.indexOf(todo)].completed = !todo.completed;
    renderTodos();
  } catch (error) {
    showError(error.message);
    await loadTodos();
  }
}

// Delete todo
async function deleteTodo(id) {
  try {
    const response = await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    await response.json();
    if (!response.ok) throw new Error('Failed to delete todo');

    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  } catch (error) {
    showError(error.message);
    await loadTodos();
  }
}

// Render todos to DOM
function renderTodos() {
  const todoList = document.getElementById('todoList');
  if (!todoList) {
    console.error('Todo list container not found');
    return;
  }

  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, span, deleteButton);
    todoList.appendChild(li);
  });
}

// Utility functions
function showLoading() {
  document.getElementById('todoList').innerHTML = '<div class="loading">Loading...</div>';
}

function hideLoading() {
  document.getElementById('todoList').innerHTML = '';
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  setTimeout(() => (errorDiv.textContent = ''), 3000);
}
```

The JavaScript file contains the core functions for managing todos, namely loading todos from the backend API, adding new todos, toggling completion status, and deleting todos. It also includes utility functions for showing loading indicators and error messages to the user.

Let's break down the key functions and features of the todo app:

Core Functions:

1. `loadTodos()`

   - Fetches existing todos from the Azure Functions API endpoint via `GET` request
   - Handles loading states and error conditions
   - Automatically called when the DOM loads
   - Updates the UI with current todo items

2. `addTodo()`

   - Creates new todo items via `POST` request to the API
   - Validates input to prevent empty submissions
   - Updates local state and UI after successful creation
   - Includes error handling with user feedback

3. `toggleTodo(id)`

   - Updates todo completion status via `PUT` request
   - Includes error handling and state updates

4. `deleteTodo(id)`
   - Removes todos via `DELETE` request to the API
   - Updates local state after successful deletion

UI Management:

1. `renderTodos()`
   - Dynamically generates DOM elements for each todo
   - Handles todo item styling based on completion status
   - Creates interactive elements (checkboxes, delete buttons)

Utility Functions:

1. `showLoading()`

   - Displays loading indicator during API operations
   - Provides visual feedback for better user experience

2. `hideLoading()`

   - Removes loading indicator after operations complete
   - Prepares UI for content display

3. `showError(message)`
   - Displays error messages to users
   - Implements auto-dismissing notifications (3-second timeout)
   - Provides clear feedback for error conditions

State Management:

- All todo items are stored in the `todos` array

Error Handling:

- Comprehensive try-catch blocks around API operations
- Detailed error messages for debugging

### Testing the Frontend locally

To test the frontend, in your terminal, run the following command to start a local server:

```bash
swa start
```

This will start a local server on [`http://localhost:4280`](http://localhost:4280) where you can access the todo app. Open the URL in your browser to be greeted with the initial todo list interface:

![Todo App Initial State](/docs/guides/swa-todo-app-intial.png)

\*Note that full functionality will be available once we set up the Azure Functions backend API.

### Creating Azure Functions

Azure Functions lets you write backend code that runs without managing any servers. We'll use it to create API endpoints that handle all our todo operations – creating, reading, updating, and deleting todos from our database. Think of these functions as small pieces of code that wake up when needed and automatically handle user requests.

Create a new directory named `api` in the root of your project:

```bash
mkdir api && cd api
```

Press F1 in VS Code to open the command palette and run the command `Azure Static Web Apps: Create HTTP Function`. Choose `JavaScript` as the language with the Model version `v4`. Name the function `todos` when prompted.

This will create a new Azure Function in the `api` directory, which will serve as the backend API for our todo application with an api endpoint `/api/todos`.

We will be using the [`@neondatabase/serverless`](https://www.npmjs.com/package/@neondatabase/serverless) package to connect to the Neon Postgres database. Install the package by running the following command in the `api` directory:

```bash
npm install @neondatabase/serverless
```

Edit the `api/src/functions/todos.js` file to add the following code:

```javascript
const { app } = require('@azure/functions');
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

// Helper function to get todos and create table if it doesn't exist
const getTodos = async () => {
  try {
    const todos = await sql`SELECT * FROM todos`;
    return todos;
  } catch (error) {
    if (error.code === '42P01') {
      // Table does not exist, so create it
      await sql`
                CREATE TABLE todos (
                    id SERIAL PRIMARY KEY,
                    text TEXT NOT NULL,
                    completed BOOLEAN NOT NULL
                )`;
      return [];
    }
    throw error;
  }
};

app.http('todos', {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const method = request.method.toLowerCase();

    try {
      switch (method) {
        case 'get':
          context.log('Processing GET request for todos');
          const todos = await getTodos();
          return { status: 200, jsonBody: todos };

        case 'post':
          const newTodo = await request.json();
          context.log('Adding new todo:', newTodo);

          if (!newTodo.text) {
            return {
              status: 400,
              jsonBody: { error: 'Todo text is required' },
            };
          }

          const createdTodo = await sql`
                        INSERT INTO todos (text, completed)
                        VALUES (${newTodo.text}, ${newTodo.completed || false})
                        RETURNING *
                    `;
          return { status: 201, jsonBody: createdTodo };

        case 'put':
          const updatedTodo = await request.json();
          context.log('Updating todo:', updatedTodo);

          if (!updatedTodo.id) {
            return {
              status: 400,
              jsonBody: { error: 'Todo ID is required' },
            };
          }

          const todo = await sql`
                        UPDATE todos
                        SET completed = ${updatedTodo.completed}
                        WHERE id = ${updatedTodo.id}
                        RETURNING *
                    `;

          if (todo.length === 0) {
            return {
              status: 404,
              jsonBody: { error: 'Todo not found' },
            };
          }
          return { status: 200, jsonBody: todo };

        case 'delete':
          const { id } = await request.json();
          context.log('Deleting todo:', id);

          if (!id) {
            return {
              status: 400,
              jsonBody: { error: 'Todo ID is required' },
            };
          }

          const deletedTodo = await sql`
                        DELETE FROM todos
                        WHERE id = ${id}
                        RETURNING *
                    `;

          if (deletedTodo.length === 0) {
            return {
              status: 404,
              jsonBody: { error: 'Todo not found' },
            };
          }
          return {
            status: 200,
            jsonBody: { message: 'Todo deleted successfully' },
          };

        default:
          return {
            status: 405,
            jsonBody: { error: 'Method not allowed' },
          };
      }
    } catch (error) {
      context.error(`Error processing ${method} request:`, error);
      return {
        status: 500,
        jsonBody: { error: `Failed to process ${method} request` },
      };
    }
  },
});
```

This Azure Function (`todos.js`) serves as our API endpoint and handles all database operations. Here's the detailed breakdown:

Core Components:

1. Database setup

   ```javascript
   const { neon } = require('@neondatabase/serverless');
   const sql = neon(process.env.DATABASE_URL);
   ```

   Establishes connection to our Postgres using the Neon serverless driver.

2. Auto-initialization of the `todos` table

   ```javascript
   const getTodos = async () => {
     // Creates the todos table if it doesn't exist
     // Returns all todos from the table
   };
   ```

   Handles first-time setup and retrieves todos.

3. Main API handler

   ```javascript
   app.http('todos', {
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     authLevel: 'anonymous',
     handler: async (request, context) => {
       // Request handling logic based on HTTP method
     },
   });
   ```

   Supported operations:

   1. `GET`: Retrieves all todos

      - Automatically creates table on first request
      - Returns array of todo items

   2. `POST`: Creates new todo

      - Requires: `text` field
      - Returns: newly created todo

   3. `PUT`: Updates todo completion status

      - Requires: `id` and `completed` status
      - Returns: updated todo or `404` if not found

   4. `DELETE`: Removes a todo

      - Requires: todo `id`
      - Returns: success message or `404` if not found

Error Handling:

- Input validation for required fields
- Database error handling
- Proper `HTTP` status codes
- Detailed error messages for debugging
- Logging via `context.log` for monitoring

### Adding Neon Postgres connection string

Start by configuring the `local.settings.json` in your `api` directory with your Neon database connection string:

```json
{
  "Values": {
    ...
    "DATABASE_URL": "postgresql://neondb_owner:<your_password>@<your_host>.neon.tech/neondb?sslmode=require"
  }
}
```

Replace the `DATABASE_URL` value with your Neon Postgres connection string which you saved earlier.

### Testing the Azure Functions locally

To test the Azure Functions locally, navigate to the root directory of your project and run the following command:

```bash
cd ..
swa start --api-location api
```

This will start the Azure Functions backend and serve the static web app locally. You can access the app at [`http://localhost:4280`](http://localhost:4280) and test the functionality. It should be fully functional, allowing you to add, update, and delete todos. It should look like this:

![Todo App Completed](/docs/guides/swa-todo-app-completed.png)

## Deploying your Azure Static Web App

Once you've tested your Azure Static Web App locally and are satisfied with the functionality, you can deploy it to Azure to make it accessible to users worldwide.

### Creating a Static Web App in Azure

To deploy your Azure Static Web App, follow these steps:

1. Open the command palette in Visual Studio Code by pressing `F1`.
2. Search for and run the command `Azure Static Web Apps: Create Static Web App`.
3. Sign in to your Azure account if prompted.
4. When prompted, commit your changes to a Git repository.
5. Enter name for your Static Web App, for example `swa-todo`.
6. Enter repo name for your GitHub repository if prompted.
7. Chose the region to deploy your app, for example `East US 2`.
8. Select `HTML` for the build preset.
9. Enter `/` for the app location and build output path.

Once you connect your repository, Azure automatically sets up a GitHub Actions workflow file in your repository. This workflow handles the build and deployment process whenever you push changes. You can watch your deployment progress in real-time through either the GitHub Actions tab in your repository or the Azure portal.

### Add environment variables

Now that your Azure Static Web App is deployed, you will need to add the Neon Postgres connection string to the Azure Static Web App environment variables. This will allow your Azure Functions to connect to the Neon Postgres database.

1. Go to the Azure Portal and navigate to your Azure Static Web App resource.
2. Click on the `Environment Variables` under `Settings`.
3. Add a new environment variable with the key `DATABASE_URL` and the value as your Neon Postgres connection string.
   ![Environment Variables](/docs/guides/swa-neon-postgres-env-vars.png)
4. Click on `Apply` to save the changes.
5. Now visit the URL of your Azure Static Web App from the Overview tab to see your todo app live. The app should be fully functional allowing you to add, update, and delete todos.

## Summary

In this guide, we've built a simple todo application using Azure Static Web Apps and Neon Postgres. We've covered the following key steps:

1. Setting up the development environment with Azure Static Web Apps and Neon Postgres
2. Creating the frontend of the todo app with HTML, CSS, and JavaScript
3. Setting up Azure Functions to handle API requests and interact with the Neon Postgres database
4. Testing the app locally and deploying it to Azure

By combining Azure Static Web Apps with Neon Postgres, you can build powerful data-driven applications that are fast, reliable, and scalable. Azure Static Web Apps provides a robust hosting platform for static assets and serverless APIs, while Neon Postgres offers a serverless database solution that scales with your application. Together, they provide a seamless development experience for building modern web applications.

We hope this guide has been helpful in getting you started with Azure Static Web Apps and Neon Postgres. As a next step, you can look at [Neon Authorize](/docs/guides/neon-authorize) to add authentication and authorization to your app, allowing users to securely log in and manage their own todo lists.

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Neon Postgres Documentation](/docs/introduction)
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Neon Authorize Guide](/docs/guides/neon-authorize)

<NeedHelp />
