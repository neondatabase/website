---
title: Run a Go app
redirectFrom:
  - /docs/quickstart/go
---

Neon is fully compatible with sql/db package and common PostgreSQL drivers ie. lib/pq, pgx etc.

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/lib/pq"
)

func main() {
    connStr := "user=<user> password=<password> dbname=main host=<project>.cloud.neon.tech"
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    rows, err := db.Query("select version()")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()

    var version string
    for rows.Next() {
        err := rows.Scan(&version)
        if err != nil {
            log.Fatal(err)
        }
    }
    fmt.Printf("version=%s\n", version)
}
```

[On golang playground](https://play.golang.com/p/gl69dT0HtHN)
