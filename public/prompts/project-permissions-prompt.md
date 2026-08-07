Help me set up a permissions structure for my Neon organization so each person and agent only has the access they need.

Neon access works in two layers:

- An **organization role** sets a baseline on every project in the org. There are four: Admin (full control including billing and members), Editor (edit every project but can't delete or transfer them), Viewer (read-only metadata, cannot see connection strings or run SQL), and Collaborator (no access at all by default; sees only projects explicitly granted).
- A **per-project permission** grants extra access on one project. Three levels: Viewer (read-only), Editor (connect, query, edit resources), Admin (manage access, settings, and delete the project).

CRITICAL RULE: The two layers are additive. A per-project permission can only RAISE someone's access above their organization-role baseline, never lower it. There is no way to give someone Editor across the org and then block them from one project. If a person or agent should reach only specific projects, they must have the **Collaborator** organization role, with an explicit grant on each project they need.

Start by asking me:

1. Who needs access, and what does each person or agent actually do? (For each one, whether they need to read only, edit, or manage the project.)
2. Which projects exist, and which are sensitive (production, customer data)?
3. Is anyone external, a contractor, or an automated agent?

Then propose a table mapping each person to an organization role plus any per-project grants, and explain your reasoning. Apply these principles:

- Pick the LOWEST organization role that covers most of a person's work, then add per-project grants for the exceptions. Starting too high can't be walked back with a grant.
- Anyone who should not see every project must be a **Collaborator**. This includes every external contractor and every automated agent. Collaborator is closed by default: an ungranted project doesn't appear in their list and the API responds as though it doesn't exist.
- Whoever creates a project becomes Admin on it.
- Deleting a project requires Admin ON THAT PROJECT, not the Admin organization role.
- Viewers can still create their own projects, and become Admin on what they create.

Once I approve the plan, help me apply it. Ask which I prefer:

**Neon Console.** Give me click-by-click steps. Organization roles are set on the org's People page via Invite member, or the more options menu (⋮) then Edit member for someone already there. Per-project permissions are set per project under Settings > Project permissions > Grant permission. The Project permissions page tags each person Inherited (access from their org role) or Explicit (granted on this project).

**Neon API.** Generate the curl commands. These need an organization API key with the Admin role. Roles are sent lowercase (`viewer`, `editor`, `admin`) and returned uppercase (`VIEWER`, `EDITOR`, `ADMIN`).

- List who can reach a project, with each person's effective permission: `GET https://console.neon.tech/api/v2/projects/{project_id}/members`
- Grant or update a permission: `PUT https://console.neon.tech/api/v2/projects/{project_id}/members/{member_id}/role` with body `{"role": "editor"}`
- Remove an explicit grant (their org-role baseline still applies): `DELETE https://console.neon.tech/api/v2/projects/{project_id}/members/{member_id}/role`

Get each `member_id` from the List members response. Use these placeholders in any command you generate, and I'll substitute them when I run it:

- `$NEON_API_KEY`: my organization API key (create at https://console.neon.tech/app/settings/api-keys)
- `$PROJECT_ID`: the project I'm granting access on

SECURITY: Do not ask me to paste my API key or any credential into this chat. Leave the placeholders in the commands for me to fill in when I run them myself.

Finish by telling me how to verify the result: for each project, list its members and confirm each person's `effective_project_permission` matches the plan, and confirm that anyone who should not have access does not appear at all.

If I'm setting up access for an automated agent, also recommend a project-scoped API key so the credential itself can only reach the granted project: `neon api-keys create --name <agent-name> --project-id <project-id>`. A project-scoped key cannot create projects, cannot mint other keys, and cannot see any other project.
