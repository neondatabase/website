---
title: Creating a Multi-Tenant Application with Laravel and Neon
subtitle: Learn how to build a scalable multi-tenant application using Laravel and Neon's powerful database features
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-06-30T00:00:00.000Z'
updatedOn: '2024-06-30T00:00:00.000Z'
---

Multi-tenancy is a software architecture where a single instance of an application serves multiple tenants or clients.

Each tenant's data is isolated and remains invisible to other tenants. This approach is commonly used in Software as a Service (SaaS) applications. In this tutorial, we'll build the foundation for a multi-tenant SaaS application using Laravel and Neon.

By the end of this tutorial, you'll have a fully functional multi-tenant SaaS application where tenants can manage their own books, users, and settings, all while maintaining data isolation between tenants.

## Prerequisites

Before we start, make sure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- [Node.js](https://nodejs.org/) and npm for managing front-end assets
- A [Neon](https://console.neon.tech/signup) account for database hosting
- Basic knowledge of Laravel and Livewire

## Setting up the Project

Let's start by creating a new Laravel project and setting up the necessary components.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel laravel-multi-tenant-saas
cd laravel-multi-tenant-saas
```

### Installing Required Packages

For our multi-tenant SaaS application, we'll use the following package:

- `stancl/tenancy`: A flexible multi-tenancy package for Laravel
- Laravel Breeze: A minimal authentication starter kit for Laravel

Start by installing the `stancl/tenancy` package:

```bash
composer require stancl/tenancy
```

After installing the package, let's set up the tenancy:

```bash
php artisan tenancy:install
```

Register the `TenancyServiceProvider` in the `bootstrap/providers.php` file:

```php
return [
    // ...
    App\Providers\TenancyServiceProvider::class,
],
```

Let's install Laravel Breeze with the Blade views:

```bash
composer require laravel/breeze --dev
php artisan breeze:install blade
```

Next, install the required NPM packages:

```bash
npm install
npm run dev
```

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

After updating the `.env` file, run the database migrations:

```bash
php artisan migrate
```

## Implementing Multi-Tenancy

Now that we have our basic setup, let's implement multi-tenancy in our application.

### Creating the Tenant Model

Create a `Tenant` model:

```bash
php artisan make:model Tenant
```

Update the `app/Models/Tenant.php` file:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasFactory, HasDatabase, HasDomains;

}
```

This model extends the base `Tenant` model provided by the tenancy package and implements the `TenantWithDatabase` interface. We've also defined the fillable attributes and custom columns for our tenant.

The `HasDatabase` and `HasDomains` traits provided by the tenancy package allow us to manage tenant-specific databases and domains. This essentially means that each tenant will have its own database and domain providing data isolation between tenants.

To learn more about the tenancy package event system and how to customize the tenant model, refer to the [stancl/tenancy documentation](https://tenancyforlaravel.com/docs/v3/event-system).

### Configuring Tenancy

Update the `config/tenancy.php` file to use our custom `Tenant` model:

```php
'tenant_model' => \App\Models\Tenant::class,
```

Also, update the central domains configuration:

```php
'central_domains' => [
    'laravel-multi-tenant-saas.test',
    'localhost',
    'example.com',
],
```

Replace the default central domains with your own domain names.

This is an important part as this is how the tenancy package will determine which domain belongs to which tenant and load the tenant-specific data accordingly.

Feel free to review the other configuration options in the `config/tenancy.php` file to customize the tenancy behavior based on your requirements.

### Creating Tenant Migrations

The tenancy package has built-in event listeners that automatically run tenant-specific migrations when a tenant is created. For this we need to make sure that all of the tenant-specific migrations are in the `database/migrations/tenant` directory.

As each tenant will have its own database, the migrations in the tenant directory will be used to create tenant-specific tables in the tenant's database.

Start by copying the default User migration to the `database/migrations/tenant` directory:

```bash
cp database/migrations/0001_01_01_000000_create_users_table.php database/migrations/tenant
```

This will be the base migration for tenant-specific tables.

### Implementing Tenant Routes

The tenancy package provides middleware to handle tenant-specific routes. This allows you to define routes that are accessible only to tenants and not to central domains.

Start by creating a new file `routes/tenant.php` for tenant-specific routes with the following content:

```php
<?php

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::get('/', function () {
        return 'This is your multi-tenant application. The id of the current tenant is ' . tenant('id');
    });

    // Here you can add more tenant-specific routes
});
```

These routes will be loaded by the `TenantRouteServiceProvider` and will be accessible only to tenants. The `InitializeTenancyByDomain` middleware will set the current tenant based on the domain, and the `PreventAccessFromCentralDomains` middleware will prevent access from central domains.

For more information on how to customize the tenancy routes, refer to the [stancl/tenancy documentation](https://tenancyforlaravel.com/docs/v3/routes).

### Implementing Tenant Creation

Create a controller for tenant registration, this would usually be done by the admin users of the application:

```bash
php artisan make:controller TenantController
```

Update the `app/Http/Controllers/TenantController.php` controller and implement the tenant registration process:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function showRegistrationForm()
    {
        return view('tenant.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'domain' => 'required|string|max:255|unique:domains,domain',
        ]);

        $tenant = Tenant::create();
        $tenant->domains()->create(['domain' => $request->domain]);

        return redirect()->route('tenant.registered', $request->domain);
    }

    public function registered($domain)
    {
        return view('tenant.registered', compact('domain'));
    }
}
```

This controller handles tenant registration, creates a new tenant in the database, and sets up the tenant's domain. The `TenancyServiceProvider` will automatically map the tenancy events to the listener, which will create the tenant's database and run the tenant-specific migrations inside the `database/migrations/tenant` directory for the new tenant.

In a nutshell, the controller has three methods:

- `showRegistrationForm()`: Displays the tenant registration form
- `register()`: Registers a new tenant, which creates a new tenant record and domain
- `registered()`: Displays a success message after registration

This controller will be used to manage tenant registration in our application. Allowing new tenants to register and create their own subdomain and database for their account.

Add routes for tenant registration in `routes/web.php`:

```php
use App\Http\Controllers\TenantController;

Route::get('/register', [TenantController::class, 'showRegistrationForm'])->name('tenant.register');
Route::post('/register', [TenantController::class, 'register']);
Route::get('/registered/{domain}', [TenantController::class, 'registered'])->name('tenant.registered');
```

Create the corresponding views for tenant registration starting by creating the `resources/views/tenant/register.blade.php` file:

```html
<x-guest-layout>
  <form method="POST" action="{{ route('tenant.register') }}">
    @csrf
    <div class="mt-4">
      <x-input-label for="domain" :value="__('Subdomain')" />
      <div class="flex">
        <x-text-input
          id="domain"
          class="mt-1 block w-full"
          type="text"
          name="domain"
          :value="old('domain')"
          required
        />
        <span class="text-gray-600 ml-2 mt-1">.example.com</span>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-end">
      <x-primary-button class="ml-4"> {{ __('Register Tenant') }} </x-primary-button>
    </div>
  </form>
</x-guest-layout>
```

Then create the `resources/views/tenant/registered.blade.php` file to display the success message after registration:

```html
<x-guest-layout>
  <div class="text-gray-600 mb-4 text-sm">
    {{ __('Your tenant has been registered successfully!') }}
  </div>

  <div class="mt-4 flex items-center justify-between">
    <div>
      Your tenant URL:
      <a
        href="https://{{ $domain }}.example.com"
        class="text-gray-600 hover:text-gray-900 text-sm underline"
        target="_blank"
        >https://{{ $domain }}.example.com</a
      >
    </div>
  </div>
</x-guest-layout>
```

This completes the tenant registration process. Tenants can now register and create their own subdomain and database for their account. In a real-world scenario, you would protect the registration routes with authentication middleware to ensure that only authorized admin users can create new tenants.

### Verifying Tenant Registration

To verify that the registration process works, visit `http://laravel-multi-tenant-saas.test/register` and register a new tenant. After registration, you should see the success message with the tenant's domain.

Next go to your Neon dashboard and verify that the new tenant's database has been created:

```sql
SELECT * FROM tenants;
```

You should see the newly created tenant in the `tenants` table. You can also check the `domains` table to verify that the tenant's domain has been added:

```sql
SELECT * FROM domains;
```

And to verify that you actually have a separate database for the new tenant, use the `\l` command in the `psql` console to list all databases or the following SQL query:

```sql
SELECT datname FROM pg_database WHERE datistemplate = false;
```

The tenant's database should be listed in the results and it should be named `tenant{tenant_id}`.

> The tenancy package allows you to configure the database naming convention for tenants. By default, the database name is `tenant{tenant_id}` where `{tenant_id}` is the ID of the tenant. You can also configure the package to use separate schemas instead of separate databases for tenants.

With that done, you've successfully implemented tenant registration in your multi-tenant SaaS application. Next let's implement the tenant onboarding process.

### Implementing Tenant Onboarding

Now that you can register new tenants, let's create an onboarding process.

Each tenant will need to create an account to access their dashboard. The domain will be used to identify the tenant, so we'll use the domain as the tenant's subdomain, e.g., `tenant1.example.com`.

Create a new controller for tenant onboarding:

```bash
php artisan make:controller Tenant/OnboardingController
```

Update the `app/Http/Controllers/Tenant/OnboardingController.php` to handle the onboarding process:

```php
<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class OnboardingController extends Controller
{
    public function show()
    {
        if (User::count() > 0) {
            return redirect()->route('tenant.dashboard');
        }

        return view('tenant.onboarding');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        auth()->login($user);

        return redirect()->route('tenant.dashboard')->with('success', 'Welcome to your new account!');
    }
}
```

Add routes for the onboarding process in `routes/tenant.php` inside the `Route::middleware` group for tenant routes:

```php
use App\Http\Controllers\Tenant\OnboardingController;

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // Existing routes
    // ...

    Route::get('/onboarding', [OnboardingController::class, 'show'])->name('tenant.onboarding');
    Route::post('/onboarding', [OnboardingController::class, 'store'])->name('tenant.onboarding.store');

});
```

Create the onboarding view in `resources/views/tenant/onboarding.blade.php`:

```html
<x-guest-layout>
  <form method="POST" action="{{ route('tenant.onboarding.store') }}">
    @csrf

    <div>
      <x-input-label for="name" :value="__('Name')" />
      <x-text-input
        id="name"
        class="mt-1 block w-full"
        type="text"
        name="name"
        :value="old('name')"
        required
        autofocus
        autocomplete="name"
      />
    </div>

    <div class="mt-4">
      <x-input-label for="email" :value="__('Email')" />
      <x-text-input
        id="email"
        class="mt-1 block w-full"
        type="email"
        name="email"
        :value="old('email')"
        required
        autocomplete="username"
      />
    </div>

    <div class="mt-4">
      <x-input-label for="password" :value="__('Password')" />
      <x-text-input
        id="password"
        class="mt-1 block w-full"
        type="password"
        name="password"
        required
        autocomplete="new-password"
      />
    </div>

    <div class="mt-4">
      <x-input-label for="password_confirmation" :value="__('Confirm Password')" />
      <x-text-input
        id="password_confirmation"
        class="mt-1 block w-full"
        type="password"
        name="password_confirmation"
        required
        autocomplete="new-password"
      />
    </div>

    <div class="mt-4 flex items-center justify-end">
      <x-primary-button class="ml-4"> {{ __('Complete Setup') }} </x-primary-button>
    </div>
  </form>
</x-guest-layout>
```

For simplicity, we're extending the Breeze guest layout for the onboarding form. But you can customize the layout to match your application's design and even have different layouts for the onboarding process based on each tenant's requirements.

To test the onboarding process, visit `http://tenant1.example.com/onboarding` and complete the onboarding form. After submitting the form, you should be redirected to the tenant dashboard which we'll implement next.

### Implementing Tenant Dashboard

Create a new controller for the tenant dashboard:

```bash
php artisan make:controller Tenant/DashboardController
```

Update the `app/Http/Controllers/Tenant/DashboardController.php` to display the tenant dashboard:

```php
<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return view('tenant.dashboard');
    }
}
```

Create the dashboard view in `resources/views/tenant/dashboard.blade.php`:

```html
<x-app-layout>
  <x-slot name="header">
    <h2 class="text-gray-800 text-xl font-semibold leading-tight">{{ __('Dashboard') }}</h2>
  </x-slot>

  <div class="py-12">
    <div class="mx-auto max-w-7xl lg:px-8 sm:px-6">
      <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div class="text-gray-900 p-6">{{ __("You're logged in!") }}</div>
      </div>
    </div>
  </div>
</x-app-layout>
```

Add a route for the tenant dashboard in `routes/tenant.php` inside the `Route::middleware` group for tenant routes:

```php
use App\Http\Controllers\Tenant\DashboardController;

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // Existing routes
    // ...
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('tenant.dashboard');

});
```

To test the tenant dashboard, visit `http://tenant1.example.com/dashboard` after completing the onboarding process. You should see the dashboard view with a welcome message.

You can also check the `users` table in the tenant's database to verify that the user account created during onboarding has been added:

```sql
SELECT * FROM users;
```

This will show you the user account created during the onboarding process for that specific tenant in the tenant's database rather than the central database.

## Conclusion

In this tutorial, we've built a simple multi-tenant application using Laravel and Neon. We've covered:

1. Setting up the project and implementing multi-tenancy
2. Creating a tenant registration process
3. Implementing tenant onboarding
4. Adding a tenant dashboard for individual tenants

This implementation provides a foundation for building more complex SaaS applications with Laravel and Neon. You can further expand on this system by:

- Adding more features to the tenant dashboard
- Implementing billing and subscription management
- Enhancing security with two-factor authentication
- Adding more tenant-specific customizations

Using the `stancl/tenancy` package along with Neon, each tenant will have its own database. Thanks to Neon's autoscaling feature, you can easily scale your application as you onboard more tenants.

There are other packages and tools available to help you build multi-tenant applications with Laravel. You can explore these options based on your requirements and choose the one that best fits your needs. Some of the popular packages include:

- [spatie/laravel-multitenancy](https://spatie.be/docs/laravel-multitenancy/v3/introduction)
- [tenancy/tenancy](https://github.com/tenancy/tenancy)

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [stancl/tenancy Documentation](https://tenancyforlaravel.com/)
- [Neon Documentation](https://neon.tech/docs/)
