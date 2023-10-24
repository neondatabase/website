<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       B.7. Julian Dates                      |                                                              |                               |                                                       |                                                                 |
| :----------------------------------------------------------: | :----------------------------------------------------------- | :---------------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](datetime-units-history.html "B.6. History of Units")  | [Up](datetime-appendix.html "Appendix B. Date/Time Support") | Appendix B. Date/Time Support | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-keywords-appendix.html "Appendix C. SQL Key Words") |

***

## B.7. Julian Dates [#](#DATETIME-JULIAN-DATES)

The *Julian Date* system is a method for numbering days. It is unrelated to the Julian calendar, though it is confusingly named similarly to that calendar. The Julian Date system was invented by the French scholar Joseph Justus Scaliger (1540–1609) and probably takes its name from Scaliger's father, the Italian scholar Julius Caesar Scaliger (1484–1558).

In the Julian Date system, each day has a sequential number, starting from JD 0 (which is sometimes called *the* Julian Date). JD 0 corresponds to 1 January 4713 BC in the Julian calendar, or 24 November 4714 BC in the Gregorian calendar. Julian Date counting is most often used by astronomers for labeling their nightly observations, and therefore a date runs from noon UTC to the next noon UTC, rather than from midnight to midnight: JD 0 designates the 24 hours from noon UTC on 24 November 4714 BC to noon UTC on 25 November 4714 BC.

Although PostgreSQL supports Julian Date notation for input and output of dates (and also uses Julian dates for some internal datetime calculations), it does not observe the nicety of having dates run from noon to noon. PostgreSQL treats a Julian Date as running from local midnight to local midnight, the same as a normal date.

This definition does, however, provide a way to obtain the astronomical definition when you need it: do the arithmetic in time zone `UTC+12`. For example,

    => SELECT extract(julian from '2021-06-23 7:00:00-04'::timestamptz at time zone 'UTC+12');
               extract
    ------------------------------
     2459388.95833333333333333333
    (1 row)
    => SELECT extract(julian from '2021-06-23 8:00:00-04'::timestamptz at time zone 'UTC+12');
                   extract
    --------------------------------------
     2459389.0000000000000000000000000000
    (1 row)
    => SELECT extract(julian from date '2021-06-23');
     extract
    ---------
     2459389
    (1 row)

***

|                                                              |                                                              |                                                                 |
| :----------------------------------------------------------- | :----------------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](datetime-units-history.html "B.6. History of Units")  | [Up](datetime-appendix.html "Appendix B. Date/Time Support") |  [Next](sql-keywords-appendix.html "Appendix C. SQL Key Words") |
| B.6. History of Units                                        |     [Home](index.html "PostgreSQL 17devel Documentation")    |                                       Appendix C. SQL Key Words |
