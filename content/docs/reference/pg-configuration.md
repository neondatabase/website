---
title: PostgreSQL Configuration
enableTableOfContents: true
isDraft: true
---

This topic describes PostgreSQL configuration parameters that you can configure.

- This is the permitted settings list: https://github.com/neondatabase/cloud/blob/c08461623e841751c3012ce5caf5f42cfa3dff93/goapp/internal/dto/postgres/pg_settings.go#L33
    - log_ settings are not that helpful and could prevent compute from start due to the huge number of logs. Also, do not set debug_ settings.
- Users are only able to configure parameters with user or sighu scopes.
https://github.com/neondatabase/cloud/blob/2547111bff08f4129e092f9acf26a38edb86b197/goapp/internal/dto/postgres/postgres_settings_v15.gen.json#L42
    - signup - means that it could be changed without restart
    - postmaster - restart is needed
    - user - is session level one
    - superuser - literally what it says
- The parameters a user can modify depend on the parameter scope. If it's not-superuser / session-level parameter, you can change it with SET. You can actually change some per-db settings, which we don't allow changing by other means. Like we had a bug with 'default transaction read only' set (edited)


Setting parameters for the compute endpoint:

```
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/nameless-cake-355903/endpoints/ep-cold-darkness-851872 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_APY_KEY' \
     --header 'content-type: application/json' \
     --data '
{
     "endpoint": {
          "settings": {
               "pg_settings": {
                    "enable_bitmapscan": "on"
               }
          },
          "pooler_mode": "transaction"
     }
}
'
```