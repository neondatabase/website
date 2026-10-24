I want to host my own MCP server on Neon Functions, served from my own custom domain.

Use this guide as a reference:
https://neon.com/guides/deploy-mcp-server-on-neon-functions

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon login` and wait for me to complete sign-in before continuing.

3. Ask me what I want to build, and whether I want to:
   - follow the example in the guide closely,
   - modify the example with different tools or a different database schema,
   - or build a different MCP server that uses the same Neon features.

4. Ask only the questions you need to understand my requirements. For example:
   - Which tools should the MCP server expose, and over which tables?
   - Do I want authentication, and if so, an API key or OAuth with Better Auth?
   - Do I have a domain to serve the MCP server from, and do I have access to its DNS settings?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials the plan will actually need.

6. Wait for my confirmation before making significant changes.

7. Implement the MCP server step by step following the guide's patterns. Use the Neon CLI (`neon link`) and select **Functions** as the service `neon.ts` declares, with the `aws-us-east-2` region, one of the regions where Neon Functions are available. Declare the function under top-level `functions` in `neon.ts`. Install the agent skills the guide lists: `neon skills -s neon -s neon-postgres -s neon-functions -y`. Build the server first and verify it with `neon dev` and `mcporter` before deploying. Use the MCP TypeScript SDK with `createMcpHandler`, and serve the endpoint at `/mcp` from a Hono app.

8. If I choose a custom domain, declare it under `customDomains` in `neon.ts`, walk me through creating the CNAME record at my DNS provider, and verify HTTPS with `curl` before moving on. Never proceed to OAuth configuration until the custom domain serves the function successfully, because the OAuth issuer and resource identifiers depend on it.

9. If I choose authentication, ask me which method I want to use:
   - **API key**: When I have a single user or a small number of users who can share a key.
   - **OAuth with Better Auth**: When I have multiple users accessing the MCP server.

10. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
    - Tell me exactly what it is used for.
    - Show me where to get it or how to generate it.
    - Tell me where the credential should be stored in my project.

11. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

12. After implementation, show me how to:
    - run the server locally with `neon dev` and call a tool with `mcporter`,
    - deploy the function with `neon deploy`,
    - verify the custom domain serves the function,
    - and connect an MCP client such as Cursor to the server, including the browser sign-in and consent flow if OAuth is enabled.

13. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, and similar) without showing me the exact command first and getting my explicit approval.

Never print connection strings, secrets, tokens, or other credentials back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
