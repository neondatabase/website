[#id](#PLANNER-STATS-DETAILS)

## Chapter 76. How the Planner Uses Statistics

**Table of Contents**

- [76.1. Row Estimation Examples](row-estimation-examples)
- [76.2. Multivariate Statistics Examples](multivariate-statistics-examples)

  - [76.2.1. Functional Dependencies](multivariate-statistics-examples#FUNCTIONAL-DEPENDENCIES)
  - [76.2.2. Multivariate N-Distinct Counts](multivariate-statistics-examples#MULTIVARIATE-NDISTINCT-COUNTS)
  - [76.2.3. MCV Lists](multivariate-statistics-examples#MCV-LISTS)

- [76.3. Planner Statistics and Security](planner-stats-security)

This chapter builds on the material covered in [Section 14.1](using-explain) and [Section 14.2](planner-stats) to show some additional details about how the planner uses the system statistics to estimate the number of rows each part of a query might return. This is a significant part of the planning process, providing much of the raw material for cost calculation.

The intent of this chapter is not to document the code in detail, but to present an overview of how it works. This will perhaps ease the learning curve for someone who subsequently wishes to read the code.
