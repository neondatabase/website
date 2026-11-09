---
title: Provide read-only access with Read Replicas
subtitle: Use read replicas to provide read-only access to your data
summary: >-
  Neon read replicas let you grant read-only database access to partners,
  third-party apps, or analysts by routing SELECT queries to an isolated compute
  that blocks all writes (SQLSTATE 25006). Use this approach when you need to
  share live data for reporting or audits without risking changes to production.
  Setup requires creating the replica, a read-only role, and a connection string
  for that role.
enableTableOfContents: true
updatedOn: '2026-09-16T19:45:35.340Z'
---

When you create a read replica in Neon, you gain the ability to provide read-only access to your data. Use it when you want to grant access to users, partners, or third-party applications that only need to run queries to analyze data, generate reports, or audit your database. Since no write operations are permitted on read replicas, it ensures the integrity of your data while allowing others to work with up-to-date information.

Suppose you need to give a partner read-only access to your sales data so they can generate custom reports for your business. Here's how you would go about doing that:

1. **Create a read replica**

   <Admonition type="note">
   On paid plans (Launch and Scale), you can add up to 6 read replicas per branch. The Agent plan allows up to 3, and the Free plan is limited to 3 read replica computes per project.
   </Admonition>

   Follow these steps to create a read replica for your database branch:
   - In the Neon Console, go to **Branches**.
   - Select the branch that contains your data.
   - Click **Add Read Replica** to create a dedicated compute instance for read operations.

2. **Create a read-only role**

   Roles you create in the Console or the Neon API join the `neon_superuser` role, which gives them admin privileges. Create a read-only role for the partner instead. With the Neon CLI, pass `--access read_only`:

   ```bash shouldWrap
   neon roles create --name partner --access read_only --project-id <project_id> --branch <branch_name>
   ```

   The command prints the role's password once. Save it, or run `neon roles reset-password` later to get a new one. The role can read the tables the database owner owns, but it can't write to them.

3. **Provide the connection string**

   Once the read replica is created, get the connection string for the partner's role and the replica compute. With the Neon CLI, pass `--endpoint-type read_only`:

   ```bash shouldWrap
   neon connection-string <branch_name> --project-id <project_id> --role-name partner --database-name dbname --endpoint-type read_only
   ```

   In the Neon Console, you can get the same string instead:
   - Click the **Connect** button in the Console nav. Select the branch, the database, and the role.
   - Choose **Replica** compute under the compute settings.
   - Copy the connection string.

   The string looks like this:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
   ```

   Share the string with your partner.

4. **Read-only access for the partner**

   The partner can now use this connection string to connect to the read replica and run any `SELECT` queries they need for reporting purposes, such as:

   ```sql
   SELECT product_id, SUM(sale_amount) as total_sales
   FROM sales
   WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 year')
   GROUP BY product_id;
   ```

   This query runs on the read replica's own compute, not on your read/write compute.

5. **Write operations are not permitted**

   Since the connection is to a read replica, the partner will not be able to run any write operations. If they attempt to run a `DELETE`, `INSERT`, or `UPDATE` query, they will receive an error message like this:

   ```bash
   ERROR: cannot execute INSERT in a read-only transaction (SQLSTATE 25006)
   ```

   DDL statements, such as `CREATE TABLE` and `ALTER TABLE`, fail with the same error. For more on this error, see [cannot execute in a read-only transaction](/docs/connect/connection-errors#error-read-only-transaction).

<NeedHelp/>
