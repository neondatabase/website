---
title: Contribution Guide
subtitle: Learn how to contribute to the Neon documentation
enableTableOfContents: true
isDraft: true
---

This page offers guidelines on how to contribute to the Neon documentation. Our goal is to create an environment where our community has the information and knowledge required to confidently participate in enhancing the Neon documentation.

## Why should you contribute?

Open-source projects and their documentation are always evolving. Contributing to documentation is a great way for beginners to get started in open source and for experienced developers to explain complex topics while sharing their knowledge with the community.

By contributing to the Neon docs, you're helping us create a stronger learning resource for all developers. Whether you've found a typo, a section that's hard to understand, or you've noticed that a certain topic is missing, your contributions are always welcome and appreciated.

## How to contribute

The content for the documentation is located in the [Neon website repository](https://github.com/neondatabase/website) in the `docs/content/` directory. To make a contribution, you have two options: you can edit files directly on GitHub or fork the repo and edit the files on your local machine. If you prefer the former option, which is great for edits and small updates, there is an **Edit this page** link at the bottom of each Neon documentation page.

![GitHub edit this page link](/docs/community/edit_this_page.png)

Clicking the link takes you to the Markdown file in GitHub, where you can click the **Edit this page** icon to make a change. When you are finished editing, commit your changes to create a pull request.

## Working with GitHub

If you're not familiar with GitHub, we suggest going through the [GitHub Open Source Guide](https://opensource.guide/how-to-contribute/#opening-a-pull-request). This guide will teach you how to fork a repository, create a branch, and submit a pull request.

## Markdown

Neon uses Markdown as the source format for its documentation. Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. It's designed to be easy-to-read and easy-to-write.

If you're new to Markdown, GitHub provides an excellent guide to get you started. The [GitHub Markdown Documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) covers most of the basic writing and formatting syntax you'll need to contribute to the Neon docs.

## Previewing changes in VSCode

At Neon, we use VSCode for writing documentation. VSCode includes a built-in markdown previewer that you can use to view your changes locally.

To use this feature, open the command palette (⌘ + ⇧ + V on Mac or Ctrl + Shift + V on Windows). This will open a preview window where you can see your changes in formatted markdown.

### VSCode extensions

For an enhanced experience while working with markdown files in VSCode, we recommend the following extensions:

- [Grammarly](https://marketplace.visualstudio.com/items?itemName=znck.grammarly): This extension helps with grammar and spell checking.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): This extension automatically formats markdown files when you save them, ensuring consistent style and formatting.

## Contribution review process

After you have submitted your contribution, the Neon documentation team will review your changes, provide feedback, and merge the pull request when it is ready.

Please reach out if you have any questions or need further assistance. We appreciate your contribution and your participation in our community.

## Documentation file structure

The Neon documentation file structure reflects the navigation that you see on the website. However, the order of the directories in the repository, under `/content/docs/`, are alphabetical.

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

- Every Markdown file in the `/docs` folder becomes a documentation page unless it is defined with an `isDraft: true` property in the page frontmatter.
- Folder and file names should use kebab-case.

## Documentation table of contents

This section describes how to modify the documentation left-hand table of contents, also referred to as the "sidebar". Adding, removing, or moving a page to the documentation requires modifying the sidebar. The sidebar is managed in a `yaml` file conveniently named `sidebar.yaml`, which is found in at the root of the `/docs` directory.

### How to add a new category

In order to add a new category to the sidebar, add a new item to the top level array with keys `title` and `items`.

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

### How to add a new subcategory

To add a new subcategory, add a new item to `items` array with keys `title` and `items` under specific category.

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

### How to add a new page

To add a new page to the root level, add `slug` in the same level with `title`.

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

In order to add new page under a category, add a new item to the `items` array with keys `title` and `slug` under the category or subcategory:

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

- `title` in the sidebar may differ from `title` in Markdown file.
- `slug` should always match page's slug.

### How to add a single page

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

The only required attribute is `title`, which is the title of the page as it will appear in the browser tab and in the header of the webpage.

### Optional attributes

Optional attributes include:

Field | Explanation
----- | ---
subtitle |  A secondary title or description that appears on the page, under the main title.
enableTableOfContents | A boolean flag (i.e., true or false) that tells the static site generator whether or not to generate a a right-hand table of contents for the page. We recommend adding this option if your page has more than a few sections.
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

Tne page title in the frontmatter is translated into an h1 element when the page is converted to HTML.

- For each subsequent section, the heading level should be increased. In other words, add an additional # character before the topic title.
- Try to avoid heading levels beyond h4 (`####`).
- Do not skip a level, e.g., do not go from `##` to `####`.
- Ensure there's a blank line before and after the heading.

## Common markup

```md
Link markup: [link](/)
Italics markup: *italic*
Bold markup: **strong**
monospace: `baktick`
```

## Code blocks

To insert a code block into your Markdown file, specify three backticks (```) on the lines before and after the code. Specify the language identifier to enable code highlighting, as in this example:

````md
```sql
SELECT * FROM elements ORDER BY id;
```
````

Supported languages include those found [here](https://prismjs.com/index.html#supported-languages).

To display code with options, you can wrap your code with `<CodeBlock></CodeBlock>` component.

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

## Code Tabs

To display code tabs, enclose all pieces of code withing `<CodeTabs></CodeTabs>`, and specify  code tabs labels in order, as shown in the following example:

````md
<CodeTabs labels={["Shell", "C++", "C#", "Java"]}>

```bash
#!/bin/bash
STR="Hello World!"
echo $STR
```

```c++
#include <iostream>

int main() {
    std::cout << "Hello World";
    return 0;
}
```

```csharp
namespace HelloWorld
{
    class Hello {
        static void Main(string[] args)
        {
            System.Console.WriteLine("Hello World");
        }
    }
}
```

```java
import java.io.*;

class GFG {
    public static void main (String[] args) {
       System.out.println("Hello World");
    }
}
```

</CodeTabs>
````

<details>
<summary>Code tabs example</summary>

![Code tabs example](/docs/community/code-tabs-example.jpg)

</details>

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

![Admonition example](/docs/community/admonition-example.jpg)

</details>

## Diagrams and images

Diagrams are a great tool for clarifying complex ideas. Neon uses Figma for the creation of diagrams.

If you're interested in updating or adding a diagram, please open a GitHub issue with your suggestions. Please include a draft, if possible. A tool like [tldraw](https://www.tldraw.com/) can be used to create a draft.

Screen captures should be taken on a high resolution monitor (UHD/4K) and should be unaltered (no borders or special effects).

Diagrams and images reside in the `/public/docs` directory in the Neon website repository. You can add a diagram or image to an `.md` file by specifying a relative path beginning with a slash `/`. The directory location of the diagram or image un  `public` should mirror the location of the file that will include the diagram or image, as shown below:

Example file structure:

```md
├── content
│ ├── docs
│   ├── introduction
│     ├── architecture-overview.md
├── public
│ ├── docs
│   ├── introduction
│     ├── neon_architecture_2.png // put images in a public directory with the same name
```

For example, to add an image to a file, add an entry that looks like this:

```md
![Neon architecture diagram](/docs/introduction/neon_architecture_3.png)
```

## Style Guide

This section outlines the stylistic elements that we do our best to adhere to in the Neon documentation.

### Voice

The voice in the documentation strives to be conversational but brief, friendly but succinct.

### Language

The language used in Neon's documentation should be clear and easily understood.

- Avoid unnecessary verbiage.
- Ensure clarity and brevity, staying focused on the topic's objective.
- Use US English and adhere to US grammar rules.

We do not use emojis or exclamation marks in the Neon documentation.

### Link instead of repeating text

We strive to avoid repeating information from other topics. Instead, we link to the original source of information and explain why it is important.

### Capitalization

The general rule is that we use lowercase wherever possible.

For topic titles, we use sentence-style capitalization. For example: "Create your first project"

Generally, product names should align with the official names of the products, protocols, etc., maintaining exact capitalization.

#### UI text

When referencing specific user interface text, such as button labels or menu items, we use the same capitalization displayed in the user interface wherever possible.

#### Feature names

Generally, feature names should be lowercase.

#### Other terms

Capitalize names of:

- Neon tiers. For example, Neon Free Tier, Neon Pro Plan.
- Third-party organizations, software, and products. Kubernetes, Git, and Vercel.
- Methods or methodologies. Continuous Integration, Continuous Deployment, etc.

Follow the capitalization style used by authoritative source, which may use non-standard case styles. For example: PostgreSQL, GitHub, npm.

### Fake user information

When including user information in API calls or UI instructions, do not use real user information or email addresses.

- Use an email address ending in example.com.
- Use strings like example_username or diverse or non-gendered names with common surnames, such as Pat Smith, Jiang Wei, or Alex Lopez.

### Commands, parameters, values, filenames

Commands, parameters, values, filenames, and error messages should be enclosed in backticks. For example:

"Execute 'git clone' to clone a Git repository..."

'git clone' is a command, which needs to be in lowercase, whereas Git is the product and should have a capital G.

## Questions?

If you have questions or run into any issues, please reach out to us on the [Neon Community forum](https://community.neon.tech/).
