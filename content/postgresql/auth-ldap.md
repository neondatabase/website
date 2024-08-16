[#id](#AUTH-LDAP)

## 21.10. LDAP Authentication [#](#AUTH-LDAP)

This authentication method operates similarly to `password` except that it uses LDAP as the password verification method. LDAP is used only to validate the user name/password pairs. Therefore the user must already exist in the database before LDAP can be used for authentication.

LDAP authentication can operate in two modes. In the first mode, which we will call the simple bind mode, the server will bind to the distinguished name constructed as _`prefix`_ _`username`_ _`suffix`_. Typically, the _`prefix`_ parameter is used to specify `cn=`, or _`DOMAIN`_`\` in an Active Directory environment. _`suffix`_ is used to specify the remaining part of the DN in a non-Active Directory environment.

In the second mode, which we will call the search+bind mode, the server first binds to the LDAP directory with a fixed user name and password, specified with _`ldapbinddn`_ and _`ldapbindpasswd`_, and performs a search for the user trying to log in to the database. If no user and password is configured, an anonymous bind will be attempted to the directory. The search will be performed over the subtree at _`ldapbasedn`_, and will try to do an exact match of the attribute specified in _`ldapsearchattribute`_. Once the user has been found in this search, the server disconnects and re-binds to the directory as this user, using the password specified by the client, to verify that the login is correct. This mode is the same as that used by LDAP authentication schemes in other software, such as Apache `mod_authnz_ldap` and `pam_ldap`. This method allows for significantly more flexibility in where the user objects are located in the directory, but will cause two separate connections to the LDAP server to be made.

The following configuration options are used in both modes:

- `ldapserver`

  Names or IP addresses of LDAP servers to connect to. Multiple servers may be specified, separated by spaces.

- `ldapport`

  Port number on LDAP server to connect to. If no port is specified, the LDAP library's default port setting will be used.

- `ldapscheme`

  Set to `ldaps` to use LDAPS. This is a non-standard way of using LDAP over SSL, supported by some LDAP server implementations. See also the `ldaptls` option for an alternative.

- `ldaptls`

  Set to 1 to make the connection between PostgreSQL and the LDAP server use TLS encryption. This uses the `StartTLS` operation per [RFC 4513](https://tools.ietf.org/html/rfc4513). See also the `ldapscheme` option for an alternative.

Note that using `ldapscheme` or `ldaptls` only encrypts the traffic between the PostgreSQL server and the LDAP server. The connection between the PostgreSQL server and the PostgreSQL client will still be unencrypted unless SSL is used there as well.

The following options are used in simple bind mode only:

- `ldapprefix`

  String to prepend to the user name when forming the DN to bind as, when doing simple bind authentication.

- `ldapsuffix`

  String to append to the user name when forming the DN to bind as, when doing simple bind authentication.

The following options are used in search+bind mode only:

- `ldapbasedn`

  Root DN to begin the search for the user in, when doing search+bind authentication.

- `ldapbinddn`

  DN of user to bind to the directory with to perform the search when doing search+bind authentication.

- `ldapbindpasswd`

  Password for user to bind to the directory with to perform the search when doing search+bind authentication.

- `ldapsearchattribute`

  Attribute to match against the user name in the search when doing search+bind authentication. If no attribute is specified, the `uid` attribute will be used.

- `ldapsearchfilter`

  The search filter to use when doing search+bind authentication. Occurrences of `$username` will be replaced with the user name. This allows for more flexible search filters than `ldapsearchattribute`.

- `ldapurl`

  An [RFC 4516](https://tools.ietf.org/html/rfc4516) LDAP URL. This is an alternative way to write some of the other LDAP options in a more compact and standard form. The format is

  ```

  ldap[s]://host[:port]/basedn[?[attribute][?[scope][?[filter]]]]
  ```

  _`scope`_ must be one of `base`, `one`, `sub`, typically the last. (The default is `base`, which is normally not useful in this application.) _`attribute`_ can nominate a single attribute, in which case it is used as a value for `ldapsearchattribute`. If _`attribute`_ is empty then _`filter`_ can be used as a value for `ldapsearchfilter`.

  The URL scheme `ldaps` chooses the LDAPS method for making LDAP connections over SSL, equivalent to using `ldapscheme=ldaps`. To use encrypted LDAP connections using the `StartTLS` operation, use the normal URL scheme `ldap` and specify the `ldaptls` option in addition to `ldapurl`.

  For non-anonymous binds, `ldapbinddn` and `ldapbindpasswd` must be specified as separate options.

  LDAP URLs are currently only supported with OpenLDAP, not on Windows.

It is an error to mix configuration options for simple bind with options for search+bind.

When using search+bind mode, the search can be performed using a single attribute specified with `ldapsearchattribute`, or using a custom search filter specified with `ldapsearchfilter`. Specifying `ldapsearchattribute=foo` is equivalent to specifying `ldapsearchfilter="(foo=$username)"`. If neither option is specified the default is `ldapsearchattribute=uid`.

If PostgreSQL was compiled with OpenLDAP as the LDAP client library, the `ldapserver` setting may be omitted. In that case, a list of host names and ports is looked up via [RFC 2782](https://tools.ietf.org/html/rfc2782) DNS SRV records. The name `_ldap._tcp.DOMAIN` is looked up, where `DOMAIN` is extracted from `ldapbasedn`.

Here is an example for a simple-bind LDAP configuration:

```

host ... ldap ldapserver=ldap.example.net ldapprefix="cn=" ldapsuffix=", dc=example, dc=net"
```

When a connection to the database server as database user `someuser` is requested, PostgreSQL will attempt to bind to the LDAP server using the DN `cn=someuser, dc=example, dc=net` and the password provided by the client. If that connection succeeds, the database access is granted.

Here is an example for a search+bind configuration:

```

host ... ldap ldapserver=ldap.example.net ldapbasedn="dc=example, dc=net" ldapsearchattribute=uid
```

When a connection to the database server as database user `someuser` is requested, PostgreSQL will attempt to bind anonymously (since `ldapbinddn` was not specified) to the LDAP server, perform a search for `(uid=someuser)` under the specified base DN. If an entry is found, it will then attempt to bind using that found information and the password supplied by the client. If that second connection succeeds, the database access is granted.

Here is the same search+bind configuration written as a URL:

```

host ... ldap ldapurl="ldap://ldap.example.net/dc=example,dc=net?uid?sub"
```

Some other software that supports authentication against LDAP uses the same URL format, so it will be easier to share the configuration.

Here is an example for a search+bind configuration that uses `ldapsearchfilter` instead of `ldapsearchattribute` to allow authentication by user ID or email address:

```

host ... ldap ldapserver=ldap.example.net ldapbasedn="dc=example, dc=net" ldapsearchfilter="(|(uid=$username)(mail=$username))"
```

Here is an example for a search+bind configuration that uses DNS SRV discovery to find the host name(s) and port(s) for the LDAP service for the domain name `example.net`:

```

host ... ldap ldapbasedn="dc=example,dc=net"
```

### Tip

Since LDAP often uses commas and spaces to separate the different parts of a DN, it is often necessary to use double-quoted parameter values when configuring LDAP options, as shown in the examples.
