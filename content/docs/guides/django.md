---
title: Connect a Django application to Neon
subtitle: Set up a Neon project in seconds and connect from a Django application
enableTableOfContents: true
redirectFrom:
  - /docs/integrations/
  - /docs/quickstart/django/
  - /docs/cloud/integrations/django/
updatedOn: '2024-09-24T08:34:04.212Z'
---

To connect to Neon from a Django application:

1. [Create a Neon project](#create-a-neon-project)
2. [Configure Django connection settings](#configure-django-connection-settings)

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
  }
}
```

<Admonition type="note">
Neon places computes into an `Idle` state and closes connections after 5 minutes of inactivity (see [Compute lifecycle](/docs/introduction/compute-lifecycle/)). To avoid connection errors, you can set the Django [CONN_MAX_AGE](https://docs.djangoproject.com/en/4.1/ref/settings/#std-setting-CONN_MAX_AGE) setting to 0 to close database connections at the end of each request so that your application does not attempt to reuse connections that were closed by Neon. From Django 4.1, you can use a higher `CONN_MAX_AGE` setting in combination with the [CONN_HEALTH_CHECKS](https://docs.djangoproject.com/en/4.1/ref/settings/#conn-health-checks) setting to enable connection reuse while preventing errors that might occur due to closed connections. For more information about these configuration options, see [Connection management](https://docs.djangoproject.com/en/4.1/ref/databases#connection-management), in the _Django documentation_.
</Admonition>

You can find all of the connection details listed above in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

For additional information about Django project settings, see [Django Settings: Databases](https://docs.djangoproject.com/en/4.0/ref/settings#databases), in the Django documentation.

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

  - Set your Django [`CONN_MAX_AGE`](https://docs.djangoproject.com/en/5.1/ref/settings/#conn-max-age) setting to a value less than or equal to the autosuspend setting configured for your compute.
  - Enable [`CONN_HEALTH_CHECKS`](https://docs.djangoproject.com/en/5.1/ref/settings/#conn-health-checks) by setting it to `true`. This forces a health check to verify that the connection is alive before executing a query.

  For information configuring Neon's Autosuspend setting, see [Configuring Autosuspend for Neon computes](/docs/guides/auto-suspend-guide).

## Schema migration with Django

For schema migration with Django, see our guide:

<DetailIconCards>

<a href="/docs/guides/django-migrations" description="Schema migration with Neon Postgres and Django" icon="app-store" icon="app-store">Django Migrations</a>

</DetailIconCards>

## Django application blog post and sample application

Learn how to use Django with Neon Postgres with this blog post and the accompanying sample application.

<DetailIconCards>
<a href="https://neon.tech/blog/python-django-and-neons-serverless-postgres" description="Learn how to build a Django application with Neon Postgres" icon="import">Blog Post: Using Django with Neon</a>

<a href="https://github.com/evanshortiss/django-neon-quickstart" description="Django with Neon Postgres" icon="github">Django sample application</a>
</DetailIconCards>

## Community resources

- [Django Project: Build a Micro eCommerce with Python, Django, Neon Postgres, Stripe, & TailwindCSS](https://youtu.be/qx9nshX9CQQ?start=1569)

<NeedHelp/>
