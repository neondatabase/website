---
title: Claiming a Neon Auth project
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-16T19:06:06.840Z'
redirectFrom:
  - /docs/guides/neon-auth-claim-project
---

Neon Auth is powered by Stack Auth under the hood. By default, Neon manages your authentication for you, so you never need to interact with Stack Auth directly. If you want to "eject" and manage your authentication project directly in Stack Auth (for advanced configuration or direct provider control), you can claim ownership of the project.

<Steps>

## Claim via the Neon Console

1. Go to your project's **Auth** page in the Neon Console.
2. Click **Transfer ownership**.
3. Follow the prompts to select the Stack Auth account that should receive ownership.

After claiming, you'll have direct access to manage your project in the Stack Auth dashboard, while maintaining the integration with your Neon database.

## Claim via the API

You can also claim your project programmatically:

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/transfer_ownership' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack"
     }'
```

Open the returned URL in your browser to complete the claim process.  
See [Neon Auth API Reference](/docs/guides/neon-auth-api#transfer-to-your-auth-provider) for more details.

<Admonition type="note">
After claiming, you'll still be able to access your project from the Neon Console, but you'll also have direct access from the Stack Auth dashboard.
</Admonition>

</Steps>

<NeedHelp />
