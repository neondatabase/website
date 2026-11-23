---
title: Connect a Django application to Neon
subtitle: Connect a Django app to Lakebase Postgres on Neon, query it from a view, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Django 6.1 app to Lakebase Postgres on Neon: create a Neon project
  (Neon CLI, API, or Console), link it with the Neon CLI to write DATABASE_URL
  to .env.local, load it in settings.py with python-dotenv and dj-database-url,
  use psycopg 3 with connection health checks for Neon's scale to zero, and
  query it from a view. Covers Django 5.2 LTS, deployment, and troubleshooting.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/django
  - /docs/cloud/integrations/django
updatedOn: '2026-11-19T01:51:18.666Z'
---

<PromptBlock src="/prompts/django-prompt.md" labels={["Set up your agent and follow this guide", "Look up Django's docs", "Connect your Django app"]} />

<Steps>

## Create a Django app

Install Python 3.12 or later, which Django 6.1 requires. Then create a project directory with a virtual environment, install Django and the packages this guide uses, and create a Django project:

```bash filename="Terminal"
mkdir my-app
cd my-app
python3 -m venv .venv
source .venv/bin/activate
pip install "Django>=6.1,<6.2" "psycopg[binary]" dj-database-url python-dotenv
django-admin startproject mysite .
printf '.venv/\n.env\n.env.local\n' > .gitignore
```

On Windows, run `.venv\Scripts\activate` instead of `source .venv/bin/activate`.

The packages are:

- `psycopg[binary]`: the psycopg 3 Postgres driver, which Django uses by default.
- `dj-database-url`: reads `DATABASE_URL` and builds Django's `DATABASES` setting from it.
- `python-dotenv`: loads the env files, because Django doesn't read them itself.

`startproject` creates the project files but no `.gitignore`, so the `printf` line adds one that keeps the virtual environment and your env files out of git. On Windows, create the same file in PowerShell with `Set-Content -Path .gitignore -Value ".venv/", ".env", ".env.local"`, or in cmd with `(echo .venv/& echo .env& echo .env.local)>.gitignore`.

If you're adding Neon to an existing Django app, don't run `django-admin startproject`, and don't use the `pip install` line above, because it would upgrade Django. Use the app's virtual environment (`venv` or `.venv`). If the app has none, create `.venv` and install Django at the app's version too. In an existing environment, install only the three packages:

```bash filename="Terminal"
pip install "psycopg[binary]" dj-database-url python-dotenv
```

