[#id](#FEATURES)

## Appendix D. SQL Conformance

**Table of Contents**

- [D.1. Supported Features](features-sql-standard)
- [D.2. Unsupported Features](unsupported-features-sql-standard)
- [D.3. XML Limits and Conformance to SQL/XML](xml-limits-conformance)

  - [D.3.1. Queries Are Restricted to XPath 1.0](xml-limits-conformance#FUNCTIONS-XML-LIMITS-XPATH1)
  - [D.3.2. Incidental Limits of the Implementation](xml-limits-conformance#FUNCTIONS-XML-LIMITS-POSTGRESQL)

This section attempts to outline to what extent PostgreSQL conforms to the current SQL standard. The following information is not a full statement of conformance, but it presents the main topics in as much detail as is both reasonable and useful for users.

The formal name of the SQL standard is ISO/IEC 9075 “Database Language SQL”. A revised version of the standard is released from time to time; the most recent update appearing in 2023. The 2023 version is referred to as ISO/IEC 9075:2023, or simply as SQL:2023. The versions prior to that were SQL:2016, SQL:2011, SQL:2008, SQL:2006, SQL:2003, SQL:1999, and SQL-92. Each version replaces the previous one, so claims of conformance to earlier versions have no official merit. PostgreSQL development aims for conformance with the latest official version of the standard where such conformance does not contradict traditional features or common sense. Many of the features required by the SQL standard are supported, though sometimes with slightly differing syntax or function. Further moves towards conformance can be expected over time.

SQL-92 defined three feature sets for conformance: Entry, Intermediate, and Full. Most database management systems claiming SQL standard conformance were conforming at only the Entry level, since the entire set of features in the Intermediate and Full levels was either too voluminous or in conflict with legacy behaviors.

Starting with SQL:1999, the SQL standard defines a large set of individual features rather than the ineffectively broad three levels found in SQL-92. A large subset of these features represents the “Core” features, which every conforming SQL implementation must supply. The rest of the features are purely optional.

The standard is split into a number of parts, each also known by a shorthand name:

- ISO/IEC 9075-1 Framework (SQL/Framework)

- ISO/IEC 9075-2 Foundation (SQL/Foundation)

- ISO/IEC 9075-3 Call Level Interface (SQL/CLI)

- ISO/IEC 9075-4 Persistent Stored Modules (SQL/PSM)

- ISO/IEC 9075-9 Management of External Data (SQL/MED)

- ISO/IEC 9075-10 Object Language Bindings (SQL/OLB)

- ISO/IEC 9075-11 Information and Definition Schemas (SQL/Schemata)

- ISO/IEC 9075-13 Routines and Types using the Java Language (SQL/JRT)

- ISO/IEC 9075-14 XML-related specifications (SQL/XML)

- ISO/IEC 9075-15 Multi-dimensional arrays (SQL/MDA)

- ISO/IEC 9075-16 Property Graph Queries (SQL/PGQ)

Note that some part numbers are not (or no longer) used.

The PostgreSQL core covers parts 1, 2, 9, 11, and 14. Part 3 is covered by the ODBC driver, and part 13 is covered by the PL/Java plug-in, but exact conformance is currently not being verified for these components. There are currently no implementations of parts 4, 10, 15, and 16 for PostgreSQL.

PostgreSQL supports most of the major features of SQL:2023. Out of 177 mandatory features required for full Core conformance, PostgreSQL conforms to at least 170. In addition, there is a long list of supported optional features. It might be worth noting that at the time of writing, no current version of any database management system claims full conformance to Core SQL:2023.

In the following two sections, we provide a list of those features that PostgreSQL supports, followed by a list of the features defined in SQL:2023 which are not yet supported in PostgreSQL. Both of these lists are approximate: There might be minor details that are nonconforming for a feature that is listed as supported, and large parts of an unsupported feature might in fact be implemented. The main body of the documentation always contains the most accurate information about what does and does not work.

### Note

Feature codes containing a hyphen are subfeatures. Therefore, if a particular subfeature is not supported, the main feature is listed as unsupported even if some other subfeatures are supported.
