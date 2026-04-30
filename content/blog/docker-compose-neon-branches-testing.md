---
title: 'Beyond Docker Compose: An Alternative for Deploying Postgres for Testing'
description: Get consistent test data with Neon branches
excerpt: >-
  Testing applications with Postgres presents a common challenge: how do you
  provide each developer and CI pipeline with isolated, consistent databases to
  test against? Docker Compose has emerged as the standard solution, offering
  containerized Postgres instances that can be spun u...
date: '2025-02-24T19:18:32'
updatedOn: '2025-02-24T19:24:34'
category: postgres
categories:
  - postgres
  - workflows
authors:
  - jeff-christoffersen
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/docker-compose-neon-branches-testing/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Beyond Docker Compose: An Alternative for Deploying Postgres for Testing -
    Neon
  description: >-
    If you use Docker to deploy Postgres for your ephemeral testing
    environments, try Neon branches—as fast a Docker but with persistent data.
  keywords: []
  noindex: false
  ogTitle: >-
    Beyond Docker Compose: An Alternative for Deploying Postgres for Testing -
    Neon
  ogDescription: >-
    If you use Docker to deploy Postgres for your ephemeral testing
    environments, try Neon branches—as fast a Docker but with persistent data.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/docker-compose-neon-branches-testing/social.jpg
source:
  wpId: 8613
  wpSlug: docker-compose-neon-branches-testing
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/docker-compose-neon-branches-testing/neon-beyond-docker-1024x576-f6a9953d.jpg)

