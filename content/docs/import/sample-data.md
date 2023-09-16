---
title: Sample datasets
subtitle: Download sample datasets for learning, testing, and exploring Neon features
enableTableOfContents: true
---

This topic describes how to download sample datasets for learning, testing, and exploring Neon Serverless Postgres features. There are several datasets to choose from, ranging in size and complexity.

The following sections describe how to download dataset source files using `wget` and install them using either `psql` or `pg_restore`. If you do not have `wget`, you can download the source file by pasting the file address in your browser's address bar.

## Datasets

- [Chinook database](#chinook-database) (9.6 MB)
- [Employees database](#employees-database) (360 MB)
- [Lego database](#lego-database) (42 MB)
- [Netflix data](#netflix-data) (11 MB)
- [Pagila database](#pagila-database) (7.1 MB)
- [Periodic table data](#periodic-table-data) (72 KB)
- [Titanic passenger data](#titanic-passenger-data) (408 KB)
- [World Happiness Index](#world-happiness-index) (56 KB)
- [Wikipedia vector embeddings](#wikipedia-vector-embeddings) (2.8 GB)
- [Postgres air](#postgres_air-database) (?)
- [AWS DMS sample database](#amazon-dms-sample-database) (10 GB)

### Chinook database

Chinook digital media store database (11 tables, 2280 KB)

The Chinook database is a sample database for a digital media store, with tables for artists, albums, tracks, invoices, customers, and more.

Create a `chinook` database:

```sql
CREATE DATABASE chinook;
```

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/chinook.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/chinook" -f chinook.sql
```

Connect to the `chinook` database:

```bash
psql postgres://[user]:[password]@[hostname]/chinook
```

Find out the top 5 best-selling artists based on invoice total:

```sql

```

- Source: [https://github.com/lerocha/chinook-database](https://github.com/lerocha/chinook-database)
- License: [https://github.com/lerocha/chinook-database/blob/master/LICENSE.md](https://github.com/lerocha/chinook-database/blob/master/LICENSE.md)

### Employees database

Employees database (6 tables, 333 MB)

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
pg_restore -d postgres://[user]:[password]@[hostname]/employees -Fc employees.sql.gz -c -v --no-owner --no-privileges
```

Connect to the `employees` database:

```bash
psql postgres://[user]:[password]@[hostname]/employees
```

Find the top 5 departments with the highest average salary:

```sql
SELECT d.dept_name, AVG(s.salary) AS average_salary
FROM salaries s
JOIN dept_emp de ON s.emp_no = de.emp_no
JOIN departments d ON de.dept_no = d.dept_no
WHERE s.to_date > CURRENT_DATE AND de.to_date > CURRENT_DATE
GROUP BY d.dept_name
ORDER BY average_salary DESC
LIMIT 5;
```

- Source: The initial dataset was created by Fusheng Wang and Carlo Zaniolo from Siemens Corporate Research, and can be found in XML format at this location: [http://timecenter.cs.aau.dk/software.htm](http://timecenter.cs.aau.dk/software.htm). Designing the relational schema was undertaken by Giuseppe Maxia while Patrick Crews was responsible for transforming the data into a format compatible with MySQL. Their work can be accessed here: [https://github.com/datacharmer/test_db](https://github.com/datacharmer/test_db). Subsequently, this information was adapted to a format suitable for PostgreSQL: [https://github.com/h8/employees-database](https://github.com/h8/employees-database). The data was generated, and there are inconsistencies.
- License: This work is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported License. To view a copy of this license, visit [http://creativecommons.org/licenses/by-sa/3.0/](http://creativecommons.org/licenses/by-sa/3.0/) or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.

### Lego database

Lego database (8 tables, 42 MB)

Create a `lego` database:

```sql
CREATE DATABASE lego;
```

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/lego.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/lego" -f lego.sql
```

Connect to the `lego` database:

```bash
psql postgres://[user]:[password]@[hostname]/lego
```

- Source: [https://www.kaggle.com/datasets/rtatman/lego-database](https://www.kaggle.com/datasets/rtatman/lego-database)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Netflix data

Netflix shows (1 table, 11 MB)

Create a `netflix` database:

```sql
CREATE DATABASE netflix;
```

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/netflix.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/netflix" -f netflix_shows.sql
```

Connect to the `netflix` database:

```bash
psql postgres://[user]:[password]@[hostname]/netflix
```

- Source: [https://www.kaggle.com/datasets/shivamb/netflix-shows](https://www.kaggle.com/datasets/shivamb/netflix-shows)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Pagila database

Pagila database (33 tables, 7.1 MB)

Create a `pagila` database:

```sql
CREATE DATABASE pagila;
```

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/pagila.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/pagila" -f pagila.sql
```

Connect to the `pagila` database:

```bash
psql postgres://[user]:[password]@[hostname]/pagila
```

- Source: [https://github.com/devrimgunduz/pagila](https://github.com/devrimgunduz/pagila)
- License: [LICENSE.txt](https://github.com/devrimgunduz/pagila/blob/master/LICENSE.txt)

### Periodic table data

Periodic table of elements (1 table, 72 KB)

Create an `periodic_table` database:

```sql
CREATE DATABASE periodic_table;
```

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/periodic_table.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/periodic_table" -f periodic_table.sql
```

Connect to the `periodic_table` database:

```bash
psql postgres://[user]:[password]@[hostname]/periodic_table
```

Look up the most intriguing element:

```sql
SELECT * FROM periodic_table WHERE "AtomicNumber" = 10;
```

- Source: [https://github.com/andrejewski/periodic-table](https://github.com/andrejewski/periodic-table)
- License: [ISC License](https://github.com/andrejewski/periodic-table/blob/master/LICENSE)

### Titanic passenger data

Titanic passenger data (1 table, 408 KB)

Create a `titanic` database:

```sql
CREATE DATABASE titanic;
```

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/titanic.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/titanic" -f titanic.sql
```

Connect to the `titanic` database:

```bash
psql postgres://[user]:[password]@[hostname]/titanic
```

Query passengers with the most expensive fares:

```sql
SELECT name, fare
FROM passenger
ORDER BY fare DESC
LIMIT 10;
```

- Source: [https://www.kaggle.com/datasets/ibrahimelsayed182/titanic-dataset](https://www.kaggle.com/datasets/ibrahimelsayed182/titanic-dataset)
- License: [Unknown](https://www.kaggle.com/datasets/vinicius150987/titanic3)

### World Happiness Index

World Happiness Index (1 table, 56 KB)

Create a `world_happiness` database:

```sql
CREATE DATABASE world_happiness;
```

Download the source file:

```bash
wget https://raw.githubusercontent.com/danieltprice/postgres-sample-dbs/main/happiness_index.sql
```

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/happiness_index" -f happiness_index.sql
```

Connect to the `titanic` database:

```bash
psql postgres://[user]:[password]@[hostname]/world_happiness_index
```

Find the countries where the happiness score is above average but the GDP per capita is below average:

```sql
SELECT 
    country_or_region,
    score,
    gdp_per_capita
FROM 
    "2019"
WHERE 
    score > (SELECT AVG(score) FROM "2019") 
    AND 
    gdp_per_capita < (SELECT AVG(gdp_per_capita) FROM "2019")
ORDER BY 
    score DESC;
```

- Source: [https://www.kaggle.com/datasets/unsdsn/world-happiness](https://www.kaggle.com/datasets/unsdsn/world-happiness)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Wikipedia vector embeddings

Wikipedia vector embeddings (1 table, 2.8 GB)

This dataset provides pre-computed vector embeddings for 25000 Wikipedia articles. It is intended for use with the `pgvector` Postgres extension, which you need install first to create a table with vector type columns. For a Jupyter Notebook that uses this dataset with Neon, `pgvector`, and OpenAI, refer to the following GitHub repository: [neon-vector-search-openai-notebooks](https://github.com/neondatabase/neon-vector-search-openai-notebooks)

Download the zip file (~700MB):

```bash
wget https://cdn.openai.com/API/examples/data/vector_database_wikipedia_articles_embedded.zip
```

Navigate to the directory where you downloaded the zip file, and run the following command to extract the source file:

```bash
unzip vector_database_wikipedia_articles_embedded.zip
```

Create a `wikipedia` database:

```sql
CREATE DATABASE wikipedia;
```

Connect to the `wikipedia` database:

```bash
psql postgres://[user]:[password]@[hostname]/wikipedia
```

Install the `pgvector` extension:

```sql
CREATE EXTENSION vector;
```

Create the following table in your database:

```sql
CREATE TABLE IF NOT EXISTS public.articles (
    id INTEGER NOT NULL PRIMARY KEY,
    url TEXT,
    title TEXT,
    content TEXT,
    title_vector vector(1536),
    content_vector vector(1536),
    vector_id INTEGER
);
```

Navigate to the directory where you extracted the source file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/wikipedia" -c "\COPY public.articles (id, url, title, content, title_vector, content_vector, vector_id) FROM 'vector_database_wikipedia_articles_embedded.csv' WITH (FORMAT CSV, HEADER true, DELIMITER ',');"
```

Optionally, create vector search indexes using the following commands:

```sql
CREATE INDEX ON public.articles USING ivfflat (content_vector) WITH (lists = 1000);

CREATE INDEX ON public.articles USING ivfflat (title_vector) WITH (lists = 1000);
```

<Admonition type="note">
If you encounter a memory error related to the `maintenance_work_mem` setting, refer to [Indexing vectors](/docs/extensions/pgvector#indexing-vectors) for how to increase the `maintenance_work_mem` setting.
</Admonition>

- Source: [OpenAI](https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases)
- License: [MIT License](https://github.com/openai/openai-cookbook/blob/main/LICENSE)

### Postgres air database

`postgres_air` database (10 tables, 6.9 GB)

Create a `postgres_air` database:

```sql
CREATE DATABASE postgres_air;
```

Download the file (1.3 GB) from: [Google drive](https://drive.google.com/drive/folders/13F7M80Kf_somnjb-mTYAnh1hW1Y_g4kJ)

Navigate to the directory where you downloaded the source file, and run the following command:

```bash
pg_restore -d postgres://[user]:[password]@[hostname]/postgres_air -Fc postgres_air_2023.backup -c -v --no-owner --no-privileges
```

Connect to the `postgres_air` database:

```bash
psql postgres://[user]:[password]@[hostname]/wikipedia
```

Find the aircraft type with the most flights:

```sql
SELECT ac.model, COUNT(f.flight_id) AS number_of_flights
FROM postgres_air.aircraft ac
JOIN postgres_air.flight f ON ac.code = f.aircraft_code
GROUP BY ac.model
ORDER BY number_of_flights DESC
LIMIT 10;
```

- Source: [https://github.com/hettie-d/postgres_air](https://github.com/hettie-d/postgres_air)
- License: [BSD 3-Clause License](https://github.com/hettie-d/postgres_air/blob/main/LICENSE)
