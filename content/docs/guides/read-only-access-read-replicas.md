---
title: Provide read-only access with Read Replicas
subtitle: Leverage read replicas to provide read-only access to your data
enableTableOfContents: true
updatedOn: '2024-08-27T12:23:05.816Z'
---

When you create a read replica in Neon, you gain the ability to provide read-only access to your data. This is particularly useful when you want to grant access to users, partners, or third-party applications that only need to run queries to analyze data, generate reports, or audit your database. Since no write operations are permitted on read replicas, it ensures the integrity of your data while allowing others to work with up-to-date information.

Suppose you need to give a partner read-only access to your sales data so they can generate custom reports for your business. Here’s how you would go about doing that:

1. **Create a read replica**
   
   Follow these steps to create a read replica for your database branch:
   - In the Neon Console, go to **Branches**.
   - Select the branch that contains your data.
   - Click **Add Read Replica** to create a dedicated compute instance for read operations.

2. **Provide the connection string**  
   
   Once the read replica is created, obtain the connection string from the Neon Console:
   - On the **Connection Details** section of the your **Project Dashboard**, select the branch, the database, and the role.
   - Choose **Replica** compute under the compute settings.
   - Copy the connection string and provide it to your partner. The connection string might look something like this:

        ```bash shouldWrap
        postgresql://partner:partner_password@ep-read-replica-12345.us-east-2.aws.neon.tech/sales_db?sslmode=require
        ```

3. **Read-only access for the partner**

    The partner can now use this connection string to connect to the read replica and run any `SELECT` queries they need for reporting purposes, such as:

    ```sql
    SELECT product_id, SUM(sale_amount) as total_sales
    FROM sales
    WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 year')
    GROUP BY product_id;
    ```

    This query will run efficiently on the read replica without impacting the performance of your production database, since read replicas run on an isolated compute instance.

4. **Write operations are not permitted**

    Since the connection is to a read replica, the partner will not be able to run any write operations. If they attempt to run a `DELETE`, `INSERT`, or `UPDATE` query, they will receive an error message like this:

    ```bash
    ERROR: cannot execute INSERT in a read-only transaction (SQLSTATE 25006)
    ```

## Benefits of providing read-only access

- **Data integrity**: The read-only connection ensures that no accidental or unauthorized changes are made to your data.
- **Offloading reporting workloads**: Analytics queries can be run on the read replica without affecting your production database's performance.
- **Secure access**: The read replica provides a secure way to share data without giving full control or write access.
