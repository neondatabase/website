---
title: Schema migration with Neon Postgres and SQLAlchemy
subtitle: Manage database migrations in your Python project with SQLAlchemy and Alembic
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.065Z'
---

[SQLAlchemy](https://www.sqlalchemy.org/) is a popular SQL toolkit and Object-Relational Mapping (ORM) library for Python. SQLAlchemy provides a powerful way to interact with databases and manage database schema changes using [Alembic](https://alembic.sqlalchemy.org/), a lightweight database migration tool.

This guide demonstrates how to use SQLAlchemy/Alembic to manage schema migrations for a Neon Postgres database. We create a simple API using the [FastAPI](https://fastapi.tiangolo.com/) web framework and define database models using SQLAlchemy. We then generate and run migrations to manage schema changes over time.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- [Python](https://www.python.org/) installed on your local machine. We recommend using a newer version of Python, 3.8 or higher.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select a project or click the **New Project** button to create a new one.

### Retrieve your Neon database connection string

Navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

<Admonition type="note">
Neon supports both direct and pooled database connection strings, which can be copied from the **Connection Details** widget on your Neon Project Dashboard. A pooled connection string connects your application to the database via a PgBouncer connection pool, allowing for a higher number of concurrent connections. However, using a pooled connection string for migrations can be prone to errors. For this reason, we recommend using a direct (non-pooled) connection when performing migrations. For more information about direct and pooled connections, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## Setting up the Web application

### Set up the Python environment

To manage our project dependencies, we create a new Python virtual environment. Run the following commands in your terminal to set it up.

```bash
python -m venv myenv
```

Activate the virtual environment by running the following command:

```bash
# On macOS and Linux
source myenv/bin/activate

# On Windows
myenv\Scripts\activate
```

With the virtual environment activated, we can create a new directory for our FastAPI project and install the required packages:

```bash
mkdir guide-neon-sqlalchemy && cd guide-neon-sqlalchemy
pip install sqlalchemy alembic "psycopg2-binary"
pip install fastapi uvicorn python-dotenv
pip freeze > requirements.txt
```

We installed SQLAlchemy, Alembic, and the `psycopg2-binary` package to connect to the Neon Postgres database. We the installed the `FastAPI` package to create the API endpoints and `uvicorn` as the web server. We then saved the installed packages to a `requirements.txt` file so the project can be easily recreated in another environment.

### Set up the Database configuration

Create a `.env` file in the project root directory and add the `DATABASE_URL` environment variable to it. Use the connection string that you obtained from the Neon Console earlier:

```bash
# .env
DATABASE_URL=NEON_POSTGRES_CONNECTION_STRING
```

We create an `app` directory at the project root to store the database models and configuration files.

```bash
mkdir app
touch guide-neon-sqlalchemy/app/__init__.py
```

Next, create a new file named `database.py` in the `app` subdirectory and add the following code:

```python
# app/database.py

import os

import dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

dotenv.load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

This code sets up the database connection using SQLAlchemy. It reads the `DATABASE_URL` environment variable, creates a database engine, and defines a `SessionLocal` class for database sessions. The `Base` class is used as a base class for defining database models.

## Defining data models and running migrations

### Specify the data model

Create a new file named `models.py` in the `app` subdirectory and define the database models for your application:

```python
# app/models.py

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    bio = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    books = relationship("Book", back_populates="author")

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    author_id = Column(Integer, ForeignKey("authors.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    author = relationship("Author", back_populates="books")
```

This code defines two models: `Author` and `Book`. The `Author` model represents an author with fields for `name`, `bio`, and a `created_at` timestamp. The `Book` model represents a book with fields for `title`, `author` (as a foreign key to the `Author` model), and a `created_at` timestamp. The `relationship` function is used to define the one-to-many relationship between `Author` and `Book`.

### Initialize Alembic

To initialize Alembic for managing database migrations, run the following command in your terminal:

```bash
alembic init alembic
```

This command creates a new directory named `alembic` with the necessary files for managing migrations. Open the `env.py` file in the `alembic` directory and update the `target_metadata` variable to include the models defined in the `models.py` file:

```python
# alembic/env.py

from app.models import Base

target_metadata = Base.metadata
```

We update the `alembic/env.py` file again to load the database URL from the `.env` file at project root and set it as the `sqlalchemy.url` configuration option.

```python
# alembic/env.py

import dotenv
import os

dotenv.load_dotenv()

config.set_main_option('sqlalchemy.url', os.getenv('DATABASE_URL', ""))
```

### Generate the initial migration

To generate the initial migration based on the defined models, run the following command:

```bash
alembic revision --autogenerate -m "init-setup"
```

This command detects the `Author` and `Book` models and generates a new migration file in the `alembic/versions` directory.

### Apply the migration

To apply the migration and create the corresponding tables in the Neon Postgres database, run the following command:

```bash
alembic upgrade head
```

This command executes the migration file and creates the necessary tables in the database.

### Seed the database

To seed the database with some initial data, create a new file named `seed.py` in the project root and add the following code:

```python
# seed.py

from database import SessionLocal
from models import Author, Book

def seed_data():
    db = SessionLocal()

    # Create authors
    authors = [
        Author(
            name="J.R.R. Tolkien",
            bio="The creator of Middle-earth and author of The Lord of the Rings."
        ),
        Author(
            name="George R.R. Martin",
            bio="The author of the epic fantasy series A Song of Ice and Fire."
        ),
        Author(
            name="J.K. Rowling",
            bio="The creator of the Harry Potter series."
        ),
    ]
    db.add_all(authors)
    db.commit()

    # Create books
    books = [
        Book(title="The Fellowship of the Ring", author=authors[0]),
        Book(title="The Two Towers", author=authors[0]),
        Book(title="The Return of the King", author=authors[0]),
        Book(title="A Game of Thrones", author=authors[1]),
        Book(title="A Clash of Kings", author=authors[1]),
        Book(title="Harry Potter and the Philosopher's Stone", author=authors[2]),
        Book(title="Harry Potter and the Chamber of Secrets", author=authors[2]),
    ]
    db.add_all(books)
    db.commit()

    print("Data seeded successfully.")

if __name__ == "__main__":
    seed_data()
```

Now, run the `seed.py` script to seed the database with the initial data:

```bash
python seed.py
```

## Implement the web application

### Create API endpoints

Create a file named `main.py` in the project root directory and define the FastAPI application with endpoints for interacting with authors and books:

```python
# main.py

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import uvicorn

from app.models import Author, Book, Base
from app.database import SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/authors/")
def read_authors(db: Session = Depends(get_db)):
    authors = db.query(Author).all()
    return authors


@app.get("/books/{author_id}")
def read_books(author_id: int, db: Session = Depends(get_db)):
    books = db.query(Book).filter(Book.author_id == author_id).all()
    return books

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

This code defines endpoints for creating and retrieving authors and books. It uses SQLAlchemy's `Session` to interact with the database and Pydantic models (`schemas`) for request and response data validation and serialization.

### Run the FastAPI server

To start the FastAPI server using `uvicorn` and test the application, run the following command:

```bash
python main.py
```

Now, you can navigate to `http://localhost:8000/authors` in your browser to view the list of authors. To view the books by a specific author, navigate to `http://localhost:8000/books/{author_id}` where `{author_id}` is the ID of the author.

## Applying schema changes

Let's demonstrate how to handle schema changes by adding a new field `country` to the `Author` model, to store the author's country of origin.

### Update the data model

Open the `models.py` file and add a new field to the `Author` model:

```python
# models.py
class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    bio = Column(Text)
    country = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    books = relationship("Book", back_populates="author")
```

### Generate and run the migration

To generate a new migration file for the schema change, run the following command:

```bash
alembic revision --autogenerate -m "add-country-to-author"
```

This command detects the updated `Author` model and generates a new migration file to add the new field to the corresponding table in the database.

Now, to apply the migration, run the following command:

```bash
alembic upgrade head
```

### Test the schema change

Restart the FastAPI development server.

```bash
python main.py
```

Navigate to `http://localhost:8000/authors` in your browser to view the list of authors. You should see the new `country` field included in each author's record, reflecting the schema change.

## Conclusion

In this guide, we demonstrated how to set up a FastAPI project with `Neon` Postgres, define database models using SQLAlchemy, generate migrations using Alembic, and run them. Alembic makes it easy to interact with the database and manage schema evolution over time.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-sqlalchemy" description="Run migrations in a Neon-SQLAlchemy project" icon="github">Migrations with Neon and SQLAlchemy</a>
</DetailIconCards>

## Resources

For more information on the tools and concepts used in this guide, refer to the following resources:

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Neon Postgres](/docs/introduction)

<NeedHelp/>
