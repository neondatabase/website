I want to set up fully isolated preview environments where every pull request gets its own copy of the entire backend: Postgres, Auth, Functions, AI Gateway, and Object Storage.

Use this guide as a reference:
https://neon.com/guides/branch-everything-preview-environments

Before writing code:

1. Inspect my existing project and understand its current structure, including whether I already have a Neon project, a Vercel project, or an existing `neon.ts` file.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon auth` and wait for me to complete sign-in before continuing.

3. Ask me what I want the preview workflow to do, and whether I want to:
   - follow the example in the guide closely,
   - adapt the workflow to my existing application instead of the DocNotes example, or
   - build a smaller subset first (for example, only Postgres and Auth branching).

4. Ask only the questions you need to understand my requirements. For example:
   - Which services does my app actually use (auth, functions, AI, object storage)?
   - What framework is my frontend built with?
   - How should preview branches be cleaned up (TTL, delete-branch-action, or both)?
   - Do I want migrations to run as part of the preview workflow?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials and accounts the plan will actually need.

6. Wait for my confirmation before making significant changes.

7. Implement the setup step by step following the guide's patterns. Use the Neon CLI (`neon link`) and declare the services my app needs in `neon.ts`, with the `aws-us-east-2` or `aws-eu-central-1` region since Functions, AI Gateway, and Object Storage are only available there during beta. Follow the guide's branch policy pattern: protect and size the default branch for production, and give new branches a TTL and minimum compute.

8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any Neon, Vercel, or GitHub settings.
   - Tell me where the credential should be stored in my project.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

10. After implementation, show me how to:
    - verify Postgres branching works by running a migration and writes on a branch and confirming production is untouched,
    - open a pull request and confirm the preview gets its own branch with all declared services,
    - verify each layer is isolated: schema and data, auth users, session tokens, function URLs, AI spend, and storage objects,
    - and promote the migration to production and clean up the preview branch after merge.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

Never run destructive commands against my production branch or its services (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting branches, resetting branches, and similar) without showing me the exact command first and getting my explicit approval. Treat the production branch as protected at all times.

Never print connection strings or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
