---
title: Scale your application with Read Replicas
subtitle: Scale your app with read replicas using built-in framework support
enableTableOfContents: true
updatedOn: '2024-10-08T10:58:34.745Z'
---

In Neon, a read replica is an independent read-only compute that performs read operations on the same data as your primary read-write compute, which means adding a read replica to a Neon project requires no additional storage.

A key benefit of read replicas is that you can distribute read requests to one or more read replicas, enabling you to easily scale your applications and achieve higher throughput for both read-write and read-only workloads.

Many application frameworks offer built-in support for managing read replicas or multiple databases, making it easy to integrate Neon read replicas into an existing application. Below, we provide examples for popular frameworks and tools, but there are many others. Refer to your provider's documentation for specific details about integrating read replicas or multiple databases.

## Prisma

In Prisma, the read replicas extension, `@prisma/extension-read-replicas`, adds support for read replicas to Prisma Client.

You start by installing the extension:

```bash
npm install @prisma/extension-read-replicas
```

You can then initialize the extension by extending your Prisma Client instance and providing a connection string that points to your read replica in the `url` option of the extension:

```javascript
import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

const prisma = new PrismaClient().$extends(
  readReplicas({
    url: process.env.DATABASE_URL_REPLICA,
  })
);

// Query is run against the database replica
await prisma.post.findMany();

// Query is run against the primary database
await prisma.post.create({
  data: {
    /** */
  },
});
```

All read operations, such as `findMany`, are executed against the read replica in the setup shown above. All write operations, such as create, update, and `$transaction` queries, are run against your primary compute.

For more, including configuring multiple read replicas, refer to [Read Replicas](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/read-replicas) in the Prisma documentation.

**Example**: For a full example, see [Use Read Replicas with Prisma](https://neon.tech/docs/guides/read-replica-prisma).

## Drizzle ORM

With Drizzle ORM, you can leverage the `withReplicas()` function to direct `SELECT` queries to read replicas, and create, delete, and update operations to your primary compute, as shown in the following example:

```javascript
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { boolean, jsonb, pgTable, serial, text, timestamp, withReplicas } from 'drizzle-orm/pg-core';
const usersTable = pgTable('users', {
  id: serial('id' as string).primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
  jsonb: jsonb('jsonb').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
const primaryDb = drizzle("postgres://user:password@host:port/primary_db");
const read1 = drizzle("postgres://user:password@host:port/read_replica_1");
const read2 = drizzle("postgres://user:password@host:port/read_replica_2");
const db = withReplicas(primaryDb, [read1, read2]);
```

You can then use the `db` instance the same way you do already, and Drizzle will direct requests to read replicas and your primary compute automatically.

```sql
// Read from either the read1 connection or the read2 connection
await db.select().from(usersTable)

// Use the primary compute for the delete operation
await db.delete(usersTable).where(eq(usersTable.id, 1))
```

For more, refer to [Read Replicas](https://orm.drizzle.team/docs/read-replicas) in the Drizzle documentation.

**Example application**: For a full example, refer to this Neon community guide: [Scale your Next.js application with Drizzle ORM and Neon Postgres Read Replicas](https://neon.tech/guides/read-replica-drizzle).

## Laravel

To scale your Laravel application with Neon read replicas, you can configure Laravel’s database settings and use Eloquent ORM to route read operations to replicas and write operations to your primary compute.

For example, in your `config/database.php`, you can configure read and write connection settings and then route traffic accordingly.

```php
'pgsql' => [
    'driver' => 'pgsql',
    'read' => [
        'host' => env('DB_READ_HOST'),
    ],
    'write' => [
        'host' => env('DB_WRITE_HOST'),
    ],
    'sticky'    => true,
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => env('DB_CHARSET', 'utf8'),
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'prefer',
],
```

**Example application**: For a full setup, refer to this Neon community guide: [Scale your Laravel application with Neon Postgres Read Replicas](https://neon.tech/guides/read-replica-laravel).

## Django

In Django, you can use the `DATABASES` setting to to tell Django about the primary and read replica databases you’ll be using:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'your_primary_host',
        'PORT': '5432',
    },
    'replica': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'your_read_replica_host',
        'PORT': '5432',
    }
}
DATABASE_ROUTERS = ['notes.db_router.PrimaryReplicaRouter']
```

You can then use the `PrimaryReplicaRouter` class to define routing logic for read and write database operations.

```python
class PrimaryReplicaRouter:
    def db_for_read(self, model, **hints):
        return 'replica'
    def db_for_write(self, model, **hints):
        return 'default'
    def allow_relation(self, obj1, obj2, **hints):
        return True
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return True
```

For more, see [Multiple databases](https://docs.djangoproject.com/en/5.1/topics/db/multi-db/) in the Django documentation.

**Example application**: For a complete setup, refer to this Neon community guide: [Scale your Django application with Neon Postgres Read Replicas](https://neon.tech/guides/read-replica-django).

## Entity Framework Core

To scale your .NET application with Neon read replicas, you can configure separate read and write contexts using Entity Framework Core's `DbContext` class.

```csharp
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }
        public DbSet<Todo> Todos => Set<Todo>();
    }

    public class TodoDbReadContext : DbContext
    {
        public TodoDbReadContext(DbContextOptions<TodoDbReadContext> options) : base(options) { }
        public DbSet<Todo> Todos => Set<Todo>();
    }
}
```

**Example application**: For a complete setup, refer to this Neon community guide: [Scale your .NET application with Entity Framework and Neon Postgres Read Replicas](https://neon.tech/guides/read-replica-entity-framework).

<NeedHelp/>
