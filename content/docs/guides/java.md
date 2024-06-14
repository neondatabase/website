---
title: Connect a Java application to Neon
subtitle: Set up a Neon project in seconds and connect with JDBC or Spring Data
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/java
  - /docs/integrations/java
updatedOn: '2024-06-14T07:55:54.393Z'
---

This guide describes how to create a Neon project and connect to it with Java Database Connectivity (JDBC) or from a Spring Data project that uses JDBC.

The JDBC API is a Java API for relational databases. Postgres has a well-supported open-source JDBC driver which can be used to access Neon. All popular Java frameworks use JDBC internally. To connect to Neon, you are only required to provide a connection URL.

For additional information about JDBC, refer to the JDBC API documentation, and the [PostgreSQL JDBC Driver documentation](https://jdbc.postgresql.org/documentation).

To connect to Neon with JDBC or from a Spring Data project:

1. [Create a Neon project](#create-a-neon-project)
2. [Connect with JDBC](#connect-with-jdbc) or [Connect from Spring Data](#connect-from-spring-data)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Connect with JDBC

For a JDBC connection URL, replace the variables in the following URL string with your Neon project ID, database name, user, and password:

```java
jdbc:postgresql://[neon_hostname]/[dbname]?user=[user]&password=[password]&sslmode=require
```

You can find all of the connection details listed above in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Connect from Spring Data

Spring Data relies on JDBC and Postgres drivers to connect to Postgres databases, such as Neon. If you are starting your project with Spring Initializr or connecting from an existing Spring Data project, ensure that the `PostgreSQL database driver` dependency is installed.

Connecting from a Spring Data project requires specifying the datasource URL in your `application.properties` file, as shown in the following example:

```java
spring.datasource.url=jdbc:postgresql://[neon_hostname]/[dbname]?user=[user]&password=[password]&sslmode=require
```

Refer to the [Connect with JDBC](#connect-with-jdbc) section above for information about obtaining connection details for your Neon database.

<NeedHelp/>
