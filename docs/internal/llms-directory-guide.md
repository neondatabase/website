# Adding Files to the llms.txt Directory

This guide explains how to add new files to the llms.txt directory for the Neon Postgres documentation website.

## Overview

The Neon website implements the [llms.txt standard](https://llmstxt.org/) to provide LLM-friendly documentation. All files are managed in the `/public/llms/` directory, which is served directly via the website.

## Adding New Files

When adding new framework or language guides to the llms.txt system, follow these steps:

### 1. Create the LLM-friendly .txt file

1. Identify the source documentation in `content/docs/get-started/frameworks/` or `content/docs/get-started/languages/`
2. Create a new .txt file in the `/public/llms/` directory following the naming convention:
   - For frameworks: `frameworks-{framework-name}.txt`
   - For languages: `languages-{language-name}.txt`
3. Convert the content to a plain-text, Markdown-formatted version optimized for LLM readability
4. Ensure all connection strings use placeholders like `[username]`, `[password]`, and `[neon_hostname]` instead of real or example credentials

Example:

```markdown
# Connect a [Framework/Language] application to Neon

This guide describes how to create a Neon project and connect to it from a [Framework/Language] application.

1. Create a Neon project
2. Configure the connection

## Create a Neon project

[Standard instructions for creating a Neon project]

## Configure the connection

[Framework/Language-specific connection instructions]
```

### 2. Update the root llms.txt file

1. Open the root `llms.txt` file in the `public/` directory
2. Add a new entry in the appropriate section (Frameworks or Languages)
3. Follow the existing format:
   ```
   - [Neon Frameworks - {Framework Name}](https://neon.com/llms/frameworks-{framework-name}.txt): Brief description
   ```

### 3. Commit and push the changes

1. Stage the new files:
   ```bash
   git add public/llms/frameworks-{framework-name}.txt public/llms.txt
   ```
2. Commit the changes:
   ```bash
   git commit -m "feat: add {framework-name} guide to llms.txt"
   ```
3. Push the changes:
   ```bash
   git push
   ```

## Testing

After deployment, verify that the new files are accessible at:

- https://neon.com/llms/frameworks-{framework-name}.txt
- https://neon.com/llms/languages-{language-name}.txt

Also verify that the links in the root llms.txt file (https://neon.com/llms.txt) correctly point to the new files.

## Security Considerations

- Never include real credentials or connection strings in the .txt files
- Always use placeholders like `[username]`, `[password]`, and `[neon_hostname]`
- Sanitize any example code to remove potentially sensitive information
