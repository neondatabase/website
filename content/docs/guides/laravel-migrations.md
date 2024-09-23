---
title: Schema migration with Neon Postgres and Laravel
subtitle: Set up Neon Postgres and run migrations for your Laravel project
enableTableOfContents: true
updatedOn: '2024-09-23T22:33:41.224Z'
---

[Laravel](https://laravel.com/) is a popular PHP web application framework that provides an expressive and elegant syntax for building web applications. It includes an ORM (Object-Relational Mapping) called Eloquent, which allows you to interact with databases using a fluent API. Laravel also provides a powerful migration system to manage database schema changes over time.

This guide demonstrates how to use Laravel with the Neon Postgres database. We'll create a simple Laravel application and walk through the process of setting up the database, defining models, and generating and running migrations to manage schema changes.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- [PHP](https://www.php.net/) installed on your local machine. This guide uses PHP 8.1, but you can use any recent version compatible with Laravel.
- [Composer](https://getcomposer.org/) installed on your local machine for managing PHP dependencies.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select a project or click the **New Project** button to create a new one.

### Retrieve your Neon database connection string

On the Neon project dashboard, navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="note">
We recommend using a direct (non-pooled) connection string when performing migrations. Using a pooled connection string for migrations can be prone to errors.
</Admonition>

Keep your connection string handy for later use.

## Setting up the Laravel project

### Create a new Laravel project

Open your terminal and navigate to the directory where you want to create your Laravel project. Run the following command to create a new Laravel project:

```bash
composer create-project --prefer-dist laravel/laravel guide-neon-laravel
```

This command creates a new Laravel project named `guide-neon-laravel` in the current directory.

### Set up the Database configuration

Open the `.env` file in the project root directory and update the following database connection variables:

```bash
DB_CONNECTION=pgsql
DB_PORT=5432
DATABASE_URL=NEON_POSTGRES_CONNECTION_STRING
```

Replace `NEON_POSTGRES_CONNECTION_STRING` with the connection string you retrieved from the Neon Console earlier. The `DB_CONNECTION` should be set to `pgsql` to indicate that we are using a Postgres database.

## Defining data models and running migrations

### Specify the data model

Data models are defined using the `Elquent` ORM in Laravel. Our application is a simple catalog of authors and books, where each author can have multiple books. We'll create two models, `Author` and `Book`, to represent the data.

Create a new file `Author.php` in the `app/Models` directory with the following code:

```php
<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $fillable = ['name', 'bio'];
    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
```

Create another file `Book.php` in the `app/Models` directory with the following code:

```php
<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = ['title', 'author_id'];
    public function author()
    {
        return $this->belongsTo(Author::class);
    }
}
```

The `Author` model represents an author with fields for name and bio. The `Book` model represents a book with fields for title and author (as a foreign key to the `Author` model). Laravel automatically creates an `id` field for each model as the primary key and manages the `created_at` and `updated_at` timestamps.

### Generate migration files

To generate migration files for creating the `authors` and `books` tables, run the following commands in the terminal:

```bash
php artisan make:migration create_authors_table
php artisan make:migration create_books_table
```

These commands generate empty migration files in the `database/migrations` directory. Unlike frameworks such as Django, Laravel does not generate the schema automatically based on the model definitions. Instead, you define the schema in the migration files.

Open the `create_authors_table` migration file and update the `up` method to define the table schema:

```php
public function up()
{
    Schema::create('authors', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('bio')->nullable();
        $table->timestamps();
    });
}
```

Similarly, open the `create_books_table` migration file and update the `up` method:

```php
public function up()
{
    Schema::create('books', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->unsignedBigInteger('author_id');
        $table->timestamps();

        $table->foreign('author_id')->references('id')->on('authors')->onDelete('cascade');
    });
}
```

### Apply the migration

To apply the migration and create the corresponding tables in the Neon Postgres database, run the following command:

```bash
php artisan migrate
```

This command executes the migration files and creates the `authors` and `books` tables in the database.

### Seed the database

To populate the database with some initial data, we use Laravel's database seeding feature. Open the file `DatabaseSeeder.php` in the `database/seeders` directory and replace its contents with the following code:

```php
<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $authors = [
            [
                'name' => 'J.R.R. Tolkien',
                'bio' => 'The creator of Middle-earth and author of The Lord of the Rings.',
                'books' => [
                    ['title' => 'The Fellowship of the Ring'],
                    ['title' => 'The Two Towers'],
                    ['title' => 'The Return of the King'],
                ],
            ],
            [
                'name' => 'George R.R. Martin',
                'bio' => 'The author of the epic fantasy series A Song of Ice and Fire.',
                'books' => [
                    ['title' => 'A Game of Thrones'],
                    ['title' => 'A Clash of Kings'],
                    ['title' => 'A Storm of Swords'],
                ],
            ],
            [
                'name' => 'J.K. Rowling',
                'bio' => 'The creator of the Harry Potter series.',
                'books' => [
                    ['title' => 'Harry Potter and the Philosopher\'s Stone'],
                    ['title' => 'Harry Potter and the Chamber of Secrets'],
                ],
            ],
        ];

        foreach ($authors as $authorData) {
            $author = Author::create([
                'name' => $authorData['name'],
                'bio' => $authorData['bio'],
            ]);

            foreach ($authorData['books'] as $bookData) {
                $author->books()->create($bookData);
            }
        }
    }
}
```

This seeder creates three authors and associates them with their corresponding books. To run this script and populate the database, run the following command in the terminal:

```bash
php artisan db:seed
```

## Implement the application

### Create routes and controllers

We'll create two routes and corresponding controllers to display the authors and books in our application.

Open the `routes/web.php` file and add the following routes:

```php
...

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;

...

Route::get('/authors', [AuthorController::class, 'index'])->name('authors.index');
Route::get('/books/{author}', [BookController::class, 'index'])->name('books.index');
```

We define two routes: `/authors` to list all authors and `/books/{author}` to list books by a specific author.

Now, create a new file `AuthorController.php` in the `app/Http/Controllers` directory with the following code:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Author;

class AuthorController extends Controller
{
    public function index()
    {
        $authors = Author::all();
        return response()->json($authors);
    }
}
```

Similarly, create another file `BookController.php` in the `app/Http/Controllers` directory with the following code:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Author;

class BookController extends Controller
{
    public function index(Author $author)
    {
        $books = $author->books;
        return response()->json($books);
    }
}
```

These controllers define the `index` action to retrieve all authors and books by a specific author, respectively. The data is returned as JSON responses.

### Run the Laravel development server

To start the Laravel development server and test the application, run the following command:

```bash
php artisan serve
```

Navigate to the url `http://localhost:8000/authors` in your browser to view the list of authors. You can also view the books by a specific author by visiting `http://localhost:8000/books/{author_id}`.

## Applying schema changes

We will demonstrate how to handle schema changes by adding a new field `country` to the `Author` model, which will store the author's country of origin.

### Update the data model

Open the `Author.php` file in the `app/Models` directory and add the `country` field to the `$fillable` property:

```php
protected $fillable = ['name', 'bio', 'country'];
```

### Generate and run the migration

To generate a new migration file for the schema change, run the following command:

```bash
php artisan make:migration add_country_to_authors_table
```

This command generates a new migration file in the `database/migrations` directory.

Open the generated migration file and update the `up` method to add the new `country` column:

```php
public function up()
{
    Schema::table('authors', function (Blueprint $table) {
        $table->string('country')->nullable()->after('bio');
    });
}
```

Now, to apply the migration, run the following command:

```bash
php artisan migrate
```

### Test the schema change

Restart the Laravel development server:

```bash
php artisan serve
```

Navigate to the url `http://localhost:8000/authors` to view the list of authors. Each author entry now includes the `country` field set to `null`, reflecting the schema change.

## Conclusion

In this guide, we demonstrated how to set up a Laravel project with `Neon` Postgres, define database models using Eloquent, generate migrations, and run them. Laravel's Eloquent ORM and migration system make it easy to interact with the database and manage schema evolution over time.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-laravel" description="Run Neon database migrations in a Laravel project" icon="github">Migrations with Neon and Laravel</a>
</DetailIconCards>

## Resources

For more information on the tools and concepts used in this guide, refer to the following resources:

- [Laravel Documentation](https://laravel.com/docs)
- [Neon Postgres](https://neon.tech/docs/introduction)

<NeedHelp/>
