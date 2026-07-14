import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load .env file if present
try {
  const envPath = resolve(new URL('..', import.meta.url).pathname, '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
} catch {
  // No .env file
}

import { loadGuides, parseArgs } from './config.js';
import { startContainer, removeContainer, buildUniversalImage, captureFileSnapshots } from './docker.js';
import { createDatabase } from './neon.js';
import { runWorker } from './worker.js';
import { evaluate } from './evaluator.js';
import { printResults, saveResults, type GuideResult } from './reporter.js';

async function fetchDocs(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch docs from ${url}: ${response.status}`);
  }
  return response.text();
}

function loadLocalDocs(localDir: string, guideName: string): string {
  const candidates = [
    resolve(localDir, `${guideName}.md`),
    resolve(localDir, guideName, 'index.md'),
  ];

  for (const path of candidates) {
    if (existsSync(path)) {
      console.log(`  Loading local file: ${path}`);
      return readFileSync(path, 'utf-8');
    }
  }

  throw new Error(
    `Local docs not found for "${guideName}". Tried:\n` +
    candidates.map(c => `  ${c}`).join('\n'),
  );
}

function errorResult(guide: string, model: string, localDir: string | null, err: unknown): GuideResult {
  const errMsg = err instanceof Error ? err.message : String(err);
  const failDim = { pass: false, note: 'Error during evaluation' };
  return {
    guide, model,
    evaluation: {
      deterministicChecks: { has_source_files: false, env_file_exists: false, no_hardcoded_creds: false, agent_verified_connection: false },
      llmEval: { overall_score: 0, dimensions: { correct_packages: failDim, best_practices: failDim, stayed_in_scope: failDim, no_backtracking: failDim }, user_interventions: 0, failures: [`Harness error: ${errMsg}`], reasoning: `Evaluation failed: ${errMsg}` },
    },
    worker: { turnCount: 0, toolCallCount: 0, durationMs: 0 },
    transcript: [], fileSnapshots: [],
    timestamp: new Date().toISOString(),
    source: localDir ? 'local' : 'remote',
  };
}

async function main() {
  const args = parseArgs();
  const config = loadGuides(args.configPath);

  const guideNames = args.guides.length > 0
    ? args.guides
    : Object.keys(config.guides);

  // For --local mode, guides don't need to be in the config.
  // Any name that matches a .md file in the local dir is valid.
  if (!args.localDir) {
    for (const name of guideNames) {
      if (!config.guides[name]) {
        console.error(`Unknown guide: ${name}. Available: ${Object.keys(config.guides).join(', ')}`);
        console.error('Tip: use --local /path/to/guides/ to test local files without adding them to config.');
        process.exit(1);
      }
    }
  }

  console.log(`Running eval for: ${guideNames.join(', ')}`);
  console.log(`Worker model: ${args.model}`);
  console.log(`Eval model: ${args.evalModel}`);
  console.log(`Timeout: ${args.timeout}min per guide`);
  if (args.localDir) {
    console.log(`Source: LOCAL (${args.localDir})`);
  } else {
    console.log(`Source: REMOTE (neon.com)`);
  }
  console.log('');

  // Build universal Docker image if needed
  await buildUniversalImage();
  console.log('');

  const results: GuideResult[] = [];

  for (const guideName of guideNames) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`EVALUATING: ${guideName}`);
    console.log(`${'='.repeat(60)}`);

    let container;
    try {
      // 1. Create ephemeral Neon database
      console.log('  Creating ephemeral Neon database...');
      const db = await createDatabase();
      console.log(`  Database created (expires: ${db.expiresAt})`);

      // 2. Get the docs content
      let docsMarkdown: string;
      if (args.localDir) {
        docsMarkdown = loadLocalDocs(args.localDir, guideName);
      } else {
        const guide = config.guides[guideName];
        const docUrl = guide?.doc_url || `https://neon.com/docs/guides/${guideName}.md`;
        console.log(`  Fetching docs from ${docUrl}...`);
        docsMarkdown = await fetchDocs(docUrl);
      }
      console.log(`  Docs: ${docsMarkdown.length} chars`);

      // 3. Start Docker container (universal image)
      const containerName = `neon-eval-${guideName}-${Date.now()}`;
      console.log(`  Starting container ${containerName}...`);
      container = await startContainer(containerName, {
        DATABASE_URL: db.connectionString,
        DIRECT_URL: db.directConnectionString,
      });
      console.log(`  Container started: ${container.id.slice(0, 12)}`);

      // 4. Run the worker agent
      console.log(`  Running worker agent (model: ${args.model}, timeout: ${args.timeout}min)...`);
      const workerResult = await runWorker(guideName, docsMarkdown, container, args.model, args.timeout);
      console.log(`  Worker complete: ${workerResult.turnCount} turns, ${workerResult.toolCallCount} tool calls, ${Math.round(workerResult.durationMs / 1000)}s`);

      // 5. Capture file snapshots
      console.log('  Capturing file snapshots...');
      const fileSnapshots = await captureFileSnapshots(container);
      console.log(`  Captured ${fileSnapshots.length} files`);

      // 6. Evaluate
      console.log('  Evaluating...');
      const evaluation = await evaluate(container, db.connectionString, workerResult.transcript, docsMarkdown, args.evalModel);

      results.push({
        guide: guideName,
        model: args.model,
        evaluation,
        worker: {
          turnCount: workerResult.turnCount,
          toolCallCount: workerResult.toolCallCount,
          durationMs: workerResult.durationMs,
        },
        transcript: workerResult.transcript,
        fileSnapshots,
        timestamp: new Date().toISOString(),
        source: args.localDir ? 'local' : 'remote',
      });

      console.log(`  Score: ${evaluation.llmEval.overall_score}/10`);
    } catch (err) {
      console.error(`  ERROR evaluating ${guideName}:`, err);
      results.push(errorResult(guideName, args.model, args.localDir, err));
    } finally {
      if (container) {
        console.log('  Removing container...');
        await removeContainer(container);
      }
    }
  }

  printResults(results);
  saveResults(results);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
