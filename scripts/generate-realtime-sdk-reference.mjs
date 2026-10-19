#!/usr/bin/env node

// Renders the generated Realtime SDK reference partials, one per module, from the vendored
// TypeDoc artifact, emitted to content/docs/shared-content/realtime-sdk-<module-slug>.md.
// Deterministic: the same artifact and manifest give byte-identical output.
// Usage: node scripts/generate-realtime-sdk-reference.mjs [output-root]

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { format as formatWithPrettier, resolveConfig } from 'prettier';

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const MANIFEST_PATH = 'config/realtime-sdk.json';
export const VENDORED_PATH = 'vendor/realtime/sdk-docs.json';
export const PARTIAL_DIR = 'content/docs/shared-content';
export const PARTIAL_PREFIX = 'realtime-sdk-';

// The generator is written against one TypeDoc release and one artifact schema.
// The JSON shape shifts across TypeDoc minor versions, so a moved pin fails loudly
// here rather than silently emitting half a reference.
export const SUPPORTED_TYPEDOC_VERSION = '0.28.20';
export const SUPPORTED_SCHEMA_VERSION = '2.0';

// MAINTAINER NOTE: The partials in content/docs/shared-content/realtime-sdk-*.md are
// generated from the Realtime SDK source. Do not edit them by hand. To change them, run
// npm run update:realtime-sdk if the SDK moved, or npm run generate:realtime-sdk-reference
// if only the generator changed.
// The banner text that used to appear in the partial body is now removed to avoid appearing
// multiple times on the rendered SDK reference page (which inlines all the partials).
// The drift check (npm run check:realtime-sdk-reference) enforces that generated partials match
// the generator's output exactly.

const KIND_VARIABLE = 32;
const KIND_FUNCTION = 64;
const KIND_CLASS = 128;
const KIND_INTERFACE = 256;
const KIND_CONSTRUCTOR = 512;
const KIND_TYPE_ALIAS = 2097152;
const KIND_REFERENCE = 4194304;

const KIND_LABELS = new Map([
  [KIND_VARIABLE, 'Variable'],
  [KIND_FUNCTION, 'Function'],
  [KIND_CLASS, 'Class'],
  [KIND_INTERFACE, 'Interface'],
  [KIND_TYPE_ALIAS, 'Type alias'],
  [KIND_REFERENCE, 'Re-export'],
]);

export function kindLabel(child) {
  const label = KIND_LABELS.get(child.kind);
  if (!label) {
    throw new Error(
      `Unsupported TypeDoc kind ${child.kind} on export ${child.name}. Extend KIND_LABELS.`
    );
  }
  return label;
}

// TypeDoc names a destructured parameter __namedParameters. The declared type is
// the props interface, so the parameter is renamed to match the source.
const DESTRUCTURED_PARAMETER_NAME = '__namedParameters';
const DESTRUCTURED_PARAMETER_LABEL = 'props';

const BLOCK_TAG_LABELS = new Map([
  ['@returns', 'Returns'],
  ['@throws', 'Throws'],
  ['@default', 'Default'],
  ['@defaultValue', 'Default'],
  ['@example', 'Example'],
  ['@param', 'Parameter'],
  ['@remarks', 'Remarks'],
]);

export function readManifest(root = REPO_ROOT) {
  return JSON.parse(readFileSync(resolve(root, MANIFEST_PATH), 'utf8'));
}

export function readArtifact(root = REPO_ROOT) {
  return JSON.parse(readFileSync(resolve(root, VENDORED_PATH), 'utf8'));
}

export function assertVersions(artifact) {
  if (artifact.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    throw new Error(
      `${VENDORED_PATH} carries schemaVersion ${artifact.schemaVersion}, expected ` +
        `${SUPPORTED_SCHEMA_VERSION}. Re-run npm run update:realtime-sdk.`
    );
  }
}

