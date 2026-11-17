I want to host my own MCP server on Neon Functions, served from my own custom domain or the native Neon Function URL.

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
   - Do I want authentication, and if so, an API key or OAuth with Managed Better Auth?
   - Do I want to reuse an existing Neon project or create a new one?
   - Do I have a domain to serve the MCP server from, and do I have access to its DNS settings?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials the plan will actually need.

6. Wait for my confirmation before making significant changes.

7. Implement the MCP server step by step following the guide's patterns. Link the project with the Neon CLI: run `neon link` and complete the prompts (accept the `neon.ts` setup and select **Functions** as the service it declares), or, if you can't answer interactive prompts, use `neon init -y --no-agent-setup --services functions --org-id <org-id> --project-name <name> --region-id aws-us-east-2`. To reuse an existing project in a supported region, pass `--project-id <id>` instead of the org, name, and region flags. Use a region where Neon Functions are available, such as `aws-us-east-2`, or reuse an existing project if it's already in one of those regions. Declare the function under top-level `functions` in `neon.ts`. Install the agent skills the guide lists: `neon skills -s neon -s neon-postgres -s neon-functions -s neon-auth -y`. Create the `contacts` table with the guide's Drizzle migration (`npx drizzle-kit generate` and `npx drizzle-kit migrate`) before starting the dev server. Build the server first and verify it with `neon dev` and `npx mcporter` before deploying. Use the MCP TypeScript SDK with `createMcpHandler`, and serve the endpoint at `/mcp` from a Hono app.

8. If I choose a custom domain, declare it under `customDomains` in `neon.ts`, confirm the function is on the default branch (a static `customDomains` entry applies to the default branch only), walk me through creating the CNAME record at my DNS provider, and verify HTTPS with `curl` before moving on. Never proceed to OAuth configuration until the custom domain serves the function successfully, because the MCP server URL and the login and consent pages depend on it.

9. If I chose authentication, implement it using the method I picked; if I haven't decided yet, ask me which method I want:
   - **API key**: When I have a single user or a small number of users who can share a key.
   - **OAuth with Managed Better Auth**: When I have multiple users accessing the MCP server. This uses Managed Better Auth's OAuth provider plugin (beta), so I host only the login and consent pages and the function verifies tokens.

10. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
    - Tell me exactly what it is used for.
    - Show me where to get it or how to generate it.
    - Tell me where the credential should be stored in my project.

11. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

12. After implementation, show me how to:
    - run the server locally with `neon dev` and call a tool with `npx mcporter`,
    - deploy the function with `neon deploy` (use `neon deploy --env .env.local` once `neon.ts` declares variables such as `MCP_API_KEY`),
    - verify the custom domain (or the native Function URL) serves the function,
    - and connect an MCP client such as Cursor to the server, including the browser sign-in and consent flow if OAuth is enabled.

13. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, and similar) without showing me the exact command first and getting my explicit approval. If `neon deploy` stops and asks for `--allow-protected`, `--update-existing`, or `-y`, show me the changes it printed and ask me before re-running with any of them.

Never print connection strings, secrets, tokens, or other credentials back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
