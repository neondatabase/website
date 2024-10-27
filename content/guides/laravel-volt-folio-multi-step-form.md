---
title: Building a Multi-Step Form with Laravel Volt, Folio, and Neon Postgres
subtitle: Learn how to create a multi-step form with Laravel Volt, Folio, and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-10-19T00:00:00.000Z'
updatedOn: '2024-10-19T00:00:00.000Z'
---

In this guide, we'll walk through the process of building a multi-step form using Laravel [Volt](https://livewire.laravel.com/docs/volt), [Folio](https://laravel.com/docs/11.x/folio), and Neon Postgres.

Laravel Volt provides reactivity for dynamic form interactions, Folio offers file-based routing for a clean project structure, and Neon Postgres serves as our scalable database solution.

Our example app will be a job application form with multiple steps, including personal information, education, and work experience.

## Prerequisites

Before we begin, make sure you have:

- PHP 8.1 or higher installed
- Composer for managing PHP dependencies
- A [Neon](https://console.neon.tech/signup) account for Postgres hosting
- Basic familiarity with Laravel and Postgres

## Setting up the Project

Let's start by creating a new Laravel project and setting up the necessary components.

1. Create a new Laravel project:

    ```bash
    composer create-project laravel/laravel job-application-form
    cd job-application-form
    ```

2. Install Laravel Folio for file-based routing:

    ```bash
    composer require laravel/folio
    ```

3. Install the Volt Livewire adapter for Laravel, this will also install the Livewire package:

    ```bash
    composer require livewire/volt
    ```

4. After installing Volt, you can install the Volt service provider:

    ```bash
    php artisan volt:install
    ```

## Configuring the Database Connection

Update your `.env` file with your Neon Postgres credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Replace `your-neon-hostname.neon.tech`, `your_database_name`, `your_username`, and `your_password` with your Neon Postgres connection details.

## Database Design

Let's create the database migrations for our job application form. We'll use separate tables for each section and leverage Postgres JSON columns for flexible data storage for additional information.

First, let's create the migration for the applicants table using the following `artisan` command:

```bash
php artisan make:migration create_applicants_table
```

Note that the `create_applicants_table` migration name follows the Laravel convention of `create_{table_name}_table`, where `{table_name}` is the name of the table you're creating. That way, Laravel can automatically determine the table name from the migration name, and also it will be easier to identify the purpose of the migration file by its name for other developers.

This command generates a new migration file in the `database/migrations` directory. Open the newly created file and update its content as follows:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->jsonb('additional_info')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applicants');
    }
};
```

This migration creates the `applicants` table with fields for `first_name`, `last_name`, and `email`. The `email` field is set as unique to prevent duplicate applications. We've also included a `jsonb` column called `additional_info` for storing any extra data that doesn't fit into the predefined columns. This flexibility is one of the advantages of using Postgres with Laravel.

Next, let's create the migration for the educations table:

```bash
php artisan make:migration create_educations_table
```

Update the newly created migration file with the following content:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained()->onDelete('cascade');
            $table->string('institution');
            $table->string('degree');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->jsonb('additional_info')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('educations');
    }
};
```

This migration creates the `educations` table. It includes a foreign key `applicant_id` that references the `id` column in the `applicants` table. The `onDelete('cascade')` ensures that if an applicant is deleted, their education records are also removed. We've included fields for the institution, degree, and start/end dates. Again, we have an `additional_info` jsonb column for flexibility.

Finally, let's create the migration for the work experiences table:

```bash
php artisan make:migration create_work_experiences_table
```

Update this migration file with the following content:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained()->onDelete('cascade');
            $table->string('company');
            $table->string('position');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('responsibilities');
            $table->jsonb('additional_info')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('work_experiences');
    }
};
```

This migration creates the `work_experiences` table. Similar to the `educations` table, it has a foreign key relationship with the `applicants` table. It includes fields for the company, position, start/end dates, and responsibilities. The `responsibilities` field is of type `text` to allow for longer descriptions. We've also included an `additional_info` jsonb column here.

Now that we've created all our migrations, we can run them to create the tables in our database:

```bash
php artisan migrate
```

This command will execute all the migrations we've just created, setting up the database schema for our job application form.

One thing to note is that we've used the `jsonb` column type for storing additional information in each table. This allows us to store flexible data structures without needing to define a fixed schema. Postgres' JSONB data type is ideal for this use case.

For your Laravel migrations, you should not use the Neon Postgres Pooler. The Pooler is designed to manage connections for long-running processes, such as web servers, and is not necessary for short-lived processes like migrations.

## Creating Models

Next, let's create models for our `Applicant`, `Education`, and `WorkExperience` tables. Models in Laravel are used to interact with database tables and represent the data in your application in an object-oriented way.

Laravel provides an easy way to generate models using the `artisan` command. To create the `Applicant` model run:

```bash
php artisan make:model Applicant
```

This command creates a new file `app/Models/Applicant.php`. Open this file and update it with the following content:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'additional_info'
    ];

    protected $casts = [
        'additional_info' => 'array',
    ];

    public function educations()
    {
        return $this->hasMany(Education::class);
    }

    public function workExperiences()
    {
        return $this->hasMany(WorkExperience::class);
    }
}
```

