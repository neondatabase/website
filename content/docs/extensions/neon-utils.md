---
title: The neon_utils extension
subtitle: Monitor how Neon's Autoscaling feature allocates compute resources
enableTableOfContents: true
updatedOn: '2024-10-23T14:34:44.513Z'
---

The `neon_utils` extension provides a `num_cpus()` function you can use to monitor how Neon's _Autoscaling_ feature allocates vCPU in response to workload. The function returns the current number of allocated vCPUs.

For information about Neon's _Autoscaling_ feature, see [Autoscaling](/docs/introduction/autoscaling).

## Install the `neon_utils` extension

Install the `neon_utils` extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION neon_utils;
```

For information about using the Neon **SQL Editor**, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Use the `num_cpus()` function

In Neon, computing capacity is measured in _Compute Units (CU)_. One CU is 1 vCPU and 4 GB of RAM, 2 CU is 2 vCPU and 8 GB of RAM, and so on. The amount of RAM in GB is always 4 times the number of vCPU. A Neon compute can have anywhere from .25 to 10 CU.

Defining a minimum and maximum compute size for your compute, as shown below, enables autoscaling.

![Edit compute dialog showing an autoscaling configuration](/docs/extensions/edit_compute_endpoint.png)

As your workload changes, computing capacity scales dynamically between the minimum and maximum settings defined in your compute configuration. To retrieve the number of allocated vCPU at any point in time, you can run the following query:

```sql
SELECT num_cpus();
```

For autoscaling configuration instructions, see [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

## Limitations

The following limitations apply:

- The `num_cpus()` function does not return fractional vCPU sizes. The _Autoscaling_ feature can scale by fractional vCPU, but the `num_cpus()` function reports the next whole number. For example, if the current number of allocated vCPU is `.25` or `.5`, the `num_cpus()` function returns `1`.
- The `num_cpus()` function only works on computes that have the _Autoscaling_ feature enabled. Running the function on a fixed-size compute does not return a correct value.

## Observe autoscaling with `neon_utils` and `pgbench`

The following instructions demonstrate how you can use the `num_cpus()` function with `pgbench` to observe how Neon's _Autoscaling_ feature responds to workload.

### Prerequisites

- Ensure that autoscaling is enabled for your compute. For instructions, see [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration). The following example uses a minimum setting of 0.25 Compute Units (CU) and a maximum of 4.
- The [pgbench](https://www.postgresql.org/docs/current/pgbench.html) utility.

### Run the test

1. Install the `neon_utils` extension:

   ```sql
   CREATE EXTENSION IF NOT EXISTS neon_utils;
   ```

2. Create a `test.sql` file with the following queries:

   ```sql
   SELECT LOG(factorial(5000)) / LOG(factorial(2500));
   SELECT txid_current();
   ```

3. To avoid errors when running `pgbench`, initialize your database with the tables used by `pgbench`. This can be done using the `pgbench -i` command, specifying the connection string for your Neon database. You can obtain a connection string from the **Connection Details** widget on the Neon **Dashboard**.

   ```bash shouldWrap
   pgbench -i postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

4. Run a `pgbench` test with your `test.sql` file, specifying your connection string:

   ```bash shouldWrap
   pgbench -f test.sql -c 15 -T 1000 -P 1 postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

   The test produces output similar to the following on a compute set to scale from 0.25 to 4 CUs.

   ```bash
   pgbench (15.3)
   starting vacuum...end.
   progress: 8.4 s, 0.0 tps, lat 0.000 ms stddev 0.000, 0 failed
   progress: 9.0 s, 0.0 tps, lat 0.000 ms stddev 0.000, 0 failed
   progress: 10.0 s, 4.0 tps, lat 1246.290 ms stddev 3.253, 0 failed
   progress: 11.0 s, 6.0 tps, lat 1892.455 ms stddev 446.686, 0 failed
   progress: 12.0 s, 9.0 tps, lat 2091.352 ms stddev 1068.303, 0 failed
   progress: 13.0 s, 5.0 tps, lat 1881.682 ms stddev 700.852, 0 failed
   progress: 14.0 s, 6.0 tps, lat 2660.009 ms stddev 1404.672, 0 failed
   progress: 15.0 s, 9.0 tps, lat 2354.776 ms stddev 1248.686, 0 failed
   progress: 16.0 s, 8.0 tps, lat 1770.870 ms stddev 776.465, 0 failed
   progress: 17.0 s, 7.0 tps, lat 1800.686 ms stddev 611.749, 0 failed
   progress: 18.0 s, 18.0 tps, lat 1681.841 ms stddev 1187.918, 0 failed
   progress: 19.0 s, 29.0 tps, lat 561.201 ms stddev 139.565, 0 failed
   progress: 20.0 s, 27.0 tps, lat 507.782 ms stddev 153.889, 0 failed
   progress: 21.0 s, 30.0 tps, lat 493.312 ms stddev 121.688, 0 failed
   progress: 22.0 s, 32.0 tps, lat 513.444 ms stddev 185.033, 0 failed
   progress: 23.0 s, 32.0 tps, lat 503.135 ms stddev 199.435, 0 failed
   progress: 24.0 s, 28.0 tps, lat 492.913 ms stddev 124.019, 0 failed
   progress: 25.0 s, 43.0 tps, lat 366.719 ms stddev 123.547, 0 failed
   progress: 26.0 s, 49.0 tps, lat 334.276 ms stddev 79.043, 0 failed
   progress: 27.0 s, 40.0 tps, lat 354.922 ms stddev 83.560, 0 failed
   progress: 28.0 s, 31.0 tps, lat 400.645 ms stddev 29.236, 0 failed
   progress: 29.0 s, 48.0 tps, lat 373.522 ms stddev 64.446, 0 failed
   progress: 30.0 s, 44.0 tps, lat 333.343 ms stddev 86.497, 0 failed
   progress: 31.0 s, 44.0 tps, lat 326.754 ms stddev 82.990, 0 failed
   progress: 32.0 s, 44.0 tps, lat 329.317 ms stddev 76.728, 0 failed
   progress: 33.0 s, 53.0 tps, lat 321.572 ms stddev 76.427, 0 failed
   progress: 34.0 s, 57.0 tps, lat 254.500 ms stddev 33.013, 0 failed
   progress: 35.0 s, 60.0 tps, lat 251.035 ms stddev 37.574, 0 failed
   progress: 36.0 s, 58.0 tps, lat 256.846 ms stddev 36.390, 0 failed
   progress: 37.0 s, 60.0 tps, lat 249.165 ms stddev 36.764, 0 failed
   progress: 38.0 s, 57.0 tps, lat 263.885 ms stddev 31.351, 0 failed
   progress: 39.0 s, 56.0 tps, lat 262.529 ms stddev 43.900, 0 failed
   progress: 40.0 s, 58.0 tps, lat 259.052 ms stddev 39.737, 0 failed
   ...
   ```

5. Call the `num_cpus()` function to retrieve the current number of allocated vCPU.

   ```sql
   ​​neondb=> SELECT num_cpus();
   num_cpus
   ----------
           4
   (1 row)
   ```

<NeedHelp/>
