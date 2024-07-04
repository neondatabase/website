---
title: Building a Todo CLI App with Laravel Zero and Neon Postgres
subtitle: Learn how to create a command-line interface (CLI) application using Laravel Zero and Neon Postgres for efficient task management.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-07-01T00:00:00.000Z'
updatedOn: '2024-07-01T00:00:00.000Z'
---

[Laravel Zero](https://laravel-zero.com/) is a micro-framework that provides a starting point for your console application.

Combined with Neon's serverless Postgres database, you can create powerful CLI tools with persistent storage.

In this guide, we'll build a Todo CLI app that allows users to manage their tasks efficiently from the command line.

By the end of this tutorial, you'll have a fully functional Todo CLI app where users can add, list, update, and delete tasks. We'll also implement task prioritization and due dates to enhance the app's functionality.

## Prerequisites

Before we start, make sure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for database hosting
- Basic knowledge of PHP and Laravel

## Setting up the Project

Let's start by creating a new Laravel Zero project and setting up the necessary components.

### Creating a New Laravel Zero Project

Open your terminal and run the following command to create a new Laravel Zero project:

```bash
composer create-project laravel-zero/laravel-zero todo-cli
cd todo-cli
```

This command creates a new Laravel Zero project in a directory named `todo-cli` and installs all the necessary dependencies.

Once the project is created, you can run the following command to rename the default `app` namespace to `todo`:

```bash
php application app:rename todo
```

To test the application, run:

```bash
php todo inspire
```

This command should display an inspirational quote from Laravel as a confirmation that the application is set up correctly.

### Installing Required Add-Ons

Out of the box Laravel Zero provides a basic structure for CLI applications. Laravel Zero offers a variety of add-ons to extend the functionality of your CLI app which includes database support, testing, logging, file system, scheduler, and more.

To install the database package, run:

```bash
php todo app:install database
```

> The `todo` command is the name of the executable file we defined in the previous step using the `app:rename` command.

Additionally, we can install the `fakerphp/faker` package to generate sample data for testing later on:

```bash
composer require fakerphp/faker --dev
```

### Configuring the Database

The `config/database.php` file will include the database configuration for your application looking like this:

```php
'connections' => [
    // ... other connections ...

    'neon' => [
        'driver' => 'pgsql',
        'url' => env('DATABASE_URL'),
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', '5432'),
        'database' => env('DB_DATABASE', 'forge'),
        'username' => env('DB_USERNAME', 'forge'),
        'password' => env('DB_PASSWORD', ''),
        'charset' => 'utf8',
        'prefix' => '',
        'prefix_indexes' => true,
        'schema' => 'public',
        'sslmode' => 'prefer',
    ],
],
```

Rather than hardcoding the database credentials in the configuration file, we can use environment variables to store sensitive information securely. Create a `.env` file in the root of your project and add your Neon database credentials:

```env
DB_CONNECTION=neon
DATABASE_URL=postgres://your-username:your-password@your-neon-hostname/your-database
DB_HOST=your-neon-hostname
DB_PORT=5432
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

Make sure to replace the placeholders with your actual Neon database details.

## Creating the Todo App Structure

Now that we have our basic setup, let's create the structure for our Todo CLI app, including models, migrations, and commands.

### Creating the Task Model and Migration

Just like a standard Laravel application, we'll create a `Task` model to represent the tasks in our Todo app.

```bash
php todo make:model Task -m
```

Update the migration file in `database/migrations` to define the structure of our tasks table:

```php
public function up()
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
        $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
        $table->date('due_date')->nullable();
        $table->timestamps();
    });
}
```

This migration creates a `tasks` table with columns for the task title, description, status, priority, and due date.

Now, update the `app/Task.php` model to define the fillable attributes:

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'description', 'status', 'priority', 'due_date'];

    protected $casts = [
        'due_date' => 'date',
    ];
}
```

Run the migration to create the tasks table in your Neon database:

