---
title: 'PostgreSQL PHP: Calling Stored Procedures'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-php/call-stored-procedures/
ogImage: ./img/wp-content-uploads-2016-06-PostgreSQL-PHP-store-procedure.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to call stored procedures in PostgreSQL in PHP using PDO.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Calling a stored procedure that returns one value

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let’s create a simple [stored procedure](https://www.postgresqltutorial.com/postgresql-php/call-stored-procedures/) named `add()` that returns the product of two integers using plpgsql.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE OR REPLACE FUNCTION add(
    a INTEGER,
    b INTEGER)
  RETURNS integer AS $$
BEGIN
return a + b;
END; $$
  LANGUAGE 'plpgsql';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To call a stored procedure that returns one value, you use these steps:

<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

1. <!-- wp:list-item -->
2. [Connect to the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-php/connect/) by creating a new instance of the PDO class.
3. <!-- /wp:list-item -->
4.
5. <!-- wp:list-item -->
6. Prepare the statement that calls the stored procedure for execution using the `prepare()` method of the PDO object. The `prepare()` method returns a `PDOStatement` object.
7. <!-- /wp:list-item -->
8.
9. <!-- wp:list-item -->
10. Optionally pass values to the statement using the `bindValue()` method.
11. <!-- /wp:list-item -->
12.
13. <!-- wp:list-item -->
14. Execute the statement using the `execute()` method of the `PDOStatement` object. You can pass the values to the statement when calling the `execute()` method as well.
15. <!-- /wp:list-item -->
16.
17. <!-- wp:list-item -->
18. Get the value using the `fetchColumn()` method that returns a single column of the next row in the result set.
19. <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following `add()` method demonstrates how to call the `add()` stored procedure in PostgreSQL database.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
   /**
     * Call a simple stored procedure
     * @param int $a
     * @param int $b
     * @return int
     */
    public function add($a, $b) {
        $stmt = $this->pdo->prepare('SELECT * FROM add(:a,:b)');
        $stmt->setFetchMode(\PDO::FETCH_ASSOC);
        $stmt->execute([
            ':a' => $a,
            ':b' => $b
        ]);
        return $stmt->fetchColumn(0);
    }
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To test the `add()` method, you use the following code in the `index.php` file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
<?php

require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\StoreProc as StoreProc;

try {
    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();
    //
    $storeProc = new StoreProc($pdo);

    $result = $storeProc->add(20, 30);
    echo $result;

} catch (\PDOException $e) {
    echo $e->getMessage();
}
```

<!-- /wp:code -->

<!-- wp:heading -->

## Calling a stored procedure that returns a result set

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `accounts`, `plans`, and `account_plans` tables for the sake of demonstration. The following `get_accounts()` stored procedure returns a result set that contains complete data of accounts.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE OR REPLACE FUNCTION get_accounts()
  RETURNS TABLE(id integer,
                first_name character varying,
                last_name character varying,
                plan character varying,
                effective_date date) AS
$$
BEGIN
 RETURN QUERY

 SELECT a.id,a.first_name,a.last_name, p.plan, ap.effective_date
 FROM accounts a
 INNER JOIN account_plans ap on a.id = account_id
 INNER JOIN plans p on p.id = plan_id
 ORDER BY a.id, ap.effective_date;
END; $$

LANGUAGE plpgsql;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The steps of calling a stored procedure that returns a result set are the same as the steps of [querying data](https://www.postgresqltutorial.com/postgresql-php/query/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following `getAccounts()` method demonstrates how to call the `get_accounts()` stored procedure in PHP.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
   /**
     * Call a stored procedure that returns a result set
     * @return array
     */
    function getAccounts() {
        $stmt = $this->pdo->query('SELECT * FROM get_accounts()');
        $accounts = [];
        while ($row = $stmt->fetch()) {
            $accounts[] = [
                'id' => $row['id'],
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'plan' => $row['plan'],
                'effective_date' => $row['effective_date']
            ];
        }
        return $accounts;
    }
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To test the `getAccounts()` method, you use the following code in the `account.php` file.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
<?php
require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\StoreProc as StoreProc;

try {
    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();
    //
    $storeProc = new StoreProc($pdo);

    $accounts = $storeProc->getAccounts();

} catch (\PDOException $e) {
    echo $e->getMessage();
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>PostgreSQL PHP: calling stored procedure demo</title>
        <link rel="stylesheet" href="https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css">
    </head>
    <body>
        <div class="container">
            <h1>Account List</h1>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Plan</th>
                        <th>Effective Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($accounts as $account) : ?>
                        <tr>
                            <td><?php echo htmlspecialchars($account['id']) ?></td>
                            <td><?php echo htmlspecialchars($account['first_name']); ?></td>
                            <td><?php echo htmlspecialchars($account['last_name']); ?></td>
                            <td><?php echo htmlspecialchars($account['plan']); ?></td>
                            <td><?php echo htmlspecialchars($account['effective_date']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </body>
</html>
```

<!-- /wp:code -->

<!-- wp:image {"id":2053} -->

![D:\ref\projects\postgresql\php\stored procedure](./img/wp-content-uploads-2016-06-PostgreSQL-PHP-store-procedure.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this tutorial, we have shown you how to call stored procedures from PostgreSQL using PHP PDO.

<!-- /wp:paragraph -->
