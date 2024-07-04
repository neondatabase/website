---
title: Getting Started with Laravel Events and Listeners
subtitle: Learn how to implement and utilize Laravel's event system with Neon
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-06-30T00:00:00.000Z'
updatedOn: '2024-06-30T00:00:00.000Z'
---

Laravel's event system provides a simple observer implementation, allowing you to subscribe and listen for various events that occur in your application.

This can be particularly useful for decoupling various parts of your application's logic and not blocking the main request flow. Queued listeners can also be used to handle time-consuming tasks asynchronously, improving the performance of your application.

In this guide, we'll walk through the process of setting up and using Laravel Events and Listeners, with a focus on database operations using Neon Postgres.

## Prerequisites

Before we begin, ensure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for database hosting
- Basic knowledge of Laravel and database operations

## Setting up the Project

Let's start by creating a new Laravel project and setting up the necessary components. If you already have a Laravel project set up, you can skip this section.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel laravel-events
cd laravel-events
```

This will create a new Laravel project in a directory named `laravel-events` with all the necessary dependencies installed.

### Setting up the Database

Once you have your Laravel project set up, you'll need to configure your Neon database connection. If you don't have a Neon account, you can sign up [here](https://console.neon.tech/signup).

Update your `.env` file with your Neon database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Make sure to replace `your-neon-hostname`, `your_database_name`, `your_username`, and `your_password` with your actual Neon database credentials.

## Creating a Model and Migration

For this tutorial, let's create a simple `Order` model that we'll use to demonstrate events and listeners.

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

Next update the `Order` model in `app/Models/Order.php` to include the `customer_name`, `total`, and `status` to the `$fillable` property:

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

As a reference, the `$fillable` property specifies which attributes are mass-assignable, meaning they can be set using the `create` method on the model. This helps protect against mass assignment vulnerabilities in your application.

## Creating an Event

An event in Laravel is a simple class that represents something that has happened in your application. Events can be used to trigger actions or notify other parts of your application that something has occurred.

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

## Creating a Listener

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

A very important thing to note here is that we are implementing the `ShouldQueue` interface.

Here our listener implements the `ShouldQueue` interface, meaning it will be handled by [Laravel's queue system](https://laravel.com/docs/11.x/queues), which is beneficial for performance when dealing with time-consuming tasks.

If we didn't implement the `ShouldQueue` interface, the listener would be executed synchronously, which could slow down the response time of your application but could be useful for certain use cases where you need to perform actions synchronously rather than asynchronously.

Here, we're simply logging a message to the Laravel log file, but in a real application, you would send an email along with other actions related to order confirmation, which could be time-consuming.

## Registering the Event and Listener

Laravel 11.x and later versions automatically discover events and listeners, so you don't need to manually register them. If you are using an older version of Laravel, you can register your events and listeners in the `EventServiceProvider`.

For more information on registering events and listeners, refer to the [Laravel documentation](https://laravel.com/docs/events).

## Dispatching the Event

Now that we have set up our event and listener, let's create a simple controller to simulate an order placement. This controller will handle order creation and dispatch our event.

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

The `event` helper function is used to dispatch the event, passing the order instance to the event constructor.

This allows the listener to access the order details when the event is triggered rather than blocking the main request flow to perform the additional actions directly in the controller method itself.

We will use this controller to create a new order and trigger the event.

## Adding a Route

To use our new controller, let's add a route. Open `routes/api.php` and add the following line:

```php
Route::post('/orders', [App\Http\Controllers\OrderController::class, 'store']);
```

If you don't have a route file for API routes, you can create one by running the following command:

```bash
php artisan install:api
```

This will create a new `api.php` file in the `routes` directory.

## Testing the Event System

Now, let's test our event system. You can use a tool like Postman or `curl` to send a POST request to your `/api/orders` endpoint.

Using `curl`:

```bash
curl -X POST http://laravel-events.test/api/orders \
     -H "Content-Type: application/json" \
     -d '{"customer_name":"John Doe","total":99.99}'
```

Replace `laravel-events.test` with your actual application URL.

If everything is set up correctly, you should see a new order in your Neon database, but you won't see any log messages in your Laravel log file yet because the listener is queued and we haven't run the queue worker to process the queued jobs.

## Running Queued Jobs

As we mentioned earlier, the `SendOrderConfirmation` listener implements the `ShouldQueue` interface, meaning it will be handled by Laravel's queue system.

If you were to check your logs immediately after placing an order, you might not see the log messages from the listener. Instead, you can run the queue worker to process the queued jobs:

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

If you were to remove the `ShouldQueue` interface from the listener, the actions would be executed synchronously, and you would see the log messages immediately after placing an order, but thanks to the queue system, the response time of your application is not affected.

The default `QUEUE_CONNECTION` in Laravel is `database`, which uses the database to manage the queue. This means that the queued jobs are stored in your Neon database and processed by the queue worker. You can change the queue connection in your `.env` file if you prefer a different queue driver like `redis` for example. To see all available queue drivers, refer to the [Laravel documentation](https://laravel.com/docs/11.x/queues#driver-prerequisites) or review the `config/queue.php` file within your Laravel project where you can configure the queue connection.

The jobs are queued in the `jobs` table in your database, which is usually created by default with new Laravel installations, or you can run the migration to create the table:

```bash
php artisan queue:table
php artisan migrate
```

## Using Database Transactions with Events

When working with database operations and events, it's important to understand how Laravel handles queued event listeners within database transactions. That way you can make sure that your data remains consistent and that your listeners are triggered at the right time.

Let's update our `OrderController` and `SendOrderConfirmation` listener to handle this correctly:

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

Now, let's update our `SendOrderConfirmation` listener to ensure it handles the event after the database transaction has been committed:

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

By implementing the `ShouldHandleEventsAfterCommit` interface, we're telling Laravel to only process this listener after all open database transactions have been committed. This is crucial when your listener depends on database changes made within the transaction.

This approach ensures that:

1. The order is created in the database.
2. The `OrderPlaced` event is dispatched within the transaction.
3. The transaction is committed, saving the order to the Neon database.
4. Only after the transaction is successfully committed, the `SendOrderConfirmation` listener is processed.

This prevents potential issues where the listener might try to access data that hasn't been committed to the database yet, ensuring data consistency between your event processing and your Neon database state.

If your queue connection's `after_commit` configuration option is set to `true` in your `config/queue.php` file, all of your queued listeners will automatically wait for open database transactions to commit before they are processed, and you won't need to use the `ShouldHandleEventsAfterCommit` interface.

## Conclusion

In this guide, we've explored how to implement and utilize Laravel's event system, focusing on database operations with Neon as our database provider. We've covered creating and dispatching events, creating and registering listeners, and how to use database transactions with events.

Events and listeners provide a powerful way to decouple various aspects of your application, making your code more maintainable and scalable without blocking the main request flow for time-consuming tasks.

As a next step, you might want to look into implementing [Supervisor](https://laravel.com/docs/11.x/queues#supervisor-configuration) to manage your queue workers in a production environment and [Laravel Horizon](https://laravel.com/docs/11.x/horizon) for monitoring and managing your queues rather than using the `queue:work` command directly.

## Additional Resources

- [Laravel Events Documentation](https://laravel.com/docs/events)
- [Laravel Queues Documentation](https://laravel.com/docs/queues)
- [Neon Documentation](/docs)
