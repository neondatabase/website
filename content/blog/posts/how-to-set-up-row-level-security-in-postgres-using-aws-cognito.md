---
title: How to Set Up Row-Level Security in Postgres Using AWS Cognito
description: Learn how Neon Authorize and Cognito work together
excerpt: >-
  This blog post teaches you an easy method to implement row-level security in
  your Postgres database when using AWS Cognito for authorization. To
  demonstrate everything, we’ll be using an app with Neon as the Postgres
  provider, Neon Authorize, Express.js, and HTMX. All the code in...
date: '2024-12-04T17:26:16'
updatedOn: '2024-12-04T17:26:19'
category: community
categories:
  - community
  - product
authors:
  - brian-holt
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-set-up-row-level-security-in-postgres-using-aws-cognito/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How to Set Up Row-Level Security in Postgres Using AWS Cognito - Neon
  description: >-
    Learn an easy method to implement row-level security in your Postgres
    database when using AWS Cognito for authorization.
  keywords: []
  noindex: false
  ogTitle: How to Set Up Row-Level Security in Postgres Using AWS Cognito - Neon
  ogDescription: >-
    Learn an easy method to implement row-level security in your Postgres
    database when using AWS Cognito for authorization.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-set-up-row-level-security-in-postgres-using-aws-cognito/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-set-up-row-level-security-in-postgres-using-aws-cognito/neon-cognito-1024x576-04765de9.jpg)

This blog post teaches you an easy method to implement row-level security in your Postgres database when using AWS Cognito for authorization. To demonstrate everything, we’ll be using an app with Neon as the Postgres provider, Neon Authorize, Express.js, and HTMX. All the code in this post can be found here:

