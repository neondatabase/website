---
title: 'PostgreSQL PHP: Working with Binary Data'
redirectFrom: 
            - /docs/postgresql/postgresql-php/postgresql-blob/
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-PHP-BLOB.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to store binary data in the PostgreSQL database using PHP.



BLOB stands for the binary large object used to store binary data such as the content of a file.



PostgreSQL does not support the BLOB data type. However, you can use the [BYTEA data type](/docs/postgresql/postgresql-bytea-data-type) for storing the binary string.



We'll [create a new table](/docs/postgresql/postgresql-create-table) called `company_files` to store the binary string:



```
CREATE TABLE company_files (
   id SERIAL PRIMARY KEY,
   stock_id INT NOT NULL,
   mime_type VARCHAR(255) NOT NULL,
   file_name VARCHAR (255) NOT NULL,
   file_data BYTEA NOT NULL,
   FOREIGN KEY (stock_id) REFERENCES stocks (id)
);
```



We will store the content of a file in the `file_data` column. In addition, we will read the files from the `assets/images` folder and insert them into the `company_files` table.



To work with the binary data, we create a new class named `BlobDB`.



![PostgreSQL PHP BLOB](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-PHP-BLOB.png)



## Inserting binary data



The following `insert()` method reads data from a file specified by the `$pathToFile` parameter and inserts it into the `company_files` table.



```
   /**
     * Insert a file into the company_files table
     * @param int $stockId
     * @param string $fileName
     * @param string $mimeType
     * @param string $pathToFile
     * @return int
     * @throws \Exception
     */
    public function insert($stockId, $fileName, $mimeType, $pathToFile) {
        if (!file_exists($pathToFile)) {
            throw new \Exception("File %s not found.");
        }

        $sql = "INSERT INTO company_files(stock_id,mime_type,file_name,file_data) "
                . "VALUES(:stock_id,:mime_type,:file_name,:file_data)";

        try {
            $this->pdo->beginTransaction();

            // create large object
            $fileData = $this->pdo->pgsqlLOBCreate();
            $stream = $this->pdo->pgsqlLOBOpen($fileData, 'w');

            // read data from the file and copy the the stream
            $fh = fopen($pathToFile, 'rb');
            stream_copy_to_stream($fh, $stream);
            //
            $fh = null;
            $stream = null;

            $stmt = $this->pdo->prepare($sql);

            $stmt->execute([
                ':stock_id' => $stockId,
                ':mime_type' => $mimeType,
                ':file_name' => $fileName,
                ':file_data' => $fileData,
            ]);

            // commit the transaction
            $this->pdo->commit();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }

        return $this->pdo->lastInsertId('company_files_id_seq');
    }
```



How it works.



1. 2. First, call the pgsqlLOBCreate() method of the PDO object to create a new large object and get the OID of the large object.
3. 4.
5. 6. Next, call the pgsqlLOBopen() method to open a stream on the large object to write data to it.
7. 8.
9. 10. Then, read data from a file and copy the data from the file stream to the large binary object.
11. 12.
13. 14. After that, prepare the INSERT statement and execute it.
15. 16.
17. 18. Finally, call the lastInsertId to get the generated ID.
19. 


Note that the `pgsqlLOBCreate()` method must be called within a transaction, therefore, we place all the logic within a transaction.



Place the following code in the `index.php` file to insert the content of the `google.png` file into the `company_files` table.



```
<?php

require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\BlobDB as BlobDB;

try {
    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();
    //
    $blobDB = new BlobDB($pdo);
    $fileId = $blobDB->insert(2, 'logo', 'image/png', 'assets/images/google.png');

    echo 'A file has been inserted with id ' . $fileId;
} catch (\PDOException $e) {
    echo $e->getMessage();
}
```



Launch the index.php file, we get the following message.



```
A file has been inserted with id 1
```



To verify the insert operation, we use the following query:



```
SELECT * FROM company_files;
```



```
 id | stock_id | mime_type | file_name |  file_data
----+----------+-----------+-----------+--------------
  1 |        2 | image/png | logo      | \x3137323730
(1 row)
```



## Querying binary data



The following `read()` method reads the BLOB data from the `company_files` table and outputs the file content to the web browser:



```
    /**
     * Read BLOB from the database and output to the web browser
     * @param int $id
     */
    public function read($id) {

        $this->pdo->beginTransaction();

        $stmt = $this->pdo->prepare("SELECT id, file_data, mime_type "
                . "FROM company_files "
                . "WHERE id= :id");

        // query blob from the database
        $stmt->execute([$id]);

        $stmt->bindColumn('file_data', $fileData, \PDO::PARAM_STR);
        $stmt->bindColumn('mime_type', $mimeType, \PDO::PARAM_STR);
        $stmt->fetch(\PDO::FETCH_BOUND);
        $stream = $this->pdo->pgsqlLOBOpen($fileData, 'r');

        // output the file
        header("Content-type: " . $mimeType);
        fpassthru($stream);
    }
```



How it works.



1. 2. First, prepare a [SELECT](/docs/postgresql/postgresql-select) statement.
3. 4.
5. 6. Next, execute the `SELECT` statement by calling the `execute()` method.
7. 8.
9. 10. Then, pass the OID to the `pgsqlLOBOpen()` method of a PDO object to get the stream.
11. 12.
13. 14. After that, output the stream based on the mime type of the file.
15. 16.
17. 18. Finally, because the `pgsqlLOBopen()` must be called within a transaction, we called the `beginTransaction()` at the beginning of the method.
19. 


To test the read() method, we place the following code in the file.php:



```
<?php

require 'vendor/autoload.php';

use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\BlobDB as BlobDB;

$pdo = Connection::get()->connect();
$blobDB = new BlobDB($pdo);

// get document id from the query string
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

$file = $blobDB->read($id);
```



The file.php file gets the id value from the query string and outputs the file stored in the company_files table to the web browser.



![PostgreSQL BLOB example](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-BLOB-example.png)



## Deleting binary data



The following `delete()` method deletes a row in the `company_files` table.



```
    /**
     * Delete the large object in the database
     * @param int $id
     * @throws \Exception
     */
    public function delete($id) {
        try {
            $this->pdo->beginTransaction();
            // select the file data from the database
            $stmt = $this->pdo->prepare('SELECT file_data '
                    . 'FROM company_files '
                    . 'WHERE id=:id');
            $stmt->execute([$id]);
            $stmt->bindColumn('file_data', $fileData, \PDO::PARAM_STR);
            $stmt->closeCursor();

            // delete the large object
            $this->pdo->pgsqlLOBUnlink($fileData);
            $stmt = $this->pdo->prepare("DELETE FROM company_files WHERE id = :id");
            $stmt->execute([$id]);

            $this->pdo->commit();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
```



How it works.



1. 2. First, get the OID object from the `file_data` column.
3. 4.
5. 6. Second, use the `pgsqlLOBUnLink()` method to remove the BLOB data and execute the `DELETE` statement to remove a row specified by an ID in the `company_files` table.
7. 


In this tutorial, you have learned how to insert, query, and delete binary data in the PostgreSQL database.
