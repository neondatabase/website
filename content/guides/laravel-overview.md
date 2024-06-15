---
title: An Overview of Laravel and Postgres on Neon
subtitle: Learn how to integrate Laravel with Postgres on Neon, leveraging Laravel's Eloquent ORM and migrations for efficient database management.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-05-25T00:00:00.000Z'
updatedOn: '2024-05-25T00:00:00.000Z'
---

When combining the robust features of [Laravel](https://laravel.com/), a highly expressive PHP framework, with the efficiency and scalability of Postgres on Neon, developers gain a powerful toolset for web development.

Laravel's native support for Postgres ensures a smooth integration process. When working with Neon Postgres, the transition is nearly seamless, thanks to Laravel's database agnostic [migrations](https://laravel.com/docs/11.x/migrations) and [Eloquent ORM](https://laravel.com/docs/11.x/eloquent), which effortlessly maps application objects to database tables.

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Setting Up Your Environment for Laravel and Neon Postgres

Start by installing Laravel. For installation instructions, refer to the [Laravel documentation](https://laravel.com/docs/11.x/installation).

To get Laravel working with Neon Postgres, you'll need to configure your environment settings.

This process involves updating the `.env` file in your Laravel project to include the details for your Neon Postgres database connection.

Here's what you need to update in the `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=<your-database-name>
DB_USERNAME=<your-username>
DB_PASSWORD=<your-password>
```

- `DB_CONNECTION`: This tells Laravel that you're using a PostgreSQL database.
- `DB_HOST`: Here, you'll put the address of your Neon database.
- `DB_PORT`: This is the port number for PostgreSQL, which is usually 5432.
- `DB_DATABASE`: The name of your database on Neon.
- `DB_USERNAME` and `DB_PASSWORD`: Your login credentials for the Neon database.

With these settings, Laravel can connect to your Neon Postgres database, allowing your application to interact with it.

## Using Eloquent and Migrations in Laravel

Laravel's migration system and Eloquent ORM are powerful tools that simplify database management and interaction.

When you use Eloquent with Neon Postgres, it allows you to handle database operations without writing any SQL queries directly, thanks to Laravel's expressive syntax. Along with the Laravel migration system, you can easily manage your database schema and perform operations like creating tables, defining relationships, and querying data.

### Database Migrations and Schema Management

Laravel's migration system is an essential tool for database schema management. Migrations ensure that your database structure is properly version-controlled.

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

Once you've defined the schema, you can run the migration to create the table in your Neon Postgres database:

```bash
php artisan migrate
```

This will execute the migration and create the `books` table in your database and keep track of the migration history.

### Defining Models in Laravel

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

Additionally, in the model, you can define relationships with other models, set up mutators and accessors, and perform various database operations.

### Creating and Saving Records

With the model set up, you can create and save new records to your database using Eloquent.

In your controller or wherever you need to create a new record, you can instantiate the model, set its properties, and save it:

```php
$book = new Book;
$book->title = 'Sample Book';
$book->author_id = 1;
$book->publication_year = 2021;
$book->save();
```

This creates a new instance of the `Book` model, sets its properties (`title`, `author_id`, `publication_year`), and then saves the new record to the `books` table in your Neon Postgres database.

Using Eloquent, you can manage your database records with simple, expressive syntax, making your code cleaner and more maintainable.

## Using Queries Efficiently

When building an application, it's important to write efficient queries. The same is true when working with Laravel and Postgres.

Laravel's Eloquent ORM has features like relationships and eager loading that help you write better queries.

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

Leveraging Postgres's advanced features within your Laravel application can significantly boost performance, enhance data integrity, and provide flexible data storage options.

### Utilizing Indexes

Indexes are a crucial aspect of database optimization, especially when dealing with large datasets. They work by creating a data structure that allows the database engine to quickly locate and retrieve the data without scanning the entire table.

For instance, if your application includes a feature that allows users to search for books by their titles, querying a large database without an index can be time-consuming. By indexing the `title` column, you significantly improve query performance:

```php
Schema::table('books', function (Blueprint $table) {
    $table->index('title');
});
```

After adding the index, queries that search for books by title, like the one below, become much more efficient, reducing the response time for your users:

```php
$books = Book::where('title', 'like', '%search-term%')->paginate(10);
```

### Ensuring Data Integrity with Foreign Key Constraints

Foreign key constraints are vital for maintaining referential integrity between tables. They ensure that relationships between tables remain consistent, preventing orphaned records and ensuring data accuracy.

In the context of a book application, where each book is linked to an author, defining a foreign key constraint ensures that every book in your database is tied to an existing author. Here's how you can define such a constraint in a Laravel migration:

```php
Schema::table('books', function (Blueprint $table) {
    $table->foreign('author_id')->references('id')->on('authors')->onDelete('cascade');
});
```

By using the `foreign()` method, you can ensure that when an author is deleted, all their books are also removed from the database, preventing orphaned records and maintaining the integrity of your data.

### Leveraging JSONB for Flexible Data Storage

Postgres's JSONB data type offers a powerful way to store and query JSON data, providing flexibility for your application's data storage needs. Unlike the standard JSON data type, JSONB stores data in a decomposed binary format, allowing for efficient querying.

Imagine you want to store various metadata about each book, such as tags, reviews, or custom attributes. The JSONB data type allows you to store this information in a structured, queryable format:

```php
Schema::table('books', function (Blueprint $table) {
    $table->jsonb('metadata')->nullable();
});
```

With this `metadata` column, you can easily store and retrieve structured data related to each book, making your application more flexible and adaptable to changing requirements.

By integrating these Postgres features into your Laravel application, you can enhance its performance, maintain data integrity, and provide a scalable solution for managing complex data structures.

## Testing and Neon Postgres Branches

When integrating Neon Postgres with your Laravel application, leveraging database branches for testing is a robust strategy to ensure the reliability and consistency of your tests.

Neon Postgres Branches allow you to create isolated database environments, similar to branching in version control systems like Git. By using a separate database branch for testing, you ensure that your test executions are isolated from your production data, maintaining data integrity and consistency.

Usually, when running tests in Laravel, you would use a separate database for testing to avoid affecting your production data. In most cases, developers use an in-memory SQLite database for testing. However, Neon Postgres branches offer a more solid solution for testing your Laravel application.

1. Neon Postgres lets you create branches of your database. This means you can have a dedicated branch just for testing purposes, where you can freely run tests, apply migrations, and modify data without affecting your production database.

2. With a testing branch, you can execute your entire suite of tests in an environment that mirrors production without the risk of corrupting your actual production data. This is particularly useful for integration tests that interact with the database.

3. Configuring your Laravel application to use a separate database branch for testing is straightforward. You adjust your testing environment configuration to point to the testing branch of your Neon Postgres database, ensuring that when Laravel runs tests, it uses this isolated database instance.

## Conclusion

Combining Laravel with Postgres on Neon offers a powerful and efficient environment for developing web applications. Laravel's seamless integration with Postgres allows developers to take advantage of the full power of both the framework and the database, providing a flexible, scalable, and developer-friendly platform.

The ability to use database branches for testing with Neon Postgres brings an additional layer of robustness to your development process, allowing for isolated testing environments that mirror your production setup without risking data integrity.

Laravel's expressive syntax combined with Neon Postgres's powerful features allow developers to build complex, data-driven applications efficiently and effectively.
