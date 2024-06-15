[#id](#RULES)

## Chapter 41. The Rule System

**Table of Contents**

- [41.1. The Query Tree](querytree)
- [41.2. Views and the Rule System](rules-views)

  - [41.2.1. How `SELECT` Rules Work](rules-views#RULES-SELECT)
  - [41.2.2. View Rules in Non-`SELECT` Statements](rules-views#RULES-VIEWS-NON-SELECT)
  - [41.2.3. The Power of Views in PostgreSQL](rules-views#RULES-VIEWS-POWER)
  - [41.2.4. Updating a View](rules-views#RULES-VIEWS-UPDATE)

- [41.3. Materialized Views](rules-materializedviews)
- [41.4. Rules on `INSERT`, `UPDATE`, and `DELETE`](rules-update)

  - [41.4.1. How Update Rules Work](rules-update#RULES-UPDATE-HOW)
  - [41.4.2. Cooperation with Views](rules-update#RULES-UPDATE-VIEWS)

- [41.5. Rules and Privileges](rules-privileges)
- [41.6. Rules and Command Status](rules-status)
- [41.7. Rules Versus Triggers](rules-triggers)

This chapter discusses the rule system in PostgreSQL. Production rule systems are conceptually simple, but there are many subtle points involved in actually using them.

Some other database systems define active database rules, which are usually stored procedures and triggers. In PostgreSQL, these can be implemented using functions and triggers as well.

The rule system (more precisely speaking, the query rewrite rule system) is totally different from stored procedures and triggers. It modifies queries to take rules into consideration, and then passes the modified query to the query planner for planning and execution. It is very powerful, and can be used for many things such as query language procedures, views, and versions. The theoretical foundations and the power of this rule system are also discussed in [\[ston90b\]](biblio#STON90B) and [\[ong90\]](biblio#ONG90).
