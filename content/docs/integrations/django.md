---
title: Run a Django App
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/django/
  - /docs/cloud/integrations/
---

This topic describes how to create a Neon project and connect to it from a Django project.

To connect to Neon from a Django project:

1. [Create a Neon project](#create-a-neon-project)
2. [Configure Django project connection settings](#configure-django-project-connection-settings)

## Create a Neon project

When creating a Neon project, take note of your user name, password, and project ID. This information is required when defining connection settings in your Django project. Neon provides the password to you immediately after you create a project.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Enter a name for your project and click **Create Project**.

For additional information about creating projects, see [Setting up a project](../get-started-with-neon/setting-up-a-project).

## Configure Django project connection settings

Connecting to Neon requires configuring database connection settings in your Django project's `settings.py` file.

In your Django project, navigate to the `DATABASES` section of your `settings.py` file and modify the connection details as shown:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '<project_id>',
        'USER': '<user>',
        'PASSWORD': '<password>',
        'HOST': '<project_id>.cloud.neon.tech',
        'PORT': '5432',
    }
}
```

where:

- `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a project
- `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**.

For additional information about Django project settings, see [Django Settings: Databases](https://docs.djangoproject.com/en/4.0/ref/settings/#databases), in the Django documentation.

**_Note_**: Running Django tests is currently not supported. The Django test runner must be able to create a database for tests, which is not yet supported.