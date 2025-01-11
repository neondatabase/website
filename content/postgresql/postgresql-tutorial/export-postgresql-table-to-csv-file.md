---
title: 'Export PostgreSQL Table to CSV File'
page_title: 'Export a PostgreSQL Table to a CSV File'
page_description: 'In this tutorial, you will learn various techniques to export data from PostgreSQL tables to CSV files.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/export-postgresql-table-to-csv-file/'
ogImage: '/postgresqltutorial/posgresql-import-csv.jpg'
updatedOn: '2024-02-01T14:54:49+00:00'
enableTableOfContents: true
previousLink:
  title: 'Import CSV File Into PostgreSQL Table'
  slug: 'postgresql-tutorial/import-csv-file-into-posgresql-table'
nextLink:
  title: 'Subquery'
  slug: 'postgresql-tutorial/postgresql-subquery'
---

**Summary**: in this tutorial, you will learn various techniques to export data from PostgreSQL tables to CSV files.

In the previous tutorial, we showed you how to [import data from a CSV file into a table](import-csv-file-into-posgresql-table). We will use the same `persons` table for importing data from a CSV file.

![posgresql export csv](/postgresqltutorial/posgresql-import-csv.jpg)
The following statement retrieves the data from the `persons` table.

```sql
SELECT * FROM persons;
```

Output:

```text
 id | first_name | last_name |    dob     |              email
----+------------+-----------+------------+---------------------------------
  1 | John       | Doe       | 1995-01-05 | [[email protected]](../cdn-cgi/l/email-protection.html)
  2 | Jane       | Doe       | 1995-02-05 | [[email protected]](../cdn-cgi/l/email-protection.html)
(2 rows)
```

## Export data from a table to CSV using the COPY statement

The `COPY` statement allows you to export data from a table to a CSV file.

For example, if you want to export the data of the `persons` table to a CSV file named `persons_db.csv` in the `C:\temp` folder, you can use the following statement:

```
COPY persons TO 'C:\temp\persons_db.csv' DELIMITER ',' CSV HEADER;
```

Output:

```sql
COPY 2
```

The output indicates that the command exported two rows.

In this example, the COPY statement exports all data from all columns of the `persons` table to the `persons_db.csv` file.

![postgresql export csv](/postgresqltutorial/postgresql-export-csv.jpg)Sometimes, you may want to export data from some columns of a table to a CSV file. To achieve this, you can specify the column names together with the table name after `COPY` keyword.

For example, the following statement exports data from the `first_name`, `last_name`, and `email`  columns of the `persons` table to `person_partial_db.csv`

```
COPY persons(first_name,last_name,email)
TO 'C:\temp\persons_partial_db.csv' DELIMITER ',' CSV HEADER;
```

![postgresql export csv partially](/postgresqltutorial/postgresql-export-csv-partially.jpg)
If you don’t want to export the header, which contains the column names of the table, you can remove the `HEADER` flag in the `COPY` statement.

For example, the following statement exports only data from the `email` column of the `persons` table to a CSV file:

```sql
COPY persons(email)
TO 'C:\temp\persons_email_db.csv' DELIMITER ',' CSV;
```

![postgresql export csv partially without header](/postgresqltutorial/postgresql-export-csv-partially-without-header.jpg)
Notice that the CSV file name that you specify in the `COPY` command must be written directly by the server.

It means that the CSV file must reside on the database server machine, not your local machine. The CSV file also needs to be writable by the user that the PostgreSQL server runs as.

## Export data from a table to a CSV file using the \\copy command

If you have access to a remote PostgreSQL database server, but you don’t have sufficient privileges to write to a file on it, you can use the PostgreSQL built\-in command `\copy`.

The `\copy` command runs the `COPY` statement behind the scenes. However, instead of the server writing the CSV file, psql writes the CSV file and transfers data from the server to your local file system.

To use `\copy` command, you need to have sufficient privileges to your local machine. It does not require PostgreSQL superuser privileges.

For example, if you want to export all data from the `persons` table into `persons_client.csv` file, you can execute the `\copy` command from the psql client as follows:

```text
\copy (SELECT * FROM persons) to 'C:\temp\persons_client.csv' with csv
```

In this tutorial, we have shown you how to use `COPY` statement and `\copy` command to export data from a table to CSV files.
