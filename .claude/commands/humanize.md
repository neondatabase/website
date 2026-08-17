---
description: 'Make a documentation page sound like a human explaining something to another human. Detects AI writing patterns across 5 categories, runs a two-pass self-audit rewrite, then applies Neon voice: contractions, active voice, direct address, concise sentences.'
---

# Humanize

Transform a documentation page to sound like one human explaining something to another — the Neon voice. This command does three things: detects AI writing patterns using a categorized catalog, rewrites and then self-audits the result, and applies Neon style conventions where they're missing.

Pattern taxonomy informed by Wikipedia's "Signs of AI writing" analysis. It goes beyond phrase-swapping: the goal is human, not just clean.

## Usage

```
/humanize content/docs/guides/my-page.md
/humanize                    # uses the currently open file
```

---

## Part 1: Detect and remove AI writing patterns

Scan the text against all 5 categories below. For each detected pattern, note the specific instance and its location.

### Category 1: Content patterns

What the text says — substance, structure, depth.

- **Significance inflation** — "pivotal", "groundbreaking", "game-changer", "revolutionary", "transformative", "paradigm shift". Ordinary things inflated into momentous ones. State what actually happened.
  - Before: "This groundbreaking partnership represents a pivotal moment."
  - After: "The partnership gives the company European distribution for the first time."
- **Surface-level analysis** — "symbolizing", "reflecting broader trends", "speaks to", "emblematic of", "underscores". Gestures at meaning without analyzing. Name specifics.
- **Missing specificity** — "various", "numerous", "significant", "substantial", "a number of", "wide range of". Vague quantifiers instead of numbers, names, evidence. Use the real figure.
  - Before: "significant growth across numerous markets"
  - After: "grew 34% in Southeast Asia last quarter"
- **Promotional tone** — "boasts", "nestled", "vibrant", "stunning", "world-class", "state-of-the-art", "unparalleled". Brochure language. Describe, don't flatter; acknowledge trade-offs.
- **Vague attribution** — "experts believe", "studies show", "research indicates", "it is widely acknowledged". Unnamed authorities. Cite the real source or own the claim.
- **Formulaic challenges** — "Despite challenges", "not without its challenges", "continues to thrive", "remains resilient". Acknowledges difficulty with a stock phrase, then dismisses it. Explain concretely or skip.
- **Over-summarization** — "In summary", "To summarize", "In conclusion", "All in all", "Overall", "As we've seen". Compulsive recaps. If the conclusion just restates the intro, delete it.

### Category 2: Language and grammar patterns

Word choice, sentence construction, grammatical habits.

- **AI vocabulary** — "additionally", "furthermore", "moreover", "landscape", "utilize", "leverage", "robust", "facilitate", "encompass", "testament", "intricate", "underscore", "showcase", "foster", "delve". Individually fine, but they cluster in AI text. Use plain words: "use", "help", "connects to".
- **Copula avoidance** — "serves as", "acts as", "functions as", "stands as", "features", "boasts", "represents". Avoids plain "is" and "has". A building doesn't "serve as the headquarters" — it *is* the headquarters.
- **Negative parallelism** — "It's not just X, it's Y", "This isn't X. This is Y.", "Forget X — this is Y", "Less X, more Y". Overused LLM rhetorical move. Just state the positive claim.
- **Forced rule of three** — three-item lists where one or two would do. Use whatever number is natural.
- **Synonym cycling** — rotating terms for the same thing ("the platform" → "the solution" → "the tool" → "the system"). Repeat the term when clarity demands it.
- **False ranges** — "from X to Y" / "everything from X to Y" with unrelated or absurdly broad endpoints. Sounds comprehensive, says nothing. Be specific.
- **Passive voice and subjectless fragments** — "can be seen as", "is considered", "has been noted", "No configuration needed", "Designed to", "Built for". Removes the actor. Name who does what. (Some passive in reference docs is intentional — leave it.)

### Category 3: Style patterns

Formatting, rhythm, visual presentation.

- **Em dash overuse** — multiple em dashes (—) per paragraph, nested asides. Rewrite with commas, colons, periods, or parentheses. **Never introduce a new em dash in a rewrite.**
- **Bold overuse** — multiple **bolded** terms per paragraph. Bold one or two critical points per section, max. When everything is bold, nothing is.
- **Inline-header lists** — the "**Label:** Description" pattern repeated vertically. Use real sentences, bullets, or a table instead.
- **Title case in headings** — "Strategic Partnerships And Key Deliverables". Use sentence case.
- **Emoji pollution** — emojis in professional/technical content (rockets, lightbulbs, checkmarks, fire). Remove them.
- **Curly quote misuse** — curly quotes in code, config, or technical contexts where they break things. Use straight quotes.

### Category 4: Communication patterns

How the text addresses the reader.

- **Chatbot artifacts** — "I hope this helps!", "Let me know if you need anything", "Feel free to ask", "Happy to help!". Chat-training residue. Remove entirely.
- **Knowledge-cutoff disclaimers** — "As of my last update", "While specific details may vary", "Based on available information". Docs shouldn't carry disclaimers about the author's training data. Verify the fact or state uncertainty concretely.
- **Sycophantic tone** — "Great question!", "That's an excellent point!", "You're absolutely right!". Don't validate the reader. Just answer.

