#!/usr/bin/env node
/**
 * Pricing Data Sync Check
 *
 * Compares pricing facts across three sources within neon-website:
 *   1. Pricing page components — src/components/pages/pricing/{hero/plans,plans}/data/plans.js
 *      (rendered on neon.com/pricing)
 *   2. Docs plans page — content/docs/introduction/plans.md
 *   3. Hand-edited agent markdown — public/pricing.md
 *
 * Source 1 vs Source 2: cell-by-cell comparison driven by CROSS_SOURCE_CHECKS.
 * Source 3 vs Sources 1+2: rate sniff — every rate-shaped string in plans.md
 * (e.g. $0.35/GB-month) must also appear in pricing.md.
 *
 * Exits non-zero on any mismatch or pricing.md issue. Wired into prebuild and
 * predev so Vercel and local builds fail when sources drift.
 *
 * Usage:
 *   node src/scripts/check-pricing-sync.js              # Verbose locally, terse in CI
 *   node src/scripts/check-pricing-sync.js --verbose    # Force verbose
 *   node src/scripts/check-pricing-sync.js --ci         # Force terse
 *   node src/scripts/check-pricing-sync.js --json       # Machine-readable output
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PROJECT_ROOT = path.resolve(__dirname, '../..');

// ---------------------------------------------------------------------------
// HTML / Markdown stripping helpers
// ---------------------------------------------------------------------------

function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<a\s+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/gi, '$2')
    .replace(/<span[^>]*>/gi, ' ')
    .replace(/<\/span>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdown(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/✅/g, 'Yes')
    .replace(/—/g, '--')
    .trim();
}

function extractCellValue(cell) {
  if (cell === true) return 'Yes';
  if (cell === false) return '--';
  if (cell === undefined || cell === null) return undefined;
  if (typeof cell === 'object' && cell.title) return stripHtml(cell.title);
  if (typeof cell === 'string') return stripHtml(cell);
  return String(cell);
}

function normalizeValue(val) {
  if (val === undefined || val === null) return undefined;
  return String(val).trim().replace(/,/g, '').replace(/\s+/g, ' ');
}

// ---------------------------------------------------------------------------
// Normalization strategies
// ---------------------------------------------------------------------------

// Both sources express branch cost differently: $0.002/branch-hour vs $1.50/branch-month.
// Normalize to hourly rate for comparison.
const extractBranchRate = (val) => {
  if (!val || val === '--') return val;
  const s = String(val);
  const hourly = s.match(/\$([\d.]+)\s*(?:per\s+)?branch-hour/i);
  if (hourly) return `$${parseFloat(hourly[1])}/branch-hour`;
  const monthly = s.match(/\$([\d.]+)\s*\/?\s*branch-month/i);
  if (monthly)
    return `$${(parseFloat(monthly[1]) / 744).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}/branch-hour`;
  return normalizeValue(val);
};

const extractRate = (val) => {
  if (!val || val === '--') return val;
  const match = String(val).match(/\$([\d.]+)\s*\/?\s*(per\s+)?([\w-]+)/i);
  return match ? `$${match[1]}/${match[3]}` : normalizeValue(val);
};

const extractNumber = (val) => {
  if (!val || val === '--') return val;
  const match = String(val).replace(/,/g, '').match(/(\d+)/);
  return match ? match[1] : normalizeValue(val);
};

function extractCore(pattern, replacement) {
  return (val) => {
    if (!val || val === '--') return val;
    const match = String(val).match(pattern);
    if (match && replacement) {
      return replacement.replace(/\$(\d+)/g, (_, idx) => match[parseInt(idx)]);
    }
    return match ? match[1] : normalizeValue(val);
  };
}

// ---------------------------------------------------------------------------
// Source 1: Load pricing page component data
// ---------------------------------------------------------------------------

function loadEsmModule(filePath, globalStubs = {}) {
  let code = fs.readFileSync(filePath, 'utf-8');
  code = code.replace(/^import\s+.*;\s*$/gm, '');
  code = code.replace(/export\s+default\s+/, 'module.exports = ');
  const mod = { exports: {} };
  vm.runInNewContext(code, { module: mod, ...globalStubs }, { filename: filePath });
  return mod.exports;
}

function loadComponentData() {
  const heroPlans = loadEsmModule(
    path.join(PROJECT_ROOT, 'src/components/pages/pricing/hero/plans/data/plans.js'),
    { LINKS: {} }
  );
  const tableData = loadEsmModule(
    path.join(PROJECT_ROOT, 'src/components/pages/pricing/plans/data/plans.js')
  );

  const tableRows = {};
  for (const row of tableData.cols) {
    const name = typeof row.feature === 'string' ? row.feature : row.feature?.title;
    if (!name || (row.free === undefined && row.launch === undefined && row.scale === undefined))
      continue;
    tableRows[name] = {
      free: extractCellValue(row.free),
      launch: extractCellValue(row.launch),
      scale: extractCellValue(row.scale),
    };
  }

  const heroPlanMap = {};
  for (const p of heroPlans) {
    const allFeatures = [
      ...(p.features?.database?.features || []),
      ...(p.features?.other?.features || []),
    ].map((f) => f.title);
    heroPlanMap[p.planId] = {
      computeRate: p.computeRate,
      storageRate: p.storageRate,
      featureTitles: allFeatures,
    };
  }

  return { heroPlans: heroPlanMap, tableRows };
}

// ---------------------------------------------------------------------------
// Source 2: Load docs plans page markdown table
// ---------------------------------------------------------------------------

function loadDocsContent() {
  return fs.readFileSync(path.join(PROJECT_ROOT, 'content/docs/introduction/plans.md'), 'utf-8');
}

function loadDocsTable(content) {
  const lines = content.split('\n');
  const tableLines = [];
  let inTable = false;
  for (const line of lines) {
    if (line.trim().startsWith('| Plan feature')) inTable = true;
    if (inTable) {
      if (line.trim().startsWith('|')) tableLines.push(line);
      else break;
    }
  }
  if (tableLines.length < 3) throw new Error('Could not find plan overview table in docs');

  const headers = tableLines[0]
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean);
  const planColumns = headers.slice(1);

  const rows = {};
  for (let i = 2; i < tableLines.length; i++) {
    const cells = tableLines[i]
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length < 2) continue;
    const feature = stripMarkdown(cells[0]);
    const values = {};
    for (let j = 1; j < cells.length && j <= planColumns.length; j++) {
      values[stripMarkdown(planColumns[j - 1]).toLowerCase()] = stripMarkdown(cells[j]);
    }
    rows[feature] = values;
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Comparison definitions (data-driven)
// ---------------------------------------------------------------------------
//
// Active fields used by the cross-source sync check:
//   id         – unique check identifier
//   label      – display name in sync report
//   comp       – component table row key
//   docs       – docs table row key
//   plan       – 'free' | 'launch' | 'scale'
//   norm       – normalization function for comparison
//
// Rows that intentionally have no component-side comparison are not listed
// here at all; their docs row keys are tracked in INTENTIONALLY_DOCS_ONLY
// (defined near runChecks) so the coverage-gaps report stays clean.
//
// Reserved-but-currently-unused fields (kept as documentation for a possible
// PHASE2-Mid/Full future, where this config also drives a cell-by-cell check
// against the pricing.md table). Safe to ignore today; they have no effect.
//   agentLabel – feature name as it would appear in pricing.md
//   agentValue – function returning the canonical pricing.md cell value
//   prefer     – 'docs' | 'component', which raw value wins in generation

const CROSS_SOURCE_CHECKS = [
  // --- Organization & Projects ---
  {
    id: 'team-members-free',
    label: 'Team members (Free)',
    comp: 'Team members',
    docs: 'Organization members',
    plan: 'free',
    norm: (v) => normalizeValue(v)?.toLowerCase(),
    agentLabel: 'Organization members',
  },
  {
    id: 'team-members-launch',
    label: 'Team members (Launch)',
    comp: 'Team members',
    docs: 'Organization members',
    plan: 'launch',
    norm: (v) => normalizeValue(v)?.toLowerCase(),
    agentLabel: 'Organization members',
  },
  {
    id: 'team-members-scale',
    label: 'Team members (Scale)',
    comp: 'Team members',
    docs: 'Organization members',
    plan: 'scale',
    norm: (v) => normalizeValue(v)?.toLowerCase(),
    agentLabel: 'Organization members',
  },
  {
    id: 'projects-free',
    label: 'Projects (Free)',
    comp: 'Projects',
    docs: 'Projects',
    plan: 'free',
    norm: extractNumber,
    agentLabel: 'Projects',
  },
  {
    id: 'projects-launch',
    label: 'Projects (Launch)',
    comp: 'Projects',
    docs: 'Projects',
    plan: 'launch',
    norm: extractNumber,
    agentLabel: 'Projects',
  },
  {
    id: 'projects-scale',
    label: 'Projects (Scale)',
    comp: 'Projects',
    docs: 'Projects',
    plan: 'scale',
    norm: extractNumber,
    agentLabel: 'Projects',
  },
  {
    id: 'branches-free',
    label: 'Branches (Free)',
    comp: 'Branches per project',
    docs: 'Branches',
    plan: 'free',
    norm: extractNumber,
    agentLabel: 'Branches per project',
  },
  {
    id: 'branches-launch',
    label: 'Branches (Launch)',
    comp: 'Branches per project',
    docs: 'Branches',
    plan: 'launch',
    norm: extractNumber,
    agentLabel: 'Branches per project',
  },
  {
    id: 'branches-scale',
    label: 'Branches (Scale)',
    comp: 'Branches per project',
    docs: 'Branches',
    plan: 'scale',
    norm: extractNumber,
    agentLabel: 'Branches per project',
  },
  {
    id: 'extra-branches-launch',
    label: 'Extra branches (Launch)',
    comp: 'Additional branches',
    docs: 'Extra branches',
    plan: 'launch',
    norm: extractBranchRate,
    agentLabel: 'Extra branches',
  },
  {
    id: 'extra-branches-scale',
    label: 'Extra branches (Scale)',
    comp: 'Additional branches',
    docs: 'Extra branches',
    plan: 'scale',
    norm: extractBranchRate,
    agentLabel: 'Extra branches',
  },

  // --- Compute ---
  {
    id: 'compute-rate-free',
    label: 'Compute rate (Free)',
    comp: 'Rates',
    docs: 'Compute',
    plan: 'free',
    norm: extractCore(/(\d+)\s*CU/i, '$1 CU-hours'),
    agentLabel: 'Compute',
  },
  {
    id: 'compute-rate-launch',
    label: 'Compute rate (Launch)',
    comp: 'Rates',
    docs: 'Compute',
    plan: 'launch',
    norm: extractRate,
    agentLabel: 'Compute',
  },
  {
    id: 'compute-rate-scale',
    label: 'Compute rate (Scale)',
    comp: 'Rates',
    docs: 'Compute',
    plan: 'scale',
    norm: extractRate,
    agentLabel: 'Compute',
  },
  {
    id: 'autoscaling-free',
    label: 'Autoscaling / Sizes (Free)',
    comp: 'Sizes',
    docs: 'Autoscaling',
    plan: 'free',
    norm: extractCore(/up to (\d+)\s*CU/i, 'Up to $1 CU'),
    agentLabel: 'Autoscaling',
  },
  {
    id: 'autoscaling-launch',
    label: 'Autoscaling / Sizes (Launch)',
    comp: 'Sizes',
    docs: 'Autoscaling',
    plan: 'launch',
    norm: extractCore(/up to (\d+)\s*CU/i, 'Up to $1 CU'),
    agentLabel: 'Autoscaling',
  },
  // Autoscaling Scale-plan: intentionally no comp comparison; see
  // INTENTIONALLY_DOCS_ONLY for rationale.
  {
    id: 'scale-to-zero-free',
    label: 'Scale to zero (Free)',
    comp: 'Scale to zero',
    docs: 'Scale to zero',
    plan: 'free',
    norm: extractCore(/after (\d+)\s*min/i, 'After $1 min'),
    agentLabel: 'Scale to zero',
  },
  {
    id: 'scale-to-zero-launch',
    label: 'Scale to zero (Launch)',
    comp: 'Scale to zero',
    docs: 'Scale to zero',
    plan: 'launch',
    norm: extractCore(/after (\d+)\s*min/i, 'After $1 min'),
    agentLabel: 'Scale to zero',
  },
  {
    id: 'scale-to-zero-scale',
    label: 'Scale to zero (Scale)',
    comp: 'Scale to zero',
    docs: 'Scale to zero',
    plan: 'scale',
    norm: (v) =>
      normalizeValue(v)
        ?.toLowerCase()
        .replace(/\s*\([^)]*\)/, ''),
    agentLabel: 'Scale to zero',
  },

  // --- Storage ---
  {
    id: 'storage-free',
    label: 'Storage (Free)',
    comp: 'Database',
    docs: 'Storage',
    plan: 'free',
    norm: extractCore(/([\d.]+\s*GB)/i),
    agentLabel: 'Storage',
  },
  {
    id: 'storage-rate-launch',
    label: 'Storage rate (Launch)',
    comp: 'Database',
    docs: 'Storage',
    plan: 'launch',
    norm: extractRate,
    agentLabel: 'Storage',
  },
  {
    id: 'storage-rate-scale',
    label: 'Storage rate (Scale)',
    comp: 'Database',
    docs: 'Storage',
    plan: 'scale',
    norm: extractRate,
    agentLabel: 'Storage',
  },
  {
    id: 'instant-restore-launch',
    label: 'Instant restore (Launch)',
    comp: 'History',
    docs: 'Instant restore',
    plan: 'launch',
    norm: extractRate,
    agentLabel: 'Instant restore',
  },
  {
    id: 'instant-restore-scale',
    label: 'Instant restore (Scale)',
    comp: 'History',
    docs: 'Instant restore',
    plan: 'scale',
    norm: extractRate,
    agentLabel: 'Instant restore',
  },
  {
    id: 'restore-window-free',
    label: 'Restore window (Free)',
    comp: 'Restore window',
    docs: 'Restore window',
    plan: 'free',
    norm: extractCore(/(\d+)\s*hours?/i, '$1 hours'),
    agentLabel: 'Restore window',
    agentValue: () => '6 hours (1 GB limit)',
  },
  {
    id: 'restore-window-launch',
    label: 'Restore window (Launch)',
    comp: 'Restore window',
    docs: 'Restore window',
    plan: 'launch',
    norm: extractCore(/(\d+)\s*days?/i, '$1 days'),
    agentLabel: 'Restore window',
  },
  {
    id: 'restore-window-scale',
    label: 'Restore window (Scale)',
    comp: 'Restore window',
    docs: 'Restore window',
    plan: 'scale',
    norm: extractCore(/(\d+)\s*days?/i, '$1 days'),
    agentLabel: 'Restore window',
  },
  // --- Network ---
  {
    id: 'network-free',
    label: 'Public network transfer (Free)',
    comp: 'Public network transfer',
    docs: 'Public network transfer',
    plan: 'free',
    norm: extractCore(/(\d+)\s*GB/i, '$1 GB'),
    agentLabel: 'Public network transfer (egress)',
  },
  {
    id: 'network-launch',
    label: 'Public network transfer (Launch)',
    comp: 'Public network transfer',
    docs: 'Public network transfer',
    plan: 'launch',
    norm: extractCore(/(\d+)\s*GB\s*included/i, '$1 GB included'),
    agentLabel: 'Public network transfer (egress)',
  },
  {
    id: 'network-scale',
    label: 'Public network transfer (Scale)',
    comp: 'Public network transfer',
    docs: 'Public network transfer',
    plan: 'scale',
    norm: extractCore(/(\d+)\s*GB\s*included/i, '$1 GB included'),
    agentLabel: 'Public network transfer (egress)',
  },
  {
    id: 'private-network-scale',
    label: 'Private network transfer (Scale)',
    comp: 'Private network transfer',
    docs: 'Private network transfer',
    plan: 'scale',
    norm: extractRate,
    agentLabel: 'Private network transfer',
  },

  // --- Auth ---
  {
    id: 'auth-free',
    label: 'Auth MAU (Free)',
    comp: 'MAU',
    docs: 'Auth',
    plan: 'free',
    norm: extractCore(/(60k|60,?000)/i, '60k'),
    agentLabel: 'Auth (MAU)',
  },
  {
    id: 'auth-launch',
    label: 'Auth MAU (Launch)',
    comp: 'MAU',
    docs: 'Auth',
    plan: 'launch',
    norm: extractCore(/(1M|1,?000,?000)/i, '1M'),
    agentLabel: 'Auth (MAU)',
  },
  {
    id: 'auth-scale',
    label: 'Auth MAU (Scale)',
    comp: 'MAU',
    docs: 'Auth',
    plan: 'scale',
    norm: extractCore(/(1M|1,?000,?000)/i, '1M'),
    agentLabel: 'Auth (MAU)',
  },

  // --- Monitoring & Observability ---
  {
    id: 'monitoring-free',
    label: 'Monitoring (Free)',
    comp: 'Monitoring retention',
    docs: 'Monitoring',
    plan: 'free',
    norm: normalizeValue,
    agentLabel: 'Monitoring retention',
  },
  {
    id: 'monitoring-launch',
    label: 'Monitoring (Launch)',
    comp: 'Monitoring retention',
    docs: 'Monitoring',
    plan: 'launch',
    norm: normalizeValue,
    agentLabel: 'Monitoring retention',
  },
  {
    id: 'monitoring-scale',
    label: 'Monitoring (Scale)',
    comp: 'Monitoring retention',
    docs: 'Monitoring',
    plan: 'scale',
    norm: normalizeValue,
    agentLabel: 'Monitoring retention',
  },
  {
    id: 'metrics-export-scale',
    label: 'Metrics/logs export (Scale)',
    comp: 'Metrics and Logs export',
    docs: 'Metrics/logs export',
    plan: 'scale',
    norm: (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('included') || v === 'Yes'
          ? 'yes'
          : 'no'
        : 'no',
    agentLabel: 'Metrics/logs export',
  },

  // --- Compliance & Security (component preferred — separate rows beat combined cell) ---
  {
    id: 'ip-allow-scale',
    label: 'IP Allow (Scale)',
    comp: 'IP Allow Rules',
    docs: 'Compliance and security',
    plan: 'scale',
    norm: (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('ip allow') || v === 'Yes'
          ? 'yes'
          : 'no'
        : 'no',
    agentLabel: 'IP Allow',
    prefer: 'component',
  },
  {
    id: 'private-networking-scale',
    label: 'Private Networking (Scale)',
    comp: 'Private Networking',
    docs: 'Compliance and security',
    plan: 'scale',
    norm: (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('private networking') || v === 'Yes'
          ? 'yes'
          : 'no'
        : 'no',
    agentLabel: 'Private Networking',
    prefer: 'component',
  },
  {
    id: 'hipaa-scale',
    label: 'HIPAA (Scale)',
    comp: 'HIPAA Compliance',
    docs: 'Compliance and security',
    plan: 'scale',
    norm: (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('hipaa') || String(v).toLowerCase().includes('available')
          ? 'yes'
          : 'no'
        : 'no',
    agentLabel: 'HIPAA',
    prefer: 'component',
  },
  {
    id: 'soc2-scale',
    label: 'SOC 2 (Scale)',
    comp: 'SOC 2 Report Access',
    docs: 'Compliance and security',
    plan: 'scale',
    norm: (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('soc') || String(v).toLowerCase().includes('available')
          ? 'yes'
          : 'no'
        : 'no',
    agentLabel: 'SOC 2',
    prefer: 'component',
  },
  {
    id: 'uptime-sla-scale',
    label: 'Uptime SLA (Scale)',
    comp: '__hero:sla',
    docs: 'Uptime SLA',
    plan: 'scale',
    norm: (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('sla') || v === 'Yes'
          ? 'yes'
          : 'no'
        : 'no',
    agentLabel: 'Uptime SLA',
  },

  // --- Support ---
  {
    id: 'support-free',
    label: 'Support (Free)',
    comp: 'Support Plans',
    docs: 'Support',
    plan: 'free',
    norm: (v) =>
      normalizeValue(v)
        ?.toLowerCase()
        .replace(/\s*\(discord\)/, ''),
    agentLabel: 'Support',
  },
  {
    id: 'support-launch',
    label: 'Support (Launch)',
    comp: 'Support Plans',
    docs: 'Support',
    plan: 'launch',
    norm: (v) =>
      normalizeValue(v)
        ?.toLowerCase()
        .replace(/\s*support/, '')
        .replace(/\s*only/, ''),
    agentLabel: 'Support',
  },
  // Support Scale-plan: intentionally no comp comparison; see
  // INTENTIONALLY_DOCS_ONLY for rationale.
];

// Hero numeric rates vs component table string rates
const HERO_RATE_CHECKS = [
  ['hero-compute-launch', 'Hero vs Table: Compute rate (Launch)', 'launch', 'computeRate', 'Rates'],
  ['hero-compute-scale', 'Hero vs Table: Compute rate (Scale)', 'scale', 'computeRate', 'Rates'],
  [
    'hero-storage-launch',
    'Hero vs Table: Storage rate (Launch)',
    'launch',
    'storageRate',
    'Database',
  ],
  ['hero-storage-scale', 'Hero vs Table: Storage rate (Scale)', 'scale', 'storageRate', 'Database'],
];

// ---------------------------------------------------------------------------
// Run comparisons
// ---------------------------------------------------------------------------

// Category-only rows in the component table (no plan data, just section headers)
const COMPONENT_CATEGORY_ROWS = new Set([
  'Projects and Branches',
  'Compute',
  'Storage',
  'Auth',
  'Network',
  'Account & Management',
]);

// Docs table rows that intentionally don't have a component-side comparison.
// Listed here (instead of as comp:null rows in CROSS_SOURCE_CHECKS) so the
// coverage-gaps report doesn't flag them. Two reasons a row can land here:
//   1. The docs row is plan info (Price, Who it's for) with no operational value.
//   2. Some plan cells diverge from component by deliberate UX choice — see
//      Autoscaling/Sizes Scale and Support Scale, where docs enumerates
//      details that the live pricing page intentionally flattens.
const INTENTIONALLY_DOCS_ONLY = new Set([
  'Price',
  "Who it's for",
  'Autoscaling',
  'Snapshots',
  'Compliance and security',
  'Support',
]);

function runChecks(componentData, docsTable) {
  const results = [];
  const coveredComponentKeys = new Set();
  const coveredDocsKeys = new Set();

  for (const check of CROSS_SOURCE_CHECKS) {
    if (check.comp) coveredComponentKeys.add(check.comp);
    if (check.docs) coveredDocsKeys.add(check.docs);
    if (!check.comp) continue;

    const { id, label, comp, docs: docsKey, plan, norm } = check;

    let rawComp;
    if (comp.startsWith('__hero:')) {
      const keyword = comp.replace('__hero:', '');
      const hasIt = componentData.heroPlans[plan]?.featureTitles?.some((t) =>
        t.toLowerCase().includes(keyword)
      );
      rawComp = hasIt ? 'Yes' : '--';
    } else {
      rawComp = componentData.tableRows[comp]?.[plan];
    }
    const rawDocs = docsTable[docsKey]?.[plan];
    const normComp = norm(rawComp);
    const normDocs = norm(rawDocs);

    let status;
    if (normComp === undefined && normDocs === undefined) status = 'skip';
    else if (normComp === undefined || normDocs === undefined) status = 'missing';
    else if (normComp === normDocs) status = 'ok';
    else status = 'mismatch';

    results.push({
      id,
      label,
      status,
      component: { raw: rawComp, normalized: normComp },
      docs: { raw: rawDocs, normalized: normDocs },
    });
  }

  for (const [id, label, plan, field, tableKey] of HERO_RATE_CHECKS) {
    const heroVal = componentData.heroPlans[plan]?.[field];
    const tableStr = componentData.tableRows[tableKey]?.[plan];
    const tableVal = parseFloat(tableStr?.match(/\$([\d.]+)/)?.[1]);
    const match = heroVal !== undefined && heroVal === tableVal;

    results.push({
      id,
      label,
      status: match ? 'ok' : 'mismatch',
      isInternal: true,
      component: { raw: `$${heroVal}`, normalized: `$${heroVal}` },
      docs: { raw: tableStr, normalized: tableStr },
    });
  }

  // Coverage: find rows in each source not covered by any comparison
  const uncoveredComponent = Object.keys(componentData.tableRows).filter(
    (k) => !coveredComponentKeys.has(k) && !COMPONENT_CATEGORY_ROWS.has(k)
  );
  const uncoveredDocs = Object.keys(docsTable).filter(
    (k) => !coveredDocsKeys.has(k) && !INTENTIONALLY_DOCS_ONLY.has(k)
  );

  return { results, uncoveredComponent, uncoveredDocs };
}

// ---------------------------------------------------------------------------
// pricing.md checks (rate sniff)
// ---------------------------------------------------------------------------

const PRICING_MD_PATH = path.join(PROJECT_ROOT, 'public/pricing.md');

// Escape hatch for rates that pricing.md should mention but don't appear
// anywhere in plans.md (table or prose). Empty today; add an entry only when
// you've verified the rate is genuinely absent from plans.md.
const EXTRA_RATES = [];

const RATE_PATTERN = /\$\d+(?:\.\d+)?\/[A-Za-z][A-Za-z]*(?:-[A-Za-z]+)?/g;

// Scan the full plans.md content (table + prose) for every rate-shaped
// string, e.g. $0.35/GB-month, $0.10/GB, $1.50/branch-month. We use the
// docs side (not component) because docs uses canonical monthly forms that
// match what pricing.md should contain (e.g. $1.50/branch-month, not the
// equivalent $0.002/branch-hour in component data).
//
// Filters out $0/... values (free-plan price lines like `$0/month`); those
// aren't real rates and don't need to be cross-checked.
function buildKnownRates(docsContent) {
  const rates = new Set(EXTRA_RATES);
  const matches = docsContent.match(RATE_PATTERN);
  if (matches) {
    for (const r of matches) {
      if (/^\$0\//.test(r)) continue;
      rates.add(r);
    }
  }
  return [...rates].sort();
}

function checkRates(content, knownRates) {
  return knownRates.filter((rate) => !content.includes(rate));
}

function runPricingMdChecks(docsContent) {
  let content;
  try {
    content = fs.readFileSync(PRICING_MD_PATH, 'utf-8');
  } catch (err) {
    return {
      readError: `Failed to read ${path.relative(PROJECT_ROOT, PRICING_MD_PATH)}: ${err.message}`,
      missingRates: [],
      knownRates: [],
    };
  }

  const knownRates = buildKnownRates(docsContent);
  const missingRates = checkRates(content, knownRates);

  return { missingRates, knownRates };
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function summarize(results, pricingMd) {
  const counts = { ok: 0, mismatch: 0, missing: 0, skip: 0 };
  for (const r of results) counts[r.status]++;
  const pricingIssues = pricingMd
    ? (pricingMd.readError ? 1 : 0) + pricingMd.missingRates.length
    : 0;
  return { ...counts, pricingIssues, critical: counts.mismatch + pricingIssues };
}

function printVerboseReport(results, uncoveredComponent, uncoveredDocs, pricingMd) {
  console.log(`
Pricing Data Sync Check
=======================

Source 1: Pricing page components
  - Hero plans: src/components/pages/pricing/hero/plans/data/plans.js
  - Comparison table: src/components/pages/pricing/plans/data/plans.js

Source 2: Docs plans page
  - content/docs/introduction/plans.md

Source 3: Hand-edited agent markdown
  - public/pricing.md
`);

  const cross = results.filter((r) => !r.isInternal);
  const internal = results.filter((r) => r.isInternal);

  console.log(`Comparing ${cross.length} data points (component table vs docs)...\n`);
  cross.forEach(printResult);

  if (internal.length) {
    console.log(`\nInternal consistency (${internal.length} checks: hero vs table)...\n`);
    internal.forEach(printResult);
  }

  if (uncoveredComponent.length || uncoveredDocs.length) {
    console.log('\nCoverage gaps (rows not covered by any comparison):\n');
    if (uncoveredComponent.length) {
      console.log(`  Component table rows without a docs mapping:`);
      uncoveredComponent.forEach((r) => console.log(`    - ${r}`));
    }
    if (uncoveredDocs.length) {
      console.log(`  Docs table rows without a component mapping:`);
      uncoveredDocs.forEach((r) => console.log(`    - ${r}`));
    }
  }

  if (pricingMd) {
    console.log('\npricing.md checks\n');
    if (pricingMd.readError) {
      console.log(`  ERROR  ${pricingMd.readError}`);
    } else {
      console.log(
        `  OK    ${pricingMd.knownRates.length - pricingMd.missingRates.length}/${pricingMd.knownRates.length} canonical rates present`
      );
      if (pricingMd.missingRates.length) {
        console.log(`  Missing rates (${pricingMd.missingRates.length}):`);
        pricingMd.missingRates.forEach((r) => console.log(`    - ${r}`));
      }
    }
  }

  const { ok, mismatch, missing, skip, pricingIssues } = summarize(results, pricingMd);
  console.log(
    `\nSummary: ${ok} match, ${mismatch} mismatch, ${missing} missing, ${skip} skipped, ${pricingIssues} pricing.md issue(s)`
  );
  if (mismatch > 0 || pricingIssues > 0) {
    console.log('\nResult: FAIL — drift detected\n');
  } else if (missing > 0) {
    console.log('\nResult: WARN — some data points could not be compared\n');
  } else {
    console.log('\nResult: PASS\n');
  }
}

// Terse output for CI logs: one-line PASS, or summary + only the offending
// items on FAIL. Coverage gaps are suppressed (informational, not failures).
function printTerseReport(results, pricingMd) {
  const { ok, mismatch, missing, pricingIssues } = summarize(results, pricingMd);
  const totalRates = pricingMd?.knownRates.length ?? 0;
  const okRates = totalRates - (pricingMd?.missingRates.length ?? 0);

  if (mismatch === 0 && pricingIssues === 0) {
    console.log(`[OK] Pricing sync: PASS - ${ok} match, ${okRates}/${totalRates} rates`);
    return;
  }

  console.log('[FAIL] Pricing sync: drift detected\n');

  const mismatches = results.filter((r) => r.status === 'mismatch');
  if (mismatches.length) {
    console.log(`Component vs Docs (${mismatches.length} mismatch):`);
    mismatches.forEach(printResult);
    console.log('');
  }

  if (pricingMd?.readError) {
    console.log(`pricing.md: ${pricingMd.readError}\n`);
  } else if (pricingIssues > 0) {
    console.log(`pricing.md (${pricingIssues} issue${pricingIssues === 1 ? '' : 's'}):`);
    if (pricingMd.missingRates.length) {
      console.log(`  Missing rates: ${pricingMd.missingRates.join(', ')}`);
    }
    console.log('');
  }

  console.log(
    `Summary: ${ok} match, ${mismatch} mismatch, ${missing} missing, ${pricingIssues} pricing.md issue(s).`
  );
  console.log('Run with --verbose to see all checks.');
}

function printResult(r) {
  const icons = { ok: '  OK ', mismatch: ' DIFF', missing: ' MISS', skip: ' SKIP' };
  console.log(
    `${icons[r.status]}  ${r.label}${r.status === 'ok' ? `: ${r.component.normalized}` : ''}`
  );

  if (r.status === 'mismatch') {
    console.log(`        ${r.isInternal ? 'Hero' : 'Component'}: ${r.component.raw}`);
    console.log(`        ${r.isInternal ? 'Table' : 'Docs'}: ${r.docs.raw}`);
    if (r.component.normalized !== r.component.raw || r.docs.normalized !== r.docs.raw) {
      console.log(`        Normalized: "${r.component.normalized}" vs "${r.docs.normalized}"`);
    }
  }
  if (r.status === 'missing') {
    console.log(`        Missing from: ${r.component.raw === undefined ? 'Component' : 'Docs'}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');
  // Default: terse in CI (Vercel sets CI=1 automatically), verbose locally.
  // Explicit flags always win.
  const verbose = args.includes('--verbose')
    ? true
    : args.includes('--ci')
      ? false
      : !process.env.CI;

  let componentData, docsContent, docsTable;
  try {
    componentData = loadComponentData();
  } catch (err) {
    console.error('Failed to load component data:', err.message);
    process.exit(2);
  }

  try {
    docsContent = loadDocsContent();
    docsTable = loadDocsTable(docsContent);
  } catch (err) {
    console.error('Failed to load docs table:', err.message);
    process.exit(2);
  }

  const { results, uncoveredComponent, uncoveredDocs } = runChecks(componentData, docsTable);
  const pricingMd = runPricingMdChecks(docsContent);

  if (jsonMode) {
    console.log(
      JSON.stringify(
        {
          results,
          uncoveredComponent,
          uncoveredDocs,
          pricingMd,
          summary: summarize(results, pricingMd),
        },
        null,
        2
      )
    );
  } else if (verbose) {
    printVerboseReport(results, uncoveredComponent, uncoveredDocs, pricingMd);
  } else {
    printTerseReport(results, pricingMd);
  }

  process.exit(summarize(results, pricingMd).critical > 0 ? 1 : 0);
}

main();
