---
description: 'Refresh src/data/ai-gateway-models.yaml, the source-of-truth file for every AI Gateway model — feeds the docs page, models.json, and the filterable models page. Diffs against Neon AI Gateway catalog.go, cross-checks Databricks Zippy config and each provider'"'"'s own docs, and live-probes to resolve conflicts. Never writes internal-only information — output must be safe for this public repo.'
---

# Update AI Gateway Models

Refresh `src/data/ai-gateway-models.yaml` against the real Neon AI Gateway catalog. Two speeds: a cheap health-check pass (run this by default) and an expensive research pass (only for models newly added to the catalog since the last run).

**Prerequisites this command assumes are already true** — it does not set these up:
- `~/neon-cloud` cloned locally, with your own already-authorized read access (internal Databricks repo). Pull it fresh every run — do not trust a stale local copy.
- `~/universe` cloned locally, same access assumption.
- A working Neon AI Gateway credential in `~/neon.env` (`NEON_AI_GATEWAY_BASE_URL`, `OPENAI_API_KEY`) against the production project already designated for this purpose. Mind the daily $/token rate limit shared with any other usage on that project — a full-catalog live-probe sweep can burn a meaningful chunk of it; prefer the cheap pass unless you specifically need to re-verify capabilities.

**Never run any part of this in this repo's CI.** `neon-cloud` and `universe` are internal repos; this repo is public. Research happens locally, under your own access — see the redaction rule in step 6.

## Step 1: Pull sources, diff the model list — four outcomes, not two

1. `cd ~/neon-cloud && git pull --ff-only`, then read `platform/internal/aigateway/modelscatalog/catalog.go`'s `models` slice — the ground truth for which models exist, their short ID (`ShortID()`), `Provider`, `DisplayName`, and `Dialects`.
2. Read the current `src/data/ai-gateway-models.yaml` in this repo. It already stores the last-known `provider` (as the containing key), `displayName`, and `dialects` for every model — that's enough to diff against directly, no separate snapshot file needed.
3. This is a cheap text diff only — `catalog.go`'s `Provider`/`DisplayName`/`Dialects` vs. the YAML's recorded values for the same ID. It does **not** touch Zippy or live-probe anything yet; lifecycle drift is a separate check, entirely inside Step 5, for every surviving model regardless of what this step finds. **Compare `Dialects` as an unordered set, not a list** — `catalog.go`'s Go slice order carries no meaning, and a naive ordered comparison would flag a harmless reorder as "changed," triggering a wasted Step 3 re-check for nothing. Sort every model ID into one of three buckets:
   - **New** — in `catalog.go`, not in the YAML → **Step 2** (full research pass).
   - **Changed** — in both, but `Provider`, `DisplayName`, or the `Dialects` *set* doesn't match → **Step 3** (targeted re-check of just the changed field, not a full re-research), **then still goes through Step 5** like everything else.
   - **Removed** — in the YAML, not in `catalog.go` → flag for removal, **do not auto-delete**. Confirm with the user first — a model can also be temporarily absent from a single workspace rather than truly gone (seen this session: staging and production genuinely disagreed on what existed).

Every model that isn't new or removed — whether "changed" by this text diff or not — proceeds to Step 5, which is where lifecycle drift actually gets detected (it requires reading Zippy for each one; there's no way to know in advance which models need it).

## Step 2: New models — the research pass

