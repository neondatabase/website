---
title: The PostgreSQL Anonymizer extension
subtitle: Protect sensitive data in Postgres with the PostgreSQL Anonymizer extension
enableTableOfContents: true
tag: new
updatedOn: '2025-01-22T00:00:00.000Z'
---

The PostgreSQL Anonymizer extension provides a powerful and flexible way to mask or replace sensitive data within your Postgres database, making it an essential tool for protecting personally identifiable information (PII) and commercially sensitive data to ensure privacy, security, compliance, and adherence to regulations such as [GDPR](https://gdpr-info.eu/).

<CTA />

This guide provides an introduction to the PostgreSQL Anonymizer extension. You’ll learn how to enable the extension, declare masking rules, and apply various anonymization techniques such as [static masking](#declaring-static-masking-rules), [dynamic masking](#implementing-dynamic-masking), and creating [anonymized dumps](#creating-anonymous-dumps) of your database.
<Admonition type="note">
PostgreSQL Anonymizer is an open-source extension for Postgres that can be easily enabled on any Neon project.
</Admonition>

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Enable the PostgreSQL Anonymizer extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS anon CASCADE;
```

The `CASCADE` option automatically installs any dependencies required by the `anon` extension.

## Key concepts and masking strategies

The `postgresql_anonymizer` extension offers several powerful features and masking strategies to protect your data. Here's an overview of some key concepts:

### Masking rules

Masking rules are the foundation of the extension. They are declarative, meaning you define _what_ data to mask and _how_ to mask it using SQL syntax, without writing complex procedural code. Masking rules are applied using `SECURITY LABEL` commands and are stored within your database schema, ensuring **privacy by design**.

### Masking functions

The extension comes with a rich set of [built-in masking functions](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/) to perform various anonymization techniques. These functions can be categorized as follows:

#### Faking

Generate realistic-looking fake data.

- **Example functions:** `anon.fake_first_name()`, `anon.dummy_city_name()`

#### Pseudonymization

Create consistent, reversible "fake" data based on a seed value. This is useful for maintaining data relationships while anonymizing.

- **Example function:** `anon.pseudo_email(email)`

#### Randomization

Generate random values within a defined range or from a set.

- **Example functions:** `anon.random_int_between(10, 100)`, `anon.random_in_enum(enum_column)`

#### Partial scrambling

Hide sensitive parts of a string while revealing only specific sections, such as the first and last few characters.

- **Example:** The function `anon.partial(social_security_number, 2, 'XXX-XX-', 1)` masks all but the first 2 characters and the last character of the `social_security_number`, replacing the middle section with a fixed string ('XXX-XX-'). For instance, if `social_security_number` is `1234567890`, the masked value will be `12XXX-XX-0`.

#### Generic hashing

Create one-way hashes of data for irreversible anonymization.

- **Example function:** `anon.hash(email)`

#### Destruction/Nullification

Replace data with static values or `NULL` for complete removal.

- **Example values:** `MASKED WITH VALUE 'CONFIDENTIAL'`, `MASKED WITH VALUE NULL`

#### Adding noise/variance

Slightly alter numerical or date values to maintain data distribution while adding anonymity.

- **Example:** `anon.noise(salary, 0.1)` adds +/- 10% noise to the `salary` column.

#### Generalization

Replace specific values with broader ranges or categories. This is useful for data analysis while preserving anonymity and is often used in masking views.

### Masking methods

The extension provides different methods to apply masking rules, catering to various use cases:

#### Static masking

Permanently modify the original data in your tables by applying the defined masking rules. This is useful for creating anonymized copies of data for archiving or specific purposes.

#### Dynamic masking

Mask data on-the-fly as users query the database. Sensitive data is hidden only for users with the "MASKED" role, while other users see the original data. This is ideal for development and testing environments where different access levels are needed.

#### Anonymous dumps

Create SQL dumps of your database where sensitive data is replaced according to the masking rules. This is useful for sharing anonymized data or creating backups for non-production environments.

#### Masking views

Create views that automatically apply masking rules, providing an anonymized interface to the underlying data without modifying the base tables. This is useful for controlled data access and reporting.

## Declaring static masking rules

Static masking is a straightforward way to permanently anonymize data within a table. Let's walk through an example.

Suppose you have a `users` table with personal information:

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

SELECT * FROM users;
```

The table contains the following data:

| id  | username    | email                   | phone_number | city        |
| --- | ----------- | ----------------------- | ------------ | ----------- |
| 1   | john_doe    | john.doe@example.com    | 555-123-4567 | New York    |
| 2   | jane_smith  | jane.smith@example.com  | 555-987-6543 | Los Angeles |
| 3   | peter_jones | peter.jones@example.com | 555-555-1111 | Chicago     |

You can declare static masking rules using `SECURITY LABEL FOR anon ON COLUMN ... IS 'MASKED WITH ...'`. For example, to mask the `email` and `phone_number` columns:

```sql
-- Mask the email column with a fake email
SECURITY LABEL FOR anon ON COLUMN users.email
IS 'MASKED WITH FUNCTION anon.dummy_safe_email()';

-- Mask the phone_number column by partially scrambling it
SECURITY LABEL FOR anon ON COLUMN users.phone_number
IS 'MASKED WITH FUNCTION anon.partial(phone_number, 1, ''XXX-XXX-'', 2)';
```

Now, apply the static masking to the `users` table:

<Admonition type="warning">
Static masking is irreversible, this operation will permanently modify the data in the table according to the masking rules.
</Admonition>

```sql
SELECT anon.anonymize_table('users');
```

Let's check the data again:

```sql
SELECT * FROM users;
```

| id  | username    | email                     | phone_number | city        |
| --- | ----------- | ------------------------- | ------------ | ----------- |
| 1   | john_doe    | mcknightjulie@example.org | 5XXX-XXX-67  | New York    |
| 2   | jane_smith  | davidhanson@example.org   | 5XXX-XXX-43  | Los Angeles |
| 3   | peter_jones | michael33@example.org     | 5XXX-XXX-11  | Chicago     |

You will see that the `email` and `phone_number` columns have been **permanently replaced** with masked values according to the rules you defined. The original data is no longer present in these columns.

## Implementing dynamic masking

Dynamic masking allows you to control data visibility based on user roles. Let's see how to set it up.

First, enable transparent dynamic masking at the database level:

```sql
ALTER DATABASE neondb SET anon.transparent_dynamic_masking = true;
```

_Make sure to reconnect to your database for this setting to take effect._

Next, create a role that will be masked, for example, `data_analyst`:

```sql
CREATE ROLE data_analyst LOGIN PASSWORD 'analyst_password';
SECURITY LABEL FOR anon ON ROLE data_analyst IS 'MASKED';
GRANT pg_read_all_data TO data_analyst;
```

Now, define masking rules that will be applied to the `data_analyst` role. Let's mask the `city` and `username` columns in the `users` table:

```sql
-- Mask the city column with a static value
SECURITY LABEL FOR anon ON COLUMN users.city
IS 'MASKED WITH VALUE ''Confidential Location''';

-- Mask the username column with a custom function
SECURITY LABEL FOR anon ON COLUMN users.username
IS 'MASKED WITH FUNCTION anon.dummy_username()';
```

Connect to Neon as the `data_analyst` user and query the `users` table:

<Admonition type="important">
Make sure to connect as the `data_analyst` user to see the dynamic masking in action.
</Admonition>

```sql
SELECT * FROM users;
```

| id  | username          | email                         | phone_number | city                  |
| --- | ----------------- | ----------------------------- | ------------ | --------------------- |
| 1   | christy_provident | harrisonalexander@example.com | 5XXX-XXX-67  | Confidential Location |
| 2   | rudolph_error     | tedwards@example.com          | 5XXX-XXX-43  | Confidential Location |
| 3   | owen_nemo         | jamesjackson@example.net      | 5XXX-XXX-11  | Confidential Location |

You will observe that the `username` and `city` columns are masked according to the rules you defined. The `city` column shows the static value 'Confidential Location', and the `username` column displays fake usernames generated by the `dummy_username()` function.

Now, connect as a regular user (`neondb_owner` - the database owner) and query the `users` table again:

```sql
-- Connect as the database owner
SELECT * FROM users;
```

| id  | username    | email                     | phone_number | city        |
| --- | ----------- | ------------------------- | ------------ | ----------- |
| 1   | john_doe    | mcknightjulie@example.org | 5XXX-XXX-67  | New York    |
| 2   | jane_smith  | davidhanson@example.org   | 5XXX-XXX-43  | Los Angeles |
| 3   | peter_jones | michael33@example.org     | 5XXX-XXX-11  | Chicago     |

You will see the original data in the `username` and `city` columns, as dynamic masking is applied only to the `data_analyst` role. We still see the masked `email` and `phone_number` columns, as they were statically masked earlier.

## Creating anonymous dumps

To create an anonymized SQL dump of your database, you can leverage the `pg_dump` utility along with the PostgreSQL Anonymizer extension.

First, create a dedicated role for generating anonymous dumps, and mark this role as masked:

```sql
CREATE ROLE anon_dump_user LOGIN PASSWORD 'dump_password';
ALTER ROLE anon_dump_user SET anon.transparent_dynamic_masking = true;
SECURITY LABEL FOR anon ON ROLE anon_dump_user IS 'MASKED';
GRANT pg_read_all_data TO anon_dump_user;
```

Now, using your terminal or command prompt, you can use `pg_dump` connecting as the `anon_dump_user` to export an anonymized dump:

```bash
pg_dump -U anon_dump_user -h <your_neon_hostname> -p 5432 <your_neon_database> -f anonymized_dump.sql --no-security-labels --exclude-extension="anon"
```

_Replace `<your_neon_hostname>` and `<your_neon_database>` with your Neon connection details._

This command will generate an `anonymized_dump.sql` file containing a database dump where sensitive data is masked according to the rules you've set, ensuring that the dump is safe for sharing or use in non-production environments. The `--no-security-labels` option is important to prevent the masking rules themselves from being included in the dump, further securing your anonymization policy. `--exclude-extension="anon"` (available in pg_dump 17+) or `--extension plpgsql` ensures the extension itself is not included in the dump.

## Conclusion

The PostgreSQL Anonymizer extension provides a robust and versatile toolkit for data masking and anonymization directly within your Postgres database. By leveraging its declarative masking rules, diverse masking functions, and different masking methods, you can effectively protect sensitive data for various use cases, including development, testing, data sharing, and compliance.

## Reference

- [PostgreSQL Anonymizer](https://gitlab.com/dalibo/postgresql_anonymizer)
- [PostgreSQL Anonymizer Documentation](https://postgresql-anonymizer.readthedocs.io/en/latest/)
- [Data Masking with PostgreSQL Anonymizer: A practical guide](https://dalibo.gitlab.io/postgresql_anonymizer/how-to.handout.pdf)
- [Complete list of PostgreSQL Anonymizer masking functions](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/)

<NeedHelp/>
