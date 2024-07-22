---
title: Implementing Queue Workers and Job Processing in Laravel with Neon Postgres
subtitle: Learn how to implement efficient background processing in Laravel using queue workers and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-07-14T00:00:00.000Z'
updatedOn: '2024-07-14T00:00:00.000Z'
---

Laravel provides a powerful and flexible system for handling background processing through queues and scheduling. This allows you to improve your application's performance by offloading time-consuming tasks and automating recurring processes. In this comprehensive guide, we'll explore how to implement queue workers, job processing, and scheduled tasks in Laravel using Postgres as the queue driver.

By the end of this tutorial, you'll know how to build a system for background processing and task automation, using the power of Laravel queues and the scheduler with Neon Postgres.

## Prerequisites

Before we begin, ensure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for Postgres database hosting
- Basic knowledge of Laravel and database operations

## Setting up the Project

Let's start by creating a new Laravel project and setting up the necessary components. We'll use Composer to create a new Laravel project and configure it to use Postgres as the queue driver.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel laravel-queue-demo
cd laravel-queue-demo
```

### Setting up the Database

Update your `.env` file with your Neon Postgres database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Run the migrations:

```bash
php artisan migrate
```

This will create the necessary tables in your Neon Postgres database.

## Implementing Laravel Queues with Postgres

Out of the box, Laravel provides a unified API for working with queues, allowing you to push jobs onto the queue and process them in the background. We'll configure Laravel to use Postgres as the queue driver and create a sample job to demonstrate the queue processing.

### Configuring the Queue Connection

To configure Laravel to use Postgres as the queue driver, update the `QUEUE_CONNECTION` in the `.env` file:

```env
QUEUE_CONNECTION=database
```

This tells Laravel to use the database driver for the queue system. Some of the other available drivers are `sync`, `redis`, `beanstalkd`, `sqs`, and `null`.

### Creating the Jobs Table

As we're using the database driver for queues, we need to create a table to store the jobs.

If you don't already have a `jobs` table in your database, Laravel provides an Artisan command to generate the migration for the jobs table:

```bash
php artisan queue:table
php artisan migrate
```

The `jobs` table will be created in your Postgres database. It has the following columns:

- `id`: The unique identifier for the job.
- `queue`: The name of the queue the job belongs to.
- `payload`: The serialized job payload.
- `attempts`: The number of times the job has been attempted.
- `reserved_at`: The timestamp when the job was reserved by a worker.
- `available_at`: The timestamp when the job is available to be processed.
- `created_at`: The timestamp when the job was created.

## Creating and Dispatching Jobs

Now that we've set up the queue system, let's create a sample job and dispatch it to the queue.

We'll create a job called `GenerateDatabaseReport` that simulates generating a complex report from your database. When the job is dispatched, it will log a message indicating that the report has been processed.

Such jobs can be used to perform time-consuming tasks like sending emails, processing images, or interacting with external APIs without blocking the main application.

### Creating a Job

Let's start by creating a job called `GenerateDatabaseReport` using the following Artisan command:

```bash
php artisan make:job GenerateDatabaseReport
```

This will create a file at `app/Jobs/GenerateDatabaseReport.php`. Update the job class with the following content to simulate processing a report:

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateDatabaseReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $reportId;

    public function __construct($reportId)
    {
        $this->reportId = $reportId;
    }

    public function handle()
    {
        sleep(5);
        Log::info("Processed report: {$this->reportId}");
    }
}
```

Let's break down the key components of this job class:

1. `implements ShouldQueue`: This interface tells Laravel that this job should be pushed onto the queue instead of running synchronously.

2. Use statements:

   - `Dispatchable`: Allows the job to be dispatched to the queue.
   - `InteractsWithQueue`: Provides methods for interacting with the queue.
   - `Queueable`: Allows the job to be pushed onto queues.
   - `SerializesModels`: Automatically serializes and deserializes Eloquent models in the job.

3. `protected $reportId`: This property stores the ID of the report to be processed.

4. `__construct($reportId)`: The constructor accepts a report ID and assigns it to the `$reportId` property.