export function moduleSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** id to partial location, for @link tags and for the cross-linked duplicate types. */
export function buildSymbolIndex(artifact) {
  const index = new Map();
  for (const moduleEntry of artifact.children ?? []) {
    const slug = moduleSlug(moduleEntry.name);
    const { ids } = assignExportAnchorIds(moduleEntry, slug);
    for (const child of moduleEntry.children ?? []) {
      if (child.kind === KIND_REFERENCE) continue;
      index.set(child.id, {
        name: child.name,
        moduleName: moduleEntry.name,
        slug,
        anchorId: ids.get(child.id) ?? `${slug}-${slugify(child.name)}`,
      });
    }
  }
  return index;
}

export function symbolHref(entry) {
  // All symbols are on the hand-written TypeScript SDK page, with anchor ids
  // prefixed by module slug.
  return `/docs/realtime/sdks/typescript#${entry.anchorId}`;
}

// ---------------------------------------------------------------------------
// Anchors
// ---------------------------------------------------------------------------

// The repository's own explicit-anchor syntax, a trailing `(#id)` on the heading
// line, read by src/components/shared/anchor-heading and by
// src/utils/get-table-of-contents.js, and already used by pages under content/docs.
// Declaring the id matters here because the site's fallback slugger is a bare
// slugify with no dedupe.
// Only h2 to h4 render through anchor-heading (src/components/shared/content/content.jsx),
// so only those levels get an id and lose the visible `(#id)`. An h5 or h6 renders
// with no id and shows the raw `(#id)` text, so the generator never emits one.
const CUSTOM_ANCHOR_ID = /\s*\((#)([^)]+)\)$/;
const FENCE_LINE = /^\s*(```|~~~)/;
const HEADING_LINE = /^(#{1,6})\s+(.*)$/;
const ANCHORED_LEVELS = new Set([2, 3, 4]);

/** The two fixed section ids every generated partial declares before any symbol. */
export const FIXED_ANCHOR_IDS = ['symbols'];

/** A heading line with its anchor id declared explicitly. */
export function anchorHeading(level, text, id = slugify(text)) {
  return `${'#'.repeat(level)} ${text} (#${id})`;
}

/**
 * A per-module allocator that hands out unique anchor ids, prefixed with the
 * module slug. Two exports can slug to the same id (`RealtimeCollectionOptions`
 * and `realtimeCollectionOptions` differ only in case), so a collision takes a
 * `-2` suffix. Deterministic because the allocation order is the artifact's own
 * group order, never a hash or a counter that outlives the module.
 */
export function createAnchorAllocator(moduleSlug, seed = []) {
  const taken = new Set(seed.map((id) => `${moduleSlug}-${id}`));
  return function allocate(name) {
    const base = slugify(name);
    let id = base;
    let suffix = 2;
    let prefixed = `${moduleSlug}-${id}`;
    while (taken.has(prefixed)) {
      id = `${base}-${suffix}`;
      prefixed = `${moduleSlug}-${id}`;
      suffix += 1;
    }
    taken.add(prefixed);
    return prefixed;
  };
}

/**
 * Anchor ids for a module's exports, keyed by TypeDoc id, plus the live allocator
 * so the caller can keep allocating member and sub-section ids into the same partial.
 * Export ids are allocated first and in export order, which is what lets the
 * symbol index reproduce them without rendering the partial.
 */
export function assignExportAnchorIds(moduleEntry, moduleSlug) {
  const allocate = createAnchorAllocator(moduleSlug, FIXED_ANCHOR_IDS);
  const ids = new Map();
  for (const { child } of orderedExports(moduleEntry)) {
    ids.set(child.id, allocate(child.name));
  }
  return { ids, allocate };
}

/**
 * Every h2 to h4 heading outside a fenced block, with the id the site will give
 * it: the explicit `(#id)` where one is declared, otherwise the slug of the text.
 * Other levels are skipped because the site renders them without an id.
 */
export function headingLines(markdown) {
  const found = [];
  let fence = null;
  for (const line of markdown.split('\n')) {
    const fenceMatch = FENCE_LINE.exec(line);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1] === fence) fence = null;
      continue;
    }
    if (fence) continue;
    const match = HEADING_LINE.exec(line);
    if (!match || !ANCHORED_LEVELS.has(match[1].length)) continue;
    const custom = CUSTOM_ANCHOR_ID.exec(match[2]);
    const text = (custom ? match[2].slice(0, custom.index) : match[2]).trim();
    found.push({ level: match[1].length, text, id: custom ? custom[2] : slugify(text) });
  }
  return found;
}

