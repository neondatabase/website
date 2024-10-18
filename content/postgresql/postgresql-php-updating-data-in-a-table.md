---
title: 'PostgreSQL PHP: Updating Data In a Table'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-php/update/
ogImage: ./img/wp-content-uploads-2016-06-PostgreSQL-PHP-Update.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn to update data in a PostgreSQL database table using PHP PDO.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Steps for updating data in a database table from a PHP application

<!-- /wp:heading -->

<!-- wp:paragraph -->

To update data in a table, you use these steps:

<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

1. [Connect to the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-php/connect/) by creating an instance of the PDO class.
2. Call the `prepare()` method of the PDO object to prepare the [UPDATE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) statement for execution. The `prepare()` method returns a `PDOStatement` object.
3. Pass the values to the `UPDATE` statement by calling the `bindValue()` method of the `PDOStatement` object.
4. Execute the `UPDATE` statement by calling the `execute()` method of the `PDOStatement` object.
5. Get the number of rows updated using the `rowCount()` method of the `PDOStatement` object.

<!-- /wp:list -->

<!-- wp:heading -->

## Updating data example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `stocks` table that we created in the [creating table tutorial](https://www.postgresqltutorial.com/postgresql-php/create-tables/) for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `updateStock()` method of the `PostgreSQLPHPUpdate` class updates the data in the `stocks` table based on a specified id.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
<?php

namespace PostgreSQLTutorial;

/**
 * PostgreSQL PHP Update Demo
 */
class PostgreSQLPHPUpdate {

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

    /**
     * Update stock based on the specified id
     * @param int $id
     * @param string $symbol
     * @param string $company
     * @return int
     */
    public function updateStock($id, $symbol, $company) {

        // sql statement to update a row in the stock table
        $sql = 'UPDATE stocks '
                . 'SET company = :company, '
                . 'symbol = :symbol '
                . 'WHERE id = :id';

        $stmt = $this->pdo->prepare($sql);

        // bind values to the statement
        $stmt->bindValue(':symbol', $symbol);
        $stmt->bindValue(':company', $company);
        $stmt->bindValue(':id', $id);
        // update data in the database
        $stmt->execute();

        // return the number of row affected
        return $stmt->rowCount();
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

We use the `PostgreSQLPHPUpdate` class in the `index.php` file as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
<?php

require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\PostgreSQLPHPUpdate as PostgreSQLPHPUpdate;

try {
    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();

    //
    $updateDemo = new PostgreSQLPHPUpdate($pdo);

    // insert a stock into the stocks table
    $affectedRows = $updateDemo->updateStock(2, 'GOOGL', 'Alphabet Inc.');

    echo 'Number of row affected ' . $affectedRows;
} catch (\PDOException $e) {
    echo $e->getMessage();
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the index.php script, we connected to the PostgreSQL database and called the `updateStock()` method of the `PostgreSQLPHPUpdate` class to update the company name of the stock id 2 from `Google Inc.` to `Alphabet Inc.`

<!-- /wp:paragraph -->

<!-- wp:image {"id":2012} -->

![PostgreSQL PHP Update](./img/wp-content-uploads-2016-06-PostgreSQL-PHP-Update.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Before running the script, we query data from the stocks table to see its current data.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    id, symbol, company
FROM
    stocks;
```

<!-- /wp:code -->

<!-- wp:code -->

```
 id | symbol |        company
----+--------+-----------------------
  1 | MSFT   | Microsoft Corporation
  2 | GOOG   | Google Inc.
  3 | YHOO   | Yahoo! Inc.
  4 | FB     | Facebook, Inc.
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Launch the `index.php` file in a web browser; we get the following output.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
Number of row affected 1
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Let's recheck the stocks table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

The company name of stock with id 2 has been updated to the new one.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to update data in a PostgreSQL table using the prepared statement in PHP PDO.

<!-- /wp:paragraph -->
