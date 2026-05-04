import { readFile } from 'fs/promises';
import path from 'path';

import ScalarMount from './ScalarMount';

const SPEC_URL = 'https://neon.com/api_spec/release/v2.json';

// ---------------------------------------------------------------------------
// Content injection config
// ---------------------------------------------------------------------------
// Markdown files live in src/content/api-docs/. Two extension points:
//
//   SIDEBAR_GUIDES — standalone guide pages. Each becomes its own entry in
//   the sidebar under the "Guides" group (above the API reference). Order
//   here = order in the sidebar.
//
//   TAG_INTROS — intro content rendered above the first operation of an
//   existing API tag. Key must match a spec tag name exactly (no-op on miss).
//
// To add content: drop a .md file in src/content/api-docs/ and add an entry
// to the appropriate list.
// ---------------------------------------------------------------------------

const SIDEBAR_GUIDES: Array<{ tagName: string; file: string }> = [
  { tagName: 'Getting Started', file: 'getting-started.md' },
];

const TAG_INTROS: Record<string, string> = {
  Auth: 'auth-intro.md',
  Project: 'project-intro.md',
  Branch: 'branch-intro.md',
  Endpoint: 'endpoint-intro.md',
  Operation: 'operation-intro.md',
  Consumption: 'consumption-intro.md',
  Snapshot: 'snapshot-intro.md',
};

// Read a guide markdown file. Returns empty string on error so a missing file
// degrades gracefully rather than breaking the page.
async function readGuide(filename: string): Promise<string> {
  try {
    return await readFile(path.join(process.cwd(), 'src/content/api-docs', filename), 'utf8');
  } catch {
    return '';
  }
}

export default async function ApiReferencePage() {
  let spec: Record<string, unknown>;

  try {
    const res = await fetch(SPEC_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Spec fetch failed: ${res.status}`);
    spec = await res.json();
  } catch {
    return <p className="p-8 text-gray-new-50">Failed to load API spec. Please try again later.</p>;
  }

  // --- info-block cleanup ---

  if (spec.info && typeof spec.info === 'object') {
    const info = spec.info as Record<string, unknown>;
    delete info.contact;
    delete info.license;
    if (typeof info.description === 'string') {
      info.description = info.description.replaceAll(
        'https://neon.tech/docs/',
        'https://neon.com/docs/'
      );
    }
  }

  // --- inject TAG_INTROS as descriptions on existing tags ---
  // Scalar renders tag descriptions as a content block above the tag's
  // operations, so this adds a rich intro without an extra sidebar entry.

  if (Array.isArray(spec.tags)) {
    const tags = spec.tags as Array<{ name: string; description?: string }>;
    await Promise.all(
      Object.entries(TAG_INTROS).map(async ([tagName, file]) => {
        const content = await readGuide(file);
        if (!content) return;
        const tag = tags.find((t) => t.name === tagName);
        if (tag) tag.description = content;
      })
    );
  }

  // --- inject SIDEBAR_GUIDES as synthetic tags so they appear in the sidebar ---
  // Tags with no operations but a description are rendered as pages by Scalar
  // (PR #7414, Nov 2025). "Introduction" is already auto-generated from
  // info.description — don't duplicate it here.

  const guideTags = (
    await Promise.all(
      SIDEBAR_GUIDES.map(async ({ tagName, file }) => {
        const content = await readGuide(file);
        return content ? { name: tagName, description: content } : null;
      })
    )
  ).filter((t): t is { name: string; description: string } => t !== null);

  if (guideTags.length > 0) {
    const existingTags = Array.isArray(spec.tags) ? (spec.tags as Array<{ name: string }>) : [];
    spec.tags = [...guideTags, ...existingTags];

    // Collect tags actually used by at least one operation so we can drop
    // empty-but-declared tags from the sidebar (e.g. "Preview" is defined in
    // the spec but currently has no operations, rendering as a blank page).
    const usedTagNames = new Set<string>();
    if (spec.paths && typeof spec.paths === 'object') {
      for (const pathItem of Object.values(spec.paths as Record<string, unknown>)) {
        if (!pathItem || typeof pathItem !== 'object') continue;
        for (const op of Object.values(pathItem as Record<string, unknown>)) {
          if (!op || typeof op !== 'object') continue;
          const opTags = (op as { tags?: unknown }).tags;
          if (!Array.isArray(opTags)) continue;
          for (const t of opTags) {
            if (typeof t === 'string') usedTagNames.add(t);
          }
        }
      }
    }

    // x-tagGroups must list every tag explicitly — anything not listed is
    // hidden by Scalar. The "Guides" group pins our pages above the
    // alphabetically-sorted API tags.
    spec['x-tagGroups'] = [
      { name: 'Guides', tags: guideTags.map((t) => t.name) },
      {
        name: 'API Reference',
        tags: existingTags.map((t) => t.name).filter((n) => usedTagNames.has(n)),
      },
    ];
  }

  return <ScalarMount spec={JSON.stringify(spec)} specUrl={SPEC_URL} />;
}
