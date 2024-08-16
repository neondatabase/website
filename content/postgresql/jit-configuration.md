[#id](#JIT-CONFIGURATION)

## 32.3. Configuration [#](#JIT-CONFIGURATION)

The configuration variable [jit](runtime-config-query#GUC-JIT) determines whether JIT compilation is enabled or disabled. If it is enabled, the configuration variables [jit_above_cost](runtime-config-query#GUC-JIT-ABOVE-COST), [jit_inline_above_cost](runtime-config-query#GUC-JIT-INLINE-ABOVE-COST), and [jit_optimize_above_cost](runtime-config-query#GUC-JIT-OPTIMIZE-ABOVE-COST) determine whether JIT compilation is performed for a query, and how much effort is spent doing so.

[jit_provider](runtime-config-client#GUC-JIT-PROVIDER) determines which JIT implementation is used. It is rarely required to be changed. See [Section 32.4.2](jit-extensibility#JIT-PLUGGABLE).

For development and debugging purposes a few additional configuration parameters exist, as described in [Section 20.17](runtime-config-developer).
