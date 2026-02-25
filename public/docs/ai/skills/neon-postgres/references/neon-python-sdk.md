# Neon Python SDK

The `neon-api` Python SDK is a Pythonic wrapper around the Neon REST API for managing Neon resources programmatically.

For core concepts (Organization, Project, Branch, Endpoint, etc.), see `what-is-neon.md`.

See the [official Python SDK docs](https://neon.com/docs/reference/python-sdk.md) for complete details.

## Installation

```bash
pip install neon-api
```

## Authentication

```python
import os
from neon_api import NeonAPI

neon = NeonAPI(api_key=os.environ["NEON_API_KEY"])
```

## Org-Aware Workflow

All Neon accounts are organization-based. Discover the user's org first, then pass `org_id` to project operations:

```python
# 1. Get the user's organizations
orgs = neon.current_user_organizations()
org_id = orgs[0].id

# 2. List projects within the org
projects = neon.projects(org_id=org_id)
```

## Method Quick Reference

### Projects

| Operation          | Method                                                                          |
| ------------------ | ------------------------------------------------------------------------------- |
| List projects      | `neon.projects(org_id=...)`                                                     |
| Create project     | `neon.project_create(project={ 'name': ..., 'pg_version': 17, 'org_id': ... })` |
| Get project        | `neon.project(project_id=...)`                                                  |
| Update project     | `neon.project_update(project_id=..., project={...})`                            |
| Delete project     | `neon.project_delete(project_id=...)`                                           |
| Get connection URI | `neon.connection_uri(project_id=..., database_name=..., role_name=...)`         |

### Branches

| Operation     | Method                                                              |
| ------------- | ------------------------------------------------------------------- |
| Create branch | `neon.branch_create(project_id=..., branch={...}, endpoints=[...])` |
| List branches | `neon.branches(project_id=...)`                                     |
| Get branch    | `neon.branch(project_id=..., branch_id=...)`                        |
| Update branch | `neon.branch_update(project_id=..., branch_id=..., branch={...})`   |
| Delete branch | `neon.branch_delete(project_id=..., branch_id=...)`                 |

### Databases

| Operation       | Method                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| Create database | `neon.database_create(project_id=..., branch_id=..., database={...})`  |
| List databases  | `neon.databases(project_id=..., branch_id=...)`                        |
| Delete database | `neon.database_delete(project_id=..., branch_id=..., database_id=...)` |

### Roles

| Operation   | Method                                                           |
| ----------- | ---------------------------------------------------------------- |
| Create role | `neon.role_create(project_id=..., branch_id=..., role_name=...)` |
| List roles  | `neon.roles(project_id=..., branch_id=...)`                      |
| Delete role | `neon.role_delete(project_id=..., branch_id=..., role_name=...)` |

### Endpoints

| Operation        | Method                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| Create endpoint  | `neon.endpoint_create(project_id=..., endpoint={...})`                  |
| Start endpoint   | `neon.endpoint_start(project_id=..., endpoint_id=...)`                  |
| Suspend endpoint | `neon.endpoint_suspend(project_id=..., endpoint_id=...)`                |
| Update endpoint  | `neon.endpoint_update(project_id=..., endpoint_id=..., endpoint={...})` |
| Delete endpoint  | `neon.endpoint_delete(project_id=..., endpoint_id=...)`                 |

### Organizations

| Operation      | Method                              |
| -------------- | ----------------------------------- |
| List user orgs | `neon.current_user_organizations()` |
| Get org        | `neon.organization(org_id=...)`     |

### API Keys & Operations

| Operation       | Method                                             |
| --------------- | -------------------------------------------------- |
| List API keys   | `neon.api_keys()`                                  |
| Create API key  | `neon.api_key_create(key_name=...)`                |
| Revoke API key  | `neon.api_key_revoke(key_id)`                      |
| List operations | `neon.operations(project_id=...)`                  |
| Get operation   | `neon.operation(project_id=..., operation_id=...)` |
