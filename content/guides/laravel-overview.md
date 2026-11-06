---
title: An overview of Laravel and Postgres on Neon
subtitle: Learn how to integrate Laravel with Postgres on Neon, using Laravel's Eloquent ORM and migrations for database management.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-05-25T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

This guide shows how to use [Laravel](https://laravel.com/), a PHP framework, with Neon, a complete set of cloud backend primitives built around Lakebase Postgres. It covers connecting Laravel to a Neon database, using Eloquent and migrations, and testing on Neon branches.

Laravel supports Postgres natively. Its database-agnostic [migrations](https://laravel.com/docs/11.x/migrations) and [Eloquent ORM](https://laravel.com/docs/11.x/eloquent), which maps application objects to database tables, work with Lakebase Postgres without changes.

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details, including your password. You need them to configure Laravel.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Enter a project name, choose a region, and click **Create project**.

## Setting up your environment for Laravel and Neon

Start by installing Laravel. For installation instructions, refer to the [Laravel documentation](https://laravel.com/docs/11.x/installation).

To connect Laravel to your database on Neon, update the `.env` file in your Laravel project with your connection details.

Here's what you need to update in the `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=<your-database-name>
DB_USERNAME=<your-username>
DB_PASSWORD=<your-password>
```

- `DB_CONNECTION`: This tells Laravel that you're using a Postgres database.
- `DB_HOST`: Here, you'll put the address of your Neon database.
- `DB_PORT`: This is the port number for Postgres, which is 5432.
- `DB_DATABASE`: The name of your database on Neon.
- `DB_USERNAME` and `DB_PASSWORD`: Your login credentials for the Neon database.

With these settings, Laravel can connect to your database on Neon.

## Using Eloquent and migrations in Laravel

Eloquent lets you run database operations without writing SQL directly. Migrations let you manage your schema in code: creating tables, defining relationships, and changing columns.

### Database migrations and schema management

Migrations keep your database structure under version control alongside your code.

To create a new migration in Laravel, you use the `make:migration` Artisan command:

```bash
php artisan make:migration create_books_table --create=books
```

This will create a new migration file in the `database/migrations` directory. In this file, you define the schema for the `books` table:

```php
Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->unsignedBigInteger('author_id');
    $table->year('publication_year');
    $table->timestamps();
});
```

Once you've defined the schema, you can run the migration to create the table in your database:

```bash
php artisan migrate
```

This will execute the migration and create the `books` table in your database and keep track of the migration history.

### Defining models in Laravel

First, you define a model that represents a table in your database. Each model corresponds to a table and allows you to interact with the table's records. For example, to create a `Book` model, you would create a `Book.php` file in the `app/Models` directory or run the following Artisan command:

```bash
php artisan make:model Book
```

The command will create a `Book.php` file in the `app/Models` directory.

In the model file, you can define details about the table and its columns:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = ['title', 'author', 'publication_year'];
}
```

The `fillable` array in the model protects your application from mass-assignment vulnerabilities by specifying which attributes should be assignable.

In the model, you can also define relationships with other models, set up mutators and accessors, and perform various database operations.

### Creating and saving records

With the model set up, you can create and save new records to your database using Eloquent.

In your controller or wherever you need to create a new record, you can instantiate the model, set its properties, and save it:

```php
$book = new Book;
$book->title = 'Sample Book';
$book->author_id = 1;
$book->publication_year = 2021;
$book->save();
```

This creates a new instance of the `Book` model, sets its properties (`title`, `author_id`, `publication_year`), and then saves the new record to the `books` table in your database.

## Using queries efficiently

Eloquent has features like relationships and eager loading that help you write better queries.

For example, if you're fetching authors and their books, instead of making a separate database query for each author's books (which can slow things down), you can use eager loading.

Let's say you have an `Author` model with a `books` relationship:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'biography'];

    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
```

With this relationship defined, you can use eager loading to fetch authors and their books in a more efficient way:

```php
$authors = Author::with('books')->get();
```

This code fetches all authors and their associated books, reducing the number of queries made to the database.

## Postgres specific features in Laravel

This section covers three Postgres features you can use from Laravel: indexes, foreign key constraints, and JSONB columns.

### Using indexes

Indexes are a core part of database optimization, especially with large datasets. They work by creating a data structure that lets the database engine locate and retrieve the data without scanning the entire table.

For instance, if your application includes a feature that allows users to search for books by their titles, querying a large database without an index can be time-consuming. Indexing the `title` column speeds up those queries:

```php
Schema::table('books', function (Blueprint $table) {
    $table->index('title');
});
```

After adding the index, queries that search for books by title, like the one below, can use the index instead of scanning the whole table:

```php
$books = Book::where('title', 'like', '%search-term%')->paginate(10);
```

### Ensuring data integrity with foreign key constraints

Foreign key constraints maintain referential integrity between tables, which prevents orphaned records.

In the context of a book application, where each book is linked to an author, defining a foreign key constraint ensures that every book in your database is tied to an existing author. Here's how you can define such a constraint in a Laravel migration:

```php
Schema::table('books', function (Blueprint $table) {
    $table->foreign('author_id')->references('id')->on('authors')->onDelete('cascade');
});
```

With `onDelete('cascade')` on the `foreign()` constraint, deleting an author also deletes all of their books, so no book points to a missing author.

### Using JSONB for flexible data storage

Postgres's JSONB data type lets you store and query JSON data in a column. Unlike the standard JSON data type, JSONB stores data in a decomposed binary format, allowing for efficient querying.

Imagine you want to store various metadata about each book, such as tags, reviews, or custom attributes. The JSONB data type allows you to store this information in a structured, queryable format:

```php
Schema::table('books', function (Blueprint $table) {
    $table->jsonb('metadata')->nullable();
});
```

With this `metadata` column, you can store and query per-book attributes without a schema change each time a new attribute appears.

## Testing and database branches on Neon

Database branches on Neon are isolated copies of your database, similar to branches in Git. Running your tests on a branch keeps them away from production data.

Laravel projects often test against an in-memory SQLite database. A Neon branch lets you test against Postgres with the same schema and data as production instead.

1. Neon lets you create branches of your database. This means you can have a dedicated branch just for testing purposes, where you can freely run tests, apply migrations, and modify data without affecting your production database.

2. With a testing branch, you can execute your entire suite of tests in an environment that mirrors production without the risk of corrupting your actual production data. This is particularly useful for integration tests that interact with the database.

3. To use a testing branch, point your Laravel testing environment configuration at the branch's connection details. Laravel then runs tests against that branch.

## Conclusion

You connected Laravel to a database on Neon, managed its schema with migrations and Eloquent, and used Postgres indexes, foreign keys, and JSONB. For a step-by-step setup of branch-based tests, see [Testing Laravel applications with Neon's database branching](/guides/laravel-test-on-branch).
