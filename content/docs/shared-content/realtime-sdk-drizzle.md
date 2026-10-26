**Import specifier** `@neon/realtime-drizzle`

### Symbols (#drizzle-symbols)

| Symbol                                      | Kind     | Summary                                                                                                                                                                                                                                                                            |
| ------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`drizzleAdapter`](#drizzle-drizzleadapter) | Function | Prepare concrete Drizzle PostgreSQL selects as live queries. Drizzle supplies parameterized SQL and driver-ready values. Every parameter uses OID `0`, allowing PostgreSQL to infer its type from SQL context. The proxy returns result metadata when it accepts the subscription. |

### drizzleAdapter (#drizzle-drizzleadapter)

```ts
function drizzleAdapter(): RealtimeAdapter<ConcretePgSelectQuery>
```

Prepare concrete Drizzle PostgreSQL selects as live queries.

Drizzle supplies parameterized SQL and driver-ready values. Every parameter
uses OID `0`, allowing PostgreSQL to infer its type from SQL context. The
proxy returns result metadata when it accepts the subscription.

**Returns:** An adapter to pass to `createRealtime()` on the application backend.

#### Returns (#drizzle-drizzleadapter-returns)

`RealtimeAdapter<ConcretePgSelectQuery>`
