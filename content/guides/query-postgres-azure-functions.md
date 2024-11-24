---
title: Query your Postgres Database Using Azure Functions
subtitle: Learn how to query your Postgres database using Azure Functions
author: adalbert-pungu
enableTableOfContents: true
createdAt: '2024-10-19T21:00:00.000Z'
---

In this guide, we will explore how to query a **Postgres** database hosted on **Neon** using **Azure Functions**. This combination allows you to take advantage of a flexible, high-performance infrastructure without worrying about server management.

## Prerequisites

You will need:

- An [Azure](https://azure.microsoft.com/) account with a subscription to deploy Azure Functions.
- A Neon account. If you don’t have one yet, you can [sign up](https://console.neon.tech/signup).
- Basic knowledge of Node.js and SQL.
- Familiarity with using Visual Studio Code.

## Why Neon?

Neon stands out as a cloud-native Postgres solution with an innovative architecture that separates compute and storage, offering a truly serverless database. This means Neon automatically adjusts its resources based on your application’s needs, making it ideal for projects that require flexible scalability without directly managing the infrastructure. In other words, Neon allows you to accelerate project delivery by focusing solely on development, while having an infrastructure that scales on demand.

> Neon Database is cloud-native Serverless Postgres, meaning it has completly separated storage from compute. This means Neon automatically adjusts its resources based on your application’s needs, making it ideal for projects that require flexible scaling without directly managing the infrastructure. In other words, Neon Database is a fully managed database service that allows you to focus on building your application without worrying about the underlying infrastructure.

Azure Functions are also a serverless compute service, which enables you to run event-driven code without having to manage infrastructure. It is a great choice for building serverless applications, microservices, and APIs. By combining Neon Database with Azure Functions, you can create a powerful and scalable application that can handle a wide range of use cases.

At the same time, Azure Functions enables you to run code in response to events without worrying about the underlying infrastructure. It will create microservices that respond to events, such as **HTTP requests**, without the need to deploy or manage servers.

To illustrate this, we will discuss an example of client management (hotel reservation management), which is a common use case in application development. We will use the technologies mentioned above to query and process data.

## Context

Imagine you are developing a solution to manage hotel reservations. You want to allow users (via an app or website) to view available reservations and interact with a Postgres database hosted on **Neon**.

The application's features will include:

- **View available rooms**: The application will allow users to check available hotel rooms for booking.
- **Add a new reservation**: When a customer makes a reservation, their information will be stored in the Neon.
- **Cancel a reservation**: Customers can cancel a reservation by deleting the corresponding record from the database.

---

## Step 1: Create and Configure the Database on Neon

**Sign up and create the database**

Sign up on [Neon](https://neon.tech/) and follow the steps to create a Postgres database. The database will be named **neondb**.

After creating the database, make sure to copy the connection details (such as **host**, **user**, **password**, **database**) somewhere safe, as they will be used to configure **Azure Functions** to connect to **Neon**.

1. **Creating the tables**

   Once the database is created, you should see an option named "SQL Editor" on the left to write and execute queries.

   In the query editor, copy and paste the SQL code below to create the `clients` and `hotels` tables. These are reference tables, as the `reservations` table will refer to these tables via foreign keys:

   ```sql
   CREATE TABLE clients (
       client_id SERIAL PRIMARY KEY,
       first_name VARCHAR(100),
       last_name VARCHAR(100),
       email VARCHAR(100),
       phone_number VARCHAR(20)
   );

   CREATE TABLE hotels (
       hotel_id SERIAL PRIMARY KEY,
       name VARCHAR(100),
       location VARCHAR(100)
   );
   ```

   Here is the SQL script to create the `reservations` table:

   ```sql
   CREATE TABLE reservations (
       reservation_id SERIAL PRIMARY KEY,
       client_id INT NOT NULL,
       hotel_id INT NOT NULL,
       check_in_date DATE NOT NULL,
       check_out_date DATE NOT NULL,
       number_of_guests INT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (client_id) REFERENCES clients(client_id),
       FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
   );
   ```

2. **Inserting test data**

   You can insert some example data into the database to ensure that everything is working fine up to this point.

   Here is the SQL script to insert data into the `clients` table:

   ```sql
   INSERT INTO clients (first_name, last_name, email, phone_number) VALUES
   ('Alice', 'Dupont', 'alice.dupont@example.com', '0123456789'),
   ('Bob', 'Martin', 'bob.martin@example.com', '0987654321'),
   ('Chloé', 'Lefevre', 'chloe.lefevre@example.com', '0147253689');
   ```

   Here is the SQL script to insert data into the `hotels` table:

   ```sql
   INSERT INTO hotels (name, location) VALUES
   ('Hôtel Le Paris', 'Paris'),
   ('Hôtel des Alpes', 'Annecy'),
   ('Hôtel de la Plage', 'Nice');
   ```

   Here is the SQL script to insert data into the `reservations` table:

   ```sql
   INSERT INTO reservations (client_id, hotel_id, check_in_date, check_out_date, number_of_guests) VALUES
   (1, 1, '2024-11-01', '2024-11-05', 2),
   (2, 2, '2024-11-10', '2024-11-15', 1),
   (3, 3, '2024-12-01', '2024-12-10', 4);
   ```

## Step 2: Create an Azure Function to Manage Products

1.  **Sign in to Azure**

    If you don't already have an account, sign up on the Microsoft [Azure](https://portal.azure.com/) portal.

    We will initialize an Azure Functions project where we will create an **HTTP Trigger function** in Visual Studio Code (VS Code) using the **Azure Functions extension**.

2.  **Install the Azure Functions extension**:

    - Open VS Code, or install [Visual Studio Code](https://code.visualstudio.com/) if it's not yet installed.
    - Go to the extensions tab or press `Ctrl+Shift+X`.
    - Search for "Azure Functions" and install the official extension.

3.  **Create an Azure Functions Project**

    Open the command palette or press `Ctrl+Shift+P` to open the command palette.

    - Type `Azure Functions: Create New Project...` and select that option.
    - Choose a directory where you want to create the project.
    - Select the programming language (`JavaScript` in our case).
    - Choose a JavaScript programming model (`Model V4`).
    - Choose a function template, and select `HTTP trigger`.
    - Give your function a name, for example, `manageClients`.

    Once confirmed, the project will be created with some default code.

4.  **Install the Postgres client**

    In the terminal of your Azure Functions project, install either **neon** postgres driver or the **pg** package, which will be used to connect to Postgres:

    <CodeTabs labels={["Neon serverless driver", "pg"]}>

    ```bash
    npm install @neondatabase/serverless
    ```

    ```bash
    npm install pg
    ```

    </CodeTabs>

5.  **Azure Functions Core Tools**

    Install Azure Functions Core Tools to run functions locally.

    ```bash
    npm install -g azure-functions-core-tools@4 --unsafe-perm true
    ```

    <Admonition type="note" title="suggested folder structure">

    Since there are three tables in the database (`Clients`, `Hotels`, and `Reservations`), using a separate file for each feature or interaction with the database is a good practice to maintain clear and organized code.

    ```
    src/
      ├──index.js
      ├──functions/
      │   ├──manageClients.js
      │   ├──manageHotels.js
      │   └──manageReservations.js
      └──database/
          ├──client.js
          ├──hotel.js
          └──reservation.js
    ```

    </Admonition>

6.  **Configure Environment Variables**

    On the Neon dashboard, go to `Connection string`, select `Node.js`, and click `.env`. Then, click `show password` and copy the database connection string. If you don't click `show password`, you'll copy a connection string without the password (which is masked).

    Create a `.env` file at the root of the project to store your database connection information from the Neon.

    Here's an example of the connection string you'll copy:

    ```bash shouldWrap
    DATABASE_URL='postgresql://neondb_owner:************@ep-quiet-leaf-a85k5wbg.eastus2.azure.neon.tech/neondb?sslmode=require'
    ```

7.  **Modify the `local.settings.json` file**

    The `local.settings.json` file is used by Azure Functions for **local executions**. Azure Functions does not directly read the `.env` file. Instead, it relies on `local.settings.json` to inject environment variable values during local execution. In production, you will define the same settings through `App Settings` in the Azure portal.

    Here's an example of the `local.settings.json` file :

    ```JSON
    {
      "IsEncrypted": false,
      "Values": {
        "AzureWebJobsStorage": "",
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "DATABASE_URL": "postgresql://neondb_owner:************@ep-quiet-leaf-a85k5wbg.eastus2.azure.neon.tech/neondb?sslmode=require"
      }
    }
    ```

    Install the `dotenv` package by opening the terminal in your Azure Functions project. This package will allow you to load environment variables from the `.env` file:

    ```bash
    npm install dotenv
    ```

8.  **Manage Each Table**

    a. Create a separate file for each table in the `database/` folder.

    Here, you can use either the `neon` package or the `pg` package to connect to the database.

    **Example code for `client.js`**

    <CodeTabs labels={["Neon serverless driver", "pg"]}>

    ```javascript
    import { neon } from '@neondatabase/serverless';
    import dotenv from 'dotenv';

    dotenv.config();

    const sql = neon(process.env.DATABASE_URL);

    const getAllClients = async () => {
      const rows = await sql`SELECT * FROM clients`;
      return rows;
    };

    const addClient = async (first_name, last_name, email, phone_number) => {
      const [newClient] = await sql`
        INSERT INTO clients (first_name, last_name, email, phone_number)
        VALUES (${first_name}, ${last_name}, ${email}, ${phone_number})
        RETURNING *`;
      return newClient;
    };

    export { getAllClients, addClient };
    ```

    ```javascript
    const { Client } = require('pg');
    require('dotenv').config();

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    const connectDB = async () => {
      if (!client._connected) {
        await client.connect();
      }
    };

    const getAllClients = async () => {
      await connectDB();
      const result = await client.query('SELECT * FROM clients');
      return result.rows;
    };

    const addClient = async (first_name, last_name, email, phone_number) => {
      await connectDB();
      const result = await client.query(
        `INSERT INTO clients (first_name, last_name, email, phone_number)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
        [first_name, last_name, email, phone_number]
      );
      return result.rows[0];
    };

    module.exports = {
      getAllClients,
      addClient,
    };
    ```

    </CodeTabs>

    **Example code for `hotel.js`**

    <CodeTabs labels={["Neon serverless driver", "pg"]}>

    ```javascript
    import { neon } from '@neondatabase/serverless';
    import dotenv from 'dotenv';

    dotenv.config();

    const sql = neon(process.env.DATABASE_URL);

    const getAllHotels = async () => {
      const rows = await sql`SELECT * FROM hotels`;
      return rows;
    };

    export { getAllHotels };
    ```

    ```javascript
    const { Client } = require('pg');
    require('dotenv').config();

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    const connectDB = async () => {
        if (!client.\_connected) {
            await client.connect();
        }
    };

    const getAllHotels = async () => {
        await connectDB();
        const result = await client.query('SELECT \* FROM hotels');
        return result.rows;
    };

    module.exports = {
        getAllHotels,
        client,
    };
    ```

    </CodeTabs>

    **Example code for `reservation.js`**

    <CodeTabs labels={["Neon serverless driver", "pg"]}>

    ```javascript
    import { neon } from '@neondatabase/serverless';
    import dotenv from 'dotenv';

    dotenv.config();

    const sql = neon(process.env.DATABASE_URL);

    const getAvailableReservations = async () => {
      const rows = await sql`
            SELECT * FROM reservations WHERE status = ${'available'}
        `;
      return rows;
    };

    export { getAvailableReservations };
    ```

    ```javascript
    const { Client } = require('pg');
    require('dotenv').config();

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    const connectDB = async () => {
      if (!client._connected) {
        await client.connect();
      }
    };

    const getAvailableReservations = async () => {
      await connectDB();
      const result = await client.query('SELECT * FROM reservations WHERE status = $1', [
        'available',
      ]);
      return result.rows;
    };

    module.exports = {
      getAvailableReservations,
      client,
    };
    ```

    </CodeTabs>

    b. Modify the `functions/` folder by adding the function files:

    In the `functions/` folder, remove the default file, and then add three function management files (`manageClients.js`, `manageHotels.js`, and `manageReservations.js`).

    **Example for `manageClients.js`**

    ```javascript
    // src/functions/manageClients.js
    const { app } = require('@azure/functions');
    const { getAllClients, addClient } = require('../database/client');

    app.http('manageClients', {
      methods: ['GET', 'POST'],
      authLevel: 'anonymous',
      handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);

        if (request.method === 'GET') {
          try {
            const clients = await getAllClients();
            console.table(clients);
            return {
              body: clients,
            };
          } catch (error) {
            context.log('Error fetching clients:', error);
            return {
              status: 500,
              body: 'Error retrieving clients.',
            };
          }
        }

        if (request.method === 'POST') {
          try {
            const { first_name, last_name, email, phone_number } = await request.json();

            if (!first_name || !last_name || !email || !phone_number) {
              return {
                status: 400,
                body: 'Missing required fields: first_name, last_name, email, phone_number.',
              };
            }

            const newClient = await addClient(first_name, last_name, email, phone_number);
            console.table(newClient);
            return {
              status: 201,
              body: newClient,
            };
          } catch (error) {
            context.log('Error adding client:', error);
            return {
              status: 500,
              body: 'Error adding client.',
            };
          }
        }
      },
    });
    ```

    **Example for `manageHotels.js`**

    ```javascript
    // src/functions/manageHotels.js
    const { app } = require('@azure/functions');
    const { getAllHotels } = require('../database/hotel');

    app.http('manageHotels', {
      methods: ['GET'],
      authLevel: 'anonymous',
      handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);

        try {
          const hotels = await getAllHotels();
          return {
            body: hotels,
          };
        } catch (error) {
          context.log('Error fetching hotels:', error);
          return {
            status: 500,
            body: 'Error retrieving hotels.',
          };
        }
      },
    });
    ```

    **Example for `manageReservations.js`**

    ```javascript
    // src/functions/manageReservations.js
    const { app } = require('@azure/functions');
    const { getAvailableReservations } = require('../database/reservation');

    app.http('manageReservations', {
      methods: ['GET'],
      authLevel: 'anonymous',
      handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);

        try {
          const reservations = await getAvailableReservations();
          return {
            body: reservations,
          };
        } catch (error) {
          context.log('Error fetching reservations:', error);
          return {
            status: 500,
            body: 'Error retrieving available reservations.',
          };
        }
      },
    });
    ```

    Feel free to extend this structure to include features such as adding new clients, creating new reservations, or even updating and deleting data, each with **its own file** and **its own logic**.

## Step 3: Test the Function Locally

1. **Run the Function Locally**:

   - Open the integrated terminal in VS Code.
   - Run the following command `npm run start`, which will execute `func start` to start the project and launch the functions:

     ```bash
     npm run start
     ```

2. **Test with a Browser or Postman**:

   - Open a browser and navigate to `http://localhost:7071/api/manageClients` to test your function.
   - You can also use a tool like **Postman** to send **HTTP requests**.

## Step 4: Test and Deploy the Function to Azure

1. **Deploy Your Function**:

   - Open the command palette with `Ctrl+Shift+P` and type `Azure Functions: Deploy to Function App...`.
   - Follow the instructions to select your Azure subscription and choose or create a Function App, then complete the deployment process.

2. **Test the Function**:

   Use a tool like Postman to send an HTTP request to the Azure Function, for example:

   ```arduino
   https://your-azure-function-url?client_id=1234
   ```

   This will return the information of the client with the ID **1234**, if present in the database.

## Conclusion

We have demonstrated how combining Neon and Azure Functions enables the development of fast, scalable applications while reducing the complexity associated with managing infrastructure. With this combination, you can efficiently query your Postgres database without worrying about server maintenance. Moreover, Neon simplifies the scalability of your applications, making it an ideal choice for many modern projects.

## Additional Resources

- [Neon Documentation](/docs) - Comprehensive documentation for Neon's database services, including guides, tutorials, and API references.
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)

<NeedHelp />
