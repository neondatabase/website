I want to build an image processing API using Neon Functions, Sharp, and the Neon AI Gateway.

Use this guide as a reference:
https://neon.com/guides/image-processing-api-neon-functions

Before writing any code:

1. Inspect my existing project and understand its current structure.
2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon auth` and wait for me to complete sign-in before continuing.
3. Ask me what I want to build and whether I want to follow the example in the guide closely or adapt it to a different use case.
4. Ask any other questions that would affect the architecture or implementation, such as:
   - What image processing operations do I need?
   - Do I want to store processed images, and if so, where?
   - Do I want AI-powered image analysis/captioning?
   - Do I want to use the same framework and project structure as the guide?
5. Once you understand my requirements, propose a concise implementation plan, explain which parts of the guide you will reuse or adapt, and list the credentials the plan will actually need.
6. Wait for my confirmation before making significant changes.
7. Then implement the feature step by step, following the patterns from the guide where appropriate. Install the agent skills the guide lists: `neon skills -s neon-functions -s neon-ai-gateway -s neon-object-storage -y`.
8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required settings.
   - Tell me where the credential should be stored in my project.
9. Finally, help me run and test the API with an example request.

Prefer the simplest implementation that satisfies my requirements. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database or storage (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting objects, and similar) without showing me the exact command first and getting my explicit approval.
