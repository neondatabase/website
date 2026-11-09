# WebMCP evals

Eval cases for the neon.com WebMCP tools (`search_neon_site`, `read_neon_page`, `open_neon_page`), registered by `src/components/shared/webmcp-tools`. The format is the one used by Chrome's [`webmcp-evals`](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/webmcp-evals) CLI, described in [WebMCP Evals](https://developer.chrome.com/docs/ai/webmcp/evals).

Each case pairs a user request with the tool calls an agent should make. Add a case when you add a tool or change a tool's name, description, or parameters.

## Smoke test (no model or API key)

Runs every expected call against a live page in Chrome with WebMCP enabled, and fails if a tool is missing or errors. Start the site first (`npm run dev`), then:

```bash
npx webmcp-evals smoke --chrome-channel chrome -u http://localhost:3000/ -e tests/webmcp/evals.json -v
```

Locally, `search_neon_site` answers "Search is temporarily unavailable" unless `NEON_AGENT_SITE_SEARCH_URL` is set. Against a deployed URL it returns real results.

## Model evals

Checks that a model picks the right tool with the right arguments for each request. This needs an API key for the model provider in a `.env` file where you run the command (for example `GOOGLE_GENERATIVE_AI_API_KEY` for Gemini through the default `vercel` backend):

```bash
npx webmcp-evals browser --chrome-channel chrome -u http://localhost:3000/ -e tests/webmcp/evals.json --model google:gemini-3.5-flash --open
```

Reports are written to `.evals/`. When a case fails, adjust the tool's description or schema in `src/utils/webmcp.js` rather than adding a rule for one model.

## Try a tool by hand

In Chrome, enable `chrome://flags/#enable-webmcp-testing`, open the site, and use DevTools > **Application** > **WebMCP** to see the registered tools, run one, and inspect each call's input and output.
