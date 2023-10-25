

|                 Chapter 12. Full Text Search                 |                                            |                           |                                                       |                                                     |
| :----------------------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](indexes-examine.html "11.12. Examining Index Usage")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](textsearch-intro.html "12.1. Introduction") |

***

## Chapter 12. Full Text Search

**Table of Contents**

* [12.1. Introduction](textsearch-intro.html)

  * *   [12.1.1. What Is a Document?](textsearch-intro.html#TEXTSEARCH-DOCUMENT)
    * [12.1.2. Basic Text Matching](textsearch-intro.html#TEXTSEARCH-MATCHING)
    * [12.1.3. Configurations](textsearch-intro.html#TEXTSEARCH-INTRO-CONFIGURATIONS)

* [12.2. Tables and Indexes](textsearch-tables.html)

  * *   [12.2.1. Searching a Table](textsearch-tables.html#TEXTSEARCH-TABLES-SEARCH)
    * [12.2.2. Creating Indexes](textsearch-tables.html#TEXTSEARCH-TABLES-INDEX)

* [12.3. Controlling Text Search](textsearch-controls.html)

  * *   [12.3.1. Parsing Documents](textsearch-controls.html#TEXTSEARCH-PARSING-DOCUMENTS)
    * [12.3.2. Parsing Queries](textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES)
    * [12.3.3. Ranking Search Results](textsearch-controls.html#TEXTSEARCH-RANKING)
    * [12.3.4. Highlighting Results](textsearch-controls.html#TEXTSEARCH-HEADLINE)

* [12.4. Additional Features](textsearch-features.html)

  * *   [12.4.1. Manipulating Documents](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSVECTOR)
    * [12.4.2. Manipulating Queries](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSQUERY)
    * [12.4.3. Triggers for Automatic Updates](textsearch-features.html#TEXTSEARCH-UPDATE-TRIGGERS)
    * [12.4.4. Gathering Document Statistics](textsearch-features.html#TEXTSEARCH-STATISTICS)

  * *   [12.5. Parsers](textsearch-parsers.html)
  * [12.6. Dictionaries](textsearch-dictionaries.html)

    

  * *   [12.6.1. Stop Words](textsearch-dictionaries.html#TEXTSEARCH-STOPWORDS)
    * [12.6.2. Simple Dictionary](textsearch-dictionaries.html#TEXTSEARCH-SIMPLE-DICTIONARY)
    * [12.6.3. Synonym Dictionary](textsearch-dictionaries.html#TEXTSEARCH-SYNONYM-DICTIONARY)
    * [12.6.4. Thesaurus Dictionary](textsearch-dictionaries.html#TEXTSEARCH-THESAURUS)
    * [12.6.5. Ispell Dictionary](textsearch-dictionaries.html#TEXTSEARCH-ISPELL-DICTIONARY)
    * [12.6.6. Snowball Dictionary](textsearch-dictionaries.html#TEXTSEARCH-SNOWBALL-DICTIONARY)

  * *   [12.7. Configuration Example](textsearch-configuration.html)
  * [12.8. Testing and Debugging Text Search](textsearch-debugging.html)

    

  * *   [12.8.1. Configuration Testing](textsearch-debugging.html#TEXTSEARCH-CONFIGURATION-TESTING)
    * [12.8.2. Parser Testing](textsearch-debugging.html#TEXTSEARCH-PARSER-TESTING)
    * [12.8.3. Dictionary Testing](textsearch-debugging.html#TEXTSEARCH-DICTIONARY-TESTING)

  * *   [12.9. Preferred Index Types for Text Search](textsearch-indexes.html)
  * [12.10. psql Support](textsearch-psql.html)
  * [12.11. Limitations](textsearch-limitations.html)

***

|                                                              |                                                       |                                                     |
| :----------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](indexes-examine.html "11.12. Examining Index Usage")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](textsearch-intro.html "12.1. Introduction") |
| 11.12. Examining Index Usage                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                                  12.1. Introduction |
