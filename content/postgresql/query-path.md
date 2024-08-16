[#id](#QUERY-PATH)

## 52.1. The Path of a Query [#](#QUERY-PATH)

Here we give a short overview of the stages a query has to pass to obtain a result.

1. A connection from an application program to the PostgreSQL server has to be established. The application program transmits a query to the server and waits to receive the results sent back by the server.

2. The _parser stage_ checks the query transmitted by the application program for correct syntax and creates a _query tree_.

3. The _rewrite system_ takes the query tree created by the parser stage and looks for any _rules_ (stored in the _system catalogs_) to apply to the query tree. It performs the transformations given in the _rule bodies_.

   One application of the rewrite system is in the realization of _views_. Whenever a query against a view (i.e., a _virtual table_) is made, the rewrite system rewrites the user's query to a query that accesses the _base tables_ given in the _view definition_ instead.

4. The _planner/optimizer_ takes the (rewritten) query tree and creates a _query plan_ that will be the input to the _executor_.

   It does so by first creating all possible _paths_ leading to the same result. For example if there is an index on a relation to be scanned, there are two paths for the scan. One possibility is a simple sequential scan and the other possibility is to use the index. Next the cost for the execution of each path is estimated and the cheapest path is chosen. The cheapest path is expanded into a complete plan that the executor can use.

5. The executor recursively steps through the _plan tree_ and retrieves rows in the way represented by the plan. The executor makes use of the _storage system_ while scanning relations, performs _sorts_ and _joins_, evaluates _qualifications_ and finally hands back the rows derived.

In the following sections we will cover each of the above listed items in more detail to give a better understanding of PostgreSQL's internal control and data structures.
