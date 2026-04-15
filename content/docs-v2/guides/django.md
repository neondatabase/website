---
title: Connect a Django application to Neon
subtitle: Set up a Neon project in seconds and connect from a Django application
summary: >-
  How to connect a Django application to a Neon project by creating a project in
  the Neon Console and configuring the database connection settings in the
  Django `settings.py` file.
enableTableOfContents: true
redirectFrom:
  - /docs/integrations/
  - /docs/quickstart/django/
  - /docs/cloud/integrations/django/
updatedOn: '2026-02-06T22:07:32.948Z'
---

<CopyPrompt src="/prompts/django-prompt.md" 
description="Pre-built prompt for connecting Django applications to Neon"/>

To connect to Neon from a Django application:

## Prerequisites

- A [Neon account and project](/docs/get-started-with-neon/signing-up) with connection parameters ready
- Python 3.8+ installed
- An existing Django project (or create one with `django-admin startproject myproject`)

<Admonition type="important">
Always use a Python virtual environment. Do not install packages globally. If you do not have one set up, create and activate it before proceeding:

```bash
python3 -m venv venv
source venv/bin/activate   # macOS / Linux
# venv\Scripts\activate    # Windows
```
</Admonition>

## Install the PostgreSQL driver

Install `psycopg` (the modern psycopg3 driver) and `python-dotenv` inside your virtual environment:

```bash
pip install "psycopg[binary]" python-dotenv
```

