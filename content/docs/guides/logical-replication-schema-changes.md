---
title: Managing schema changes in a logical replication setup
subtitle: Learn about managing schema changes in a logical replication setup
enableTableOfContents: true
isDraft: false
updatedOn: '2024-09-04T18:53:01.155Z'
---

When working with Postgres logical replication, managing schema changes is a task that requires careful planning. As stated in the [PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-restrictions.html):

"_The database schema and DDL commands are not replicated. The initial schema can be copied by hand using `pg_dump --schema-only`. Subsequent schema changes would need to be kept in sync manually. (Note, however, that there is no need for the schemas to be absolutely the same on both sides.) Logical replication is robust when schema definitions change in a live database: When the schema is changed on the publisher and replicated data starts arriving at the subscriber but does not fit into the table schema, replication will error until the schema is updated. In many cases, intermittent errors can be avoided by applying additive schema changes to the subscriber first._"

This guidance highlights key considerations and best practices for handling schema changes in a logical replication setup.

## Schema management in a logical replication context

Logical replication in Postgres is designed to replicate data changes (inserts, updates, and deletes) but not schema changes (DDL commands). This means that any modifications to the database schema, such as adding or dropping columns, need to be manually applied to both the publisher and the subscriber databases.

Since the schemas do not need to be exactly the same on both sides, you have some flexibility. However, inconsistencies in the schema can lead to replication errors if the subscriber cannot accommodate incoming data due to schema mismatches.

To ensure smooth schema changes in a logical replication setup, follow these best practices:

### 1. Apply additive schema changes to the subscriber first

Additive changes, such as adding a new column or creating an index, should be applied to the subscriber before they are applied to the publisher. This approach ensures that when the new data is replicated from the publisher, the subscriber is already prepared to handle it. For example:

- **Add a new column on the subscriber:**

  ```sql
  ALTER TABLE your_table_name ADD COLUMN new_column_name data_type;
  ```

- **Add the same column on the publisher:**

  ```sql
  ALTER TABLE your_table_name ADD COLUMN new_column_name data_type;
  ```

By doing this, you prevent replication errors caused by the subscriber not recognizing the new column in incoming data.

### 2. Handle non-additive schema changes with caution

Non-additive changes, such as dropping a column or altering a column's data type, require careful handling. When performing a non-additive schema change like dropping a column, apply the change on the publisher first, then on the subscriber. These changes are typically feasible if applied in the correct order (publisher first). 

However, always carefully assess how the schema change will impact replication to the subscriber. Will writes still succeed on the subscriber after the change on the publisher? It’s best practice to test schema changes before implementing them in production. For example, test whether writes to the modified publisher schema still execute successfully on the unmodified subscriber schema.

Mistakes in the schema update process could disrupt replication on the subscriber, requiring troubleshooting and reestablishing replication.

For an added degree of safety or complex schema changes, consider temporarily pausing write activity on the publisher before applying schema changes. The steps in this approach involve:

- **Pausing writes on the publisher:** Pause writes on the publisher by stopping or pausing the application that handles inserts, updates, and deletes, or by revoking write permissions on the roles that write to the database. Other methods may also be available depending on your environment.
- **Applying schema changes on the publisher:** Apply the necessary schema changes to the publisher.
- **Applying schema changes on the subscriber:** Once the publisher changes are complete, apply the schema changes to the subscriber.
- **Resuming writes:** After verifying that the changes are successful, resume normal write operations.

### 3. Monitor and verify replication

After applying schema changes and resuming writes if they were paused, it's important to verify that data is being replicated between the publisher and subscriber.

To do this, you can run the following query on the subscriber to make sure the `last_msg_receipt_time` is very recent and as expected based on the write activity on the publisher.

```sql shouldWrap
SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time FROM pg_catalog.pg_stat_subscription;
```

You can also perform a row count on the publisher and subscriber databases to make sure results are the same or close if replication is actively adding rows.

```sql
SELECT COUNT(*) FROM your_table_name;
```

## Schema migration tools

Tools like [Flyway](https://flywaydb.org/) and [Liquibase](https://www.liquibase.org/) can assist in managing schema changes by ensuring they are applied consistently across multiple databases. These tools track the history of each change and ensure updates are applied in the correct sequence. Integrating such tools into your workflow can improve the reliability and organization of your schema migrations, though it may require adjustments to your existing process.

If you're unfamiliar with these tools, check out the following guides to get started with Neon:

- [Get started with Flyway and Neon](/docs/guides/flyway)
- [Get started with Liquibase and Neon](/docs/guides/liquibase)

For guidance on managing schemas across multiple databases, see:

- [Flyway: A simple way to manage multiple environment deployments](https://www.red-gate.com/blog/a-simple-way-to-manage-multi-environment-deployments)
- [How to set up Liquibase with an Existing Project and Multiple Environments](https://docs.liquibase.com/workflows/liquibase-community/existing-project.html)

Some Object Relational Mappers (ORMs) also support schema migration management across multiple database environments. For example, with Prisma ORM, you can configure multiple `.env` files. Learn more at [Using multiple .env files](https://www.prisma.io/docs/orm/more/development-environment/environment-variables/using-multiple-env-files).

Regardless of the schema management tool you choose, ensure that changes adhere to the guidelines for [additive](#1-apply-additive-schema-changes-to-the-subscriber-first) and [non-additive](#2-handle-non-additive-schema-changes-with-caution) schema changes. These can be applied manually or through automated scripts.

If you have suggestions, tips, or requests regarding schema management in a replication setup, please let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or through our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

## References

- [PostgreSQL logical replication restrictions](https://www.postgresql.org/docs/current/logical-replication-restrictions.html)
- [Import a database schema](/docs/import/import-schema-only)
