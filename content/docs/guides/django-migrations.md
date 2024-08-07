---
title: Schema migration with Neon Postgres and Django
subtitle: Set up Neon Postgres and run migrations for your Django project
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.388Z'
---

[Django](https://www.djangoproject.com/) is a high-level Python framework to make database-driven web applications. It provides an ORM (Object-Relational Mapping) layer that abstracts database operations, making it easy to interact with databases using Python code. Django also includes a powerful migration system that allows you to define and manage database schema changes over time.

This guide demonstrates how to use Django with a Neon Postgres database. We'll create a simple Django application and walk through the process of setting up the database, defining models, and generating and running migrations to manage schema changes.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- [Python](https://www.python.org/) installed on your local machine. We recommend using a newer version of Python, 3.8 or higher.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select a project or click the `New Project` button to create a new one.

### Retrieve your Neon database connection string

On your Neon project dashboard, navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

## Setting up the Django project

### Set up the Python environment

To manage our Django project dependencies, we create a new Python virtual environment. Run the following commands in your terminal to set it up.

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

With the virtual environment activated, we can create a new directory for our Django project and install the required packages:

```bash
mkdir guide-neon-django && cd guide-neon-django

pip install Django "psycopg2-binary"
pip install python-dotenv dj-database-url
pip freeze > requirements.txt
```

We installed Django and the `psycopg2-binary` package to connect to the Neon Postgres database. We also added the `python-dotenv` to read environment variables easily, and the `dj-database-url` package to parse the Neon connection string into Django settings. We also saved the installed packages to a `requirements.txt` file so the project can be easily recreated in another environment.

### Create a new Django project

Run the following command to create a new Django project in the current directory:

```bash
django-admin startproject guide_neon_django .
```

This command creates a new Django project named `guide_neon_django` in the current directory.

### Set up the Database configuration

Create a `.env` file in the project root directory and add the `DATABASE_URL` environment variable to it. Use the connection string that you obtained from the Neon Console earlier.

```bash
# .env
DATABASE_URL=NEON_POSTGRES_CONNECTION_STRING
```

For Django to read the environment variables from the `.env` file, open the `settings.py` file located in the `guide_neon_django` directory and add the following code, updating the `DATABASES` setting:

```python
# settings.py

import os
import dotenv
import dj_database_url

dotenv.load_dotenv("../.env")

DATABASES = {
    "default": dj_database_url.parse(
        url=os.getenv("DATABASE_URL", ""),
        conn_max_age=600, conn_health_checks=True
    )
}
```

### Create a new Django app

Inside your project directory, run the following command to create a new Django app:

```bash
python manage.py startapp catalog
```

This command creates a new app named `catalog` inside the Django project.

## Defining data models and running migrations

### Specify the data model

Now, open the `models.py` file in your `catalog` app directory and define the database models for your application:

```python
# catalog/models.py

from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

This code defines two models: `Author` and `Book`. The `Author` model represents an author with fields for `name`, `bio`, and a `created_at` timestamp. The `Book` model represents a book with fields for `title`, `author` (as a foreign key to the `Author` model), and a `created_at` timestamp. Django automatically creates an `id` field for each model as the primary key.

### Generate migration files

We first add the new application `catalog` to the list of installed apps for the Django project. Open the `settings.py` file in the `guide_neon_django` directory and add the `catalog` app to the `INSTALLED_APPS` setting:

```python
# settings.py

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "catalog"
]
```

To generate migration files based on the defined models, run the following command:

```bash
python manage.py makemigrations
```

This command detects the new `Author` and `Book` models that were added and generates migration files in the `catalog/migrations` directory.

### Apply the migration

Now, to apply the migration and create the corresponding tables in the Neon Postgres database, run the following command:

```bash
python manage.py migrate
```

This command executes the migration files and creates the necessary tables in the database. Note that Django creates multiple other tables, such as `django_migrations` and `auth_user` for its internal usage.

### Seed the database

To populate the database with some initial data, we can create a custom management command for our app. Create a new file named `populate.py` in the `catalog/management/commands` directory.

```bash
mkdir -p catalog/management/commands
touch catalog/management/commands/populate.py
```

Now, add the following code to the `populate.py` file to create some authors and books:

```python
from django.core.management.base import BaseCommand
from catalog.models import Author, Book

class Command(BaseCommand):
    help = 'Seeds the database with sample authors and books'

    def handle(self, *args, **options):
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
        Author.objects.bulk_create(authors)

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
        Book.objects.bulk_create(books)

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database.'))
```

Now, run the custom management command in your terminal and seed the database:

```bash
python manage.py populate
```

## Implement the application

### Create views to display data

We can now create views to display the authors and books in our application. Create a file `views.py` in the `catalog` app directory and add the following code:

```python
# catalog/views.py

from django.http import JsonResponse
from django.core import serializers
from .models import Author, Book

def list_authors(request):
    authors = Author.objects.all()
    data = [serializers.serialize('json', authors)]
    return JsonResponse(data, safe=False)

def list_books_by_author(request, author_id):
    books = Book.objects.filter(author_id=author_id)
    data = [serializers.serialize('json', books)]
    return JsonResponse(data, safe=False)
```

We defined two views: `list_authors` to list all authors and `list_books_by_author` to list books by a specific author. The views return JSON responses with the serialized data.

### Define URLs for the views

Next, create a file `urls.py` in the `catalog` app directory and add the following code:

```python
# catalog/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('authors/', views.list_authors, name='list_authors'),
    path('books/<int:author_id>/', views.list_books_by_author, name='list_books_by_author'),
]
```

The URLs are mapped to the views defined previously using the Django URL dispatcher.

### Include the app URLs in the project

Finally, include the `catalog` app URLs in the project's main `urls.py` file, by updating the urlpatterns list:

```python
# guide_neon_django/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('catalog/', include('catalog.urls')),
]
```

### Run the Django development server

To start the Django development server and test the application, run the following command:

```bash
python manage.py runserver
```

Navigate to the url `http://localhost:8000/catalog/authors/` in your browser to view the list of authors. You can also view the books by a specific author by visiting `http://localhost:8000/catalog/books/<author_id>/`.

## Applying schema changes

We will demonstrate how to handle schema changes by adding a new field `country` to the `Author` model, to store the author's country of origin.

### Update the data model

Open the `models.py` file in your `catalog` app directory and add a new field to the `Author` model:

```python
# catalog/models.py

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    country = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

### Generate and run the migration

To generate a new migration file for the schema change, run the following command:

```bash
python manage.py makemigrations
```

This command detects the updated `Author` models and generates a new migration file to add the new field to the corresponding table in the database. Now, to apply the migration, run the following command:

```bash
python manage.py migrate
```

### Test the schema change

Restart the Django development server.

```bash
python manage.py runserver
```

Navigate to the url `http://localhost:8000/catalog/authors` to view the list of authors. You should see the new `country` field included and set to empty for each author entry, reflecting the schema change.

## Conclusion

In this guide, we demonstrated how to set up a Django project with Neon Postgres, define database models, and generate migrations and run them. Django's ORM and migration system make it easy to interact with the database and manage schema evolution over time.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-django" description="Run migrations in a Neon-Django project" icon="github">Migrations with Neon and Django</a>
</DetailIconCards>

## Resources

For more information on the tools and concepts used in this guide, refer to the following resources:

- [Django Documentation](https://docs.djangoproject.com/)
- [Neon Postgres](https://neon.tech/docs/introduction)

<NeedHelp/>
