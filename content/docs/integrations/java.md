---
title: Run a Java app
redirectFrom: docs/quickstart/java
---

## Connect with Java Database Connectivity (JDBC)

The JDBC API is a Java API for relational databases. PostgreSQL has a well-supported open-source JDBC driver which can be used to access Neon. All popular Java frameworks use JDBC internally, so the only thing you need to do is use a correct connection URL.

To get a JDBC connection URL, replace placeholders with your credentials in the following template:

```java
jdbc:postgresql://<project>.cloud.neon.tech/main?user=<user>&password=<password>
```

For more information about JDBC, refer to the standard JDBC API documentation and [PostgreSQL JDBC Driver documentation](https://jdbc.postgresql.org/documentation/head/index.html).

## Using from Spring Data

Spring relies on JDBC and PostgreSQL driver to connect to PostgreSQL databases. If you are starting your project with Spring Initializr, do not forget to add **PostgreSQL Driver** as a dependency. If you have an existing project, ensure driver dependency is installed.

The only configuration required for connection is a datasource URL. It should be specified inside `application.properties` file in the following format:

```java
spring.datasource.url=jdbc:postgresql://<project>.cloud.neon.tech/main?user=<user>&password=<password>
```