[https://github.com/neondatabase-labs/aws-cognito-express-htmx-neon-authorize](https://github.com/neondatabase-labs/aws-cognito-express-htmx-neon-authorize)

## Teck Stack Overview

### AWS Cognito

[AWS Cognito](https://aws.amazon.com/pm/cognito/?trk=814a4b59-9fc6-4dda-8199-bd06c380b692&sc_channel=ps&ef_id=CjwKCAiA3ZC6BhBaEiwAeqfvyk_0ibOUKOC_1-Ke8OflGNuMXBjb3ZkKZW3t50ck3O0C6aq1F0sCzRoCaMoQAvD_BwE:G:s&s_kwcid=AL!4422!3!652240143559!e!!g!!cognito!19878797452!155825919588&gbraid=0AAAAADjHtp8ebQXdQ6F9JJLkesdyUp56E&gclid=CjwKCAiA3ZC6BhBaEiwAeqfvyk_0ibOUKOC_1-Ke8OflGNuMXBjb3ZkKZW3t50ck3O0C6aq1F0sCzRoCaMoQAvD_BwE) is a popular tool for handing authorization in AWS architectures. It has good options for working with social sign-ins, traditional email/password combos, or federated identities, also making it easy to set up features like multi-factor authentication.

<Admonition type="info">
We also have tutorials for setting up RLS with many other Authorization providers, including Clerk, Auth0, Stack Auth, Keycloak, and more. [Check out our docs](https://neon.tech/docs/guides/neon-authorize#supported-providers).
</Admonition>

### Neon and its serverless driver

[Neon](https://neon.tech/home) is Postgres packaged into a serverless platform, offering features like autoscaling and scale-to-zero. It integrates very well within AWS architectures, especially in serverless apps: Neon comes with a HTTP/Websockets-based [serverless driver](https://neon.tech/docs/serverless/serverless-driver) optimized for ephemeral environments (e.g. Lambdas) which often lead to connection issues with standard Postgres drivers. Neon has a Free Plan, so you can [create an account](https://console.neon.tech/signup) to follow along.

### Neon Authorize

[Neon Authorize](https://neon.tech/docs/guides/neon-authorize) is an open-source tool that takes the Postgres developer experience up a notch by making row-level security easy to implement. Instead of hardcoding user permissions, Neon Authorize allows you to use JWTs from your authentication provider (like AWS Cognito) to enforce fine-grained access controls directly at the database level. [Read more about it.](https://neon.tech/blog/introducing-neon-authorize)

## Step-by-step guide: AWS Cognito and Postgres’ Row-Level Security

This guide will walk you through building the demo app [in this repo](https://github.com/neondatabase-labs/aws-cognito-express-htmx-neon-authorize).

<Admonition type="info">
This demo app uses HTML and Express.js, but we also have examples with Next.js, React.js, Nest.js, Solid.js, etc. [Checkout the neondatabase-labs org on GitHub](https://github.com/neondatabase-labs?q=authorize).
</Admonition>

### Step 1: Configure AWS Cognito

- In the AWS Management Console, navigate to Cognito and create a User Pool. Enable email as the sign-in method and configure additional attributes as needed (e.g., sub for user ID).
- In the User Pool, create an App Client. Note down the Client ID and Client Secret for later use.
- If you want, modify your User Pool settings to include additional claims in the JWT, such as roles or user-specific identifiers, which you’ll use for RLS policies. Once you’ve done this, test the setup: you can use AWS Cognito’s hosted UI or a testing tool like Postman to ensure you can authenticate users and retrieve a valid JWT.

### Step 2: Configure Postgres

To create your Postgres database, head over to the [Neon console,](https://console.neon.tech/signup) create a new project, and set up a database. Note the database credentials and connection string.

Next, let’s enable row-level security. Connect to your Neon database using psql or the SQL Editor in the Console, and enable RLS on the target table:

```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

Set up the example table that will be used in the application:

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL
);
```

And enable RLS on the `notes` table:

```sql
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
```

Next, add a RLS policy to restrict access based on the `user_id` field. This ensures users only see their own notes:

```sql
CREATE POLICY user_access_policy
ON notes
USING (user_id = current_setting('jwt.claims.sub'));
```

Lastly, populate the table with a few sample rows:

```sql
INSERT INTO notes (user_id, content) VALUES
('user1', 'This is a note for user1'),
('user2', 'This is a note for user2');
```

### Step 3: Integrate AWS Cognito and the Postgres database

Now it’s time to set up Neon Authorize. This authorization tool validates the JWT issued by AWS Cognito and securely maps its claims to Postgres session variables. This is crucial for enabling RLS policies that depend on user-specific data, such as `sub`.

What you need to do is to modify your application to extract claims from the JWT and pass them as Postgres session variables using Neon Authorize. In our demo app, this happens in the Express middleware:

```javascript
const jwt = require('jsonwebtoken');

const token = req.headers.authorization.split(' ')[1];
const decodedToken = jwt.verify(token, process.env.COGNITO_PUBLIC_KEY);

await pgClient.query(`SET jwt.claims.sub = '${decodedToken.sub}'`);
```

Here, the `sub` claim (user ID) is extracted and set as a session variable in Postgres.

Our demo app uses the Neon serverless driver to handle database connections. This driver passes the JWT securely during connection initialization, allowing Neon Authorize to validate the token and configure the session environment for the RLS policies.

### Step 4: Test the application

To test the app, clone the [GitHub repository](https://github.com/neondatabase-labs/aws-cognito-express-htmx-neon-authorize) to your local environment:

```bash
git clone https://github.com/neondatabase-labs/aws-cognito-express-htmx-neon-authorize.git
```

Navigate to the project directory and install dependencies:

```bash
cd aws-cognito-express-htmx-neon-authorize
npm install
```

To configure the environment variables, create a `.env` file based on `.env.example` and set the following values:

- Database connection string: `DATABASE_URL`
- AWS Cognito pool details: `COGNITO_REGION`, `COGNITO_USER_POOL_ID`, etc.
- Public key for JWT verification: `COGNITO_PUBLIC_KEY`

To start the app locally, run:

```bash
npm start
```

### Step 5: Verify RLS policies

Now that we have the app running, let’s test how the RLS policies we set up earlier are working in the wild.

1. Let’s authenticate a user. Log in through AWS Cognito’s hosted UI or a custom interface integrated with Cognito, and obtain the JWT for the authenticated user.
2. Use the application to create, view, and fetch notes. Verify that:
   - A user can only view their own notes based on their sub claim in the JWT.
   - Any unauthorized access to another user’s data is denied.
3. Check the server logs to verify that JWT claims are properly parsed and session variables are correctly set in Postgres.

## Wrap up

This application demonstrates how to enforce secure, fine-grained access control at the database level in a modern serverless stack with AWS Cognito and Neon Postgres. To dig deeper, explore the [Neon documentation](https://neon.tech/home) and [our examples for Neon Authorize](https://github.com/neondatabase-labs).

---

_Neon is a serverless Postgres platform that helps teams ship faster via instant provisioning, autoscaling, and database branching. We have a Free Plan – sign up [here](https://neon.tech/signup)._