5. `handle()` method: This is where the main logic of the job is implemented. In this example:
   - `sleep(5)` simulates a time-consuming process.
   - `Log::info(...)` logs a message indicating that the report has been processed.

When this job is dispatched, Laravel will serialize it and store it in the database. When a queue worker picks up the job, it will deserialize it and call the `handle()` method.

The `sleep(5)` call is just for demonstration purposes. In a real-world scenario, you'd replace this with actual report processing logic, such as fetching data from the database, generating a report, and storing it in a file or sending it via email.

### Dispatching the Job

For testing purposes, let's dispatch the `GenerateDatabaseReport` job when a specific route is accessed. This will simulate pushing the job onto the queue for processing, but in a real-world scenario, you'd dispatch jobs from your application logic based on specific events or triggers (e.g., user registration, order completion) or using the Laravel scheduler for recurring tasks like sending daily reports.

Add a route in `routes/web.php`:

```php
use App\Jobs\GenerateDatabaseReport;

Route::get('/dispatch-job', function () {
    GenerateDatabaseReport::dispatch(1);
    return 'Job dispatched!';
});
```

This route will dispatch the `GenerateDatabaseReport` job with the report ID `1` when accessed. You can test this by visiting `/dispatch-job` in your browser or using a tool like Postman or `curl`, which will trigger the job processing in the background, returning a response immediately instead of waiting for the job to complete.

As we are using the `database` queue driver, the job will be stored in the `jobs` table in your Neon Postgres database.

If you were to check the `jobs` table in your database, you would see an entry for the dispatched job with the serialized payload and other metadata:

```sql
SELECT * FROM jobs;
```

This will show you the job entry in the `jobs` table, which includes the serialized payload, queue name, and other metadata.

## Running Queue Workers

Now that we've dispatched a job to the queue, we need to run a queue worker to process the job. Queue workers listen for new jobs on the queue and execute them in the background.

Start a queue worker using the following Artisan command:

```bash
php artisan queue:work
```

This will start a queue worker that listens for new jobs on the default queue. You can specify the queue name using the `--queue` option if you have multiple queues. Having multiple queues allows you to prioritize jobs based on their importance or processing requirements.

You will see the following output:

```php
   INFO  Processing jobs from the [default] queue.

  2024-07-13 16:29:51 App\Jobs\GenerateDatabaseReport ........... RUNNING
  2024-07-13 16:29:58 App\Jobs\GenerateDatabaseReport ........... 6s DONE
```

The job will be picked up by the queue worker, processed, and the log message will be written to the log file. You can check the log file to verify that the job was processed successfully. It should take approximately 5 seconds to process the job due to the `sleep(5)` call in the job logic but in a real-world scenario, the processing time will depend on the actual logic implemented in the job.

If you were to check the `jobs` table in your database after the job has been processed, you would see that the job has been removed from the table, indicating that it has been successfully processed.

```sql
SELECT * FROM jobs;
```

This will show you that the job has been removed from the `jobs` table after processing.

## Handling Job Failures and Retries

Laravel provides mechanisms for handling failed jobs and configuring job retries. Let's explore how to configure failed job storage, handle failed jobs, and set up job retries.

### Configuring Failed Job Storage

If you don't already have a table for failed jobs in your database, you can use Laravel's Artisan commands to create one. Run the following commands:

```bash
php artisan queue:failed-table
php artisan migrate
```

This will create a `failed_jobs` table in your Postgres database to store information about failed jobs for debugging and analysis. The failed jobs will be stored in this table when a job fails to process and later retried or manually processed as needed.

### Handling Failed Jobs

Add a `failed` method to your job class to handle failed jobs:

```php
public function failed(\Throwable $exception)
{
    Log::error("Failed to process report {$this->reportId}: {$exception->getMessage()}");
}
```

This method will be called when a job fails to process. You can log the error message or perform additional actions based on the failure, such as sending an email notification or updating a status in the database.

### Configuring Job Retries

In some cases, you may want to retry a job if it fails to process. Laravel allows you to configure the number of retries and the timeout for a job.

