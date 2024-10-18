---
title: 'PostgreSQL Date Functions'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

The following page shows the most commonly used PostgreSQL date functions that allow you to effectively manipulate date and time values.

<!-- /wp:paragraph -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 1. Getting the current date and time

<!-- /wp:heading -->

<!-- wp:paragraph -->

This section shows you various functions for getting the current date, current date and time, current timestamp, without or without timezone.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [CURRENT_DATE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_date/) - Return the current date.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [CURRENT_TIME](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_time/) - Return the current time without date parts.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [CURRENT_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_timestamp/) - Return the current date and time with the time zone at which the current transaction starts.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [CLOCK_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-clock_timestamp/) - Return the current timestamp which changes during statement execution.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [STATEMENT_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-statement_timestamp/) - Return the current timestamp and time of the current statement.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [NOW](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-now/) - Return the date and time with the time zone at which the current transaction starts.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [TRANSACTION_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_timestamp/) - Same as the [CURRENT_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_timestamp/) or [NOW()](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-now/) function.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [LOCALTIME](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-localtime/) - Return the time at which the current transaction starts.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [LOCALTIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-localtimestamp/) - Return the date and time at which the current transaction starts.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 2. Extracting date and time components

<!-- /wp:heading -->

<!-- wp:paragraph -->

This section provides you with functions for extracting date and time components

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [DATE_PART](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-date_part/) - Get a field of a timestamp or an interval e.g., year, month, day, etc.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [EXTRACT](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-extract/) - Same as [DATE_PART()](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-date_part/) function.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 3. Converting to date and time

<!-- /wp:heading -->

<!-- wp:paragraph -->

This section introduces the functions that convert a string to a date and timestamp.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [TO_DATE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-to_date/) - Convert a string to a date.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [TO_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-to_timestamp/) - Convert a string to a timestamp.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [MAKE_DATE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-make_date/) - Create a date from year, month, and day.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [MAKE_TIME](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-make_time/) - Create a time from hour, minute, and second.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 4. Handling intervals

<!-- /wp:heading -->

<!-- wp:paragraph -->

This section covers the function that handles intervals such as calculating age based on intervals and justifying intervals for enhanced readability.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [AGE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-age/) - Calculate the age and return an interval.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [JUSTIFY_DAYS](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-justify_days/) - Adjust 30-day intervals as months.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [JUSTIFY_HOURS](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-justify_hours/) - Adjust 24-hour intervals as days
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [JUSTIFY_INTERVAL](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-justify_interval/) - Adjust interval using justify_days and justify_hours functions, with additional sign adjustments.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [MAKE_INTERVAL](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-make_interval/) - Create an interval from the provided interval's components.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 5. Operators

<!-- /wp:heading -->

<!-- wp:paragraph -->

This section shows you how to use the date and time operators.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [AT TIME ZONE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-at-time-zone/) - Convert a timestamp or a timestamp with time zone to a different time zone.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 6. Utility functions

<!-- /wp:heading -->

<!-- wp:paragraph -->

This section shows you various date and time utility functions.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [DATE_TRUNC](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-date_trunc/) - Truncate a date.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [ISFINITE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-isfinite/) - Check if a date, a timestamp, or an interval is finite or not (not +/-infinity).
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [TIMEOFDAY](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-timeofday/) - Return the current date and time, like clock_timestamp, as a text string).
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [PG_SLEEP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-pg_sleep/) - Pause the execution of a statement for some seconds.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->
