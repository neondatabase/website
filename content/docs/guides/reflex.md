---
title: Connect a Reflex application to Neon
subtitle: Connect a Reflex app to Lakebase Postgres on Neon, define a model with SQLAlchemy, migrate it with Alembic, query it from a page, develop on a branch, and deploy
summary: >-
  Connect a Reflex app to Lakebase Postgres on Neon: optionally add Neon's agent
  skills, create a Neon project (Neon CLI, API, or Console), link it with the
  Neon CLI to write the connection strings into .env, set Reflex's migration and
  app database URLs for psycopg 3 in rxconfig.py, define a SQLAlchemy model with
  Alembic migrations, and query it from a Reflex page. Covers a development
  branch, deployment, troubleshooting, and Neon's other backend services from
  Reflex.
enableTableOfContents: true
updatedOn: '2026-11-19T01:52:58.892Z'
---

<PromptBlock src="/prompts/reflex-prompt.md" labels={["Set up your agent and follow this guide", "Look up Reflex's docs", "Connect your Reflex app"]} />

[Reflex](https://reflex.dev/) builds full-stack web apps in Python. Event handlers and state run on the server, and the page is built from Python components. This guide creates a Reflex app that stores customers in Lakebase Postgres on Neon. The database layer uses SQLAlchemy 2.0 with async sessions, and migrations use Alembic.

<Steps>

## Create a Reflex app

If your directory already holds a Reflex app with an `rxconfig.py`, skip the `mkdir`, `venv`, and `reflex init` commands in this step. Reuse its `.venv` if it has one, and keep the Reflex version the app already uses. The notes at the end of this step cover that case, and the later steps mention existing apps where they differ.

For a new app, reflex needs Python 3.11 or later. Create a project directory and a virtual environment in it, then install Reflex with the packages this guide uses:

<CodeTabs labels={["MacOS/Linux", "PowerShell"]}>

```bash filename="Terminal"
mkdir with_reflex
cd with_reflex
python3 -m venv .venv
.venv/bin/pip install "reflex[db]" python-dotenv "psycopg[binary]"
```

```shell filename="PowerShell"
mkdir with_reflex
cd with_reflex
py -3 -m venv .venv
.\.venv\Scripts\pip install "reflex[db]" python-dotenv "psycopg[binary]"
```

</CodeTabs>

The `db` extra installs SQLAlchemy and Alembic. `python-dotenv` loads the `.env` file that holds the connection strings, and `psycopg[binary]` is the Postgres driver (psycopg 3). The commands in this guide call the project's own `.venv` directly, so nothing is installed globally. You can use another environment manager, such as uv or poetry, instead of `venv`.

Create the app with `reflex init`. With `--template blank` it doesn't prompt:

<CodeTabs labels={["MacOS/Linux", "PowerShell"]}>

```bash filename="Terminal"
.venv/bin/reflex init --template blank
```

```shell filename="PowerShell"
.\.venv\Scripts\reflex init --template blank
```

</CodeTabs>

The command creates the app in the current directory and names it after the directory, `with_reflex`. It writes `rxconfig.py`, a `with_reflex/` package with a starter page, `assets/`, and `requirements.txt`, which pins the Reflex version you installed. It may also write an `AGENTS.md` with instructions for coding agents, from Reflex's agent-skills repository, and a `CLAUDE.md` that imports it. Pass `--no-agents` to skip the agent files.

The `.gitignore` that `reflex init` writes doesn't list `.env`, `.env.local`, or `.venv`. Add them before you create an env file:

<CodeTabs labels={["MacOS/Linux", "PowerShell"]}>

```bash filename="Terminal"
printf '.venv\n.env\n.env.local\n' >> .gitignore
```

```shell filename="PowerShell"
Add-Content -Path .gitignore -Value ".venv", ".env", ".env.local"
```

</CodeTabs>

<Admonition type="warning" title="Existing apps on Reflex 0.10">
Don't upgrade. Check the installed version with `.venv/bin/pip show reflex` (on Windows, `.\.venv\Scripts\pip show reflex`), and if the app's `.venv` lacks Reflex, install that same version: `.venv/bin/pip install "reflex[db]==<version>" python-dotenv "psycopg[binary]"`. Reflex 0.10 needs one extra line in `db.py`, which the next steps show.
</Admonition>

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Reflex publishes its own agent skills, for its docs, Python environment setup, and process management. Install all of them with `npx skills add reflex-dev/agent-skills -a <your agent id> --skill '*' -y`, using an agent id such as `claude-code` for Claude Code. The supported ids are listed in the [skills CLI's agents list](https://github.com/vercel-labs/skills/blob/main/docs/agents.md). `reflex init` may also write an `AGENTS.md` from Reflex's agent-skills repository. Reflex's docs index for AI agents is at [reflex.dev/docs/llms.txt](https://reflex.dev/docs/llms.txt).

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

Get the connection strings into `.env`. The `rxconfig.py` you write in a later step loads `.env`, and Reflex doesn't read `.env.local`. Create an empty `.env` first, if you don't have one, so the Neon CLI writes into it instead of creating `.env.local`:

<CodeTabs labels={["MacOS/Linux", "PowerShell"]}>

```bash filename="Terminal"
touch .env
```

```shell filename="PowerShell"
if (-not (Test-Path .env)) { New-Item -ItemType File .env }
```

</CodeTabs>

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context, pins a branch (pass `--branch` to choose one), and writes that branch's connection strings into `.env`. `DATABASE_URL` is the pooled string, and `DATABASE_URL_UNPOOLED` is the direct one. If it offers to create a [`neon.ts`](/docs/reference/neon-ts) file, you can decline it, since this guide doesn't use one.

To run it without prompts, pass `--no-config` and `-y`, with the IDs of your organization and project:

```bash filename="Terminal"
neon link --no-config -y --org-id <org-id> --project-id <project-id>
```

Find the IDs with `neon orgs list` and `neon projects list --org-id <org-id>`. The `-y` flag pins the project's default branch. To create a project without prompts, pass `--org-id`, `--project-name`, and `--region-id` instead of `--project-id`.

</TabItem>

<TabItem>

Copy both connection strings from **Connect** in the Console nav. Add them to your `.env` file in the project directory as `DATABASE_URL_UNPOOLED` (direct) and `DATABASE_URL` (pooled). The pooled string is the direct one with `-pooler` added after the endpoint ID in the host name. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env" shouldWrap
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
DATABASE_URL="postgresql://[user]:[password]@[pooled_neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

</TabItem>

</Tabs>

## Work on a development branch (optional)

This step uses the Neon CLI, so run `neon link` in this directory first.

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and writes its connection strings into `.env`, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Configure the database URLs

Reflex reads its database URLs from `rxconfig.py`. `db_url` is used by the `reflex db` migration commands and by the startup schema check, and `async_db_url` is used by the app's queries. Set `db_url` to the direct string, because Neon recommends a direct connection for migrations. Set `async_db_url` to the pooled string, so the app reaches the database through Neon's pooler. Both use the `postgresql+psycopg://` scheme, which selects psycopg 3. If `DATABASE_URL_UNPOOLED` isn't set, `db_url` stays unset: the app still starts, `reflex db init` logs that `db_url` isn't configured, and `reflex db makemigrations` raises `ValueError: No database url configured`.

Replace the contents of `rxconfig.py` with the following. If your app already has an `rxconfig.py`, don't replace it. Add `load_dotenv()`, the URL lines, and `db_url` and `async_db_url` to your existing `rx.Config`, and keep its plugins and its `app_name`. The notes in [Define the model and the page](#define-the-model-and-the-page) cover the package name.

```python filename="rxconfig.py"
import os

import reflex as rx
from dotenv import load_dotenv

# Load the connection strings from .env. A variable already set in the environment wins.
load_dotenv()

# neon link writes both strings. The app uses the pooled one (DATABASE_URL), or the
# direct one if DATABASE_URL is missing. Migrations use the direct one (DATABASE_URL_UNPOOLED).
direct_url = os.environ.get("DATABASE_URL_UNPOOLED")
pooled_url = os.environ.get("DATABASE_URL") or direct_url
if not pooled_url:
    raise RuntimeError("Set DATABASE_URL_UNPOOLED or DATABASE_URL in the .env file.")


def psycopg_url(url: str) -> str:
    # Neon's connection strings start with postgresql://. Use the psycopg 3 driver.
    return url.replace("postgresql://", "postgresql+psycopg://", 1)


config = rx.Config(
    app_name="with_reflex",
    plugins=[
        rx.plugins.SitemapPlugin(),
        rx.plugins.TailwindV4Plugin(),
        rx.plugins.RadixThemesPlugin(),
    ],
    # Set only when DATABASE_URL_UNPOOLED is present. Without it, reflex db init
    # reports that db_url isn't configured, and startup skips the schema check.
    db_url=psycopg_url(direct_url) if direct_url else None,
    async_db_url=psycopg_url(pooled_url),
)
```

## Create the database client

Create the model base, the engine, and the session factory once, in `with_reflex/db.py`. Every module that defines a table or runs a query imports them from here:

```python filename="with_reflex/db.py"
import reflex as rx
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass


class Base(MappedAsDataclass, DeclarativeBase):
    """Base class for the app's tables."""


# Reflex 0.10 finds models only through this call.
rx.ModelRegistry.register(Base)

engine = create_async_engine(rx.config.get_config().async_db_url, pool_pre_ping=True)
Session = async_sessionmaker(engine, expire_on_commit=False)
```

`pool_pre_ping` checks each connection in the SQLAlchemy connection pool before the app uses it. Neon suspends a compute after a period of inactivity, which can close a connection the app kept open. The check makes the next query open a new connection instead of failing. `expire_on_commit=False` keeps the attributes of committed objects readable after their session closes, so the app can store them in state.

The engine here takes `async_db_url` directly, so it avoids the warning that Reflex logs when `db_url` and `async_db_url` point at different hosts. The pooled and direct hosts always differ. `rx.asession()` called without a URL logs that warning.

## Initialize migrations

Reflex uses [Alembic](https://alembic.sqlalchemy.org/en/latest/) for schema migrations. Run this command before you define the `Customer` model. If your app already has an `alembic.ini`, skip it: `reflex db init` logs that the database is already initialized and does nothing else. The one exception is a legacy `env.py`, which it updates.

```bash filename="Terminal"
.venv/bin/reflex db init
```

It creates `alembic.ini` and an `alembic/` directory in the project, then generates an initial revision from the models the app has at that point and applies it to the database. Run it before you add the model, so that the `Customer` table comes from `makemigrations` in a later step. If you run it after the model exists, the initial revision already includes the `customer` table, and `makemigrations` has nothing new to add. In that case, skip the `makemigrations` step. The command needs `DATABASE_URL_UNPOOLED` set; without it, see Troubleshooting.

## Define the model and the page

Replace the contents of `with_reflex/with_reflex.py` with the following. It defines a `Customer` table, and a page that adds, lists, and deletes customers and shows the Postgres version the app is connected to. If `with_reflex/with_reflex.py` already has your app's code, don't replace it. Use the existing-app steps below instead.

```python filename="with_reflex/with_reflex.py"
"""Welcome to Reflex. This file outlines the steps to create a basic app."""

import reflex as rx
from sqlalchemy import select, text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base, Session


class Customer(Base):
    """The customer model."""

    __tablename__ = "customer"

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str]
    email: Mapped[str]
    phone: Mapped[str]
    address: Mapped[str]


class State(rx.State):
    """The app state."""

    # Form fields
    name: str = ""
    email: str = ""
    phone: str = ""
    address: str = ""

    # The Postgres version, read from the server
    db_version: str = ""

    # List of customers
    customers: list[Customer] = []

    # Setters for the form fields
    def set_name(self, value: str):
        self.name = value

    def set_email(self, value: str):
        self.email = value

    def set_phone(self, value: str):
        self.phone = value

    def set_address(self, value: str):
        self.address = value

    @rx.event
    async def load_page(self):
        """Load the Postgres version and the customers."""
        async with Session() as session:
            self.db_version = (
                await session.execute(text("SELECT version()"))
            ).scalar_one()
            self.customers = (
                await session.scalars(select(Customer).order_by(Customer.id))
            ).all()

    @rx.event
    async def load_customers(self):
        """Load all customers from the database."""
        async with Session() as session:
            self.customers = (
                await session.scalars(select(Customer).order_by(Customer.id))
            ).all()

    @rx.event
    async def add_customer(self):
        """Add a new customer to the database."""
        if self.name and self.email:
            async with Session() as session:
                session.add(
                    Customer(
                        name=self.name,
                        email=self.email,
                        phone=self.phone,
                        address=self.address,
                    )
                )
                await session.commit()

            # Clear form fields
            self.name = ""
            self.email = ""
            self.phone = ""
            self.address = ""

            # Reload customers
            return State.load_customers

    @rx.event
    async def delete_customer(self, customer_id: int):
        """Delete a customer from the database."""
        async with Session() as session:
            customer = await session.get(Customer, customer_id)
            if customer:
                await session.delete(customer)
                await session.commit()

        # Reload customers
        return State.load_customers


def index() -> rx.Component:
    return rx.box(
        rx.color_mode.button(position="top-right"),
        rx.vstack(
            # Header
            rx.heading(
                "Customer Management",
                size="8",
                weight="bold",
                margin_bottom="0.5rem",
            ),
            rx.text(State.db_version, size="2"),
            # Add Customer Section
            rx.card(
                rx.vstack(
                    rx.heading("Add New Customer", size="5", weight="medium"),
                    rx.grid(
                        rx.input(
                            placeholder="Name *",
                            value=State.name,
                            on_change=State.set_name,
                            size="3",
                        ),
                        rx.input(
                            placeholder="Email *",
                            value=State.email,
                            on_change=State.set_email,
                            size="3",
                        ),
                        rx.input(
                            placeholder="Phone",
                            value=State.phone,
                            on_change=State.set_phone,
                            size="3",
                        ),
                        rx.input(
                            placeholder="Address",
                            value=State.address,
                            on_change=State.set_address,
                            size="3",
                        ),
                        columns="4",
                        spacing="4",
                        width="100%",
                    ),
                    rx.button(
                        "Add Customer",
                        on_click=State.add_customer,
                        size="3",
                        variant="solid",
                        color_scheme="blue",
                        width="auto",
                    ),
                    spacing="4",
                    width="100%",
                ),
                size="3",
                width="100%",
            ),
            # Customer table
            rx.card(
                rx.vstack(
                    rx.heading(
                        f"Customer List ({State.customers.length()} total)",
                        size="5",
                        weight="medium",
                    ),
                    rx.box(
                        rx.table.root(
                            rx.table.header(
                                rx.table.row(
                                    rx.table.column_header_cell("ID", width="80px"),
                                    rx.table.column_header_cell("Name"),
                                    rx.table.column_header_cell("Email"),
                                    rx.table.column_header_cell("Phone"),
                                    rx.table.column_header_cell("Address"),
                                    rx.table.column_header_cell(
                                        "Actions", width="120px"
                                    ),
                                ),
                            ),
                            rx.table.body(
                                rx.foreach(
                                    State.customers,
                                    lambda customer, index: rx.table.row(
                                        rx.table.cell(
                                            rx.badge(
                                                customer.id,
                                                color_scheme="gray",
                                                variant="soft",
                                            ),
                                        ),
                                        rx.table.cell(
                                            rx.text(customer.name, weight="medium"),
                                        ),
                                        rx.table.cell(
                                            rx.text(customer.email),
                                        ),
                                        rx.table.cell(
                                            rx.text(customer.phone),
                                        ),
                                        rx.table.cell(
                                            rx.text(customer.address),
                                        ),
                                        rx.table.cell(
                                            rx.button(
                                                rx.icon("trash-2", size=16),
                                                on_click=lambda: State.delete_customer(
                                                    customer.id
                                                ),
                                                size="2",
                                                variant="soft",
                                                color_scheme="red",
                                            ),
                                        ),
                                        align="center",
                                    ),
                                ),
                            ),
                            variant="surface",
                            size="3",
                            width="100%",
                        ),
                        width="100%",
                        overflow_x="auto",
                    ),
                    spacing="4",
                    width="100%",
                ),
                size="3",
                width="100%",
            ),
            spacing="6",
            width="100%",
            max_width="1400px",
            padding="2rem",
        ),
        width="100%",
        display="flex",
        justify_content="center",
        min_height="100vh",
        background="var(--gray-1)",
        on_mount=State.load_page,
    )


app = rx.App()
app.add_page(index)
```

The model is a SQLAlchemy class: a dataclass-mapped subclass of the `Base` in `db.py`. The app's event handlers are `async` and open a session with `async with Session()`. A blocking database call inside a handler would hold up every other event the server is handling. A handler that returns `State.load_customers` queues the reload after it finishes.

**Existing apps.** Reflex loads your app's code from the package named by `app_name` in `rxconfig.py`. This guide's package is `with_reflex`, so if your package has another name, replace `with_reflex` with your package name everywhere it appears in this guide: the `db.py` and `with_reflex.py` paths, the imports, and the `app.add_page` lines. Leave your `app_name` as it is.

If `with_reflex/with_reflex.py` already has your own page, keep it. Move the model, the `State` class, and the page into `with_reflex/customers.py`, and rename the page function to `customers_page`. Keep the `from .db import Base, Session` import in that file. Then, in `with_reflex/with_reflex.py`, import the page and register it at its own route:

```python filename="with_reflex/with_reflex.py"
from with_reflex.customers import customers_page

app.add_page(customers_page, route="/customers")
```

Keep the model base in `db.py` so that every module imports it from one place, and the `rx.ModelRegistry.register(Base)` call runs once.

## Create and apply the migration

Generate a migration for the `Customer` table:

```bash filename="Terminal"
.venv/bin/reflex db makemigrations --message 'create customer table'
```

`makemigrations` writes a script to `alembic/versions/`. Open it and review it before you apply it.

<Admonition type="warning" title="Check the revision before you migrate">
On Reflex 0.10, `makemigrations` only sees the models that `rx.ModelRegistry.register(Base)` registers. If `with_reflex/db.py` doesn't make that call, the revision can include a `drop_table` for the `customer` table when that table already exists in the database. Don't run `reflex db migrate` on a revision that drops it.
</Admonition>

When the revision looks right, apply it to the direct database that `DATABASE_URL_UNPOOLED` points at:

```bash filename="Terminal"
.venv/bin/reflex db migrate
```

You can check that the `customer` table exists in the Neon Console's [Tables](/docs/guides/tables) page.

## Run the app

Start the development server:

```bash filename="Terminal"
.venv/bin/reflex run
```

On Windows, use `.\.venv\Scripts\reflex` in place of `.venv/bin/reflex` for the `reflex` commands in this guide.

Open [localhost:3000](http://localhost:3000). The page shows the Postgres version at the top, and you can add, view, and delete customers.

![Reflex Customer Data App](/docs/guides/reflex_customer_data_app.png)

</Steps>

## Deploy

Set the connection strings wherever the app runs, run the migrations before each new version starts, and run the app in production mode.

- **Environment:** `load_dotenv()` doesn't overwrite a variable that's already set, so set `DATABASE_URL_UNPOOLED` and `DATABASE_URL` in your host's environment. Without `DATABASE_URL_UNPOOLED`, the app still starts, but migrations can't run there. For production, use your default branch: `main`, or `production` for projects created in the Console. `neon connection-string main` prints the direct string, and `neon connection-string main --pooled` prints the pooled one. You can also copy both from **Connect** in the Console.
- **Migrations:** run `reflex db migrate` as part of each release, before the new version starts. Check the revision first. See [Create and apply the migration](#create-and-apply-the-migration). Reflex warns in the startup log when the schema is behind the models, but it doesn't migrate for you.
- **Production mode:** run `reflex run --env prod`. It serves the frontend and the backend from one server on port 3000. Set Reflex's `deploy_url` setting on the backend if the frontend is served from a different host than the backend, or if a reverse proxy rewrites the `Host` header. Set it to the frontend's public URL, including its scheme. The Reflex [self-hosting guide](https://reflex.dev/docs/hosting/self-hosting/) covers reverse proxies, separate frontend and backend processes, and static exports.
- **More than one backend process:** set `REFLEX_REDIS_URL` so that the processes share session state. See Reflex's [scaling guide](https://reflex.dev/docs/hosting/scaling/).
- **Connection strings:** `db_url` (migrations and the startup schema check) uses the direct string, `DATABASE_URL_UNPOOLED`, as Neon recommends. `async_db_url` (the app's queries) uses the pooled string, `DATABASE_URL`, through Neon's pooler. psycopg 3 prepares a statement after five runs on a connection. The pooler supports protocol-level prepared statements, so the pooled string works with this driver.
- **Process count:** Reflex runs one backend process without Redis. With `REFLEX_REDIS_URL` set, it runs `min(2 × CPU + 1, 8)` processes, unless the app sets its transport to `polling`, which runs one.
- **Connection count:** each process has a SQLAlchemy connection pool for the app's queries, which use `async_db_url`. When `db_url` is set, the startup schema check also opens a connection from a separate synchronous pool.
- **Neon pool limits:** Neon's pooler keeps a pool per user and database, sized at 90% of the compute's `max_connections`. Client requests beyond that wait in a queue for up to 2 minutes. The app's connections through the pooler share this pool. See [Connection pooling](/docs/connect/connection-pooling).

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Each service has its own CLI commands and its own page on how to call it from your app. `neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. This guide's app is Python, so it doesn't use one.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Create a bucket with `neon buckets create <name>`. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Use a function for work that outlasts a request, such as agents and webhooks. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Enable it on the linked branch with `neon realtime enable`. See [Realtime](/docs/realtime/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

`RuntimeError: Set DATABASE_URL_UNPOOLED or DATABASE_URL in the .env file.`
: `rxconfig.py` found neither variable in the environment or in `.env`. Check that the `.env` file next to `rxconfig.py` has one of the lines. `python-dotenv` searches from the directory of `rxconfig.py` upward, so the working directory doesn't matter. In production, set the variables in the host's environment.

`ValueError: No database url configured`
: `DATABASE_URL_UNPOOLED` isn't set, so Reflex has no direct database URL. On Reflex 0.10.1, `reflex db makemigrations` raises this error, and `reflex db migrate` raises it when the project has an `alembic.ini`. Add the direct string to `.env` (`neon link` writes it), then run the command again. The app itself doesn't need it to start.

`db_url is not configured, cannot initialize.`
: `reflex db init` ran without `DATABASE_URL_UNPOOLED`. It logs this and exits with status 0, so it creates no `alembic.ini`. Add the direct string to `.env`, then run `reflex db init` again.

`SSL SYSCALL error: EOF detected`, or `SSL connection has been closed unexpectedly`
: The app reused a connection that Neon closed after the compute suspended for inactivity. `pool_pre_ping=True` in `with_reflex/db.py` tests each connection in the pool before use. If you pinned an older SQLAlchemy, upgrade to 2.0.33 or later. The [SQLAlchemy guide](/docs/guides/sqlalchemy) covers this in more detail.

`Detected database schema changes. Run reflex db makemigrations to generate migration scripts.`
: Reflex compared the models with the database and found a difference. If you didn't change a model and you're on Reflex 0.10, check that `with_reflex/db.py` calls `rx.ModelRegistry.register(Base)`. Reflex 0.10 finds models only through that call. Before you migrate, read the warning in [Create and apply the migration](#create-and-apply-the-migration).

Existing apps that use `rx.Model` or `rx.session()`
: Reflex 0.9.2 deprecated `rx.Model` and `rx.session()`, and Reflex 1.0 removes them. Move to the pattern in this guide: a `DeclarativeBase` model, `async with Session()` in async event handlers, and `session.scalars(...)`. Reflex's [migration table](https://reflex.dev/docs/database/overview/#migrating-existing-apps) lists each replacement.

</DefinitionList>

## Next steps

- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database

<NeedHelp/>
