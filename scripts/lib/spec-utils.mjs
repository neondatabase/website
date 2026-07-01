// Shared OpenAPI spec parsing utilities used by generate-api-ref.mjs and audit-api-spec.mjs.

import { micromark } from 'micromark';

// Merge path-level + operation-level params; op-level wins on same name+in.
export function mergeParams(pathItemParams = [], operationParams = []) {
  const map = new Map();
  for (const p of [...pathItemParams, ...operationParams]) {
    map.set(`${p.name}:${p.in}`, p);
  }
  return [...map.values()];
}

// Flatten allOf members into a single schema object.
// Copies all keys from each member (type, description, etc.), merges properties,
// and deduplicates required fields.
// Flatten an `allOf` composition into a single object schema.
//
// Conflict resolution is intentionally last-write-wins for both `properties`
// and top-level keys: later members in the `allOf` array override earlier
// ones on the same key. Spec authors who want a different precedence must
// re-order the `allOf` array. `required` is the only field we union across
// members (deduplicated) since both the contract and renderer treat it as
// a set rather than a single value.
export function flattenAllOf(schema) {
  if (!schema?.allOf) return schema ?? null;
  const merged = { type: 'object', properties: {}, required: [] };
  for (const member of schema.allOf) {
    Object.assign(merged.properties, member.properties ?? {});
    merged.required.push(...(member.required ?? []));
    for (const key of Object.keys(member)) {
      if (key !== 'properties' && key !== 'required') merged[key] = member[key];
    }
  }
  merged.required = [...new Set(merged.required)];
  return merged;
}

// Collapse a polymorphic `oneOf` (or `anyOf`) schema down to a single
// renderable schema by picking the variant with the most fields. Polymorphic
// schemas in the spec carry no top-level `properties`, so the existing
// renderer (which reads `schema.properties`) shows an empty Schema tab. This
// helper picks one variant as the primary so the tab is populated, and
// returns a markdown note describing the other variant(s) so callers can
// surface them in prose (e.g. by appending to the operation description).
//
// Returns `null` when the schema has no oneOf/anyOf (callers can use the
// schema as-is, mirroring flattenAllOf's pass-through behavior). Otherwise
// returns `{ schema, note, primaryLabel }`:
//   - `schema`       — a shallow clone of the chosen variant, with cloned
//                      `properties`/`required` so callers can mutate freely
//                      without poisoning the underlying spec.
//   - `note`         — markdown string describing alternates, or `null` if
//                      there's nothing to add.
//   - `primaryLabel` — the label of the chosen variant (used to annotate
//                      the rendered schema).
//
// `discriminatorLabels` is an optional array of human-readable labels per
// variant (same length and order as `oneOf`/`anyOf`). The caller derives
// these from the raw (non-dereferenced) spec — once @scalar/openapi-parser
// inlines a $ref, the source schema name is lost, so we can't recover the
// discriminator mapping from the dereferenced variant alone. When omitted,
// labels fall back to titles and then `variantN`.
//
// Heuristic for "primary":
//   1. Most properties (the fuller documentation surface)
//   2. Tiebreak: most required fields
//   3. Tiebreak: input order
export function flattenOneOf(schema, { discriminatorLabels = null } = {}) {
  if (!schema || typeof schema !== 'object') return null;
  const variants = schema.oneOf ?? schema.anyOf;
  if (!Array.isArray(variants) || variants.length === 0) return null;
  if (schema.properties) return null;

  const usable = variants
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => v && typeof v === 'object' && v.properties);
  if (usable.length === 0) return null;

  const ranked = usable
    .map(({ v, i }) => ({
      v,
      label: labelFor(v, i, discriminatorLabels),
      propCount: Object.keys(v.properties).length,
      reqCount: (v.required ?? []).length,
    }))
    .sort((a, b) => b.propCount - a.propCount || b.reqCount - a.reqCount);

  const primary = ranked[0];
  const alternates = ranked.slice(1);

  const discriminator = schema.discriminator?.propertyName;
  const noteLines = alternates.map((alt) => {
    const required = alt.v.required ?? [];
    const fieldList = required.length
      ? `${required.map((f) => `\`${f}\``).join(', ')} required`
      : 'all fields optional';
    return discriminator
      ? `**Alternative shape:** set \`${discriminator}: ${alt.label}\` to use the ${alt.label} variant (${fieldList}).`
      : `**Alternative shape:** ${alt.label} variant (${fieldList}).`;
  });

  // Shallow-clone the variant plus the two collections that callers (and the
  // renderer) treat as mutable. Without this, `enrichSchemaProperties` and
  // friends would mutate the dereferenced spec in place, affecting any later
  // op that points at the same component.
  const clonedSchema = { ...primary.v };
  if (clonedSchema.properties) clonedSchema.properties = { ...clonedSchema.properties };
  if (Array.isArray(clonedSchema.required)) clonedSchema.required = [...clonedSchema.required];

  return {
    schema: clonedSchema,
    note: noteLines.length > 0 ? noteLines.join('\n\n') : null,
    primaryLabel: primary.label,
  };
}

