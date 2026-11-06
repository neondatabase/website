// TEMPORARY manual override: operationIds present in the public OpenAPI spec
// that we intentionally hide from the generated API reference.
//
// To un-hide: remove the id from EXCLUDED_OPERATION_IDS (or empty the set),
// run `npm run generate:api-ref`, and commit the regenerated
// content/docs/api-navigation.yaml and content/docs/api-operation-ids.json.
//
// This override is intentionally sticky: routine "regenerate the API reference"
// runs keep skipping these operations until an id is removed here. The spec is
// never filtered, only the rendered output, so spec tracking stays live.
//
// Currently empty: the function-trigger operations that used to live here were
// un-hidden so the API reference documents them alongside the `neon triggers`
// CLI command. Add operationIds here to hide them again.
export const EXCLUDED_OPERATION_IDS = new Set([]);

// Pure helper: drop excluded operationIds from an iterable of ids, preserving
// order. Used by the strict docs<->API consistency check so intentionally
// excluded operations are not reported as `specNotDocumented` drift.
export function withoutExcludedOperations(operationIds) {
  return [...operationIds].filter((id) => !EXCLUDED_OPERATION_IDS.has(id));
}
