---
title: Caching layer in Postgres
subtitle: A step-by-step guide describing how to use materialized views for caching in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-03-21T13:24:36.612Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Postgres provides several tools to optimize query performance, including caching layers that help reduce expensive computations.
[Materialized views](https://www.postgresql.org/docs/current/rules-materializedviews.html) can be used for caching: materialized views store the results of a query and can be refreshed on demand.
This approach is particularly useful for complex aggregations, expensive joins, and frequently accessed datasets that do not require real-time updates.

## Steps

- Create the orders table
- Insert sample data into the orders table
- Create a materialized view
- Refresh the materialized view
- Index the materialized view for performance
- Automate materialized view refreshes

### Create the orders table

Before inserting sample data, create the `orders` table:

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Insert sample data into the orders table

Now, let's insert some sample data into the `orders` table so we can see real results:

```sql
INSERT INTO orders (customer_id, total_price, created_at) VALUES
(1, 100.00, NOW() - INTERVAL '1 day'),
(2, 250.50, NOW() - INTERVAL '2 days'),
(3, 75.25, NOW() - INTERVAL '3 days'),
(1, 300.00, NOW() - INTERVAL '3 days'),
(2, 450.75, NOW() - INTERVAL '4 days');
```

### Create a materialized view

Suppose you want to answer queries like "which days did we receive the most orders over the last month?"
This would require a complex query that may be slow.
Instead of recalculating revenue per day on every query, you can store daily revenue as a materialized view.

```sql
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT DATE(created_at) AS order_date, SUM(total_price) AS total_revenue
FROM orders
GROUP BY order_date;
```

### Query the materialized view

This materialized view stores total revenue per day, allowing for fast lookups of daily sales trends without needing to aggregate the full `orders` table repeatedly.
For example, you can execute a query to find the daily revenue for 3 days ago:

```sql
SELECT * FROM daily_revenue WHERE order_date = DATE(NOW() - INTERVAL '3 days');
```

Or you can sort days by `total_revenue` as follows.

```sql
SELECT * FROM daily_revenue ORDER BY total_revenue DESC;
```

The above query returns the following result, which shows the days with the most order revenue.

| #   | order_date | total_revenue |
| --- | ---------- | ------------- |
| 1   | 2025-03-17 | 450.75        |
| 2   | 2025-03-18 | 375.25        |
| 3   | 2025-03-19 | 250.50        |
| 4   | 2025-03-20 | 100.00        |

### Refresh the materialized view

Materialized views need to be refreshed to reflect updated data.
You can refresh a materialized view manually as follows.

```sql
REFRESH MATERIALIZED VIEW daily_revenue;
```

If the query should be available while refreshing, use the `CONCURRENTLY` option:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_revenue;
```

This allows the materialized view to remain accessible while it's being refreshed, but requires a unique index on the view. Without `CONCURRENTLY`, the materialized view is locked during the refresh, making it temporarily unavailable for queries.

### Index the materialized view for performance

Adding indexes to materialized views can improve query performance. Because `order_date` has one row per day, a unique index works here, and it's also the unique index that `REFRESH MATERIALIZED VIEW CONCURRENTLY` requires:

```sql
CREATE UNIQUE INDEX idx_daily_revenue_date ON daily_revenue(order_date);
```

### Automate materialized view refreshes

To keep the materialized view updated automatically, use an external **cron job** or the [`pg_cron`](/docs/extensions/pg_cron) extension. Here's an example using `pg_cron` to refresh every hour:

```sql
SELECT cron.schedule('refresh_daily_revenue', '0 * * * *', $$REFRESH MATERIALIZED VIEW CONCURRENTLY daily_revenue$$);
```

On Neon, `pg_cron` has to be enabled before you can install it, and its jobs only run while the compute is active. See [The pg_cron extension](/docs/extensions/pg_cron) for setup steps.
