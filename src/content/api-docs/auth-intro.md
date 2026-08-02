Neon Auth lets you add user authentication to your application backed by your Neon Postgres database. The endpoints below let you manage Neon Auth projects programmatically — provisioning auth for a Neon project, rotating keys, and inspecting state.

## When to use this API

Use the Neon Auth API when you need to automate auth setup as part of your deployment pipeline or internal tooling. If you're integrating authentication into an application, you'll typically use the [@neondatabase/auth](https://neon.com/docs/neon-auth) SDK instead, which talks to the service directly.

## Prerequisites

- A Neon project with the Auth feature enabled on your plan.
- An API key with permission to manage the target project. See [Manage API keys](https://neon.com/docs/manage/api-keys) for how to create one.

All requests require a bearer token in the `Authorization` header:

```bash
Authorization: Bearer $NEON_API_KEY
```
