---
title: Building a Simple Real-Time Search with Laravel, Livewire, and Neon
subtitle: Learn how to integrate Laravel with Postgres on Neon, using Laravel's Eloquent ORM and migrations for efficient database management.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-06-29T00:00:00.000Z'
updatedOn: '2024-06-29T00:00:00.000Z'
---

Laravel is a powerful PHP framework known for its elegant syntax and feature-rich ecosystem. Livewire, a full-stack framework for Laravel, allows us to build dynamic interfaces with minimal JavaScript. Together, they provide a robust foundation for creating interactive web applications.

In this guide, we'll build a simple real-time search feature using Laravel, Livewire, and Neon. We'll set up a Laravel project, create a database schema, implement the search functionality with Livewire, and optimize performance with Neon. By the end of this tutorial, you'll have a working real-time search feature that leverages the strengths of Laravel, Livewire, and Neon.

## Prerequisites

Before we begin, you will need to have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine for managing front-end assets
- A [Neon](https://console.neon.tech/signup) account
- Basic knowledge of Laravel, Livewire, and Tailwind CSS

## Setting up the Project

Before we dive into building the search functionality, let's set up a new Laravel project and configure the necessary components.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel real-time-search
cd real-time-search
```

This command will create a new Laravel project in a directory named `real-time-search`. Navigate to the project directory to continue with the setup.

### Installing and Configuring Livewire

Now that we have a Laravel project, let's install Livewire:

```bash
composer require livewire/livewire
```

Livewire will automatically register its service provider.

### Setting up Tailwind CSS

To use Tailwind CSS, we need to install and configure it as well.

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```

Update your `tailwind.config.js` file to include Laravel and Livewire specific paths:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.blade.php', './resources/**/*.js', './resources/**/*.vue'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

The above configuration tells Tailwind to scan the specified files in the `resources` directory for classes to include in the compiled CSS.

This approach ensures that Tailwind's utility classes are available in your Laravel views and Livewire components and keeps your CSS bundle size minimal.

Next, add the `@tailwind` directives to your `resources/css/app.css` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Finally, run the following command to compile your assets with Vite:

```bash
npm run dev
```

Leave the Vite development server running in the background to compile your assets and proceed with the next steps.

### Connecting to Neon Database

To connect your Laravel application to your Neon database, update your `.env` file with the Neon database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Make sure to replace the placeholders with your actual Neon database details.

## Building the Search Functionality

Now that our project is set up, let's build the search functionality. We'll create a simple product search feature that filters products based on their name and description.

### Creating the Database Schema

We'll create a simple `products` table for this example. Run the following command to create a migration:

```bash
php artisan make:model Product -m
```

Open the newly created migration file in `database/migrations` and update the `up` method to include the necessary columns:

```php
public function up()
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description');
        $table->decimal('price', 8, 2);
        $table->timestamps();
    });
}
```

For the sake of simplicity, we've included the `name`, `description`, and `price` columns in our `products` table.

Run the migration to create the `products` table in your database:

```bash
php artisan migrate
```

### Seeding Sample Data

Laravel provides a convenient way to seed your database with sample data. Let's create some sample data. Create a new seeder:

```bash
php artisan make:seeder ProductSeeder
```

Open `database/seeders/ProductSeeder.php` and add the following:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Laptop', 'description' => 'High-performance laptop', 'price' => 999.99],
            ['name' => 'Smartphone', 'description' => 'Latest model smartphone', 'price' => 699.99],
            ['name' => 'Headphones', 'description' => 'Noise-cancelling headphones', 'price' => 199.99],
            ['name' => 'Smartwatch', 'description' => 'Fitness tracking smartwatch', 'price' => 249.99],
            ['name' => 'Tablet', 'description' => '10-inch tablet', 'price' => 399.99],
            ['name' => 'Desktop', 'description' => 'High-performance desktop', 'price' => 1499.99],
            ['name' => 'Monitor', 'description' => '27-inch 4K monitor', 'price' => 499.99],
            ['name' => 'Keyboard', 'description' => 'Mechanical gaming keyboard', 'price' => 149.99],
            ['name' => 'Mouse', 'description' => 'Wireless mouse', 'price' => 49.99],
            ['name' => 'Printer', 'description' => 'Wireless all-in-one printer', 'price' => 199.99],
            ['name' => 'Scanner', 'description' => 'High-speed document scanner', 'price' => 299.99],
            ['name' => 'Projector', 'description' => '1080p home theater projector', 'price' => 799.99],
            ['name' => 'Camera', 'description' => 'Mirrorless camera', 'price' => 999.99],
            ['name' => 'Drone', 'description' => '4K camera drone', 'price' => 1199.99],
            ['name' => 'Gaming Console', 'description' => 'Next-gen gaming console', 'price' => 499.99],
            ['name' => 'VR Headset', 'description' => 'Wireless VR headset', 'price' => 299.99],
            ['name' => 'External Hard Drive', 'description' => '2TB external hard drive', 'price' => 99.99],
            ['name' => 'USB Flash Drive', 'description' => '128GB USB flash drive', 'price' => 29.99],
            ['name' => 'Wireless Router', 'description' => 'Dual-band wireless router', 'price' => 99.99],
            ['name' => 'Smart Speaker', 'description' => 'Voice-controlled smart speaker', 'price' => 79.99],
        ];

        foreach ($products as $product) {
            \App\Models\Product::create($product);
        }
    }
}

