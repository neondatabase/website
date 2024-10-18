---
title: 'PostgreSQL PHP: Transaction'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-php/transaction/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to perform transactions in PostgreSQL using PHP PDO.



A transaction is a series of operations performed as a single logical unit of work. A transaction has four characteristics:



- - Atomicity
- -
- - Consistency
- -
- - Isolation
- -
- - Durability
- 


These characteristics are referred to as ([ACID](https://en.wikipedia.org/wiki/ACID)).



By default, PostgreSQL uses the auto-commit mode. This means that for every statement that the application issues, PostgreSQL commits it automatically.



To turn off the auto-commit mode in PHP, you call the `beginTransaction()` method of the PDO object. By doing this, the change to the database is made only when the `commit()` method of the PDO object is called.



If there is an exception or error, you can cancel the change using the `rollback()` method of the PDO object.



The typical usage of the transaction in PHP PDO is as follows:



```
<?php

try {
    $pdo->beginTransaction();

    $pdo->query("SELECT * FROM table");

    $stmt = $pdo->prepare("UPDATE QUERY");
    $stmt->execute();

    $stmt = $pdo->prepare("ANOTHER UPDATE QUERY");
    $stmt->execute();

    $db->commit();
} catch (\PDOException $e) {
    $db->rollBack();
    throw $e;
}
```



## PostgreSQL PHP transaction example



We'll create the following tables for the demonstration:



1. 2. `accounts`: stores the account information such as first name, last name
3. 4.
5. 6. `plans`: stores the plan information for the account such as silver, gold, and platinum.
7. 8.
9. 10. `account_plans` : stores the plan for each account with the effective date.
11. 


The following [CREATE TABLE](/docs/postgresql/postgresql-create-table) statements create the three tables:



```
CREATE TABLE accounts(
   id SERIAL PRIMARY KEY,
   first_name CHARACTER VARYING(100),
   last_name CHARACTER VARYING(100)
);

CREATE TABLE plans(
   id SERIAL PRIMARY KEY,
   plan CHARACTER VARYING(10) NOT NULL
);

CREATE TABLE account_plans(
   account_id INTEGER NOT NULL,
   plan_id INTEGER NOT NULL,
   effective_date DATE NOT NULL,
   PRIMARY KEY (account_id,plan_id),
   FOREIGN KEY(account_id) REFERENCES accounts(id),
   FOREIGN KEY(plan_id) REFERENCES plans(id)
);
```



The following [INSERT](https://www.postgresqltutorial.com/postgresql-php/insert/) statement inserts some sample data into the `plans` table.



```
INSERT INTO plans(plan) VALUES('SILVER'),('GOLD'),('PLATINUM');
```



When creating an account, you need to assign a plan that can be silver, gold, or platinum. To ensure that an account always has at least one plan at a time, you use the transaction API in PDO.



The following `addAccount()` method performs two main steps:



- - First, insert an account into the `accounts` table and return the account id.
- -
- - Then, assign the account a specific plan by inserting a new row into the `account_plans` table.
- 


At the beginning of the method, you call the `beginTransaction()` method of the PDO object to start the transaction.



If all the steps succeed, you call the `commit()` method to save the changes. If an exception occurs in any step, you roll back the changes by calling the `rollback()` method in the `catch` block:



```
   /**
     * Add a new account
     * @param string $firstName
     * @param string $lastName
     * @param int $planId
     * @param date $effectiveDate
     */
    public function addAccount($firstName, $lastName, $planId, $effectiveDate) {
        try {
            // start the transaction
            $this->pdo->beginTransaction();

            // insert an account and get the ID back
            $accountId = $this->insertAccount($firstName, $lastName);

            // add plan for the account
            $this->insertPlan($accountId, $planId, $effectiveDate);

            // commit the changes
            $this->pdo->commit();
        } catch (\PDOException $e) {
            // rollback the changes
            $this->pdo->rollBack();
            throw $e;
        }
    }
```



The `addAccount()` method uses two other private methods: `insertAccount()` and `insertPlan()` as shown in the following:



```
   /**
     *
     * @param string $firstName
     * @param string $lastName
     * @return int
     */
    private function insertAccount($firstName, $lastName) {
        $stmt = $this->pdo->prepare(
                'INSERT INTO accounts(first_name,last_name) '
                . 'VALUES(:first_name,:last_name)');

        $stmt->execute([
            ':first_name' => $firstName,
            ':last_name' => $lastName
        ]);

        return $this->pdo->lastInsertId('accounts_id_seq');
    }
```



```
   /**
     * insert a new plan for an account
     * @param int $accountId
     * @param int $planId
     * @param int $effectiveDate
     * @return bool
     */
    private function insertPlan($accountId, $planId, $effectiveDate) {
        $stmt = $this->pdo->prepare(
                'INSERT INTO account_plans(account_id,plan_id,effective_date) '
                . 'VALUES(:account_id,:plan_id,:effective_date)');

        return $stmt->execute([
                    ':account_id' => $accountId,
                    ':plan_id' => $planId,
                    ':effective_date' => $effectiveDate,
        ]);
    }
```



To test the `AccountDB` class, you use the following code in the `index.php` file.



```
<?php

require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\AccountDB as AccountDB;

try {
    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();

    $accountDB = new AccountDB($pdo);

    // add accounts
    $accountDB->addAccount('John', 'Doe', 1, date('Y-m-d'));
    $accountDB->addAccount('Linda', 'Williams', 2, date('Y-m-d'));
    $accountDB->addAccount('Maria', 'Miller', 3, date('Y-m-d'));


    echo 'The new accounts have been added.' . '<br>';
    //
    $accountDB->addAccount('Susan', 'Wilson', 99, date('Y-m-d'));
} catch (\PDOException $e) {
    echo $e->getMessage();
}
```



How it works.



- - First, connect to the PostgreSQL database.
- -
- - Second, insert three accounts with silver, gold, and platinum levels.
- -
- - Third, try to insert one more account but with a plan ID that does not exist in the `plans` table. Based on the input, the step of assigning the plan to the account fails which causes the whole transaction to be rolled back.
- 


The following shows the output of the index.php file:



```
The new accounts have been added.

SQLSTATE[23503]: Foreign key violation: 7 ERROR: insert or update on table "account_plans" violates foreign key constraint "account_plans_plan_id_fkey" DETAIL: Key (plan_id)=(99) is not present in table "plans".
```



If you query the data in the `accounts` and `account_plans` tables, you will see only three rows inserted in each table:



```
stocks=# SELECT * FROM accounts;
 id | first_name | last_name
----+------------+-----------
  1 | John       | Doe
  2 | Linda      | Williams
  3 | Maria      | Miller
(3 rows)

stocks=# SELECT * FROM account_plans;
 account_id | plan_id | effective_date
------------+---------+----------------
          1 |       1 | 2016-06-13
          2 |       2 | 2016-06-13
          3 |       3 | 2016-06-13
(3 rows)
```



## Summary



- - Use the `beginTransaction`() method of the PDO object to start a transaction.
- -
- - Use the `commit()` method to apply the changes to the database and `rollback()` method to undo the changes.
- 
