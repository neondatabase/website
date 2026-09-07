I want to build a Discord bot using Neon Functions and the Neon AI Gateway.

Use this guide as a reference:
https://neon.com/guides/discord-bot-on-neon-functions

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon auth` and wait for me to complete sign-in before continuing.

3. Ask me what bot I want to build, and whether I want to:
   - follow the example in the guide closely,
   - modify the example for a different use case, or
   - build a different Discord bot that uses the same Neon features.

4. Ask only the questions you need to understand my requirements. For example:
   - What commands or interactions should the bot support?
   - Do I want AI chat, image generation, or both?
   - Do I need to store anything in Neon Postgres?
   - Do I want to use the same framework and project structure as the guide?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials the plan will actually need.

6. Wait for my confirmation before making significant changes.

7. Implement the bot step by step using Neon Functions and the Neon AI Gateway where appropriate. Install the agent skills the guide lists: `neon skills -s neon -s neon-functions -s neon-ai-gateway -y`. Follow the patterns from the guide, but adapt them to my requirements rather than copying the example blindly.

8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required Discord settings, permissions, or configuration.
   - Tell me where the credential should be stored in my project.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

10. After implementation, show me how to:
    - run the bot locally,
    - deploy the Neon Function,
    - configure any required Discord settings,
    - and test the bot end to end.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database or storage (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting objects, and similar) without showing me the exact command first and getting my explicit approval.
