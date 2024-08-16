---
title: Building a CRUD API with Laravel and Sanctum
subtitle: Learn how to create a robust, secure CRUD API using Laravel and Laravel Sanctum for authentication
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-07-01T00:00:00.000Z'
updatedOn: '2024-07-01T00:00:00.000Z'
---

Laravel is a powerful PHP framework that allows developers to easily build web applications and APIs.

In this guide, we'll walk through the process of creating a CRUD (Create, Read, Update, Delete) API using Laravel, and we'll implement authentication using [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum).

By the end of this tutorial, you'll have a fully functional API that allows authenticated users to perform CRUD operations on a resource. We'll use a 'Task' model as our example resource and implement the necessary endpoints to manage tasks.

## Prerequisites

Before we begin, ensure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for database hosting
- Basic knowledge of Laravel and RESTful API principles

## Setting up the Project

Let's start by creating a new Laravel project and setting up the necessary components.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel laravel-crud-api
cd laravel-crud-api
```

This will create a new Laravel project in a directory named `laravel-crud-api` and install all the necessary dependencies.

### Setting up the Database

Update your `.env` file with your Neon database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Make sure to replace `your-neon-hostname`, `your_database_name`, `your_username`, and `your_password` with your actual database credentials.

### Installing Laravel Sanctum

Laravel Sanctum provides a featherweight authentication system for SPAs and simple APIs. To install it, all you need to do is use the following command:

```bash
php artisan install:api
```

If you get asked to run all pending migrations, type `yes` and press Enter. Else, run the migrations to create the necessary tables:

```bash
php artisan migrate
```

This will create the necessary tables for Sanctum to work.

## Creating the Task Model and Migration

As mentioned earlier, for our CRUD API, we'll use a 'Task' model as our example resource. This model will have fields such as title, description, status, due date, and priority.

Let's create it along with its migration file:

```bash
php artisan make:model Task -m
```

Once created, open the newly created migration file in `database/migrations` and update it to include the necessary columns for the 'tasks' table:

```php
public function up()
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
        $table->date('due_date')->nullable();
        $table->integer('priority')->default(1);
        $table->timestamps();
    });
}
```

We've defined a foreign key `user_id` to associate each task with a user. This allows us to implement user-specific tasks and ensure that each task belongs to a specific user. The `constrained()` method creates a foreign key constraint that references the `id` column of the `users` table. The `onDelete('cascade')` method ensures that when a user is deleted, all associated tasks are also deleted.

Run the migration to create the 'tasks' table:

```bash
php artisan migrate
```

After that, update the `app/Models/Task.php` model file to include the necessary fields in the `$fillable` array:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'status', 'due_date', 'priority'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

As a reference, the `fillable` property specifies which fields can be mass-assigned when creating or updating a model. This helps protect against mass assignment vulnerabilities and ensures that only the specified fields can be modified.

## Implementing API Authentication

Before we create our CRUD endpoints, let's set up authentication using Laravel Sanctum. This will allow users to register, log in, and access protected routes in our API.

### Creating the User Registration and Login Controllers

By default, Laravel comes with a few route groups like `web`, `api`, and `auth`. We'll use the `api` group for our API routes which will be protected by Sanctum.

Start by creating a controller called `AuthController` to handle user registration and login using the artisan command:

```bash
php artisan make:controller Api/AuthController
```

Then, update the `app/Http/Controllers/Api/AuthController.php` file and add the necessary methods:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
```

Rundown of the methods in the `AuthController`:

- `register`: Handles user registration. Validates the request data, creates a new user, and returns an access token.
- `login`: Handles user login. Validates the request data, checks the user credentials, and returns an access token.
- `logout`: Logs out the authenticated user by deleting the current access token.

### Setting up Authentication Routes

Update `routes/api.php` to include the authentication routes within the `api` route group:

```php
<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // We'll add our task routes here later
});
```

