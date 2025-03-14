---
title: Building a Blog with Laravel, Livewire, and Laravel Breeze
subtitle: Learn how to create a dynamic blog application using Laravel, Livewire, and Laravel Breeze for authentication and Neon.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-06-30T00:00:00.000Z'
updatedOn: '2024-06-30T00:00:00.000Z'
---

Laravel is a powerful PHP framework that makes it easy to build web applications. When combined with Livewire, a full-stack framework for Laravel, you can create dynamic, reactive interfaces with minimal JavaScript. In this guide, we'll build a blog application using Laravel and Livewire, and we'll use Laravel Breeze to handle authentication, along with Neon Postgres.

By the end of this tutorial, you'll have a fully functional blog where users can create, read, update, and delete posts. We'll also implement comments and a simple tagging system.

## Prerequisites

Before we start, make sure you have the following:

- PHP 8.1 or higher installed on your system
- [Composer](https://getcomposer.org/) for managing PHP dependencies
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) for managing front-end assets
- A [Neon](https://console.neon.tech/signup) account for database hosting
- Basic knowledge of Laravel, Livewire, and Tailwind CSS

## Setting up the Project

Let's start by creating a new Laravel project and setting up the necessary components. We'll use Laravel Breeze for authentication, Livewire for building interactive components, and Tailwind CSS for styling.

### Creating a New Laravel Project

Open your terminal and run the following command to create a new Laravel project:

```bash
composer create-project laravel/laravel laravel-livewire-blog
cd laravel-livewire-blog
```

This command creates a new Laravel project in a directory named `laravel-livewire-blog` and installs all the necessary dependencies.

### Installing Laravel Breeze

[Laravel Breeze](https://laravel.com/docs/11.x/starter-kits) provides a minimal and simple starting point for building a Laravel application with authentication.

An alternative to Laravel Breeze is Laravel Jetstream, which provides more features out of the box, such as team management and two-factor authentication. However, for this tutorial, we'll use Laravel Breeze for its simplicity.

Let's install Laravel Breeze with the Blade views:

```bash
composer require laravel/breeze --dev
php artisan breeze:install blade
```

This command installs Breeze and sets up the necessary views and routes for authentication.

While in the terminal, also install the Livewire package:

```bash
composer require livewire/livewire
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

Make sure to replace `your-neon-hostname`, `your_database_name`, `your_username`, and `your_password` with your actual database details and save the file.

### Compiling Assets

Laravel Breeze uses Tailwind CSS for styling, so we need to compile the assets to generate the CSS file.

To compile the assets, run:

```bash
npm install
npm run dev
```

Keep the Vite development server running in the background as you continue with the next steps. This will automatically compile the assets when changes are made so you can see the updates in real-time.

## Creating the Blog Structure

Now that we have our basic setup, we are ready to create the structure for our blog, including models, migrations, and Livewire components, routes, policies, and views.

### Creating the Post Model and Migration

Models in Laravel are used to interact with the database using the Eloquent ORM. We'll create models for posts, comments, and tags, along with their respective migrations.

Run the following command to create a `Post` model with its migration:

```bash
php artisan make:model Post -m
```

Open the migration file in `database/migrations` and update it:

```php
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->string('slug')->unique();
        $table->text('content');
        $table->boolean('is_published')->default(false);
        $table->timestamp('published_at')->nullable();
        $table->timestamps();
    });
}
```

This migration creates a `posts` table with columns for the post title, content, publication status, and publication date. It also includes a foreign key to the `users` table for the post author. The `slug` column will be used to generate SEO-friendly URLs.

### Creating the Comment Model and Migration

Now, let's create a `Comment` model and its migration:

```bash
php artisan make:model Comment -m
```

The `comments` table will store the comments for each post, along with the user who made the comment, the post ID, and the comment content.

With that in mind, let's update the migration file:

```php
public function up()
{
    Schema::create('comments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('post_id')->constrained()->onDelete('cascade');
        $table->text('content');
        $table->timestamps();
    });
}
```

### Creating the Tag Model and Migration

To take this a step further, we can add a tagging system to our blog. This will allow us to categorize posts based on different topics.

```bash
php artisan make:model Tag -m
```

The `tags` table will store the tags that can be associated with posts. Update the migration file as follows:

```php
public function up()
{
    Schema::create('tags', function (Blueprint $table) {
        $table->id();
        $table->string('name')->unique();
        $table->timestamps();
    });
```

We'll also create a pivot table to manage the many-to-many relationship between posts and tags. The convention for naming this table is to combine the singular form of the related models in alphabetical order. In this case, the models are `Post` and `Tag`, so the pivot table will be named `post_tag`.

```bash
php artisan make:migration create_post_tag_table
```

Update the migration file as follows:

```php
    Schema::create('post_tag', function (Blueprint $table) {
        $table->id();
        $table->foreignId('post_id')->constrained()->onDelete('cascade');
        $table->foreignId('tag_id')->constrained()->onDelete('cascade');
        $table->unique(['post_id', 'tag_id']);
    });
}
```

We don't need to create a model for the pivot table, as it will be managed by Laravel's Eloquent ORM.

Now, run the migrations to create all the tables in the Neon database:

```bash
php artisan migrate
```

This command will create the `posts`, `comments`, `tags`, and `post_tag` tables in your database and keep track of the migrations that have been run. If you need to rollback the migrations, you can run `php artisan migrate:rollback` or if you were to add a new migration, you can run `php artisan migrate` and it will only run the new migrations.

### Updating the Models

Let's update our models to define the relationships. What we want to achieve is:

- A post **belongs** to a user
- A post **has many** comments
- A post can **have many** tags
- A comment **belongs to** a user
- A comment **belongs to** a post
- A tag can be associated with **many** posts

We already have that structure in our database, but we need to define these relationships in our models so we can access them easily in our application.

In `app/Models/Post.php` we define the relationships to the `User`, `Comment`, and `Tag` models:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'content', 'is_published', 'published_at'];

    public function user()
    {
        // Using the `belongsTo` relationship to get the user who created the post
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        // Using the `hasMany` relationship to get all comments for a post
        return $this->hasMany(Comment::class);
    }

    public function tags()
    {
        // Using the `belongsToMany` relationship to get all tags associated with a post
        return $this->belongsToMany(Tag::class);
    }
}
```

