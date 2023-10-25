<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                              F.27. pgcrypto — cryptographic functions                              |                                                                             |                                                        |                                                       |                                                                                   |
| :------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](pgbuffercache.html "F.26. pg_buffercache — inspect PostgreSQL&#xA;    buffer cache state")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") | Appendix F. Additional Supplied Modules and Extensions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](pgfreespacemap.html "F.28. pg_freespacemap — examine the free space map") |

***

## F.27. pgcrypto — cryptographic functions [#](#PGCRYPTO)

*   *   [F.27.1. General Hashing Functions](pgcrypto.html#PGCRYPTO-GENERAL-HASHING-FUNCS)
    *   [F.27.2. Password Hashing Functions](pgcrypto.html#PGCRYPTO-PASSWORD-HASHING-FUNCS)
    *   [F.27.3. PGP Encryption Functions](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS)
    *   [F.27.4. Raw Encryption Functions](pgcrypto.html#PGCRYPTO-RAW-ENC-FUNCS)
    *   [F.27.5. Random-Data Functions](pgcrypto.html#PGCRYPTO-RANDOM-DATA-FUNCS)
    *   [F.27.6. Notes](pgcrypto.html#PGCRYPTO-NOTES)
    *   [F.27.7. Author](pgcrypto.html#PGCRYPTO-AUTHOR)



The `pgcrypto` module provides cryptographic functions for PostgreSQL.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

`pgcrypto` requires OpenSSL and won't be installed if OpenSSL support was not selected when PostgreSQL was built.

### F.27.1. General Hashing Functions [#](#PGCRYPTO-GENERAL-HASHING-FUNCS)

#### F.27.1.1. `digest()` [#](#PGCRYPTO-GENERAL-HASHING-FUNCS-DIGEST)



```

digest(data text, type text) returns bytea
digest(data bytea, type text) returns bytea
```

Computes a binary hash of the given *`data`*. *`type`* is the algorithm to use. Standard algorithms are `md5`, `sha1`, `sha224`, `sha256`, `sha384` and `sha512`. Moreover, any digest algorithm OpenSSL supports is automatically picked up.

If you want the digest as a hexadecimal string, use `encode()` on the result. For example:

```

CREATE OR REPLACE FUNCTION sha1(bytea) returns text AS $$
    SELECT encode(digest($1, 'sha1'), 'hex')
$$ LANGUAGE SQL STRICT IMMUTABLE;
```

#### F.27.1.2. `hmac()` [#](#PGCRYPTO-GENERAL-HASHING-FUNCS-HMAC)



```

hmac(data text, key text, type text) returns bytea
hmac(data bytea, key bytea, type text) returns bytea
```

Calculates hashed MAC for *`data`* with key *`key`*. *`type`* is the same as in `digest()`.

This is similar to `digest()` but the hash can only be recalculated knowing the key. This prevents the scenario of someone altering data and also changing the hash to match.

If the key is larger than the hash block size it will first be hashed and the result will be used as key.

### F.27.2. Password Hashing Functions [#](#PGCRYPTO-PASSWORD-HASHING-FUNCS)

The functions `crypt()` and `gen_salt()` are specifically designed for hashing passwords. `crypt()` does the hashing and `gen_salt()` prepares algorithm parameters for it.

The algorithms in `crypt()` differ from the usual MD5 or SHA1 hashing algorithms in the following respects:

1.  They are slow. As the amount of data is so small, this is the only way to make brute-forcing passwords hard.
2.  They use a random value, called the *salt*, so that users having the same password will have different encrypted passwords. This is also an additional defense against reversing the algorithm.
3.  They include the algorithm type in the result, so passwords hashed with different algorithms can co-exist.
4.  Some of them are adaptive — that means when computers get faster, you can tune the algorithm to be slower, without introducing incompatibility with existing passwords.

[Table F.18](pgcrypto.html#PGCRYPTO-CRYPT-ALGORITHMS "Table F.18. Supported Algorithms for crypt()") lists the algorithms supported by the `crypt()` function.

**Table F.18. Supported Algorithms for `crypt()`**

| Algorithm | Max Password Length | Adaptive? | Salt Bits | Output Length | Description                |
| --------- | ------------------- | --------- | --------- | ------------- | -------------------------- |
| `bf`      | 72                  | yes       | 128       | 60            | Blowfish-based, variant 2a |
| `md5`     | unlimited           | no        | 48        | 34            | MD5-based crypt            |
| `xdes`    | 8                   | yes       | 24        | 20            | Extended DES               |
| `des`     | 8                   | no        | 12        | 13            | Original UNIX crypt        |

\


#### F.27.2.1. `crypt()` [#](#PGCRYPTO-PASSWORD-HASHING-FUNCS-CRYPT)



```

crypt(password text, salt text) returns text
```

Calculates a crypt(3)-style hash of *`password`*. When storing a new password, you need to use `gen_salt()` to generate a new *`salt`* value. To check a password, pass the stored hash value as *`salt`*, and test whether the result matches the stored value.

Example of setting a new password:

```

UPDATE ... SET pswhash = crypt('new password', gen_salt('md5'));
```

Example of authentication:

```

SELECT (pswhash = crypt('entered password', pswhash)) AS pswmatch FROM ... ;
```

This returns `true` if the entered password is correct.

#### F.27.2.2. `gen_salt()` [#](#PGCRYPTO-PASSWORD-HASHING-FUNCS-GEN-SALT)



```

gen_salt(type text [, iter_count integer ]) returns text
```

Generates a new random salt string for use in `crypt()`. The salt string also tells `crypt()` which algorithm to use.

The *`type`* parameter specifies the hashing algorithm. The accepted types are: `des`, `xdes`, `md5` and `bf`.

The *`iter_count`* parameter lets the user specify the iteration count, for algorithms that have one. The higher the count, the more time it takes to hash the password and therefore the more time to break it. Although with too high a count the time to calculate a hash may be several years — which is somewhat impractical. If the *`iter_count`* parameter is omitted, the default iteration count is used. Allowed values for *`iter_count`* depend on the algorithm and are shown in [Table F.19](pgcrypto.html#PGCRYPTO-ICFC-TABLE "Table F.19. Iteration Counts for crypt()").

**Table F.19. Iteration Counts for `crypt()`**

| Algorithm | Default | Min | Max      |
| --------- | ------- | --- | -------- |
| `xdes`    | 725     | 1   | 16777215 |
| `bf`      | 6       | 4   | 31       |

\


For `xdes` there is an additional limitation that the iteration count must be an odd number.

To pick an appropriate iteration count, consider that the original DES crypt was designed to have the speed of 4 hashes per second on the hardware of that time. Slower than 4 hashes per second would probably dampen usability. Faster than 100 hashes per second is probably too fast.

[Table F.20](pgcrypto.html#PGCRYPTO-HASH-SPEED-TABLE "Table F.20. Hash Algorithm Speeds") gives an overview of the relative slowness of different hashing algorithms. The table shows how much time it would take to try all combinations of characters in an 8-character password, assuming that the password contains either only lower case letters, or upper- and lower-case letters and numbers. In the `crypt-bf` entries, the number after a slash is the *`iter_count`* parameter of `gen_salt`.

**Table F.20. Hash Algorithm Speeds**

| Algorithm    | Hashes/sec | For `[a-z]`   | For `[A-Za-z0-9]` | Duration relative to `md5 hash` |
| ------------ | ---------- | ------------- | ----------------- | ------------------------------- |
| `crypt-bf/8` | 1792       | 4 years       | 3927 years        | 100k                            |
| `crypt-bf/7` | 3648       | 2 years       | 1929 years        | 50k                             |
| `crypt-bf/6` | 7168       | 1 year        | 982 years         | 25k                             |
| `crypt-bf/5` | 13504      | 188 days      | 521 years         | 12.5k                           |
| `crypt-md5`  | 171584     | 15 days       | 41 years          | 1k                              |
| `crypt-des`  | 23221568   | 157.5 minutes | 108 days          | 7                               |
| `sha1`       | 37774272   | 90 minutes    | 68 days           | 4                               |
| `md5` (hash) | 150085504  | 22.5 minutes  | 17 days           | 1                               |

\


Notes:

*   The machine used is an Intel Mobile Core i3.
*   `crypt-des` and `crypt-md5` algorithm numbers are taken from John the Ripper v1.6.38 `-test` output.
*   `md5 hash` numbers are from mdcrack 1.2.
*   `sha1` numbers are from lcrack-20031130-beta.
*   `crypt-bf` numbers are taken using a simple program that loops over 1000 8-character passwords. That way the speed with different numbers of iterations can be shown. For reference: `john -test` shows 13506 loops/sec for `crypt-bf/5`. (The very small difference in results is in accordance with the fact that the `crypt-bf` implementation in `pgcrypto` is the same one used in John the Ripper.)

Note that “try all combinations” is not a realistic exercise. Usually password cracking is done with the help of dictionaries, which contain both regular words and various mutations of them. So, even somewhat word-like passwords could be cracked much faster than the above numbers suggest, while a 6-character non-word-like password may escape cracking. Or not.

### F.27.3. PGP Encryption Functions [#](#PGCRYPTO-PGP-ENC-FUNCS)

The functions here implement the encryption part of the OpenPGP ([RFC 4880](https://tools.ietf.org/html/rfc4880)) standard. Supported are both symmetric-key and public-key encryption.

An encrypted PGP message consists of 2 parts, or *packets*:

*   Packet containing a session key — either symmetric-key or public-key encrypted.
*   Packet containing data encrypted with the session key.

When encrypting with a symmetric key (i.e., a password):

1.  The given password is hashed using a String2Key (S2K) algorithm. This is rather similar to `crypt()` algorithms — purposefully slow and with random salt — but it produces a full-length binary key.
2.  If a separate session key is requested, a new random key will be generated. Otherwise the S2K key will be used directly as the session key.
3.  If the S2K key is to be used directly, then only S2K settings will be put into the session key packet. Otherwise the session key will be encrypted with the S2K key and put into the session key packet.

When encrypting with a public key:

1.  A new random session key is generated.
2.  It is encrypted using the public key and put into the session key packet.

In either case the data to be encrypted is processed as follows:

1.  Optional data-manipulation: compression, conversion to UTF-8, and/or conversion of line-endings.
2.  The data is prefixed with a block of random bytes. This is equivalent to using a random IV.
3.  A SHA1 hash of the random prefix and data is appended.
4.  All this is encrypted with the session key and placed in the data packet.

#### F.27.3.1. `pgp_sym_encrypt()` [#](#PGCRYPTO-PGP-ENC-FUNCS-PGP-SYM-ENCRYPT)



```

pgp_sym_encrypt(data text, psw text [, options text ]) returns bytea
pgp_sym_encrypt_bytea(data bytea, psw text [, options text ]) returns bytea
```

Encrypt *`data`* with a symmetric PGP key *`psw`*. The *`options`* parameter can contain option settings, as described below.

#### F.27.3.2. `pgp_sym_decrypt()` [#](#PGCRYPTO-PGP-ENC-FUNCS-PGP-SYM-DECRYPT)



```

pgp_sym_decrypt(msg bytea, psw text [, options text ]) returns text
pgp_sym_decrypt_bytea(msg bytea, psw text [, options text ]) returns bytea
```

Decrypt a symmetric-key-encrypted PGP message.

Decrypting `bytea` data with `pgp_sym_decrypt` is disallowed. This is to avoid outputting invalid character data. Decrypting originally textual data with `pgp_sym_decrypt_bytea` is fine.

The *`options`* parameter can contain option settings, as described below.

#### F.27.3.3. `pgp_pub_encrypt()` [#](#PGCRYPTO-PGP-ENC-FUNCS-PGP-PUB-ENCRYPT)



```

pgp_pub_encrypt(data text, key bytea [, options text ]) returns bytea
pgp_pub_encrypt_bytea(data bytea, key bytea [, options text ]) returns bytea
```

Encrypt *`data`* with a public PGP key *`key`*. Giving this function a secret key will produce an error.

The *`options`* parameter can contain option settings, as described below.

#### F.27.3.4. `pgp_pub_decrypt()` [#](#PGCRYPTO-PGP-ENC-FUNCS-PGP-PUB-DECRYPT)



```

pgp_pub_decrypt(msg bytea, key bytea [, psw text [, options text ]]) returns text
pgp_pub_decrypt_bytea(msg bytea, key bytea [, psw text [, options text ]]) returns bytea
```

Decrypt a public-key-encrypted message. *`key`* must be the secret key corresponding to the public key that was used to encrypt. If the secret key is password-protected, you must give the password in *`psw`*. If there is no password, but you want to specify options, you need to give an empty password.

Decrypting `bytea` data with `pgp_pub_decrypt` is disallowed. This is to avoid outputting invalid character data. Decrypting originally textual data with `pgp_pub_decrypt_bytea` is fine.

The *`options`* parameter can contain option settings, as described below.

#### F.27.3.5. `pgp_key_id()` [#](#PGCRYPTO-PGP-ENC-FUNCS-PGP-KEY-ID)



```

pgp_key_id(bytea) returns text
```

`pgp_key_id` extracts the key ID of a PGP public or secret key. Or it gives the key ID that was used for encrypting the data, if given an encrypted message.

It can return 2 special key IDs:

*   `SYMKEY`

    The message is encrypted with a symmetric key.

*   `ANYKEY`

    The message is public-key encrypted, but the key ID has been removed. That means you will need to try all your secret keys on it to see which one decrypts it. `pgcrypto` itself does not produce such messages.

Note that different keys may have the same ID. This is rare but a normal event. The client application should then try to decrypt with each one, to see which fits — like handling `ANYKEY`.

#### F.27.3.6. `armor()`, `dearmor()` [#](#PGCRYPTO-PGP-ENC-FUNCS-ARMOR)



```

armor(data bytea [ , keys text[], values text[] ]) returns text
dearmor(data text) returns bytea
```

These functions wrap/unwrap binary data into PGP ASCII-armor format, which is basically Base64 with CRC and additional formatting.

If the *`keys`* and *`values`* arrays are specified, an *armor header* is added to the armored format for each key/value pair. Both arrays must be single-dimensional, and they must be of the same length. The keys and values cannot contain any non-ASCII characters.

#### F.27.3.7. `pgp_armor_headers` [#](#PGCRYPTO-PGP-ENC-FUNCS-PGP-ARMOR-HEADERS)



```

pgp_armor_headers(data text, key out text, value out text) returns setof record
```

`pgp_armor_headers()` extracts the armor headers from *`data`*. The return value is a set of rows with two columns, key and value. If the keys or values contain any non-ASCII characters, they are treated as UTF-8.

#### F.27.3.8. Options for PGP Functions [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS)

Options are named to be similar to GnuPG. An option's value should be given after an equal sign; separate options from each other with commas. For example:

```

pgp_sym_encrypt(data, psw, 'compress-algo=1, cipher-algo=aes256')
```

All of the options except `convert-crlf` apply only to encrypt functions. Decrypt functions get the parameters from the PGP data.

The most interesting options are probably `compress-algo` and `unicode-mode`. The rest should have reasonable defaults.

##### F.27.3.8.1. cipher-algo [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-CIPHER-ALGO)

Which cipher algorithm to use.

Values: bf, aes128, aes192, aes256, 3des, cast5\
Default: aes128\
Applies to: pgp\_sym\_encrypt, pgp\_pub\_encrypt

##### F.27.3.8.2. compress-algo [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-COMPRESS-ALGO)

Which compression algorithm to use. Only available if PostgreSQL was built with zlib.

Values:\
  0 - no compression\
  1 - ZIP compression\
  2 - ZLIB compression (= ZIP plus meta-data and block CRCs)\
Default: 0\
Applies to: pgp\_sym\_encrypt, pgp\_pub\_encrypt

##### F.27.3.8.3. compress-level [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-COMPRESS-LEVEL)

How much to compress. Higher levels compress smaller but are slower. 0 disables compression.

Values: 0, 1-9\
Default: 6\
Applies to: pgp\_sym\_encrypt, pgp\_pub\_encrypt

##### F.27.3.8.4. convert-crlf [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-CONVERT-CRLF)

Whether to convert `\n` into `\r\n` when encrypting and `\r\n` to `\n` when decrypting. RFC 4880 specifies that text data should be stored using `\r\n` line-feeds. Use this to get fully RFC-compliant behavior.

Values: 0, 1\
Default: 0\
Applies to: pgp\_sym\_encrypt, pgp\_pub\_encrypt, pgp\_sym\_decrypt, pgp\_pub\_decrypt

##### F.27.3.8.5. disable-mdc [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-DISABLE-MDC)

Do not protect data with SHA-1. The only good reason to use this option is to achieve compatibility with ancient PGP products, predating the addition of SHA-1 protected packets to RFC 4880. Recent gnupg.org and pgp.com software supports it fine.

Values: 0, 1\
Default: 0\
Applies to: pgp\_sym\_encrypt, pgp\_pub\_encrypt

##### F.27.3.8.6. sess-key [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-SESS-KEY)

Use separate session key. Public-key encryption always uses a separate session key; this option is for symmetric-key encryption, which by default uses the S2K key directly.

Values: 0, 1\
Default: 0\
Applies to: pgp\_sym\_encrypt

##### F.27.3.8.7. s2k-mode [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-S2K-MODE)

Which S2K algorithm to use.

Values:\
  0 - Without salt.  Dangerous!\
  1 - With salt but with fixed iteration count.\
  3 - Variable iteration count.\
Default: 3\
Applies to: pgp\_sym\_encrypt

##### F.27.3.8.8. s2k-count [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-S2K-COUNT)

The number of iterations of the S2K algorithm to use. It must be a value between 1024 and 65011712, inclusive.

Default: A random value between 65536 and 253952\
Applies to: pgp\_sym\_encrypt, only with s2k-mode=3

##### F.27.3.8.9. s2k-digest-algo [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-S2K-DIGEST-ALGO)

Which digest algorithm to use in S2K calculation.

Values: md5, sha1\
Default: sha1\
Applies to: pgp\_sym\_encrypt

##### F.27.3.8.10. s2k-cipher-algo [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-S2K-CIPHER-ALGO)

Which cipher to use for encrypting separate session key.

Values: bf, aes, aes128, aes192, aes256\
Default: use cipher-algo\
Applies to: pgp\_sym\_encrypt

##### F.27.3.8.11. unicode-mode [#](#PGCRYPTO-PGP-ENC-FUNCS-OPTS-UNICODE-MODE)

Whether to convert textual data from database internal encoding to UTF-8 and back. If your database already is UTF-8, no conversion will be done, but the message will be tagged as UTF-8. Without this option it will not be.

Values: 0, 1\
Default: 0\
Applies to: pgp\_sym\_encrypt, pgp\_pub\_encrypt

#### F.27.3.9. Generating PGP Keys with GnuPG [#](#PGCRYPTO-PGP-ENC-FUNCS-GNUPG)

To generate a new key:

```

gpg --gen-key
```

The preferred key type is “DSA and Elgamal”.

For RSA encryption you must create either DSA or RSA sign-only key as master and then add an RSA encryption subkey with `gpg --edit-key`.

To list keys:

```

gpg --list-secret-keys
```

To export a public key in ASCII-armor format:

```

gpg -a --export KEYID > public.key
```

To export a secret key in ASCII-armor format:

```

gpg -a --export-secret-keys KEYID > secret.key
```

You need to use `dearmor()` on these keys before giving them to the PGP functions. Or if you can handle binary data, you can drop `-a` from the command.

For more details see `man gpg`, [The GNU Privacy Handbook](https://www.gnupg.org/gph/en/manual.html) and other documentation on <https://www.gnupg.org/>.

#### F.27.3.10. Limitations of PGP Code [#](#PGCRYPTO-PGP-ENC-FUNCS-LIMITATIONS)

*   No support for signing. That also means that it is not checked whether the encryption subkey belongs to the master key.
*   No support for encryption key as master key. As such practice is generally discouraged, this should not be a problem.
*   No support for several subkeys. This may seem like a problem, as this is common practice. On the other hand, you should not use your regular GPG/PGP keys with `pgcrypto`, but create new ones, as the usage scenario is rather different.

### F.27.4. Raw Encryption Functions [#](#PGCRYPTO-RAW-ENC-FUNCS)

These functions only run a cipher over data; they don't have any advanced features of PGP encryption. Therefore they have some major problems:

1.  They use user key directly as cipher key.
2.  They don't provide any integrity checking, to see if the encrypted data was modified.
3.  They expect that users manage all encryption parameters themselves, even IV.
4.  They don't handle text.

So, with the introduction of PGP encryption, usage of raw encryption functions is discouraged.



```

encrypt(data bytea, key bytea, type text) returns bytea
decrypt(data bytea, key bytea, type text) returns bytea

encrypt_iv(data bytea, key bytea, iv bytea, type text) returns bytea
decrypt_iv(data bytea, key bytea, iv bytea, type text) returns bytea
```

Encrypt/decrypt data using the cipher method specified by *`type`*. The syntax of the *`type`* string is:

```

algorithm [ - mode ] [ /pad: padding ]
```

where *`algorithm`* is one of:

*   `bf` — Blowfish
*   `aes` — AES (Rijndael-128, -192 or -256)

and *`mode`* is one of:

*   `cbc` — next block depends on previous (default)
*   `ecb` — each block is encrypted separately (for testing only)

and *`padding`* is one of:

*   `pkcs` — data may be any length (default)
*   `none` — data must be multiple of cipher block size

So, for example, these are equivalent:

```

encrypt(data, 'fooz', 'bf')
encrypt(data, 'fooz', 'bf-cbc/pad:pkcs')
```

In `encrypt_iv` and `decrypt_iv`, the *`iv`* parameter is the initial value for the CBC mode; it is ignored for ECB. It is clipped or padded with zeroes if not exactly block size. It defaults to all zeroes in the functions without this parameter.

### F.27.5. Random-Data Functions [#](#PGCRYPTO-RANDOM-DATA-FUNCS)



```

gen_random_bytes(count integer) returns bytea
```

Returns *`count`* cryptographically strong random bytes. At most 1024 bytes can be extracted at a time. This is to avoid draining the randomness generator pool.



```

gen_random_uuid() returns uuid
```

Returns a version 4 (random) UUID. (Obsolete, this function internally calls the [core function](functions-uuid.html "9.14. UUID Functions") of the same name.)

### F.27.6. Notes [#](#PGCRYPTO-NOTES)

#### F.27.6.1. Configuration [#](#PGCRYPTO-NOTES-CONFIG)

`pgcrypto` configures itself according to the findings of the main PostgreSQL `configure` script. The options that affect it are `--with-zlib` and `--with-ssl=openssl`.

When compiled with zlib, PGP encryption functions are able to compress data before encrypting.

`pgcrypto` requires OpenSSL. Otherwise, it will not be built or installed.

When compiled against OpenSSL 3.0.0 and later versions, the legacy provider must be activated in the `openssl.cnf` configuration file in order to use older ciphers like DES or Blowfish.

#### F.27.6.2. NULL Handling [#](#PGCRYPTO-NOTES-NULL-HANDLING)

As is standard in SQL, all functions return NULL, if any of the arguments are NULL. This may create security risks on careless usage.

#### F.27.6.3. Security Limitations [#](#PGCRYPTO-NOTES-SEC-LIMITS)

All `pgcrypto` functions run inside the database server. That means that all the data and passwords move between `pgcrypto` and client applications in clear text. Thus you must:

1.  Connect locally or use SSL connections.
2.  Trust both system and database administrator.

If you cannot, then better do crypto inside client application.

The implementation does not resist [side-channel attacks](https://en.wikipedia.org/wiki/Side-channel_attack). For example, the time required for a `pgcrypto` decryption function to complete varies among ciphertexts of a given size.

#### F.27.6.4. Useful Reading [#](#PGCRYPTO-NOTES-USEFUL-READING)

*   <https://www.gnupg.org/gph/en/manual.html>

    The GNU Privacy Handbook.

*   <https://www.openwall.com/crypt/>

    Describes the crypt-blowfish algorithm.

*   <https://www.iusmentis.com/security/passphrasefaq/>

    How to choose a good password.

*   <http://world.std.com/~reinhold/diceware.html>

    Interesting idea for picking passwords.

*   <http://www.interhack.net/people/cmcurtin/snake-oil-faq.html>

    Describes good and bad cryptography.

#### F.27.6.5. Technical References [#](#PGCRYPTO-NOTES-TECH-REF)

*   <https://tools.ietf.org/html/rfc4880>

    OpenPGP message format.

*   <https://tools.ietf.org/html/rfc1321>

    The MD5 Message-Digest Algorithm.

*   <https://tools.ietf.org/html/rfc2104>

    HMAC: Keyed-Hashing for Message Authentication.

*   <https://www.usenix.org/legacy/events/usenix99/provos.html>

    Comparison of crypt-des, crypt-md5 and bcrypt algorithms.

*   <https://en.wikipedia.org/wiki/Fortuna_(PRNG)>

    Description of Fortuna CSPRNG.

*   <https://jlcooke.ca/random/>

    Jean-Luc Cooke Fortuna-based `/dev/random` driver for Linux.

### F.27.7. Author [#](#PGCRYPTO-AUTHOR)

Marko Kreen `<markokr@gmail.com>`

`pgcrypto` uses code from the following sources:

| Algorithm      | Author                  | Source origin     |
| -------------- | ----------------------- | ----------------- |
| DES crypt      | David Burren and others | FreeBSD libcrypt  |
| MD5 crypt      | Poul-Henning Kamp       | FreeBSD libcrypt  |
| Blowfish crypt | Solar Designer          | www\.openwall.com |

***

|                                                                                                    |                                                                             |                                                                                   |
| :------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](pgbuffercache.html "F.26. pg_buffercache — inspect PostgreSQL&#xA;    buffer cache state")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") |  [Next](pgfreespacemap.html "F.28. pg_freespacemap — examine the free space map") |
| F.26. pg\_buffercache — inspect PostgreSQL buffer cache state                                      |            [Home](index.html "PostgreSQL 17devel Documentation")            |                               F.28. pg\_freespacemap — examine the free space map |
