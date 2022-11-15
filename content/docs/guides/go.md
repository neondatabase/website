---
title: Connect a Go application to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/go
  - /docs/integrations/go
---

This topic describes how to create a Neon project and connect to it from a Go application.

To connect to Neon from a Go application:

1. [Create a Neon project](#create-a-neon-project)
2. [Configure Go project connection settings](#configure-go-application-connection-settings)

## Create a Neon project

When creating a Neon project, take note of your user name, password, database name, and project ID. This information is required when defining connection settings in your Go application.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, and click **Create Project**.

For additional information about creating projects, see [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).

## Configure Go application connection settings

Connecting to Neon requires configuring connection settings in your Go project's `.go` file.

<Admonition type="note">
Neon is fully compatible with the `sql/db` package and common PostgreSQL drivers, such as `lib/pq` and `pgx`.
</Admonition>

Specify the connection settings for your Neon project in your `.go` file, as shown in the following example:

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/lib/pq"
)

func main() {
    connStr := "user=<user> password=<password> dbname=main host=<project_id>.cloud.neon.tech"
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

where:

- `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a project.
- `<dbname>` is the name of the database in your Neon project. `main` is the default database created with each Neon project.
- `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**.

The `.go` file example shown above is also available on [The Go Playground](https://play.golang.com/p/gl69dT0HtHN).