```bash
php todo migrate
```

This command will create the `tasks` table in your Neon database.

### Creating Commands

Laravel Zero uses commands to define the CLI functionality. Let's create commands for adding, listing, updating, and deleting tasks.

#### Add Task Command

Create a new command to add tasks:

```bash
php todo make:command AddTaskCommand
```

Update the `app/Commands/AddTaskCommand.php` the file to define the command signature and functionality:

```php
<?php

namespace App\Commands;

use App\Task;
use Carbon\Carbon;
use LaravelZero\Framework\Commands\Command;

class AddTaskCommand extends Command
{
    protected $signature = 'task:add {title} {--description=} {--priority=medium} {--due-date=}';
    protected $description = 'Add a new task';

    public function handle()
    {
        $task = Task::create([
            'title' => $this->argument('title'),
            'description' => $this->option('description'),
            'priority' => $this->option('priority'),
            'due_date' => $this->option('due-date') ? Carbon::parse($this->option('due-date')) : null,
        ]);

        $this->info("Task added successfully! ID: {$task->id}");
    }
}
```

This command allows users to add a new task with a title, description, priority, and due date.

Rundown of the command signature:

- `{title}`: The title of the task (required argument). Required arguments are passed without the `--` prefix.
- `--description`: The description of the task (optional option)
- `--priority`: The priority of the task (optional option with a default value of `medium`)
- `--due-date`: The due date of the task (optional option)

The `handle` method creates a new task record in the database with the provided details and displays a success message with the ID of the newly created task.

To verify that the command works, run:

```bash
php todo task:add "Complete Laravel Zero guide" --description="Write a guide on creating a Todo CLI app" --priority=high --due-date=2024-07-15
```

You should see a success message with the ID of the newly created task.

#### List Tasks Command

Next, let's create a command to list tasks so we can view all tasks or filter them by status or priority:

```bash
php todo make:command ListTasksCommand
```

Update the `app/Commands/ListTasksCommand.php` file:

```php
<?php

namespace App\Commands;

use App\Task;
use LaravelZero\Framework\Commands\Command;

class ListTasksCommand extends Command
{
    protected $signature = 'task:list {--status=} {--priority=}';
    protected $description = 'List all tasks';

    public function handle()
    {
        $query = Task::query();

        if ($this->option('status')) {
            $query->where('status', $this->option('status'));
        }

        if ($this->option('priority')) {
            $query->where('priority', $this->option('priority'));
        }

        $tasks = $query->get();

        $headers = ['ID', 'Title', 'Status', 'Priority', 'Due Date'];
        $rows = $tasks->map(function ($task) {
            return [
                $task->id,
                $task->title,
                $task->status,
                $task->priority,
                $task->due_date ? $task->due_date->format('Y-m-d') : 'N/A',
            ];
        });

        $this->table($headers, $rows);
    }
}
```

Rundown of the command signature:

- `--status`: Filter tasks by status (optional option)
- `--priority`: Filter tasks by priority (optional option)

The `handle` method retrieves tasks from the database based on the provided filters (if any) and displays them in a table format.

Now you can list all tasks or filter them by status or priority:

```bash
php todo task:list
```

The result will be displayed in a table format with columns for ID, Title, Status, Priority, and Due Date:

```sql
+----+-----------------------------+---------+----------+------------+
| ID | Title                       | Status  | Priority | Due Date   |
+----+-----------------------------+---------+----------+------------+
| 1  | Complete Laravel Zero guide | pending | high     | 2024-07-15 |
+----+-----------------------------+---------+----------+------------+
```

To filter tasks by status or priority, you can use the `--status` and `--priority` options:

```bash
php todo task:list --status=pending
```

#### Update Task Command

Now that we have the ability to add and list tasks, let's create a command to update tasks:

```bash
php todo make:command UpdateTaskCommand
```

Update the `app/Commands/UpdateTaskCommand.php` file and define the command signature and functionality:

