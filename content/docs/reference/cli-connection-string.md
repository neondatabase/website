---
title: Neon CLI commands — connection-string
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

Ensure that you have [installed the Neon CLI](../reference/neon-cli#install-the-neon-cli).

## The `connection-string` command

This command constructs a PostgreSQL connection string for connecting to a database in your Neon project. The connection string includes the password for the specified role.

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
| --pooled | Use a pooled connection. The default is `false`. |boolean||

### Example

<CodeBlock shouldWrap>

```bash
neonctl connection-string --project.id spring-sky-578180 --endpoint.id ep-still-haze-361517 --role.name daniel --database.name neondb

postgres://daniel:<password>@ep-still-haze-361517.us-east-2.aws.neon.tech/neondb
```

</CodeBlock>

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
