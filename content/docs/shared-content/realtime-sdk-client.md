**Import specifier** `@neon/realtime/client`

### Symbols (#client-symbols)

| Symbol                                                                           | Kind       | Summary                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`createRealtimeClient`](#client-createrealtimeclient)                           | Function   | Create a reusable client that lazily opens and multiplexes a Realtime WebSocket connection that is bound by its first accepted query capability. The connection carries no user session credential; each subscription sends its own short-lived sealed query. Idle connections are heartbeat-probed, and recoverable disconnects retry with capped jittered backoff until the connection recovers or the client is closed. |
| [`defineParsers`](#client-defineparsers)                                         | Function   | Define an OID-keyed parser preset with contextual input types. OID `pgTypeOids.bytea` receives `Uint8Array`; every other OID receives PostgreSQL text. The returned object is a frozen snapshot of the input.                                                                                                                                                                                                              |
| [`QueryRefreshController`](#client-queryrefreshcontroller)                       | Class      | Schedules capability refreshes for framework integrations. Most applications should supply `refreshQuery` to their React or TanStack DB integration instead of constructing this class. Integration authors can use it to refresh shortly before expiry and keep retrying across capability expiry or an arbitrarily long transport outage.                                                                                |
| [`LiveQueryBatchInfo`](#client-livequerybatchinfo)                               | Interface  | Metadata for one atomically published batch of PostgreSQL transactions.                                                                                                                                                                                                                                                                                                                                                    |
| [`LiveQueryError`](#client-livequeryerror)                                       | Interface  | An error reported by a live-query subscription.                                                                                                                                                                                                                                                                                                                                                                            |
| [`MaterializedLiveQueryOptions`](#client-materializedlivequeryoptions)           | Interface  | Options for the default materialized subscription.                                                                                                                                                                                                                                                                                                                                                                         |
| [`MaterializedLiveQuerySubscription`](#client-materializedlivequerysubscription) | Interface  | A live-query subscription that also retains and publishes the current rows.                                                                                                                                                                                                                                                                                                                                                |
| [`RawLiveQueryOptions`](#client-rawlivequeryoptions)                             | Interface  | Options for a raw, non-materializing subscription.                                                                                                                                                                                                                                                                                                                                                                         |
| [`RawLiveQueryRow`](#client-rawlivequeryrow)                                     | Interface  | A row in a raw reset, paired with its opaque Realtime identity.                                                                                                                                                                                                                                                                                                                                                            |
| [`RawLiveQuerySubscription`](#client-rawlivequerysubscription)                   | Interface  | A live-query subscription that exposes raw reset and publication events.                                                                                                                                                                                                                                                                                                                                                   |
| [`RealtimeClient`](#client-realtimeclient)                                       | Interface  | A client that multiplexes independently disposable subscriptions.                                                                                                                                                                                                                                                                                                                                                          |
| [`RealtimeClientOptions`](#client-realtimeclientoptions)                         | Interface  | Configuration for a reusable Realtime browser client.                                                                                                                                                                                                                                                                                                                                                                      |
| [`LiveQueryChange`](#client-livequerychange)                                     | Type alias | A row upsert or removal in an atomic publication batch.                                                                                                                                                                                                                                                                                                                                                                    |
| [`LiveQuerySnapshot`](#client-livequerysnapshot)                                 | Type alias | Materialized query rows paired with their atomic lifecycle state.                                                                                                                                                                                                                                                                                                                                                          |
| [`LiveQueryState`](#client-livequerystate)                                       | Type alias | Atomic lifecycle state for a live-query subscription.                                                                                                                                                                                                                                                                                                                                                                      |
| [`PostgreSQLBytesParser`](#client-postgresqlbytesparser)                         | Type alias | A parser for PostgreSQL `bytea`, transported as decoded bytes.                                                                                                                                                                                                                                                                                                                                                             |
| [`PostgreSQLParserForOid`](#client-postgresqlparserforoid)                       | Type alias | Parser input selected by the fixed Realtime protocol v1 OID/codec mapping.                                                                                                                                                                                                                                                                                                                                                 |
| [`PostgreSQLParsers`](#client-postgresqlparsers)                                 | Type alias | A sparse collection of result parsers keyed by PostgreSQL type OID.                                                                                                                                                                                                                                                                                                                                                        |
| [`PostgreSQLTextParser`](#client-postgresqltextparser)                           | Type alias | A parser for a PostgreSQL value transported with the `pg_text` codec.                                                                                                                                                                                                                                                                                                                                                      |
| [`RealtimeLogEntry`](#client-realtimelogentry)                                   | Type alias | Structured client diagnostic passed to a configured logger. Narrowing on `event` also narrows the metadata available on the entry.                                                                                                                                                                                                                                                                                         |
| [`RealtimeLogEvent`](#client-realtimelogevent)                                   | Type alias | Stable name for one client diagnostic event.                                                                                                                                                                                                                                                                                                                                                                               |
| [`RealtimeLogger`](#client-realtimelogger)                                       | Type alias | Receives structured Realtime client diagnostics.                                                                                                                                                                                                                                                                                                                                                                           |
| [`RealtimeLogLevel`](#client-realtimeloglevel)                                   | Type alias | Client-side diagnostic verbosity.                                                                                                                                                                                                                                                                                                                                                                                          |
| [`nodePostgresParsers`](#client-nodepostgresparsers)                             | Variable   | Core result parsers matching familiar node-postgres/Neon Serverless values. Less-common and unknown OIDs are intentionally absent and fall back to their exact PostgreSQL text. Known built-in array OIDs are decoded recursively by the client using the active parser for their element OID.                                                                                                                             |
| [`pgTypeOids`](#client-pgtypeoids)                                               | Variable   | Stable PostgreSQL type OIDs used by the built-in Realtime parsers.                                                                                                                                                                                                                                                                                                                                                         |
| [`postgresJsParsers`](#client-postgresjsparsers)                                 | Variable   | Parsers that differ from the core defaults when matching Postgres.js. Spread this partial preset into the client's `parsers` option.                                                                                                                                                                                                                                                                                       |
| [`SealedLiveQuery`](#client-sealedlivequery)                                     | Re-export  |                                                                                                                                                                                                                                                                                                                                                                                                                            |

### createRealtimeClient (#client-createrealtimeclient)

```ts
function createRealtimeClient(options: RealtimeClientOptions): RealtimeClient
```

Create a reusable client that lazily opens and multiplexes a Realtime
WebSocket connection that is bound by its first accepted query capability.

The connection carries no user session credential; each subscription sends
its own short-lived sealed query. Idle connections are heartbeat-probed,
and recoverable disconnects retry with capped jittered backoff until the
connection recovers or the client is closed.

**Returns:** A client that opens its connection when the first query subscribes.

#### Parameters (#client-createrealtimeclient-parameters)

| Name      | Type                    | Description                                                      |
| --------- | ----------------------- | ---------------------------------------------------------------- |
| `options` | `RealtimeClientOptions` | Browser client configuration, including the proxy WebSocket URL. |

#### Returns (#client-createrealtimeclient-returns)

`RealtimeClient`

### defineParsers (#client-defineparsers)

```ts
function defineParsers(parsers: BuiltInParsers): PostgreSQLParsers
```

Define an OID-keyed parser preset with contextual input types.

OID `pgTypeOids.bytea` receives `Uint8Array`; every other OID receives
PostgreSQL text. The returned object is a frozen snapshot of the input.

#### Parameters (#client-defineparsers-1-parameters)

| Name      | Type             | Description |
| --------- | ---------------- | ----------- |
| `parsers` | `BuiltInParsers` |             |

#### Returns (#client-defineparsers-1-returns)

`PostgreSQLParsers`

```ts
function defineParsers(parsers: Readonly<Record<number, PostgreSQLTextParser>>): PostgreSQLParsers
```

Define an OID-keyed parser preset with contextual input types.

OID `pgTypeOids.bytea` receives `Uint8Array`; every other OID receives
PostgreSQL text. The returned object is a frozen snapshot of the input.

#### Parameters (#client-defineparsers-2-parameters)

| Name      | Type                                             | Description |
| --------- | ------------------------------------------------ | ----------- |
| `parsers` | `Readonly<Record<number, PostgreSQLTextParser>>` |             |

#### Returns (#client-defineparsers-2-returns)

`PostgreSQLParsers`

### QueryRefreshController (#client-queryrefreshcontroller)

```ts
class QueryRefreshController<Row>
```

Schedules capability refreshes for framework integrations.

Most applications should supply `refreshQuery` to their React or
TanStack DB integration instead of constructing this class. Integration
authors can use it to refresh shortly before expiry and keep retrying across
capability expiry or an arbitrarily long transport outage.

#### Members (#client-queryrefreshcontroller-members)

| Name                                                                     | Type                                                                                    | Description                                                                                                                               |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `constructor`                                                            | `new <Row>(options: QueryRefreshControllerOptions<Row>) => QueryRefreshController<Row>` |                                                                                                                                           |
| `currentQuery`                                                           | `() => SealedLiveQuery<Row>`                                                            | Return the capability currently managed by this controller.                                                                               |
| [`replaceSealedQuery`](#client-queryrefreshcontrollerreplacesealedquery) | `(query: SealedLiveQuery<Row>) => Promise<void>`                                        | Apply a replacement capability immediately and schedule its next refresh.                                                                 |
| `setRefreshCallback`                                                     | `(refreshQuery: (() => Promise<SealedLiveQuery<Row>>) \| undefined) => void`            | Replace the callback used to obtain a fresh capability. Passing `undefined` disables scheduled refreshes without stopping the controller. |
| `setSubscription`                                                        | `(subscription: RawLiveQuerySubscription<Row> \| undefined) => void`                    | Associate the active subscription managed by this controller.                                                                             |
| `start`                                                                  | `() => void`                                                                            | Start scheduling refreshes. Calling this more than once has no effect.                                                                    |
| `stop`                                                                   | `() => void`                                                                            | Stop scheduling refreshes and ignore any refresh already in flight.                                                                       |

#### QueryRefreshController.replaceSealedQuery (#client-queryrefreshcontrollerreplacesealedquery)

```ts
replaceSealedQuery(query: SealedLiveQuery<Row>): Promise<void>
```

Apply a replacement capability immediately and schedule its next refresh.

**Throws:** If the replacement capability belongs to a different query, or if
applying it to the active subscription fails.

**Parameters**

| Name    | Type                   | Description |
| ------- | ---------------------- | ----------- |
| `query` | `SealedLiveQuery<Row>` |             |

### LiveQueryBatchInfo (#client-livequerybatchinfo)

```ts
interface LiveQueryBatchInfo
```

Metadata for one atomically published batch of PostgreSQL transactions.

#### Members (#client-livequerybatchinfo-members)

| Name    | Type                | Description                                                      |
| ------- | ------------------- | ---------------------------------------------------------------- |
| `txids` | `readonly string[]` | Exact PostgreSQL transaction IDs represented as decimal strings. |

### LiveQueryError (#client-livequeryerror)

```ts
interface LiveQueryError extends Error
```

An error reported by a live-query subscription.

#### Members (#client-livequeryerror-members)

| Name        | Type               | Description                                                            |
| ----------- | ------------------ | ---------------------------------------------------------------------- |
| `cause?`    | `unknown`          |                                                                        |
| `code`      | `readonly string`  | Stable machine-readable error code.                                    |
| `message`   | `string`           |                                                                        |
| `name`      | `string`           |                                                                        |
| `retryable` | `readonly boolean` | Whether reconnecting or obtaining a fresh sealed query may recover it. |
| `sqlState?` | `readonly string`  | PostgreSQL SQLSTATE supplied for an authenticated debug query failure. |
| `stack?`    | `string`           |                                                                        |

### MaterializedLiveQueryOptions (#client-materializedlivequeryoptions)

```ts
interface MaterializedLiveQueryOptions<Row>
```

Options for the default materialized subscription.

#### Members (#client-materializedlivequeryoptions-members)

| Name           | Type             | Description                                                               |
| -------------- | ---------------- | ------------------------------------------------------------------------- |
| `initialData?` | `readonly Row[]` | Preloaded rows exposed as stale data until the first authoritative reset. |
| `materialize?` | `readonly true`  | Select materialization; omitted and `true` are equivalent.                |

### MaterializedLiveQuerySubscription (#client-materializedlivequerysubscription)

```ts
interface MaterializedLiveQuerySubscription<Row> extends RawLiveQuerySubscription<Row>
```

A live-query subscription that also retains and publishes the current rows.

#### Members (#client-materializedlivequerysubscription-members)

| Name                                                                      | Type                                                                                                      | Description                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`awaitRows`](#client-materializedlivequerysubscriptionawaitrows)         | `(matches: (rows: readonly Row[]) => boolean, timeout?: number) => Promise<void>`                         | Wait until the materialized rows satisfy a predicate. The current snapshot is inspected before waiting for later changes, so this also succeeds when matching rows arrived before the call.                                                                                                    |
| [`awaitTxId`](#client-materializedlivequerysubscriptionawaittxid)         | `(txid: string, timeout?: number) => Promise<void>`                                                       | Wait until this subscription has applied a PostgreSQL transaction. Recently applied transaction IDs are retained so this also succeeds when the batch arrives before the caller receives the mutation response.                                                                                |
| `getSnapshot`                                                             | `() => LiveQuerySnapshot<Row>`                                                                            | Return the current rows and lifecycle state atomically.                                                                                                                                                                                                                                        |
| `getState`                                                                | `() => LiveQueryState`                                                                                    | Return the complete current lifecycle state.                                                                                                                                                                                                                                                   |
| [`onBatch`](#client-materializedlivequerysubscriptiononbatch)             | `(listener: (changes: readonly LiveQueryChange<Row>[], batch: LiveQueryBatchInfo) => void) => () => void` | Observe changes from one atomic publication and its transaction IDs. Every affected materialized subscription has already applied the batch before any batch listener runs.                                                                                                                    |
| [`onChange`](#client-materializedlivequerysubscriptiononchange)           | `(listener: (snapshot: LiveQuerySnapshot<Row>) => void) => () => void`                                    | Observe row or lifecycle changes as complete snapshots. The listener runs after resets, publication batches, and state transitions.                                                                                                                                                            |
| [`onReset`](#client-materializedlivequerysubscriptiononreset)             | `(listener: (rows: readonly RawLiveQueryRow<Row>[]) => void) => () => void`                               | Observe authoritative full-result resets. A reset replaces the preceding row-ID namespace in its entirety.                                                                                                                                                                                     |
| [`onStateChange`](#client-materializedlivequerysubscriptiononstatechange) | `(listener: (state: LiveQueryState) => void) => () => void`                                               | Observe lifecycle transitions.                                                                                                                                                                                                                                                                 |
| [`renew`](#client-materializedlivequerysubscriptionrenew)                 | `(query: SealedLiveQuery<Row>) => Promise<void>`                                                          | Renew this logical subscription with a capability for the same exact query. If the preceding subscription has expired, the client creates a new wire subscription while preserving this object, its listeners, and any retained rows. The replacement then produces a new authoritative reset. |
| `unsubscribe`                                                             | `() => void`                                                                                              | Permanently close this subscription and remove its listeners.                                                                                                                                                                                                                                  |

#### MaterializedLiveQuerySubscription.awaitRows (#client-materializedlivequerysubscriptionawaitrows)

```ts
awaitRows(matches: (rows: readonly Row[]) => boolean, timeout?: number): Promise<void>
```

Wait until the materialized rows satisfy a predicate.

The current snapshot is inspected before waiting for later changes, so
this also succeeds when matching rows arrived before the call.

**Throws:** If a supplied timeout elapses, the predicate throws, or the
subscription closes or enters a terminal error before the rows match.

**Parameters**

| Name       | Type                                | Description                                                                                                                    |
| ---------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `matches`  | `(rows: readonly Row[]) => boolean` | Predicate evaluated against each complete row snapshot.                                                                        |
| `timeout?` | `number`                            | Optional maximum wait in milliseconds. By default the promise remains pending until the rows match or the subscription closes. |

#### MaterializedLiveQuerySubscription.awaitTxId (#client-materializedlivequerysubscriptionawaittxid)

```ts
awaitTxId(txid: string, timeout?: number): Promise<void>
```

Wait until this subscription has applied a PostgreSQL transaction.

Recently applied transaction IDs are retained so this also succeeds when
the batch arrives before the caller receives the mutation response.

**Remarks:** This does not determine whether a transaction committed, so pass only IDs
from transactions known to have committed.

**Throws:** If the timeout elapses, the transaction ID is invalid, or the
subscription closes before applying the transaction.

**Parameters**

| Name       | Type     | Description                                                                                                                             |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `txid`     | `string` | PostgreSQL transaction ID as a decimal string.                                                                                          |
| `timeout?` | `number` | Optional maximum wait in milliseconds. By default the promise remains pending until the transaction arrives or the subscription closes. |

#### MaterializedLiveQuerySubscription.onBatch (#client-materializedlivequerysubscriptiononbatch)

```ts
onBatch(listener: (changes: readonly LiveQueryChange<Row>[], batch: LiveQueryBatchInfo) => void): () => void
```

Observe changes from one atomic publication and its transaction IDs.
Every affected materialized subscription has already applied the batch
before any batch listener runs.

**Returns:** A function that removes this listener.

**Parameters**

| Name       | Type                                                                            | Description |
| ---------- | ------------------------------------------------------------------------------- | ----------- |
| `listener` | `(changes: readonly LiveQueryChange<Row>[], batch: LiveQueryBatchInfo) => void` |             |

#### MaterializedLiveQuerySubscription.onChange (#client-materializedlivequerysubscriptiononchange)

```ts
onChange(listener: (snapshot: LiveQuerySnapshot<Row>) => void): () => void
```

Observe row or lifecycle changes as complete snapshots.
The listener runs after resets, publication batches, and state transitions.

**Returns:** A function that removes this listener.

**Parameters**

| Name       | Type                                         | Description |
| ---------- | -------------------------------------------- | ----------- |
| `listener` | `(snapshot: LiveQuerySnapshot<Row>) => void` |             |

#### MaterializedLiveQuerySubscription.onReset (#client-materializedlivequerysubscriptiononreset)

```ts
onReset(listener: (rows: readonly RawLiveQueryRow<Row>[]) => void): () => void
```

Observe authoritative full-result resets.
A reset replaces the preceding row-ID namespace in its entirety.

**Returns:** A function that removes this listener.

**Parameters**

| Name       | Type                                              | Description |
| ---------- | ------------------------------------------------- | ----------- |
| `listener` | `(rows: readonly RawLiveQueryRow<Row>[]) => void` |             |

#### MaterializedLiveQuerySubscription.onStateChange (#client-materializedlivequerysubscriptiononstatechange)

```ts
onStateChange(listener: (state: LiveQueryState) => void): () => void
```

Observe lifecycle transitions.

**Returns:** A function that removes this listener.

**Parameters**

| Name       | Type                              | Description |
| ---------- | --------------------------------- | ----------- |
| `listener` | `(state: LiveQueryState) => void` |             |

#### MaterializedLiveQuerySubscription.renew (#client-materializedlivequerysubscriptionrenew)

```ts
renew(query: SealedLiveQuery<Row>): Promise<void>
```

Renew this logical subscription with a capability for the same exact query.
If the preceding subscription has expired, the client creates a new
wire subscription while preserving this object, its listeners, and any
retained rows. The replacement then produces a new authoritative reset.

**Returns:** A promise that resolves after the proxy accepts the replacement.
A subsequent authoritative reset returns the subscription to `live`.

**Throws:** If the replacement query fingerprint differs or renewal is rejected.

**Parameters**

| Name    | Type                   | Description |
| ------- | ---------------------- | ----------- |
| `query` | `SealedLiveQuery<Row>` |             |

### RawLiveQueryOptions (#client-rawlivequeryoptions)

```ts
interface RawLiveQueryOptions
```

Options for a raw, non-materializing subscription.

#### Members (#client-rawlivequeryoptions-members)

| Name          | Type             | Description                                                          |
| ------------- | ---------------- | -------------------------------------------------------------------- |
| `materialize` | `readonly false` | Disable SDK materialization and consume resets and batches directly. |

### RawLiveQueryRow (#client-rawlivequeryrow)

```ts
interface RawLiveQueryRow<Row>
```

A row in a raw reset, paired with its opaque Realtime identity.

#### Members (#client-rawlivequeryrow-members)

| Name    | Type              | Description                                                          |
| ------- | ----------------- | -------------------------------------------------------------------- |
| `row`   | `readonly Row`    | Decoded query row.                                                   |
| `rowId` | `readonly string` | Opaque identity scoped to the subscription and invalidated by reset. |

### RawLiveQuerySubscription (#client-rawlivequerysubscription)

```ts
interface RawLiveQuerySubscription<Row>
```

A live-query subscription that exposes raw reset and publication events.

#### Members (#client-rawlivequerysubscription-members)

| Name                                                             | Type                                                                                                      | Description                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`awaitTxId`](#client-rawlivequerysubscriptionawaittxid)         | `(txid: string, timeout?: number) => Promise<void>`                                                       | Wait until this subscription has applied a PostgreSQL transaction. Recently applied transaction IDs are retained so this also succeeds when the batch arrives before the caller receives the mutation response.                                                                                |
| `getState`                                                       | `() => LiveQueryState`                                                                                    | Return the complete current lifecycle state.                                                                                                                                                                                                                                                   |
| [`onBatch`](#client-rawlivequerysubscriptiononbatch)             | `(listener: (changes: readonly LiveQueryChange<Row>[], batch: LiveQueryBatchInfo) => void) => () => void` | Observe changes from one atomic publication and its transaction IDs. Every affected materialized subscription has already applied the batch before any batch listener runs.                                                                                                                    |
| [`onReset`](#client-rawlivequerysubscriptiononreset)             | `(listener: (rows: readonly RawLiveQueryRow<Row>[]) => void) => () => void`                               | Observe authoritative full-result resets. A reset replaces the preceding row-ID namespace in its entirety.                                                                                                                                                                                     |
| [`onStateChange`](#client-rawlivequerysubscriptiononstatechange) | `(listener: (state: LiveQueryState) => void) => () => void`                                               | Observe lifecycle transitions.                                                                                                                                                                                                                                                                 |
| [`renew`](#client-rawlivequerysubscriptionrenew)                 | `(query: SealedLiveQuery<Row>) => Promise<void>`                                                          | Renew this logical subscription with a capability for the same exact query. If the preceding subscription has expired, the client creates a new wire subscription while preserving this object, its listeners, and any retained rows. The replacement then produces a new authoritative reset. |
| `unsubscribe`                                                    | `() => void`                                                                                              | Permanently close this subscription and remove its listeners.                                                                                                                                                                                                                                  |

#### RawLiveQuerySubscription.awaitTxId (#client-rawlivequerysubscriptionawaittxid)

```ts
awaitTxId(txid: string, timeout?: number): Promise<void>
```

Wait until this subscription has applied a PostgreSQL transaction.

Recently applied transaction IDs are retained so this also succeeds when
the batch arrives before the caller receives the mutation response.

**Remarks:** This does not determine whether a transaction committed, so pass only IDs
from transactions known to have committed.

**Throws:** If the timeout elapses, the transaction ID is invalid, or the
subscription closes before applying the transaction.

**Parameters**

| Name       | Type     | Description                                                                                                                             |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `txid`     | `string` | PostgreSQL transaction ID as a decimal string.                                                                                          |
| `timeout?` | `number` | Optional maximum wait in milliseconds. By default the promise remains pending until the transaction arrives or the subscription closes. |

#### RawLiveQuerySubscription.onBatch (#client-rawlivequerysubscriptiononbatch)

```ts
onBatch(listener: (changes: readonly LiveQueryChange<Row>[], batch: LiveQueryBatchInfo) => void): () => void
```

Observe changes from one atomic publication and its transaction IDs.
Every affected materialized subscription has already applied the batch
before any batch listener runs.

**Returns:** A function that removes this listener.

**Parameters**

| Name       | Type                                                                            | Description |
| ---------- | ------------------------------------------------------------------------------- | ----------- |
| `listener` | `(changes: readonly LiveQueryChange<Row>[], batch: LiveQueryBatchInfo) => void` |             |

#### RawLiveQuerySubscription.onReset (#client-rawlivequerysubscriptiononreset)

```ts
onReset(listener: (rows: readonly RawLiveQueryRow<Row>[]) => void): () => void
```

Observe authoritative full-result resets.
A reset replaces the preceding row-ID namespace in its entirety.

**Returns:** A function that removes this listener.

**Parameters**

| Name       | Type                                              | Description |
| ---------- | ------------------------------------------------- | ----------- |
| `listener` | `(rows: readonly RawLiveQueryRow<Row>[]) => void` |             |

#### RawLiveQuerySubscription.onStateChange (#client-rawlivequerysubscriptiononstatechange)

```ts
onStateChange(listener: (state: LiveQueryState) => void): () => void
```

Observe lifecycle transitions.

**Returns:** A function that removes this listener.

**Parameters**

| Name       | Type                              | Description |
| ---------- | --------------------------------- | ----------- |
| `listener` | `(state: LiveQueryState) => void` |             |

#### RawLiveQuerySubscription.renew (#client-rawlivequerysubscriptionrenew)

```ts
renew(query: SealedLiveQuery<Row>): Promise<void>
```

Renew this logical subscription with a capability for the same exact query.
If the preceding subscription has expired, the client creates a new
wire subscription while preserving this object, its listeners, and any
retained rows. The replacement then produces a new authoritative reset.

**Returns:** A promise that resolves after the proxy accepts the replacement.
A subsequent authoritative reset returns the subscription to `live`.

**Throws:** If the replacement query fingerprint differs or renewal is rejected.

**Parameters**

| Name    | Type                   | Description |
| ------- | ---------------------- | ----------- |
| `query` | `SealedLiveQuery<Row>` |             |

### RealtimeClient (#client-realtimeclient)

```ts
interface RealtimeClient
```

A client that multiplexes independently disposable subscriptions.

#### Members (#client-realtimeclient-members)

| Name                                           | Type                                                                                                                                                                                                                            | Description                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `close`                                        | `() => void`                                                                                                                                                                                                                    | Permanently close all subscriptions and the underlying WebSocket.  |
| [`subscribe`](#client-realtimeclientsubscribe) | `<Row>(query: SealedLiveQuery<Row>, options?: MaterializedLiveQueryOptions<Row>) => MaterializedLiveQuerySubscription<Row> & <Row>(query: SealedLiveQuery<Row>, options: RawLiveQueryOptions) => RawLiveQuerySubscription<Row>` | Start a materialized subscription, optionally with preloaded rows. |

#### RealtimeClient.subscribe (#client-realtimeclientsubscribe)

```ts
subscribe<Row>(query: SealedLiveQuery<Row>, options?: MaterializedLiveQueryOptions<Row>): MaterializedLiveQuerySubscription<Row>
```

Start a materialized subscription, optionally with preloaded rows.

**Returns:** An independently disposable materialized subscription.

**Throws:** If the query is malformed or the client is closed.

**Parameters**

| Name       | Type                                | Description                                                 |
| ---------- | ----------------------------------- | ----------------------------------------------------------- |
| `query`    | `SealedLiveQuery<Row>`              | Short-lived capability returned by the application backend. |
| `options?` | `MaterializedLiveQueryOptions<Row>` | Materialization and optional preloaded-row settings.        |

```ts
subscribe<Row>(query: SealedLiveQuery<Row>, options: RawLiveQueryOptions): RawLiveQuerySubscription<Row>
```

Start a raw subscription without retaining query rows in the SDK.

**Returns:** An independently disposable raw subscription.

**Throws:** If the query is malformed or the client is closed.

**Parameters**

| Name      | Type                   | Description                                                 |
| --------- | ---------------------- | ----------------------------------------------------------- |
| `query`   | `SealedLiveQuery<Row>` | Short-lived capability returned by the application backend. |
| `options` | `RawLiveQueryOptions`  | Set `materialize` to `false` to consume raw events.         |

### RealtimeClientOptions (#client-realtimeclientoptions)

```ts
interface RealtimeClientOptions
```

Configuration for a reusable Realtime browser client.

#### Members (#client-realtimeclientoptions-members)

| Name        | Type                                                                                                                  | Description                                                                                                                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger?`   | `readonly RealtimeLogger`                                                                                             | Structured diagnostic sink. It is called only for events enabled by `logLevel`; exceptions from the sink are ignored.                                                                                                                          |
| `logLevel?` | `readonly RealtimeLogLevel`                                                                                           | Minimum client diagnostic level. The default, `silent`, emits nothing. When enabled without `logger`, entries are written to `console`.                                                                                                        |
| `parsers?`  | `readonly Readonly<Record<number, PostgreSQLBytesParser<unknown> \| PostgreSQLTextParser<unknown>> & BuiltInParsers>` | PostgreSQL result parsers keyed by type OID. These entries override [`nodePostgresParsers`](/docs/realtime/sdks/typescript#client-nodepostgresparsers). The client snapshots the object when it is created, so later mutations have no effect. |
| `url`       | `readonly string`                                                                                                     | Realtime proxy WebSocket URL, using `wss:` outside local development.                                                                                                                                                                          |

### LiveQueryChange (#client-livequerychange)

```ts
type LiveQueryChange<Row> = { readonly row: Row; readonly rowId: string; readonly type: "upsert" } | { readonly rowId: string; readonly type: "remove" }
```

A row upsert or removal in an atomic publication batch.

### LiveQuerySnapshot (#client-livequerysnapshot)

```ts
type LiveQuerySnapshot<Row> = LiveQueryState & { data: readonly Row[] | undefined }
```

Materialized query rows paired with their atomic lifecycle state.

### LiveQueryState (#client-livequerystate)

```ts
type LiveQueryState = { readonly error: undefined; readonly status: "connecting" | "live" | "stale" | "closed" } | { readonly error: LiveQueryError; readonly status: "error" }
```

Atomic lifecycle state for a live-query subscription.

### PostgreSQLBytesParser (#client-postgresqlbytesparser)

```ts
type PostgreSQLBytesParser<Value = unknown> = (value: Uint8Array) => Value
```

A parser for PostgreSQL `bytea`, transported as decoded bytes.

### PostgreSQLParserForOid (#client-postgresqlparserforoid)

```ts
type PostgreSQLParserForOid<Oid extends number> = Oid extends typeof pgTypeOids.bytea ? PostgreSQLBytesParser : PostgreSQLTextParser
```

Parser input selected by the fixed Realtime protocol v1 OID/codec mapping.

### PostgreSQLParsers (#client-postgresqlparsers)

```ts
type PostgreSQLParsers = Readonly<Record<number, PostgreSQLTextParser | PostgreSQLBytesParser> & BuiltInParsers>
```

A sparse collection of result parsers keyed by PostgreSQL type OID.

### PostgreSQLTextParser (#client-postgresqltextparser)

```ts
type PostgreSQLTextParser<Value = unknown> = (value: string) => Value
```

A parser for a PostgreSQL value transported with the `pg_text` codec.

### RealtimeLogEntry (#client-realtimelogentry)

```ts
type RealtimeLogEntry = { [Event in RealtimeLogEvent]: RealtimeLogEntryFor<Event> }[RealtimeLogEvent]
```

Structured client diagnostic passed to a configured logger.

Narrowing on `event` also narrows the metadata available on the entry.

### RealtimeLogEvent (#client-realtimelogevent)

```ts
type RealtimeLogEvent = keyof RealtimeLogEventDefinition
```

Stable name for one client diagnostic event.

### RealtimeLogger (#client-realtimelogger)

```ts
type RealtimeLogger = (entry: RealtimeLogEntry) => void
```

Receives structured Realtime client diagnostics.

### RealtimeLogLevel (#client-realtimeloglevel)

```ts
type RealtimeLogLevel = "silent" | "error" | "warn" | "info" | "debug"
```

Client-side diagnostic verbosity.

### nodePostgresParsers (#client-nodepostgresparsers)

```ts
const nodePostgresParsers: PostgreSQLParsers
```

Core result parsers matching familiar node-postgres/Neon Serverless values.

Less-common and unknown OIDs are intentionally absent and fall back to their
exact PostgreSQL text. Known built-in array OIDs are decoded recursively by
the client using the active parser for their element OID.

### pgTypeOids (#client-pgtypeoids)

```ts
const pgTypeOids: Readonly<{ readonly bit: 1560; readonly bitArray: 1561; readonly bool: 16; readonly boolArray: 1000; readonly box: 603; readonly boxArray: 1020; readonly bpchar: 1042; readonly bpcharArray: 1014; readonly bytea: 17; readonly byteaArray: 1001; readonly char: 18; readonly charArray: 1002; readonly cidr: 650; readonly cidrArray: 651; readonly circle: 718; readonly circleArray: 719; readonly cstring: 2275; readonly cstringArray: 1263; readonly date: 1082; readonly dateArray: 1182; readonly float4: 700; readonly float4Array: 1021; readonly float8: 701; readonly float8Array: 1022; readonly inet: 869; readonly inetArray: 1041; readonly int2: 21; readonly int2Array: 1005; readonly int4: 23; readonly int4Array: 1007; readonly int8: 20; readonly int8Array: 1016; readonly interval: 1186; readonly intervalArray: 1187; readonly json: 114; readonly jsonArray: 199; readonly jsonb: 3802; readonly jsonbArray: 3807; readonly line: 628; readonly lineArray: 629; readonly lseg: 601; readonly lsegArray: 1018; readonly macaddr: 829; readonly macaddr8: 774; readonly macaddr8Array: 775; readonly macaddrArray: 1040; readonly money: 790; readonly moneyArray: 791; readonly name: 19; readonly nameArray: 1003; readonly numeric: 1700; readonly numericArray: 1231; readonly oid: 26; readonly oidArray: 1028; readonly path: 602; readonly pathArray: 1019; readonly pgLsn: 3220; readonly pgLsnArray: 3221; readonly point: 600; readonly pointArray: 1017; readonly polygon: 604; readonly polygonArray: 1027; readonly text: 25; readonly textArray: 1009; readonly time: 1083; readonly timeArray: 1183; readonly timestamp: 1114; readonly timestampArray: 1115; readonly timestamptz: 1184; readonly timestamptzArray: 1185; readonly timetz: 1266; readonly timetzArray: 1270; readonly uuid: 2950; readonly uuidArray: 2951; readonly varbit: 1562; readonly varbitArray: 1563; readonly varchar: 1043; readonly varcharArray: 1015; readonly xml: 142; readonly xmlArray: 143 }>
```

Stable PostgreSQL type OIDs used by the built-in Realtime parsers.

### postgresJsParsers (#client-postgresjsparsers)

```ts
const postgresJsParsers: PostgreSQLParsers
```

Parsers that differ from the core defaults when matching Postgres.js.
Spread this partial preset into the client's `parsers` option.

### SealedLiveQuery (#client-sealedlivequery)

Re-exported from [Backend](/docs/realtime/sdks/typescript#backend-sealedlivequery).
