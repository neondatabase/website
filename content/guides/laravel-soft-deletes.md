---
title: Implementing Soft Deletes in Laravel and Postgres
subtitle: Learn how to implement and optimize soft deletes in Laravel for improved data management and integrity.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-07-20T00:00:00.000Z'
updatedOn: '2024-07-20T00:00:00.000Z'
---

Laravel is a PHP framework that offers a lot of features to simplify database operations. One such feature is soft deletes, which allows you to "delete" records without actually removing them from your database.

This approach is particularly useful when you need to maintain data integrity, implement data recovery features, or comply with data retention policies.

In this guide, we'll explore Laravel's soft delete functionality, covering everything to get you started, from setting up soft deletes to performance considerations.

## Prerequisites

Before we dive in, ensure you have:

- PHP 8.1 or higher installed
- Laravel 10.x or 11.x set up
- A [Neon](https://neon.tech) account for Postgres database hosting
- Basic understanding of Laravel and Eloquent ORM

## Understanding Soft Deletes

When enabling soft deletes, you essentially add a `deleted_at` timestamp to your database records. When a record is "deleted", Laravel sets this timestamp instead of removing the record entirely. This allows you to:

1. Recover accidentally deleted data.
2. Maintain referential integrity.
3. Implement data archiving strategies.
4. Comply with data retention policies.

Let's explore how to implement soft deletes in Laravel along with Neon Postgres.

## Setting up the Project

Before we go further into implementing soft deletes, let's set up a new Laravel project. If you already have a Laravel project, you can skip this step.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel soft-deletes
cd soft-deletes
```

This will create a new Laravel project in a directory named `soft-deletes`. Navigate to the project directory to continue with the setup.

## Implementing Soft Deletes

Implementing soft deletes in Laravel involves two main steps: preparing the database and updating the model.

For this guide, we'll use a `posts` table as an example. You can apply the same steps to any other table in your application.

### Step 1: Creating the Model and Migration

If you don't already have a model for the table you want to apply soft deletes to, you'll need to create one. Let's start by creating a `Post` model along with a migration file. Laravel provides an Artisan command that can do both in one go:

```bash
php artisan make:model Post -m
```

This command creates two files:

1. `app/Models/Post.php`: The `Post` model file.
2. `database/migrations/xxxx_xx_xx_xxxxxx_create_posts_table.php`: A migration file to create the `posts` table.

The `-m` flag tells Artisan to create a migration file along with the model.

### Step 2: Updating the Migration

Now, let's update the migration file to include the `deleted_at` column required for soft deletes. Open the newly created migration file in the `database/migrations` directory and update the `up` method:

```php
public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->timestamps();
        $table->softDeletes();
    });
}
```

The `softDeletes()` method adds a nullable `deleted_at` timestamp column to your table which Laravel uses for soft deletes.

### Step 3: Running the Migration

With our migration file prepared, we can now run it to create the `posts` table in our database:

```bash
php artisan migrate
```

This command executes all pending migrations, creating the `posts` table with the `deleted_at` column.

If you were to connect to your database, you'd see a new `posts` table with the following columns:

```sql
SELECT * FROM posts;

