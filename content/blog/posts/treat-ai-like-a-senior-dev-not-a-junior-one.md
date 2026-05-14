---
title: 'Treat AI Like a Senior Dev, Not a Junior One'
description: Better results start with a better mental model for working with LLMs
excerpt: >-
  Most developers approach AI coding with the wrong mental model. The tendency,
  exacerbated by the vibe coding trend, is to let AI take the wheel. “Build me a
  UI using Tailwind that lets users see their account info” is an example
  initial request, followed by more and more short (a...
date: '2025-04-24T16:51:24'
updatedOn: '2025-06-25T01:54:05'
category: ai
categories:
  - ai
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/treat-ai-like-a-senior-dev-not-a-junior-one/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Treat AI Like a Senior Dev, Not a Junior One - Neon'
  description: >-
    Framing AI as a senior developer rather than a junior one enables better
    prompting, better outputs, and more robust systems.
  keywords: []
  noindex: false
  ogTitle: 'Treat AI Like a Senior Dev, Not a Junior One - Neon'
  ogDescription: >-
    Framing AI as a senior developer rather than a junior one enables better
    prompting, better outputs, and more robust systems.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/treat-ai-like-a-senior-dev-not-a-junior-one/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/treat-ai-like-a-senior-dev-not-a-junior-one/neon-senior-dev-1024x576-851a5ccc.jpg)

Most developers approach AI coding with the wrong mental model. The tendency, exacerbated by the vibe coding trend, is to let AI take the wheel. “Build me a UI using Tailwind that lets users see their account info” is an example initial request, followed by more and more short (and curt) instructions.

