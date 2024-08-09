---
title: Connect from AWS Lambda
subtitle: Learn how to set up a Neon database and connect from an AWS Lambda function
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.647Z'
---

AWS Lambda is a serverless, event-driven compute service that allows you to run code without provisioning or managing servers. It is a convenient and cost-effective solution for running various types of workloads, including those that require a database.

This guide describes how to set up a Neon database and connect to it from an AWS Lambda function using Node.js as the runtime environment. It covers:

- Creating a Lambda function using the [Serverless Framework](https://www.serverless.com/), which is a serverless application lifecycle management framework.
- Connecting your Lambda function to a Neon database.
- Deploying the Lambda function to AWS.

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](/docs/get-started-with-neon/signing-up/) for instructions.
- An AWS account. You can create a free AWS account at [AWS Free Plan](https://aws.amazon.com/free/). An [IAM User and Access Key](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) are required to programmatically interact with your AWS account. You must provide these credentials when deploying the Serverless Framework project.
- A Service Framework account. You can sign up at [Serverless Framework](https://www.serverless.com/).

## Create a Neon project

If you do not have one already, create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a table in Neon

To create a table, navigate to the **SQL Editor** in the [Neon Console](https://console.neon.tech/):

In the SQL Editor, run the following queries to create a `users` table and insert some data:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (name, email)
VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com'),
    ('Charlie', 'charlie@example.com'),
    ('Dave', 'dave@example.com'),
    ('Eve', 'eve@example.com');
```

## Create a Lambda function

Create the Lambda function using the [Serverless Framework](https://www.serverless.com/):

1. Install the Serverless Framework by running the following command:

   ```bash
   npm install -g serverless
   ```

2. Create a `my-lambda` project directory and navigate to it.

   ```bash
   mkdir neon-lambda
   cd neon-lambda
   ```

3. Run the **serverless** command to create a serverless project.

   ```bash
    serverless
   ```

   Follow the prompts, as demonstrated below. You will be required to provide your AWS account credentials. The process creates an `aws-node-project` directory.

   ```bash
   ? What do you want to make? AWS - Node.js - Starter
   ? What do you want to call this project? aws-node-project

   ✔ Project successfully created in aws-node-project folder

   ? Do you want to login/register to Serverless Dashboard? Yes
   Logging into the Serverless Dashboard via the browser
   If your browser does not open automatically, please open this URL:
   https://app.serverless.com?client=cli&transactionId=jP-Zz5A9xu67PPYqzIhOe

   ✔ You are now logged into the Serverless Dashboard

   ? What application do you want to add this to? [create a new app]
   ? What do you want to name this application? aws-node-project

   ✔ Your project is ready to be deployed to Serverless Dashboard (org: "myorg", app: "aws-node-project")

   ? No AWS credentials found, what credentials do you want to use? AWS Access Role
   (most secure)

   If your browser does not open automatically, please open this URL: https://app.serverless.com/myorg/settings/providers?source=cli&providerId=new&provider=aws

   To learn more about providers, visit: http://slss.io/add-providers-dashboard
   ?
   [If you encountered an issue when setting up a provider, you may press Enter to
   skip this step]

   ✔ AWS Access Role provider was successfully created

   ? Do you want to deploy now? Yes

   Deploying aws-node-project to stage dev (us-east-1, "default" provider)

   ✔ Service deployed to stack aws-node-project-dev (71s)

   dashboard: https://app.serverless.com/myorg/apps/my-aws-node-project/aws-node-project/dev/us-east-1

   functions:
     hello: aws-node-project-dev-hello (225 kB)

   What next?
   Run these commands in the project directory:

   serverless deploy    Deploy changes
   serverless info      View deployed endpoints and resources
   serverless invoke    Invoke deployed functions
   serverless --help    Discover more commands
   ```

4. Navigate to the `aws-node-project` directory created by the previous step and install the `node-postgres` package, which you will use to connect to the database.

   ```bash
   npm install pg
   ```

   After installing the `node-postgres` package, the following dependency should be defined in your `package.json` file:

   ```json
   {
     "dependencies": {
       "pg": "^8.8.0"
     }
   }
   ```

5. In the `aws-node-project` directory, add a `users.js` file, and add the following code to it:

   ```javascript
   'use strict';

   const { Client } = require('pg');

   module.exports.getAllUsers = async () => {
     var client = new Client(process.env.DATABASE_URL);
     client.connect();
     var { rows } = await client.query('SELECT * from users');
     return {
       statusCode: 200,
       body: JSON.stringify({
         data: rows,
       }),
     };
   };
   ```

   The code in the `users.js` file exports the `getAllUsers` function, which retrieves all rows from the `users` table and returns them as a `JSON` object in the `HTTP` response body.

   This function uses the `pg` library to connect to the Neon database. It creates a new `Client` instance and passes the database connection string, which is defined in the `DATABASE_URL` environment variable. It then calls `connect()` to establish a connection to the database. Finally, it uses the `query()` method to execute a `SELECT` statement that retrieves all rows from the `users` table.

   The query method returns a `Promise` that resolves to an object containing the rows retrieved by the `SELECT` statement, which the function parses to retrieve the `rows` property. Finally, the function returns an `HTTP` response with a status code of 200 and a body that contains a `JSON` object with a single `data` property, which is set to the value of the rows variable.

6. Add the `DATABASE_URL` environment variable and the function definition to the `serverless.yml` file, which is located in your `aws-node-project` directory.

   <Admonition type="note">
   Environment variables can also be added to a `.env` file and loaded automatically with the help of the [dotenv](https://www.npmjs.com/package/dotenv) package. For more information, see [Resolution of environment variables](https://www.serverless.com/framework/docs/environment-variables).
   </Admonition>

   You can copy the connection string from **Connection Details** widget the Neon Console. Add the `DATABASE_URL` under `environment`, and add `sslmode=require` to the end of the connection string to enable SSL. The `sslmode=require` option tells Postgres to use SSL encryption and verify the server's certificate.

   ```yaml shouldWrap
   provider:
     name: aws
     runtime: nodejs14.x
     environment:
       DATABASE_URL: postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require

   functions:
     getAllUsers:
       handler: users.getAllUsers
       events:
         - httpApi:
             path: /users
             method: get
   ```

7. Deploy the serverless function using the following command:

   ```bash
   serverless deploy
   ```

   The `serverless deploy` command generates an API endpoint using [API Gateway](https://www.serverless.com/framework/docs/providers/aws/events/http-api). The output of the command appears similar to the following:

   ```bash
   Deploying aws-node-project to stage dev (us-east-1, "default" provider)

   ✔ Service deployed to stack aws-node-project-dev (60s)

   dashboard: https://app.serverless.com/myorg/apps/aws-node-project/aws-node-project/dev/us-east-1

   endpoint: GET - https://ge3onb0klj.execute-api.us-east-1.amazonaws.com/users

   functions:

     getAllUsers: aws-node-project-dev-getAllUsers (225 kB)
   ```

8. Test the generated endpoint by running a cURL command. For example:

   ```bash
   curl https://eg3onb0jkl.execute-api.us-east-1.amazonaws.com/users | jq
   ```

   The response returns the following data:

   ```bash
   {
     "data": [
       {
         "id": 1,
         "name": "Alice",
         "email": "alice@example.com",
         "created_at": "2023-01-10T17:46:29.353Z"
       },
       {
         "id": 2,
         "name": "Bob",
         "email": "bob@example.com",
         "created_at": "2023-01-10T17:46:29.353Z"
       },
       {
         "id": 3,
         "name": "Charlie",
         "email": "charlie@example.com",
         "created_at": "2023-01-10T17:46:29.353Z"
       },
       {
         "id": 4,
         "name": "Dave",
         "email": "dave@example.com",
         "created_at": "2023-01-10T17:46:29.353Z"
       },
       {
         "id": 5,
         "name": "Eve",
         "email": "eve@example.com",
         "created_at": "2023-01-10T17:46:29.353Z"
       }
     ]
   }
   ```

## Enabling CORS

If you make API calls to the Lambda function from your app, you will likely need to configure Cross-Origin Resource Sharing (CORS). Visit the AWS documentation for information about [how to enable CORS in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html).

You can run the following command to enable CORS to your local development environment:

```bash shouldWrap
aws apigatewayv2 update-api --api-id <api-id> --cors-configuration AllowOrigins="http://localhost:3000"
```

You can find your `api-id` on the API Gateway dashboard:

![Screenshot 2023-01-09 at 16 20 34](https://user-images.githubusercontent.com/13738772/211343246-27259351-d45b-4832-86d3-214431e196aa.png)

## Conclusion

In this guide, you have learned how to set up a Postgres database using Neon and connect to it from an AWS Lambda function using Node.js as the runtime environment. You have also learned how to use Serverless Framework to create and deploy the Lambda function, and how to use the `pg` library to perform a basic database read operations.
