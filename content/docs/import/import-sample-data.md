---
title: Postgres sample data
subtitle: 'Download sample data for learning, testing, and exploring Neon'
enableTableOfContents: true
updatedOn: '2024-08-22T02:18:02.655Z'
---

This guide describes how to download and install sample data for use with Neon.

## Prerequisites

- [wget](https://www.gnu.org/software/wget/) for downloading datasets, unless otherwise instructed. If your system does not support `wget`, you can paste the source file address in your browser's address bar.
- A `psql` client for connecting to your Neon database and loading data. This client is included with a standalone PostgreSQL installation. See [PostgreSQL Downloads](https://www.postgresql.org/download/).
- A `pg_restore` client if you are loading the [employees](#employees-database) or [postgres_air](#postgres-air-database) database. The `pg_restore` client is included with a standalone PostgreSQL installation. See [PostgreSQL Downloads](https://www.postgresql.org/download/).
- A Neon database connection string. After creating a database, you can obtain the connection string from the **Connection Details** widget on the Neon **Dashboard**. In the instructions that follow, replace `postgresql://[user]:[password]@[neon_hostname]/[dbname]` with your connection string.
- A Neon [Pro](/docs/introduction/pro-plan) account if you intend to install a dataset larger than 3 GB.
- Instructions for each dataset require that you create a database. You can do so from a client such as `psql` or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).

<Admonition type="note">
You can also load sample data using the Neon CLI. See [Load sample data with the Neon CLI](#load-sample-data-with-the-neon-cli).
</Admonition>

## Sample data

Sample datasets are listed in order of the smallest to largest installed size. Please be aware that the Neon Free Plan has a storage limit of 3 GB per branch. Datasets larger than 3 GB cannot be loaded on the Free Plan.

| Name                                                        | Tables | Records  | Source file size | Installed size |
| ----------------------------------------------------------- | ------ | -------- | ---------------- | -------------- |
| [Periodic table data](#periodic-table-data)                 | 1      | 118      | 17 KB            | 7.2 MB         |
| [World Happiness Index](#world-happiness-index)             | 1      | 156      | 9.4 KB           | 7.2 MB         |
| [Titanic passenger data](#titanic-passenger-data)           | 1      | 1309     | 220 KB           | 7.5 MB         |
| [Netflix data](#netflix-data)                               | 1      | 8807     | 3.2 MB           | 11 MB          |
| [Pagila database](#pagila-database)                         | 33     | 62322    | 3 MB             | 15 MB          |
| [Chinook database](#chinook-database)                       | 11     | 77929    | 1.8 MB           | 17 MB          |
| [Lego database](#lego-database)                             | 8      | 633250   | 13 MB            | 42 MB          |
| [Employees database](#employees-database)                   | 6      | 3919015  | 34 MB            | 333 MB         |
| [Wikipedia vector embeddings](#wikipedia-vector-embeddings) | 1      | 25000    | 1.7 GB           | 850 MB         |
| [Postgres air](#postgres-air-database)                      | 10     | 67228600 | 1.2 GB           | 6.7 GB         |

<Admonition type="note">
Installed size is measured using the query: `SELECT pg_size_pretty(pg_database_size('your_database_name'))`. The reported size for small datasets may appear larger than expected due to inherent Postgres storage overhead.
</Admonition>

### Periodic table data

A table containing data about the periodic table of elements.

1. Create a `periodic_table` database:

   ```sql
   CREATE DATABASE periodic_table;
   ```

2. Download the source file:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/periodic_table.sql
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash shouldWrap
   psql -d "postgresql://[user]:[password]@[neon_hostname]/periodic_table" -f periodic_table.sql
   ```

4. Connect to the `periodic_table` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/periodic_table
   ```

5. Look up the the element with the Atomic Number 10:

   ```sql
   SELECT * FROM periodic_table WHERE "AtomicNumber" = 10;
   ```

- Source: [https://github.com/andrejewski/periodic-table](https://github.com/andrejewski/periodic-table)
- License: [ISC License](https://github.com/andrejewski/periodic-table/blob/master/LICENSE)
- `Copyright (c) 2017, Chris Andrejewski <christopher.andrejewski@gmail.com>`

### World Happiness Index

A dataset with multiple indicators for evaluating the happiness of countries of the world.

1. Create a `world_happiness` database:

   ```sql
   CREATE DATABASE world_happiness;
   ```

2. Download the source file:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/happiness_index.sql
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash
   psql -d "postgresql://[user]:[password]@[neon_hostname]/happiness_index" -f happiness_index.sql
   ```

4. Connect to the `titanic` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/world_happiness_index
   ```

5. Find the countries where the happiness score is above average but the GDP per capita is below average:

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

### Titanic passenger data

A dataset containing information on the passengers aboard the RMS Titanic, which sank on its maiden voyage in 1912.

1. Create a `titanic` database:

   ```sql
   CREATE DATABASE titanic;
   ```

2. Download the source file:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/titanic.sql
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash shouldWrap
   psql -d "postgresql://[user]:[password]@[neon_hostname]/titanic" -f titanic.sql
   ```

4. Connect to the `titanic` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/titanic
   ```

5. Query passengers with the most expensive fares:

   ```sql
   SELECT name, fare
   FROM passenger
   ORDER BY fare DESC
   LIMIT 10;
   ```

- Source: [https://www.kaggle.com/datasets/ibrahimelsayed182/titanic-dataset](https://www.kaggle.com/datasets/ibrahimelsayed182/titanic-dataset)
- License: [Unknown](https://www.kaggle.com/datasets/vinicius150987/titanic3)

### Netflix data

A dataset containing information about movies and tv shows on Netflix.

1. Create a `netflix` database:

   ```sql
   CREATE DATABASE netflix;
   ```

2. Download the source file:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/netflix.sql
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash
   psql -d "postgresql://[user]:[password]@[neon_hostname]/netflix" -f netflix.sql
   ```

4. Connect to the `netflix` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/netflix
   ```

5. Find the directors with the most movies in the database:

   ```sql
   SELECT
       director,
       COUNT(*) AS "Number of Movies"
   FROM
       netflix_shows
   WHERE
       type = 'Movie'
   GROUP BY
       director
   ORDER BY
       "Number of Movies" DESC
   LIMIT 5;
   ```

- Source: [https://www.kaggle.com/datasets/shivamb/netflix-shows](https://www.kaggle.com/datasets/shivamb/netflix-shows)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Pagila database

Sample data for a fictional DVD rental store. Pagila includes tables for films, actors, film categories, stores, customers, payments, and more.

1. Create a `pagila` database:

   ```sql
   CREATE DATABASE pagila;
   ```

2. Download the source file:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/pagila.sql
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash
   psql -d "postgresql://[user]:[password]@[neon_hostname]/pagila" -f pagila.sql
   ```

4. Connect to the `pagila` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/pagila
   ```

5. Find the top 10 most popular film categories based on rental frequency:

   ```sql
   SELECT c.name AS category_name, COUNT(r.rental_id) AS rental_count
   FROM category c
   JOIN film_category fc ON c.category_id = fc.category_id
   JOIN inventory i ON fc.film_id = i.film_id
   JOIN rental r ON i.inventory_id = r.inventory_id
   GROUP BY c.name
   ORDER BY rental_count DESC
   LIMIT 10;
   ```

- Source: [https://github.com/devrimgunduz/pagila](https://github.com/devrimgunduz/pagila)
- License: [LICENSE.txt](https://github.com/devrimgunduz/pagila/blob/master/LICENSE.txt)
- `Copyright (c) Devrim Gündüz <devrim@gunduz.org>`

### Chinook database

A sample database for a digital media store, including tables for artists, albums, media tracks, invoices, customers, and more.

1. Create a `chinook` database:

   ```sql
   CREATE DATABASE chinook;
   ```

2. Download the source file:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/chinook.sql
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash shouldWrap
   psql -d "postgresql://[user]:[password]@[neon_hostname]/chinook" -f chinook.sql
   ```

4. Connect to the `chinook` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/chinook
   ```

5. Find out the most sold item by track title:

   ```sql
   SELECT
   T."Name" AS "Track Title",
   SUM(IL."Quantity") AS "Total Sold"
   FROM
       "Track" T
   JOIN
       "InvoiceLine" IL ON T."TrackId" = IL."TrackId"
   GROUP BY
       T."Name"
   ORDER BY
       "Total Sold" DESC
   LIMIT 1;
   ```

- Source: [https://github.com/lerocha/chinook-database](https://github.com/lerocha/chinook-database)
- License: [LICENSE.md](https://github.com/lerocha/chinook-database/blob/master/LICENSE.md)
- `Copyright (c) 2008-2017 Luis Rocha`

### Lego database

A dataset containing information about various LEGO sets, their themes, parts, colors, and other associated data.

1. Create a `lego` database:

   ```sql
   CREATE DATABASE lego;
   ```

2. Download the source file:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/lego.sql
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash
   psql -d "postgresql://[user]:[password]@[neon_hostname]/lego" -f lego.sql
   ```

4. Connect to the `lego` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/lego
   ```

5. Find the top 5 LEGO themes by the number of sets:

   ```sql
   SELECT lt.name AS theme_name, COUNT(ls.set_num) AS number_of_sets
   FROM lego_themes lt
   JOIN lego_sets ls ON lt.id = ls.theme_id
   GROUP BY lt.name
   ORDER BY number_of_sets DESC
   LIMIT 5;
   ```

- Source: [https://www.kaggle.com/datasets/rtatman/lego-database](https://www.kaggle.com/datasets/rtatman/lego-database)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Employees database

A dataset containing details about employees, their departments, salaries, and more.

1. Create the database and schema:

   ```sql
   CREATE DATABASE employees;
   \c employees
   CREATE SCHEMA employees;
   ```

2. Download the source file:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/employees.sql.gz
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash shouldWrap
   pg_restore -d postgresql://[user]:[password]@[neon_hostname]/employees -Fc employees.sql.gz -c -v --no-owner --no-privileges
   ```

   Database objects are created in the `employees` schema rather than the `public` schema.

4. Connect to the `employees` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/employees
   ```

5. Find the top 5 departments with the highest average salary:

   ```sql
   SELECT d.dept_name, AVG(s.amount) AS average_salary
   FROM employees.salary s
   JOIN employees.department_employee de ON s.employee_id = de.employee_id
   JOIN employees.department d ON de.department_id = d.id
   WHERE s.to_date > CURRENT_DATE AND de.to_date > CURRENT_DATE
   GROUP BY d.dept_name
   ORDER BY average_salary DESC
   LIMIT 5;
   ```

- Source: The initial dataset was created by Fusheng Wang and Carlo Zaniolo from Siemens Corporate Research. Designing the relational schema was undertaken by Giuseppe Maxia while Patrick Crews was responsible for transforming the data into a format compatible with MySQL. Their work can be accessed here: [https://github.com/datacharmer/test_db](https://github.com/datacharmer/test_db). Subsequently, this information was adapted to a format suitable for PostgreSQL: [https://github.com/h8/employees-database](https://github.com/h8/employees-database). The data was generated, and there are inconsistencies.
- License: This work is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported License. To view a copy of this license, visit [http://creativecommons.org/licenses/by-sa/3.0/](http://creativecommons.org/licenses/by-sa/3.0/) or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.

### Wikipedia vector embeddings

An OpenAI example dataset containing pre-computed vector embeddings for 25000 Wikipedia articles. It is intended for use with the `pgvector` Postgres extension, which you must install first to create a table with `vector` type columns. For a Jupyter Notebook that uses this dataset with Neon, refer to the following GitHub repository: [neon-vector-search-openai-notebooks](https://github.com/neondatabase/neon-vector-search-openai-notebooks)

1. Download the zip file (~700MB):

   ```bash shouldWrap
   wget https://cdn.openai.com/API/examples/data/vector_database_wikipedia_articles_embedded.zip
   ```

2. Navigate to the directory where you downloaded the zip file, and run the following command to extract the source file:

   ```bash
   unzip vector_database_wikipedia_articles_embedded.zip
   ```

3. Create a `wikipedia` database:

   ```sql
   CREATE DATABASE wikipedia;
   ```

4. Connect to the `wikipedia` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/wikipedia
   ```

5. Install the `pgvector` extension:

   ```sql
   CREATE EXTENSION vector;
   ```

6. Create the following table in your database:

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

7. Create vector search indexes:

   ```sql shouldWrap
   CREATE INDEX ON public.articles USING ivfflat (content_vector) WITH (lists = 1000);

   CREATE INDEX ON public.articles USING ivfflat (title_vector) WITH (lists = 1000);
   ```

8. Navigate to the directory where you extracted the source file, and run the following command:

   ```bash shouldWrap
   psql -d "postgresql://[user]:[password]@[neon_hostname]/wikipedia" -c "\COPY public.articles (id, url, title, content, title_vector, content_vector, vector_id) FROM 'vector_database_wikipedia_articles_embedded.csv' WITH (FORMAT CSV, HEADER true, DELIMITER ',');"
   ```

<Admonition type="note">
If you encounter a memory error related to the `maintenance_work_mem` setting, refer to [Indexing vectors](/docs/extensions/pgvector#indexing-vectors) for how to increase this setting.
</Admonition>

- Source: [OpenAI](https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases)
- License: [MIT License](https://github.com/openai/openai-cookbook/blob/main/LICENSE)

### Postgres air database

An airport database containing information about airports, aircraft, bookings, passengers, and more.

1. Download the file (1.3 GB) from [Google drive](https://drive.google.com/drive/folders/13F7M80Kf_somnjb-mTYAnh1hW1Y_g4kJ)

2. Create a `postgres_air` database:

   ```sql
   CREATE DATABASE postgres_air;
   ```

3. Navigate to the directory where you downloaded the source file, and run the following command:

   ```bash shouldWrap
   pg_restore -d postgresql://[user]:[password]@[neon_hostname]/postgres_air -Fc postgres_air_2023.backup -c -v --no-owner --no-privileges
   ```

   Database objects are created in a `postgres_air` schema rather than the `public` schema.

4. Connect to the `postgres_air` database:

   ```bash
   psql postgresql://[user]:[password]@[neon_hostname]/wikipedia
   ```

5. Find the aircraft type with the most flights:

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
- `Copyright (c) 2020, hettie-d All rights reserved.`

## Load sample data with the Neon CLI

You can load data with the Neon CLI by passing the `--psql` option, which calls the `psql` command line utility.

The Neon CLI and `psql` must be installed on your system. For installation instructions, see:

- [Neon CLI — Install and connect](/docs/reference/cli-install)
- [PostgreSQL Downloads](https://www.postgresql.org/download/) for `psql`

If you have multiple Neon projects or branches, we recommend setting your Neon CLI project and branch context so that you don't have to specify them explicitly when running a Neon CLI command. See [Neon CLI commands — set-context](/docs/reference/cli-set-context).

To load sample data:

1. Download one of the data files listed above. For example:

   ```bash shouldWrap
   wget https://raw.githubusercontent.com/neondatabase/postgres-sample-dbs/main/periodic_table.sql
   ```

   Alternatively, supply your own data file.

2. Load the data using one of the following Neon CLI commands ([projects](/docs/reference/cli-projects), [branches](/docs/reference/cli-branches), or [connection-string](/docs/reference/cli-connection-string)):

   - Create a new Neon project, connect to it with `psql`, and run the `.sql` file.

     ```bash
     neon projects create --psql -- -f periodic_table.sql
     ```

   - Create a branch, connect to it with `psql`, and run the an `.sql` file.

     ```bash
     neon branches create --psql -- -f periodic_table.sql
     ```

   - Get a connection string, connect with `psql`, and run the `.sql` file.

     ```bash
     neon connection-string --psql -- -f periodic_table.sql
     ```

<NeedHelp/>
