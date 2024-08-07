---
title: Schema migration with Neon Postgres and Ruby on Rails
subtitle: Set up Neon Postgres and run migrations for your Rails project
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.405Z'
---

[Ruby on Rails](https://rubyonrails.org/) is a popular web application framework for Ruby developers. It provides an ORM (Object-Relational Mapping) layer called `Active Record`, that simplifies database interactions and schema management. Rails also includes a powerful migration system that allows you to define and manage database schema changes over time.

This guide demonstrates how to run schema migrations in your Ruby on Rails project backed by the `Neon` Postgres database. We'll create a simple Rails application and walk through the process of setting up the database, defining models, and generating and running migrations to manage schema changes.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.

- [Ruby](https://www.ruby-lang.org/) installed on your local machine.

  You can install Ruby using the instructions provided on the [official Ruby website](https://www.ruby-lang.org/en/documentation/installation/). We recommend using a newer version of Ruby, 3.0 or higher.

- [Rails](https://rubyonrails.org/) installed on your local machine. You can install Rails by running `gem install rails`.

  We recommend using Rails 6 or higher. This project uses `Rails 7.1.3.2`.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select a project or click the **New Project** button to create a new one.

### Retrieve your Neon database connection string

On your project dashboard in Neon, navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

## Setting up the Rails project

### Create a new Rails project

Open your terminal and run the following command to create a new Rails project:

```bash
rails new guide-neon-rails --database=postgresql
```

This command creates a new Rails project named `guide-neon-rails` with Postgres as the default database. It will also generate the necessary project files and directories, and install the required dependencies.

### Set up the Database configuration

Create a `.env` file in the project root directory and add the `DATABASE_URL` environment variable to it. Use the connection string that you obtained from the Neon Console earlier:

```bash
# .env

DATABASE_URL=NEON_POSTGRES_CONNECTION_STRING
```

For Rails to load the environment variables automatically from the `.env` file, add the `dotenv-rails` gem to the `Gemfile` at the root of your project:

```ruby
# Gemfile

gem 'dotenv-rails', groups: [:development, :test]
```

Then, run `bundle install` to install the gem.

Finally, we open the `config/database.yml` file in your project directory and update the `default` section so that Rails uses the `DATABASE_URL` environment variable to connect to the `Neon` database.

```yaml
# database.yml

default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  url: <%= ENV['DATABASE_URL'] %>

development:
  <<: *default

test:
  <<: *default

production:
  <<: *default
```

## Defining data models and running migrations

### Generate models and migrations

Next, we will create the data models for our application. Run the following commands to generate the `Author` and `Book` models:

```bash
rails generate model Author name:string bio:text
rails generate model Book title:string author:references
```

These commands generate model files and the corresponding migration files in the `app/models` and `db/migrate` directories, respectively.

### Run the migrations

To run the migrations and create the corresponding tables in the Neon Postgres database, run the following command:

```bash
rails db:migrate
```

This command executes the migration files and creates the `authors` and `books` tables in the database. Additionally, it also creates some tables for its internal bookkeeping.

### Seed the database

To populate the database with some initial data, open the `db/seeds.rb` file and add the following code:

```ruby
# db/seeds.rb

# Find or create authors
authors_data = [
  {
    name: "J.R.R. Tolkien",
    bio: "The creator of Middle-earth and author of The Lord of the Rings."
  },
  {
    name: "George R.R. Martin",
    bio: "The author of the epic fantasy series A Song of Ice and Fire."
  },
  {
    name: "J.K. Rowling",
    bio: "The creator of the Harry Potter series."
  }
]

authors_data.each do |author_attrs|
  Author.find_or_create_by(name: author_attrs[:name]) do |author|
    author.bio = author_attrs[:bio]
  end
end

# Find or create books
books_data = [
  { title: "The Fellowship of the Ring", author_name: "J.R.R. Tolkien" },
  { title: "The Two Towers", author_name: "J.R.R. Tolkien" },
  { title: "The Return of the King", author_name: "J.R.R. Tolkien" },
  { title: "A Game of Thrones", author_name: "George R.R. Martin" },
  { title: "A Clash of Kings", author_name: "George R.R. Martin" },
  { title: "Harry Potter and the Philosopher's Stone", author_name: "J.K. Rowling" },
  { title: "Harry Potter and the Chamber of Secrets", author_name: "J.K. Rowling" }
]

books_data.each do |book_attrs|
  author = Author.find_by(name: book_attrs[:author_name])
  Book.find_or_create_by(title: book_attrs[:title], author: author)
end
```

To run the seed file and populate the database with the initial data, run the following command:

```bash
rails db:seed
```

This command inserts the sample authors and books data into the database. Note that the script looks for existing records before creating new ones, so you can run it multiple times without duplicating the data.

## Implement the application

### Create controllers and views

Next, we will create controllers and views to display the authors and books in our application. Run the following commands to generate the controllers:

```bash
rails generate controller Authors index
rails generate controller Books index
```

These commands generate controller files and corresponding view files in the `app/controllers` and `app/views` directories.

Open the `app/controllers/authors_controller.rb` file and update the `index` action:

```ruby
# app/controllers/authors_controller.rb

class AuthorsController < ApplicationController
  def index
    @authors = Author.all
  end
end
```

Similarly, open the `app/controllers/books_controller.rb` file and update the `index` action:

```ruby
# app/controllers/books_controller.rb

class BooksController < ApplicationController
  def index
    @author = Author.find(params[:author_id])
    @books = @author.books
  end
end
```

Now, we update the corresponding views to display the data. Open the `app/views/authors/index.html.erb` file and add the following code:

```erb
<!-- app/views/authors/index.html.erb -->

<h1>Authors</h1>
<ul>
  <% @authors.each do |author| %>
    <li>
      <%= author.name %> - <%= link_to 'Books', author_books_path(author_id: author.id) %>
    </li>
  <% end %>
</ul>
```

Open the `app/views/books/index.html.erb` file and add the following code:

```erb
<!-- app/views/books/index.html.erb -->

<h1>Books by <%= @author.name %></h1>

<ul>
  <% @books.each do |book| %>
    <li><%= book.title %></li>
  <% end %>
</ul>
```

### Define routes

Open the `config/routes.rb` file and define the routes for the authors and books:

```ruby
# config/routes.rb

Rails.application.routes.draw do
    resources :authors, only: [:index]
    get '/books/:author_id', to: 'books#index', as: 'author_books'
end
```

### Run the Rails server

To start the Rails server and test the application, run the following command:

```bash
rails server
```

Navigate to the url `http://localhost:3000/authors` in your browser to view the list of authors. You can also view the books by a specific author by clicking on the "Books" link next to each author, which takes you to the `http://localhost:3000/books/:author_id` route.

## Applying schema changes

We will demonstrate how to handle schema changes by adding a new field `country` to the `Author` model, to store the author's country of origin.

### Generate a migration

To generate a migration file for adding the `country` field to the `authors` table, run the following command:

```bash
rails generate migration AddCountryToAuthors country:string
```

This command generates a new migration file in the `db/migrate` directory.

### Run the migration

To run the migration and apply the schema change, run the following command:

```bash
rails db:migrate
```

This command executes the migration file and adds the `country` column to the `authors` table in the database.

### Update the existing records

To update the existing records with the author's country, open the `db/seeds.rb` file and update the authors data with the country information:

```ruby
authors_data = [
  {
    name: "J.R.R. Tolkien",
    bio: "The creator of Middle-earth and author of The Lord of the Rings.",
    country: "United Kingdom"
  },
  {
    name: "George R.R. Martin",
    bio: "The author of the epic fantasy series A Song of Ice and Fire.",
    country: "United States"
  },
  {
    name: "J.K. Rowling",
    bio: "The creator of the Harry Potter series.",
    country: "United Kingdom"
  }
]

authors_data.each do |author_attrs|
  author = Author.find_or_initialize_by(name: author_attrs[:name])
  author.assign_attributes(author_attrs)
  author.save if author.changed?
end
```

Run the seed file again to update the existing records in the database:

```bash
rails db:seed
```

### Test the schema change

Update the `app/views/authors/index.html.erb` file to display the country alongside each author:

```erb
<!-- app/views/authors/index.html.erb -->

<h1>Authors</h1>
<ul>
  <% @authors.each do |author| %>
    <li>
      <%= author.name %> - <%= author.country %> - <%= link_to 'Books', author_books_path(author_id: author.id) %>
    </li>
  <% end %>
</ul>
```

Now, restart the Rails server:

```bash
rails server
```

Navigate to the url `http://localhost:3000/authors` to view the list of authors. The `country` field is now available for each author, reflecting the schema change.

## Conclusion

In this guide, we demonstrated how to set up a Ruby on Rails project with Neon Postgres, define database models, generate migrations, and run them. Rails' Active Record ORM and migration system make it easy to interact with the database and manage schema evolution over time.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-rails" description="Run migrations in a Neon-Rails project" icon="github">Migrations with Neon and Rails</a>
</DetailIconCards>

## Resources

For more information on the tools and concepts used in this guide, refer to the following resources:

- [Ruby on Rails Guides](https://guides.rubyonrails.org/)
- [Active Record Migrations](https://guides.rubyonrails.org/active_record_migrations.html)
- [Neon Postgres](https://neon.tech/docs/introduction)

<NeedHelp/>
