**Import specifier** `@neon/realtime-react`

### Symbols (#react-symbols)

| Symbol                                                  | Kind       | Summary                                                                                                                                                                                                                                                                |
| ------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`RealtimeProvider`](#react-realtimeprovider)           | Function   | Provide one shared Realtime client to descendant [`useLiveQuery`](/docs/realtime/sdks/typescript#react-uselivequery) hooks. Create the client once for the browser application. The provider does not fetch query sealed queries or close the client when it unmounts. |
| [`useLiveQuery`](#react-uselivequery)                   | Function   | Subscribe to a sealed query and expose its materialized snapshot to React. The hook owns subscription cleanup.                                                                                                                                                         |
| [`RealtimeProviderProps`](#react-realtimeproviderprops) | Interface  | Props accepted by [`RealtimeProvider`](/docs/realtime/sdks/typescript#react-realtimeprovider).                                                                                                                                                                         |
| [`UseLiveQueryOptions`](#react-uselivequeryoptions)     | Interface  | Options for [`useLiveQuery`](/docs/realtime/sdks/typescript#react-uselivequery).                                                                                                                                                                                       |
| [`UseLiveQueryResult`](#react-uselivequeryresult)       | Type alias | React-facing snapshot and lower-level utilities returned by `useLiveQuery()`.                                                                                                                                                                                          |
| [`UseLiveQueryUtils`](#react-uselivequeryutils)         | Type alias | Stable imperative access to the hook's underlying materialized subscription. Cleanup remains owned by React, so `unsubscribe()` is intentionally omitted.                                                                                                              |

### RealtimeProvider (#react-realtimeprovider)

```ts
function RealtimeProvider(props: RealtimeProviderProps): ReactElement
```

Provide one shared Realtime client to descendant [`useLiveQuery`](/docs/realtime/sdks/typescript#react-uselivequery)
hooks.

Create the client once for the browser application. The provider does not
fetch query sealed queries or close the client when it unmounts.

**Returns:** A context provider for Realtime hooks.

#### Parameters (#react-realtimeprovider-parameters)

| Name    | Type                    | Description                              |
| ------- | ----------------------- | ---------------------------------------- |
| `props` | `RealtimeProviderProps` | Shared client and descendant React tree. |

#### Returns (#react-realtimeprovider-returns)

`ReactElement`

### useLiveQuery (#react-uselivequery)

```ts
function useLiveQuery<Row>(query: SealedLiveQuery<Row>, options: UseLiveQueryOptions<Row> = {}): UseLiveQueryResult<Row>
```

Subscribe to a sealed query and expose its materialized snapshot to
React. The hook owns subscription cleanup.

**Returns:** The current rows and lifecycle state plus stable subscription
utilities.

**Throws:** If used outside a [`RealtimeProvider`](/docs/realtime/sdks/typescript#react-realtimeprovider).

#### Type parameters (#react-uselivequery-type-parameters)

| Name  | Default | Description                  |
| ----- | ------- | ---------------------------- |
| `Row` |         | Row inferred from the query. |

#### Parameters (#react-uselivequery-parameters)

| Name      | Type                       | Description                                              |
| --------- | -------------------------- | -------------------------------------------------------- |
| `query`   | `SealedLiveQuery<Row>`     | Capability obtained from the application backend.        |
| `options` | `UseLiveQueryOptions<Row>` | Optional preloaded rows and capability-refresh callback. |

#### Returns (#react-uselivequery-returns)

`UseLiveQueryResult<Row>`

### RealtimeProviderProps (#react-realtimeproviderprops)

```ts
interface RealtimeProviderProps
```

Props accepted by [`RealtimeProvider`](/docs/realtime/sdks/typescript#react-realtimeprovider).

#### Members (#react-realtimeproviderprops-members)

| Name       | Type                      | Description                                                                                      |
| ---------- | ------------------------- | ------------------------------------------------------------------------------------------------ |
| `children` | `readonly ReactNode`      | React subtree that may call [`useLiveQuery`](/docs/realtime/sdks/typescript#react-uselivequery). |
| `client`   | `readonly RealtimeClient` | Shared browser client made available to descendant hooks.                                        |

### UseLiveQueryOptions (#react-uselivequeryoptions)

```ts
interface UseLiveQueryOptions<Row>
```

Options for [`useLiveQuery`](/docs/realtime/sdks/typescript#react-uselivequery).

#### Members (#react-uselivequeryoptions-members)

| Name            | Type                                           | Description                                                                                                                                        |
| --------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialData?`  | `readonly Row[]`                               | Server-rendered or otherwise preloaded rows exposed while connecting.                                                                              |
| `refreshQuery?` | `readonly () => Promise<SealedLiveQuery<Row>>` | Obtain a replacement capability for the same exact query before expiry. Transient failures are retried while the current capability remains valid. |

### UseLiveQueryResult (#react-uselivequeryresult)

```ts
type UseLiveQueryResult<Row> = LiveQuerySnapshot<Row> & { readonly utils: UseLiveQueryUtils<Row> }
```

React-facing snapshot and lower-level utilities returned by `useLiveQuery()`.

### UseLiveQueryUtils (#react-uselivequeryutils)

```ts
type UseLiveQueryUtils<Row> = Omit<MaterializedLiveQuerySubscription<Row>, "unsubscribe">
```

Stable imperative access to the hook's underlying materialized subscription.

Cleanup remains owned by React, so `unsubscribe()` is intentionally omitted.
