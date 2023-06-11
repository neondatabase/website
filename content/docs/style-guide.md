# Neon style guide

Welcome to the Neon style guide

This document outlines the standards for writing documentation for Neon, covering areas such as grammar, formatting, and word usage.

If you have any questions related to style, please mention @tw-style in an issue or merge request. Alternatively, if you have access to the Neon Slack workspace, you can use the #docs-processes channel.

In addition to this guide, the following resources are available to help you create and contribute to documentation:

- Doc contribution guidelines
- Recommended word list
- Doc style and consistency testing
- Guidelines for UI error messages
- Documentation navigation
- Microsoft Style Guide
- Google Developer Documentation Style Guide

This guide is regularly updated to ensure that it reflects the latest standards for writing documentation for Neon.

## The Neon voice

The voice used in Neon's documentation aims to be clear, direct, and precise. The objective is to provide information that is easy to search and scan.

The language used in documentation should be approachable, yet succinct and to the point.

## Topic types

It is a common practice in the software industry to categorize documentation into different types, such as:

- Concepts
- Tasks
- Reference
- Troubleshooting

Where possible, Neon utilizes topic types in our documentation, as they offer several advantages:

- Improved Content Navigation: With a vast amount of information available in our documentation, topic types provide consistent structures that make our content easier to navigate and locate.
- Enhanced Readability: The consistent structures of topic types make our content easier to digest and understand, improving the overall readability of our documentation.
- Reader-Centered Focus: Our documentation is created by contributors, who may sometimes write from their own perspective. However, topic types (especially tasks) help present information in a manner that is more focused on assisting readers in achieving their goals, rather than solely documenting the implementation of a feature.

By incorporating topic types, Neon can improve the effectiveness and user-friendliness of our documentation, ensuring that readers can quickly locate and understand the information they need.

## Link instead of repeating text

In our documentation, we strive to avoid repeating information from other topics. Instead, we link to the original source of information and explain why it is important.

By doing so, we can:

- Ensure Consistency: When information is repeated in multiple locations, it can easily become outdated or conflicting. Linking to a single source of truth ensures that our documentation is consistent and up-to-date.

- Save Time: Repeating information in multiple locations takes time and effort to maintain. Linking to a single source of truth reduces the need for duplicating work and saves time.

- Reduce Confusion: Linking to a single source of truth helps readers to understand the context of the information they are reading and avoid confusion that may arise from contradictory information.

In summary, linking to a single source of truth helps to ensure consistency, save time, and reduce confusion, making our documentation more effective and user-friendly.

## Documenation-centric strategy

We adhere to an approach called 'documentation-centric strategy'. This approach ensures the maintenance of our comprehensive and trustworthy documentation, thereby facilitating effective communication about Neon's usage.

In instances where the response to a query can be found within our documentation, make sure to provide the link to the relevant section rather than paraphrasing the content.
If you come across novel information not currently present in Neon's documentation, such as during customer support interactions or while testing a feature, the initial step should be to initiate a merge request (MR) to incorporate this information into our documentation. This MR can then be shared to disseminate the information.

Crucial information that could be beneficial for future usage or troubleshooting of Neon should not be directly posted in a forum or other communication platforms. Instead, it should be incorporated into a documentation MR and subsequently referenced.

The more we instinctively incorporate information into our documentation, the more effectively it can assist others in completing tasks and resolving issues.

If you have any inquiries about creating, editing, or reviewing documentation, don't hesitate to contact our Technical Writing team. They are accessible on Slack at #docs or on Neon by tagging the writer assigned to the relevant DevOps stage or group. If not, proceed confidently with your best effort. It doesn't have to be perfect; the team is always ready to review and enhance your content. Prior to initiating your first documentation MR, make sure to review our Documentation guidelines.

Having a knowledge base distinct from our documentation would contradict our 'documentation-centric strategy', as there would be an overlap in the content.

## Markdown

All Neon documentation is created employing Markdown.

### HTML in Markdown

Although hard-coded HTML is valid, it is generally discouraged. HTML usage is permitted in situations where:

- There is no equivalent markup in Markdown.
- Complex tables are essential.
- Unique styling is needed.
- The inclusion is reviewed and authorized by a technical writer.

### Heading levels

Every page of the Neon documentation commences with a level 1 heading (#). This is translated into an h1 element when the page is converted to HTML. Each page should have only one level 1 heading.

- For each subsequent section, the heading level should be increased. In other words, add an additional # character before the topic title.
- Try to avoid heading levels beyond H5 (#####). If more than five heading levels are required, the topics should be relocated to a new page. Heading levels beyond - H5 are not displayed in the right sidebar navigation.
- Do not skip a level, e.g., do not go from ## to ####.
- Ensure there's a blank line before and after the topic title.
- If you incorporate code in topic titles, confirm that the code is enclosed in backticks.

### Backticks

Backticks are used for:

- Code blocks
- Error messages

### Markdown guidelines

Neon ensures that the Markdown employed throughout all documentation remains consistent and easy to review and maintain by implementing markdownlint to test documentation modifications. This lint test flags any document having a Markdown formatting issue that could potentially cause incorrect rendering in Neon. It also identifies any document containing non-standard Markdown (which might render accurately but doesn't comply with the current Neon documentation standards).

#### Capitalization

Generally, product names should align with the official names of the products, protocols, etc., maintaining exact capitalization.

Failure may occur if incorrect capitalization is applied in certain examples:

- MinIO (requires capital IO)
- NGINX (requires all capital letters)
- runit (requires lowercase r)

Moreover, commands, parameters, values, filenames, etc., should be enclosed in backticks. For example:

- "Modify the 'needs' keyword in your '.neon-ci.yml'..."
- 'needs' is a parameter, and '.neon-ci.yml' is a file, hence both require  backticks. Also, '.neon-ci.yml' without backticks would fail markdownlint as it doesn't have a capital N.
- "Execute 'git clone' to clone a Git repository..."
- 'git clone' is a command, which needs to be in lowercase, whereas Git is the product and should have a capital G.

## Language

The language used in Neon's documentation should be clear and easily understood.

- Eliminate unnecessary verbiage.
- Ensure clarity and brevity, staying focused on the topic's objective.
- Use US English and adhere to US grammar rules.

### Capitalization

The general rule is that we use lowercase wherever possible.

### Topic titles

Topic titles should be written in sentence case. For instance:

- "Connect from any client"
- "Create a database"
