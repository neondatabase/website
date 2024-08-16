[#id](#DATETIME-KEYWORDS)

## B.3. Date/Time Key Words [#](#DATETIME-KEYWORDS)

[Table B.1](datetime-keywords#DATETIME-MONTH-TABLE) shows the tokens that are recognized as names of months.

[#id](#DATETIME-MONTH-TABLE)

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

[Table B.2](datetime-keywords#DATETIME-DOW-TABLE) shows the tokens that are recognized as names of days of the week.

[#id](#DATETIME-DOW-TABLE)

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

[Table B.3](datetime-keywords#DATETIME-MOD-TABLE) shows the tokens that serve various modifier purposes.

[#id](#DATETIME-MOD-TABLE)

**Table B.3. Date/Time Field Modifiers**

| Identifier          | Description               |
| ------------------- | ------------------------- |
| `AM`                | Time is before 12:00      |
| `AT`                | Ignored                   |
| `JULIAN`, `JD`, `J` | Next field is Julian Date |
| `ON`                | Ignored                   |
| `PM`                | Time is on or after 12:00 |
| `T`                 | Next field is time        |
