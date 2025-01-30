---
title: 'PostgreSQL PHP: Insert Data Into Tables'
page_title: 'PostgreSQL PHP: Insert Data Into Tables'
page_description: 'In this tutorial, you will learn how to use PHP PDO API to insert data into a PostgreSQL database table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-php/insert/'
ogImage: '/postgresqltutorial/PostgreSQL-PHP-Insert-Example.png'
updatedOn: '2022-02-09T15:05:02+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL PHP: Create New Tables'
  slug: 'postgresql-php/create-tables'
nextLink:
  title: 'PostgreSQL PHP: Updating Data In a Table'
  slug: 'postgresql-php/update'
---

**Summary**: in this tutorial, you will learn how to use PHP PDO API to insert data into a PostgreSQL database table.

## Steps for inserting data into a PostgreSQL table using PDO

To insert data into a database table, you use the following steps:

1. First, connect to the PostgreSQL database server by creating a new instance of the PDO class.
2. Next, construct an [INSERT](../postgresql-tutorial/postgresql-insert) statement. If you want to pass parameters to the `INSERT` statement, you use the named placeholders such as `:param`
3. Then, prepare the `INSERT` statement by calling the `prepare()` method of the PDO object. The `prepare()` method returns a `PDOStatement` object.
4. After that, pass the values to the statement by calling the `bindValue()` method of the `PDOStatement` object.
5. Finally, call the `execute()` method of the PDOStatement object to execute the `INSERT` statement.

We will use the `stocks` table that we created in the previous tutorial for demonstration purposes.

Let’s create a new class named `PostgreSQLPHPInsert` in the `app` folder and the `index.php` file in the project folder.

![PostgreSQL PHP Insert Example](/postgresqltutorial/PostgreSQL-PHP-Insert-Example.png)

## Inserting a single row into a table example

The following `insertStock()` method inserts a new row into the `stocks` table.

```phpsql
    /**
     * insert a new row into the stocks table
     * @param type $symbol
     * @param type $company
     * @return the id of the inserted row
     */
    public function insertStock($symbol, $company) {
        // prepare statement for insert
        $sql = 'INSERT INTO stocks(symbol,company) VALUES(:symbol,:company)';
        $stmt = $this->pdo->prepare($sql);

        // pass values to the statement
        $stmt->bindValue(':symbol', $symbol);
        $stmt->bindValue(':company', $company);

        // execute the insert statement
        $stmt->execute();

        // return generated id
        return $this->pdo->lastInsertId('stocks_id_seq');
    }
```

First, construct an `INSERT` statement that uses two named placed holders: `:symbol` and `:company` for binding values later.

Next, prepare the insert statement for execution by calling the `prepare()` method of the PDO object.

Then, passing the values to the statement by calling the `bindValue()` method.

After that, execute the `INSERT` statement by calling the `execute()` method.

Finally, get the ID of the last inserted row by calling the `lastInsertId()` method of the PDO object

the `PDO_PGSQL` extension requires us to specify the name of the sequence object as the parameter, we passed the `stocks_id_seq` string to the function to get the generated ID.

## Insert multiple rows into a table example

The following `insertStockList()` method inserts multiple rows into the `stocks` table.

```php
   /**
     * Insert multiple stocks into the stocks table
     * @param array $stocks
     * @return a list of inserted ID
     */
    public function insertStockList($stocks) {
        $sql = 'INSERT INTO stocks(symbol,company) VALUES(:symbol,:company)';
        $stmt = $this->pdo->prepare($sql);

        $idList = [];
        foreach ($stocks as $stock) {
            $stmt->bindValue(':symbol', $stock['symbol']);
            $stmt->bindValue(':company', $stock['company']);
            $stmt->execute();
            $idList[] = $this->pdo->lastInsertId('stocks_id_seq');
        }
        return $idList;
    }
```

The method accepts an array of stocks and calls the `execute()` method multiple times to insert multiple rows into the `stocks` table. It returns a list of inserted IDs.

Place the following code in the index.php file to test the `insertStock()` and `insertStockList()` methods.

```php
<?php
require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\PostgreSQLPHPInsert as PostgreSQLPHPInsert;

try {
    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();
    //
    $insertDemo = new PostgreSQLPHPInsert($pdo);

    // insert a stock into the stocks table
    $id = $insertDemo->insertStock('MSFT', 'Microsoft Corporation');
    echo 'The stock has been inserted with the id ' . $id . '<br>';

    // insert a list of stocks into the stocks table
    $list = $insertDemo->insertStockList([
        ['symbol' => 'GOOG', 'company' => 'Google Inc.'],
        ['symbol' => 'YHOO', 'company' => 'Yahoo! Inc.'],
        ['symbol' => 'FB', 'company' => 'Facebook, Inc.'],
    ]);

    foreach ($list as $id) {
        echo 'The stock has been inserted with the id ' . $id . '<br>';
    }
} catch (\PDOException $e) {
    echo $e->getMessage();
}
```

Launch the index.php in the web browser, we got the following output:

```
The stock has been inserted with the id 1
The stock has been inserted with the id 2
The stock has been inserted with the id 3
The stock has been inserted with the id 4
```

In this tutorial, you have learned how to insert a single row or multiple rows into a table in the PostgreSQL database using PHP PDO.