Add retry and timeout configurations to your job class, for example:

```php
public $tries = 3;
public $timeout = 120; // 2 minutes
```

This configuration will retry the job up to 3 times if it fails and set a timeout of 2 minutes for each job execution. You can adjust these values based on your application's requirements.

To simulate a job failure, you can throw an exception in the `handle` method:

```php
public function handle()
{
    throw new \Exception("Failed to process report: {$this->reportId}");
}
```

Visit the `/dispatch-job` route to dispatch the job with the exception thrown and run the queue worker to process the job.

```bash
php artisan queue:work
```

When the job is dispatched and processed, it will fail due to the exception thrown in the `handle` method. The job will be retried based on the configuration you've set.

After the job fails to process, you can check the `failed_jobs` table in your database to see the failed job entry:

```sql
SELECT * FROM failed_jobs;
```

In the `failed_jobs` table, you'll see the failed job entry with information about the job, the exception message, and the number of attempts made.

You can also manually retry a failed job using the `queue:retry` Artisan command:

```bash
php artisan queue:retry job-id
```

Replace `job-id` with the ID of the failed job you want to retry. This will requeue the job for processing.

## Implementing Scheduled Jobs

Laravel's scheduler allows you to expressively define your command schedule within your Laravel application itself. In Laravel 11, this is done using the `routes/console.php` file, simplifying the process and keeping all routing-related code in one place.

### Configuring the Scheduler

Let's add a scheduled task that dispatches our `GenerateDatabaseReport` job every hour:

```php
<?php

use Illuminate\Support\Facades\Schedule;
use App\Jobs\GenerateDatabaseReport;

Schedule::job(new GenerateDatabaseReport(1))->hourly();
```

This will dispatch the `GenerateDatabaseReport` job every hour. You can define more complex schedules using the `Schedule` facade, such as daily, weekly, or custom schedules based on your application's requirements.

### Running the Scheduler

To run the scheduler, you still need to add the following Cron entry to your server:

```shell
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

This Cron will call the Laravel command scheduler every minute. Laravel then evaluates your scheduled tasks and runs the tasks that are due.

This approach provides a way to automate recurring tasks in your application, such as sending daily reports, cleaning up temporary files, or updating data from external sources, all without having to manage multiple Cron jobs.

## Additional Queue Processing Techniques

Laravel offers several handy techniques for working with queues, allowing you to build more complex and efficient job processing systems. Let's explore some of these techniques in detail, focusing on how they work with Postgres as our queue driver.

### Job Chaining

Job chaining is a powerful feature in Laravel that allows you to specify a sequence of jobs that should be run in order. This is particularly useful when you have a series of related tasks that need to be executed sequentially.

Here's how job chaining works:

```php
use App\Jobs\GenerateDatabaseReport;
use App\Jobs\VerifyDatabaseReport;
use App\Jobs\GeneratedDatabaseReport;

GenerateDatabaseReport::dispatch(1)
    ->chain([
        new VerifyDatabaseReport(1),
        new GeneratedDatabaseReport(1)
    ]);
```

In this example:

1. The `GenerateDatabaseReport` job is dispatched first.
2. Once `GenerateDatabaseReport` completes successfully, `VerifyDatabaseReport` is automatically dispatched.
3. After `VerifyDatabaseReport` finishes, `GeneratedDatabaseReport` is dispatched.

If any job in the chain fails, the subsequent jobs won't be executed. This ensures that your entire process maintains integrity.

You can also add delays between chained jobs:

```php
GenerateDatabaseReport::dispatch(1)
    ->chain([
        new VerifyDatabaseReport(1),
        (new GeneratedDatabaseReport(1))->delay(now()->addMinutes(10))
    ]);
```

This will delay the `GeneratedDatabaseReport` job by 10 minutes after `VerifyDatabaseReport` completes.

### Job Batching

Job batching allows you to group related jobs together, monitor their execution as a single unit, and perform actions when the entire batch completes. This is incredibly useful for processing large datasets or performing complex, multi-step operations.

To use job batching with Postgres, you first need to create a batches table:

```bash
php artisan queue:batches-table
php artisan migrate
```

Here's an example of job batching in Laravel:

```php
use Illuminate\Support\Facades\Bus;
use App\Jobs\GenerateDatabaseReport;