```php
<?php

namespace App\Commands;

use App\Task;
use Carbon\Carbon;
use LaravelZero\Framework\Commands\Command;

class UpdateTaskCommand extends Command
{
    protected $signature = 'task:update {id} {--title=} {--description=} {--status=} {--priority=} {--due-date=}';
    protected $description = 'Update an existing task';

    public function handle()
    {
        $task = Task::find($this->argument('id'));

        if (!$task) {
            $this->error("Task not found!");
            return;
        }

        $updates = [];

        if ($this->option('title')) {
            $updates['title'] = $this->option('title');
        }

        if ($this->option('description')) {
            $updates['description'] = $this->option('description');
        }

        if ($this->option('status')) {
            $updates['status'] = $this->option('status');
        }

        if ($this->option('priority')) {
            $updates['priority'] = $this->option('priority');
        }

        if ($this->option('due-date')) {
            $updates['due_date'] = Carbon::parse($this->option('due-date'));
        }

        $task->update($updates);

        $this->info("Task updated successfully!");
    }
}
```

Rundown of the command signature:

- `{id}`: The ID of the task to update (required argument)
- `--title`: The new title of the task (optional option)
- `--description`: The new description of the task (optional option)
- `--status`: The new status of the task (optional option)
- `--priority`: The new priority of the task (optional option)
- `--due-date`: The new due date of the task (optional option)

The `handle` method retrieves the task by ID, checks if it exists, and updates the task with the provided details. It displays a success message if the task is updated successfully.

To update a task, run:

```bash
php todo task:update 1 --status=in_progress
```

You will get a `Task updated successfully!` message if the task is updated successfully.

To verify the update, list the tasks again:

```bash
php todo task:list
```

Now you should see the updated status of the task:

```sql
+----+-----------------------------+-------------+----------+------------+
| ID | Title                       | Status      | Priority | Due Date   |
+----+-----------------------------+-------------+----------+------------+
| 1  | Complete Laravel Zero guide | in_progress | high     | 2024-07-15 |
+----+-----------------------------+-------------+----------+------------+
```

Try to also update other fields like the title, description, priority, or due date.

#### Delete Task Command

Finally to complete the basic CRUD operations, let's create a command to delete tasks:

```bash
php todo make:command DeleteTaskCommand
```

Update the `app/Commands/DeleteTaskCommand.php` file:

```php
<?php

namespace App\Commands;

use App\Task;
use LaravelZero\Framework\Commands\Command;

class DeleteTaskCommand extends Command
{
    protected $signature = 'task:delete {id}';
    protected $description = 'Delete a task';

    public function handle()
    {
        $task = Task::find($this->argument('id'));

        if (!$task) {
            $this->error("Task not found!");
            return;
        }

        $task->delete();

        $this->info("Task deleted successfully!");
    }
}
```

Here the `id` argument is required to identify the task to be deleted.

The `handle` method retrieves the task by ID, checks if it exists, deletes the task, and displays a success message if the task is deleted successfully.

To delete a task, run:

```bash
php todo task:delete 1
```

You should see a `Task deleted successfully!` message if the task is deleted successfully.

You can also try deleting a task that doesn't exist to see the error message:

```bash
php todo task:delete 2
```

This will display a `Task not found!` error message.

## Implementing Additional Features

To enhance our Todo CLI app, let's implement some additional features like task prioritization and due date reminders.

### Task Prioritization

We've already included a priority field in our tasks table. Let's update the `ListTasksCommand` to sort tasks by priority:

Update the `handle` method in `app/Commands/ListTasksCommand.php`:

```php {14-19}
public function handle()
{
    $query = Task::query();

    if ($this->option('status')) {
        $query->where('status', $this->option('status'));
    }

    if ($this->option('priority')) {
        $query->where('priority', $this->option('priority'));
    }

    $tasks = $query->get(); // [!code --]
    $tasks = $query->orderByRaw("CASE
        WHEN priority = 'high' THEN 1
        WHEN priority = 'medium' THEN 2
        WHEN priority = 'low' THEN 3
        ELSE 4
    END")->get();

    // ... rest of the method
}
```

