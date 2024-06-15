[#id](#UNSUPPORTED-FEATURES-SQL-STANDARD)

## D.2. Unsupported Features [#](#UNSUPPORTED-FEATURES-SQL-STANDARD)

The following features defined in SQL:2023 are not implemented in this release of PostgreSQL. In a few cases, equivalent functionality is available.

| Identifier | Core? | Description                                                                      | Comment                                                          |
| ---------- | ----- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| B011       |       | Embedded Ada                                                                     |                                                                  |
| B013       |       | Embedded COBOL                                                                   |                                                                  |
| B014       |       | Embedded Fortran                                                                 |                                                                  |
| B015       |       | Embedded MUMPS                                                                   |                                                                  |
| B016       |       | Embedded Pascal                                                                  |                                                                  |
| B017       |       | Embedded PL/I                                                                    |                                                                  |
| B030       |       | Enhanced dynamic SQL                                                             |                                                                  |
| B031       |       | Basic dynamic SQL                                                                |                                                                  |
| B032       |       | Extended dynamic SQL                                                             |                                                                  |
| B033       |       | Untyped SQL-invoked function arguments                                           |                                                                  |
| B034       |       | Dynamic specification of cursor attributes                                       |                                                                  |
| B035       |       | Non-extended descriptor names                                                    |                                                                  |
| B036       |       | Describe input statement                                                         |                                                                  |
| B041       |       | Extensions to embedded SQL exception declarations                                |                                                                  |
| B051       |       | Enhanced execution rights                                                        |                                                                  |
| B111       |       | Module language Ada                                                              |                                                                  |
| B112       |       | Module language C                                                                |                                                                  |
| B113       |       | Module language COBOL                                                            |                                                                  |
| B114       |       | Module language Fortran                                                          |                                                                  |
| B115       |       | Module language MUMPS                                                            |                                                                  |
| B116       |       | Module language Pascal                                                           |                                                                  |
| B117       |       | Module language PL/I                                                             |                                                                  |
| B121       |       | Routine language Ada                                                             |                                                                  |
| B122       |       | Routine language C                                                               |                                                                  |
| B123       |       | Routine language COBOL                                                           |                                                                  |
| B124       |       | Routine language Fortran                                                         |                                                                  |
| B125       |       | Routine language MUMPS                                                           |                                                                  |
| B126       |       | Routine language Pascal                                                          |                                                                  |
| B127       |       | Routine language PL/I                                                            |                                                                  |
| B200       |       | Polymorphic table functions                                                      |                                                                  |
| B201       |       | More than one PTF generic table parameter                                        |                                                                  |
| B202       |       | PTF copartitioning                                                               |                                                                  |
| B203       |       | More than one copartition specification                                          |                                                                  |
| B204       |       | PRUNE WHEN EMPTY                                                                 |                                                                  |
| B205       |       | Pass-through columns                                                             |                                                                  |
| B206       |       | PTF descriptor parameters                                                        |                                                                  |
| B207       |       | Cross products of partitionings                                                  |                                                                  |
| B208       |       | PTF component procedure interface                                                |                                                                  |
| B209       |       | PTF extended names                                                               |                                                                  |
| B211       |       | Module language Ada: VARCHAR and NUMERIC support                                 |                                                                  |
| B221       |       | Routine language Ada: VARCHAR and NUMERIC support                                |                                                                  |
| F054       |       | TIMESTAMP in DATE type precedence list                                           |                                                                  |
| F120       |       | Get diagnostics statement                                                        |                                                                  |
| F121       |       | Basic diagnostics management                                                     |                                                                  |
| F122       |       | Enhanced diagnostics management                                                  |                                                                  |
| F123       |       | All diagnostics                                                                  |                                                                  |
| F124       |       | SET TRANSACTION statement: DIAGNOSTICS SIZE clause                               |                                                                  |
| F263       |       | Comma-separated predicates in simple CASE expression                             |                                                                  |
| F291       |       | UNIQUE predicate                                                                 |                                                                  |
| F301       |       | CORRESPONDING in query expressions                                               |                                                                  |
| F403       |       | Partitioned join tables                                                          |                                                                  |
| F451       |       | Character set definition                                                         |                                                                  |
| F461       |       | Named character sets                                                             |                                                                  |
| F492       |       | Optional table constraint enforcement                                            |                                                                  |
| F521       |       | Assertions                                                                       |                                                                  |
| F671       |       | Subqueries in CHECK constraints                                                  | intentionally omitted                                            |
| F673       |       | Reads SQL-data routine invocations in CHECK constraints                          |                                                                  |
| F693       |       | SQL-session and client module collations                                         |                                                                  |
| F695       |       | Translation support                                                              |                                                                  |
| F696       |       | Additional translation documentation                                             |                                                                  |
| F721       |       | Deferrable constraints                                                           | foreign and unique keys only                                     |
| F741       |       | Referential MATCH types                                                          | no partial match yet                                             |
| F812       |       | Basic flagging                                                                   |                                                                  |
| F813       |       | Extended flagging                                                                |                                                                  |
| F821       |       | Local table references                                                           |                                                                  |
| F831       |       | Full cursor update                                                               |                                                                  |
| F832       |       | Updatable scrollable cursors                                                     |                                                                  |
| F833       |       | Updatable ordered cursors                                                        |                                                                  |
| F841       |       | LIKE_REGEX predicate                                                             | consider regexp_like()                                           |
| F842       |       | OCCURRENCES_REGEX function                                                       | consider regexp_matches()                                        |
| F843       |       | POSITION_REGEX function                                                          | consider regexp_instr()                                          |
| F844       |       | SUBSTRING_REGEX function                                                         | consider regexp_substr()                                         |
| F845       |       | TRANSLATE_REGEX function                                                         | consider regexp_replace()                                        |
| F846       |       | Octet support in regular expression operators                                    |                                                                  |
| F847       |       | Non-constant regular expressions                                                 |                                                                  |
| F866       |       | FETCH FIRST clause: PERCENT option                                               |                                                                  |
| R010       |       | Row pattern recognition: FROM clause                                             |                                                                  |
| R020       |       | Row pattern recognition: WINDOW clause                                           |                                                                  |
| R030       |       | Row pattern recognition: full aggregate support                                  |                                                                  |
| S011       | Core  | Distinct data types                                                              |                                                                  |
| S011-01    | Core  | USER_DEFINED_TYPES view                                                          |                                                                  |
| S023       |       | Basic structured types                                                           |                                                                  |
| S024       |       | Enhanced structured types                                                        |                                                                  |
| S025       |       | Final structured types                                                           |                                                                  |
| S026       |       | Self-referencing structured types                                                |                                                                  |
| S027       |       | Create method by specific method name                                            |                                                                  |
| S028       |       | Permutable UDT options list                                                      |                                                                  |
| S041       |       | Basic reference types                                                            |                                                                  |
| S043       |       | Enhanced reference types                                                         |                                                                  |
| S051       |       | Create table of type                                                             | partially supported                                              |
| S081       |       | Subtables                                                                        |                                                                  |
| S091       |       | Basic array support                                                              | partially supported                                              |
| S093       |       | Arrays of distinct types                                                         |                                                                  |
| S094       |       | Arrays of reference types                                                        |                                                                  |
| S097       |       | Array element assignment                                                         |                                                                  |
| S151       |       | Type predicate                                                                   | see pg_typeof()                                                  |
| S161       |       | Subtype treatment                                                                |                                                                  |
| S162       |       | Subtype treatment for references                                                 |                                                                  |
| S202       |       | SQL-invoked routines on multisets                                                |                                                                  |
| S231       |       | Structured type locators                                                         |                                                                  |
| S232       |       | Array locators                                                                   |                                                                  |
| S233       |       | Multiset locators                                                                |                                                                  |
| S241       |       | Transform functions                                                              |                                                                  |
| S242       |       | Alter transform statement                                                        |                                                                  |
| S251       |       | User-defined orderings                                                           |                                                                  |
| S261       |       | Specific type method                                                             |                                                                  |
| S271       |       | Basic multiset support                                                           |                                                                  |
| S272       |       | Multisets of user-defined types                                                  |                                                                  |
| S274       |       | Multisets of reference types                                                     |                                                                  |
| S275       |       | Advanced multiset support                                                        |                                                                  |
| S281       |       | Nested collection types                                                          |                                                                  |
| S291       |       | Unique constraint on entire row                                                  |                                                                  |
| S401       |       | Distinct types based on array types                                              |                                                                  |
| S402       |       | Distinct types based on multiset types                                           |                                                                  |
| S403       |       | ARRAY_MAX_CARDINALITY                                                            |                                                                  |
| T011       |       | Timestamp in Information Schema                                                  |                                                                  |
| T021       |       | BINARY and VARBINARY data types                                                  |                                                                  |
| T022       |       | Advanced support for BINARY and VARBINARY data types                             |                                                                  |
| T023       |       | Compound binary literals                                                         |                                                                  |
| T024       |       | Spaces in binary literals                                                        |                                                                  |
| T039       |       | CLOB locator: non-holdable                                                       |                                                                  |
| T040       |       | Concatenation of CLOBs                                                           |                                                                  |
| T041       |       | Basic LOB data type support                                                      |                                                                  |
| T042       |       | Extended LOB data type support                                                   |                                                                  |
| T043       |       | Multiplier T                                                                     |                                                                  |
| T044       |       | Multiplier P                                                                     |                                                                  |
| T045       |       | BLOB data type                                                                   |                                                                  |
| T046       |       | CLOB data type                                                                   |                                                                  |
| T047       |       | POSITION, OCTET_LENGTH, TRIM, and SUBSTRING for BLOBs                            |                                                                  |
| T048       |       | Concatenation of BLOBs                                                           |                                                                  |
| T049       |       | BLOB locator: non-holdable                                                       |                                                                  |
| T050       |       | POSITION, CHAR_LENGTH, OCTET_LENGTH, LOWER, TRIM, UPPER, and SUBSTRING for CLOBs |                                                                  |
| T051       |       | Row types                                                                        |                                                                  |
| T053       |       | Explicit aliases for all-fields reference                                        |                                                                  |
| T062       |       | Character length units                                                           |                                                                  |
| T076       |       | DECFLOAT data type                                                               |                                                                  |
| T101       |       | Enhanced nullability determination                                               |                                                                  |
| T111       |       | Updatable joins, unions, and columns                                             |                                                                  |
| T175       |       | Generated columns                                                                | mostly supported                                                 |
| T176       |       | Sequence generator support                                                       | supported except for NEXT VALUE FOR                              |
| T180       |       | System-versioned tables                                                          |                                                                  |
| T181       |       | Application-time period tables                                                   |                                                                  |
| T200       |       | Trigger DDL                                                                      | similar but not fully compatible                                 |
| T211       |       | Basic trigger capability                                                         |                                                                  |
| T218       |       | Multiple triggers for the same event executed in the order created               | intentionally omitted                                            |
| T231       |       | Sensitive cursors                                                                |                                                                  |
| T251       |       | SET TRANSACTION statement: LOCAL option                                          |                                                                  |
| T262       |       | Multiple server transactions                                                     |                                                                  |
| T272       |       | Enhanced savepoint management                                                    |                                                                  |
| T301       |       | Functional dependencies                                                          | partially supported                                              |
| T321       | Core  | Basic SQL-invoked routines                                                       | partially supported                                              |
| T322       |       | Declared data type attributes                                                    |                                                                  |
| T324       |       | Explicit security for SQL routines                                               |                                                                  |
| T326       |       | Table functions                                                                  |                                                                  |
| T471       |       | Result sets return value                                                         |                                                                  |
| T472       |       | DESCRIBE CURSOR                                                                  |                                                                  |
| T495       |       | Combined data change and retrieval                                               | different syntax                                                 |
| T502       |       | Period predicates                                                                |                                                                  |
| T511       |       | Transaction counts                                                               |                                                                  |
| T522       |       | Default values for IN parameters of SQL-invoked procedures                       | supported except DEFAULT key word in invocation                  |
| T561       |       | Holdable locators                                                                |                                                                  |
| T571       |       | Array-returning external SQL-invoked functions                                   |                                                                  |
| T572       |       | Multiset-returning external SQL-invoked functions                                |                                                                  |
| T601       |       | Local cursor references                                                          |                                                                  |
| T616       |       | Null treatment option for LEAD and LAG functions                                 |                                                                  |
| T618       |       | NTH_VALUE function                                                               | function exists, but some options missing                        |
| T619       |       | Nested window functions                                                          |                                                                  |
| T625       |       | LISTAGG                                                                          |                                                                  |
| T641       |       | Multiple column assignment                                                       | only some syntax variants supported                              |
| T652       |       | SQL-dynamic statements in SQL routines                                           |                                                                  |
| T654       |       | SQL-dynamic statements in external routines                                      |                                                                  |
| T801       |       | JSON data type                                                                   |                                                                  |
| T802       |       | Enhanced JSON data type                                                          |                                                                  |
| T821       |       | Basic SQL/JSON query operators                                                   |                                                                  |
| T823       |       | SQL/JSON: PASSING clause                                                         |                                                                  |
| T824       |       | JSON_TABLE: specific PLAN clause                                                 |                                                                  |
| T825       |       | SQL/JSON: ON EMPTY and ON ERROR clauses                                          |                                                                  |
| T826       |       | General value expression in ON ERROR or ON EMPTY clauses                         |                                                                  |
| T827       |       | JSON_TABLE: sibling NESTED COLUMNS clauses                                       |                                                                  |
| T828       |       | JSON_QUERY                                                                       |                                                                  |
| T829       |       | JSON_QUERY: array wrapper options                                                |                                                                  |
| T838       |       | JSON_TABLE: PLAN DEFAULT clause                                                  |                                                                  |
| T839       |       | Formatted cast of datetimes to/from character strings                            |                                                                  |
| T860       |       | SQL/JSON simplified accessor: column reference only                              |                                                                  |
| T861       |       | SQL/JSON simplified accessor: case-sensitive JSON member accessor                |                                                                  |
| T862       |       | SQL/JSON simplified accessor: wildcard member accessor                           |                                                                  |
| T863       |       | SQL/JSON simplified accessor: single-quoted string literal as member accessor    |                                                                  |
| T864       |       | SQL/JSON simplified accessor                                                     |                                                                  |
| T865       |       | SQL/JSON item method: bigint()                                                   |                                                                  |
| T866       |       | SQL/JSON item method: boolean()                                                  |                                                                  |
| T867       |       | SQL/JSON item method: date()                                                     |                                                                  |
| T868       |       | SQL/JSON item method: decimal()                                                  |                                                                  |
| T869       |       | SQL/JSON item method: decimal() with precision and scale                         |                                                                  |
| T870       |       | SQL/JSON item method: integer()                                                  |                                                                  |
| T871       |       | SQL/JSON item method: number()                                                   |                                                                  |
| T872       |       | SQL/JSON item method: string()                                                   |                                                                  |
| T873       |       | SQL/JSON item method: time()                                                     |                                                                  |
| T874       |       | SQL/JSON item method: time_tz()                                                  |                                                                  |
| T875       |       | SQL/JSON item method: time precision                                             |                                                                  |
| T876       |       | SQL/JSON item method: timestamp()                                                |                                                                  |
| T877       |       | SQL/JSON item method: timestamp_tz()                                             |                                                                  |
| T878       |       | SQL/JSON item method: timestamp precision                                        |                                                                  |
| T881       |       | JSON in ordering operations                                                      | with jsonb, partially supported                                  |
| T882       |       | JSON in multiset element grouping operations                                     |                                                                  |
| M001       |       | Datalinks                                                                        |                                                                  |
| M002       |       | Datalinks via SQL/CLI                                                            |                                                                  |
| M003       |       | Datalinks via Embedded SQL                                                       |                                                                  |
| M004       |       | Foreign data support                                                             | partially supported                                              |
| M005       |       | Foreign schema support                                                           |                                                                  |
| M006       |       | GetSQLString routine                                                             |                                                                  |
| M007       |       | TransmitRequest                                                                  |                                                                  |
| M009       |       | GetOpts and GetStatistics routines                                               |                                                                  |
| M010       |       | Foreign-data wrapper support                                                     | different API                                                    |
| M011       |       | Datalinks via Ada                                                                |                                                                  |
| M012       |       | Datalinks via C                                                                  |                                                                  |
| M013       |       | Datalinks via COBOL                                                              |                                                                  |
| M014       |       | Datalinks via Fortran                                                            |                                                                  |
| M015       |       | Datalinks via M                                                                  |                                                                  |
| M016       |       | Datalinks via Pascal                                                             |                                                                  |
| M017       |       | Datalinks via PL/I                                                               |                                                                  |
| M018       |       | Foreign-data wrapper interface routines in Ada                                   |                                                                  |
| M019       |       | Foreign-data wrapper interface routines in C                                     | different API                                                    |
| M020       |       | Foreign-data wrapper interface routines in COBOL                                 |                                                                  |
| M021       |       | Foreign-data wrapper interface routines in Fortran                               |                                                                  |
| M022       |       | Foreign-data wrapper interface routines in MUMPS                                 |                                                                  |
| M023       |       | Foreign-data wrapper interface routines in Pascal                                |                                                                  |
| M024       |       | Foreign-data wrapper interface routines in PL/I                                  |                                                                  |
| M030       |       | SQL-server foreign data support                                                  |                                                                  |
| M031       |       | Foreign-data wrapper general routines                                            |                                                                  |
| X012       |       | Multisets of XML type                                                            |                                                                  |
| X013       |       | Distinct types of XML type                                                       |                                                                  |
| X015       |       | Fields of XML type                                                               |                                                                  |
| X025       |       | XMLCast                                                                          |                                                                  |
| X030       |       | XMLDocument                                                                      |                                                                  |
| X038       |       | XMLText                                                                          |                                                                  |
| X065       |       | XMLParse: binary string input and CONTENT option                                 |                                                                  |
| X066       |       | XMLParse: binary string input and DOCUMENT option                                |                                                                  |
| X068       |       | XMLSerialize: BOM                                                                |                                                                  |
| X073       |       | XMLSerialize: binary string serialization and CONTENT option                     |                                                                  |
| X074       |       | XMLSerialize: binary string serialization and DOCUMENT option                    |                                                                  |
| X075       |       | XMLSerialize: binary string serialization                                        |                                                                  |
| X076       |       | XMLSerialize: VERSION                                                            |                                                                  |
| X077       |       | XMLSerialize: explicit ENCODING option                                           |                                                                  |
| X078       |       | XMLSerialize: explicit XML declaration                                           |                                                                  |
| X080       |       | Namespaces in XML publishing                                                     |                                                                  |
| X081       |       | Query-level XML namespace declarations                                           |                                                                  |
| X082       |       | XML namespace declarations in DML                                                |                                                                  |
| X083       |       | XML namespace declarations in DDL                                                |                                                                  |
| X084       |       | XML namespace declarations in compound statements                                |                                                                  |
| X085       |       | Predefined namespace prefixes                                                    |                                                                  |
| X086       |       | XML namespace declarations in XMLTable                                           |                                                                  |
| X091       |       | XML content predicate                                                            |                                                                  |
| X096       |       | XMLExists                                                                        | XPath 1.0 only                                                   |
| X100       |       | Host language support for XML: CONTENT option                                    |                                                                  |
| X101       |       | Host language support for XML: DOCUMENT option                                   |                                                                  |
| X110       |       | Host language support for XML: VARCHAR mapping                                   |                                                                  |
| X111       |       | Host language support for XML: CLOB mapping                                      |                                                                  |
| X112       |       | Host language support for XML: BLOB mapping                                      |                                                                  |
| X113       |       | Host language support for XML: STRIP WHITESPACE option                           |                                                                  |
| X114       |       | Host language support for XML: PRESERVE WHITESPACE option                        |                                                                  |
| X131       |       | Query-level XMLBINARY clause                                                     |                                                                  |
| X132       |       | XMLBINARY clause in DML                                                          |                                                                  |
| X133       |       | XMLBINARY clause in DDL                                                          |                                                                  |
| X134       |       | XMLBINARY clause in compound statements                                          |                                                                  |
| X135       |       | XMLBINARY clause in subqueries                                                   |                                                                  |
| X141       |       | IS VALID predicate: data-driven case                                             |                                                                  |
| X142       |       | IS VALID predicate: ACCORDING TO clause                                          |                                                                  |
| X143       |       | IS VALID predicate: ELEMENT clause                                               |                                                                  |
| X144       |       | IS VALID predicate: schema location                                              |                                                                  |
| X145       |       | IS VALID predicate outside check constraints                                     |                                                                  |
| X151       |       | IS VALID predicate: with DOCUMENT option                                         |                                                                  |
| X152       |       | IS VALID predicate: with CONTENT option                                          |                                                                  |
| X153       |       | IS VALID predicate: with SEQUENCE option                                         |                                                                  |
| X155       |       | IS VALID predicate: NAMESPACE without ELEMENT clause                             |                                                                  |
| X157       |       | IS VALID predicate: NO NAMESPACE with ELEMENT clause                             |                                                                  |
| X160       |       | Basic Information Schema for registered XML schemas                              |                                                                  |
| X161       |       | Advanced Information Schema for registered XML schemas                           |                                                                  |
| X170       |       | XML null handling options                                                        |                                                                  |
| X171       |       | NIL ON NO CONTENT option                                                         |                                                                  |
| X181       |       | XML(DOCUMENT(UNTYPED)) type                                                      |                                                                  |
| X182       |       | XML(DOCUMENT(ANY)) type                                                          |                                                                  |
| X190       |       | XML(SEQUENCE) type                                                               |                                                                  |
| X191       |       | XML(DOCUMENT(XMLSCHEMA)) type                                                    |                                                                  |
| X192       |       | XML(CONTENT(XMLSCHEMA)) type                                                     |                                                                  |
| X200       |       | XMLQuery                                                                         |                                                                  |
| X201       |       | XMLQuery: RETURNING CONTENT                                                      |                                                                  |
| X202       |       | XMLQuery: RETURNING SEQUENCE                                                     |                                                                  |
| X203       |       | XMLQuery: passing a context item                                                 |                                                                  |
| X204       |       | XMLQuery: initializing an XQuery variable                                        |                                                                  |
| X205       |       | XMLQuery: EMPTY ON EMPTY option                                                  |                                                                  |
| X206       |       | XMLQuery: NULL ON EMPTY option                                                   |                                                                  |
| X211       |       | XML 1.1 support                                                                  |                                                                  |
| X222       |       | XML passing mechanism BY REF                                                     | parser accepts BY REF but ignores it; passing is always BY VALUE |
| X231       |       | XML(CONTENT(UNTYPED)) type                                                       |                                                                  |
| X232       |       | XML(CONTENT(ANY)) type                                                           |                                                                  |
| X241       |       | RETURNING CONTENT in XML publishing                                              |                                                                  |
| X242       |       | RETURNING SEQUENCE in XML publishing                                             |                                                                  |
| X251       |       | Persistent XML values of XML(DOCUMENT(UNTYPED)) type                             |                                                                  |
| X252       |       | Persistent XML values of XML(DOCUMENT(ANY)) type                                 |                                                                  |
| X253       |       | Persistent XML values of XML(CONTENT(UNTYPED)) type                              |                                                                  |
| X254       |       | Persistent XML values of XML(CONTENT(ANY)) type                                  |                                                                  |
| X255       |       | Persistent XML values of XML(SEQUENCE) type                                      |                                                                  |
| X256       |       | Persistent XML values of XML(DOCUMENT(XMLSCHEMA)) type                           |                                                                  |
| X257       |       | Persistent XML values of XML(CONTENT(XMLSCHEMA)) type                            |                                                                  |
| X260       |       | XML type: ELEMENT clause                                                         |                                                                  |
| X261       |       | XML type: NAMESPACE without ELEMENT clause                                       |                                                                  |
| X263       |       | XML type: NO NAMESPACE with ELEMENT clause                                       |                                                                  |
| X264       |       | XML type: schema location                                                        |                                                                  |
| X271       |       | XMLValidate: data-driven case                                                    |                                                                  |
| X272       |       | XMLValidate: ACCORDING TO clause                                                 |                                                                  |
| X273       |       | XMLValidate: ELEMENT clause                                                      |                                                                  |
| X274       |       | XMLValidate: schema location                                                     |                                                                  |
| X281       |       | XMLValidate with DOCUMENT option                                                 |                                                                  |
| X282       |       | XMLValidate with CONTENT option                                                  |                                                                  |
| X283       |       | XMLValidate with SEQUENCE option                                                 |                                                                  |
| X284       |       | XMLValidate: NAMESPACE without ELEMENT clause                                    |                                                                  |
| X286       |       | XMLValidate: NO NAMESPACE with ELEMENT clause                                    |                                                                  |
| X300       |       | XMLTable                                                                         | XPath 1.0 only                                                   |
| X305       |       | XMLTable: initializing an XQuery variable                                        |                                                                  |
