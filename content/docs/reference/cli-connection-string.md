---
title: Neon CLI commands — connection-string
subtitle: Use the Neon CLI to manage your Neon project directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Get started

Ensure that you have [installed the Neon CLI](../reference/neon-cli/get-started). Once you have done that, you can use the `connection-string` command to create connection strings from the command line.

## The `connection-string` command

This command creates a connection string for connecting to Neon. The connection string includes the password for the specified role.

### Usage

```bash
neonctl connection-string [options]
```

### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the the `connect-string` command supports these options:

| Option        | Description  | Type   | Required  |
| ------------- | ------------ | ------ | :------: |
| --project.id  | Project ID   | string | &check; |
| --endpoint.id | Endpoint ID  | string | &check; |
| --role.name   | Role name    | string | &check; |
| --database.name| Database name| string | &check; |

### Example

```bash
neonctl connection-string --project.id spring-sky-578180 --endpoint.id ep-still-haze-361517 --role.name daniel --database.name neondb
postgres://daniel:<password>@ep-still-haze-361517.us-east-2.aws.neon.tech/neondb
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
