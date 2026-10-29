---
title: "Laravel's routes, middleware, and validation: optimizing database interactions"
subtitle: Use Laravel's routing, middleware, and validation to build web applications with efficient database interactions on Lakebase Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-07-14T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Routing, middleware, and validation are three of Laravel's core features, and together they shape every request's path from the initial route hit to the final database query. This guide walks through each one, with a focus on how they affect database operations, and then covers techniques for making those database queries more efficient.

## Prerequisites

Before we begin, ensure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for Postgres database hosting
- Basic knowledge of Laravel and database operations

## Setting up the project

Start by creating a new Laravel project and connecting it to your database.

### Creating a new Laravel project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel laravel-routes-middleware-validation
cd laravel-routes-middleware-validation
```

### Setting up the database

Update your `.env` file with your Lakebase Postgres database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Understanding Laravel routing

Routing defines how your application responds to incoming HTTP requests. It's the entry point for every request, and it determines which code runs based on the URL and HTTP method.

#### Basic routing

Let's start with a basic route that interacts with the database. We'll create a route to fetch and display a list of users.

Open `routes/web.php` and add the following route:

```php
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    $users = User::all();
    return view('users.index', ['users' => $users]);
});
```

This route does the following:

1. It responds to GET requests to the `/users` URL.
2. It uses a closure function to define the route's behavior.
3. Inside the closure, it fetches all users from the database using the `User` model.
4. It returns a view named `users.index`, passing the fetched users to the view.

While this approach works for simple routes, it's generally not recommended for larger applications. As your application grows, putting logic directly in route closures can lead to cluttered and hard-to-maintain code.

#### Introducing controllers

In practice, use controllers to handle the logic for your routes. Controllers group related request handling logic into a single class. Let's create a controller for our user-related routes:

```bash
php artisan make:controller UserController
```

This command creates a new `UserController` in `app/Http/Controllers/UserController.php`. Now, let's modify our route to use this controller:

```php
use App\Http\Controllers\UserController;

Route::get('/users', [UserController::class, 'index']);
```

In `UserController.php` is where you define your logic, like fetching users from the database:

```php
namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return view('users.index', ['users' => $users]);
    }
}
```

This approach separates our route definition from its logic, making our code more organized and easier to maintain.

#### Route parameters

Route parameters capture parts of the URI as variables, which you need for dynamic routes. Let's create a route to display a specific user's details:

```php
Route::get('/users/{id}', [UserController::class, 'show']);
```

In `UserController.php`, add the `show` method to fetch and display a specific user:

```php
public function show($id)
{
    $user = User::findOrFail($id);
    return view('users.show', ['user' => $user]);
}
```

This route and method do the following:

1. The `{id}` in the route definition is a route parameter.
2. Laravel passes this parameter to the `show` method.
3. We use `findOrFail` to fetch the user by ID.
4. If the user is not found, Laravel automatically returns a 404 response.
5. If found, we return a view with the user's details.

#### Route model binding

Laravel offers a more concise way to handle route parameters with Eloquent models. It's called implicit route model binding:

```php
Route::get('/users/{user}', [UserController::class, 'show']);
```

And in the controller we can type-hint the `User` model:

```php
public function show(User $user)
{
    return view('users.show', ['user' => $user]);
}
```

With this approach:

1. Laravel automatically resolves `{user}` to an instance of the `User` model.
2. If no matching model is found, it automatically returns a 404 response.
3. This reduces boilerplate code and uses Laravel's model binding feature.

#### Route groups

Route groups let you apply shared attributes, such as middleware, prefixes, or namespaces, to a set of routes.

```php
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
});
```

This group does the following:

1. It applies the `auth` middleware to all routes within the group.
2. The `dashboard` and `profile` routes are now protected and only accessible to authenticated users.
3. It keeps our routes DRY (Don't Repeat Yourself) by applying shared attributes in one place.

You can also nest route groups for more complex structures:

```php
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/posts', [AdminPostController::class, 'index']);
});
```

This creates a group of admin routes that:

1. All start with `/admin`
2. Require authentication and admin privileges
3. Are handled by admin-specific controllers

## Implementing middleware

Middleware filters HTTP requests hitting your application. It's how you implement features like authentication, CORS handling, and request/response modifications. Laravel 11 moved middleware configuration into `bootstrap/app.php`.

By using middleware, you can:

1. Perform actions before the request reaches your application
2. Perform actions after the application generates a response
3. Modify the request or response as needed

### Creating custom middleware

Let's create a custom middleware to check if a user has admin privileges. You can use the following Artisan command:

```bash
php artisan make:middleware CheckAdminStatus
```

This creates a new file `app/Http/Middleware/CheckAdminStatus.php`. Let's update it with our logic to check for admin status:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return redirect('/')->with('error', 'You do not have admin access.');
        }

        return $next($request);
    }
}
```

This middleware:

1. Checks if there's an authenticated user and if they have admin status
2. If not, it redirects to the home page with an error message
3. If the user is an admin, it allows the request to proceed

### Registering middleware

In Laravel 11, you no longer need to register middleware in the `Kernel.php` file. Instead, you can register middleware directly in your `bootstrap/app.php` file:

