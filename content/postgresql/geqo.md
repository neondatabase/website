<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 Chapter 62. Genetic Query Optimizer                |                                            |                     |                                                       |                                                                                   |
| :----------------------------------------------------------------: | :----------------------------------------- | :-----------------: | ----------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](custom-scan-execution.html "61.3. Executing Custom Scans")  | [Up](internals.html "Part VII. Internals") | Part VII. Internals | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](geqo-intro.html "62.1. Query Handling as a Complex Optimization Problem") |

***

## Chapter 62. Genetic Query Optimizer

**Table of Contents**

  * *   [62.1. Query Handling as a Complex Optimization Problem](geqo-intro.html)
  * [62.2. Genetic Algorithms](geqo-intro2.html)
  * [62.3. Genetic Query Optimization (GEQO) in PostgreSQL](geqo-pg-intro.html)

    <!---->

  * *   [62.3.1. Generating Possible Plans with GEQO](geqo-pg-intro.html#GEQO-PG-INTRO-GEN-POSSIBLE-PLANS)
    * [62.3.2. Future Implementation Tasks for PostgreSQL GEQO](geqo-pg-intro.html#GEQO-FUTURE)

* [62.4. Further Reading](geqo-biblio.html)

### Author

Written by Martin Utesch (`<utesch@aut.tu-freiberg.de>`) for the Institute of Automatic Control at the University of Mining and Technology in Freiberg, Germany.

***

|                                                                    |                                                       |                                                                                   |
| :----------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](custom-scan-execution.html "61.3. Executing Custom Scans")  |       [Up](internals.html "Part VII. Internals")      |  [Next](geqo-intro.html "62.1. Query Handling as a Complex Optimization Problem") |
| 61.3. Executing Custom Scans                                       | [Home](index.html "PostgreSQL 17devel Documentation") |                            62.1. Query Handling as a Complex Optimization Problem |
