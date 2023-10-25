

|              Chapter 33. Regression Tests             |                                                    |                                 |                                                       |                                                     |
| :---------------------------------------------------: | :------------------------------------------------- | :-----------------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](jit-extensibility.html "32.4. Extensibility")  | [Up](admin.html "Part III. Server Administration") | Part III. Server Administration | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](regress-run.html "33.1. Running the Tests") |

***

## Chapter 33. Regression Tests

**Table of Contents**

* [33.1. Running the Tests](regress-run.html)

  * *   [33.1.1. Running the Tests Against a Temporary Installation](regress-run.html#REGRESS-RUN-TEMP-INST)
    * [33.1.2. Running the Tests Against an Existing Installation](regress-run.html#REGRESS-RUN-EXISTING-INST)
    * [33.1.3. Additional Test Suites](regress-run.html#REGRESS-ADDITIONAL)
    * [33.1.4. Locale and Encoding](regress-run.html#REGRESS-RUN-LOCALE)
    * [33.1.5. Custom Server Settings](regress-run.html#REGRESS-RUN-CUSTOM-SETTINGS)
    * [33.1.6. Extra Tests](regress-run.html#REGRESS-RUN-EXTRA-TESTS)

* [33.2. Test Evaluation](regress-evaluation.html)

  * *   [33.2.1. Error Message Differences](regress-evaluation.html#REGRESS-EVALUATION-MESSAGE-DIFFERENCES)
    * [33.2.2. Locale Differences](regress-evaluation.html#REGRESS-EVALUATION-LOCALE-DIFFERENCES)
    * [33.2.3. Date and Time Differences](regress-evaluation.html#REGRESS-EVALUATION-DATE-TIME-DIFFERENCES)
    * [33.2.4. Floating-Point Differences](regress-evaluation.html#REGRESS-EVALUATION-FLOAT-DIFFERENCES)
    * [33.2.5. Row Ordering Differences](regress-evaluation.html#REGRESS-EVALUATION-ORDERING-DIFFERENCES)
    * [33.2.6. Insufficient Stack Depth](regress-evaluation.html#REGRESS-EVALUATION-STACK-DEPTH)
    * [33.2.7. The “random” Test](regress-evaluation.html#REGRESS-EVALUATION-RANDOM-TEST)
    * [33.2.8. Configuration Parameters](regress-evaluation.html#REGRESS-EVALUATION-CONFIG-PARAMS)

  * *   [33.3. Variant Comparison Files](regress-variant.html)
  * [33.4. TAP Tests](regress-tap.html)

    

  * [33.4.1. Environment Variables](regress-tap.html#REGRESS-TAP-VARS)

* [33.5. Test Coverage Examination](regress-coverage.html)

  * *   [33.5.1. Coverage with Autoconf and Make](regress-coverage.html#REGRESS-COVERAGE-CONFIGURE)
    * [33.5.2. Coverage with Meson](regress-coverage.html#REGRESS-COVERAGE-MESON)

The regression tests are a comprehensive set of tests for the SQL implementation in PostgreSQL. They test standard SQL operations as well as the extended capabilities of PostgreSQL.

***

|                                                       |                                                       |                                                     |
| :---------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](jit-extensibility.html "32.4. Extensibility")  |   [Up](admin.html "Part III. Server Administration")  |  [Next](regress-run.html "33.1. Running the Tests") |
| 32.4. Extensibility                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                             33.1. Running the Tests |
