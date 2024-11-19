---
title: Python SDK for the Neon API
enableTableOfContents: true
updatedOn: '2024-10-26T08:44:49.116Z'
---

<InfoBlock>

<DocsList title="What you will learn:">
<p>What is the Neon Python SDK</p>
<p>Basic usage</p>
<p>Where to find the docs</p>
<p>Supported methods</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="https://neon.tech/docs/reference/api-reference">Neon API Reference</a>
</DocsList>

<DocsList title="Source code" theme="repo">
  <a href="https://pypi.org/project/neon-api/">Python wrapper for the Neon API</a>
</DocsList>

</InfoBlock>

## About the SDK

Neon supports the [neon-api - Python client for the Neon API](https://pypi.org/project/neon-api/), a wrapper for the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). This SDK simplifies integration of Python applications with the Neon platform, providing methods to programmatically manage API keys, Neon projects, branches, databases, endpoints, roles, and operations.

## Installation

Installation of neon_api is easy, with pip:

```shell
$ pip install neon-api
```

## Usage

```python
from neon_api import NeonAPI

# Initialize the client.
neon = NeonAPI(api_key='your_api_key')
```

## Documentation

Documentation for the `neon-api - Python SDK`, including a [Quickstart](https://neon-api-python.readthedocs.io/en/latest/#quickstart), can be found **ReadtheDocs**. See [neon-api — Python client for the Neon API](https://neon-api-python.readthedocs.io/en/latest/#neon-api-python-client-for-the-neon-api).

## Methods of the `NeonAPI` Class

### `me()`
- **Description**: Returns the current user.

### Manage API Keys
- `api_keys()`: Returns a list of API keys.
- `api_key_create(**json)`: Creates an API key.
- `api_key_delete(key_id)`: Deletes a given API key.

### Manage Projects
- `projects()`: Returns a list of projects.
- `project(project_id)`: Returns a specific project.
- `project_create(project_id, **json)`: Creates a new project.
- `project_update(project_id, **json)`: Updates a given project.
- `project_delete(project_id)`: Deletes a given project.
- `project_permissions(project_id)`: Returns a list of permissions for a given project.
- `project_permissions_grant(project_id, **json)`: Grants permissions to a given project.
- `project_permissions_revoke(project_id, **json)`: Revokes permissions from a given project.
- `connection_uri(project_id, database_name, role_name)`: Returns the connection string for a given project.

### Manage Branches
- `branches(project_id)`: Returns a list of branches for a given project.
- `branch(project_id, branch_id)`: Returns a specific branch.
- `branch_create(project_id, **json)`: Creates a new branch.
- `branch_update(project_id, branch_id, **json)`: Updates a given branch.
- `branch_delete(project_id, branch_id)`: Deletes a given branch.
- `branch_set_as_primary(project_id, branch_id)`: Sets a given branch as primary.

### Manage Databases
- `databases(project_id, branch_id)`: Returns a list of databases for a given project and branch.
- `database(project_id, branch_id, database_id)`: Returns a specific database.
- `database_create(project_id, branch_id, **json)`: Creates a new database.
- `database_update(project_id, branch_id, **json)`: Updates a given database.
- `database_delete(project_id, branch_id, database_id)`: Deletes a given database.

### Manage Endpoints
- `endpoints(project_id, branch_id)`: Returns a list of endpoints for a given project and branch.
- `endpoint_create(project_id, branch_id, **json)`: Creates a new endpoint.
- `endpoint_update(project_id, branch_id, endpoint_id, **json)`: Updates a given endpoint.
- `endpoint_delete(project_id, branch_id, endpoint_id)`: Deletes a given endpoint.
- `endpoint_start(project_id, branch_id, endpoint_id)`: Starts a given endpoint.
- `endpoint_suspend(project_id, branch_id, endpoint_id)`: Suspends a given endpoint.

### Manage Roles
- `roles(project_id, branch_id)`: Returns a list of roles for a given project and branch.
- `role(project_id, branch_id, role_name)`: Returns a specific role.
- `role_create(project_id, branch_id, role_name)`: Creates a new role.
- `role_delete(project_id, branch_id, role_name)`: Deletes a given role.
- `role_password_reveal(project_id, branch_id, role_name)`: Reveals the password for a given role.
- `role_password_reset(project_id, branch_id, role_name)`: Resets the password for a given role.

### Manage Operations
- `operations(project_id)`: Returns a list of operations for a given project.
- `operation(project_id, operation_id)`: Returns a specific operation.

### Experimental
- `consumption()`: Returns a list of project consumption metrics.

*View the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) documentation for more information on the available endpoints and their parameters.*