<Admonition type="note">
The docs examples below use `psycopg` (v3). If your project uses the older `psycopg2` driver, see [Connection issues](#connection-issues) for SNI compatibility requirements.
</Admonition>

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Configure Django connection settings

Connecting to Neon requires configuring database connection settings in your Django project's `settings.py` file.

<Admonition type="note">
To avoid the `endpoint ID is not specified` connection issue described [here](#connection-issues), be sure that you are using an up-to-date driver.
</Admonition>

In your Django project, navigate to the `DATABASES` section of your `settings.py` file and modify the connection details as shown:

```python
# Add these at the top of your settings.py
from os import getenv
from dotenv import load_dotenv

load_dotenv()

# Replace the DATABASES section of your settings.py with this
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
    },
    'DISABLE_SERVER_SIDE_CURSORS': True,
    'CONN_HEALTH_CHECKS': True,
  }
}
```

<Admonition type="note">
Neon places computes into an idle state and closes connections after 5 minutes of inactivity (see [Compute lifecycle](/docs/introduction/compute-lifecycle/)). To avoid connection errors, you can set the Django [CONN_MAX_AGE](https://docs.djangoproject.com/en/4.1/ref/settings/#std-setting-CONN_MAX_AGE) setting to 0 to close database connections at the end of each request so that your application does not attempt to reuse connections that were closed by Neon. From Django 4.1, you can use a higher `CONN_MAX_AGE` setting in combination with the [CONN_HEALTH_CHECKS](https://docs.djangoproject.com/en/4.1/ref/settings/#conn-health-checks) setting to enable connection reuse while preventing errors that might occur due to closed connections. For more information about these configuration options, see [Connection management](https://docs.djangoproject.com/en/4.1/ref/databases#connection-management), in the _Django documentation_.
</Admonition>

You can find all of the connection details listed above by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

For additional information about Django project settings, see [Django Settings: Databases](https://docs.djangoproject.com/en/4.0/ref/settings#databases), in the Django documentation.

## Test the connection

Create a simple view to verify the database connection is working.

1. In your project's main app directory (next to `urls.py`), create `views.py`:

   ```python
   from django.http import JsonResponse
   from django.db import connection

   def db_version(request):
       with connection.cursor() as cursor:
           cursor.execute("SELECT version();")
           version = cursor.fetchone()[0]
       return JsonResponse({'version': version})
   ```

2. Add a URL route in your project's `urls.py`:

   ```python
   from django.contrib import admin
   from django.urls import path
   from . import views

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('', views.db_version, name='db_version'),
   ]
   ```

3. Run migrations and start the server:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

4. Visit `http://localhost:8000` to see the PostgreSQL version from your Neon database.

</Steps>

## Connection issues

- Django uses the `psycopg2` driver as the default adapter for Postgres. If you have an older version of that driver, you may encounter an `Endpoint ID is not specified` error when connecting to Neon. This error occurs if the client library used by your driver does not support the Server Name Indication (SNI) mechanism in TLS, which Neon uses to route incoming connections. The `psycopg2` driver uses the `libpq` client library, which supports SNI as of v14. You can check your `psycopg2` and `libpq` versions by starting a Django shell in your Django project and running the following commands:

  ```bash
  # Start a Django shell
  python3 manage.py shell

  # Check versions
  import psycopg2
  print("psycopg2 version:", psycopg2.__version__)
  print("libpq version:", psycopg2._psycopg.libpq_version())
  ```

  The version number for `libpq` is presented in a different format, for example, version 14.1 will be shown as 140001. If your `libpq` version is less than version 14, you can either upgrade your `psycopg2` driver to get a newer `libpq` version or use one of the workarounds described in our [Connection errors](/docs/connect/connection-errors#the-endpoint-id-is-not-specified) documentation. Upgrading your `psycopg2` driver may introduce compatibility issues with your Django or Python version, so you should test your application thoroughly.

- If you encounter an `SSL SYSCALL error: EOF detected` when connecting to the database, this typically occurs because the application is trying to reuse a connection after the Neon compute has been suspended due to inactivity. To resolve this issue, try one of the following options:
  - Set your Django [`CONN_MAX_AGE`](https://docs.djangoproject.com/en/5.1/ref/settings/#conn-max-age) setting to a value less than or equal to the scale to zero setting configured for your compute. The default is 5 minutes (300 seconds).
  - Enable [`CONN_HEALTH_CHECKS`](https://docs.djangoproject.com/en/5.1/ref/settings/#conn-health-checks) by setting it to `true`. This forces a health check to verify that the connection is alive before executing a query.

  For information configuring Neon's Scale to zero setting, see [Configuring Scale to zero for Neon computes](/docs/guides/scale-to-zero-guide).

## Schema migration with Django

For schema migration with Django, see our guide:

<DetailIconCards>

<a href="/docs/guides/django-migrations" description="Schema migration with Neon Postgres and Django" icon="app-store" icon="app-store">Django Migrations</a>

</DetailIconCards>

## Django application blog post and sample application

Learn how to use Django with Neon Postgres with this blog post and the accompanying sample application.

<DetailIconCards>
<a href="/blog/python-django-and-neons-serverless-postgres" description="Learn how to build a Django application with Neon Postgres" icon="import">Blog Post: Using Django with Neon</a>

<a href="https://github.com/evanshortiss/django-neon-quickstart" description="Django with Neon Postgres" icon="github">Django sample application</a>
</DetailIconCards>

## Community resources

- [Django Project: Build a Micro eCommerce with Python, Django, Neon Postgres, Stripe, & TailwindCSS](https://youtu.be/qx9nshX9CQQ?start=1569)

<details>
<summary>**Notes for AI-assisted setup**</summary>

- Do not install packages globally. Always use a virtual environment and run commands with `venv/bin/pip` and `venv/bin/python` (or the activated equivalent).
- Use `psycopg[binary]` (psycopg v3), not the older `psycopg2`. If the project already uses `psycopg2`, check the [Connection issues](#connection-issues) section for SNI compatibility.
- Include `CONN_HEALTH_CHECKS: True` in the `DATABASES` configuration. This prevents errors from idle connections when Neon scales to zero.
- Do not hardcode credentials in `settings.py`. Use environment variables via `python-dotenv` and `os.getenv()`. For more information, see [Security overview](/docs/security/security-overview).
- The `.env` file should use individual `PG*` variables (`PGHOST`, `PGDATABASE`, etc.), not a single `DATABASE_URL`, since Django's database configuration expects separate fields.

</details>

<NeedHelp/>
