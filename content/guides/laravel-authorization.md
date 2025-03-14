---
title: Implementing Fine-Grained Authorization in Laravel with Neon Postgres
subtitle: Learn how to set up and utilize Laravel's powerful authorization features to create a secure and flexible application using Neon's high-performance database.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-07-14T00:00:00.000Z'
updatedOn: '2024-07-14T00:00:00.000Z'
---

Laravel provides an authorization system that allows developers to implement fine-grained access control in their applications. While Laravel's built-in features are powerful, some projects require even more advanced role-based access control (RBAC). This is where third-party packages like Spatie's Laravel Permission come into play.

In this guide, we'll walk through the process of setting up fine-grained authorization in a Laravel application using Neon Postgres. We'll start with Laravel's native authorization features, including Gates and Policies, and then expand our implementation to incorporate Spatie's Laravel Permission package for more sophisticated RBAC capabilities.

By the end of this tutorial, you'll have a good understanding of how to create a flexible and secure authorization system that can scale with your application's needs.

## Prerequisites

Before we begin, make sure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for database hosting
- Basic knowledge of Laravel and its authentication system

## Setting up the Project

Let's start by creating a new Laravel project and configuring it to use Neon Postgres.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel laravel-auth-demo
cd laravel-auth-demo
```

This will create a new Laravel project in a directory named `laravel-auth-demo` and navigate you into the project directory.

### Connecting to Neon Database

Update your `.env` file with your Neon database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Make sure to replace the placeholders with your actual Neon database details.

## Understanding Laravel's Authorization System

Laravel's authorization system is built on two main concepts: [Gates](https://laravel.com/docs/11.x/authorization#gates) and [Policies](https://laravel.com/docs/11.x/authorization#creating-policies).

- **Gates** are Closure-based approaches to authorization. They provide a simple, Closure-based method of authorizing actions. Gates are ideal for simple checks that don't necessarily relate to a specific model or resource. They can be thought of as general-purpose authorization checks that can be used throughout your application.

- **Policies** are classes that organize authorization logic around a particular model or resource. They encapsulate the logic for authorizing actions on a specific type of model. Policies are particularly useful when you have multiple authorization checks related to a single model, as they help keep your authorization logic organized and maintainable.

For fine-grained authorization, we'll primarily focus on Policies, as they provide a more structured and scalable approach for complex applications. Policies allow you to group related authorization logic together, making it easier to manage and understand the permissions associated with each model in your application.

That said, Gates can still play an important role in your authorization strategy. They're great for defining broader, application-wide permissions that aren't tied to a specific model. You might use Gates for actions like "access admin dashboard" or "manage site settings".

It's worth noting that Laravel's authorization system is deeply integrated with its authentication system. This means you can easily check a user's permissions within your controllers, views, and even database queries. Whether you're using Gates or Policies, you'll find that Laravel provides a consistent and intuitive API for performing authorization checks throughout your application.

## Implementing Fine-Grained Authorization

Let's implement a fine-grained authorization system for a blog application where users can create, read, update, and delete posts.

### Setting up the Post Model and Migration

For the purpose of this guide, we'll create a `Post` model with basic fields like `title`, `content`, and `is_published`. We'll also associate each post with a user.

First, let's create a `Post` model with its migration:

```bash
php artisan make:model Post -m
```

Update the migration file in `database/migrations` to define the structure of our `posts` table:

```php
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('content');
        $table->boolean('is_published')->default(false);
        $table->timestamps();
    });
}
```

Run the migration:

```bash
php artisan migrate
```

This will create a `posts` table in your Neon Postgres database.

### Creating a Policy for Posts

Now, let's create a policy for the `Post` model:

```bash
php artisan make:policy PostPolicy --model=Post
```

This command creates a new policy class in `app/Policies/PostPolicy.php`. Let's update it with our authorization logic:

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return true; // Allow all users to view the list of posts
    }

    public function view(User $user, Post $post)
    {
        return true; // Allow all users to view individual posts
    }

    public function create(User $user)
    {
        return true; // Allow all authenticated users to create posts
    }

    public function update(User $user, Post $post)
    {
        return $user->id === $post->user_id; // Allow only the author to update the post
    }

    public function delete(User $user, Post $post)
    {
        return $user->id === $post->user_id; // Allow only the author to delete the post
    }

    public function publish(User $user, Post $post)
    {
        // Allow only the author or an admin to publish the post
        return $user->id === $post->user_id || $user->is_admin;
    }
}
```

