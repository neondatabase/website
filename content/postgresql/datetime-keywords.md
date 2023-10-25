

|                                 B.3. Date/Time Key Words                                |                                                              |                               |                                                       |                                                                          |
| :-------------------------------------------------------------------------------------: | :----------------------------------------------------------- | :---------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](datetime-invalid-input.html "B.2. Handling of Invalid or Ambiguous Timestamps")  | [Up](datetime-appendix.html "Appendix B. Date/Time Support") | Appendix B. Date/Time Support | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](datetime-config-files.html "B.4. Date/Time Configuration Files") |

***

## B.3. Date/Time Key Words [#](#DATETIME-KEYWORDS)

[Table B.1](datetime-keywords.html#DATETIME-MONTH-TABLE "Table B.1. Month Names") shows the tokens that are recognized as names of months.

**Table B.1. Month Names**

| Month     | Abbreviations |
| --------- | ------------- |
| January   | Jan           |
| February  | Feb           |
| March     | Mar           |
| April     | Apr           |
| May       |               |
| June      | Jun           |
| July      | Jul           |
| August    | Aug           |
| September | Sep, Sept     |
| October   | Oct           |
| November  | Nov           |
| December  | Dec           |

\

[Table B.2](datetime-keywords.html#DATETIME-DOW-TABLE "Table B.2. Day of the Week Names") shows the tokens that are recognized as names of days of the week.

**Table B.2. Day of the Week Names**

| Day       | Abbreviations    |
| --------- | ---------------- |
| Sunday    | Sun              |
| Monday    | Mon              |
| Tuesday   | Tue, Tues        |
| Wednesday | Wed, Weds        |
| Thursday  | Thu, Thur, Thurs |
| Friday    | Fri              |
| Saturday  | Sat              |

\

[Table B.3](datetime-keywords.html#DATETIME-MOD-TABLE "Table B.3. Date/Time Field Modifiers") shows the tokens that serve various modifier purposes.

**Table B.3. Date/Time Field Modifiers**

| Identifier          | Description               |
| ------------------- | ------------------------- |
| `AM`                | Time is before 12:00      |
| `AT`                | Ignored                   |
| `JULIAN`, `JD`, `J` | Next field is Julian Date |
| `ON`                | Ignored                   |
| `PM`                | Time is on or after 12:00 |
| `T`                 | Next field is time        |

***

|                                                                                         |                                                              |                                                                          |
| :-------------------------------------------------------------------------------------- | :----------------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](datetime-invalid-input.html "B.2. Handling of Invalid or Ambiguous Timestamps")  | [Up](datetime-appendix.html "Appendix B. Date/Time Support") |  [Next](datetime-config-files.html "B.4. Date/Time Configuration Files") |
| B.2. Handling of Invalid or Ambiguous Timestamps                                        |     [Home](index.html "PostgreSQL 17devel Documentation")    |                                       B.4. Date/Time Configuration Files |
