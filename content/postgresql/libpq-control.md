[#id](#LIBPQ-CONTROL)

## 34.11. Control Functions [#](#LIBPQ-CONTROL)

These functions control miscellaneous details of libpq's behavior.

- `PQclientEncoding` [#](#LIBPQ-PQCLIENTENCODING)

  Returns the client encoding.

  ```
  int PQclientEncoding(const PGconn *conn);
  ```

  Note that it returns the encoding ID, not a symbolic string such as `EUC_JP`. If unsuccessful, it returns -1. To convert an encoding ID to an encoding name, you can use:

  ```
  char *pg_encoding_to_char(int encoding_id);
  ```

- `PQsetClientEncoding` [#](#LIBPQ-PQSETCLIENTENCODING)

  Sets the client encoding.

  ```
  int PQsetClientEncoding(PGconn *conn, const char *encoding);
  ```

  _`conn`_ is a connection to the server, and _`encoding`_ is the encoding you want to use. If the function successfully sets the encoding, it returns 0, otherwise -1. The current encoding for this connection can be determined by using [`PQclientEncoding`](libpq-control#LIBPQ-PQCLIENTENCODING).

- `PQsetErrorVerbosity` [#](#LIBPQ-PQSETERRORVERBOSITY)

  Determines the verbosity of messages returned by [`PQerrorMessage`](libpq-status#LIBPQ-PQERRORMESSAGE) and [`PQresultErrorMessage`](libpq-exec#LIBPQ-PQRESULTERRORMESSAGE).

  ```
  typedef enum
  {
      PQERRORS_TERSE,
      PQERRORS_DEFAULT,
      PQERRORS_VERBOSE,
      PQERRORS_SQLSTATE
  } PGVerbosity;

  PGVerbosity PQsetErrorVerbosity(PGconn *conn, PGVerbosity verbosity);
  ```

  [`PQsetErrorVerbosity`](libpq-control#LIBPQ-PQSETERRORVERBOSITY) sets the verbosity mode, returning the connection's previous setting. In _TERSE_ mode, returned messages include severity, primary text, and position only; this will normally fit on a single line. The _DEFAULT_ mode produces messages that include the above plus any detail, hint, or context fields (these might span multiple lines). The _VERBOSE_ mode includes all available fields. The _SQLSTATE_ mode includes only the error severity and the `SQLSTATE` error code, if one is available (if not, the output is like _TERSE_ mode).

  Changing the verbosity setting does not affect the messages available from already-existing `PGresult` objects, only subsequently-created ones. (But see [`PQresultVerboseErrorMessage`](libpq-exec#LIBPQ-PQRESULTVERBOSEERRORMESSAGE) if you want to print a previous error with a different verbosity.)

- `PQsetErrorContextVisibility` [#](#LIBPQ-PQSETERRORCONTEXTVISIBILITY)

  Determines the handling of `CONTEXT` fields in messages returned by [`PQerrorMessage`](libpq-status#LIBPQ-PQERRORMESSAGE) and [`PQresultErrorMessage`](libpq-exec#LIBPQ-PQRESULTERRORMESSAGE).

  ```
  typedef enum
  {
      PQSHOW_CONTEXT_NEVER,
      PQSHOW_CONTEXT_ERRORS,
      PQSHOW_CONTEXT_ALWAYS
  } PGContextVisibility;

  PGContextVisibility PQsetErrorContextVisibility(PGconn *conn, PGContextVisibility show_context);
  ```

  [`PQsetErrorContextVisibility`](libpq-control#LIBPQ-PQSETERRORCONTEXTVISIBILITY) sets the context display mode, returning the connection's previous setting. This mode controls whether the `CONTEXT` field is included in messages. The _NEVER_ mode never includes `CONTEXT`, while _ALWAYS_ always includes it if available. In _ERRORS_ mode (the default), `CONTEXT` fields are included only in error messages, not in notices and warnings. (However, if the verbosity setting is _TERSE_ or _SQLSTATE_, `CONTEXT` fields are omitted regardless of the context display mode.)

  Changing this mode does not affect the messages available from already-existing `PGresult` objects, only subsequently-created ones. (But see [`PQresultVerboseErrorMessage`](libpq-exec#LIBPQ-PQRESULTVERBOSEERRORMESSAGE) if you want to print a previous error with a different display mode.)

- `PQtrace` [#](#LIBPQ-PQTRACE)

  Enables tracing of the client/server communication to a debugging file stream.

  ```
  void PQtrace(PGconn *conn, FILE *stream);
  ```

  Each line consists of: an optional timestamp, a direction indicator (`F` for messages from client to server or `B` for messages from server to client), message length, message type, and message contents. Non-message contents fields (timestamp, direction, length and message type) are separated by a tab. Message contents are separated by a space. Protocol strings are enclosed in double quotes, while strings used as data values are enclosed in single quotes. Non-printable chars are printed as hexadecimal escapes. Further message-type-specific detail can be found in [Section 55.7](protocol-message-formats).

  ### Note

  On Windows, if the libpq library and an application are compiled with different flags, this function call will crash the application because the internal representation of the `FILE` pointers differ. Specifically, multithreaded/single-threaded, release/debug, and static/dynamic flags should be the same for the library and all applications using that library.

- `PQsetTraceFlags` [#](#LIBPQ-PQSETTRACEFLAGS)

  Controls the tracing behavior of client/server communication.

  ```
  void PQsetTraceFlags(PGconn *conn, int flags);
  ```

  `flags` contains flag bits describing the operating mode of tracing. If `flags` contains `PQTRACE_SUPPRESS_TIMESTAMPS`, then the timestamp is not included when printing each message. If `flags` contains `PQTRACE_REGRESS_MODE`, then some fields are redacted when printing each message, such as object OIDs, to make the output more convenient to use in testing frameworks. This function must be called after calling `PQtrace`.

- `PQuntrace` [#](#LIBPQ-PQUNTRACE)

  Disables tracing started by [`PQtrace`](libpq-control#LIBPQ-PQTRACE).

  ```
  void PQuntrace(PGconn *conn);
  ```
