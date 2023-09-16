---
title: Sample datasets
subtitle: Download sample datasets for learning, testing, and exploring Neon features
enableTableOfContents: true
---

This topic describes how to download sample datasets for learning, testing, and exploring Neon Serverless Postgres features. There are several datasets to choose from, ranging in size and complexity.

The following sections describe how to download dataset source files using `wget` and install them using either `psql` or `pg_restore`. If you do not have `wget`, you can download the source file by pasting the file address in your browser's address bar.

## Datasets

- [Chinook database](#chinook-database)
- [Employees database](#employees-database)
- [Lego database](#lego-database)
- [Netflix data](#netflix-data)
- [Pagila database](#pagila-database)
- [Periodic table data](#periodic-table-data)
- [Titanic passenger data](#titantic-passenger-data)
- [World Happiness Index](#world-happiness-index)

### Chinook database

Chinook digital media store database (11 tables, 2280 KB)

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/chinook.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/chinook" -f chinook.sql
```

- Source: [https://github.com/lerocha/chinook-database](https://github.com/lerocha/chinook-database)
- License: [https://github.com/lerocha/chinook-database/blob/master/LICENSE.md](https://github.com/lerocha/chinook-database/blob/master/LICENSE.md)

### employees database

Employees database (6 tables, 360 MB)

Create the database and schema:

```sql
CREATE DATABASE employees;
\c employees
CREATE SCHEMA employees;
```

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/employees.sql.gz
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
pg_restore -d postgres://[user]:[password]@[hostname]/employees -Fc employees.sql.gz -c -v -no-owner --no-privileges
```

- Source: The initial dataset was created by Fusheng Wang and Carlo Zaniolo from Siemens Corporate Research, and can be found in XML format at this location: [http://timecenter.cs.aau.dk/software.htm](http://timecenter.cs.aau.dk/software.htm). Designing the relational schema was undertaken by Giuseppe Maxia while Patrick Crews was responsible for transforming the data into a format compatible with MySQL. Their work can be accessed here: [https://github.com/datacharmer/test_db](https://github.com/datacharmer/test_db). Subsequently, this information was adapted to a format suitable for PostgreSQL: [https://github.com/h8/employees-database](https://github.com/h8/employees-database). The data was generated, and there are inconsistencies.
- License: This work is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported License. To view a copy of this license, visit [http://creativecommons.org/licenses/by-sa/3.0/](http://creativecommons.org/licenses/by-sa/3.0/) or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.

### Lego database

Lego database (8 tables, 35 MB)

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/lego.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/lego" -f lego.sql
```

- Source: [https://www.kaggle.com/datasets/rtatman/lego-database](https://www.kaggle.com/datasets/rtatman/lego-database)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Netflix data

Netflix shows (1 table, 3832 KB)

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/netflix_shows.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/netflix" -f netflix_shows.sql
```

- Source: [https://www.kaggle.com/datasets/shivamb/netflix-shows](https://www.kaggle.com/datasets/shivamb/netflix-shows)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Pagila database

Pagila database (22 tables, 7856 KB)

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/pagila.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/pagila" -f pagila.sql
```

- Source: [https://github.com/devrimgunduz/pagila](https://github.com/devrimgunduz/pagila)
- License: [LICENSE.txt](https://github.com/devrimgunduz/pagila/blob/master/LICENSE.txt)

### Periodic table data

Periodic table of elements (1 table, 72 KB)

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/periodic_table.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/periodic_table" -f periodic_table.sql
```

- Source: [https://github.com/andrejewski/periodic-table](https://github.com/andrejewski/periodic-table)
- License: [ISC License](https://github.com/andrejewski/periodic-table/blob/master/LICENSE)

### Titanic passenger data

Titanic passenger data (1 table, 408 KB)

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/titanic.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/titanic" -f titanic.sql
```

- Source: [https://www.kaggle.com/datasets/ibrahimelsayed182/titanic-dataset](https://www.kaggle.com/datasets/ibrahimelsayed182/titanic-dataset)
- License: [Unknown](https://www.kaggle.com/datasets/vinicius150987/titanic3)

### World Happiness Index

World Happiness Index (1 table, 56 KB)

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/happiness_index.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/happiness_index" -f happiness_index.sql
```

- Source: [https://www.kaggle.com/datasets/unsdsn/world-happiness](https://www.kaggle.com/datasets/unsdsn/world-happiness)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Wikipedia article vector embeddings

Wikipedia article vector embeddings (1 table, 2.8 GB)

This dataset consists of pre-computed vector embedding for 25000 Wikipedia articles. It is intended for use with the `pgvector` Postgres extension, which you must install first to create the table that will hold the data. For a Jupyter Notebook that uses this dataset with Neon, `pgvector`, and OpenAI, refer to the following GitHub repository: [neon-vector-search-openai-notebooks](https://github.com/neondatabase/neon-vector-search-openai-notebooks)

Download the zip file (~700MB):

```bash
wget https://cdn.openai.com/API/examples/data/vector_database_wikipedia_articles_embedded.zip
```

Navigate to the directory where you downloaded the zip file, and run the following command to extract the source file:

```bash
unzip vector_database_wikipedia_articles_embedded.zip
```

Install the `pgvector` extension:

```sql
CREATE EXTENSION vector;
```

Create the following table in your database:

```sql
CREATE TABLE IF NOT EXISTS public.articles (
    id INTEGER NOT NULL,
    url TEXT,
    title TEXT,
    content TEXT,
    title_vector vector(1536),
    content_vector vector(1536),
    vector_id INTEGER
);

ALTER TABLE public.articles ADD PRIMARY KEY (id);
```

Navigate to the directory where you extracted the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/happiness_index" -f vector_database_wikipedia_articles_embedded.sql
```

Optionally, create the vector search indexes using the following commands:

```sql
CREATE INDEX ON public.articles USING ivfflat (content_vector) WITH (lists = 1000);

CREATE INDEX ON public.articles USING ivfflat (title_vector) WITH (lists = 1000);
```

- Source: [OpenAI](https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases)
- License: [MIT License](https://github.com/openai/openai-cookbook/blob/main/LICENSE)

### postgres_air database

Download the file from: [Google drive](https://drive.google.com/drive/folders/13F7M80Kf_somnjb-mTYAnh1hW1Y_g4kJ)

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/happiness_index" -f postgres_air_2023.backup
```

- Source: [tbd](tbd)
- License: [tbd](tbd)

### Amazon DMS Sample Database

Amazon DMS Sample Database (16 tables, 2 views, 8 procedures, 10 GB)

<Admonition type="warning">
This sample database is 10 GBs in size. It exceeds the Neon Free Tier storage limit of 3 GBs per branch. Do not install it unless you are a [Neon Pro plan](/docs/introduction/pro-plan) user.
</Admonition>

For information about this database and its structure, see [Amazon DMS Sample Database for PostgreSQL: version 1.0](https://github.com/aws-samples/aws-database-migration-samples/blob/master/PostgreSQL/sampledb/v1/README.md).

Create a database named `dms_sample`.

```CREATE DATABASE dms_sample;`

Run the following command to download the database creation scripts from GitHub:

```bash
git clone https://github.com/aws-samples/aws-database-migration-samples.git
```

Change to the `aws-database-migration-samples/PostgreSQL/sampledb/v1` directory.

Run the following command, providing the connection details for your `dms_sample` database.

```bash
psql -h <neon_hostname> -p 5432 -U <role> -d dms_sample -a -f ~/aws-database-migration-samples/PostgreSQL/sampledb/v1/postgresql.sql
```

You Neon hostname will look something like this: ```ep-soft-night-37218378.us-east-2.aws.neon.tech```.

- Source: [https://github.com/aws-samples/aws-database-migration-samples](https://github.com/aws-samples/aws-database-migration-samples)
- License: [Apache License](https://github.com/aws-samples/aws-database-migration-samples/blob/master/LICENSE)
