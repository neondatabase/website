---
title: Reverting a failed deployment and schema migration in Laravel
subtitle: Learn how to revert a failed deployment and schema migration in Laravel using built-in tools like `migrate:rollback` and Neon's instant restore.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-05-26T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Not every deployment goes as planned. When something goes wrong, especially with schema migrations, the consequences can range from data inconsistencies to extended application downtime.

In this guide, you'll learn how to revert a failed deployment and schema migration in Laravel using built-in tools like `migrate:rollback` and Neon's instant restore. We'll also cover practices for deployment and recovery that help prevent future deployment issues.

## Rolling back migrations in Laravel

Laravel provides a built-in [Artisan migrate command](https://laravel.com/docs/11.x/migrations#rolling-back-migrations) for reverting schema changes when a migration doesn't go as expected.

Here's how to use it:

### Using `php artisan migrate:rollback`

1. **Revert the last batch of migrations:**

   ```bash
   php artisan migrate:rollback
   ```

   This command will revert the last batch of migrations applied to your database.

2. **Revert a specific number of steps:**
   If you need more control, use the `--step` option:

   ```bash
   php artisan migrate:rollback --step=1
   ```

   This command will only roll back the most recent migration file.

3. **Roll back a specific batch:**
   To roll back a single batch of migrations, use the `--batch` option with the batch number from the `migrations` table.
   ```bash
   php artisan migrate:rollback --batch=3
   ```
   This command rolls back only the migrations in batch 3.

### Troubleshooting rollback issues

If you encounter issues while rolling back migrations, follow these troubleshooting steps:

- **Failed rollback command:** Check the Laravel logs for error messages. For instance, if you see an error about missing tables or columns:
  - Revisit the migration files and ensure they are consistent.
  - Adjust or fix the migrations as needed.

- **Ensure idempotency:**
  Make sure all migrations can be run and rolled back without side effects. Here's an example of an idempotent migration:

  ```php
  // database/migrations/2024_05_10_000000_add_status_to_users.php
  use Illuminate\Database\Migrations\Migration;
  use Illuminate\Database\Schema\Blueprint;
  use Illuminate\Support\Facades\Schema;

  class AddStatusToUsers extends Migration
  {
      public function up()
      {
          if (!Schema::hasColumn('users', 'status')) {
              Schema::table('users', function (Blueprint $table) {
                  $table->string('status')->default('active');
              });
          }
      }

      public function down()
      {
          if (Schema::hasColumn('users', 'status')) {
              Schema::table('users', function (Blueprint $table) {
                  $table->dropColumn('status');
              });
          }
      }
  }
  ```

### Database verification after rollback

After rolling back migrations, verify the database schema and data to ensure the rollback was successful.

- **Check migration status:**

  ```bash
  php artisan migrate:status
  ```

  This command lists all migrations, showing which ones have been applied.

- **Inspect database directly:**
  Use your database management tool to directly inspect the schema and data.

> **Note:** `migrate:rollback` can lead to data loss if not used carefully. Make sure you have a backup strategy in place.

## Restoring your data using Neon

If rolling back migrations doesn't solve the issue, Neon's [instant restore](/docs/postgres/backup-restore/branch-restore) can return your database to a previous state.

### Restore options on Neon

1. **Point-in-time restore:** Restore a branch to a specific moment before the failed deployment, within your project's history window.
2. **Restore from another branch:** Restore your branch from the data in another, stable branch.

### Restoration steps

You can restore your database from the Neon Console, the Neon CLI, or the Neon API. Follow the steps in [Instant restore](/docs/postgres/backup-restore/branch-restore#how-to-use-instant-restore).

After restoring the database, roll your code back to the version that matches the restored schema.

## Best practices for deployment and recovery

No deployment process is foolproof, but these practices help you recover quickly and prevent future issues.

### Use a staging environment

Replicate your production environment for testing before deploying features to production.

1. **Develop and test locally:**
   Run migrations and tests against your development database.

2. **Deploy changes and migrations to staging:**
   Ensure your staging environment closely resembles production.

3. **Perform thorough testing:**
   Use automated and manual testing to validate changes.

4. **Promote changes to production after verification:**
   Deploy to production only after all tests pass.

### Break down database changes

Smaller, manageable migrations make rollbacks simpler.

- **Limit the scope of each change:**
  Break changes into smaller, logical batches.

- **Example workflow:**
  1. Create multiple smaller migrations instead of one large one.

  ```bash
  php artisan make:migration add_status_to_users
  php artisan make:migration add_type_to_users
  ```

  2. Test each migration in isolation.

  ```bash
  php artisan migrate
  ```

### Implement a backup strategy

1. **Daily full backups:** Schedule daily full backups, for example with [automated `pg_dump` backups](/docs/postgres/backup-restore/backups#automated-backups-with-pg_dump).
2. **Incremental backups:** Use frequent snapshots throughout the day.
3. **Retention policies:** Keep backups long enough for compliance and audits.

Test your backup and restore process regularly to confirm it works.

## Preventing future deployment issues

Even with a solid recovery plan, it's better to prevent deployment issues in the first place. These strategies help:

### Automate and validate deployments

Implement a CI/CD pipeline to automate the deployment process and add safeguards.

**Example CI/CD pipeline:**

1. **Build stage:** Install dependencies and compile assets.

   ```yaml
   - name: Install Dependencies
     run: composer install
   - name: Compile Assets
     run: npm run build
   ```

2. **Test stage:** Run tests and validate coding standards.

   ```yaml
   - name: Run Unit Tests
     run: php artisan test
   - name: Run Coding Standards Check
     run: php artisan lint
   ```

3. **Deployment stage:** Deploy to staging, run health checks, and promote to production if all tests pass.

### Use Neon's branching feature

Create isolated environments for testing and staging using [Neon's branching feature](/docs/introduction/branching).

1. **Create a branch:**
   Create a branch from your production branch in the Neon Console.

2. **Deploy code to staging:**
   Point your staging environment to the new branch.

3. **Test migrations and features thoroughly:**
   Ensure migrations work correctly and features function as expected.

4. **Merge to production:**
   Deploy your changes to production after successful testing.

For a detailed guide on using Neon's branching feature with Laravel for testing and staging, refer to [Testing Laravel applications with Neon's database branching](/guides/laravel-test-on-branch).

### Set up monitoring and alerts

Monitor your application and database so you can catch issues early and respond quickly. Tools to consider include New Relic, Sentry, and Datadog.

On the database monitoring side, you can use the [Neon monitoring dashboard](/docs/introduction/monitoring-page) to track performance metrics such as CPU, RAM, and connections.

## Conclusion

With Laravel's `migrate:rollback` command and Neon's instant restore, you can revert a failed deployment and its schema changes. To reduce future failures, test migrations on a branch, keep database changes small, and automate your deployments.

- [Laravel Migrations Documentation](https://laravel.com/docs/11.x/migrations)
- [Neon documentation](/docs)
