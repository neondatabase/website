---
title: StackTheme Component
subtitle: Neon Auth theme provider component
enableTableOfContents: true
tag: beta
---

# `<StackTheme />`

A component that applies a theme to its children.

For more information, see the [color and styles guide](/docs/neon-auth/customization/custom-styles).

## Props

- `theme` (optional): `ThemeConfig` — Custom theme configuration to override the default theme.
- `children` (optional): `React.ReactNode` — Child components to be rendered within the themed context.

## Example

```tsx
const theme = {
  light: {
    primary: 'red',
  },
  dark: {
    primary: '#00FF00',
  },
  radius: '8px',
}

// ...

<StackTheme theme={theme}>
  {/* children */}
</StackTheme>
```
