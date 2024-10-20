---
title: Building Dynamic Charts with Laravel, Livewire, and Neon Postgres
subtitle: Learn how to build dynamic charts with Laravel, Livewire, and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-10-20T00:00:00.000Z'
updatedOn: '2024-10-20T00:00:00.000Z'
---

Laravel is an amazing PHP framework for building web applications, while Livewire provides a simple way to build dynamic interfaces using PHP.

In this guide, we'll walk through the process of creating a dynamic analytics dashboard for a SaaS application using Laravel Breeze for authentication, Livewire Charts for data visualization, and Neon Postgres for data storage.

We'll build interactive charts that display key metrics such as daily active users, feature usage trends, and user signups vs. cancellations.

## Prerequisites

Before we begin, make sure you have:

- PHP 8.1 or higher installed
- Composer for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for Postgres hosting
- Basic familiarity with Laravel, Livewire, and Postgres

## Setting up the Project

1. Create a new Laravel project:

```bash
composer create-project laravel/laravel saas-charts
cd saas-charts
```

2. Install Laravel Breeze with Livewire:

```bash
composer require laravel/breeze --dev
php artisan breeze:install livewire
```

3. Install the Livewire Charts package which we'll use for data visualization:

```bash
composer require asantibanez/livewire-charts
```

4. Install the Livewire Charts assets which include the necessary JavaScript and CSS files:

```bash
php artisan livewire-charts:install
```

5. Set up your Neon Postgres connection in the `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run the migrations to set up the users table and other Breeze-related tables in your Neon Postgres database:

```bash
php artisan migrate
```

This will create the necessary tables for user authentication and session management.

## Additional Database Tables

Now that we have the `users` table set up by Breeze, let's create migrations for our additional SaaS analytics data.

For the purpose of this guide, we'll track feature usage and subscriptions. You can adjust these tables based on your specific application requirements.

1. Create migrations:

```bash
php artisan make:migration create_feature_usage_table
php artisan make:migration create_subscriptions_table
```

Note that the naming convention for the migration files is important to make sure that your migrations are named correctly with the `create_` prefix followed by the table name.

2. Update the migration files:

The above commands will create two migration files in the `database/migrations` directory. Update the migration files as follows:

For the `create_feature_usage_table` we'll track the usage of different features by users, so we'll store the `user_id`, `feature_name`, and the `used_at` timestamp:

```php
public function up()
{
    Schema::create('feature_usage', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('feature_name');
        $table->timestamp('used_at');
        $table->timestamps();
    });
}
```

For the `create_subscriptions_table` we'll track user subscriptions, including the `user_id`, `plan`, `started_at`, and `ended_at` timestamps:

```php
public function up()
{
    Schema::create('subscriptions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('plan');
        $table->timestamp('started_at');
        $table->timestamp('ended_at')->nullable();
        $table->timestamps();
    });
}
```

3. With the migrations in place, run the migrations to create the tables in your Neon Postgres database:

```bash
php artisan migrate
```

This will create the `feature_usage` and `subscriptions` tables in your database.

## Creating Models

Laravel's Eloquent ORM provides a convenient way to interact with your database.

By defining models, we can represent and manipulate the data in the `FeatureUsage` and `Subscription` tables, which we created earlier through migrations.

In this step, we'll create models and set up relationships to ensure efficient data retrieval and interaction.

### Step 1: Generate the Models

Start by creating the `FeatureUsage` and `Subscription` models using Laravel's Artisan command:

```bash
php artisan make:model FeatureUsage
php artisan make:model Subscription
```

This will generate two model files in the `app/Models` directory corresponding to the `feature_usage` and `subscriptions` tables in your database.

### Step 2: Define Relationships in the Models

Now, let's update the model classes to define relationships between the tables. The `FeatureUsage` and `Subscription` models will be connected to the `User` model via foreign keys.

#### 2.1 `FeatureUsage` Model

In the `app/Models/FeatureUsage.php` file, define the relationship with the `User` model. Since each feature usage entry belongs to a specific user, we will use a `belongsTo` relationship:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeatureUsage extends Model
{
    use HasFactory;

    protected $table = 'feature_usage';

    protected $fillable = [
        'user_id',
        'feature_name',
        'used_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'used_at' => 'datetime',
    ];
}
```

The above defines the following:

- `fillable`: Specifies which attributes can be mass-assigned, in this case, `user_id`, `feature_name`, and `used_at`.
- `user()`: Defines a `belongsTo` relationship, meaning each `FeatureUsage` belongs to a single `User`.
- `casts`: Automatically casts the `used_at` column to a `datetime` object for easier manipulation in PHP.

