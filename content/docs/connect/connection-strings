---
title: Connection strings
enableTableOfContents: true
---

There are many ways to specify database connection details in your client or application, but connection strings, also referred to as connection URIs or connection URLs, are an easy way to provide your connection details in a compact form.

Neon makes it easy to obtain a connection string for any database in your Neon project.

To obtain a connection string:

1. Navigate to the Neon **Dashboard**.
1. Under **Connection details**, select a branch, a user, and the database you want to connect to. The connection string for your database is constructed for you.

The connection string displayed on the **Dashboard** has the following format:

```text
<uri_schema_designator>://<user>@<endpoint_id>.<region_slug>.<platform>.<neon_domain>/<database>
```

This example describes and actual connection string:

```text
postgres://casey@ep-cold-sun-597246.us-east-2.aws.neon.tech/main
    |        ^         ^                 ^     ^      ^      ^
    |        |- <user> |- <endpoint_id>  |     |      |      |- <database>
    |                                    |     |      |                                          
    |- <uri_schema_designator>           |     |      |- <neon_domain>
                                         |     |
                                         |     |- <platform>
                                         |
                                         |- <region_slug>
```

where:

- `<uri_schema_designator>` is the URI schema designator for PostgreSQL. Neon uses the `postgres` URI schema designator.
- `<user>` is the database user.
- `<endpoint_id>` is the ID of the endpoint, which is the compute instance associated with the branch.
- `<region_slug>` is the region where the Neon project was created. For information about the regions supported by Neon, see [Regions](../../conceptual-guides/regions).
- `<platform>` is the cloud platform. Currently, Neon uses the `aws` cloud platform.
- `<neon_domain>` is the Neon domain (`neon.tech`).
- `<database>` is the name of the database to connect to. Neon creates a default database named `main` in each project.

## Endpoint hostname

Together, the `endpoint_id`, `region_slug`, `platform`, and `neon_domain` form the endpoint hostname:

```ep-cold-sun-597246.us-east-2.aws.neon.tech```

An endpoint is a Neon compute instance. To connect to a branch in your Neon project from a client or application, you must connect to an endpoint that is associated with the branch. Endpoint hostnames always start with an `ep-` prefix. For more information about endpoints, see [Endpoints](tbd).

## Include a password

The connection string example above does not include the database user's password. For security reasons, the connection string shown on the Neon **Dashboard** only includes the database user's password immediately after creating a project. Once you navigate away from the Neon Console or refresh the browser after creating a project, the password is no longer displayed as part of the connection string.

To include a password in your connection string, add a colon after the user name and place it in the connection string as shown in the following example:

```text
postgres://casey:<password>@ep-cold-sun-597246.us-east-2.aws.neon.tech/main
```

## Include a port number

The PostgreSQL port number is not included in the connection string shown on the Neon dashboard. The default PostgreSQL port `5432` is assumed. To include a port number in your connection string, add a colon after the Neon domain and place the port number in the connection string as shown in the following example:

```text
postgres://casey@ep-cold-sun-597246.us-east-2.aws.neon.tech:<port>/main
```