---
title: "PostgreSQL vs. MySQL"
page_title: "PostgreSQL vs. MySQL: A Comprehensive Comparison"
page_description: "If you want to explore the differences between PostgreSQL and MySQL, this PostgreSQL vs. MySQL page is an excellent start."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-vs-mysql/"
ogImage: "/postgresqltutorial/postgresql-vs-mysql-features.jpg"
updatedOn: "2024-03-15T14:32:40+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL DISTINCT ON"
  slug: "postgresql-tutorial/postgresql-distinct-on"
nextLink: 
  title: "PostgreSQL generate_series() Function"
  slug: "postgresql-tutorial/postgresql-generate_series"
---




The choice between PostgreSQL and MySQL is crucial when selecting an open\-source relational database management system.

Both PostgreSQL and MySQL are time\-proven solutions that are capable of competing with enterprise solutions alternatives like Oracle Database and SQL Server.

MySQL has been famous for its ease of use and speed, whereas PostgreSQL boasts many advanced features, earning it the reputation of an open\-source counterpart to Oracle Database.

The following table compares the features of PostgreSQL 16\.x vs. MySQL 8\.x:

![PostgreSQL vs. MySQL](/postgresqltutorial/postgresql-vs-mysql-features.jpg)

| Feature | PostgreSQL | MySQL |
| --- | --- | --- |
| Known as | PostgreSQL is an open\-source **project**. | The world’s most **advanced** open\-source database. |
| Development | PostgreSQL is an open\-source **project**. | MySQL is an open\-source **product**. |
| Pronunciation | post gress queue ell | my ess queue ell |
| Licensing | MIT\-style license | GNU General Public License |
| Implementation programming language | C | C/C\+\+ |
| GUI tool | pgAdmin | MySQL Workbench |
| ACID | Yes | Yes |
| Storage engine | **Single** storage engine | **Multiple** [storage engines](http://www.mysqltutorial.org/understand-mysql-table-types-innodb-myisam.aspx) e.g., InnoDB and MyISAM |
| Full\-text search | Yes | Yes (Limited) |
| Drop a [temporary table](postgresql-temporary-table) | No `TEMP` or `TEMPORARY` keyword in `DROP TABLE` statement | Support the `TEMP` or `TEMPORARY` keyword in the `DROP TABLE` statement that allows you to remove the temporary table only. |
| [`DROP TABLE`](postgresql-drop-table) | Support `CASCADE` option to drop table’s dependent objects e.g., tables and views. | Does not support `CASCADE` option. |
| [`TRUNCATE TABLE`](postgresql-truncate-table) | PostgreSQL `TRUNCATE TABLE` supports more features like `CASCADE`, `RESTART IDENTITY`, `CONTINUE IDENTITY`, transaction\-safe, etc. | [MySQL `TRUNCATE TABLE`](http://www.mysqltutorial.org/mysql-truncate-table/) does not support `CASCADE` and transaction safe i.e., once data is deleted, it cannot be rolled back. |
| Auto increment Column | [`SERIAL`](postgresql-serial) | [`AUTO_INCREMENT`](http://www.mysqltutorial.org/mysql-sequence/) |
| [Identity Column](postgresql-identity-column) | Yes | No |
| [Window functions](../postgresql-window-function) | Yes | Yes |
| [Data types](postgresql-data-types) | Support SQL\-standard types as well as user\-defined types | SQL\-standard types |
| Unsigned [integer](postgresql-integer) | No | Yes |
| [Boolean type](postgresql-boolean) | Yes | Use `TINYINT(1)` internally for [Boolean](http://www.mysqltutorial.org/mysql-boolean/) |
| IP address data type | Yes | No |
| Set a [default value](postgresql-default-value) for a column | Support both constant and function call | Must be a constant or `CURRENT_TIMESTAMP` for `TIMESTAMP` or `DATETIME` columns |
| [CTE](postgresql-cte) | Yes | Yes (Supported [CTE](https://www.mysqltutorial.org/mysql-basics/mysql-cte/) since MySQL 8\.0\) |
| `EXPLAIN` output | More detailed | Less detailed |
| [Materialized views](../postgresql-views/postgresql-materialized-views) | Yes | No |
| [CHECK constraint](postgresql-check-constraint) | Yes | Yes (Supported since MySQL 8\.0\.16, Before that MySQL just ignored the [CHECK constraint](https://www.mysqltutorial.org/mysql-basics/mysql-check-constraint/)) |
| Table inheritance | Yes | No |
| Programming languages for [stored procedures](https://neon.tech/postgresql/postgresql-stored-procedures/) | Ruby, Perl, Python, TCL, PL/pgSQL, SQL, JavaScript, etc. | SQL:2003 syntax for [stored procedures](http://www.mysqltutorial.org/mysql-stored-procedure-tutorial.aspx) |
| [`FULL OUTER JOIN`](postgresql-full-outer-join) | Yes | No |
| [`INTERSECT`](postgresql-intersect) | Yes | Yes ([`INTERSECT`](https://www.mysqltutorial.org/mysql-basics/mysql-intersect/) in MySQL 8\.0\.31\) |
| [`EXCEPT`](https://neon.tech/postgresql/postgresql-tutorial/postgresql-tutorial/postgresql-except/) | Yes | Yes |
| Partial indexes | Yes | No |
| Bitmap indexes | Yes | No |
| Expression indexes | Yes | Yes ([functional index](https://www.mysqltutorial.org/mysql-index/mysql-functional-index/) in MySQL 8\.0\.13\) |
| Covering indexes | Yes (since version 9\.2\) | Yes. MySQL supports covering indexes that allow data to be retrieved by scanning the index alone without touching the table data. This is advantageous in the case of large tables with millions of rows. |
| [Triggers](../postgresql-triggers) | Support triggers that can fire on most types of command, except for ones affecting the database globally e.g., roles and tablespaces. | Limited to some commands |
| Partitioning | RANGE, LIST | RANGE, LIST, HASH, KEY, and composite partitioning using a combination of RANGE or LIST with HASH or KEY subpartitions |
| Task Scheduler | pgAgent | [Scheduled event](http://www.mysqltutorial.org/mysql-triggers/working-mysql-scheduled-event/) |
| Connection Scalability | Each new connection is an OS process | Each new connection is an OS thread |

