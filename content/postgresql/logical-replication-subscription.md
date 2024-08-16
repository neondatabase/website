[#id](#LOGICAL-REPLICATION-SUBSCRIPTION)

## 31.2. Subscription [#](#LOGICAL-REPLICATION-SUBSCRIPTION)

- [31.2.1. Replication Slot Management](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-SLOT)
- [31.2.2. Examples: Set Up Logical Replication](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES)
- [31.2.3. Examples: Deferred Replication Slot Creation](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES-DEFERRED-SLOT)

A _subscription_ is the downstream side of logical replication. The node where a subscription is defined is referred to as the _subscriber_. A subscription defines the connection to another database and set of publications (one or more) to which it wants to subscribe.

The subscriber database behaves in the same way as any other PostgreSQL instance and can be used as a publisher for other databases by defining its own publications.

A subscriber node may have multiple subscriptions if desired. It is possible to define multiple subscriptions between a single publisher-subscriber pair, in which case care must be taken to ensure that the subscribed publication objects don't overlap.

Each subscription will receive changes via one replication slot (see [Section 27.2.6](warm-standby#STREAMING-REPLICATION-SLOTS)). Additional replication slots may be required for the initial data synchronization of pre-existing table data and those will be dropped at the end of data synchronization.

A logical replication subscription can be a standby for synchronous replication (see [Section 27.2.8](warm-standby#SYNCHRONOUS-REPLICATION)). The standby name is by default the subscription name. An alternative name can be specified as `application_name` in the connection information of the subscription.

Subscriptions are dumped by `pg_dump` if the current user is a superuser. Otherwise a warning is written and subscriptions are skipped, because non-superusers cannot read all subscription information from the `pg_subscription` catalog.

The subscription is added using [`CREATE SUBSCRIPTION`](sql-createsubscription) and can be stopped/resumed at any time using the [`ALTER SUBSCRIPTION`](sql-altersubscription) command and removed using [`DROP SUBSCRIPTION`](sql-dropsubscription).

When a subscription is dropped and recreated, the synchronization information is lost. This means that the data has to be resynchronized afterwards.

The schema definitions are not replicated, and the published tables must exist on the subscriber. Only regular tables may be the target of replication. For example, you can't replicate to a view.

The tables are matched between the publisher and the subscriber using the fully qualified table name. Replication to differently-named tables on the subscriber is not supported.

Columns of a table are also matched by name. The order of columns in the subscriber table does not need to match that of the publisher. The data types of the columns do not need to match, as long as the text representation of the data can be converted to the target type. For example, you can replicate from a column of type `integer` to a column of type `bigint`. The target table can also have additional columns not provided by the published table. Any such columns will be filled with the default value as specified in the definition of the target table. However, logical replication in binary format is more restrictive. See the [`binary`](sql-createsubscription#SQL-CREATESUBSCRIPTION-WITH-BINARY) option of `CREATE SUBSCRIPTION` for details.

[#id](#LOGICAL-REPLICATION-SUBSCRIPTION-SLOT)

### 31.2.1. Replication Slot Management [#](#LOGICAL-REPLICATION-SUBSCRIPTION-SLOT)

As mentioned earlier, each (active) subscription receives changes from a replication slot on the remote (publishing) side.

Additional table synchronization slots are normally transient, created internally to perform initial table synchronization and dropped automatically when they are no longer needed. These table synchronization slots have generated names: “`pg_%u_sync_%u_%llu`” (parameters: Subscription _`oid`_, Table _`relid`_, system identifier _`sysid`_)

Normally, the remote replication slot is created automatically when the subscription is created using `CREATE SUBSCRIPTION` and it is dropped automatically when the subscription is dropped using `DROP SUBSCRIPTION`. In some situations, however, it can be useful or necessary to manipulate the subscription and the underlying replication slot separately. Here are some scenarios:

- When creating a subscription, the replication slot already exists. In that case, the subscription can be created using the `create_slot = false` option to associate with the existing slot.

- When creating a subscription, the remote host is not reachable or in an unclear state. In that case, the subscription can be created using the `connect = false` option. The remote host will then not be contacted at all. This is what pg_dump uses. The remote replication slot will then have to be created manually before the subscription can be activated.

- When dropping a subscription, the replication slot should be kept. This could be useful when the subscriber database is being moved to a different host and will be activated from there. In that case, disassociate the slot from the subscription using `ALTER SUBSCRIPTION` before attempting to drop the subscription.

- When dropping a subscription, the remote host is not reachable. In that case, disassociate the slot from the subscription using `ALTER SUBSCRIPTION` before attempting to drop the subscription. If the remote database instance no longer exists, no further action is then necessary. If, however, the remote database instance is just unreachable, the replication slot (and any still remaining table synchronization slots) should then be dropped manually; otherwise it/they would continue to reserve WAL and might eventually cause the disk to fill up. Such cases should be carefully investigated.

[#id](#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES)

### 31.2.2. Examples: Set Up Logical Replication [#](#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES)

Create some test tables on the publisher.

```
test_pub=# CREATE TABLE t1(a int, b text, PRIMARY KEY(a));
CREATE TABLE
test_pub=# CREATE TABLE t2(c int, d text, PRIMARY KEY(c));
CREATE TABLE
test_pub=# CREATE TABLE t3(e int, f text, PRIMARY KEY(e));
CREATE TABLE
```

Create the same tables on the subscriber.

```
test_sub=# CREATE TABLE t1(a int, b text, PRIMARY KEY(a));
CREATE TABLE
test_sub=# CREATE TABLE t2(c int, d text, PRIMARY KEY(c));
CREATE TABLE
test_sub=# CREATE TABLE t3(e int, f text, PRIMARY KEY(e));
CREATE TABLE
```

Insert data to the tables at the publisher side.

```
test_pub=# INSERT INTO t1 VALUES (1, 'one'), (2, 'two'), (3, 'three');
INSERT 0 3
test_pub=# INSERT INTO t2 VALUES (1, 'A'), (2, 'B'), (3, 'C');
INSERT 0 3
test_pub=# INSERT INTO t3 VALUES (1, 'i'), (2, 'ii'), (3, 'iii');
INSERT 0 3
```

Create publications for the tables. The publications `pub2` and `pub3a` disallow some [`publish`](sql-createpublication#SQL-CREATEPUBLICATION-WITH-PUBLISH) operations. The publication `pub3b` has a row filter (see [Section 31.3](logical-replication-row-filter)).

```
test_pub=# CREATE PUBLICATION pub1 FOR TABLE t1;
CREATE PUBLICATION
test_pub=# CREATE PUBLICATION pub2 FOR TABLE t2 WITH (publish = 'truncate');
CREATE PUBLICATION
test_pub=# CREATE PUBLICATION pub3a FOR TABLE t3 WITH (publish = 'truncate');
CREATE PUBLICATION
test_pub=# CREATE PUBLICATION pub3b FOR TABLE t3 WHERE (e > 5);
CREATE PUBLICATION
```

Create subscriptions for the publications. The subscription `sub3` subscribes to both `pub3a` and `pub3b`. All subscriptions will copy initial data by default.

```
test_sub=# CREATE SUBSCRIPTION sub1
test_sub-# CONNECTION 'host=localhost dbname=test_pub application_name=sub1'
test_sub-# PUBLICATION pub1;
CREATE SUBSCRIPTION
test_sub=# CREATE SUBSCRIPTION sub2
test_sub-# CONNECTION 'host=localhost dbname=test_pub application_name=sub2'
test_sub-# PUBLICATION pub2;
CREATE SUBSCRIPTION
test_sub=# CREATE SUBSCRIPTION sub3
test_sub-# CONNECTION 'host=localhost dbname=test_pub application_name=sub3'
test_sub-# PUBLICATION pub3a, pub3b;
CREATE SUBSCRIPTION
```

Observe that initial table data is copied, regardless of the `publish` operation of the publication.

```
test_sub=# SELECT * FROM t1;
 a |   b
---+-------
 1 | one
 2 | two
 3 | three
(3 rows)

test_sub=# SELECT * FROM t2;
 c | d
---+---
 1 | A
 2 | B
 3 | C
(3 rows)
```

Furthermore, because the initial data copy ignores the `publish` operation, and because publication `pub3a` has no row filter, it means the copied table `t3` contains all rows even when they do not match the row filter of publication `pub3b`.

```
test_sub=# SELECT * FROM t3;
 e |  f
---+-----
 1 | i
 2 | ii
 3 | iii
(3 rows)
```

Insert more data to the tables at the publisher side.

```
test_pub=# INSERT INTO t1 VALUES (4, 'four'), (5, 'five'), (6, 'six');
INSERT 0 3
test_pub=# INSERT INTO t2 VALUES (4, 'D'), (5, 'E'), (6, 'F');
INSERT 0 3
test_pub=# INSERT INTO t3 VALUES (4, 'iv'), (5, 'v'), (6, 'vi');
INSERT 0 3
```

Now the publisher side data looks like:

```
test_pub=# SELECT * FROM t1;
 a |   b
---+-------
 1 | one
 2 | two
 3 | three
 4 | four
 5 | five
 6 | six
(6 rows)

test_pub=# SELECT * FROM t2;
 c | d
---+---
 1 | A
 2 | B
 3 | C
 4 | D
 5 | E
 6 | F
(6 rows)

test_pub=# SELECT * FROM t3;
 e |  f
---+-----
 1 | i
 2 | ii
 3 | iii
 4 | iv
 5 | v
 6 | vi
(6 rows)
```

Observe that during normal replication the appropriate `publish` operations are used. This means publications `pub2` and `pub3a` will not replicate the `INSERT`. Also, publication `pub3b` will only replicate data that matches the row filter of `pub3b`. Now the subscriber side data looks like:

```
test_sub=# SELECT * FROM t1;
 a |   b
---+-------
 1 | one
 2 | two
 3 | three
 4 | four
 5 | five
 6 | six
(6 rows)

test_sub=# SELECT * FROM t2;
 c | d
---+---
 1 | A
 2 | B
 3 | C
(3 rows)

test_sub=# SELECT * FROM t3;
 e |  f
---+-----
 1 | i
 2 | ii
 3 | iii
 6 | vi
(4 rows)
```

[#id](#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES-DEFERRED-SLOT)

### 31.2.3. Examples: Deferred Replication Slot Creation [#](#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES-DEFERRED-SLOT)

There are some cases (e.g. [Section 31.2.1](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-SLOT)) where, if the remote replication slot was not created automatically, the user must create it manually before the subscription can be activated. The steps to create the slot and activate the subscription are shown in the following examples. These examples specify the standard logical decoding plugin (`pgoutput`), which is what the built-in logical replication uses.

First, create a publication for the examples to use.

```
test_pub=# CREATE PUBLICATION pub1 FOR ALL TABLES;
CREATE PUBLICATION
```

Example 1: Where the subscription says `connect = false`

- Create the subscription.

  ```
  test_sub=# CREATE SUBSCRIPTION sub1
  test_sub-# CONNECTION 'host=localhost dbname=test_pub'
  test_sub-# PUBLICATION pub1
  test_sub-# WITH (connect=false);
  WARNING:  subscription was created, but is not connected
  HINT:  To initiate replication, you must manually create the replication slot, enable the subscription, and refresh the subscription.
  CREATE SUBSCRIPTION
  ```

- On the publisher, manually create a slot. Because the name was not specified during `CREATE SUBSCRIPTION`, the name of the slot to create is same as the subscription name, e.g. "sub1".

  ```
  test_pub=# SELECT * FROM pg_create_logical_replication_slot('sub1', 'pgoutput');
   slot_name |    lsn
  -----------+-----------
   sub1      | 0/19404D0
  (1 row)
  ```

- On the subscriber, complete the activation of the subscription. After this the tables of `pub1` will start replicating.

  ```
  test_sub=# ALTER SUBSCRIPTION sub1 ENABLE;
  ALTER SUBSCRIPTION
  test_sub=# ALTER SUBSCRIPTION sub1 REFRESH PUBLICATION;
  ALTER SUBSCRIPTION
  ```

Example 2: Where the subscription says `connect = false`, but also specifies the [`slot_name`](sql-createsubscription#SQL-CREATESUBSCRIPTION-WITH-SLOT-NAME) option.

- Create the subscription.

  ```
  test_sub=# CREATE SUBSCRIPTION sub1
  test_sub-# CONNECTION 'host=localhost dbname=test_pub'
  test_sub-# PUBLICATION pub1
  test_sub-# WITH (connect=false, slot_name='myslot');
  WARNING:  subscription was created, but is not connected
  HINT:  To initiate replication, you must manually create the replication slot, enable the subscription, and refresh the subscription.
  CREATE SUBSCRIPTION
  ```

- On the publisher, manually create a slot using the same name that was specified during `CREATE SUBSCRIPTION`, e.g. "myslot".

  ```
  test_pub=# SELECT * FROM pg_create_logical_replication_slot('myslot', 'pgoutput');
   slot_name |    lsn
  -----------+-----------
   myslot    | 0/19059A0
  (1 row)
  ```

- On the subscriber, the remaining subscription activation steps are the same as before.

  ```
  test_sub=# ALTER SUBSCRIPTION sub1 ENABLE;
  ALTER SUBSCRIPTION
  test_sub=# ALTER SUBSCRIPTION sub1 REFRESH PUBLICATION;
  ALTER SUBSCRIPTION
  ```

Example 3: Where the subscription specifies `slot_name = NONE`

- Create the subscription. When `slot_name = NONE` then `enabled = false`, and `create_slot = false` are also needed.

  ```
  test_sub=# CREATE SUBSCRIPTION sub1
  test_sub-# CONNECTION 'host=localhost dbname=test_pub'
  test_sub-# PUBLICATION pub1
  test_sub-# WITH (slot_name=NONE, enabled=false, create_slot=false);
  CREATE SUBSCRIPTION
  ```

- On the publisher, manually create a slot using any name, e.g. "myslot".

  ```
  test_pub=# SELECT * FROM pg_create_logical_replication_slot('myslot', 'pgoutput');
   slot_name |    lsn
  -----------+-----------
   myslot    | 0/1905930
  (1 row)
  ```

- On the subscriber, associate the subscription with the slot name just created.

  ```
  test_sub=# ALTER SUBSCRIPTION sub1 SET (slot_name='myslot');
  ALTER SUBSCRIPTION
  ```

- The remaining subscription activation steps are same as before.

  ```
  test_sub=# ALTER SUBSCRIPTION sub1 ENABLE;
  ALTER SUBSCRIPTION
  test_sub=# ALTER SUBSCRIPTION sub1 REFRESH PUBLICATION;
  ALTER SUBSCRIPTION
  ```