For each new model ID, in order (stop and use whatever a given source actually provides — don't guess past a gap):

1. **`~/universe`**: pull fresh (`git pull --ff-only`), then find the model's entry in `model-serving/model-serving-common/src/main/resources/zippy/foundationModels_common.libsonnet` (search by `endpointName: "databricks-<id>"`). Pull `capabilities`, `description` (rewrite in Neon's voice — never paste Zippy's copy verbatim), `launchDate`, `supersededBy`/`isDeprecated`/`isBlockedOnCapacity` (translate into the public schema's `status` enum — see Step 6 for what NOT to carry over), and `Dialects`/`apiTypes` (cross-check against `catalog.go`).
2. **The model's own creator's official docs** (Anthropic/OpenAI/Google/Meta/Alibaba — never Databricks' `supported-models.md`, confirmed too thin; never models.dev, confirmed unreliable for Neon specifically): context window, max output tokens, capabilities, official release date, a short positioning blurb ("recommended for X, alternative Y for Z"), and — for proprietary models only — official pricing. Cite the source URL. If a fact isn't on the model's official page, say so; don't infer from a similar model in the same family.
3. **Open-weight models specifically**: no creator publishes an inference price for these, ever, confirmed across OpenAI/Meta/Alibaba's own materials. Leave `pricing.status: free_preview` (or `tbd` once preview pricing ends) with no `input`/`output` values. Do not use a Databricks-DBU-derived or any other third-party estimate as if it were a real price.
4. **Live-probe** (source `~/neon.env`, see Prerequisites): confirm the model actually works (`POST {base}/ai-gateway/mlflow/v1/chat/completions` or `{base}/ai-gateway/openai/v1/responses` per its dialect — a `chat_completions`-dialect-only error means retry on the other route before concluding anything), and — if it claims reasoning/thinking support — send the provider's standard parameter shape first; if rejected, the error usually names the correct one (this is how Opus 4.8's `adaptive`+`effort` shape and Qwen3.5's `reasoning_effort` shape were found). Record whatever the live behavior actually is over what the provider's docs claim if they conflict (proven necessary — Qwen3.5's real 8K output cap vs. its claimed ~82K; also true for `llama-4-maverick`/`meta-llama-3-1-8b-instruct`/`meta-llama-3-3-70b-instruct`/`gpt-oss-120b`/`gpt-oss-20b`/`qwen3-next-80b-a3b-instruct`'s real output caps, all found by deliberately requesting more than assumed and reading the resulting error).
   - **Testing image input specifically: don't use a 1×1 or other degenerate pixel image.** It produced a false negative for `claude-sonnet-4` (the model insisted no image was attached, reproducibly, across two dialects) despite the model genuinely supporting image input — confirmed once a real, properly-encoded image was used instead. Generate a small real image instead, e.g. `python3 -c "from PIL import Image; import io, base64; img = Image.new('RGB', (64, 64), color=(220, 20, 60)); buf = io.BytesIO(); img.save(buf, format='PNG'); print(base64.b64encode(buf.getvalue()).decode())"`, and ask the model what color it is — an answer naming the actual color is a clean confirmation, a claim of "no image attached" is a real signal, not a test artifact.
   - **Testing web search: rejection wording can differ per model even within the same provider family.** Anthropic's Messages dialect gave a generic "not in the accepted tools list" error for `claude-sonnet-4-6` but a model-specific "not supported for this model" error for `claude-opus-4-8` — don't assume a family-wide rejection from one model's error shape; the phrasing itself may indicate a per-model check.
   - **Testing audio input: don't use silence.** A WAV file of pure zero-amplitude frames produced a false "I don't have the ability to listen to audio" response from a model that does support audio — confirmed once a real generated tone was used instead (and the response's `usageMetadata` showed an actual `AUDIO` modality token count, the clean way to prove it was really processed, not just that the request didn't error). Same root cause as the image case: degenerate test input, not a real capability gap. Generate a real tone, e.g. a one-second 440Hz sine wave via `wave`+`struct`, not silence.
5. **Code samples**: generate with `npx tsx` against `~/universe/lakebase/web/apps/console/pages/ProjectAIGateway/aiGatewayQuickstart.ts`'s `SNIPPET_LANGUAGES`, using the placeholder base URL (`https://<your-branch-ai-gateway-endpoint>`) — never a real branch host. Pick `api` (`chat_completions` vs. `openai_responses`) via the same rule as `.../models.ts`'s `snippetApiFor`: Responses-only if the model's dialects exclude `chat_completions` and include `openai_responses`.

## Step 3: Changed models — targeted re-check, not full re-research

Don't re-run the whole research pass for a model that already exists in the YAML — only touch what `catalog.go` actually changed, plus its real downstream consequences:

- **`Dialects` changed** (a model gains/loses an API surface, e.g. Responses-API support): the one with real consequences. Regenerate its **code samples** (the dialect determines which endpoint `aiGatewayQuickstart.ts`'s `snippetApiFor` routes to) and **re-run the reasoning-parameter live-probe** if it has the `reasoning` capability, since the correct dialect for that probe may have changed too.
- **`Provider` changed**: move the entry to the correct top-level provider block in the YAML, and re-check whether the pricing source needs to change (different provider = different official pricing page).
- **`DisplayName` changed**: update the field. No downstream effect.

Update `lastVerified` to today's date on any model touched here, then continue to Step 5 like every other surviving model.

## Step 4: Write the new entries

Follow the schema in `~/neon-ai-gateway-published-schema.md` exactly — field names, types, and the provider-grouped structure. Every field must trace to something gathered in Step 2; don't fill a gap with a plausible-sounding guess. Set `lastVerified` to today's date on every new entry.

**Ordering convention: alphabetical by model ID within each provider block.** Insert new entries at their alphabetically correct position, don't append at the end — this keeps future diffs minimal and the insertion point unambiguous. If an existing provider block isn't currently alphabetical, that's a pre-existing inconsistency worth fixing opportunistically (a pure reorder, no content change) rather than compounding it.

## Step 5: Health-check pass (the cheap, default path)

For every model **already** in the YAML:

1. Confirm it's still in `catalog.go` (Step 1 already did this).
2. Re-check its Zippy entry's `status`-relevant fields (`supersededBy`, `isDeprecated`, `isBlockedOnCapacity`).
3. Live-probe it once (minimal request, correct dialect) to catch the case Zippy alone gets wrong in either direction — proven to happen this session in both directions (a model Zippy flagged `isDeprecated: true` that still worked fine, and a model Zippy showed as merely capacity-constrained that was actually already dead). **Trust the live probe over Zippy when they disagree.**
4. Update `status`/`statusNote` only if something changed. `statusNote` is hand-written customer framing — never auto-populate it from raw API error text or from Zippy's internal field names.
5. Leave `pricing`, `contextWindow`, `description`, `codeSamples`, etc. untouched unless something about the model itself demonstrably changed — these don't need re-research on every run.

**If a live-probe call returns `429`/`REQUEST_LIMIT_EXCEEDED` mid-sweep** (hit twice this session — this is a real, expected failure mode, not an edge case): stop the sweep immediately. Report exactly which models were checked before the limit hit and which weren't. **Do not update `lastVerified` for any model that wasn't actually re-probed** — a partially-completed sweep must not look complete in the data. Resume the remaining models on a later run, ideally against a different project's budget if one's available, rather than waiting out the same daily limit.

## Step 6: Redaction check before writing anything

Before any content lands in the YAML, run a mechanical check first, then a judgment check — the grep is a cheap backstop, not a substitute for actually thinking about what you wrote:

```bash
grep -inE 'databricks-[a-z0-9-]+|system\.ai\.|modelKillswitchFlagName|billingEnumName|systemAiModelName|databricks\.model\.serving\.|backendConfigs|served via (amazon )?bedrock|served via vertex|served via openai backend|\bverified\b|\bunverified\b' src/data/ai-gateway-models.yaml
```

Any match is a stop-and-review signal — most will be false positives (e.g. a code sample legitimately containing a model ID that happens to match), but check every one before proceeding. This catches accidental verbatim leaks the judgment check below might miss on a tired read-through.

Then confirm none of the following slipped in from the research phase — this file ships in a public repo:

- Any Zippy-internal identifier: `modelKillswitchFlagName`, `billingEnumName`, `systemAiModelName`, `backendConfigs`/backend names (e.g. "served via Amazon Bedrock" — real, but an implementation detail, not customer information), any `databricks.model.serving.*` flag name, any Unity Catalog `system.ai.*` path.
- **"Verified"/"Unverified"** — the internal name for the account-gating mechanism behind `openWeights` (per `catalog.go`'s `RequiresAccountVerification`/`openAccessModelIDs`). Never use these two words in customer-facing content. **Do not use "Early Access" either** — that term is being retired in favor of "Beta" as the official rollout name (confirmed directly, 2026-07-09; an internal UX doc dated the same day still uses "Early Access," so that doc is already stale on this specific point — don't trust it for terminology). If a `statusNote` or description ever needs to reference access gating, confirm the current official term with Atli/product before writing it — this naming is actively in flux, don't guess.
- Raw live-probe error text, verbatim. Paraphrase into the clean `status`/`statusNote` fields instead.
- Anything sourced from an internal Slack conversation about *why* a model changed (contractual/legal/access reasons). If you know why a model was removed and it came from an internal conversation, that context stays out of this file — full stop, no exceptions, regardless of how it's worded.
- Any unofficial/derived pricing number for an open-weight model.

If in doubt about a specific value, leave it out and flag it for the human reviewing the PR rather than guessing safe.

## Step 7: Update the private provenance record, then diff and hand off — no auto-merge

The public YAML deliberately carries no per-field `source`/`confidence` tags — that's correct for a public file, but it means the YAML alone can't distinguish "this field is untested, deliberately" from "this should be here and got missed by mistake." That distinction only exists in the private context file (`~/neon-ai-gateway-models-context.md` and `~/neon-model-metadata-schema.md`). **Before handing off, update whichever of those actually changed this run**: which fields were live-verified vs. left as provider-doc-only or inferred-from-a-sibling-model, and which capabilities remain genuinely untested. Skipping this step is exactly how a gap like "16 models claim `reasoning` with no documented parameter shape" goes unnoticed until someone happens to audit the file by hand.

Then show the full diff. Do not commit or open a PR automatically — this is Daniel's call, same reasoning as why this command doesn't run in CI: the redaction step needs a human in the loop, not just a linter.
