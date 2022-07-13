---
title: Query with Neon's SQL Editor
redirectFrom:
  - /docs/get-started-with-neon/tutorials
---

<a id="query-via-ui/"></a>

In console ([https://console.neon.tech/](https://console.neon.tech/)) select your Project to see the Project details.

Select the SQL Editor tab.

Paste a query

```sql
create table t (c int);
insert into t select generate_series(1,100);
select count(*) from t;
```

Click run button to see the results.
