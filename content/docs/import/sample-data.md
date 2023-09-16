---
title: Sample datasets
subtitle: Download sample datasets for learning, testing, and exploring Neon features
enableTableOfContents: true
---

This topic describes how to download sample datasets for learning, testing, and exploring Neon Serverless Postgres features. There are several datasets to choose from ranging in size and complexity.

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

Navigate to the directory where you cloned the repository or downloaded the dump file, and run the following command:

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

Navigate to the directory where you cloned the repository or downloaded the dump file, and run the following command:

```bash
pg_restore -d postgres://[user]:[password]@[hostname]/employees -Fc employees.sql.gz -c -v -no-owner --no-privileges
```

- Source: The initial dataset was created by Fusheng Wang and Carlo Zaniolo from Siemens Corporate Research, and can be found in XML format at this location: [http://timecenter.cs.aau.dk/software.htm](http://timecenter.cs.aau.dk/software.htm). Designing the relational schema was undertaken by Giuseppe Maxia while Patrick Crews was responsible for transforming the data into a format compatible with MySQL. Their work can be accessed here: [https://github.com/datacharmer/test_db](https://github.com/datacharmer/test_db). Subsequently, this information was adapted to a format suitable for PostgreSQL: [ttps://github.com/h8/employees-database](https://github.com/h8/employees-database). The data was generated, and there are inconsistencies.
- License: This work is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported License. To view a copy of this license, visit <http://creativecommons.org/licenses/by-sa/3.0/> or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.

### Lego database

Lego database (8 tables, 35 MB)

Navigate to the directory where you cloned the repository or downloaded the dump file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/lego" -f lego.sql
```

- Source: [https://www.kaggle.com/datasets/rtatman/lego-database](https://www.kaggle.com/datasets/rtatman/lego-database)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Netflix data

Netflix shows (1 table, 3832 KB)

Navigate to the directory where you cloned the repository or downloaded the dump file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/netflix" -f netflix_shows.sql
```

- Source: [https://www.kaggle.com/datasets/shivamb/netflix-shows](https://www.kaggle.com/datasets/shivamb/netflix-shows)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

### Pagila database

Pagila database (22 tables, 7856 KB)

Navigate to the directory where you cloned the repository or downloaded the dump file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/pagila" -f pagila.sql
```

- Source: [https://github.com/devrimgunduz/pagila](https://github.com/devrimgunduz/pagila)
- License: [LICENSE.txt](https://github.com/devrimgunduz/pagila/blob/master/LICENSE.txt)

### Periodic table data

Periodic table of elements (1 table, 72 KB)

Navigate to the directory where you cloned the repository or downloaded the dump file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/periodic_table" -f periodic_table.sql
```

- Source: [https://github.com/andrejewski/periodic-table](https://github.com/andrejewski/periodic-table)
- License: [ISC License](https://github.com/andrejewski/periodic-table/blob/master/LICENSE)

### Titanic passenger data

Titanic passenger data (1 table, 408 KB)

Navigate to the directory where you cloned the repository or downloaded the dump file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/titanic" -f titanic.sql
```

- Source: [https://www.kaggle.com/datasets/ibrahimelsayed182/titanic-dataset](https://www.kaggle.com/datasets/ibrahimelsayed182/titanic-dataset)
- License: [Unknown](https://www.kaggle.com/datasets/vinicius150987/titanic3)

### World Happiness Index

World Happiness Index (1 table, 56 KB)

Navigate to the directory where you cloned the repository or downloaded the dump file, and run the following command:

```bash
psql -d "postgres://[user]:[password]@[hostname]/happiness_index" -f happiness_index.sql
```

- Source: [https://www.kaggle.com/datasets/unsdsn/world-happiness](https://www.kaggle.com/datasets/unsdsn/world-happiness)
- License: [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)
