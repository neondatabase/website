// scripts/lib/field-group-config.mjs
//
// Editorial grouping for the request-body "main section" of the API reference.
// Mirrors the shape and conventions of field-order-config.mjs: keyed by
// operationId, a small committed map that the maintenance agent owns.
//
// WHAT IS SPEC-DERIVED (never configured here):
//   · structure / nesting   — from the OpenAPI schema
//   · field order            — from field-order-config.mjs (schema.displayOrder)
//   · deprecated flag        — from the spec (schema.deprecated); deprecated
//                              top-level fields are auto-routed to "Deprecated"
//   · descriptions / types   — from the spec
//   · "out of object" marker — COMPUTED below, never hand-set
//
// WHAT YOU CONFIGURE HERE (the only maintenance surface):
//   · which section each top-level field belongs to
//   · the light "common" hint
//   · optional display labels / default labels for fields that need friendlier
//     copy than a mechanical `snake_case` humanizer can provide
//
// A section claims fields two ways:
//   object: 'a.b'        → EXPANDS that object: its direct children become the
//                          section's rows. Zero maintenance: new spec children
//                          flow in automatically. Prefer this.
//   paths / extra: [...]  → explicit field paths rendered as their own rows.
//
// Paths are dotted and rooted at the request body (e.g. 'project.name', or
// 'branch' / 'endpoints' for ops whose body has no single wrapper).
//
// computeFieldGroups emits, per section, an ordered list of `rows` where each
// row is { path, common, outOfObject } and `path` is the ABSOLUTE dotted path
// of the node to render. The UI locates each node in the body tree it already
// builds and renders it with the existing field component — no grouping logic
// lives in the UI.
//
// SEED (representative request): an optional, curated `seed` map per op. These
// values are editorial — the spec rarely carries example strings for fields
// like `name`/`region_id` — and seed a realistic body so the live curl / TS /
// CLI show a typical request on load WITHOUT counting as user edits. Reversible
// (delete the `seed` map) and only the listed leaves are affected.
// ---------------------------------------------------------------------------

export const FIELD_GROUPS = {
  createProject: {
    sections: [
      {
        id: 'basics',
        label: 'Basics',
        common: true,
        blurb: 'Name, location, and Postgres version. The handful most people set.',
        paths: ['project.name', 'project.region_id', 'project.pg_version', 'project.org_id'],
      },
      {
        id: 'compute',
        label: 'Compute',
        object: 'project.default_endpoint_settings',
        extra: ['project.provisioner'], // top-level scalar, placed thematically
        blurb: 'Autoscaling range and auto-suspend for the default endpoint.',
      },
      {
        id: 'branch',
        label: 'Branch & database',
        object: 'project.branch',
        blurb: 'The default branch and the first role and database created on it.',
      },
      {
        id: 'settings',
        label: 'Project settings',
        object: 'project.settings',
        extra: ['project.history_retention_seconds', 'project.store_passwords'],
        blurb: 'Security, compliance, quotas, retention, and maintenance.',
      },
    ],
    fallback: 'other',
    seed: {
      'project.name': 'my-production-db',
      'project.region_id': 'aws-us-east-2',
      'project.pg_version': 17,
    },
    labels: {
      'project.name': { title: 'Project name', defaultLabel: 'auto-generated' },
      'project.org_id': { title: 'Organization', defaultLabel: 'personal account' },
      'project.pg_version': { title: 'Postgres version' },
    },
  },

  updateProject: {
    sections: [
      {
        id: 'basics',
        label: 'Basics',
        common: true,
        blurb: "The project's display name.",
        paths: ['project.name'],
      },
      {
        id: 'compute',
        label: 'Compute',
        object: 'project.default_endpoint_settings',
        blurb: "Default compute settings for the project's endpoints.",
      },
      {
        id: 'settings',
        label: 'Project settings',
        object: 'project.settings',
        extra: ['project.history_retention_seconds'],
        blurb: 'Security, compliance, quotas, retention, and maintenance.',
      },
    ],
    fallback: 'other',
    seed: {
      'project.name': 'my-production-db',
    },
    labels: {
      'project.name': { title: 'Project name' },
    },
  },

  createProjectBranch: {
    sections: [
      {
        id: 'branch',
        label: 'Branch',
        object: 'branch',
        blurb: "Where the branch starts from and how it's identified.",
      },
      {
        id: 'endpoint',
        label: 'Compute endpoint',
        paths: ['endpoints'],
        blurb: 'Compute endpoint(s) created on the new branch.',
      },
      {
        id: 'annotations',
        label: 'Annotations',
        paths: ['annotation_value'],
        blurb: 'Optional key-value metadata stored on the branch.',
      },
    ],
    fallback: 'other',
    seed: {
      'branch.name': 'my-feature-branch',
    },
    labels: {
      'branch.name': { title: 'Branch name' },
      'branch.parent_id': { title: 'Parent branch' },
    },
  },
};

