Neon Auth is a managed authentication service powered by [Better Auth](https://www.better-auth.com/). It stores users, sessions, and auth configuration directly in your Neon Postgres database, so your auth state [branches with your data](/docs/auth/branching-authentication). Each branch gets its own isolated auth environment.

Common uses include testing sign-up and login flows in preview environments, running end-to-end auth tests in CI without touching production, and provisioning auth as part of platform automation.

These endpoints manage Neon Auth at the branch level: enabling auth, rotating keys, and inspecting configuration. For a full walkthrough of the management API, see [Manage Neon Auth via the API](/docs/auth/guides/manage-auth-api).

For integrating authentication into an application, use the Neon Auth SDKs. See [Neon Auth](/docs/auth/overview) to get started.
