---
name: neon-writing
description: Defines Neon's writing style for developer-facing website content. Use when drafting, editing, or reviewing Neon documentation, guides, FAQs, blog posts, landing-page copy, UI text, or other Neon-branded content. Apply alongside the relevant content-type authoring skill.
---

# Neon writing

Neon's audience is developers. Write like a knowledgeable peer: clear, direct, precise, and useful. Avoid the tone of a marketing brochure.

## Core principles

**Be direct.** Say what the product, feature, or procedure does. Skip the buildup.

**Be concise.** Every sentence should earn its place. Cut words or sentences that don't change the meaning.

**Be precise.** Prefer specific, verifiable claims over vague ones. If you can't verify a claim, don't make it.

**Use plain language.** Prefer short, familiar words. Use technical terms when they're familiar to the intended developer and are the clearest way to explain the idea.

**Respect the reader.** Don't explain concepts the intended reader already knows. State prerequisites and assumptions, then spend the detail on the difficult or Neon-specific parts.

## Write for developers

- Lead with the task, problem, behavior, or technical consequence.
- Explain mechanisms before benefits. Show what happens, then why it matters.
- Give runnable commands and complete code when the reader needs to act.
- State versions, environments, permissions, limits, and destructive effects when they affect the result.
- Use realistic examples, but never use real credentials or personal information.
- Distinguish facts from recommendations. Explain the tradeoff behind a recommendation.
- Name the source for measurements, benchmarks, quotes, and comparisons.
- Link to the source of truth instead of repeating details likely to drift.
- Verify code, commands, UI labels, links, and product behavior before publishing.
- Don't hide prerequisites or failure modes in a closing note.

## Editing existing copy

Read the full draft before editing. Identify its core point, audience, and the voice traits worth preserving.

**Preserve the writer's voice.** Keep vocabulary, cadence, humor, uncertainty, and level of polish when they fit Neon's voice. Don't make every paragraph equally tidy.

**Make the minimum effective edit.** Fix unclear passages, repetition, unsupported claims, and the patterns below. Leave strong sentences alone. Keep the original structure unless it gets in the reader's way.

**Keep the meaning.** Don't invent claims, examples, numbers, quotes, or opinions. Ask when the intended meaning is unclear.

**Protect specific facts.** Keep useful names, numbers, dates, mechanisms, and examples when the source supports them.

**Use direct verbs.** Prefer "decided" to "made a decision" and "can" to "has the ability to." Prefer plain "is" and "has" to inflated constructions such as "serves as."

## Tone

- Developer-centric and matter-of-fact
- Confident but not boastful
- Helpful, not cheerful
- Neutral, not breathless
- Conversational, not corporate

Avoid bubbly, flowery, or hype-driven language. Avoid false urgency. Appeal to function instead of emotion.

When you aren't the domain expert, hedge instead of presenting a recommendation as authoritative fact. Don't hedge verified product behavior.

## Words not to use

Never use any form of these words in published copy:

| Don't use                    | Use instead                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| utilize                      | use                                                                    |
| effortless / effortlessly    | Cut it, or explain what makes the task easy                            |
| delve                        | explore, look at, examine                                              |
| solutions                    | Name the specific product, feature, or approach                        |
| forever                      | State the duration or persistence behavior                             |
| enhance                      | improve, add, extend, or name the change                               |
| holistic                     | Name the included parts                                                |
| incentivize                  | encourage, reward, motivate                                            |
| intelligent, as an adjective | Describe the capability                                                |
| unified                      | Say "a single interface," "one configuration," or the specific meaning |
| challenges                   | problems, limits, or the specific issue                                |
| best-in-class                | Cut it, or cite a source                                               |
| purpose-built                | built for, designed for                                                |
| state-of-the-art             | Cut it, or describe what's new                                         |
| world-class                  | Cut it, or cite a source                                               |
| web-scale                    | State the measured scale                                               |
| demystify                    | explain, walk through, clarify                                         |
| security posture             | security, security practices, security setup                           |

Also avoid these AI-tell words:

`seams`, `testament`, `underscore`, `propel`, `unwavering`, `heartfelt`, `embrace`, `foster`, `ignite`, `empower`, `amplify`, `catalyst`, `leverage`, `epitome`, `cornerstone`, `harness` as a verb, `noteworthy`, `unprecedented`, `profound`, `pivotal`, `journey`, `tapestry`, `game-changer`, `nuanced`, `elevate`, `intricate`, `cutting-edge`, `groundbreaking`, `innovative`, `illuminate`.

