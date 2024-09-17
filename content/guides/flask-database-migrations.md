---
title: Managing database migrations and schema changes with Flask and Neon Postgres
subtitle: Learn how to handle database migrations and schema changes in a Flask application using Flask-Migrate and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-09-14T00:00:00.000Z'
updatedOn: '2024-09-14T00:00:00.000Z'
---

Flask is a lightweight and flexible web framework for Python that makes it easy to build web applications. When working with databases in [Flask](https://flask.palletsprojects.com/), [SQLAlchemy](https://www.sqlalchemy.org/) is a popular choice for an ORM.

As your Flask application grows, so does your database schema and its complexity. Managing these changes effectively is important for maintaining data integrity and smooth deployments.

This guide will walk you through the process of handling database migrations and schema changes in a Flask application using Flask-Migrate and Neon Postgres.

## Prerequisites

Before we begin, make sure you have:

- Python 3.7 or later installed
- A [Neon](https://console.neon.tech/signup) account for Postgres hosting
- Basic familiarity with Flask and SQLAlchemy

## Setting up the Project

1. Create a new directory for your project and navigate into it:

   ```bash
   mkdir flask-migrations-demo
   cd flask-migrations-demo
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

   This will isolate your project dependencies from other Python projects, so you can manage them independently.

3. Install the required packages:

   ```bash
   pip install flask flask-sqlalchemy flask-migrate psycopg2-binary python-dotenv
   ```

   We are installing Flask, Flask-SQLAlchemy, Flask-Migrate, psycopg2-binary (Postgres driver), and python-dotenv (for managing environment variables).

   An additional thing that you might want to do is to create a `requirements.txt` file with the installed packages:

   ```bash
   pip freeze > requirements.txt
   ```

   This will allow you to easily install the required packages on another machine by running:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in your project root and add your Neon Postgres connection string:

   ```
   DATABASE_URL=postgresql://user:password@your-neon-host:5432/your-database
   ```

   Replace the placeholders with your actual Neon database credentials.

   Note that you should never commit your `.env` file to version control. Add it to your `.gitignore` file to prevent accidental commits.

   Instead, you can have a `.env.example` file with the required variables and commit that to your repository. Then, each developer can create their own `.env` file based on the `.env.example` template including their own credentials.

## Creating the Flask Application

With the project set up, let's create the Flask application and set up database migrations.

Create a new file called `app.py` with the following content:

```python
# Import necessary modules
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Configure the database URI using the environment variable
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

# Disable SQLAlchemy modification tracking for better performance
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the Flask app
db = SQLAlchemy(app)

# Initialize Flask-Migrate with the Flask app and SQLAlchemy instance
migrate = Migrate(app, db)

# Define the User model
class User(db.Model):
    # Primary key for the User table
    id = db.Column(db.Integer, primary_key=True)

    # User's name (required field, maximum 100 characters)
    name = db.Column(db.String(100), nullable=False)

    # User's email (required field, unique, maximum 120 characters)
    email = db.Column(db.String(120), unique=True, nullable=False)

    # String representation of the User object
    def __repr__(self):
        return f'<User {self.name}>'

# Run the Flask application in debug mode if this file is executed directly
if __name__ == '__main__':
    app.run(debug=True)
```

This sets up a basic Flask application with SQLAlchemy and Flask-Migrate, and defines a simple User model. Here's a breakdown of what each part does:

1. **Imports**: We import necessary modules including Flask, SQLAlchemy, Flask-Migrate, os (for environment variables), and dotenv (for loading .env files).

2. **Environment Variables**: We use `load_dotenv()` to load environment variables from a .env file, which will include our database URL.

3. **Flask App Initialization**: We create a Flask application instance.

4. **Database Configuration**: We configure the SQLAlchemy database URI using the `DATABASE_URL` environment variable.

5. **SQLAlchemy and Flask-Migrate Setup**: We initialize SQLAlchemy and Flask-Migrate with our Flask app. This sets up our ORM and migration capabilities.

6. **User Model**: We define a `User` model that represents the structure of our `user` table in the database. It includes:

   - An `id` field as the primary key
   - A `name` field that's required and has a maximum length of 100 characters
   - An `email` field that's required, unique, and has a maximum length of 120 characters
   - A `__repr__` method that provides a string representation of the User object

7. **Application Run**: Finally, we include a conditional to run the application in debug mode if the script is executed directly.

This setup provides a foundation for building a Flask application with database integration and migration capabilities. The `User` model can be expanded or additional models can be added as the application grows.

## Initializing Migrations

To start using Flask-Migrate, you need to initialize it in your project. Run the following command in your terminal:

```bash
flask db init
```

This creates a `migrations` directory in your project that will store migration scripts. It also generates a `migrations/alembic.ini` file that contains the configuration for Alembic, the migration engine used by Flask-Migrate.

Make sure to add the `migrations` directory to your Git repository so that you can track changes to your database schema over time.

## Creating the Initial Migration

Now, let's create our first migration to set up the initial database schema. Run the following command:

```bash
flask db migrate -m "Initial migration"
```

This command generates a new migration script in the `migrations/versions` directory and the `-m` flag allows you to provide a message describing the migration. The message is useful for tracking changes and understanding the purpose of each migration.

Open the generated file and review the changes. It should contain the SQL to create the `user` table based on our `User` model. This is possible because Flask-Migrate uses SQLAlchemy's reflection capabilities to generate the migration script based on the model definitions instead of writing raw SQL or manually creating the schema.

It is a good practice to review the generated migration script before applying it to your database. This way, you can ensure that the changes are correct and will not cause any issues as in some cases Alembic might not generate the migration script as expected and you might need to modify it manually, so remember to always review the generated migration scripts.

## Applying the Migration

After reviewing the migration script, to apply the migration and create the table in your Neon Postgres database, run:

```bash
flask db upgrade
```

This command executes the migration script and creates the `user` table in your database.

The output that you should see after running the `flask db upgrade` command should look something like this:

```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 1e48b6167844, Initial migration
```

This indicates that the migration was successful and the `user` table was created in your database.

## Making Schema Changes

Now that the initial migration is complete, let's make some changes to the schema. We'll add a new field to the `User` model and create a new migration to apply the changes.

Let's modify our `User` model to add a new field. Update the `User` class in `app.py`:

```python {5}
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer)

    def __repr__(self):
        return f'<User {self.name}>'
```

With the new `age` field added to the `User` model, we need to create a new migration to apply this change.

```bash
flask db migrate -m "Add age to User model"
```

Alembic will generate a new migration script that includes the necessary SQL to add the `age` column to the `user` table.

Review the generated migration script, then apply it:

```bash
flask db upgrade
```

The `age` column should now be added to the `user` table in your database. If you want to revert the changes, you can run `flask db downgrade` to roll back the last migration.

If you were to check the `user` table in your database, you should see that the `age` column has been added:

```sql
SELECT * FROM user;
```

This will return the data from the `user` table including the new `age` column.

## Renaming Columns

As your application evolves, you may need to rename columns in your database schema.

Such changes need to be handled carefully to avoid data loss or corruption. You also need to make sure that the application code is updated to reflect the new column names otherwise it might not be backwards compatible leading to issues.

To rename a column, you'll need to use SQLAlchemy's `alter_column` operation. Let's rename the `age` column to `years_old`:

1. Create a new migration:

```bash
flask db migrate -m "Rename age to years_old"
```

2. As the `alter_column` operation is not directly supported by Flask-Migrate, you'll need to modify the generated migration script manually.

Open the generated migration file and modify it:

```python
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.alter_column('user', 'age', new_column_name='years_old')

def downgrade():
    op.alter_column('user', 'years_old', new_column_name='age')
```

3. Apply the migration:

```bash
flask db upgrade
```

The `age` column should now be renamed to `years_old` in your database. Remember to be cautious when renaming columns, as it can have implications on your application code and queries.

## Working with Indexes

Adding indexes can improve query performance. To learn more about indexing, refer to the [Neon documentation](/docs/postgres/indexes).

Let's add an index to the `email` column.

Open the `User` model in `app.py` and add the `index=True` parameter to the `email` column:

```python {6}
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)

    def __repr__(self):
        return f'<User {self.name}>'
