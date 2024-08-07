---
title: Connect a Ruby on Rails application to Neon Postgres
subtitle: Set up a Neon project in seconds and connect from a Ruby on Rails application
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.664Z'
---

[Ruby on Rails](https://rubyonrails.org/), also known simply as Rails, is an open-source web application framework written in Ruby. It uses a model-view-controller architecture, making it a good choice for developing database-backed web applications. This guide shows how to connect to a Ruby on Rails application to a Neon Postgres database.

To connect to Neon from a Ruby on Rails application:

1. [Create a Neon Project](#create-a-neon-project)
2. [Create a Rails Project](#create-a-rails-project)
3. [Configure a PostgreSQL Database using Rails](#configure-a-postgresql-database-using-rails)
4. [Create a Rails Controller](#create-a-rails-controller-to-query-the-database)
5. [Run the application](#run-the-application)

This guide was tested using Ruby v3.3.0 and Rails v7.1.2.

## Create a Neon Project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Rails Project

Create a Rails project using the [Rails CLI](https://guides.rubyonrails.org/command_line.html), and specify PostgreSQL as the database type:

```shell
gem install rails
rails new neon-with-rails --database=postgresql
```

You now have a Rails project in a folder named `neon-with-rails`.

## Configure a PostgreSQL Database using Rails

Create a `.env` file in the root of your Rails project, and add the connection string for your Neon compute. Do not specify a database name after the forward slash in the connection string. Rails will choose the correct database depending on the environment.

```shell shouldWrap
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/
```

<Admonition type="note">
You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).
</Admonition>

<Admonition type="important">
The role you specified in the `DATABASE_URL` must have **CREATEDB** privileges. Roles created in the Neon Console, CLI, or API, including the default role created with a Neon project, are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the `CREATEDB` privilege. Alternatively, you can create roles with SQL to grant specific privileges. See [Manage database access](/docs/manage/database-access).
</Admonition>

Create the development database by issuing the following commands from the root of your project directory:

```shell
# Load the DATABASE_URL into your session
source .env

# Create the development database
bin/rails db:create
```

## Create a Rails Controller to Query the Database

Run the following command to create a controller and view. The controller will query the database version and supply it to the view file to render a web page that displays the PostgreSQL version.

```shell
rails g controller home index
```

Replace the controller contents at `app/controllers/home_controller.rb` with:

```ruby
class HomeController < ApplicationController
  def index
    @version = ActiveRecord::Base.connection.execute("SELECT version();").first['version']
  end
end
```

Replace the contents of the view file at `app/views/home/index.html.erb` with:

```ruby
<% if @version %>
  <p><%= @version %></p>
<% end %>
```

Replace the contents of `config/routes.rb` with the following code to serve your home view as the root page of the application:

```ruby
Rails.application.routes.draw do.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root 'home#index'
end
```

## Run the application

Start the application using the Rails CLI from the root of the project:

```shell
bin/rails server -e development
```

Visit [localhost:3000/](http://localhost:3000/) in your web browser. Your Neon database's Postgres version will be displayed. For example:

```
PostgreSQL 15.5 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
```

## Schema migration with Ruby on Rails

For schema migration with Ruby on Rails, see our guide:

<DetailIconCards>

<a href="/docs/guides/rails-migrations" description="Schema migration with Neon Postgres and Ruby on Rails" icon="app-store" icon="app-store">Ruby on Rails Migrations</a>

</DetailIconCards>

<NeedHelp/>
