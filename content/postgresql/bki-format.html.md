<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                             75.3. BKI File Format                             |                                                                               |                                                              |                                                       |                                                 |
| :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------- | :----------------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------: |
| [Prev](system-catalog-initial-data.html "75.2. System Catalog Initial Data")  | [Up](bki.html "Chapter 75. System Catalog Declarations and Initial Contents") | Chapter 75. System Catalog Declarations and Initial Contents | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](bki-commands.html "75.4. BKI Commands") |

***

## 75.3. BKI File Format [#](#BKI-FORMAT)

This section describes how the PostgreSQL backend interprets BKI files. This description will be easier to understand if the `postgres.bki` file is at hand as an example.

BKI input consists of a sequence of commands. Commands are made up of a number of tokens, depending on the syntax of the command. Tokens are usually separated by whitespace, but need not be if there is no ambiguity. There is no special command separator; the next token that syntactically cannot belong to the preceding command starts a new one. (Usually you would put a new command on a new line, for clarity.) Tokens can be certain key words, special characters (parentheses, commas, etc.), identifiers, numbers, or single-quoted strings. Everything is case sensitive.

Lines starting with `#` are ignored.

***

|                                                                               |                                                                               |                                                 |
| :---------------------------------------------------------------------------- | :---------------------------------------------------------------------------: | ----------------------------------------------: |
| [Prev](system-catalog-initial-data.html "75.2. System Catalog Initial Data")  | [Up](bki.html "Chapter 75. System Catalog Declarations and Initial Contents") |  [Next](bki-commands.html "75.4. BKI Commands") |
| 75.2. System Catalog Initial Data                                             |             [Home](index.html "PostgreSQL 17devel Documentation")             |                              75.4. BKI Commands |
