**Import specifier** `@neon/realtime/server`

### Symbols (#backend-symbols)

| Symbol                                                                | Kind       | Summary                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`createRealtime`](#backend-createrealtime)                           | Function   | Create a server-only Realtime SDK. `seal()` performs local encryption and no network requests. Supplying a WebSocket `url` additionally enables trusted direct subscriptions that mint and refresh their own capabilities. Keep the project secret out of browser bundles.                                                                  |
| [`encodeTextParameter`](#backend-encodetextparameter)                 | Function   | Encode an already unambiguous scalar as a PostgreSQL text-format parameter. This low-level helper is intended for adapter authors. Application code using raw SQL should prefer [`pgParam`](/docs/realtime/sdks/typescript#backend-pgparam) for ambiguous PostgreSQL types.                                                                 |
| [`isTypedRawSqlParameter`](#backend-istypedrawsqlparameter)           | Function   | Test whether a value was created by one of the [`pgParam`](/docs/realtime/sdks/typescript#backend-pgparam) helpers. This low-level helper is intended for query-adapter authors. Applications should normally pass the wrapper directly to the adapter or [`rawSql`](/docs/realtime/sdks/typescript#backend-rawsql).                        |
| [`rawSql`](#backend-rawsql)                                           | Function   | Define a typed raw SQL query. Values are sent separately from the SQL. Bare values use type OID `0`, asking PostgreSQL to infer their types from the SQL. Use [`pgParam`](/docs/realtime/sdks/typescript#backend-pgparam) when a value needs an explicit PostgreSQL encoder and built-in type OID. JavaScript `null` represents SQL `NULL`. |
| [`validateLiveSelectSql`](#backend-validateliveselectsql)             | Function   | Validate that an adapter produced one supported PostgreSQL `SELECT`. This helper is intended for adapter authors. It performs the SDK's fast syntactic checks; the Realtime proxy remains authoritative.                                                                                                                                    |
| [`PostgresParameterHelpers`](#backend-postgresparameterhelpers)       | Interface  | PostgreSQL text encoders for values that bare raw SQL cannot disambiguate.                                                                                                                                                                                                                                                                  |
| [`PreparedLiveQuery`](#backend-preparedlivequery)                     | Interface  | Adapter-independent query encrypted into a live-query capability.                                                                                                                                                                                                                                                                           |
| [`PreparedLiveQueryParameter`](#backend-preparedlivequeryparameter)   | Interface  | One PostgreSQL text-format Bind parameter in a prepared live query.                                                                                                                                                                                                                                                                         |
| [`RawSqlQuery`](#backend-rawsqlquery)                                 | Interface  | Parameterized raw PostgreSQL SQL carrying its declared result-row type.                                                                                                                                                                                                                                                                     |
| [`RealtimeAdapter`](#backend-realtimeadapter)                         | Interface  | Converts an ORM-native query into the prepared live-query representation.                                                                                                                                                                                                                                                                   |
| [`RealtimeDirectServer`](#backend-realtimedirectserver)               | Interface  | Server-only SDK with trusted direct-query subscriptions. Each subscription prepares and encrypts its query locally, then uses a shared low-level client and refreshes its capability automatically. It remains stale through retryable outages and transparently replaces an expired subscription after connectivity returns.               |
| [`RealtimeDirectServerOptions`](#backend-realtimedirectserveroptions) | Interface  | Configuration that enables trusted direct-query subscriptions.                                                                                                                                                                                                                                                                              |
| [`RealtimeServer`](#backend-realtimeserver)                           | Interface  | Server-only Realtime capability issuer.                                                                                                                                                                                                                                                                                                     |
| [`RealtimeServerOptions`](#backend-realtimeserveroptions)             | Interface  | Configuration for a server-only Realtime capability issuer.                                                                                                                                                                                                                                                                                 |
| [`SealedLiveQuery`](#backend-sealedlivequery)                         | Interface  | JSON-compatible sealed representation of one exact live query. The query is a short-lived bearer credential. Transport it over HTTPS and do not put it in URLs, logs, or persistent browser storage.                                                                                                                                        |
| [`TypedRawSqlParameter`](#backend-typedrawsqlparameter)               | Interface  | A raw SQL parameter with an explicit PostgreSQL text encoder and type hint.                                                                                                                                                                                                                                                                 |
| [`RawSqlParameter`](#backend-rawsqlparameter)                         | Type alias | A JavaScript value accepted as a PostgreSQL text-format parameter.                                                                                                                                                                                                                                                                          |
| [`pgParam`](#backend-pgparam)                                         | Variable   | Helpers for values whose PostgreSQL text encoding or type is ambiguous.                                                                                                                                                                                                                                                                     |

### createRealtime (#backend-createrealtime)

```ts
function createRealtime<Query = RawSqlQuery<unknown>>(options: RealtimeDirectServerOptions<Query>): RealtimeDirectServer<Query>
```

Create a server-only Realtime SDK.

`seal()` performs local encryption and no network requests. Supplying a
WebSocket `url` additionally enables trusted direct subscriptions that mint
and refresh their own capabilities. Keep the project secret out of browser
bundles.

**Returns:** A reusable capability issuer, extended with direct subscriptions
when `url` is present.

**Throws:** If the secret or database name is invalid.

#### Type parameters (#backend-createrealtime-1-type-parameters)

| Name    | Default                | Description                                      |
| ------- | ---------------------- | ------------------------------------------------ |
| `Query` | `RawSqlQuery<unknown>` | Query object accepted by the configured adapter. |

#### Parameters (#backend-createrealtime-1-parameters)

| Name      | Type                                 | Description                                                    |
| --------- | ------------------------------------ | -------------------------------------------------------------- |
| `options` | `RealtimeDirectServerOptions<Query>` | Server-only secret, database name, and optional query adapter. |

#### Returns (#backend-createrealtime-1-returns)

`RealtimeDirectServer<Query>`

```ts
function createRealtime<Query = RawSqlQuery<unknown>>(options: RealtimeServerOptions<Query>): RealtimeServer<Query>
```

Create a server-only Realtime SDK.

`seal()` performs local encryption and no network requests. Supplying a
WebSocket `url` additionally enables trusted direct subscriptions that mint
and refresh their own capabilities. Keep the project secret out of browser
bundles.

**Returns:** A reusable capability issuer, extended with direct subscriptions
when `url` is present.

**Throws:** If the secret or database name is invalid.

#### Type parameters (#backend-createrealtime-2-type-parameters)

| Name    | Default                | Description                                      |
| ------- | ---------------------- | ------------------------------------------------ |
| `Query` | `RawSqlQuery<unknown>` | Query object accepted by the configured adapter. |

#### Parameters (#backend-createrealtime-2-parameters)

| Name      | Type                           | Description                                                    |
| --------- | ------------------------------ | -------------------------------------------------------------- |
| `options` | `RealtimeServerOptions<Query>` | Server-only secret, database name, and optional query adapter. |

#### Returns (#backend-createrealtime-2-returns)

`RealtimeServer<Query>`

### encodeTextParameter (#backend-encodetextparameter)

```ts
function encodeTextParameter(value: string | number | bigint | boolean | null, typeOid: number = 0): PreparedLiveQueryParameter
```

Encode an already unambiguous scalar as a PostgreSQL text-format parameter.

This low-level helper is intended for adapter authors. Application code
using raw SQL should prefer [`pgParam`](/docs/realtime/sdks/typescript#backend-pgparam) for ambiguous PostgreSQL types.

**Returns:** An immutable prepared parameter.

#### Parameters (#backend-encodetextparameter-parameters)

| Name      | Type                                            | Description                                                 |
| --------- | ----------------------------------------------- | ----------------------------------------------------------- |
| `value`   | `string \| number \| bigint \| boolean \| null` | Scalar value, or `null` for SQL `NULL`.                     |
| `typeOid` | `number`                                        | PostgreSQL type OID hint, or `0` for SQL-context inference. |

#### Returns (#backend-encodetextparameter-returns)

`PreparedLiveQueryParameter`

### isTypedRawSqlParameter (#backend-istypedrawsqlparameter)

```ts
function isTypedRawSqlParameter(value: unknown): value is TypedRawSqlParameter
```

Test whether a value was created by one of the [`pgParam`](/docs/realtime/sdks/typescript#backend-pgparam) helpers.

This low-level helper is intended for query-adapter authors. Applications
should normally pass the wrapper directly to the adapter or [`rawSql`](/docs/realtime/sdks/typescript#backend-rawsql).

#### Parameters (#backend-istypedrawsqlparameter-parameters)

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| `value` | `unknown` |             |

#### Returns (#backend-istypedrawsqlparameter-returns)

`value is TypedRawSqlParameter`

### rawSql (#backend-rawsql)

```ts
function rawSql<Row>(sql: string, parameters: readonly RawSqlParameter[] = []): RawSqlQuery<Row>
```

Define a typed raw SQL query. Values are sent separately from the SQL. Bare
values use type OID `0`, asking PostgreSQL to infer their types from the
SQL. Use [`pgParam`](/docs/realtime/sdks/typescript#backend-pgparam) when a value needs an explicit PostgreSQL encoder
and built-in type OID. JavaScript `null` represents SQL `NULL`.

**Returns:** An immutable query descriptor accepted by `seal()`.

#### Type parameters (#backend-rawsql-type-parameters)

| Name  | Default | Description                |
| ----- | ------- | -------------------------- |
| `Row` |         | Row returned by the query. |

#### Parameters (#backend-rawsql-parameters)

| Name         | Type                         | Description                                                   |
| ------------ | ---------------------------- | ------------------------------------------------------------- |
| `sql`        | `string`                     | Parameterized SQL using PostgreSQL placeholders such as `$1`. |
| `parameters` | `readonly RawSqlParameter[]` | Values in placeholder order.                                  |

#### Returns (#backend-rawsql-returns)

`RawSqlQuery<Row>`

### validateLiveSelectSql (#backend-validateliveselectsql)

```ts
function validateLiveSelectSql(sql: string): void
```

Validate that an adapter produced one supported PostgreSQL `SELECT`.

This helper is intended for adapter authors. It performs the SDK's fast
syntactic checks; the Realtime proxy remains authoritative.

**Throws:** If the SQL is not one supported `SELECT` statement.

#### Parameters (#backend-validateliveselectsql-parameters)

| Name  | Type     | Description                              |
| ----- | -------- | ---------------------------------------- |
| `sql` | `string` | Parameterized SQL emitted by an adapter. |

#### Returns (#backend-validateliveselectsql-returns)

`void`

### PostgresParameterHelpers (#backend-postgresparameterhelpers)

```ts
interface PostgresParameterHelpers
```

PostgreSQL text encoders for values that bare raw SQL cannot disambiguate.

#### Members (#backend-postgresparameterhelpers-members)

| Name          | Type                                                                                              | Description                                                                                                                                                                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `array`       | `(elementType: string, values: readonly unknown[]) => TypedRawSqlParameter`                       | Encode a possibly nested PostgreSQL array. Built-in element types supply their stable array OID; database-specific or unknown element types use OID `0`. JavaScript `null` becomes a SQL NULL array element. Values are encoded immediately, so later mutations do not affect the parameter. |
| `bytea`       | `(value: Uint8Array) => TypedRawSqlParameter`                                                     | Encode bytes in PostgreSQL's hexadecimal `bytea` text format.                                                                                                                                                                                                                                |
| `date`        | `(value: string \| Date) => TypedRawSqlParameter`                                                 | Encode a JavaScript date as a PostgreSQL `date`. A `Date` uses its UTC calendar date. A string is passed through as an already encoded PostgreSQL text value.                                                                                                                                |
| `json`        | `(value: unknown) => TypedRawSqlParameter`                                                        | Encode a JavaScript value as PostgreSQL `json`.                                                                                                                                                                                                                                              |
| `jsonb`       | `(value: unknown) => TypedRawSqlParameter`                                                        | Encode a JavaScript value as PostgreSQL `jsonb`.                                                                                                                                                                                                                                             |
| `text`        | `(sqlType: string, value: string \| number \| bigint \| boolean \| null) => TypedRawSqlParameter` | Use an already encoded PostgreSQL text value for a named type. A recognized built-in type supplies its stable OID. Unknown, database-specific, and extension types use OID `0` for inference.                                                                                                |
| `timestamp`   | `(value: string \| Date) => TypedRawSqlParameter`                                                 | Encode a JavaScript date as a UTC PostgreSQL `timestamp` without time zone. A string is passed through as an already encoded PostgreSQL text value.                                                                                                                                          |
| `timestamptz` | `(value: string \| Date) => TypedRawSqlParameter`                                                 | Encode a JavaScript date as a PostgreSQL `timestamptz`. A `Date` uses its ISO 8601 representation. A string is passed through as an already encoded PostgreSQL text value.                                                                                                                   |

### PreparedLiveQuery (#backend-preparedlivequery)

```ts
interface PreparedLiveQuery
```

Adapter-independent query encrypted into a live-query capability.

#### Members (#backend-preparedlivequery-members)

| Name         | Type                                    | Description                                                             |
| ------------ | --------------------------------------- | ----------------------------------------------------------------------- |
| `parameters` | `readonly PreparedLiveQueryParameter[]` | PostgreSQL text-format Bind values and type hints in placeholder order. |
| `sql`        | `readonly string`                       | Parameterized SQL. Adapters must never interpolate runtime values here. |

### PreparedLiveQueryParameter (#backend-preparedlivequeryparameter)

```ts
interface PreparedLiveQueryParameter
```

One PostgreSQL text-format Bind parameter in a prepared live query.

#### Members (#backend-preparedlivequeryparameter-members)

| Name      | Type                      | Description                                                        |
| --------- | ------------------------- | ------------------------------------------------------------------ |
| `typeOid` | `readonly number`         | PostgreSQL type OID hint, or `0` to request SQL-context inference. |
| `value`   | `readonly string \| null` | PostgreSQL text-format value, or `null` for SQL `NULL`.            |

### RawSqlQuery (#backend-rawsqlquery)

```ts
interface RawSqlQuery<Row> extends PreparedLiveQuery
```

Parameterized raw PostgreSQL SQL carrying its declared result-row type.

#### Members (#backend-rawsqlquery-members)

| Name         | Type                                    | Description                                                             |
| ------------ | --------------------------------------- | ----------------------------------------------------------------------- |
| `parameters` | `readonly PreparedLiveQueryParameter[]` | PostgreSQL text-format Bind values and type hints in placeholder order. |
| `sql`        | `readonly string`                       | Parameterized SQL. Adapters must never interpolate runtime values here. |

### RealtimeAdapter (#backend-realtimeadapter)

```ts
interface RealtimeAdapter<Query>
```

Converts an ORM-native query into the prepared live-query representation.

#### Members (#backend-realtimeadapter-members)

| Name      | Type                                  | Description                                                                                                                                                                                      |
| --------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prepare` | `(query: Query) => PreparedLiveQuery` | Convert an adapter-native query into parameterized SQL and text-format parameter values. Adapters may supply PostgreSQL type OID hints; `0` requests inference. The proxy supplies result types. |

### RealtimeDirectServer (#backend-realtimedirectserver)

```ts
interface RealtimeDirectServer<Query> extends RealtimeServer<Query>
```

Server-only SDK with trusted direct-query subscriptions.

Each subscription prepares and encrypts its query locally, then uses a
shared low-level client and refreshes its capability automatically. It
remains stale through retryable outages and transparently replaces an
expired subscription after connectivity returns.

#### Members (#backend-realtimedirectserver-members)

| Name                                                  | Type                                                                                                                                                                                                                                                                                                                | Description                                                                                                                                                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `close`                                               | `() => void`                                                                                                                                                                                                                                                                                                        | Permanently close every direct subscription and the shared WebSocket.                                                                                                                                                      |
| [`seal`](#backend-realtimedirectserverseal)           | `<ConcreteQuery>(input: SealInput<ConcreteQuery>) => Promise<SealedLiveQuery<QueryRow<ConcreteQuery>>>`                                                                                                                                                                                                             | Encrypt a concrete query as a short-lived sealed query. Raw queries produced by [`rawSql`](/docs/realtime/sdks/typescript#backend-rawsql) are always accepted. Other query objects are prepared by the configured adapter. |
| [`subscribe`](#backend-realtimedirectserversubscribe) | `<ConcreteQuery>(query: ConcreteQuery, options?: MaterializedLiveQueryOptions<QueryRow<ConcreteQuery>>) => Promise<MaterializedLiveQuerySubscription<QueryRow<ConcreteQuery>>> & <ConcreteQuery>(query: ConcreteQuery, options: RawLiveQueryOptions) => Promise<RawLiveQuerySubscription<QueryRow<ConcreteQuery>>>` | Subscribe to a query and retain its current materialized rows.                                                                                                                                                             |

#### RealtimeDirectServer.seal (#backend-realtimedirectserverseal)

```ts
seal<ConcreteQuery>(input: SealInput<ConcreteQuery>): Promise<SealedLiveQuery<QueryRow<ConcreteQuery>>>
```

Encrypt a concrete query as a short-lived sealed query.

Raw queries produced by [`rawSql`](/docs/realtime/sdks/typescript#backend-rawsql) are always accepted. Other query
objects are prepared by the configured adapter.

**Returns:** A JSON-compatible bearer capability with its public fingerprint
and expiry.

**Throws:** If the query is invalid, no adapter can prepare it, or capability
encryption fails.

**Parameters**

| Name    | Type                       | Description             |
| ------- | -------------------------- | ----------------------- |
| `input` | `SealInput<ConcreteQuery>` | Concrete query to seal. |

#### RealtimeDirectServer.subscribe (#backend-realtimedirectserversubscribe)

```ts
subscribe<ConcreteQuery>(query: ConcreteQuery, options?: MaterializedLiveQueryOptions<QueryRow<ConcreteQuery>>): Promise<MaterializedLiveQuerySubscription<QueryRow<ConcreteQuery>>>
```

Subscribe to a query and retain its current materialized rows.

**Returns:** An independently disposable subscription after its initial
capability has been minted locally.

**Throws:** If the query is invalid or the direct client has been closed.

**Parameters**

| Name       | Type                                                    | Description                                          |
| ---------- | ------------------------------------------------------- | ---------------------------------------------------- |
| `query`    | `ConcreteQuery`                                         | Concrete raw SQL or adapter-native query.            |
| `options?` | `MaterializedLiveQueryOptions<QueryRow<ConcreteQuery>>` | Materialization and optional preloaded-row settings. |

```ts
subscribe<ConcreteQuery>(query: ConcreteQuery, options: RawLiveQueryOptions): Promise<RawLiveQuerySubscription<QueryRow<ConcreteQuery>>>
```

Subscribe to raw resets and atomic change batches without retaining rows.

**Returns:** An independently disposable raw subscription after its initial
capability has been minted locally.

**Throws:** If the query is invalid or the direct client has been closed.

**Parameters**

| Name      | Type                  | Description                                         |
| --------- | --------------------- | --------------------------------------------------- |
| `query`   | `ConcreteQuery`       | Concrete raw SQL or adapter-native query.           |
| `options` | `RawLiveQueryOptions` | Set `materialize` to `false` to consume raw events. |

### RealtimeDirectServerOptions (#backend-realtimedirectserveroptions)

```ts
interface RealtimeDirectServerOptions<Query> extends RealtimeServerOptions<Query>
```

Configuration that enables trusted direct-query subscriptions.

#### Members (#backend-realtimedirectserveroptions-members)

| Name                                                          | Type                                                                                                                  | Description                                                                                                                                                                                               |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adapter?`                                                    | `readonly RealtimeAdapter<Query>`                                                                                     | Adapter for ORM-native queries; omit when sealing only raw SQL.                                                                                                                                           |
| `db`                                                          | `readonly string`                                                                                                     | PostgreSQL database for this SDK instance. It is embedded in every query capability. The first capability accepted on a WebSocket binds that connection to this database.                                 |
| [`debugMode?`](#backend-realtimedirectserveroptionsdebugmode) | `readonly boolean`                                                                                                    | Include full database error details in subscription errors. Enable this only in development. Detailed errors can expose schema names, table names, column names, and other database structure to clients. |
| `logger?`                                                     | `readonly RealtimeLogger`                                                                                             | Structured diagnostic sink for the internal direct-subscription client.                                                                                                                                   |
| `logLevel?`                                                   | `readonly RealtimeLogLevel`                                                                                           | Minimum diagnostic level for the internal direct-subscription client.                                                                                                                                     |
| `parsers?`                                                    | `readonly Readonly<Record<number, PostgreSQLBytesParser<unknown> \| PostgreSQLTextParser<unknown>> & BuiltInParsers>` | PostgreSQL result-parser overrides for trusted direct subscriptions.                                                                                                                                      |
| `secret`                                                      | `readonly string`                                                                                                     | Opaque server-only credential issued by Realtime.                                                                                                                                                         |
| `url`                                                         | `readonly string`                                                                                                     | Realtime WebSocket endpoint URL. Supplying it adds `subscribe()` and `close()` to the returned SDK.                                                                                                       |

#### RealtimeDirectServerOptions.debugMode (#backend-realtimedirectserveroptionsdebugmode)

```ts
readonly debugMode?: boolean
```

Include full database error details in subscription errors.

Enable this only in development. Detailed errors can expose schema names,
table names, column names, and other database structure to clients.

**Default**

```ts
false
```

### RealtimeServer (#backend-realtimeserver)

```ts
interface RealtimeServer<Query>
```

Server-only Realtime capability issuer.

#### Members (#backend-realtimeserver-members)

| Name                                  | Type                                                                                                    | Description                                                                                                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`seal`](#backend-realtimeserverseal) | `<ConcreteQuery>(input: SealInput<ConcreteQuery>) => Promise<SealedLiveQuery<QueryRow<ConcreteQuery>>>` | Encrypt a concrete query as a short-lived sealed query. Raw queries produced by [`rawSql`](/docs/realtime/sdks/typescript#backend-rawsql) are always accepted. Other query objects are prepared by the configured adapter. |

#### RealtimeServer.seal (#backend-realtimeserverseal)

```ts
seal<ConcreteQuery>(input: SealInput<ConcreteQuery>): Promise<SealedLiveQuery<QueryRow<ConcreteQuery>>>
```

Encrypt a concrete query as a short-lived sealed query.

Raw queries produced by [`rawSql`](/docs/realtime/sdks/typescript#backend-rawsql) are always accepted. Other query
objects are prepared by the configured adapter.

**Returns:** A JSON-compatible bearer capability with its public fingerprint
and expiry.

**Throws:** If the query is invalid, no adapter can prepare it, or capability
encryption fails.

**Parameters**

| Name    | Type                       | Description             |
| ------- | -------------------------- | ----------------------- |
| `input` | `SealInput<ConcreteQuery>` | Concrete query to seal. |

### RealtimeServerOptions (#backend-realtimeserveroptions)

```ts
interface RealtimeServerOptions<Query>
```

Configuration for a server-only Realtime capability issuer.

#### Members (#backend-realtimeserveroptions-members)

| Name                                                    | Type                              | Description                                                                                                                                                                                               |
| ------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adapter?`                                              | `readonly RealtimeAdapter<Query>` | Adapter for ORM-native queries; omit when sealing only raw SQL.                                                                                                                                           |
| `db`                                                    | `readonly string`                 | PostgreSQL database for this SDK instance. It is embedded in every query capability. The first capability accepted on a WebSocket binds that connection to this database.                                 |
| [`debugMode?`](#backend-realtimeserveroptionsdebugmode) | `readonly boolean`                | Include full database error details in subscription errors. Enable this only in development. Detailed errors can expose schema names, table names, column names, and other database structure to clients. |
| `secret`                                                | `readonly string`                 | Opaque server-only credential issued by Realtime.                                                                                                                                                         |

#### RealtimeServerOptions.debugMode (#backend-realtimeserveroptionsdebugmode)

```ts
readonly debugMode?: boolean
```

Include full database error details in subscription errors.

Enable this only in development. Detailed errors can expose schema names,
table names, column names, and other database structure to clients.

**Default**

```ts
false
```

### SealedLiveQuery (#backend-sealedlivequery)

```ts
interface SealedLiveQuery<Row>
```

JSON-compatible sealed representation of one exact live query.

The query is a short-lived bearer credential. Transport it over
HTTPS and do not put it in URLs, logs, or persistent browser storage.

#### Members (#backend-sealedlivequery-members)

| Name               | Type              | Description                                                              |
| ------------------ | ----------------- | ------------------------------------------------------------------------ |
| `capability`       | `readonly string` | Opaque encrypted bearer capability.                                      |
| `expiresAt`        | `readonly number` | Capability expiry as Unix milliseconds.                                  |
| `queryFingerprint` | `readonly string` | Stable identity used to prevent accidentally renewing a different query. |

### TypedRawSqlParameter (#backend-typedrawsqlparameter)

```ts
interface TypedRawSqlParameter extends PreparedLiveQueryParameter
```

A raw SQL parameter with an explicit PostgreSQL text encoder and type hint.

#### Members (#backend-typedrawsqlparameter-members)

| Name      | Type                      | Description                                                        |
| --------- | ------------------------- | ------------------------------------------------------------------ |
| `typeOid` | `readonly number`         | PostgreSQL type OID hint, or `0` to request SQL-context inference. |
| `value`   | `readonly string \| null` | PostgreSQL text-format value, or `null` for SQL `NULL`.            |

### RawSqlParameter (#backend-rawsqlparameter)

```ts
type RawSqlParameter = string | number | boolean | bigint | null | TypedRawSqlParameter
```

A JavaScript value accepted as a PostgreSQL text-format parameter.

### pgParam (#backend-pgparam)

```ts
const pgParam: PostgresParameterHelpers
```

Helpers for values whose PostgreSQL text encoding or type is ambiguous.