The result? Hallucinations, slop, and edge cases missed. But by taking a more strategic approach to working with AI coding, you can achieve far better results and move from [producing programming to producing products](https://dylanbeattie.net/2025/04/11/the-problem-with-vibe-coding.html).

The first way to do this is through better tactical prompting. By [seeing prompting as a new developer discipline](https://neon.tech/blog/prompt-engineering-developer-discipline), you can significantly improve your results from AI coding. Just like developers follow principles such as DRY and SOLID, prompting should be approached with the same rigor they bring to traditional code: designing, refining, and optimizing for clear outputs.

**The second is to understand that LLMs shine when treated like a senior teammate: someone who can think with you, given the right context and room to reason.** This simple shift in mindset–framing AI as a senior developer rather than a junior one–enables better prompting, better outputs, and more robust systems.

This approach transforms AI from a code generator into a programming partner capable of exploring architectural decisions, suggesting testing strategies, and identifying potential pitfalls before they become production issues. You’ll find yourself spending less time fixing AI-generated mistakes and more time leveraging its capabilities to solve genuinely challenging problems.

So, what does it mean to treat AI like a senior developer?

## Give Your AI A PRD

Good developers don’t start coding without understanding the problem. Senior engineers know that requirements gathering is the foundation of quality code. So why are we giving AI one-line prompts and expecting production-ready results?

**Writing a clear, structured task description, like a PRD, fundamentally changes how AI responds to your requests.** When you include context, examples, constraints, and expected outcomes, you transform vague ideas into actionable specifications. This approach mirrors how experienced developers communicate with each other–through comprehensive requirements that leave little room for misinterpretation.

### Example

_TASK: Build a Currency Conversion API Service_

_PROJECT CONTEXT:_

- _Part of our global payment processing platform_
- _Will be used by both our web and mobile applications_
- _Expected traffic: ~5,000 conversions per hour_
- Must comply with financial regulations in EU, US, and APAC regions

<br />_USER STORIES:_

- _As a user making an international payment, I want to see the exact amount I’ll pay in my local currency before confirming._
- _As a finance team member, I need accurate conversion records for reconciliation and auditing._
- _As a product manager, I need conversion rates to update at least daily to ensure accuracy._

_TECHNICAL REQUIREMENTS:_

- _Backend function for REST API endpoint_
- _Use the official European Central Bank (ECB) API as the data source for rates_
- _Cache exchange rates (max 1 hour TTL) to reduce external API calls_
- _Implement proper error handling with descriptive messages_
- _Include comprehensive logging for debugging and audit trails_

_INPUTS:_

- _amount: Decimal number (required)_
- _from_currency: ISO 4217 three-letter code (required)_
- _to_currency: ISO 4217 three-letter code (required)_
- _reference_date: ISO 8601 date format (optional, defaults to current date)_

<br />_OUTPUTS:_

- _JSON response with:_
  - _original_amount: The input amount_
  - _converted_amount: The converted amount (rounded to 2 decimal places)_
  - _exchange_rate: The rate used for conversion_
  - _from_currency: Original currency code_
  - _to_currency: Target currency code_
  - _timestamp: ISO 8601 timestamp of when conversion was performed_
  - _reference_date: The date for which the exchange rate was retrieved_

_ERROR HANDLING:_

- _Invalid currency codes: Return clear error identifying the invalid code_
- _ECB API unavailable: Fallback to cached rates if available, otherwise return service unavailable_
- _Invalid amount format: Return validation error with example of correct format_

_DEPLOYMENT ENVIRONMENT:_

- _AWS Lambda with Node.js 18 runtime_
- _Redis for caching layer_

This level of detail gives the AI a comprehensive understanding of what you’re building, why you’re building it, and how it should behave. You can even use a service such as [ChatPRD](https://www.chatprd.ai/) to create the initial design doc.

## Allow the AI to Ask Questions

If something’s unclear, a senior developer will ask questions before writing broken code. They know that clarification of requirements upfront saves hours of rework later. Your AI assistant can do the same with the right prompt structure.

**By adding something as simple as _“You may ask clarifying questions before coding”_ to your prompt, the interaction goes from a one-way instruction to a collaborative conversation.** The model can then debug the requirements, not just the code. This leverages an LLM’s analytical abilities at the most valuable stage of development.

### Example

_TASK: You are helping implement a new user authentication system. Before you begin coding, identify anything that’s unclear in these requirements. Ask specific questions that would help clarify the implementation details, dependencies, or potential issues._

_REQUIREMENTS:_

- _Implement a user authentication system with password and 2FA support_
- _Should work with our existing PostgreSQL database_
- _Needs to be secure and follow best practices_
- _Should support social login options_
- _Must be scalable as we grow_
- _Implement password reset functionality- Session management should be robust_

Here’s what Claude asks if we put that task to it:

_I’ll help you clarify the authentication system requirements. Here are specific questions that would help establish clearer implementation details:_

_Database integration:_

- _What user data schema do you currently have in PostgreSQL?_
- _Are there existing authentication tables we need to integrate with?_
- _Will we need to migrate existing user accounts?_

_2FA implementation:_

- _What types of 2FA are required? (SMS, email, authenticator apps, hardware keys?)_
- _Should 2FA be mandatory or optional for users?_
- _Are there compliance requirements (like NIST) we need to follow for 2FA?_

_Social login specifics:_

- _Which social login providers are required? (Google, Facebook, Apple, etc.)_
- _How should we handle account linking if a user signs up with email first, then later uses social login?_
- _What user data should we retrieve from social providers?_

_Password policies:_

- _What are the specific requirements for password complexity?_
- _What is the expected password reset flow? (Email link, security questions, etc.)_
- _Should we implement password expiration policies?_

_Session management:_

- _What is the expected session duration?_
- _Do you need support for concurrent sessions across devices?_
- _Should sessions persist across browser restarts?_
- _How should we handle session invalidation during password changes?_

_Scalability expectations:_

- _What is your current user base size and expected growth rate?_
- _Are there peak load times we should design for?_
- _Is geographical distribution of users a consideration?_

_Security requirements:_

- _Are there specific compliance standards we need to meet? (SOC2, GDPR, HIPAA, etc.)_
- _How should we handle rate limiting for login attempts?_
- _What logging requirements do you have for authentication events?_
- _Is there a need for IP-based restrictions or anomaly detection?_

_Application architecture:_

- _What is the front-end technology we’re integrating with?_
- _Will this be a stateless API or maintaining server-side sessions?_
- _Is this for a single application or should it serve as an SSO for multiple applications?_

_Clarifying these points would help create a more precise implementation plan with appropriate technology choices and development priorities._

Answering all those questions will probably take the entire context window, even before you get to code. But by encouraging AI to ask these detailed questions first, you get a much clearer picture of potential issues and edge cases. You can then work iteratively with the AI to hone the idea and ensure the most critical considerations aren’t missed.

## Iterate With the AI

Senior engineers build iteratively. Just as above, we’re talking about back-and-forth with the AI. You can also allow the model to iterate with itself. You can ask it to start by thinking about architecture, then implement components, then refine.

**Breaking work into chunks—first plan, then generate, then refactor—mirrors the development workflow of experienced engineers who wouldn’t dream of writing an entire application in one sitting.** By requesting architecture diagrams, component breakdowns, or pseudocode first, you establish a solid foundation that guides subsequent development. Similarly, explicit refactoring requests after initial implementation help polish rough edges into production-quality code.

### Example

_TASK: We need to build a data processing pipeline that ingests CSV files of customer transactions, cleanses the data, identifies fraudulent patterns, and generates daily reports. Let’s work through this iteratively._

_PHASE 1: ARCHITECTURE PLANNING_

First, outline the high-level architecture for this pipeline. Include:

- _Components and their responsibilities_
- _Data flow between components_
- _Technologies/libraries you would recommend- Key considerations for scalability, reliability, and maintainability_

_PHASE 2: COMPONENT DESIGN_

_Now that we’ve agreed on the high-level architecture, let’s design the data ingestion component in more detail:_

- _Input validation approach_
- _Error handling strategy_
- _Parsing and normalization logic_
- _Performance considerations- Potential failure modes and mitigations_

_PHASE 3: IMPLEMENTATION_

_Implement the data ingestion component based on our agreed design:_

- _File loading and validation_
- _CSV parsing with proper error handling_
- _Data normalization functions- Unit tests for the component_

_PHASE 4: REFACTORING_

_Review the implementation and suggest improvements:_

- _Code organization and structure_
- _Performance optimizations_
- _Error handling enhancements- Additional edge cases to handle_

_PHASE 5: EXTENSION_

_Now that we have a solid ingestion component, outline how we would implement the fraud detection component that will process the normalized data._

This staged approach transforms the AI from a code generator into a collaborative pair programmer that builds solutions methodically.

## AI Can Explain Its Decisions

Good engineers explain trade-offs, assumptions, and logic. They communicate the reasoning behind their choices. This transparency is key to effective collaboration and code quality.

**Prompting LLMs to explain their approach creates a checkpoint in the development process.** You gain insight into how they interpret requirements and plan to solve the problem. This pre-implementation explanation reveals the model’s model, allowing you to catch misunderstandings before they manifest as bugs.

### Example

_TASK: We need to implement a caching layer for our product catalog API to reduce database load and improve response times. Before writing any code, explain:_

- _Your recommended caching strategy and why it’s appropriate for this use case_
- _Key technical decisions and trade-offs you’re making_
- _Potential challenges and how you plan to address them_
- _Assumptions you’re making about the current system5. Metrics you would track to validate the solution’s effectiveness_

_After explaining your approach, implement the caching layer with detailed comments explaining your implementation choices.<br />_<br />_CONTEXT:_

- _Product catalog contains ~50,000 items_
- _Items are updated infrequently (1-2% change daily)_
- _API serves ~2 million requests per day_
- _Peak traffic is 5x average_
- _Current response time averages 300ms, target is less than 100ms_
- _Some product data is personalized based on user location/preferences_
- _Running on Kubernetes with Redis available as a caching option- Each product has ~20 attributes, average response size is 5KB_

Here is the output:

_Product Catalog API Caching Strategy_

- _Recommended Caching Strategy: I recommend implementing a multi-level caching strategy with both Redis and application-level caching:_
  - _Primary Cache: Redis for distributed caching with TTL (Time-To-Live)_
  - _Secondary Cache: In-memory application cache for the most frequently accessed products_
  - _Cache Invalidation: Event-based invalidation combined with TTL as a fallback_

_This hybrid approach is appropriate because:_

- _The product catalog has infrequent updates (only 1-2% daily change)_
- _The high request volume (2M/day) will benefit significantly from caching_
- _Having both distributed and local caches handles peak traffic (5x average) effectively_
- _The product catalog has infrequent updates (only 1-2% daily change)_
- _The high request volume (2M/day) will benefit significantly from caching_
- _Having both distributed and local caches handles peak traffic (5x average) effectively_

_Key Technical Decisions & Trade-offs_

- _Cache Granularity: Individual products vs. collections_
  - _Decision: Cache both individual products and common collection queries_
  - _Trade-off: More memory usage but better performance for browse scenarios_
- _Cache Keys Design:_
  - _Decision: Composite keys incorporating product ID, user location, and preference hash_
  - _Trade-off: More complex key management but enables personalization_
- _Invalidation Strategy:_
  - _Decision: Publish-subscribe model with Redis channels for real-time invalidation_
  - _Trade-off: Added complexity but ensures consistency_
- _Cache Warming:_
  - _Decision: Implement a proactive cache warming strategy for popular products_
  - _Trade-off: Additional system overhead but prevents cold cache issues_
- _Compression:_
  - _Decision: Apply compression for cached data_
  - _Trade-off: Slight CPU overhead vs. significant memory savings_
- …

It continues. If you are interested, the final implementation the LLM suggested is in [this gist](https://gist.github.com/ajtatey/df21eb278e32afd95123fbd2ca99c36c).

By forcing the AI to think through the solution holistically before writing code, you make problems visible before implementation begins.

## AI Can Say “I Don’t Know”

Good engineers flag unknowns and admit limitations. They recognize that acknowledging uncertainty is a strength, not a weakness.

**Prompting the LLM to annotate guesses or assumptions creates a layer of transparency in your AI code.** Just as senior developers distinguish between verified facts and educated guesses in their work, this practice helps you separate reliable outputs from speculative ones. When the model clearly marks areas of uncertainty, you can focus additional verification efforts where they’re most needed. This targeted validation process mirrors how experienced teams manage risk by concentrating scrutiny on the least certain components.

### Example

_TASK: You’re designing a recommendation algorithm for an e-commerce platform. Based on the information provided:_

- _Propose a suitable recommendation approach_
- _Outline how you would implement it_
- _Identify any areas where you’re uncertain or would need more information_
- _Clearly mark any assumptions you’re making_

_CONTEXT:_

- _Platform sells fashion items (clothing, accessories)_
- _Has approximately 200,000 active monthly users_
- _Database contains 2 years of purchase history_
- _We have user browsing data and purchase history_
- _Currently no recommendation system in place_
- _Tech stack includes PostgreSQL, Python backend, React frontend_

_After your solution, explicitly list any parts where:_

- _You’re making educated guesses rather than confident assertions_
- _You would need additional information to make a better recommendation- There are multiple valid approaches and you’re unsure which is optimal_

The model returns the implementation proposal, but appends this to the end:

_## Uncertain Areas and Information Needs_

_### Educated Guesses Rather Than Confident Assertions_

- _The optimal weighting between collaborative filtering, content-based filtering, and trend-based recommendations (currently proposed as 60/30/10)_
- _The ideal frequency for model retraining (suggested daily, but could be weekly)_
- _The impact of seasonality on this specific fashion platform’s recommendations_
- _The degree to which visual similarity (vs. metadata similarity) drives purchases_

_### Additional Information Needs_

- _Conversion rates and funnel metrics to establish a baseline_
- _Details about product taxonomy and attributes_
- _Information about customer segments and their purchasing behaviors_
- _Returns data and reasons for returns_
- _Marketing calendar and promotional events that might affect recommendation relevance_
- _Geographic distribution of users (for seasonal adjustments)_
- _User demographics to better understand preference patterns_
- _Inventory constraints that might affect recommendation strategy_

_### Multiple Valid Approaches_

- _Model Architecture:_
  - _Matrix factorization vs. neural collaborative filtering vs. graph-based methods_
  - _Explicit vs. implicit feedback emphasis_
  - _Batch learning vs. online learning_
- _Cold Start Handling:_
  - _Content-based only vs. popularity-based vs. quick questionnaire_
  - _Category-based defaults vs. trending items_
- _Recommendation Diversity:_
  - _How to balance similarity with discovery_
  - _Whether to explicitly model diversity or let it emerge naturally_
- _Deployment Strategy:_
  - _Full system at once vs. incremental rollout by page/feature- Single model vs. ensemble of specialized models for different contexts_

By encouraging the AI to identify uncertainties and assumptions, you get a much more honest assessment of its solution and can focus on resolving the most important open questions.

## AI Should Give You Maintainable, Idiomatic Code

It’s not just about working—it’s about doing it the right way. Senior engineers write code that follows best practices, conforms to team standards, and can be maintained by others.

**Just as experienced developers prioritize readability and maintainability over clever hacks, explicitly prompting for idiomatic code ensures you receive solutions that integrate with existing codebases.** This approach yields code that your team can understand, extend, and maintain long after the initial implementation.

### Example

Here, we ask not just for TypeScript, but a specific version, following a particular style guide, and with specific functionality:

_TASK: Implement a service in TypeScript that fetches and processes user activity data. The service will be part of a larger application that tracks user engagement metrics._

_REQUIREMENTS:_

- _The service should fetch user activity data from a REST API_
- _It should process the data to calculate engagement metrics_
- _It should cache results to minimize API calls_
- _It should handle errors gracefully with proper logging_

_CODING STANDARDS:_

- _Use modern TypeScript (v4.5+) with strict type checking_
- _Follow Airbnb style guide conventions_
- _Use functional programming patterns where appropriate_
- _Prefer immutability and pure functions_
- _Use async/await for asynchronous operations_
- _Include comprehensive error handling_
- _Add complete JSDoc documentation for public methods_
- _Write code that follows SOLID principles_
- _Include unit tests using Jest_

_TECHNICAL CONTEXT:_

- _The application uses Axios for HTTP requests_
- _We use Redis for caching through the ‘ioredis’ client_
- _Logging is done via Winston logger_
- _The application runs in a Node.js environment_
- _TypeScript configuration has strict mode enabled_
- _Please provide a complete, production-ready implementation with proper structure, error handling, and tests. Include explanatory comments and documentation._

This simple prompt produced so much code that we can’t add it all here. Instead, [this repo](https://github.com/argotdev/user-activity-service) shows the service, types, factory function, tests, and docs. Claude produced everything from this single prompt (do you notice the obvious mistake?).

By specifying detailed coding standards and patterns, you get idiomatic code that follows team conventions and best practices, making it much more maintainable and reliable.

## Build a Better Mental Model

You get out what you put in. If you treat AI like a junior developer, you get rushed solutions that miss critical details, create technical debt, and require extensive rework. The AI will follow instructions literally without raising concerns, leading to exactly the hallucinations, slop, and edge cases described earlier.

But if you treat it like a senior teammate–setting context, reviewing work, iterating, and asking for deeper thinking–you’ll tap into LLMs’ incredible potential.

This is a little more work for you, but it will yield much better results. The key insight is that AI isn’t magic—it’s a tool that works best with structured input and collaborative iteration. Treating AI like a senior developer rather than a junior one sets it up for success and maximizes its value to your development process.

---

_Neon is a serverless Postgres database used by v0 and Replit Agent. It also works like a charm with AI IDEs like Cursor [via its MCP Server](https://neon.tech/guides/cursor-mcp-neon). [Sign up for Neon](https://console.neon.tech/signup) (we have a Free Plan) and start building._