Now, create the `Education` model:

```bash
php artisan make:model Education
```

Update the newly created file at `app/Models/Education.php` with the following content:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    public $table = 'educations';

    protected $fillable = [
        'applicant_id',
        'institution',
        'degree',
        'start_date',
        'end_date',
        'additional_info'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'additional_info' => 'array',
    ];

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }
}
```

Finally, create the `WorkExperience` model:

```bash
php artisan make:model WorkExperience
```

And update the `app/Models/WorkExperience.php` file with the following content:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkExperience extends Model
{
    use HasFactory;

    protected $fillable = [
        'applicant_id',
        'company',
        'position',
        'start_date',
        'end_date',
        'responsibilities',
        'additional_info'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'additional_info' => 'array',
    ];

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }
}
```

Let's quickly note down the most important parts in these model definitions:

- We've used the `$fillable` property to specify which attributes can be mass-assigned. This is a security feature to prevent unintended mass assignment vulnerabilities.
- We've defined relationships between models. An `Applicant` has many `Education` and `WorkExperience` records, while `Education` and `WorkExperience` belong to an `Applicant`.
- We've used the `$casts` property to automatically cast certain attributes to specific types. For example, we're casting the `additional_info` field to an array, which works well with Postgres' JSONB column type.
- The `start_date` and `end_date` fields are cast to date objects, which allows for easy date manipulation in PHP.

These models will allow us to easily interact with our database tables using Laravel's Eloquent ORM. They provide a convenient way to retrieve, create, update, and delete records, as well as define relationships between different tables.

## Creating a layout for the multi-step form

Before we create the form components, let's set up a layout for our multi-step form. We'll create a main layout file that includes the necessary CSS and JavaScript assets including the Livewire scripts.

Create a new Blade layout file at `resources/views/layouts/app.blade.php`:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Job Application Form</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body>
    <div class="container mx-auto mt-8">
        @yield('content')
    </div>

    @livewireScripts
</body>
</html>
```

In this layout file:

- We've included the necessary meta tags for character encoding, viewport settings and the page title.
- We've used the `@vite` directive to include the CSS and JavaScript assets. This directive is provided by the Laravel Vite package, which integrates Laravel with the Vite build tool for modern frontend development.
- We've included the Livewire styles and scripts. Livewire is a full-stack framework for Laravel that allows you to build dynamic interfaces without writing JavaScript.

To compile the frontend assets, you'll need to run the following commands:

```bash
npm install
npm run build
```

## Implementing File-based Routing with Folio

Laravel Folio was introduced in 2023, and it offers a new approach to routing in Laravel applications.

It simplifies routing by allowing you to create routes simply by adding Blade templates to a specific directory. This file-based routing system makes your project structure cleaner and more intuitive.

It is not a replacement for Laravel's built-in routing system but rather a complementary feature that simplifies routing for certain types of applications.

First, let's set up the directory structure for our multi-step form. Create the following directory structure in your `resources/views/pages` folder:

```shell
resources/
└── views/
    └── pages/
        ├── index.blade.php
        └── apply/
            ├── index.blade.php
            ├── personal-info.blade.php
            ├── education.blade.php
            ├── work-experience.blade.php
            └── review.blade.php
            └── confirmation.blade.php
```

With Folio, each of these Blade files automatically becomes a route. For example:

- `pages/index.blade.php` will be accessible at the root URL `/`
- `pages/apply/personal-info.blade.php` will be accessible at `/apply/personal-info`

To create a Folio page, you can use the `php artisan folio:page` command. For example, to create a page for the personal information step:

```bash
php artisan folio:page apply/personal-info
```

The above will create a blade file for the in `resources/views/pages/apply/personal-info.blade.php`:

```blade
<div>
    <h2>Personal Information</h2>
    <!-- Your form content will go here -->
