---
title: 'Export PostgreSQL Table to CSV File'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/export-postgresql-table-to-csv-file/
ogImage: ./img/wp-content-uploads-2015-05-posgresql-import-csv.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn various techniques to export data from PostgreSQL tables to CSV files.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In the previous tutorial, we showed you how to [import data from a CSV file into a table](https://www.postgresqltutorial.com/postgresql-tutorial/import-csv-file-into-posgresql-table/). We will use the same `persons` table for importing data from a CSV file.

<!-- /wp:paragraph -->

<!-- wp:image {"id":977} -->

![posgresql export csv](./img/wp-content-uploads-2015-05-posgresql-import-csv.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement retrieves the data from the `persons` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM persons;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id | first_name | last_name |    dob     |              email
----+------------+-----------+------------+---------------------------------
  1 | John       | Doe       | 1995-01-05 | john.doe@postgresqltutorial.com
  2 | Jane       | Doe       | 1995-02-05 | jane.doe@postgresqltutorial.com
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Export data from a table to CSV using the COPY statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `COPY` statement allows you to export data from a table to a CSV file.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, if you want to export the data of the `persons` table to a CSV file named `persons_db.csv` in the `C:\temp` folder, you can use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
COPY persons TO 'C:\temp\persons_db.csv' DELIMITER ',' CSV HEADER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
COPY 2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the command exported two rows.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this example, the COPY statement exports all data from all columns of the `persons` table to the `persons_db.csv` file.

<!-- /wp:paragraph -->

<!-- wp:image {"id":1000} -->

![postgresql export csv](./img/wp-content-uploads-2015-05-postgresql-export-csv.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

Sometimes, you may want to export data from some columns of a table to a CSV file. To achieve this, you can specify the column names together with the table name after `COPY` keyword.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement exports data from the `first_name`, `last_name`, and `email` columns of the `persons` table to `person_partial_db.csv`

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
COPY persons(first_name,last_name,email)
TO 'C:\temp\persons_partial_db.csv' DELIMITER ',' CSV HEADER;
```

<!-- /wp:code -->

<!-- wp:image {"id":1001} -->

![postgresql export csv partially](./img/wp-content-uploads-2015-05-postgresql-export-csv-partially.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

If you don't want to export the header, which contains the column names of the table, you can remove the `HEADER` flag in the `COPY` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement exports only data from the `email` column of the `persons` table to a CSV file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
COPY persons(email)
TO 'C:\temp\persons_email_db.csv' DELIMITER ',' CSV;
```

<!-- /wp:code -->

<!-- wp:image {"id":1002} -->

![postgresql export csv partially without header](./img/wp-content-uploads-2015-05-postgresql-export-csv-partially-without-header.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

Notice that the CSV file name that you specify in the `COPY` command must be written directly by the server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

It means that the CSV file must reside on the database server machine, not your local machine. The CSV file also needs to be writable by the user that the PostgreSQL server runs as.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Export data from a table to a CSV file using the \\copy command

<!-- /wp:heading -->

<!-- wp:paragraph -->

If you have access to a remote PostgreSQL database server, but you don't have sufficient privileges to write to a file on it, you can use the PostgreSQL built-in command `\copy`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `\copy` command runs the `COPY` statement behind the scenes. However, instead of the server writing the CSV file, psql writes the CSV file and transfers data from the server to your local file system.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To use `\copy` command, you need to have sufficient privileges to your local machine. It does not require PostgreSQL superuser privileges.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, if you want to export all data from the `persons` table into `persons_client.csv` file, you can execute the `\copy` command from the psql client as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
\copy (SELECT * FROM persons) to 'C:\temp\persons_client.csv' with csv
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, we have shown you how to use `COPY` statement and `\copy` command to export data from a table to CSV files.

<!-- /wp:paragraph -->
