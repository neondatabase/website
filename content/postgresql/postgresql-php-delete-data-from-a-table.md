---
title: 'PostgreSQL PHP: Delete Data From a Table'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-php/delete/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: This tutorial shows you how to delete data from a PostgreSQL table using the PHP PDO.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Steps for deleting data in the PostgreSQL using PHP PDO

<!-- /wp:heading -->

<!-- wp:paragraph -->

To delete data from a PostgreSQL table in PHP, you use the following steps:

<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

1. <!-- wp:list-item -->
2. [Connect to the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-php/connect/) by creating an instance of the PDO class.
3. <!-- /wp:list-item -->
4.
5. <!-- wp:list-item -->
6. Prepare the [DELETE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/) statement for execution by calling the `prepare()` method of the PDO object. The `prepare()` method returns a `PDOStatement` object.
7. <!-- /wp:list-item -->
8.
9. <!-- wp:list-item -->
10. Bind values to the DELETE statement by calling the `bindValue()` method of the `PDOStatement` object.
11. <!-- /wp:list-item -->
12.
13. <!-- wp:list-item -->
14. Execute the `DELETE` statement by calling the `execute()` method.
15. <!-- /wp:list-item -->
16.
17. <!-- wp:list-item -->
18. Get the number of rows deleted using the `rowCount()` method.
19. <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Deleting data examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `stocks` table for the demonstration. If you have not created the `stocks` table yet, you can follow the [creating table tutorial](https://www.postgresqltutorial.com/postgresql-php/create-tables/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Let's create a new class named StockDB that contains all the methods for deleting data in a table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
<?php
namespace PostgreSQLTutorial;

/**
 * PostgreSQL PHP delete data demo
 */
class StockDB {

    /**
     * PDO object
     * @var \PDO
     */
    private $pdo;

    /**
     * Initialize the object with a specified PDO object
     * @param \PDO $pdo
     */
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    // other methods
    // ...
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following `delete()` method deletes a row specified by id from the `stocks` table

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
   /**
     * Delete a row in the stocks table specified by id
     * @param int $id
     * @return the number row deleted
     */
    public function delete($id) {
        $sql = 'DELETE FROM stocks WHERE id = :id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);

        $stmt->execute();

        return $stmt->rowCount();
    }
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following `deleteAll()` method deletes all rows from the `stocks` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
   /**
     * Delete all rows in the stocks table
     * @return int the number of rows deleted
     */
    public function deleteAll() {

        $stmt = $this->pdo->prepare('DELETE FROM stocks');
        $stmt->execute();
        return $stmt->rowCount();
    }
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Before running the methods, we query the data from the `stocks` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
stocks=# SELECT * FROM stocks
stocks-# ORDER BY id;
 id | symbol |        company
----+--------+-----------------------
  1 | MSFT   | Microsoft Corporation
  2 | GOOGL  | Alphabet Inc.
  3 | YHOO   | Yahoo! Inc.
  4 | FB     | Facebook, Inc.
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Use the following code in the index.php file to delete the row with id 1.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
<?php

require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\StockDB as StockDB;

try {
    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();
    //
    $stockDB = new StockDB($pdo);
    // delete a stock with a specified id
    $deletedRows = $stockDB->delete(1);
    echo 'The number of row(s) deleted: ' . $deletedRows . '<br>';

} catch (\PDOException $e) {
    echo $e->getMessage();
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following is the output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
The number of row(s) deleted: 1
```

<!-- /wp:code -->

<!-- wp:paragraph -->

We query data from the stocks table again to verify.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
stocks=# SELECT * FROM stocks
stocks-# ORDER BY id;
 id | symbol |    company
----+--------+----------------
  2 | GOOGL  | Alphabet Inc.
  3 | YHOO   | Yahoo! Inc.
  4 | FB     | Facebook, Inc.
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The row with id 1 was deleted as expected.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In the `index.php` file, modify the code to call the `deleteAll()` method instead of the `delete()` method and execute it. The following is the output of the script:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
The number of row(s) deleted: 3
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following shows the output when we query data from the `stocks` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
stocks=# SELECT * FROM stocks
stocks-# ORDER BY id;
 id | symbol | company
----+--------+---------
(0 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

All rows in the stocks table have been deleted as expected.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this tutorial, we have shown you how to delete data from a PostgreSQL table in the PHP application using PDO API.

<!-- /wp:paragraph -->