The `auth:sanctum` middleware protects the routes by requiring a valid access token. This ensures that only authenticated users can access the protected routes.

The `/register` and `/login` routes are public and do not require authentication. Users can register and log in to obtain an access token.

### Issuing API Tokens

To issue API tokens, we need to update the `User` model to use the `HasApiTokens` trait. Laravel ships with a default `User` model located at `app/Models/User.php`.

Let's update the `app/Models/User.php` file and add the `HasApiTokens` trait:

```php
<?php

// Existing imports
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // Add the HasApiTokens trait here
    use HasApiTokens, HasFactory, Notifiable;

    // Existing code
}
```

After adding the `HasApiTokens` trait, you can use the `createToken` method to generate an access token for a user. We've used this method in the `AuthController` to issue tokens during registration and login.

While we're here, let's also update the `User` model to include a relationship with the `Task` model:

```php
public function tasks()
{
    return $this->hasMany(Task::class);
}
```

This relationship allows us to retrieve all tasks associated with a user and create new tasks for a user, simplifying the task management process.

### Testing the Authentication Endpoints

To test the authentication endpoints, you can use a tool like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/).

For the sake of simplicity, you can use the `curl` command in your terminal.

Let's start by testing the registration route and try to register a new user:

```bash
curl -X POST http://laravel-crud-api.test/api/register \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password",
        "password_confirmation": "password"
    }'
```

> Note: Replace `laravel-crud-api.test` with your Laravel project URL.

The response should include an access token like this:

```json
{
  "access_token": "1|eyJ...your_access_token_here",
  "token_type": "Bearer"
}
```

To log in with the registered user:

```bash
curl -X POST http://laravel-crud-api.test/api/login \
    -H 'Content-Type: application/json' \
    -d '{
        "email": "john@example.com",
        "password": "password"
    }'
```

This will return another access token:

```json
{
  "access_token": "1|eyJ...your_new_access_token_here",
  "token_type": "Bearer"
}
```

With the access token, you can now access the protected routes. To log out, use the `/logout` route:

```bash
curl -X POST http://laravel-crud-api.test/api/logout \
    -H 'Authorization: Bearer <your_access_token_here>'
```

Replace `<your_access_token_here>` with the access token you received during login. This will log out the user and delete the access token and you will get a response like:

```json
{
  "message": "Logged out successfully"
}
```

## Implementing CRUD Operations

Now that we have authentication set up, let's create our CRUD operations for the Task model.

### Creating the TaskController

Generate a new controller for handling task operations:

```bash
php artisan make:controller Api/TaskController --api
```

The `--api` flag generates a controller with the necessary methods for a RESTful API. This will create a new controller file at `app/Http/Controllers/Api/TaskController.php` and will include methods like `index`, `store`, `show`, `update`, and `destroy`.

After that, update `app/Http/Controllers/Api/TaskController.php` and populate those methods with the necessary logic:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'priority' => 'required|integer|min:1|max:5',
        ]);

        $task = $request->user()->tasks()->create($request->all());
        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|required|integer|min:1|max:5',
        ]);

        $task->update($validated);

        return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
