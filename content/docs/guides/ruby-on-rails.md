---
title: Connect a Ruby on Rails application to Lakebase Postgres on Neon
subtitle: Connect a Rails app to Lakebase Postgres on Neon, query it from a controller, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Ruby on Rails 8.1 app to Lakebase Postgres on Neon: optionally add
  Neon's agent skills, create a Neon project (Neon CLI, API, or Console), link
  it with the Neon CLI, which writes DATABASE_URL to the .env file that
  dotenv-rails loads, run migrations on the direct connection, and query Postgres
  from a controller. Covers development on a branch, production with Rails 8's
  Solid Queue, Solid Cache, and Solid Cable databases, troubleshooting, and
  Neon's other backend services from Rails.
enableTableOfContents: true
updatedOn: '2026-11-19T01:51:56.762Z'
---

<PromptBlock src="/prompts/ruby-on-rails-prompt.md" labels={["Set up your agent and follow this guide", "Look up Rails's docs", "Connect your Rails app"]} />

<Steps>

## Create a Rails app

Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/) 3.3 or later (Ruby 3.2 is end-of-life), then install Rails and create an app that uses Postgres:

```bash filename="Terminal"
gem install rails
rails new my-app --database=postgresql
cd my-app
```

Rails 8.1 supports Ruby 3.2 and later. The current releases are Rails 8.1.4.1 and Ruby 4.0.10. `rails new` runs `bundle install`, which builds the `pg` gem, and creates a git repository. The app's `.gitignore` covers `/.env*`, so your env files stay out of git.

This guide doesn't convert an existing app that uses SQLite. Before you continue with an existing app, check that its Gemfile has `gem "pg"` and that `config/database.yml` uses the `postgresql` adapter.

