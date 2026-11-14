---
title: Docs contribution guide
subtitle: Learn how to contribute to the Neon documentation
summary: >-
  How to contribute to Neon content in the neondatabase/website repository.
  Fixes to the Neon docs and PostgreSQL tutorials are welcome. New guides are
  considered for the community guides section. Function templates and examples
  are also welcome. Covers how to submit a pull
  request, add yourself as a guide author, frontmatter, navigation.yaml,
  Markdown, components, and style rules.
enableTableOfContents: true
updatedOn: '2026-09-17T16:33:54.884Z'
---

Thanks for helping improve Neon content. This page explains ways to contribute, how to submit a contribution, and the Markdown and style conventions we follow.

## Ways to contribute

We welcome contributions of many kinds. Some common ones:

- **Docs and tutorial updates:** Improve existing pages in the [Neon docs](/docs) or [PostgreSQL tutorials](/postgresql), from fixing a typo to clarifying a confusing section.
- **Community guides:** Share a walkthrough of building something with Neon. New guides are generally considered for the [community guides](#contribute-a-community-guide) section rather than the main documentation.
- **Function templates:** Add a reusable function to the Neon Function Registry. See [Contribute a function template](/docs/compute/functions/registry).
- **Examples:** Add a sample app or code example to the [neondatabase/examples](https://github.com/neondatabase/examples) repository.

Have another idea? Reach out on our [Discord server](https://neon.com/discord).

We appreciate every contribution, but we can't accept all of them. What we publish is at Neon's discretion and depends on factors such as fit with our products and direction, value to Neon users, adoption of the tools covered, and overlap with existing content.

We review every contribution. We may test your instructions and code, ask for revisions, make revisions ourselves, or decide not to merge it. By submitting, you agree that Neon can edit, update, or remove your contribution at any time, including guides published under your name.

## How to contribute

Docs, tutorials, and guides live in the [neondatabase/website](https://github.com/neondatabase/website) repository: Neon docs in `/content/docs`, PostgreSQL tutorials in `/content/postgresql`, and community guides in `/content/guides`.

- **Small fixes:** Click **Edit this page** at the bottom of any docs page, make your change on GitHub, and commit it to open a pull request.

  ![GitHub edit this page link](/docs/community/edit_this_page.png)

- **Larger changes and guides:** Fork the repository, create a branch, and open a pull request. If you're new to this, see the [GitHub Open Source Guide](https://opensource.guide/how-to-contribute/#opening-a-pull-request).

## Contribute a community guide

Each Markdown file in `/content/guides` becomes a page under [neon.com/guides](/guides). Guides don't need a `navigation.yaml` entry.

1. Create a kebab-case file such as `content/guides/my-tool-neon.md`. The file name becomes the URL.
1. Add frontmatter. Only `title` is required, and the title renders as the page heading, so don't add an `h1`. See the [guides README](https://github.com/neondatabase/website/blob/main/content/guides/README.md#fields) for all fields.

   ```yaml
   ---
   title: Build a search API with My Tool and Neon
   subtitle: Use My Tool to index and query data stored in Neon
   author: alex-lopez
   enableTableOfContents: true
   createdAt: '2026-11-14T00:00:00.000Z'
   ---
   ```

1. Put images in `/public/guides/images/<guide-name>/` and reference them as `/guides/images/<guide-name>/image.png`.
1. Write a self-contained walkthrough with working code, following the [Style guide](#style-guide) below.

### Add yourself as an author

1. Add an entry to `content/guides/authors/data.json`. The key is your author ID, your name in kebab-case. Only `name` is required.

   ```json
   "alex-lopez": {
     "name": "Alex Lopez",
     "position": "Developer Advocate",
     "bio": "Alex writes about databases and developer tooling.",
     "link": { "title": "GitHub", "url": "https://github.com/example_username" }
   }
   ```

1. Add a square photo named `<your-id>.jpg` to `public/guides/authors/`, for example `alex-lopez.jpg`. It must be a `.jpg` file with that exact name, or it won't display.
1. Set `author: alex-lopez` in your guide's frontmatter. For multiple authors, use `authors: [alex-lopez, dana-smith]`.

If you've contributed before, reuse your existing ID.

## Markdown

Neon uses Markdown as the documentation source format. Markdown is a lightweight markup language that lets you add formatting elements to plaintext text documents. It's designed to be easy to read and easy to write.

If you're new to Markdown, GitHub provides an excellent guide to get you started. The [GitHub Markdown Documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) covers most of the basic writing and formatting syntax you'll need to contribute to the Neon docs.

For advanced formatting and custom components, see the [Component Guide](/docs/community/component-guide). To add visual diagrams to your documentation, check out our [Mermaid Diagrams Guide](/docs/community/mermaid-diagrams).

## Preview changes in VSCode

At Neon, we use VSCode for writing documentation. VSCode includes a built-in markdown previewer that you can use to view your changes locally.

To use this feature, open the command palette (⌘ + ⇧ + V on Mac or Ctrl + Shift + V on Windows). This opens a preview window for viewing your changes in formatted Markdown.

## Documentation file structure

The Neon documentation file structure reflects the navigation you see on the website. However, the order of the directories under `/content/docs/` is alphabetical.

```text
└── content
  └── docs
    ├── ai
    ├── community
    ├── connect
    ├── extensions
    ├── get-started
    ├── guides
    ├── introduction
    ├── manage
    ├── reference
    ├── security
    └── serverless
```

- Every Markdown file in the `/docs` folder becomes a documentation page unless it's defined with an `isDraft: true` property in the page [frontmatter](#markdown-frontmatter).
- Folder and file names should use [kebab-case](https://en.wiktionary.org/wiki/kebab_case) (hyphens between words).

## Documentation table of contents

This section describes how to modify the documentation table of contents, also referred to as the "sidebar". Adding, removing, or moving a page in the documentation requires updating the sidebar. The sidebar is defined in `navigation.yaml`, which you can find at the root of the `/docs` directory.

Refer to the [## Navigation](https://github.com/neondatabase/website/blob/main/content/docs/README.md#navigation) in the docs README for more information on how to update the sidebar.

## Markdown frontmatter

Each Neon documentation Markdown file includes a frontmatter section at the beginning of the file containing file metadata. The frontmatter section is distinguished by three dashes, as shown here:

```yaml
---
tile: Page Title
enableTableOfContents: true
---
```

The only required attribute is `title`, which becomes the page title that appears on the page and the browser tab.

### Frontmatter attributes

Frontmatter attributes include:

| Attribute             | Description                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| subtitle              | A secondary title or description that appears on the page, under the main title.                                                                                                                                      |
| enableTableOfContents | A boolean flag (i.e., true or false) that tells the static site generator whether to generate a right-hand table of contents for the page. We recommend adding this option if your page has more than a few sections. |
| isDraft               | Adding this attribute and setting it to `true` prevents the page from becoming a documentation page and being searchable. Include this option to avoid publishing the content before it's ready.                      |
| redirectFrom          | A list of directory paths that should redirect to this file. This is useful if the page has moved and you want old URLs to continue working.                                                                          |
| updatedOn             | This attribute is added automatically. You do not need to add it.                                                                                                                                                     |

Example:

```yaml
---
title: Connect a Next.js application to Neon
subtitle: Set up a Neon project and connect from a Next.js application
enableTableOfContents: true
redirectFrom:
  - /docs/content/<old_directory_name>
updatedOn: '2023-10-07T12:25:27.662Z'
---
```

## Heading levels

The page title in the frontmatter is translated into an `h1` element when the page is converted to HTML.

Top-level section headings in the body of your document are defined with two hash characters, which is equivalent to an `h2` heading:

```md
## Section heading
```

To add a subsection heading, equivalent to an `h3`, add another `#` character:

```md
### Subsection heading
```

- Try to avoid heading levels beyond h4 (`####`).
- Do not skip a level, for example, do not go from `##` to `####`.
- Ensure there's a blank line before and after each heading.

## Common markup

```md
External link markup: [Example.com website](https://www.example.com/)
Neon documentation page link: [Connection from any application](/docs/connect/connect-from-any-app)
Neon documentation same page link: [Code blocks](#code-blocks)
Italics markup: _italic_
Bold markup: **strong**
monospace: `backtick`
```

## Comment tags

To comment out content in a markdown file use this construction:

```md
[comment]: <> (Single line comment.)

[comment]: <> (
Multiline comment.
You can't use line breaks or () parentheses here.
)
```

If you need to comment out more complicated blocks of code you can use JSX-style comments:

```md
{/*

content

*/}
```

Unfortunately, JSX-style comments have problems with Prettier, so in case of using them you should add your file to [.prettierignore](https://github.com/neondatabase/website/blob/main/.prettierignore).

## Code blocks

To insert a code block into your Markdown file, specify three backticks (```) on the lines before and after the code. Specify the language identifier to enable code highlighting, as in this example:

````md
```sql
SELECT * FROM posts ORDER BY id;
```
````

You can add language-specific highlighting to code blocks, as in the example above. See [Supported language highlighting for code blocks](https://shiki.matsu.io/languages).

Code block accepts the following options:

- `showLineNumbers`: Shows the line numbers in the code block
- `shouldWrap`: Enables code wrapping in the code block. This is useful for long commands or connection strings that would otherwise require the reader to scroll.

Example:

````md
```bash shouldWrap
A really long line that scrolls off the page
```
````

## Code tabs

To display code tabs, enclose all pieces of code within `<CodeTabs></CodeTabs>` and specify labels in order, as shown in the following example:

````md
<CodeTabs labels={["node-postgres", "postgres.js"]}>

```shell
npm install pg
```

```shell
npm install postgres
```

</CodeTabs>
````

To view this example in the Neon documentation, see [Create a Next.js project and add dependencies](/docs/guides/nextjs#create-a-nextjs-project-and-add-dependencies).

## Admonitions

The Neon documentation supports the following admonitions:

- Note
- Important
- Tip
- Warning
- Info

To use an admonition, enclose your text with `<Admonition></Admonition>` and specify the admonition type: `note`, `important`, `tip`, `warning`, and `info`. The default is `note`.

For a complete list of available components and their usage, see the [Component Guide](/docs/community/component-guide).

```md
<Admonition type="note">
This is an important note
</Admonition>
```

You can specify a title with the `title` property.

```md
<Admonition type="note" title="Very important note">
This is a very important note.
</Admonition>
```

Example output:

<Admonition type="note" title="Very important note">
This is a very important note.
</Admonition>

## Diagrams and screen captures

Neon uses Figma to create diagrams.

If you're interested in updating or adding a diagram, please open a GitHub issue with your suggestions. Please include a draft, if possible. You can use a tool like [tldraw](https://www.tldraw.com/) to create a draft.

For technical details about how components are implemented, see the [Component Architecture](/docs/community/component-architecture) guide.

If possible, please take screen captures on a high resolution monitor (UHD/4K). Screen captures should be unaltered (no borders or special effects).

Diagrams and images are stored in the `/public/docs` directory in the Neon website repository. The directory location of the diagram or image under `public` mirrors the location of the file that includes the diagram or image, as shown below:

Example file structure:

```md
├── content
│ ├── docs
│ │ ├── introduction
│ │ │ ├── architecture-overview.md

├── public
│ ├── docs
│ │ ├── introduction
│ │ │ ├── neon_architecture.png // put images in the public directory with the same name
```

To add an image to your Markdown file, add an entry that looks like this:

```md
![lakebase architecture diagram](/docs/introduction/neon_architecture.png)
```

## Style Guide

This section covers the style conventions we follow.

### Voice and language

The voice in the documentation should sound like one human being explaining something to another, while striking the right balance between being approachable and professional.

#### Guidelines

1. **Use contractions**:
   - **Do**: Use contractions like "it's", "don't", "you're" to make the tone more conversational.
     - _Example_: "It's essential to save your progress."
   - **Don't**: Overuse contractions, which can compromise clarity.

2. **Simplicity over jargon**:
   - **Do**: Choose simpler words when possible.
     - _Example_: "Use the tool," not "Utilize the instrument."
   - **Don't**: Oversimplify to the point of being inaccurate or leaving out useful context.

3. **Active voice**:
   - **Do**: Prefer active voice.
     - _Example_: "The software converts the file."
   - **Don't**: Over-rely on passive voice.
     - _Example_: "The file is converted by the software."

4. **Brief sentences**:
   - **Do**: Keep sentences concise.
     - _Example_: "Check the settings."

5. **Personalize when relevant**:
   - **Do**: Use "you" to address the reader.
     - _Example_: "You can adjust the setting."
   - **Don't**: Overdo direct addresses. Not every sentence should start with "You".

6. **Consistent terminology**:
   - **Do**: Stick to one term for one concept.
     - _Example_: Always use "dashboard". Don't mix that term with "control panel".
   - **Don't**: Confuse with synonyms.
     - _Example_: Switching between "log-in", "sign-in", and "access point".

7. **Examples for clarity**:
   - **Do**: Provide clear examples.
     - _Example_: "For instance, to upload a file, click on the 'Upload' button."

8. **Use US English**:
   - **Do**: Adhere to US English spelling and grammar rules.

9. **Avoid emojis and exclamations**:
   - **Don't**: Use emojis or exclamation marks in the documentation.

### Link instead of repeating text

Avoid repeating or duplicating information from other topics. Instead, link to the original source of information and explain why it is important.

### Capitalization

Use lowercase wherever possible.

For topic titles, use sentence-style capitalization. For example: "Create your first project"

Product names should align with the official names of the products, protocols, etc., maintaining exact capitalization.

#### UI text

When referencing specific user interface text, such as button labels or menu items, use the same capitalization displayed in the user interface wherever possible.

#### Feature names

Generally, feature names should be lowercase.

#### Other terms

Capitalize names of:

- Third-party organizations, software, and products. Kubernetes, Git, and Vercel.
- Methods or methodologies. Continuous Integration, Continuous Deployment, etc.

Follow the capitalization style used by the authoritative source, which may use non-standard case styles. For example: PostgreSQL, GitHub, npm.

### Fake user information

When including user information in connection details, API calls, or UI instructions, don't use real user information or email addresses.

- Use an email address ending in `@example.com` or `domain.com`.
- Use strings like `example_username` or one of the following diverse and non-gendered names: Zhang Kai, Alex Lopez, or Dana Smith.

### Connection strings

Connection strings should be defined as follows:

```text
postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

If you need to provide a connection string with realistic values, use one of the user names mentioned above, `AbC123dEf` for the password, and `dbname` for the database name:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

### Commands, parameters, values, filenames

Commands, parameters, values, filenames, error messages, connection strings, and other similar items should be enclosed in backticks. For example:

- "Run the `neon projects list` command."

- "Execute `git clone` to clone a Git repository..."

- `git clone` is a command that should be in lowercase, whereas Git is the product and should have a capital G.

- "A connection string has this format: `postgresql://[user]:[password]@[neon_hostname]/[dbname]`"

## Working with doc AI

The Neon website repo includes rules and commands (in Cursor and Claude) to keep documentation consistent. You don't need to memorize them.

- **Open the doc** you're editing so the right rules apply, then describe what you want in plain language.
- **Optional:** You can ask for specific help (for example "check consistency on this page," "use our style examples," or "walk me through the redirect steps.").
- **Curious what's available?** Ask: "What doc AI tools are available?" to see the list.
- All changes go through a pull request and human review.

For the full list of tools, see [AI tools for documentation](/docs/community/ai-tools).

## Additional Resources

These resources are also worth bookmarking:

- **[Component Guide](/docs/community/component-guide)**: Complete reference for common MDX components
- **[Component Specialized Guide](/docs/community/component-specialized)**: Advanced and specialized components
- **[Component Icon Guide](/docs/community/component-icon-guide)**: Icon systems and usage guidelines
- **[Component Architecture](/docs/community/component-architecture)**: Technical implementation details

<NeedHelp/>
