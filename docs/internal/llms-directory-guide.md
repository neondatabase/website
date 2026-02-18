# LLM documentation (llms.txt) – current approach

The Neon website implements the [llms.txt standard](https://llmstxt.org/) to provide LLM-friendly documentation. Content is generated at build time from source MDX in `content/docs/` (and other content routes).

We used to keep `.txt` files in `public/llms/`; we don't anymore. Don't add entries to `llms-redirect-map.json`; that map is frozen. New content is served at its `.md` URL from the build.

**How it works**

On each build, postbuild runs two scripts:

- `copy-md-content.js`: runs the processor (`process-md-for-llms.js`), which converts MDX to plain markdown and writes it under `public/md/`
- `generate-llms-index.js`: builds the table of contents and writes `public/docs/llms.txt`

**References**

- To add or change what LLMs see, edit the source in `content/docs/` (and other content routes as needed).
- User-facing guide (how to get Markdown, discovery, headers): [llms-markdown-guide.md](../../content/docs/community/llms-markdown-guide.md) → live at `/docs/community/llms-markdown-guide`.
- Processor and index internals: [LLMS_PROCESSOR_GUIDE.md](../../src/scripts/LLMS_PROCESSOR_GUIDE.md).
