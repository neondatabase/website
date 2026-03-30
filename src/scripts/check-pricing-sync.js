#!/usr/bin/env node
/**
 * Pricing Data Sync Check
 *
 * Compares pricing data between two sources within neon-website:
 *   1. Pricing page components (JS data files rendered on neon.com/pricing)
 *   2. Docs plans page (content/docs/introduction/plans.md)
 *
 * Flags mismatches so pricing stays consistent across the site.
 *
 * Usage:
 *   node src/scripts/check-pricing-sync.js            # Print report
 *   node src/scripts/check-pricing-sync.js --json      # Machine-readable output
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

// Each entry: [id, label, componentKey, docsKey, plan, normalizeFn]
const CROSS_SOURCE_CHECKS = [
  [
    'compute-rate-free',
    'Compute rate (Free)',
    'Rates',
    'Compute',
    'free',
    extractCore(/(\d+)\s*CU/i, '$1 CU-hours'),
  ],
  ['compute-rate-launch', 'Compute rate (Launch)', 'Rates', 'Compute', 'launch', extractRate],
  ['compute-rate-scale', 'Compute rate (Scale)', 'Rates', 'Compute', 'scale', extractRate],
  ['storage-rate-launch', 'Storage rate (Launch)', 'Database', 'Storage', 'launch', extractRate],
  ['storage-rate-scale', 'Storage rate (Scale)', 'Database', 'Storage', 'scale', extractRate],
  ['storage-free', 'Storage (Free)', 'Database', 'Storage', 'free', extractCore(/([\d.]+\s*GB)/i)],
  ['projects-free', 'Projects (Free)', 'Projects', 'Projects', 'free', extractNumber],
  ['projects-launch', 'Projects (Launch)', 'Projects', 'Projects', 'launch', extractNumber],
  ['projects-scale', 'Projects (Scale)', 'Projects', 'Projects', 'scale', extractNumber],
  ['branches-free', 'Branches (Free)', 'Branches per project', 'Branches', 'free', extractNumber],
  [
    'branches-launch',
    'Branches (Launch)',
    'Branches per project',
    'Branches',
    'launch',
    extractNumber,
  ],
  [
    'branches-scale',
    'Branches (Scale)',
    'Branches per project',
    'Branches',
    'scale',
    extractNumber,
  ],
  [
    'autoscaling-free',
    'Autoscaling / Sizes (Free)',
    'Sizes',
    'Autoscaling',
    'free',
    extractCore(/up to (\d+)\s*CU/i, 'Up to $1 CU'),
  ],
  [
    'autoscaling-launch',
    'Autoscaling / Sizes (Launch)',
    'Sizes',
    'Autoscaling',
    'launch',
    extractCore(/up to (\d+)\s*CU/i, 'Up to $1 CU'),
  ],
  [
    'autoscaling-scale',
    'Autoscaling / Sizes (Scale)',
    'Sizes',
    'Autoscaling',
    'scale',
    extractCore(/up to (\d+)\s*CU/i, 'Up to $1 CU'),
  ],
  [
    'monitoring-free',
    'Monitoring (Free)',
    'Monitoring retention',
    'Monitoring',
    'free',
    normalizeValue,
  ],
  [
    'monitoring-launch',
    'Monitoring (Launch)',
    'Monitoring retention',
    'Monitoring',
    'launch',
    normalizeValue,
  ],
  [
    'monitoring-scale',
    'Monitoring (Scale)',
    'Monitoring retention',
    'Monitoring',
    'scale',
    normalizeValue,
  ],
  [
    'restore-window-free',
    'Restore window (Free)',
    'Restore window',
    'Restore window',
    'free',
    extractCore(/(\d+)\s*hours?/i, '$1 hours'),
  ],
  [
    'restore-window-launch',
    'Restore window (Launch)',
    'Restore window',
    'Restore window',
    'launch',
    extractCore(/(\d+)\s*days?/i, '$1 days'),
  ],
  [
    'restore-window-scale',
    'Restore window (Scale)',
    'Restore window',
    'Restore window',
    'scale',
    extractCore(/(\d+)\s*days?/i, '$1 days'),
  ],
  ['auth-free', 'Auth MAU (Free)', 'MAU', 'Auth', 'free', extractCore(/(60k|60,?000)/i, '60k')],
  [
    'auth-launch',
    'Auth MAU (Launch)',
    'MAU',
    'Auth',
    'launch',
    extractCore(/(1M|1,?000,?000)/i, '1M'),
  ],
  [
    'auth-scale',
    'Auth MAU (Scale)',
    'MAU',
    'Auth',
    'scale',
    extractCore(/(1M|1,?000,?000)/i, '1M'),
  ],
  [
    'network-free',
    'Public network transfer (Free)',
    'Public network transfer',
    'Public network transfer',
    'free',
    extractCore(/(\d+)\s*GB/i, '$1 GB'),
  ],
  [
    'network-launch',
    'Public network transfer (Launch)',
    'Public network transfer',
    'Public network transfer',
    'launch',
    extractCore(/(\d+)\s*GB\s*included/i, '$1 GB included'),
  ],
  [
    'network-scale',
    'Public network transfer (Scale)',
    'Public network transfer',
    'Public network transfer',
    'scale',
    extractCore(/(\d+)\s*GB\s*included/i, '$1 GB included'),
  ],
  [
    'instant-restore-launch',
    'Instant restore (Launch)',
    'History',
    'Instant restore',
    'launch',
    extractRate,
  ],
  [
    'instant-restore-scale',
    'Instant restore (Scale)',
    'History',
    'Instant restore',
    'scale',
    extractRate,
  ],
  [
    'private-network-scale',
    'Private network transfer (Scale)',
    'Private network transfer',
    'Private network transfer',
    'scale',
    extractRate,
  ],
  [
    'support-free',
    'Support (Free)',
    'Support Plans',
    'Support',
    'free',
    (v) =>
      normalizeValue(v)
        ?.toLowerCase()
        .replace(/\s*\(discord\)/, ''),
  ],
  [
    'support-launch',
    'Support (Launch)',
    'Support Plans',
    'Support',
    'launch',
    (v) =>
      normalizeValue(v)
        ?.toLowerCase()
        .replace(/\s*support/, '')
        .replace(/\s*only/, ''),
  ],
  [
    'team-members-free',
    'Team members (Free)',
    'Team members',
    'Organization members',
    'free',
    (v) => normalizeValue(v)?.toLowerCase(),
  ],
  [
    'extra-branches-launch',
    'Extra branches (Launch)',
    'Additional branches',
    'Extra branches',
    'launch',
    extractBranchRate,
  ],
  [
    'extra-branches-scale',
    'Extra branches (Scale)',
    'Additional branches',
    'Extra branches',
    'scale',
    extractBranchRate,
  ],
  [
    'scale-to-zero-free',
    'Scale to zero (Free)',
    'Scale to zero',
    'Scale to zero',
    'free',
    extractCore(/after (\d+)\s*min/i, 'After $1 min'),
  ],
  [
    'scale-to-zero-launch',
    'Scale to zero (Launch)',
    'Scale to zero',
    'Scale to zero',
    'launch',
    extractCore(/after (\d+)\s*min/i, 'After $1 min'),
  ],
  [
    'scale-to-zero-scale',
    'Scale to zero (Scale)',
    'Scale to zero',
    'Scale to zero',
    'scale',
    (v) =>
      normalizeValue(v)
        ?.toLowerCase()
        .replace(/\s*\([^)]*\)/, ''),
  ],
  [
    'metrics-export-scale',
    'Metrics/logs export (Scale)',
    'Metrics and Logs export',
    'Metrics/logs export',
    'scale',
    (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('included') || v === 'Yes'
          ? 'yes'
          : 'no'
        : 'no',
  ],
  [
    'ip-allow-scale',
    'IP Allow (Scale)',
    'IP Allow Rules',
    'Compliance and security',
    'scale',
    (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('ip allow') || v === 'Yes'
          ? 'yes'
          : 'no'
        : 'no',
  ],
  [
    'private-networking-scale',
    'Private Networking (Scale)',
    'Private Networking',
    'Compliance and security',
    'scale',
    (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('private networking') || v === 'Yes'
          ? 'yes'
          : 'no'
        : 'no',
  ],
  [
    'hipaa-scale',
    'HIPAA (Scale)',
    'HIPAA Compliance',
    'Compliance and security',
    'scale',
    (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('hipaa') || String(v).toLowerCase().includes('available')
          ? 'yes'
          : 'no'
        : 'no',
  ],
  [
    'soc2-scale',
    'SOC 2 (Scale)',
    'SOC 2 Report Access',
    'Compliance and security',
    'scale',
    (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('soc') || String(v).toLowerCase().includes('available')
          ? 'yes'
          : 'no'
        : 'no',
  ],
  [
    'uptime-sla-scale',
    'Uptime SLA (Scale)',
    '__hero:sla',
    'Uptime SLA',
    'scale',
    (v) =>
      v && v !== '--'
        ? String(v).toLowerCase().includes('sla') || v === 'Yes'
          ? 'yes'
          : 'no'
        : 'no',
  ],
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

// Docs rows that are informational and don't map to a component table row
const DOCS_INFO_ONLY_ROWS = new Set(['Price', 'Who its for', "Who it's for"]);

function runChecks(componentData, docsTable) {
  const results = [];
  const coveredComponentKeys = new Set();
  const coveredDocsKeys = new Set();

  for (const [id, label, compKey, docsKey, plan, norm] of CROSS_SOURCE_CHECKS) {
    coveredComponentKeys.add(compKey);
    coveredDocsKeys.add(docsKey);

    let rawComp;
    if (compKey.startsWith('__hero:')) {
      const keyword = compKey.replace('__hero:', '');
      const hasIt = componentData.heroPlans[plan]?.featureTitles?.some((t) =>
        t.toLowerCase().includes(keyword)
      );
      rawComp = hasIt ? 'Yes' : '--';
    } else {
      rawComp = componentData.tableRows[compKey]?.[plan];
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
    (k) => !coveredDocsKeys.has(k) && !DOCS_INFO_ONLY_ROWS.has(k)
  );

  return { results, uncoveredComponent, uncoveredDocs };
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
