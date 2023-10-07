---
title: Contribution Guide
subtitle: Learn how to contribute to the Neon documentation
enableTableOfContents: true
isDraft: true
updatedOn: '2023-10-07T10:54:49.271Z'
---

This page offers guidelines on how to contribute to the Neon documentation. Our goal is to create an environment where our community has the information and knowledge required to confidently participate in improving the Neon documentation.

## Why should you contribute?

Open-source projects are always evolving. Contributing to documentation is a great way for beginners to get started in open source and for experienced developers to explain complex topics while sharing their knowledge with the community.

By contributing to the Neon docs, you're helping us create a stronger learning resource for all developers. Whether you've found a typo, a section that's hard to understand, or you've noticed that a certain topic is missing, your contribution is always welcome and appreciated.

## How to contribute

The content for the documentation is located in the [Neon website repository](https://github.com/neondatabase/website), in the `/content/docs` directory. To contribute, you have two options:

1. Edit files directly on GitHub.
2. Fork the `neondatabase/website` repository, create a branch for your changes, and submit a pull request.

If you prefer the first option, which is great for edits and small updates, there is an **Edit this page** link at the bottom of each Neon documentation page.

![GitHub edit this page link](/docs/community/edit_this_page.png)

Clicking the link takes you to the Markdown file in GitHub, where you can click the **Edit this page** icon to make a change. When you are finished editing, commit your changes to create a pull request.

If you want to fork the `neondatabase/website` repository and submit pull requests, but you're not familiar with the process, we suggest going through the [GitHub Open Source Guide](https://opensource.guide/how-to-contribute/#opening-a-pull-request). This guide describes how to fork a repository, create a branch, and submit a pull request.

## Markdown

Neon uses Markdown as the documentation source format. Markdown is a lightweight markup language that lets you add formatting elements to plaintext text documents. It's designed to be easy to read and write.

If you're new to Markdown, GitHub provides an excellent guide to get you started. The [GitHub Markdown Documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) covers most of the basic writing and formatting syntax you'll need to contribute to the Neon docs.

## Preview changes in VSCode

At Neon, we use VSCode for writing documentation. VSCode includes a built-in markdown previewer that you can use to view your changes locally.

To use this feature, open the command palette (⌘ + ⇧ + V on Mac or Ctrl + Shift + V on Windows). This opens a preview window for viewing your changes in formatted Markdown.

## Contribution review process

After you submit a contribution, the Neon documentation team reviews your changes, provides feedback, and merges the pull request when it's ready.

Please reach out if you have any questions or need further assistance.

## Documentation file structure

The Neon documentation file structure reflects the navigation you see on the website. However, the order of the directories under `/content/docs/` is alphabetical.

```text
├── content
   └── docs
       ├── connect
       ├── extensions
       ├── get-started-with-neon
       ├── guides
       ├── introduction
       ├── manage
       ├── security
       ├── serverless
       └── tutorial
```

- Every Markdown file in the `/docs` folder becomes a documentation page unless it's defined with an `isDraft: true` property in the page [frontmatter](#markdown-frontmatter).
- Folder and file names should use [kebab-case](https://en.wiktionary.org/wiki/kebab_case) (hyphens between words).

## Documentation table of contents

This section describes how to modify the documentation table of contents, also referred to as the "sidebar". Adding, removing, or moving a page in the documentation requires updating the sidebar. The sidebar is defined in a `yaml` file, conveniently named `sidebar.yaml`, which you can find at the root of the `/docs` directory.

### Add a new category

To add a new category to the sidebar, add a new item to the top-level array with `title` and `items` key values, as shown below:

For example:

```diff
 - title: Category 1
   items:
     - title: Page 1
       slug: page-1
+- title: Category 2
+  items:
+    - title: Page 2
+      slug: page-2
```

### Add a new subcategory

To add a new subcategory, add a new item to `items` array with keys `title` and `items` under a specific category.

For example:

```diff yaml
 - title: Category 1
   items:
     - title: Page 1
       slug: page-1
 - title: Category 2
   items:
     - title: Page 2
       slug: page-2
+    - title: Subcategory 1
+      items:
+        - title: Page 3
+          slug: page-3
```

### Add a new page

To add a new page to the root level, add a `slug` at the same level as the `title`.

```diff yaml
 - title: Root page 1
   items:
     - title: Page 1
       slug: page-1
 - title: Root page 2
   items:
     - title: Page 2
       slug: page-2
+ - title: Root page 1
+   slug: root-page-1
+   items:
+     - title: Page 1
+       slug: page-1
+ - title: Root page 2
+   slug: root-page-2
+   items:
+     - title: Page 2
+       slug: page-2

```

To add new page under a category, add a new item to the `items` array with the `title` and `slug` keys under the category or subcategory:

For example:

```diff yaml
 - title: Category 1
   items:
     - title: Page 1
       slug: page-1
 - title: Category 2
   items:
     - title: Page 2
       slug: page-2
    - title: Subcategory 1
      items:
        - title: Page 3
          slug: page-3
+       - title: Page 4
+         slug: page-4
+   - title: Page 5
+     slug: page-5
```

- The `title` in the sidebar may differ from `title` in the Markdown file. For example, your sidebar title might be a shorter version of the title in your Markdown file.
- `slug` should always match page's slug.

### Add a single page

To add a single page to the docs sidebar, add the `title` with a slug, without an `items` entry. For example:

```diff yaml
+- title: Release notes
+  slug: release-notes
 - title: Category 1
   items:
     - title: Page 1
       slug: page-1
 - title: Category 2
   items:
     - title: Page 2
       slug: page-2
    - title: Subcategory 1
      items:
        - title: Page 3
          slug: page-3
```

## Markdown frontmatter

Each Neon documentation Markdown file includes frontmatter section at the beginning of the file containing file metadata. The frontmatter section is distinguished by three dashes. For example:

```yaml
---
tile: Page Title
enableTableOfContents: true
---
```

The only required attribute is `title`, which is the page title that appears on the page and in the browser tab.

### Optional frontmatter attributes

Optional attributes include:

Field | Explanation
----- | ---
subtitle |  A secondary title or description that appears on the page, under the main title.
enableTableOfContents | A boolean flag (i.e., true or false) that tells the static site generator whether or not to generate a right-hand table of contents for the page. We recommend adding this option if your page has more than a few sections.
redirectFrom | A list of directory paths that should redirect to this file. This is useful if the page has moved and you want old URLs to continue working.

Example:

```yaml
---
title: Connect a Next.js application to Neon
subtitle: Set up a Neon project and connect from a Next.js application
enableTableOfContents: true
redirectFrom:
  - /docs/content/<old_directory_name>
---
```

## Heading levels

The page title in the frontmatter is translated into an `h1` element when the page is converted to HTML.

Top-level section headings in the body of your document are defined with two hash characters, which is equivalent to an `h2` heading:

```md
## Section heading
```

- To add subsection headings, add a another `#` character
- Try to avoid heading levels beyond h4 (`####`).
- Do not skip a level, e.g., do not go from `##` to `####`.
- Ensure there's a blank line before and after the heading.

## Common markup

```md
External link markup: [Example.com website](https://www.example.com/)
Neon documentation page link: [Connection from any application](/docs/connect/connect-from-any-app)
Neon documentation same page link: [Code blocks](#code-blocks)
Italics markup: *italic*
Bold markup: **strong**
monospace: `backtick`
```

## Code blocks

To insert a code block into your Markdown file, specify three backticks (```) on the lines before and after the code. Specify the language identifier to enable code highlighting, as in this example:

````md
```sql
SELECT * FROM posts ORDER BY id;
```
````

You can add language-specific highlighting to code blocks, as in the example above. See [Supported language highlighting for code blocks](https://prismjs.com/index.html#supported-languages).

You can also wrap code blocks in `<CodeBlock></CodeBlock>` tags to show line numbers or wrap long strings.

`<CodeBlock>` accepts the following options:

- `showLineNumbers`: Shows the line numbers in the code block
- `shouldWrap`: Enables code wrapping in the code block. This is useful for long commands or connection strings that would otherwise require the reader to scroll.

Example:

````md
<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?connect_timeout=15&pool_timeout=15`
```

</CodeBlock>
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

To view this example in the Neon documentation, see [Create a Next.js project and add dependencies](https://neon.tech/docs/guides/nextjs#create-a-nextjs-project-and-add-dependencies).

## Admonitions

The Neon documentation supports the following admonitions:

- Note
- Important
- Tip
- Warning
- Info

To use an admonition, enclose your text with `<Admonition></Admonition>` and specify the admonition type: `note`, `important`, `tip`, `warning`, and `info`. The default is `note`.

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

If possible, please take screen captures on a high resolution monitor (UHD/4K). Screen captures should be unaltered (no borders or special effects).

Diagrams and images are stored in the `/public/docs` directory in the Neon website repository. The directory location of the diagram or image under `public` mirrors the location of the file that includes the diagram or image, as shown below:

Example file structure:

```md
├── content
│ ├── docs
│   ├── introduction
│     ├── architecture-overview.md


├── public
│ ├── docs
│   ├── introduction
│     ├── neon_architecture.png // put images in the public directory with the same name
```

To add an image to your Markdown file, add an entry that looks like this:

```md
![Neon architecture diagram](/docs/introduction/neon_architecture.png)
```

## Style Guide

This section outlines the stylistic elements that we try to follow in the Neon documentation.

### Voice and language

The voice in the documentation should sound like a human being explaining something important to another human being while striking the right This page offers guidelines on how to contribute to the Neon documentation. Our goal is to create an environment where our community has the information and knowledge required to confidently participate in improving the Neon documentation.

### Guidelines

1. **Use contractions**:
    - **Do**: Use contractions like "it's", "don't", "you're" to make the tone more conversational.
      - *Example*: "It's essential to save your progress."
    - **Don't**: Overuse contractions where clarity is compromised.

2. **Simplicity over jargon**:
    - **Do**: Choose simpler words when possible.
      - *Example*: "Use the tool," not "Utilize the instrument."
    - **Don't**: Oversimplify to the point of being inaccurate.

3. **Active voice**:
    - **Do**: Prefer active voice.
      - *Example*: "The software converts the file."
    - **Don't**: Over-rely on passive voice.
      - *Example*: "The file is converted by the software."

4. **Brief sentences**:
    - **Do**: Keep sentences concise.
      - *Example*: "Check the settings."

5. **Personalize when relevant**:
    - **Do**: Use "you" to address the reader.
      - *Example*: "You can adjust the setting."
    - **Don't**: Overdo direct addresses. Not every sentence should start with "You".

6. **Consistent terminology**:
    - **Do**: Stick to one term for one concept.
      - *Example*: Always use "dashboard", not sometimes "control panel".
    - **Don't**: Confuse with synonyms.
      - *Example*: Switching between "log-in", "sign-in", and "access point".

7. **Examples for clarity**:
    - **Do**: Provide clear examples.
      - *Example*: "For instance, to upload a file, click on the 'Upload' button."

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

- Neon tiers and plans. For example, Neon Free Tier, Neon Pro Plan.
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
postgres://[user]:[password]@[neon_hostname]/[dbname]
```

If you need to provide a connection string with realistic values, use one of the user names mentioned above, `AbC123dEf` for the password, and `dbname` for the database name:

```text
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

### Commands, parameters, values, filenames

Commands, parameters, values, filenames, error messages, connection strings, and other similar items should be enclosed in backticks. For example:

- "Run the `neonctl projects list` command."

- "Execute 'git clone' to clone a Git repository..."

- 'git clone' is a command that should be in lowercase, whereas Git is the product and should have a capital G.

- "A connection string has this format: `postgres://[user]:[password]@[neon_hostname]/[dbname]`"

## Questions?

If you have questions or run into any issues, please reach out to us on the [Neon Community forum](https://community.neon.tech/).
