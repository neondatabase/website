[#id](#SSLINFO)

## F.42. sslinfo — obtain client SSL information [#](#SSLINFO)

- [F.42.1. Functions Provided](sslinfo#SSLINFO-FUNCTIONS)
- [F.42.2. Author](sslinfo#SSLINFO-AUTHOR)

The `sslinfo` module provides information about the SSL certificate that the current client provided when connecting to PostgreSQL. The module is useless (most functions will return NULL) if the current connection does not use SSL.

Some of the information available through this module can also be obtained using the built-in system view [`pg_stat_ssl`](monitoring-stats#MONITORING-PG-STAT-SSL-VIEW).

This extension won't build at all unless the installation was configured with `--with-ssl=openssl`.

[#id](#SSLINFO-FUNCTIONS)

### F.42.1. Functions Provided [#](#SSLINFO-FUNCTIONS)

- `ssl_is_used() returns boolean`

  Returns true if current connection to server uses SSL, and false otherwise.

- `ssl_version() returns text`

  Returns the name of the protocol used for the SSL connection (e.g., TLSv1.0, TLSv1.1, TLSv1.2 or TLSv1.3).

- `ssl_cipher() returns text`

  Returns the name of the cipher used for the SSL connection (e.g., DHE-RSA-AES256-SHA).

- `ssl_client_cert_present() returns boolean`

  Returns true if current client has presented a valid SSL client certificate to the server, and false otherwise. (The server might or might not be configured to require a client certificate.)

- `ssl_client_serial() returns numeric`

  Returns serial number of current client certificate. The combination of certificate serial number and certificate issuer is guaranteed to uniquely identify a certificate (but not its owner — the owner ought to regularly change their keys, and get new certificates from the issuer).

  So, if you run your own CA and allow only certificates from this CA to be accepted by the server, the serial number is the most reliable (albeit not very mnemonic) means to identify a user.

- `ssl_client_dn() returns text`

  Returns the full subject of the current client certificate, converting character data into the current database encoding. It is assumed that if you use non-ASCII characters in the certificate names, your database is able to represent these characters, too. If your database uses the SQL_ASCII encoding, non-ASCII characters in the name will be represented as UTF-8 sequences.

  The result looks like `/CN=Somebody /C=Some country/O=Some organization`.

- `ssl_issuer_dn() returns text`

  Returns the full issuer name of the current client certificate, converting character data into the current database encoding. Encoding conversions are handled the same as for `ssl_client_dn`.

  The combination of the return value of this function with the certificate serial number uniquely identifies the certificate.

  This function is really useful only if you have more than one trusted CA certificate in your server's certificate authority file, or if this CA has issued some intermediate certificate authority certificates.

- `ssl_client_dn_field(fieldname text) returns text`

  This function returns the value of the specified field in the certificate subject, or NULL if the field is not present. Field names are string constants that are converted into ASN1 object identifiers using the OpenSSL object database. The following values are acceptable:

  ```
  commonName (alias CN)
  surname (alias SN)
  name
  givenName (alias GN)
  countryName (alias C)
  localityName (alias L)
  stateOrProvinceName (alias ST)
  organizationName (alias O)
  organizationalUnitName (alias OU)
  title
  description
  initials
  postalCode
  streetAddress
  generationQualifier
  description
  dnQualifier
  x500UniqueIdentifier
  pseudonym
  role
  emailAddress
  ```

  All of these fields are optional, except `commonName`. It depends entirely on your CA's policy which of them would be included and which wouldn't. The meaning of these fields, however, is strictly defined by the X.500 and X.509 standards, so you cannot just assign arbitrary meaning to them.

- `ssl_issuer_field(fieldname text) returns text`

  Same as `ssl_client_dn_field`, but for the certificate issuer rather than the certificate subject.

- `ssl_extension_info() returns setof record`

  Provide information about extensions of client certificate: extension name, extension value, and if it is a critical extension.

[#id](#SSLINFO-AUTHOR)

### F.42.2. Author [#](#SSLINFO-AUTHOR)

Victor Wagner `<vitus@cryptocom.ru>`, Cryptocom LTD

Dmitry Voronin `<carriingfate92@yandex.ru>`

E-Mail of Cryptocom OpenSSL development group: `<openssl@cryptocom.ru>`
