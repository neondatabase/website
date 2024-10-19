---
title: 'PostgreSQL Date Functions'
tableOfContents: true
---


The following page shows the most commonly used PostgreSQL date functions that allow you to effectively manipulate date and time values.

## Section 1. Getting the current date and time

This section shows you various functions for getting the current date, current date and time, current timestamp, without or without timezone.

- [CURRENT_DATE](/docs/postgresql/postgresql-date-functions/postgresql-current_date) - Return the current date.
-
- [CURRENT_TIME](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_time/) - Return the current time without date parts.
-
- [CURRENT_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_timestamp/) - Return the current date and time with the time zone at which the current transaction starts.
-
- [CLOCK_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-clock_timestamp/) - Return the current timestamp which changes during statement execution.
-
- [STATEMENT_TIMESTAMP](/docs/postgresql/postgresql-date-functions/postgresql-statement_timestamp) - Return the current timestamp and time of the current statement.
-
- [NOW](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-now/) - Return the date and time with the time zone at which the current transaction starts.
-
- [TRANSACTION_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_timestamp/) - Same as the [CURRENT_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_timestamp/) or [NOW()](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-now/) function.
-
- [LOCALTIME](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-localtime/) - Return the time at which the current transaction starts.
-
- [LOCALTIMESTAMP](/docs/postgresql/postgresql-date-functions/postgresql-localtimestamp) - Return the date and time at which the current transaction starts.

## Section 2. Extracting date and time components

This section provides you with functions for extracting date and time components

- [DATE_PART](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-date_part/) - Get a field of a timestamp or an interval e.g., year, month, day, etc.
-
- [EXTRACT](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-extract/) - Same as [DATE_PART()](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-date_part/) function.

## Section 3. Converting to date and time

This section introduces the functions that convert a string to a date and timestamp.

- [TO_DATE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-to_date/) - Convert a string to a date.
-
- [TO_TIMESTAMP](/docs/postgresql/postgresql-date-functions/postgresql-to_timestamp) - Convert a string to a timestamp.
-
- [MAKE_DATE](/docs/postgresql/postgresql-date-functions/postgresql-make_date) - Create a date from year, month, and day.
-
- [MAKE_TIME](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-make_time/) - Create a time from hour, minute, and second.

## Section 4. Handling intervals

This section covers the function that handles intervals such as calculating age based on intervals and justifying intervals for enhanced readability.

- [AGE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-age/) - Calculate the age and return an interval.
-
- [JUSTIFY_DAYS](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-justify_days/) - Adjust 30-day intervals as months.
-
- [JUSTIFY_HOURS](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-justify_hours/) - Adjust 24-hour intervals as days
-
- [JUSTIFY_INTERVAL](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-justify_interval/) - Adjust interval using justify_days and justify_hours functions, with additional sign adjustments.
-
- [MAKE_INTERVAL](/docs/postgresql/postgresql-date-functions/postgresql-make_interval) - Create an interval from the provided interval's components.

## Section 5. Operators

This section shows you how to use the date and time operators.

- [AT TIME ZONE](/docs/postgresql/postgresql-date-functions/postgresql-at-time-zone) - Convert a timestamp or a timestamp with time zone to a different time zone.

## Section 6. Utility functions

This section shows you various date and time utility functions.

- [DATE_TRUNC](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-date_trunc/) - Truncate a date.
-
- [ISFINITE](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-isfinite/) - Check if a date, a timestamp, or an interval is finite or not (not +/-infinity).
-
- [TIMEOFDAY](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-timeofday/) - Return the current date and time, like clock_timestamp, as a text string).
-
- [PG_SLEEP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-pg_sleep/) - Pause the execution of a statement for some seconds.