</div>
```

You can list all available Folio routes using the following Artisan command:

```bash
php artisan folio:list
```

You can create similar pages for the education, work experience, and review steps:

```bash
php artisan folio:page apply/education
php artisan folio:page apply/work-experience
php artisan folio:page apply/review
```

We will update these files with the form components later in the guide.

The main thing to remember here is that with Folio, you don't need to manually define routes in a separate routes file. The mere presence of a Blade file in the `pages` directory automatically creates a corresponding route.

## Building the Multi-Step Form with Volt

Volt is a powerful addition to Laravel Livewire that allows you to build reactive components without writing JavaScript. Unlike traditional Livewire components, Volt lets you define your component's state and validation rules directly in the view file, eliminating the need for a separate component class.

Let's create Volt components for each step of our multi-step form.

### Personal Information Form

First, create the personal information form component:

```bash
php artisan make:volt personal-info-form
```

That will create a file at `resources/views/livewire/personal-info-form.blade.php`. Update the file with the following content:

```blade
<?php

use function Livewire\Volt\state;
use function Livewire\Volt\rules;

state([
    'first_name' => '',
    'last_name' => '',
    'email' => '',
]);

rules([
    'first_name' => 'required|min:2',
    'last_name' => 'required|min:2',
    'email' => 'required|email|unique:applicants,email',
]);

$saveAndContinue = function () {
    $this->validate();

    $applicant = \App\Models\Applicant::create($this->only(['first_name', 'last_name', 'email']));
    session(['applicant_id' => $applicant->id]);

    return redirect()->route('apply.education');
};

?>

<div class="max-w-lg p-8 mx-auto bg-white rounded-lg shadow-md">
    <h2 class="mb-6 text-2xl font-semibold text-gray-800">Personal Information</h2>

    <form wire:submit.prevent="saveAndContinue">
        <!-- First Name -->
        <div class="mb-4">
            <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" id="first_name" wire:model="first_name" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('first_name')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-4">
            <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" id="last_name" wire:model="last_name" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('last_name')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" wire:model="email" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('email')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div>
            <button type="submit" class="w-full px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700">
                Next
            </button>
        </div>
    </form>
</div>
```

Quick explanation of the code above:

- We define the component's state using the `state` function, which initializes the form fields.
- The `rules` function sets up validation rules for each field.
- The `saveAndContinue` function handles form submission. It validates the form, creates a new `Applicant` record, stores the `applicant_id` in the session, and redirects to the next step.
- The form fields are bound to the component's state using `wire:model`.
- Validation errors are displayed using `@error`.

In the same way, you can create components for the education, work experience, and review steps.

### Education Form

Next, create the education form component:

```bash
php artisan make:volt education-form
```

Update `resources/views/livewire/education-form.blade.php`:

```blade
<?php

use function Livewire\Volt\state;
use function Livewire\Volt\rules;

state([
    'institution' => '',
    'degree' => '',
    'start_date' => '',
    'end_date' => '',
]);

rules([
    'institution' => 'required|min:2',
    'degree' => 'required|min:2',
    'start_date' => 'required|date',
    'end_date' => 'nullable|date|after:start_date',
]);

$saveAndContinue = function () {
    $this->validate();

    $applicantId = session('applicant_id');
    \App\Models\Education::create(array_merge($this->all(), ['applicant_id' => $applicantId]));

    return redirect()->route('apply.work-experience');
};

?>

<div class="max-w-lg p-8 mx-auto bg-white rounded-lg shadow-md">
    <h2 class="mb-6 text-2xl font-semibold text-gray-800">Education</h2>

    <form wire:submit.prevent="saveAndContinue">
        <div class="mb-4">
            <label for="institution" class="block text-sm font-medium text-gray-700">Institution</label>
            <input type="text" id="institution" wire:model="institution" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('institution')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-4">
            <label for="degree" class="block text-sm font-medium text-gray-700">Degree</label>
            <input type="text" id="degree" wire:model="degree" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('degree')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-4">
            <label for="start_date" class="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" id="start_date" wire:model="start_date" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('start_date')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-6">
            <label for="end_date" class="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" id="end_date" wire:model="end_date" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('end_date')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div>
            <button type="submit" class="w-full px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700">
                Next
            </button>
        </div>
    </form>
</div>
```

### Work Experience Form

Next, let's create the work experience form component:

```bash
php artisan make:volt work-experience-form
```

Update `resources/views/livewire/work-experience-form.blade.php` similar to the previous components:

```blade
<?php

use function Livewire\Volt\state;
use function Livewire\Volt\rules;

state([
    'company' => '',
    'position' => '',
    'start_date' => '',
    'end_date' => '',
    'responsibilities' => '',
]);