+----+-------+---------+------------+------------+------------+
| id | title | content | created_at | updated_at | deleted_at |
+----+-------+---------+------------+------------+------------+
```

### Step 4: Updating the Model

Finally, we need to update our `Post` model to use the `SoftDeletes` trait. Open `app/Models/Post.php` and update it as follows:

```php {6,10}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'content'];
}
```

By adding the `use SoftDeletes;` line, we're telling Laravel that this model should use soft delete functionality when deleting records.

With these steps completed, your `Post` model is now set up to use soft deletes. When you call `$post->delete()`, Laravel will set the `deleted_at` timestamp instead of actually removing the record from the database.

### Adding Soft Deletes to an Existing Table

If you're adding soft deletes to an existing table, you'll need to create a separate migration to add the `deleted_at` column. You can do this with the command:

```bash
php artisan make:migration add_soft_deletes_to_posts_table --table=posts
```

This command creates a new migration file where you can add the `deleted_at` column to the `posts` table:

```php
public function up(): void
{
    Schema::table('posts', function (Blueprint $table) {
        $table->softDeletes();
    });
}
```

After creating the migration, run `php artisan migrate` to apply the changes to your database.

## Using Soft Deletes

Now that we've set up soft deletes in our Laravel application, let's explore how to use them in practice. We'll cover basic operations like deleting, restoring, and permanently deleting records, as well as querying with soft deletes.

### Basic Operations

#### Deleting a Record

To soft-delete a record, you can use the `delete()` method just as you would for a regular delete operation:

```php
$post = Post::find(1);
$post->delete();
```

When this code runs, several things happen behind the scenes:

1. Laravel checks if the `SoftDeletes` trait is used in the `Post` model.
2. Instead of running a SQL `DELETE` query, it performs an `UPDATE` query.
3. The `deleted_at` column is set to the current timestamp.
4. The model's `deleted_at` attribute is updated in memory.

This approach allows you to maintain the record in the database while marking it as deleted. It's beneficial when you need to keep records for auditing purposes or when you want to implement a "trash" feature in your application.

If you did not have soft deletes enabled, the `$post->delete()` method would generate the following SQL query:

```sql
DELETE FROM posts WHERE id = {id};
```

However, with soft deletes enabled, the query looks like this:

```sql
UPDATE posts SET deleted_at = '2024-05-26 12:00:00' WHERE id = {id};
```

This way, the record is not removed from the database but is instead marked as "deleted".

If you were to now try to retrieve the post with `Post::find(1)`, it would not return the record because it has been "soft deleted". Under the hood, Laravel automatically adds a `WHERE deleted_at IS NULL` clause to your queries to exclude soft-deleted records, e.g.:

```sql
SELECT * FROM posts WHERE id = 1 AND deleted_at IS NULL;
```

So, you won't see the soft-deleted record in your query results unless you explicitly ask for it.

#### Restoring a Soft-Deleted Record

To bring back a soft-deleted record, you use the `restore()` method on the model:

```php
$post = Post::withTrashed()->find(1);
$post->restore();
```

Here's what happens when you run this code:

1. `withTrashed()` tells Laravel to include soft-deleted records in the query.
2. `find(1)` retrieves the post, even if it's soft-deleted.
3. `restore()` sets the `deleted_at` column back to `NULL`.

This process effectively "undeletes" the record, making it visible in normal queries again.

#### Permanently Deleting a Record

If you need to remove a record from the database permanently, use `forceDelete()`:

```php
$post = Post::withTrashed()->find(1);
$post->forceDelete();
```

This method:

1. Bypasses the soft delete mechanism.
2. Executes a SQL `DELETE` query to permanently remove the record.
3. Removes any associated files or resources if you've set up your model to handle this.

Use `forceDelete()` with caution, as it permanently removes data and can't be undone, unless you have a backup strategy in place.

### Querying with Soft Deletes

Soft deletes affect how you query your database. Laravel provides methods to control whether soft-deleted records are included in query results or not.

#### Retrieving Only Non-Deleted Records

By default, Laravel excludes soft-deleted records from query results:

```php
$activePosts = Post::all(); // Only returns non-deleted posts
```

As we mentioned earlier, Laravel automatically adds a where clause to your query:

```sql
SELECT * FROM posts WHERE deleted_at IS NULL
```

This ensures that your queries don't return "deleted" records unless you explicitly ask for them.

#### Including Soft-Deleted Records

To include soft-deleted records in your query, use `withTrashed()`:

```php
$allPosts = Post::withTrashed()->get();
```

This method removes the `WHERE deleted_at IS NULL` clause from the query, allowing you to retrieve all records, regardless of their deleted status. The generated SQL query looks like this:

```sql
SELECT * FROM posts;
```

So using `withTrashed()` is useful when you need to access soft-deleted records for auditing or recovery purposes.

#### Retrieving Only Soft-Deleted Records

In some cases, you may need to retrieve only soft-deleted records. Laravel provides the `onlyTrashed()` method for this purpose:

```php
$deletedPosts = Post::onlyTrashed()->get();
```

This method adds a `WHERE deleted_at IS NOT NULL` clause to your query, returning only the "deleted" records.

### Using the `DB` Facade

While Eloquent provides a high-level API for working with soft deletes, sometimes you might need to use raw SQL queries or the Query Builder. The `DB` facade in Laravel allows you to work with soft deletes at a lower level, giving you more control over your database operations.

Here are some examples with explanations:

```php
use Illuminate\Support\Facades\DB;

