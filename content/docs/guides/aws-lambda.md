---
title: Connect from AWS Lambda
enableTableOfContents: true
---

AWS Lambda is a serverless, event-driven compute service that allows you to run code without provisioning or managing servers. It is a convenient and cost-effective solution for running various types of workloads, including those that require a database.

This guide describes how to set up a Neon database and connect to it from an AWS Lambda function using Node.js as the runtime environment. It covers:

- Creating a Lambda function using the [Serverless Framework](https://www.serverless.com/), which is a serverless application lifecycle management framework.
- Connecting your Lambda function to a Neon database.
- Deploying the Lambda function to AWS.

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](https://neon.tech/docs/get-started-with-neon/signing-up/) for instructions.
- An AWS account. You can create a free AWS account at [AWS Free Tier](https://aws.amazon.com/free/).
- A Service Framework account. You can sign up at [Serverless Framework](https://www.serverless.com/).

## Create a table in Neon

To create a table, navigate to the **SQL Editor** in the [Neon Console](https://console.neon.tech/), or connect to your project using Neon's [passwordless connect](../../connect/passwordless-connect/) feature:

```bash
psql -h pg.neon.tech
```

In the SQL Editor or from the `psql` command-line, run the following queries to create a `users` table and insert some data:

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

The following steps describe how to create the Lambda function using the [Serverless Framework](https://www.serverless.com/).

1. Install the Serverless Framework by running the following command:

    ```bash
    npm install -g serverless
    ```

2. Create a `my-lambda` project and change to that directory.

    ```bash
    mkdir my-lambda
    cd my-lambda
    ```

3. Run the **serverless** command to create a serverless project. When prompted, select the **AWS - Node.js - Starter** project and provide your AWS account credentials, which include your AWS Access Key Id and AWS Secret Access Key. The process creates an `aws-node-project` directory.

    ```bash
     serverless
    ```

4. Install the `node-postgres` package, which you will use to connect to the database.

    ```bash
    npm install pg
    ```

5. Add a file named `users.js` to the `aws-node-project` directory and add the following code:

    ```js
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

    The code above exports the function `getAllUsers`, which retrieves all rows from the `users` table and returns them as a `JSON` object in the `HTTP` response body.

    The function uses the `pg` library to connect to the Neon database using the `Client` class and the database connection URL that is stored in the `DATABASE_URL` environment variable. The function calls the connect method on the `Client` instance to establish a connection to the database, and uses the query method to execute a `SELECT` statement that retrieves all rows from the `users` table.

    The query method returns a `Promise` that resolves to an object containing the rows retrieved by the `SELECT` statement, which the function parses to retrieve the `rows` property. Finally, the function returns an `HTTP` response with a status code of 200 and a body that contains a `JSON` object with a single `data` property, which is set to the value of the rows variable.

6. Add the `DATABASE_URL` environment variable and the function definition to the `serverless.yml` file, which is located in your `aws-node-project` directory.

    You can copy the connection string from the Neon Console, and add the `DATABASE_URL` under `environment`. Add `sslmode=require` to enable SSL. The `sslmode=require` option tells PostgreSQL to use SSL encryption and verify the server's certificate.
  
    ```yaml
    provider:
     name: aws
     runtime: nodejs14.x
     environment:
       DATABASE_URL: postgres://<USER>:<PASSWORD>@<HOST>/<DATABASE>?sslmode=require

    functions:
     getAllUsers:
       handler: users.getAllUsers
       events:
         - httpApi:
             path: /users
             method: get
    ```

7. Deploy your function using the following command:

    ```bash
    serverless deploy
    ```

    The `serverless deploy` command generates an API endpoint using [API Gateway](https://www.serverless.com/framework/docs/providers/aws/events/http-api).
  
8. If you make API calls to the Lambda function from your app, you will likely need to configure Cross-Origin Resource Sharing (CORS).  Visit the AWS documentation for information about [how to enable CORS in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html).

   Run the following command to enable CORS to your local development environment:

    ```bash
    aws apigatewayv2 update-api --api-id <api-id> --cors-configuration AllowOrigins="http://localhost:3000"
    ```

    You can find your api-id on the API Gateway dashboard.
    ![Screenshot 2023-01-09 at 16 20 34](https://user-images.githubusercontent.com/13738772/211343246-27259351-d45b-4832-86d3-214431e196aa.png)

9. Test your endpoint by running a cURL command from your terminal. For example:

```bash
curl https://eo58vzqeei.execute-api.us-east-1.amazonaws.com/userse-api.us-east-1.amazonaws.com/users
```

## Conclusion

In this guide, you have learned how to set up a PostgreSQL database using Neon and connect to it from an AWS Lambda function using Node.js as the runtime environment. You have also learned how to use Serverless Framework to create and deploy the Lambda function, and how to use the `pg` library to perform a basic read operations on the database.
