<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 F.3. auth\_delay — pause on authentication failure                 |                                                                             |                                                        |                                                       |                                                                                      |
| :--------------------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------------------: |
| [Prev](amcheck.html "F.2. amcheck — tools to verify table and index consistency")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") | Appendix F. Additional Supplied Modules and Extensions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](auto-explain.html "F.4. auto_explain — log execution plans of slow queries") |

***

## F.3. auth\_delay — pause on authentication failure [#](#AUTH-DELAY)

*   *   [F.3.1. Configuration Parameters](auth-delay.html#AUTH-DELAY-CONFIGURATION-PARAMETERS)
    *   [F.3.2. Author](auth-delay.html#AUTH-DELAY-AUTHOR)



`auth_delay` causes the server to pause briefly before reporting authentication failure, to make brute-force attacks on database passwords more difficult. Note that it does nothing to prevent denial-of-service attacks, and may even exacerbate them, since processes that are waiting before reporting authentication failure will still consume connection slots.

In order to function, this module must be loaded via [shared\_preload\_libraries](runtime-config-client.html#GUC-SHARED-PRELOAD-LIBRARIES) in `postgresql.conf`.

### F.3.1. Configuration Parameters [#](#AUTH-DELAY-CONFIGURATION-PARAMETERS)

*   `auth_delay.milliseconds` (`integer`)

    The number of milliseconds to wait before reporting an authentication failure. The default is 0.

These parameters must be set in `postgresql.conf`. Typical usage might be:

```

# postgresql.conf
shared_preload_libraries = 'auth_delay'

auth_delay.milliseconds = '500'
```

### F.3.2. Author [#](#AUTH-DELAY-AUTHOR)

KaiGai Kohei `<kaigai@ak.jp.nec.com>`

***

|                                                                                    |                                                                             |                                                                                      |
| :--------------------------------------------------------------------------------- | :-------------------------------------------------------------------------: | -----------------------------------------------------------------------------------: |
| [Prev](amcheck.html "F.2. amcheck — tools to verify table and index consistency")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") |  [Next](auto-explain.html "F.4. auto_explain — log execution plans of slow queries") |
| F.2. amcheck — tools to verify table and index consistency                         |            [Home](index.html "PostgreSQL 17devel Documentation")            |                             F.4. auto\_explain — log execution plans of slow queries |
