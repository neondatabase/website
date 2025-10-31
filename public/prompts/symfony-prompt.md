# 💡 AI Prompt: Connect Symfony to Neon Postgres with Doctrine

**Role:** You are an expert software agent responsible for configuring the current Symfony project to connect to a Neon Postgres database using Doctrine ORM.

**Purpose:** To configure the Symfony project to securely connect to a Neon Postgres database, and to create a working example that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle to validate the connection.

**Scope:**
- Assumes the user is working within an existing Symfony project directory.
- Assumes the user has an existing Neon database and access to its connection parameters.
- Assumes the user has Composer and the Symfony CLI installed.

✅ Read and understand the entire instruction set before executing.

---

**MANDATORY EXECUTION PROTOCOL**

**The following rules apply to all commands you are about to run following this guide and are non-negotiable:**

- **Execute Verbatim:** You must execute all commands exactly as they are provided. Do not add, remove, or alter any part of a command.
- **Handle Interactive Prompts:** For interactive commands, provide only the inputs specified in these instructions.
- **On Any Failure, HALT:** If any command fails, gets stuck, or produces an unexpected prompt, you must **immediately halt all operations**.
- **Under no circumstances should you retry, improvise, or attempt any alternative solutions.** Your only permitted action in a failure state is to halt and request assistance, instructing the user to manually enter the required commands or inputs into their terminal to proceed.

---

## 📋 Prerequisites

