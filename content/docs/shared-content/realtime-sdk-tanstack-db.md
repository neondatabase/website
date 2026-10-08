**Import specifier** `@neon/realtime-tanstack`

### Symbols (#tanstack-db-symbols)

| Symbol                                                                  | Kind       | Summary                                                                                                                                                     |
| ----------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`realtimeCollectionOptions`](#tanstack-db-realtimecollectionoptions)   | Function   | Create TanStack DB collection options backed by a raw live-query subscription. Resets and committed publication batches are applied atomically.             |
| [`RealtimeCollectionConfig`](#tanstack-db-realtimecollectionconfig)     | Interface  | Configuration for a Realtime-backed TanStack DB collection. The adapter owns `sync`, uses eager synchronization, and supplies its own collection utilities. |
| [`RealtimeCollectionUtils`](#tanstack-db-realtimecollectionutils)       | Interface  | Utilities attached to a Realtime-backed TanStack DB collection.                                                                                             |
| [`RealtimeCollectionOptions`](#tanstack-db-realtimecollectionoptions-2) | Type alias | TanStack DB collection options produced by [`realtimeCollectionOptions`](/docs/realtime/sdks/typescript#tanstack-db-realtimecollectionoptions).             |

### realtimeCollectionOptions (#tanstack-db-realtimecollectionoptions)

```ts
function realtimeCollectionOptions<Row extends object, Key extends string | number = string | number, Schema extends StandardSchemaV1<unknown, unknown> = never>(config: RealtimeCollectionConfig<Row, Key, Schema>): RealtimeCollectionOptions<Row, Key, Schema>
```

Create TanStack DB collection options backed by a raw live-query subscription.
Resets and committed publication batches are applied atomically.

**Returns:** Collection options to pass to TanStack DB's `createCollection()`.

#### Type parameters (#tanstack-db-realtimecollectionoptions-type-parameters)

| Name     | Default            | Description                                   |
| -------- | ------------------ | --------------------------------------------- |
| `Row`    |                    | Object row synchronized into the collection.  |
| `Key`    | `string \| number` | Stable key returned by `getKey`.              |
| `Schema` | `never`            | Optional Standard Schema used by TanStack DB. |

#### Parameters (#tanstack-db-realtimecollectionoptions-parameters)

| Name     | Type                                         | Description                                                                   |
| -------- | -------------------------------------------- | ----------------------------------------------------------------------------- |
| `config` | `RealtimeCollectionConfig<Row, Key, Schema>` | Live-query subscription settings and ordinary TanStack DB collection options. |

#### Returns (#tanstack-db-realtimecollectionoptions-returns)

`RealtimeCollectionOptions<Row, Key, Schema>`

### RealtimeCollectionConfig (#tanstack-db-realtimecollectionconfig)

```ts
interface RealtimeCollectionConfig<Row extends object, Key extends string | number = string | number, Schema extends StandardSchemaV1 = never> extends Omit<BaseCollectionConfig<Row, Key, Schema, RealtimeCollectionUtils, void>, "syncMode" | "utils">
```

Configuration for a Realtime-backed TanStack DB collection.

The adapter owns `sync`, uses eager synchronization, and supplies its own
collection utilities.

#### Members (#tanstack-db-realtimecollectionconfig-members)

| Name                                                                         | Type                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`autoIndex?`](#tanstack-db-realtimecollectionconfigautoindex)               | `"off" \| "eager"`                                          | Auto-indexing mode for the collection. When enabled, indexes will be automatically created for simple where expressions.                                                                                                                                                                                                                                                                                               |
| `client`                                                                     | `readonly RealtimeClient`                                   | Reusable low-level Realtime client.                                                                                                                                                                                                                                                                                                                                                                                    |
| [`compare?`](#tanstack-db-realtimecollectionconfigcompare)                   | `(x: Row, y: Row) => number`                                | Optional function to compare two items. This is used to order the items in the collection.                                                                                                                                                                                                                                                                                                                             |
| [`defaultIndexType?`](#tanstack-db-realtimecollectionconfigdefaultindextype) | `IndexConstructor<Key>`                                     | Default index type to use when creating indexes without an explicit type. Required for auto-indexing. Import from '@tanstack/db'.                                                                                                                                                                                                                                                                                      |
| `defaultStringCollation?`                                                    | `StringCollationConfig`                                     | Specifies how to compare data in the collection. This should be configured to match data ordering on the backend. E.g., when using the Electric DB collection these options should match the database's collation settings.                                                                                                                                                                                            |
| `gcTime?`                                                                    | `number`                                                    | Time in milliseconds after which the collection will be garbage collected when it has no active subscribers. Defaults to 5 minutes (300000ms).                                                                                                                                                                                                                                                                         |
| `getKey`                                                                     | `readonly (row: Row) => Key`                                | Derive the stable unique TanStack DB key for a row.                                                                                                                                                                                                                                                                                                                                                                    |
| `id?`                                                                        | `string`                                                    |                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [`onDelete?`](#tanstack-db-realtimecollectionconfigondelete)                 | `DeleteMutationFn<Row, Key, RealtimeCollectionUtils, void>` | Optional asynchronous handler function called before a delete operation                                                                                                                                                                                                                                                                                                                                                |
| [`onInsert?`](#tanstack-db-realtimecollectionconfigoninsert)                 | `InsertMutationFn<Row, Key, RealtimeCollectionUtils, void>` | Optional asynchronous handler function called before an insert operation                                                                                                                                                                                                                                                                                                                                               |
| [`onUpdate?`](#tanstack-db-realtimecollectionconfigonupdate)                 | `UpdateMutationFn<Row, Key, RealtimeCollectionUtils, void>` | Optional asynchronous handler function called before an update operation                                                                                                                                                                                                                                                                                                                                               |
| `query`                                                                      | `readonly SealedLiveQuery<Row>`                             | Initial query for the exact query backing this collection.                                                                                                                                                                                                                                                                                                                                                             |
| `refreshQuery?`                                                              | `readonly () => Promise<SealedLiveQuery<Row>>`              | Obtain a replacement capability for the same exact query before expiry. Transient failures are retried while the current capability remains valid.                                                                                                                                                                                                                                                                     |
| `schema?`                                                                    | `Schema`                                                    |                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [`startSync?`](#tanstack-db-realtimecollectionconfigstartsync)               | `boolean`                                                   | Whether to eagerly start syncing on collection creation. When true, syncing begins immediately. When false, syncing starts when the first subscriber attaches. Note: Even with startSync=true, collections will pause syncing when there are no active subscribers (typically when components querying the collection unmount), resuming when new subscribers attach. This preserves normal staleTime/gcTime behavior. |

#### RealtimeCollectionConfig.autoIndex (#tanstack-db-realtimecollectionconfigautoindex)

```ts
autoIndex?: "off" | "eager"
```

Auto-indexing mode for the collection.
When enabled, indexes will be automatically created for simple where expressions.

**Default**

```ts
"off"
```

- "off": No automatic indexing (default). Use explicit indexes for better bundle size.
- "eager": Automatically create indexes for simple where expressions in subscribeChanges.
  Requires setting defaultIndexType.

#### RealtimeCollectionConfig.compare (#tanstack-db-realtimecollectionconfigcompare)

```ts
compare?: (x: Row, y: Row) => number
```

Optional function to compare two items.
This is used to order the items in the collection.

**Example**

```ts
// For a collection with a 'createdAt' field
compare: (x, y) => x.createdAt.getTime() - y.createdAt.getTime()
```

#### RealtimeCollectionConfig.defaultIndexType (#tanstack-db-realtimecollectionconfigdefaultindextype)

```ts
defaultIndexType?: IndexConstructor<Key>
```

Default index type to use when creating indexes without an explicit type.
Required for auto-indexing. Import from '@tanstack/db'.

**Example**

```ts
import { BasicIndex } from '@tanstack/db'
const collection = createCollection({
  defaultIndexType: BasicIndex,
  autoIndex: 'eager',
  // ...
})
```

#### RealtimeCollectionConfig.onDelete (#tanstack-db-realtimecollectionconfigondelete)

```ts
onDelete?: DeleteMutationFn<Row, Key, RealtimeCollectionUtils, void>
```

Optional asynchronous handler function called before a delete operation

**Parameter `params`:** Object containing transaction and collection information

**Returns:** Promise resolving to any value

**Example**

```ts
// Basic delete handler
onDelete: async ({ transaction, collection }) => {
  const deletedKey = transaction.mutations[0].key
  await api.deleteTodo(deletedKey)
}
```

**Example**

```ts
// Delete handler with multiple items
onDelete: async ({ transaction, collection }) => {
  const keysToDelete = transaction.mutations.map(m => m.key)
  await api.deleteTodos(keysToDelete)
}
```

**Example**

```ts
// Delete handler with confirmation
onDelete: async ({ transaction, collection }) => {
  const mutation = transaction.mutations[0]
  const shouldDelete = await confirmDeletion(mutation.original)
  if (!shouldDelete) {
    throw new Error('Delete cancelled by user')
  }
  await api.deleteTodo(mutation.original.id)
}
```

**Example**

```ts
// Delete handler with optimistic rollback
onDelete: async ({ transaction, collection }) => {
  const mutation = transaction.mutations[0]
  try {
    await api.deleteTodo(mutation.original.id)
  } catch (error) {
    // Transaction will automatically rollback optimistic changes
    console.error('Delete failed, rolling back:', error)
    throw error
  }
}
```

#### RealtimeCollectionConfig.onInsert (#tanstack-db-realtimecollectionconfigoninsert)

```ts
onInsert?: InsertMutationFn<Row, Key, RealtimeCollectionUtils, void>
```

Optional asynchronous handler function called before an insert operation

**Parameter `params`:** Object containing transaction and collection information

**Returns:** Promise resolving to any value

**Example**

```ts
// Basic insert handler
onInsert: async ({ transaction, collection }) => {
  const newItem = transaction.mutations[0].modified
  await api.createTodo(newItem)
}
```

**Example**

```ts
// Insert handler with multiple items
onInsert: async ({ transaction, collection }) => {
  const items = transaction.mutations.map(m => m.modified)
  await api.createTodos(items)
}
```

**Example**

```ts
// Insert handler with error handling
onInsert: async ({ transaction, collection }) => {
  try {
    const newItem = transaction.mutations[0].modified
    const result = await api.createTodo(newItem)
    return result
  } catch (error) {
    console.error('Insert failed:', error)
    throw error // This will cause the transaction to fail
  }
}
```

**Example**

```ts
// Insert handler with metadata
onInsert: async ({ transaction, collection }) => {
  const mutation = transaction.mutations[0]
  await api.createTodo(mutation.modified, {
    source: mutation.metadata?.source,
    timestamp: mutation.createdAt
  })
}
```

#### RealtimeCollectionConfig.onUpdate (#tanstack-db-realtimecollectionconfigonupdate)

```ts
onUpdate?: UpdateMutationFn<Row, Key, RealtimeCollectionUtils, void>
```

Optional asynchronous handler function called before an update operation

**Parameter `params`:** Object containing transaction and collection information

**Returns:** Promise resolving to any value

**Example**

```ts
// Basic update handler
onUpdate: async ({ transaction, collection }) => {
  const updatedItem = transaction.mutations[0].modified
  await api.updateTodo(updatedItem.id, updatedItem)
}
```

**Example**

```ts
// Update handler with partial updates
onUpdate: async ({ transaction, collection }) => {
  const mutation = transaction.mutations[0]
  const changes = mutation.changes // Only the changed fields
  await api.updateTodo(mutation.original.id, changes)
}
```

**Example**

```ts
// Update handler with multiple items
onUpdate: async ({ transaction, collection }) => {
  const updates = transaction.mutations.map(m => ({
    id: m.key,
    changes: m.changes
  }))
  await api.updateTodos(updates)
}
```

**Example**

```ts
// Update handler with optimistic rollback
onUpdate: async ({ transaction, collection }) => {
  const mutation = transaction.mutations[0]
  try {
    await api.updateTodo(mutation.original.id, mutation.changes)
  } catch (error) {
    // Transaction will automatically rollback optimistic changes
    console.error('Update failed, rolling back:', error)
    throw error
  }
}
```

#### RealtimeCollectionConfig.startSync (#tanstack-db-realtimecollectionconfigstartsync)

```ts
startSync?: boolean
```

Whether to eagerly start syncing on collection creation.
When true, syncing begins immediately. When false, syncing starts when the first subscriber attaches.

Note: Even with startSync=true, collections will pause syncing when there are no active
subscribers (typically when components querying the collection unmount), resuming when new
subscribers attach. This preserves normal staleTime/gcTime behavior.

**Default**

```ts
false
```

### RealtimeCollectionUtils (#tanstack-db-realtimecollectionutils)

```ts
interface RealtimeCollectionUtils extends UtilsRecord
```

Utilities attached to a Realtime-backed TanStack DB collection.

#### Members (#tanstack-db-realtimecollectionutils-members)

| Name                                                         | Type                                                   | Description                                                                                                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`awaitTxId`](#tanstack-db-realtimecollectionutilsawaittxid) | `(txid: string, timeout?: number) => Promise<boolean>` | Wait until this query has processed a known committed PostgreSQL transaction. Covered row changes enter TanStack DB's causal sync queue before this resolves. |
| `[key: string]`                                              | `any`                                                  |                                                                                                                                                               |

#### RealtimeCollectionUtils.awaitTxId (#tanstack-db-realtimecollectionutilsawaittxid)

```ts
awaitTxId(txid: string, timeout?: number): Promise<boolean>
```

Wait until this query has processed a known committed PostgreSQL transaction.
Covered row changes enter TanStack DB's causal sync queue before this resolves.

**Remarks:** This does not determine whether a transaction committed, so pass only IDs
from transactions known to have committed.

**Throws:** If a supplied timeout elapses or the collection is cleaned up.

**Parameters**

| Name       | Type     | Description                                                                                                                                   |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `txid`     | `string` | PostgreSQL transaction ID as a decimal string.                                                                                                |
| `timeout?` | `number` | Optional maximum wait in milliseconds. By default, the promise remains pending until the transaction arrives or the collection is cleaned up. |

### RealtimeCollectionOptions (#tanstack-db-realtimecollectionoptions-2)

```ts
type RealtimeCollectionOptions<Row extends object, Key extends string | number, Schema extends StandardSchemaV1> = Omit<CollectionConfig<Row, Key, Schema, RealtimeCollectionUtils>, "utils"> & { readonly utils: RealtimeCollectionUtils }
```

TanStack DB collection options produced by [`realtimeCollectionOptions`](/docs/realtime/sdks/typescript#tanstack-db-realtimecollectionoptions).
