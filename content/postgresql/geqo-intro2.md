<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                              62.2. Genetic Algorithms                             |                                                       |                                     |                                                       |                                                                                     |
| :-------------------------------------------------------------------------------: | :---------------------------------------------------- | :---------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------------------: |
| [Prev](geqo-intro.html "62.1. Query Handling as a Complex Optimization Problem")  | [Up](geqo.html "Chapter 62. Genetic Query Optimizer") | Chapter 62. Genetic Query Optimizer | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](geqo-pg-intro.html "62.3. Genetic Query Optimization (GEQO) in PostgreSQL") |

***

## 62.2. Genetic Algorithms [#](#GEQO-INTRO2)

The genetic algorithm (GA) is a heuristic optimization method which operates through randomized search. The set of possible solutions for the optimization problem is considered as a *population* of *individuals*. The degree of adaptation of an individual to its environment is specified by its *fitness*.

The coordinates of an individual in the search space are represented by *chromosomes*, in essence a set of character strings. A *gene* is a subsection of a chromosome which encodes the value of a single parameter being optimized. Typical encodings for a gene could be *binary* or *integer*.

Through simulation of the evolutionary operations *recombination*, *mutation*, and *selection* new generations of search points are found that show a higher average fitness than their ancestors. [Figure 62.1](geqo-intro2.html#GEQO-FIGURE "Figure 62.1. Structure of a Genetic Algorithm") illustrates these steps.

**Figure 62.1. Structure of a Genetic Algorithm**

\


According to the comp.ai.genetic FAQ it cannot be stressed too strongly that a GA is not a pure random search for a solution to a problem. A GA uses stochastic processes, but the result is distinctly non-random (better than random).

***

|                                                                                   |                                                       |                                                                                     |
| :-------------------------------------------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------------------------------------: |
| [Prev](geqo-intro.html "62.1. Query Handling as a Complex Optimization Problem")  | [Up](geqo.html "Chapter 62. Genetic Query Optimizer") |  [Next](geqo-pg-intro.html "62.3. Genetic Query Optimization (GEQO) in PostgreSQL") |
| 62.1. Query Handling as a Complex Optimization Problem                            | [Home](index.html "PostgreSQL 17devel Documentation") |                               62.3. Genetic Query Optimization (GEQO) in PostgreSQL |
