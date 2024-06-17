[#id](#FUNCTIONS-UUID)

## 9.14. UUID Functions [#](#FUNCTIONS-UUID)

PostgreSQL includes one function to generate a UUID:

```

gen_random_uuid () → uuid
```

This function returns a version 4 (random) UUID. This is the most commonly used type of UUID and is appropriate for most applications.

The [uuid-ossp](uuid-ossp) module provides additional functions that implement other standard algorithms for generating UUIDs.

PostgreSQL also provides the usual comparison operators shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE) for UUIDs.
