### Postgres version update

Supported Postgres versions were updated to 14.9 and 15.4, respectively.

### BYPASSRLS added to the neon_superuser role

The `neon_superuser` role now includes the `BYPASSRLS` attribute, enabling members of this role to bypass the row security system when accessing tables. Roles created in the Neon console, CLI, or API, including the default role created with a Neon project, are granted membership in the `neon_superuser` role. For more information, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role). This attribute is only included in `neon_superuser` roles in projects created after this release.
