**Import specifier** `@neon/realtime-drizzle/client`

### Symbols (#drizzle-client-symbols)

| Symbol                                             | Kind     | Summary                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`drizzleParsers`](#drizzle-client-drizzleparsers) | Variable | Parser overrides for Drizzle-compatible hydrated values. PostgreSQL `date` remains a string and zone-less `timestamp` is interpreted as UTC, matching Drizzle's default PostgreSQL column modes. Spread this preset into `createRealtimeClient({ parsers })`. Per-column Drizzle modes are intentionally outside this OID-only compatibility layer. |

### drizzleParsers (#drizzle-client-drizzleparsers)

```ts
const drizzleParsers: PostgreSQLParsers
```

Parser overrides for Drizzle-compatible hydrated values.

PostgreSQL `date` remains a string and zone-less `timestamp` is interpreted
as UTC, matching Drizzle's default PostgreSQL column modes. Spread this
preset into `createRealtimeClient({ parsers })`. Per-column Drizzle modes are
intentionally outside this OID-only compatibility layer.
