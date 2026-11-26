// Headers for the site's own fetches of .md files: client-side (prompt text
// loaded on page load, the Copy page button) and the proxy's own markdown
// fetches (it fetches /pricing.md, /index.md, /blog/<slug>/md, ... to serve
// them). The proxy counts every .md request as an agent read, so without this
// header each of these would record an extra agent visit. `Purpose: prefetch` is the same signal the
// proxy already skips for browser pre-loads (isNonReadRequest in
// utils/ai-agent-detection.js). `Sec-Purpose` can't be used here: browsers drop
// `Sec-` headers set from JavaScript.
export const NON_AGENT_FETCH_HEADERS = { Purpose: 'prefetch' };
