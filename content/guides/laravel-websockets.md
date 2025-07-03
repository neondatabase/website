---
title: Building a Real-Time Task Board with Laravel, Neon, and WebSockets
subtitle: Learn how to create a collaborative task management system using Laravel, Neon Postgres, and WebSockets
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-08-17T00:00:00.000Z'
updatedOn: '2024-08-17T00:00:00.000Z'
---

Real-time features can significantly improve user experience in web applications. They allow users to see updates immediately without refreshing the page. In this guide, we'll demonstrate how to add real-time functionality to a Laravel application using Neon Postgres and WebSockets.

We'll build a collaborative task board where team members can create, update, and move tasks in real-time. By the end of this guide, you'll understand how to set up WebSockets in Laravel, store and retrieve data using Neon Postgres, and broadcast updates to connected clients instantly.

## Prerequisites

Before we begin, make sure you have the following:

- PHP 8.1 or higher installed on your system
- Composer for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account and project

## Setting up the Laravel project

To get started we will need to create a new Laravel project and configuring it with Neon Postgres.

1. Create a new Laravel project:

   ```bash
   composer create-project laravel/laravel realtime-taskboard
   cd realtime-taskboard
   ```

   This will create a new Laravel project in a directory named `realtime-taskboard`. And using the `cd` command, we'll navigate to the project directory.

