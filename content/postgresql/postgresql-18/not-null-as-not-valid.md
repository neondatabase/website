---
title: 'PostgreSQL 18 NOT NULL Constraints as NOT VALID'
page_title: 'PostgreSQL 18 NOT NULL Constraints as NOT VALID: Zero-Downtime Schema Changes'
page_description: "In this tutorial, you will learn how to use PostgreSQL 18's new NOT NULL constraints with NOT VALID to add constraints to large tables without downtime or table scans."
ogImage: ''
updatedOn: '2025-06-22T09:50:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 OAuth Support'
  slug: 'postgresql-18/oauth-authentication'
nextLink:
  title: 'PostgreSQL 18 Wire Protocol 3.2 and TLS Improvements'
  slug: 'postgresql-18/security-improvements'
---

**Summary**: In this tutorial, you will learn how to use PostgreSQL 18's new NOT NULL constraints with NOT VALID to add constraints to large tables without lengthy table scans or extended downtime.

## Introduction to NOT NULL Constraints as NOT VALID

PostgreSQL 18 introduces a new feature for database administrators and developers: the ability to add NOT NULL constraints with the `NOT VALID` attribute. This feature addresses one of the most common pain points in production database management: adding NOT NULL constraints to large tables without causing extended downtime.

In previous PostgreSQL versions, adding a NOT NULL constraint to an existing table required scanning the entire table to verify that no existing rows contained NULL values. For large tables with millions or billions of rows, this could take a very long time and lock the table for the entire duration, making it impractical for production environments and leading to significant downtime.

PostgreSQL 18 solves this problem by allowing you to add NOT NULL constraints that are immediately enforced for new data but don't require validating existing data upfront. This creates a path for zero-downtime schema changes in production environments.

## Understanding the Problem with Traditional NOT NULL Constraints

Before exploring the new feature, let's understand why traditional NOT NULL constraints can be problematic for large tables.

### The Traditional Approach (PostgreSQL 17 and Earlier)

In PostgreSQL 17 and earlier versions, adding a NOT NULL constraint works like this:

```sql
-- Traditional approach - scans entire table
ALTER TABLE large_table
ALTER COLUMN email SET NOT NULL;
```

This operation:

1. Acquires an ACCESS EXCLUSIVE lock on the table
2. Scans every row to verify no NULL values exist
3. Holds the lock until the scan completes
4. Only then commits the constraint

For a table with millions of rows, this can take significant time during which the table is completely unavailable for reads and writes.

### The Impact on Production Systems

Consider this scenario:

- Table with 50 million rows
- Table scan takes about 5 minutes to complete
- During those 5 minutes: no reads, no writes, no queries can access the table
- Applications time out, users see errors, and business operations are disrupted

This is why many teams avoid adding NOT NULL constraints to existing large tables or schedule them during maintenance windows, compromising data integrity for availability.

## PostgreSQL 18's Solution: NOT NULL with NOT VALID

PostgreSQL 18 introduces a new approach that separates constraint addition from constraint validation:

```sql
-- New approach - no table scan required
ALTER TABLE large_table
ADD CONSTRAINT email_not_null NOT NULL email NOT VALID;
```

This command:

1. Takes only a brief ACCESS EXCLUSIVE lock
2. Creates the constraint without scanning existing data
3. Immediately enforces the constraint for new rows
4. Marks the constraint as "not validated" for existing data

## Basic Syntax and Usage

With PostgreSQL 18, you can add a NOT NULL constraint without validating existing data.

### Adding a NOT NULL Constraint as NOT VALID

The basic syntax for adding a NOT NULL constraint with NOT VALID is:

```sql
ALTER TABLE table_name
ADD CONSTRAINT constraint_name NOT NULL column_name NOT VALID;
```

Let's see this in action with a practical example.

Suppose we have a table called `users` that already contains data, and we want to ensure that the `email` column cannot contain NULL values going forward.

```sql
-- Create a sample table with existing data
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Next, let's insert some test data, including rows with NULL emails:

```sql
-- Insert some test data, including rows with NULL emails
INSERT INTO users (username, email) VALUES
    ('alice', 'alice@example.com'),
    ('bob', NULL),
    ('charlie', 'charlie@example.com'),
    ('diana', NULL);
```

Now, we can add a NOT NULL constraint to the `email` column without validating existing data:

```sql
-- Add NOT NULL constraint without validating existing data
ALTER TABLE users
ADD CONSTRAINT users_email_not_null NOT NULL email NOT VALID;
```

After this operation:

- The constraint exists and has a name (`users_email_not_null`)
- New INSERTs or UPDATEs cannot set email to NULL
- Existing NULL values remain in the table
- The operation completed almost instantly

### Verifying the Constraint Behavior

After adding the constraint, let's test its behavior with both existing and new data.

Try inserting a new row with a NULL email:

```sql
-- This will fail - constraint prevents new NULL values
INSERT INTO users (username, email)
VALUES ('eve', NULL);