### Category 5: Filler and hedging patterns

Padding that adds no meaning.

- **Filler phrases** — "In order to" ("to"), "Due to the fact that" ("because"), "It is worth noting that", "It is important to note", "In today's rapidly evolving", "At the end of the day", "When it comes to". Verbal throat-clearing. Cut.
- **Excessive hedging** — "could potentially", "might possibly", "it seems that perhaps", "may or may not", "to some extent". One hedge is human; three stacked is AI. Pick one or commit.
- **Generic positive conclusions** — "The future looks bright", "exciting times ahead", "poised for success", "well-positioned to", "stands to benefit". Empty optimism. Make a specific claim, raise an open question, or acknowledge real uncertainty.
- **Hyphenated buzzword clusters** — "cross-functional", "data-driven", "mission-critical", "enterprise-grade", "cloud-native" appearing together. One is fine; three in a sentence is a tell.
- **Persuasive authority tropes** — "At its core", "What really matters is", "The key takeaway", "Here's the truth", "The bottom line". Authoritative framing for ordinary claims. Drop the frame, state the point.
- **Signposting announcements** — "Let's dive in", "Here's what you need to know", "Without further ado", "Let's explore", "Let's unpack". Announces the action instead of doing it. Just do it.
- **Fragmented headers** — a heading followed by a one-line restatement of the heading. Jump into the actual content.
- **Excessive enumeration** — "Firstly", "Secondly", "Thirdly"; numbered lists where flowing prose is clearer. Not everything needs to be a list.

### Minimizing language (Neon-specific)

- "Simply", "just", "easily", "quick" before a step → cut; let the steps speak.
- Saying "easy" or "straightforward" when complexity follows → cut.

### Abbreviations (Neon-specific)

- Spell out in full on first use, with the abbreviation in parentheses: "natural language processing (NLP)", not just "NLP". Do not introduce an abbreviation that wasn't already in the original text.

---

## Part 2: Apply Neon voice

Positive additions, not just removals. Apply where the text is technically correct but sounds impersonal or stiff.

### Use contractions

Where a contraction sounds natural: "it is" → "it's", "do not" → "don't", "you will" → "you'll", "they are" → "they're", "cannot" → "can't", "does not" → "doesn't". Don't force contractions where they'd sound awkward or change emphasis (e.g. in a technical definition).

### Address the reader as "you"

- "Users can configure..." → "You can configure..."
- "Developers should ensure..." → "Make sure..."
- "One can use..." → "You can use..."
- "It is recommended that..." → "We recommend..." or "You should..."

### Prefer active voice

- "The file is read by the server" → "The server reads the file"
- "A branch can be created using..." → "You can create a branch using..."
- "Errors are displayed in the console" → "The console displays errors"

Only switch where it reads naturally. Some passive constructions (especially in reference docs) are intentional.

### Break up long sentences

If a sentence runs longer than ~25 words and has a natural split point, break it into two. Don't split if the break would sound choppy or lose meaning.

### Add personality where the page allows

Pattern removal alone produces sterile text. Where the page is a guide or conceptual explanation (not a strict reference), inject:

- **A point of view** — "This approach is better because..." not "This approach may offer advantages."
- **Varied rhythm** — follow a long sentence with a short one. Or a fragment.
- **Acknowledged complexity** — if something is genuinely complicated, say so. Don't flatten it into false simplicity.
- **Concrete imagery** — "The deploy took 47 minutes" not "The deployment was time-consuming."

The litmus test: could a specific human have written this? If it could have been written by anyone, it still sounds like AI.

---

## Workflow

### 1. Read the file

Read the target file in full.

### 2. First-pass scan and rewrite

Go through both Part 1 (all 5 categories) and Part 2. For each finding note the original passage, the pattern or rule it matches, and a proposed rewrite. Don't just swap synonyms — restructure or delete sentences that exist only to pad.

### 3. Self-audit (the critical step)

Re-read your proposed rewrite cold and ask: **"If I read this with no context, what would make me think an AI wrote it?"** The first rewrite often introduces new AI patterns while fixing old ones. Check for:

- **Residual pattern matches** — re-scan against all 5 categories.
- **Uniform sentence length** — vary it; mix short and long.
- **Too-clean structure** — if every paragraph follows the same shape, break it up.
- **Excessive balance** — if it gives equal weight to both sides of everything, pick the stronger side.
- **Perfect transitions** — real writing sometimes just starts the next point.

Fold any audit findings into the proposed rewrites before presenting.

### 4. Present findings

Group by category. For each:

```
PATTERN: [pattern name]
ORIGINAL: "..."
SUGGESTED: "..."
```

Then ask:

> "Apply all fixes, review individually, or cancel? (all / review / cancel)"

### 5. Apply

- **All**: apply every suggested fix and save the file
- **Review**: walk through each finding one at a time, waiting for approval before applying
- **Cancel**: do nothing

### 6. Format only the edited file

Format only the file(s) you edited, not the whole `content/` tree. Pass the target path(s) to Prettier directly:

```bash
npx prettier --write --log-level warn "<path-to-edited-file>"
```

Do not run `npm run fix:md` — it reformats every file under `content/` and would pollute the diff with unrelated changes.

### 7. Report

Summarize how many findings were in each category, what the self-audit caught, how many fixes were applied, and the approximate word count change.