In `app/Models/Comment.php` we define the relationships to the `User` and `Post` models so we can get the user and post associated with a comment:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
```

In `app/Models/Tag.php` we define the relationship to the `Post` model, this will allow us to get all posts associated with a tag:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function posts()
    {
        return $this->belongsToMany(Post::class);
    }
}
```

Finally, update `app/Models/User.php` to include the relationship with posts and comments, where a user can have many posts and many comments:

```php
public function posts()
{
    return $this->hasMany(Post::class);
}

public function comments()
{
    return $this->hasMany(Comment::class);
}
```

With these relationships defined, we can now easily access the related models and data using Eloquent.

### Seeding the Database

To populate the database with some sample data, let's create seeders for `Tag` models so we can associate tags with posts.

Create a seeder for the `Tag` model:

```bash
php artisan make:seeder TagSeeder
```

Update the seeder file in `database/seeders/TagSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run()
    {
        $tags = [
            'Postgres',
            'Neon',
            'Web Development',
            'Laravel',
            'PHP',
            'JavaScript',
            'Database',
            'Design',
            'UI/UX',
            'AI',
            'Machine Learning',
            'Cloud Computing',
            'DevOps',
            'Security',
        ];

        foreach ($tags as $tagName) {
            Tag::create(['name' => $tagName]);
        }
    }
}
```

Now, update the main `DatabaseSeeder` in `database/seeders/DatabaseSeeder.php` to include these new seeder:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            TagSeeder::class,
        ]);
    }
}
```

Finally, to seed your database with this sample data, run:

```bash
php artisan db:seed
```

This command will run the `TagSeeder` and populate the `tags` table with the sample tags which we can associate with posts later on when users create new posts.

## Implementing the Blog Functionality

Now that we have our models and migrations set up, we can go ahead and implement the blog functionality using Livewire components.

We will start by creating two Livewire components:

- `PostList` to display a list of blog posts
- `PostForm` to create and edit posts

### Creating the Post List Component

First, let's create a Livewire component to display the list of blog posts:

```bash
php artisan make:livewire PostList
```

This command creates a new Livewire component in the `app/Livewire` directory, along with a view file in `resources/views/livewire`.

Update `app/Livewire/PostList.php` to fetch the posts and handle search functionality:

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;
use Livewire\WithPagination;

class PostList extends Component
{
    use WithPagination;

    public $search = '';

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function render()
    {
        $posts = Post::where('is_published', true)
            ->where(function ($query) {
                $query->where('title', 'ilike', '%' . $this->search . '%')
                    ->orWhere('content', 'ilike', '%' . $this->search . '%');
            })
            ->with('user', 'tags')
            ->latest('published_at')
            ->paginate(10);

        return view('livewire.post-list', [
            'posts' => $posts,
        ]);
    }
}
```

