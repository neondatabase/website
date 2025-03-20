# MarkdownSnippet Component Documentation

The `MarkdownSnippet` component allows technical writers to embed Markdown content from external sources directly into the documentation pages. This component is useful for keeping embedded content in sync with the original repository while maintaining our site's look and feel.

## Usage

There are two versions of the component:

1. `MarkdownSnippet` - Client-side rendering (loads content when the page is viewed)
2. `MarkdownSnippetServer` - Server-side rendering (loads content at build time)

### Client-side Example

```jsx
import MarkdownSnippet from 'components/shared/markdown-snippet';

<MarkdownSnippet 
  url="https://raw.githubusercontent.com/neondatabase/neon/main/README.md"
  title="Neon README"
/>
```

### Server-side Example

```jsx
import { MarkdownSnippetServer } from 'components/shared/markdown-snippet';

// In an async component:
<MarkdownSnippetServer 
  url="https://raw.githubusercontent.com/neondatabase/neon/main/README.md"
  title="Neon README"
/>
```

## Props

| Prop        | Type      | Default                           | Description                                             |
|-------------|-----------|-----------------------------------|---------------------------------------------------------|
| url         | string    | (required)                        | URL to the raw Markdown file                            |
| className   | string    | ''                                | Additional CSS classes to apply to the component         |
| fallback    | string    | 'Failed to load Markdown content' | Content to display if loading fails                     |
| showSource  | boolean   | true                              | Whether to show a link to the source                    |
| title       | string    | ''                                | Optional title to display above the snippet             |

## When to Use

- Use `MarkdownSnippetServer` (server-side) for stable content that doesn't change frequently, as it will only be fetched at build time.
- Use `MarkdownSnippet` (client-side) for content that changes more frequently, as it will fetch the latest version on each page load.

## Best Practices

1. Always use raw URLs from the GitHub repository (e.g., `https://raw.githubusercontent.com/...`).
2. Include a descriptive title to help readers understand the content's context.
3. For critical content, implement a fallback message in case the remote content fails to load.
4. Consider caching strategies for frequently accessed but rarely changed content.

## Limitations

- The component can only render Markdown content, not HTML or other formats.
- Very large Markdown files may impact performance, especially for client-side rendering.
- External content might break if the source repository restructures its files or changes URLs.
