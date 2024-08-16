[#id](#RULE-SYSTEM)

## 52.4. The PostgreSQL Rule System [#](#RULE-SYSTEM)

PostgreSQL supports a powerful _rule system_ for the specification of _views_ and ambiguous _view updates_. Originally the PostgreSQL rule system consisted of two implementations:

- The first one worked using _row level_ processing and was implemented deep in the _executor_. The rule system was called whenever an individual row had been accessed. This implementation was removed in 1995 when the last official release of the Berkeley Postgres project was transformed into Postgres95.

- The second implementation of the rule system is a technique called _query rewriting_. The _rewrite system_ is a module that exists between the _parser stage_ and the _planner/optimizer_. This technique is still implemented.

The query rewriter is discussed in some detail in [Chapter 41](rules), so there is no need to cover it here. We will only point out that both the input and the output of the rewriter are query trees, that is, there is no change in the representation or level of semantic detail in the trees. Rewriting can be thought of as a form of macro expansion.
