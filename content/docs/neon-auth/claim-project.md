---
title: Claiming a Neon Auth project
enableTableOfContents: true
tag: beta
updatedOn: '2025-07-25T16:57:32.349Z'
redirectFrom:
  - /docs/guides/neon-auth-claim-project
---

Neon Auth is powered by Stack Auth under the hood. By default, Neon manages your authentication for you, so you do not typically need to interact with Stack Auth directly. However, there are cases where you may want to take direct control of your authentication project in the Stack Auth dashboard.

## Why claim a project?

Most Neon Auth features can be built using the SDKs, without claiming your project.

Right now, you need to claim your project if you want to:

- Add or manage OAuth providers (register client IDs/secrets, set callback URLs)
- Enable production mode and enforce production security settings
- Manage multiple projects or separate production and development environments directly in Stack Auth

<Steps>

## Claim via the Neon Console

1. Go to your project's **Auth** page, **Configuration** tab in the Neon Console.
2. Click **Claim project** in the Claim project section.
3. Follow the prompts to select the Stack Auth account that should receive ownership.

After claiming, you'll have direct access to manage your project in the Stack Auth dashboard, while maintaining the integration with your Neon database.

You can also find your current project ID here, as well as the JWKS URL you need to set up [RLS in your Neon Auth project](/docs/neon-auth/best-practices#enabling-row-level-security-rls).

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
