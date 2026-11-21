---
title: 'Client ID Metadata Documents or dynamic client registration: which should my MCP server support?'
subtitle: 'Support Client ID Metadata Documents (CIMD) first. The MCP spec recommends it, ChatGPT and Claude both use it, and it avoids the open registration endpoint that dynamic client registration (DCR) needs. Turn on DCR only for clients that cannot use CIMD.'
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I check which Postgres version my Neon database is running?'
  slug: check-postgresql-version-neon
nextLink:
  title: 'Which database services let you instantly clone a production Postgres database so developers can test independently?'
  slug: clone-production-postgres-database-for-testing
updatedOn: '2026-11-21T16:25:19.720Z'
---

Start with Client ID Metadata Documents (CIMD), and add dynamic client registration (DCR) only if a client you need can't use CIMD. The current MCP spec says authorization servers and clients **should** support CIMD and **may** support DCR ([MCP authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization)).

Both solve the same problem. Your MCP server can't know every AI app that will connect to it, so you can't create an OAuth client for each one in advance. The two approaches let a client introduce itself the first time it connects.

## How they differ

|                            | CIMD                                                                   | DCR (RFC 7591)                                                        |
| -------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **How the client appears** | Its `client_id` is an `https` URL that serves a JSON document about it | It calls your registration endpoint and gets a new `client_id`        |
| **Who controls identity**  | The client's own domain                                                | Whoever calls your endpoint, with any name and redirect URI           |
| **What builds up**         | Nothing to clean up: the document is fetched when it's used            | A new registered client on your server, often on every new connection |
| **Status in the MCP spec** | Recommended (SHOULD)                                                   | Optional (MAY)                                                        |

The registration buildup is real. Claude's docs warn that DCR makes Claude register a new client on every fresh connection, which can leave very large numbers of clients on your authorization server, and recommend CIMD for servers that expect a lot of traffic ([Claude connector authentication](https://claude.com/docs/connectors/building/authentication)).

## What ChatGPT and Claude do

- **ChatGPT** can use CIMD when your authorization server advertises support for it, and DCR when that's configured ([Add custom MCP server](https://developers.openai.com/api/docs/guides/custom-mcp-server)).
- **Claude** supports both. It picks CIMD when your authorization server metadata advertises `client_id_metadata_document_supported: true` and `none` among its token endpoint auth methods, and otherwise falls back to DCR ([Claude connector authentication](https://claude.com/docs/connectors/building/authentication)).

Whichever you support, the name a client shows comes from a document it controls, or with DCR from anyone who registers. Your consent page should show the client's redirect hosts, not just its name ([OAuth provider](/docs/auth/guides/plugins/oauth-provider#client-id-metadata-documents)).

## On Neon

In [Managed Better Auth](/docs/auth/overview)'s [OAuth provider plugin](/docs/auth/guides/plugins/oauth-provider) (beta), CIMD is on by default once you set your MCP server's URL, and the authorization server metadata advertises `client_id_metadata_document_supported`. DCR is labeled legacy and is off by default; turn on **Dynamic client registration (legacy)** in the Console only for clients that can't use CIMD ([Dynamic client registration](/docs/auth/guides/plugins/oauth-provider#dynamic-client-registration-legacy)). Both apply only to your MCP server resource, and neither lets a client skip the consent screen.

Two limits to know: a CIMD `client_id` URL can't be on a Neon domain, and if you build your own MCP client, `createClientMetadataDocument` from `@neon/oauth` produces a valid document ([limitations](/docs/auth/guides/plugins/oauth-provider#limitations)).

For the full setup, see [What is the best way to add OAuth to an MCP server?](/faqs/best-way-add-oauth-to-mcp-server)

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

Vendor details verified on 2026-11-21 against the linked pages.

<CTA title="CIMD on by default" description="Managed Better Auth's OAuth provider lets ChatGPT and Claude sign users in without pre-registered clients." buttonText="OAuth provider docs" buttonUrl="/docs/auth/guides/plugins/oauth-provider" />