2. Configure the Neon database connection. Open your `.env` file and update the database settings:

   ```env
   DB_CONNECTION=pgsql
   DB_HOST=your-neon-hostname.neon.tech
   DB_PORT=5432
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

   Replace the placeholders with your Neon database details which you can find in the Neon console.

3. Laravel provides a few starter kits for authentication. We'll use Laravel Breeze for this project to set up authentication:

   ```bash
   composer require laravel/breeze --dev
   php artisan breeze:install blade
   php artisan migrate
   npm install
   npm run dev
   ```

   This will install Laravel Breeze, set up authentication views using Blade, run the migrations to create the necessary tables. The `npm install` and `npm run dev` commands install the frontend dependencies and compile the assets.

Now that we've set up the Laravel project and connected it to Neon Postgres, let's create the task board.

## Creating the Task model and migration

Laravel uses models to interact with the database and migrations to create database tables. The task board will consist of tasks that users can create, update, and move between different statuses (e.g., 'To Do', 'In Progress', 'Done').

Let's create a model and migration for our tasks table.

1. Generate the model and migration:

   ```bash
   php artisan make:model Task -m
   ```

   This command will create a `Task` model and a migration file for the `tasks` table.

2. Update the migration file in `database/migrations` to create the `tasks` table with the necessary columns:

   ```php
   public function up()
   {
       Schema::create('tasks', function (Blueprint $table) {
           $table->id();
           $table->foreignId('user_id')->constrained()->onDelete('cascade');
           $table->string('title');
           $table->text('description')->nullable();
           $table->enum('status', ['todo', 'in_progress', 'done'])->default('todo');
           $table->timestamps();
       });
   }
   ```

   This migration creates a `tasks` table with columns for the task `title`, `description`, `status`, and the user who created the task.

3. Run the migration:

   ```bash
   php artisan migrate
   ```

   This will create the `tasks` table in your Neon Postgres database with the specified columns and constraints in the migration file.

4. Update the `Task` model in `app/Models/Task.php`:

   ```php
   <?php

   namespace App\Models;

   use Illuminate\Database\Eloquent\Factories\HasFactory;
   use Illuminate\Database\Eloquent\Model;

   class Task extends Model
   {
       use HasFactory;

       protected $fillable = ['title', 'description', 'status'];

       public function user()
       {
           return $this->belongsTo(User::class);
       }
   }
   ```

   This model defines the relationship between tasks and users. Each task belongs to a user thanks to the `user()` method defined in the model. The `fillable` property specifies which attributes can be mass-assigned. Laravel then makes it easy to create, update, and retrieve tasks using the `Task` model.

5. One more thing that we will have to do is to update the `User` model in `app/Models/User.php` to define the relationship between users and tasks:

   ```php
   public function tasks()
   {
       return $this->hasMany(Task::class);
   }
   ```

   This defines the relationship between users and tasks. Each user can have multiple tasks and can be retrieved using the `tasks()` method on the `User` model.

## Setting up WebSockets

Laravel provides built-in support for broadcasting events using WebSockets. We'll use WebSockets to broadcast task creation and updates in real-time to connected clients using Pusher.

Instead of using Pusher, there are other options like [Laravel WebSockets](https://beyondco.de/docs/laravel-websockets) by Beyond Code, which is a self-hosted WebSockets server for Laravel applications. However, for this guide, we'll use Pusher, as it takes care of the WebSockets infrastructure for us.

With Laravel 11 to install broadcasting, you can run the following command:

```bash
php artisan install:broadcasting
```

Follow the prompts to set up broadcasting and when asked for `reverb`, select "No" as we are going to use Pusher instead.

To set up Pusher, you need to do the following:

1. Sign up for a free account at [Pusher](https://pusher.com/).

2. After creating an account and a new app, update your `.env` file with your Pusher credentials:

   ```env
   PUSHER_APP_ID="your-pusher-app-id"
   PUSHER_APP_KEY="your-pusher-key"
   PUSHER_APP_SECRET="your-pusher-secret"
   PUSHER_HOST=
   PUSHER_PORT=443
   PUSHER_SCHEME="https"
   PUSHER_APP_CLUSTER="mt1"

   VITE_APP_NAME="${APP_NAME}"
   VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
   VITE_PUSHER_HOST="${PUSHER_HOST}"
   VITE_PUSHER_PORT="${PUSHER_PORT}"
   VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
   VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

   BROADCAST_DRIVER=pusher
   ```

   The `PUSHER_APP_ID`, `PUSHER_APP_KEY`, and `PUSHER_APP_SECRET` values can be found in your Pusher dashboard. The `PUSHER_APP_CLUSTER` value depends on the region where your app is hosted. For example, `mt1` is for the `mt1` region.

   The `VITE_` variables are used for client-side configuration in our JavaScript code using Vite. In our case, we'll use Vite to manage our frontend assets along with Laravel Echo and Pusher.

3. Install Laravel Echo and Pusher JS:

   ```bash
   npm install --save-dev laravel-echo pusher-js
   ```

   Laravel Echo is a JavaScript library that makes it easy to work with WebSockets and listen for events. Pusher JS is the JavaScript client library for Pusher that Laravel Echo uses to communicate with the Pusher service where our events are broadcasted to.

4. Open `resources/js/echo.js` and update it with your Pusher credentials:

   ```javascript
   import Echo from 'laravel-echo';

   import Pusher from 'pusher-js';
   window.Pusher = Pusher;

   window.Echo = new Echo({
     broadcaster: 'pusher',
     key: import.meta.env.VITE_PUSHER_APP_KEY,
     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
     forceTLS: true,
   });
   ```

   Make sure that you still have the `npm run dev` command running in the background to compile the assets and make the changes available in the browser.

## Creating the task board interface

Now that we've set up the database, models, and WebSockets, let's create the task board interface where users can view, create, and update tasks.

Create a new blade file at `resources/views/taskboard.blade.php` where we'll build the task board interface:

```html
<x-app-layout>
  <x-slot name="header">
    <h2 class="text-gray-800 text-xl font-semibold leading-tight">{{ __('Task Board') }}</h2>
  </x-slot>

  <div class="py-12">
    <div class="mx-auto max-w-7xl lg:px-8 sm:px-6">
      <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div class="border-gray-200 border-b bg-white p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div id="todo" class="bg-gray-100 rounded-lg p-4 shadow">
              <h3 class="text-blue-600 mb-4 text-lg font-semibold">To Do</h3>
              <div class="task-column space-y-4">
                <!-- Tasks will be inserted here -->
              </div>
            </div>
            <div id="in_progress" class="bg-gray-100 rounded-lg p-4 shadow">
              <h3 class="text-yellow-600 mb-4 text-lg font-semibold">In Progress</h3>
              <div class="task-column space-y-4">
                <!-- Tasks will be inserted here -->
              </div>
            </div>
            <div id="done" class="bg-gray-100 rounded-lg p-4 shadow">
              <h3 class="text-green-600 mb-4 text-lg font-semibold">Done</h3>
              <div class="task-column space-y-4">
                <!-- Tasks will be inserted here -->
              </div>
            </div>
          </div>

          <div class="mt-8">
            <h3 class="mb-4 text-lg font-bold">Add a New Task</h3>
            <form id="task-form" class="space-y-4">
              @csrf
              <div>
                <label for="title" class="text-gray-700 block text-sm font-medium"
                  >Task Title</label
                >
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter task title"
                  class="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full rounded-md border p-2 shadow-sm"
                  required
                />
              </div>
              <div>
                <label for="description" class="text-gray-700 block text-sm font-medium"
                  >Task Description</label
                >
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter task description"
                  class="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full rounded-md border p-2 shadow-sm"
                ></textarea>
              </div>
              <input type="hidden" name="status" value="todo" />
              <div>
                <button
                  type="submit"
                  class="bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 w-full rounded-md px-4 py-2 text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const taskForm = document.getElementById('task-form');
      const columns = ['todo', 'in_progress', 'done'];

      function addTaskToColumn(task) {
        const column = document.querySelector(`#${task.status} .task-column`);
        const taskElement = document.createElement('div');
        taskElement.id = `task-${task.id}`;
        taskElement.className = 'bg-white p-4 rounded-lg shadow';
        taskElement.innerHTML = `
                    <h4 class="font-semibold text-lg mb-2">${task.title}</h4>
                    <p class="text-gray-600 mb-4">${task.description || 'No description'}</p>
                    <select class="task-status w-full p-2 border border-gray-300 rounded-md" data-task-id="${task.id}">
                        ${columns.map((status) => `<option value="${status}" ${status === task.status ? 'selected' : ''}>${status.replace('_', ' ')}</option>`).join('')}
                    </select>
                `;
        column.appendChild(taskElement);
      }

      function loadTasks() {
        axios
          .get('/tasks')
          .then((response) => {
            response.data.forEach(addTaskToColumn);
          })
          .catch((error) => {
            console.error('Error loading tasks:', error);
          });
      }

      taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        axios
          .post('/tasks', Object.fromEntries(formData))
          .then((response) => {
            this.reset();
            addTaskToColumn(response.data);
          })
          .catch((error) => {
            console.error('Error creating task:', error);
          });
      });

      document.addEventListener('change', function (e) {
        if (e.target.classList.contains('task-status')) {
          const taskId = e.target.dataset.taskId;
          const newStatus = e.target.value;
          axios
            .put(`/tasks/${taskId}`, { status: newStatus })
            .then((response) => {
              const taskElement = document.getElementById(`task-${taskId}`);
              if (taskElement) {
                taskElement.remove();
              }
              addTaskToColumn(response.data);
            })
            .catch((error) => {
              console.error('Error updating task:', error);
            });
        }
      });

      Echo.channel('taskboard')
        .listen('TaskCreated', (e) => {
          addTaskToColumn(e.task);
        })
        .listen('TaskUpdated', (e) => {
          const taskElement = document.getElementById(`task-${e.task.id}`);
          if (taskElement) {
            taskElement.remove();
          }
          addTaskToColumn(e.task);
        });

      loadTasks();
    });
  </script>
