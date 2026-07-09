# AI Gateway model metadata

`ai-gateway-models.yaml` is the source of truth for every model Neon's AI Gateway supports. It feeds the docs page, `models.json`, and the filterable models page — none of those should hand-maintain their own model list or specs; they all render from this file.

## Why this file exists

The previous setup (`models.json` generated from models.dev) had drifted badly from what Neon's gateway actually serves — stale entries for removed models, missing entries for models that had shipped, and no way to catch either. This file is populated and kept honest against Neon's own model catalog, its internal configuration for each model, and live requests to the real gateway whenever those disagree or don't cover something. Everything in this file traces back to a real source. Nothing is a guess.

## What's in here

Only what a customer needs to pick and use a model: capabilities, specs, pricing (where known), lifecycle status in plain language, and runnable code samples per SDK. No internal implementation or infrastructure details.

## Schema, briefly

Two-level map: `provider → modelId → fields`. Per model: `displayName`, `openWeights`, `description`, `recommendedFor`/`alternatives`, `contextWindow`/`maxOutputTokens`, `modalities`, `capabilities`, `reasoning` (if applicable — the actual parameter shape, not just "yes it reasons"), `pricing` (real numbers for proprietary models where published; `free_preview`/`tbd` otherwise — open-weight models never get a fabricated price), `releaseDate`, `status`/`statusNote`, `dialects`, `codeSamples` (one block per SDK — AI SDK, Mastra, Python, TypeScript, cURL — generated the same way the Neon Console generates its own), and `lastVerified`.

## Keeping it current

Run `/update-ai-models`. It diffs the model list for new/changed/removed models, runs a lifecycle health-check against a live probe for everything else, and never auto-commits — it hands you a diff to review.
