---
title: Benchmarking latency in Neon's serverless Postgres
subtitle: Techniques for obtaining meaningful latency data in serverless database
  environments
enableTableOfContents: true
updatedOn: '2025-06-04T16:43:36.534Z'
---

Benchmarking database query latency is inherently complex, requiring careful consideration of numerous variables and testing methodologies. Neon's serverless Postgres environment adds additional layers to this complexity due to compute auto-suspension, connection protocol differences, and geographic distribution. This guide provides detailed methodologies for separating cold-start costs from operational latency, selecting optimal connection types, and designing tests that accurately reflect production conditions.

## Understanding cold vs. hot queries

When benchmarking Neon databases, you'll encounter two distinct types of queries:

- **Cold queries**: Occur when a previously suspended compute resource is activated to process a request. This activation typically adds a few hundred milliseconds of latency. Cold queries are common in development or test environments where databases aren't running continuously.

- **Hot queries**: Execute on an already-active database instance, delivering consistent low latency. These represent typical performance in production environments where databases run continuously or remain active most of the time.

Free-tier Neon databases automatically suspend after 5 minutes of inactivity. Paid plans allow you to configure or disable the auto-suspend timeout, enabling you to customize your testing approach or eliminate cold starts entirely. See [Compute Lifecycle](/docs/introduction/compute-lifecycle) and [Auto-suspend Configuration](/docs/introduction/auto-suspend) for more details.

## Benchmarking methodology

For accurate benchmarking, always measure cold and hot queries separately:

1. **Cold query testing**:

   - Ensure your database is in a suspended state
   - Make a request to trigger compute activation
   - Measure this connection time, which includes the startup overhead

2. **Hot query testing**:
   - After triggering compute activation with a cold query
   - Make subsequent requests within the active window
   - Measure these connection times, which reflect normal operation

This methodology isolates the cold start overhead from normal operating performance, giving you a clearer picture of both typical performance and worst-case latency.

## Testing environment considerations

Before running benchmarks, determine exactly what kind of latency you want to measure:

- **Server-to-database latency**: If you're testing how quickly your application server can communicate with Neon, run benchmarks from the same location as your server. This is typically the most relevant metric for API performance.

- **Client-to-database latency**: If you're testing direct client connections (rare in production), benchmark from client locations.

Once you've determined what you're measuring:

- **Test from your production region**: Geographic proximity is the primary factor in connection latency. Run benchmarks from the same region as your production environment to get accurate results. If your Neon database is in `us-east-1`, execute benchmarks from a server in that AWS region.

- **Avoid localhost testing**: Testing from your local workstation doesn't reflect real-world conditions. In production, databases are typically queried from deployed servers, not client machines.

Avoid testing across unrealistic distances that don't represent your production setup, as this introduces network overhead your users won't experience. For more on geographic factors affecting latency, see [Connection Latency and Timeouts](/docs/connect/connection-latency).

## Connection types and their impact

[Neon's serverless driver](/docs/serverless/serverless-driver) supports two connection protocols: HTTP and WebSocket, each with distinctly different performance profiles. While some modern edge platforms now support direct TCP connections, many serverless environments still have limitations around persistent connections or TCP support. Neon's HTTP and WebSocket methods work across all serverless platforms, with each protocol having different latency characteristics and feature trade-offs depending on your query patterns. Understanding these differences is crucial for accurate benchmarking. For a comprehensive comparison, see [Choosing Connection Types](/docs/connect/choose-connection).

### HTTP connections

- **Performance profile**: Optimized for queries with minimal connection overhead
- **Use cases**:
  - Serverless functions that need low-latency query execution
  - Applications running multiple queries in parallel (HTTP can outperform WebSockets for parallel execution)
  - Scenarios where queries don't depend on each other
- **Limitations**: Doesn't support sessions, interactive transactions, NOTIFY, or COPY protocol
- **When to benchmark**: Use for measuring performance of stateless query operations, both individual and parallel
- **Optimization**: Connection caching can further reduce latency

### WebSocket connections

- **Performance profile**: Higher initial connection overhead but significantly faster for subsequent queries
- **Use cases**: Optimal for applications that execute multiple queries over a maintained connection
- **Features**: Supports full Postgres functionality including sessions, transactions, and all Postgres protocols
- **When to benchmark**: Measure both connection establishment time and subsequent query execution separately
- **Initialization**: Requires multiple round-trips between client and server to establish

### Benchmarking different connection types

When comparing HTTP vs WebSocket connections, you'll typically observe different latency patterns:

- **HTTP connections**: Show consistent low latency for individual queries and excel at parallel query execution
- **WebSocket connections**: Show higher initial connection latency (about 3-5x slower than HTTP) but very low latency for subsequent sequential queries

Consider your query patterns when choosing a connection type:

- For parallel queries or independent operations, HTTP often performs better
- For sequential queries where each depends on the previous result, WebSockets can be more efficient after the initial connection
- The break-even point typically occurs around 2-3 sequential queries, though this varies by region and workload

The runtime environment (Edge vs traditional serverless) can also impact connection performance characteristics.

**Testing approach:**

- For WebSockets: Establish the connection first, then measure query execution time separately. This reflects real-world usage where connections are reused.

- For HTTP: Measure individual query execution time including any per-query connection overhead.

For implementation details on both connection methods, refer to the [Serverless Driver Documentation](/docs/serverless/serverless-driver).

## Real-world usage pattern simulation

Design your benchmarks to simulate how your application actually interacts with Neon:

- **Use persistent connections**: For web servers or long-running applications, initialize the database connection before measuring query timings. Run a series of queries on this persistent connection. If your production environment uses connection pooling (which reuses database connections across requests), ensure your benchmarks account for this - pooled connections significantly reduce connection overhead after initial pool creation. See [Connection Pooling](/docs/connect/connection-pooling) for implementation details.

- **Avoid one-query-per-process testing**: While useful for understanding cold starts, simplistic tests that connect, query, and disconnect don't reflect long-running application performance.

- **Match your application pattern**:
  - If your app keeps connections alive, focus on post-connection query latency
  - If your app is serverless and frequently creates new connections, measure both scenarios but analyze them separately

For examples of different connection patterns and their implementation, see [Connection Examples](/docs/connect/choose-connection).

## Neon latency benchmarks dashboard

Neon provides a [Latency Benchmarks Dashboard](https://latency-benchmarks-dashboard.vercel.app) that measures latency between serverless functions and Neon databases across different regions. The benchmark specifically tracks:

- Roundtrip time for executing simple SELECT queries
- Network latency between function and database regions
- Database connection establishment time
- Performance differences between HTTP and WebSocket connections
- Cold vs hot query performance

This data helps you understand expected latencies based on your specific region and connection method. The dashboard is open source and [available on GitHub](https://github.com/neondatabase-labs/latency-benchmarks).

If you encounter unexpected results during your benchmarking, consult the [Connection Troubleshooting](/docs/connect/connect-intro#troubleshoot-connection-issues) documentation to identify potential issues.

## Conclusion

Benchmarking Neon requires understanding the unique characteristics of serverless Postgres. By separating cold and hot query measurements, testing from appropriate locations, and selecting the right connection methods, you'll obtain accurate performance metrics that reflect what your applications will experience in production.

For further information on connection latency, see the [Neon Documentation](/docs/connect/connection-latency).
