[#id](#AUTH-DELAY)

## F.3. auth_delay — pause on authentication failure [#](#AUTH-DELAY)

- [F.3.1. Configuration Parameters](auth-delay#AUTH-DELAY-CONFIGURATION-PARAMETERS)
- [F.3.2. Author](auth-delay#AUTH-DELAY-AUTHOR)

`auth_delay` causes the server to pause briefly before reporting authentication failure, to make brute-force attacks on database passwords more difficult. Note that it does nothing to prevent denial-of-service attacks, and may even exacerbate them, since processes that are waiting before reporting authentication failure will still consume connection slots.

In order to function, this module must be loaded via [shared_preload_libraries](runtime-config-client#GUC-SHARED-PRELOAD-LIBRARIES) in `postgresql.conf`.

[#id](#AUTH-DELAY-CONFIGURATION-PARAMETERS)

### F.3.1. Configuration Parameters [#](#AUTH-DELAY-CONFIGURATION-PARAMETERS)

- `auth_delay.milliseconds` (`integer`)

  The number of milliseconds to wait before reporting an authentication failure. The default is 0.

These parameters must be set in `postgresql.conf`. Typical usage might be:

```

# postgresql.conf
shared_preload_libraries = 'auth_delay'

auth_delay.milliseconds = '500'
```

[#id](#AUTH-DELAY-AUTHOR)

### F.3.2. Author [#](#AUTH-DELAY-AUTHOR)

KaiGai Kohei `<kaigai@ak.jp.nec.com>`