// Soft delete a record
DB::table('posts')->where('id', 1)->update(['deleted_at' => now()]);
```

This query manually sets the `deleted_at` column to the current timestamp, effectively soft-deleting the record. Unlike Eloquent's `delete()` method, this doesn't trigger any model events.

```php
// Restore a soft-deleted record
DB::table('posts')->where('id', 1)->update(['deleted_at' => null]);
```

Here, we're restoring a soft-deleted record by setting its `deleted_at` column back to null. This makes the record visible to normal queries again.

```php
// Query including soft-deleted records
$allPosts = DB::table('posts')->get();
```

This query retrieves all records, including soft-deleted ones. The `DB` facade doesn't automatically exclude soft-deleted records like Eloquent does.

```php
// Query only non-deleted records
$activePosts = DB::table('posts')->whereNull('deleted_at')->get();
```

To exclude soft-deleted records, we explicitly add a `whereNull('deleted_at')` clause. This mimics Eloquent's default behavior.

```php
// Query only soft-deleted records
$deletedPosts = DB::table('posts')->whereNotNull('deleted_at')->get();
```

This query retrieves only soft-deleted records by checking for non-null `deleted_at` values.

```php
// Permanently delete a soft-deleted record
DB::table('posts')->where('id', 1)->delete();
```

This operation permanently removes the record from the database, regardless of its soft-deleted status. Be cautious with this as it's irreversible.

The `DB` facade bypasses Eloquent's model events and global scopes, so you'll need to handle any related logic manually if needed.

## General Best Practices

When working with soft deletes in Laravel, there are several best practices to consider for optimal performance and data integrity. Here are some recommendations:

### 1. Regular Cleanup of Old Soft-Deleted Records

One of the main downsides of soft deletes is that records remain in your database even after they're "deleted". This can lead to unnecessary data bloat over time.

To prevent your database from growing too large, consider implementing a cleanup routine:

```php
Post::onlyTrashed()
    ->where('deleted_at', '<', now()->subYears(2))
    ->forceDelete();