rules([
    'company' => 'required|min:2',
    'position' => 'required|min:2',
    'start_date' => 'required|date',
    'end_date' => 'nullable|date|after:start_date',
    'responsibilities' => 'required|min:10',
]);

$saveAndContinue = function () {
    $this->validate();

    $applicantId = session('applicant_id');
    \App\Models\WorkExperience::create(array_merge($this->all(), ['applicant_id' => $applicantId]));

    return redirect()->route('apply.review');
};

?>

<div class="max-w-lg p-8 mx-auto bg-white rounded-lg shadow-md">
    <h2 class="mb-6 text-2xl font-semibold text-gray-800">Work Experience</h2>

    <form wire:submit.prevent="saveAndContinue">
        <div class="mb-4">
            <label for="company" class="block text-sm font-medium text-gray-700">Company</label>
            <input type="text" id="company" wire:model="company" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('company')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-4">
            <label for="position" class="block text-sm font-medium text-gray-700">Position</label>
            <input type="text" id="position" wire:model="position" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('position')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-4">
            <label for="start_date" class="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" id="start_date" wire:model="start_date" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('start_date')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-4">
            <label for="end_date" class="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" id="end_date" wire:model="end_date" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            @error('end_date')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-6">
            <label for="responsibilities" class="block text-sm font-medium text-gray-700">Responsibilities</label>
            <textarea id="responsibilities" wire:model="responsibilities" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            @error('responsibilities')
                <span class="text-sm text-red-500">{{ $message }}</span>
            @enderror
        </div>

        <div>
            <button type="submit" class="w-full px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700">
                Next
            </button>
        </div>
    </form>
</div>
```

### Review Form

Finally, create the review form component:

```bash
php artisan make:volt review-form
```

Update `resources/views/livewire/review-form.blade.php` as we did for the other components:

```blade
<?php

use function Livewire\Volt\state;
use function Livewire\Volt\{mount};
use App\Models\Applicant;

state(['applicant' => null]);

mount(function () {
    $applicantId = session('applicant_id');
    $this->applicant = Applicant::with(['educations', 'workExperiences'])->findOrFail($applicantId);
});

$submit = function () {
    session()->flash('message', 'Your application has been submitted successfully!');
    return redirect()->route('apply.confirmation');
};

?>

<div class="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
    <h2 class="mb-6 text-2xl font-semibold text-gray-800">Review Your Application</h2>

    <div class="mb-6">
        <h3 class="mb-3 text-xl font-semibold text-gray-700">Personal Information</h3>
        <p><strong>Name:</strong> {{ $applicant->first_name }} {{ $applicant->last_name }}</p>
        <p><strong>Email:</strong> {{ $applicant->email }}</p>
    </div>

    <div class="mb-6">
        <h3 class="mb-3 text-xl font-semibold text-gray-700">Education</h3>
        @foreach($applicant->educations as $education)
            <div class="p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
                <p><strong>Institution:</strong> {{ $education->institution }}</p>
                <p><strong>Degree:</strong> {{ $education->degree }}</p>
                <p><strong>Period:</strong> {{ $education->start_date }} - {{ $education->end_date ?: 'Present' }}</p>
            </div>
        @endforeach
    </div>

    <div class="mb-6">
        <h3 class="mb-3 text-xl font-semibold text-gray-700">Work Experience</h3>
        @foreach($applicant->workExperiences as $experience)
            <div class="p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
                <p><strong>Company:</strong> {{ $experience->company }}</p>
                <p><strong>Position:</strong> {{ $experience->position }}</p>
                <p><strong>Period:</strong> {{ $experience->start_date }} - {{ $experience->end_date ?: 'Present' }}</p>
                <p><strong>Responsibilities:</strong> {{ $experience->responsibilities }}</p>
            </div>
        @endforeach
    </div>

    <div>
        <button wire:click="submit" class="w-full px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700">
            Submit Application
        </button>
    </div>
