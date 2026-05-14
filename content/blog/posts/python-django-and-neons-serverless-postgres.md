---
title: Using Python & Django with Neon’s Serverless Postgres
description: Learn how to build a Django application that uses Neon’s serverless Postgres.
excerpt: >-
  With Neon, creating development, preview, QA, and isolated tenant environments
  takes seconds, and they only accrue compute fees when they’re active. Both
  serverless and long-lived Python applications can reliably benefit from Neon’s
  serverless Postgres. High-level web application...
date: '2024-02-01T18:36:18'
updatedOn: '2024-03-27T11:36:23'
category: community
categories:
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Using Python & Django with Neon’s Serverless Postgres - Neon
  description: >-
    Learn how to build a Django application that uses Neon’s serverless
    Postgres.
  keywords: []
  noindex: false
  ogTitle: Using Python & Django with Neon’s Serverless Postgres - Neon
  ogDescription: >-
    Learn how to build a Django application that uses Neon’s serverless
    Postgres.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/neon-django-neon-1-1024x576-13e0fe55.jpg)

With Neon, creating development, preview, QA, and isolated tenant environments takes seconds, and they only accrue compute fees when they’re active. Both serverless and long-lived Python applications can reliably benefit from Neon’s serverless Postgres.

High-level web application frameworks are usually deployed as long-lived servers that scale horizontally when your application is under load. [Django](https://www.djangoproject.com/) is a perfect example of a high-level web application framework since it includes an Object-Relational Mapper (ORM), administrative interface, caching, an MVC-like pattern for structuring your application, and even generates an API out-of-the-box based on your data models.

This post will walk you through creating a Django application, connecting it to a Neon Postgres database, querying data, rendering HTML, and offer advice on configuring the Django application to get the most from your Postgres database. A complete version of the application is available in the [evanshortiss/django-neon-quickstart](https://github.com/evanshortiss/django-neon-quickstart) repository on GitHub.

## Configure a Python Development Environment

It used to be quite difficult to manage different versions of Python, so much so that it was even the subject of a popular [XKCD comic](https://xkcd.com/1987/).

![Image](https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/pythonenvironment-c0747244.png)

Luckily, [pyenv](https://github.com/pyenv/pyenv) and [venv](https://docs.python.org/3/library/venv.html) were created to solve this problem. These tools have different responsibilities:

1. pyenv – Install and switch between different versions of Python.
2. venv – Create virtual environments to avoid dependency conflicts. These environments can use the Python binaries installed using pyenv.

Follow the [pyenv installation instructions](https://github.com/pyenv/pyenv?tab=readme-ov-file#installation) for your OS, then run the following commands to install and use Python 3.12.1:

```bash
# This will list existing python versions on your system
pyenv versions

# Install Python 3.12.1 and set it as the version for this terminal session
pyenv install 3.12.1
pyenv local 3.12.1

# Confirm the python version in use is 3.12.1
python --version
```

Use venv in the same shell to create a virtual environment that uses Python 3.12, and use the source command to activate it:

```bash
# This path is an example. You can store the virtual environment wherever you want
python -m venv $HOME/.venv/neon-and-django-env

# Activate the virtual environment in the current shell. Note that fish, powershell,
# and Windows users must use the activate script for their specific shell per
# https://docs.python.org/3/library/venv.html#how-venvs-work
source $HOME/.venv/neon-and-django-env/bin/activate	
```

That’s it! You’ve installed Python 3.12.1 and created a virtual environment to follow along with this guide. Ensure you activate your virtual environment using the appropriate activation script described in the [venv documentation](https://docs.python.org/3/library/venv.html#how-venvs-work) if you start a new terminal session, e.g. if you switch to the built-in terminal in your code editor, run `source $HOME/.venv/neon-and-django-env/bin/activate` to use your virtual Python environment.

## Create a Django Project

To get started, install Django using the [pip package manager](https://docs.python.org/3/installing/index.html), and create a Django project using the django-admin command now available in your environment.

```bash
pip install Django 

python -m django --version

django-admin startproject django_and_neon
```

Enter the `cd django_and_neon` command to change directory into your new Django project. Run `python manage.py runserver 8000` to start your Django application in development mode. Visiting [https://127.0.0.1:8000/](https://127.0.0.1:8000/) should display the Django welcome page.

![Image](https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/screenshot-2024-01-24-at-103821-1024x678-189c24c5.png)

You might have noticed that an `db.sqlite3` file was created inside the project directory. Django uses [SQLite](https://www.sqlite.org/index.html) as the default database provider, as can be seen in the `settings.py` file in your project. This allows you to quickly start using Django without worrying about database infrastructure, but since Neon makes it easy, you’ll connect your Django application to a Postgres database.

## Configure Django to use Neon’s Serverless Postgres

Visit the [Neon Console](https://console.neon.tech/), sign up, and create your first project by following the prompts in the UI. You can use an existing project or create another if you’ve already used Neon.

![Image](https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/createfirstproject-1024x576-e8c8eccb.jpeg)

Visit the project **Dashboard** and select the _Parameters only_ option from the **Connection Details** panel.

![Image](https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/screenshot-2024-01-24-at-111958-1024x571-24a80732.png)

Create a file named `.env` in the root of your Django project, and paste the connection parameters into it. The file should resemble this example:

```bash
# filename: .env

PGHOST='hostname.region.aws.neon.tech'
PGDATABASE='neondb'
PGUSER='yourusername'
PGPASSWORD='yoursecurepassword'
```

Before proceeding, you must add the `python-dotenv` and `psycopg` dependencies to your Django project. These are used to load your environment variables and connect to Postgres. You should also generate a `requirements.txt` file to track your project’s dependencies and their corresponding versions. Run the following commands to install the dependencies and generate the `requirements.txt` file:

```bash
pip install python-dotenv "psycopg[binary]"
pip freeze > requirements.txt
```

Update the `DATABASES` variable in `settings.py` with this configuration to connect to Postgres using values defined in the environment:

```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': getenv('PGDATABASE'),
        'USER': getenv('PGUSER'),
        'PASSWORD': getenv('PGPASSWORD'),
        'HOST': getenv('PGHOST'),
        'PORT': getenv('PGPORT', 5432),
         'OPTIONS': {
             'sslmode': 'require',
        }
    }
}
```

You’ll also need to add the following lines of code to the top of the `settings.py` file to load your environment variables and import the `getenv` function:

```bash
from os import getenv
from dotenv import load_dotenv

# Load variables from a .env file, if present
load_dotenv()
```

That’s it! Your Django application can now connect to Neon’s serverless Postgres. Of course, you’ll need to write some custom code to define models and fetch data from your database. Let’s take a look at how you can do that next.

## Manage Django’s Models and Database Schemas

At this point, you’ve generated a Django project and configured it to connect to your Neon Postgres database. You’ll need to create an [application](https://docs.djangoproject.com/en/5.0/ref/applications/) to make use of this configuration.

Start by creating an application named elements:

```bash
python manage.py startapp elements
```

The `startapp` command creates a directory named `elements` containing files to define your application’s models, views, and other features. For now, replace the contents of `models.py` with the following code that defines an Element model with a name, symbol, and [atomic number](https://en.wikipedia.org/wiki/Atomic_number):

```python
from django.db import models

class Element(models.Model):
    name = models. TextField()
    symbol = models. CharField(max_length=3)
    atomic_number = models. IntegerField()
```

Add your new application to the `INSTALLED_APPS` array in `settings.py`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'elements'
]
```

Lastly, prepare and apply [database migrations](https://docs.djangoproject.com/en/5.0/topics/migrations/) using the following commands:

```bash
python manage.py makemigrations
python manage.py migrate
```

This will result in several tables being created in your Postgres database, including an `elements_element` table to store rows of your Element model. The other tables are used by Django features, such as the [session middleware](https://docs.djangoproject.com/en/5.0/topics/http/sessions/).

![Image](https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/screenshot-2024-01-24-at-115502-1024x572-389a6c85.png)

Use the [SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor) in the Neon Console to insert elements into the `elements_element` table using the following INSERT statement:

```sql
INSERT INTO elements_element (name, symbol, atomic_number)
VALUES
('Hydrogen', 'H', 1),
('Helium', 'He', 2),
('Lithium', 'Li', 3),
('Beryllium', 'Be', 4),
('Boron', 'B', 5),
('Carbon', 'C', 6);
```

The next section will demonstrate how to query these rows and render them as a web page using Django.

## Render Data using Views and Templates

Create a file at `elements/templates/elements_list.html`, and add the following content to it:

```jsx
<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neon and Django</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-[#1A1A1A] p-10">
    <main class="flex items-center justify-center">
      <ul class="grid grid-cols-2 md:grid-cols-6 gap-5">
        {% for element in elements %}
          <li class="relative flex flex-col text-center p-5 rounded-md bg-[#00E699] transition-colors hover:bg-red-500 text-[black]">
            <p class="absolute top-2 left-2 text-sm">
              {{ element.atomic_number }}
            </p>
            <h2 class="text-2xl font-medium">{{ element.symbol }}</h2>
            <p class="text-base">{{ element.name }}</p>
          </li>
          {% endfor %}
      </ul>
    </main>
  </body>
</html>
```

Replace the contents of `elements/views.py` with the following code to fetch elements from the database and render them:

```python
from django.shortcuts import render
from .models import Element

def elements_list(request):
    elements = Element.objects.all() 
    return render(request, 'elements_list.html', {'elements': elements})
```

Configure `urls.py` to serve your application from the root (`/`) path:

```python
from elements.views import elements_list

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', elements_list, name='elements_list')
]
```

Start your application in development mode using `python manage.py runserver` and visit [https://127.0.0.1:8000/](https://127.0.0.1:8000/) to view a list of elements.

![Image](https://cdn.neonapi.io/public/images/pages/blog/python-django-and-neons-serverless-postgres/screenshot-2024-01-24-at-123911-1024x678-e52acb99.png)

## Application Deployment and Scaling using Gunicorn

The built-in Django `runserver` command is suitable for local development. However, for a production deployment, you would use [Gunicorn](https://gunicorn.org/) or [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) to scale your Django application across multiple CPU cores.<br />This post assumes you’ll use Gunicorn. Install the `gunicorn` dependency and update your `requirements.txt` using these commands from the root of your project:

```bash
pip install gunicorn
pip freeze > requirements.txt
```

Now you can use the `gunicorn` binary to start multiple copies of your Django application, known as “workers”. The [Gunicorn documentation recommends](https://docs.gunicorn.org/en/latest/design.html#how-many-workers) using the formula `(2 x $NUM_CORES) + 1` as a general guideline to determine the worker count. For example, you’d use the following command to start your Django application on a machine with 4 CPU cores:

```bash
gunicorn --bind 0.0.0.0:8000 --workers 9 django_neon.wsgi
```

## Benchmarks and Optimisations

Using Apache Bench (`ab -n 100 -c 20 $URL`) to benchmark the prior deployment configuration produces the following results:

| Requests per Second | Average Latency | P99 Response Time |
| ------------------- | --------------- | ----------------- |
| 50                  | 340ms           | 487ms             |

That result is a little underwhelming, given that the application is scaled up to 9 workers. What can be done to improve this? We recently discussed the importance of optimizations such as [persistent database connections and pooling](https://neon.tech/blog/using-neons-auto-suspend-with-long-running-applications) to get the best performance from an I/O-bound application. Django’s database configuration supports a [CONN_MAX_AGE property](https://docs.djangoproject.com/en/5.0/ref/settings/#std-setting-CONN_MAX_AGE) to enable persistent connections.

Add the following code to the `default` section of the `DATABASES` variable in `settings.py` to enable persistent connections:

```python
# Enable persistent connections, but close them if they're
# idle for more than 30 seconds
'CONN_MAX_AGE': int(getenv('CONN_MAX_AGE', 30)),
```

Making this change had a dramatic effect on the application’s performance in our testing environment and resulted in an 8x increase in throughput:

| Requests per Second | Average Latency | P99 Response Time |
| ------------------- | --------------- | ----------------- |
| 407                 | 41ms            | 57ms              |

_Note: Results will depend on hardware resources, connection quality, proximity to your Neon Postgres database region, assigned Neon compute resources, and other factors specific to your workload._

## Conclusion

We [previously discussed](https://neon.tech/blog/what-is-a-serverless-database) that while serverless functions may not fit all application architectures, serverless databases that support autoscaling and auto-suspend can significantly improve operational efficiency for all organizations and development teams. Neon’s serverless Postgres is compatible with popular web frameworks like Django, and now you know that connecting your Django application to Neon is straightforward and seamless. If you’re looking for a Postgres database for your Django application, [sign up and try Neon](https://console.neon.tech/signup) for free. Join us in our [Discord server](https://neon.tech/discord) to share your experiences, suggestions, and challenges.