```

Update `database/seeders/DatabaseSeeder.php` to include the `ProductSeeder` class by adding it to the `run` method:

```php
public function run()
{
    $this->call([
        ProductSeeder::class,
    ]);
}
```

Run the seeder to populate the `products` table with sample data:

```bash
php artisan db:seed
```

This command will insert the sample products into the `products` table so we can test our search functionality. Note that the `db:seed` command will run all seeders by default, and if you run it multiple times, it will insert duplicate records.

### Implementing the Livewire Component

Next, let's create a Livewire component for our search functionality. Run the following command to generate a new Livewire component:

```bash
php artisan make:livewire ProductSearch
```

This command creates two files:

- `app/Livewire/ProductSearch.php`: The Livewire component class, which contains the search logic.
- `resources/views/livewire/product-search.blade.php`: The view file for the Livewire component.

Open `app/Livewire/ProductSearch.php` and update it with the following code which fetches products based on the search query:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Product;

class ProductSearch extends Component
{
    public $search = '';

    public function render()
    {
        $products = Product::where('name', 'like', '%' . $this->search . '%')
                           ->orWhere('description', 'like', '%' . $this->search . '%')
                           ->get();

        return view('livewire.product-search', [
            'products' => $products
        ]);
    }
}
```

Rundown of the code above:

- We start by defining a `$search` property that will be bound to the search input, and a `render` method that fetches products based on the search query.
- The `render` method queries the `products` table for records that match the search query in the `name` or `description` columns.
- We're using a simple `ILIKE` query to perform a case-insensitive search. You can customize the search logic based on your requirements.
- Next we get all matching products using the `get` method and pass them to the view. Alternatively, you can paginate the results for better performance using Laravel's `paginate` method.
- The `render` method returns the view `livewire.product-search` along with the `$products` variable.

Once you've updated the component class, let's create the view for this component. Open `resources/views/livewire/product-search.blade.php` and add the following content:

```html
<div>
  <div class="mb-4">
    <input
      wire:model.live.debounce.300ms="search"
      type="text"
      placeholder="Search products..."
      class="focus:ring-blue-500 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2"
    />
  </div>

  <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
    @forelse($products as $product)
    <div
      class="transform rounded-lg bg-white p-4 shadow transition duration-300 ease-in-out hover:scale-105"
    >
      <h3 class="text-lg font-semibold">{{ $product->name }}</h3>
      <p class="text-gray-600">{{ $product->description }}</p>
      <p class="text-blue-600 mt-2 font-bold">${{ number_format($product->price, 2) }}</p>
    </div>
    @empty
    <div class="rounded-lg bg-white p-4 text-center shadow">No products found.</div>
    @endforelse
  </div>
</div>
```