</div>
```

These Volt components handle the state management, validation, and submission logic for each step of the multi-step form. That way Volt simplifies the process of creating interactive components by allowing you to define both the logic and the template in a single file.

To use these components in your Folio pages and make the routes named, you can include them like this. Named routes allow you to easily reference routes by name throughout your application. We also need to extend a layout for each page to ensure a consistent structure.

First, in each file, you will define a named route using the `name` function and extend the layout.

- For the `resources/views/pages/apply/personal-info.blade.php` file:

  ```blade
  <?php
  use function Laravel\Folio\name;

  name('apply.personal-info');
  ?>

  @extends('layouts.app')

  @section('title', 'Personal Information')

  @section('content')
  <div>
      <livewire:personal-info-form />
  </div>
  @endsection
  ```

We need to do the same for the other pages:

- For the `resources/views/pages/apply/education.blade.php` file:

  ```blade
  <?php
  use function Laravel\Folio\name;

  name('apply.education');
  ?>

  @extends('layouts.app')

  @section('title', 'Education')

  @section('content')
  <div>
      <livewire:education-form />
  </div>
  @endsection
  ```

- For the `resources/views/pages/apply/work-experience.blade.php` file:

  ```blade
  <?php
  use function Laravel\Folio\name;

  name('apply.work-experience');
  ?>

  @extends('layouts.app')

  @section('title', 'Work Experience')

  @section('content')
  <div>
      <livewire:work-experience-form />
  </div>
  @endsection
  ```

- And for the `resources/views/pages/apply/review.blade.php` file:

  ```blade
  <?php
  use function Laravel\Folio\name;

  name('apply.review');
  ?>

  @extends('layouts.app')

  @section('title', 'Review')

  @section('content')
  <div>
      <livewire:review-form />
  </div>
  @endsection
  ```

### Confirmation Page

Finally, create a confirmation page for the application submission:

```bash
php artisan folio:page apply/confirmation
```

Update the `resources/views/pages/apply/confirmation.blade.php` file:

```blade
<?php
use function Laravel\Folio\name;

name('apply.confirmation');
?>

@extends('layouts.app')

@section('title', 'Confirmation')

@section('content')
<div class="max-w-md p-8 mx-auto text-center bg-white rounded-lg shadow-md">
    <h2 class="mb-4 text-2xl font-semibold text-green-600">Application Submitted</h2>

    <p class="mb-6 text-gray-700">{{ session('message') }}</p>

    <a href="/" class="inline-block px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700">
        Return to Homepage
    </a>
</div>
@endsection
```

This page displays a success message after the application is submitted and provides a link to return to the homepage.

## Testing the Multi-Step Form

To manually verify that everything works as expected, follow these steps:

1. If you haven't already, start the Laravel development server:

   ```
   php artisan serve
   ```

1. Open your browser and navigate to `http://localhost:8000/apply/personal-info`.

1. Fill out the personal information form and submit it. You should be redirected to the education form.

1. Fill out the education form and submit it. You should be redirected to the work experience form.

1. Fill out the work experience form and submit it. You should be redirected to the review page.

1. On the review page, verify that all the information you entered is displayed correctly.

1. Submit the application and verify that you see a success message.

1. To check if the data was persisted correctly:

   - Open a database client (like pgAdmin for Postgres) and connect to your Neon database.
   - Check the `applicants`, `educations`, and `work_experiences` tables. You should see your submitted data.
   - Verify that the `applicant_id` in the `educations` and `work_experiences` tables matches the `id` in the `applicants` table for your submission.

1. Try refreshing the page or closing and reopening your browser, then navigate back to `http://localhost:8000/apply/review`. You should still see your submitted data, demonstrating that the data persists across sessions.

## Testing

Besides manual testing, you can also write automated tests to make sure your multi-step form works correctly. Laravel provides a testing suite that allows you to write unit, feature, and browser tests.

Create feature tests for your multi-step form to ensure each step works correctly. Here's an example for the personal info step:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Applicant;
use Livewire\Volt\Volt;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PersonalInfoTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_personal_info()
    {
        Volt::test('personal-info-form')
            ->set('first_name', 'John')
            ->set('last_name', 'Doe')
            ->set('email', 'john@example.com')
            ->call('saveAndContinue')
            ->assertRedirect('/apply/education');

        $this->assertDatabaseHas('applicants', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
        ]);

        $this->assertNotNull(session('applicant_id'));
    }
}
```

This test checks if:

1. The form can be submitted with valid data.
1. The data is correctly stored in the database.
1. The `applicant_id` is stored in the session.
1. The user is redirected to the next step after submission.

You can create similar tests for the education and work experience steps.

To learn more about testing in Laravel, check out the [Testing Laravel Applications with Neon's Database Branching](/guides/laravel-test-on-branch) guide.

## Conclusion

In this guide, we've built a multi-step form using Laravel Volt, Folio, and Neon Postgres. We've covered form validation, data storage, and routing, demonstrating how these tools can be used together to create a dynamic and interactive form.

To further improve this project, consider adding features like:

- File uploads for resumes
- Email notifications to applicants
- An admin interface to review applications

One thing to keep in mind is always to validate and sanitize user inputs, optimize your database queries, and thoroughly test your application before deploying to production.

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Neon Documentation](/docs)
- [Neon Branching GitHub Actions Guide](/docs/guides/branching-github-actions)

<NeedHelp />