#### 2.2 `Subscription` Model

In the `app/Models/Subscription.php` file, define relationships with both the `User` model and handle timestamps (`started_at` and `ended_at`) correctly. This indicates that each subscription belongs to a user and includes a `plan`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan',
        'started_at',
        'ended_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];
}
```

The above defines the following:

- `fillable`: Makes sure that the fields `user_id`, `plan`, `started_at`, and `ended_at` are mass assignable.
- `user()`: Defines a `belongsTo` relationship where each `Subscription` is linked to a specific `User`.
- `casts`: Automatically casts the `started_at` and `ended_at` columns to `datetime` objects.

### Step 3: Database Relationships

Once these relationships are defined, Eloquent provides methods to interact with related data. For example:

- Access a user's feature usages with `$user->featureUsages()`.
- Retrieve a user's subscriptions with `$user->subscriptions()`.
- Easily manipulate and retrieve data for timestamps (e.g., `started_at`, `ended_at`, and `used_at`).

## Building the Dashboard

We’ll create a simple SaaS dashboard that showcases our dynamic charts which will include daily active users, feature usage trends, and user signups vs. cancellations. This dashboard will use Livewire for interactivity and Tailwind CSS for styling along with the Livewire Charts package for creating the dynamic charts.

### Step 1: Create the Livewire Component

First, generate a new Livewire component for the dashboard:

```bash
php artisan make:livewire Dashboard
```

This will create both the `Dashboard` class in `app/Http/Livewire` and the a view in `resources/views/livewire/dashboard.blade.php`.

### Step 2: Update `Dashboard.php`

In the `app/Http/Livewire/Dashboard.php` file, we’ll render the dashboard view inside the main layout:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Dashboard extends Component
{
    public function render()
    {
        return view('livewire.dashboard')->layout('layouts.app');
    }
}
```

Note that we're using the `layout('layouts.app')` method to specify the main layout file for the dashboard view. This layout file will contains the main structure of the dashboard.

### Step 3: Create the Dashboard View

Now, let’s update the `dashboard.blade.php` view with a grid layout that displays multiple charts, along with some Tailwind CSS styling to improve the design.

```blade
<div class="min-h-screen py-12 bg-gray-100">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- Dashboard Header -->
        <div class="flex items-center justify-between mb-10">
            <h1 class="text-4xl font-bold text-gray-800">SaaS Analytics Dashboard</h1>
            <button class="px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700">
                Refresh Data
            </button>
        </div>

        <!-- Dashboard Grid -->
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Daily Active Users Chart -->
            <div class="p-6 bg-white rounded-lg shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Daily Active Users</h2>
                <livewire:daily-active-users-chart />
            </div>

            <!-- Feature Usage Trends Chart -->
            <div class="p-6 bg-white rounded-lg shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Feature Usage Trends</h2>
                <livewire:feature-usage-trends-chart />
            </div>

            <!-- User Signups vs Cancellations Chart -->
            <div class="p-6 bg-white rounded-lg shadow-md">
                <h2 class="mb-4 text-xl font-semibold">User Signups vs. Cancellations</h2>
                <livewire:user-signups-vs-cancellations-chart />
            </div>
        </div>
    </div>
</div>
```

This view includes a header with a title and a refresh button, followed by a grid layout that displays the three charts: 'Daily Active Users', 'Feature Usage Trends', and 'User Signups vs. Cancellations'. We will create those charts components next.

## Setting up Routes

With the charts dashboard view and the Livewire component in place, let's set up the routes to display the dashboard.

```php
use App\Livewire\Dashboard;

Route::get('/charts', Dashboard::class)->middleware(['auth'])->name('dashboard');
```

This route will display the dashboard view when the `/charts` URL is accessed. The `auth` middleware ensures that only authenticated users can access the dashboard.

## Set Up Livewire Charts for the Dashboard

Now with everything in place, let's implement individual chart components.

The Livewire Charts package provides a wide range of chart types, including area charts, radar charts, and treemaps, offering flexibility to create various data visualizations.

We'll use `LivewireLineChart` for 'Daily Active Users', `LivewireColumnChart` for 'Feature Usage Trends', and `LivewirePieChart` for 'User Signups vs. Cancellations'. To get a full list of available chart types, check out the [Livewire Charts documentation](https://github.com/asantibanez/livewire-charts/).

### 2.1 Daily Active Users Chart

Create a Livewire component for the daily active users chart:

```bash
php artisan make:livewire DailyActiveUsersChart
```

