### Support added for AWS Data Migration Service (DMS)

Neon now supports data migration using the AWS Data Migration Service (DMS). Previously, a connection limitation prevented defining Neon as a target database endpoint. For data migration instructions, please refer to [Migrate with AWS Database Migration Service (DMS)](/docs/import/migrate-aws-dms).

### Fixes & improvements

Neon uses compute endpoint domain names to route incoming client connections. For example, to connect to the compute endpoint `ep-mute-recipe-239816`, we ask that you connect to `ep-mute-recipe-239816.us-east-2.aws.neon.tech`. However, the Postgres wire protocol does not transfer the server domain name, so Neon relies on the Server Name Indication (SNI) extension of the TLS protocol to do this. Unfortunately, not all Postgres clients support SNI. When these clients attempt to connect, they receive an error indicating that the "endpoint ID is not specified".

Neon supports several connection workarounds for this limitation, one of which involves a special `endpoint` connection option that allows clients to specify a compute endpoint in the password field of the connecting application. So, instead of specifying only a password, you provide a string consisting of the `endpoint` option and your password, separated by a semicolon. For example:

```bash
endpoint=<endpoint_id>;<password>
```

However, some client applications do not permit a semicolon character (`;`) to be used in a password field. For these clients, Neon now supports using a dollar sign character `$` as the delimiter:

```bash
endpoint=<endpoint_id>$<password>
```

For more information about this connection workaround for applications that do not support SNI, refer to our [connection errors](https://neon.tech/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field) documentation.
