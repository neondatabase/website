---
title: '<AccountSettings />'
subtitle: Neon Auth account settings component
enableTableOfContents: true
tag: beta
---

Renders an `<AccountSettings />` page with customizable sidebar items and optional full-page layout.

![AccountSettings](/docs/neon-auth/account-settings.png)

## Props

- `fullPage` (optional): `boolean` — If true, renders the component in full-page mode.
- `extraItems` (optional): `Array` — Additional items to be added to the sidebar. Each item should have the following properties:
  - `title`: `string` — The title of the item.
  - `content`: `React.ReactNode` — The content to be rendered for the item.
  - `subpath`: `string` — The subpath for the item's route.
  - `icon` (optional): `React.ReactNode` — The icon component for the item. Only used if `iconName` is not provided.
  - `iconName` (optional): `string` — The name of the Lucide icon to be used for the item. Only used if `icon` is not provided.

## Example

```tsx
import { AccountSettings } from '@stackframe/stack';

export default function MyAccountPage() {
  return (
    <AccountSettings
      fullPage={true}
      extraItems={[
        {
          title: 'Custom Section',
          iconName: 'Settings',
          content: <CustomContent />,
          subpath: '/custom',
        },
      ]}
    />
  );
}
```
