---
title: Creating a Content Moderation System with Laravel, OpenAI API, and Neon Postgres
subtitle: Build an automated content moderation system for your application using Laravel Livewire, OpenAI's moderation API, and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-03-22T00:00:00.000Z'
updatedOn: '2025-03-22T00:00:00.000Z'
---

Content moderation is essential for maintaining healthy online communities and platforms. In this guide, we'll create a content moderation system that uses OpenAI's moderation API to automatically analyze and flag potentially problematic content before it reaches your users.

We will use Laravel, OpenAI's moderation API, and Neon's serverless Postgres database and build a system that can handle content moderation for comments, forum posts, product reviews, or any user-generated content.

## What You'll Build

In this guide, you'll build a content moderation system with the following features:

1. A form for users to submit content to our Neon database
2. Automatic content analysis using [OpenAI's moderation API](https://platform.openai.com/docs/guides/moderation)
3. A moderation queue for reviewing flagged content
4. A dashboard for viewing moderation statistics
5. Settings management for different content types

## Prerequisites

To follow the steps in this guide, you will need:

- PHP 8.2 or higher
- [Composer](https://getcomposer.org/) installed
- A [Neon](https://console.neon.tech/signup) account
- An [OpenAI](https://platform.openai.com/signup) account with API access
- Basic familiarity with Laravel and PHP

## Create a Neon Project

Neon provides a serverless Postgres database that automatically scales as your application grows. Let's set up a Neon database for our content moderation system:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click "New Project" and select your preferred settings.
3. Once your project is created, you'll see the connection details. Save the connection string for later use.

## Set up a Laravel Project

Now, let's create a new Laravel project and set it up to work with our Neon database:

```bash
composer create-project laravel/laravel moderation-system
cd moderation-system
```

This creates a new Laravel 11 project in a directory called `moderation-system` and moves you into that directory.

## Configure Environment Variables

To configure your Laravel application to connect to Neon Postgres and OpenAI, you need to set up your environment variables.

1. Open the `.env` file in your Laravel project directory.
2. Update your database configuration with the Neon connection details:

```
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_SSLMODE=require
```

3. Add your OpenAI API key:

```
OPENAI_API_KEY=your-openai-api-key
```

The `OPENAI_API_KEY` will be used by our moderation service to communicate with [OpenAI's moderation API](https://platform.openai.com/docs/guides/moderation).

## Install Livewire and Other Required Packages

Let's install the necessary packages for our project:

```bash
composer require livewire/livewire openai-php/laravel
```

This installs:

- [Livewire](https://livewire.laravel.com/): A Laravel package that makes building dynamic web apps simple, without writing JavaScript
- [OpenAI Laravel Client](https://github.com/openai-php/laravel): A library for interacting with OpenAI's API within Laravel

Next, let's install Laravel Breeze with Livewire for authentication and UI scaffolding:

```bash
composer require laravel/breeze --dev
php artisan breeze:install livewire
```

After installing Breeze, follow the instructions to complete the setup:

```bash
npm install
npm run build
```

This will install the necessary NPM packages and build your static assets.

Let's also run the migrations to create the default Laravel tables:

```bash
php artisan migrate
```

<Admonition type="important">
Neon supports both direct and pooled database connection strings, which can be copied from the **Connection Details** widget on your Neon Project Dashboard. A pooled connection string connects your application to the database via a PgBouncer connection pool, allowing for a higher number of concurrent connections. However, using a pooled connection string for migrations can be prone to errors. For this reason, we recommend using a direct (non-pooled) connection when performing migrations. For more information about direct and pooled connections, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## Create Database Schema

Now we'll create the database schema for our content moderation system. We need to track three main types of data:

1. Content items that need moderation
2. Moderation results from the OpenAI API
3. Moderation settings for different content types

Let's create the migrations:

```bash
php artisan make:migration create_content_items_table
php artisan make:migration create_moderation_results_table
php artisan make:migration create_moderation_settings_table
```

This will create three migration files in the `database/migrations` directory. Now, let's define the schema for each table:

### 1. Content Items Table

This table stores the actual content that needs moderation:

```php
// database/migrations/xxxx_xx_xx_create_content_items_table.php
public function up(): void
{
    Schema::create('content_items', function (Blueprint $table) {
        // Primary key
        $table->id();

        // Foreign key to the user who created the content (optional)
        $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

        // Type of content (e.g., 'comment', 'post', 'review')
        $table->string('content_type');

        // The actual content text
        $table->text('content');

        // Current moderation status ('pending', 'approved', 'rejected')
        $table->string('status')->default('pending');

        // Created/updated timestamps
        $table->timestamps();
    });
}
```

### 2. Moderation Results Table

This table stores the results returned by the OpenAI moderation API:

```php
// database/migrations/xxxx_xx_xx_create_moderation_results_table.php
public function up(): void
{
    Schema::create('moderation_results', function (Blueprint $table) {
        // Primary key
        $table->id();

        // Foreign key to the content item being moderated
        $table->foreignId('content_item_id')->constrained()->onDelete('cascade');

        // Whether the content was flagged by the moderation API
        $table->boolean('flagged');

        // Categories that were flagged (stored as JSON)
        $table->json('categories')->nullable();

        // Scores for each category (stored as JSON)
        $table->json('category_scores')->nullable();

        // Highest confidence score among all categories
        $table->decimal('confidence', 8, 6)->nullable();

        // Created/updated timestamps
        $table->timestamps();
    });
}
```

### 3. Moderation Settings Table

This table stores moderation settings for different content types:

```php
// database/migrations/xxxx_xx_xx_create_moderation_settings_table.php
public function up(): void
{
    Schema::create('moderation_settings', function (Blueprint $table) {
        // Primary key
        $table->id();

        // Type of content these settings apply to
        $table->string('content_type');

        // Categories to flag (stored as JSON)
        $table->json('flagged_categories')->nullable();

        // Threshold for auto-rejection (0-1)
        $table->decimal('confidence_threshold', 8, 6)->default(0.5);

        // Whether to auto-approve content that passes moderation
        $table->boolean('auto_approve')->default(false);

        // Created/updated timestamps
        $table->timestamps();
    });
}
```

Now run the migrations to create the tables in your Neon database:

```bash
php artisan migrate
```

After completing your migrations, you can switch to a pooled connection for better performance in your application.

## Create Models

Now let's create the Eloquent models for our database tables. These models will help us interact with the database using Laravel's ORM:

```bash
php artisan make:model ContentItem
php artisan make:model ModerationResult
php artisan make:model ModerationSetting
```

This will create three model files in the `app/Models` directory. Let's define each model with their relationships and attributes:

### 1. ContentItem Model

```php
// app/Models/ContentItem.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * These fields can be set when creating or updating a model.
     */
    protected $fillable = [
        'user_id',
        'content_type',
        'content',
        'status',
    ];

    /**
     * Get the moderation result associated with this content item.
     * This establishes a one-to-one relationship with ModerationResult.
     */
    public function moderationResult(): HasOne
    {
        return $this->hasOne(ModerationResult::class);
    }

    /**
     * Get the user who created this content item.
     * This establishes a many-to-one relationship with User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

In the `ContentItem` model, we define the `$fillable` array to specify which fields can be mass-assigned. We also define relationships with the `ModerationResult` and `User` models which will allow us to retrieve related data without writing complex SQL queries.

### 2. ModerationResult Model

```php
// app/Models/ModerationResult.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModerationResult extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'content_item_id',
        'flagged',
        'categories',
        'category_scores',
        'confidence',
    ];

    /**
     * The attributes that should be cast.
     * This tells Laravel how to handle special data types.
     */
    protected $casts = [
        'flagged' => 'boolean',       // Convert to PHP boolean
        'categories' => 'array',      // Convert JSON to PHP array
        'category_scores' => 'array', // Convert JSON to PHP array
        'confidence' => 'float',      // Convert to PHP float
    ];

    /**
     * Get the content item associated with this moderation result.
     */
    public function contentItem(): BelongsTo
    {
        return $this->belongsTo(ContentItem::class);
    }
}
```

Here again, we define the `$fillable` array to specify which fields can be mass-assigned. We also define a relationship with the `ContentItem` model to retrieve the content item associated with this moderation result.

### 3. ModerationSetting Model

```php
// app/Models/ModerationSetting.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModerationSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'content_type',
        'flagged_categories',
        'confidence_threshold',
        'auto_approve',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'flagged_categories' => 'array',    // Convert JSON to PHP array
        'confidence_threshold' => 'float',  // Convert to PHP float
        'auto_approve' => 'boolean',        // Convert to PHP boolean
    ];
}
```

Similar to the other models, we define the structure of our data and the relationships between them. The `ModerationSetting` model will store the moderation settings for different content types.

## Build Moderation Service

Now, let's create a service class that will handle the content moderation logic. This service will use the OpenAI API to analyze content and store the results.

First, create a new directory for services:

```bash
mkdir -p app/Services
```

Now, create the moderation service file:

```php
// app/Services/ModerationService.php
<?php

namespace App\Services;

use App\Models\ContentItem;
use App\Models\ModerationResult;
use App\Models\ModerationSetting;
use OpenAI;
use Exception;
use Illuminate\Support\Facades\Log;

class ModerationService
{
    /**
     * The OpenAI client instance.
     */
    private $client;

    /**
     * Create a new ModerationService instance.
     */
    public function __construct()
    {
        // Initialize the OpenAI client with the API key from .env
        $this->client = OpenAI::client(env('OPENAI_API_KEY'));
    }

    /**
     * Moderate a content item using OpenAI's moderation API.
     *
     * @param ContentItem $contentItem The content item to moderate
     * @return ModerationResult The result of the moderation
     * @throws Exception If the moderation API request fails
     */
    public function moderateContent(ContentItem $contentItem)
    {
        try {
            // Get the content and settings
            $content = $contentItem->content;

            // Find or create settings for this content type
            $settings = ModerationSetting::where('content_type', $contentItem->content_type)->first();

            if (!$settings) {
                // Create default settings if none exist
                $settings = ModerationSetting::create([
                    'content_type' => $contentItem->content_type,
                    'flagged_categories' => null, // Consider all categories
                    'confidence_threshold' => 0.5, // Medium threshold
                    'auto_approve' => false, // Don't auto-approve
                ]);
            }

            // Call OpenAI moderation API
            $response = $this->client->moderations()->create([
                'input' => $content,
            ]);

            // Process response
            $result = $response->results[0];
            $flagged = $result->flagged;

            // Extract categories and scores
            $categories = [];
            $categoryScores = [];

            // Loop through each category in the response
            foreach ($result->categories as $key => $category) {
                $categoryScores[$key] = $category->score;

                if ($category->violated) {
                    $categories[] = $key;
                }
            }

            // Determine highest score as overall confidence
            $confidence = !empty($categoryScores) ? max($categoryScores) : 0;

            // Save moderation result to database
            $moderationResult = ModerationResult::create([
                'content_item_id' => $contentItem->id,
                'flagged' => $flagged,
                'categories' => $categories,
                'category_scores' => $categoryScores,
                'confidence' => $confidence,
            ]);

            // Auto-approve or auto-reject based on settings
            if (!$flagged && $settings->auto_approve) {
                // Content is clean and auto-approve is enabled
                $contentItem->update(['status' => 'approved']);
            } elseif ($flagged && $confidence >= $settings->confidence_threshold) {
                // Content is flagged with confidence above threshold
                $contentItem->update(['status' => 'rejected']);
            }

            return $moderationResult;
        } catch (Exception $e) {
            // Log the error and rethrow
            Log::error('Moderation API error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Approve a content item.
     *
     * @param ContentItem $contentItem The content item to approve
     * @return bool Whether the update was successful
     */
    public function approveContent(ContentItem $contentItem)
    {
        return $contentItem->update(['status' => 'approved']);
    }

    /**
     * Reject a content item.
     *
     * @param ContentItem $contentItem The content item to reject
     * @return bool Whether the update was successful
     */
    public function rejectContent(ContentItem $contentItem)
    {
        return $contentItem->update(['status' => 'rejected']);
    }
}
```

There are a few key points that the `ModerationService` class does, let's break it down:

1. It initializes an OpenAI client using your API key.
2. The `moderateContent` method:
   - Finds or creates settings for the content type
   - Calls the OpenAI moderation API
   - Processes the response to extract flagged categories and scores
   - Saves the moderation result to the database
   - Auto-approves or auto-rejects content based on settings
3. It provides methods to manually approve or reject content.

A service provider in Laravel is a class that binds services to the Laravel service container. This allows us to use dependency injection to access the service in our controllers, models, or other classes.

Let's register this service in the Laravel service container by creating a new service provider:

```bash
php artisan make:provider ModerationServiceProvider
```

The new service provider will be created in the `app/Providers` directory.

Now, configure the service provider:

```php
// app/Providers/ModerationServiceProvider.php
<?php

namespace App\Providers;

use App\Services\ModerationService;
use Illuminate\Support\ServiceProvider;

class ModerationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register the ModerationService as a singleton
        // This ensures we use the same instance throughout the application
        $this->app->singleton(ModerationService::class, function ($app) {
            return new ModerationService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
```

Add this new service provider to the providers array in `bootstrap/providers.php`:

```php
// bootstrap/providers.php
'providers' => [
    // ... other providers
    App\Providers\ModerationServiceProvider::class,
],
```

With the service provider in place along the models and migration files, we can now move to the next step of creating the Livewire components.

## Create Livewire Components

Now, let's create Livewire components for our content moderation system. Livewire allows us to create interactive UI components without writing JavaScript. We'll create a component for content submission, a moderation queue, and a dashboard for moderation statistics.

1. `ContentSubmission` component - for users to submit content
2. `ModerationQueue` component - for moderators to review content
3. `DashboardStats` component - to display moderation statistics

Let's create these components:

```bash
php artisan livewire:make ContentSubmission
php artisan livewire:make ModerationQueue
php artisan livewire:make DashboardStats
```

This will create three new Livewire components in the `app/Livewire` directory along with their corresponding views in the `resources/views/livewire` directory.

### 1. `ContentSubmission` Component

First, let's implement the component class:

```php
// app/Livewire/ContentSubmission.php
<?php

namespace App\Livewire;

use App\Models\ContentItem;
use App\Services\ModerationService;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class ContentSubmission extends Component
{
    /**
     * The content entered by the user.
     */
    public $content;

    /**
     * The type of content being submitted.
     */
    public $contentType = 'comment';

    /**
     * Message to display after submission.
     */
    public $message = '';

    /**
     * Status of the submitted content.
     */
    public $status = '';

    /**
     * Validation rules for the form.
     */
    protected $rules = [
        'content' => 'required|string|min:5',
        'contentType' => 'required|string',
    ];

    /**
     * Handle form submission.
     */
    public function submitContent()
    {
        // Validate form input
        $this->validate();

        // Create content item in the database
        $contentItem = ContentItem::create([
            'user_id' => Auth::id(), // Current logged-in user
            'content_type' => $this->contentType,
            'content' => $this->content,
            'status' => 'pending', // Initial status is pending
        ]);

        // Moderate the content immediately
        try {
            // Get the moderation service from the container
            $moderationService = app(ModerationService::class);

            // Send the content to OpenAI for moderation
            $moderationService->moderateContent($contentItem);

            // Update the message based on moderation status
            $this->message = 'Content submitted for review';
            $this->status = $contentItem->status;

            if ($contentItem->status === 'approved') {
                $this->message = 'Content approved and published';
            } elseif ($contentItem->status === 'rejected') {
                $this->message = 'Content rejected due to policy violations';
            }
        } catch (\Exception $e) {
            // Handle moderation API errors
            $this->message = 'Content submitted for review, but moderation service is currently unavailable.';
        }

        // Clear form after submission
        $this->reset('content');
    }

    /**
     * Render the component.
     */
    public function render()
    {
        return view('livewire.content-submission');
    }
}
```

The `ContentSubmission` component class handles form submission, content validation, and moderation using the `ModerationService`. It also updates the message based on the moderation status.

Now, let's create the view for this component:

```php
<!-- resources/views/livewire/content-submission.blade.php -->
<div>
    <div class="p-6 bg-white rounded-lg shadow-md card">
        <h2 class="mb-4 text-xl font-semibold">Submit Content</h2>

        <form wire:submit="submitContent">
            <!-- Content Type Dropdown -->
            <div class="mb-4">
                <label for="contentType" class="block text-sm font-medium text-gray-700">Content Type</label>
                <select wire:model="contentType" id="contentType" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="comment">Comment</option>
                    <option value="forum_post">Forum Post</option>
                    <option value="review">Product Review</option>
                    <option value="code_snippet">Code Snippet</option>
                </select>
                @error('contentType') <span class="text-xs text-red-500">{{ $message }}</span> @enderror
            </div>

            <!-- Content Textarea -->
            <div class="mb-4">
                <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
                <textarea wire:model="content" id="content" rows="4" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                @error('content') <span class="text-xs text-red-500">{{ $message }}</span> @enderror
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
                <button type="submit" class="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25">
                    Submit
                </button>
            </div>
        </form>

        <!-- Status Message -->
        @if ($message)
            <div class="mt-4 {{ $status === 'rejected' ? 'bg-red-100 text-red-700' : ($status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700') }} p-3 rounded">
                {{ $message }}
            </div>
        @endif
    </div>
</div>
```

The view contains a form for users to submit content, including a dropdown for selecting the content type and a textarea for entering the content. The form submission is handled by the `submitContent` method in the component class.

### 2. `ModerationQueue` Component

Now, let's implement the moderation queue component class:

```php
// app/Livewire/ModerationQueue.php
<?php

namespace App\Livewire;

use App\Models\ContentItem;
use App\Services\ModerationService;
use Livewire\Component;
use Livewire\WithPagination;

class ModerationQueue extends Component
{
    // Use Laravel's pagination with Livewire
    use WithPagination;

    // Use Tailwind CSS for pagination styling
    protected $paginationTheme = 'tailwind';

    /**
     * Current filter for content status.
     */
    public $statusFilter = 'pending';

    /**
     * Initialize the component.
     */
    public function mount()
    {
        // Check if user has permissions to view this page
        $this->authorize('viewModeration');
    }

    /**
     * Approve a content item.
     *
     * @param int $id The ID of the content item
     */
    public function approve($id)
    {
        $contentItem = ContentItem::findOrFail($id);
        app(ModerationService::class)->approveContent($contentItem);

        // Notify other components that content was moderated
        $this->dispatch('content-moderated');
    }

    /**
     * Reject a content item.
     *
     * @param int $id The ID of the content item
     */
    public function reject($id)
    {
        $contentItem = ContentItem::findOrFail($id);
        app(ModerationService::class)->rejectContent($contentItem);

        // Notify other components that content was moderated
        $this->dispatch('content-moderated');
    }

    /**
     * Moderate a content item using OpenAI.
     *
     * @param int $id The ID of the content item
     */
    public function moderate($id)
    {
        $contentItem = ContentItem::findOrFail($id);
        app(ModerationService::class)->moderateContent($contentItem);

        // Notify other components that content was moderated
        $this->dispatch('content-moderated');
    }

    /**
     * Filter content items by status.
     *
     * @param string $status The status to filter by
     */
    public function filterByStatus($status)
    {
        $this->statusFilter = $status;

        // Reset pagination when filter changes
        $this->resetPage();
    }

    /**
     * Render the component.
     */
    public function render()
    {
        // Build the query for content items
        $query = ContentItem::query()->with(['moderationResult', 'user']);

        // Apply status filter if not 'all'
        if ($this->statusFilter !== 'all') {
            $query->where('status', $this->statusFilter);
        }

        // Get paginated results
        $contentItems = $query->latest()->paginate(10);

        return view('livewire.moderation-queue', [
            'contentItems' => $contentItems
        ]);
    }
}
```

Here we define methods for approving, rejecting, and moderating content items. The `filterByStatus` method allows us to filter content items by status. The `render` method builds the query based on the status filter and paginates the results.

And the view for the moderation queue:

```php
<!-- resources/views/livewire/moderation-queue.blade.php -->
<div>
    <!-- Status Filter Buttons -->
    <div class="flex mb-4 space-x-2">
        <button wire:click="filterByStatus('pending')" class="px-4 py-2 rounded-md {{ $statusFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700' }}">
            Pending
        </button>
        <button wire:click="filterByStatus('approved')" class="px-4 py-2 rounded-md {{ $statusFilter === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700' }}">
            Approved
        </button>
        <button wire:click="filterByStatus('rejected')" class="px-4 py-2 rounded-md {{ $statusFilter === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700' }}">
            Rejected
        </button>
        <button wire:click="filterByStatus('all')" class="px-4 py-2 rounded-md {{ $statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700' }}">
            All
        </button>
    </div>

    <!-- Content Items Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Content</th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Flags</th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @forelse ($contentItems as $item)
                    <tr>
                        <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{{ $item->id }}</td>
                        <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ $item->content_type }}</td>
                        <td class="max-w-md px-6 py-4 text-sm text-gray-500">
                            <div class="overflow-y-auto max-h-20">
                                {{ $item->content }}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            @if ($item->status === 'pending')
                                <span class="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                                    Pending
                                </span>
                            @elseif ($item->status === 'approved')
                                <span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                    Approved
                                </span>
                            @elseif ($item->status === 'rejected')
                                <span class="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                                    Rejected
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            @if ($item->moderationResult)
                                @if ($item->moderationResult->flagged)
                                    <span class="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                                        Flagged
                                    </span>
                                    <div class="mt-1 text-xs">
                                        @foreach ($item->moderationResult->categories as $category)
                                            <span class="px-1 mr-1 text-red-700 rounded bg-red-50">{{ $category }}</span>
                                        @endforeach
                                    </div>
                                @else
                                    <span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                        Clean
                                    </span>
                                @endif
                            @else
                                <span class="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full">
                                    Not Checked
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <div class="flex space-x-2">
                                @if ($item->status !== 'approved')
                                    <button wire:click="approve({{ $item->id }})" class="text-green-600 hover:text-green-900">Approve</button>
                                @endif

                                @if ($item->status !== 'rejected')
                                    <button wire:click="reject({{ $item->id }})" class="text-red-600 hover:text-red-900">Reject</button>
                                @endif

                                @if (!$item->moderationResult)
                                    <button wire:click="moderate({{ $item->id }})" class="text-blue-600 hover:text-blue-900">Check</button>
                                @endif
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-sm text-center text-gray-500">No content items found</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Pagination Links -->
    <div class="mt-4">
        {{ $contentItems->links() }}
    </div>
</div>
```

The view displays a table of content items with columns for ID, type, content, status, flags, and actions. It also includes buttons to approve, reject, or moderate content items.

### 3. `DashboardStats` Component

Finally, let's implement the dashboard stats component:

```php
// app/Livewire/DashboardStats.php
<?php

namespace App\Livewire;

use App\Models\ContentItem;
use Livewire\Component;

class DashboardStats extends Component
{
    /**
     * Number of pending content items.
     */
    public $pendingCount;

    /**
     * Number of approved content items.
     */
    public $approvedCount;

    /**
     * Number of rejected content items.
     */
    public $rejectedCount;

    /**
     * Number of flagged content items.
     */
    public $flaggedCount;

    /**
     * Initialize the component.
     */
    public function mount()
    {
        // Check if user has permissions to view this page
        $this->authorize('viewModeration');

        // Load initial statistics
        $this->loadStats();
    }

    /**
     * Load moderation statistics from the database.
     */
    public function loadStats()
    {
        // Count items by status
        $this->pendingCount = ContentItem::where('status', 'pending')->count();
        $this->approvedCount = ContentItem::where('status', 'approved')->count();
        $this->rejectedCount = ContentItem::where('status', 'rejected')->count();

        // Count items that were flagged by the moderation API
        $this->flaggedCount = ContentItem::whereHas('moderationResult', function($query) {
            $query->where('flagged', true);
        })->count();
    }

    /**
     * Render the component.
     */
    public function render()
    {
        return view('livewire.dashboard-stats');
    }
}
```

The `DashboardStats` component class loads moderation statistics from the database and displays them in the view. The `loadStats` method counts content items by status and flags. The `render` method renders the component view.

And the view for the dashboard stats:

```php
<!-- resources/views/livewire/dashboard-stats.blade.php -->
<div>
    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <!-- Pending Items -->
        <div class="p-6 bg-white rounded-lg shadow-md">
            <div class="flex items-center">
                <div class="p-3 mr-4 text-yellow-500 bg-yellow-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Pending Review</p>
                    <p class="text-xl font-semibold text-gray-700">{{ $pendingCount }}</p>
                </div>
            </div>
        </div>

        <!-- Approved Items -->
        <div class="p-6 bg-white rounded-lg shadow-md">
            <div class="flex items-center">
                <div class="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Approved</p>
                    <p class="text-xl font-semibold text-gray-700">{{ $approvedCount }}</p>
                </div>
            </div>
        </div>

        <!-- Rejected Items -->
        <div class="p-6 bg-white rounded-lg shadow-md">
            <div class="flex items-center">
                <div class="p-3 mr-4 text-red-500 bg-red-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Rejected</p>
                    <p class="text-xl font-semibold text-gray-700">{{ $rejectedCount }}</p>
                </div>
            </div>
        </div>

        <!-- Flagged Items -->
        <div class="p-6 bg-white rounded-lg shadow-md">
            <div class="flex items-center">
                <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Flagged</p>
                    <p class="text-xl font-semibold text-gray-700">{{ $flaggedCount }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Link to Moderation Queue -->
    <div class="flex justify-center">
        <a href="{{ route('admin.moderation-queue') }}" class="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">
            View Moderation Queue
        </a>
    </div>
</div>
```

The view displays statistics for pending, approved, rejected, and flagged content items in a grid layout. It also includes a link to the moderation queue.

## Set Up Routes

Now let's define the routes for our admin dashboard and content submission page. We'll use Laravel's route middleware to protect the admin routes with the `viewModeration` gate. You can learn more about Laravel's authorization gates in the [Laravel authorization guide here](/guides/laravel-authorization).

```php
// routes/web.php
<?php

use App\Livewire\ContentSubmission;
use App\Livewire\ModerationQueue;
use App\Livewire\DashboardStats;
use Illuminate\Support\Facades\Route;

// Routes that require authentication
Route::middleware(['auth'])->group(function () {
    // User content submission
    Route::get('/submit', ContentSubmission::class)->name('content.submit');

    // Admin routes
    Route::middleware(['can:viewModeration'])->prefix('admin')->group(function () {
        Route::get('/', DashboardStats::class)->name('admin.dashboard');
        Route::get('/moderation-queue', ModerationQueue::class)->name('admin.moderation-queue');
    });
});

// Existing routes
```

These routes define:

1. A public homepage
2. A route for authenticated users to submit content
3. Admin routes for the dashboard and moderation queue, protected by the `viewModeration` gate

Now, let's define the authorization gates in the `AppServiceProvider`. This gate will determine who can access the moderation dashboard:

```php
// app/Providers/AppServiceProvider.php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Define who can view moderation pages
        // For simplicity, we're allowing user ID 1 or any user with is_admin=true
        Gate::define('viewModeration', function ($user) {
            return $user->id === 1 || $user->is_admin;
        });
    }
}
```

This `AppServiceProvider` defines who can access the moderation dashboard. In a real application, you would want to implement more sophisticated access control logic. For more information on Laravel authorization, check out the [official documentation](https://laravel.com/docs/8.x/authorization) and the [Laravel authorization guide](/guides/laravel-authorization).

## Create Admin Dashboard

Let's create a layout for our admin dashboard. First, create an admin layout file:

```php
<!-- resources/views/layouts/admin.blade.php -->
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} - Admin</title>

    <!-- Scripts and Styles -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Livewire Styles -->
    @livewireStyles
</head>
<body class="font-sans antialiased bg-gray-100">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="p-4 text-white bg-gray-800">
            <div class="container flex items-center justify-between mx-auto">
                <div class="flex items-center space-x-8">
                    <a href="{{ route('admin.dashboard') }}" class="text-xl font-bold">Content Moderation</a>

                    <div class="hidden space-x-4 md:flex">
                        <a href="{{ route('admin.dashboard') }}" class="px-3 py-2 rounded hover:bg-gray-700 {{ request()->routeIs('admin.dashboard') ? 'bg-gray-700' : '' }}">Dashboard</a>
                        <a href="{{ route('admin.moderation-queue') }}" class="px-3 py-2 rounded hover:bg-gray-700 {{ request()->routeIs('admin.moderation-queue') ? 'bg-gray-700' : '' }}">Moderation Queue</a>
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-400">{{ Auth::user()->name }}</div>

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="text-sm text-gray-400 hover:text-white">
                            Log Out
                        </button>
                    </form>
                </div>
            </div>
        </nav>

        <!-- Page Content -->
        <main class="container px-4 py-6 mx-auto">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">@yield('title', 'Admin Dashboard')</h1>
            </div>

            {{ $slot }}
        </main>
    </div>

    <!-- Livewire Scripts -->
    @livewireScripts
</body>
</html>
```

Now, let's create a content submission page that users can access:

```php
<!-- resources/views/content/submit.blade.php -->
<x-app-layout>
    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h1 class="mb-6 text-2xl font-bold">Submit Content</h1>
                    <livewire:content-submission />
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
```

Here, we're using the `x-app-layout` component to wrap the content submission form. This layout includes the navigation bar and other common elements. The `content-submission` Livewire component is embedded in this view using the `livewire:content-submission` directive.

After making all the views and components, you should run the following command to compile the assets:

```bash
npm run dev
```

This will compile the assets and make them available for your application. You can now test the content submission page by visiting the `/submit` route and submitting some content, and then check the moderation queue at `/admin/moderation-queue` and the stats dashboard at `/admin`.

## Test the System

With everything set up, you can now test the moderation system.

Let's create a basic command to test our moderation system. This will help you check if everything is working correctly:

```bash
php artisan make:command TestModeration
```

Implement the command:

```php
// app/Console/Commands/TestModeration.php
<?php

namespace App\Console\Commands;

use App\Models\ContentItem;
use App\Services\ModerationService;
use Illuminate\Console\Command;

class TestModeration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:moderation {content} {--type=comment}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the moderation system with a sample content';

    /**
     * Execute the console command.
     */
    public function handle(ModerationService $moderationService)
    {
        // Get the content and content type from the command arguments
        $content = $this->argument('content');
        $type = $this->option('type');

        $this->info("Testing moderation on content: '$content'");

        // Create a test content item
        $contentItem = ContentItem::create([
            'content_type' => $type,
            'content' => $content,
            'status' => 'pending',
        ]);

        try {
            // Moderate the content using OpenAI
            $result = $moderationService->moderateContent($contentItem);

            // Display the results
            $this->info("Moderation completed for content ID: {$contentItem->id}");
            $this->info("Status: {$contentItem->status}");
            $this->info("Flagged: " . ($result->flagged ? 'Yes' : 'No'));

            if ($result->categories) {
                $this->info("Flagged categories: " . implode(', ', $result->categories));
            }

            if ($result->category_scores) {
                $this->info("Category scores:");
                foreach ($result->category_scores as $category => $score) {
                    $this->info("  - $category: $score");
                }
            }

            $this->info("Confidence: {$result->confidence}");
        } catch (\Exception $e) {
            $this->error("Moderation failed: {$e->getMessage()}");
        }

        return Command::SUCCESS;
    }
}
```

With the above command we are doing the following:

- Accepting the content and content type as command arguments
- Creating a test content item in the database
- Moderating the content using the `ModerationService`
- Displaying the moderation results where we loop through the categories and scores

You can test the moderation system with this command:

- Test with harmless content:

  ```bash
  php artisan test:moderation "This is a friendly comment about your tech blog."
  ```

  Output:

  ```
  Testing moderation on content: 'This is a friendly comment about your tech blog.'
  Moderation completed for content ID: 4
  Status: pending
  Flagged: No
  Category scores:
      - hate: 2.4322733338522E-7
      - hate/threatening: 3.4327216069663E-10
      - harassment: 4.3629752326524E-6
      - harassment/threatening: 4.6775343776062E-7
      - self-harm: 6.9364503474389E-8
      - self-harm/intent: 1.178076942665E-7
      - self-harm/instructions: 4.2720111892436E-9
      - sexual: 0.00012831370986532
      - sexual/minors: 2.4699570531084E-6
      - violence: 2.0182131265756E-5
      - violence/graphic: 8.1019070421462E-6
  Confidence: 0.00012831370986532
  ```

* Test with potentially problematic content:

  ```bash
  php artisan test:moderation "I hate this product. It's the worst thing I've ever used."
  ```

* Test with obviously harmful content:

  ```
  php artisan test:moderation "I'm going to harm you."
  ```

  With this you will get a status of `rejected` and the content will be flagged as `violence` and `threatening`.

## How the System Works

Let's walk through how the content moderation system works in practice:

1. Content Submission:

   - A user submits content through the `ContentSubmission` component
   - The content is saved to the database with status "pending"
   - The `ModerationService` immediately sends the content to OpenAI's moderation API

2. AI Moderation:

   - OpenAI analyzes the content and returns categories, scores, and a flagged status
   - The `ModerationService` saves these results to the `ModerationResult` table in our Neon Postgres database
   - Based on settings, content may be auto-approved or auto-rejected

3. Manual Review:

   - Content that isn't auto-approved or auto-rejected stays in the "pending" state
   - Moderators use the `ModerationQueue` component to review pending content
   - They can see which categories were flagged and why
   - Moderators can manually approve or reject content

4. Dashboard Statistics:
   - The `DashboardStats` component shows counts of pending, approved, rejected, and flagged content
   - This helps moderators monitor the system's overall health

## Conclusion

In this guide, we've built a content moderation system using Laravel, Livewire, OpenAI, and Neon Postgres. This system can:

- Accept user-generated content and automatically analyze it for harmful content
- Store moderation results in Neon with detailed information about flagged categories
- Provide different moderation settings for different content types
- Offer an interactive admin dashboard for manual review of flagged content

This moderation system can be integrated into various applications, from forums and social networks to review platforms and comment systems.

As a next step, you can use Laravel queues to process moderation tasks asynchronously, improving performance and scalability. You can check out the [Laravel queues guide](/guides/laravel-queue-workers-job-processing) for more information.

<NeedHelp />