```

> Note: We'll create the `TaskResource` class later to transform the task model into a JSON response.

Rundown of the methods in the `TaskController`:

- `index`: Fetches all tasks. Returns a JSON response with all tasks. We'll update this method to use API Resources later.
- `store`: Creates a new task. Validates the request data, creates a new task, and returns the task as JSON.
- `show`: Fetches a single task. Returns a JSON response with the specified task.
- `update`: Updates a task. Validates the request data, updates the task, and returns the updated task as JSON.
- `destroy`: Deletes a task. Deletes the specified task and returns a 204 No Content response.

### Adding Task Routes

Once we have the `TaskController` set up, let's add the task routes to `routes/api.php` to include the task routes within the authenticated group:

```php
// Include the TaskController at the top:
use App\Http\Controllers\Api\TaskController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Add the task routes here:
    Route::apiResource('tasks', TaskController::class);
});
```

The `Route::apiResource` method automatically generates the necessary routes for a RESTful resource. This will create routes for `tasks` with the appropriate HTTP verbs and route names.

You can use the `php artisan route:list` command to see a list of all registered routes.

## Implementing API Resources

To provide a consistent and customizable way of transforming our models into JSON responses, let's use Laravel's API Resources.

A resource class represents a single model that needs to be transformed into a JSON structure. It allows you to customize the data that is returned when a model is converted to JSON rather than returning the entire model instance.

Generate a new resource for the Task model:

```bash
php artisan make:resource TaskResource
```

Open the `app/Http/Resources/TaskResource.php` file and update it as follows:

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'due_date' => $this->due_date,
            'priority' => $this->priority,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
```

Here, we've defined the fields that should be included in the JSON response for a task and how they should be formatted. For more complex transformations, you can customize the `toArray` method as needed.

Now, update the `TaskController` to use this resource when returning task data instead of returning the raw model:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\TaskResource;
use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();
        // Change this line to use the TaskResource:
        return TaskResource::collection($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'priority' => 'required|integer|min:1|max:5',
        ]);

        $task = $request->user()->tasks()->create($validated);

        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        return new TaskResource($task);
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'priority' => 'required|integer|min:1|max:5',
        ]);

        $task->update($request->all());
        return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
```

Now, when you fetch tasks, create a new task, or update an existing task, the response will be formatted according to the `TaskResource` class.

## Testing the API Endpoints

To test the new Task API, you can again use `curl` or a tool like Postman or Insomnia.

Let's first create a new task:

```bash
curl -X POST http://laravel-crud-api.test/api/tasks \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer <your_access_token_here>' \
    -d '{
        "title": "New Task",
        "description": "Task description",
        "status": "pending",
        "due_date": "2024-12-31",
        "priority": 2
    }'
```

As a response, you should see the newly created task:

```json
{
  "id": 1,
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "due_date": "2024-12-31",
  "priority": 2,
  "created_at": "2024-07-01T00:00:00.000000Z",
  "updated_at": "2024-07-01T00:00:00.000000Z"
}
```

You can then fetch all tasks:

```bash
curl -X GET http://laravel-crud-api.test/api/tasks \
    -H 'Authorization: Bearer <your_access_token_here>'
```

This will return a list of tasks in JSON format.

## Adding Pagination

To improve performance and reduce payload size, we can add pagination to the task list. Laravel provides a simple way to paginate query results using the `paginate` method when fetching data. That way the response will include only a subset of tasks per page instead of the entire collection which can be large depending on the number of entries in the database.

To do that, update the `index` method in `TaskController` and change the `all` method to `paginate` followed by the number of items per page:

```php
public function index()
{
    $tasks = Task::paginate(15);
    return TaskResource::collection($tasks);
}
```

This pagination method will limit the number of tasks returned to 15 per page, significantly reducing the payload size for large datasets.

The response will now include additional pagination metadata such as the total number of items, the number of pages, and links to the next and previous pages, allowing for easy navigation through the entire collection of tasks.

## Implementing Request Classes

Request classes allow you to encapsulate request validation logic within dedicated classes. This helps keep your controller clean and improves reusability.

To keep our controller clean and improve reusability, let's create dedicated request classes for validation for creating and updating tasks:

```bash
php artisan make:request StoreTaskRequest
php artisan make:request UpdateTaskRequest
```

Update `app/Http/Requests/StoreTaskRequest.php` to include the validation rules:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'priority' => 'required|integer|min:1|max:5',
        ];
    }
}
```

