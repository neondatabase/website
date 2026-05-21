---
title: LLM Rules for Postgres
description: Automating Better Code Reviews
excerpt: >-
  Postgres is one of the most versatile databases out there. You can store
  vectors, declare row-level security rules, run background jobs, and more. Its
  simplicity and extensibility make it a workhorse for everything from side
  projects to large-scale systems. But that flexibility c...
date: '2025-08-29T00:11:34'
updatedOn: '2025-08-29T21:34:12'
category: community
categories:
  - community
  - ai
authors:
  - ilya-tkachov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/llm-rules-for-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: LLM Rules for Postgres - Neon
  description: >-
    Learn how LLM rules for Postgres can help you catch performance issues and
    runtime errors before they hit production.
  keywords: []
  noindex: false
  ogTitle: LLM Rules for Postgres - Neon
  ogDescription: >-
    Learn how LLM rules for Postgres can help you catch performance issues and
    runtime errors before they hit production.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/llm-rules-for-postgres/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/llm-rules-for-postgres/neon-llm-rules-1024x576-19b0014a.jpg)

Postgres is one of the most versatile databases out there. You can store vectors, declare row-level security rules, run background jobs, and more. Its simplicity and extensibility make it a workhorse for everything from side projects to large-scale systems.

But that flexibility comes with a trade-off: As your schema grows and more engineers touch it, subtle mistakes creep in. They slow down queries, cause downtime, or make future changes painful.

Traditionally, the safety net has been a senior engineer who “knows the database” reviewing every migration and SQL query. That doesn’t scale. Even with traditional linters, writing and maintaining database-specific rules is tedious.

## Why LLMs Are a Game Changer

Large language models can:

- Enforce database rules with just a well-crafted prompt.
- Adapt checks to your exact schema and ORM style.
- Flag issues before they hit production.

But raw LLM power isn’t enough, you need clear, explicit rules. This is true not only for generating new code and avoiding issues during code generation, but also when using LLMs for code reviews. Good rules make AI-driven reviews predictable, reliable, and team-friendly.

## LLMs for Database-Related Code Reviews

LLMs can review database-related code by reasoning over queries, migrations, and ORM changes in plain text. They spot mistakes that traditional linters often miss, like runtime issues or schema mismatches, and surface them early in the development flow. With explicit rules as guidance, they become a reliable second set of eyes for your team’s reviews.

Below are a set of proven Postgres rules you can drop into your AI code reviewer or coding agent. They’re based on lessons learned building **[wispbit](https://wispbit.com/)**, a Postgres-aware code review bot.

## Rule 1: Prevent Table Locks With Concurrent Indexes

Creating an index without `CONCURRENTLY` blocks writes to the table until it’s built—bad news in production.

❌ **Bad**

```sql
CREATE INDEX idx_users_email ON users(email);
```

✅ **Good**

```sql
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

## Rule 2: Avoid Downtime When Dropping Columns

ORMs may still reference a column after it’s dropped, causing runtime errors. Mark the column as ignored before removing it.

❌ **Bad**

```sql
ALTER TABLE "User" DROP COLUMN "createdAt";
ALTER TABLE "User" DROP COLUMN "updatedAt";
```

✅ **Good** (Prisma example)

```bash
model User {
  createdAt DateTime @default(now()) @ignore
  updatedAt DateTime @updatedAt @ignore
}
```

## Rule 3: Always Index Foreign Keys

Postgres does not automatically add indexes for foreign keys. Without them, joins and deletes can be painfully slow.

❌ **Bad**

```sql
ALTER TABLE orders
ADD CONSTRAINT fk_orders_user_id
FOREIGN KEY (user_id) REFERENCES users(id);
```

✅ **Good**

```sql
ALTER TABLE orders
ADD CONSTRAINT fk_orders_user_id
FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
```

## Rule 4: Enforce Table Column Consistency

Require every table to have `id`, `created_at`, and `updated_at` for consistent auditing and maintainability.

❌ **Bad**

```sql
CREATE TABLE users (
  email VARCHAR(255) NOT NULL
);
```

✅ **Good**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

## Rule 5: Don’t Duplicate Indexes Already Covered

If a composite index covers `(email, username)`, you don’t need a separate index on just `email`.

❌ **Bad**

```python
Index("email_username_idx", "email", "username")
email = mapped_column(String(255), index=True)  # redundant
```

✅ **Good**

```python
Index("email_username_idx", "email", "username")
email = mapped_column(String(255))
```

## Rule 6: Ensure Queries Are Indexed

Every WHERE condition used frequently should have a matching index.

❌ **Bad**

```python
select(User).where(User.email == email)  # no index on email
```

✅ **Good**

```python
email = mapped_column(String(255), index=True)
```

## All Rules in One Place

Add the following rules to your AI code reviewer or coding agent rules list:

```text
1. Prevent table locks: When creating indexes in Postgres, always use CONCURRENTLY
2. Avoid downtime from dropping columns: Mark columns as ignored in ORM schema before dropping them in migrations
3. Always index foreign keys: Add an index for each foreign key constraint
4. Table column consistency: All CREATE TABLE statements must include id, created_at, and updated_at
5. Avoid redundant indexes: Do not create an index already covered by an existing composite index
6. Ensure queries are indexed: Ensure all common WHERE conditions have matching indexes
```

## Closing Thoughts

Postgres is unopinionated by design. That’s a strength, but also a risk when your team grows. By codifying shared best practices into explicit rules and letting an LLM enforce them, you can scale reviews without scaling bottlenecks.

These rules aren’t static. Start with them, then add your own every time you hit an incident. Over time, you’ll turn painful lessons into automatic protection. Ship faster, with fewer 3 a.m. pages.
