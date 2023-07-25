---
title: The neon_utils extension
subtitle: Monitor how Neon's Autoscaling feature allocates compute resources
enableTableOfContents: true
---

The `neon_utils` extension provides a `num_cpus()` function you can use to monitor how Neon's _Autoscaling_ feature allocates vCPU in response to workload. The function returns the current number of allocated vCPUs.

For information about Neon's _Autoscaling_ feature, see [Autoscaling](https://neon.tech/docs/introduction/autoscaling).

## Install the `neon_utils` extension

Install the `neon_utils` extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION neon_utils;
```

For information about using the Neon **SQL Editor**, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Use the `num_cpus()` function

In Neon, computing capacity is measured in _Compute Units (CU)_. One CU has 1 vCPU and 4 GB of RAM, 2 CUs have 2 vCPUs and 8 GB of RAM, and so on. The amount of RAM in GBs is always 4 times the number of CUs. A Neon compute can have anywhere from .25 to 7 CUs.

When you enable Autoscaling for a compute endpoint, you define a minimum and maximum compute size, as shown below:

![Edit compute endpoint dialog showing an Autoscaling configuration](/docs/extensions/edit_compute_endpoint.png)

As your workload changes, computing capacity scales dynamically between the minimum and maximum settings defined in your _Autoscaling_ configuration. To retrieve the number of allocated vCPUs at any point in time, you can run the following query:

```sql
SELECT num_cpus();
```

For _Autoscaling_ configuration instructions, see [Compute size and Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

## Limitations

The following limitations apply:

- The `num_cpus()` function does not return fractional vCPU sizes. If the current number of allocated vCPUs is `.25` or `.5`, the `num_cpus()` function returns `1`.
- The `num_cpus()` function only works on compute endpoints that have the _Autoscaling_ feature enabled. Running the function on a fixed size compute endpoint does not return a correct value.

## Observe Autoscaling with `neon_utils` and `pgbench`

The following instructions demonstrate how you can use the `num_cpus()` function with `pgbench` to observe how Neon's Autoscaling feature responds to workload.

### Prerequisites

- Ensure that _Autoscaling_ is enabled for your compute endpoint. For instructions, see [Compute size and Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration). The following example uses a minimum setting of 1 Compute Unit (CU) and a maximum of 7.
- The [pgbench](https://www.postgresql.org/docs/current/pgbench.html) utility

### Run the test

1. Install the `neon_utils` extension:

    ```sql
    CREATE EXTENSION IF NOT EXISTS neon_utils;
    ```

2. Create a `test.sql` file with the following queries:

    ```sql
    SELECT LOG(factorial(25000)) / LOG(factorial(10000));
    SELECT txid_current();
    ```

3. To avoid errors when running `pgbench`, initialize your database with the tables used by `pgbench`. This can be done using the `pgbench -i` command, specifying the connection string for your Neon database. You can obtain a connection string from the **Connection Details** widget on the Neon **Dashboard**. Your connection string will similar to the one below:

    <CodeBlock shouldWrap>

    ```bash
    pgbench -i postgres://sally:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
    ```

    </CodeBlock>

4. Run a `pgbench` test with your `test.sql` file, specifying the same connection string:

    <CodeBlock shouldWrap>

    ```bash
    pgbench -f test.sql -c 8 -T 10000 -P 1 postgres://sally:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
    ```

    </CodeBlock>

    The test produces output similar to the following:

    ```bashpgbench (14.8 (Ubuntu 14.8-0ubuntu0.22.04.1), server 15.3)
    starting vacuum...end.
    progress: 2.7 s, 0.0 tps, lat 0.000 ms stddev 0.000
    progress: 3.0 s, 0.0 tps, lat 0.000 ms stddev 0.000
    progress: 4.0 s, 0.0 tps, lat 0.000 ms stddev 0.000
    progress: 5.0 s, 0.0 tps, lat 0.000 ms stddev 0.000
    progress: 6.0 s, 0.0 tps, lat 0.000 ms stddev 0.000
    progress: 7.0 s, 0.0 tps, lat 0.000 ms stddev 0.000
    progress: 8.0 s, 0.0 tps, lat 0.000 ms stddev 0.000
    progress: 9.0 s, 0.0 tps, lat 0.000 ms stddev 0.000
    progress: 10.0 s, 8.0 tps, lat 7055.317 ms stddev 9.528
    ...
    ```

4. Call the `num_cpus()` function to retrieve the current number of allocated vCPUs.

    ```sql
    ​​neondb=> SELECT num_cpus();
    num_cpus
    ----------
            7
    (1 row)
    ```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
