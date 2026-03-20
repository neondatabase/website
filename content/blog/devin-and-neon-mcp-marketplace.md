---
title: Devin Integrates with Neon Through New MCP Marketplace
description: Give Devin access to your Neon database using the Neon MCP
excerpt: >-
  Cognition Lab’s AI software engineer, Devin, recently had its capabilities
  expanded by opening up an MCP (Model Context Protocol) server marketplace.
  With this, and Neon’s MCP server, you can now have Devin interact with your
  Neon database directly using a comprehensive set of to...
date: '2025-07-24T20:44:35'
updatedOn: '2025-07-24T20:44:37'
category: ai
categories:
  - ai
authors:
  - sam-harrison
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/devin-and-neon-mcp-marketplace/cover.png
  alt: null
isFeatured: true
seo:
  title: Devin Integrates with Neon Through New MCP Marketplace - Neon
  description: >-
    You can now have Devin interact with your Neon database directly, using a
    comprehensive set of tools via MCP server.
  keywords: []
  noindex: false
  ogTitle: Devin Integrates with Neon Through New MCP Marketplace - Neon
  ogDescription: >-
    You can now have Devin interact with your Neon database directly, using a
    comprehensive set of tools via MCP server.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/devin-and-neon-mcp-marketplace/social.png
source:
  wpId: 10438
  wpSlug: devin-and-neon-mcp-marketplace
  exportedAt: '2026-03-20T13:31:00.745Z'
---

Cognition Lab’s AI software engineer, Devin, recently had its capabilities expanded by opening up an MCP (Model Context Protocol) server marketplace. With this, and [Neon’s MCP server](https://neon.com/docs/ai/neon-mcp-server), you can now have Devin interact with your Neon database directly using a comprehensive set of tools. Here, let’s explore a practical scenario using Devin and the Neon MCP to see how one can fully automate a bug fix or feature.

## A Practical Example: Using Devin to Fix a Slow API

### Problem identified: performance bottleneck

Consider an e-commerce website with a “top sellers” table on its homepage, which shows the most sold products of the day. The backend endpoint might look like this:

```python
@app.get("/top-sellers")
async def top_sellers(limit: int = 5):
    sql = """
        SELECT
        product_id,
        SUM(quantity) AS total_qty
        FROM sales
        WHERE sold_at >= NOW() - INTERVAL '1 day'
        GROUP BY product_id
        ORDER BY total_qty DESC
        LIMIT $1;
    """
    async with app.state.pool.acquire() as conn:
        rows = await conn.fetch(sql, limit)
    return rows
```

However, when running this query with a large volume of sales, there’s quickly a drop in performance, and seconds of latency. To fix this, let’s hook up Devin with Neon’s MCP and GitHub integrations, and ask it to troubleshoot the problem, come up with a fix, and write a report.

### Diagnosis and resolution: Devin in action

Right away, Devin looked into the query plan using the `explain_sql_statement` tool which analyzes queries and provides suggestions. Then, using `prepare_query_tuning`, it was able to implement the suggested approach on a new branch to safely test the optimizations.

Unfortunately, after applying the indexes and analyzing the new query plan, there were no gains. However, because Devin works in an iterative loop, the failed attempt did not stop the process, and instead it tried another approach using a materialized view.

**This strategy resulted in a 97% performance increase.** Devin’s analysis also included the trade-off of potential data staleness with a materialized view, and recommended using the `pg_cron` extension to refresh the view hourly.

Following the successful test, Devin created a pull request on GitHub including the necessary change in the API to query the new materialized view, and a detailed explanation of the changes, and the reasoning behind them. The only remaining manual step was to review the report, and merge the changes.

![Image](https://cdn.neonapi.io/public/images/pages/blog/devin-and-neon-mcp-marketplace/ad4nxexs3sxi7k1b3ah4lrr7y1tm9q9oqimnjgce4pmiw5nhalhmeh2hsux3emjxoey8npkz1zz4snvcxa-gtby7qlgo8tjxbl-kxle2hayk3gfo2jg4andpj-zubqoore5nkiacxzg-bc9558fd.png)

Because the Neon MCP server was designed as a work-flow and tool first API for LLMs, rather than just a mirror of the normal programmatic API, Devin can take on these large and complex tasks more safely and confidently. Any query performance optimization test run on the database will be on a new [branch](https://neon.com/docs/introduction/branching), protecting your data if things go awry.

## Devin’s Agentic Toolkit is Expanding

With the integration of MCP servers, Devin can now interact directly not only with a Neon database but also with other common development tools like Sentry, DataDog, Linear, and Slack. As the ecosystem of MCP servers grows, the range of challenges these AI agents can take on increases.

Give [Devin](https://app.devin.ai/settings/mcp-marketplace) a try with your [Neon database](https://console.neon.tech/signup)!
