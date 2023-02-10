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

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

For additional information about creating projects, see [Set up a project](/docs/get-started-with-neon/setting-up-a-project).

## Configure Go application connection settings

Connecting to Neon requires configuring connection settings in your Go project's `.go` file.

<Admonition type="note">
Neon is fully compatible with the `sql/db` package and common PostgreSQL drivers, such as `lib/pq` and `pgx`.
</Admonition>

Specify the connection settings in your `.go` file, as shown in the following example:

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/lib/pq"
)

func main() {
    connStr := "user=<user> password=<password> dbname=neondb host=<hostname>"
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

- `<user>` is the database user.
- `<password>` is the database user's password, which is provided to you when you create a project.
- `<dbname>` is the name of the database. The default Neon database is `neondb`.
- `<hostname>` is the hostname of the branch's compute endpoint. The hostname has an `ep-` prefix and appears similar to this: `ep-tight-salad-272396.us-east-2.aws.neon.tech`.

You can find all of the connection details listed above, except for your password,  in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app). If you have misplaced your password, see [Reset a password](/docs/manage/users#reset-a-password).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
