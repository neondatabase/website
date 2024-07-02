---
title: Building a TODO Application with Laravel, Livewire, and Volt
subtitle: Learn how to create a simple yet powerful TODO app using Laravel, Livewire, Volt, and Laravel Breeze for authentication
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-06-30T00:00:00.000Z'
updatedOn: '2024-06-30T00:00:00.000Z'
---

In this guide, we'll walk through the process of building a TODO application using [Laravel](https://laravel.com/), [Livewire](https://livewire.laravel.com/), and [Volt](https://livewire.laravel.com/docs/volt).

We'll use [Laravel Breeze](https://laravel.com/docs/11.x/starter-kits) for authentication and Neon Postgres as our database.

By the end of this tutorial, you'll have a simple yet fully functional TODO application that allows users to create, update, and delete tasks.

## Prerequisites

Before we begin, ensure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- [Node.js](https://nodejs.org/) and npm for managing front-end assets
- A [Neon](https://console.neon.tech/signup) account for database hosting
- Basic knowledge of Laravel and Livewire

## Setting up the Project

Let's start by creating a new Laravel project and setting up the necessary components for our TODO application.

### Install the Laravel Installer

The Laravel installer is a command-line tool that simplifies the process of creating new Laravel projects. If you don't have it installed, run the following command:

```bash
composer global require laravel/installer
```

To verify the installation, run:

```bash
laravel --version
```

This should display the Laravel installer version, confirming that the installation was successful.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project using the Laravel installer:

```bash
laravel new laravel-todo-volt
```

Follow the on-screen instructions to create the project by selecting the following options:

- Starter Kit: 'Laravel Breeze'
- Breeze stack: 'Livewire (Volt Class API) with Alpine'
- Dark mode: Based on your preference
- Testing framework: Pest
- Database: PostgreSQL

This command creates a new Laravel project named `laravel-todo-volt` with the selected options and installs the necessary dependencies like Breeze, Livewire, and Volt.

After the project is created, navigate to the project directory:

```bash
cd laravel-todo-volt
```

This can also be done directly via `composer` instead of using the Laravel installer, but the Laravel installer provides an interactive setup process that simplifies the initial project setup rather than running multiple commands manually.

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

Make sure to replace `your-neon-hostname`, `your_database_name`, `your_username`, and `your_password` with your actual Neon database details.

Once you've updated the `.env` file, run the following command to create the default tables:

```bash
php artisan migrate
```

This will create the necessary tables in your Neon database.

### Compiling Assets

Laravel Breeze uses Vite for asset compilation. Run the following commands to install dependencies and compile assets:

```bash
npm install
npm run dev
```

Keep the Vite development server running in the background as you continue with the next steps.

## Creating the TODO Model and Migration

A model in Laravel represents a database table and allows you to interact with the table's data using Eloquent ORM. The migration file defines the structure of the database table and is used to create or modify the table.

The standard convention in Laravel is to create the model with singular naming and the migration with plural naming. For example, a `Todo` model would correspond to a `todos` table in the database, `User` model to `users` table, and so on.

Now, let's create the `Todo` model along with its migration:

```bash
php artisan make:model Todo -m
```

Open the newly created migration file in `database/migrations` and update it to include the necessary columns for the `todos` table:

```php
public function up()
{
    Schema::create('todos', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('description')->nullable();
        $table->boolean('is_completed')->default(false);
        $table->timestamps();
    });
}
```

This migration creates a `todos` table with columns for the todo title, description, completion status, and a foreign key to the `users` table.

The `onDelete('cascade')` method ensures that todos are deleted when the corresponding user is deleted so that we don't have orphaned records left in the database.

Update the `app/Models/Todo.php` model file to include the relationship with the user and the fillable fields:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'is_completed'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

The `$fillable` property specifies which fields can be mass-assigned when creating or updating a todo task. This helps protect against mass-assignment vulnerabilities and ensures that only the specified fields are allowed to be updated.

Also, update the `app/Models/User.php` file to include the relationship with todos:

```php
public function todos()
{
    return $this->hasMany(Todo::class);
}
```

This method defines a one-to-many relationship between the `User` and `Todo` models, allowing us to retrieve all todos associated with a user. For example, `Auth::user()->todos` will return all todos created by the authenticated user.

Now, run the migrations to create the `todos` table in your Neon database:

```bash
php artisan migrate
```

## Creating the Volt Component

Volt is a new addition to Livewire that allows you to define Livewire components using a class-based API.

This makes it easier to organize and manage your components, especially for larger applications with many components.

Let's create a Volt component for our TODO list:

```bash
php artisan make:volt TodoList
```

This command creates a new Volt component file at `resources/views/livewire/todolist.blade.php`. This single file will contain both the component's logic and its template compared to the traditional Livewire components where the logic is in a separate PHP file.

```php
<?php

use App\Models\Todo;
use Illuminate\Support\Facades\Auth;
use function Livewire\Volt\{state, computed, action};

state(['newTodoTitle' => '']);

$todos = computed(function () {
    return Auth::user()->todos()->latest()->get();
});

$addTodo = action(function () {
    $this->validate([
        'newTodoTitle' => 'required|min:3'
    ]);

    Auth::user()->todos()->create([
        'title' => $this->newTodoTitle,
    ]);

    $this->newTodoTitle = '';
});

$toggleComplete = action(function (Todo $todo) {
    $todo->update(['is_completed' => !$todo->is_completed]);
});

$deleteTodo = action(function (Todo $todo) {
    $todo->delete();
});

?>

<div>
    <h2 class="text-2xl font-semibold mb-4">Your TODO List</h2>

    <form wire:submit="addTodo" class="mb-4">
        <div class="flex">
            <input
                wire:model="newTodoTitle"
                type="text"
                class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-indigo-400 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                placeholder="Enter a new TODO item"
            >
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">Add</button>
        </div>
        @error('newTodoTitle') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
    </form>

    <ul class="space-y-2">
        @foreach($this->todos as $todo)
            <li class="flex items-center justify-between bg-white p-4 rounded-md shadow dark:bg-gray-800">
                <div class="flex items-center">
                    <input
                        type="checkbox"
                        wire:click="toggleComplete({{ $todo->id }})"
                        {{ $todo->is_completed ? 'checked' : '' }}
                        class="mr-2 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-indigo-400 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    >
                    <span class="{{ $todo->is_completed ? 'line-through text-gray-400' : '' }}">
                        {{ $todo->title }}
                    </span>
                </div>
                <button
                    wire:click="deleteTodo({{ $todo->id }})"
                    class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                >
                    Delete
                </button>
            </li>
        @endforeach
    </ul>
</div>
```

This Volt component combines the component's logic and template in a single file. Let's break down the key parts:

- We use `state()` to define reactive properties like `newTodoTitle`.
- The `computed()` function is used to create a dynamic property for fetching todos.
- The `action()` defines methods that can be triggered from the template.
- The template section uses Livewire directives like `wire:submit` and `wire:click` to interact with the component's logic.

This approach allows for a more self-contained component definition, making it easier to understand and maintain your Livewire components rather than having the logic and template in separate files.

## Integrating the TODO List into the Dashboard

Now that we have the Volt component ready, let's integrate our TODO list into the main dashboard.

Open `resources/views/dashboard.blade.php` and replace its content with:

```html
<x-app-layout>
  <x-slot name="header">
    <h2 class="text-gray-800 dark:text-gray-200 text-xl font-semibold leading-tight">
      {{ __('Dashboard') }}
    </h2>
  </x-slot>

  <div class="py-12">
    <div class="mx-auto max-w-7xl lg:px-8 sm:px-6">
      <div class="dark:bg-gray-800 overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div class="text-gray-900 dark:text-gray-100 p-6">
          <livewire:todolist />
        </div>
      </div>
    </div>
  </div>
</x-app-layout>
```

This integrates our `TodoList` component into the Breeze dashboard by using the `livewire:todolist` directive. When you visit the dashboard, you should see the TODO list component displayed on the page.

As we have used the `auth()->user()` method in the `TodoList` component to fetch the user's todos, each user will see their own list of todos when they visit the dashboard, however we have not yet implemented any authorization to ensure that users can only manage their own todos. We'll cover this in the next section.

## Adding Authorization

To ensure users can only manage their own todos, let's implement some basic authorization.

In addition to the authentication provided by Laravel Breeze, Laravel provides an authorization system that allows you to define policies for your models. These policies define the rules for accessing and managing resources, such as todos in our case.

Create a new policy for the `Todo` model using the following command:

```bash
php artisan make:policy TodoPolicy --model=Todo
```

Open `app/Policies/TodoPolicy.php` and update it to define the authorization rules for updating and deleting todo items:

```php
<?php

namespace App\Policies;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TodoPolicy
{
    public function update(User $user, Todo $todo): bool
    {
        return $user->id === $todo->user_id;
    }

    public function delete(User $user, Todo $todo): bool
    {
        return $user->id === $todo->user_id;
    }
}
```

Here, we define two methods: `update` and `delete`. These methods check if the authenticated user is the owner of the todo by comparing the user's ID with the todo's `user_id`. If the user is the owner, the method returns `true`, allowing the user to update or delete the todo. Otherwise, it returns `false` and denies access.

Now, update the `TodoList` component to use these policies when toggling completion status or deleting todos:

```php
$toggleComplete = action(function (Todo $todo) {
    if (auth()->user()->cannot('update', $todo)) {
        return;
    }
    $todo->update(['is_completed' => !$todo->is_completed]);
});

$deleteTodo = action(function (Todo $todo) {
    if (auth()->user()->cannot('delete', $todo)) {
        return;
    }
    $todo->delete();
});
```

In these updated actions:

- We use `auth()->user()->cannot('update', $todo)` and `auth()->user()->cannot('delete', $todo)` to check if the current user is authorized to perform the respective actions based on the `TodoPolicy` rules.
- If the user is not authorized, the function returns early without performing the action preventing unauthorized access.
- If the user is authorized, the action proceeds as before allowing the user to toggle completion status or delete the todo.

This way you can make sure that users can only toggle completion status or delete todos that they own, as defined in the `TodoPolicy`.

## Writing Tests for Your TODO Application with Pest

Testing is an important part of the development process. There are a few different ways to write tests in Laravel, including PHPUnit and Pest. Choosing the right testing framework depends on your preference and the requirements of your project.

In this section, we'll cover writing tests using Pest, a more expressive and minimalistic testing framework for PHP.

Pest provides a [Livewire plugin](https://pestphp.com/docs/plugins#livewire), which allows you to write tests for Livewire components in a more readable and concise way. To install the Pest plugin for Livewire, run the following command:

```bash
composer require pestphp/pest-plugin-livewire --dev
```

### Setting Up the Test Environment

For this example, we will use an in-memory SQLite database for testing. This ensures that tests run quickly and do not affect your production database.

However, to learn more about testing in Laravel along with Neon branding, check out the [Testing Laravel Applications with Neon's Database Branching](https://neon.tech/guides/laravel-test-on-branch). This guide will help you set up a separate database branch for testing, allowing you to test your application with real data rather than an in-memory database.

To get started, ensure your `.env.testing` file is configured to use an in-memory SQLite database for testing:

```env
APP_KEY=base64:kf_your_app_key_here
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

This will allow us to use the `RefreshDatabase` trait to reset the database before each test, ensuring a clean slate for testing.

> It is important to note that the `RefreshDatabase` trait will clear the database before each test, so make sure to use a separate database for testing to avoid data loss as the database will be reset for each test meaning that any data that you have in the database will be lost.

### Creating and Using a `TodoFactory`

Factories in Laravel generate sample data for models, useful for testing and database seeding with realistic data thanks to the Faker library.

Let's create a factory for our `Todo` model which will generate random todo items for testing:

```bash
php artisan make:factory TodoFactory --model=Todo
```

Update `database/factories/TodoFactory.php` to add the necessary fields and states for generating todo items:

```php
<?php

namespace Database\Factories;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TodoFactory extends Factory
{
    protected $model = Todo::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'is_completed' => $this->faker->boolean(20),
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }

    public function completed()
    {
        return $this->state(['is_completed' => true]);
    }

    public function incomplete()
    {
        return $this->state(['is_completed' => false]);
    }
}
```

This factory generates random todo items with titles, descriptions, and completion status. We've also defined two states: `completed` and `incomplete` to create todos with specific completion statuses.

### Creating Feature Tests

Let's create a feature test file for our TODO list functionality using the following command:

```bash
php artisan make:test TodoListTest
```

This command creates a new test file at `tests/Feature/TodoListTest.php`. Open this file and replace its contents with the following:

```php
<?php

use App\Models\User;
use App\Models\Todo;
use function Pest\Laravel\get;
use function Pest\Laravel\{actingAs};
use function Pest\Livewire\livewire;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('user can view todos', function () {
    $user = User::factory()->create();

    $todos = Todo::factory()->count(3)->create([
        'user_id' => $user->id,
    ]);

    actingAs($user);

    livewire('todolist')
        ->assertSee($todos[0]->title)
        ->assertSee($todos[1]->title)
        ->assertSee($todos[2]->title);
});

test('user can delete a todo', function () {
    $user = User::factory()->create();

    $todo = Todo::factory()->create([
        'user_id' => $user->id,
    ]);

    actingAs($user);

    livewire('todolist')
        ->call('deleteTodo', $todo->id);

    expect(Todo::find($todo->id))->toBeNull();
});

test('user can not delete a todo that does not belong to them', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $todo = Todo::factory()->create([
        'user_id' => $otherUser->id,
    ]);

    actingAs($user);

    livewire('todolist')
        ->call('deleteTodo', $todo->id);

    expect(Todo::find($todo->id))->not->toBeNull();
});
```

These tests cover the following scenarios:

- A user can view their todos when visiting the dashboard.
- A user can delete a todo that belongs to them.
- A user cannot delete a todo that belongs to another user.

The `actingAs()` function is used to authenticate the user before interacting with the Livewire component. This ensures that the user is authorized to perform the actions.

The `livewire()` function is used to interact with the Livewire component and make assertions based on the component's state.

### Running the Tests

Again, before you run the tests, note that the `RefreshDatabase` trait will clear the database before each test, so make sure to use a separate database for testing to avoid data loss like an in-memory SQLite database or a Neon database branch.

You can run these tests using the following command:

```bash
php artisan test
```

This will execute the tests and provide feedback on the results. Writing tests helps ensure that your application behaves as expected and catches bugs early in the development process.

## Conclusion

In this tutorial, we've built a simple yet functional TODO application using Laravel, Livewire, and Volt. We've covered:

1. Setting up a new Laravel project with Breeze, Livewire, and Volt
1. Creating a `Todo` model and migration
1. Implementing a Volt component for managing todos
1. Integrating the TODO list into the dashboard
1. Adding basic authorization to ensure users can only manage their own todos
1. Writing tests for the TODO application using Pest

This application provides a solid foundation for a TODO list, showing the power and simplicity of Laravel, Livewire, and Volt. From here, you could expand the functionality by adding features such as:

- Due dates for todos
- Categorization or tagging of todos
- Sorting and filtering options
- Sharing todos with other users
- Assigning todos to specific users

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Livewire Documentation](https://laravel-livewire.com/docs)
- [Laravel Breeze Documentation](https://laravel.com/docs/breeze)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Neon Documentation](/docs)
