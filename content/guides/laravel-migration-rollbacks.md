---
title: Reverting a failed deployment and schema migration in Laravel
subtitle: Learn how to revert a failed deployment and schema migration in Laravel using built-in tools like `migrate:rollback` and Neon's backup and restore capabilities.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-05-26T00:00:00.000Z'
updatedOn: '2024-05-26T00:00:00.000Z'
---

Deploying new features and updates is an essential part of maintaining a modern web application. However, not every deployment goes as planned.

When something goes wrong, especially with schema migrations, the consequences can range from data inconsistencies to extended application downtime.

In this guide, you'll learn how to revert a failed deployment and schema migration in Laravel using built-in tools like `migrate:rollback` and the backup and restore capabilities of Neon. We'll cover practical steps and best practices for deployment and recovery, helping you prevent future deployment issues.

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

3. **Rolling back to a specific point in time:**
   For more granular control over the rollback process, use the `--date` option with a date string.
   ```bash
   php artisan migrate:rollback --date="2024-05-01 12:00:00"
   ```
   This command will roll back all migrations that were executed after the specified date.

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

> **Note:** `migrate:rollback` can lead to data loss if not used carefully. Ensure you have a backup strategy in place.

## Restoring your data using Neon

If rolling back migrations doesn't solve the issue, [Neon's backup and restore](/docs/manage/backups) capabilities can quickly restore your database to a previous state.

### Key benefits of using Neon for restoration

1. **Point-in-Time Restoration:** Restore to a specific moment before the failed deployment.
2. **Restore from another Branch:** Use Neon's branching feature to restore from a stable branch.

### Restoration steps

To restore your database using Neon, you can either use the Neon dashboard or the Neon CLI or API. Follow the steps outlined in [Neon's Branch Restore Guide](/docs/guides/branch-restore#how-to-use-branch-restore):

After restoring the database, align your codebase with the restored data to ensure consistency.

For detailed steps, refer to the [Neon Branch Restore Guide](/docs/guides/branch-restore#how-to-use-branch-restore).

## Best practices for deployment and recovery

No deployment process is foolproof, but following best practices can help you recover quickly and prevent future issues.

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

- **Reduce extensive issues:**
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

### Implement a robust backup strategy

1. **Daily Full Backups:** Schedule daily full backups.
2. **Incremental Backups:** Use frequent snapshots throughout the day.
3. **Retention Policies:** Keep backups long enough for compliance and audits.

It is important to test your backup and restore process regularly to ensure it works as expected.

## Preventing future deployment issues

Even with a solid recovery plan, preventing deployment issues in the first place is the best approach. There are several strategies to minimize deployment problems:

### Automate and validate deployments

Implement a CI/CD pipeline to streamline the deployment process and add safeguards.

**Example CI/CD pipeline:**

1. **Build Stage:** Install dependencies and compile assets.

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

3. **Deployment Stage:** Deploy to staging, run health checks, and promote to production if all tests pass.

### Use Neon's branching feature

Create isolated environments for testing and staging using [Neon's branching feature](/docs/introduction/branching).

1. **Create a branch:**
   Create a branch from your production database in the Neon dashboard.

2. **Deploy code to staging:**
   Point your staging environment to the new branch.

3. **Test migrations and features thoroughly:**
   Ensure migrations work correctly and features function as expected.

4. **Merge to production:**
   Deploy your changes to production after successful testing.

For a detailed guide on using Neon's branching feature with Laravel for testing and staging, refer to the [Testing Laravel Applications with Neon's Database Branching](/guides/laravel-test-on-branch).

### Set up monitoring and alerts

Proactively monitor your application and database. That way, you can catch issues early and respond quickly.

Some monitoring tools to consider can include tools like New Relic, Sentry, or Datadog.

On the database monitoring side, you can use [Neon's built-in monitoring capabilities](/docs/introduction/monitoring-page) to track performance metrics and receive alerts for potential issues.

## Conclusion

By using Laravel's built-in `migrate:rollback` command and Neon's backup and restore capabilities, you can revert a failed deployment quickly and safely. Follow best practices like testing in staging environments, breaking down database changes, and automating deployments to minimize future issues and maintain a smooth deployment process.

- [Laravel Migrations Documentation](https://laravel.com/docs/11.x/migrations)
- [Neon documentation](/docs)
