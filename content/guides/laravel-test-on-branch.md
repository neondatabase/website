---
title: Testing Laravel Applications with Neon's Database Branching
subtitle: Leveraging Realistic Production Data for Robust Testing with Laravel and Neon Branching
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-05-26T00:00:00.000Z'
updatedOn: '2024-05-26T00:00:00.000Z'
---

[Laravel](https://laravel.com) is a popular PHP framework widely used for building web applications. It includes powerful tools for automated testing, with [PEST](https://pestphp.com/) being a preferred option due to its simplicity and effectiveness.

Testing with realistic data is crucial as it helps ensure that your application performs well under real-world conditions. Neon's database branching feature offers a unique solution by allowing you to test with actual production data without affecting your live database, thus maintaining data integrity and security.

## 1. Understanding Laravel Testing Approaches

In Laravel, developers commonly use a local SQLite database for testing. This method is favored because it allows for starting with a clean state for each test run by applying all database migrations and seeders. This setup is ideal for parallel testing, ensuring that tests run quickly and do not interfere with each other.

However, testing with SQLite can differ significantly from a production environment that might use a different database system, such as MySQL or PostgreSQL. These differences can affect the application's behavior and lead to unexpected issues in production. Therefore, testing with real data can provide a more accurate assessment of how the application will perform in its live environment. Using production data, though, presents risks and challenges related to security and data management.

## 2. Neon Branching

Neon offers a database [branching feature](/docs/introduction/branching) that allows you to create isolated branches of your database for development, testing, and more.

A branch in Neon is a copy-on-write clone of your data that can be made from the current database state or any past state. This means you can have an exact copy of your production data at a specific point in time to use for testing.

Some key benefits of Neon branching include:

- **Isolation:** Branches are completely isolated from the original database and other branches, ensuring that the operations performed on one do not affect others.
- **Efficiency:** Branching is quick and does not burden the parent database, as it uses a copy-on-write mechanism. This means the original database's performance remains unaffected, even when multiple branches are in use.
- **Flexibility:** You can modify or delete branches without impacting the original data. Changes to a branch are independent and only record the differences from the point of branch creation.
- **Simplicity:** Every Neon project starts with a production branch, and new branches can be created from this root or from any other branch. This structure simplifies managing different versions of your database.

Neon's branching is particularly useful in continuous integration and delivery pipelines, enhancing developer productivity by reducing the setup time needed for test environments.

This feature allows you to test with realistic data scenarios without the overhead of maintaining multiple separate databases.

## 3. Setting Up Your Testing Environment

Setting up a robust testing environment with Neon and Laravel involves several steps, from configuring your Neon account to setting up Laravel for testing with PEST. This section will guide you through the prerequisites, installation, configuration, and initial test creation to ensure your application is ready for effective testing.

### Prerequisites

Before you begin, ensure you have the following:

- **Neon Account:** You need an account with Neon to access their database services. You can sign up at [Neon's official website](https://neon.tech).
- **API Keys:** Generate API keys from the Neon console. These keys will allow your Laravel application to interact with the Neon database programmatically.
- **Local Development Environment:** Laravel requires a PHP environment (PHP 7.4 or later) and [Composer](https://getcomposer.org/) for managing dependencies.
- **Laravel Installation:** A Laravel project set up on your local machine. For installation instructions, refer to the [Laravel documentation](https://laravel.com/docs/11.x/installation).

### Installation and Configuration

To set up your testing environment with Neon and Laravel, follow these steps:

1. **Configure Database Connection:**
   - After creating your Neon account and a new database branch, obtain the connection details from the Neon dashboard.
   - Open your Laravel project and update the `.env` file with the Neon database connection parameters:

     ```env
     DB_CONNECTION=pgsql
     DB_HOST=your-neon-hostname.neon.tech
     DB_PORT=5432
     DB_DATABASE=<your-database-name>
     DB_USERNAME=<your-username>
     DB_PASSWORD=<your-password>
     ```

2. **Install PEST PHP:**
   - PEST is a testing framework for PHP that works seamlessly with Laravel. Install PEST via Composer with the following command:

     ```
     composer require pestphp/pest --dev
     composer require pestphp/pest-plugin-laravel --dev
     ```

#### Creating a Migration and Seeder

1. **Generate Migration and Model:**
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

2. **Create Seeder:**
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

3. **Run Migrations and Seeders:**
   - Migrate the database to create the `questions` table:

     ```
     php artisan migrate
     ```

   - Seed the database with test data:

     ```
     php artisan db:seed
     ```

#### Creating a Questions Controller

1. **Generate the Controller:**
   A controller is a PHP class that handles HTTP requests. You can create a controller to manage questions data in your Laravel application.
   - Use Artisan to create a new controller named `QuestionController`:

     ```
     php artisan make:controller QuestionController
     ```

2. **Add a Method to Retrieve Questions:**
   - Open the newly created `QuestionController` in the `app/Http/Controllers` directory.
   - Add a method to fetch and return all questions:

     ```php
     public function index() {
         $questions = \App\Models\Question::all();
         return response()->json($questions);
     }
     ```

3. **Update Routes:**
   - Open the `routes/web.php` file and add a route to handle GET requests for questions:

     ```php
     Route::get('/questions', [\App\Http\Controllers\QuestionController::class, 'index']);
     ```

This setup provides a simple API endpoint to retrieve all questions from the database.

To, verify the setup, you can run the Laravel development server:

```
php artisan serve
```

Access the `/questions` endpoint in your browser or a tool like Postman to see the JSON response with the seeded questions.

#### Writing a PEST Test for the `QuestionController`

1. **Create the Test File:**
   - PEST allows you to write tests in a very expressive way. You can create a test file specifically for the `QuestionController`:

     ```
     php artisan pest:test QuestionTest
     ```

2. **Write the Test:**
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

### Running the Tests

Run the updated tests to ensure your controller behaves correctly:

```
./vendor/bin/pest
```

PEST will execute the test and provide feedback on the test results.

## 4. Using Neon Branching with Laravel

You should never run tests against your production database, as it can lead to data corruption and security risks. Especially if you are using `RefreshDatabase` or `DatabaseTransactions` traits, which can delete or modify data during testing. This is where Neon branching comes in handy.

Neon's branching feature enables you to create isolated database environments, which is ideal for testing changes without impacting the production database.

This can be particularly useful when testing complex features or changes that require realistic data scenarios. Especially when there are schema changes or data migrations involved, Neon branching provides a safe and efficient way to validate your application's behavior on a copy of your production data.

### Creating a Neon Branch

1. **Log In to Neon Dashboard:**
   - Access your Neon dashboard by logging in at [Neon's official website](https://neon.tech).

2. **Select Your Database:**
   - Navigate to the database project that you are using for your production environment.

3. **Create a New Branch:**
   - Click on "Branches" in the sidebar menu.
   - Click on "Create Branch."
   - Name your new branch (e.g., "testing-branch") and specify if it should be created from the current state of the database or from a specific point in time. This creates a copy-on-write clone of your database.
   - Wait for the branch to be fully provisioned, which usually takes just a few seconds.

### Integrating Neon Branching with Laravel Testing

Go back to your Laravel project and integrate the Neon branch into your testing setup:

1. **Update Environment Configuration:**
   - Once your branch is created, obtain the connection details (hostname, database name, username, and password) from the Neon dashboard.
   - Create a new environment file in your Laravel project, such as `.env.testing`, and configure it to use the Neon testing branch. This ensures that your testing environment uses its database configuration.

     ```env
     DB_CONNECTION=pgsql
     DB_HOST=your-neon-testing-hostname.neon.tech
     DB_PORT=5432
     DB_DATABASE=<your-testing-database-name>
     DB_USERNAME=<your-testing-username>
     DB_PASSWORD=<your-testing-password>
     ```

1. **Update PHPUnit Configuration:**
   - Ensure that PHPUnit (used by PEST for running tests) is configured to use the `.env.testing` file. Update your `phpunit.xml` file to specify the environment file:

     ```xml
     <php>
         <env name="APP_ENV" value="testing"/>
         <env name="DB_CONNECTION" value="pgsql"/>
     </php>
     ```

1. **Run Tests:**
   - With the testing branch configured, you can write tests that interact with the database as if it were production data, without the risk of affecting real user data. Use PEST to run your tests:

     ```bash
     ./vendor/bin/pest
     ```

   - Examine the output from PEST to ensure your application behaves as expected against the testing branch. This approach allows you to test changes in a controlled environment that mirrors your production setup.

## 5. Managing Neon Branches with `neonctl` CLI

Automated testing is an essential aspect of software development, ensuring that new code contributions don't break existing functionality. Neon's database branching feature enables you to create isolated environments for testing changes without affecting your production database.

With the `neonctl` CLI tool, managing these branches becomes straightforward and seamless.

### Installing `neonctl`

Before you can start using `neonctl`, you need to install it on your local machine. Follow the installation instructions provided in the [Neon CLI documentation](/docs/reference/cli-install) to set up `neonctl` on your system.

### Using `neonctl` to Manage Branches

Once `neonctl` is installed, you can use it to interact with your Neon database branches. Here are the basic commands for managing branches:

#### 1. [Creating a Branch](/docs/reference/cli-branches#create)

To create a new branch, use the `neonctl branches create` command:

```bash
neonctl branches create --project-id PROJECT_ID --parent PARENT_BRANCH_ID --name BRANCH_NAME
```

Replace `PROJECT_ID`, `PARENT_BRANCH_ID`, and `BRANCH_NAME` with the appropriate values for your Neon project. This command will create a new branch based on the specified parent branch.

#### 2. [Listing Branches](/docs/reference/cli-branches#list)

To list all branches in your Neon project, use the `neonctl branches list` command:

```bash
neonctl branches list --project-id PROJECT_ID
```

Replace `PROJECT_ID` with your Neon project ID. This command will display a list of all branches along with their IDs, names, and other relevant information.

#### 3. [Obtaining Connection String](/docs/reference/cli-connection-string)

Once you've created a branch, you'll need to obtain the connection string to configure your Laravel application. Use the `neonctl connection-string` command:

```bash
neonctl connection-string BRANCH_ID
```

Replace `BRANCH_ID` with the ID of the branch you want to connect to. This command will output the connection string that you can use to configure your Laravel `.env` file.

#### 4. [Deleting a Branch](/docs/reference/cli-branches#delete)

After you've finished testing with a branch, you can delete it using the `neonctl branches delete` command:

```bash
neonctl branches delete BRANCH_ID
```

Replace `BRANCH_ID` with the ID of the branch you want to delete. This command will remove the branch from your Neon project, ensuring that resources are not left unused.

### Integrating Neon Branches with Laravel Testing

Once you've created a Neon branch using `neonctl`, you can integrate it into your Laravel testing workflow:

1. **Obtain Connection Details:** Use `neonctl connection-string` to get the connection details for the branch.
2. **Update `.env.testing` File:** Update your Laravel `.env.testing` file with the connection details obtained from `neonctl`.
3. **Run Tests:** Execute your Laravel tests as usual, ensuring that they interact with the Neon branch database.
4. **Clean Up:** After testing is complete, use `neonctl branches delete` to delete the branch and clean up resources.

## Conclusion

Testing Laravel applications with Neon's database branching offers a solution for ensuring the reliability and performance of your codebase.

By using realistic production data in a controlled testing environment, developers can confidently validate their changes without risking the integrity of live databases.

Neon's branching feature provides isolation, efficiency, flexibility, and simplicity, making it a valuable tool for streamlining the testing process.

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs) - Official documentation for the Laravel PHP framework, covering installation, configuration, and usage guides.
- [Neon Documentation](/docs) - Comprehensive documentation for Neon's database services, including guides, tutorials, and API references.
- [GitHub Actions Tutorials](https://docs.github.com/en/actions/learn-github-actions) - Learn how to automate your workflow with GitHub Actions, including tutorials on setting up continuous integration for Laravel applications.
- [Neon Branching GitHub Actions Guide](/docs/guides/branching-github-actions) - Step-by-step guide on integrating Neon database branching with GitHub Actions for automated testing workflows.
