AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. It is a convenient and cost-effective solution for running various types of workloads, including those that require a database. 

In this guide, we will look at how to set up a Neon database and connect to it from an AWS Lambda function using Node.js as the runtime. By the end of this guide, you will:
- Create a Lambda Function using the Serverless Framework
- Connect your Lambda Function to a Neon database
- Deploy the Lambda Function to AWS

Prerequisites:
- Neon account. Create and account on https://console.neon.tech/sign_in if you don’t have one.
- AWS account. Create an AWS account on https://aws.amazon.com/  

## Create project and schema
Before get started, create a schema. To do so, you can navigate to the SQL Editor page on the Neon Console, or connect to your project using the passwordless command:

```bash
psql -h pg.neon.tech
```


Let’s then run the following query to create a `users` table and inserts a few rows to it :

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

## Create Lambda function
We will create the Lambda function using the Serverless Framework. You can install the framework by running the following command:

```bash
npm install -g serverless
```


We will now create a new project `my-lambda` and move to the directory. Run the below command and follow the instructions:
serverless


We will use the `node-postgres` package to connect to the database. You can install the package using the following command:

```bash
npm install pg
```


Let’s create a new file `user.js` and paste the following code:
```js
'use strict';

const { Client } = require('pg');

module.exports.getAllUsers = async () => {
 var client = new Client(process.env.DATABASE_URL);
 client.connect();
 var { rows } = await client.query('SELECT * from users);
 return {
   statusCode: 200,
   body: JSON.stringify({
     data: rows,
   }),
 };
};
```

The code above exports a function `getAllUsers` that retrieves all rows from the `users` table and returns them as a JSON object in the HTTP response body. 

The function uses the `pg` library to connect to the Neon database using the `Client` class and the database connection URL stored in the `DATABASE_URL` environment variable. It then calls the connect method on the Client instance to establish a connection to the database and uses the query method to execute a SELECT statement that retrieves all rows from the users table. 

The query method returns a Promise that resolves to an object containing the rows retrieved by the SELECT statement, which the function destructures to get the rows property. Finally, the function returns an HTTP response with a status code of 200 and a body that contains a JSON object with a single property, data, which is set to the value of the rows variable.

Let’s now add our environment variable `DATABASE_URL` and our function definition to the `serverless.yml` file. 

You can copy the connection string from the Neon Console and add the `DATABASE_URL` under `environment`. Add `sslmode=require` to enable SSL. The sslmode=require option tells Postgres to use SSL encryption and to verify the server's certificate.

```yml
org: aws-user
app: lambda-example
service: nodejs
frameworkVersion: '3'

provider:
 name: aws
 runtime: nodejs14.x
 region: eu-west-1
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

You can now deploy your function using the following command:
```bash
serverless deploy
```

The` serverless deploy` command will generate an API endpoint using API Gateway.
If you making API calls to the Lambda function from your app, you will likely need to configure (Cross-Origin Resource Sharing) CORS. Visit the AWS documentation for more information about [how to enable CORS in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html)

Run the following command to enable CORS to your local development environment:
```bash
aws apigatewayv2 update-api --api-id <api-id> --cors-configuration AllowOrigins="http://localhost:3000"
```

You can find your api-id on the API Gateway dashboard.
![Screenshot 2023-01-09 at 16 20 34](https://user-images.githubusercontent.com/13738772/211343246-27259351-d45b-4832-86d3-214431e196aa.png)


In this guide, we have covered how to set up a Postgres database using Neon and connect to it from an AWS Lambda function using Node.js as the runtime. We have also seen how to use the Serverless Framework to create and deploy the Lambda function, and how to use the pg library to perform a basic read operations on the database.
