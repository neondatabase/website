---
title: 'PostgreSQL PHP: Create New Tables'
redirectFrom: 
            - /docs/postgresql/postgresql-php/create-tables
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-PHP-Create-Tables.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to create new tables in the PostgreSQL database using PHP PDO API.

## Creating new tables using PHP PDO steps

To create new tables in a PostgreSQL database using PHP PDO, you follow these steps:

1. First, [connect to the database](/docs/postgresql/postgresql-php/connect) by creating a new PDO object.
2. Second, call the `exec()` method of the PDO object to execute the [CREATE TABLE](/docs/postgresql/postgresql-create-table) statement.

Let's look at an example of creating new tables.

## Creating new table example

In the previous tutorial, we created the `stocks` database in the PostgreSQL database server.

For the demonstration, we'll create two new tables in the `stocks` database: `stocks` and `stock_evaluations` with the following structures:

```sql
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol CHARACTER VARYING(10) NOT NULL UNIQUE,
    company CHARACTER VARYING(255) NOT NULL UNIQUE
);
```

```sql
CREATE TABLE IF NOT EXISTS stock_valuations (
    stock_id INTEGER NOT NULL,
    value_on DATE NOT NULL,
    price NUMERIC(8 , 2 ) NOT NULL DEFAULT 0,
    PRIMARY KEY (stock_id , value_on),
    FOREIGN KEY (stock_id)
        REFERENCES stocks (id)
);
```

We create a new class named `PostgreSQLCreateTable` in the `app` folder.

```
<?php

namespace PostgreSQLTutorial;
/**
 * Create table in PostgreSQL from PHP demo
 */
class PostgreSQLCreateTable {

    /**
     * PDO object
     * @var \PDO
     */
    private $pdo;

    /**
     * init the object with a \PDO object
     * @param type $pdo
     */
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * create tables
     */
    public function createTables() {
        $sqlList = ['CREATE TABLE IF NOT EXISTS stocks (
                        id serial PRIMARY KEY,
                        symbol character varying(10) NOT NULL UNIQUE,
                        company character varying(255) NOT NULL UNIQUE
                     );',
            'CREATE TABLE IF NOT EXISTS stock_valuations (
                        stock_id INTEGER NOT NULL,
                        value_on date NOT NULL,
                        price numeric(8,2) NOT NULL DEFAULT 0,
                        PRIMARY KEY (stock_id, value_on),
                        FOREIGN KEY (stock_id) REFERENCES stocks(id)
                    );'];

        // execute each sql statement to create new tables
        foreach ($sqlList as $sql) {
            $this->pdo->exec($sql);
        }

        return $this;
    }

    /**
     * return tables in the database
     */
    public function getTables() {
        $stmt = $this->pdo->query("SELECT table_name
                                   FROM information_schema.tables
                                   WHERE table_schema= 'public'
                                        AND table_type='BASE TABLE'
                                   ORDER BY table_name");
        $tableList = [];
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $tableList[] = $row['table_name'];
        }

        return $tableList;
    }
}
```

How it works.

- First, the constructor of the class accepts a PDO object as the argument.
- Second, the `createTables()` method creates new tables in the database. The `$sqlList` array holds all the [CREATE TABLE](/docs/postgresql/postgresql-create-table) statements. To execute a statement, you call the `exec()` method of the PDO object. We iterate over the array of SQL statements and execute them one by one by calling the `exec()` method.
- Third, the `getTables()` method returns all tables in the connected database. We use it to query the tables in the `stocks` database after calling the `createTables()` method.

![PostgreSQL PHP Create Tables](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-PHP-Create-Tables.png)

In the `index.php` file, connect to the PostgreSQL database execute the statement to create tables and query tables.

```
<?php

require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\PostgreSQLCreateTable as PostgreSQLCreateTable;

try {

    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();

    //
    $tableCreator = new PostgreSQLCreateTable($pdo);

    // create tables and query the table from the
    // database
    $tables = $tableCreator->createTables()
                            ->getTables();

    foreach ($tables as $table){
        echo $table . '<br>';
    }

} catch (\PDOException $e) {
    echo $e->getMessage();
}
```

Launch the `index.php` file in a web browser. You'll see the following output:

```
stock_valuations
stocks
```

The output shows that the script has created two tables successfully.

## Summary

- Use the `CREATE TABLE` statement to create a new table.
- Use the PDO `exec()` method to to execute a `CREATE TABLE` statement to create a new table in the datatabase.