-- ERROR:  null value in column "email" of relation "users" violates not-null constraint

-- This will succeed
INSERT INTO users (username, email)
VALUES ('eve', 'eve@example.com');
```

### Validating the Constraint

When you're ready to validate existing data, use the VALIDATE CONSTRAINT command:

```sql
-- This will fail because existing NULL values exist
ALTER TABLE users
VALIDATE CONSTRAINT users_email_not_null;

-- Error: column "email" of relation "users" contains null values
```

To successfully validate, first clean up existing NULL values:

```sql
-- Clean up existing NULL values
UPDATE users
SET email = username || '@example.com'
WHERE email IS NULL;

-- Now validation will succeed
ALTER TABLE users
VALIDATE CONSTRAINT users_email_not_null;
```

This operation scans the table to ensure all existing rows comply with the constraint, but it does so using a less restrictive lock that allows normal operations to continue.

## Advanced Features and Benefits

With the new NOT NULL constraints in PostgreSQL 18, you gain several advanced features and benefits. Let's explore these in the next sections.

### Named Constraints

PostgreSQL 18 also improves NOT NULL constraint naming. Unlike previous versions where NOT NULL constraints were anonymous, you can now give them meaningful names:

```sql
-- Named constraint
ALTER TABLE products
ADD CONSTRAINT products_name_required NOT NULL name NOT VALID;

-- List all constraints on the table
SELECT conname AS constraint_name
FROM pg_constraint
WHERE conrelid = 'products'::regclass
  AND contype = 'n';  -- 'n' for NOT NULL constraints

-- You can reference it by name later
ALTER TABLE products
VALIDATE CONSTRAINT products_name_required;
```

### Checking Constraint Status

You can check the status of your constraints using the system catalogs:

```sql
-- View constraint information
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    convalidated AS is_validated,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'users'::regclass
  AND contype = 'n';  -- 'n' for NOT NULL constraints
```

This query will show you all NOT NULL constraints on the `users` table, their validation status, and definitions.

## Practical Workflow for Production Environments

Here's a recommended workflow for adding NOT NULL constraints to large production tables:

### Step 1: Add the NOT VALID Constraint

```sql
-- Fast operation - takes only milliseconds
ALTER TABLE large_production_table
ADD CONSTRAINT large_table_email_not_null NOT NULL email NOT VALID;
```

This immediately protects against new NULL values while allowing you to address existing data at your own pace.

### Step 2: Identify and Fix Existing NULL Values

```sql
-- Find rows with NULL values
SELECT COUNT(*)
FROM large_production_table
WHERE email IS NULL;

-- Fix them in batches to avoid long-running transactions
UPDATE large_production_table
SET email = 'unknown@company.com'
WHERE email IS NULL
  AND id BETWEEN 1 AND 10000;

-- Continue in batches...
```

The goal is to ensure all existing rows comply with the new constraint without locking the table for an extended period.

### Step 3: Validate the Constraint

Once all existing NULL values are addressed, validate the constraint using:

```sql
-- This operation uses SHARE UPDATE EXCLUSIVE lock
-- Allows reads and writes during validation
ALTER TABLE large_production_table
VALIDATE CONSTRAINT large_table_email_not_null;
```

The validation step scans the table but uses a less restrictive lock that allows normal database operations to continue.

## Limitations and Considerations

As of PostgreSQL 18 Beta 1, there are some limitations to be aware of:

1. **Only NOT NULL constraints**: This feature specifically applies to NOT NULL constraints, not other constraint types
2. **Inheritance complexity**: Constraint inheritance behavior with NOT VALID requires careful consideration
3. **pg_dump considerations**: The dump/restore process should handle these constraints appropriately, but be aware of the behavior

### Migration from CHECK Constraints

If you've been using the CHECK constraint workaround from earlier PostgreSQL versions:

```sql
-- Old workaround
ALTER TABLE users
ADD CONSTRAINT users_email_check CHECK (email IS NOT NULL) NOT VALID;

-- PostgreSQL 18 native approach
ALTER TABLE users
ADD CONSTRAINT users_email_not_null NOT NULL email NOT VALID;
```

The native NOT NULL constraint is preferred as it's recognized properly by the PostgreSQL optimizer and tools.

## Summary

PostgreSQL 18 introduces a practical way to add NOT NULL constraints using the new NOT VALID option. This allows teams to enforce data integrity without scanning large tables or causing downtime. The constraint is applied instantly for new data, while validation of existing rows can be done later, at a time that works best for the team.

This change is especially useful for large production systems, high-availability environments, and teams practicing continuous deployment. By separating constraint creation from validation, PostgreSQL makes it easier to evolve schemas safely, even on active workloads. It's a thoughtful improvement that reflects PostgreSQL's ongoing focus on real-world needs and operational flexibility.