Avoid filler transitions such as `moreover`, `furthermore`, `nevertheless`, and `additionally`. Start with the point or connect the sentence to the preceding one.

Cut canned phrases such as:

- "It's not X, it's Y"
- "not just X but Y"
- "it's important to note"
- "shed light on"
- "key takeaway"
- "at its core"
- "to be honest" and other uses of `honest` or `honestly`

## Patterns to cut

Don't guess whether AI wrote a draft. Review for observable problems:

- **Throat-clearing:** Cut "Here's the thing," "Let me be clear," and similar setup.
- **Binary contrasts and negative lists:** State the positive point directly.
- **Dramatic reveals:** Don't use a noun phrase and colon to manufacture suspense.
- **Superficial analysis:** Cut trailing clauses built around "highlighting," "underscoring," "reflecting," or "showcasing" when they only assert importance.
- **Importance puffery:** Cut claims such as "marks a pivotal moment" or "plays a vital role."
- **Weasel attribution:** Name and cite the source instead of writing "experts agree" or "studies show."
- **Synonym cycling:** Repeat the clearest technical term instead of rotating through near-synonyms.
- **Robotic rhythm:** Avoid stacked fragments and repetitive sentence shapes.
- **Rhetorical setups:** Cut "What if I told you," "Think about it," self-answered questions, and similar devices.
- **Fake-profound endings:** End on the last concrete point, result, or next action.
- **Formatting clutter:** Don't decorate copy with emoji headings, scattered bold emphasis, unnecessary bullets, or headings over tiny sections.

When asked to audit without rewriting, name the pattern, quote the line, and suggest a short fix. Don't score the draft or speculate about its author.

## Neon terminology

- Describe Neon as the backend platform for apps and agents when the broader platform is relevant. Name the relevant capabilities instead of reducing Neon to "just Postgres." Postgres-specific framing is correct when the subject is only the database.
- Prefer **Postgres** in Neon-branded prose. Preserve **PostgreSQL** in official names, quotations, and source-specific terminology.
- Write **database**, not DB, wherever possible.
- Write **Neon Auth**, never NeonAuth.
- Write **free plan**, not free tier.
- Write **organization**, not workspace, for Neon account structure. Use **Organization ID** when asking which account a request applies to.
- Don't refer to "the Neon docs" as a separate authority from content published in the docs. State the fact directly and link the source page when useful.
- Never direct readers to GitHub Discussions. It isn't actively monitored. Use the [Neon Discord community](https://neon.com/discord), the relevant documentation, the [feedback form](https://console.neon.tech/app/projects?modal=feedback), or the [public roadmap](https://neon.com/docs/introduction/roadmap), depending on the need.
- Don't use a generic "contact support" CTA. Support is plan-dependent. Link a resource available to the intended reader.
- Match product names and UI labels exactly.

## Mechanics

- Prefer active voice.
- Front-load important information.
- Keep one main idea per sentence.
- Use contractions when they sound natural.
- Use US English.
- Use sentence case for titles and headings.
- Don't use em dashes. Use a comma, period, colon, or rewrite the sentence.
- Don't use emoji or exclamation points in documentation. Avoid exclamation points elsewhere unless the context warrants one.
- Cut adjectives that don't add verifiable information.
- Use the same term for the same concept throughout.
- Put commands, parameters, environment variables, filenames, and UI values in backticks.

## Explain complex ideas

**Concrete before abstract.** Introduce a concept through observable behavior or an example before naming the abstraction.

**Connect sentences.** Show how one fact leads to the next. Don't stack unrelated statements.

**Slow down for hard parts.** Use an extra sentence or concrete example when the mechanism is difficult. Don't pad simple steps.

**Observations before implications.** Describe what happens, then explain the consequence.

**Earn conclusions.** Support conclusions with the relevant mechanism or evidence. Don't open with an unsupported benefit claim and justify it afterward.

## Final review

Before finalizing:

- Preserve the writer's useful details and voice.
- Remove banned words, canned phrases, and AI-tell patterns.
- Verify facts, links, code, commands, names, numbers, and UI labels.
- Remove invented or unsupported claims, examples, quotes, and opinions.
- Use Neon terminology consistently.
- Remove em dashes, unnecessary exclamation points, and decorative formatting.
- Confirm each section helps the intended developer understand or complete the task.
- End on a concrete result or next action, not a recap paragraph.
