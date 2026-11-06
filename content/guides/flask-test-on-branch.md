---
title: Testing Flask applications with Neon branching
subtitle: Testing with realistic production data using Flask and Neon branching
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-09-15T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

[Flask](https://flask.palletsprojects.com/) is a popular Python micro-framework widely used for building web applications. It includes tools for automated testing, and [pytest](https://docs.pytest.org/) is a common choice for writing tests.

Testing with realistic data shows how your application performs under real-world conditions. Neon branching lets you test with a copy of your production data without affecting your live database.

## Flask testing approaches

Flask applications commonly use an in-memory SQLite database for testing. Each test run starts from a clean state by applying all database migrations and seeders. This setup also works well for parallel testing, because tests run quickly and don't interfere with each other.

But SQLite can behave differently from your production database, such as Postgres. Those differences can change your application's behavior and cause unexpected issues in production. Testing against a copy of your real database gives a more accurate picture of how your application will perform.

## Neon branching

Neon [branching](/docs/introduction/branching) lets you create isolated branches of your database for development, testing, and more.

A branch in Neon is a copy-on-write clone of your data that can be made from the current database state or any past state. This means you can have an exact copy of your production data at a specific point in time to use for testing.

Branching is useful in continuous integration and delivery pipelines because it cuts the setup time for test environments. You get realistic test data without maintaining multiple separate databases. For more information, see [Branching](/docs/introduction/branching).

## Setting up your testing environment

Next, you'll set up a Flask project with a Postgres database and write tests using pytest.

### Prerequisites

Before you begin, make sure you have the following:

- Python 3.8 or higher installed on your machine
- A [Neon account](https://console.neon.tech/signup) with a project created
- Basic familiarity with Flask and SQLAlchemy

### Installation and configuration

To set up your testing environment with Neon and Flask, follow these steps:

1. Configure the database connection:

   After creating your Neon project, click **Connect** on your project dashboard to get the connection details. Create a `.env` file with the Neon database connection parameters:

   ```env
   DATABASE_URL=postgresql://user:password@your-neon-hostname.neon.tech:5432/dbname?sslmode=require&channel_binding=require
   ```

   Replace `user`, `password`, `your-neon-hostname`, and `dbname` with your Neon database details.

2. Install required packages:

   Install Flask, SQLAlchemy, pytest, and other necessary packages:

   ```bash
   pip install flask flask-sqlalchemy psycopg2-binary python-dotenv pytest
   ```

   Freeze the requirements so others can reproduce your environment:

   ```bash
   pip freeze > requirements.txt
   ```

### Creating a migration and model

You can use SQLAlchemy for database operations in Flask applications, and Flask-Migrate to manage database migrations.

1. Set up Flask-Migrate:

   Install and initialize Flask-Migrate:

   ```bash
   pip install Flask-Migrate
   ```

   In your main application file, initialize Flask-Migrate with your Flask app and database instance:

   ```python
   from flask_migrate import Migrate

   migrate = Migrate(app, db)
   ```

   This setup allows you to manage database migrations using Flask-Migrate.

2. Create a model:

   In `models.py`, define a `Question` model:

   ```python
   from flask_sqlalchemy import SQLAlchemy

   db = SQLAlchemy()

   class Question(db.Model):
       id = db.Column(db.Integer, primary_key=True)
       title = db.Column(db.String(100), nullable=False)
       description = db.Column(db.Text, nullable=False)
   ```

3. Generate and run migrations:

   Create and apply the initial migration:

   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

### Creating a questions route

In your main Flask application file, add a route to handle fetching questions from the database:

```python
from flask import jsonify
from models import Question

@app.route('/questions')
def get_questions():
    questions = Question.query.all()
    return jsonify([{
        'id': q.id,
        'title': q.title,
        'description': q.description
    } for q in questions])
```

This route fetches all questions from the database and returns them as JSON. You can expand this route to include additional functionality as needed.

If you don't have any questions in your database yet, you can add some manually or create a seed script to populate the database with test data.

To verify the setup, run the Flask development server:

```bash
flask run
```

If everything is set up correctly, you should be able to access the `/questions` route and see the questions returned as JSON.

### Writing a pytest test for the questions route

The standard convention for naming test files is to prefix them with `test_`. This allows pytest to automatically discover and run the tests.

In this case, if your Flask application is in a file named `app.py`, create a file named `test_app.py` in the same directory:

```python
import pytest
from app import app, db
from models import Question

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_get_questions(client):
    # Add a test question
    question = Question(title='Test Question', description='This is a test')
    db.session.add(question)
    db.session.commit()

    response = client.get('/questions')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['title'] == 'Test Question'
```

Here we define a test fixture to set up and tear down the test environment. The `test_get_questions` function tests the `/questions` route by adding a test question to the database, making a request to the route, and asserting the response. The test checks that the route returns the expected data.

### Running the tests

With the test in place, run it using pytest:

```bash
pytest
```

This setup provides a foundation for testing Flask applications with Lakebase Postgres, which you can expand for more complex applications and larger test suites.

## Using Neon branching with Flask

Don't run tests against your production database. The fixture above drops all tables after each test, and tests can corrupt data or create security risks.

A Neon branch gives you an isolated copy of your production database to test against instead. This is most useful for schema changes and data migrations, where you want to validate your application's behavior on real data.

### Creating a Neon branch

1. **Log in to the Neon Console:**
   - Log in at [console.neon.tech](https://console.neon.tech).

2. **Select your project:**
   - Select the project you use for your production environment.

3. **Create a new branch:**
   - Select **Branches** under **Project**.
   - Click **New branch**.
   - Name your new branch (for example, `testing-branch`) and choose whether to include current data or data from a past point in time. This creates a copy-on-write clone of your database.
   - The branch is ready within a few seconds.

### Integrating Neon branching with Flask testing

Go back to your Flask project and integrate the Neon branch into your testing setup:

1. **Update environment configuration:**
   - Once your branch is created, get its connection details (hostname, database name, username, and password) by clicking **Connect** and selecting the branch.
   - Create a new environment file for testing, such as `.env.test`, and configure it to use the Neon testing branch:

     ```env
     DATABASE_URL=postgresql://user:password@your-neon-testing-hostname.neon.tech:5432/dbname?sslmode=require&channel_binding=require
     ```

2. **Update test configuration:**
   - Modify your `test_app.py` file to use the testing environment:

     ```python
     import os
     from dotenv import load_dotenv

     # Load test environment variables
     load_dotenv('.env.test')

     # Use the DATABASE_URL from the test environment
     app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
     ```

3. **Run tests:**
   - With the testing branch configured, you can run your tests against the isolated database environment:

     ```bash
     pytest
     ```

   - Examine the output from pytest to ensure your application behaves as expected against the testing branch. You're testing against a copy of your production setup instead of an in-memory SQLite database.

In addition to running tests locally, you can automate the testing process by integrating Neon branching with your CI/CD pipeline. Neon provides GitHub Actions for creating and managing database branches in CI. For more information, see the [Neon branching GitHub Actions guide](/docs/guides/branching-github-actions).

## Managing Neon branches with the `neon` CLI

With the `neon` CLI, you can create and list branches, get connection strings, and delete branches from your terminal.

### Installing `neon`

Before you can start using `neon`, you need to install it on your local machine. Follow the installation instructions provided in the [Neon CLI documentation](/docs/cli/install) to set up `neon` on your system.

### Using `neon` to manage branches

Once `neon` is installed, here are the basic commands for managing branches:

#### 1. [Creating a branch](/docs/cli/branches#create)

To create a new branch, use the `neon branches create` command:

```bash
neon branches create --project-id PROJECT_ID --parent PARENT_BRANCH_ID --name BRANCH_NAME --no-secrets
```

Replace `PROJECT_ID`, `PARENT_BRANCH_ID`, and `BRANCH_NAME` with the appropriate values for your Neon project. This command will create a new branch based on the specified parent branch. `--no-secrets` (Neon CLI 4.9.0+) keeps the connection string out of CI logs; you fetch it next with `neon connection-string`.

#### 2. [Listing branches](/docs/cli/branches#list)

To list all branches in your Neon project, use the `neon branches list` command:

```bash
neon branches list --project-id PROJECT_ID
```

Replace `PROJECT_ID` with your Neon project ID. This command will display a list of all branches along with their IDs, names, and other relevant information.

#### 3. [Getting a connection string](/docs/cli/connection-string)

Once you've created a branch, you'll need its connection string to configure your Flask application. Use the `neon connection-string` command:

```bash
neon connection-string BRANCH_ID
```

Replace `BRANCH_ID` with the ID of the branch you want to connect to. This command will output the connection string that you can use in your `.env.test` file.

#### 4. [Deleting a branch](/docs/cli/branches#delete)

After you've finished testing with a branch, you can delete it using the `neon branches delete` command:

```bash
neon branches delete BRANCH_ID
```

Replace `BRANCH_ID` with the ID of the branch you want to delete. This command removes the branch from your Neon project so it doesn't keep using storage.

## Conclusion

You set up a Flask app with pytest and ran its tests against a Neon branch, a copy of your production data that's isolated from your live database. As a next step, automate branch creation and cleanup in CI with the [Neon branching GitHub Actions guide](/docs/guides/branching-github-actions).

## Additional resources

- [Flask documentation](https://flask.palletsprojects.com/)
- [pytest documentation](https://docs.pytest.org/)
- [SQLAlchemy documentation](https://docs.sqlalchemy.org/)
- [Neon branching GitHub Actions guide](/docs/guides/branching-github-actions)

<NeedHelp />