// Section every deprecated top-level field is routed to automatically.
export const DEPRECATED_SECTION = { id: 'deprecated', label: 'Deprecated', collapsed: true };

// Catch-all for top-level fields no section claims. Keeps new spec fields
// visible (they render here) instead of disappearing; the validator warns so
// a human/agent can reslot them into a named section.
export const FALLBACK_SECTIONS = {
  other: { id: 'other', label: 'Other' },
};

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

const isDeprecated = (schema) => schema?.deprecated === true;

function sortByOrder(keys, order) {
  if (!order?.length) return keys;
  const idx = new Map(order.map((k, i) => [k, i]));
  return [...keys].sort(
    (a, b) => (idx.has(a) ? idx.get(a) : Infinity) - (idx.has(b) ? idx.get(b) : Infinity)
  );
}

// Child properties + their display order for an object OR array-of-object schema.
function childrenOf(schema) {
  const props = schema?.properties ?? schema?.items?.properties ?? null;
  if (!props) return null;
  const order = schema.displayOrder ?? schema.items?.displayOrder ?? null;
  return { props, order };
}

// Resolve a dotted path to its schema node within a properties object.
// Descends through object.properties and array.items.properties.
function getSchemaAt(properties, path) {
  let props = properties;
  let schema = null;
  for (const seg of path.split('.')) {
    if (!props || !props[seg]) return null;
    schema = props[seg];
    const c = childrenOf(schema);
    props = c?.props ?? null;
  }
  return schema;
}

// The groupable top-level fields, as absolute { key, path, schema }. When the
// body wraps everything in a single object (createProject → `project`), we
// descend through that lone wrapper so the groupable units are its children.
function topLevelFields(properties, displayOrder) {
  const keys = Object.keys(properties);
  if (keys.length === 1) {
    const only = properties[keys[0]];
    const c = childrenOf(only);
    if (c && Object.keys(c.props).length) {
      const base = keys[0];
      return sortByOrder(Object.keys(c.props), c.order).map((k) => ({
        key: k,
        path: `${base}.${k}`,
        schema: c.props[k],
      }));
    }
  }
  return sortByOrder(keys, displayOrder).map((k) => ({
    key: k,
    path: k,
    schema: properties[k],
  }));
}

const lastSeg = (path) => path.slice(path.lastIndexOf('.') + 1);

/**
 * computeFieldGroups(operationId, properties, { displayOrder, requiredFields })
 *
 * Pure. Returns { sections, seed, labels, unassigned, staleRefs }:
 *   sections   — ordered render list, each { id, label, common, blurb,
 *                collapsed, schemaPath, rows: [{ path, common, outOfObject }] }.
 *                Includes auto-built "Other" (fallback) and "Deprecated"
 *                sections when they have rows. `null` when the op isn't
 *                configured (UI falls back to the flat tree).
 *   seed       — curated { path: value } representative-request map (only
 *                paths that exist in the spec). `null` when none configured.
 *   labels     — curated { path: { title?, defaultLabel? } } display labels
 *                (only paths that exist in the spec). `null` when none configured.
 *   unassigned — top-level field paths no section claimed (drives the warn;
 *                they still render in "Other" when a fallback is set).
 *   staleRefs  — configured `object`/`paths`/`extra`/`seed` that don't exist
 *                in the current spec (drives the CI audit; renamed/removed).
 */