This view includes an input field for the search query and a grid to display the search results.

The `wire:model.live.debounce.300ms` attribute on the input field binds it to the `$search` property in our Livewire component, with a300ms debounce to reduce the number of database queries triggered by user input changes.

Using the `@forelse` directive, we loop through the `$products` collection and display each product's name, description, and price. If no products match the search query, we display a message indicating that no products were found.

### Updating the Layout

To use our new component, let's update the main layout. Open `resources/views/welcome.blade.php` and replace its content with:

```html
<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Real-Time Search</title>
    @vite('resources/css/app.css') @livewireStyles
  </head>
  <body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="mb-8 text-center text-3xl font-bold">Real-Time Product Search</h1>
      @livewire('product-search')
    </div>

    @livewireScripts @vite('resources/js/app.js')
  </body>
</html>
```

This layout includes the necessary Livewire scripts and styles, as well as our `ProductSearch` component.

After updating the layout, make sure that your Vite development server is still running to compile the assets.

```bash
npm run dev
```

## Optimizing Search Performance with Neon

To optimize our search performance, we can leverage Neon's indexing capabilities.

Indexing the `name` and `description` columns will speed up search queries by allowing the database to quickly locate matching records.

Let's create an index on the `name` and `description` columns of our `products` table.

Create a new migration:

```bash
php artisan make:migration add_index_to_products_table
```

Open the new migration file and update the `up` and `down` methods to add and remove the index from the `products` table respectively:

```php
public function up()
{
    Schema::table('products', function (Blueprint $table) {
        $table->index(['name', 'description']);
    });
}

public function down()
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropIndex(['name', 'description']);
    });
}
```

Run the migration:

```bash
php artisan migrate
```

This index will significantly improve the performance of our search queries, especially as the number of products grows.

## Testing the Search Functionality

To ensure our search functionality works as expected, let's write a simple test. Run the following command to create a test file:

```bash
php artisan make:test ProductSearchTest
```

Open the newly created test file in `tests/Feature/ProductSearchTest.php` and add the following test:

```php
<?php

namespace Tests\Feature;

use App\Livewire\ProductSearch;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ProductSearchTest extends TestCase
{
    // use RefreshDatabase;

    /** @test */
    public function it_can_search_products()
    {
        // If using RefreshDatabase trait, make sure to seed the database

        Livewire::test(ProductSearch::class)
            ->set('search', 'Laptop')
            ->assertSee('Laptop')
            ->assertDontSee('Phone');
    }
}
```

This test creates two products and then checks if the search functionality correctly filters the results.

> Make sure to only use the `RefreshDatabase` trait when running tests to avoid modifying your production database during testing.

Run the test with:

```bash
php artisan test
```

To learn more about testing in Laravel along with Neon branding, check out the [Testing Laravel Applications with Neon's Database Branching](https://neon.tech/guides/laravel-test-on-branch).

## Conclusion

In this tutorial, we've built a real-time search feature using Laravel, Livewire, and Neon. We've leveraged Livewire's real-time capabilities to create a responsive search component, and utilized Neon's high-performance database to ensure quick and efficient queries.

This implementation provides a solid foundation for a search feature, but there are always ways to enhance and expand its functionality:

- Implement pagination for large result sets
- Add filters for more refined searches
- Incorporate full-text search capabilities for more accurate results
- Implement caching to further improve performance
- Use [Laravel Scout](https://laravel.com/docs/11.x/scout) for full-text search capabilities

By combining the power of Laravel, the simplicity of Livewire, and the performance of Neon, it's easy to create dynamic and responsive web applications that meet your users' needs.

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Livewire Documentation](https://laravel-livewire.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Neon Documentation](/docs)

Remember to always refer to the official documentation for the most up-to-date information and best practices.
