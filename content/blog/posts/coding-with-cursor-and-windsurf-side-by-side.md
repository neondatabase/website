---
title: Coding With Cursor and Windsurf Side by Side
description: Getting a taste of vibe coding
excerpt: >-
  Since the release of GitHub Copilot, AI integration in IDEs has evolved
  dramatically. Now, two IDEs are being talked about more than any other:
  Windsurf and Cursor. Both tools are forks of VSCode, offer a similar set of
  features, and use Anthropic’s Claude model under the hood. I...
date: '2025-03-20T00:41:40'
updatedOn: '2025-03-26T19:56:11'
category: ai
categories:
  - ai
authors:
  - sam-harrison
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/coding-with-cursor-and-windsurf-side-by-side/cover.png
  alt: null
isFeatured: true
seo:
  title: Coding With Cursor and Windsurf Side by Side - Neon
  description: >-
    Cursor and Windsurf are AI-powered IDEs based on VSCode. We try them both
    for tab completions, context management, and agentic workflows.
  keywords: []
  noindex: false
  ogTitle: Coding With Cursor and Windsurf Side by Side - Neon
  ogDescription: >-
    Cursor and Windsurf are AI-powered IDEs based on VSCode. We try them both
    for tab completions, context management, and agentic workflows.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/coding-with-cursor-and-windsurf-side-by-side/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/coding-with-cursor-and-windsurf-side-by-side/neon-pgversus-1024x576-662c2ec8.png)

Since the release of GitHub Copilot, AI integration in IDEs has evolved dramatically. Now, two IDEs are being talked about more than any other: Windsurf and Cursor. Both tools are forks of VSCode, offer a similar set of features, and use Anthropic’s Claude model under the hood.

I vibe coded with both IDEs and took some notes, using my experience developing the Neon Python driver as a guiding example.

## What feels the same?

![Post image](https://cdn.neonapi.io/public/images/pages/blog/coding-with-cursor-and-windsurf-side-by-side/ad4nxcyibkhej0hw179mbmibie7hui3afd18m-zm-cic979agfsyqvsdwylsi2oy9ufbd-pkco3rmosq3yepbazbriyxxwkabrm44d9rdxahcjkfijgx8szz5ud8uob3wzicnv6vea-9b5492a6.gif)

On the surface, Windsurf and Cursor feel strikingly similar. So much so that at first glance, you might think you’re simply looking at two VSCode windows. This means you get the familiar editor you already know and love, with the extensive extension marketplace and setting customization still available.

Both editors provide the same general interface with the chat window on the right, and the same feature set you’ve come to expect from AI-powered IDEs, like better tab completions, multi file refactoring, agent-based workflows, and context management.

## Tab Completions: Cursor’s Tab vs. Windsurf’s Tabs

I find tab completions one of the most important features of any AI-powered IDE, and it’s where I noticed the biggest productivity gains when developing the Neon Python driver compared to my old setup.

While both Windsurf and Cursor offer far better autocomplete experiences than GitHub Copilot, Cursor’s tab completions are particularly impressive. Specifically, I’d often make a small change at the top of a file that would need further adjustments below, and Cursor consistently predicted exactly what I needed next—I could just `tab-tab-tab` my way through the file.

For a long time, Cursor held the edge in tab completions when compared to Windsurf’s SuperComplete. But Windsurf is shipping fast. As I was writing this article, they released Windsurf Wave 5, which introduced the Windsurf Tab, and the gap has narrowed. Previously, Cursor felt more aware of the codebase for tabs and provided more useful completions, but Windsurf autocompletions now benefit from the same context engine that powers its AI Agent Cascade, along with a larger and more powerful model.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/coding-with-cursor-and-windsurf-side-by-side/ad4nxfe0qatfcgdpjt6sawiu9vj11cswfm-u6rbzxwf5yot0urewlwoljuorn0zh8pravqu5uqr415s92rgs0cbhyypp23ydnshzitx6qzn3hsdlb27krqaehlv3ke2z6jcciocoof-pa-d5a8d8c7.gif)

## Context management: Attaching the relevant information

Context management, or the way IDEs handle relevant information to inform their AI suggestions, is another important differentiator. Cursor offers robust support for custom rules that can be conditionally applied based on file type, directory, and other factors. For instance, I easily defined a set of Python rules with strict type hinting, NumPy-style docstrings, and other linting preferences. Throughout my development, Cursor adhered perfectly to these rules, saving me a lot of time in docstring writing and code-style preference refactoring. Windsurf also has built-in rule management, with support for both global rules and rules local to the project, but not for rule file pattern matching or semantic description attachment.

Yet Windsurf excels in one crucial area: context indexing. Its automatic indexing and understanding of the project structure felt superior. For example, when I made changes to the core logic of the application, Windsurf would reach out to the tests directory and update the relevant unit and integration tests. Cursor is also capable of this, but it requires prompting to get it there, which gets tedious and can easily be forgotten. On the other hand, it offers a wider variety of options for attaching content including most recent changes, git history, lint errors, and most importantly custom docs. Here, at the beginning of my project I was able to create a custom documentation context for Psycopg which I could easily reference.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/coding-with-cursor-and-windsurf-side-by-side/ad4nxdjx5u3jdi1tambdz2fswfm454p5psa7vtk0clidp8loq8kcmwngwledwimuiai9rwvc0hkvqx50ueruzqng4ci5kb07wpu4kjx3flacktvpp0dcus70fe428gp3f1hzelazbh-c89e6363.gif)

Windsurf offers only a pre-set documentation library without the means to extend it, though you can attach the link of the documentation as web context to achieve a very similar result. Despite this limitation in customizable context attachments, Windsurf’s automatic context management is really a standout feature and as AI models continue to evolve, this strength will only become more pronounced.

## Agent mode: Cursor’s Composer vs Windsurf’s Cascade

Both Windsurf’s Cascade and Cursor’s Composer offer agentic workflows, which allow LLMs to intelligently interact with your codebase, automate repetitive tasks, and implement entire features.

In practice, I found that both still struggled with more complex coding scenarios. For instance, when implementing Python-to-Postgres type conversions in the Neon driver, both agents had difficulty leveraging Psycopg effectively, because the conversion needed to happen without establishing an actual database connection. Even after I devised a clear implementation plan and explicitly provided it in the prompt instructions, neither IDE could successfully execute without significant manual prompting.

All hope is not lost, as both agents shined in many other tasks like tests and frontend development. In the case of testing, they generated robust, comprehensive unit and integration tests, accelerating development by at least a few hours without any detailed prompting. For this alone, the agents are well worth having integrated in the IDE. What’s more, to see how each of these fared in more line-heavy development, I tried both out in a React project of mine. After asking for the same component, they each generate working solutions, though Windsurf clearly had a broader understanding of my codebase, utilising some of my custom hooks and API endpoints many directories away.

## Conclusion

Both Cursor and Windsurf significantly boosted my productivity when porting the SQL-over-HTTP driver to Python. They both have strengths in different areas —to me,

- **Cursor** excelled in tab completions, and offered tighter, more intuitive control, providing better confidence in the AI coding workflow.
- **Windsurf** offered better and automatic context indexing, leading to a more “magical” feeling agentic workflow.

This vibe coding experiment not only provided insights into these two IDEs but also unveiled a new way to use Neon. You can now leverage Neon more effectively in Python serverless functions (e.g., AWS Lambdas or Azure Functions) by using SQL over HTTP for efficient single-shot queries and transactions.

Check out the repository [here](https://github.com/sam-harri/neon-pyserverless)!
