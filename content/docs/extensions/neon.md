---
title: The neon extension
enableTableOfContents: true
updatedOn: '2023-11-28T18:39:00.765Z'
---

With each Neon project, Neon creates  a "neon" extension, which includes functions and views designed to gather Neon-specific metrics. The metrics are intended for use by the Neon team for the purpose of enhancing our service. The views are owned by a Neon system role (`cloud_admin`), but you are able to view them by connecting to the `postgres` database using `psql` and executing the command `\dv neon.*`, as shown below. At present, the extension includes two views for local file cache metrics. We may incorporate additional views in future releases.

<CodeBlock shouldWrap>

```bash
psql 'postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/postgres?sslmode=require'

postgres=> \dv neon.*
            List of relations
Schema |      Name      | Type |    Owner    
--------+----------------+------+-------------
neon   | local_cache    | view | cloud_admin
neon   | neon_lfc_stats | view | cloud_admin
(2 rows)
```

</CodeBlock>

<NeedHelp/>