Update `app/Http/Requests/UpdateTaskRequest.php` the same way:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'priority' => 'required|integer|min:1|max:5',
        ];
    }
}
```

Now, we are ready to update the `TaskController` to use these request classes instead of validating the request directly in the controller methods:

```php
// Include the request classes at the top:
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    // ... other methods ...

    public function store(StoreTaskRequest $request)
    {
        $task = $request->user()->tasks()->create($request->validated());
        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());
        return new TaskResource($task);
    }

    // ... other methods ...
}
```

The end-user will still receive the same JSON response, but the validation logic is now encapsulated within the request classes. This makes the controller cleaner and easier to maintain.

## Testing the API

To ensure our API works as expected, Laravel provides a powerful testing suite out of the box.

To learn more about testing in Laravel along with Neon branding, check out the [Testing Laravel Applications with Neon's Database Branching](https://neon.tech/guides/laravel-test-on-branch).

## Adding API Documentation

For better developer experience, it's important to have good API documentation.

You can use a third-party package called [Scribe](https://scribe.knuckles.wtf/) to generate your API documentation.

To install Scribe, run the following command:

```bash
composer require --dev knuckleswtf/scribe
```

Publish the configuration file:

```bash
php artisan vendor:publish --tag=scribe-config
```

Then update the `config/scribe.php` file to configure the documentation settings according to your preferences.

Generate the documentation:

```bash
php artisan scribe:generate
```

This will create a `public/docs` directory with the generated API documentation. You can access it by visiting `http://laravel-crud-api.test/docs`. The generated format will also include Postman collections and OpenAPI specifications.

## Implementing API Versioning

As your API evolves, you might need to introduce breaking changes. API versioning allows you to do this without affecting existing clients.

To implement a simple versioning strategy, you can prefix your API routes with a version number. This way, you can maintain backward compatibility while introducing new features in future versions.

To do that, create a new directory for v1 of your API:

```bash
mkdir app/Http/Controllers/Api/V1
```

Move your `TaskController.php` to this new directory and update its namespace:

```php
namespace App\Http\Controllers\Api\V1;
```

Then update your `routes/api.php` file to include versioning and the new namespace:

```php
// Update the TaskController import at the top:
use App\Http\Controllers\Api\V1\TaskController;

// Update the routes to include the version prefix:
Route::prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::apiResource('tasks', \App\Http\Controllers\Api\V1\TaskController::class);
    });
});
```

Now, your API endpoints will be prefixed with `/api/v1`. This allows you to introduce breaking changes in future versions without affecting existing clients.

Later on, you can create a new version (e.g., `v2`) and update the routes accordingly to maintain backward compatibility.

## Implementing Caching

To improve performance, especially for frequently accessed and rarely changing data, it is a good idea to implement caching for our task list.

This can significantly reduce the response time and server load and reduce the number of database queries putting less pressure on the database.

As an example, let's implement that for the `index` method in `TaskController`:

```php
// Include the Cache facade at the top:
use Illuminate\Support\Facades\Cache;

public function index()
{
    // Use the Cache facade to store the tasks for one hour
    $tasks = Cache::remember('tasks', 3600, function () {
        return Task::paginate(15);
    });

    return TaskResource::collection($tasks);
}
```

This caches the task list for one hour. Remember to clear the cache when tasks are updated, created, or deleted.

## Conclusion

In this guide, we've walked through the process of building a simple CRUD API with Laravel, secured with Laravel Sanctum for authentication.

We've covered setting up the project, configuring the database with Neon, and implementing CRUD operations for a Task model. We also added essential features such as API versioning, API documentation, and caching to improve the API's performance, security, and maintainability.

By following these steps, you now have a fully functional API that allows authenticated users to manage tasks effectively. This can be used as the foundation for more complex applications and extended with additional features as needed.

As next steps you can think about adding more features to the API, such as search, filtering, sorting, and more advanced authentication and authorization mechanisms.

Additionally, it is a good idea to implement throttling to protect your API from abuse and to ensure fair usage.

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Scribe Documentation](https://scribe.knuckles.wtf/laravel)
- [Neon Documentation](/docs)