Testing applications with Postgres presents a common challenge: how do you provide each developer and CI pipeline with isolated, consistent databases to test against? [Docker Compose](https://docs.docker.com/compose/) has emerged as the standard solution, offering containerized Postgres instances that can be spun up alongside your application with a single command.

However, as testing requirements grow more complex, teams often discover the limitations of this approach. Populating test data into a local database container can be cumbersome, managing test data between runs can be tricky, and CI pipelines can slow down as they repeatedly spin up new database instances. What started as a simple solution can become a source of testing headaches.

## Why Use Docker Compose for Testing with Postgres?

Since running Postgres for testing requires a multi-container setup, one for Postgres and one for your application, it is clear why many developers turn to Docker Compose for testing. It not only provides a way to test your application in an isolated, reproducible, and easy way but also removes the complexity of installing and configuring dependencies like a Postgres database locally. You just need to use the [Postgres official docker image](https://hub.docker.com/_/postgres) in your Compose app, as it contains all the necessary code, tools, dependencies, and libraries that your application needs. Here are some of the benefits of using official Postgres image from Docker:

- **Quick setup**: You can start the Postgres container that has preconfigured settings and avoid any complex manual setup.
- **Consistency**: Docker ensures that all the team members and CI/CD environments use the same database version and configurations.
- **Automated cleanup**: Once the testing is finished, docker containers can be stopped and removed with very simple commands. This helps in preventing resource leakage.

A simple `docker compose.yml` file to spin up the Postgres database for testing looks something like this:

```bash
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: testuser
      POSTGRES_PASSWORD: testpass
      POSTGRES_DB: testdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

![Image](https://cdn.neonapi.io/public/images/pages/blog/docker-compose-neon-branches-testing/ad4nxfnkexuare51nd0gslynpalejtuupfwzmjied1x0hkmmo8q9gkdtb2mp8rggztufeuivf1dq6qoowlexn8hd5frmtotbwj7fwyocjbawc67kpbuncodom-6leo-lamdxkqh-d987da26.png)

Let’s break down this Docker Compose file to understand each component:

1. `services`: Each service in the services section defines a different container that makes up your application and includes configuration data to ensure they work correctly and can communicate with each other.
2. `services.postgres`: This is the specific service that will be created when you run Docker Compose. This service, named postgres, will run a Postgres database using the official Postgres Docker image and make it available to your local network on port 5432. The service definition also defines the databases name and what credentials can be used to log into the database.
3. `volumes`: This section declares any Docker volumes you want Docker Compose to create and manage as a part of your application. Because the postgres container uses a docker volume named `pgdata` to store persistent data, it is necessary to also declare it as a root-level object in your compose definition under the volumes section.

Now all that’s left is to start the database. For this, you simply need to run this command:

```bash
docker compose up
```

![Image](https://cdn.neonapi.io/public/images/pages/blog/docker-compose-neon-branches-testing/ad4nxeaylkp3avrfqxrf-i0-jpuuxzdshd984mrvbgq32elnsrc4-1koldn9kdnks1jykmrvx4ajdvxzepomwesxsv1pjeps-xjrtpxjse2mjvxagm9kdmlvcaqr1utcz0arx8sg-22098b72.png)

This launches a Postgres container with a test database ready for application testing.<br />

## The Limitations of Docker Compose for Testing

While Docker Compose simplifies the setup of Postgres for testing, it has a few shortcomings that can impact efficiency, reliability, and scalability. These challenges become more apparent in more complex testing environments, especially CI/CD pipelines and large-scale projects.

### Populating your database: Ensuring data is present for testing

Setting up small, static datasets in Postgres containers is relatively straightforward, either by mounting an initialization SQL script or using testing frameworks to generate fixture data during test execution. However, populating more complex or production-like datasets is far more challenging. While exporting a Postgres database volume into a Docker registry is possible, Docker Compose currently lacks support for using exported volumes when deploying services. This leaves developers primarily with a few suboptimal approaches to populating larger datasets for testing:

- **Embedding data in a custom database image**. Embedding the database data directly in a custom Docker image can lead to excessively large images and cumbersome build processes that are difficult to maintain.
- **Including migration containers in their compose app**. Executing data seeding or migration jobs in separate helper containers before testing can significantly slow down test execution as the compose app must wait for the job to complete before starting their tests.
- **Leveraging shared staging databases**. Using a shared centralized database in a staging or similar test environment can lead to data integrity problems and increase test downtime by introducing a single point of failure.

All of these options introduce inefficiencies, making dataset management a notable limitation of Docker Compose.

### Persistence Issues: Cleaning up containers and volumes after testing

Another significant challenge with Docker Compose is managing the persistence of test data. By default, Postgres stores data inside the container’s file system or in mounted persistent volume (pgdata in the example above).

This often leads to unintended data persistence between test runs, where the current run can be affected by the data stored in previous runs. This issue can affect test repeatability and lead to [data contamination](https://www.holisticai.com/blog/overview-of-data-contamination) during testing. Also, if the container is not properly cleaned up, Postgres instances may occupy more storage over time, consuming disk space in the environment. Moreover, in the case of CI/CD pipelines, leftover volumes can slow down builds and create state inconsistencies across different test executions.

The most straightforward solution to this problem is to run the docker compose down -v command after your test execution. However, this also requires additional steps and automation to ensure a fresh start for each test, and means that the database has be be re-initialized for each test run, including possibly seeding or migrating all new test data into the database, which can slow down testing significantly. Another approach could be to leverage Docker’s tempfs file system which uses the container’s RAM instead of a persistent storage volume, but this can significantly increase the container’s RAM usage and lead to resource contention.

### Resource consumption: Running local databases can be heavy on RAM/CPU

Postgres is an always-on database that consumes CPU, memory, and disk I/O even when not actively in use. This is why running Postgres with Docker Compose adds overhead to local development and testing environments.

If you deploy a Postgres container locally alongside other applications, your system can be sluggish. On CI/CD servers, spinning up Postgres in each test run can slow down test execution. Finally, large datasets require higher memory and storage. This can cause performance issues when multiple team members or tests are running concurrently.

## Database Branches: A Smart Alternative

The challenges with using a local Postgres container with Docker Compose raise a fundamental question: Do we need to run a full local database instance for every test environment? Modern cloud architectures suggest an alternative approach: database branching.

Database branching applies Git-like principles to database management. Just as Git creates lightweight copies of your codebase, database branching creates isolated copies of your database. These branches share underlying storage but maintain complete isolation, allowing developers to:

- Create instant, isolated test environments
- Run parallel tests without resource conflicts
- Clean up automatically after test completion

The key innovation behind database branching is the separation of storage and compute. Unlike traditional databases, where these are tightly coupled, branching architectures use copy-on-write mechanics to create instant copies of data. When you create a branch:

1. A new isolated compute instance is provisioned
2. The branch shares the original data storage
3. Any changes are written only to the branch
4. The original data remains completely unchanged

We can see this in action with [Neon](https://neon.tech/home). Here’s a simple example of creating a test branch:

```bash
neon branches create --name test-branch

# Run your tests against the isolated branch
TEST_DATABASE_URL="postgresql://neondb_owner:89ef7ewfbbef@ep-falling-scene-a8f2ngf9-pooler.eastus2.azure.neon.tech/neondb"
npm test

# Clean up automatically when done
neon branches delete test-branch
```

Database branching addresses many of the pain points we encountered local Postgres containers in Docker Compose:

- **Prepopulated test data.** By creating a branch of an existing database (with test data already in it), developers can instantly gain access to a prepopulated database for testing without having to perform data migrations or rely on shared databases that others are using as well.
- **Clean test states**. Each branch provides a fresh, isolated environment:
  - No need for cleanup scripts
  - No data persistence between runs
  - No state leakage between tests
- **Resource efficiency**. Instead of running full database instances, branches share underlying storage and provision compute only when needed. This means:
  - Lower memory and CPU usage
  - Faster test startup times
  - Reduced infrastructure costs

With database branching, Neon gives developers all of the benefits of testing against a shared staging environment database without any of the downsides that typically accompany using shared development resources during testing.

### When to use a local Postgres container vs. Neon branches?

Use local Postgres container if:

- You need full local control over the database instance.
- Your team prefers offline development environments.
- You have lightweight testing needs.

Use Neon Branches if:

- You want instant, isolated test databases per test run.
- You need scalability and parallel testing.
- You want zero local setup and cloud-based performance.

## Database Branching for Ephemeral Dev/Test Environments

The evolution of database testing reflects a broader shift in how we think about development environments. While Docker Compose revolutionized local testing by making it easy to spin up isolated databases, the growing complexity of modern applications demands more scalable solutions. Database branching represents the next step in this evolution, offering the isolation we need without the operational overhead.

The choice between Docker Compose and database branching isn’t binary – many teams successfully leverage containers for local development while using branches for CI/CD pipelines and complex testing scenarios. The key is understanding your team’s needs and choosing the right tool for each job.

---

_If you’d like to try Neon branches, they’re included in the [Free Plan](https://neon.tech/pricing) (no credit card required). [Create an account](https://console.neon.tech/signup) and get started right away._