In the `render` method, we fetch the posts that are published and match the search query.

An important thing to note here is that we also eager load the `user` and `tags` relationships to avoid additional queries when accessing these relationships in the view.

To learn more about how to implement search functionality in Livewire, check out the [Building a Simple Real-Time Search with Laravel, Livewire, and Neon guide](/guides/laravel-livewire-simple-search).

Now, update the view in `resources/views/livewire/post-list.blade.php` to display the list of posts:

```html
<div>
  <div class="mb-4">
    <input
      wire:model.live.debounce.300ms="search"
      type="text"
      placeholder="Search posts..."
      class="focus:ring-blue-500 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2"
    />
  </div>

  <div class="space-y-4">
    @foreach($posts as $post)
    <div class="rounded-lg bg-white p-6 shadow-md">
      <h2 class="mb-2 text-2xl font-bold">
        <a href="{{ route('posts.show', $post) }}" class="text-blue-600 hover:text-blue-800"
          >{{ $post->title }}</a
        >
      </h2>
      <p class="text-gray-600 mb-2">By {{ $post->user->name }} on {{ $post->published_at }}</p>
      <p class="text-gray-700 mb-4">{{ Str::limit($post->content, 200) }}</p>
      <div class="flex flex-wrap gap-2">
        @foreach($post->tags as $tag)
        <span class="bg-blue-100 text-blue-800 rounded px-2.5 py-0.5 text-xs font-semibold"
          >{{ $tag->name }}</span
        >
        @endforeach
      </div>
    </div>
    @endforeach
  </div>

  <div class="mt-4">{{ $posts->links() }}</div>
</div>
```

This view displays the list of posts along with the post title, author, publication date, content, and tags. It also includes a search input field to filter the posts based on the search query.

### Creating the Post Form Component

Now, let's create a Livewire component for creating and editing posts.

```bash
php artisan make:livewire PostForm
```

Update `app/Livewire/PostForm.php` to handle post creation and editing:

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Support\Str;
use Livewire\Component;

class PostForm extends Component
{
    public $post;
    public $title;
    public $content;
    public $tags;
    public $selectedTags = [];

    protected $rules = [
        'title' => 'required|min:5',
        'content' => 'required|min:10',
        'selectedTags' => 'array',
    ];

    public function mount($post = null)
    {
        if ($post) {
            $this->post = $post;
            $this->title = $post->title;
            $this->content = $post->content;
            $this->selectedTags = $post->tags->pluck('id')->toArray();
        }
    }

    public function save()
    {
        $this->validate();

        $isNew = !$this->post;

        if ($isNew) {
            $this->post = new Post();
            $this->post->user_id = auth()->id();
        }

        $this->post->title = $this->title;
        $this->post->slug = Str::slug($this->title);
        $this->post->content = $this->content;
        $this->post->is_published = true;
        $this->post->published_at = now();
        $this->post->save();

        $this->post->tags()->sync($this->selectedTags);

        session()->flash('message', $isNew ? 'Post created successfully.' : 'Post updated successfully.');

        return redirect()->route('posts.show', $this->post);
    }