```

This code permanently removes records that have been soft-deleted for more than two years. Here's why this is important:

- Soft-deleted records still occupy space in your database. Regular cleanup prevents unnecessary database growth.
- Fewer records generally mean faster queries, even when using `withTrashed()`.
- Some data protection regulations require data to be permanently deleted after a certain period.

You can schedule this command to run regularly using Laravel's task scheduler so that old soft-deleted records are cleaned up automatically.

### 2. Use Soft Deletes Carefully

While soft deletes are useful, they're not always necessary for every model. You should consider the following factors when deciding whether to use soft deletes:

- Use soft deletes for important data that might need to be restored.
- If a model has many important relationships, soft deletes can help maintain data integrity.
- For tables with a very high volume of records, consider the potential performance impact of soft deletes.
- For data privacy or compliance reasons, permanent deletion might be more appropriate.

### 3. Implement Access Controls

If your application allows users to access soft-deleted records, ensure that unauthorized users can't access them:

```php
public function show(Post $post)
{
    if ($post->trashed()) {
        abort(404);
    }
    return view('posts.show', compact('post'));
}
```

This prevents unauthorized access to soft-deleted records, which could contain sensitive or outdated information. If you need to allow certain users to access soft-deleted records, implement appropriate access controls based on user roles or permissions.

### 4. Be Cautious with Indexing

Regarding indexing the `deleted_at` column, there's debate in the community. Some argue against it because:

- Most queries filter for non-deleted records (`WHERE deleted_at IS NULL`), which may not benefit from an index on `deleted_at`.
- An index on `deleted_at` could potentially slow down write operations.

Instead, consider your specific use case:

- If you frequently query for soft-deleted records or restore them, an index might be beneficial.
- If your primary operations are on non-deleted records, you might not need an index on `deleted_at`.

Always measure the performance impact in your specific scenario before deciding on indexing strategy.

For more information about indexes in general, refer to Neon's documentation on [indexes](https://neon.tech/docs/postgres/indexes).

## Testing Soft Deletes

As with anything, testing is important, that way you can make sure your soft delete implementation works correctly. Here's an example test case:

Laravel provides several tools and assertions specifically for testing soft deletes. Let's go over some common tests you might want to include in your test suite.

### Testing Soft Delete Functionality

Let's start with a test to ensure a post is correctly soft deleted:

```php
public function it_soft_deletes_a_post()
{
    $post = Post::factory()->create();

    $post->delete();

    $this->assertSoftDeleted($post);
    $this->assertDatabaseHas('posts', ['id' => $post->id]);
    $this->assertDatabaseMissing('posts', [
        'id' => $post->id,
        'deleted_at' => null
    ]);
}
```

This test:

1. Creates a post using a factory.
2. Soft deletes the post.
3. Asserts that the post is soft deleted using Laravel's `assertSoftDeleted` method.
4. Checks that the post still exists in the database.
5. Verifies that there's no record with a null `deleted_at` for this post.

### Testing Restore Functionality

Next, let's test the restore functionality:

```php
public function it_restores_a_soft_deleted_post()
{
    $post = Post::factory()->create();
    $post->delete();

    $post->restore();

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'deleted_at' => null
    ]);
    $this->assertNotSoftDeleted($post);
}
```

This test:

1. Creates and soft deletes a post.
2. Restores the post.
3. Checks that the post exists in the database with a null `deleted_at`.
4. Uses Laravel's `assertNotSoftDeleted` to confirm the post is no longer soft deleted.

### Testing Query Scopes

It's also important to test that your queries are correctly scoping soft deleted records:

```php
public function it_excludes_soft_deleted_posts_from_regular_queries()
{
    $activePost = Post::factory()->create();
    $deletedPost = Post::factory()->create();
    $deletedPost->delete();

    $posts = Post::all();

    $this->assertTrue($posts->contains($activePost));
    $this->assertFalse($posts->contains($deletedPost));
}

public function it_includes_soft_deleted_posts_when_using_with_trashed()
{
    $activePost = Post::factory()->create();
    $deletedPost = Post::factory()->create();
    $deletedPost->delete();

    $posts = Post::withTrashed()->get();

    $this->assertTrue($posts->contains($activePost));
    $this->assertTrue($posts->contains($deletedPost));
}
```

These two tests ensure that:

1. Regular queries exclude soft deleted records and only return active posts.
2. Queries using `withTrashed()` include soft deleted records.

### Testing Force Delete

Finally, let's test the force delete functionality:

```php
public function it_permanently_deletes_a_post()
{
    $post = Post::factory()->create();

    $post->forceDelete();

    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    $this->assertDatabaseCount('posts', 0);
}
```

This test verifies that force deleting a post removes it entirely from the database.

## Conclusion

Laravel's soft delete feature provides a way to manage data deletion without losing valuable information. By using soft deletes, you can improve your application's data integrity and provide features like data recovery or undo functionality to your users.

Consider the performance implications of soft deletes, especially when working with large datasets. Utilize Neon Postgres's capabilities, such as [indexing](https://neon.tech/docs/postgres/indexes) and [table partitioning](https://neon.tech/docs/postgres/ddl-partitioning), to maintain high performance as your application scales.

When implementing soft deletes, always think about the lifecycle of your data. Plan on implementing policies for permanent deletion of old soft-deleted records to manage database growth optimally and comply with data retention regulations.

## Additional Resources

- [Laravel Documentation on Soft Deletes](https://laravel.com/docs/eloquent#soft-deleting)
- [Neon Postgres Documentation](/docs)
- [Laravel Eloquent Performance Tips](https://laravel.com/docs/eloquent-relationships#eager-loading)
