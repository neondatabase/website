**Import specifier** `@neon/realtime-kysely`

### Symbols (#kysely-symbols)

| Symbol                                   | Kind     | Summary                                                                                                                                                                                                                                                                    |
| ---------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`kyselyAdapter`](#kysely-kyselyadapter) | Function | Prepare concrete Kysely selects as live queries. The adapter compiles Kysely's operation tree with its PostgreSQL compiler, then encodes the raw parameters using node-postgres-compatible rules. It never connects to or executes against the configured Kysely database. |

### kyselyAdapter (#kysely-kyselyadapter)

```ts
function kyselyAdapter(): RealtimeAdapter<KyselySelectQuery>
```

Prepare concrete Kysely selects as live queries.

The adapter compiles Kysely's operation tree with its PostgreSQL compiler,
then encodes the raw parameters using node-postgres-compatible rules. It
never connects to or executes against the configured Kysely database.

**Returns:** An adapter to pass to `createRealtime()` on the application backend.

#### Returns (#kysely-kyselyadapter-returns)

`RealtimeAdapter<KyselySelectQuery>`