/** The anchor ids a rendered partial declares, in document order. */
export function declaredAnchorIds(markdown) {
  return headingLines(markdown).map((entry) => entry.id);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

function needsParens(type) {
  return ['union', 'intersection', 'reflection', 'conditional'].includes(type?.type);
}

/** A union or intersection member, parenthesized where it would otherwise bind wrongly. */
function renderOperand(type) {
  const rendered = renderType(type);
  const isFunction = type?.type === 'reflection' && type.declaration?.signatures?.length;
  return isFunction || type?.type === 'conditional' ? `(${rendered})` : rendered;
}

export function renderType(type) {
  if (!type) return 'unknown';
  switch (type.type) {
    case 'intrinsic':
      return type.name;
    case 'literal':
      return JSON.stringify(type.value);
    case 'reference': {
      const args = (type.typeArguments ?? []).map((argument) => renderType(argument));
      return args.length ? `${type.name}<${args.join(', ')}>` : type.name;
    }
    case 'array': {
      const inner = renderType(type.elementType);
      return needsParens(type.elementType) ? `(${inner})[]` : `${inner}[]`;
    }
    case 'union':
      return type.types.map((member) => renderOperand(member)).join(' | ');
    case 'intersection':
      return type.types.map((member) => renderOperand(member)).join(' & ');
    case 'typeOperator':
      return `${type.operator} ${renderType(type.target)}`;
    case 'reflection':
      return renderTypeLiteral(type.declaration);
    case 'conditional':
      return [
        renderType(type.checkType),
        'extends',
        renderType(type.extendsType),
        '?',
        renderType(type.trueType),
        ':',
        renderType(type.falseType),
      ].join(' ');
    case 'predicate': {
      const subject = type.asserts ? `asserts ${type.name}` : type.name;
      return type.targetType ? `${subject} is ${renderType(type.targetType)}` : subject;
    }
    case 'query':
      return `typeof ${renderType(type.queryType)}`;
    case 'indexedAccess': {
      const object = renderType(type.objectType);
      const wrapped = needsParens(type.objectType) ? `(${object})` : object;
      return `${wrapped}[${renderType(type.indexType)}]`;
    }
    case 'mapped': {
      const readonly = type.readonlyModifier
        ? `${type.readonlyModifier.replace('+', '')}readonly `
        : '';
      const optional = type.optionalModifier ? `${type.optionalModifier.replace('+', '')}?` : '';
      const remap = type.nameType ? ` as ${renderType(type.nameType)}` : '';
      return `{ ${readonly}[${type.parameter} in ${renderType(type.parameterType)}${remap}]${optional}: ${renderType(type.templateType)} }`;
    }
    default:
      throw new Error(
        `Unsupported TypeDoc type variant "${type.type}". Extend renderType before regenerating.`
      );
  }
}

function renderTypeLiteral(declaration) {
  if (declaration?.signatures?.length) {
    return declaration.signatures
      .map(
        (signature) =>
          `(${renderParameters(signature.parameters)}) => ${renderType(signature.type)}`
      )
      .join(' & ');
  }
  const members = (declaration?.children ?? []).map((child) => {
    const optional = child.flags?.isOptional ? '?' : '';
    return `${readonlyPrefix(child)}${child.name}${optional}: ${renderMemberType(child)}`;
  });
  for (const signature of declaration?.indexSignatures ?? []) {
    members.push(`[${renderParameters(signature.parameters)}]: ${renderType(signature.type)}`);
  }
  return members.length ? `{ ${members.join('; ')} }` : '{}';
}

/** `readonly` from the flag, unless the rendered type already carries the operator. */
function readonlyPrefix(member) {
  if (!member.flags?.isReadonly) return '';
  return renderMemberType(member).startsWith('readonly ') ? '' : 'readonly ';
}

function renderMemberType(member) {
  if (member.signatures?.length) {
    const keyword = member.kind === KIND_CONSTRUCTOR ? 'new ' : '';
    return member.signatures
      .map(
        (signature) =>
          `${keyword}${renderTypeParameters(signature.typeParameters)}(${renderParameters(signature.parameters)}) => ${renderType(signature.type)}`
      )
      .join(' & ');
  }
  return renderType(member.type);
}

export function renderTypeParameters(typeParameters) {
  if (!typeParameters?.length) return '';
  const rendered = typeParameters.map((parameter) => {
    const constraint = parameter.type ? ` extends ${renderType(parameter.type)}` : '';
    const fallback = parameter.default ? ` = ${renderType(parameter.default)}` : '';
    return `${parameter.name}${constraint}${fallback}`;
  });
  return `<${rendered.join(', ')}>`;
}

export function parameterName(parameter) {
  return parameter.name === DESTRUCTURED_PARAMETER_NAME
    ? DESTRUCTURED_PARAMETER_LABEL
    : parameter.name;
}

export function renderParameters(parameters) {
  return (parameters ?? [])
    .map((parameter) => {
      const optional = parameter.flags?.isOptional ? '?' : '';
      // A default is not an optional flag: TypeDoc records it as defaultValue.
      const fallback = parameter.defaultValue ? ` = ${parameter.defaultValue}` : '';
      return `${parameterName(parameter)}${optional}: ${renderType(parameter.type)}${fallback}`;
    })
    .join(', ');
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

function renderInlineTag(part, index) {
  if (part.tag !== '@link') {
    throw new Error(`Unsupported TSDoc inline tag ${part.tag}. Extend renderInlineTag.`);
  }
  const target = index.get(part.target);
  return target ? `[\`${part.text}\`](${symbolHref(target)})` : `\`${part.text}\``;
}

/** Comment parts to markdown blocks. A fenced code part becomes its own block. */
export function renderParts(parts, index) {
  const blocks = [];
  let inline = '';
  const flush = () => {
    if (inline.trim()) blocks.push(inline.trim());
    inline = '';
  };
  for (const part of parts ?? []) {
    if (part.kind === 'code' && part.text.trimStart().startsWith('```')) {
      flush();
      blocks.push(part.text.trim());
      continue;
    }
    if (part.kind === 'inline-tag') {
      inline += renderInlineTag(part, index);
      continue;
    }
    inline += part.text;
  }
  flush();
  return blocks;
}

function renderBlockTag(tag, index) {
  const label = BLOCK_TAG_LABELS.get(tag.tag);
  const blocks = renderParts(tag.content, index);
  if (tag.tag === '@description') return blocks;
  if (!label) {
    throw new Error(`Unsupported TSDoc block tag ${tag.tag}. Extend BLOCK_TAG_LABELS.`);
  }
  const name = tag.name ? ` \`${tag.name}\`` : '';
  const fenced = blocks.some((block) => block.startsWith('```'));
  if (fenced) return [`**${label}${name}**`, ...blocks];
  return [`**${label}${name}:** ${blocks.join(' ')}`];
}

export function renderComment(comment, index) {
  if (!comment) return [];
  const blocks = renderParts(comment.summary, index);
  for (const tag of comment.blockTags ?? []) {
    blocks.push(...renderBlockTag(tag, index));
  }
  return blocks;
}

/** One-line, pipe-safe cell text: the first prose paragraph of a summary. */
export function summaryCell(comment, index) {
  const blocks = renderParts(comment?.summary, index).filter((block) => !block.startsWith('```'));
  if (!blocks.length) return '';
  return blocks[0]
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

// ---------------------------------------------------------------------------
// Declarations
// ---------------------------------------------------------------------------

export function declarationSignature(child) {
  if (child.kind === KIND_INTERFACE) {
    const extended = (child.extendedTypes ?? []).map((type) => renderType(type));
    const heritage = extended.length ? ` extends ${extended.join(', ')}` : '';
    return `interface ${child.name}${renderTypeParameters(child.typeParameters)}${heritage}`;
  }
  if (child.kind === KIND_CLASS) {
    const extended = (child.extendedTypes ?? []).map((type) => renderType(type));
    const implemented = (child.implementedTypes ?? []).map((type) => renderType(type));
    const heritage = [
      extended.length ? ` extends ${extended.join(', ')}` : '',
      implemented.length ? ` implements ${implemented.join(', ')}` : '',
    ].join('');
    return `class ${child.name}${renderTypeParameters(child.typeParameters)}${heritage}`;
  }
  if (child.kind === KIND_TYPE_ALIAS) {
    return `type ${child.name}${renderTypeParameters(child.typeParameters)} = ${renderType(child.type)}`;
  }
  if (child.kind === KIND_VARIABLE) {
    const keyword = child.flags?.isConst ? 'const' : 'let';
    return `${keyword} ${child.name}: ${renderType(child.type)}`;
  }
  throw new Error(
    `Unsupported TypeDoc kind ${child.kind} on export ${child.name}. Extend declarationSignature.`
  );
}

function signatureLine(keyword, name, signature) {
  const typeParameters = renderTypeParameters(signature.typeParameters);
  const parameters = renderParameters(signature.parameters);
  const returns = renderType(signature.type);
  return `${keyword}${name}${typeParameters}(${parameters}): ${returns}`;
}

function fence(code) {
  return ['```ts', code, '```'].join('\n');
}

// GFM splits a table row on every unescaped pipe, inside code spans too, so a
// union type in a cell would spill into the next column.
function tableCell(text) {
  return text.replace(/(?<!\\)\|/g, '\\|');
}

function table(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(tableCell).join(' | ')} |`),
  ].join('\n');
}

function memberDetailNeeded(member, index) {
  const comments = [member.comment, ...(member.signatures ?? []).map((sig) => sig.comment)].filter(
    Boolean
  );
  return comments.some(
    (comment) =>
      (comment.blockTags ?? []).length > 0 || renderParts(comment.summary, index).length > 1
  );
}

function memberRows(child, index, detailAnchors) {
  const rows = [];
  for (const member of child.children ?? []) {
    const optional = member.flags?.isOptional ? '?' : '';
    const anchor = detailAnchors.get(member.id);
    const name = anchor
      ? `[\`${member.name}${optional}\`](#${anchor})`
      : `\`${member.name}${optional}\``;
    const comment = member.comment ?? member.signatures?.[0]?.comment;
    rows.push([
      name,
      `\`${readonlyPrefix(member)}${renderMemberType(member)}\``,
      summaryCell(comment, index),
    ]);
  }
  for (const signature of child.indexSignatures ?? []) {
    rows.push([
      `\`[${renderParameters(signature.parameters)}]\``,
      `\`${renderType(signature.type)}\``,
      summaryCell(signature.comment, index),
    ]);
  }
  return rows;
}

function renderMemberDetail(child, member, index, anchor) {
  const heading = `${child.name}.${member.name}`;
  // h4, not h5: the site only gives h2 to h4 an id (see ANCHORED_LEVELS).
  const blocks = [anchorHeading(4, heading, anchor)];
  if (member.signatures?.length) {
    for (const signature of member.signatures) {
      blocks.push(fence(signatureLine('', member.name, signature)));
      blocks.push(...renderComment(signature.comment, index));
      const parameterRows = (signature.parameters ?? []).map((parameter) => [
        `\`${parameterName(parameter)}${parameter.flags?.isOptional ? '?' : ''}\``,
        `\`${renderType(parameter.type)}\``,
        summaryCell(parameter.comment, index),
      ]);
      if (parameterRows.length) {
        blocks.push('**Parameters**');
        blocks.push(table(['Name', 'Type', 'Description'], parameterRows));
      }
    }
    return blocks;
  }
  const optional = member.flags?.isOptional ? '?' : '';
  blocks.push(
    fence(`${readonlyPrefix(member)}${member.name}${optional}: ${renderMemberType(member)}`)
  );
  blocks.push(...renderComment(member.comment, index));
  return blocks;
}

function renderDeclaration(child, index, anchor, allocate) {
  const blocks = [anchorHeading(3, child.name, anchor)];

  if (child.kind === KIND_REFERENCE) {
    const target = index.get(child.target);
    if (!target) {
      throw new Error(`Re-export ${child.name} points at an id the artifact does not carry.`);
    }
    blocks.push(`Re-exported from [${target.moduleName}](${symbolHref(target)}).`);
    return blocks;
  }

  if (child.signatures?.length) {
    // Every h4 on the partial is scoped to the symbol it sits under, because the
    // site's fallback slugger does not dedupe: a partial carries one `#### Members`
    // heading per interface, and unscoped they would all answer to #members and
    // all jump to the first one.
    const overloaded = child.signatures.length > 1;
    child.signatures.forEach((signature, position) => {
      const scope = overloaded ? `${child.name} ${position + 1}` : child.name;
      blocks.push(fence(signatureLine('function ', child.name, signature)));
      blocks.push(...renderComment(signature.comment, index));
      const typeParameterRows = (signature.typeParameters ?? []).map((parameter) => [
        `\`${parameter.name}\``,
        parameter.default ? `\`${renderType(parameter.default)}\`` : '',
        summaryCell(parameter.comment, index),
      ]);
      if (typeParameterRows.length) {
        blocks.push(anchorHeading(4, 'Type parameters', allocate(`${scope} type parameters`)));
        blocks.push(table(['Name', 'Default', 'Description'], typeParameterRows));
      }
      const parameterRows = (signature.parameters ?? []).map((parameter) => [
        `\`${parameterName(parameter)}${parameter.flags?.isOptional ? '?' : ''}\``,
        `\`${renderType(parameter.type)}\``,
        summaryCell(parameter.comment, index),
      ]);
      if (parameterRows.length) {
        blocks.push(anchorHeading(4, 'Parameters', allocate(`${scope} parameters`)));
        blocks.push(table(['Name', 'Type', 'Description'], parameterRows));
      }
      blocks.push(anchorHeading(4, 'Returns', allocate(`${scope} returns`)));
      blocks.push(`\`${renderType(signature.type)}\``);
    });
    return blocks;
  }

  blocks.push(fence(declarationSignature(child)));
  blocks.push(...renderComment(child.comment, index));

  const detailMembers = (child.children ?? []).filter((member) =>
    memberDetailNeeded(member, index)
  );
  const detailAnchors = new Map(
    detailMembers.map((member) => [member.id, allocate(`${child.name}.${member.name}`)])
  );
  const rows = memberRows(child, index, detailAnchors);
  if (rows.length) {
    blocks.push(anchorHeading(4, 'Members', allocate(`${child.name} members`)));
    blocks.push(table(['Name', 'Type', 'Description'], rows));
  }
  for (const member of detailMembers) {
    blocks.push(...renderMemberDetail(child, member, index, detailAnchors.get(member.id)));
  }
  return blocks;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

function orderedExports(moduleEntry) {
  const byId = new Map((moduleEntry.children ?? []).map((child) => [child.id, child]));
  const functions = [];
  const types = [];
  for (const group of moduleEntry.groups ?? []) {
    for (const id of group.children ?? []) {
      const child = byId.get(id);
      if (!child) continue;
      const entry = { child, group: group.title };
      if (child.kind === KIND_FUNCTION) {
        functions.push(entry);
      } else {
        types.push(entry);
      }
    }
  }
  return [...functions, ...types];
}

export function renderModulePartial(moduleEntry, importSpecifier, index) {
  const slug = moduleSlug(moduleEntry.name);
  const exports = orderedExports(moduleEntry);
  // One source of truth for this module's anchor ids: the Symbols table, the
  // headings it links to and any cross-module link into this module all read the same
  // allocation, so a link can never point at an id the partial does not declare.
  const { ids: exportAnchorIds, allocate } = assignExportAnchorIds(moduleEntry, slug);
  const symbolRows = exports.map(({ child }) => {
    const comment = child.comment ?? child.signatures?.[0]?.comment;
    const target = child.kind === KIND_REFERENCE ? index.get(child.target) : null;
    return [
      `[\`${child.name}\`](#${exportAnchorIds.get(child.id)})`,
      kindLabel(child),
      summaryCell(comment ?? target?.comment, index),
    ];
  });

  const [symbolsId] = FIXED_ANCHOR_IDS;
  const prefixedSymbolsId = `${slug}-${symbolsId}`;
  const blocks = [
    `**Import specifier** \`${importSpecifier}\``,
    anchorHeading(3, 'Symbols', prefixedSymbolsId),
    table(['Symbol', 'Kind', 'Summary'], symbolRows),
  ];

  for (const { child } of exports) {
    blocks.push(...renderDeclaration(child, index, exportAnchorIds.get(child.id), allocate));
  }

  return `${blocks.join('\n\n')}\n`;
}

/**
 * One partial per module in the artifact, in explicit module order.
 */
export async function generatePages({ artifact, manifest, root = REPO_ROOT } = {}) {
  const resolvedManifest = manifest ?? readManifest(root);
  const resolvedArtifact = artifact ?? readArtifact(root);
  assertVersions(resolvedArtifact);

  // Enforce module order: every module in the artifact must be in modules,
  // and in that order.
  const declaredModules = (resolvedArtifact.children ?? []).map((entry) => entry.name);
  const { modules } = resolvedManifest;
  if (!modules || !Array.isArray(modules)) {
    throw new Error(`${MANIFEST_PATH} must declare modules as an array.`);
  }
  const moduleNames = modules.map((m) => m.name);
  const moduleSet = new Set(declaredModules);
  for (const name of moduleNames) {
    if (!moduleSet.has(name)) {
      throw new Error(
        `${MANIFEST_PATH} declares module "${name}" in modules, but the artifact has no such module.`
      );
    }
  }
  for (const name of declaredModules) {
    if (!moduleNames.includes(name)) {
      throw new Error(`${MANIFEST_PATH} module "${name}" is in the artifact but not in modules.`);
    }
  }

  const index = buildSymbolIndex(resolvedArtifact);
  const prettierConfig = await resolveConfig(
    resolve(root, PARTIAL_DIR, `${PARTIAL_PREFIX}backend.md`)
  );
  // The tailwind plugin has nothing to do in markdown, and dropping it keeps
  // plugin resolution out of the generator's working directory.
  delete prettierConfig?.plugins;

  const byName = new Map((resolvedArtifact.children ?? []).map((entry) => [entry.name, entry]));
  const pages = [];
  for (const { name, importSpecifier } of modules) {
    const moduleEntry = byName.get(name);
    const slug = moduleSlug(name);
    const partialPath = `${PARTIAL_DIR}/${PARTIAL_PREFIX}${slug}.md`;
    const markdown = renderModulePartial(moduleEntry, importSpecifier, index);
    const contents = await formatWithPrettier(markdown, {
      ...prettierConfig,
      parser: 'markdown',
    });
    pages.push({ path: partialPath, contents });
  }
  return pages;
}

export async function main({ root = REPO_ROOT, outputRoot } = {}) {
  const pages = await generatePages({ root });
  const target = outputRoot ? resolve(outputRoot) : root;
  for (const page of pages) {
    const absolute = join(target, page.path);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, page.contents);
  }
  process.stderr.write(
    `[realtime-sdk] generated ${pages.length} reference partials under ${target}\n`
  );
  return pages;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main({ outputRoot: process.argv[2] }).catch((error) => {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exit(1);
  });
}
