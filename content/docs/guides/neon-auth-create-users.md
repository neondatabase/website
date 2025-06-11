---
title: Creating users with Neon Auth
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-16T19:06:06.840Z'
---

You can create users in Neon Auth using either the Neon Console or the API. This is useful for development, testing, or manual onboarding, as it lets you quickly add users and see their profiles appear in your `neon_auth.users_sync` table.

<Steps>
## Creating users in the Console

You can create users directly from the Neon Console — no app integration or API required.

1. Go to your project's **Auth** page in the Neon Console.
2. Click **Create user** and fill in the required details.
3. The new user will appear in your user list and be available in your database.

## Creating users via the API

You can also create users programmatically using the Neon API:

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/user' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack",
       "email": "user@example.com",
       "name": "Example User"
     }'
```

The new user will be created and automatically available in your `neon_auth.users_sync` table.

For more details, see [Neon Auth API Reference](/docs/guides/neon-auth-api#create-users).

</Steps>
