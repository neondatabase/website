[#id](#DATETIME-INPUT-RULES)

## B.1. Date/Time Input Interpretation [#](#DATETIME-INPUT-RULES)

Date/time input strings are decoded using the following procedure.

1. Break the input string into tokens and categorize each token as a string, time, time zone, or number.

   1. If the numeric token contains a colon (`:`), this is a time string. Include all subsequent digits and colons.

   2. If the numeric token contains a dash (`-`), slash (`/`), or two or more dots (`.`), this is a date string which might have a text month. If a date token has already been seen, it is instead interpreted as a time zone name (e.g., `America/New_York`).

   3. If the token is numeric only, then it is either a single field or an ISO 8601 concatenated date (e.g., `19990113` for January 13, 1999) or time (e.g., `141516` for 14:15:16).

   4. If the token starts with a plus (`+`) or minus (`-`), then it is either a numeric time zone or a special field.

2. If the token is an alphabetic string, match up with possible strings:

   1. See if the token matches any known time zone abbreviation. These abbreviations are supplied by the configuration file described in [Section B.4](datetime-config-files).

   2. If not found, search an internal table to match the token as either a special string (e.g., `today`), day (e.g., `Thursday`), month (e.g., `January`), or noise word (e.g., `at`, `on`).

   3. If still not found, throw an error.

3. When the token is a number or number field:

   1. If there are eight or six digits, and if no other date fields have been previously read, then interpret as a “concatenated date” (e.g., `19990118` or `990118`). The interpretation is `YYYYMMDD` or `YYMMDD`.

   2. If the token is three digits and a year has already been read, then interpret as day of year.

   3. If four or six digits and a year has already been read, then interpret as a time (`HHMM` or `HHMMSS`).

   4. If three or more digits and no date fields have yet been found, interpret as a year (this forces yy-mm-dd ordering of the remaining date fields).

   5. Otherwise the date field ordering is assumed to follow the `DateStyle` setting: mm-dd-yy, dd-mm-yy, or yy-mm-dd. Throw an error if a month or day field is found to be out of range.

4. If BC has been specified, negate the year and add one for internal storage. (There is no year zero in the Gregorian calendar, so numerically 1 BC becomes year zero.)

5. If BC was not specified, and if the year field was two digits in length, then adjust the year to four digits. If the field is less than 70, then add 2000, otherwise add 1900.

   ### Tip

   Gregorian years AD 1–99 can be entered by using 4 digits with leading zeros (e.g., `0099` is AD 99).