    public function render()
    {
        $allTags = Tag::all();
        return view('livewire.post-form', [
            'allTags' => $allTags,
        ]);
    }
}
```

Rundown of the methods in the `PostForm` component:

- The `mount` method is used to set the initial values for the form fields when editing a post. The post data is passed to the component as a parameter.
- The `save` method is called when the form is submitted. It validates the form fields, creates a new post or updates an existing one, and redirects to the post detail page.
- The `render` method fetches all tags from the database and passes them to the view.
- In the `rules` property, we define the validation rules for the form fields.

After that, update the `resources/views/livewire/post-form.blade.php` view to display the post form:

```html
<div>
  <form wire:submit.prevent="save">
    <div class="mb-4">
      <label for="title" class="text-gray-700 mb-2 block font-bold">Title</label>
      <input
        wire:model="title"
        type="text"
        id="title"
        class="text-gray-700 w-full rounded-lg border px-3 py-2 focus:outline-none"
        required
      />
      @error('title') <span class="text-red-500">{{ $message }}</span> @enderror
    </div>

    <div class="mb-4">
      <label for="content" class="text-gray-700 mb-2 block font-bold">Content</label>
      <textarea
        wire:model="content"
        id="content"
        rows="6"
        class="text-gray-700 w-full rounded-lg border px-3 py-2 focus:outline-none"
        required
      ></textarea>
      @error('content') <span class="text-red-500">{{ $message }}</span> @enderror
    </div>

    <div class="mb-4">
      <label class="text-gray-700 mb-2 block font-bold">Tags</label>
      <div class="flex flex-wrap gap-2">
        @foreach($allTags as $tag)
        <label class="inline-flex items-center">
          <input
            type="checkbox"
            wire:model="selectedTags"
            value="{{ $tag->id }}"
            class="form-checkbox text-blue-600 h-5 w-5"
          />
          <span class="text-gray-700 ml-2">{{ $tag->name }}</span>
        </label>
        @endforeach
      </div>
    </div>

    <div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 rounded px-4 py-2 font-bold text-white"
      >
        {{ $post ? 'Update Post' : 'Create Post' }}
      </button>
    </div>
  </form>
</div>
```

This view includes form fields for the post title, content, and tags. The tags are displayed as checkboxes, allowing the user to select multiple tags for the post when creating or editing it.

### Creating Routes and Controllers

Now that we have our Livewire components ready, let's create the necessary routes and controllers to handle the blog functionality.

Routes are defined in the `routes/web.php` file, and controllers are used to handle the logic for each route.

```php
<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // After the existing Breeze routes add the following routes:
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
});

// Outside the middleware group, add a route to display posts publicly:
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
```

Next, create a controller which will handle the blog functionality for the above routes that we just defined:

```bash
php artisan make:controller PostController
```

The above command creates a new controller in the `app/Http/Controllers` directory.

Update `app/Http/Controllers/PostController.php` to include the necessary methods:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Gate;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return view('posts.index');
    }

    public function show(Post $post)
    {
        return view('posts.show', compact('post'));
    }

    public function create()
    {
        return view('posts.create');
    }

    public function edit(Post $post)
    {
        if (Gate::denies('update', $post)) {
            abort(403);
        }
        return view('posts.edit', compact('post'));
    }
}
```

For all the methods, we return the corresponding views. The `edit` method also includes an authorization gate to check if the current user is authorized to edit the post which we will define later.

### Creating the Views

With the routes and controllers in place, let's create the views for the blog functionality. The views will include the layout, navigation, and content for the blog posts.

Let's start by creating a `resources/views/posts/index.blade.php` view to display the list of blog posts:

```html
<x-app-layout>
  <x-slot name="header">
    <h2 class="text-gray-800 text-xl font-semibold leading-tight">{{ __('Blog Posts') }}</h2>
  </x-slot>

  <div class="py-12">
    <div class="mx-auto max-w-7xl lg:px-8 sm:px-6">
      <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div class="border-gray-200 border-b bg-white p-6">@livewire('post-list')</div>
      </div>
    </div>
  </div>
</x-app-layout>
```

This view includes the `PostList` Livewire component to display the list of blog posts.

Next, create the `resources/views/posts/show.blade.php` view to display a single blog post:

```html
<x-app-layout>
  <x-slot name="header">
    <h2 class="text-gray-800 text-xl font-semibold leading-tight">{{ $post->title }}</h2>
  </x-slot>

  <div class="py-12">
    <div class="mx-auto max-w-7xl lg:px-8 sm:px-6">
      <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div class="border-gray-200 border-b bg-white p-6">
          <h1 class="mb-4 text-3xl font-bold">{{ $post->title }}</h1>
          <p class="text-gray-600 mb-4">By {{ $post->user->name }} on {{ $post->published_at }}</p>
          <div class="prose mb-6 max-w-none">{!! nl2br(e($post->content)) !!}</div>
          <div class="mb-6 flex flex-wrap gap-2">
            @foreach($post->tags as $tag)
            <span class="bg-blue-100 text-blue-800 rounded px-2.5 py-0.5 text-xs font-semibold"
              >{{ $tag->name }}</span
            >
            @endforeach
          </div>
          @can('update', $post)
          <a
            href="{{ route('posts.edit', $post) }}"
            class="bg-blue-500 hover:bg-blue-700 rounded px-4 py-2 font-bold text-white"
            >Edit Post</a
          >
          @endcan
        </div>
      </div>
    </div>
  </div>
</x-app-layout>
```

This view displays the post title, author, publication date, content, and tags. It also includes a link to edit the post if the current user is authorized to do so.

After that, create the `resources/views/posts/create.blade.php` and `resources/views/posts/edit.blade.php` views for creating and editing posts, respectively. These views will include the `PostForm` Livewire component, which we created earlier, and handle the form submission.

Create the `resources/views/posts/create.blade.php` view with the following content:

```html
<x-app-layout>
  <x-slot name="header">
    <h2 class="text-gray-800 text-xl font-semibold leading-tight">{{ __('Create New Post') }}</h2>
  </x-slot>

  <div class="py-12">
    <div class="mx-auto max-w-7xl lg:px-8 sm:px-6">
      <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div class="border-gray-200 border-b bg-white p-6">@livewire('post-form')</div>
      </div>
    </div>
  </div>
</x-app-layout>
```

Using the `@livewire` directive, we include the `PostForm` component to create a new post.

With the same structure, create the `resources/views/posts/edit.blade.php` view:

```html
<x-app-layout>
  <x-slot name="header">
    <h2 class="text-gray-800 text-xl font-semibold leading-tight">{{ __('Edit Post') }}</h2>
  </x-slot>

  <div class="py-12">
    <div class="mx-auto max-w-7xl lg:px-8 sm:px-6">
      <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div class="border-gray-200 border-b bg-white p-6">
          @livewire('post-form', ['post' => $post])
        </div>
      </div>
    </div>
  </div>
</x-app-layout>
```

This view includes the `PostForm` component with the post data passed as a parameter to edit the post. The form fields will be pre-filled with the existing post data when users edit one of their posts.

### Adding Authorization

As this will be a multi-user blog, we need to implement authorization to ensure that users can only edit their own posts. Our goal is to allow users to edit posts only if they are the authors of those posts.

Laravel provides a simple way to define authorization policies using policies and gates. Policies are classes that define the authorization logic for a particular model, while gates are more general-purpose authorization checks.

Let's create a policy for the `Post` model:

```bash
php artisan make:policy PostPolicy --model=Post
```

Update `app/Policies/PostPolicy.php` to define the authorization logic for updating and deleting posts:

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    public function update(User $user, Post $post)
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post)
    {
        return $user->id === $post->user_id;
    }
}
```

In the `PostPolicy` class, we define the `update` and `delete` methods to check if the current user is the author of the post. If the user is the author, the method returns `true`, allowing the user to update or delete the post. Otherwise, it returns `false` to deny access and prevent unauthorized actions.

### Implementing Comments

By now we have the basic functionality of our blog in place. If you were to visit the blog, you would see a list of posts, be able to view individual posts, and create new posts. However, a blog wouldn't be complete without the ability to add comments to posts!

Let's add the comment system to our blog posts! First, create a new Livewire component:

```bash
php artisan make:livewire CommentSection
```

Update `app/Livewire/CommentSection.php` to handle adding comments to a post:

```php
<?php

namespace App\Livewire;

use App\Models\Comment;
use Livewire\Component;

class CommentSection extends Component
{
    public $post;
    public $newComment;

    protected $rules = [
        'newComment' => 'required|min:3',
    ];

    public function mount($post)
    {
        $this->post = $post;
    }

    public function addComment()
    {
        $this->validate();

        $this->post->comments()->create([
            'user_id' => auth()->id(),
            'content' => $this->newComment,
        ]);

        $this->newComment = '';
        $this->post = $this->post->fresh(['comments.user']);
    }