Rundown of the `PostPolicy` class:

1. `viewAny` method: This allows all users to view the list of posts. This could be useful for a public blog where anyone can see the list of available posts.

2. `view` method: Similar to `viewAny`, this allows all users to view individual posts. Again, this is suitable for a public blog where post content is accessible to everyone.

3. `create` method: This permits all authenticated users to create posts. It assumes that any logged-in user should be able to write a post.

4. `update` method: This method only allows the author of the post to update it. It compares the ID of the current user with the user ID associated with the post.

5. `delete` method: Similar to `update`, this method restricts deletion to the author of the post. This ensures that users can only delete their own posts.

6. `publish` method: This introduces a more complex authorization rule. It allows either the author of the post or an admin user to publish the post. This is useful for blogs where posts might need approval before being made public.

Each method in this policy corresponds to a specific action that can be performed on a Post model. The methods return boolean values: `true` if the action is allowed, and `false` if it's not.

This policy provides a fine-grained control over post-related actions, ensuring that users can only perform actions they're authorized to do. It's a good example of how policies can encapsulate complex authorization logic in a clean, readable way.

### Registering the Policy

By default, Laravel 11.x and later versions automatically discover policies. However, if you're using an older version, you might need to manually register the policy in the `AuthServiceProvider`.

To automatically discover policies, your policies should be in the `app/Policies` directory and follow the naming convention of `ModelNamePolicy`. Laravel will automatically associate the policy with the corresponding model.

To manually register the policy, add the following line to the `boot` method of your `AuthServiceProvider`:

```php
use App\Models\Post;
use App\Policies\PostPolicy;

public function boot(): void
{
    Gate::policy(Post::class, PostPolicy::class);
}
```

This line tells Laravel to use the `PostPolicy` class for authorization checks related to the `Post` model.

### Implementing Role-Based Access Control

To support our `is_admin` flag and implement basic role-based access control, let's update our `users` table.

To do that, create a new migration to add the `is_admin` column:

```bash
php artisan make:migration add_is_admin_to_users_table
```

Update the migration file:

```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->boolean('is_admin')->default(false);
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('is_admin');
    });
}
```

Run the migration to add the `is_admin` column to the `users` table:

```bash
php artisan migrate
```

This column will allow us to differentiate between regular users and administrators.

### Using Authorization in Controllers

Now that we have our policy set up, let's use it in a controller. Create a new `PostController`:

```bash
php artisan make:controller PostController --resource
```

Update the `PostController` with authorization checks:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Post::class, 'post');
    }

    public function index()
    {
        $posts = Post::all();
        return view('posts.index', compact('posts'));
    }

    public function show(Post $post)
    {
        return view('posts.show', compact('post'));
    }

    public function create()
    {
        return view('posts.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        $post = auth()->user()->posts()->create($validatedData);

        return redirect()->route('posts.show', $post);
    }

    public function edit(Post $post)
    {
        return view('posts.edit', compact('post'));
    }

    public function update(Request $request, Post $post)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        $post->update($validatedData);

        return redirect()->route('posts.show', $post);
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('posts.index');
    }

    public function publish(Post $post)
    {
        $this->authorize('publish', $post);

        $post->update(['is_published' => true]);

        return redirect()->route('posts.show', $post);
    }
}
```

The `__construct` method uses the `authorizeResource` method to automatically authorize resource controller methods. We've also added a `publish` method with a manual authorization check.

Alternatively, you can use the `authorize` method within each controller method to perform authorization checks manually. This method takes the name of the policy method to call and the model to authorize against:

```php
$this->authorize('publish', $post);
```

This line checks if the current user is authorized to publish the post. If not, Laravel will throw an `AuthorizationException` preventing the action from being executed.

### Using Authorization in Views

In your Blade views, you can use the `@can` directive to conditionally show or hide elements based on the user's permissions. For example, in `resources/views/posts/show.blade.php`:

```html
<h1>{{ $post->title }}</h1>
<p>{{ $post->content }}</p>

@can('update', $post)
<a href="{{ route('posts.edit', $post) }}">Edit Post</a>
@endcan @can('delete', $post)
<form action="{{ route('posts.destroy', $post) }}" method="POST">
  @csrf @method('DELETE')
  <button type="submit">Delete Post</button>
