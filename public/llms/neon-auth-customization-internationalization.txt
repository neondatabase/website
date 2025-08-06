# Internationalization

> The "Internationalization" document outlines the process for customizing language settings in Neon applications, detailing how to implement and manage multilingual support within the platform.

## Source

- [Internationalization HTML](https://neon.com/docs/neon-auth/customization/internationalization): The original HTML version of this documentation

Internationalization (i18n) allows your application to support multiple languages, making it accessible to users worldwide. Neon Auth provides built-in internationalization support for its components, enabling you to offer a localized authentication experience with minimal effort.

## Setup

Internationalization with Neon Auth is very straightforward. Simply pass the `lang` prop to the `StackProvider` component, and all the pages will be translated to the specified language.

```jsx
...
  <StackProvider ... lang={'de-DE'}>
    ...
  </StackProvider>
...
```

By default, if no language is provided, it will be set to `en-US`.

You can choose which languages to use by employing your own methods, such as storing the language in `localStorage` or using the user's browser language.

## Supported languages

- `en-US`: English (United States)
- `de-DE`: German (Germany)
- `es-419`: Spanish (Latin America)
- `es-ES`: Spanish (Spain)
- `fr-CA`: French (Canada)
- `fr-FR`: French (France)
- `it-IT`: Italian (Italy)
- `pt-BR`: Portuguese (Brazil)
- `pt-PT`: Portuguese (Portugal)
- `zh-CN`: Chinese (China)
- `zh-TW`: Chinese (Taiwan)
- `ja-JP`: Japanese (Japan)
- `ko-KR`: Korean (South Korea)
