---
title: The postgresql_anonymizer extension
subtitle: Anonymize sensitive data in Postgres using static and dynamic masking
enableTableOfContents: true
updatedOn: '2024-03-17T20:32:29.796Z'
---

`postgresql_anonymizer` is a Postgres extension that provides data masking capabilities to protect sensitive information. It allows you to anonymize data using various masking techniques, such as replacing values with plausible fake values, scrambling, hashing, or adding noise to the data. 

This is particularly useful when working with sensitive data like personally identifiable information (PII), financial data, or health records. Organizations can use data masking to comply with data privacy regulations, such as GDPR and HIPAA, while still being able to use the data for testing, analytics, or sharing with third parties.

The extension supports two types of masking:
- **Static masking**: Permanently replaces the original data with masked values in the database.
- **Dynamic masking**: Masks the data in real-time when it is queried, without altering the original data in the database.

<CTA />

In this guide, we'll learn how to set up and use the `postgresql_anonymizer` extension with your Neon Postgres project. We'll cover how to enable the extension, define masking rules, and apply static and dynamic masking to your data.

<Admonition type="note">
    `postgresql_anonymizer` is an open-source Postgres extension that can be installed in any Neon project using the instructions below. Detailed installation instructions and compatibility information can be found in the [postgresql_anonymizer](https://gitlab.com/dalibo/postgresql_anonymizer) documentation.
</Admonition>

## Enable the `postgresql_anonymizer` extension
You can enable the extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION IF NOT EXISTS anon CASCADE;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor). 

**Version Compatibility:**
`postgresql_anonymizer` works with Postgres 9.6 and above.

## Example: Masking sensitive customer data

Consider an e-commerce platform that stores customer information in a `customers` table. The table contains sensitive data like email addresses, phone numbers, and credit card details that need to be protected.

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    credit_card TEXT,
    join_date DATE DEFAULT CURRENT_DATE
);
```

Let's insert some sample data into the `customers` table:

```sql
INSERT INTO customers (first_name, last_name, email, credit_card, join_date)
VALUES
    ('John', 'Doe', 'john.doe@example.com', '4111111111111111', '2022-01-15'),
    ('Jane', 'Smith', 'jane.smith@example.com', '4222222222222222', '2022-07-24'),
    ('Alice', 'Johnson', 'alice.johnson@example.com', '4333333333333333', '2023-02-11'),
    ('Bob', 'Williams', 'bob.williams@example.com', '4444444444444444', '2023-09-30'),
    ('Emma', 'Brown', 'emma.brown@example.com', '4555555555555555', '2024-03-17');
```

Next, we will define masking rules to protect the sensitive data in the `customers` table. We'll illustrate both static and dynamic masking techniques below. 

### Static masking

#### Create a new branch

Static masking is a _destructive_ operation since it permanently replaces the original data with the masked values in the database. Hence, we will create a new branch of the database to illustrate it. 

`Neon` offers a unique `branching` feature that lets you make copies of your database. They are low-cost, copy-on-write clones of your database that are created instantly, for testing, development, or other purposes. To create a new branch, navigate to your Neon project in the dashboard and click on the `Branches` tab from the sidebar. Click on the `Create Branch` button to create a new branch and give it a name, such as `masked_data`. 

If you are using `psql`, you can fetch the connection string for the new branch by selecting it from the list of branches in the `Connection Details` section of your Neon project dashboard. The `SQL Editor` in the Neon console also has a dropdown to select the branch you want to run queries against. 

#### Defining masking rules

To anonymize the sensitive data in the `customers` table, we need to define masking rules for each column that needs to be protected.
Make sure you are working against the new branch we created above. 

`Postgresql_anonymizer` follows a declarative approach of anonymization. Masking rules can be declarted the PostgreSQL Data Definition Language (DDL) and specify your anonymization strategy inside the table definition itself.

Run the following SQL statements to define masking rules for the `email` and `credit_card` columns:

```sql
-- Mask email addresses
SECURITY LABEL FOR anon ON COLUMN customers.email 
IS 'MASKED WITH FUNCTION anon.fake_email()';

