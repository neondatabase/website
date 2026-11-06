---
title: Get started with Laravel events and listeners
subtitle: Learn how to implement and use Laravel's event system with Neon
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-06-30T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Laravel's event system provides a simple observer implementation, allowing you to subscribe and listen for various events that occur in your application.

Events help you decouple parts of your application's logic. Queued listeners move time-consuming tasks out of the main request flow, so responses return faster.

In this guide, we'll set up and use Laravel events and listeners, with a focus on database operations on a Neon database.

## Prerequisites

Before we begin, make sure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for database hosting
- Basic knowledge of Laravel and database operations

## Set up the project

Start by creating a new Laravel project. If you already have a Laravel project set up, you can skip this section.

### Create a new Laravel project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel laravel-events
cd laravel-events
```

This will create a new Laravel project in a directory named `laravel-events` with all the necessary dependencies installed.

### Set up the database

Next, configure your Neon database connection. If you don't have a Neon account, [sign up](https://console.neon.tech/signup).

Update your `.env` file with your Neon database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Replace `your-neon-hostname`, `your_database_name`, `your_username`, and `your_password` with your Neon database credentials. You can find them by clicking **Connect** in the Neon Console.

## Create a model and migration

For this tutorial, let's create an `Order` model that we'll use to demonstrate events and listeners.

To create the model and migration, run the following command:

```bash
php artisan make:model Order -m
```

This command creates both the `Order` model and a migration file for the `orders` table.

Open the newly created migration file in `database/migrations` and update the `up` method with the following content:

```php
public function up()
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->string('customer_name');
        $table->decimal('total', 8, 2);
        $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
        $table->timestamps();
    });
}
```

Run the migration to create the 'orders' table in your Neon database:

```bash
php artisan migrate
```

Next, update the `Order` model in `app/Models/Order.php` to add `customer_name`, `total`, and `status` to the `$fillable` property:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['customer_name', 'total', 'status'];
}
```

The `$fillable` property specifies which attributes are mass-assignable, meaning they can be set using the `create` method on the model. This helps protect against mass assignment vulnerabilities in your application.

## Create an event

An event in Laravel is a class that represents something that happened in your application. Events trigger actions or notify other parts of your application.

Now, let's create an event that will be triggered when an order is placed. Run the following command:

```bash
php artisan make:event OrderPlaced
```

This creates a new event class in `app/Events/OrderPlaced.php`. Update it with the following content:

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderPlaced
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }
}
```

This event will carry the `Order` model instance, allowing listeners to access the order details. In a real application, you would perform additional actions, such as sending an email or updating other records in the database, when this event is triggered.

## Create a listener

A listener in Laravel is a class that listens for a specific event and performs actions in response to that event.

Now that we have an event, let's create a listener that will respond to this event.

Run the following command to create a new listener:

```bash
php artisan make:listener SendOrderConfirmation --event=OrderPlaced
```

This creates a new listener in `app/Listeners/SendOrderConfirmation.php`. Update it with the following content:

```php
<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendOrderConfirmation implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(OrderPlaced $event)
    {
        // In a real application, you would send an email here
        Log::info('Order confirmation sent for Order #' . $event->order->id);

        // Additional actions related to order confirmation
        Log::info('Slack notification sent for Order #' . $event->order->id);
        Log::info('SMS notification sent for Order #' . $event->order->id);
        Log::info('Update inventory for Order #' . $event->order->id);
    }
}
```

The listener implements the `ShouldQueue` interface, so [Laravel's queue system](https://laravel.com/docs/11.x/queues) handles it. That keeps time-consuming tasks out of the request.

Without `ShouldQueue`, the listener runs synchronously. That can slow down your application's response time, but it's useful when an action must finish before the response returns.

Here, we're simply logging a message to the Laravel log file, but in a real application, you would send an email along with other actions related to order confirmation, which could be time-consuming.

## Register the event and listener

Laravel 11.x and later versions automatically discover events and listeners, so you don't need to manually register them. If you are using an older version of Laravel, you can register your events and listeners in the `EventServiceProvider`.

For more information on registering events and listeners, refer to the [Laravel documentation](https://laravel.com/docs/events).

## Dispatch the event

With the event and listener in place, create a controller to simulate an order placement. This controller will handle order creation and dispatch our event.

Run the following command to create a new controller:

```bash
php artisan make:controller OrderController
```

Open `app/Http/Controllers/OrderController.php` and add the following content:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Events\OrderPlaced;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $order = Order::create([
            'customer_name' => $request->customer_name,
            'total' => $request->total,
        ]);

        event(new OrderPlaced($order));

        return response()->json(['message' => 'Order placed successfully', 'order' => $order]);
    }
}
```

This controller creates a new order in the database and then dispatches the `OrderPlaced` event.

The `event` helper dispatches the event and passes the order instance to the event constructor.

