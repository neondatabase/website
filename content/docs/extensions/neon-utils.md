---
title: The neon_utils extension
subtitle: Use the neon_utils extension to check the size of an Neon compute endpoint
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

In Neon, computing capacity is measured in _Compute Units (CU)_. One CU has 1 vCPU and 4 GB of RAM. A Neon compute can have anywhere from .25 to 7 CUs, as outlined below:

| Compute Units | vCPU | RAM    |
|:--------------|:-----|:-------|
| .25           | .25  | 1 GB   |
| .5            | .5   | 2 GB   |
| 1             | 1    | 4 GB   |
| 2             | 2    | 8 GB   |
| 3             | 3    | 12 GB  |
| 4             | 4    | 16 GB  |
| 5             | 5    | 20 GB  |
| 6             | 6    | 24 GB  |
| 7             | 7    | 28 GB  |

When you enable Autoscaling for a compute endpoint, you define a minimum and maximum compute size, as shown below:

![Edit compute endpoint dialog showing an Autoscaling configuration](/docs/extensions/edit_compute_endpoint.png)

For _Autoscaling_ configuration instructions, see [Compute size and Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

As your workload changes, computing capacity scales dynamically between the minimum and maximum settings defined in your _Autoscaling_ configuration. To retrieve the number of allocated vCPUs at any point in time, you can run the following query:

```sql
SELECT num_cpus();
```

## Limitations

The following limitations apply:

- The `num_cpus()` function does not return fractional vCPU sizes. If the current number of allocated vCPUs is .25 or .5, the `num_cpus()` function returns `1`.
- The `num_cpus()` function only works on compute endpoints that have the _Autoscaling_ feature enabled. Running the function on a fixed size compute endpoint does not return a correct value.

## Use `neon_utils` with `pgbench` to monitor Autoscaling

The following instructions demonstrate how to use the `num_cpus()` function with `pgbench` to observe how Neon's Autoscaling feature responds to workload.

### Prerequisites

- Ensure that _Autoscaling_ is enabled for your compute endpoint. For instructions, see [Compute size and Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration). The following example uses a minimum setting of 1 Compute Unit (CU) and a maximum of 8.
- The [pgbench](https://www.postgresql.org/docs/current/pgbench.html) utility

### Run the test

1. Create a `test.sql` file with the following queries:

    ```sql
    SELECT LOG(factorial(25000)) / LOG(factorial(10000));
    SELECT txid_current();
    ```

2. Run a `pgbench` test with your `test.sql` file, specifying the connection string for your Neon database. You can obtain a connection string from the **Connection Details** widget on the Neon **Dashboard**. Your connection string will similar to the one below:

    <CodeBlock shouldWrap>

    ```bash
    pgbench -f test.sql -c 8 -T 10000 -P 1 postgres://sally:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
    ```

    </CodeBlock>

    The test will produce output similar to the following:

    ```bash
    progress: 40.0 s, 8.0 tps, lat 1832.261 ms stddev 27.660
    progress: 41.0 s, 2.0 tps, lat 1823.852 ms stddev 16.804
    progress: 42.0 s, 6.0 tps, lat 1858.655 ms stddev 32.797
    progress: 43.0 s, 5.0 tps, lat 1806.463 ms stddev 32.330
    progress: 44.0 s, 3.0 tps, lat 1853.339 ms stddev 15.384
    progress: 45.0 s, 6.0 tps, lat 1813.598 ms stddev 52.211
    progress: 46.0 s, 2.0 tps, lat 1859.142 ms stddev 13.280
    progress: 47.0 s, 8.0 tps, lat 1869.698 ms stddev 50.031
    ```

3. Install the `neon_utils` extension:

    ```sql
    CREATE EXTENSION IF NOT EXISTS neon_utils;
    ```

4. Call the `num_cpus` function to retrieve the current number of allocated vCPUs.

    ```sql
    ​​neondb=> SELECT num_cpus();
    num_cpus
    ----------
            8
    (1 row)
    ```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
