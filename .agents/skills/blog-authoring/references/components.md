# Blog components

Blog posts support only the components registered in `src/components/pages/blog-post/blog-post-page/blog-post-page.jsx`. Don't assume a docs component is available.

Ordinary Markdown headings, links, lists, tables, images, and fenced code blocks are supported. Use a custom component only when it improves the article.

## Admonition

Use when readers could miss a risk, requirement, correction, or time-sensitive status.

```mdx
<Admonition type="important" title="Update">
This feature is now available to all users.
</Admonition>
```

Types:

- `note`: Information worth noticing.
- `important`: Information required to interpret or use the post correctly.
- `tip`: Optional practical advice.
- `info`: Explanatory context.
- `warning`: Risk or destructive behavior.
- `comingSoon`: A capability that isn't available yet.

Don't use admonitions for routine prose or promotional claims.

## BlogQuote

Use for a short attributed quotation. Verify the wording, speaker, role, and permission before publishing.

```mdx
<BlogQuote
  quote="A verified quotation without surrounding quotation marks."
  author="Dana Smith"
  role="Staff engineer at Example"
  photo="https://cdn.neonapi.io/public/images/people/dana-smith.jpg"
/>
```

`quote` and `author` are required. `role` and `photo` are optional. Link the primary source in nearby prose when one exists.

## CodeTabs

Use for equivalent code in different languages, clients, package managers, or runtimes.

````mdx
<CodeTabs labels={["JavaScript", "Python"]}>

```javascript
const result = await client.query('SELECT 1');
```

```python
cursor.execute("SELECT 1")
```

</CodeTabs>
````

Keep examples equivalent and labels aligned with code-block order. Use ordinary fenced code when only one example is needed.

## CTA

Use for one focused next action, usually near the end of the post.

```mdx
<CTA
  title="Try Neon"
  description="Create a project and connect your application."
  buttonText="Create a project"
  buttonUrl="https://console.neon.tech/signup"
/>
```

All four props are required. Don't use multiple competing CTAs or send all readers to plan-gated support.

## EmbedTweet

Use when the original post on X is evidence or part of the story. Explain its relevance in nearby prose because the embed may be unavailable to some readers.

```mdx
<EmbedTweet url="https://x.com/example/status/1234567890" />
```

Don't use an embed as the only source for a factual claim that needs a durable citation.

## RequestForm

Use only for an approved request or early-access campaign already configured in `src/components/shared/request-form/data.js`.

```mdx
<RequestForm type="backend-platform" />
```

The `type` is required and must exist in the component data. Title, description, button text, and confirmation can be overridden, but the type still controls options and analytics. Don't invent a type in a post.

## YoutubeIframe

Use for a YouTube tutorial, talk, or demo that supports the written article.

```mdx
<YoutubeIframe embedId="IcoOpnAcO1Y" />
```

Use only the video ID. Introduce the video in prose and keep the essential information available in text.

## Images and code blocks

Markdown images are rendered with zoom:

```md
![Descriptive alt text](https://cdn.neonapi.io/public/images/pages/blog/<slug>/<filename>)
```

Fenced code blocks are highlighted by language:

````md
```sql
SELECT now();
```
````

Use a language identifier. Keep examples complete enough to understand and safe to copy.
