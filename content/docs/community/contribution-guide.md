---
title: Neon Documentation Contribution Guide
subtitle: Learn how to contribute to the Neon documentation
enableTableOfContents: true
---

Welcome to the _Neon Documentation Contribution Guide_.

This page offers guidelines on how to contribute to the Neon documentation. Our goal is to create an environment where our community has the information and knowledge required to confidently participate in enhancing the documentation.

## Why Should You Contribute?

Open-source projects and their documentation are always evolving. Contributing to documentation is a great way for beginners to get started in open-source, and for experienced developers to explain complex topics while sharing their knowledge with the community.

By contributing to the Neon docs, you're helping us create a stronger learning resource for all developers. Whether you've found a typo, a section that's hard to understand, or you've noticed that a certain topic is missing, your contributions are always welcome and very much appreciated.

## How to Contribute

The content for the documentation is located in the [Neon website repository](https://github.com/neondatabase/website), in the `doc/content/` directory. To make a contribution, you have two options: you can either edit the files directly on GitHub, or you can clone the repo and edit the files on your local machine. If you prefer the former option, which is great for edits and small updates, there is an **Edit this page** link at the bottom of each Neon documentation page.

![GitHub edit this page link](/docs/community/edit_this_page)

Clicking the link takes you to the Markdown file in GitHub, where you can click the Edit this page icon to make a change. When you are finished editing, commit your changes and create a pull request.

## Working with GitHub

If you're not familiar with GitHub, we suggest going through the [GitHub Open Source Guide](https://opensource.guide/how-to-contribute/#opening-a-pull-request). This guide will teach you how to fork a repository, create a branch, and submit a pull request.

## Markdown

Neon utilizes Markdown as the source format for its documentation. Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. It's designed to be easy-to-read and easy-to-write.

If you're new to Markdown, GitHub provides an excellent guide to get you started. The [GitHub Markdown Documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) covers most of the basic writing and formatting syntax you'll need to contribute to the Neon docs.

## Previewing changes in VSCode

At Neon, we use VSCode for writing documentation. VSCode includes a built-in markdown previewer that you can use to view your changes locally.

To use this feature, open the command palette (⌘ + ⇧ + P on Mac or Ctrl + Shift + P on Windows) and search for `Markdown: Open Preview` or `Markdown: Open Preview to the Side`. This will open a preview window where you can see your changes in formatted markdown.

### VSCode Extensions

For an enhanced experience while working with markdown files in VSCode, we recommend the following extensions:

- [Grammarly](https://marketplace.visualstudio.com/items?itemName=znck.grammarly): This extension helps with grammar and spell checking.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): This extension automatically formats markdown files when you save them, ensuring consistent style and formatting.

## Contribution Review Process

After you've submitted your contribution, the Neon documentation team will review your changes, provide feedback, and merge the pull request when it's ready.

Don't hesitate to reach out if you have any questions or need further assistance in the comments of your PR. We appreciate your contribution to the Neon docs and your participation in our community!

## Documentation file structure

The Neon documentation file structure reflects the navigation that you see on the website. However, the order of the directories in the repository, under `/content/docs/` are alphabetical.

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

## Markdown front matter

Each Neon documentation Markdown file includes front matter section at the beginning of the file, distinguished by three dashes. For example:

```yaml
---
tile: Page Title
enableTableOfContents: true
---
```

The only required attribute is `title`, which is the title of the page as it will appear in the browser tab and in the header of the webpage.

### Optional attributes

Optional attributes include:

Field | Explanation
----- | ---
subtitle |  A secondary title or description that appears on the page, under the main title.
enableTableOfContents | A boolean flag (i.e., true or false) that tells the static site generator whether or not to generate a a right-hand table of contents for the page.
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

## Code blocks

To insert a code block into your Markdown file, specify three backticks (```) on the lines before and after the code.
Specify the language identifier to enable code highlighting, as in this example:

````md
```sql
SELECT * FROM elements ORDER BY id;
```
````

Supported languages include those found [here](https://prismjs.com/index.html#supported-languages).

To display code with options, wrap your code with `<CodeBlock></CodeBlock>` component.

Currently, `<CodeBlock>` accepts the following options:

- `showLineNumbers`: Shows the line numbers in the code block
- `shouldWrap`: Enables code wrapping in the code block. This is useful for long command or connection strings that would otherwise require the reader to scroll.

Example:

````md
<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb?connect_timeout=15&pool_timeout=15`
```

</CodeBlock>
````

## Admonitions

The Neon documentation supports the following admonitions:

- Note
- Important
- Tip
- Warning
- Info

To use an admonition, enclose your text with `<Admonition></Admonition>` and specify the admonition type: `note`, `important`, `tip`, `warning`, and `info`. The default is `note`.

You may also specify an optional title with the `title` property.

```md
<Admonition type="note" title="Your title">
  The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation.
</Admonition>

<Admonition type="info">
  The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation.
</Admonition>
```

<details>
<summary>Examples</summary>

![Admonition example](admonition-example.jpg)

</details>