This modification sorts the tasks by priority, with high priority tasks appearing first.

### Due Date Reminders

Let's create a new command to show tasks that are due soon:

```bash
php todo make:command DueTasksCommand
```

Update the `app/Commands/DueTasksCommand.php` to include the due date reminder functionality:

```php
<?php

namespace App\Commands;

use App\Task;
use Carbon\Carbon;
use LaravelZero\Framework\Commands\Command;

class DueTasksCommand extends Command
{
    protected $signature = 'task:due {days=7}';
    protected $description = 'Show tasks due within the specified number of days';

    public function handle()
    {
        $days = (int) $this->argument('days');
        $dueDate = Carbon::now()->addDays($days);

        $tasks = Task::where('status', '!=', 'completed')
            ->whereDate('due_date', '<=', $dueDate)
            ->orderBy('due_date')
            ->get();

        if ($tasks->isEmpty()) {
            $this->info("No tasks due within the next {$days} days.");
            return;
        }

        $headers = ['ID', 'Title', 'Priority', 'Due Date', 'Days Left'];
        $rows = $tasks->map(function ($task) {
            $daysLeft = Carbon::now()->diffInDays($task->due_date, false);
            return [
                $task->id,
                $task->title,
                $task->priority,
                $task->due_date->format('Y-m-d'),
                $daysLeft,
            ];
        });

        $this->table($headers, $rows);
    }
}
```

This command shows tasks that are due within a specified number of days (default is 7) and aren't completed yet.

The `handle` method calculates the due date based on the provided number of days, retrieves tasks that are due within that period, and displays them in a table format with columns for ID, Title, Priority, Due Date, and Days Left.

To show tasks due within the next 14 days, run:

```bash
php todo task:due 14
```

## Testing the Todo CLI App

Now that we have implemented our Todo CLI app, let's try the complete workflow to ensure everything works as expected.

1. Add a task:

```bash
php todo task:add "Complete Laravel Zero guide" --description="Write a guide on creating a Todo CLI app" --priority=high --due-date=2024-07-15
```

2. List all tasks:

```bash
php todo task:list
```

3. Update a task:

```bash
php todo task:update 1 --status=in_progress
```

4. Show due tasks:

```bash
php todo task:due 14
```

5. Delete a task:

```bash
php todo task:delete 1
```

## Building the Application

Rather than having to run the `php todo` command each time, Laravel Zero allows you to build your application into a single executable file. To do this, run:

```bash
php todo app:build
```

This command will generate a standalone executable in the `builds` directory, which you can distribute and run on other systems without requiring PHP or Composer to be installed.

You will be prompted to choose the version of the application you want to build. Select the version that best suits your needs.

To run the built application, use the following command:

```bash
./builds/todo
```

To handle your database environment variables, you can create a `.env` file in the same directory as the built executable or set the environment variables directly in your system.

## Conclusion

In this tutorial, we've built a fully functional Todo CLI app using Laravel Zero and Neon Postgres. We've implemented features such as adding, listing, updating, and deleting tasks, as well as task prioritization and due date reminders.

This implementation provides a solid foundation for a CLI-based task management system, but there are always ways to improve and expand its functionality:

- Implement task categories or tags
- Add support for recurring tasks
- Implement data export and import functionality
- Add user authentication for multi-user support
- Implement task dependencies (subtasks)

By combining the power of Laravel Zero and the scalability of Neon Postgres, you can quickly create efficient and powerful CLI applications that meet your specific needs.

## Additional Resources

- [Laravel Zero Documentation](https://laravel-zero.com/docs/introduction)
- [Illuminate Database Documentation](https://laravel.com/docs/database)
- [Carbon Documentation](https://carbon.nesbot.com/docs/)
- [Neon Documentation](/docs)
