[#id](#GEQO-INTRO2)

## 62.2. Genetic Algorithms [#](#GEQO-INTRO2)

The genetic algorithm (GA) is a heuristic optimization method which operates through randomized search. The set of possible solutions for the optimization problem is considered as a _population_ of _individuals_. The degree of adaptation of an individual to its environment is specified by its _fitness_.

The coordinates of an individual in the search space are represented by _chromosomes_, in essence a set of character strings. A _gene_ is a subsection of a chromosome which encodes the value of a single parameter being optimized. Typical encodings for a gene could be _binary_ or _integer_.

Through simulation of the evolutionary operations _recombination_, _mutation_, and _selection_ new generations of search points are found that show a higher average fitness than their ancestors. [Figure 62.1](geqo-intro2#GEQO-FIGURE) illustrates these steps.

[#id](#GEQO-FIGURE)

**Figure 62.1. Structure of a Genetic Algorithm**
![Structure of a Genetic Algorithm](/docs/postgres/genetic-algorithm.svg)

According to the comp.ai.genetic FAQ it cannot be stressed too strongly that a GA is not a pure random search for a solution to a problem. A GA uses stochastic processes, but the result is distinctly non-random (better than random).
