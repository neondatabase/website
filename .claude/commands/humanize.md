---
description: 'Make a documentation page sound like a human explaining something to another human. Removes AI writing patterns and applies Neon voice: contractions, active voice, direct address, concise sentences.'
---

# Humanize

Transform a documentation page to sound like one human explaining something to another — the Neon voice. This command does two things: removes AI writing patterns, and applies Neon style conventions where they're missing.

## Usage

```
/humanize content/docs/guides/my-page.md
/humanize                    # uses the currently open file
```

---

## Part 1: Remove AI writing patterns

### Filler and throat-clearing

- Opening with "In this guide/article/document, you will..." → cut or rewrite to lead with the content
- "It's worth noting that..." / "It's important to note that..." → cut the preamble
- "As mentioned above/earlier/previously..." → cut or rewrite without the callback
- "At the end of the day..." / "In the grand scheme of things..." → cut
- Restating the section heading verbatim in the first sentence of the section → rewrite to add content, not repeat it

### Hedging language

- "It is possible that..." → state directly or cut
- "In some cases..." / "In certain scenarios..." → be specific or cut
- "Generally speaking..." / "For the most part..." → cut
- "May or may not..." → pick one or rewrite
- "It should be noted that..." → cut the preamble, lead with the fact

### Over-formal constructions

- "Utilize" → "use"
- "Leverage" → "use" or be specific about what's being used
- "Facilitate" → "help", "enable", or be specific
- "Implement" when "add", "set up", or "write" is clearer → use the clearer word
- "In order to" → "to"
- "Due to the fact that" → "because"
- "At this point in time" → "now"
- "On a regular basis" → "regularly"
- Em dashes (—) → rewrite using a comma, parentheses, or a new sentence. Never introduce a new em dash in a rewrite.

### AI-specific tells

- Sentences opening with "Certainly!" / "Absolutely!" / "Of course!" / "Sure!" → cut
- Overuse of "seamlessly", "robust", "straightforward", "powerful", "comprehensive" → cut or replace with specifics
- Closing sentences that restate the page title ("In this guide, you learned how to...") → cut
- Transition sentences that only summarize the previous paragraph ("In summary...") → cut
- Introducing abbreviations without expanding them first → spell out in full on first use, with the abbreviation in parentheses. For example: "natural language processing (NLP)", not just "NLP". Do not introduce an abbreviation that wasn't already present in the original text.

### Minimizing language

- "Simply", "just", "easily", "quick" before a step → cut; let the steps speak
- Saying "easy" or "straightforward" when complexity follows → cut

---

## Part 2: Apply Neon voice

These are positive additions, not just removals. Apply where the text is technically correct but sounds impersonal or stiff.

### Use contractions

Where a contraction sounds natural, use it:

- "it is" → "it's"
- "do not" → "don't"
- "you will" → "you'll"
- "they are" → "they're"
- "cannot" → "can't"
- "does not" → "doesn't"

Do not force contractions where they would sound awkward or change emphasis (e.g. in a technical definition).

### Address the reader as "you"

Rewrite impersonal or third-person constructions:

- "Users can configure..." → "You can configure..."
- "Developers should ensure..." → "Make sure..."
- "One can use..." → "You can use..."
- "It is recommended that..." → "We recommend..." or "You should..."

### Prefer active voice

- "The file is read by the server" → "The server reads the file"
- "A branch can be created using..." → "You can create a branch using..."
- "Errors are displayed in the console" → "The console displays errors"

Only switch to active where it reads naturally. Some passive constructions (especially in reference docs) are intentional.

### Break up long sentences

If a sentence runs longer than ~25 words and has a natural split point, break it into two sentences. Do not split if the break would sound choppy or lose meaning.

---

## Workflow

### 1. Read the file

Read the target file in full.

### 2. Identify all findings

Go through both Part 1 and Part 2. For each finding note:

- The original sentence or passage
- Which pattern or rule it matches
- A proposed rewrite

### 3. Present findings

Group by category. For each:

```
PATTERN: [pattern name]
ORIGINAL: "..."
SUGGESTED: "..."
```

Then ask:

> "Apply all fixes, review individually, or cancel? (all / review / cancel)"

### 4. Apply

- **All**: apply every suggested fix and save the file
- **Review**: walk through each finding one at a time, waiting for approval before applying
- **Cancel**: do nothing

### 5. Run the auto-fixer

```bash
npm run fix
```

### 6. Report

Summarize how many findings were in each category and how many were applied.
