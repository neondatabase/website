---
title: Colors and  styles
subtitle: How to customize the look and feel of Neon Auth components
enableTableOfContents: true
---

Customizing the styles of your Neon Auth components allows you to maintain your brand identity while leveraging the pre-built functionality. This approach is ideal when you want to quickly align the authentication UI with your application's design system without building custom components from scratch. Neon Auth's theming system uses a React context to store colors and styling variables that can be easily overridden.

You can customize the following color variables to match your brand:

- `background`: Main background color of the application
- `foreground`: Main text color on the background
- `card`: Background color for card elements
- `cardForeground`: Text color for card elements
- `popover`: Background color for popover elements like dropdowns
- `popoverForeground`: Text color for popover elements
- `primary`: Primary brand color, used for buttons and important elements
- `primaryForeground`: Text color on primary-colored elements
- `secondary`: Secondary color for less prominent elements
- `secondaryForeground`: Text color on secondary-colored elements
- `muted`: Color for muted or disabled elements
- `mutedForeground`: Text color for muted elements
- `accent`: Accent color for highlights and emphasis
- `accentForeground`: Text color on accent-colored elements
- `destructive`: Color for destructive actions like delete buttons
- `destructiveForeground`: Text color on destructive elements
- `border`: Color used for borders
- `input`: Border color for input fields
- `ring`: Focus ring color for interactive elements

And some other variables:

- `radius`: border radius of components like buttons, inputs, etc.

These variables are CSS variables so you can use any valid CSS color syntax like `hsl(0, 0%, 0%)`, `black`, `#fff`, `rgb(255, 0, 0)`, etc.

The colors can be different for light and dark mode, allowing you to create a cohesive experience across both themes. You can pass these into the `StackTheme` component (in your `layout.tsx` file if you followed the Getting Started guide) as follows:

```jsx title="app/layout.tsx"
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
