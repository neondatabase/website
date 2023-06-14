---
title: Neon CLI
subtitle: Use the Neon CLI to manage Neon projects from the command line
enableTableOfContents: true
isDraft: true
---

Neon offers several methods for working with your projects. Utilizing the Neon Command Line Interface (CLI), you can operate Neon directly from a terminal or via automation. The Neon CLI facilitates numerous functions, such as Neon authentication, project creation and management, role assignment, and more.

## Synopsis

The `neonctl` command can be called from the command line. Without any arguments, it displays command usage and help:

```bash
neonctl --help
usage: neonctl <cmd> [args]

Commands:
  neonctl auth               Authenticate
  neonctl projects           Manage projects
  neonctl me                 Show current user
  neonctl branches           Manage branches
  neonctl endpoints          Manage endpoints
  neonctl databases          Manage databases
  neonctl roles              Manage roles
  neonctl operations         Manage operations
  neonctl connection-string  Get connection string                 [aliases: cs]

Options:
      --version     Show version number                                [boolean]
      --help        Show help                                          [boolean]
  -o, --output      Set output format
                  [string] [choices: "json", "yaml", "table"] [default: "table"]
      --api-host    The API host   [default: "https://console.neon.tech/api/v2"]
      --config-dir  Path to config directory
                             [string] [default: "/home/dtprice/.config/neonctl"]
      --oauth-host  URL to Neon OAUTH host [default: "https://oauth2.neon.tech"]
      --client-id   OAuth client id                [string] [default: "neonctl"]
      --api-key     API key                               [string] [default: ""]
```

## Install the Neon CLI

This topic describes how to install the `neonctl` command-line interface tool and connect to Neon.

### Prerequisites

- Node.js 14.0 or higher. To check if you already have Node.js, run the following command:

    ```shell
    node -v
    ```

- The `npm` package manager.  To check if you already have `npm`, run the following command:

   ```shell
   npm -v
   ```

If you need to install either `Node.js` or `npm`, refer to the instructions for your operating system, which you can find online.

### Install

To download and install Neon CLI, run the following command:

```shell
npm i -g neonctl
```

### Connect

To authenticate to Neon, run the following command:

```shell
neonctl auth
```

The command launches a browser window where you can authorize the Neon CLI to access your Neon account. After granting permission, your credentials are saved locally to a configuration file.

## Commands

### neonctl auth

Authenticates the user or caller to Neon. See [Connect](#connect).

### neonctl me

Returns information about the authenticated user.

```bash
$> neonctl me
┌────────────────┬──────────────────────────┬────────────┬────────────────┐
│ Login          │ Email                    │ Name       │ Projects Limit │
├────────────────┼──────────────────────────┼────────────┼────────────────┤
│ user1          │ user1@example.com        │ User1      │ 1              │
└────────────────┴──────────────────────────┴────────────┴────────────────┘
```

### neonctl roles

For creating and managing roles.

### neonctl projects

For creating and managing Neon projects.

usage: `neonctl projects <cmd> [args]`

Commands:

- neonctl projects list    List projects
- neonctl projects create  Create a project
- neonctl projects update  Update a project
- neonctl projects delete  Delete a project
- neonctl projects get     Get a project

### neonctl branches

usage: `neonctl branches <cmd> [args]`

For creating and managing Neon branches.

Commands:

- neonctl branches list    List branches
- neonctl branches create  Create a branch
- neonctl branches update  Update a branch
- neonctl branches delete  Delete a branch
- neonctl branches get     Get a branch

### neonctl endpoints

For creating and managing Neon projects.

`usage: neonctl endpoints <cmd> [args]`

Commands:

- neonctl endpoints list    List endpoints
- neonctl endpoints create  Create an endpoint
- neonctl endpoints update  Update an endpoint
- neonctl endpoints delete  Delete an endpoint
- neonctl endpoints get     Get an endpoint

### neonctl databases

For creating and managing Neon databases.

`usage: neonctl databases <cmd> [args]`

Commands:
  
- neonctl databases list    List databases
- neonctl databases create  Create a database
- neonctl databases delete  Delete a database

### neonctl roles

For creating and managing Neon roles.

`usage: neonctl roles <cmd> [args]`

Commands:

- neonctl roles list    List roles
- neonctl roles create  Create a role
- neonctl roles delete  Delete a role

### neonctl operations

For creating and managing Neon operations.

`usage: neonctl operations <cmd> [args]`

Commands:

- neonctl operations list  List operations

### neonctl connection-string

For creating and managing Neon connection strings.

`usage: neonctl connection-string [args]`

Required arguments:

- `--project.id`     Project ID
- `--endpoint.id`    Endpoint ID
- `--role.name`      Role name
- `--database.name`  Database name

## Options

### version

Shows the neonctl version number

### help

Shows the neonctl command-line help

### output

Sets the output format.

### api-host

Shows the API host

### config-dir

Sets the path to the `neonctl` configuration directory

### oauth-host

Sets the URL of Neon OAuth host

### client-id

Sets the OAuth client id

### token

Sets the OAuth token
