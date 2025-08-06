# Dark/light mode

> The document outlines how to customize the Neon interface by switching between dark and light modes, detailing the steps and configurations necessary for users to implement these visual themes.

## Source

- [Dark/light mode HTML](https://neon.com/docs/neon-auth/customization/dark-mode): The original HTML version of this documentation

Neon Auth components support light and dark mode out of the box. All UI components automatically adapt their colors, shadows, and contrast levels based on the selected theme.

You can switch between light and dark mode using [next-themes](https://github.com/pacocoursey/next-themes) (or any other library that changes the `data-theme` or `class` to `dark` or `light` attribute of the `html` element).

Here is an example of how to set up next-themes with Neon Auth (find more details in the [next-themes documentation](https://github.com/pacocoursey/next-themes)):

## Install next-themes:

```bash
npm install next-themes
```

## Add the `ThemeProvider` to your `layout.tsx` file:

```jsx
import { ThemeProvider } from 'next-themes'

export default function Layout({ children }) {
return (
    {/*
    ThemeProvider enables theme switching throughout the application.
    defaultTheme="system" uses the user's system preference as the default.
    attribute="class" applies the theme by changing the class on the html element.
    */}
    <ThemeProvider defaultTheme="system" attribute="class">
    {/* StackTheme ensures Neon Auth components adapt to the current theme */}
    <StackTheme>
        {children}
    </StackTheme>
    </ThemeProvider>
)
}
```

## Build a color mode switcher component:

```jsx
'use client';
import { useTheme } from 'next-themes';

export default function ColorModeSwitcher() {
  // useTheme hook provides the current theme and a function to change it
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle dark mode"
    >
      {/* Display different text based on current theme */}
      {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    </button>
  );
}
```

Now if you put the `ColorModeSwitcher` component in your app, you should be able to switch between light and dark mode. There should be no flickering or re-rendering of the page after reloading.
