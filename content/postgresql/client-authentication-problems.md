[#id](#CLIENT-AUTHENTICATION-PROBLEMS)

## 21.15. Authentication Problems [#](#CLIENT-AUTHENTICATION-PROBLEMS)

Authentication failures and related problems generally manifest themselves through error messages like the following:

```

FATAL:  no pg_hba.conf entry for host "123.123.123.123", user "andym", database "testdb"
```

This is what you are most likely to get if you succeed in contacting the server, but it does not want to talk to you. As the message suggests, the server refused the connection request because it found no matching entry in its `pg_hba.conf` configuration file.

```

FATAL:  password authentication failed for user "andym"
```

Messages like this indicate that you contacted the server, and it is willing to talk to you, but not until you pass the authorization method specified in the `pg_hba.conf` file. Check the password you are providing, or check your Kerberos or ident software if the complaint mentions one of those authentication types.

```

FATAL:  user "andym" does not exist
```

The indicated database user name was not found.

```

FATAL:  database "testdb" does not exist
```

The database you are trying to connect to does not exist. Note that if you do not specify a database name, it defaults to the database user name.

### Tip

The server log might contain more information about an authentication failure than is reported to the client. If you are confused about the reason for a failure, check the server log.
