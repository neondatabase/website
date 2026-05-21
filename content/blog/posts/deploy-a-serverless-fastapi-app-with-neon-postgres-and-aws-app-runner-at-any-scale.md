---
title: >-
  Deploy a Serverless FastAPI App with Neon Postgres and AWS App Runner at any
  scale
description: >-
  Create a serverless API using FastAPI, deployed on AWS App Runner and powered
  by Neon Postgres
excerpt: >-
  In this post, we’ll guide you through setting up a scalable serverless API
  using FastAPI, deployed on AWS App Runner and powered by Neon Postgres as the
  serverless database. FastAPI is a modern, fast (high-performance), web
  framework for building APIs with Python 3.8+ based on st...
date: '2024-02-09T17:16:46'
updatedOn: '2024-03-04T16:13:55'
category: community
categories:
  - community
authors:
  - stephen-siegert
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/cover.jpg
  alt: Neon FastAPI
isFeatured: false
seo:
  title: >-
    Deploy a Serverless FastAPI App with Neon Postgres and AWS App Runner at any
    scale - Neon
  description: >-
    In this post, we’ll guide you through setting up a scalable serverless API
    using FastAPI, deployed on AWS App Runner with Neon Postgres as the
    serverless database.
  keywords: []
  noindex: false
  ogTitle: >-
    Deploy a Serverless FastAPI App with Neon Postgres and AWS App Runner at any
    scale - Neon
  ogDescription: >-
    In this post, we’ll guide you through setting up a scalable serverless API
    using FastAPI, deployed on AWS App Runner with Neon Postgres as the
    serverless database.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/neon-fastapi-ad1e5d21.jpg)

