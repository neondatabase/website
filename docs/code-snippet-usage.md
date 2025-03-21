# CodeSnippet Component Documentation

The `CodeSnippet` component allows technical writers to embed raw code content from external sources directly into the documentation pages. This component fetches files at build time and displays them as code blocks with syntax highlighting.

## Usage

```jsx
import CodeSnippet from 'components/shared/code-snippet';

<CodeSnippet 
  url="https://raw.githubusercontent.com/neondatabase/neon/main/README.md"
  title="Neon README"
/>
```

## Props

| Prop        | Type      | Default                         | Description                                             |
|-------------|-----------|--------------------------------|---------------------------------------------------------|
| url         | string    | (required)                     | URL to the raw file                                     |
| language    | string    | ''                             | Language for syntax highlighting (defaults to file extension) |
| className   | string    | ''                             | Additional CSS classes to apply to the component         |
| fallback    | string    | 'Failed to load code snippet'  | Content to display if loading fails                     |
| showSource  | boolean   | true                           | Whether to show a link to the source                    |
| title       | string    | ''                             | Optional title to display above the snippet             |

## Features

- **Build-time Fetching**: Files are fetched at build time for optimal performance and SEO.
- **Syntax Highlighting**: Automatically detects language from file extension or uses provided language prop.
- **Error Handling**: Displays fallback content if the file cannot be fetched.
- **Source Link**: Optionally shows a link to the original source file.
- **Multi-file Support**: Works with various file types (.md, .ts, .js, .py, etc.).

## Examples

### TypeScript File

```jsx
<CodeSnippet 
  url="https://raw.githubusercontent.com/neondatabase/serverless/main/index.ts"
  title="Neon Serverless Driver"
/>
```

### Markdown File as Raw Text

```jsx
<CodeSnippet 
  url="https://raw.githubusercontent.com/neondatabase/neon/main/README.md"
  title="Neon README"
/>
```

### Custom Language Specification

```jsx
<CodeSnippet 
  url="https://raw.githubusercontent.com/neondatabase/neon/main/config.txt"
  language="yaml"
  title="Configuration File"
/>
```

## Best Practices

1. Always use raw URLs from the GitHub repository (e.g., `https://raw.githubusercontent.com/...`).
2. Include a descriptive title to help readers understand the content's context.
3. For critical content, implement a fallback message in case the remote content fails to load.
4. Use the `language` prop when the file extension doesn't match the actual content type.
