---
title: 'Import CSV File Into PostgreSQL Table'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/import-csv-file-into-posgresql-table/
ogImage: ./img/wp-content-uploads-2015-05-posgresql-import-csv.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, we will show you various ways to import a CSV file into a PostgreSQL table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named `persons` with the following columns:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `id`: the person id
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `first_name`: first name
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `last_name:` last name
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `dob` date of birth
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `email`: the email address
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE persons (
  id SERIAL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  dob DATE,
  email VARCHAR(255),
  PRIMARY KEY (id)
);
```

<!-- /wp:code -->

<!-- wp:image {"id":977} -->

![posgresql import csv](./img/wp-content-uploads-2015-05-posgresql-import-csv.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

Second, prepare a CSV data file with the following format:

<!-- /wp:paragraph -->

<!-- wp:image {"id":978} -->

![csv data](./img/wp-content-uploads-2015-05-csv-data.jpg)

<!-- /wp:image -->

<!-- wp:image {"id":979} -->

![csv file](./img/wp-content-uploads-2015-05-csv-file.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

The path of the CSV file is as follows: `C:\sampledb\persons.csv`

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

[Download the persons.csv file](https://www.postgresqltutorial.com/wp-content/uploads/2020/07/persons.csv)

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Import a CSV file into a table using COPY statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To import this CSV file into the `persons` table, you use `COPY` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
COPY persons(first_name, last_name, dob, email)
FROM 'C:\sampledb\persons.csv'
DELIMITER ','
CSV HEADER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL gives back the following message:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
COPY 2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It means that two rows have been copied. Let's check the `persons` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM persons;
```

<!-- /wp:code -->

<!-- wp:image {"id":5343,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Import-CSV.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

It works as expected.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Let's dive into the COPY statement in more detail.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, you specify the table with column names after the `COPY` keyword. The order of the columns must be the same as the ones in the CSV file. In case the CSV file contains all columns of the table, you don't need to specify them explicitly, for example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
COPY sample_table_name
FROM 'C:\sampledb\sample_data.csv'
DELIMITER ','
CSV HEADER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, you put the CSV file path after the `FROM` keyword. Because CSV file format is used, you need to specify `DELIMITER` as well as `CSV` clauses.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, specify the `HEADER` keyword to indicate that the CSV file contains a header. When the `COPY` command imports data, it ignores the header of the file.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Notice that the file must be read directly by the PostgreSQL server, not by the client application. Therefore, it must be accessible by the PostgreSQL server machine. Also, you need to have superuser access to execute the `COPY` statement successfully.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Import CSV file into a table using pgAdmin

<!-- /wp:heading -->

<!-- wp:paragraph -->

In case you need to import a CSV file from your computer into a table on the PostgreSQL database server, you can use the pgAdmin.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement [truncates](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-truncate-table/) the `persons` table so that you can re-import the data.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
TRUNCATE TABLE persons
RESTART IDENTITY;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

First, right-click the `persons` table and select the **Import/Export...** menu item:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5344,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Import-CSV-pgAdmin-Step-1.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Second, (1) switch to import, (2) browse to the import file, (3) select the format as CSV, (4) select the delimiter as comma (`,`):

<!-- /wp:paragraph -->

<!-- wp:image {"id":5345,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Import-CSV-pgAdmin-Step-2.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Third, click the columns tab, uncheck the id column, and click the OK button:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5346,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Import-CSV-pgAdmin-Step-3.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Finally, wait for the import process to complete. The following shows the dialog that informs you of the progress of the import:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5347,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Import-CSV-pgAdmin-Step-4.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to import data from a CSV file into a table on the PostgreSQL database server using the `COPY` statement and pgAdmin tool.

<!-- /wp:paragraph -->