If you created a new `.venv`, also run `pip install "Django==5.2.*"` (or the app's exact version).

Keep the app's Django version. Add `.venv/`, `.env`, and `.env.local` to its `.gitignore` if they aren't there. The code in this guide also works on [Django 5.2 LTS](#troubleshooting), which is covered in Troubleshooting.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [Agent Skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Django doesn't publish an `llms.txt` file, so the prompt above has your agent look up its [documentation](https://docs.djangoproject.com/en/stable/) instead.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-app --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region; pass a different one to pick another of the regions above. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project in your organization:

```bash filename="Terminal"
export NEON_API_KEY=napi_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-app", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

The response includes the project's connection string in `connection_uris[0].connection_uri`. See [Create a project with the API](/docs/manage/projects#create-a-project-with-the-api) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick one of the regions above.

</TabItem>

</Tabs>

## Connect your app to the project

Get a `DATABASE_URL` into an env file in your project directory, the one that contains `manage.py`. Django doesn't read env files itself. The settings file in the next step loads `.env.local` and `.env` with python-dotenv.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link --no-config
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context. It pins a branch (pass `--branch` to choose one) and pulls that branch's `DATABASE_URL` into `.env.local`. If your project already has a `.env` file, it writes there instead. `--no-config` skips the offer to create a `neon.ts` file, which is for JavaScript projects.

To skip the other prompts, pass `-y` with `--org-id` and `--project-id`. For example, to link to the project you created in the CLI tab above:

```bash filename="Terminal"
neon link --no-config -y --org-id <org-id> --project-id <project-id>
```

Or pass `-y` with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. Keep connection pooling on for this `DATABASE_URL`, which uses the `-pooler` hostname. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step uses the Neon CLI. To use it, run `neon link` in this directory.

</TabItem>

</Tabs>

Keep `DATABASE_URL` in only one env file: if `.env` and `.env.local` both have it, `.env.local` wins.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Configure the database connection

Open `mysite/settings.py`. The examples use `mysite` as the project package name, the folder that contains `settings.py`; replace it with your project's name in the paths and imports. Replace the import lines at the top of the file, and the `BASE_DIR` line, with the block below. Then replace the `DATABASES` block that `startproject` created. The block shows only those parts, so keep the rest of the file as `startproject` generated it:

```python filename="mysite/settings.py"
import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# neon link writes DATABASE_URL to .env.local, or to .env if the project has one.
# .env.local loads first, so it wins if both files set the variable.
load_dotenv(BASE_DIR / ".env.local")
load_dotenv(BASE_DIR / ".env")

if not os.getenv("DATABASE_URL"):
    raise ImproperlyConfigured(
        "DATABASE_URL is not set. Run `neon link` in the project directory, or add it to .env.local."
    )

DATABASES = {
    "default": dj_database_url.config(
        conn_max_age=300,
        conn_health_checks=True,
        disable_server_side_cursors=True,
    )
}
# Keep the sslmode from DATABASE_URL if it has one; otherwise require SSL.
DATABASES["default"].setdefault("OPTIONS", {}).setdefault("sslmode", "require")
```

The settings do three things:

- `dj_database_url.config()` reads `DATABASE_URL` and fills in the host, user, password, and database. The `sslmode` and `channel_binding` parameters from the connection string pass to the driver.
- The `setdefault` line sets `sslmode=require` only when the URL doesn't set one. The URLs `neon link` writes include `sslmode=require`, and a stricter value such as `verify-full` in the URL is kept.
- `conn_max_age=300` and `conn_health_checks=True` handle scale to zero. Neon suspends an idle compute after 5 minutes of inactivity by default, which closes its connections (see [Compute lifecycle](/docs/introduction/compute-lifecycle)). Django drops a connection after 300 seconds, and it checks a reused connection before a request uses it, so a connection Neon closed gets replaced. For more on the setting, see [CONN_MAX_AGE](https://docs.djangoproject.com/en/stable/ref/settings/#conn-max-age) in the Django docs.
- `disable_server_side_cursors=True` applies to every connection, because the pooled connection string needs it. Neon's pooler runs PgBouncer in transaction mode, which doesn't support server-side cursors, and Django's docs recommend this setting for transaction pooling. The cost: `QuerySet.iterator()` fetches rows in one batch instead of a server-side cursor, so a large iteration holds more rows in memory.

Django already turns off psycopg's prepared statements by default, so the pooler needs no other setting.

If `DATABASE_URL` isn't set, Django stops with an `ImproperlyConfigured` error that names the variable.

## Test the connection

Create a view that returns the Postgres version. Create `views.py` in your project package (`mysite/views.py` in these examples, where `mysite` is replaced with your project package name) with the function below. If the file already exists, add the function to it instead of replacing the file.

```python filename="mysite/views.py"
from django.db import connection
from django.http import JsonResponse


def db_version(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
    return JsonResponse({"version": version})
```

In your project package's `urls.py` (`mysite/urls.py` in these examples), add the `views` import and the path to `urlpatterns`. For a new project, the file looks like this:

```python filename="mysite/urls.py"
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path("", views.db_version, name="db_version"),
    path("admin/", admin.site.urls),
]
```

If `mysite/urls.py` already exists, add the import and the path to it instead of replacing the file. If your project already has a root route, use `path("neon/", views.db_version, name="db_version")` instead of `""`, so you keep that route.

Create Django's tables over a direct connection, then start the server. Neon recommends the direct string (the connection string without `-pooler` in the hostname) for migrations, so set `DATABASE_URL` to the direct string for the `migrate` command only:

```bash filename="Terminal"
DATABASE_URL="$(neon connection-string)" python manage.py migrate
python manage.py runserver
```

`neon connection-string` with no branch name prints the direct string for the branch that `neon link` pinned, so the value doesn't need to be copied. A variable set in the shell takes priority over the env files, so `migrate` uses the direct string and `runserver` uses `DATABASE_URL` from the env file. `migrate` creates the tables that Django's built-in apps use, such as users and sessions.

The `$(neon connection-string)` form works in macOS and Linux shells. On Windows, run `neon connection-string` and paste its output in place of `<direct string>`. The command prints the direct string by default:

<CodeTabs labels={["PowerShell", "cmd"]}>

```powershell filename="PowerShell"
$env:DATABASE_URL="<direct string>"; python manage.py migrate; Remove-Item Env:DATABASE_URL
```

```bat filename="cmd"
set "DATABASE_URL=<direct string>" && python manage.py migrate & set "DATABASE_URL="
```

</CodeTabs>

The cmd form quotes the value, so the `&` in the string doesn't end the command. Both forms clear `DATABASE_URL` after `migrate` finishes, so the next `runserver` in that window reads the pooled string from your env file.

If you set up the project in the Console and don't use the Neon CLI, copy the direct string from **Connect** with connection pooling turned off. See [Connection pooling](/docs/connect/connection-pooling). Use that string in place of `$(neon connection-string)`.

Open [localhost:8000](http://localhost:8000). The response shows your Postgres version, which confirms the connection:

```json
{"version": "PostgreSQL 18.6 ..."}
```

</Steps>

## Deploy

Set `DATABASE_URL` on your host to the pooled string for the running app. Get it with `neon connection-string main --pooled` (or `neon connection-string production --pooled` for a project created in the Console), or copy it from **Connect** in the Console with connection pooling on. The settings file reads `DATABASE_URL` from the environment, so a host doesn't need `.env` files.

Run migrations before you start the new code. Do it from a machine where the project is linked (where you ran `neon link`), so the host doesn't need the Neon CLI or a `.neon` file. Use the direct string for the project's default branch, with `DATABASE_URL` set for that command only. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. The command below uses `main`. For a Console project, replace `main` with `production`:

```bash filename="Terminal"
DATABASE_URL="$(neon connection-string main)" python manage.py migrate
```

If you don't use the Neon CLI, replace the `$(neon connection-string main)` part with the direct string from **Connect**, with connection pooling turned off. On Windows, use the PowerShell or cmd form from the Test step, and paste in the output of `neon connection-string main` in place of `<direct string>` (or the direct string from **Connect**, if you don't use the CLI).

Django's deployment checklist covers the rest of production setup. Set `DEBUG = False`, read `SECRET_KEY` and `ALLOWED_HOSTS` from the environment, and set `STATIC_ROOT` if the app serves static files. Then run `python manage.py check --deploy` against the production settings. For the full list, see the [deployment checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/).

Serve the app with a WSGI server such as gunicorn, which doesn't use `runserver`:

```bash filename="Terminal"
pip install gunicorn
gunicorn mysite.wsgi:application --bind 0.0.0.0:$PORT
```

If you serve the app with an ASGI server such as uvicorn, Django's docs say to disable persistent connections. Set the `conn_max_age` argument of `dj_database_url.config()` to `0`.

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Object Storage has a Neon CLI command, `neon buckets create`, and each service's page below covers its setup.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Create a bucket with `neon buckets create <name>`, then call it from a view. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Call models from a view. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Use a function for work that outlasts a request, such as agents and webhooks, and call it from Django over HTTP. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: See [Realtime](/docs/realtime/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

`ImproperlyConfigured: DATABASE_URL is not set`
: Django found no `DATABASE_URL`. Run `neon link` in the directory that contains `manage.py`, or check that `.env.local` or `.env` is there and has the variable. On a host, set the variable in the environment.

`OperationalError` when `runserver` starts
: `runserver` checks for unapplied migrations when it starts, so it exits if it can't reach the database. Check the connection string and start the server again. A wrong URL fails the same way.

`Endpoint ID is not specified`
: Your app is using psycopg2 with a libpq version older than 14, which doesn't send the Server Name Indication that Neon uses for routing. Install psycopg 3 with `pip install "psycopg[binary]"`. Django uses psycopg 3 when it's installed. Use an up-to-date driver, and test your app after you upgrade psycopg. For other options, see [Connection errors](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).

`SSL SYSCALL error: EOF detected`
: The app reused a connection that Neon closed while the compute was suspended. The `conn_max_age` and `conn_health_checks` settings guard against this for web requests. Django runs the health check only before a request's first query. A long-running command or worker that holds one connection for hours doesn't get that check. Django's request signals don't run for commands or worker loops, so call `django.db.connection.close()` (or `django.db.close_old_connections()`) before each unit of work. For more on scale to zero, see [Configuring Scale to Zero for Neon computes](/docs/guides/scale-to-zero-guide).

Django 5.2 LTS
: The settings and the view in this guide also work on Django 5.2 LTS, which supports Python 3.10 and later. An app on Django 5.2 keeps that version: install the packages without Django, as shown in the existing-app step, and keep the rest of the steps as written. The three packages also install on Python 3.10, the same floor as Django 5.2. Apps older than 5.2 aren't covered by this guide, so check with your team before you change the version. For upgrade notes, see the [Django release notes](https://docs.djangoproject.com/en/stable/releases/).

</DefinitionList>

## Next steps

- **Create your tables:** follow [Schema migration with Django and Lakebase Postgres on Neon](/docs/guides/django-migrations) to define models and generate migrations.
- [Branching](/docs/introduction/branching): give each preview deployment or pull request its own branch of your database.
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database.

<NeedHelp/>
