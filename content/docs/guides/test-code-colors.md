---
title: Test Code Colors
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.646Z'
---

```typescript
export const todos = pgTable(
  'todos',
  {
    id: bigint('id', { mode: 'bigint' }).primaryKey().generatedByDefaultAsIdentity(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text('task').notNull(),
    isComplete: boolean('is_complete').notNull().default(false),
    insertedAt: timestamp('inserted_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // simple CRUD tables use the `crudPolicy` function

    // anyone (anonymous) can read
    crudPolicy({
      role: anonymousRole, // default role
      read: true,
    }),
    // authenticated users can only modify their data
    crudPolicy({
      role: authenticatedRole, // default role
      read: true,
      modify: authUid(table.userId),
    }),
  ]
);
```
