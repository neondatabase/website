[#id](#JIT-DECISION)

## 32.2. When to JIT? [#](#JIT-DECISION)

JIT compilation is beneficial primarily for long-running CPU-bound queries. Frequently these will be analytical queries. For short queries the added overhead of performing JIT compilation will often be higher than the time it can save.

To determine whether JIT compilation should be used, the total estimated cost of a query (see [Chapter 76](planner-stats-details) and [Section 20.7.2](runtime-config-query#RUNTIME-CONFIG-QUERY-CONSTANTS)) is used. The estimated cost of the query will be compared with the setting of [jit_above_cost](runtime-config-query#GUC-JIT-ABOVE-COST). If the cost is higher, JIT compilation will be performed. Two further decisions are then needed. Firstly, if the estimated cost is more than the setting of [jit_inline_above_cost](runtime-config-query#GUC-JIT-INLINE-ABOVE-COST), short functions and operators used in the query will be inlined. Secondly, if the estimated cost is more than the setting of [jit_optimize_above_cost](runtime-config-query#GUC-JIT-OPTIMIZE-ABOVE-COST), expensive optimizations are applied to improve the generated code. Each of these options increases the JIT compilation overhead, but can reduce query execution time considerably.

These cost-based decisions will be made at plan time, not execution time. This means that when prepared statements are in use, and a generic plan is used (see [PREPARE](sql-prepare)), the values of the configuration parameters in effect at prepare time control the decisions, not the settings at execution time.

### Note

If [jit](runtime-config-query#GUC-JIT) is set to `off`, or if no JIT implementation is available (for example because the server was compiled without `--with-llvm`), JIT will not be performed, even if it would be beneficial based on the above criteria. Setting [jit](runtime-config-query#GUC-JIT) to `off` has effects at both plan and execution time.

[EXPLAIN](sql-explain) can be used to see whether JIT is used or not. As an example, here is a query that is not using JIT:

```
=# EXPLAIN ANALYZE SELECT SUM(relpages) FROM pg_class;
                                                 QUERY PLAN
-------------------------------------------------------------------​------------------------------------------
 Aggregate  (cost=16.27..16.29 rows=1 width=8) (actual time=0.303..0.303 rows=1 loops=1)
   ->  Seq Scan on pg_class  (cost=0.00..15.42 rows=342 width=4) (actual time=0.017..0.111 rows=356 loops=1)
 Planning Time: 0.116 ms
 Execution Time: 0.365 ms
(4 rows)
```

Given the cost of the plan, it is entirely reasonable that no JIT was used; the cost of JIT would have been bigger than the potential savings. Adjusting the cost limits will lead to JIT use:

```
=# SET jit_above_cost = 10;
SET
=# EXPLAIN ANALYZE SELECT SUM(relpages) FROM pg_class;
                                                 QUERY PLAN
-------------------------------------------------------------------​------------------------------------------
 Aggregate  (cost=16.27..16.29 rows=1 width=8) (actual time=6.049..6.049 rows=1 loops=1)
   ->  Seq Scan on pg_class  (cost=0.00..15.42 rows=342 width=4) (actual time=0.019..0.052 rows=356 loops=1)
 Planning Time: 0.133 ms
 JIT:
   Functions: 3
   Options: Inlining false, Optimization false, Expressions true, Deforming true
   Timing: Generation 1.259 ms, Inlining 0.000 ms, Optimization 0.797 ms, Emission 5.048 ms, Total 7.104 ms
 Execution Time: 7.416 ms
```

As visible here, JIT was used, but inlining and expensive optimization were not. If [jit_inline_above_cost](runtime-config-query#GUC-JIT-INLINE-ABOVE-COST) or [jit_optimize_above_cost](runtime-config-query#GUC-JIT-OPTIMIZE-ABOVE-COST) were also lowered, that would change.
