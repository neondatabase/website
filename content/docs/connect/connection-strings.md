---
title: Connection strings
enableTableOfContents: true
---

There are many ways to specify database connection details in your client or application, but connection strings, also referred to as connection URIs or connection URLs, are an easy way to provide connection details in a compact form.

Neon makes it easy to obtain a connection string for any database in your Neon project. To obtain a connection string:

1. Navigate to the Neon **Dashboard**.
1. Under **Connection details**, select a branch, a user, and the database you want to connect to. The connection string for your database is constructed for you.

![Connection details widget](./images/connection_details.png)

A connection string has the following format:

```text
<uri_schema_designator>://<user>@<endpoint_id>.<region_slug>.<platform>.<neon_domain>/<database>
```

For example:

```text
postgres://casey@ep-polished-water-579720.us-east-2.aws.neon.tech/main
    ^        ^         ^                       ^     ^      ^      ^
    |        |         |- <endpoint_id>        |     |      |      |- <database>
    |        |                                 |     |      |      
    |        |- <user>                         |     |      |- <neon_domain>                                          
    |                                          |     |             
    |- <uri_schema_designator>                 |     |- <platform>
                                               |     
                                               | - <region_slug>
```

where:

- `<uri_schema_designator>` is the URI schema designator.
- `<user>` is the database user.
- `<endpoint_id>` is the endpoint ID. An endpoint is the compute instance associated with the branch.
- `<region_slug>` is the region where the Neon project was created. For information about the regions supported by Neon, see [Regions](../../conceptual-guides/regions).
- `<platform>` is the cloud platform.
- `<neon_domain>` is the Neon domain (`neon.tech`).
- `<database>` is the name of the database to connect to.

<Admonition type="note">
The connection string format has evolved as new features have been introduced. The connecting string format for an older Neon project may differ from what is described here. For more information, see [Connection string change history](#connection-string-change-history).
</Admonition>

## Add a password to a connection string

For security reasons, the connection string shown on the Neon **Dashboard** only includes the database user's password immediately after you create a project. Once you navigate away from the Neon Console or refresh the browser, the password is no longer included in the connection string that is shown on the **Dashboard**.

To add a password to a connection string, add `:<password>` after the user name, as shown in the following example:

```text
postgres://casey:a12BcdefHhIJ@ep-polished-water-579720.us-east-2.aws.neon.tech/main
```

If you have misplaced your password, refer to [Users](tbd) for password reset instructions.

## Add a port number to a connection string

The PostgreSQL port number is not included in the connection string shown on the Neon **Dashboard**. The default PostgreSQL port `5432` is assumed. To add a port number to a connection string, add `:<port>` after the Neon domain, as shown in the following example:

```text
postgres://casey@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/main
```

## Endpoint hostnames

A PostgreSQL hostname is typically required when configuring database connection for an application (see [Connect from any application](../connect-from-any-app)). With Neon, the hostname of your PostgreSQL instance is the endpoint hostname. An endpoint is the Neon compute instance associated with a branch.

Together, the `endpoint_id`, `region_slug`, `platform`, and `neon_domain` details form the endpoint hostname. For example:

```ep-polished-water-579720.us-east-2.aws.neon.tech```

The hostname for an endpoint in your Neon project can also be found in the **Connection Details** widget on the Neon **Dashboard**, on the **Endpoints** page, or by selecting a branch on the **Branches** page (for branches with an associated endpoint).

Endpoint hostnames always start with an `ep-` prefix. For more information about endpoints, see [Endpoints](tbd).

## Connection string change history

With the addition of support for new regions and updates to Neon's branching capabilities in [November, 2022](https://neon.tech/docs/release-notes/), changes were made to the hostname in Neon connection strings. Previously, a Neon hostname had this format: `<project_id>.cloud.neon.tech`. With the introduction of new regions, a `<region_slug>` and `<platform>` value were added to the hostname for projects created in newly supported regions. With the update to branching capabilities, `<project_id>` was replaced by `<endpoint_id>`. As a result of these changes:

- Projects created in the original Neon region, US West (Oregon), currently have this hostname format: `<endpoint_id>.cloud.neon.tech`.
- Projects created in the newly supported regions, have this hostname format: `<endpoint_id>.<region_slug>.<platform>.neon.tech`, which is the *endpoint hostname* described above. See [Endpoint hostnames](#endpoint-hostnames).

The old hostname format continues to be supported for projects created before the region and branching changes were introduced.