</x-app-layout>
```

The majority of the code is HTML and JavaScript that creates the task board interface and handles task creation and updates. The real-time functionality of our task board is powered by WebSockets, implemented using Laravel Echo and Pusher. Here's a breakdown of how it works:

1. **Channel Setup**: We create a channel named 'taskboard' for our real-time communications:

   ```javascript
   Echo.channel('taskboard');
   ```

   This channel will be used for broadcasting and listening to task-related events.

2. **Event Listening**: We set up listeners for two types of events:

   ```javascript
   .listen('TaskCreated', (e) => {
       addTaskToColumn(e.task);
   })
   .listen('TaskUpdated', (e) => {
       const taskElement = document.getElementById(`task-${e.task.id}`);
       if (taskElement) {
           taskElement.remove();
       }
       addTaskToColumn(e.task);
   });
   ```

   - `TaskCreated`: When a new task is created, we add it to the appropriate column.
   - `TaskUpdated`: When a task is updated, we remove the old task element and add the updated one.

   For more information on how events are broadcasted and listened to, check out the [Getting Started with Laravel Events and Listeners](/guides/laravel-events-and-listeners) guide.

3. **Server-Side Broadcasting**: For the above to work, in our Laravel controllers, we will broadcast these events after creating or updating a task:

   ```php
   broadcast(new TaskCreated($task))->toOthers();
   broadcast(new TaskUpdated($task))->toOthers();
   ```

   The `toOthers()` method ensures that the event is not sent back to the user who initiated the action.

4. **Real-Time Updates**: When these events are received, the task board updates instantly for all connected users, providing a collaborative, real-time experience.

This WebSockets implementation allows for immediate synchronization across all clients without the need for polling or page refreshes, creating a smooth and responsive user experience.

## Handling tasks

As mentioned earlier, we'll use Laravel controllers to handle task creation and updates and broadcast events to connected clients.

1. Create a controller for tasks:

   ```bash
   php artisan make:controller TaskController
   ```

2. Update `app/Http/Controllers/TaskController.php`:

   ```php
   <?php

   namespace App\Http\Controllers;

   use App\Models\Task;
   use App\Events\TaskCreated;
   use App\Events\TaskUpdated;
   use Illuminate\Http\Request;

   class TaskController extends Controller
   {
       public function index()
       {
           return Task::all();
       }

       public function store(Request $request)
       {
           $validatedData = $request->validate([
               'title' => 'required|string|max:255',
               'description' => 'nullable|string',
           ]);

           $task = $request->user()->tasks()->create($validatedData);
           broadcast(new TaskCreated($task))->toOthers();
           return $task;
       }

       public function update(Request $request, Task $task)
       {
           $validatedData = $request->validate([
               'status' => 'required|in:todo,in_progress,done',
           ]);

           $task->update($validatedData);
           broadcast(new TaskUpdated($task))->toOthers();
           return $task;
       }
   }
   ```

   These methods handle task creation, retrieval, and updates. When a task is created or updated, the corresponding event is broadcast to all connected clients using the `TaskCreated` or `TaskUpdated` event and the `broadcast` method.

3. Create events for task creation and updates:

   ```bash
   php artisan make:event TaskCreated
   php artisan make:event TaskUpdated
   ```

   These commands will create two event classes in the `app/Events` directory. We'll update these classes to broadcast the task data to the 'taskboard' channel.

4. Update `app/Events/TaskCreated.php`:

   ```php
   <?php

   namespace App\Events;

   use App\Models\Task;
   use Illuminate\Broadcasting\Channel;
   use Illuminate\Broadcasting\InteractsWithSockets;
   use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
   use Illuminate\Foundation\Events\Dispatchable;
   use Illuminate\Queue\SerializesModels;

   class TaskCreated implements ShouldBroadcast
   {
       use Dispatchable, InteractsWithSockets, SerializesModels;

       public $task;

       public function __construct(Task $task)
       {
           $this->task = $task;
       }

       public function broadcastOn()
       {
           return new Channel('taskboard');
       }
   }
   ```

   This class defines the `TaskCreated` event, which broadcasts the newly created task to the 'taskboard' channel, allowing all connected clients to receive the update.

   If you need to broadcast the event to a specific user, you can use the `private` channel instead of the `public` channel.

5. Update `app/Events/TaskUpdated.php` similarly, just change the class name to `TaskUpdated`:

   ```php
   <?php

   namespace App\Events;

   use App\Models\Task;
   use Illuminate\Broadcasting\Channel;
   use Illuminate\Broadcasting\InteractsWithSockets;
   use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
   use Illuminate\Foundation\Events\Dispatchable;
   use Illuminate\Queue\SerializesModels;

   class TaskUpdated implements ShouldBroadcast
   {
       use Dispatchable, InteractsWithSockets, SerializesModels;

       public $task;

       public function __construct(Task $task)
       {
           $this->task = $task;
       }

       public function broadcastOn()
       {
           return new Channel('taskboard');
       }
   }
   ```

6. Update `routes/web.php` to add routes for tasks:

   ```php
   use App\Http\Controllers\TaskController;

   Route::middleware(['auth'])->group(function () {
       Route::get('/taskboard', function () {
           return view('taskboard');
       })->name('taskboard');

       Route::get('/tasks', [TaskController::class, 'index']);
       Route::post('/tasks', [TaskController::class, 'store']);
       Route::put('/tasks/{task}', [TaskController::class, 'update']);
   });
   ```

   These routes allow users to view the task board, retrieve tasks, create new tasks, and update existing tasks.

   For more information on Laravel routing, check out the [Laravel's Routes, Middleware, and Validation guide](/guides/laravel-routes-middleware-validation).

## Testing the real-time task board

Now that everything is set up, let's test our real-time task board.

1. Start your Laravel development server:

   ```bash
   php artisan serve
   ```

   This will start the Laravel development server on `http://localhost:8000`. If you already have a server running, you can skip this step.