export function computeFieldGroups(operationId, properties, opts = {}) {
  const cfg = FIELD_GROUPS[operationId];
  if (!cfg || !properties || Object.keys(properties).length === 0) {
    return { sections: null, seed: null, labels: null, unassigned: [], staleRefs: [] };
  }

  const topLevel = topLevelFields(properties, opts.displayOrder);
  const deprecatedPaths = new Set(
    topLevel.filter((f) => isDeprecated(f.schema)).map((f) => f.path)
  );

  const staleRefs = [];
  const consumed = new Set();
  const sections = [];

  for (const s of cfg.sections) {
    const rows = [];

    if (s.object) {
      const objSchema = getSchemaAt(properties, s.object);
      if (!objSchema) {
        staleRefs.push(`object "${s.object}"`);
      } else {
        consumed.add(s.object);
        const c = childrenOf(objSchema);
        const childKeys = c ? sortByOrder(Object.keys(c.props), c.order) : [];
        for (const k of childKeys) {
          rows.push({ path: `${s.object}.${k}`, common: !!s.common, outOfObject: false });
        }
      }
    }

    for (const p of [...(s.paths ?? []), ...(s.extra ?? [])]) {
      if (!getSchemaAt(properties, p)) {
        staleRefs.push(`path "${p}"`);
        continue;
      }
      consumed.add(p);
      const outOfObject = s.object ? !p.startsWith(`${s.object}.`) : false;
      rows.push({ path: p, common: !!s.common, outOfObject });
    }

    if (rows.length) {
      sections.push({
        id: s.id,
        label: s.label,
        common: !!s.common,
        blurb: s.blurb ?? null,
        collapsed: !!s.collapsed,
        schemaPath: commonSchemaPath(rows),
        rows,
      });
    }
  }

  // Unclaimed, non-deprecated top-level fields → fallback "Other" (and warn).
  const unassigned = [];
  const fallbackRows = [];
  for (const f of topLevel) {
    if (deprecatedPaths.has(f.path) || consumed.has(f.path)) continue;
    unassigned.push(f.path);
    if (cfg.fallback) {
      fallbackRows.push({ path: f.path, common: false, outOfObject: false });
    }
  }
  if (fallbackRows.length) {
    const fb = FALLBACK_SECTIONS[cfg.fallback] ?? FALLBACK_SECTIONS.other;
    sections.push({
      id: fb.id,
      label: fb.label,
      common: false,
      blurb: null,
      collapsed: false,
      schemaPath: commonSchemaPath(fallbackRows),
      rows: fallbackRows,
    });
  }

  // Deprecated top-level fields → collapsed "Deprecated" section, last.
  const depRows = topLevel
    .filter((f) => deprecatedPaths.has(f.path))
    .map((f) => ({ path: f.path, common: false, outOfObject: false }));
  if (depRows.length) {
    sections.push({
      ...DEPRECATED_SECTION,
      common: false,
      blurb: null,
      schemaPath: commonSchemaPath(depRows),
      rows: depRows,
    });
  }

  // Curated representative-request seed (only paths that still exist).
  let seed = null;
  if (cfg.seed) {
    seed = {};
    for (const [p, v] of Object.entries(cfg.seed)) {
      if (getSchemaAt(properties, p)) seed[p] = v;
      else staleRefs.push(`seed "${p}"`);
    }
    if (Object.keys(seed).length === 0) seed = null;
  }

  // Curated display labels (only paths that still exist).
  let labels = null;
  if (cfg.labels) {
    labels = {};
    for (const [p, v] of Object.entries(cfg.labels)) {
      if (getSchemaAt(properties, p)) labels[p] = v;
      else staleRefs.push(`label "${p}"`);
    }
    if (Object.keys(labels).length === 0) labels = null;
  }

  return { sections, seed, labels, unassigned, staleRefs };
}

// Longest common parent prefix of a section's rows, as 'a.b.*' for the card
// header. Returns null when rows live at the body root or share no prefix.
function commonSchemaPath(rows) {
  if (!rows.length) return null;
  const parents = rows.map((r) => r.path.split('.').slice(0, -1));
  let prefix = parents[0];
  for (const segs of parents.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < segs.length && prefix[i] === segs[i]) i++;
    prefix = prefix.slice(0, i);
  }
  return prefix.length ? `${prefix.join('.')}.*` : null;
}

// Exposed for the lone-wrapper-aware "top-level field" tag in the UI helper
// and for tests.
export { lastSeg };
