---
title: Build a Python App with Reflex and Neon
subtitle: Learn how to build a Python Full Stack application with Reflex and Neon
enableTableOfContents: true
updatedOn: '2024-07-02T09:17:55.465Z'
---

[Reflex](https://reflex.dev/) is a Python web framework that allows you to build full-stack applications with Python.

Using Reflex, you can build frontend and backend applications using Python to manage the interaction between the frontend UI and the state with the server-side logic. To make the application data-driven, you can connect to a Neon Postgres database.

To connect to Neon from a Reflex application:

1. [Create a Neon project](#create-a-neon-project)
2. [Set up a Reflex project](#set-up-a-reflex-project)
3. [Configure Reflex connection settings](#configure-reflex-connection-settings)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Set up a Reflex project

To set up a Reflex project, you need to install the Reflex CLI and create a new project.

It's recommended to use a virtual environment to manage your project dependencies. In this example, `venv` is used to create a virtual environment. You can use any other virtual environment manager of your choice like `poetry`, `pipenv`, or `uv`.

To create a virtual environment, run the following command in your project directory:

<CodeTabs labels={["MacOS", "Windows"]}>

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

    ```
    py -3 -m venv .venv
    .venv\Scripts\activate
    ```

</CodeTabs>

### Install the Reflex CLI

To install the Reflex CLI, run the following command:

```bash
pip install reflex
```

### Create a new Reflex project

First, create a project directory for the Reflex app.

```bash
mkdir new_project
cd new_project
```

To initialize the Reflex app, run the following command:

```bash
reflex init
```

When a project is initialized, the Reflex CLI creates a project directory. This directory will contain the following files and directories:

```
<new_project>
├── .web
├── assets
├── <new_project>
│   ├── __init__.py
│   └── <new_project>.py
└── rxconfig.py
```

The `rxconfig.py` file contains the project configuration settings. This is where the database connection settings will be defined.

### Run the Reflex App

To run the Reflex app, use the following command:

```bash
reflex run
```

The Reflex server starts and runs on `http://localhost:3000`.

## Configure Reflex connection settings

Now that you have set up a Reflex project, you can configure the connection settings to connect to Neon.

To configure the connection settings:

1. Open the `rxconfig.py` file in the project directory.

2. Adjust the following code in the `rxconfig.py` file to match your Neon connection details:

   ```python
   # rxconfig.py
   import reflex as rx

   config = rx.Config(
       app_name="new_project",
       # Connect to your own database.
       db_url="<connection-string-from-neon>",
   )
   ```

   Replace `<connection-string-from-neon>` with your Neon connection string. You can find all of the connection details listed above in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

   <Admonition type="note">

   Replace the value for `db_url` with an environment variable or the connection string from Neon. For example, after creating an environment variable named `NEON_DATABASE_URL`, you can use it as follows:

   ```python
   import os

   DATABASE_URL = os.getenv("NEON_DATABASE_URL")

   config = rx.Config(
       app_name="new_project",
       db_url=DATABASE_URL,
   )
   ```

   </Admonition>

3. Save the changes to the `rxconfig.py` file.

   Now, you can run the Reflex app and start building your Python full-stack application with Reflex and Neon.

## Creating a data model

To create a data model in Reflex, you can define a Python class that represents the data structure. Reflex uses [sqlmodel](https://sqlmodel.tiangolo.com/) to provide a built-in ORM wrapping [SQLAlchemy](/docs/guides/sqlalchemy).

For example, you can create a `Customer` model as follows:

```python
# <new_project>/models.py

import reflex as rx

class Customer(rx.Model, table=True):
    """The customer model."""

    name: str
    email: str
    phone: str
    address: str

```

This code defines a `Customer` model with fields for `name`, `email`, `phone`, and `address`. The `table=True` argument tells Reflex to create a table in the database for this class.

You can then use this model to interact with the database and perform CRUD operations on the `Customer` data.

Creating the table with the model:

```bash
reflex db init
```

This command creates the table in the database based on the model definition using an alembic migration.

Now you can use the `Customer` model to interact with the database and perform CRUD operations on the `Customer` data.

For example, you can add a new customer to the database as follows:

```python
with rx.session() as session:
    session.add(
        Customer(
            name="Alice",
            email="user@test.com",
            phone="1234567890",
            address="123 Main St",
        )
    )
    session.commit()
```

This code creates a new `Customer` object and adds it to the database using a session. The `session.commit()` method saves the changes to the database. If you change the table schema, you can run the following command to update the database:

```bash
reflex db makemigrations --message '<describe what changed>'
```

This command generates a new migration file that describes the changes to the database schema. You can then apply the migration to the database with the following command:

```bash
reflex db migrate
```

This command applies the migration to the database, updating the schema to match the model definition.

## Create a Customer Data App in Reflex with Neon

Learn how to use Reflex with Neon Postgres to create an interactive Customer Data App. The app demonstrates how to edit tabular data from a live application connected to a Postgres database. You can find a live version of the application [here](https://customer-data-app.reflex.run/).

![Reflex Customer Data App](/docs/guides/reflex_customer_data_app.png)

<DetailIconCards>

<a href="https://github.com/reflex-dev/templates/tree/main/customer_data_app" description="GitHub repository for the Reflex Customer Data App built with Neon Postgres" icon="github">Customer Data App</a>

</DetailIconCards>
