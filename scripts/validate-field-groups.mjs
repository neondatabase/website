// scripts/validate-field-groups.mjs
//
// Audit for request-body grouping (scripts/lib/field-group-config.mjs).
//
// Guiding rule: a spec republish must NEVER break the site build. So the
// in-generator call is WARN-ONLY — new/removed/renamed fields can't fail the
// build (new top-level fields render in the "Other" section; renamed/removed
// configured refs still surface their data via "Other"). The standalone CLI
// (npm run audit:field-groups) is STRICT and exits non-zero on staleRefs /
// orphanedOps so CI / the maintenance agent gets a hard signal without ever
// blocking the build.
//
// For every operation that HAS a FIELD_GROUPS entry it reports:
//   · unassigned   — top-level fields no section claimed (warn; they render in
//                    "Other"). The signal to reslot a new field.
//   · staleRefs    — configured object/path no longer in the spec (renamed or
//                    removed). Data is safe (lands in "Other"); only the label
//                    is lost. Strict in CI.
//   · orphanedOps  — a FIELD_GROUPS entry whose operationId is gone from the
//                    spec (endpoint removed). Strict in CI; never blocks build.

import { FIELD_GROUPS, computeFieldGroups } from './lib/field-group-config.mjs';

/**
 * auditFieldGroups(operations) → { unassigned, staleRefs, orphanedOps }
 * @param {Array<{ operationId, requestBody? }>} operations
 */
export function auditFieldGroups(operations) {
  const present = new Set(operations.map((o) => o.operationId));
  const unassigned = [];
  const staleRefs = [];
  const orphanedOps = Object.keys(FIELD_GROUPS).filter((opId) => !present.has(opId));

  for (const op of operations) {
    if (!FIELD_GROUPS[op.operationId]) continue;
    const rb = op.requestBody;
    if (!rb?.properties) continue;
    const res = computeFieldGroups(op.operationId, rb.properties, {
      displayOrder: rb.displayOrder,
      requiredFields: rb.requiredFields,
    });
    for (const p of res.unassigned) unassigned.push(`${op.operationId}: ${p}`);
    for (const s of res.staleRefs) staleRefs.push(`${op.operationId}: ${s}`);
  }

  return { unassigned, staleRefs, orphanedOps };
}

function formatReport({ unassigned, staleRefs, orphanedOps }) {
  const lines = [];
  if (orphanedOps.length) {
    lines.push(`  orphaned config (operationId no longer in spec):`);
    for (const o of orphanedOps) lines.push(`      - ${o}`);
  }
  if (staleRefs.length) {
    lines.push(`  stale config refs (renamed/removed in spec — data falls back to "Other"):`);
    for (const s of staleRefs) lines.push(`      - ${s}`);
  }
  if (unassigned.length) {
    lines.push(`  unassigned fields (rendering in "Other" — reslot into a named section):`);
    for (const u of unassigned) lines.push(`      - ${u}`);
  }
  return lines.join('\n');
}

/**
 * validateFieldGroups(operations, { strict })
 * Warn-only by default (build-time). When strict, throws on staleRefs or
 * orphanedOps (CI audit).
 */
export function validateFieldGroups(operations, { strict = false } = {}) {
  const report = auditFieldGroups(operations);
  const { unassigned, staleRefs, orphanedOps } = report;
  const hasAny = unassigned.length || staleRefs.length || orphanedOps.length;

  if (hasAny) {
    process.stderr.write(
      `[field-group-config] request-body grouping notes:\n${formatReport(report)}\n` +
        `  Fix: edit scripts/lib/field-group-config.mjs (prefer extending an { object: ... }\n` +
        `  section so new children stay automatic).\n`
    );
  }

  if (strict && (staleRefs.length || orphanedOps.length)) {
    throw new Error(
      `[field-group-config] audit failed: ${staleRefs.length} stale ref(s), ` +
        `${orphanedOps.length} orphaned op(s). See notes above.`
    );
  }

  return report;
}

async function runCli() {
  const { readdir, readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const ROOT = 'src/data/api-ref';

  const ops = [];
  let tags = [];
  try {
    tags = await readdir(ROOT, { withFileTypes: true });
  } catch {
    console.error(`[field-group-config] no generated data at ${ROOT} — run the generator first.`);
    process.exit(1);
  }
  for (const t of tags) {
    if (!t.isDirectory()) continue;
    const dir = join(ROOT, t.name);
    for (const f of await readdir(dir)) {
      if (!f.endsWith('.json')) continue;
      try {
        ops.push(JSON.parse(await readFile(join(dir, f), 'utf8')));
      } catch {
        /* skip unparseable */
      }
    }
  }

  try {
    validateFieldGroups(ops, { strict: true });
    console.log(
      `[field-group-config] ✓ all configured operations grouped (${ops.length} ops scanned).`
    );
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

// CLI entry (npm run audit:field-groups): load generated op JSON and validate
// strictly. Reads the per-op JSON the generator writes under src/data/api-ref/.
if (import.meta.url === `file://${process.argv[1]}`) {
  runCli();
}
