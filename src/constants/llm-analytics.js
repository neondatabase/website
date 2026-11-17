// Headers for the site's own client-side fetches of .md files (prompt text
// loaded on page load, the Copy page button). The proxy counts every .md
// request as an agent read, so these requests would make each human page view
// also look like an agent visit. `Purpose: prefetch` is the same signal the
// proxy already skips for browser pre-loads (isNonReadRequest in
// utils/llm-analytics.js). `Sec-Purpose` can't be used here: browsers drop
// `Sec-` headers set from JavaScript.
export const NON_AGENT_FETCH_HEADERS = { Purpose: 'prefetch' };
