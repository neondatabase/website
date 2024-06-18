[#id](#REGRESS)

## Chapter 33. Regression Tests

**Table of Contents**

- [33.1. Running the Tests](regress-run)

  - [33.1.1. Running the Tests Against a Temporary Installation](regress-run#REGRESS-RUN-TEMP-INST)
  - [33.1.2. Running the Tests Against an Existing Installation](regress-run#REGRESS-RUN-EXISTING-INST)
  - [33.1.3. Additional Test Suites](regress-run#REGRESS-ADDITIONAL)
  - [33.1.4. Locale and Encoding](regress-run#REGRESS-RUN-LOCALE)
  - [33.1.5. Custom Server Settings](regress-run#REGRESS-RUN-CUSTOM-SETTINGS)
  - [33.1.6. Extra Tests](regress-run#REGRESS-RUN-EXTRA-TESTS)

- [33.2. Test Evaluation](regress-evaluation)

  - [33.2.1. Error Message Differences](regress-evaluation#REGRESS-EVALUATION-MESSAGE-DIFFERENCES)
  - [33.2.2. Locale Differences](regress-evaluation#REGRESS-EVALUATION-LOCALE-DIFFERENCES)
  - [33.2.3. Date and Time Differences](regress-evaluation#REGRESS-EVALUATION-DATE-TIME-DIFFERENCES)
  - [33.2.4. Floating-Point Differences](regress-evaluation#REGRESS-EVALUATION-FLOAT-DIFFERENCES)
  - [33.2.5. Row Ordering Differences](regress-evaluation#REGRESS-EVALUATION-ORDERING-DIFFERENCES)
  - [33.2.6. Insufficient Stack Depth](regress-evaluation#REGRESS-EVALUATION-STACK-DEPTH)
  - [33.2.7. The “random” Test](regress-evaluation#REGRESS-EVALUATION-RANDOM-TEST)
  - [33.2.8. Configuration Parameters](regress-evaluation#REGRESS-EVALUATION-CONFIG-PARAMS)

  - [33.3. Variant Comparison Files](regress-variant)
  - [33.4. TAP Tests](regress-tap)

  * [33.4.1. Environment Variables](regress-tap#REGRESS-TAP-VARS)

- [33.5. Test Coverage Examination](regress-coverage)

  - [33.5.1. Coverage with Autoconf and Make](regress-coverage#REGRESS-COVERAGE-CONFIGURE)
  - [33.5.2. Coverage with Meson](regress-coverage#REGRESS-COVERAGE-MESON)

The regression tests are a comprehensive set of tests for the SQL implementation in PostgreSQL. They test standard SQL operations as well as the extended capabilities of PostgreSQL.
