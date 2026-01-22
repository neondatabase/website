---
title: Rate Limiting in Postgres
subtitle: A step-by-step guide describing how to implement rate limiting in Postgres using advisory locks and counters
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-05-09T13:24:36.612Z'
updatedOn: '2025-05-09T13:24:36.612Z'
---

Rate limiting means limiting the number of requests that can happen in a given time window, like 5 requests per minute or 100 requests per hour.
While rate limiting is often implemented in the application layer, you can actually build effective rate limiting systems directly in Postgres.
You can rate limit a certain Postgres query using a combination of advisory locks and counters.

## Steps

- Use advisory locks to synchronize access
- Create a counter table for rate tracking
- Upsert into the `rate_limits` table
- Implement a basic rate limiter with SQL
- Wrap rate limiting in an SQL function

### Use advisory locks to synchronize access

Advisory locks in Postgres are application-level, user-defined locks that help coordinate access to shared resources without blocking unrelated operations.
The advantage of using advisory locks over transactions for rate limiting is that they allow you to synchronize access to a shared key (like a user's counter) without locking rows.

You can grab an exclusive lock on a given key like this:

```sql
SELECT pg_advisory_xact_lock(hashtext('user_123_rate_limit'));
```

This ensures that only one transaction at a time can modify the counter for `user_123`.

### Create a counter table for rate tracking

Start by creating a table to store rate limit counters.
You'll use this table to track how many requests each key (for example, user id or IP address) has made within a time window.

```sql
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL
);
```

Each row represents a rate limit bucket.
`window_start` marks the beginning of the current time window.

### Upsert into the rate_limits table

The key idea behind the `rate_limits` table is to ensure each request either starts a new rate limiting window or increments the count within the current one, if there is a current window.
The logic looks like the following.

1. Try to insert a new counter. If the key doesn't exist yet, insert it with `count = 1` and `window_start = now`.
2. If the key already exists, decide whether the current request is in the same window.
3. If the current time is outside the existing time window (`window_start + window_length <= now`), then reset the count to 1 and start a new window.
4. Otherwise, increment the count and keep the existing window.

Below is the SQL implementation of this logic.

```sql
-- Upsert the counter
INSERT INTO rate_limits (key, count, window_start)
VALUES (rate_limit_key, 1, now)
ON CONFLICT (key) DO UPDATE
SET count = CASE
              WHEN rate_limits.window_start + window_length <= now
                THEN 1
                ELSE rate_limits.count + 1
            END,
    window_start = CASE
                     WHEN rate_limits.window_start + window_length <= now
                       THEN now
                       ELSE rate_limits.window_start
                   END;
```

However, this logic is vulnerable to race conditions.
Two transactions might read the same `window_start` and `count` values at the same time and both think they're within the same rate limit window.
They both calculate `count + 1`, and both write the same new value, which overwrites one of the increments.
That's where advisory locks come in.

### Implement a basic rate limiter with SQL

Below is an implementation of a rate limiter that allows up to 5 requests per minute using advisory locks to avoid any race conditions.
Running the below code 6 times within 1 minute will result in an error: `ERROR: Rate limit exceeded for user_123`

```sql
DO $$
DECLARE
  rate_limit_key TEXT := 'user_123';
  now TIMESTAMPTZ := clock_timestamp();
  max_requests INTEGER := 5;
  window_length INTERVAL := INTERVAL '1 minute';
  current_count INTEGER;
BEGIN
  -- Lock access to the user's counter
  PERFORM pg_advisory_xact_lock(hashtext(rate_limit_key));

  -- Upsert the counter
  INSERT INTO rate_limits (key, count, window_start)
  VALUES (rate_limit_key, 1, now)
  ON CONFLICT (key) DO UPDATE
  SET count = CASE
                WHEN rate_limits.window_start + window_length <= now
                  THEN 1
                  ELSE rate_limits.count + 1
              END,
      window_start = CASE
                       WHEN rate_limits.window_start + window_length <= now
                         THEN now
                         ELSE rate_limits.window_start
                     END;

  -- Read current count
  SELECT count INTO current_count FROM rate_limits WHERE key = rate_limit_key;

  IF current_count > max_requests THEN
    RAISE EXCEPTION 'Rate limit exceeded for %', rate_limit_key;
  END IF;
END $$;
```

### Wrap rate limiting in an SQL function

The above SQL query hard-codes the rate limit key, `max_requests`, and other parameters, making it difficult to reuse.
To make this logic reusable, you can put the logic in an SQL function as follows.

```sql
CREATE OR REPLACE FUNCTION check_rate_limit(rate_key TEXT, max_requests INTEGER, window_seconds INTEGER)
RETURNS VOID AS $$
DECLARE
  now TIMESTAMPTZ := clock_timestamp();
  window_length INTERVAL := make_interval(secs => window_seconds);
  current_count INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(rate_key));

  INSERT INTO rate_limits (key, count, window_start)
  VALUES (rate_key, 1, now)
  ON CONFLICT (key) DO UPDATE
  SET count = CASE
                WHEN rate_limits.window_start + window_length <= now
                  THEN 1
                  ELSE rate_limits.count + 1
              END,
      window_start = CASE
                       WHEN rate_limits.window_start + window_length <= now
                         THEN now
                         ELSE rate_limits.window_start
                     END;

  SELECT count INTO current_count FROM rate_limits WHERE key = rate_key;

  IF current_count > max_requests THEN
    RAISE EXCEPTION 'Rate limit exceeded for %', rate_key;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

Then you can call the function as follows.
The following query checks whether `user_123` has made more than 5 requests in the last minute.

```sql
SELECT check_rate_limit('user_123', 5, 60);
```

You can reuse this function in conjunction with other queries.
For example, if you want to make sure `user_123` can only read the `activity_feed` table 5 times per minute, you can use the following.

```sql
SELECT check_rate_limit('user_123', 5, 60);

SELECT * FROM activity_feed ORDER BY created_at DESC LIMIT 50;
```
