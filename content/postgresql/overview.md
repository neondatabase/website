[#id](#OVERVIEW)

## Chapter 52. Overview of PostgreSQL Internals

**Table of Contents**

- [52.1. The Path of a Query](query-path)
- [52.2. How Connections Are Established](connect-estab)
- [52.3. The Parser Stage](parser-stage)

  - [52.3.1. Parser](parser-stage#PARSER-STAGE-PARSER)
  - [52.3.2. Transformation Process](parser-stage#PARSER-STAGE-TRANSFORMATION-PROCESS)

- [52.4. The PostgreSQL Rule System](rule-system)
- [52.5. Planner/Optimizer](planner-optimizer)

* [52.5.1. Generating Possible Plans](planner-optimizer#PLANNER-OPTIMIZER-GENERATING-POSSIBLE-PLANS)

- [52.6. Executor](executor)

### Author

This chapter originated as part of [\[sim98\]](biblio#SIM98) Stefan Simkovics' Master's Thesis prepared at Vienna University of Technology under the direction of O.Univ.Prof.Dr. Georg Gottlob and Univ.Ass. Mag. Katrin Seyr.

This chapter gives an overview of the internal structure of the backend of PostgreSQL. After having read the following sections you should have an idea of how a query is processed. This chapter is intended to help the reader understand the general sequence of operations that occur within the backend from the point at which a query is received, to the point at which the results are returned to the client.
