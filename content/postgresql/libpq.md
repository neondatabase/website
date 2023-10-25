

|                 Chapter 34. libpq — C Library                |                                                           |                            |                                                       |                                                                           |
| :----------------------------------------------------------: | :-------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](client-interfaces.html "Part IV. Client Interfaces")  | [Up](client-interfaces.html "Part IV. Client Interfaces") | Part IV. Client Interfaces | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](libpq-connect.html "34.1. Database Connection Control Functions") |

***

## Chapter 34. libpq — C Library

**Table of Contents**

* [34.1. Database Connection Control Functions](libpq-connect.html)

  * *   [34.1.1. Connection Strings](libpq-connect.html#LIBPQ-CONNSTRING)
    * [34.1.2. Parameter Key Words](libpq-connect.html#LIBPQ-PARAMKEYWORDS)

  * *   [34.2. Connection Status Functions](libpq-status.html)
  * [34.3. Command Execution Functions](libpq-exec.html)

    

  * *   [34.3.1. Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
    * [34.3.2. Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
    * [34.3.3. Retrieving Other Result Information](libpq-exec.html#LIBPQ-EXEC-NONSELECT)
    * [34.3.4. Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)

  * *   [34.4. Asynchronous Command Processing](libpq-async.html)
  * [34.5. Pipeline Mode](libpq-pipeline-mode.html)

    

  * *   [34.5.1. Using Pipeline Mode](libpq-pipeline-mode.html#LIBPQ-PIPELINE-USING)
    * [34.5.2. Functions Associated with Pipeline Mode](libpq-pipeline-mode.html#LIBPQ-PIPELINE-FUNCTIONS)
    * [34.5.3. When to Use Pipeline Mode](libpq-pipeline-mode.html#LIBPQ-PIPELINE-TIPS)

  * *   [34.6. Retrieving Query Results Row-by-Row](libpq-single-row-mode.html)
  * [34.7. Canceling Queries in Progress](libpq-cancel.html)
  * [34.8. The Fast-Path Interface](libpq-fastpath.html)
  * [34.9. Asynchronous Notification](libpq-notify.html)
  * [34.10. Functions Associated with the `COPY` Command](libpq-copy.html)

    

  * *   [34.10.1. Functions for Sending `COPY` Data](libpq-copy.html#LIBPQ-COPY-SEND)
    * [34.10.2. Functions for Receiving `COPY` Data](libpq-copy.html#LIBPQ-COPY-RECEIVE)
    * [34.10.3. Obsolete Functions for `COPY`](libpq-copy.html#LIBPQ-COPY-DEPRECATED)

  * *   [34.11. Control Functions](libpq-control.html)
  * [34.12. Miscellaneous Functions](libpq-misc.html)
  * [34.13. Notice Processing](libpq-notice-processing.html)
  * [34.14. Event System](libpq-events.html)

    

  * *   [34.14.1. Event Types](libpq-events.html#LIBPQ-EVENTS-TYPES)
    * [34.14.2. Event Callback Procedure](libpq-events.html#LIBPQ-EVENTS-PROC)
    * [34.14.3. Event Support Functions](libpq-events.html#LIBPQ-EVENTS-FUNCS)
    * [34.14.4. Event Example](libpq-events.html#LIBPQ-EVENTS-EXAMPLE)

  * *   [34.15. Environment Variables](libpq-envars.html)
  * [34.16. The Password File](libpq-pgpass.html)
  * [34.17. The Connection Service File](libpq-pgservice.html)
  * [34.18. LDAP Lookup of Connection Parameters](libpq-ldap.html)
  * [34.19. SSL Support](libpq-ssl.html)

    

  * *   [34.19.1. Client Verification of Server Certificates](libpq-ssl.html#LIBQ-SSL-CERTIFICATES)
    * [34.19.2. Client Certificates](libpq-ssl.html#LIBPQ-SSL-CLIENTCERT)
    * [34.19.3. Protection Provided in Different Modes](libpq-ssl.html#LIBPQ-SSL-PROTECTION)
    * [34.19.4. SSL Client File Usage](libpq-ssl.html#LIBPQ-SSL-FILEUSAGE)
    * [34.19.5. SSL Library Initialization](libpq-ssl.html#LIBPQ-SSL-INITIALIZE)

  * *   [34.20. Behavior in Threaded Programs](libpq-threading.html)
  * [34.21. Building libpq Programs](libpq-build.html)
  * [34.22. Example Programs](libpq-example.html)

libpq is the C application programmer's interface to PostgreSQL. libpq is a set of library functions that allow client programs to pass queries to the PostgreSQL backend server and to receive the results of these queries.

libpq is also the underlying engine for several other PostgreSQL application interfaces, including those written for C++, Perl, Python, Tcl and ECPG. So some aspects of libpq's behavior will be important to you if you use one of those packages. In particular, [Section 34.15](libpq-envars.html "34.15. Environment Variables"), [Section 34.16](libpq-pgpass.html "34.16. The Password File") and [Section 34.19](libpq-ssl.html "34.19. SSL Support") describe behavior that is visible to the user of any application that uses libpq.

Some short programs are included at the end of this chapter ([Section 34.22](libpq-example.html "34.22. Example Programs")) to show how to write programs that use libpq. There are also several complete examples of libpq applications in the directory `src/test/examples` in the source code distribution.

Client programs that use libpq must include the header file `libpq-fe.h` and must link with the libpq library.

***

|                                                              |                                                           |                                                                           |
| :----------------------------------------------------------- | :-------------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](client-interfaces.html "Part IV. Client Interfaces")  | [Up](client-interfaces.html "Part IV. Client Interfaces") |  [Next](libpq-connect.html "34.1. Database Connection Control Functions") |
| Part IV. Client Interfaces                                   |   [Home](index.html "PostgreSQL 17devel Documentation")   |                               34.1. Database Connection Control Functions |