</form>
@endcan @can('publish', $post) @if(!$post->is_published)
<form action="{{ route('posts.publish', $post) }}" method="POST">
  @csrf
  <button type="submit">Publish Post</button>
</form>
@endif @endcan
```

Rundown of the Blade view:

1. The view starts by displaying the post's title and content, which are accessible to all users as per our policy.

2. `@can('update', $post)` directive: This checks if the current user is authorized to update the post. If true, it displays an "Edit Post" link. This corresponds to the `update` method in our `PostPolicy`.

3. `@can('delete', $post)` directive: Similar to the update check, this verifies if the user can delete the post. If authorized, it shows a delete form with a submit button. This uses the `delete` method from our policy.

4. `@can('publish', $post)` directive: This checks if the user can publish the post, corresponding to the `publish` method in our policy.

5. Inside the publish check, there's an additional `@if(!$post->is_published)` condition. This ensures the publish button only appears if the post isn't already published.

6. Each form includes a `@csrf` directive for CSRF protection, which is a security feature in Laravel to prevent cross-site request forgery attacks.

7. The delete form also includes `@method('DELETE')`, which is Laravel's way of spoofing HTTP methods that aren't supported by HTML forms (like DELETE, PUT, PATCH).

By using these directives, you can conditionally display elements based on the user's permissions, providing a tailored experience for each user based on their role and authorization level.

## Integrating Spatie's Laravel Permission for Advanced RBAC

While Laravel's built-in authorization system provides you with a good foundation for managing permissions and policies, you might require more complex role and permission structures.

Spatie's Laravel Permission package provides a solution for implementing advanced RBAC (Role-Based Access Control) in your Laravel application.

### Installing Spatie Laravel Permission

First, let's install the package using Composer:

```bash
composer require spatie/laravel-permission
```

After installation, publish the package's configuration and migration files:

```bash
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

This command will create a `config/permission.php` file and a migration file in your `database/migrations` directory.

Run the migrations to create the necessary tables in your Neon Postgres database:

```bash
php artisan migrate
```

This will create the permissions, roles, and model_has_roles tables in your database.

### Configuring the Package

The package's configuration file is located at `config/permission.php`. For most use cases, the default configuration works well. However, you can customize it based on your needs. For example, you can change the table names or add a cache expiration time.

### Setting Up Roles and Permissions

Let's create some roles and permissions for our blog application. We'll do this in a seeder for easy setup and testing.

Create a new seeder:

```bash
php artisan make:seeder RolesAndPermissionsSeeder
```

Update the seeder file (`database/seeders/RolesAndPermissionsSeeder.php`):

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        Permission::create(['name' => 'view posts']);
        Permission::create(['name' => 'create posts']);
        Permission::create(['name' => 'edit posts']);
        Permission::create(['name' => 'delete posts']);
        Permission::create(['name' => 'publish posts']);
        Permission::create(['name' => 'unpublish posts']);

        // Create roles and assign permissions
        $role = Role::create(['name' => 'writer']);
        $role->givePermissionTo(['view posts', 'create posts', 'edit posts', 'delete posts']);

        $role = Role::create(['name' => 'editor']);
        $role->givePermissionTo(['view posts', 'create posts', 'edit posts', 'delete posts', 'publish posts', 'unpublish posts']);

        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());
    }
}
```

Update your `DatabaseSeeder.php` to include this new seeder:

```php
public function run()
{
    $this->call([
        RolesAndPermissionsSeeder::class,
    ]);
}
```

Run the seeder:

```bash
php artisan db:seed
```

This will create roles for `writer`, `editor`, and `admin`, along with permissions for viewing, creating, editing, deleting, publishing, and unpublishing posts.

### Updating the User Model

To use the package, your `User` model should use the `HasRoles` trait. Update your `app/Models/User.php`:

```php {1-1}
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    // ...
}
```

This trait provides methods for assigning and checking roles and permissions for users in your application.

### Implementing RBAC in Controllers

Now, let's update our `PostController` to use the new permissions:

```php {10-17}
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view posts')->only('index', 'show');
        $this->middleware('permission:create posts')->only('create', 'store');
        $this->middleware('permission:edit posts')->only('edit', 'update');
        $this->middleware('permission:delete posts')->only('destroy');
        $this->middleware('permission:publish posts')->only('publish');
    }

    // ... other methods remain the same

    public function publish(Post $post)
    {
        $post->update(['is_published' => true]);
        return redirect()->route('posts.show', $post);
    }
}
```

The `__construct` method now uses middleware to check permissions for each controller action. This ensures that only users with the appropriate permissions can access the corresponding methods.

### Using RBAC in Blade Templates

You can use the package's directives in your Blade templates to show or hide elements based on the user's roles and permissions:

```html
@can('edit posts')
<a href="{{ route('posts.edit', $post) }}">Edit Post</a>
@endcan @role('admin')
<a href="{{ route('admin.dashboard') }}">Admin Dashboard</a>
@endrole @hasanyrole('writer|editor')
<a href="{{ route('posts.create') }}">Create New Post</a>
@endhasanyrole
```

You can also use the `@canany` directive to check if the user has any of the specified permissions:

```html
@canany(['edit posts', 'delete posts'])
<form action="{{ route('posts.destroy', $post) }}" method="POST">
  @csrf @method('DELETE')
  <button type="submit">Delete Post</button>
