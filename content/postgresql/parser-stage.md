[#id](#PARSER-STAGE)

## 52.3. The Parser Stage [#](#PARSER-STAGE)

- [52.3.1. Parser](parser-stage#PARSER-STAGE-PARSER)
- [52.3.2. Transformation Process](parser-stage#PARSER-STAGE-TRANSFORMATION-PROCESS)

The _parser stage_ consists of two parts:

- The _parser_ defined in `gram.y` and `scan.l` is built using the Unix tools bison and flex.

- The _transformation process_ does modifications and augmentations to the data structures returned by the parser.

[#id](#PARSER-STAGE-PARSER)

### 52.3.1. Parser [#](#PARSER-STAGE-PARSER)

The parser has to check the query string (which arrives as plain text) for valid syntax. If the syntax is correct a _parse tree_ is built up and handed back; otherwise an error is returned. The parser and lexer are implemented using the well-known Unix tools bison and flex.

The _lexer_ is defined in the file `scan.l` and is responsible for recognizing _identifiers_, the _SQL key words_ etc. For every key word or identifier that is found, a _token_ is generated and handed to the parser.

The parser is defined in the file `gram.y` and consists of a set of _grammar rules_ and _actions_ that are executed whenever a rule is fired. The code of the actions (which is actually C code) is used to build up the parse tree.

The file `scan.l` is transformed to the C source file `scan.c` using the program flex and `gram.y` is transformed to `gram.c` using bison. After these transformations have taken place a normal C compiler can be used to create the parser. Never make any changes to the generated C files as they will be overwritten the next time flex or bison is called.

### Note

The mentioned transformations and compilations are normally done automatically using the _makefiles_ shipped with the PostgreSQL source distribution.

A detailed description of bison or the grammar rules given in `gram.y` would be beyond the scope of this manual. There are many books and documents dealing with flex and bison. You should be familiar with bison before you start to study the grammar given in `gram.y` otherwise you won't understand what happens there.

[#id](#PARSER-STAGE-TRANSFORMATION-PROCESS)

### 52.3.2. Transformation Process [#](#PARSER-STAGE-TRANSFORMATION-PROCESS)

The parser stage creates a parse tree using only fixed rules about the syntactic structure of SQL. It does not make any lookups in the system catalogs, so there is no possibility to understand the detailed semantics of the requested operations. After the parser completes, the _transformation process_ takes the tree handed back by the parser as input and does the semantic interpretation needed to understand which tables, functions, and operators are referenced by the query. The data structure that is built to represent this information is called the _query tree_.

The reason for separating raw parsing from semantic analysis is that system catalog lookups can only be done within a transaction, and we do not wish to start a transaction immediately upon receiving a query string. The raw parsing stage is sufficient to identify the transaction control commands (`BEGIN`, `ROLLBACK`, etc.), and these can then be correctly executed without any further analysis. Once we know that we are dealing with an actual query (such as `SELECT` or `UPDATE`), it is okay to start a transaction if we're not already in one. Only then can the transformation process be invoked.

The query tree created by the transformation process is structurally similar to the raw parse tree in most places, but it has many differences in detail. For example, a `FuncCall` node in the parse tree represents something that looks syntactically like a function call. This might be transformed to either a `FuncExpr` or `Aggref` node depending on whether the referenced name turns out to be an ordinary function or an aggregate function. Also, information about the actual data types of columns and expression results is added to the query tree.
