---
title: Queue System using SKIP LOCKED in Neon Postgres
subtitle: A step-by-step guide describing how to structure a tasks table for use as a task queue in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-01-10T17:48:36.612Z'
updatedOn: '2025-01-10T17:48:36.612Z'
isFeatured: true
---

The `SKIP LOCKED` clause allows concurrent transactions to skip rows currently locked by other transactions.
This behavior makes `SKIP LOCKED` ideal for implementing a non-blocking task queue in Postgres.

## Steps

- Create a tasks table
- Insert tasks into the queue
- Fetch tasks using SKIP LOCKED
- Mark tasks as completed
- Track stuck tasks
- Optimize with indexing

## Create a tasks table

First, you need a table to store your tasks.
Each task should have a unique identifier, a status, and a payload containing the task to run and any parameters.
Use the following SQL statement to create the tasks table:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP
);
```

This table defines a tasks queue with a `payload` column containing semi-structured task-specific data as a `JSONB`.

## Insert tasks into the queue

Next, populate the tasks table with sample data. Each task is represented as a JSON object in the `payload` column:

```sql
INSERT INTO tasks (payload) VALUES
  ('{"task": "email", "recipient": "user1@example.com"}'),
  ('{"task": "email", "recipient": "user2@example.com"}'),
  ('{"task": "report", "type": "sales"}');
```

You can then verify the rows in the task collection using the following.

```sql
SELECT * FROM tasks;
```

## Fetch tasks using `SKIP LOCKED`

When implementing a task queue, it is important to ensure that only one worker can run a given task, otherwise you may end up with tasks running multiple times.
`FOR UPDATE SKIP LOCKED` ensures that only one process retrieves and locks tasks, while others skip over already-locked rows.

Here’s a query to fetch and lock a single task.

```sql
WITH cte AS (
  SELECT id
  FROM tasks
  WHERE status = 'pending'
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
UPDATE tasks
SET status = 'in_progress', started_at = CURRENT_TIMESTAMP
FROM cte
WHERE tasks.id = cte.id
RETURNING tasks.*;
```

This query:

1. Selects the oldest task with status `pending`.
2. Locks the task row to prevent other transactions from processing it.
3. Updates the task's status to `in_progress` and records the task's `started_at`.

## Mark tasks as completed

After processing a task, you should update the task's status to `completed` to indicate that it's finished:

```sql
UPDATE tasks
SET status = 'completed'
WHERE id = <task id here>;
```

## Track stuck tasks

In production, tasks may get stuck `in_progress` due to worker errors.
To identify tasks that may be hanging, you can query for tasks that have been in progress for more than 5 minutes as follows.

```sql
SELECT *
FROM tasks
WHERE status = 'in_progress'
  AND started_at < NOW() - INTERVAL '5 minutes';
```

## Optimize with indexing

As the number of tasks grows, queries on tasks can get slow.
Adding an index on the `status` and `created_at` columns can help ensure consistent performance for the `SKIP LOCKED` query:

```sql
CREATE INDEX idx_tasks_status_created_at
ON tasks (status, created_at);
```
