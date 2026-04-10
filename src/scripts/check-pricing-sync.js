#!/usr/bin/env node
/**
 * Pricing Data Sync Check & Generator
 *
 * Compares pricing data between two sources within neon-website:
 *   1. Pricing page components (JS data files rendered on neon.com/pricing)
 *   2. Docs plans page (content/docs/introduction/plans.md)
 *
 * Flags mismatches so pricing stays consistent across the site.
 * Can also generate a streamlined agent-friendly pricing markdown file.
 *
 * Usage:
 *   node src/scripts/check-pricing-sync.js              # Print report
 *   node src/scripts/check-pricing-sync.js --json        # Machine-readable output
 *   node src/scripts/check-pricing-sync.js --generate    # Generate public/pricing.md
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

// const boolNorm = (v) =>
//   v && v !== '--'
//     ? String(v).toLowerCase().includes('yes') ||
//       String(v).toLowerCase().includes('included') ||
//       String(v).toLowerCase().includes('available') ||
//       v === 'Yes'
//       ? 'yes'
//       : 'no'
//     : 'no';

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

function loadDocsTable() {
  const content = fs.readFileSync(
    path.join(PROJECT_ROOT, 'content/docs/introduction/plans.md'),
    'utf-8'
  );

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
// Each entry is an object:
//   id         – unique check identifier
//   label      – display name in sync report
//   comp       – component table row key (null = docs-only, skip sync check)
//   docs       – docs table row key
//   plan       – 'free' | 'launch' | 'scale'
//   norm       – normalization function for comparison (optional for docs-only)
//   agentLabel – feature name for generated agent table (omit to exclude from generation)
//   prefer     – 'docs' | 'component'; which raw value to use in generation (default: 'docs')
//
// Order determines both sync report order and generated table row order
// (first occurrence of each agentLabel).

const CROSS_SOURCE_CHECKS = [
  // --- Plan info (docs-only, no sync check) ---
  { id: 'price-free', comp: null, docs: 'Price', plan: 'free', agentLabel: 'Price' },
  { id: 'price-launch', comp: null, docs: 'Price', plan: 'launch', agentLabel: 'Price' },
  { id: 'price-scale', comp: null, docs: 'Price', plan: 'scale', agentLabel: 'Price' },
  { id: 'who-free', comp: null, docs: "Who it's for", plan: 'free', agentLabel: "Who it's for" },
  {
    id: 'who-launch',
    comp: null,
    docs: "Who it's for",
    plan: 'launch',
    agentLabel: "Who it's for",
  },
  { id: 'who-scale', comp: null, docs: "Who it's for", plan: 'scale', agentLabel: "Who it's for" },

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
  {
    id: 'autoscaling-scale',
    label: 'Autoscaling / Sizes (Scale)',
    comp: 'Sizes',
    docs: 'Autoscaling',
    plan: 'scale',
    norm: extractCore(/up to (\d+)\s*CU/i, 'Up to $1 CU'),
    agentLabel: 'Autoscaling',
    agentValue: () => 'Autoscaling up to 16 CU; fixed up to 56 CU (224 GB RAM)',
  },
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
  { id: 'snapshots-free', comp: null, docs: 'Snapshots', plan: 'free', agentLabel: 'Snapshots' },
  {
    id: 'snapshots-launch',
    comp: null,
    docs: 'Snapshots',
    plan: 'launch',
    agentLabel: 'Snapshots',
  },
  { id: 'snapshots-scale', comp: null, docs: 'Snapshots', plan: 'scale', agentLabel: 'Snapshots' },

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
    id: 'protected-branches-free',
    comp: null,
    docs: 'Compliance and security',
    plan: 'free',
    agentLabel: 'Protected branches',
    agentValue: (v) => (v && String(v).toLowerCase().includes('protected') ? 'Yes' : '--'),
  },
  {
    id: 'protected-branches-launch',
    comp: null,
    docs: 'Compliance and security',
    plan: 'launch',
    agentLabel: 'Protected branches',
    agentValue: (v) => (v && String(v).toLowerCase().includes('protected') ? 'Yes' : '--'),
  },
  {
    id: 'protected-branches-scale',
    comp: null,
    docs: 'Compliance and security',
    plan: 'scale',
    agentLabel: 'Protected branches',
    agentValue: (v) => (v && String(v).toLowerCase().includes('protected') ? 'Yes' : '--'),
  },
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
  {
    id: 'support-scale',
    label: 'Support (Scale)',
    comp: 'Support Plans',
    docs: 'Support',
    plan: 'scale',
    norm: (v) => normalizeValue(v)?.toLowerCase(),
    agentLabel: 'Support',
  },
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
  const uncoveredDocs = Object.keys(docsTable).filter((k) => !coveredDocsKeys.has(k));

  return { results, uncoveredComponent, uncoveredDocs };
}

// ---------------------------------------------------------------------------
// Generate agent-friendly pricing markdown
// ---------------------------------------------------------------------------

function generatePricingMarkdown(componentData, docsTable) {
  const rows = new Map();

  for (const check of CROSS_SOURCE_CHECKS) {
    if (!check.agentLabel) continue;
    if (!rows.has(check.agentLabel)) {
      rows.set(check.agentLabel, { free: '-', launch: '-', scale: '-' });
    }

    const prefer = check.prefer || 'docs';
    let value;
    if (prefer === 'component' && check.comp) {
      if (check.comp.startsWith('__hero:')) {
        const keyword = check.comp.replace('__hero:', '');
        const hasIt = componentData.heroPlans[check.plan]?.featureTitles?.some((t) =>
          t.toLowerCase().includes(keyword)
        );
        value = hasIt ? 'Yes' : '--';
      } else {
        value = componentData.tableRows[check.comp]?.[check.plan];
      }
    } else {
      value = docsTable[check.docs]?.[check.plan];
    }

    if (check.agentValue) value = check.agentValue(value);
    const clean = value && value !== '--' ? String(value).replace(/\s+/g, ' ').trim() : '-';
    rows.get(check.agentLabel)[check.plan] = clean;
  }

  const lines = [
    '# Neon Pricing Plans',
    '',
    'Neon is a serverless Postgres platform with three plans: Free, Launch, and Scale.',
    'Launch and Scale are usage-based: you pay only for what you use, with no monthly minimum.',
    'A CU (Compute Unit) represents compute size: 1 CU ≈ 1 CPU and 4 GB RAM.',
    '',
    '| Feature | Free | Launch | Scale |',
    '| --- | --- | --- | --- |',
  ];

  for (const [feature, plans] of rows) {
    lines.push(`| ${feature} | ${plans.free} | ${plans.launch} | ${plans.scale} |`);
  }

  lines.push('');
  lines.push(
    'All plans include: multi-AZ storage, autoscaling, database branching, read replicas, connection pooling via PgBouncer, Postgres extensions (pgvector, PostGIS, TimescaleDB, etc.), full management API and CLI, and a Data API for querying over HTTP.'
  );
  lines.push('');
  lines.push('Notes:');
  lines.push('- "-" means the feature is not available on that plan.');
  lines.push('- No monthly minimum on paid plans. Invoices under $0.50 are not collected.');
  lines.push(
    '- Free plan quotas (100 CU-hours, 0.5 GB) are per project; compute suspends when monthly limits are reached.'
  );
  lines.push('- Read replicas are separate computes and count toward CU-hours.');
  lines.push(
    '- To control costs, set autoscaling limits and keep scale-to-zero enabled. Suspended computes do not accrue CU-hours.'
  );
  lines.push(
    "- Scale's higher CU-hour rate covers its additional production features. No separate fees for features listed in the table."
  );
  lines.push(
    '- Child branch storage is billed on the minimum of accumulated changes or logical data size. Paid plans: up to 16 TB per branch.'
  );
  lines.push('- Instant restore storage is charged only on root branches, not child branches.');
  lines.push('- Snapshots are free during Beta; $0.09/GB-month starting May 1, 2026.');
  lines.push(
    '- Max branches per project is 5,000 on paid plans (10/25 included). Free is capped at 10.'
  );
  lines.push('- Public network transfer includes data sent via logical replication.');
  lines.push('- Early-stage startups can apply for credits: https://neon.com/startups');
  lines.push(
    '- Open source program: credits, referrals, and promotion for Postgres OSS projects: https://neon.com/programs/open-source.md'
  );
  lines.push(
    '- Agent Plan for AI agent platforms: https://neon.com/docs/introduction/agent-plan.md'
  );

  lines.push('');
  lines.push('Get started: https://neon.com/signup');
  lines.push('Full plan details: https://neon.com/docs/introduction/plans.md');
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function summarize(results) {
  const counts = { ok: 0, mismatch: 0, missing: 0, skip: 0 };
  for (const r of results) counts[r.status]++;
  return { ...counts, critical: counts.mismatch };
}

function printReport(results, uncoveredComponent, uncoveredDocs) {
  console.log(`
Pricing Data Sync Check
=======================

Source 1: Pricing page components
  - Hero plans: src/components/pages/pricing/hero/plans/data/plans.js
  - Comparison table: src/components/pages/pricing/plans/data/plans.js

Source 2: Docs plans page
  - content/docs/introduction/plans.md
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

  const { ok, mismatch, missing, skip } = summarize(results);
  console.log(`\nSummary: ${ok} match, ${mismatch} mismatch, ${missing} missing, ${skip} skipped`);
  if (mismatch > 0) console.log('\nResult: FAIL — mismatches detected\n');
  else if (missing > 0) console.log('\nResult: WARN — some data points could not be compared\n');
  else console.log('\nResult: PASS\n');
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
  const jsonMode = process.argv.includes('--json');
  const generateMode = process.argv.includes('--generate');

  let componentData, docsTable;
  try {
    componentData = loadComponentData();
  } catch (err) {
    console.error('Failed to load component data:', err.message);
    process.exit(2);
  }

  try {
    docsTable = loadDocsTable();
  } catch (err) {
    console.error('Failed to load docs table:', err.message);
    process.exit(2);
  }

  if (generateMode) {
    const markdown = generatePricingMarkdown(componentData, docsTable);
    const outPath = path.join(PROJECT_ROOT, 'public/pricing.md');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, markdown);
    console.log(`Generated ${path.relative(PROJECT_ROOT, outPath)}`);
    process.exit(0);
  }

  const { results, uncoveredComponent, uncoveredDocs } = runChecks(componentData, docsTable);

  if (jsonMode)
    console.log(
      JSON.stringify(
        { results, uncoveredComponent, uncoveredDocs, summary: summarize(results) },
        null,
        2
      )
    );
  else printReport(results, uncoveredComponent, uncoveredDocs);

  process.exit(summarize(results).critical > 0 ? 1 : 0);
}

main();