```php
$app->routeMiddleware([
    'auth' => App\Http\Middleware\Authenticate::class,
    'admin' => App\Http\Middleware\CheckAdminStatus::class,
]);
```

This registers the `CheckAdminStatus` middleware with the key `admin`, allowing you to apply it to specific routes.

### Applying middleware to routes

Now you can apply this middleware to routes that require admin access:

```php
use App\Http\Controllers\AdminController;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/users', [AdminController::class, 'users']);
});
```

This route group:

1. Applies both the `auth` and `admin` middleware
2. Groups together routes that should only be accessible to authenticated admin users
3. Uses controller methods to handle the requests, keeping the route file clean

### Middleware parameters

You can pass parameters to your middleware when you need to customize middleware behavior based on the route or request context.

Let's modify our `CheckAdminStatus` middleware to accept a required permission level:

```php
public function handle(Request $request, Closure $next, int $requiredLevel): Response
{
    if (!$request->user() || $request->user()->admin_level < $requiredLevel) {
        return redirect('/')->with('error', 'You do not have sufficient privileges.');
    }

    return $next($request);
}
```

You can then use this middleware with parameters in your routes:

```php
Route::get('/admin/users', [AdminController::class, 'users'])
    ->middleware('admin:2'); // Requires admin level 2 or higher
```

As a good practice, each middleware should have a single responsibility.

## Implementing validation

Validation checks that incoming data meets specific criteria before you process it. Laravel's validation system works with your routes, controllers, and database rules.

### Basic validation

Let's start with a basic example of validating user input when creating a new user:

```php
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

Route::post('/users', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => ['required', 'confirmed', Password::min(8)],
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    return redirect()->route('users.show', ['id' => $user->id])
        ->with('success', 'User created successfully');
});
```

In this example:

1. The `validate` method automatically returns a 422 response with validation errors if validation fails.
2. Validated data is returned if validation passes, allowing you to safely use it.
3. The `unique:users` rule checks the database to ensure the email isn't already in use.

### Validation error handling

By default, Laravel automatically redirects the user back to the previous page with the validation errors and old input if validation fails. You can access these in your views:

```php
@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="/users">
    @csrf
    <input type="text" name="name" value="{{ old('name') }}">
    <!-- Other form fields -->
</form>
```

This code snippet displays validation errors and repopulates your form fields with old user input.

### Custom error messages

You can customize validation error messages by passing an array of messages as the second argument to the `validate` method:

```php
$validated = $request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|string|email|max:255|unique:users',
], [
    'name.required' => 'A name is required',
    'email.unique' => 'This email is already registered',
]);
```

This allows you to provide more user-friendly error messages.

### Form request validation

For more complex validation scenarios, Laravel provides Form Request classes. Use them for validation logic that you want to reuse across multiple controllers or routes.

Let's create a form request for updating user profiles:

```bash
php artisan make:request UpdateUserProfileRequest
```

Now, let's update `app/Http/Requests/UpdateUserProfileRequest.php`:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserProfileRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() !== null;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->user()->id),
            ],
            'bio' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|max:1024',
        ];
    }

    public function messages()
    {
        return [
            'email.unique' => 'This email is already in use by another account.',
            'avatar.max' => 'The avatar must not be larger than 1MB.',
        ];
    }
}
```

Now we can use this Form Request in our controller:

```php
use App\Http\Requests\UpdateUserProfileRequest;

class ProfileController extends Controller
{
    public function update(UpdateUserProfileRequest $request)
    {
        $user = $request->user();
        $user->update($request->validated());

        if ($request->hasFile('avatar')) {
            $user->avatar = $request->file('avatar')->store('avatars', 'public');
            $user->save();
        }

        return redirect()->route('profile')
            ->with('success', 'Profile updated successfully');
    }
}
```

With a Form Request:

1. Validation logic is encapsulated and reusable across multiple routes or controllers.
2. The controller stays clean and focused on its primary responsibility of handling requests and responses.
3. The `authorize` method allows for permission checks before validation.

### Custom validation rules

You can create custom validation rules for requirements that Laravel's built-in rules don't cover, and reuse them across your application.

Let's create a rule to ensure a string contains no spaces:

```bash
php artisan make:rule NoSpaces
```

Update the `app/Rules/NoSpaces.php` file to add the validation logic:

```php
<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NoSpaces implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (str_contains($value, ' ')) {
            $fail('The :attribute must not contain spaces.');
        }
    }
}
```

The rule uses `str_contains` to check that the string doesn't contain any spaces.

You can now use this rule in your validations:

```php
use App\Rules\NoSpaces;