The listener gets the order details from the event, so the controller doesn't have to perform the additional actions itself and block the request.

We will use this controller to create a new order and trigger the event.

## Add a route

To use our new controller, let's add a route. Open `routes/api.php` and add the following line:

```php
Route::post('/orders', [App\Http\Controllers\OrderController::class, 'store']);
```

If you don't have a route file for API routes, you can create one by running the following command:

```bash
php artisan install:api
```

This will create a new `api.php` file in the `routes` directory.

## Test the event system

Now, test the event system. You can use a tool like Postman or `curl` to send a POST request to your `/api/orders` endpoint.

Using `curl`:

```bash
curl -X POST http://laravel-events.test/api/orders \
     -H "Content-Type: application/json" \
     -d '{"customer_name":"John Doe","total":99.99}'
```

Replace `laravel-events.test` with your actual application URL.

If everything is set up correctly, you should see a new order in your Neon database, but you won't see any log messages in your Laravel log file yet because the listener is queued and we haven't run the queue worker to process the queued jobs.

## Run queued jobs

The `SendOrderConfirmation` listener implements the `ShouldQueue` interface, meaning it will be handled by Laravel's queue system.

If you check your logs right after placing an order, you won't see the log messages from the listener yet. Run the queue worker to process the queued jobs:

```bash
php artisan queue:work
```

This command starts the queue worker, which will process any queued jobs, including the order confirmation listener.

Once the queue worker is running, you should see the log messages from the listener and the following output:

```
$ php artisan queue:work

   INFO  Processing jobs from the [default] queue.

   App\Listeners\SendOrderConfirmation ....... RUNNING
   App\Listeners\SendOrderConfirmation ....... 1s DONE
```

In a different terminal window, you can place a new order using `curl` or Postman to see the listener in action.

If you removed the `ShouldQueue` interface from the listener, the actions would run synchronously and you'd see the log messages as soon as you placed an order. With the queue, that work doesn't add to your application's response time.

The default `QUEUE_CONNECTION` in Laravel is `database`, which uses the database to manage the queue. The queued jobs are stored in your Neon database and processed by the queue worker. You can change the queue connection in your `.env` file if you prefer a different queue driver like `redis` for example. To see all available queue drivers, refer to the [Laravel documentation](https://laravel.com/docs/11.x/queues#driver-prerequisites) or review the `config/queue.php` file within your Laravel project where you can configure the queue connection.

The jobs are queued in the `jobs` table in your database, which is usually created by default with new Laravel installations, or you can run the migration to create the table:

```bash
php artisan queue:table
php artisan migrate
```

## Use database transactions with events

When you dispatch events inside a database transaction, a queued listener can run before the transaction commits. Laravel lets you delay the listener until after the commit so your data stays consistent.

Update the `OrderController` and `SendOrderConfirmation` listener to handle this correctly:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Events\OrderPlaced;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $order = DB::transaction(function () use ($request) {
            $order = Order::create([
                'customer_name' => $request->customer_name,
                'total' => $request->total,
            ]);

            event(new OrderPlaced($order));

            return $order;
        });

        return response()->json(['message' => 'Order placed successfully', 'order' => $order]);
    }
}
```

Now, update the `SendOrderConfirmation` listener so it handles the event after the database transaction commits:

```php
<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendOrderConfirmation implements ShouldQueue, ShouldHandleEventsAfterCommit
{
    use InteractsWithQueue;

    public function handle(OrderPlaced $event)
    {
        // In a real application, you would send an email here
        Log::info('Order confirmation sent for Order #' . $event->order->id);
    }
}
```

By implementing the `ShouldHandleEventsAfterCommit` interface, we're telling Laravel to only process this listener after all open database transactions have been committed. This matters when your listener depends on database changes made within the transaction.

With this approach:

1. The order is created in the database.
2. The `OrderPlaced` event is dispatched within the transaction.
3. The transaction is committed, saving the order to the Neon database.
4. The `SendOrderConfirmation` listener is processed only after the transaction commits.

This prevents the listener from reading data that hasn't been committed yet.

If your queue connection's `after_commit` configuration option is set to `true` in your `config/queue.php` file, all of your queued listeners will automatically wait for open database transactions to commit before they are processed, and you won't need to use the `ShouldHandleEventsAfterCommit` interface.

## Conclusion

You built an order flow that dispatches a Laravel event, handles it with a queued listener, and waits for the database transaction to commit before the listener runs.

As a next step, look into [Supervisor](https://laravel.com/docs/11.x/queues#supervisor-configuration) to manage your queue workers in a production environment and [Laravel Horizon](https://laravel.com/docs/11.x/horizon) for monitoring and managing your queues rather than using the `queue:work` command directly.

## Additional resources

- [Laravel events documentation](https://laravel.com/docs/events)
- [Laravel queues documentation](https://laravel.com/docs/queues)
- [Neon documentation](/docs)
