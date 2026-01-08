# Data API troubleshooting

> The "Data API troubleshooting" document offers solutions for common issues encountered when using Neon's Data API, detailing error messages and corrective actions specific to Neon's platform.

## Source

- [Data API troubleshooting HTML](https://neon.com/docs/data-api/troubleshooting): The original HTML version of this documentation

## Permission denied to create extension "pg_session_jwt"

```bash
Request failed: database CREATE permission is required for neon_superuser
```

### Why this happens

You created your database with a direct SQL query (`CREATE DATABASE foo;`) instead of using the Console UI or Neon API. The Data API requires specific database permissions that aren't automatically granted when you create databases this way.

### Fix

Grant `neon_superuser` permissions to the database you want to enable the Data API for.

```sql
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO neon_superuser;
```

For future databases, create them using the Console UI or Neon API instead of direct SQL. Neon automatically sets up the required permissions when you use these methods.

**Example**

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/${projectId}/branches/${branchId}/databases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{
    "database": {
      "name": "your_database_name"
    }
  }'
```
