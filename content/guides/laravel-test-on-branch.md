---
title: Testing Laravel applications with Neon branching
subtitle: Testing with realistic production data using Laravel and Neon branching
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-05-26T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

[Laravel](https://laravel.com) is a popular PHP framework widely used for building web applications. It includes tools for automated testing, and [PEST](https://pestphp.com/) is a popular choice for its concise syntax.

Testing with realistic data shows how your application behaves under real-world conditions. Neon branching lets you test against a copy of your production data without affecting your live database.

## 1. Understanding Laravel testing approaches

In Laravel, developers commonly use a local SQLite database for testing. Each test run starts from a clean state by applying all database migrations and seeders, which suits parallel testing: tests run quickly and don't interfere with each other.

SQLite can behave differently from a production database such as MySQL or Postgres, and those differences can cause unexpected issues in production. Testing with real data gives a more accurate picture of how the application will behave in its live environment, but running tests against production data carries security and data-management risks.

## 2. Neon branching

Neon [branching](/docs/introduction/branching) lets you create isolated branches of your database for development, testing, and more.

A branch in Neon is a copy-on-write clone of your data that can be made from the current database state or any past state. This means you can have an exact copy of your production data at a specific point in time to use for testing.

Key properties of Neon branches:

- **Isolation:** Operations on one branch don't affect the parent or other branches.
- **Copy-on-write:** Creating a branch doesn't copy data up front, and each branch runs on its own compute, so test queries don't load the parent's compute.
- **Independent changes:** You can modify or delete a branch without touching the original data. A branch stores only the changes made since it was created.
- **Simple hierarchy:** Every Neon project starts with a root branch (named `production` in projects created in the Console), and you can create new branches from it or from any other branch.

Because a branch is ready in seconds, it works well in CI/CD pipelines, where each run can get its own test database with realistic data.

## 3. Setting up your testing environment

This section covers the prerequisites, installation, configuration, and a first PEST test.

### Prerequisites

Before you begin, ensure you have the following:

- **Neon account:** You can sign up at [console.neon.tech](https://console.neon.tech/signup).
- **Neon API key:** Create an [API key](/docs/manage/api-keys) in the Neon Console. The `neon` CLI uses it to create and delete branches programmatically in [section 5](#5-managing-neon-branches-with-neon-cli).
- **Local development environment:** Laravel requires PHP 8.2 or later and [Composer](https://getcomposer.org/) for managing dependencies.
- **Laravel installation:** A Laravel project set up on your local machine. For installation instructions, refer to the [Laravel documentation](https://laravel.com/docs/11.x/installation).

### Installation and configuration

To set up your testing environment with Neon and Laravel, follow these steps:

1. **Configure the database connection:**
   - After creating your Neon project, click **Connect** on the project dashboard to get the connection details.
   - Open your Laravel project and update the `.env` file with the Neon database connection parameters:

     ```env
     DB_CONNECTION=pgsql
     DB_HOST=your-neon-hostname.neon.tech
     DB_PORT=5432
     DB_DATABASE=<your-database-name>
     DB_USERNAME=<your-username>
     DB_PASSWORD=<your-password>
     ```

2. **Install PEST:**
   - PEST is a testing framework for PHP that works with Laravel. Install PEST via Composer with the following command:

     ```
     composer require pestphp/pest --dev
     composer require pestphp/pest-plugin-laravel --dev
     ```

#### Creating a migration and seeder

1. **Generate the migration and model:**
   - Run the following command to create a new migration file for a `questions` table and its associated model:

   ```
   php artisan make:model Question -m
   ```

   - Open the generated migration file in the `database/migrations` directory and add fields to the `questions` table schema:

     ```php
     Schema::create('questions', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description');
        $table->timestamps();
     });
     ```

2. **Create a seeder:**
   - Generate a seeder to populate the `questions` table:

     ```
     php artisan make:seeder QuestionsTableSeeder
     ```

   - Open the `database/seeders/QuestionsTableSeeder.php` and in the `run` method, add code to create sample questions:

     ```php
     public function run()
     {
        $questions = [
            ['What is Laravel?', 'A PHP framework for web artisans.'],
            ['What is MVC?', 'A design pattern called Model-View-Controller.'],
            ['What is PHP?', 'A popular general-purpose scripting language.'],
            ['How do databases work?', 'Databases store data in an organized manner.'],
            ['What is OOP?', 'Object-Oriented Programming is a programming paradigm.'],
            ['What is a variable in programming?', 'A variable is used to store information.'],
            ['What is an API?', 'Application Programming Interface, a way for systems to interact.'],
            ['What are webhooks?', 'Webhooks allow applications to send automated messages or information.'],
            ['What is JSON?', 'JSON is a format for storing and transporting data.'],
            ['What is a function in programming?', 'A function is a block of code designed to perform a particular task.']
        ];

        foreach ($questions as $q) {
            Question::create([
                'title' => $q[0],
                'description' => $q[1]
            ]);
        }
     }
     ```

   - Register the seeder in `DatabaseSeeder.php`:

     ```php
     $this->call(QuestionsTableSeeder::class);
     ```

3. **Run migrations and seeders:**
   - Migrate the database to create the `questions` table:

     ```
     php artisan migrate
     ```

   - Seed the database with test data:

     ```
     php artisan db:seed
     ```

#### Creating a questions controller

1. **Generate the Controller:**
   A controller is a PHP class that handles HTTP requests. You can create a controller to manage questions data in your Laravel application.
   - Use Artisan to create a new controller named `QuestionController`:

     ```
     php artisan make:controller QuestionController
     ```

2. **Add a method to retrieve questions:**
   - Open the newly created `QuestionController` in the `app/Http/Controllers` directory.
   - Add a method to fetch and return all questions:

     ```php
     public function index() {
         $questions = \App\Models\Question::all();
         return response()->json($questions);
     }
     ```

3. **Update routes:**
   - Open the `routes/web.php` file and add a route to handle GET requests for questions:

     ```php
     Route::get('/questions', [\App\Http\Controllers\QuestionController::class, 'index']);
     ```

This setup provides a simple API endpoint to retrieve all questions from the database.

To verify the setup, you can run the Laravel development server:

```
php artisan serve
```

Access the `/questions` endpoint in your browser or a tool like Postman to see the JSON response with the seeded questions.

#### Writing a PEST Test for the `QuestionController`

1. **Create the test file:**
   - Create a test file specifically for the `QuestionController`:

     ```
     php artisan pest:test QuestionTest
     ```

2. **Write the test:**
   Usually, you would write a test that uses the `RefreshDatabase` trait to migrate the database and then seed it with test data before each test. But in this case, we will use the Neon branch to test with real data instead.
   - Open the generated test file in `tests/Feature` and add a test to check the `/questions` endpoint:

     ```php
     it('can retrieve questions from the database', function () {
        $response = $this->get('/questions');
        $response->assertStatus(200)
                ->assertJsonStructure([
                    '*' => ['id', 'title', 'description', 'created_at', 'updated_at']
                ]);
     });
     ```

   - This test does the following:
     - It sends a GET request to the `/questions` endpoint.
     - It asserts that the HTTP status is `200` and checks the JSON structure to match the expected fields for questions.

### Running the tests

Run the updated tests to ensure your controller behaves correctly:

```
./vendor/bin/pest
```

PEST will execute the test and provide feedback on the test results.

## 4. Using Neon branching with Laravel

Never run tests against your production database. The `RefreshDatabase` and `DatabaseTransactions` traits in particular can delete or modify data during testing.

A Neon branch gives you an isolated copy of your production data instead. That's especially useful when a change involves schema changes or data migrations, because you can validate it against realistic data before it reaches production.

### Creating a Neon branch

1. **Log in to the Neon Console:**
   - Go to [console.neon.tech](https://console.neon.tech).

2. **Select your project:**
   - Select the project you use for your production environment.

3. **Create a new branch:**
   - Select **Branches** in the sidebar.
   - Click **New branch**.
   - Name your new branch (e.g., "testing-branch") and choose whether to create it from the current state of the parent branch or from a specific point in time. This creates a copy-on-write clone of your database.
   - The branch is usually ready within a few seconds.

### Integrating Neon branching with Laravel testing

Go back to your Laravel project and integrate the Neon branch into your testing setup:

1. **Update the environment configuration:**
   - Once your branch is created, click **Connect** in the Neon Console and select the new branch to get its connection details (hostname, database name, username, and password).
   - Create a new environment file in your Laravel project, such as `.env.testing`, and configure it to use the Neon testing branch. Laravel loads this file when `APP_ENV` is `testing`.

     ```env
     DB_CONNECTION=pgsql
     DB_HOST=your-neon-testing-hostname.neon.tech
     DB_PORT=5432
     DB_DATABASE=<your-testing-database-name>
     DB_USERNAME=<your-testing-username>
     DB_PASSWORD=<your-testing-password>
     ```

1. **Update the PHPUnit configuration:**
   - PHPUnit (which PEST uses to run tests) needs `APP_ENV` set to `testing` so Laravel loads `.env.testing`. Update your `phpunit.xml` file:

     ```xml
     <php>
         <env name="APP_ENV" value="testing"/>
         <env name="DB_CONNECTION" value="pgsql"/>
     </php>
     ```

1. **Run tests:**
   - With the testing branch configured, your tests run against a copy of production data without the risk of affecting real user data. Use PEST to run your tests:

     ```bash
     ./vendor/bin/pest
     ```

   - Check the PEST output to confirm your application behaves as expected against the testing branch.

## 5. Managing Neon branches with `neon` CLI

Creating branches by hand works for one-off testing. For automated test runs, use the `neon` CLI to create and delete branches from scripts or CI.

### Installing `neon`

Before you can start using `neon`, you need to install it on your local machine. Follow the installation instructions provided in the [Neon CLI documentation](/docs/cli/install) to set up `neon` on your system.

### Using `neon` to manage branches

Once `neon` is installed, you can use it to interact with your Neon database branches. Here are the basic commands for managing branches:

#### 1. [Creating a branch](/docs/cli/branches#create)

To create a new branch, use the `neon branches create` command:

```bash
neon branches create --project-id PROJECT_ID --parent PARENT_BRANCH_ID --name BRANCH_NAME --no-secrets
```

Replace `PROJECT_ID`, `PARENT_BRANCH_ID`, and `BRANCH_NAME` with the appropriate values for your Neon project. This command will create a new branch based on the specified parent branch. `--no-secrets` (Neon CLI 4.9.0+) keeps the connection string out of CI logs; you fetch it next with `neon connection-string`.

#### 2. [Listing branches](/docs/cli/branches#list)

To list all branches in your Neon project, use the `neon branches list` command:

```bash
neon branches list --project-id PROJECT_ID
```

Replace `PROJECT_ID` with your Neon project ID. This command will display a list of all branches along with their IDs, names, and other relevant information.

#### 3. [Getting the connection string](/docs/cli/connection-string)

Once you've created a branch, you'll need to obtain the connection string to configure your Laravel application. Use the `neon connection-string` command:

```bash
neon connection-string BRANCH_ID
```

Replace `BRANCH_ID` with the ID of the branch you want to connect to. This command will output the connection string that you can use to configure your Laravel `.env` file.

#### 4. [Deleting a branch](/docs/cli/branches#delete)

After you've finished testing with a branch, you can delete it using the `neon branches delete` command:

```bash
neon branches delete BRANCH_ID
```

Replace `BRANCH_ID` with the ID of the branch you want to delete. This removes the branch and its compute from your Neon project.

### Integrating Neon branches with Laravel testing

Once you've created a Neon branch using `neon`, you can integrate it into your Laravel testing workflow:

1. **Get connection details:** Use `neon connection-string` to get the connection details for the branch.
2. **Update the `.env.testing` file:** Update your Laravel `.env.testing` file with the connection details obtained from `neon`.
3. **Run tests:** Execute your Laravel tests as usual, ensuring that they interact with the Neon branch database.
4. **Clean up:** After testing is complete, use `neon branches delete` to delete the branch and clean up resources.

## Conclusion

You now have a Laravel test suite that runs against a Neon branch with a copy of your production data, plus `neon` CLI commands to create and delete those branches. To run this on every pull request, see the [Neon branching GitHub Actions guide](/docs/guides/branching-github-actions).

## Additional resources

- [Laravel documentation](https://laravel.com/docs): installation, configuration, and usage for the Laravel PHP framework.
- [Neon documentation](/docs): guides, tutorials, and API references.
- [GitHub Actions tutorials](https://docs.github.com/en/actions/learn-github-actions): automate your workflow with GitHub Actions.
- [Neon branching GitHub Actions guide](/docs/guides/branching-github-actions): create and delete Neon branches in GitHub Actions for automated testing.
