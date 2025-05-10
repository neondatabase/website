---
title: Permissions & roles in Neon Auth
enableTableOfContents: true
tag: beta
---

Neon Auth permissions are based on your organization's roles in Neon. Only organization admins can manage Neon Auth settings. Members and project collaborators can use Neon Auth features once configured, but cannot modify the integration settings.

| Action            | Admin | Member | Collaborator |
| ----------------- | :---: | :----: | :----------: |
| Install Neon Auth |  ✅   |   ❌   |      ❌      |
| Remove Neon Auth  |  ✅   |   ❌   |      ❌      |
| Claim project     |  ✅   |   ❌   |      ❌      |
| Generate SDK Keys |  ✅   |   ❌   |      ❌      |
| Create users      |  ✅   |   ✅   |      ✅      |

For more information about organization roles and permissions, see [User roles and permissions](/docs/manage/organizations#user-roles-and-permissions).

<NeedHelp />