</form>
@endcanany
```

### Dynamic Role and Permission Assignment

Besides seeding roles and permissions, you can also assign roles and permissions dynamically based on user actions. For example, you might assign the `writer` role to users who have published a certain number of posts.

Here's an example of how you can assign roles and permissions dynamically in your controllers:

```php
public function assignRole(User $user, Request $request)
{
    $validatedData = $request->validate([
        'role' => 'required|exists:roles,name',
    ]);

    $user->assignRole($validatedData['role']);

    return back()->with('success', 'Role assigned successfully');
}

public function revokeRole(User $user, Request $request)
{
    $validatedData = $request->validate([
        'role' => 'required|exists:roles,name',
    ]);

    $user->removeRole($validatedData['role']);

    return back()->with('success', 'Role revoked successfully');
}
```

Besides the `removeRole` and `assignRole` methods, the package provides other methods for managing roles and permissions, such as `syncRoles`, `givePermissionTo`, and `revokePermissionTo` for more advanced use cases.

### Optimizing RBAC Performance with Neon Postgres

When working with RBAC, especially in larger applications, you might encounter performance issues due to the increased number of database queries.

Here are some tips to optimize performance when using Spatie Laravel Permission with Neon Postgres:

1. **Caching**: Enable caching in the package's configuration to reduce database queries:

   ```php
   // In config/permission.php
   'cache' => [
       'expiration_time' => \DateInterval::createFromDateString('24 hours'),
       'key' => 'spatie.permission.cache',
       'model_key' => 'name',
       'store' => 'default',
   ],
   ```

2. **Eager Loading**: When fetching users with their roles and permissions, use eager loading:

   ```php
   $users = User::with('roles', 'permissions')->get();
   ```

3. **Indexing**: Ensure that the `model_id` and `model_type` columns in the `model_has_roles` and `model_has_permissions` tables are properly indexed. For more information on indexing, refer to the [Neon Postgres documentation](https://neon.tech/docs/postgres/indexes).

4. **Minimize Permission Checks**: Instead of checking individual permissions, consider using roles or permission groups to reduce the number of checks you do on each request.

5. **Use Database-Level Permissions**: For very large-scale applications, consider implementing some permissions at the database level using [Neon Postgres's role-based access control features](https://neon.tech/blog/the-non-obviousness-of-postgres-roles).

## Conclusion

In this guide, we've implemented a fine-grained authorization system in Laravel using Policies and Gates. We've covered creating and registering policies, implementing role-based access control, using authorization in controllers and views, and testing our authorization rules.

This implementation provides a solid foundation for a secure application, but there are always ways to enhance and expand its functionality.

For more complex applications, Spatie's Laravel Permission package provides a flexible way to implement advanced RBAC in your Laravel application.

## Additional Resources

- [Laravel Authorization Documentation](https://laravel.com/docs/11.x/authorization)
- [Laravel Policies](https://laravel.com/docs/11.x/authorization#creating-policies)
- [Laravel Gates](https://laravel.com/docs/11.x/authorization#gates)
- [Spatie Laravel Permission Documentation](https://spatie.be/docs/laravel-permission)
- [Neon Postgres Documentation](/docs)
