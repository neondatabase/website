---
title: Neon CLI
subtitle: Learn how to use the Neon CLI to manage your projects from the command line
enableTableOfContents: true
isDraft: true
---

Neon provides multiple ways to interact with your projects. With the command-line interface (CLI) you can interact with Neon from a terminal, or through automation, enabling you to authenticate to Neon, create and manage projects and roles, and more.

If you would like to interact with Neon programmatically, check out the to the [Neon API documentation](/docs/reference/api-reference).

## Synopsis

The `neonctl` command can be called from command line. Without arguments, it displays command usage and help:

```bash
usage: neonctl <cmd> [args]

Commands:

  neonctl auth      Authenticate user
  neonctl me        Get user info
  neonctl roles     Manage roles
  neonctl projects  Manage projects

Options:

  --version     Show version number                                    [boolean]
  --help        Show help                                              [boolean]
  --output      Set output format

                  [string] [choices: "json", "yaml", "table"] [default: "table"]
  --api-host    The API host              [default: "https://console.neon.tech"]
  --config-dir  Path to config directory
                            [string] [default: "/home/dtprice/.config/.neonctl"]
  --oauth-host  URL to Neon OAUTH host     [default: "https://oauth2.neon.tech"]
  --client-id   OAuth client id                    [string] [default: "neonctl"]
  --token       Auth token                                [string] [default: ""]
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

If you need to install either `Node.js` or `npm`, refer to instructions for your operating system, which you can find online.

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

## Commands

### neonctl auth

Authenticates the user or caller to Neon.

#### Prerequisites

#### Arguments

#### Options

#### Examples

```shell
neonctl auth
INFO: Discovering oauth server
INFO: Listening on port 41215
```

Auth screen1
Auth screen 2

```shell
INFO: Callback received: /callback?code=xon8t4VLupzvS-NdTLETWVn26axOi4IXCxNdGUndqCQ.vvwVeVm-A9l6L4YteB3d6VmuxDTjd2SxJmdXqz6t__o&scope=openid+offline+offline_access+urn%3Aneoncloud%3Aprojects%3Acreate+urn%3Aneoncloud%3Aprojects%3Aread+urn%3Aneoncloud%3Aprojects%3Aupdate+urn%3Aneoncloud%3Aprojects%3Adelete&state=CCWoT0a7XgC7Gu5_PFzRE4Rio0TPZJBqNCZ3WB3vASo
INFO: Saved credentials to /home/dtprice/.config/.neonctl/credentials.json
INFO: Auth complete
```

### neonctl me

Returns information about the authenticated user.

#### Prerequisites

#### Arguments

#### Options

#### Examples

### neonctl roles

For creating and managing roles.

### neonctl projects

For creating and managing Neon projects.

#### Prerequisites

#### Arguments

#### Options

#### Examples

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