$batch = Bus::batch([
    new GenerateDatabaseReport(1),
    new GenerateDatabaseReport(2),
    new GenerateDatabaseReport(3),
])->then(function (Batch $batch) {
    // All jobs completed successfully...
    Log::info('All reports processed successfully');
})->catch(function (Batch $batch, Throwable $e) {
    // First batch job failure detected...
    Log::error('Batch job failed: ' . $e->getMessage());
})->finally(function (Batch $batch) {
    // The batch has finished executing...
    Log::info('Batch processing completed');
})->dispatch();
```

Key points about job batching:

- The `then()` callback is executed if all jobs in the batch complete successfully.
- The `catch()` callback is executed if any job in the batch fails.
- The `finally()` callback is always executed when the batch finishes, regardless of success or failure.

You can also add jobs to an existing batch:

```php
$batch->add(new GenerateDatabaseReport(4));
```

And you can check the progress of a batch using the `progress()` method:

```php
$batchId = $batch->id;

// Later...
$batch = Bus::findBatch($batchId);
$progress = $batch->progress(); // Returns a percentage
```

### Rate Limiting

Rate limiting is very helpful for preventing your application from overwhelming external services or your own database. When using Postgres as your queue driver, you can implement rate limiting at the application level. Here's an example of how you might do this:

```php
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GenerateDatabaseReport implements ShouldQueue
{
    public function handle()
    {
        $key = 'process-report';
        $limit = 10; // Number of jobs
        $duration = 60; // Time period in seconds

        $count = DB::table('jobs')
            ->where('queue', $key)
            ->where('created_at', '>=', Carbon::now()->subSeconds($duration))
            ->count();

        if ($count < $limit) {
            // Job logic...
            Log::info('Processing report...');
        } else {
            // Rate limit exceeded, release the job back to the queue
            $this->release(10); // Release back to queue after 10 seconds
        }
    }
}
```

In this example:

- We're using the `jobs` table in Postgres to track our rate limit.
- We allow 10 jobs to be processed every 60 seconds.
- If a job can be processed within this limit, the job logic is executed.
- If the rate limit has been exceeded, the job is released back to the queue with a 10-second delay.

You can also use different keys for different types of jobs:

```php
$key = "process-report:{$this->reportId}";
```

This allows you to have separate rate limits for different reports or different types of jobs.

## Monitoring and Managing Queues

Laravel provides several Artisan commands for monitoring and managing your queues:

- `queue:work`: Process new jobs as they are pushed onto the queue
- `queue:listen`: Similar to `queue:work`, but will reload the worker after each job
- `queue:retry`: Retry a failed job
- `queue:failed`: List all of the failed jobs
- `queue:flush`: Delete all of the failed jobs

## Implementing Supervisor for Queue Workers

Running queue workers using the `queue:work` command works well for development environments, but it's not suitable for production environments.

For production environments, use [Supervisor](http://supervisord.org/) to ensure your queue workers are always running.

### Installing and Configuring Supervisor

Install Supervisor:

```bash
sudo apt-get install supervisor
```

Create a new Supervisor configuration file:

```bash
sudo nano /etc/supervisor/conf.d/laravel-worker.conf
```

Add the following content:

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/path/to/your/project/worker.log
stopwaitsecs=3600
```

Start Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

## Conclusion

In this guide, we've explored how to implement queue workers, job processing, and scheduled tasks in Laravel using Postgres as the queue driver. We've covered creating and dispatching jobs, running queue workers, handling job failures and retries, implementing scheduled jobs, and setting up Supervisor for production environments.

## Additional Resources

- [Laravel Queues Documentation](https://laravel.com/docs/11.x/queues)
- [Laravel Task Scheduling](https://laravel.com/docs/11.x/scheduling)
- [Supervisor Documentation](http://supervisord.org/)
- [Neon Documentation](/docs)
