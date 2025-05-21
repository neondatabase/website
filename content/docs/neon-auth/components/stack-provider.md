---
title: StackProvider Component
subtitle: Neon Auth provider component for React context
enableTableOfContents: true
tag: beta
---

A React component that provides Neon Auth context to its children.

For detailed usage instructions, see the manual section of the [setup guide](/docs/neon-auth).

## Props

- `children`: `React.ReactNode` — The child components to be wrapped by the StackProvider.
- `app`: `StackClientApp | StackServerApp` — The Neon Auth app instance to be used.
- `lang` (optional): `"en-US" | "de-DE" | "es-419" | "es-ES" | "fr-CA" | "fr-FR" | "it-IT" | "pt-BR" | "pt-PT"` — The language to be used for translations.
- `translationOverrides` (optional): `Record<string, string>` — A mapping of English translations to translated equivalents. These will take priority over the translations from the language specified in the `lang` property. Note that the keys are case-sensitive. You can find a full list of supported strings [on GitHub](https://github.com/stack-auth/stack-auth/blob/dev/packages/template/src/generated/quetzal-translations.ts).

## Example

```tsx title="layout.tsx"
import { StackProvider } from '@stackframe/stack';
import { stackServerApp } from '@/stack';

function App() {
  return (
    <StackProvider
      app={stackServerApp}
      lang="de-DE"
      translationOverrides={{
        "Sign in": "Einloggen",
        "Sign In": "Einloggen",
      }}
    >
      {/* Your app content */}
    </StackProvider>
  );
}
```
