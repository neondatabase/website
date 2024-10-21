---
prevPost: postgresql-transaction
nextPost: export-postgresql-table-to-csv-file
createdAt: 2015-05-23T08:15:18.000Z
title: 'Import CSV File Into PostgreSQL Table'
redirectFrom: 
            - /postgresql/postgresql-tutorial/import-csv-file-into-posgresql-table
            - /postgresql/import-csv-file-into-posgresql-table
ogImage: /postgresqltutorial_data/wp-content-uploads-2015-05-posgresql-import-csv.jpg
tableOfContents: true
---


**Summary**: in this tutorial, we will show you various ways to import a CSV file into a PostgreSQL table.

First, [create a new table](/postgresql/postgresql-create-table) named `persons` with the following columns:

- `id`: the person id
-
- `first_name`: first name
-
- `last_name:` last name
-
- `dob` date of birth
-
- `email`: the email address

```sql
CREATE TABLE persons (
  id SERIAL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  dob DATE,
  email VARCHAR(255),
  PRIMARY KEY (id)
);
```

![posgresql import csv](/postgresqltutorial_data/wp-content-uploads-2015-05-posgresql-import-csv.jpg)

Second, prepare a CSV data file with the following format:

![csv data](/postgresqltutorial_data/wp-content-uploads-2015-05-csv-data.jpg)

![csv file](/postgresqltutorial_data/wp-content-uploads-2015-05-csv-file.jpg)

The path of the CSV file is as follows: `C:\sampledb\persons.csv`

[Download the persons.csv file](/postgresqltutorial_data/persons.csv)

## Import a CSV file into a table using COPY statement

To import this CSV file into the `persons` table, you use `COPY` statement as follows:

```sql
COPY persons(first_name, last_name, dob, email)
FROM 'C:\sampledb\persons.csv'
DELIMITER ','
CSV HEADER;
```

PostgreSQL gives back the following message:

```sql
COPY 2
```

It means that two rows have been copied. Let's check the `persons` table.

```sql
SELECT * FROM persons;
```

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Import-CSV.png)

It works as expected.

Let's dive into the COPY statement in more detail.

First, you specify the table with column names after the `COPY` keyword. The order of the columns must be the same as the ones in the CSV file. In case the CSV file contains all columns of the table, you don't need to specify them explicitly, for example:

```sql
COPY sample_table_name
FROM 'C:\sampledb\sample_data.csv'
DELIMITER ','
CSV HEADER;
```

Second, you put the CSV file path after the `FROM` keyword. Because CSV file format is used, you need to specify `DELIMITER` as well as `CSV` clauses.

Third, specify the `HEADER` keyword to indicate that the CSV file contains a header. When the `COPY` command imports data, it ignores the header of the file.

Notice that the file must be read directly by the PostgreSQL server, not by the client application. Therefore, it must be accessible by the PostgreSQL server machine. Also, you need to have superuser access to execute the `COPY` statement successfully.

## Import CSV file into a table using pgAdmin

In case you need to import a CSV file from your computer into a table on the PostgreSQL database server, you can use the pgAdmin.

The following statement [truncates](/postgresql/postgresql-truncate-table) the `persons` table so that you can re-import the data.

```sql
TRUNCATE TABLE persons
RESTART IDENTITY;
```

First, right-click the `persons` table and select the **Import/Export...** menu item:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Import-CSV-pgAdmin-Step-1.png)

Second, (1) switch to import, (2) browse to the import file, (3) select the format as CSV, (4) select the delimiter as comma (`,`):

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Import-CSV-pgAdmin-Step-2.png)

Third, click the columns tab, uncheck the id column, and click the OK button:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Import-CSV-pgAdmin-Step-3.png)

Finally, wait for the import process to complete. The following shows the dialog that informs you of the progress of the import:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Import-CSV-pgAdmin-Step-4.png)

In this tutorial, you have learned how to import data from a CSV file into a table on the PostgreSQL database server using the `COPY` statement and pgAdmin tool.
