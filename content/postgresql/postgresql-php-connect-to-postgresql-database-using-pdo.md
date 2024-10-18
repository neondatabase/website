---
title: 'PostgreSQL PHP: Connect to PostgreSQL Database Using PDO'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-php/connect/
ogImage: ./img/wp-content-uploads-2016-06-PostgreSQL-PHP-Connect.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to set up a simple project structure and connect to the PostgreSQL database using PHP PDO API.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Enable PDO_PGSQL driver

<!-- /wp:heading -->

<!-- wp:paragraph -->

Most PHP distributions include the PostgreSQL extension `PDO_PGSQL` by default so you don't need to do any further configuration in PHP.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

However, if this is not the case, you can enable the extension by editing the `php.ini` file to uncomment the following line:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
;extension=php_pdo_pgsql.dll
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To uncomment the line, you remove the semicolon (;) at the beginning of the line and restart the web server.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
extension=php_pdo_pgsql.dll
```

<!-- /wp:code -->

<!-- wp:heading -->

## Create a PHP project structure with Composer

<!-- /wp:heading -->

<!-- wp:paragraph -->

The [Composer](http://Composer) is a tool for managing dependency that allows you to declare the PHP library in a project and manage the update automatically.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

We will use the Composer to set up the project structure of all the projects that we will be working on.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, create the `postgresqlphpconnect` folder in the webroot folder to store the project files.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Next, create the `app` folder and a new `composer.json` file in the `postgresqlphpconnect` folder with the following content:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
{
    "autoload": {
        "psr-4": {
            "PostgreSQLTutorial\\": "app/"
        }
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It means that every class that you create in the `app` folder will map to the `PostgreSQLTutorial` namespace.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Then, go to the window terminal, navigate to the `postgresqlphpconnect` folder, and type the following command:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
composer update
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This command instructs the Composer to download the declared libraries in the `composer.json` file and generate an autoload file.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The command will also place all third-party libraries in the newly created `vendor` folder. Because we don't declare any library in the `composer.json` file, it generates the autoload file.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
Loading composer repositories with package information
Updating dependencies (including require-dev)
Nothing to install or update
Generating autoload files
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After that, create the `index.php` file in the `postgresqlphpconnect` folder.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Finally, create two more files in the `app` folder: `Connection.php` and `database.ini`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The project structure will look like the following picture:

<!-- /wp:paragraph -->

<!-- wp:image {"id":1987} -->

![PostgreSQL PHP Connect](./img/wp-content-uploads-2016-06-PostgreSQL-PHP-Connect.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Connect to the PostgreSQL database

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new database](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/) named `stocks` for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE DATABASE stocks;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Next, use the `database.ini` file to store the PostgreSQL database parameters as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
host=localhost
port=5432
database=stocks
user=postgres
password=postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Then, create a new class called `Connection` in the `Connection.php` file.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The `Connection` class is a singleton class. It means that you can create only one instance for the class. If the instance already exists and you try to create a new one, the class will return the existing reference.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- To connect to a PostgreSQL database, you need to create a new instance of the PDO class. In the `connect()` method, we read the database configuration parameters in the `database.ini` file, construct a connection string, and pass it to the `PDO` constructor.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

After that, place the following code in the `index.php` file.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"php"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

PHP throws a `\PDOException` if there is an exception occurs when connecting to the PostgreSQL database server, therefore, you need to place the code to create a new `PDO` object inside the `try...catch` block to handle the exception.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Run the following composer command to update the autoload files:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
composer dump-autoload -o
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
Generating optimized autoload files
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, launch the `index.php` file from the web browser to test it.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
A connection to the PostgreSQL database sever has been established successfully.
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you want to see the exception that may occur, you can change the parameters in the `database.ini` file to an invalid one and test it.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following is the error message when the password is invalid.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SQLSTATE[08006] [7] FATAL: password authentication failed for user "postgres"
```

<!-- /wp:code -->

<!-- wp:paragraph -->

And the following is the error message when the database is invalid.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SQLSTATE[08006] [7] FATAL: database "stockss" does not exist
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to connect to the PostgreSQL database from a PHP application using the PDO API. We will reuse the `Connection` class in the subsequent tutorials.

<!-- /wp:paragraph -->
