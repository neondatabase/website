---
title: Scale your Laravel application with Lakebase Postgres read replicas
subtitle: Learn how to scale Laravel applications with Lakebase Postgres read replicas
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2024-10-20T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

## Introduction

[Neon read replicas](/docs/introduction/read-replicas) are independent read-only computes. Sending read queries to replicas takes load off your primary compute, which helps read-heavy applications.

In the lakebase architecture, read replicas read from the same storage as the primary compute, so adding one doesn't duplicate your data or add storage costs. You pay only for the replica's compute time.

This guide shows how to use Neon read replicas to scale Laravel applications. You'll configure Laravel's database connections to send reads to a replica, using a simple URL shortener application as the example.

## Prerequisites

- A Neon account and a project. If you don't have one, you can sign up for a Neon account and create a project by following the [Sign up guide](/docs/get-started/signing-up).
- Basic knowledge of [Laravel](https://laravel.com/docs) and PHP
- [Composer](https://getcomposer.org/) installed on your local machine
- [PHP](https://www.php.net/manual/en/install.php) installed on your local machine

## Build the URL shortener app

To demonstrate how to use Neon read replicas with Laravel, we'll build a simple URL shortener application that uses a Neon database. We'll then update the application to send read operations to a read replica.

### Part 1: Build the URL shortener app with a single database

#### Set up the project

Create a new Laravel project:

```bash
laravel new url-shortener

 ┌ Would you like to install a starter kit? ────────────────────┐
 │ No starter kit                                               │
 └──────────────────────────────────────────────────────────────┘

 ┌ Which testing framework do you prefer? ──────────────────────┐
 │ Pest                                                         │
 └──────────────────────────────────────────────────────────────┘

 ┌ Would you like to initialize a Git repository? ────────┐
 │ Yes                                                    │
 └────────────────────────────────────────────────────────┘

 ┌ Which database will your application use? ────────────┐
 │ PostgreSQL                                            │
 └───────────────────────────────────────────────────────┘

 ┌ Default database updated. Would you like to run the default database migrations? ┐
 │ No                                                                               │
 └─────────────────────────────────────────────────────────────────────────────────┘
 cd url-shortener
```

#### Configure the database connection

Update your `.env` file with your Neon database credentials:

```
DB_CONNECTION=pgsql
DB_HOST=your-neon-host
DB_PORT=5432
DB_DATABASE=your-database-name
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

#### Create the database schema

Create a new migration for the `urls` table:

```bash
php artisan make:migration create_urls_table
```

Edit the migration file in `database/migrations`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUrlsTable extends Migration
{
    public function up()
    {
        Schema::create('urls', function (Blueprint $table) {
            $table->id();
            $table->string('original_url');
            $table->string('short_code')->unique();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('urls');
    }
}
```

Run the migration:

```bash
php artisan migrate
```

<Admonition type="important">
Neon supports both direct and pooled database connection strings, which you can copy from the **Connect** modal (**Connect** in the Console nav). A pooled connection string connects your application to the database via a PgBouncer connection pool, which supports up to 10,000 client connections per compute. Neon's PgBouncer runs in transaction mode, which doesn't support session-level features such as `SET` and advisory locks that some migration tools rely on. For this reason, use a direct (non-pooled) connection when performing migrations. For more information about direct and pooled connections, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

#### Create the model

Create a new model for the URL:

```bash
php artisan make:model Url
```

Edit `app/Models/Url.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Url extends Model
{
    use HasFactory;

    protected $fillable = ['original_url', 'short_code'];
}
```

#### Create the controller

Create a new controller for handling URL operations:

```bash
php artisan make:controller UrlController
```

Edit `app/Http/Controllers/UrlController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UrlController extends Controller
{
    public function shorten(Request $request)
    {
        $request->validate([ 'url' => 'required|url' ]);

        $url = Url::create([
            'original_url' => $request->url,
            'short_code' => Str::random(6),
        ]);

        return response()->json([ 'short_url' => url($url->short_code) ], 201);
    }

    public function redirect($shortCode)
    {
        $url = Url::where('short_code', $shortCode)->firstOrFail();
        return redirect($url->original_url);
    }
}
```

#### Set up the routes

Edit `routes/web.php`:

```php
<?php

use App\Http\Controllers\UrlController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () { return view('home'); });
Route::post('/shorten', [UrlController::class, 'shorten']);
Route::get('/{shortCode}', [UrlController::class, 'redirect']);
```

#### Create a simple frontend

Create a new blade template `resources/views/home.blade.php`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>URL Shortener</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 flex min-h-screen items-center justify-center">
    <div class="w-96 rounded-lg bg-white p-8 shadow-md">
      <h1 class="mb-4 text-2xl font-bold">URL Shortener</h1>
      <form id="urlForm" class="mb-4">
        <input
          type="url"
          id="urlInput"
          placeholder="Enter URL to shorten"
          required
          class="mb-2 w-full rounded border p-2"
        />
        <button type="submit" class="bg-blue-500 hover:bg-blue-600 w-full rounded p-2 text-white">
          Shorten URL
        </button>
      </form>
      <div id="result" class="hidden">
        <p>
          Shortened URL:
          <a id="shortUrl" href="#" target="_blank" class="text-blue-500"></a>
        </p>
      </div>
    </div>

    <script>
      document.getElementById('urlForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = document.getElementById('urlInput').value;
        const response = await fetch('/shorten', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': '{{ csrf_token() }}',
          },
          body: JSON.stringify({ url }),
        });
        const data = await response.json();
        document.getElementById('shortUrl').href = data.short_url;
        document.getElementById('shortUrl').textContent = data.short_url;
        document.getElementById('result').classList.remove('hidden');
      });
    </script>
  </body>
