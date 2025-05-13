# Update llms.txt files

## Task

Update llms.txt files to match changes in source markdown content.

## Procedure

1. Identify changed markdown files in content/docs/{directory}

2. Create/update corresponding .txt files in llms/ and public/llms/ following the [llmstxt.org](https://llmstxt.org/) standard:
   - Add a summary line at the beginning with `>` prefix
   - Include a "Source" section with link to the original HTML documentation
   - Convert all relative URLs to absolute URLs (e.g., `/docs/guides/example` → `https://neon.tech/docs/guides/example`)
   - Format admonitions properly (e.g., "Note:", "Warning:", "Important:")
   - Preserve code blocks and their language specifications
   - Maintain proper heading hierarchy

3. Maintain consistent formatting and credential placeholders

4. Update both llms/ and public/llms/ directories for each file

5. Check for and update any references to renamed files (e.g., endpoints.md → computes.md)

6. Verify all files have been processed by comparing the count of markdown files to llms.txt files

## Requirements

- Follow llmstxt.org standard format
- Use placeholders for credentials
- Preserve technical depth and readability
- Update both llms/ and public/llms/ directories
- Include source HTML links in each llms.txt file
- Convert all relative URLs to absolute URLs
