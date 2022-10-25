---
title: Connect a Java application to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/java
---

This guide describes how to create a Neon project and connect to it with Java Database Connectivity (JDBC) or from a Spring Data project that uses JDBC.

The JDBC API is a Java API for relational databases. PostgreSQL has a well-supported open-source JDBC driver which can be used to access Neon. All popular Java frameworks use JDBC internally. To connect to Neon, you are only required to provide a connection URL.

For additional information about JDBC, refer to the standard JDBC API documentation and [PostgreSQL JDBC Driver documentation](https://jdbc.postgresql.org/documentation/head/index.html).

To connect to Neon with JDBC or from a Spring Data project:

1. [Create a Neon project](#create-a-neon-project)
2. [Connect with JDBC](#configure-go-project-connection-settings) or [Connect from Spring Data](#connect-from-spring-data)

## Create a Neon project

When creating a Neon project, take note of your project ID, database name, user, and password. This information is required when defining JDBC connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, and click **Create Project**.

For additional information about creating projects, see [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).

## Connect with JDBC

For a JDBC connection URL, replace the variables in the following URL string with your Neon project ID, database name, user, and password:

```java
jdbc:postgresql://<project_id>.cloud.neon.tech/<dbname>?user=<user>&password=<password>
```

where:

- `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**.
- `<dbname>` is the name of the database in your Neon project. `main` is the default database created with each Neon project.
- `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a project.

## Connect from Spring Data

Spring Data relies on JDBC and PostgreSQL drivers to connect to PostgreSQL databases, such as Neon. If you are starting your project with Spring Initializr or connecting from an existing Spring Data project, ensure that the `PostgreSQL database driver` dependency is installed.

Connecting from a Spring Data project requires specifying the datasource URL in your `application.properties` file, as shown in the following example:

```java
spring.datasource.url=jdbc:postgresql://<project_id>.cloud.neon.tech/<dbname>?user=<user>&password=<password>
```

Refer to the [Connect with JDBC](#connect-with-jdbc) section above for information about Neon `project_id`, `dbname`, `user`, and `password` credentials.
