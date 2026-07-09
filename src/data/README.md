# AI Gateway model metadata

`ai-gateway-models.yaml` is the source of truth for every model Neon's AI Gateway supports. It feeds the docs page, `models.json`, and the filterable models page — none of those should hand-maintain their own model list or specs; they all render from this file.

## Why this file exists

The previous setup (`models.json` generated from models.dev) had drifted badly from what Neon's gateway actually serves — stale entries for removed models, missing entries for models that had shipped, and no way to catch either. This file is populated and kept honest against three real sources, in order:

1. **`catalog.go`** (`neon-cloud`) — which models exist, their provider, and which API dialects they support. The only source for *existence*.
2. **Zippy** (`foundationModels_common.libsonnet` in `universe`) — capabilities, description, launch date, and lifecycle status (deprecated/capacity-constrained/etc).
3. **Live probing the real gateway** — the tiebreaker whenever the first two sources disagree, or don't cover something (real accepted parameter shapes, real output caps, real modality support). Proven necessary repeatedly — Zippy's lifecycle flags and provider-advertised specs have both been wrong in ways only a live request caught.

Everything in this file traces to one of those three. Nothing is a guess.

## What's deliberately *not* in here

This ships in a public repo, so it contains **no internal Databricks implementation details** — no Zippy field names, no billing/feature-flag identifiers, no backend routing info (e.g. which cloud actually serves a given model), and no internal-only terminology ("Verified"/"Unverified," "Early Access"). Only what a customer needs: capabilities, specs, pricing (where known), lifecycle status framed in plain language, and runnable code samples per SDK.

## Schema, briefly

Two-level map: `provider → modelId → fields`. Per model: `displayName`, `openWeights`, `description`, `recommendedFor`/`alternatives`, `contextWindow`/`maxOutputTokens`, `modalities`, `capabilities`, `reasoning` (if applicable — the actual parameter shape, not just "yes it reasons"), `pricing` (real numbers for proprietary models where published; `free_preview`/`tbd` otherwise — open-weight models never get a fabricated price), `releaseDate`, `status`/`statusNote`, `dialects`, `codeSamples` (one block per SDK — AI SDK, Mastra, Python, TypeScript, cURL — generated from the same logic the Neon Console uses, never hand-written), and `lastVerified`.

## Keeping it current

Run `/update-ai-models`. It diffs `catalog.go` for new/changed/removed models, runs a lifecycle health-check against Zippy + a live probe for everything else, and never auto-commits — it hands you a diff to review. Full details are in the command itself: `.claude/commands/update-ai-models.md`.
