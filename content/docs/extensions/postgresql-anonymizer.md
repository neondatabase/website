---
title: The anon extension
subtitle: Protecting sensitive data in Postgres databases
enableTableOfContents: true
tag: new
updatedOn: '2025-01-22T00:00:00.000Z'
---

The `anon` extension ([PostgreSQL Anonymizer](https://postgresql-anonymizer.readthedocs.io)) provides data masking and anonymization capabilities to protect sensitive data in Postgres databases. It helps protect personally identifiable information (PII) and other sensitive data, facilitating compliance with regulations such as [GDPR](https://gdpr-info.eu/).

This guide introduces the `anon` extension and demonstrates how to implement masking rules for static data anonymization, which is currently the only supported masking method.

<CTA />

## Enable the extension

<Admonition type="note">
The `anon` extension is currently [experimental](/docs/pg-extensions#experimental-extensions) and may change in future releases.
</Admonition>

Enable the `anon` extension in your Neon database by following these steps:

1. Connect to your Neon database using either the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or an SQL client like [psql](/docs/connect/query-with-psql-editor)

2. Enable experimental extensions:

    ```sql
    SET neon.allow_unstable_extensions='true';
    ```

3. Install the extension:

    ```sql
    CREATE EXTENSION IF NOT EXISTS anon;
    ```

## Masking rules

Masking rules define which data to mask and how to mask it using SQL syntax. These rules are applied using `SECURITY LABEL` SQL commands and stored within the database schema to implement the privacy by design principle.

## Masking functions

The `anon` extension provides [built-in functions](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/) for different anonymization requirements, including but not limited to:

| Function Type | Description | Example |
|---------------|-------------|---------|
| Faking | Generate realistic data | `anon.fake_first_name()` and `anon.lorem_ipsum()` |
| Pseudonymization | Create consistent and reversible fake data | `anon.pseudo_email(seed)` |
| Randomization | Generate random values | `anon.random_int_between(10, 100)` and `anon.random_in_enum(enum_column)` |
| Partial scrambling | Hide portions of strings | `anon.partial(ip_address, 8, ''XXX.XXX'', 0)` would change `192.168.1.100` to `192.168.XXX.XXX` |
| Nullification | Replace with static values or `NULL` | `MASKED WITH VALUE 'CONFIDENTIAL'` |
| Noise addition | Alter numerical values while maintaining distribution | `anon.noise(salary, 0.1)` adds `+/- 10%` noise to the `salary` column |
| Generalization | Replace specific values with broader categories | `anon.generalize_int4range(age, 10)` would change `54` to `[50,60)` |

## Static masking

Static masking permanently modifies the original data in your tables. This approach is useful for creating anonymized copies of data when:

- Migrating production data to development branches
- Creating sanitized datasets for testing
- Archiving data with sensitive information removed
- Distributing data to third parties

## Implementation example

<Steps>

## Create a sample table

Create a sample `users` table with sensitive information:

    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(255),
        phone_number VARCHAR(20),
        city VARCHAR(100)
    );

    INSERT INTO users (username, email, phone_number, city) VALUES
        ('john_doe', 'john.doe@example.com', '555-123-4567', 'New York'),
        ('jane_smith', 'jane.smith@example.com', '555-987-6543', 'Los Angeles'),
        ('peter_jones', 'peter.jones@example.com', '555-555-1111', 'Chicago');
    ```

## Define masking rules

Apply masking rules to specific columns using `SECURITY LABEL`:

    ```sql
    -- Mask email addresses with realistic-looking but fake emails
    SECURITY LABEL FOR anon ON COLUMN users.email
    IS 'MASKED WITH FUNCTION anon.dummy_safe_email()';

    -- Partially mask phone numbers, preserving the first digit and last two digits
    SECURITY LABEL FOR anon ON COLUMN users.phone_number
    IS 'MASKED WITH FUNCTION anon.partial(phone_number, 1, ''XXX-XXX-'', 2)';
    ```

## Initialize and apply masking

The `anon.init()` function initializes the `anon` extension by loading default fake data sets and setting up the masking environment. This required step prepares the database for anonymization operations and must be executed before applying any masking functions.

    ```sql
    SELECT anon.init();
    ```

Then apply the masking rules to permanently transform the data:

<Admonition type="warning">
Static masking irreversibly modifies your data. The original values cannot be recovered after anonymization.
</Admonition>

    ```sql
    SELECT anon.anonymize_table('users');
    ```

## Verify results

After applying the masking, your data will be anonymized according to the defined rules:

    ```sql
    SELECT * FROM users;
    ```

| id  | username    | email                     | phone_number | city        |
| --- | ----------- | ------------------------- | ------------ | ----------- |
| 1   | john_doe    | mcknightjulie@example.org | 5XXX-XXX-67  | New York    |
| 2   | jane_smith  | davidhanson@example.org   | 5XXX-XXX-43  | Los Angeles |
| 3   | peter_jones | michael33@example.org     | 5XXX-XXX-11  | Chicago     |

Note how:
- Email addresses were replaced with fictional but valid looking addresses
- Phone numbers only show the first digit and last two digits
- The `username` and `city` columns remain unchanged as no masking rules were defined for them

</Steps>

## Limitations

- Neon currently only supports static masking with the `anon` extension
- Additional `pg_catalog` functions cannot be declared as `TRUSTED` in Neon's implementation
  
## Conclusion

The `anon` extension provides a toolkit for protecting sensitive data in Postgres databases. 
By defining appropriate masking rules, you can create anonymized datasets that maintain usability while protecting individual privacy.

## Reference

- [PostgreSQL Anonymizer Repository](https://gitlab.com/dalibo/postgresql_anonymizer)
- [Official Documentation](https://postgresql-anonymizer.readthedocs.io/en/latest/)
- [Masking Functions Reference](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/)

<NeedHelp/>