In `app/Livewire/DailyActiveUsersChart.php`, define the logic to fetch the data:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\FeatureUsage;
use Asantibanez\LivewireCharts\Models\LineChartModel;

class DailyActiveUsersChart extends Component
{
    public function render()
    {
        // Example query to fetch daily active users
        $activeUsers = FeatureUsage::selectRaw('DATE(used_at) as date, COUNT(DISTINCT user_id) as users')
            ->groupBy('date')
            ->get();

        // Prepare data for the chart
        $lineChartModel = (new LineChartModel())
            ->setTitle('Daily Active Users')
            ->setAnimated(true)
            ->setSmoothCurve()
            ->withOnPointClickEvent('onPointClick');

        foreach ($activeUsers as $activeUser) {
            $lineChartModel->addPoint($activeUser->date, $activeUser->users);
        }

        return view('livewire.daily-active-users-chart', [
            'lineChartModel' => $lineChartModel
        ]);
    }
}
```

Create the corresponding Blade view in `resources/views/livewire/daily-active-users-chart.blade.php`:

```blade
<div class="h-64">
    <livewire:livewire-line-chart
        :line-chart-model="$lineChartModel"
    />
</div>
```

### 2.2 Feature Usage Trends Chart

Create another Livewire component for feature usage trends:

```bash
php artisan make:livewire FeatureUsageTrendsChart
```

In `app/Livewire/FeatureUsageTrendsChart.php`, define the data logic:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\FeatureUsage;
use Asantibanez\LivewireCharts\Models\ColumnChartModel;

class FeatureUsageTrendsChart extends Component
{
    public function render()
    {
        // Example query to fetch feature usage trends
        $featureUsages = FeatureUsage::selectRaw('feature_name, COUNT(*) as usage_count')
            ->groupBy('feature_name')
            ->get();

        // Prepare the chart data
        $columnChartModel = (new ColumnChartModel())
            ->setTitle('Feature Usage Trends')
            ->setAnimated(true);

        foreach ($featureUsages as $usage) {
            $columnChartModel->addColumn($usage->feature_name, $usage->usage_count, '#f6ad55');
        }

        return view('livewire.feature-usage-trends-chart', [
            'columnChartModel' => $columnChartModel
        ]);
    }
}
```

In `resources/views/livewire/feature-usage-trends-chart.blade.php`:

```blade
<div class="h-64">
    <livewire:livewire-column-chart
        :column-chart-model="$columnChartModel"
    />
</div>
```

### 2.3 User Signups vs. Cancellations Chart

Create a Livewire component for user signups vs. cancellations:

```bash
php artisan make:livewire UserSignupsVsCancellationsChart
```

In `app/Livewire/UserSignupsVsCancellationsChart.php`, define the data logic:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Subscription;
use Asantibanez\LivewireCharts\Models\PieChartModel;

class UserSignupsVsCancellationsChart extends Component
{
    public function render()
    {
        // Example query to fetch signups vs cancellations
        $signups = Subscription::whereNotNull('started_at')->count();
        $cancellations = Subscription::whereNotNull('ended_at')->count();

        // Prepare the chart data
        $pieChartModel = (new PieChartModel())
            ->setTitle('Signups vs Cancellations')
            ->addSlice('Signups', $signups, '#90cdf4')
            ->addSlice('Cancellations', $cancellations, '#fc8181');

        return view('livewire.user-signups-vs-cancellations-chart', [
            'pieChartModel' => $pieChartModel
        ]);
    }
}
```

In `resources/views/livewire/user-signups-vs-cancellations-chart.blade.php`:

```blade
<div class="h-64">
    <livewire:livewire-pie-chart
        :pie-chart-model="$pieChartModel"
    />
</div>
```

## Step 3: Add Chart Scripts

Include the chart scripts in your main layout file (`resources/views/layouts/app.blade.php`) by adding:

```blade
@livewireScripts
@livewireChartsScripts
```

This will load the necessary JavaScript files for Livewire and Livewire Charts to render the interactive charts on the dashboard.

## Step 4: Test the Dashboard

Run the server to access your charts dashboard if you haven't already:

```bash
php artisan serve
```

Navigate to the `/charts` route, and you should see the real-time interactive charts displayed on your dashboard.

### Seeding the Database with Sample Data

If you don't have any data yet, you can seed the database with sample data to test the charts. First, create a seeder that populates the `FeatureUsage` and `Subscription` tables with mock data:

1. Generate the seeder:

```bash
php artisan make:seeder SampleDataSeeder
```

2. Open the newly created seeder file (`database/seeders/SampleDataSeeder.php`) and populate it with sample data for feature usage and subscriptions:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FeatureUsage;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;

class SampleDataSeeder extends Seeder
{
    public function run()
    {
        // Create users
        $users = User::factory(10)->create();

        // Seed FeatureUsage data
        foreach ($users as $user) {
            for ($i = 0; $i < 5; $i++) {
                FeatureUsage::create([
                    'user_id' => $user->id,
                    'feature_name' => 'Feature ' . rand(1, 5),
                    'used_at' => Carbon::now()->subDays(rand(0, 30)),
                ]);
            }
        }

        // Seed Subscription data
        foreach ($users as $user) {
            Subscription::create([
                'user_id' => $user->id,
                'plan' => 'Basic',
                'started_at' => Carbon::now()->subMonths(2),
                'ended_at' => rand(0, 1) ? Carbon::now()->subMonth() : null,
            ]);
        }
    }
}
```

