---
title: 'PostgreSQL PHP: Connect to PostgreSQL Database Using PDO'
page_title: 'PostgreSQL PHP: Connect to PostgreSQL Database Using PDO'
page_description: 'In this tutorial, you will learn how to set up a simple project structure and connect to the PostgreSQL database using PHP PDO API.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-php/connect/'
ogImage: '/postgresqltutorial/PostgreSQL-PHP-Connect.png'
updatedOn: '2024-01-30T00:49:02+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL PHP'
  slug: 'postgresql-php/'
nextLink:
  title: 'PostgreSQL PHP: Create New Tables'
  slug: 'postgresql-php/create-tables'
---

**Summary**: in this tutorial, you will learn how to set up a simple project structure and connect to the PostgreSQL database using PHP PDO API.

## Enable PDO_PGSQL driver

Most PHP distributions include the PostgreSQL extension `PDO_PGSQL` by default so you don’t need to do any further configuration in PHP.

However, if this is not the case, you can enable the extension by editing the `php.ini` file to uncomment the following line:

```shellsqlsql
;extension=php_pdo_pgsql.dll
```

To uncomment the line, you remove the semicolon (;) at the beginning of the line and restart the web server.

```php
extension=php_pdo_pgsql.dll
```

## Create a PHP project structure with Composer

The [Composer](http://Composer) is a tool for managing dependency that allows you to declare the PHP library in a project and manage the update automatically.

We will use the Composer to set up the project structure of all the projects that we will be working on.

First, create the  `postgresqlphpconnect` folder in the webroot folder to store the project files.

Next, create the `app` folder and a new `composer.json` file in the  `postgresqlphpconnect` folder with the following content:

```sql
{
    "autoload": {
        "psr-4": {
            "PostgreSQLTutorial\\": "app/"
        }
    }
}
```

It means that every class that you create in the `app` folder will map to the `PostgreSQLTutorial` namespace.

Then, go to the window terminal, navigate to the  `postgresqlphpconnect` folder, and type the following command:

```sql
composer update
```

This command instructs the Composer to download the declared libraries in the `composer.json` file and generate an autoload file.

The command will also place all third\-party libraries in the newly created `vendor` folder. Because we don’t declare any library in the `composer.json` file, it generates the autoload file.

```
Loading composer repositories with package information
Updating dependencies (including require-dev)
Nothing to install or update
Generating autoload files
```

After that, create the `index.php` file in the  `postgresqlphpconnect` folder.

Finally, create two more files in the `app` folder: `Connection.php` and `database.ini`.

The project structure will look like the following picture:

![PostgreSQL PHP Connect](/postgresqltutorial/PostgreSQL-PHP-Connect.png)

## Connect to the PostgreSQL database

First, [create a new database](../postgresql-administration/postgresql-create-database) named `stocks` for the demonstration.

```
CREATE DATABASE stocks;
```

Next, use the `database.ini` file to store the PostgreSQL database parameters as follows:

```sql
host=localhost
port=5432
database=stocks
user=postgres
password=postgres
```

Then, create a new class called `Connection` in the `Connection.php` file.

```sql
<?php

namespace PostgreSQLTutorial;

/**
 * Represent the Connection
 */
class Connection {

    /**
     * Connection
     * @var type
     */
    private static $conn;

    /**
     * Connect to the database and return an instance of \PDO object
     * @return \PDO
     * @throws \Exception
     */
    public function connect() {

        // read parameters in the ini configuration file
        $params = parse_ini_file('database.ini');
        if ($params === false) {
            throw new \Exception("Error reading database configuration file");
        }
        // connect to the postgresql database
        $conStr = sprintf("pgsql:host=%s;port=%d;dbname=%s;user=%s;password=%s",
                $params['host'],
                $params['port'],
                $params['database'],
                $params['user'],
                $params['password']);

        $pdo = new \PDO($conStr);
        $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        return $pdo;
    }

    /**
     * return an instance of the Connection object
     * @return type
     */
    public static function get() {
        if (null === static::$conn) {
            static::$conn = new static();
        }

        return static::$conn;
    }

    protected function __construct() {

    }

    private function __clone() {

    }

    private function __wakeup() {

    }

}
```

How it works.

- The `Connection` class is a singleton class. It means that you can create only one instance for the class. If the instance already exists and you try to create a new one, the class will return the existing reference.
- To connect to a PostgreSQL database, you need to create a new instance of the PDO class. In the `connect()` method, we read the database configuration parameters in the `database.ini` file, construct a connection string, and pass it to the `PDO` constructor.

After that, place the following code in the `index.php` file.

```php
<?php

require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;

try {
    Connection::get()->connect();
    echo 'A connection to the PostgreSQL database sever has been established successfully.';
} catch (\PDOException $e) {
    echo $e->getMessage();
}
```

PHP throws a `\PDOException` if there is an exception occurs when connecting to the PostgreSQL database server, therefore, you need to place the code to create a new `PDO` object inside the  `try...catch` block to handle the exception.

Run the following composer command to update the autoload files:

```css
composer dump-autoload -o
```

Output:

```sql
Generating optimized autoload files
```

Finally, launch the `index.php` file from the web browser to test it.

```
A connection to the PostgreSQL database sever has been established successfully.
```

If you want to see the exception that may occur, you can change the parameters in the `database.ini` file to an invalid one and test it.

The following is the error message when the password is invalid.

```
SQLSTATE[08006] [7] FATAL: password authentication failed for user "postgres"
```

And the following is the error message when the database is invalid.

```
SQLSTATE[08006] [7] FATAL: database "stockss" does not exist
```

In this tutorial, you have learned how to connect to the PostgreSQL database from a PHP application using the PDO API. We will reuse the `Connection` class in the subsequent tutorials.