</html>
```

#### Run the application

Start the Laravel development server:

```bash
php artisan serve
```

Visit `http://localhost:8000` to test the URL shortener app.

![Laravel URL Shortener](/docs/guides/laravel_url_shortener.png)

### Part 2: Use a read replica for read-only operations

#### Create a read replica on Neon

To create a read replica:

1. In the Neon Console, select your branch from the **BRANCH** selector.
2. Under **Postgres database**, select **Computes**.
3. Click **Add Read Replica**.
4. On the **Add new compute** dialog, select **Read replica** as the **Compute type**.
5. Specify the **Compute size settings** options. You can configure a **Fixed Size** compute with a specific amount of RAM (the default) or enable autoscaling by configuring a minimum and maximum compute size. You can also configure the **Suspend compute after inactivity** setting, which is the amount of idle time after which your read replica compute is automatically suspended. The default setting is 5 minutes.
   <Admonition type="note">
   The compute size configuration determines the processing power of your database. More memory means more processing power but also higher compute costs. For information about compute costs, see [Plans](/docs/introduction/plans#compute).
   </Admonition>
6. When you finish making selections, click **Create**.

Your read replica compute is provisioned and appears on the **Computes** tab under **Postgres database**.

To get the read replica connection string, click **Connect** in the Console nav, select the branch where you created the replica, and under **Compute**, select **Replica**:

![Read replica connection string](/docs/guides/read_replica_connection_string.png)

#### Update the database configuration

Edit `config/database.php` to add the read replica configuration:

```php
'pgsql' => [
    'driver' => 'pgsql',
    'read' => [
        'host' => env('DB_READ_HOST'),
    ],
    'write' => [
        'host' => env('DB_WRITE_HOST'),
    ],
    'sticky'    => true,
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => env('DB_CHARSET', 'utf8'),
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'prefer',
]
```

<Admonition type="info">
Now that you've completed the database migrations, you can use the pooled connection string for both read and write operations. For future migrations, use the direct connection string. Migration tools may need session-level features that a transaction-mode pooler doesn't support.
</Admonition>

Update your `.env` file with the read replica host:

```
DB_READ_HOST=your-neon-read-replica-host
DB_WRITE_HOST=your-neon-primary-host
```

## Automatic query routing with Eloquent

[Laravel's Eloquent ORM](https://laravel.com/docs/11.x/eloquent) automatically routes queries to the appropriate database connection based on the type of query. After you configure your read replica, you don't need to change to your existing controller or model code.
Here's how Eloquent handles different types of queries:

- Read operations: `SELECT` queries are automatically routed to the read replica.
- Write operations: `INSERT`, `UPDATE`, and `DELETE` queries are sent to the primary (write) database.

Because of this routing, you can add replicas without changing your application logic.

<Admonition type="tip">
  You can override automatic query routing when needed. For instance, to explicitly use the write connection for querying the urls table, you can do the following:
  ```php
  <?php
  use Illuminate\Support\Facades\DB;
  ...
  
  $url = DB::connection('pgsql::write')->table('urls')->where('short_code', $shortCode)->first();
  ```
</Admonition>

You can find the source code for the application described in this guide on GitHub.
<DetailIconCards>
<a href="https://github.com/dhanushreddy291/neon-read-replica-laravel" description="
Learn how to scale Laravel applications with Lakebase Postgres read replicas" icon="github">Use read replicas with Laravel</a>
</DetailIconCards>

## Conclusion

You configured a Laravel app to send reads to a Neon read replica and writes to the primary compute, without changing controller or model code. As traffic grows, monitor your application's performance and add read replicas as needed.

<NeedHelp/>
