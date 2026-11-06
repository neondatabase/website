---
title: 'Cut text-to-SQL prompt tokens on Neon with schema selection'
subtitle: 'Send the model only the tables each question needs, picked from the tables the caller may read, and measure what it saves.'
author: ashish-sinha
enableTableOfContents: true
createdAt: '2026-10-27T00:00:00.000Z'
updatedOn: '2026-10-27T00:00:00.000Z'
---

A text-to-SQL assistant has to tell the model what your database looks like, so every prompt carries the schema. Send all of it and every question pays for every table, on every call. On a database with dozens of tables that is thousands of tokens, most of them about tables the question never touches. The extra tables also give the model more ways to pick the wrong one.

This guide adds a selection step in front of the model. For each question, [schemagate](https://github.com/ashishsinha1602/schemagate), an open-source (Apache-2.0) Python library, ranks your Neon database's tables against the question and keeps only the few it needs, plus the tables they join to. It runs locally, with BM25 and a small embedding model, and makes no model call of its own. It also filters by who is asking: a table the caller may not read is never a candidate, so it cannot reach the prompt.

You will:

1. index the tables and views of a Neon database;
2. compare the full schema with the selection, in input tokens counted by the Anthropic API;
3. have Claude write SQL from the selection and run it on a read-only connection;
4. keep a restricted table out of the prompt for callers who may not read it.

## Prerequisites

- **Python** `3.10` or later.
- **A Neon project** with a populated database. Any schema works; the saving grows with the number of tables. Sign up for free at [console.neon.tech](https://console.neon.tech).
- **An Anthropic API key**, from [platform.claude.com](https://platform.claude.com/). The examples use `claude-haiku-4-5`; running all of them costs well under one cent.

<Steps>

## Set up the project

Create a virtual environment and install the packages. The `postgres` extra installs `psycopg`, which schemagate uses to read the Postgres catalog.

```bash
python -m venv .venv
source .venv/bin/activate
pip install "schemagate[postgres]>=1.14" anthropic python-dotenv
```

Copy your connection string from the **Connect** button on your Neon project dashboard, and put it in a `.env` file next to your script with your Anthropic key:

```bash
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech/<dbname>?sslmode=require&channel_binding=require"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

<Admonition type="tip" title="Use a read replica for generated SQL">
The SQL in this guide is written by a model. Point `DATABASE_URL` at a [Neon read replica](/docs/introduction/read-replicas), or at a role that has only `SELECT`, so a generated query can never change data or compete with your primary compute.
</Admonition>

## Index your schema

Create `app.py`. `bootstrap()` reads table names, columns, types, comments and foreign keys from the Postgres catalog. It does not read your rows.

```python
import os

import anthropic
import psycopg
from dotenv import load_dotenv
from schemagate import Catalog, Principal

load_dotenv()
DATABASE_URL = os.environ["DATABASE_URL"]
client = anthropic.Anthropic()
MODEL = "claude-haiku-4-5"

cat = Catalog().bootstrap(DATABASE_URL)
print(len(cat.objects()), "tables and views indexed")
```

Restrict any table that only some people may see. Here only the `payroll` role may read `hr_compensation`; replace it with a sensitive table of your own:

```python
cat.restrict("hr_compensation", ["payroll"])
```

## Compare the full schema with the selection

`messages.count_tokens` reports what a request would cost without running it. Build the same prompt twice, once with every table and once with the selection, and count both.

```python
QUESTION = "Which customers owe us money, and how much?"
analyst = Principal("okta:analyst", roles={"finance"})


def prompt(schema: str, question: str) -> str:
    return (
        f"Database schema (PostgreSQL):\n\n{schema}\n\nQuestion: {question}\n\n"
        "Reply with one PostgreSQL SELECT and nothing else."
    )


def input_tokens(text: str) -> int:
    return client.messages.count_tokens(
        model=MODEL, messages=[{"role": "user", "content": text}]
    ).input_tokens


full_schema = "\n\n".join(o.render_ddl(max_columns=10**6) for o in cat.objects())
selection = cat.select(QUESTION, top_k=6, principal=analyst)

full = input_tokens(prompt(full_schema, QUESTION))
small = input_tokens(prompt(selection.prompt_fragment(), QUESTION))
print("tables sent:", selection.table_names)
print(f"full schema: {full:,} input tokens")
print(f"selection:   {small:,} input tokens ({1 - small / full:.0%} fewer)")
```

`top_k=6` keeps the six best-ranked tables; with foreign-key expansion on (the default), the tables needed to join them come along too. A `Principal` names the caller and their roles; the `okta:` prefix says where the identity came from.

On schemagate's 42-object demo schema (commerce, billing, HR and inventory tables, loaded into Postgres 16), this printed:

```text
tables sent: ['public.crm_customer', 'public.v_customer_balance', 'public.crm_contact', 'public.crm_opportunity', 'public.sales_order', 'public.sales_quote', 'public.core_party', 'public.core_address', 'public.sales_order_status']
full schema: 3,072 input tokens
selection:   790 input tokens (74% fewer)
```

Your numbers depend on your schema. The more tables you have, the larger the share the selection removes.

## Ask Claude and run the SQL

Select again for each question, so every question gets its own tables, then run the generated SQL in a read-only session:

```python
def ask(question: str, principal: Principal) -> tuple[str, list]:
    schema = cat.select(question, top_k=6, principal=principal).prompt_fragment()
    msg = client.messages.create(
        model=MODEL,
        max_tokens=400,
        messages=[{"role": "user", "content": prompt(schema, question)}],
    )
    sql = msg.content[0].text.strip().removeprefix("```sql").removesuffix("```").strip()
    with psycopg.connect(DATABASE_URL) as conn:
        conn.read_only = True
        rows = conn.execute(sql).fetchall()
    return sql, rows


sql, rows = ask(QUESTION, analyst)
print(sql)
print(len(rows), "rows; first three:", rows[:3])
```

On the demo schema, Claude joined `crm_customer`, `core_party` and the `v_customer_balance` view and returned 17 customers, largest balance first. `conn.read_only = True` makes Postgres reject any write in that session, as a second guard next to the read replica.

## Keep restricted tables out of the prompt

A restricted table is not ranked low for a caller without the role; it is absent from the candidates. Ask a salary question as the analyst and as payroll:

```python
SALARY = "salary and pay grade by employee"
for who in (analyst, Principal("okta:hr", roles={"payroll"})):
    names = cat.select(SALARY, top_k=6, principal=who).table_names
    print(sorted(who.roles), "sees hr_compensation:", any(n.endswith("hr_compensation") for n in names))
```

```text
['finance'] sees hr_compensation: False
['payroll'] sees hr_compensation: True
```

The analyst's prompt never contains `hr_compensation`, so the model cannot query it or reveal that it exists. Keep your Postgres grants as well: selection controls what the model sees, and grants control what the connection may run.

</Steps>

## What to expect on larger schemas

The schemagate project measured the same comparison (full schema against selection, no model call) on public benchmark databases. The median saving per database:

| Schemas                                         | Median tables | Median saving |
| ----------------------------------------------- | ------------- | ------------- |
| BIRD dev                                        | 7             | 8.8%          |
| Spider 2.0-lite BigQuery and Snowflake          | 11            | 44.3%         |
| Spider 2.0-lite databases with 50 or more tables |               | 91.1%         |

A seven-table database is already small, so there is little to cut. Selection pays off on large schemas. It has a cost too: a table the question needs can be left out. On the Spider 2.0 warehouses, every table the reference SQL uses was selected for 86.7% of questions. Test with your own questions before relying on it, and raise `top_k` if the selection misses tables. The script and per-database results are in the project's [BENCHMARKS.md](https://github.com/ashishsinha1602/schemagate/blob/main/BENCHMARKS.md#prompt-tokens-on-public-schemas-the-saving-grows-with-the-schema).

## Next steps

- Try schema changes safely on a [Neon branch](/docs/introduction/branching): re-run `bootstrap()` against the branch's connection string to see how a migration changes what gets selected.
- Use the same selection as a [LangChain retriever](https://pypi.org/project/langchain-schemagate/) or a [LlamaIndex retriever](https://pypi.org/project/llama-index-retrievers-schemagate/).

## Resources

- [schemagate on GitHub](https://github.com/ashishsinha1602/schemagate)
- [Neon read replicas](/docs/introduction/read-replicas)
- [Anthropic token counting](https://docs.claude.com/en/docs/build-with-claude/token-counting)

<NeedHelp />