- **Symfony CLI**: The user must have the [Symfony CLI](https://symfony.com/download) installed.
- **Existing Project**: This prompt should be run inside a Symfony project directory. If the user needs to create a new project, run the following command, which creates a new Symfony project:

    ```bash
    symfony new project_name --version="7.3.x"
    ```
- **Required PHP Extensions**: Before proceeding, ensure the user's PHP environment has the necessary PostgreSQL drivers enabled. These are the **`pdo_pgsql`** and **`pgsql`** extensions. Without them, the application will fail with a "driver not found" error. To verify, run `php -m | grep pgsql`. If the extensions are missing, inform the user they must install them for their specific platform (e.g., `sudo apt install php-pgsql` for Debian/Ubuntu) before continuing.
- **Required Composer Packages**: For an existing project, ensure that Doctrine is installed. If it's missing run:
    ```bash
    composer require symfony/orm-pack
    composer require --dev symfony/maker-bundle
    ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Symfony project as follows:

### 1. Configure Environment Variables for Neon

1.  Locate the `.env` file at the root of the project.
2.  Update the `DATABASE_URL` variable in the `.env` file. **Prompt the user to replace the placeholder values** with their actual credentials from their Neon project.

    ```dotenv title=".env"
    # Replace with your Neon connection string
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
    ```

4.  Direct the user to find their connection string in the **Neon Console → Project → Dashboard → Connect**.

### 2. Create a "Todo" Entity and Migration

To provide a concrete example, you will generate a `Todo` entity and its corresponding database migration.

1.  **Generate the Entity:** Run the following Symfony console command to start the interactive entity creation process:
    **CRITICAL REMINDER: FOLLOW THE MANDATORY EXECUTION PROTOCOL. ASK FOR USER ASSISTANCE WHEN NEEDED.**
    ```bash
    php bin/console make:entity
    ```
    - Class name of the entity: `Todo`
    - New property name: `task` (Type: `string`, Length: `255`, Nullable: `no`)
    - New property name: `completed` (Type: `boolean`, Nullable: `no`)
    - Press `<Enter>` to finish adding properties.

2.  **Generate the Database Migration:**
    - After the entity is created, generate the migration file that defines the SQL for creating the `todos` table.
        ```bash
        php bin/console make:migration
        ```
    - A new migration file will be created in the `migrations/` directory.

### 3. Create an Example Command with CRUD Operations

To validate the entire setup, create a custom Symfony console command that demonstrates a full C-R-U-D lifecycle within a database transaction.

1.  **Generate the Command:**
    - Run the following command to generate a boilerplate command class:
    
        ```bash
        php bin/console make:command app:test-neon-connection
        ```

2.  **Implement the Command Logic:**
    - Open the newly created file at `src/Command/TestNeonConnectionCommand.php`.
    - Replace its contents with the following code. This script uses Doctrine's EntityManager to perform create, read, update, and delete operations on the `Todo` entity.

    ```php title="src/Command/TestNeonConnectionCommand.php"
    <?php

    namespace App\Command;

    use App\Entity\Todo;
    use Doctrine\ORM\EntityManagerInterface;
    use Symfony\Component\Console\Attribute\AsCommand;
    use Symfony\Component\Console\Command\Command;
    use Symfony\Component\Console\Input\InputInterface;
    use Symfony\Component\Console\Output\OutputInterface;
    use Symfony\Component\Console\Style\SymfonyStyle;

    #[AsCommand(
        name: 'app:test-neon-connection',
        description: 'Tests the Neon DB connection with a full CRUD lifecycle.',
    )]
    class TestNeonConnectionCommand extends Command
    {
        private $entityManager;

        public function __construct(EntityManagerInterface $entityManager)
        {
            parent::__construct();
            $this->entityManager = $entityManager;
        }

        protected function execute(InputInterface $input, OutputInterface $output): int
        {
            $io = new SymfonyStyle($input, $output);
            $io->title('Starting Neon Database Connection Test');

            $this->entityManager->getConnection()->beginTransaction();

            try {
                // 1. CREATE
                $io->section('[CREATE] Inserting a new todo...');
                $todo = new Todo();
                $todo->setTask('Learn Neon with Symfony');
                $todo->setCompleted(false);
                $this->entityManager->persist($todo);
                $this->entityManager->flush();
                $io->success('Inserted Todo with ID: ' . $todo->getId());

                // 2. READ
                $io->section('[READ] Fetching the new todo by ID...');
                $todoRepository = $this->entityManager->getRepository(Todo::class);
                $fetchedTodo = $todoRepository->find($todo->getId());
                if (!$fetchedTodo) {
                    throw new \Exception('Failed to fetch the newly created Todo.');
                }
                $io->writeln('Fetched task: ' . $fetchedTodo->getTask());
                $io->success('Read operation successful.');

                // 3. UPDATE
                $io->section('[UPDATE] Marking the todo as complete...');
                $fetchedTodo->setCompleted(true);
                $fetchedTodo->setTask('Master Neon with Symfony!');
                $this->entityManager->flush();
                $io->success('Updated task to: "' . $fetchedTodo->getTask() . '" and completed status to "true".');

                // 4. DELETE
                $io->section('[DELETE] Deleting the todo...');
                $todoId = $fetchedTodo->getId();
                $this->entityManager->remove($fetchedTodo);
                $this->entityManager->flush();
                $io->success('Deleted Todo with ID: ' . $todoId);

                // Verify Deletion
                $io->section('Verifying deletion...');
                $deletedTodo = $todoRepository->find($todoId);
                if ($deletedTodo === null) {
                    $io->success('Verification successful. Todo is deleted.');
                } else {
                    throw new \Exception('Verification failed. Todo was not deleted.');
                }

                // All good, commit the transaction
                $this->entityManager->getConnection()->commit();
                $io->newLine();
                $io->success('All CRUD operations were successful within a transaction!');

                return Command::SUCCESS;

            } catch (\Exception $e) {
                $io->error('An error occurred: ' . $e->getMessage());
                // Rollback the transaction on error
                $this->entityManager->getConnection()->rollBack();

                return Command::FAILURE;
            }
        }
    }
    ```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify that the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Run the migration to create the `todos` table in their Neon database.
    ```bash
    php bin/console doctrine:migrations:migrate
    ```
    *(The user should confirm the migration by typing `yes`)*.
3.  Finally, run the example command to test the full lifecycle:
    ```bash
    php bin/console app:test-neon-connection
    ```
4.  If successful, the output should show success messages for each C-R-U-D step, indicating a successful connection and operation.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A `.env` file is present and contains the `DATABASE_URL` variable.
- The `DATABASE_URL` starts with `postgresql://`.
- The `doctrine/orm` and `symfony/maker-bundle` packages are listed in `composer.json`.
- The `src/Entity/Todo.php` entity class exists.
- At least one migration file exists in the `migrations/` directory.
- The `src/Command/TestNeonConnectionCommand.php` file exists and contains the specified CRUD logic.
- **MANDATORY EXECUTION PROTOCOL IS ALWAYS FOLLOWED.** NEVER TRY DIFFERENT APPROACHES IF A COMMAND FAILS. HALT IMMEDIATELY AND ASK THE USER TO MANUALLY EXECUTE THE COMMANDS.

---

## ❌ Do Not

- **Do not hardcode credentials** in any `.php` or `.yaml` file. Always use `env()` for sensitive data.
- **Do not output the contents of the `.env` file** or the user's connection string in any response.
- **Do not try different commands or approaches** if any command fails. Always halt and request user intervention.