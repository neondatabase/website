---
title: 'PostgreSQL PHP: Updating Data In a Table'
redirectFrom: 
            - /docs/postgresql/postgresql-php/update/
ogImage: ./img/wp-content-uploads-2016-06-PostgreSQL-PHP-Update.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn to update data in a PostgreSQL database table using PHP PDO.





## Steps for updating data in a database table from a PHP application





To update data in a table, you use these steps:





1. [Connect to the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-php/connect/) by creating an instance of the PDO class.
2. Call the `prepare()` method of the PDO object to prepare the [UPDATE](/docs/postgresql/postgresql-update) statement for execution. The `prepare()` method returns a `PDOStatement` object.
3. Pass the values to the `UPDATE` statement by calling the `bindValue()` method of the `PDOStatement` object.
4. Execute the `UPDATE` statement by calling the `execute()` method of the `PDOStatement` object.
5. Get the number of rows updated using the `rowCount()` method of the `PDOStatement` object.





## Updating data example





We will use the `stocks` table that we created in the [creating table tutorial](https://www.postgresqltutorial.com/postgresql-php/create-tables/) for the demonstration.





The `updateStock()` method of the `PostgreSQLPHPUpdate` class updates the data in the `stocks` table based on a specified id.





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





We use the `PostgreSQLPHPUpdate` class in the `index.php` file as follows:





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





In the index.php script, we connected to the PostgreSQL database and called the `updateStock()` method of the `PostgreSQLPHPUpdate` class to update the company name of the stock id 2 from `Google Inc.` to `Alphabet Inc.`





![PostgreSQL PHP Update](./img/wp-content-uploads-2016-06-PostgreSQL-PHP-Update.png)





Before running the script, we query data from the stocks table to see its current data.





```
SELECT
    id, symbol, company
FROM
    stocks;
```





```
 id | symbol |        company
----+--------+-----------------------
  1 | MSFT   | Microsoft Corporation
  2 | GOOG   | Google Inc.
  3 | YHOO   | Yahoo! Inc.
  4 | FB     | Facebook, Inc.
(4 rows)
```





Launch the `index.php` file in a web browser; we get the following output.





```
Number of row affected 1
```





Let's recheck the stocks table.





```
 id | symbol |        company
----+--------+-----------------------
  1 | MSFT   | Microsoft Corporation
  2 | GOOGL  | Alphabet Inc.
  3 | YHOO   | Yahoo! Inc.
  4 | FB     | Facebook, Inc.
(4 rows)
```





The company name of stock with id 2 has been updated to the new one.





In this tutorial, you have learned how to update data in a PostgreSQL table using the prepared statement in PHP PDO.


