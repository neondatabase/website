### Fixes & improvements

- Proxy: Neon uses compute endpoint domain names to route incoming client connections. For example, to connect to the compute endpoint `ep-mute-recipe-239816`, we ask that you connect to `ep-mute-recipe-239816.us-east-2.aws.neon.tech`. However, the Postgres wire protocol does not transfer the server domain name, so Neon relies on the Server Name Indication (SNI) extension of the TLS protocol to do this. Unfortunately, not all Postgres clients support SNI. When these clients attempt to connect, they receive an error indicating that the "endpoint ID is not specified".

  As a workaround, Neon provides a special connection option that allows clients to specify the compute endpoint they are connecting to. The connection option was previously named `project`. This option name is now deprecated but remains supported for backward compatibility. The new name for the connection option is `endpoint`, which is used as shown in the following example:

   <CodeBlock shouldWrap>

  ```txt
  postgres://[user]:[password]@[neon_hostname]/[dbname]?options=endpoint%3Dep-mute-recipe-239816
  ```

   </CodeBlock>

  For more information about this special connection option for Postgres clients that do not support SNI, refer to our [connection errors](/docs/connect/connection-errors) documentation.
- Pageserver: Branch deletion status was not tracked in S3 storage, which could result in a deleted branch remaining accessible.
- Pageserver: Addressed intermittent `failed to flush page requests` errors by adjusting Pageserver timeout settings.
