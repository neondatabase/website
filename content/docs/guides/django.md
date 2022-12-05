---
title: Connect a Django application to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/integrations/
  - /docs/quickstart/django/
  - /docs/cloud/integrations/django/
---

This guide describes how to create a Neon project and connect to it from a Django application.

To connect to Neon from a Django application:

1. [Create a Neon project](#create-a-neon-project)
2. [Configure Django connection settings](#configure-django-connection-settings)

## Create a Neon project

When creating a Neon project, take note of your endpoint hostname, user name, and password. This information is required when defining connection settings in your Django project.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

For additional information about creating projects, see [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).

## Configure Django connection settings

Connecting to Neon requires configuring database connection settings in your Django project's `settings.py` file.

In your Django project, navigate to the `DATABASES` section of your `settings.py` file and modify the connection details as shown:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '<dbname>',
        'USER': '<user>',
        'PASSWORD': '<password>',
        'HOST': '<endpoint_hostname>',
        'PORT': '5432',
    }
}
```

where:

- `<dbname>` is the database you are connecting to. The default Neon database is `neondb`.
- `<user>` is the database user, which is found on the Neon **Dashboard**, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a project.
- `<endpoint_hostname>` is the hostname of the branch endpoint, which is found on the Neon **Dashboard**, under **Connection Settings**.

For additional information about Django project settings, see [Django Settings: Databases](https://docs.djangoproject.com/en/4.0/ref/settings/#databases), in the Django documentation.

<Admonition type="note">
Running Django tests is currently not supported. The Django test runner must be able to create a database for tests, which is not yet supported by Neon.
</Admonition>
