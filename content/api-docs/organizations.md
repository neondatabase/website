An organization groups projects under shared billing, access control, and API keys. Organizations have two roles: **Admin** (full control over the org and its projects) and **Member** (access to all projects, but cannot modify org settings).

Use these endpoints from automation that manages team membership, handles invitations, or configures org-level infrastructure. Direct project operations (creating branches, querying databases) use the project-level endpoints regardless of whether the project belongs to an org.

Some endpoints require the admin role. Member-level tokens can read org state but cannot modify members or billing settings.

See [Organizations](/docs/manage/organizations) for full role permissions and plan limits.
