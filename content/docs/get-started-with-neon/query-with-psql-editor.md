---
title: Query with psql Editor
---

To follow this guide, you will need a working installation of [psql](https://www.postgresql.org/download/), the PostgreSQL interactive terminal.

In the console go to the Project Dashboard, click “Generate Token” button, and follow the instructions to save the password into .pgpass file

Copy the connection string and run it in the shell:

```bash
psql -h postgres://<username>@<project_id>.cloud.neon.tech main
```

Run a simple query:

```sql
create my_table as select now();
select * from my_table;
```