$request->validate([
    'username' => ['required', 'string', new NoSpaces],
]);
```

This custom rule ensures that the `username` field doesn't contain any spaces before it's stored in the database, but you can use it for any other validation logic you need.

## Optimizing database interactions

As your application grows, the number and shape of its database queries has a large effect on response times. The following techniques reduce query counts, data transfer, and memory use.

### Understanding the N+1 query problem and eager loading

The N+1 query problem is a common performance issue in ORM systems. It occurs when you fetch a list of records and then make additional queries for each record to retrieve related data.

#### Example of the N+1 problem

```php
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // This causes an additional query for each post
}
```

This code results in 1 query to fetch all posts, plus N queries (where N is the number of posts) to fetch each post's author. This can lead to a large number of queries and slow performance.

#### Solving with eager loading

Eager loading solves this by loading all related data in one additional query:

```php
Route::get('/posts', function () {
    $posts = Post::with('author')->paginate(20);
    return view('posts.index', ['posts' => $posts]);
});
```

This loads all posts and their authors in just 2 queries, regardless of the number of posts. The `with('author')` method specifies the relationship to eager load and prevents the N+1 problem.

#### Advanced eager loading

You can eager load multiple relationships and even nest them:

```php
$posts = Post::with(['author', 'comments.user'])->get();
```

This loads posts, their authors, comments on each post, and the user who made each comment.

### Query optimization techniques

#### Indexing

Indexes matter for query performance. They allow the database to find data without scanning the entire table.

To learn more, see [Postgres index types](/docs/postgresql/index-types).

In Laravel migrations, you can add indexes like this:

```php
Schema::table('users', function (Blueprint $table) {
    $table->index('email');
    $table->index(['last_name', 'first_name']);
});
```

Consider indexing:

- Foreign keys
- Columns used in WHERE clauses
- Columns used for sorting (ORDER BY)

Remember, while indexes speed up reads, they can slow down writes, so use them judiciously.

#### Chunking results

When working with large datasets, use chunking to process records in batches:

```php
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // Process user
    }
});
```

This avoids loading all records into memory at once. Use it for tasks like sending emails to all users or processing large datasets.

### Caching strategies

Caching can reduce database load for frequently accessed, rarely changing data. Cache data that's expensive to compute or retrieve from the database and doesn't change frequently.

#### Basic caching

Using the Laravel cache facade, you can cache data like this:

```php
use Illuminate\Support\Facades\Cache;

Route::get('/stats', function () {
    $stats = Cache::remember('site_stats', 3600, function () {
        return [
            'user_count' => User::count(),
            'post_count' => Post::count(),
            'comment_count' => Comment::count(),
        ];
    });

    return view('stats', ['stats' => $stats]);
});
```

This caches the stats for an hour (3600 seconds). The data is recalculated and cached if it's not found in the cache. The cache is stored in the default cache store as configured in your `.env` file.

After the data is cached, subsequent requests will retrieve the data from the cache instead of querying the database again.

#### Model caching

For individual models, you can cache queries:

```php
$user = Cache::remember('user:' . $id, 3600, function () use ($id) {
    return User::find($id);
});
```

### Query builder optimization

When using Laravel's query builder, there are several techniques to optimize your queries:

#### Select specific columns

Instead of selecting all columns, specify only the ones you need. This matters most when fetching large datasets from tables with many columns, not all of which are required.

Let's say you only need the `id`, `name`, and `email` columns from the `users` table:

```php
$users = DB::table('users')->select('id', 'name', 'email')->get();
```

This reduces the amount of data transferred from the database. To verify the generated SQL query, you can use the `toSql` method:

```php
$sql = DB::table('users')->select('id', 'name', 'email')->toSql();
dd($sql);
```

This will output the generated SQL query for debugging purposes.

#### Use proper data types

This isn't specific to Laravel, but data types affect query performance and storage. Use appropriate data types in your migrations. For example, use `boolean` (a native Postgres `boolean` column) for true/false fields instead of `integer`.

#### Avoid using `orWhere` excessively

Excessive use of `orWhere` can lead to slow queries. Consider using `whereIn` instead:

```php
// Instead of:
$users = User::where('status', 'active')
             ->orWhere('status', 'pending')
             ->get();

// Use:
$users = User::whereIn('status', ['active', 'pending'])->get();
```

### Eloquent performance tips

A few more tips for Eloquent queries:

#### Use lazy collections for large datasets

When working with large datasets, use lazy collections to conserve memory:

```php
User::cursor()->each(function ($user) {
    // Process user
});
```

This loads users one at a time from the database instead of loading all at once, reducing memory usage.

#### Use raw queries for complex operations

For very complex queries, sometimes a raw query can be more efficient. You can use Laravel's `DB` facade to run raw SQL queries:

```php
$users = DB::select('SELECT * FROM users WHERE id > ? AND email = ?', [1, 'example@example.com']);
```

You can abstract raw queries into a repository or service class to keep your controllers clean.

## Conclusion

You now have routes backed by controllers, middleware that restricts admin access, validation that checks input before it reaches the database, and a set of techniques for keeping Eloquent queries efficient. As a next step, profile your slowest routes and apply eager loading and indexes where the query counts are highest.

## Additional resources

- [Laravel Routing Documentation](https://laravel.com/docs/11.x/routing)
- [Laravel Middleware Documentation](https://laravel.com/docs/11.x/middleware)
- [Laravel Validation Documentation](https://laravel.com/docs/11.x/validation)
- [Laravel Query Builder Documentation](https://laravel.com/docs/11.x/queries)
- [Neon Documentation](/docs)
