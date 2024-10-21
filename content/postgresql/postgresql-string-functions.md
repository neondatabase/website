---
modifiedAt: 2024-03-19 19:04:54
prevPost: postgresql-to_date-function
nextPost: postgresql-drop-schema-statement
createdAt: 2017-08-14T12:11:27.000Z
title: 'PostgreSQL String Functions'
tableOfContents: true
---

This page provides the most commonly used PostgreSQL string functions that allow you to manipulate string data effectively.  

| Function                                                                                                    | Description                                                                                     | Example                                              | Result             |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------ |
| [ASCII](/postgresql/postgresql-string-functions/postgresql-ascii)                   | Return the ASCII code value of a character or Unicode code point of a UTF8 character            | ASCII('A')                                           | 65                 |
| [CHR](/postgresql/postgresql-string-functions/postgresql-chr)                       | Convert an ASCII code to a character or a Unicode code point to a UTF8 character                | CHR(65)                                              | 'A'                |
| [CONCAT](/postgresql/postgresql-string-functions/postgresql-concat-function)        | Concatenate two or more strings into one                                                        | CONCAT('A','B','C')                                  | 'ABC'              |
| [CONCAT_WS](/postgresql/postgresql-string-functions/postgresql-concat_ws)           | Concatenate strings with a specified separator.                                                 | CONCAT_WS(',','A','B','C')                           | 'A,B,C'            |
| [FORMAT](/postgresql/postgresql-string-functions/postgresql-format)                 | Format a string based on a template                                                             | FORMAT('Hello %s','PostgreSQL')                      | 'Hello PostgreSQL' |
| [INITCAP](/postgresql/postgresql-string-functions/postgresql-letter-case-functions) | Convert words in a string to title case                                                         | INITCAP('hI tHERE')                                  | Hi There           |
| [LEFT](/postgresql/postgresql-string-functions/postgresql-left)                     | Return the first n character in a string                                                        | LEFT('ABC',1)                                        | 'A'                |
| [LENGTH](/postgresql/postgresql-string-functions/postgresql-length-function)        | Return the number of characters in a string                                                     | LENGTH('ABC')                                        | 3                  |
| [LOWER](/postgresql/postgresql-string-functions/postgresql-lower)                   | Convert a string to lowercase                                                                   | LOWER('hI tHERE')                                    | 'hi there'         |
| [LPAD](/postgresql/postgresql-string-functions/postgresql-lpad)                     | Extending a string to a length by padding specified characters on the left                      | LPAD('123', 5, '00')                                 | '00123'            |
| [LTRIM](/postgresql/postgresql-string-functions/postgresql-ltrim)                   | Remove the longest string that contains specified characters from the left of the input string  | LTRIM('00123')                                       | '123'              |
| [MD5](/postgresql/postgresql-string-functions/postgresql-md5)                       | Return MD5 hash of a string in hexadecimal                                                      | MD5('ABC')                                           |                    |
| [POSITION](/postgresql/postgresql-string-functions/postgresql-position)             | Return the location of a substring in a string                                                  | POSITION('B' in 'A B C')                             | 3                  |
| [REGEXP_MATCHES](/postgresql/postgresql-string-functions/postgresql-regexp_matches) | Replace substrings that match a POSIX regular expression with a new substring                   | SELECT REGEXP_MATCHES('ABC', '^(A)(..)\$', 'g');     | \{A,BC}             |
| [REGEXP_REPLACE](/postgresql/postgresql-string-functions/regexp_replace)            | Replace a substring using regular expressions.                                                  | REGEXP_REPLACE('John Doe','(.\*) (.\*)','\\2, \\1'); | 'Doe, John'        |
| [REPEAT](/postgresql/postgresql-string-functions/postgresql-repeat)                 | Repeat a string the specified number of times.                                                  | REPEAT('\*', 5)                                      | '\*\*\*\*\*'       |
| [REPLACE](/postgresql/postgresql-string-functions/postgresql-replace)               | Replace a substring within a string with a new one.                                             | REPLACE('ABC','B','A')                               | 'AAC'              |
| [REVERSE](/postgresql/postgresql-string-functions/postgresql-reverse)               | Replace a substring within a string with a new one                                              | REVERSE('ABC')                                       | 'CBA'              |
| [RIGHT](/postgresql/postgresql-string-functions/postgresql-right)                   | Return the last n characters in the string. When n is negative, return all but the first        | n                                                    | characters.        | RIGHT('ABC', 2) | 'BC' |
| [RPAD](/postgresql/postgresql-string-functions/postgresql-rpad)                     | Extend a string to a length by appending specified characters.                                  | RPAD('ABC', 6, 'xo')                                 | 'ABCxox'           |
| [RTRIM](/postgresql/postgresql-string-functions/postgresql-rtrim)                   | Remove the longest string that contains specified characters from the right of the input string | RTRIM('abcxxzx', 'xyz')                              | 'abc'              |
| [SPLIT_PART](/postgresql/postgresql-string-functions/postgresql-split_part)         | Split a string on a specified delimiter and return nth substring                                | SPLIT_PART('2017-12-31','-',2)                       | '12'               |
| [SUBSTRING](/postgresql/postgresql-string-functions/postgresql-substring)           | Extract a substring from a string                                                               | SUBSTRING('ABC',1,1)                                 | A'                 |
| [TRIM](/postgresql/postgresql-string-functions/postgresql-trim-function)            | Remove the leading and trailing characters from a string.                                       | TRIM(' ABC ')                                        | 'ABC'              |
| [UPPER](/postgresql/postgresql-string-functions/postgresql-upper)                   | Convert a string to uppercase                                                                   | UPPER('hI tHERE')                                    | 'HI THERE'         |
