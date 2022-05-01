---
title: Getting Started with Django
---

Django is one of the most popular backend frameworks. Because Neon is fully compatible with vanilla PostgreSQL, you only need to fill in the correct connection details. To use Neon with Django, you have create a Project on Neon and specify the project connection settings in your settings.py in the same way as for standalone Postgres.

See the following example of specifying connection properties for Neon:

```json
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '<here goes your project id>',
        'USER': '<your github nickname from account used to authenticate in neon>@neon,
        'PASSWORD': '<token generated in "Connection Details" tab>',
        'HOST': 'pg.neon.tech',
        'PORT': '5432',
    }
}
```

Note:

Currently, it is not possible to run Django tests against Neon because Django test runner needs to create a new database for tests which is currently not supported in Neon.

References:

- [Django Settings: Databases](https://docs.djangoproject.com/en/4.0/ref/settings/#databases)