2. In another terminal, start the Laravel queue worker to process the broadcast events:

   ```bash
   php artisan queue:work
   ```

   This will ensure that the broadcast events are processed and sent to connected clients.

   To learn more about Laravel queues, check out the [Implementing Queue Workers and Job Processing in Laravel with Neon Postgres](/guides/laravel-queue-workers-job-processing) guide.

3. Open two different browsers and visit `http://localhost:8000/taskboard`.

4. Log in with two different user accounts.

5. Start creating and moving tasks in one browser. You should see the tasks appear and move in real-time in the other browser.

6. If you were to visit your Pusher dashboard, you should see the events being broadcasted.

## How it works

Here's how the whole process of the real-time updates work:

1. When a user creates or updates a task, it's sent to the server.

2. The server saves the task in the Neon Postgres database.

3. After saving the task, the server broadcasts a `TaskCreated` or `TaskUpdated` event using Pusher.

4. Pusher sends this event to all connected users except the sender using the 'taskboard' channel.

5. The JavaScript code listening for these events receives the new or updated task and adds or moves it on the task board.

This process happens very quickly, giving the appearance of real-time updates.

## Optimizing for larger applications

As your task board grows, you might need to optimize it for better performance:

1. **Pagination**: Instead of loading all tasks at once, implement pagination to load tasks in smaller batches. Currently, we are loading all tasks using `Task::all()`, which can be inefficient for large datasets.

2. **Caching**: Use Laravel's caching features to cache frequently accessed data, reducing database queries.

3. **Database Indexing**: Add indexes to frequently queried columns in your Neon Postgres database to speed up queries. For more information, check out the Neon Postgres documentation on [Indexes](/docs/postgres/indexes).

4. **Queue Workers**: Use multiple queue workers to process broadcast events concurrently, especially in high-traffic applications. Also, consider using Laravel Horizon for monitoring and managing your queue workers.

5. **Private Channels**: If you need to broadcast events to specific users or groups, use private channels to ensure data privacy. This is useful for applications with user-specific data or private conversations between users where data should not be shared with others.

## Conclusion

In this guide, we've built a simple real-time collaborative task board using Laravel, Neon Postgres, and WebSockets. This example shows how you can create interactive, real-time web applications that update instantly across multiple users using Laravel's broadcasting feature.

## Additional Resources

- [Laravel Broadcasting Documentation](https://laravel.com/docs/broadcasting)
- [Pusher Documentation](https://pusher.com/docs)
- [Neon Documentation](/docs)

<NeedHelp />