-- Mask credit card numbers
SECURITY LABEL FOR anon ON COLUMN customers.credit_card
IS 'MASKED WITH FUNCTION anon.partial(credit_card, 2, ''xx-xxxx-xxxx-'', 4)';
```

In this example, `anon.fake_email` replaces email addresses with fake email addresses that preserve the format. While, `anon.partial` masks credit card numbers by replacing all but the first 2 and the last 4 digits with asterisks. 

To apply the masking rules and anonymize the data in the `customers` table, run the following SQL statement:

```sql
SELECT anon.anonymize_table('customers');
```

Now, to verify that the data has been masked, you can query the `customers` table:

```sql
SELECT * FROM customers;
```

This query returns the following data:

```text
 customer_id | first_name | last_name |          email           |     credit_card     | join_date
-------------+------------+-----------+--------------------------+---------------------+------------
           1 | John       | Doe       | sjimenez@graham.org      | 41xx-xxxx-xxxx-1111 | 2022-01-15
           2 | Jane       | Smith     | lukereed@smith.info      | 42xx-xxxx-xxxx-2222 | 2022-07-24
           3 | Alice      | Johnson   | whitneyjodi@rojas.com    | 43xx-xxxx-xxxx-3333 | 2023-02-11
           4 | Bob        | Williams  | mckinneydakota@yahoo.com | 44xx-xxxx-xxxx-4444 | 2023-09-30
           5 | Emma       | Brown     | xritter@yahoo.com        | 45xx-xxxx-xxxx-5555 | 2024-03-17
(5 rows)
```

We can see that the `email` and `credit_card` columns have been replaced with fake/masked values, while the other columns remain unchanged. 

### Dynamic masking

To mask the data in real-time when it is queried, without altering the original data, you can use dynamic masking. 

This is specifically helpful for scenarios where you need to share data with third parties or for testing purposes. You can create a new role for the test users and apply masking rules that apply only when the role is used to query the data. This way, the original database and queries can be used for development and testing purposes without exposing sensitive information. 

We will revert back to the `main` branch of the project for this example since dynamic masking rules can be applied and removed at any time without affecting the original data.

#### Creating a new role

To create a new role, run the following SQL statement:

```sql
CREATE ROLE test_user LOGIN password 'change-me-123';
GRANT SELECT ON TABLE customers TO test_user;
SECURITY LABEL FOR anon ON ROLE test_user IS 'MASKED';
```

In this example, we created a new role `test_user` with a password and granted `SELECT` permission on the `customers` table. We also applied a security label to it to indicate that any masking rules defined for the database will apply when the `test_user` role is used to query the data. 

Now, we can define some dynamic masking rules for the `customers` table. 

```sql
SECURITY LABEL FOR anon ON COLUMN customers.email
IS 'MASKED WITH FUNCTION anon.fake_email()';
SECURITY LABEL FOR anon ON COLUMN customers.join_date
IS 'MASKED WITH FUNCTION anon.dnoise(customers.join_date, ''28 days''::interval)';
SELECT anon.start_dynamic_masking();
```

In this example, we are masking the `email` column with fake email addresses and the `join_date` column by adding noise to the date. To test the dynamic masking, connect to the database using the `test_user` role and query the `customers` table:

```sql
SELECT * FROM customers;
```

The results will look similar to this:

```text
 customer_id | first_name | last_name |            email            |   credit_card    | join_date
-------------+------------+-----------+-----------------------------+------------------+------------
           1 | John       | Doe       | avaughan@johnson-snyder.com | 4111111111111111 | 2022-01-20
           2 | Jane       | Smith     | xmiller@green.biz           | 4222222222222222 | 2022-08-02
           3 | Alice      | Johnson   | sandradunlap@klein.info     | 4333333333333333 | 2023-02-10
           4 | Bob        | Williams  | dustinhardin@hotmail.com    | 4444444444444444 | 2023-10-26
           5 | Emma       | Brown     | ddominguez@anthony.com      | 4555555555555555 | 2024-03-26
(5 rows)
```

The query results have masked data for the `email` and `join_date` columns, while the other columns retain their original values.

## Conclusion

The `postgresql_anonymizer` extension provides a powerful and flexible way to protect sensitive data in your Postgres database. By leveraging static and dynamic masking techniques, you can ensure that sensitive information is anonymized while still preserving the utility of the data for various purposes, such as testing, analytics, or sharing with third parties.

## Reference
- [postgresql_anonymizer Documentation](https://gitlab.com/dalibo/postgresql_anonymizer)