    public function deleteComment($commentId)
    {
        $comment = Comment::find($commentId);

        if ($comment->user_id === auth()->id()) {
            $comment->delete();
            $this->post = $this->post->fresh(['comments.user']);
        }
    }

    public function render()
    {
        return view('livewire.comment-section');
    }
}
```

Here, we have the `CommentSection` Livewire component with methods to add and delete comments. The `addComment` method creates a new comment for the post, while the `deleteComment` method deletes a comment if the current user is the author of the comment. You can also see the `rules` property defining the validation rules for the comment content and create a policy for the `Comment` model to handle authorization instead of checking it in the component itself.

Next, update the view in `resources/views/livewire/comment-section.blade.php` to display comments and allow users to add new comments:

```html
<div>
  <h3 class="mb-4 text-2xl font-bold">Comments</h3>

  @foreach($post->comments as $comment)
  <div class="bg-gray-100 mb-4 rounded-lg p-4">
    <p class="text-gray-800">{{ $comment->content }}</p>
    <p class="text-gray-600 mt-2 text-sm">
      By {{ $comment->user->name }} on {{ $comment->created_at }} @if($comment->user_id ===
      auth()->id()) |
      <button wire:click="deleteComment({{ $comment->id }})" class="text-red-500 hover:underline">
        Delete
      </button>
      @endif
    </p>
  </div>
  @endforeach @auth
  <form wire:submit.prevent="addComment" class="mt-6">
    <div class="mb-4">
      <label for="newComment" class="text-gray-700 mb-2 block font-bold">Add a comment</label>
      <textarea
        wire:model="newComment"
        id="newComment"
        rows="3"
        class="text-gray-700 w-full rounded-lg border px-3 py-2 focus:outline-none"
        required
      ></textarea>
      @error('newComment') <span class="text-red-500">{{ $message }}</span> @enderror
    </div>
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-700 rounded px-4 py-2 font-bold text-white"
    >
      Post Comment
    </button>
  </form>
  @else
  <p class="text-gray-600 mt-6">
    Please <a href="{{ route('login') }}" class="text-blue-500 hover:underline">log in</a> to leave
    a comment.
  </p>
  @endauth
</div>
```

After that, go back to the `resources/views/posts/show.blade.php` view and update it to include the comment section:

```html
<!-- Add this after the post content -->
<div class="mt-8">@livewire('comment-section', ['post' => $post])</div>
```

### Adding Navigation Links

Laravel Breeze provides a simple layout with a navigation menu that includes links for logging in and registering. Let's add links for creating new posts and logging out.

Update the existing `resources/views/layouts/navigation.blade.php` view to include links for creating new posts:

```html
<!-- Add this inside the navigation menu -->
<x-nav-link :href="route('posts.create')" :active="request()->routeIs('posts.create')">
  {{ __('Create Post') }}
</x-nav-link>
<x-nav-link :href="route('posts.index')" :active="request()->routeIs('posts.index')">
  {{ __('Blog') }}
</x-nav-link>
```

## Testing

To ensure our blog functionality works as expected, it's important to test the application.

To learn more about testing in Laravel along Neon, check out the [Testing Laravel Applications with Neon's Database Branching guide](/guides/laravel-test-on-branch).

## Conclusion

In this tutorial, we've built a fully functional blog application using Laravel, Livewire, and Laravel Breeze. We've implemented features such as user authentication, creating and editing blog posts, adding comments, and basic authorization.

This implementation provides a solid foundation for a blog, but there are always ways to improve and expand its functionality:

- Implement a more advanced authorization system with roles and permissions
- Add a rich text editor for post content
- Implement a more robust tagging system with the ability to create new tags
- Add a search functionality for posts
- Implement social sharing features
- Add an admin panel for managing posts, users, and comments

By combining the power of Laravel, the simplicity of Livewire, and the authentication scaffolding provided by Laravel Breeze, you can quickly create dynamic and interactive web applications that meet your users' needs.

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Livewire Documentation](https://laravel-livewire.com/docs)
- [Laravel Breeze Documentation](https://laravel.com/docs/8.x/starter-kits#laravel-breeze)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Neon Documentation](/docs)
