[#id](#LIBPQ)

## Chapter 34. libpq — C Library

**Table of Contents**

- [34.1. Database Connection Control Functions](libpq-connect)

  - [34.1.1. Connection Strings](libpq-connect#LIBPQ-CONNSTRING)
  - [34.1.2. Parameter Key Words](libpq-connect#LIBPQ-PARAMKEYWORDS)

  - [34.2. Connection Status Functions](libpq-status)
  - [34.3. Command Execution Functions](libpq-exec)

    - [34.3.1. Main Functions](libpq-exec#LIBPQ-EXEC-MAIN)
    - [34.3.2. Retrieving Query Result Information](libpq-exec#LIBPQ-EXEC-SELECT-INFO)
    - [34.3.3. Retrieving Other Result Information](libpq-exec#LIBPQ-EXEC-NONSELECT)
    - [34.3.4. Escaping Strings for Inclusion in SQL Commands](libpq-exec#LIBPQ-EXEC-ESCAPE-STRING)

  - [34.4. Asynchronous Command Processing](libpq-async)
  - [34.5. Pipeline Mode](libpq-pipeline-mode)

    - [34.5.1. Using Pipeline Mode](libpq-pipeline-mode#LIBPQ-PIPELINE-USING)
    - [34.5.2. Functions Associated with Pipeline Mode](libpq-pipeline-mode#LIBPQ-PIPELINE-FUNCTIONS)
    - [34.5.3. When to Use Pipeline Mode](libpq-pipeline-mode#LIBPQ-PIPELINE-TIPS)

  - [34.6. Retrieving Query Results Row-by-Row](libpq-single-row-mode)
  - [34.7. Canceling Queries in Progress](libpq-cancel)
  - [34.8. The Fast-Path Interface](libpq-fastpath)
  - [34.9. Asynchronous Notification](libpq-notify)
  - [34.10. Functions Associated with the `COPY` Command](libpq-copy)

    - [34.10.1. Functions for Sending `COPY` Data](libpq-copy#LIBPQ-COPY-SEND)
    - [34.10.2. Functions for Receiving `COPY` Data](libpq-copy#LIBPQ-COPY-RECEIVE)
    - [34.10.3. Obsolete Functions for `COPY`](libpq-copy#LIBPQ-COPY-DEPRECATED)

  - [34.11. Control Functions](libpq-control)
  - [34.12. Miscellaneous Functions](libpq-misc)
  - [34.13. Notice Processing](libpq-notice-processing)
  - [34.14. Event System](libpq-events)

    - [34.14.1. Event Types](libpq-events#LIBPQ-EVENTS-TYPES)
    - [34.14.2. Event Callback Procedure](libpq-events#LIBPQ-EVENTS-PROC)
    - [34.14.3. Event Support Functions](libpq-events#LIBPQ-EVENTS-FUNCS)
    - [34.14.4. Event Example](libpq-events#LIBPQ-EVENTS-EXAMPLE)

  - [34.15. Environment Variables](libpq-envars)
  - [34.16. The Password File](libpq-pgpass)
  - [34.17. The Connection Service File](libpq-pgservice)
  - [34.18. LDAP Lookup of Connection Parameters](libpq-ldap)
  - [34.19. SSL Support](libpq-ssl)

    - [34.19.1. Client Verification of Server Certificates](libpq-ssl#LIBQ-SSL-CERTIFICATES)
    - [34.19.2. Client Certificates](libpq-ssl#LIBPQ-SSL-CLIENTCERT)
    - [34.19.3. Protection Provided in Different Modes](libpq-ssl#LIBPQ-SSL-PROTECTION)
    - [34.19.4. SSL Client File Usage](libpq-ssl#LIBPQ-SSL-FILEUSAGE)
    - [34.19.5. SSL Library Initialization](libpq-ssl#LIBPQ-SSL-INITIALIZE)

  - [34.20. Behavior in Threaded Programs](libpq-threading)
  - [34.21. Building libpq Programs](libpq-build)
  - [34.22. Example Programs](libpq-example)

libpq is the C application programmer's interface to PostgreSQL. libpq is a set of library functions that allow client programs to pass queries to the PostgreSQL backend server and to receive the results of these queries.

libpq is also the underlying engine for several other PostgreSQL application interfaces, including those written for C++, Perl, Python, Tcl and ECPG. So some aspects of libpq's behavior will be important to you if you use one of those packages. In particular, [Section 34.15](libpq-envars), [Section 34.16](libpq-pgpass) and [Section 34.19](libpq-ssl) describe behavior that is visible to the user of any application that uses libpq.

Some short programs are included at the end of this chapter ([Section 34.22](libpq-example)) to show how to write programs that use libpq. There are also several complete examples of libpq applications in the directory `src/test/examples` in the source code distribution.

Client programs that use libpq must include the header file `libpq-fe.h` and must link with the libpq library.