```

Create a new migration with a descriptive migration message:

```bash
flask db migrate -m "Add index to email column"
```

Review the generated migration script, it should contain an `op.create_index` operation for the `email` column:

```python {4}
def upgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint('user_email_key', type_='unique')
        batch_op.create_index(batch_op.f('ix_user_email'), ['email'], unique=True)
```

Finally, apply the newly created migration:

```bash
flask db upgrade
```

The `email` column should now have an index in your database, which can improve query performance when searching by email.

## Migrations in CI/CD Pipeline

Automating database migrations in your Continuous Integration pipeline can help with catching potential issues early.

By using Neon's branching feature, you can test your migrations safely without affecting your production database while ensuring that your application code and database schema changes are always in sync.

Here's an example of how you can automate migration testing using GitHub Actions and Neon branches:

```yaml
name: Test Migrations

on:
  pull_request:
    branches: [main]

jobs:
  test-migrations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.x'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Create Neon Branch
        uses: neondatabase/create-branch-action@v5
        id: create-branch
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          branch_name: migrate-${{ github.sha }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Run migrations on Neon branch
        env:
          DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
        run: flask db upgrade

      - name: Run tests
        env:
          DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
        run: pytest

      - name: Clean up Neon branch
        if: always()
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          branch: ${{ steps.create-branch.outputs.branch_id }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

This workflow does the following:

1. Fetches the latest code from the pull request.

2. Installs the specified Python version.

3. Installs the required Python packages listed in `requirements.txt`.

4. Uses the [official Neon GitHub action](/docs/guides/branching-github-actions) to create a new branch in your Neon project. This allows you to test migrations in isolation.

5. Applies any pending database migrations to the newly created Neon branch.

6. Executes your test suite against the updated database schema in the Neon branch.

7. Deletes the temporary Neon branch after the workflow completes, regardless of success or failure to make sure that no resources are left behind.

Using Neon's branching feature in your CI pipeline offers several advantages:

- You can test your migrations and schema changes in a separate branch without affecting your production or staging databases.
- Catch migration issues before they reach your main branch or production environment.
- Ensures that your database schema changes are always tested alongside your application code changes.
- Allows you to run your full test suite against the updated schema without risk to existing data.

## Conclusion

Managing database migrations is an important part of maintaining and evolving your Flask application. With Flask-Migrate and Neon Postgres, you have powerful tools at your disposal to handle schema changes efficiently and safely. Remember to always test your migrations thoroughly and have a solid backup strategy in place.

One thing that you should get in the habit of doing is to always review the generated migration scripts before applying them to your database. This way you can ensure that the changes that are about to be applied are correct and that they will not cause any issues. As well as that, you should use meaningful names for your migrations so that you can easily identify what each migration does.

## Additional Resources

- [Flask-Migrate Documentation](https://flask-migrate.readthedocs.io/en/latest/)
- [SQLAlchemy Migrations](https://docs.sqlalchemy.org/en/20/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/en/latest/)
- [Neon Documentation](/docs)