If your app is on Rails 8.0 or 7.2, see [Older Rails versions](#older-rails-versions) in Troubleshooting.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

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

Rails doesn't read env files on its own. The `dotenv-rails` gem loads them in the development and test environments, so add it:

```bash filename="Terminal"
bundle add dotenv-rails --group development,test
```

Dotenv loads `.env.local` in development but not in test. Use `.env` instead, which loads in both development and test. `neon link` and `neon env pull` write to `.env` when it exists, and to `.env.local` when it doesn't, so create an empty `.env` first.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, create the empty file and link the app to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
touch .env
neon link --no-config
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context, pins a branch (pass `--branch` to choose one), and writes two strings into `.env`: `DATABASE_URL`, which is pooled, and `DATABASE_URL_UNPOOLED`, which is direct. `--no-config` skips the [`neon.ts`](/docs/reference/neon-ts) file, which a Rails app doesn't use. `.neon` holds project and branch IDs, not credentials. `neon link` adds `.neon` to `.gitignore` the first time it creates the file.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`. For example, to link an existing project without prompts:

```bash filename="Terminal"
neon link --no-config -y --org-id org-abc123 --project-id polished-snowflake-12345678
```

</TabItem>

<TabItem>

Create a `.env` file in your app's root directory, and add the pooled and direct connection strings. In the Console, the **Connect** modal shows the pooled string while **Connection pooling** is on, and the direct string when you turn it off. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```text filename=".env" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[pooled_hostname]/?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[direct_hostname]/?sslmode=require&channel_binding=require"
```

</TabItem>

</Tabs>

<Admonition type="important">
Remove the database name from both `DATABASE_URL` and `DATABASE_URL_UNPOOLED`. Rails needs no name in the URL: it uses `my_app_development` and `my_app_test` from `config/database.yml`. A name in the URL replaces those in every environment.
</Admonition>

`neon link` writes the database name after the host, such as `neondb`. This command deletes the name from the `DATABASE_URL` and `DATABASE_URL_UNPOOLED` lines only, whether their values are quoted or not:

```bash filename="Terminal"
perl -pi -e 's{^(DATABASE_URL(?:_UNPOOLED)?="?[^"\s]*\.neon\.tech)/[^?"\s]*\?}{$1/?}' .env
```

This check prints nothing when every name is gone:

```bash filename="Terminal"
grep -E '^DATABASE_URL(_UNPOOLED)?=.*\.neon\.tech/[^?"]' .env
```

Run this again after any command that rewrites `.env`, such as `neon env pull`, `neon link`, or `neon checkout`, because they write the name back.

## Work on a development branch

Do this step before you create the database or run any migration. `db:prepare` and migrations change the schema and data on the branch your app connects to, so create a [branch](/docs/introduction/branching) named `dev` for local development first. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A branch starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and writes its strings into `.env`, so your app now uses the branch. Remove the database name again, as described above. To switch back, run `neon checkout main` (or `production`), and remove the name again.

</TabItem>

<TabItem>

In the Console, follow [Create a branch](/docs/manage/branches#create-a-branch) to create a branch named `dev` from your default branch. Open its **Connect** modal, and copy the pooled and direct strings into `.env` as `DATABASE_URL` and `DATABASE_URL_UNPOOLED`, as in the Connect step. Then remove the database name from both lines with the command above.

</TabItem>

</Tabs>

## Create the development database

Rails reads `DATABASE_URL` from the environment, where `dotenv-rails` has already loaded it from `.env`, so `config/database.yml` needs no change for this guide.

Create the development database with the direct string. This `sed` command reads only the `DATABASE_URL_UNPOOLED` value from `.env`, without evaluating the file, so characters such as `&` and `$` in the string are safe:

```bash filename="Terminal"
DATABASE_URL="$(sed -n 's/^DATABASE_URL_UNPOOLED="\{0,1\}\([^"]*\)"\{0,1\}$/\1/p' .env)" bin/rails db:prepare
```

`db:prepare` creates `my_app_development`, or migrates it if it already exists. Migrations run on the direct string, where Rails' migration lock works, so keep migrations off the pooled string.

<Admonition type="important">
The role you specified in the `DATABASE_URL` must have **CREATEDB** privileges. The [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role has the `CREATEDB` privilege. Roles created in the Neon Console or API get membership in it, including the default role created with a Neon project. Roles created with `neon roles create --access` don't have it. Alternatively, you can create roles with SQL to grant specific privileges. See [Manage database access](/docs/manage/database-access).
</Admonition>

## Create a controller that queries the database

Generate a controller and a view, then replace their contents with a query for the Postgres version. `--skip` leaves any file that already exists alone:

```bash filename="Terminal"
bin/rails generate controller home index --skip
```

Replace the contents of `app/controllers/home_controller.rb` with:

```ruby filename="app/controllers/home_controller.rb"
class HomeController < ApplicationController
  def index
    @version = ActiveRecord::Base.connection.select_value("SELECT version()")
  end
end
```

Replace the contents of `app/views/home/index.html.erb` with:

```erb filename="app/views/home/index.html.erb"
<p><%= @version %></p>
```

Replace the contents of `config/routes.rb` with the following. It makes the controller the root page and keeps Rails' health check at `/up`. The generator's `get "home/index"` line is gone:

```ruby filename="config/routes.rb"
Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"
end
```

If your app already has a root route, keep it. Add `get "neon", to: "home#index"` inside `Rails.application.routes.draw do` instead, and visit `/neon`.

## Run the application

Start the development server from the root of the project:

```bash filename="Terminal"
bin/rails server
```

Visit [localhost:3000](http://localhost:3000/) in your web browser. The server reads the pooled `DATABASE_URL` from `.env`, and the page shows your database's Postgres version. For example:

```text
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

</Steps>

## Run the tests

`bin/rails test` loads `.env` too, so the test environment uses `my_app_test` on the same host as `DATABASE_URL`. Create that database before you run the tests. With `DATABASE_URL` set, `db:prepare` in the development environment skips the test database, so set `RAILS_ENV=test` to prepare it. Use the direct string, as in the development step:

```bash filename="Terminal"
DATABASE_URL="$(sed -n 's/^DATABASE_URL_UNPOOLED="\{0,1\}\([^"]*\)"\{0,1\}$/\1/p' .env)" RAILS_ENV=test bin/rails db:prepare
```

`db:prepare` creates `my_app_test` and sets up its schema.

<Admonition type="warning">
Rails' test setup can purge the test database, dropping and recreating it by name. Run the tests only on a branch you can afford to lose, never on a branch that holds data you need.
</Admonition>

Run the tests on the direct string:

```bash filename="Terminal"
DATABASE_URL="$(sed -n 's/^DATABASE_URL_UNPOOLED="\{0,1\}\([^"]*\)"\{0,1\}$/\1/p' .env)" bin/rails test
```

## Deploy

Production doesn't load `.env`, because `dotenv-rails` is only in the development and test groups. Set these variables on your host:

- `SECRET_KEY_BASE`, or `RAILS_MASTER_KEY` so Rails can read the credentials in `config/credentials.yml.enc`. Production needs one of them.
- `DATABASE_URL`, the pooled string, with no database name. Get it from your default branch with `neon connection-string <branch> --pooled | sed -E 's#(\.neon\.tech)/[^?]*\?#\1/?#'`, where `<branch>` is `main` or `production`, whichever your project uses. This follows the [Express guide](/docs/guides/express), with the name removed.
- `CACHE_DATABASE_URL`, `QUEUE_DATABASE_URL`, and `CABLE_DATABASE_URL` (the last one only if Action Cable is on, which it is unless you skipped it), each set to the pooled string with no database name.
- If you use Object Storage: `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`, copied from `.env` after `neon env pull`. These are the values for the branch that holds your bucket. Also set `config.active_storage.service = :neon` in `config/environments/production.rb`, as described in [Object Storage](#object-storage).

With Solid, which `rails new` sets up by default, Rails 8 generates these production databases: `primary` (`DATABASE_URL`), `cache`, `queue`, and `cable` unless you skipped Action Cable. Only `DATABASE_URL` applies to `primary`. Without its own URL, each of the others uses the role named after your app and a local Unix socket from `config/database.yml`. That doesn't reach Neon, so set each one. Their database names come from `config/database.yml`, such as `my_app_production_cache`.

From your development machine, with `SECRET_KEY_BASE` set in your shell, create the databases and run their migrations on the direct string from your default branch. The command uses `main`; use `production` instead if that's your default branch, as Console-created projects are. Seeds run when it creates the primary database, so check `db/seeds.rb` first:

```bash filename="Terminal"
DIRECT_URL="$(neon connection-string main | sed -E 's#(\.neon\.tech)/[^?]*\?#\1/?#')"
DATABASE_URL="$DIRECT_URL" CACHE_DATABASE_URL="$DIRECT_URL" QUEUE_DATABASE_URL="$DIRECT_URL" CABLE_DATABASE_URL="$DIRECT_URL" RAILS_ENV=production bin/rails db:prepare
```

Then start the app on the host with the pooled variables.

If you don't use Solid Queue, Solid Cache, or Solid Cable, create the app with `rails new my-app --database=postgresql --skip-solid --skip-action-cable`. Production then has one database, and only `DATABASE_URL` is needed. `--skip-solid` alone keeps Action Cable, which uses Redis in production (`REDIS_URL`).

## Add more of your backend

Neon's other backend services branch with your database. They need a project in a [supported region](#create-a-neon-project). Add each one with its own command. Don't use `neon config add` in this app: it creates a `neon.ts` file and a `package.json`, and installs npm packages, which a Rails app doesn't need.

For long-running or scheduled work, use Rails 8's Solid Queue, which runs in your app and stores its jobs in the queue database. Neon Functions are for Node.js code, not Ruby.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Enable it with `neon neon-auth enable`. It's a REST service, so your Rails app can call its endpoints over HTTP, or use its JavaScript SDK (`@neon/auth`) in browser code. See [Managed Better Auth](/docs/auth/overview).

</DefinitionList>

### Object Storage

Object Storage is S3-compatible buckets for uploads and files. Create a bucket, then write its credentials to `.env`:

```bash filename="Terminal"
neon buckets create my-bucket --access-level private
neon env pull
```

To store Active Storage files in the bucket, add the AWS SDK and a service that uses it:

```bash filename="Terminal"
bundle add aws-sdk-s3 --require=false
```

Add the service to `config/storage.yml`. The SDK reads `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` from the environment, so no ERB is needed. Neon needs path-style requests, which is what `force_path_style: true` sets (see [Object Storage authentication](/docs/storage/authentication)):

```yaml filename="config/storage.yml"
neon:
  service: S3
  bucket: <bucket-name>
  force_path_style: true
```

Then set `config.active_storage.service = :neon` in `config/environments/development.rb`. Rails 8.1 sets `:local` in `config/environments/production.rb`, so change that line there too. See [Active Storage's S3 service](https://guides.rubyonrails.org/active_storage_overview.html) for the other options.

<DefinitionList>

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: `neon env pull` writes the default AI Gateway credential to `.env`. Call the gateway over HTTP from your controllers. See [AI Gateway](/docs/ai-gateway/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Enable it with `neon realtime enable --allowed-origin http://localhost:3000`, using the origin your frontend loads from. Its packages are `@neon/realtime/client` for the browser, `@neon/realtime/server` for a Node.js server, and `@neon/realtime-react` for React. See [Realtime](/docs/realtime/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Use a function for work that outlasts a request, and call it from Rails over HTTP. See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

Rails connects to a local socket instead of Neon
: Rails didn't load `DATABASE_URL`, so it fell back to its `database.yml` defaults, which have no host. Check that `.env` exists and has the variable. Dotenv loads `.env.local` in development but not in test, so keep the variables in `.env`. Restart the server after you change `.env`.

`Endpoint ID is not specified`
: The PostgreSQL client library that the `pg` gem links against is too old to send the server name Neon uses for routing. Upgrade libpq, then run `bundle install` again. Neon's [connection errors](/docs/connect/connection-errors#the-endpoint-id-is-not-specified) page lists the other workarounds.

`Failed to build gem native extension` while installing `pg`
: The `pg` gem needs PostgreSQL's client library and its `pg_config`. Install them, then run `bundle install` again. On macOS with Homebrew, the template's comments give `gem install pg -- --with-pg-config=/opt/homebrew/bin/pg_config`. With Bundler, use `bundle config set --local build.pg --with-pg-config=/opt/homebrew/bin/pg_config`.

Production can't reach the cache, queue, or cable database
: That database's variable (`CACHE_DATABASE_URL`, `QUEUE_DATABASE_URL`, or `CABLE_DATABASE_URL`) is missing, so Rails connects over a local Unix socket instead of Neon. Set it to the pooled string with no database name, as in Deploy.

`db:prepare` can't connect to the `postgres` database
: Rails connects to a database named `postgres` before it creates yours. Every Neon project has a system-owned `postgres` database, where the `neon` extension is installed ([extensions/neon](/docs/extensions/neon)). If the role in your `DATABASE_URL` can't connect there, `bin/rails db:prepare` fails. In that case, create the development database with the CLI on your `dev` branch, then run the command again: `neon databases create --name my_app_development --owner-name <role> --branch dev`. Use your app's database name, and the role from your `DATABASE_URL`. The `--owner-name` flag is needed only when the branch has more than one role.

Older Rails versions
: Under [Rails' maintenance policy](https://guides.rubyonrails.org/maintenance_policy.html), minor releases get security fixes for two years after their first release. Rails 7.2.0 was released on August 9, 2024, and Rails 8.0.0 on November 7, 2024, so both are out of support as of this writing. Upgrade to Rails 8.1 with the [upgrade guide](https://guides.rubyonrails.org/upgrading_ruby_on_rails.html). Until you do, Rails 8.0 uses the same production databases and Deploy steps as written. Rails 7.2 has one production database: set only `DATABASE_URL` in production, and skip the `CACHE_DATABASE_URL`, `QUEUE_DATABASE_URL`, and `CABLE_DATABASE_URL` variables.

</DefinitionList>

## Next steps

- **Create your first table:** run `bin/rails generate model`, then run `DATABASE_URL="$(sed -n 's/^DATABASE_URL_UNPOOLED="\{0,1\}\([^"]*\)"\{0,1\}$/\1/p' .env)" bin/rails db:migrate`. For models and migrations, see [Schema migration with Ruby on Rails](/docs/guides/rails-migrations). That guide's `database.yml` sample has one production database and no Solid databases, so follow Deploy in this guide for production.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