In this post, we’ll guide you through setting up a scalable serverless API using [FastAPI](https://fastapi.tiangolo.com/), deployed on [AWS App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/what-is-apprunner.html) and powered by Neon Postgres as the serverless database.

FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints. The key features of FastAPI are its speed and ease of use, making it an excellent choice for building robust APIs. FastAPI has quickly become a go-to framework for setting up Python APIs and services.

AWS App Runner is a fully managed service that makes it easy for developers to quickly deploy containerized web applications and APIs, at scale. These services will automatically scale the instances up or down for your App Runner application in accordance to incoming traffic volume.

Neon complements this setup by providing a serverless Postgres database that [scales compute resources automatically](https://neon.tech/docs/introduction/autoscaling), optimizing performance based on demand.

We’ll walk through deploying a FastAPI application with Neon Serverless Postgres, focusing on secure database connection management via AWS Systems Manager (SSM) Parameter Store. This approach allows for flexible application environment management across development, testing, and production stages.

Let’s get started!

### Prerequisites

To follow along and deploy the application in this guide, you will need:

1. An AWS account, with access to AWS App Runner for deploying and managing your application
2. A GitHub or BitBucket account, for linking to AWS App Runner and enabling CI/CD functionality
3. [A Neon account](https://console.neon.tech/signup) – The FastAPI app will connect to a Neon serverless Postgres database 🚀

We’ll start by setting up a local development environment and getting our application running. Then, we’ll connect the application to a Neon Postgres database to ensure it can scale efficiently. Finally, we’ll set up automatic deployment through AWS App Runner, which will deploy our application upon each commit to a Git repository.<br /><br />This infrastructure provides a flexible architecture that will scale automatically as needed by the API.

### Set up FastAPI with Poetry

In this app, we’ll use [poetry](https://python-poetry.org/) to manage the dependencies in the local Python virtual environment. For reference, the Python version used to write this post is 3.11. This version will also match the [App Runner Python 3.11 runtime](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-code-python-releases.html) during deployment.

To start, use poetry to create a new project:

```bash
poetry new fastapi-neon
```

This will create a project structure that we’ll use to build out the FastAPI app.

```yaml
fastapi-neon
├── pyproject.toml
├── README.md
├── fastapi-neon
│   └── __init__.py
└── tests
    └── __init__.py
```

Next, initialize a new _git_ repository within the project directory.

```bash
git init
```

Once the app is working locally, you’ll push the repo to GitHub and then deploy to AWS App Runner using the built-in CI/CD workflow.

#### Installing FastAPI and uvicorn

To isolate project dependencies, poetry will create a Python virtual environment associated with the project. To serve the application, we’ll use [uvicorn](https://fastapi.tiangolo.com/deployment/manually/#run-a-server-manually-uvicorn).

Now, using poetry (or your preferred dependency manager), install `fastapi` and `uvicorn`.

```bash
poetry add fastapi "uvicorn[standard]"
```

Now, add a `main.py` file in the `fastapi_neon` app directory and serve the app:

```python
# fastapi_neon/main.py
from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
```

Serve the app locally with the following command:

```bash
poetry run uvicorn fastapi_neon.main:app --host 0.0.0.0 --port 8000
```

Awesome! The app will be functional on your local machine. Check the Swagger UI endpoint by visiting `https://0.0.0.0:8000/docs`.

![fastapi-swagger](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/fastapi-swagger-1024x360-f89904fa.png)

## Updating the application to connect to Neon

Now that we have an app working locally, we’ll connect the application code to a Neon Postgres database.

For configuration management, we’ll use the [Starlette configuration pattern](https://www.starlette.io/config/). This will make it possible to reference predefined environment variables. FastAPI is based on Starlette, so we’ll be able to use this functionality without adding an additional dependency.

To connect to a Postgres database from the app, we’ll add an [SQLModel](https://sqlmodel.tiangolo.com/) (based on SQLAlchemy). SQLModel is a library for interacting with SQL databases from Python code, with Python objects.

Since SQLModel is driver agnostic, we’ll need to install a Postgres driver to enable it to connect to Neon. For this, we’ll use [psycopg 3](https://www.psycopg.org/psycopg3/docs/index.html).

Add the `sqlmodel` and `psycopg` dependencies:

```bash
poetry add sqlmodel "psycopg[binary]"
```

_Note: The default driver behavior for SQLAlchemy is to look for/use psycopg2. If you plan on using psycopg2 then you’ll need to install `psycopg2-binary` and adjust the connection string formatting in the `create_engine` code below._

Now, replace the existing `main.py` application code with the app code below:

```python
# fastapi_neon/main.py
from contextlib import asynccontextmanager
from typing import Union, Optional
from fastapi_neon import settings
from sqlmodel import Field, Session, SQLModel, create_engine, select

from fastapi import FastAPI

class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(index=True)

# only needed for psycopg 3 - replace postgresql
# with postgresql+psycopg in settings.DATABASE_URL
connection_string = str(settings.DATABASE_URL).replace(
    "postgresql", "postgresql+psycopg"
)

# recycle connections after 5 minutes
# to correspond with the compute scale down
engine = create_engine(
    connection_string, connect_args={"sslmode": "require"}, pool_recycle=300
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# The first part of the function, before the yield, will
# be executed before the application starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating tables..")
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/todos/")
def create_todo(todo: Todo):
    with Session(engine) as session:
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo

@app.get("/todos/")
def read_todos():
    with Session(engine) as session:
        todos = session.exec(select(Todo)).all()
        return todos
```

This example API allows clients to create (POST) and retrieve (GET) todos. The database connection string is imported from settings and used to instantiate the connection in `create_engine`. All of the values are cast as `Secret` to limit their exposure in logs in the event that they are exposed.

[Lifespan events](https://fastapi.tiangolo.com/advanced/events/) are the recommended way to execute code once the server starts in FastAPI. In this example, the `Todo` model (i.e. table) is created if it doesn’t yet exist in the database.

The `pool_recycle=300` option is an “optimistic” approach to [prevent the pool from using a connection that has passed a certain age](https://docs.sqlalchemy.org/en/20/core/pooling.html#setting-pool-recycle). In this case, we are setting the value to 5 minutes to correspond with the default [compute auto-suspend in Neon](https://neon.tech/docs/guides/auto-suspend-guide).

Another option to account for possible stale connections is to use the `pool_pre_ping` option. This option is used to test the availability of a database connection before the connection is used. Note, this can add additional latency to new connections since they are first “checked”.

Next, we’ll get the connection string for the database.

#### Integrate Neon Postgres with FastAPI

Create a `settings.py` file in the `fastapi_neon` directory alongside `main.py`. This will reference the `DATABASE_URL` environment variable. During local development, this value will be populated from an `.env` file.

```python
# fastapi_neon/settings.py
from starlette.config import Config
from starlette.datastructures import Secret

try:
   config = Config(".env")
except FileNotFoundError:
   config = Config()

DATABASE_URL = config("DATABASE_URL", cast=Secret)
```

Create an `.env` file in the root of your project and add the `DATABASE_URL` variable:

```yaml
# .env
# Don't commit this to source control
# Eg. Include ".env" in your `.gitignore` file.
DATABASE_URL=
```

**Note: Do not commit the `.env` file to source control. Add `.env` to the `.gitignore` file to prevent this file from being committed and pushed. This environment variable in this file will only be used during local development.**

Visit the [Neon Console](https://console.neon.tech/), sign up, and create your first project by following the prompts in the UI. You can use an existing project or create another if you’ve already used Neon.

![Get started with Neon for free](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/get-started-with-neon-1024x789-d8b0c6a9.png)

Visit the project Dashboard, check the **Pooled connection** option, and select the **Connection string** option from the **Connection Details** panel.

The connection string will be in the following format:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Set this value as your `DATABASE_URL` in the `.env` file. Now, test the application by running the following to start the app server locally:

```bash
poetry run uvicorn fastapi_neon.main:app --host 0.0.0.0 --port 8000
```

The app is live…locally!

The application is now using Neon Postgres as the connected database. The `create_db_and_tables` lifespan event created the todo model (table) in the database. You can double-check this by going into the Neon console and viewing the tables in your Neon project – you will see `todo` listed.<br />You can insert and fetch _todos_ from the API by using the live endpoints. For example, try sending some requests using the built-in FastAPI Swagger UI docs endpoint at `https://0.0.0.0:8000/docs`.

<video autoPlay muted loop controls width="1228" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/fastapi-local-swagger-0a156cd2.mp4" />
</video>

Now, it’s time to deploy the app to AWS App Runner.

## Setting up the AWS App Runner configuration

A few items need to be in place before the app can be deployed to App Runner. Mainly, the database connection string will need to be stored in AWS Systems Manager (SSM) Parameter Store. Then, an `apprunner.yaml` configuration file will be added to the project that instructs App Runner how to build and run the app. This is also where the database connection string variable is referenced and associated with the app.

At a high-level, the steps are as follows. Subsequent sections will guide you through each of these:

1. Create the ** *apprunner.yaml* **configuration file in the root of the project directory
2. Create a `DATABASE_URL` parameter in SSM Parameter Store
3. Update the `apprunner.yaml` secret value with the SSM parameter ARN to inject the database connection string into the runtime environment
4. Create an _instance role_ that App Runner can use to access the SSM Parameter Store Secure String secret
5. Push to GitHub or BitBucket and set up the deployment in the AWS App Runner console

#### Create the App Runner _apprunner.yaml_ configuration

In your project directory, create an `apprunner.yaml` configuration file with the following structure.

```yaml
version: 1.0
runtime: python311
build:
  commands:
    build:
      - echo "Build command..."
run:
  runtime-version: 3.11
  pre-run:
    - echo "Installing dependencies..."
    - pip3 install poetry
    - poetry config virtualenvs.create false
    - poetry install

  command: poetry run uvicorn fastapi_neon.main:app --host 0.0.0.0 --port 8000
  network:
    port: 8000
  secrets:
    - name: DATABASE_URL
      value-from: "<replace-with-param-arn>"
```

This configuration instructs App Runner to install, build, and run the app. The specified managed runtime is the [revised Python 3.11 App Runner build](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-code.html#service-source-code.build-detail). When the app is pulled from the git repo, the dependencies defined in the `poetry.lock` file are installed, then the app is served using the same `uvicorn` command from the local environment. You’ll notice that there is a placeholder for the `value-from` entry in the `secrets` section. We’ll update this next.

_Note: The App Runner CI process is very strict when parsing the configuration. Make sure to check the indentation and that the file name is not abbreviated and ends with **.yaml**._

#### Create a DATABASE_URL parameter in SSM Parameter Store

Go to [AWS Systems Manager](https://console.aws.amazon.com/systems-manager/) and navigate to **Application Management** > **Parameter Store** and click **Create Parameter.**

Enter the following for Name and Type:

- **Name:** `/fastapi-neon/DATABASE_URL`
- **Type:** SecureString

For the value, use the database connection URL from **your Neon dashboard** that you’ve tested with previously.

Click **Create parameter**. Once created, click on the newly created parameter and copy the ARN identifier.<br />

![SSM Parameter Store - Copy parameter ARN](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/ssm-copy-arn-1024x770-e26a0b1a.png)

Now, replace the placeholder (`<replace-with-param-arn>`) value in `apprunner.yaml` under `secrets` > `value-from` with this ARN.

```yaml
...
secrets:
   - name: DATABASE_URL
     value-from: "<replace-with-param-arn>"
...
```

And **save**.

#### Push to Source Control

The final project directory structure will be:

```yaml
.
├── fastapi_neon
│   ├── __init__.py
│   ├── main.py 
│   └── settings.py
├── tests/
├── apprunner.yaml
├── poetry.lock
├── pyproject.toml
├── README.md
├── .gitignore
...
```

Confirm that `.env*` is included in the `.gitignore` file in the root of the project.

```yaml
# Environments
.env*
...
```

<br />Commit and push the code to a repo in GitHub or BitBucket. Remember, **do not commit the `.env` file**.

#### Create an App Runner instance role

In order for the App Runner process to access the SSM Parameter Store secret, we’ll need to create an [instance role](https://docs.aws.amazon.com/apprunner/latest/dg/security_iam_service-with-iam.html) with the appropriate permissions to access the SSM resource and attach it to the App Runner service when we create the service.

Go to the [AWS Identity and Access Management (IAM)](https://console.aws.amazon.com/iam/home) console and click **Create role**.

Select **Custom trust policy** and add the JSON policy below:

```json
[object Object]
```

1. Click **Next** and skip adding permissions
2. Click **Next** and enter the below information
   1. **Role name**: _`app-runner-fastapi-role`_
3. Click **Create Role**

Now, **open** the new _`app-runner-fastapi-role`_. Select **Create** **inline policy** in the **Permissions** tab.

![AWS IAM - Create inline policy](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/create-inline-policy-1024x205-918ea04b.png)

In the JSON editor, add the following permission policy with the parameter `/fastapi-neon/DATABASE_URL` ARN from above:

```json
[object Object]
```

The above permissions allow the App Runner [instance role to access the SSM parameter](https://docs.aws.amazon.com/apprunner/latest/dg/env-variable.html) (s) that contains the database connection string.

Click **Next**. In the **Policy details** section, add:

- **Policy name**: _apprunner-ssm-policy_

Finally, click **Create policy**.

## Deploying the application to AWS App Runner

Finally, we are in App Runner. Let’s deploy this service!

Go to [AWS App Runner](https://console.aws.amazon.com/apprunner/home) and click **Create an App Runner service**.

![AWS App Runner - Create Service](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/create-app-runner-1024x286-03bd2fd3.png)

This service will use a **Source code repository** since it will be pulling the code from the repo that was just created. You will need to allow App Runner to access the repo in your account if you have not already authorized the AWS Connector.

![AWS App Runner - Configure Service](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/source-and-deployment-1024x719-509248db.png)

Select your git provider and repository details. In **Deployment settings**, **Automatic** is selected to deploy the app on each push to the linked branch.<br />

![AWS App Runner - Automatically deploy app](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/apprunner-github-connecton-1024x883-86f9deef.png)

Click **Next**. On the next screen, select **Use a configuration file**. This will instruct App Runner to use the ** _apprunner.yaml_ ** configuration file from the repo. Click **Next**.

In the **Configure service** section:

- Add a **Service name** for your app in Service settings
- In **Security**, select the instance role that was created earlier.

![AWS App Runner - Select instance role](https://cdn.neonapi.io/public/images/pages/blog/deploy-a-serverless-fastapi-app-with-neon-postgres-and-aws-app-runner-at-any-scale/app-runner-instance-role-1024x397-6971aef8.png)

The trust relationship that was specified during role creation is what determines if it is available in the dropdown options 🙂.

Click **Next.** Next, review the setup and click **Create & deploy**.

_This may take a few minutes to deploy…_

Once successfully deployed, test the FastAPI service at `https://<service-id>.<region>.awsapprunner.com/docs`. For example, if you add data to the table using the SQL Editor in the Neon console:

```sql
INSERT INTO todo (content) VALUES ('Task 1.');
INSERT INTO todo (content) VALUES ('Task 2.');
INSERT INTO todo (content) VALUES ('Task 3.');
```

Then you can fetch that data by accessing `https://<service-id>.<region>.awsapprunner.com/todos/`.

### Clean up

To wrap up, delete the application if it’s no longer needed. To do this, go into the App Runner service and select **Actions** > **Delete** to remove the app.

## Conclusion

Integrating AWS App Runner and Neon Serverless Postgres is an effective way to deploy a robust, scalable serverless FastAPI service. Neon’s unique autoscaling capabilities ensure that your database resources adapt to your application’s demands without manual intervention. This dynamic scalability is crucial for maintaining optimal performance and cost efficiency during off-peak times and traffic bursts. This is perfect for growing teams that want to increase their development velocity while keeping their architecture flexible.

<br />To get started with incorporating Serverless Postgres into your FastAPI and Python apps, [sign up and try Neon for free](https://console.neon.tech/signup). Follow us on [Twitter](https://twitter.com/neondatabase) and join us in [Discord](https://neon.tech/discord) to share your experiences, suggestions, and challenges.

## Resources

- The code for this guide is in the [fastapi-apprunner-neon](https://github.com/neondatabase/fastapi-apprunner-neon) repo on GitHub