3. Run the seeder to populate the database with test data:

```bash
php artisan db:seed --class=SampleDataSeeder
```

Once the database is seeded, refresh the charts dashboard, and you should see the charts populated with real-time data.

For more information on seeding the database, check out the [Laravel documentation](https://laravel.com/docs/11.x/seeding).

## Optimizing Performance

When working with large datasets, you will have to make sure that your application is optimized for performance. This includes optimizing database queries, caching results, and using efficient algorithms.

We will cover some optimization techniques for improving the performance of your Neon Postgres application below but you should also check out the [Performance tips for Neon Postgres](/blog/performance-tips-for-neon-postgres) blog post for more specific tips.

### 1. Database Indexing for Frequently Queried Columns

Database indexing is a key technique to speed up query execution, especially for columns used frequently in `WHERE`, `JOIN`, and `ORDER BY` clauses. With indexes in place, the database can find records faster, making your queries more efficient.

This can be especially useful for tables like `FeatureUsage` and `Subscription`, where you might frequently query by `user_id`, `used_at`, `started_at`, and `ended_at`.

Here’s how to add indexes for the `FeatureUsage` and `Subscription` tables:

```php
Schema::table('feature_usage', function (Blueprint $table) {
    $table->index(['user_id', 'used_at']);  // Index on user_id and used_at to speed up queries
});

Schema::table('subscriptions', function (Blueprint $table) {
    $table->index(['user_id', 'started_at', 'ended_at']);  // Index on user_id, started_at, and ended_at for faster lookups
});
```

These indexes will optimize queries related to filtering or grouping by `user_id`, `used_at`, `started_at`, and `ended_at`, which are common in analytics.

To learn more about indexing in Neon Postgres, check out the [Neon documentation](/docs/postgres/indexes) on indexes.

### 2. Implement Caching for Expensive Queries

Caching is a great way to reduce the load on your database by storing the results of expensive queries and retrieving them from memory when needed. This avoids running the same query multiple times for data that doesn't change frequently.

Here's how you can cache the results of a query for daily active users for a specific time period:

```php
use Illuminate\Support\Facades\Cache;

// In your Livewire component
$dailyActiveUsers = Cache::remember('daily_active_users_' . $this->selectedDays, 60 * 5, function () {
    return FeatureUsage::selectRaw('DATE(used_at) as date, COUNT(DISTINCT user_id) as count')
        ->whereDate('used_at', '>=', now()->subDays($this->selectedDays))
        ->groupBy('date')
        ->orderBy('date')
        ->get();
});
```

Quick explanation of the code:

- `Cache::remember`: Caches the query result for 5 minutes (`60 * 5` seconds). If the data is already cached, it retrieves the result from the cache; otherwise, it runs the query and stores the result.
- This is useful for queries that don’t need real-time updates and can tolerate slight delays, such as historical data or reports.

The `Cache::remember` method is a convenient way to cache query results in Laravel. You can adjust the cache duration based on your application's requirements. However, be cautious with caching, as it can lead to stale data if not managed properly.

## Conclusion

In this guide, we've built a simple dynamic SaaS dashboard using Laravel Breeze for authentication, Livewire Charts for data visualization, and Neon Postgres for data storage. This setup provides a good starting point for tracking key metrics in your SaaS or web application.

To go further, consider the following next steps:

1. Implementing more detailed drill-down features for each chart.
2. Adding user-specific analytics for personalized insights.
3. Implementing real-time updates using Livewire's polling feature or websockets.

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Neon Documentation](/docs)
- [Livewire Documentation](https://livewire.laravel.com/)
- [Livewire Charts Documentation](https://github.com/asantibanez/livewire-charts/)

<NeedHelp />