// S6: use `!= null` so an empty-string discriminator key still wins over the
// title/`variantN` fallbacks. (Truthy check used to drop falsy-but-meaningful
// labels.)
export function labelFor(variant, index, discriminatorLabels) {
  if (discriminatorLabels && discriminatorLabels[index] != null) return discriminatorLabels[index];
  if (variant?.title) return variant.title;
  return `variant${index + 1}`;
}

// Resolve a local JSON Pointer ($ref) like `#/components/schemas/Foo` against
// `specRaw`. Returns the referenced node, or `null` for unresolvable / non-
// local refs.
export function resolveLocalRef(specRaw, ref) {
  if (typeof ref !== 'string' || !ref.startsWith('#/')) return null;
  const parts = ref.slice(2).split('/');
  let node = specRaw;
  for (const p of parts) {
    if (node == null) return null;
    node = node[p];
  }
  return node ?? null;
}

// Extract discriminator labels for a oneOf schema by reading the RAW (non-
// dereferenced) spec. @scalar/openapi-parser inlines $refs and loses the
// source schema name, so the dereferenced variant alone can't be matched
// back to the discriminator mapping. Returns an array aligned with the
// schema's `oneOf` index, or null when there's nothing to resolve.
//
// S4: follow $refs across multiple hops with a cap and cycle detection so a
// spec that wraps the polymorphic schema in a chain of refs (or accidentally
// loops a ref back to itself) doesn't fail to extract labels — and doesn't
// hang.
export function discriminatorLabelsFromRaw(specRaw, rawSchema) {
  let s = rawSchema;
  const seen = new Set();
  const MAX_REF_DEPTH = 8;
  let depth = 0;
  while (s?.$ref && !s.oneOf && !s.anyOf) {
    if (seen.has(s.$ref) || depth >= MAX_REF_DEPTH) break;
    seen.add(s.$ref);
    const next = resolveLocalRef(specRaw, s.$ref);
    if (!next) break;
    s = next;
    depth++;
  }
  const variants = s?.oneOf ?? s?.anyOf;
  const mapping = s?.discriminator?.mapping;
  if (!Array.isArray(variants) || !mapping) return null;
  const nameToKey = {};
  for (const [key, ref] of Object.entries(mapping)) {
    nameToKey[String(ref).split('/').pop()] = key;
  }
  return variants.map((v) => {
    const name = String(v?.$ref ?? '').split('/').pop();
    return nameToKey[name] ?? null;
  });
}

// Walk the raw spec to the same schema location used by the request body /
// response handling. Returns null when the location is missing.
//
// S5: throw on unknown `location` instead of silently returning null —
// catches typos at the call site, which would otherwise show up as missing
// discriminator labels with no error.
export function getRawSchemaAt(specRaw, pathStr, method, location, status) {
  if (location !== 'request' && location !== 'response') {
    throw new Error(
      `getRawSchemaAt: unknown location "${location}" (expected "request" or "response")`
    );
  }
  const op = specRaw?.paths?.[pathStr]?.[method];
  if (!op) return null;
  if (location === 'request') return op.requestBody?.content?.['application/json']?.schema ?? null;
  return op.responses?.[status]?.content?.['application/json']?.schema ?? null;
}

// Return { status, response } for the first 2xx response, or null.
// Intentionally checks only 200/201 — 202/203/204 (accepted/no-content) have
// no meaningful response body to display.
export function find2xxResponse(responses = {}) {
  for (const status of ['200', '201']) {
    if (responses[status]) return { status, response: responses[status] };
  }
  return null;
}

// Extract the first example value from a request body or response content object.
export function getRequestBodyExample(requestBody) {
  const content = requestBody?.content?.['application/json'];
  if (!content) return null;
  if (content.example !== undefined) return content.example;
  if (content.examples) {
    const first = Object.values(content.examples)[0];
    return first?.value ?? null;
  }
  return null;
}

// Strip markdown link syntax so descriptions render as plain text in HTML.
// Known limitation: `[^\]]+` for the label disallows literal `]` inside the
// label text, so a nested-bracket form like `[outer [inner] label](url)` is
// left unchanged. Acceptable today because spec descriptions don't use that
// shape — see the `nested ]` test in scripts/generate-api-ref.test.js.
export function stripMarkdownLinks(text) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

// Convert a markdown description to safe HTML for dangerouslySetInnerHTML.
// SAFETY INVARIANT: micromark escapes all raw HTML by default (allowDangerousHtml
// is NOT passed), so raw <script> tags and event attributes in spec descriptions
// are rendered as escaped text, not executed. Do not pass allowDangerousHtml here.
export function descriptionToHtml(text) {
  if (!text) return '';
  return micromark(text);
}
